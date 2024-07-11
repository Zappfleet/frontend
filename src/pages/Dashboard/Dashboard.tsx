import CardFour from '../../components/CardFour.tsx';
import CardOne from '../../components/CardOne.tsx';
import CardThree from '../../components/CardThree.tsx';
import CardTwo from '../../components/CardTwo.tsx';
import ChartOne from '../../components/ChartOne.tsx';
import ChartThree from '../../components/ChartThree.tsx';
import ChartTwo from '../../components/ChartTwo.tsx';
import ChatCard from '../../components/ChatCard.tsx';
import MapOne from '../../components/MapOne.tsx';
import TableOne from '../../components/TableOne.tsx';
import AdmindDashboard from '../../old/component/dashboard/adminDashboard.tsx';
import useRequests from '../../hooks/data/useRequests.tsx';
import useMissions from '../../hooks/data/useMissions.tsx';

import { useEffect, useState } from 'react';
import { MODE_AREAL } from '../../lib/constants.ts';

import './style.scss'
import DataGrid from '../../components/DataGrid/DataGrid.tsx';
import useReportCountOfServices from '../../hooks/data/reports/useReportCountOfServices.tsx';
import { persianDateToGregorian } from '../../utils/utils.ts';
import moment from 'jalali-moment';
import useAuthentication from '../../hooks/data/useAuthentication.tsx';

