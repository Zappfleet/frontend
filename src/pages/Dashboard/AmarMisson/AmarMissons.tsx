import React, { useEffect, useState } from 'react';
import '../AmarRequest/style.scss'
import { MODE_AREAL } from '../../../lib/constants.ts';
import DataGrid from '../../../components/DataGrid/DataGrid.tsx';
import useMissions from '../../../hooks/data/useMissions.tsx';
import { isArray } from 'lodash';
import { missionStatus } from '../../../lib/string.ts';
import ErrorBoundary from '../../../components/ErrorBoundary/ErrorBoundary.tsx';

const AmarMissons = () => {


    const { missions }: any = useMissions({
        mode: MODE_AREAL,
        status: '',
        paging: false,
    })

    const [UpdatedMissions, setUpdatedMissions] = useState([]);

    useEffect(() => {
        console.log(96, missions);
        missions && missions?.data && isArray(missions?.data) && updatedArr(missions?.data)
    }, [missions])


    let updatedArr = (missions: any) => {
        // تبدیل آرایه به یک آبجکت برای دسترسی سریع‌تر
        const statusMap = Object.fromEntries(missionStatus);
        console.log(12, missions);

        const newMisions = missions?.map((item: any) => {
            return {
                ...item,
                Fr_status: statusMap[item.status] || item.status,  // جایگزینی مقدار status
            };
        });

        setUpdatedMissions(newMisions)
    }

    const [showDivDetailsMission, setShowDivDetailsMission] = useState<boolean>(false)
    const [statusMission, setStatusMission] = useState<any>()

    const showAmarMissions = () => {
        const statusType = ["DRAFT", "PUBLISHED", /*"READY",*/ "ON_ROUTE", "DONE"]//, "HIDDEN"]
        const titles = ["سفر در انتظار", "سفر اختصاص داده شده", /*"سفر در انتظار شروع", */ "سفر در حال انجام", "سفر انجام شده"]
        const icons = ["fas fa-user-check", "fas fa-taxi", "fas fa-road", "fas fa-check-circle"]

        const result = statusType.map((status: any, index: any) => {

            const items = missions && isArray(missions?.data) ? missions?.data?.filter((r: any) => r.status === status) : []
            console.log(44, status, items);

            if (index < 4) {
                return (<div key={index} className="col-6 col-md-3">
                    <div className="row">
                        <div className="box" onClick={() => showMission(status)}>
                            <div className="col-4 right-div">
                                <i className={` ${icons[index]} icon icon${(index % 4) + 1}`} />
                            </div>
                            <div className="col-8 left-div">
                                <div className="count">{items?.length ? items?.length : 0}</div>
                                <div className="title">{titles[index]}</div></div>
                        </div>
                    </div>
                </div>)
            }
        })

        return result
    }

    const showMission = (statusMission: any) => {

        setStatusMission(statusMission)
        setShowDivDetailsMission(true)
    }

    const optionsMission = [{ id: 1, value: 5 }, { id: 2, value: 10 }, { id: 3, value: 15 }]
    const theadMission = [
        // { key: 'id', name: 'شناسه' },
        { key: '_id', name: 'شناسه' },
        { key: 'Fr_status', name: 'وضعیت' },
        // { key: 'endBeforeService', name: 'پایان سرویس قبلی', type: 'caleadar', key2: 'todate' },
    ]

    return (

        <div className="AmarRequest-component">
            <div className="row">
                <div className="col-12">
                    {showDivDetailsMission &&
                        <div className="details-div">
                            <i className='fa fa-remove close-fa' onClick={() => setShowDivDetailsMission(false)}></i>
                            <div className="datagrid-div">
                                {missions?.data?.filter((mission: any) => mission.status === statusMission)?.length > 0 &&

                                    <DataGrid
                                        pagesize={optionsMission[0].value}
                                        items={UpdatedMissions?.filter((mission: any) => mission.status === statusMission)}
                                        options={optionsMission}
                                        thead={theadMission}
                                    />

                                }
                                {missions?.data?.filter((mission: any) => mission.status === statusMission)?.length === 0 && <p>موردی برای نمایش وجود ندارد</p>}
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div className="row row-amar">
                {showAmarMissions()}
            </div>
        </div>
    );
};

export default AmarMissons;