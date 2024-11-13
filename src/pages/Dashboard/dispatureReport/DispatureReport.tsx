import React, { useEffect, useState } from 'react';
import './style.scss';
import BarChart from '../../../components/Charts/BarChart/BarChart';
import useRequests from '../../../hooks/data/useRequests';
import { MODE_AREAL } from '../../../lib/constants';
import useRegions from '../../../hooks/data/useRegions';
import useUsers from '../../../hooks/data/useUsers';
import useRoles from '../../../hooks/data/useRoles';
import { isArray } from 'lodash';
import ErrorBoundary from '../../../components/ErrorBoundary/ErrorBoundary';
import useMissions from '../../../hooks/data/useMissions';

interface Dispatcher {
    full_name: string;
}

interface Region {
    _id: string;
    dispatcher?: Dispatcher;
}

interface Request {
    area?: string;
    submitted_by?: string;
}

interface User {
    _id: string;
    roles: string[];
}

const DispatureReport = ({ count, handleShowMore }: any) => {
    const [chartDataTrip, setChartDataTrip] = useState<number[]>([]);
    const [chartDataRequest, setChartDataRequest] = useState<number[]>([]);
    const [chartLable, setChartLable] = useState<string[]>([]);



    const { requests }: any = useRequests({
        mode: MODE_AREAL,
        initialParams: { status: '', paging: false },
    });

    const { missions }: any = useMissions({
        mode: MODE_AREAL,
        initialParams: { status: '', paging: false },
    });

    // const { regions }: { regions: Region[] } = useRegions();
    const { userList }: { userList: any[] } = useUsers();

    useEffect(() => {


        // if (!Array.isArray(requests?.docs) || !Array.isArray(userList) || !Array.isArray(regions)) {
        //     return;
        // }

        let requestCountForDispature: Record<string, number> = {};
        let tripCountOfDispature: Record<string, number> = {};

        isArray(requests) && requests?.forEach((request: Request) => {
            // let area = request?.area;
            let submitted_by: any = request?.submitted_by;

            // let isDispature = false;
            //  if (submitted_by) {
            //     userList?.forEach((user: User) => {
            //         user?.roles?.forEach((role: string) => {
            //             if (user._id === submitted_by && role === '663f7ec2665933a1316d2697') {
            //                 isDispature = true;
            //             }
            //         });
            //     });
            // }

            //   if (isDispature && submitted_by) {
            requestCountForDispature[submitted_by] = (requestCountForDispature[submitted_by] || 0) + 1;
            //  }

            // if (area) {
            //     let area_id = area;
            //     requestCountForDispature[area_id] = (requestCountForDispature[area_id] || 0) + 1;
            // }
        });

        isArray(requests) && requests?.forEach((request: Request) => {
            let submitted_by: any = request?.submitted_by;
            tripCountOfDispature[submitted_by] = (tripCountOfDispature[submitted_by] || 0) + 1;
        })


        let myLable: string[] = [];
        let myData_tripCountOfDispature: number[] = [];
        let myData_requestCountForDispature: number[] = [];

        Object.keys(tripCountOfDispature)?.forEach((ite: string) => {
            let user = userList?.find((r: any) => r._id === ite);
            let dispatureName = user?.full_name;

            if (dispatureName && !myLable.includes(dispatureName)) {
                myLable.push(dispatureName);
            }
            myData_tripCountOfDispature.push(tripCountOfDispature[ite]);
        });

        Object.keys(requestCountForDispature)?.forEach((ite: string) => {
            let user = userList?.find((r: any) => r._id === ite);
            let dispatureName = user?.full_name;

            if (dispatureName && !myLable.includes(dispatureName)) {
                myLable.push(dispatureName);
            }

            myData_requestCountForDispature.push(requestCountForDispature[ite]);
        });


        setChartDataTrip(count && myData_tripCountOfDispature.length > count ? myData_tripCountOfDispature.slice(0, count) : myData_tripCountOfDispature);
        setChartDataRequest(count && myData_requestCountForDispature.length > count ? myData_requestCountForDispature.slice(0, count) : myData_requestCountForDispature);
        setChartLable(count && myLable.length > count ? myLable.slice(0, count) : myLable);

    }, [requests, missions, userList]);

    const data = {
        labels: chartLable,
        datasets: [
            {
                label: 'درخواست های ارجاع شده',
                data: chartDataRequest,
                backgroundColor: '#8C72DD',
                borderColor: '#8C72DD',
                borderWidth: 1,
            },
            {
                label: 'سفر های ثبت شده',
                data: chartDataTrip,
                backgroundColor: '#52C8FD',
                borderColor: '#52C8FD',
                borderWidth: 1,
            }
        ],
    };

    return (
        <div className='DispatureReport-component'>
            <div className="row">
                <div className="col-12">
                    <div className="title">
                        {`گزارش توزیع کننده`}
                        <div className="showmore">
                            {chartLable.length > count && <span onClick={() => handleShowMore('DispatureReport', true)}> مشاهده بیشتر</span>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="chart">
                <div className="row">
                    <div className="col-12">
                        <BarChart data={data} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DispatureReport;
