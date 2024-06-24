import { useEffect, useRef, useState } from 'react';
import './style.scss'
import MapContainer, { MapRefType } from '../../../widgets/map/MapContainer';

import MarkerRed from '../../../images/map/marker-red.png';
import carIcon from '../../../images/map/carIcon.png';
import startIcon from '../../../assets/imgs/start.svg';
import finishIcon from '../../../assets/imgs/end.svg'
import BottomSheetModal from '../../../components/BottomSheetModal';

import { BiCar } from 'react-icons/bi';
import DriverMissionServiceItem from '../DriverMissionServiceItem/DriverMissionServiceItem';
import LoaderButton from '../../../components/LoaderButton';
import { useSearchParams } from 'react-router-dom';
import useMissionDetails from '../../../hooks/data/useMissionDetails';
import renderUi from '../../../lib/renderUi';
import { SmallLoader } from '../../../common/Loader';
import SimpleButton from '../../../components/SimpleButton';
import { NotificationController } from '../../../lib/notificationController';
import { STATUS_DONE, STATUS_ON_ROUTE, STATUS_PENDING, STATUS_READY } from '../../../lib/string';
import { EVENT_FLEET_GPS_REQUEST, EVENT_FLEET_GPS_UPDATE } from '../../../lib/constants';
import useSocket from '../../../hooks/useSocket';
import useFleet from '../../../hooks/data/useFleet';
import useFleetGps from '../../../hooks/useFleetGps/useFleetGps';


