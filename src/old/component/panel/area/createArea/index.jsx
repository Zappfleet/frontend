import { CreateAreaMap } from "./createAreaMap";
import { Grid, Group, LoadingOverlay } from "@mantine/core";
import { useContext, useEffect, useRef, useState } from "react";
import { Marker, Polyline } from "react-leaflet";
import { uuid } from "uuidv4";
import { BackButton, ResetButton } from "../../../../components/area/buttons";
import settings from "../../../../config";
import { HeightContext } from "../../panel";
import useSWR from "swr";
import httpService from "../../../../services/httpService";
import { useNavigate } from "react-router-dom";
import {
	ErrorToast,
	SucccessToast,
} from "../../../../components/common/errorToast";
import { catchError } from "../../../../utils/errorHelper";

import CreateAreaForm from "./createAreaForm";
import AreaPolygon from "../../../../components/area/areaPolygon";
import SearchBox from "../../../../components/common/filter&search/searchBox";
import { searchSystemLocations } from "../../../../services/locationService";
import { locationSearch } from "../../../../services/externalApiService";

const initialMarkers = (markers) => {
	if (markers) {
		const newMarker = [...markers];
		newMarker.pop();
		return newMarker;
	}
	return [];
};
const DROP_DOWN_LIMIT = 6;
const CreateArea = ({ item ,updateList}) => {
	const mapRef=useRef()
	const cityRef=useRef()
	const [map, setMap] = useState();
	const [markers, setMarkers] = useState(
		initialMarkers(item?.location?.coordinates?.[0]),
	);
	let navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [dispatchers, setDispatchers] = useState([]);
	const [locationsResult, setLocationsResult] = useState([]);
	const height = useContext(HeightContext);

	const { data: dispatcherLiset } = useSWR(
		settings.apiUrl + "/user/available-disaptchers",
		httpService.get,
		{ revalidateOnFocus: false },
	);

	useEffect(() => {
		if (dispatcherLiset?.data) {
			setDispatchers(
				dispatcherLiset?.data?.docs?.map((dispatcher) => ({
					label: dispatcher.full_name,
					value: dispatcher._id,
				})),
			);
		}
	}, [dispatcherLiset?.data]);

	const handleRegisterArea = async (data) => {
		const { name, dispatcher_id, need_manager_approve } = data;

	
		const id = item?.id;
		const body = {
			location: { type: "Polygon", coordinates: [[...markers, markers[0]]] },
			name,
			dispatcher_id,
			need_manager_approve,
		};
		
		const createArea =()=> httpService.post(`${settings.apiUrl}/area`, body);
		const editArea =()=> httpService.put(`${settings.apiUrl}/area/${id}`, body);
		const chooseApi = item?.id ? editArea : createArea;
		if (markers.length < 3) {
			return ErrorToast({ message: "لطفا حداقل 3 نقطه را انتخاب کنید." });
		}
		try {
			setLoading(true);
			await chooseApi();
			if(id){
				updateList()
			   } else navigate("/panel/area/list", { replace: true });
			setLoading(false);
			SucccessToast({
				message: item?.id
					? "محدوده با موفقیت ویرایش شد"
					: "محدوده با موفقیت ثبت شد",
			});
		} catch (error) {
			setLoading(false);
			catchError(error);
		}
	};

	const handleMapClick = (e) => {
		const lat = e.latlng.lat;
		const lng = e.latlng.lng;
		setMarkers((prevMarkers) => [...prevMarkers, [lat, lng]]);
	};
	const onCityChanged=(city)=>{
		cityRef.current=city
	  }
	
	  const handle_searchLocation = async ({ query }) => {
	  
		try {
		  if (!query?.trim() ||cityRef.current==null) return;
		  const resMapSearch = await locationSearch(query,cityRef.current);
		  const resSystemSearch = await searchSystemLocations(query);
		  resSystemSearch.data.docs = resSystemSearch.data.docs.map((item) => {
			return {
			  address: item.name,
			  country: "",
			  city: "",
			  neighborhood: item.name,
			  province: "",
			  region: "",
			  geom: {
				coordinates: item.lnglat.coordinates,
			  },
			};
		  });
		  const result = [
			...resSystemSearch.data.docs,
			...(resMapSearch?.data?.value || []),
		  ];
		  setLocationsResult(result);
		} catch (e) {
		  e?.response?.status != 404 && ErrorToast({ message: e.message });
		}
	  };
	  const handle_LocationSearchSelect = (item) => {
		return () => {
		  mapRef.current.panTo(item.geom.coordinates.reverse())
		  mapRef.current.setZoom(18)
		  setLocationsResult([]);
		};
	  };

	const MapMenu = (
		<Grid className="row mb-2">
			<Grid.Col span={6}>
				
				<Group position="right">
				<div className="position-relative dropdown-search">
              <SearchBox placeholder="جستجوی نقشه" onSearch={handle_searchLocation} />
              <div style={{zIndex:10000}} className="position-absolute w-100 dropdown-list">
                    {locationsResult.length > 0 && (
                      <ul className="d-block bg-white shadow-sm m-1 list-group">
                        {locationsResult.map((item, index) => {
                          if (index > DROP_DOWN_LIMIT) return;
                          return (
                            <li
                              key={index}
                              onClick={handle_LocationSearchSelect(item)}
                              onKeyDown={(e) =>
                                e.key === "Enter" &&
                                handle_LocationSearchSelect(item)
                              }
                              tabIndex={0}
                              className="list-group-item outline-none btn-outline-primary text-right "
                            >
                              {`${item.address}`}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
              </div>
					<ResetButton label="حذف محدوده" onClick={() => setMarkers([])} />

					<BackButton
						label="حذف آخرین نشانگر"
						onClick={() =>
							setMarkers((prevMarkers) => {
								const newMarkers = [...prevMarkers];
								newMarkers.pop();
								return newMarkers;
							})
						}
					/>
				</Group>
			</Grid.Col>

		</Grid>
	);

	return (
		<div className="container-fluid" style={{ height }}>
			<LoadingOverlay visible={loading} />
			<div className="row h-100">
				<div className="h-100 d-flex flex-column">
					{MapMenu}
					<div className="row flex-grow-1">
						<div className="col-lg">
							<CreateAreaMap mapRef={mapRef} onCityChanged={onCityChanged} setMap={setMap} map={map} handleMapClick={handleMapClick}>
								<AreaPolygon markers={markers} />
							</CreateAreaMap>
						</div>
						<div className="col-lg">
							<CreateAreaForm
								dispatchers={dispatchers}
								onRegister={handleRegisterArea}
								item={item}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default CreateArea;
