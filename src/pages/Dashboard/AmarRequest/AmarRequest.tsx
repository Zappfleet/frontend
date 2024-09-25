import React, { useEffect, useState } from 'react';
import './style.scss'
import { MODE_AREAL } from '../../../lib/constants.ts';
import useRequests from '../../../hooks/data/useRequests.tsx';
import DataGrid from '../../../components/DataGrid/DataGrid.tsx';
import { isArray } from 'lodash';

const AmarRequest = () => {

    const { requests }: any = useRequests({
        mode: MODE_AREAL,
        initialParams: { status: '', paging: false },
    })

    useEffect(() => {
        // console.log(4, requests);

        showAmarRequests()
    }, [requests])

    const [showDivDetailsRequest, setShowDivDetailsRequest] = useState<boolean>(false)

    const [statusRequest, setStatusRequest] = useState<any>()
    const showRequest = (status: any) => {
        setStatusRequest(statusRequest)
        setShowDivDetailsRequest(true)
    }

    const showAmarRequests = () => {
        const statusType = ["PENDING", "REJECT", "CONFIRM", "ASSIGNED_TO_MISSION"]//, "HIDDEN"]
        const titles = ["درخواست در انتظار", "درخواست رد شده", "درخواست تایید شده", "درخواست دیده شده"]
        const result = statusType.map((status: any, index: any) => {
            const items = isArray(requests)? requests?.filter((r: any) => r.status === status):[]


            //  if (index < 4) {
            return (<div key={index} className="col-6 col-md-3">
                <div className="row">
                    <div className="box" onClick={() => showRequest(status)}>
                        <div className="col-4 right-div">
                            <img className={`icon icon${(index % 4) + 1}`} src={`./images/${(index % 4) + 1}.png`} />
                        </div>
                        <div className="col-8 left-div">
                            <div className="count">{items?.length ? items?.length : 0}</div>
                            <div className="title">{titles[index]}</div></div>
                    </div>
                </div>
            </div>)
            //   }
        })

        return result
    }

    const optionsRequest = [{ id: 1, value: 5 }, { id: 2, value: 10 }, { id: 3, value: 15 }]
    const theadRequest = [
        // { key: 'id', name: 'شناسه' },
        { key: '_id', name: 'شناسه' },
        { key: 'status', name: 'وضعیت' },
        // { key: 'endBeforeService', name: 'پایان سرویس قبلی', type: 'caleadar', key2: 'todate' },
    ]

    return (

        <div className="AmarRequest-component">
            <div className="row">
                <div className="col-12">
                    {showDivDetailsRequest &&
                        <div className="details-div">
                            <i className='fa fa-remove close-fa' onClick={() => setShowDivDetailsRequest(false)}></i>
                            <div className="datagrid-div">
                                <DataGrid
                                    pagesize={optionsRequest[0].value}
                                    items={isArray(requests) && requests?.filter((r: any) => r.status === status)}
                                    options={optionsRequest}
                                    thead={theadRequest}
                                />
                            </div>

                        </div>
                    }
                </div>
            </div>
            <div className="row row-amar">
                {showAmarRequests()}
            </div>
        </div>
    );
};

export default AmarRequest;