const DriverCurrentMissionService = () => {

    const [searchParams] = useSearchParams();
    const mission_id = searchParams.get("mission_id");
    const [missionStatus, setMissionStatus] = useState<any>('')


    const mapRef = useRef<MapRefType>();
    const [permitForRunUseFleetGps, setPermitForRunUseFleetGps] = useState<any>(false)
    const [vehicleIDs, setVehicleIDs] = useState<any>(null)
    const [mode, setMode] = useState<any>(null)
    const useFleetGpsResult = useFleetGps(permitForRunUseFleetGps,vehicleIDs, mapRef, carIcon, 0.015);

    const bottomSheet = useRef<any>();

    const {
        data: missionDetails,
        updateMissionStatus,
        initMissionRequest,
        proceedMissionRequest,
    }: any = useMissionDetails({ mission_id });


    const onBottomSheetCreate = (ui: any) => {
        bottomSheet.current = ui;
    }

    const handle_showBottomSheet = () => {
        if (missionDetails == null) return;
        bottomSheet.current.show();
    }

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            //  mapRef.current.viewCoordinates(position.coords.longitude, position.coords.latitude)
        }, () => {
            // console.log("ERR");
        });
    }, []);




    // ///////////call socket
    // const [fleetGps, setFleetGps] = useState<any>();
    // const fleetData: any = useFleet();

    // const fleetGpsUpdate = (payload: any) => {
    //     if (fleetData?.data?.vehicles?.docs == null) return;
    //     const newFleetGps: any = {};
    //     fleetData?.data?.vehicles?.docs?.map((vehicle: any) => {
    //         newFleetGps[vehicle._id] = {
    //             vehicle_gps: payload[vehicle._id],
    //             user_gps: vehicle?.driver_user && payload[vehicle.driver_user._id],
    //         };
    //     });
    //     setFleetGps(newFleetGps);
    // };

    // useEffect(() => {
    //     //add current location
    //     fleetGps?.map((item: any) => {
    //         mapRef.current?.addMarker(item?.coordinates[1], item?.coordinates[0], true, carIcon, 0.015)
    //     })
    // }, [fleetGps])

    // const socket = useSocket({
    //     listeners: {
    //         [EVENT_FLEET_GPS_UPDATE]: fleetGpsUpdate,
    //     },
    // });
    // const callSocket = () => {
    //     if (socket.current === null) return;
    //     const interval = setInterval(() => {
    //         socket.current.emit(EVENT_FLEET_GPS_REQUEST);
    //         console.log(2525, socket.current);
    //     }, 500000);
    //     return () => {
    //         clearInterval(interval);
    //     };
    // }
    // useEffect(() => {
    //     console.log(7500, socket);

    //     if (socket.current == null) return;

    //     const handleFleetGpsUpdate = (data: any) => {
    //         console.log('Fleet GPS update:', data);
    //         // Update your frontend state with the new data
    //     };

    //     socket.current.on(EVENT_FLEET_GPS_UPDATE, handleFleetGpsUpdate);

    //     return () => {
    //         socket.current.off(EVENT_FLEET_GPS_UPDATE, handleFleetGpsUpdate);
    //     };
    // }, [socket]);
    // //////////////////////////////

    useEffect(() => {
        if (missionDetails) {
            console.log(112, missionDetails);
            if (missionDetails?.mission?.status === 'DONE') {
                setMissionStatus('DONE')
            }
            if (missionDetails?.mission?.status === 'ON_ROUTE') {
                console.log(53);

                //show current location

                setMode('driver')
                setVehicleIDs([missionDetails?.mission?.vehicle?.id])
                setPermitForRunUseFleetGps(true)

                // console.log(225, missionDetails);
                //let currentLoc = missionDetails?.mission?.service_requests[0]?.request?.locations[0]
                //console.log(852, currentLoc?.coordinates[1], currentLoc?.coordinates[0]);
                // mapRef.current?.addMarker(currentLoc?.coordinates[1], currentLoc?.coordinates[0], true, carIcon, 0.015)
            }
            //  console.log(1, missionDetails?.mission?.service_requests[0].request?.locations);
            missionDetails?.mission?.service_requests[0]?.request?.locations?.map((location: any, index: any) => {

                console.log(85, location.coordinates[1], location.coordinates[0]);

                index === 0 ?
                    mapRef.current?.addMarker(location.coordinates[1], location.coordinates[0], true, MarkerRed, 0.1) :
                    mapRef.current?.addMarker(location.coordinates[1], location.coordinates[0], true, MarkerRed, 0.1)
            })
        }

    }, [missionDetails])

    const handle_onServiceItemUiStateChanged = ({ open }: any) => {
        if (open) {
            bottomSheet.current.scrollToMax();
        }
    }

    const handle_setMissionOnRoute = async () => {
        const { mission } = await updateMissionStatus(STATUS_ON_ROUTE)
        if (mission == null) NotificationController.showError("خطا در شروع سفر");
        if (mission != null) NotificationController.showSuccess("سفر شروع شد");
    }

    const handle_ServiceItemProgress = async (serviceItem: any) => {
        if (serviceItem.status == STATUS_PENDING) {
            initMissionRequest(serviceItem.request);
        } else {
            proceedMissionRequest(serviceItem.request, serviceItem.current_location_index + 1)
        }
    }

    return (
        <div className="DriverCurrentMissionService-component">
            <div className="div">
                <div className="row">
                    <div className="col-12">
                        <div className="location-div">
                            <MapContainer mapRef={mapRef as { current: MapRefType }} />
                        </div>
                    </div>
                </div>

                {/* {missionStatus !== 'DONE' && <img className='absolute z-999999 left-2/4 -translate-x-2/4 bottom-2/4 w-8'
                    src={MarkerRed} />
                } */}
                <div className='fixed bottom-0 left-0 right-0 flex p-1 z-999999 justify-center'>
                    <button onClick={handle_showBottomSheet} className='fixed left-4 bottom-4 bg-primary rounded-full w-16 h-16 flex justify-center items-center'>
                        {renderUi(<SmallLoader />).if(missionDetails == null)}
                        {renderUi(<BiCar className='text-white' size={30} />).if(missionDetails != null)}
                    </button>
                </div>

                <BottomSheetModal onCreate={onBottomSheetCreate}>
                    <div>
                        <div className='flex justify-center pb-2'>
                            {renderUi(<LoaderButton
                                onClick={handle_setMissionOnRoute}
                                className={"w-full"}>{"شروع سفر"}</LoaderButton>).if(missionDetails?.mission?.status == STATUS_READY)}

                            {renderUi(<label>{"سفر پایان یافته"}</label>).if(missionDetails?.mission?.status == STATUS_DONE)}
                            {renderUi(<label>{"سفر شروع شده"}</label>).if(missionDetails?.mission?.status == STATUS_ON_ROUTE)}



                        </div>
                        {missionDetails?.mission?.service_requests?.map((serviceItem: any) => {
                            return <DriverMissionServiceItem
                                mission_id={mission_id}
                                serviceItem={serviceItem}
                                handleServiceItemProgress={handle_ServiceItemProgress}
                                onStateChanged={handle_onServiceItemUiStateChanged} />
                        })}
                    </div>
                </BottomSheetModal>

            </div>
        </div >
    );
};

export default DriverCurrentMissionService;