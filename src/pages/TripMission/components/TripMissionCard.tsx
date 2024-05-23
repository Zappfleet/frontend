import React from 'react';
import MapContainer from '../../../widgets/map/MapContainer';
import TitledDescription from '../../../widgets/TitledDescription';
import UserOne from '../../../images/user/user-01.png';
import { FaCar } from "react-icons/fa";
import { MISSION_API_PUBLISH, MISSION_STATUS_PUBLISHED, TAB_SERVICES } from './constants';
import useMissions from '../../../hooks/data/useMissions';
import renderUi from '../../../lib/renderUi';
import { VehicleItem } from './VehicleItem';
import useVehicleBasicData from '../../../hooks/data/useVehicleBasicData';
import { getLocationIndexTitle } from '../../../lib/string';
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import AnalogTimePicker from 'react-multi-date-picker/plugins/analog_time_picker';
import { BsClock } from 'react-icons/bs';
import SimpleButton from '../../../components/SimpleButton';
import { MODE_AREAL } from '../../../lib/constants';

const TripMissionCard = (props: any) => {

    const { missions }: any = useMissions({ mode: MODE_AREAL, status: MISSION_STATUS_PUBLISHED });
    const { data: vehicleBasicData } = useVehicleBasicData();


    return missions?.data?.docs?.map((mission: any) => {
        return <MissionService
            vehicleBasicData={vehicleBasicData}
            prompt_onMissionReady={props.prompt_onMissionReady}
            triggerVehicleAssignment={props.triggerVehicleAssignment}
            key={mission._id}
            mission={mission} />
    })

};


function MissionService(props: any) {
    const { mission, vehicleBasicData } = props;

    return <div className='bg-white dark:bg-boxdark shadow p-4 rounded-md'>
        <div className='flex flex-col lg:flex-row'>
            <div className='flex-1 whitespace-nowrap overflow-hidden '>
                {mission.service_requests.map((request: any) => {
                    return <MissionServiceItem key={request._id} request={request} />;
                })}

            </div>
            <div className='lg:w-64'>
                <div onClick={() => props.triggerVehicleAssignment?.(props.mission, TAB_SERVICES)} className='p-2 mx-1 h-32 relative'>
                    {renderUi(
                        <div className='rounded border border-dashed hover:text-primary hover:border-primary absolute top-2 left-0 right-0 bottom-2 cursor-pointer flex items-center justify-center'>
                            <FaCar className={"duration-300"} size={32} />
                        </div>
                    ).if(mission.vehicle_id == null)}
                    {renderUi(
                        <div className='rounded border border-dashed hover:text-primary hover:border-primary absolute top-2 left-0 right-0 bottom-2 cursor-pointer flex-col flex items-center justify-center'>
                            <VehicleItem vehicle={mission.vehicle_id} basicData={vehicleBasicData} />
                        </div>
                    ).if(mission.vehicle_id != null)}
                </div>
                {renderUi(
                    <div className='px-1'>
                        <SimpleButton onClick={() => props.prompt_onMissionReady?.(props.mission)} className={"mt-4 mb-2 w-full"}>{"تایید نهایی"}</SimpleButton>
                    </div>
                ).if(mission.status == MISSION_STATUS_PUBLISHED && mission.vehicle_id != null)}

            </div>
        </div>
    </div>
}

function MissionServiceItem(props: any) {
    const { request_id: request } = props.request;

    return <div className='card inline-block align-top w-full lg:w-1/4'>
        <div className='m-2 p-2 bg-white rounded-lg border border-gray-4 shadow'>
            <span className='flex items-center mb-2'>
                <span className="h-10 w-10 rounded-full">
                    <img src={UserOne} alt="User" />
                </span>
                <label className='mx-1'>{request.submitted_by.full_name}</label>
            </span>
            <span className='flex items-center justify-center text-center pb-2'>
                <BsClock className={"w-12"} size={20} />
                <DatePicker
                    disableDayPicker
                    calendar={persian}
                    locale={persian_fa}
                    format="HH:mm"
                    className="datetime-picker"
                    inputClass="datetime-input !w-32 !text-center !text-lg !p-4"
                    plugins={[
                        <AnalogTimePicker hideSeconds={true} />
                    ]}
                    value={request.gmt_for_date}
                />
            </span>
            {request.locations?.map((loc: any, index: number) => {
                return <TitledDescription key={loc._id} className='flex-1 my-1 text-xs' title={`ایستگاه ${getLocationIndexTitle(request.locations.length, index)}`} desc={loc?.meta?.address} />
            })}

        </div>
    </div>
}

export default TripMissionCard;