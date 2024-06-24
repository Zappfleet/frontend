import { Grid, LoadingOverlay } from "@mantine/core";
import { useContext, useEffect, useRef, useState } from "react";
import { Marker } from "react-leaflet";
import httpService from "../../../../services/httpService";
import { reverseGeocoding } from "../../../../utils/locationTools";
import { HeightContext } from "../../panel";
import CreateLocationForm from "./createLocationForm";
import CreateLocationMap from "./createLocationMap";
import settings from "../../../../config";
import { useNavigate } from "react-router-dom";
import { ErrorToast, SucccessToast } from "../../../../components/common/errorToast";
import { catchError } from "../../../../utils/errorHelper";
import SearchBox from "../../../../components/common/filter&search/searchBox";
import { locationSearch } from "../../../../services/externalApiService";
import { searchSystemLocations } from "../../../../services/locationService";

const LocationMarker = ({ marker }) => {
  if (marker.length > 0) return <Marker position={marker} />;
  else return null;
};
const DROP_DOWN_LIMIT = 6;

const CreateLocation = () => {
  const mapRef=useRef()
  const cityRef=useRef()
  let navigate = useNavigate();
  const [marker, setMarker] = useState([]);
  const [loading, setLoading] = useState(false);
  const [street, setStreet] = useState();
  const [locationsResult, setLocationsResult] = useState([]);
  const [map, setMap] = useState();

  const height = useContext(HeightContext);

  const handleRegisterLocation = async (data) => {
 
    try {
      setLoading(true);
      await httpService.post(settings.apiUrl + "/location", {
        ...data,
        lnglat: [marker[1],marker[0]],
        street,
      });
      SucccessToast({ message: "مکان با موفقیت افزوده شد" });
      navigate("/panel/location/list", { replace: true });
      setLoading(false);
    } catch (error) {
      setLoading(false);

      catchError(error);
    }
  };

  const handleMapClick = (e) => {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    setMarker([lat, lng]);
  };

  useEffect(async () => {
    if (marker.length > 0) {
      setLoading(true);
      const data = await reverseGeocoding(marker[0], marker[1]);
      setStreet(data.addresses[0].formatted);
      setLoading(false);
    }
  }, [marker]);
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

  return (
    <div className="container-fluid" style={{ height }}>
      <LoadingOverlay visible={loading} />
      <div className="row h-100">
        <div className="h-100 d-flex flex-column">
          <Grid className="row mb-2">
          <Grid.Col span={3}>
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
           
            </Grid.Col>
          </Grid>

          <div className="row flex-grow-1">
            <div className="col-lg">
              <CreateLocationMap onMapClick={handleMapClick} mapRef={mapRef} onCityChanged={onCityChanged} setMap={setMap} map={map}>
                <LocationMarker marker={marker} />
              </CreateLocationMap>
            </div>
            <div className="col-lg">
              <CreateLocationForm onRegister={handleRegisterLocation} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreateLocation;
