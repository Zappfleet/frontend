import { useEffect, useRef, useState } from 'react';
import './style.scss'
import MapContainer, { MapRefType } from '../../../widgets/map/MapContainer';
import LoaderButton from '../../../components/LoaderButton';

import MarkerRed from '../../../images/map/marker-red.png';
import BottomSheetModal from '../../../components/BottomSheetModal';

import { RiArrowUpDoubleFill } from 'react-icons/ri';
import TripMissionDetails from '../TripMissionDetails/TripMissionDetails';
import LocationSearch from '../../../widgets/LocationSearch/LocationSearch';
import { BsCarFront, BsPin, BsX } from 'react-icons/bs';
import { SmallLoader } from '../../../common/Loader';
import classNames from 'classnames';
import useNeshanApi from '../../../hooks/data/useNeshanApi';
import { MAP_COLOR_PRIMARY, MODE_PASSENGER, NONE_KEY } from '../../../lib/constants';
import { BiCheck, BiCheckCircle } from 'react-icons/bi';
import useAuthentication from '../../../hooks/data/useAuthentication';
import { ModularInput } from '../../../components/ModularInput';
import { readFormInputs } from '../../../lib/form';
import useVehicleBasicData from '../../../hooks/data/useVehicleBasicData';
import { STATUS_ON_ROUTE, requestStatus, serviceUnits } from '../../../lib/string';
import { getApiClient } from '../../../apis/client';
import { NotificationController } from '../../../lib/notificationController';
import useMissionDetails from '../../../hooks/data/useMissionDetails';
import useMissions from '../../../hooks/data/useMissions';
import useRequests from '../../../hooks/data/useRequests';
import getCurrentLocations from '../../../hooks/useCurrentLocations/getCurrentLocations';
import carIcon from '../../../images/map/carIcon.png';
import axios from 'axios';
import { NeshanServiceKey } from '../../../apis/neshan';

const PassengerMissionDetails = (props: any) => {

  
   
    const [showDetails, setShowDetails] = useState<any>(false)
    const { searchState, reverseGeocoding } = useNeshanApi();
    const mapRef = useRef<MapRefType>(null);
    const { missions }: any = useMissions({ mode: MODE_PASSENGER, paging: false });
    const [refreshPage, setRefreshPage] = useState<any>(false)


    //console.log(75,mapRef);
    const [permitForRunUseFleetGps, setPermitForRunUseFleetGps] = useState<any>(false)
    const [vehicleIDs, setVehicleIDs] = useState<any>(null)
    const [mode, setMode] = useState<any>(null)
     const useFleetGpsResult = getCurrentLocations(permitForRunUseFleetGps, vehicleIDs, mapRef, carIcon, 0.015);




    useEffect(() => {
        if (missions && missions.data?.length > 0 && mapRef.current) {
            try {

                //show current location
                setMode('driver')
                setVehicleIDs([missions.data[0]?.vehicleID])
                setPermitForRunUseFleetGps(true)

                let coordinatesForRouting: any = []
     
                missions.data[0].locations?.forEach((location: any) => {
                    coordinatesForRouting.push([location.coordinates[1], location.coordinates[0]])
                    mapRef.current?.addMarker(
                        location.coordinates[1],
                        location.coordinates[0],
                        true,
                        MarkerRed,
                        0.1
                    );
                })

                createRoutingOnMap(coordinatesForRouting)
                // Trigger a re-render after markers are added
                //  setRefreshPage((prev: any) => !prev);
            } catch (error) {
                console.error('Error adding markers:', error);
                // Handle the error as needed
            }
        }
    }, [missions]);

    useEffect(() => {

    }, [refreshPage])

    function decodePolyline(polyline:any) {
        let index = 0;
        const len = polyline.length;
        let lat = 0;
        let lng = 0;
        const coordinates = [];
    
        while (index < len) {
            let shift = 0;
            let result = 0;
            let byte;
    
            do {
                byte = polyline.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);
    
            const deltaLat = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lat += deltaLat;
    
            shift = 0;
            result = 0;
    
            do {
                byte = polyline.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);
    
            const deltaLng = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lng += deltaLng;
    
            coordinates.push([lat * 1e-5, lng * 1e-5]);
        }
    
        return coordinates;
    }

    const extractRouteCoordinates = (data: any, origin: any): [number, number][] | null => {
        try {
            // بررسی و استخراج مختصات از پاسخ API
            const routes = data.routes;
            console.log(400, routes);

            // let coordinates: any = []
            let coordinates: any = []
            
            //  coordinates.push(origin)
            if (routes && routes.length > 0) {
                routes[0].legs?.map((leg: any, index: any) => {
                    leg.steps?.map((step: any, index: any) => {
                        const decodedCoordinates = decodePolyline(step.polyline);
                        decodedCoordinates.map((item:any)=>{
                            coordinates.push([item[1],item[0]])
                        })
                        console.log(6000,decodedCoordinates);
                        
                     //   coordinates.push([step.start_location[0], step.start_location[1]])
                    })

                    //  index%2===0? mapRef.current?.addRoute(coordinates, true, "255, 0, 0"):

                })

                //  console.log(777,coordinates.length);

               // coordinates.push(coordinates[coordinates.length - 2])
               // coordinates.push(origin)

               console.log(4589,coordinates);
               
                mapRef.current?.addRoute(coordinates, true, "0, 0, 255")
                //   const steps = routes[0].legs.map([0].steps;
                // const coordinates = steps.map((step: any) => step.start_location);
                //  return coordinates;
            }
        } catch (error) {
            console.error('Error extracting route coordinates:', error);
        }
        return null;
    };
    const[coordsForgoogleMap,setCoordsForgoogleMap]=useState<any>([])
    const createRoutingOnMap = async (coordinates: any) => {

        setCoordsForgoogleMap(coordinates)

        console.log(52, coordinates);

        let origin: any
        let destination: any
        let waypoints: any = ''
        const mapLength = coordinates?.length


        coordinates.map((item: any, index: any) => {
            index === 0 ? origin = `${item[1]},${item[0]}` :
                index === mapLength - 1 ? destination = `${item[1]},${item[0]}` :
                    mapLength > 2 && index === 1 ? waypoints += `${item[1]},${item[0]}` :
                        waypoints += `%7C${item[1]},${item[0]}`
        })


        console.log(122, mapLength, origin, destination, waypoints);



        // ساخت آدرس کامل برای درخواست API
        const apiGetRoutingUrl =
        //'https://api.neshan.org/v4/direction?type=car&origin=29.87781386196582,52.80807554886337&destination=29.885447453232032,52.81699611135298&waypoints=29.881032493977102,52.818784660836286%7C29.881886980601294,52.81237890367538&avoidTrafficZone=false&avoidOddEvenZone=false&alternative=false&bearing='
         `https://api.neshan.org/v4/direction?type=car&origin=${origin}&destination=${destination}&waypoints=${waypoints}&avoidTrafficZone=false&avoidOddEvenZone=false&alternative=false&bearing`;
        console.log(66, apiGetRoutingUrl);
        await axios.get(apiGetRoutingUrl, {
            headers: {
                'Api-Key': NeshanServiceKey,
            }
        })
            .then(response => {
                console.log('API response:', response);

                // استخراج مختصات مسیر از پاسخ API
                const routeCoordinates: any = extractRouteCoordinates(response.data, coordinates[mapLength - 1]);
                console.log(253, routeCoordinates);

                mapRef?.current?.addRoute(routeCoordinates, true, "255, 0, 0");
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }




    const { data: vehicleData }: any = useVehicleBasicData({ include_inactive: false });
    const { authInfo } = useAuthentication();
    const bottomSheet = useRef<any>();
    const [formState, setFormState] = useState<any>(props.initialValues || {});
    const [userInput, setUserInput] = useState<any>({
        locations: []
    });

    const mapLayers = useRef<any>({
        polyline: null,
    });

    const [uiState, setUiState] = useState<any>({
        readyForSubmit: false,
    })



    useEffect(() => {
        // updateInbetweenLines(userInput.locations);
    }, [userInput])

    // useEffect(() => {
    //     if (props.initialLocations == null) return;
    //     const locations = props.initialLocations.map(({ address, lat, lng }: any) => {
    //         return {
    //             address,
    //             lat,
    //             lng,
    //             marker: mapRef.current?.addMarker(lng, lat, true),
    //         }
    //     })
    //     setUserInput({ ...userInput, locations })
    //     setUiState({
    //         ...uiState,
    //         readyForSubmit: locations.length > 1
    //     })
    // }, [])


    const updateInbetweenLines = (newLocations: any) => {
        if (searchState.inProgress || mapRef.current == null) return;

        if (mapLayers.current.polyline != null) {
            mapRef.current.remove(mapLayers.current.polyline.polyline)
            mapLayers.current.polyline = null;
        }
        if ((newLocations || userInput.locations).length > 1) {
            const addPolylineResult = mapRef.current.addPolyline((newLocations || userInput.locations).map((m: any) => {
                return [m.lng, m.lat]
            }), true, MAP_COLOR_PRIMARY);
            if (addPolylineResult == null) return;

            mapLayers.current.polyline = addPolylineResult;
        }

        setUiState({
            ...uiState,
            readyForSubmit: newLocations.length > 1
        })

    }


    const handle_deleteLocation = (index: number) => {

        const itemToRemove = userInput.locations[index];
        mapRef.current?.remove(itemToRemove.marker);

        userInput.locations.splice(index, 1)
        const newLocations = [...userInput.locations];
        setUserInput({
            ...userInput, locations: newLocations
        })
    }

    const onBottomSheetCreate = (ui: any) => {
        bottomSheet.current = ui;
    }

    const handle_showBottomSheet = () => {
        bottomSheet.current.show();
    }
    const handle_hideBottomSheet = () => {
        bottomSheet.current.hide();
    }

    const clearMapMarkers = () => {
        userInput.locations.map(({ marker }: any) => {
            mapRef.current?.remove(marker);
        })
        setUserInput({
            ...userInput, locations: []
        })
        updateInbetweenLines([])
    }

    const handle_submitRequest = (e: any) => {
        e.preventDefault();

        const body: any = {}

        const { service, datetime, ...rest } = formState;

        if (datetime != null) {
            body.gmt_for_date = datetime.map((v: any) => {
                if (typeof v === 'string' || v instanceof String) return v;
                return v.toDate().toISOString();
            })
        }
        body.details = rest;
        body.service = service;
        body.locations = userInput.locations.map((loc: any) => {
            const { lng, lat, ...rest } = loc;
            delete rest.marker;
            return {
                coordinates: [lat, lng],
                wait: 0,
                meta: rest
            }
        });

        // submitRequest
        // updateRequest
        const method = formState._id == null ? "submitRequest" : "updateRequest";
        getApiClient()[method](body, formState._id).then(({ data }) => {
            NotificationController.showSuccess("اطلاعات با موفقیت ذخیره شد");
            setFormState({});
            clearMapMarkers();
            handle_hideBottomSheet();
            if (props.submitCallback != null)
                props.submitCallback(data);
        }).catch((e) => {
            NotificationController.showError(e.message)
        })

    }

    const handle_onInputChanged = (e: any) => {

        setFormState({ ...formState, [e.target.name]: e.target.value })
    }



    const handle_clickPin = () => {
        console.log(10);

        // missions?.data[0]?.locations?.map((location: any) => {
        //     console.log(23, location);
        //     mapRef?.current?.addMarker(location.coordinates[1], location.coordinates[0], true, MarkerRed, 0.1) 
        //     // mapRef.current?.addPolygon(item.coordinates, false, 'red')
        // })
    }

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.addMarkerToCenter();
        }
    }, [mapRef.current]);
    return (
        <div className="PassengerMissionDetails-component">
            <div className="row">
                <div className="col-12">
                    <div className="location-div">
                        <MapContainer
                            freeze={false}
                            mapRef={mapRef}
                            onMapInit={() => {
                                console.log('Map initialized');
                                // if (mapRef.current) {
                                //     mapRef.current.addMarkerToCenter();
                                // }
                            }}
                        />
                        {/* <MapContainer mapRef={mapRef as { current: MapRefType }} /> */}
                        <i className='fa fa-location'></i>
                        {/* {userInput.locations.map((item: any, index: number) => {
                                return <div>

                                    <span key={`${item.lat}${item.lng}`} className='relative shadow inline-block bg-white text-black text-xs py-2 pl-4 mx-2 my-1 rounded-2xl'>
                                        <BsX onClick={() => handle_deleteLocation(index)} size={20} className={"-right-3 top-1/2 -translate-y-1/2 flex absolute bg-danger rounded-full text-white h-7 w-7 cursor-pointer "} />
                                        <span className='pr-6 inline-block'>{item.address}</span>
                                    </span>
                                </div>
                            })} */}

                        <span className='flex'>
                            <i className='fas fa-car car-icon' onClick={() => setShowDetails(true)}></i>


                            {/* <button onClick={handle_showBottomSheet} className={classNames(
                                    'duration-300 shadow bg-success active:saturate-50 w-14 h-14 flex justify-center items-center text-white p-3 m-2 rounded-full cursor-pointer text-primary',
                                    {
                                        "scale-100": uiState.readyForSubmit,
                                        "scale-0": !uiState.readyForSubmit,
                                    }
                                )}>
                                    <BiCheck className={classNames(
                                        "duration-200 p-0.5 text-white absolute",
                                    )} size={40} />
                                </button> */}
                        </span>

                    </div>
                    {showDetails === true &&
                        <div className='div-details'>
                            <i onClick={() => setShowDetails(false)} className='fa fa-remove close-icon'></i>
                            {missions?.data && missions?.data[0] && <TripMissionDetails mission={missions?.data[0]} />}
                            {/* <BottomSheetModal onCreate={onBottomSheetCreate}>
                            <div>
                                
                            </div>
                        </BottomSheetModal> */}
                        </div>
                    }
                </div>
            </div>
        </div >

    );
};

export default PassengerMissionDetails;