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
import { MAP_COLOR_PRIMARY, NONE_KEY } from '../../../lib/constants';
import { BiCheck, BiCheckCircle } from 'react-icons/bi';
import useAuthentication from '../../../hooks/data/useAuthentication';
import { ModularInput } from '../../../components/ModularInput';
import { readFormInputs } from '../../../lib/form';
import useVehicleBasicData from '../../../hooks/data/useVehicleBasicData';
import { serviceUnits } from '../../../lib/string';
import { getApiClient } from '../../../apis/client';
import { NotificationController } from '../../../lib/notificationController';


const PassengerMissionDetails = (props: any) => {

    const [showDetails, setShowDetails] = useState<any>(false)
    const { searchState, reverseGeocoding } = useNeshanApi();

    const mapRef = useRef<MapRefType>();

    const tripDetails = {
        "_id": {
            "$oid": "666aebb64fd24478acf0c281"
        },
        "locations": [
            {
                "coordinates": [
                    29.89330480947916,
                    52.82119609533696
                ],
                "wait": 0,
                "meta": {
                    "address": "مرودشت، بلوار دانشجو، کوچه 4، اندیشه غربی، گذر نور، بین کوچه 1 و 3"
                },
                "_id": {
                    "$oid": "666aebb64fd24478acf0c282"
                }
            },
            {
                "coordinates": [
                    29.883333190652877,
                    52.814157978881866
                ],
                "wait": 0,
                "meta": {
                    "address": "مرودشت، بلوار امام علی، کوچه 117، کوچه 1"
                },
                "_id": {
                    "$oid": "666aebb64fd24478acf0c283"
                }
            }
        ],
        "service": "taksisroys",
        "gmt_for_date": {
            "$date": "2024-06-13T12:52:52.300Z"
        },
        "status": "ASSIGNED_TO_MISSION",
        "submitted_by": {
            "$oid": "6639084008aae1141c94b4a8"
        },
        "details": {
            "userlist": [
                {
                    "_id": "665eeb1034dea59bbd5631fe",
                    "username": "f.imanpour",
                    "password": "3f6f72c4e802053eb93a0d418c4a0db5",
                    "phone": "09151250498",
                    "full_name": "فرهاد ايمان پور",
                    "reg_key": "irisa",
                    "roles": [
                        "663902a12733b1e14bcde2f4"
                    ],
                    "status": "ACTIVE",
                    "details": {
                        "nat_num": "1291005919",
                        "personel_code": "193260",
                        "key": "irisa"
                    },
                    "createdAt": "2024-06-04T10:23:12.437Z",
                    "updatedAt": "2024-06-04T10:25:32.853Z",
                    "__v": 0,
                    "id": "665eeb1034dea59bbd5631fe"
                }
            ],
            "proj_code": "1000",
            "distance": 2436,
            "project": {
                "EMPLOYEE_NUMBER": "741399",
                "PROJECT_DESC": "پروژه SERMES فولاد مباركه",
                "FINISH_DATE": "1403/06/31",
                "FINISH_DATE_G": "2024-09-21T00:00:00",
                "PROJECT_STATUS_NAME": "Executive"
            }
        },
        "createdAt": {
            "$date": "2024-06-13T12:53:10.764Z"
        },
        "updatedAt": {
            "$date": "2024-06-13T12:54:58.831Z"
        },
        "__v": 0,
        "confirmed_by": {
            "$oid": "663f7f3d665933a1316d26b6"
        }
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
        updateInbetweenLines(userInput.locations);
    }, [userInput])

    useEffect(() => {
        if (props.initialLocations == null) return;
        const locations = props.initialLocations.map(({ address, lat, lng }: any) => {
            return {
                address,
                lat,
                lng,
                marker: mapRef.current?.addMarker(lng, lat, true),
            }
        })
        setUserInput({ ...userInput, locations })
        setUiState({
            ...uiState,
            readyForSubmit: locations.length > 1
        })
    }, [])


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

    useEffect(() => {
        handle_clickPin()
    }, [])

    const handle_clickPin = () => {
        tripDetails?.locations?.map((item: any) => {
            const [lng, lat] = item.coordinates;
            mapRef.current?.addPolygon(item.coordinates,false,'red')
                    })
    }

    return (
        <div className="PassengerMissionDetails-component">
            <div className="row">
                <div className="col-12">
                    <div className="location-div">
                        <MapContainer mapRef={mapRef as { current: MapRefType }} />
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
                            <TripMissionDetails tripDetails={tripDetails} />
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