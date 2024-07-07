import { useState } from 'react';
import './style.scss'
import TabbedPanel from '../../components/TabbedPanel/TabbedPanel';
import AgencyReport from './AgencyReport/AgencyReport';
import DriverReport from './AgencyReport/DriverReport';
import DriverReportDetails from './AgencyReport/DriverReportDetails';
import { Title } from '@mantine/core';
import TimeOfServices from './TimeOfServices/TimeOfServices';
import CountOfServicesOfDrivers from './CountOfServicesOfDrivers/CountOfServicesOfDrivers';
import RestOfDriverBetweenServises from './RestOfDriverBetweenServises/RestOfDriverBetweenServises';
import DriverList_By_LastServiceAdnDistanse from './DriverList_By_LastServiceAdnDistanse/DriverList_By_LastServiceAdnDistanse';

export default function Reports() {
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [reportTitle, setReportTitle] = useState<any>('');
  const [reportcomponentName, setReportcomponentName] = useState<any>('');

  const reports = [
    { Title: 'گزارش هزینه آژانس ها', componentName: 'AgencyReport' },
    { Title: 'گزارش روزانه رانندگان', componentName: 'DriverReport' },
    { Title: 'ریز گزارش رانندگان', componentName: 'DriverReportDetails' },
    { Title: 'گزارش مدت زمان هر سرویس', componentName: 'TimeOfServices' },
    { Title: 'دسترسی به تعداد سرویس های انجام شده توسط رانندگان در بازه زمانی مشخص', componentName: 'CountOfServicesOfDrivers' },
    { Title: 'گزارش میزان استراحت هر راننده بین سرویس ها', componentName: 'RestOfDriverBetweenServises' },
    { Title: 'گزارش لیست رانندگان بر اساس آخرین زمان سرویس و مسافت', componentName: 'DriverList_By_LastServiceAdnDistanse' },
    // {Title:'', componentName:''},

  ]
  const handleButtonClick = (item: any) => {
    setIsReportOpen(true);
    setReportTitle(item.Title)
    setReportcomponentName(item.componentName)
  };

  const handleBackClick = () => {
    setIsReportOpen(false);
    setReportTitle('')
    setReportcomponentName('')
  }

  const renderReport = () => {
   
    switch (reportcomponentName) {
      case 'AgencyReport':
        return <AgencyReport handleBackClick={handleBackClick} title={reportTitle}/>;
      case 'DriverReport':
        return <DriverReport handleBackClick={handleBackClick} title={reportTitle} />;
      case 'DriverReportDetails':
        return <DriverReportDetails handleBackClick={handleBackClick} title={reportTitle} />;
      case 'TimeOfServices':
        return <TimeOfServices handleBackClick={handleBackClick} title={reportTitle} />
      case 'CountOfServicesOfDrivers':
        return <CountOfServicesOfDrivers handleBackClick={handleBackClick} title={reportTitle} />
      case 'RestOfDriverBetweenServises':
        return <RestOfDriverBetweenServises handleBackClick={handleBackClick} title={reportTitle} />
      case 'DriverList_By_LastServiceAdnDistanse':
        return <DriverList_By_LastServiceAdnDistanse handleBackClick={handleBackClick} title={reportTitle} />
    }
  };
  return (
    <>
      <div className="reports-component">
        {isReportOpen ? (
          renderReport()
        ) : (
          <>
            {reports.map((item: any) => {
              return <div className='item'>
                <button onClick={() => handleButtonClick(item)}> {item.Title} </button>
              </div>
            })}
          </>

        )}

        {/* <div className="row">
          <div className="col-12">
            <div> <p>'هزینه آژانس ها' </p></div>
          </div>
        </div> */}
        {/* <div className="">
        <TabbedPanel
          tabs={[
            {
              label: 'هزینه آژانس ها',
              key: 'agency_costs',
              component: (
                <div className="scroller content-height-md">
                  <AgencyReport />
                </div>
              ),
            },
            {
              label: 'روزانه ی رانندگان',
              key: 'drivers_daily',
              component: (
                <div className="content-height-md">
                  <DriverReport />
                </div>
              ),
            },
            {
              label: 'ریز گزارش رانندگان',
              key: 'drivers_detailed',
              component: (
                <div className="content-height-md">
                  <DriverReportDetails />
                </div>
              ),
            },
          ]}
        />
      </div> */}

      </div>
    </>
  );
}
