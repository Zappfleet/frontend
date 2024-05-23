import classNames from 'classnames';
import UserThree from '../../images/user/user-03.png';
import { BiChevronDown, BiMessage, BiPhone } from 'react-icons/bi';
import { useEffect, useState } from 'react';
import renderUi, { renderWithPrefix } from '../../lib/renderUi';
import { STATUS_DONE, STATUS_ON_ROUTE, STATUS_PENDING, getLocationIndexTitle } from '../../lib/string';
import LoaderButton from '../../components/LoaderButton';

const DriverMissionServiceItem = (props: any) => {

    const [state, setState] = useState({
        open: false
    });

    const serviceItem = props.serviceItem;

    const handle_toggleDetails = () => {
        setState({ ...state, open: !state.open })
    }


    useEffect(() => {
        const timeout = setTimeout(() => {
            props.onStateChanged && props.onStateChanged(state);
        }, 350);
        return () => {
            clearTimeout(timeout)
        }
    }, [state])



    const service_is_finished = serviceItem?.status == STATUS_DONE;
    const service_is_on_route = serviceItem?.status != STATUS_PENDING && serviceItem.current_location_index < serviceItem?.request?.locations.length - 1;
    const service_is_pending = serviceItem?.status == STATUS_PENDING;

    const totalLocations = serviceItem?.request?.locations.length;

    return (
        <div className='border-b border-gray-4 p-2'>
            <div className='flex items-center relative'>
                <img className='relative h-8 w-8 rounded-full' src={UserThree} alt="User" />
                <label className='px-2'>
                    {serviceItem?.request.submitted_by.full_name}
                </label>
                <BiPhone size={42} className={"rounded-full p-2 duration-300 active:bg-gray-4"} />
                <BiChevronDown onClick={handle_toggleDetails} size={40} className={"absolute left-0 rounded-full p-2 cursor-pointer"} />
            </div>

            <p className='py-3 px-4 text-primary text-sm'>
                {`توضیحات : ${serviceItem?.request.details?.desc}`}
            </p>
            <div className={classNames(
                'overflow-hidden duration-300 mx-1 whitespace-nowrap',
                {
                    "h-20 py-2 ": state.open,
                    "h-0 py-0 ": !state.open,
                }
            )}>
                {renderUi(<label className='bold'>ایستگاه اول : </label>).if(serviceItem.current_location_index == -1)}
                {renderUi(<label className='bold'>ایستگاه بعد : </label>).if(serviceItem.current_location_index > -1 && serviceItem.current_location_index != totalLocations - 2)}
                {renderUi(<label className='bold'>ایستگاه آخر : </label>).if(serviceItem.current_location_index == totalLocations - 2)}

                {renderUi(
                    <label className='whitespace-nowrap'>{
                        serviceItem?.request?.locations[serviceItem.current_location_index + 1]?.meta?.address || "DD"
                    }</label>
                ).if(serviceItem.current_location_index < totalLocations - 1)}

                <div className='flex justify-end'>
                    <LoaderButton onClick={() => {
                        if (service_is_finished) return;
                        props?.handleServiceItemProgress(serviceItem)
                    }} isLoading={false} className='bg-primary text-white rounded-2xl px-2 py-1 mt-2'>
                        {renderUi("حرکت به سمت مبدا").if(service_is_pending)}
                        {renderUi(`به ایستگاه ${getLocationIndexTitle(totalLocations, serviceItem.current_location_index + 1)} رسیدم`).if(service_is_on_route)}
                        {renderUi(`سرویس پایان یافت`).if(service_is_finished)}
                    </LoaderButton>
                </div>
            </div>
        </div>
    );
};

export default DriverMissionServiceItem;