const Dashboard = () => {

  const { authInfo } = useAuthentication();
  const [role, setRole] = useState<boolean>(false)
  const { missionList: driversList } = useReportCountOfServices("DONE", persianDateToGregorian(moment(new Date()).format('jYYYY/jMM/jDD')), persianDateToGregorian('1303/4/6'));


  useEffect(() => {
    if (authInfo) {
      if (authInfo.auth.roles[0].title === 'راننده') {
        setRole(false)
      } else {
        if (authInfo.auth.roles[0].title === 'مسافر') {
          setRole(false)
        }
        else {
          setRole(true)
        }
      }

    }
  }, [authInfo])
  //////////mission
  const { missions }: any = useMissions({
    mode: MODE_AREAL,
    status: '',
    paging: false,
  })

  useEffect(() => {
   // console.log(100, missions);
  }, [missions])

  const [showDivDetailsMission, setShowDivDetailsMission] = useState<boolean>(false)
  const [statusMission, setStatusMission] = useState<any>()

  const showMission = (status: any) => {
    setStatusMission(statusMission)
    setShowDivDetailsMission(true)
  }

  const showAmarMissions = () => {
    const statusType = ["DRAFT", "PUBLISHED", "READY", "ON_ROUTE", "DONE"]//, "HIDDEN"]
    const titles = ["درخواست در انتظار", "سفر اختصاص داده شده", "سفر در انتظار شروع", "سفر در حال انجام", "سفر انجام شده"]
    const result = statusType.map((status: any, index: any) => {
      const items = missions?.data?.filter((r: any) => r.status === status)
      // console.log(500, items, status, requests?.length);

      return <div key={index} className="col-6 col-md-2">
        <div className="box" onClick={() => showMission(status)}>
          <div className="title">{titles[index]}</div>
          {/* <i className="fas fa-analytics"></i> */}
          <div className="count">{items?.length}</div>
        </div>
      </div>
    })
    return result
  }

  const optionsMission = [{ id: 1, value: 5 }, { id: 2, value: 10 }, { id: 3, value: 15 }]
  const theadMission = [
    // { key: 'id', name: 'شناسه' },
    { key: '_id', name: 'شناسه' },
    { key: 'status', name: 'وضعیت' },
    // { key: 'endBeforeService', name: 'پایان سرویس قبلی', type: 'caleadar', key2: 'todate' },
  ]


  /////////////////////////Request

  const { requests }: any = useRequests({
    mode: MODE_AREAL,
    initialParams: { status: '', paging: false },
  })

  const [showDivDetailsRequest, setShowDivDetailsRequest] = useState<boolean>(false)
  const [statusRequest, setStatusRequest] = useState<any>()

  useEffect(() => {
    // console.log(100, requests);
  }, [requests])

  const showRequest = (status: any) => {
    setStatusRequest(statusRequest)
    setShowDivDetailsRequest(true)
  }


  const showAmarRequests = () => {
    const statusType = ["PENDING", "CANCEL_USER", "REJECT", "CONFIRM", "SEEN", "ASSIGNED_TO_MISSION"]//, "HIDDEN"]
    const titles = ["درخواست در انتظار", "درخواست لغو شده", "درخواست رد شده", "درخواست تایید شده", "درخواست دیده شده", "درخواست اختصاص یافته"]
    const result = statusType.map((status: any, index: any) => {
      const items = requests?.filter((r: any) => r.status === status)
      //console.log(500, items, status, requests?.length);

      return <div key={index} className="col-6 col-md-2">
        <div className="box" onClick={() => showRequest(status)}>
          <div className="title">{titles[index]}</div>
          {/* <i className="fas fa-analytics"></i> */}
          <div className="count">{items?.length}</div>
        </div>
      </div>
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

  ////////////////////////Drivers
  const optionsDrivers = [{ id: 1, value: 10 }, { id: 2, value: 30 }, { id: 3, value: 50 }]
  const theadDrivers = [
    // { key: 'id', name: 'شناسه' },
    { key: 'name', name: 'راننده' },
    { key: 'countOfServices', name: 'تعداد سرویس' },
    // { key: 'startDate', name: 'تاریخ شروع ', type: 'caleadar', key2: 'fromdate' },
    // { key: 'endDate', name: 'تاریخ پایان', type: 'caleadar', key2: 'todate' },
  ]

  useEffect(() => {
  }, [driversList])

  ////////////////////////////////////
  return <>
    {role === true &&
      <div className="Dashboard-component">
        <div className="row">
          <div className="col-12">
            {showDivDetailsRequest &&
              <div className="details-div">
                <i className='fa fa-remove close-fa' onClick={() => setShowDivDetailsRequest(false)}></i>
                <div className="datagrid-div">
                  <DataGrid
                    pagesize={optionsRequest[0].value}
                    items={requests?.filter((r: any) => r.status === status)}
                    options={optionsRequest}
                    thead={theadRequest}
                  />
                </div>

              </div>
            }
            {showDivDetailsMission &&
              <div className="details-div">
                <i className='fa fa-remove close-fa' onClick={() => setShowDivDetailsMission(false)}></i>
                <div className="datagrid-div">
                  <DataGrid
                    pagesize={optionsMission[0].value}
                    items={missions?.data?.filter((r: any) => r.status === status)}
                    options={optionsMission}
                    thead={theadMission}
                  />
                </div>

              </div>
            }
          </div>
        </div>
        <div className="row">
          <p> آمار سفر ها</p>
          {missions?.data?.length > 0 && showAmarMissions()}
        </div>

        <div className="row">
          <p>   آمار درخواست ها</p>
          {requests?.length > 0 && showAmarRequests()}
        </div>


        {/* <div className="row">
        <div className="col-12">
          <p>آمار سفر رانندگان</p>
          {driversList?.data?.length > 0 &&
            <DataGrid
              pagesize={optionsDrivers[0].value}
              items={driversList?.data?.length > 0 ? driversList?.data : []}
              options={optionsDrivers}
              thead={theadDrivers}
            />
          }
        </div>
      </div> */}

      </div>
    }

    {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <CardOne />
      <CardTwo />
      <CardThree />
      <CardFour />
    </div> */}

    {/* <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
      <ChartOne />
      <ChartTwo />
      <ChartThree />
      <MapOne />
      <div className="col-span-12 xl:col-span-8">
        <TableOne />
      </div>
      <ChatCard />
    </div> */}
  </>
};

export default Dashboard;
