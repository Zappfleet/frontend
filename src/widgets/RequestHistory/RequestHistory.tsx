// import './widgetStyle.scss'
import './style.scss'
import { TEXT_CONFIRMED_BY, TEXT_COST_CENTER, TEXT_CREATED_BY, TEXT_DATE_TIME, TEXT_DESC, TEXT_LOCATIONS, TEXT_PROJECT, TEXT_STATUS, getLocalDatetime, getLocationIndexTitle, joinStatus, requestStatus } from "../../lib/string";
import useRequests from "../../hooks/data/useRequests";
import React, { useEffect, useState } from "react";
import useItemSetToggle from "../../hooks/custom/useItemSetToggle";
import { renderWithPrefix } from "../../lib/renderUi";
import { useNavigate } from 'react-router-dom';

//sgh
import { NavLink, useLocation } from 'react-router-dom';
import useMissions_by_StatusAndDriverID from '../../hooks/useMissions_by_StatusAndDriverID';



export default function RequestHistory(props: any = {}) {


    const navigate = useNavigate();
    const { mode } = props;
    const status = ""
    const { requests }: any = useRequests({ mode, initialParams: { status } });
    const {
        items: expandedRows,
        toggleItem: toggleExpandedRows,
    } = useItemSetToggle({ onlyOne: true });

    const { missionList } = useMissions_by_StatusAndDriverID("DRAFT", null);


    // return <div>
    //     {requests?.docs?.map((request: any) => {
    //         const isExpanded = expandedRows.includes(request._id);
    //         return <RequestListItem key={request._id} request={request} >
    //             <>
    //                 <div onClick={() => toggleExpandedRows(request._id)}>
    //                     <i className={`fa ${isExpanded ? 'fa-angle-down' : 'fa-angle-up'}`}></i>
    //                 </div>

    //                 <div
    //                     className='expand'>
    //                     <div>
    //                         <RequestDetailsBox request={request} />
    //                     </div>
    //                 </div>

    //             </>
    //         </RequestListItem>
    //     })}
    // </div>


    const handleNavigation = (data: any) => {
        const initialLocations = data.locations.map((locationItem: any) => {
            return {
                lat: locationItem.coordinates[0],
                lng: locationItem.coordinates[1],
                ...locationItem.meta,
            };
        });

        const initialValues = {
            _id: data._id,
            service: data.service,
            datetime: [data.gmt_for_date],
            ...data.details,
        };

        navigate('/passenger/new', {
            state: {
                type: 'update',
                mode: 'user-only',
                initialLocations: initialLocations,
                initialValues: initialValues,
                className: "!top-12",
                submitted_by: data.submitted_by
            }
        });
    };

    const handleIsEditPossible = (requestID: any) => {
        missionList.map((item: any) => {
            if (!item.driver_id &&
                item.service_requests && item.service_requests.length > 0 &&
                item.service_requests.some((req: any) => req.request_id === requestID)) {
                return true
            }
        })
        return false
    }

    return <div className="RequestHistory-component">
        <div className="row">
            <div className="col-12">
                <table className='table table-hover'>
                    <thead>
                        <tr>
                            <th>{TEXT_DATE_TIME}</th>
                            <th>{TEXT_CREATED_BY}</th>
                            <th>{TEXT_CONFIRMED_BY}</th>
                            <th>{TEXT_STATUS}</th>
                            <th>{TEXT_DESC}</th>
                            <th>{""}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {missionList && requests?.docs?.map((request: any) => {
                            let isEditPossible =
                                request.status === 'PENDING' || request.status === 'CONFIRM' ? true :
                                    request.status === 'ASSIGNED_TO_MISSION' ? handleIsEditPossible(request._id) : false

                            const isExpanded = expandedRows.includes(request._id);
                            return <React.Fragment key={request._id}>
                                <tr>
                                    <td>{getLocalDatetime(request.gmt_for_date)}
                                        {isEditPossible === true &&
                                            <i onClick={() => handleNavigation(request)} className="fa fa-pencil pencil "></i>
                                        }
                                    </td>
                                    <td>{request.submitted_by?.full_name || request.submitted_by?.username}</td>
                                    <td>{request.confirmed_by?.full_name || request.confirmed_by?.username}</td>
                                    <td>{Object.fromEntries(requestStatus)[request.status]}</td>
                                    <td>{request.details.desc}</td>
                                    <td onClick={() => toggleExpandedRows(request._id)}>
                                        <i className={`fa ${isExpanded ? 'fa-angle-down' : 'fa-angle-up'}`}></i>
                                    </td>
                                </tr>
                                <tr style={{ display: isExpanded ? 'contents' : 'none' }}>
                                    <td colSpan={6}>

                                        <div
                                            className='expand'>
                                            <div>
                                                <RequestDetailsBox request={request} />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </React.Fragment >
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    </div>

}

function RequestListItem({ request, children }: any) {
    return <div>
        <table>
            <tbody>
                <tr>
                    <td>{TEXT_DATE_TIME}</td>
                    <td>{renderWithPrefix(getLocalDatetime(request.gmt_for_date))}</td>
                </tr>
                <tr>
                    <td>{TEXT_CREATED_BY}</td>
                    <td>{renderWithPrefix(request.submitted_by.full_name)}</td>
                </tr>
                <tr>
                    <td>{TEXT_CONFIRMED_BY}</td>
                    <td>{renderWithPrefix(request.dispatched_by?.full_name || "")}</td>
                </tr>
                <tr>
                    <td>{TEXT_STATUS}</td>
                    <td>{renderWithPrefix(Object.fromEntries(requestStatus)[request.status])}</td>
                </tr>
                <tr>
                    <td>{TEXT_DESC}</td>
                    <td>{renderWithPrefix(request.details?.desc)}</td>
                </tr>
            </tbody>
        </table>
        {children}
    </div>
}


function RequestDetailsBox({ request }: any) {

    return <table>
        <tbody>
            <tr>
                <td className='name'>{TEXT_PROJECT}</td>
                <td>{request.details.proj_code}</td>
            </tr>
            <tr>
                <td className='name'>{TEXT_COST_CENTER}</td>
                <td>{request.details.cost_center}</td>
            </tr>
            <tr>
                <td className='name'>{TEXT_LOCATIONS}</td>
                <td>
                    <ul>
                        {request.locations.map(({ meta }: any, index: number) => {
                            return <>
                                <li>
                                    <span>{` ${getLocationIndexTitle(request.locations.length, index)} `}</span>
                                    {meta.address}
                                </li>
                            </>
                        })}
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>
}

