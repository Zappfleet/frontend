import classNames from 'classnames';
import './style.scss'
import UserThree from '../../../images/user/user-03.png';
import { BiChevronDown, BiMessage, BiPhone } from 'react-icons/bi';
import { useEffect, useState } from 'react';
import renderUi, { renderWithPrefix } from '../../../lib/renderUi';
import { STATUS_DONE, STATUS_ON_ROUTE, STATUS_PENDING, getLocationIndexTitle } from '../../../lib/string';
import LoaderButton from '../../../components/LoaderButton';
import Comments from '../../../components/Comments/Comments';
import useAuthentication from '../../../hooks/data/useAuthentication';
import useComments from '../../../hooks/data/Comments/useComments';
import { NotificationController } from '../../../lib/notificationController';
import { DB_ROLE_DRIVER_TITLE, DB_ROLE_MOSAFER_TITLE } from '../../../lib/constants';
import ErrorBoundary from '../../../components/ErrorBoundary/ErrorBoundary';

const DriverMissionServiceItem = (props: any) => {


    const { authInfo } = useAuthentication();

    const [actionType, setActionType] = useState<any>('')
    const [userComment, setUserComment] = useState<any>(null)
    const [refreshHook, setRefreshHook] = useState<any>(false)
    const [showBtnRegistComment, setShowBtnRegistComment] = useState<any>(false)

    const { result: resultComment, refreshData: refreshDataComment } = useComments(refreshHook, actionType, props.mission_id, userComment)

    const [role, setRole] = useState<any>(null)
    const [ID, setID] = useState<any>(null)

    useEffect(() => {
        if (authInfo) {
            if (authInfo.auth.roles[0].title === DB_ROLE_DRIVER_TITLE) {
                setRole('driver')
                setID(authInfo.auth._id)
            }
            if (authInfo.auth.roles[0].title === DB_ROLE_MOSAFER_TITLE) {
                setRole('passenger')
                setID(authInfo.auth._id)
            }

        }
    }, [authInfo])

    const [state, setState] = useState({
        open: false
    });

    const serviceItem = props.serviceItem;
    //console.log(75,serviceItem?.request?.submitted_by?.phone);


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

    const [showCommentComponent, setShowCommentComponent] = useState<any>(false)
    const handleSaveCommentModal = () => {
        setShowCommentComponent(true)
    }

    useEffect(() => {


        if (service_is_finished === true) {
            setActionType('select')
            setRefreshHook(true)
        }
    }, [service_is_finished])

    const saveComment = (comment: any) => {
        setShowCommentComponent(false)
        setUserComment(comment)
        setActionType('insert')
        setRefreshHook(true)
    }

    useEffect(() => {
        if (resultComment) {
            if (actionType === 'insert') {
                if (resultComment.status === 200) {
                    NotificationController.showSuccess('نظرات ثبت شد');
                    setShowBtnRegistComment(false)
                }
                else {
                    NotificationController.showError('اطلاعات ثبت نشد');
                }
            }
            if (actionType === 'select') {
                //  console.log(23, resultComment.data);

                let registedCommentbefore = true
                resultComment?.data?.data?.map((item: any) => {
                    console.log(5, item.registerID, ID);
                    if (item.registerID === ID) {
                        registedCommentbefore = false
                    }
                })
                setShowBtnRegistComment(registedCommentbefore)
            }
            setRefreshHook(false)
        }
    }, [resultComment])

    const showDialPage = (phoneNumber: any) => {
        // const phoneNumber = '+1234567890'; // Replace with your desired phone number
        window.location.href = `tel:${phoneNumber}`;
    }


    return (
        <div className="DriverMissionServiceItem-component">
            <div className='border-b border-gray-4 p-2'>
                <div className='flex items-center relative'>
                    <img className='relative h-8 w-8 rounded-full' src={UserThree} alt="User" />
                    <label className='px-2'>
                        {serviceItem?.request.submitted_by.full_name}
                    </label>
                    <i className='fa fa-phone icon-phone' onClick={() => showDialPage(serviceItem?.request?.submitted_by?.phone)}></i>
                     
                        <BiChevronDown onClick={handle_toggleDetails} size={40} className={"absolute left-0 rounded-full p-2 cursor-pointer"} />
                     
                </div>

                <p className='py-3 px-4 text-primary text-sm'>
                    {`توضیحات : ${serviceItem?.request.details?.desc || ''}`}
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
                            if (service_is_finished) return
                            props?.handleServiceItemProgress(serviceItem)
                        }} isLoading={false} className='bg-primary text-white rounded-2xl px-2 py-1 mt-2'>
                            {renderUi("حرکت به سمت مبدا").if(service_is_pending)}
                            {renderUi(`به ایستگاه ${getLocationIndexTitle(totalLocations, serviceItem.current_location_index + 1)} رسیدم`).if(service_is_on_route)}
                            {renderUi(`سرویس پایان یافت`).if(service_is_finished)}

                        </LoaderButton>
                        {showBtnRegistComment && <button onClick={handleSaveCommentModal} className='my-btn'> ثبت نظر</button>}
                        {showCommentComponent &&
                            <div className="div-comments">
                                <i onClick={() => setShowCommentComponent(false)} className='close-icon fa fa-remove'></i>
                                 
                                    <Comments registerID={ID} registerRole={role} saveComment={saveComment} />
                                 
                            </div>}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverMissionServiceItem;