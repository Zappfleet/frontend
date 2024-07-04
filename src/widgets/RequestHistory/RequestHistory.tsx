// import './widgetStyle.scss'
import './style.scss'
import { TEXT_CONFIRMED_BY, TEXT_COST_CENTER, TEXT_CREATED_BY, TEXT_DATE_TIME, TEXT_DESC, TEXT_LOCATIONS, TEXT_PROJECT, TEXT_STATUS, TEXT_DRIVER, getLocalDatetime, getLocationIndexTitle, joinStatus, missionStatus, requestStatus } from "../../lib/string";
import useRequests from "../../hooks/data/useRequests";
import React, { useEffect, useState } from "react";
import useItemSetToggle from "../../hooks/custom/useItemSetToggle";
import { renderWithPrefix } from "../../lib/renderUi";
import { useNavigate } from 'react-router-dom';

//sgh
import { NavLink, useLocation } from 'react-router-dom';
import useMissions_by_StatusAndDriverID from '../../hooks/useMissions_by_StatusAndDriverID';
import { emoji as emojiLib } from '../../lib/comments';
import Comments from '../../components/Comments/Comments';
import useAuthentication from '../../hooks/data/useAuthentication';
import useComments from '../../hooks/data/Comments/useComments';
import { NotificationController } from '../../lib/notificationController';




