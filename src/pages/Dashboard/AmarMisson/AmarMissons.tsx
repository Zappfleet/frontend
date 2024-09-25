import React, { useEffect, useState } from 'react';
import '../AmarRequest/style.scss'
import { MODE_AREAL } from '../../../lib/constants.ts';
import DataGrid from '../../../components/DataGrid/DataGrid.tsx';
import useMissions from '../../../hooks/data/useMissions.tsx';
import { isArray } from 'lodash';

const AmarMissons = () => {


    const { missions }: any = useMissions({
        mode: MODE_AREAL,
        status: '',
        paging: false,
    })

    useEffect(() => {
        //   console.log(96, missions);

    }, [missions])

    const [showDivDetailsMission, setShowDivDetailsMission] = useState<boolean>(false)
    const [statusMission, setStatusMission] = useState<any>()

    const showAmarMissions = () => {
        const statusType = ["DRAFT", "PUBLISHED", /*"READY",*/ "ON_ROUTE", "DONE"]//, "HIDDEN"]
        const titles = ["سفر در انتظار", "سفر اختصاص داده شده", /*"سفر در انتظار شروع", */ "سفر در حال انجام", "سفر انجام شده"]

        const result = statusType.map((status: any, index: any) => {

            const items = missions && isArray(missions?.data) && missions?.data?.filter((r: any) => r.status === status)

            if (index < 4) {
                return (<div key={index} className="col-6 col-md-3">
                    <div className="row">
                        <div className="box" onClick={() => showMission(status)}>
                            <div className="col-4 right-div">
                                <img className={`icon icon${(index % 4) + 1}`} src={`./images/${(index % 4) + 1}.png`} />
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

    const showMission = (status: any) => {
        setStatusMission(statusMission)
        setShowDivDetailsMission(true)
    }

    const optionsMission = [{ id: 1, value: 5 }, { id: 2, value: 10 }, { id: 3, value: 15 }]
    const theadMission = [
        // { key: 'id', name: 'شناسه' },
        { key: '_id', name: 'شناسه' },
        { key: 'status', name: 'وضعیت' },
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
                                <DataGrid
                                    pagesize={optionsMission[0].value}
                                    items={missions}
                                    options={optionsMission}
                                    thead={theadMission}
                                />
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