import { useEffect, useRef } from 'react';
import MapContainer from '../../widgets/map/MapContainer';

import MarkerRed from '../../images/map/marker-red.png';
import BottomSheetModal from '../../components/BottomSheetModal';

import { BiCar } from 'react-icons/bi';
import DriverMissionServiceItem from './DriverMissionServiceItem';
import LoaderButton from '../../components/LoaderButton';
import { useSearchParams } from 'react-router-dom';
import useMissionDetails from '../../hooks/data/useMissionDetails';
import renderUi from '../../lib/renderUi';
import { SmallLoader } from '../../common/Loader';
import SimpleButton from '../../components/SimpleButton';
import { NotificationController } from '../../lib/notificationController';
import { STATUS_DONE, STATUS_ON_ROUTE, STATUS_PENDING, STATUS_READY } from '../../lib/string';


const DriverCurrentMissionService = () => {

    const [searchParams] = useSearchParams();
    const mission_id = searchParams.get("mission_id");

    const mapRef = useRef<any>();
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
            mapRef.current.viewCoordinates(position.coords.longitude, position.coords.latitude)
        }, () => {
            // console.log("ERR");
        });
    }, []);

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
        <div className='absolute left-0 right-0 bottom-0 top-18'>
            <MapContainer mapRef={mapRef} />

            <img
                className='absolute z-999999 left-2/4 -translate-x-2/4 bottom-2/4 w-8'
                src={MarkerRed} />

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
                            serviceItem={serviceItem}
                            handleServiceItemProgress={handle_ServiceItemProgress}
                            onStateChanged={handle_onServiceItemUiStateChanged} />
                    })}
                </div>
            </BottomSheetModal>

        </div>
    );
};

export default DriverCurrentMissionService;