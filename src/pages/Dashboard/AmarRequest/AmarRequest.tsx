import React, { useEffect, useState } from 'react';
import './style.scss'
import { DB_ROLE_ADMIN_TITLE, DB_ROLE_DISPATURE_TITLE, DB_ROLE_MODIR_PROJECT_TITLE, MODE_AREAL } from '../../../lib/constants.ts';
import useRequests from '../../../hooks/data/useRequests.tsx';
import DataGrid from '../../../components/DataGrid/DataGrid.tsx';
import { isArray } from 'lodash';
import { requestStatus } from '../../../lib/string.ts';
import ErrorBoundary from '../../../components/ErrorBoundary/ErrorBoundary.tsx';
import useMissions from '../../../hooks/data/useMissions.tsx';
import useUsers from '../../../hooks/data/useUsers.tsx';
import useRoles from '../../../hooks/data/useRoles.tsx';

const AmarRequest = () => {


    const { userList } = useUsers();
    const { data: userRoles } = useRoles();


    const { missions }: any = useMissions({
        mode: MODE_AREAL,
        status: '',
        paging: false,
    })

    useEffect(() => {
    }, [missions])

    const { requests }: any = useRequests({
        mode: MODE_AREAL,
        initialParams: { status: '', paging: false },
    })
    const [UpdatedRequests, setUpdatedRequests] = useState([]);

    useEffect(() => {
        handleReports()
    }, [requests, missions, userList, userRoles])


    let updatedArr = (requests: any) => {
        // تبدیل آرایه به یک آبجکت برای دسترسی سریع‌تر
        const statusMap = Object.fromEntries(requestStatus);

        const newRequest = requests?.map((item: any) => {
            //  console.log(78, statusMap[item.status]);
            return {
                ...item,
                mosafer: item?.created_by || item?.details?.userlist?.full_name || item?.submitted_by?.full_name || '---',
                driver: item?.driverName || '---',
                dispature: item?.dispature || '---',
                confirmedBy: item?.confirmed_by?.full_name || null,
                rejectedBy: item?.rejected_by?.full_name || null,
                Fr_status: statusMap[item.status] || (item?.status === 'DRAFT' && 'پیش نویس') || (item?.status === 'READY' && 'آماده سفر') || item.status,  // جایگزینی مقدار status
                fromPlace: (item?.locations[0] && item?.locations[0]?.meta?.address && item?.locations[0]?.meta?.address) ||
                    (item?.locations[0] && item?.locations[0]?.meta?.adr && item?.locations[0]?.meta?.adr) || '---',
                toPlace: (item?.locations?.length > 1 && item?.locations[item?.locations?.length - 1]?.meta?.address && item?.locations[item?.locations?.length - 1]?.meta?.address) ||
                    (item?.locations?.length > 1 && item?.locations[item?.locations?.length - 1]?.meta?.adr && item?.locations[item?.locations?.length - 1]?.meta?.adr) || '---',
                date: item?.mission_date || item?.request?.gmt_for_date || item?.gmt_for_date || '---',
            };
        });

        return newRequest
    }

    const [showDivDetailsMission, setShowDivDetailsMission] = useState<boolean>(false)
    const [statusMission, setStatusMission] = useState<any>()
    const showMission = (statusMission: any) => {
        setStatusMission(statusMission)
        setShowDivDetailsMission(true)
    }

    const [showDivDetailsRequest, setShowDivDetailsRequest] = useState<boolean>(false)
    const [reportsDetails, setReportsDetails] = useState<any>()
    const [reportNum, setReportNum] = useState<any>(null)

    const showRequest = (report: any) => {
        console.log(21, report);

        const result = updatedArr(report?.result)
        setReportNum(report.reportNum)
        setReportsDetails(result)
        setShowDivDetailsRequest(true)
    }

    const [reports, setReports] = useState([
        { type: 'mission', result: undefined, reportNum: 18, title: "سفرهای ثبت شده", icon: 'icon3 fas fa-user-check' },

        { type: 'request', result: undefined, reportNum: 9, title: "درخواست ثبت شده", icon: 'icon3 fas fa-user-check' },
        { type: 'request', result: undefined, reportNum: 1, title: 'درخواست در انتظار', icon: 'icon3 fas fa-exchange-alt' },

        { type: 'request', result: [], reportNum: 2, title: 'درخواست رد شده', icon: 'icon2 fas fa-user-times' },
        { type: 'request', result: undefined, reportNum: 16, title: 'درخواست رد شده - مدیر پروژه', icon: 'icon2 fas fa-user-times' },
        { type: 'request', result: undefined, reportNum: 12, title: 'درخواست رد شده - توزیع کننده', icon: 'icon2 fas fa-user-times' },
        { type: 'request', result: undefined, reportNum: 13, title: 'درخواست رد شده - مدیر سیستم', icon: 'icon2 fas fa-user-times' },

        { type: 'request', result: [], reportNum: 3, title: 'درخواست تایید شده ', icon: 'icon1 fas fa-file-edit' },
        { type: 'request', result: undefined, reportNum: 17, title: 'درخواست تایید شده - مدیر پروژه', icon: 'icon1 fas fa-file-edit' },
        { type: 'request', result: undefined, reportNum: 14, title: 'درخواست تایید شده - توزیع کننده ', icon: 'icon1 fas fa-file-edit' },
        { type: 'request', result: undefined, reportNum: 15, title: 'درخواست تایید شده - مدیر سیستم', icon: 'icon1 fas fa-file-edit' },

        { type: 'request', result: undefined, reportNum: 6, title: "درخواست در پیش نویس سفر", icon: 'icon4 fas fa-eye' },
        { type: 'request', result: undefined, reportNum: 11, title: "(درخواست/سفر) در انتظار شروع   ", icon: 'icon1 fas fa-user-check' },
        { type: 'request', result: undefined, reportNum: 7, title: "(درخواست/سفر) در مسیر", icon: 'icon1 fas fa-road' },
        { type: 'request', result: undefined, reportNum: 8, title: "(درخواست/سفر) انجام شده", icon: 'icon1 fas fa-check-circle' },

        { type: 'request', result: undefined, reportNum: 10, title: " درخواست لغو شده توسط کاربر", icon: 'icon2 fas fa-user-times' },
        // { type: 'request', result: [], reportNum: 4, title: "درخواست دیده شده - توزیع کننده", icon: 'icon4 fas fa-eye' },
        // { type: 'request', result: [], reportNum: 5, title: "درخواست دیده شده - مدیر پروژه", icon: 'icon4 fas fa-eye' },

    ]);


    const handleReports = () => {
        const updatedReports = reports.map((report: any) => {
            let requestFilter: any = [];
            let requestIds: any = [];
            let missionsFilter: any = [];
            let roleId: any = []

            switch (report.reportNum) {
                case 1:
                    requestFilter = requests?.filter((r: any) => r.status === 'PENDING');
                    report.result = requestFilter ? requestFilter : [];
                    break;
                case 2:
                    requestFilter = requests?.filter((r: any) => r.status === 'REJECT');
                    report.result = requestFilter ? requestFilter : [];
                    break;

                case 12:
                    //  console.log(58554111, userRoles, userList);
                    roleId = userRoles?.roles?.filter((r: any) => r.title === DB_ROLE_DISPATURE_TITLE)
                    // بررسی اینکه آیا هر کاربر در userList نقش 'مدیر سیستم' را دارد
                    if (roleId && roleId[0]) {

                        let moderProjects = userList?.map((user: any) => ({
                            ...user,
                            hasSystemManagerRole: user.roles?.includes(roleId[0]?._id) // بررسی نقش در آرایه roles
                        }));

                        // نگهداری شناسه‌های کاربرانی که نقش 'مدیر سیستم' را دارند
                        let moderProjectsIds = moderProjects?.filter((user: any) => user.hasSystemManagerRole).map((user: any) => user._id);

                        //let moderProjects = userList?.roles?.includes(roleId?._id);
                        //let moderProjectsIds = moderProjects?.map((r: any) => r._id);
                        //   console.log(58554111, roleId, moderProjects, moderProjectsIds);

                        requestFilter = requests?.filter((r: any) => {
                            if (r.status === 'REJECT' && r.rejected_by &&
                                moderProjectsIds?.includes(r.rejected_by?._id)) {
                                return true
                            }
                            return false
                        })
                    }
                    report.result = requestFilter ? requestFilter : [];
                    break;

                case 13:
                    //  console.log(58554111, userRoles, userList);
                    roleId = userRoles?.roles?.filter((r: any) => r.title === DB_ROLE_ADMIN_TITLE)
                    console.log(44, roleId);

                    // بررسی اینکه آیا هر کاربر در userList نقش 'مدیر سیستم' را دارد
                    if (roleId && roleId[0]) {

                        let moderProjects = userList?.map((user: any) => ({
                            ...user,
                            hasSystemManagerRole: user.roles?.includes(roleId[0]?._id) // بررسی نقش در آرایه roles
                        }));

                        // نگهداری شناسه‌های کاربرانی که نقش 'مدیر سیستم' را دارند
                        let moderProjectsIds = moderProjects?.filter((user: any) => user.hasSystemManagerRole).map((user: any) => user._id);

                        //let moderProjects = userList?.roles?.includes(roleId?._id);
                        //let moderProjectsIds = moderProjects?.map((r: any) => r._id);
                        // console.log(58554111, roleId, moderProjects, moderProjectsIds);

                        requestFilter = requests?.filter((r: any) => {
                            if (r.status === 'REJECT' && r.rejected_by &&
                                moderProjectsIds?.includes(r.rejected_by?._id)) {
                                return true
                            }
                            return false
                        })
                    }
                    report.result = requestFilter ? requestFilter : [];
                    break;

                case 16:
                    //  console.log(58554111, userRoles, userList);
                    roleId = userRoles?.roles?.filter((r: any) => r.title === DB_ROLE_MODIR_PROJECT_TITLE)
                    // بررسی اینکه آیا هر کاربر در userList نقش 'مدیر سیستم' را دارد
                    if (roleId && roleId[0]) {

                        let moderProjects = userList?.map((user: any) => ({
                            ...user,
                            hasSystemManagerRole: user.roles?.includes(roleId[0]?._id) // بررسی نقش در آرایه roles
                        }));

                        // نگهداری شناسه‌های کاربرانی که نقش 'مدیر سیستم' را دارند
                        let moderProjectsIds = moderProjects?.filter((user: any) => user.hasSystemManagerRole).map((user: any) => user._id);

                        //let moderProjects = userList?.roles?.includes(roleId?._id);
                        //let moderProjectsIds = moderProjects?.map((r: any) => r._id);
                        //  console.log(58554111, roleId, moderProjects, moderProjectsIds);

                        requestFilter = requests?.filter((r: any) => {
                            if (r.status === 'REJECT' && r.rejected_by &&
                                moderProjectsIds?.includes(r.rejected_by?._id)) {
                                return true
                            }
                            return false
                        })
                    }
                    report.result = requestFilter ? requestFilter : [];
                    break;


                case 3:
                    requestFilter = requests?.filter((r: any) => r.status === 'CONFIRM');
                    report.result = requestFilter ? requestFilter : [];
                    break;

                case 14:
                    //  console.log(58554111, userRoles, userList);
                    roleId = userRoles?.roles?.filter((r: any) => r.title === DB_ROLE_DISPATURE_TITLE)
                    // بررسی اینکه آیا هر کاربر در userList نقش 'مدیر سیستم' را دارد
                    if (roleId && roleId[0]) {

                        let moderProjects = userList?.map((user: any) => ({
                            ...user,
                            hasSystemManagerRole: user.roles?.includes(roleId[0]?._id) // بررسی نقش در آرایه roles
                        }));

                        // نگهداری شناسه‌های کاربرانی که نقش 'مدیر سیستم' را دارند
                        let moderProjectsIds = moderProjects?.filter((user: any) => user.hasSystemManagerRole).map((user: any) => user._id);

                        //let moderProjects = userList?.roles?.includes(roleId?._id);
                        //let moderProjectsIds = moderProjects?.map((r: any) => r._id);
                        //  console.log(58554111, roleId, moderProjects, moderProjectsIds);

                        requestFilter = requests?.filter((r: any) => {
                            if (r.status === 'CONFIRM' && r.confirmed_by &&
                                moderProjectsIds?.includes(r.confirmed_by?._id)) {
                                return true
                            }
                            return false
                        })
                    }
                    report.result = requestFilter ? requestFilter : [];
                    break;

                case 15:
                    //  console.log(58554111, userRoles, userList);
                    roleId = userRoles?.roles?.filter((r: any) => r.title === DB_ROLE_ADMIN_TITLE)
                    // بررسی اینکه آیا هر کاربر در userList نقش 'مدیر سیستم' را دارد
                    if (roleId && roleId[0]) {

                        let moderProjects = userList?.map((user: any) => ({
                            ...user,
                            hasSystemManagerRole: user.roles?.includes(roleId[0]?._id) // بررسی نقش در آرایه roles
                        }));

                        // نگهداری شناسه‌های کاربرانی که نقش 'مدیر سیستم' را دارند
                        let moderProjectsIds = moderProjects?.filter((user: any) => user.hasSystemManagerRole).map((user: any) => user._id);

                        //let moderProjects = userList?.roles?.includes(roleId?._id);
                        //let moderProjectsIds = moderProjects?.map((r: any) => r._id);
                        //  console.log(58554111, roleId, moderProjects, moderProjectsIds);

                        requestFilter = requests?.filter((r: any) => {
                            if (r.status === 'CONFIRM' && r.confirmed_by &&
                                moderProjectsIds?.includes(r.confirmed_by?._id)) {
                                return true
                            }
                            return false
                        })
                    }
                    report.result = requestFilter ? requestFilter : [];
                    break;

                case 17:
                    //  console.log(58554111, userRoles, userList);
                    roleId = userRoles?.roles?.filter((r: any) => r.title === DB_ROLE_MODIR_PROJECT_TITLE)
                    // بررسی اینکه آیا هر کاربر در userList نقش 'مدیر سیستم' را دارد
                    if (roleId && roleId[0]) {

                        let moderProjects = userList?.map((user: any) => ({
                            ...user,
                            hasSystemManagerRole: user.roles?.includes(roleId[0]?._id) // بررسی نقش در آرایه roles
                        }));

                        // نگهداری شناسه‌های کاربرانی که نقش 'مدیر سیستم' را دارند
                        let moderProjectsIds = moderProjects?.filter((user: any) => user.hasSystemManagerRole).map((user: any) => user._id);

                        //let moderProjects = userList?.roles?.includes(roleId?._id);
                        //let moderProjectsIds = moderProjects?.map((r: any) => r._id);
                        //  console.log(58554111, roleId, moderProjects, moderProjectsIds);

                        requestFilter = requests?.filter((r: any) => {
                            if (r.status === 'CONFIRM' && r.confirmed_by &&
                                moderProjectsIds?.includes(r.confirmed_by?._id)) {
                                return true
                            }
                            return false
                        })
                    }
                    report.result = requestFilter ? requestFilter : [];
                    break;



                case 6:
                    requestFilter = requests?.filter((r: any) => r.status === 'ASSIGNED_TO_MISSION');
                    requestIds = requestFilter?.map((r: any) => r._id);
                    missionsFilter = missions?.data?.filter((r: any) => {
                        if (r.status === 'DRAFT' && r.service_requests &&
                            requestIds?.includes(r.service_requests[0]?.request_id)) {
                            return true
                        }
                        return false

                    })
                    report.result = missionsFilter;
                    break;
                case 7:
                    requestFilter = requests?.filter((r: any) => r.status === 'ASSIGNED_TO_MISSION');
                    requestIds = requestFilter?.map((r: any) => r._id);
                    missionsFilter = missions?.data?.filter((r: any) => {
                        if (r.status === 'ON_ROUTE') {
                            return true
                        }
                        return false

                    })
                    report.result = missionsFilter;
                    break;
                case 8:
                    requestFilter = requests?.filter((r: any) => r.status === 'ASSIGNED_TO_MISSION');
                    requestIds = requestFilter?.map((r: any) => r._id);
                    missionsFilter = missions?.data?.filter((r: any) => {
                        if (r.status === 'DONE') {
                            return true
                        }
                        return false

                    })
                    report.result = missionsFilter;
                    break;
                case 9:
                    requestFilter = requests;
                    report.result = requestFilter ? requestFilter : [];
                    break;

                case 18:

                    missionsFilter = missions?.data;
                    report.result = missionsFilter;
                    break;

                case 10:
                    requestFilter = requests?.filter((r: any) => r.status === 'CANCEL_USER');
                    report.result = requestFilter ? requestFilter : [];
                    break;

                case 11:
                    requestFilter = requests?.filter((r: any) => r.status === 'ASSIGNED_TO_MISSION');
                    requestIds = requestFilter?.map((r: any) => r._id);
                    missionsFilter = missions?.data?.filter((r: any) => {
                        if (r.status === 'READY'
                            // && r.service_requests
                            // && requestIds?.includes(r.service_requests[0]?.request_id)
                        ) {
                            return true
                        }
                        return false

                    })
                    report.result = missionsFilter;
                    break;
            }
            return report;
        });

        // به‌روزرسانی state با داده‌های جدید
        setReports(updatedReports);
    };


    const showAmar = () => {
        return reports?.map((report: any, index: any) => (
            <div key={index} className="col-6 col-md-4">
                <div className="div-box">
                    <div className="box" onClick={() => report.type === 'request' ? showRequest(report) : showRequest(report)}>
                        <div className="col-4 right-div">
                            <i className={`icon ${report?.icon}`} />
                        </div>
                        <div className="col-8 left-div">
                            <div className="count">
                                {(!report?.result) || (!requests || !missions) ? (
                                    <p>Loading...</p>
                                ) : (
                                    report?.result?.length ? report.result.length : 0
                                )}
                            </div>
                            <div className="title">{report?.title}</div>
                        </div>
                    </div>
                </div>
            </div>
        ))
    }

    const optionsRequest = [{ id: 1, value: 5 }, { id: 2, value: 10 }, { id: 3, value: 15 }]

    const theadRequest = [

        { key: 'id', name: 'شناسه' },
        { key: 'mosafer', name: 'مسافر' },
        ...([1, 2, 3, 9, 10, 16, 12, 13].includes(reportNum) ? [] : [{ key: 'driver', name: 'راننده' }]),

        ...([18, 9, 1, 2, 16, 12, 13, 6, 11, 8, 10].includes(reportNum) ? [] : [{ key: 'confirmedBy', name: 'تایید توسط' }]),

        ...([18, 9, 1, 3, 6, 11, 8, 10].includes(reportNum) ? [] : [{ key: 'rejectedBy', name: 'رد توسط' }]),

        ...([18, 9, 1, 2, 3, 16, 10, 12, 13].includes(reportNum) ? [] : [{ key: 'dispature', name: 'توزیع کننده' }]),

        { key: 'date', name: 'تاریخ', key2: 'fromdate', type: 'caleadar' },
        { key: 'fromPlace', name: 'مبدا' },
        { key: 'toPlace', name: 'مقصد' },
        { key: 'Fr_status', name: 'وضعیت' },
        // { key: 'endBeforeService', name: 'پایان سرویس قبلی', type: 'caleadar', key2: 'todate' },
    ]

    const clickOnRow = (item: any, type: any) => {
        console.log(20, item, type);
    }

    return (
        <>
            <div className="AmarRequest-component">
                <div className="row">
                    <div className="col-12">
                        {showDivDetailsRequest &&
                            <div className="details-div">
                                <i className='fa fa-remove close-fa' onClick={() => setShowDivDetailsRequest(false)}></i>
                                <div className="datagrid-div">
                                    {reportsDetails?.length > 0 &&

                                        <DataGrid
                                            clickOnRow={clickOnRow}
                                            pagesize={optionsRequest[0].value}
                                            items={reportsDetails}
                                            options={optionsRequest}
                                            thead={theadRequest}
                                        />

                                    }
                                    {reportsDetails?.length === 0 && <p>موردی برای نمایش وجود ندارد</p>}

                                </div>

                            </div>
                        }
                    </div>
                </div>
                <div className="row row-amar">
                    <div className="row">
                        {showAmar()}
                    </div>

                </div>
            </div>

        </>

    );
};

export default AmarRequest;