export default function RequestHistory(props: any = {}) {

    const [showBtnRegistComment, setShowBtnRegistComment] = useState<any>(false)
    const [showCommentComponent, setShowCommentComponent] = useState<any>(false)
    const [role, setRole] = useState<any>(null)
    const [ID, setID] = useState<any>(null)

    const [actionType, setActionType] = useState<any>('')
    const [userComment, setUserComment] = useState<any>(null)
    const [refreshHook, setRefreshHook] = useState<any>(false)
    const [mission_id, setMissionID] = useState<any>(null)

    const { authInfo } = useAuthentication();
    const { result: resultComment, refreshData: refreshDataComment } = useComments(refreshHook, actionType, mission_id, userComment)

    useEffect(() => {
        if (authInfo) {
            if (authInfo.auth.roles[0].title === 'راننده') {
                setRole('driver')
                setID(authInfo.auth._id)
            }
            if (authInfo.auth.roles[0].title === 'مسافر') {
                setRole('passenger')
                setID(authInfo.auth._id)
            }

        }
    }, [authInfo])

    const navigate = useNavigate();
    const { mode } = props;
    const status = ""
    const { requests }: any = useRequests({ mode, initialParams: { status } });
    const {
        items: expandedRows,
        toggleItem: toggleExpandedRows,
    } = useItemSetToggle({ onlyOne: true });

    const { missionList } = useMissions_by_StatusAndDriverID("DRAFT", null);
    const { missionList: missionListDONEStatus } = useMissions_by_StatusAndDriverID("DONE", null);


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

    const saveComment = (comment: any, missionID: any) => {
        setShowCommentComponent(false)
        setUserComment(comment)
        setActionType('insert')
        setRefreshHook(true)
    }


    useEffect(() => {
      //  console.log(7, resultComment);

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

    const showComment = (request_id: any) => {

        const myMissions = missionListDONEStatus?.filter((item: any) =>
            item.service_requests && item.service_requests[0]?.request_id === request_id
        );

        const myComments = myMissions && myMissions[0]?.extra?.comments ? myMissions[0].extra.comments : undefined;

        const result = myComments?.map((item: any) => {
            return <>
                <div className='com0'>
                    <span className='title'>{`نظر ${item.role === 'driver' ? 'راننده' : 'مسافر'}`}</span>
                </div>
                <div className='com1'>
                    <i style={{ color: emojiLib.find(ite => ite.key === item.emojiID)?.color }}
                        className={emojiLib.find(ite => ite.key === item.emojiID)?.icon}></i>
                    <span>{(emojiLib.find(ite => ite.key === item.emojiID))?.value}</span>
                </div>
                <div className='com2'>
                    <p>{item.customComment}</p>
                </div>
                <div className='com3'>
                    {item.comments?.map((ite: any) => {
                        return <span className={ite.type}>{ite.value}</span>
                    })}
                </div>
            </>
        })

        // setShowBtnRegistComment(true)


        return result ? <div className='request-mycomment'>
            <div className="row">
                <div className="col-2 title">
                    {'نظرات'}
                </div>
                <div className="col-10">
                    {result}
                </div>
            </div>
        </div>
            :
            null

    }

    const handleClickBtnComment = (missionID: any) => {
        setMissionID(missionID)
        setShowCommentComponent(true)
    }

    return <div className="RequestHistory-component">
        <div className="row">
            <div className="col-12 have-table">
                <table className='table table-hover'>
                    <thead>
                        <tr>
                            <th>{TEXT_DATE_TIME}</th>
                            <th>{TEXT_CREATED_BY}</th>
                            <th>{TEXT_CONFIRMED_BY}</th>
                            <th>{TEXT_STATUS}</th>
                            <th>{TEXT_DRIVER}</th>
                            <th>{TEXT_DESC}</th>
                            <th>{""}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {missionList && requests?.docs?.map((request: any) => {
                            let isEditPossible =
                                request.status === 'PENDING' || request.status === 'CONFIRM' ? true :
                                    request.status === 'ASSIGNED_TO_MISSION' ? handleIsEditPossible(request._id) : false

                            const myMissions = missionListDONEStatus?.filter((item: any) =>
                                item.service_requests && item.service_requests[0]?.request_id === request._id
                                && item.status === 'DONE'
                            )

                        //    console.log(4444, request);

                            const myComments = myMissions && myMissions[0]?.extra?.comments ? myMissions[0].extra.comments : undefined;

                            let x = true
                            //console.log(50, myComments, ID);

                            myComments?.map((ite: any) => {
                                if (ite.registerID === ID) {
                                    x = false
                                }
                            })


                            const isExpanded = expandedRows.includes(request._id);
                            return <React.Fragment key={request._id}>
                                <tr>
                                    <td>{getLocalDatetime(request.gmt_for_date)}
                                        {isEditPossible === true &&
                                            <i onClick={() => handleNavigation(request)} className="fa fa-pencil pencil "></i>
                                        }
                                        {x === true && myMissions && myMissions[0] && myMissions[0]?.status === 'DONE' &&
                                            <i onClick={() => handleClickBtnComment(myMissions[0]._id)} className="fa fa-comment pencil "></i>}

                                        {showCommentComponent && mission_id === myMissions[0]?._id &&
                                            <div className="div-comments">
                                                <i onClick={() => setShowCommentComponent(false)} className='close-icon fa fa-remove'></i>
                                                <Comments registerID={ID} registerRole={role} saveComment={saveComment} />
                                            </div>}

                                    </td>
                                    <td>{request.submitted_by?.full_name || request.submitted_by?.username}</td>
                                    <td>{request.confirmed_by?.full_name || request.confirmed_by?.username}</td>
                                    {/* <td>{Object.fromEntries(requestStatus)[request.status]}</td> */}
                                    <td>{myMissions && myMissions[0] ? Object.fromEntries(missionStatus)[myMissions[0].status] : Object.fromEntries(requestStatus)[request.status]}</td>
                                    <td>{myMissions && myMissions[0] && myMissions[0].driver_full_name}</td>
                                    <td>{request.details?.desc && request.details?.desc}</td>
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
                                                {showComment(request._id)}
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
                <td>{request?.details?.proj_code && request?.details?.proj_code}</td>
            </tr>
            <tr>
                <td className='name'>{TEXT_COST_CENTER}</td>
                <td>{request?.details?.cost_center && request.details.cost_center}</td>
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

