import { RegisterTripMap } from "./registerTripMap";
import {
  Box,
  Grid,
  Group,
  Input,
  LoadingOverlay,
  ScrollArea,
  Text,
  Divider,
} from "@mantine/core";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Marker, Polyline } from "react-leaflet";
import * as ReactDOMServer from "react-dom/server";
import L from "leaflet";
import { uuid } from "uuidv4";
import { BackButton, ResetButton } from "../../../../components/area/buttons";
import settings from "../../../../config";
import { HeightContext } from "../../panel";
import useSWR from "swr";
import httpService from "../../../../services/httpService";
import {
  ErrorToast,
  SucccessToast,
} from "../../../../components/common/errorToast";
import { catchError } from "../../../../utils/errorHelper";
import RegisterRequestForm from "./registerTripForm";
import SearchBox from "../../../../components/common/filter&search/searchBox";
import {
  locationGeoCoding,
  locationSearch,
} from "../../../../services/externalApiService";
import { startIcon } from "../../../../components/request/requestDetailsBox";
import { colorsArr } from "../../../../utils/colorHelper";
import StartIcon from "../../../../assets/imgs/startIcon";
import VisibleStartIcon from "../../../../assets/imgs/visibleStartIcon";
import FinishIcon from "../../../../assets/imgs/finishIcon";
import DatePicker from "@amir04lm26/react-modern-calendar-date-picker";
import { searchSystemLocations } from "../../../../services/locationService";
import RestHeightContent from "../../../../components/hoc/restHeightContent";
import { useElementSize } from "@mantine/hooks";

const DROP_DOWN_LIMIT = 6;
const MARKER_START = "location_start";
const MARKER_FINISH = "location_finish";

const standardLocation = (loc) => {
  if (!loc) return undefined;
  return {
    province: "",
    city: "",
    neighborhood: loc.adr,
    geom: {
      coordinates: loc.lnglat,
    },
  };
};

export const iconStart = L.divIcon({
  iconSize: [70, 70],
  html: ReactDOMServer.renderToString(<StartIcon fill="#583487" />),
});
export const iconFinish = L.divIcon({
  iconSize: [70, 70],
  html: ReactDOMServer.renderToString(<FinishIcon fill="#583487" />),
});

function LocationMarker({ location, onDrag, icon }) {
  const markerRef = useRef(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          onDrag(marker.getLatLng());
        }
      },
    }),
    []
  );

  return (
    <Marker
      ref={markerRef}
      draggable={true}
      icon={icon}
      eventHandlers={eventHandlers}
      position={[location.geom.coordinates[1], location.geom.coordinates[0]]}
    ></Marker>
  );
}

function renderMarkers({ location_start, location_finish, onDrag }) {
  const markers = [];

  if (location_start) {
    markers.push(
      <LocationMarker
        key={0}
        icon={iconStart}
        location={location_start}
        onDrag={onDrag(MARKER_START)}
      />
    );
  }
  if (location_finish) {
    markers.push(
      <LocationMarker
        key={1}
        icon={iconFinish}
        location={location_finish}
        onDrag={onDrag(MARKER_FINISH)}
      />
    );
  }

  return markers;
}

