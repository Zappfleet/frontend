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
import { useEffect, useState } from 'react';
import { MODE_AREAL } from '../../lib/constants.ts';

import './style.scss'
import DataGrid from '../../components/DataGrid/DataGrid.tsx';

const Dashboard = () => {


  const { requests }: any = useRequests({
    mode: MODE_AREAL,
    initialParams: { status: '', paging: false },
  })

  const [showDivDetails, setShowDivDetails] = useState<boolean>(false)
  const [status, setStatus] = useState<any>()

  useEffect(() => {
    console.log(100, requests);
  }, [requests])

  const showRequest = (status: any) => {
    setStatus(status)
    setShowDivDetails(true)

  }

  const showAmar = () => {
    const statusType = ["PENDING", "CANCEL_USER", "REJECT", "CONFIRM", "SEEN", "ASSIGNED_TO_MISSION"]//, "HIDDEN"]
    const titles = ["درخواست در انتظار", "درخواست لغو شده", "درخواست رد شده", "درخواست تایید شده", "درخواست دیده شده", "درخواست اختصاص یافته"]
    const result = statusType.map((status: any, index: any) => {
      const items = requests?.filter((r: any) => r.status === status)
      console.log(500, items, status, requests?.length);

      return <div className="col-6 col-md-3">
        <div className="box" onClick={() => showRequest(status)}>
          <div className="title">{titles[index]}</div>
          {/* <i className="fas fa-analytics"></i> */}
          <div className="count">{items?.length}</div>
        </div>
      </div>
    })
    return result
  }

  const options = [{ id: 1, value: 5 }, { id: 2, value: 10 }, { id: 3, value: 15 }]
  const thead = [
    // { key: 'id', name: 'شناسه' },
    { key: '_id', name: 'شناسه' },
    { key: 'status', name: 'وضعیت' },

    // { key: 'endBeforeService', name: 'پایان سرویس قبلی', type: 'caleadar', key2: 'todate' },

  ]

  return <> <div className="Dashboard-component">
    <div className="row">
      {requests?.length > 0 && showAmar()}

      {showDivDetails &&
        <div className="details-div">
          <i className='fa fa-remove close-fa' onClick={() => setShowDivDetails(false)}></i>
          <div className="datagrid-div">
            <DataGrid
              pagesize={options[0].value}
              items={requests?.filter((r: any) => r.status === status)}
              options={options}
              thead={thead}
            />
          </div>

        </div>

      }
    </div>
  </div>

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
