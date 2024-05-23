import React, { useEffect, useState } from 'react';
import MapContainer from '../../../widgets/map/MapContainer';
import TitledDescription from '../../../widgets/TitledDescription';
import useAuthentication from '../../../hooks/data/useAuthentication';
import { getLocalDatetime, getLocationIndexTitle, requestStatus, translateDetailKey } from '../../../lib/string';
import { getApiClient } from '../../../apis/client';
import { NotificationController } from '../../../lib/notificationController';
import useConfirmModal from '../../../hooks/useConfirmModal';
import classNames from 'classnames';

import useRequestEditModal from '../../../hooks/custom/useRequestEditModal';
import renderUi from '../../../lib/renderUi';
import Chips from '../../../components/Chips';

const STATUS_ACCEPT = "confirm";
const STATUS_REJECT = "reject";


import useCurrentUserPermissions from '../../../hooks/useCurrentUserPermissions';
import {
    PERMIT_SERVICE_ORG_REQUEST_APPROVAL,
    PERMIT_SERVICE_PERSONAL_EDIT,
    PERMIT_SERVICE_ORG_DIRECT_EDIT
} from '../../../lib/constants'

const ServiceRequestCard = (props: any) => {


    const { requests, triggerRemoveFromList, update: updateRequest } = props.requests
    const { authInfo } = useAuthentication();

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
        <div>
            {ModalUi}
            {FullScreenModalUi}
            {requests?.docs?.map((item: any) => {
                const existsInDraft = props.draftMission?.contains(item);

                return <div key={item._id} className={
                    classNames(
                        'bg-white dark:bg-boxdark shadow p-4 rounded-md mb-4 max-h-96',
                        {
                            "opacity-0 !max-h-0 !p-0 !m-0 !pointer-events-none": item.removed,
                            "selected-border": existsInDraft
                        }
                    )
                }>
                    <div className='flex'>
                        <div className='flex-1'>
                            <div className='flex justify-between flex-col lg:flex-row'>
                                <TitledDescription className='flex-1 my-1' title='درخواست دهنده' desc={item.submitted_by?.full_name} />
                                <TitledDescription className='flex-1 my-1' title='زمان مورد درخواست' desc={getLocalDatetime(item.gmt_for_date)} />
                                {authInfo?.org?.requestsDetailsDisplayColumns?.map(({ key, title }: any) => {
                                    return <TitledDescription key={key} className='flex-1 my-1 lg:text-center' title={title} desc={item.details[key]} />
                                })}

                            </div>
                            <div className='flex justify-between flex-col mt-3'>
                                {item.locations?.map((loc: any, index: number) => {
                                    return <TitledDescription className='flex-1 my-1' title={`ایستگاه ${getLocationIndexTitle(item.locations.length, index)}`} desc={loc.meta.address} />;
                                })}
                            </div>
                            <div className='flex justify-end mt-4'>
                                {
                                    renderUi(
                                        <Chips className={classNames({
                                            "mx-3 p-2 !bg-success": item.status == "CONFIRM",
                                            "mx-3 p-2 !bg-danger": item.status == "REJECT",
                                            "mx-3 p-2 !bg-secondary": item.status == "ASSIGNED_TO_MISSION",
                                        })}>{Object.fromEntries(requestStatus)[item.status]}</Chips>
                                    ).if(item.status != "PENDING")
                                }

                                {permission_EDIT === true &&
                                    <button onClick={() => handle_editRequest(item)} className="bg-primary rounded-lg py-1 px-5 ml-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-5">
                                        {"ویرایش"}
                                    </button>
                                }
                                {permission_EDIT === false &&
                                    <button disabled={true} className="NoPermission rounded-lg py-1 px-5 ml-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-5">
                                        {"ویرایش"}
                                    </button>
                                }


                                {renderUi(
                                    <button onClick={() => handle_assignRequestToDraft(item)} className="bg-primary rounded-lg py-1 px-5 ml-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-5">
                                        {"افزودن به پیش نویس"}
                                    </button>
                                ).if(!existsInDraft && item.status == "CONFIRM")}

                                {
                                    renderUi(
                                        <>
                                            {permission_EDIT === true &&
                                                <>
                                                    <button onClick={() => handle_updateRequestStatus(item, STATUS_ACCEPT)} className="bg-primary rounded-lg py-1 px-5 ml-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-5">
                                                        {"تایید درخواست"}
                                                    </button>
                                                    <button onClick={() => handle_updateRequestStatus(item, STATUS_REJECT)} className="bg-white text-primary border border-primary rounded-lg py-1 px-5 ml-4 text-center font-medium hover:bg-primary hover:bg-opacity-30 lg:px-8 xl:px-5">
                                                        {"رد درخواست"}
                                                    </button>
                                                </>
                                            }
                                            {permission_EDIT === false &&
                                                <>
                                                    <button disabled={true} className="NoPermission rounded-lg py-1 px-5 ml-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-5">
                                                        {"تایید درخواست"}
                                                    </button>
                                                    <button disabled={true} className=" NoPermission text-primary border border-primary rounded-lg py-1 px-5 ml-4 text-center font-medium hover:bg-primary hover:bg-opacity-30 lg:px-8 xl:px-5">
                                                        {"رد درخواست"}
                                                    </button>
                                                </>
                                            }

                                        </>
                                    ).if(item.status == "PENDING")
                                }

                            </div>
                        </div>
                    </div>
                </div>
            })}

        </div>
    );
};

export default ServiceRequestCard;