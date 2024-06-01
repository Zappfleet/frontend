import './style.scss'
import React, { useEffect, useState } from 'react';
import MapContainer from '../../../../widgets/map/MapContainer';
import TitledDescription from '../../../../widgets/TitledDescription';
import useAuthentication from '../../../../hooks/data/useAuthentication';
import { getLocalDatetime, getLocationIndexTitle, requestStatus, translateDetailKey } from '../../../../lib/string';
import { getApiClient } from '../../../../apis/client';
import { NotificationController } from '../../../../lib/notificationController';
import useConfirmModal from '../../../../hooks/useConfirmModal';
import classNames from 'classnames';

import useRequestEditModal from '../../../../hooks/custom/useRequestEditModal';
import renderUi from '../../../../lib/renderUi';
import Chips from '../../../../components/Chips';

const STATUS_ACCEPT = "confirm";
const STATUS_REJECT = "reject";

import useRestrictionShowRequests from '../../../../hooks/data/Restrictions/useRestrictionShowRequests';

import useCurrentUserPermissions from '../../../../hooks/useCurrentUserPermissions';
import {
    PERMIT_SERVICE_ORG_REQUEST_APPROVAL,
    PERMIT_SERVICE_PERSONAL_EDIT,
    PERMIT_SERVICE_ORG_DIRECT_EDIT
} from '../../../../lib/constants'

const ServiceRequestCard = (props: any) => {


    const { requests, triggerRemoveFromList, update: updateRequest } = props.requests
    const { authInfo } = useAuthentication();
    const { result, state, refreshData } = useRestrictionShowRequests('select', 6, 0);

    const [count, setCount] = useState<any>(100) // Number of days to filter
    //sgh
    useEffect(() => {
        result && result.data && setCount(parseInt(result.data[0].value))
    }, [result])

    useEffect(() => {
        console.log(count + 6);
    }, [count])

    const currentDate = new Date();
    const endDate = new Date();
    endDate.setDate(currentDate.getDate() + count);





    const { hasPermitGroup, hasPermitFor, hasAdminRank, permits } = useCurrentUserPermissions();
    const [permission_EDIT, setPermission_EDIT] = useState<boolean>(false)
    const [permission_APPROVAL, setPermission_APPROVAL] = useState<boolean>(false)


    const { showFullScreenModal, FullScreenModalUi, closeFullScreenModal } = useRequestEditModal();

    const { show: showConfirm, ui: ModalUi } = useConfirmModal();

    useEffect(() => {
        setPermission_EDIT(hasPermitFor([PERMIT_SERVICE_ORG_DIRECT_EDIT, PERMIT_SERVICE_PERSONAL_EDIT]))
        setPermission_APPROVAL(hasPermitFor([PERMIT_SERVICE_ORG_REQUEST_APPROVAL]))

    }, [hasPermitFor])

    const handle_editRequest = (item: any) => {
        showFullScreenModal({
            data: item, submitCallback: (result: any) => {
                closeFullScreenModal();
                props.editCallback(result)
            }
        });
    }

    const handle_assignRequestToDraft = (item: any) => {
        showConfirm({
            title: "افزودن درخواست به پیش نویس",
            desc: `از افزودن درخواست به پیشنویس اطمینان دارید؟`,
            label_confirm: "بله، اضافه کن",
            label_cancel: "خیر",
            onConfirm: () => {
                props.handle_assignRequestToDraft?.(item);
            }
        })
    }


    const handle_updateRequestStatus = (request: any, status: string) => {
        showConfirm({
            title: "تغییر وضعیت درخواست",
            desc: `از ${status == STATUS_ACCEPT ? "تایید" : "رد"} درخواست اطمینان دارید؟`,
            label_confirm: `${status == STATUS_ACCEPT ? "تایید کن" : "رد کن"}`,
            label_cancel: "خیر",
            onConfirm: () => {
                getApiClient().updateRequestStatus(request._id, status)
                    .then(({ data }) => {
                        if (status != STATUS_ACCEPT)
                            triggerRemoveFromList(request._id)
                        else
                            updateRequest(data)
                    })
                    .catch((e: any) => {
                        NotificationController.showError(e.message);
                    })
            }
        })

    }



    return (
        <>
            {ModalUi}
            {FullScreenModalUi}
            {requests?.docs?.map((item: any) => {
                //sgh filter request based restriction show reaquest
                let date = new Date(item.gmt_for_date);
                if (!(date >= currentDate && date <= endDate)) {
                    return null
                }

                //////////////
                const existsInDraft = props.draftMission?.contains(item);

                return <div key={item._id}
                    className={`ServiceRequestCard-component ${item.removed ? '!pointer-events-none' : ''} ${existsInDraft ? 'selected-border' : ''} `} >

                    <div className="row">
                        <div className="col-3">
                            <p className='title1'>درخواست دهنده</p>
                            <p>{item.submitted_by?.full_name}</p>
                        </div>
                        <div className="col-3">
                            <p className='title1'>زمان مورد درخواست </p>
                            <p>{getLocalDatetime(item.gmt_for_date)}</p>
                        </div>

                        {authInfo?.org?.requestsDetailsDisplayColumns?.map(({ key, title }: any) => {
                            return <div className="col-3" key={key}>
                                <p className='title1'> {title}  </p>
                                <p>{item.details[key]}</p>
                            </div>
                        })}

                    </div>

                    <div className="row">
                        <div className="col-12">
                            <div className='location-div'>
                                {item.locations?.map((loc: any, index: number) => {

                                    return <div className="loc">
                                        <span className='loc-title'>{`ایستگاه ${getLocationIndexTitle(item.locations.length, index)}`}</span>
                                        <p>{loc.meta.address}</p>
                                    </div>
                                })}
                            </div>
                        </div>
                    </div>


                    <div className="row">
                        <div className="col-12">
                            <div className="buttons">
                                {item.status != "PENDING" &&
                                    <span>{requestStatus[item.status]}</span>
                                }

                                {permission_EDIT === true &&
                                    <button onClick={() => handle_editRequest(item)} className="my-btn">
                                        {"ویرایش"}
                                    </button>
                                }
                                {permission_EDIT === false &&
                                    <button disabled={true} className="my-btn NoPermission">
                                        {"ویرایش"}
                                    </button>
                                }


                                {!existsInDraft && item.status == "CONFIRM" &&
                                    <button onClick={() => handle_assignRequestToDraft(item)} className="my-btn">
                                        {"افزودن به پیش نویس"}
                                    </button>
                                }

                                {item.status == "PENDING" &&
                                    <>
                                        {permission_EDIT === true &&
                                            <>
                                                <button onClick={() => handle_updateRequestStatus(item, STATUS_ACCEPT)} className="my-btn">
                                                    {"تایید درخواست"}
                                                </button>
                                                <button onClick={() => handle_updateRequestStatus(item, STATUS_REJECT)} className="my-btn">
                                                    {"رد درخواست"}
                                                </button>
                                            </>
                                        }
                                        {permission_EDIT === false &&
                                            <>
                                                <button disabled={true} className="my-btn NoPermission">
                                                    {"تایید درخواست"}
                                                </button>
                                                <button disabled={true} className="my-btn NoPermission">
                                                    {"رد درخواست"}
                                                </button>
                                            </>
                                        }
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            })}

        </>
    );
};

export default ServiceRequestCard;