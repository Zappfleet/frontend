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
import useFleetGps from '../../../hooks/useFleetGps/useFleetGps';
import carIcon from '../../../images/map/carIcon.png';

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
    const useFleetGpsResult = useFleetGps(permitForRunUseFleetGps, vehicleIDs, mapRef, carIcon, 0.015);




    useEffect(() => {
        if (missions && missions.data?.length > 0 && mapRef.current) {
            try {

                //show current location
                setMode('driver')
                setVehicleIDs([missions.data[0]?.vehicleID])
                setPermitForRunUseFleetGps(true)

                missions.data[0].locations?.forEach((location: any) => {
                    mapRef.current?.addMarker(
                        location.coordinates[1],
                        location.coordinates[0],
                        true,
                        MarkerRed,
                        0.1
                    );
                });
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