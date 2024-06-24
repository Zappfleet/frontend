import React, { useContext, useEffect, useState } from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { getStatsRequest, getStatsTrips } from '../../services/statsService';
import { getRequestCostManagerString, getRequestStatisticConstants, getRequestStatusString, getRequestStepString } from '../../utils/requestHelper';
import { getTripStatisticConstants, getTripStatusString } from '../../utils/tripHelper';
//import { ScrollArea, Table } from '@mantine/core';
//componenets
import Stats from './Stats';
//stylesheets
import statsStyles from './styles/Stats.module.css';
import styles from './styles/SystemManager.module.css';
import { getDarkColor } from '../../utils/colorHelper';
import { convertCarNameCode } from '../../utils/carHelper';
import { Modal } from '@mantine/core';
//import LoadingContainer from '../../components/hoc/loadingContainer';
import useSWR from 'swr';
import httpService from '../../services/httpService';
//import settings from "'../../../src/config";
import List from '../common/list';
import _ from 'lodash';
import { IsoToJalali, IsoToJalaliWithTime, timeToString } from '../../utils/dateTools';
import { Group, Text } from "@mantine/core";
//import LocationFilterModal from '../../components/location/locationFilterModal';
import { useNavigate } from 'react-router';
//import { HeightContext } from "../panel/panel";


const REQ_COLUMNS = [
    { path: "passenger.full_name", label: "مسافر" },
    { path: "locations.start.adr", label: "مبدا" },
    { path: "locations.finish.adr", label: "مقصد" },
    {
        content: (item: any) => {
            return (
                <Group>
                    <div>
                        <Text>{IsoToJalali(item?.for_date)}</Text>
                        <Text>{timeToString(item?.for_time)}</Text>
                    </div>
                </Group>
            );
        },
        path: "for_date",
        label: "تاریخ",
    },
    {
        content: (item: any) => {
            return getRequestStepString(item?.step);
        },
        path: "step",
        label: "فاز",
    },
];

const TRIP_COLUMNS = [
    {
        content: (item: any) => {
            return (
                <Text> {item?.passengers[0]?.full_name || "بدون سر نشین"}
                </Text>
            );
        },
        path: "passengers.full_name",
        label: "مسافر اول",
    },
    {
        content: (item: any) => {
            return (
                <Text> {item?.locations[0].start?.adr}
                </Text>

            );
        },
        path: "locations.start.adr",
        label: "مبدا",
    },
    {
        content: (item: any) => {
            return (
                <Text> {item?.locations[0].finish?.adr}
                </Text>
            );
        },
        path: "locations.finish.adr",
        label: "مقصد",
    },
    {
        content: (item: any) => {
            return <Text>{item?.driver?.user?.full_name}</Text>;
        },
        path: "driver.user.full_name",
        label: "راننده",
    },
    {
        content: (item: any) => {
            return (
                <Text>
                    <Group>
                        <div>
                            <Text>{IsoToJalali(item?.for_date)}</Text>
                            <Text>{timeToString(item?.for_time)}</Text>
                        </div>
                    </Group>
                </Text>
            );
        },
        path: "for_date",
        label: "درتاریخ",
    },
    {
        content: (item: any) => {
            return (
                <Text>
                    {item?.dispatcher[0]?.full_name}
                </Text>
            );
        },
        path: "dispatcher.full_name",
        label: "توزیع کننده",
    },
    {
        content: (item: any) => {
            return (
                <Text>
                    {IsoToJalaliWithTime(_.find(item?.timing, (t: any) => t.key === 1)?.value)}
                </Text>
            );
        },
        // path: "for_time",
        label: "زمان شروع راننده",
    },
    {
        content: (item: any) => {
            return (
                <Text>
                    {IsoToJalaliWithTime(_.findLast(item?.timing, (t: any) => t.key === 5)?.value)}
                </Text>
            );
        },
        // path: "end_time",
        label: "زمان پایان راننده",
    },
    {
        content: (item: any) => {
            return (
                <Text>
                    {IsoToJalaliWithTime(_.find(item?.timing, (t: any) => t.key === 2)?.value)}

                </Text>
            );
        },
        // path: "start_time_passenger",
        label: "زمان شروع مسافر",
    },
    {
        content: (item: any) => {
            return (
                <Text>
                    {IsoToJalaliWithTime(_.findLast(item?.timing, (t: any) => t.key === 3)?.value)}
                </Text>
            );
        },
        // path: "end_time_passenger",
        label: "زمان پایان مسافر",
    },
];