export default function RegisterRequestByDispatcher({
  defaultTrip,
  mutateSignal,
}) {
  const { ref: fixRef, width, height: fixHeight } = useElementSize();

  const [map, setMap] = useState();

  const [loading, setLoading] = useState(false);
  const [cars, setCars] = useState();
  const [driver, setDriver] = useState(null);
  const [locationsResult, setLocationsResult] = useState([]);
  const mapRef=useRef()
  const cityRef=useRef()
  const initialLocationStart = standardLocation(
    defaultTrip?.locations?.[0]?.start
  );
  const initialLocationFinish = standardLocation(
    defaultTrip?.locations?.[0]?.finish
  );

  const [selectedCoordinates, setSelectedCoordinates] = useState({
    location_start: initialLocationStart,
    location_finish: initialLocationFinish,
    // zoomMap : true
  });
  const onCityChanged=(city)=>{
    cityRef.current=city
  }

  const form = useRef({
    location_start: initialLocationStart,
    location_finish: initialLocationFinish,
    // passenger: {},
    // mates: [],
    // guests: [],
    driver: {},
    for_date: "",
    for_time: "",
    // repeat_dates: []
  });

  const height = useContext(HeightContext);

  useEffect(() => {
    const markerBounds = [];
    if (selectedCoordinates?.location_start) {
      markerBounds.push(
        [...selectedCoordinates.location_start.geom.coordinates].reverse()
      );
    }
    if (selectedCoordinates?.location_finish) {
      markerBounds.push(
        [...selectedCoordinates.location_finish.geom.coordinates].reverse()
      );
    }
    if (markerBounds.length == 0 || !selectedCoordinates.zoomMap) return;
    map?.fitBounds(markerBounds, { duration: 1 });
  }, [selectedCoordinates, map]);

  const updateSelectedCoordinates = (current, zoomMap) => {
    setSelectedCoordinates({ ...current, zoomMap });
  };

  const handleMapClick = (e) => {
    const keyToUpdate =
      form.current.location_start == null ? MARKER_START : MARKER_FINISH;
    pushLocation(
      {
        geom: {
          coordinates: [e.latlng.lng, e.latlng.lat],
        },
      },
      true
    );
    locationGeoCoding(e.latlng.lat, e.latlng.lng)
      .then((res) => {
        const data = res.data;
        const current = form.current;
        current[keyToUpdate] = {
          ...current[keyToUpdate],
          province: data.province,
          city: data.city,
          neighborhood: data.neighbourhood,
        };
        updateSelectedCoordinates(current, false);
      })
      .catch((e) => {
        ErrorToast("خطا در دریافت جزئیات مکان انتخاب شده");
      });
  };

  const pushLocation = (item, ignoreZoom) => {
    if (form.current.location_start == null) {
      form.current.location_start = item;
    } else {
      form.current.location_finish = item;
    }
    updateSelectedCoordinates(form.current, !ignoreZoom);
  };

  const popLocation = () => {
    if (form.current.location_finish != null) {
      form.current.location_finish = null;
    } else {
      form.current.location_start = null;
    }
    updateSelectedCoordinates(form.current);
  };

  const handle_LocationSearchSelect = (item) => {
    return () => {
      pushLocation(item);
      setLocationsResult([]);
    };
  };

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

  const handle_markerDrag = (markerKey) => {
    return (newLocation) => {
      form.current[markerKey].geom.coordinates = [
        newLocation.lng,
        newLocation.lat,
      ];
      updateSelectedCoordinates(form.current);
    };
  };
  const { data: carList, mutate: muteCars } = useSWR(
    [settings.apiUrl + "/car", {}],
    httpService.get,
    {
      revalidateOnFocus: false,
    }
  );
  useEffect(() => {
    const newCars = carList?.data?.docs.map((car) => {
      return {
        value: car?._id,
        label: car?.driver?.user?.full_name,
        ...car,
      };
    });
    setCars(newCars);
  }, [carList?.data]);

  return (
    <div className="container-fluid" style={{ height }}>
      <LoadingOverlay visible={loading} />
      <div class="h-100 d-flex flex-column">
        <div className="row" ref={fixRef}>
          <Grid className="row mb-2">
            <Grid.Col span={6}>
              <Group position="right">
                <div className="position-relative dropdown-search">
                  <div className="d-inline-flex justify-content-between w-100">
                    <SearchBox
                      onSearch={handle_searchLocation}
                      placeholder="جستجوی نقشه"
                    />
                    <BackButton
                      label="بازگشت"
                      onClick={popLocation}
                      className="mx-3"
                    />
                  </div>
                  <div className="position-absolute w-100 dropdown-list">
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
              </Group>
            </Grid.Col>
            <Grid.Col span={6}></Grid.Col>
          </Grid>
        </div>
        <RestHeightContent>
          <div className="col-lg h-100">
            <RegisterTripMap setMap={setMap} map={map} handleMapClick={handleMapClick} onCityChanged={onCityChanged} mapRef={mapRef}>
              {renderMarkers({
                ...selectedCoordinates,
                onDrag: handle_markerDrag,
              })}
            </RegisterTripMap>
          </div>
          <div className="col-lg">
            <div className="row">
              <div
                className="col-lg-4"
                style={{
                  maxHeight: height - fixHeight,
                }}
              >
                <Box
                  className="shadow-sm"
                  sx={(theme) => ({
                    border: `2px solid ${theme.colors.violet[1]}`,
                    textAlign: "center",
                    padding: theme.spacing.xs,
                    marginBottom: theme.spacing.md,
                    borderRadius: theme.radius.md,
                    transition: "0.2s",
                    maxHeight: "100%",
                    height: height - fixHeight,
                  })}
                >
                  <Text>رانندگان</Text>
                  <Divider my="sm" />
                  <ScrollArea
                    style={{
                      height: "90%",
                    }}
                  >
                    {cars?.map((c) => (
                      <Grid
                        className="m-0"
                        sName=""
                        sx={(theme) => ({
                          transition: "0.2s",
                          "&:hover": {
                            backgroundColor: theme.colors.gray[1],
                          },
                        })}
                        onClick={() => setDriver(c)}
                      >
                        <Grid.Col span={6}>
                          <Text align="left" className="mb-2 clickable">
                            {c?.label}
                          </Text>
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <Text align="right" className="mb-2">
                            {c?.status ? "در مسیر" : "آزاد"}
                          </Text>
                        </Grid.Col>
                      </Grid>
                    ))}
                  </ScrollArea>
                </Box>
              </div>
              <div className="col-lg-8">
                <RegisterRequestForm
                  clearMap={() => {
                    setSelectedCoordinates({
                      location_start: initialLocationStart,
                      location_finish: initialLocationFinish,
                    });
                    setDriver(null);
                    form.current={}
                  }}
                  defaultTrip={defaultTrip}
                  selectedCoordinates={selectedCoordinates}
                  driverCar={driver}
                  mutateSignal={mutateSignal}
                />
              </div>
            </div>
          </div>
        </RestHeightContent>
      </div>
    </div>
  );
}
