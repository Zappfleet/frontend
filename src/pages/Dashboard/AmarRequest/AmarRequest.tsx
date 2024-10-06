import React, { useEffect, useState } from 'react';
import './style.scss'
import { MODE_AREAL } from '../../../lib/constants.ts';
import useRequests from '../../../hooks/data/useRequests.tsx';
import DataGrid from '../../../components/DataGrid/DataGrid.tsx';
import { isArray } from 'lodash';
import { requestStatus } from '../../../lib/string.ts';
import ErrorBoundary from '../../../components/ErrorBoundary/ErrorBoundary.tsx';

const AmarRequest = () => {

    const { requests }: any = useRequests({
        mode: MODE_AREAL,
        initialParams: { status: '', paging: false },
    })
    const [UpdatedRequests, setUpdatedRequests] = useState([]);

    useEffect(() => {
        // console.log(4, requests);
        requests && isArray(requests) &&  updatedArr(requests)
        showAmarRequests()
    }, [requests])


    let updatedArr = (requests: any) => {
        // تبدیل آرایه به یک آبجکت برای دسترسی سریع‌تر
        const statusMap = Object.fromEntries(requestStatus);

        const newRequest = requests?.map((item: any) => {
            console.log(78, statusMap[item.status]);
            return {
                ...item,
                Fr_status: statusMap[item.status] || item.status,  // جایگزینی مقدار status
            };
        });

        setUpdatedRequests(newRequest)
    }

    const [showDivDetailsRequest, setShowDivDetailsRequest] = useState<boolean>(false)

    const [statusRequest, setStatusRequest] = useState<any>()
    const showRequest = (statusRequest: any) => {
        setStatusRequest(statusRequest)
        setShowDivDetailsRequest(true)
    }

    const showAmarRequests = () => {
        const statusType = ["PENDING", "REJECT", "CONFIRM", "ASSIGNED_TO_MISSION"]//, "HIDDEN"]
        const titles = ["درخواست در انتظار", "درخواست رد شده", "درخواست تایید شده", "درخواست دیده شده"]
        const icons = ["fas fa-exchange-alt", "fas fa-user-times", "fas fa-file-edit", "fas fa-eye"]

        const result = statusType.map((status: any, index: any) => {
            const items = isArray(requests) ? requests?.filter((r: any) => r.status === status) : []


            //  if (index < 4) {
            return (<div key={index} className="col-6 col-md-3">
                <div className="row">
                    <div className="box" onClick={() => showRequest(status)}>
                        <div className="col-4 right-div">
                            <i className={` ${icons[index]} icon icon${(index % 4) + 1}`} />
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
        { key: 'Fr_status', name: 'وضعیت' },
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
                                {requests?.filter((request: any) => request.status === statusRequest)?.length > 0 &&
                                     
                                        <DataGrid
                                            pagesize={optionsRequest[0].value}
                                            items={UpdatedRequests?.filter((request: any) => request.status === statusRequest)}
                                            options={optionsRequest}
                                            thead={theadRequest}
                                        />
                                     
                                }
                                {requests?.filter((request: any) => request.status === statusRequest)?.length === 0 && <p>موردی برای نمایش وجود ندارد</p>}

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