const AdmindDashboard = ({ isDispatcher }: any) => {

    //const height = useContext(HeightContext);

    const [stats, setStats] = useState<any>({});

    const [listDisplay, setListDisplay] = useState<any>(null);

    const navigate = useNavigate();


    useEffect(() => {
        async function fetchStats() {
            const resStatsRequest = await getStatsRequest();
            const resStatsTrips = await getStatsTrips();
            const newStat = {
                statsRequest: resStatsRequest?.data?.requests?.[0] || {},
                statsTrips: resStatsTrips?.data?.trips?.[0] || {}
            };
            setStats(newStat)
            console.log(333,newStat.statsRequest.by_area);
        }
        fetchStats();
    }, []);

    const getByCostCenterData = () => {
        if (!stats?.statsRequest?.by_cost_center) return { data: [], total: 0 };

        let t = 0;
        const data = stats.statsRequest.by_cost_center.map((item: any) => {
            t += item.total;
            return { title: item._id, value: item.total, color: getDarkColor() }
        })
        return { data, total: t }
    }

    const getByAreaData = () => {
        if (!stats?.statsRequest?.by_area) return { data: [], total: 0 };

        let t = 0;
        const data = stats.statsRequest.by_area.map((item: any) => {
            t += item.total;
            return { title: item.name, value: item.total, color: getDarkColor() }
        })
        return { data, total: t }
    }

    const getMonthlyData = () => {
        const options: any = {
            year: "numeric",
            month: "numeric",
        };
        if (!stats?.statsRequest?.by_date) return [];
        return stats.statsRequest.by_date.map((item: any) => {
            const d = new Date();
            d.setFullYear(item._id.year, item._id.month, 1);
            return {
                name: d.toLocaleDateString("fa-IR", options),
                تعداد: item.total,
            };
        });
    };


    const getDispatcherRequestData = () => {
        if (!stats?.statsRequest?.by_dispatcher) return [];
        return stats.statsRequest.by_dispatcher.map((item: any) => {
            return { name: item.full_name, تعداد: item.total };
        });
    };


    const getDispatcherTripData = () => {
        if (!stats?.statsTrips?.by_dispatcher) return [];
        return stats.statsTrips.by_dispatcher.map((item: any) => {
            return { name: item._id, تعداد: item.total };
        });
    };


    const tripByStats = () => {
        const arr = stats?.statsTrips?.by_status || [];
        return arr.map((item: any, index: any) => {
            const url = getTripStatisticConstants(item);
            return { title: "سفر " + getTripStatusString(item._id), body: item.total, url }
        })
    }

    const requestByStats = () => {
        const arr = stats?.statsRequest?.by_status || [];
        return arr.map((item: any, index: any) => {
            const url = getRequestStatisticConstants(item._id, isDispatcher ? "dispatcher" : "manager");
            return { title: "درخواست " + getRequestStatusString(item._id), body: item.total, url }
        })
    }

    const getStatisfactionOf = (driver_fullname: any) => {
        if (!driver_fullname) return "!";

        const driverStatisfactionItem = stats.statsTrips.by_satisfaction_rate.find(
            (item: any) => {
                return item._id == driver_fullname;
            }
        );
        return driverStatisfactionItem?.ave_rate || "#";
    };


    const handleOnClick = (url: any) => {
        if (url.includes("nav:")) {
            navigate(url.split(":")[1]);
        } else {
            setListDisplay(url);
        }
    }

    const renderDriversTable = () => {
        if (!stats?.statsTrips?.by_car) return "";
        return (
            <table>
                <thead>
                    <tr>
                        <th>راننده</th>
                        <th> خودرو</th>
                        <th>تعداد کل سفر</th>
                        <th>میانگین رضایت از راننده</th>
                    </tr>
                </thead>
                <tbody>
                    {stats.statsTrips.by_car.map((item: any) => {
                        if (!item?.driver) return "";
                        return (
                            <tr>
                                <td>{item.driver.user.full_name}</td>
                                <td>{convertCarNameCode(item?.car?.name_code)}</td>
                                <td>{item.total}</td>
                                <td>{getStatisfactionOf(item.driver.user.full_name)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    };


    const areaData = getByAreaData();
    const costCenterData = getByCostCenterData();

    return (
        <div className="container-fluid" >
            {/* style={{ height: `${height}` }}> */}
            <>
                <h2 className="text-center m-3">آمار در یک نگاه</h2>
                <div
                    className={`${styles.statsContainer} ${styles.barchartContainer} m-4`}
                >
                    {renderByStatusValues([...tripByStats(), ...requestByStats()], handleOnClick)}
                </div>
                <div
                    className={`${styles.statsContainer} ${styles.barchartContainer} m-4`}
                >
                    <h2 className="text-center m-3">آمار سفر رانندگان</h2>
                    {renderDriversTable()}
                </div>

                {!isDispatcher && (
                    <div className={`row ${styles.barchartContainer} m-3`}>
                        <div className="col-12 col-lg-6">
                            <h3 className="text-center m-3">سفر توزیع کننده</h3>
                            <div style={{ margin: 30 }}>
                                <BarChart
                                    width={400}
                                    height={250}
                                    data={getDispatcherTripData()}
                                >
                                    <XAxis dataKey="name" stroke="#333" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="تعداد" fill="#7251B2" barSize={8} radius={6} />
                                </BarChart>
                            </div>
                        </div>
                        <div className={`col-12 col-lg-6 `}>
                            <h3 className="text-center m-3">درخواست توزیع کننده</h3>
                            <div style={{ margin: 30 }}>
                                <BarChart
                                    width={400}
                                    height={250}
                                    data={getDispatcherRequestData()}
                                >
                                    <XAxis dataKey="name" stroke="#333" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="تعداد" fill="#F77564" barSize={8} radius={6} />
                                </BarChart>
                            </div>
                        </div>
                    </div>
                )}
                <div className="row m-3 justify-content-around">
                    <div className={` col-lg-5 ${styles.barchartContainer}`}>
                        <div className={styles.statsContainer}>
                            <h3 className="text-center m-3">
                                {isDispatcher
                                    ? "آمار روزانه درخواست ها"
                                    : "آمار ماهانه درخواست ها"}
                            </h3>
                            <div>
                                <BarChart width={500} height={250} data={getMonthlyData()}>
                                    <XAxis dataKey="name" stroke="#333" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="تعداد" fill="#37F564" barSize={8} radius={6} />
                                </BarChart>
                            </div>
                        </div>
                    </div>

                    <div className={` col-lg-5 ${styles.barchartContainer}`}>
                        <h3>نسبت درخواست</h3>
                        <br />
                        <h4 className="text-center m-3">به تفکیک محدوده</h4>
                        <div className={styles.piechartContainer}>
                            <div className={styles.piechartDetails}>
                                {areaData.data.map((item: any) => {
                                    return (
                                        <p
                                            style={{
                                                backgroundColor: item.color,
                                                color: "#E4DCF1",
                                                fontWeight: "bold",
                                                borderRadius: "4px",
                                                padding: "0.3rem",
                                                margin: "0.3rem",
                                                width: "150px",
                                            }}
                                        >
                                            {item?.title}{" "}
                                            {parseInt(((item.value as any) / (areaData.total as any) * 100).toString(), 10)}
                                            {/* {parseInt((item.value / areaData.total) * 100)}% */}
                                        </p>
                                    );
                                })}
                            </div>
                            <PieChart className={styles.piechart} data={areaData.data} />
                        </div>
                        <br />
                        <h4 className="text-center m-3">به تفکیک مرکز هزینه</h4>
                        <div className={styles.piechartContainer}>
                            <div className={styles.piechartDetails}>
                                {costCenterData.data.map((item: any) => {
                                    return (
                                        <p
                                            style={{
                                                backgroundColor: item.color,
                                                color: "#E4DCF1",
                                                fontWeight: "bold",
                                                borderRadius: "4px",
                                                padding: "0.3rem",
                                                margin: "0.3rem",
                                                width: "150px",
                                            }}
                                        >
                                            {item?.title}{" "}
                                            {parseInt(((item.value as any) / (areaData.total as any) * 100).toString(), 10)}
                                            {/* {parseInt((item.value / costCenterData.total) * 100)}% */}
                                        </p>
                                    );
                                })}
                            </div>
                            <PieChart
                                className={styles.piechart}
                                data={costCenterData.data}
                            />
                        </div>
                    </div>
                </div>

            </>

            <ListDisplayModal listDisplay={listDisplay} setListDisplay={setListDisplay} />
        </div>
    );

};

function ListDisplayModal({ listDisplay, setListDisplay }: any) {

    const isTrip = listDisplay?.includes("/trip");

    const [sortColumn, setSortColumn] = useState({});

    const onSort = (sortColumn: any) => {
        setSortColumn(sortColumn);
    };

    const renderList = () => {
        if (listDisplay == null) return "";
        return <p> list</p>

        // <List
        //     size={"full"}
        //     url={listDisplay}
        //     hideFilter={false}
        //     onSort={onSort}
        //     loading={false}
        //     // filterModal={<LocationFilterModal />}
        //     columns={isTrip ? TRIP_COLUMNS : REQ_COLUMNS}
        //     sortColumn={sortColumn}
        //     onRowClick={() => { }}
        //     mutateSignal={0}
        // />
    }

    return <p>Modal</p>
    
    // <Modal
    //     opened={listDisplay != null}
    //     size={"full"}
    //     onClose={() => setListDisplay(null)}
    //     title="">
    //     <div>
    //         {renderList()}
    //     </div>
    // </Modal>;
}

function renderByStatusValues(values: any, onClick: any) {
    if (values == null) return "";
    return <div className={statsStyles.statsContainer}>
        {values.map((item: any) => {
            return <Stats onClick={onClick} key={item._id} statsDetails={item} section="آمار روزانه" />
        })}
    </div>
}

export default AdmindDashboard;