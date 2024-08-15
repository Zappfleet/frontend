import { useState } from 'react';
import './style.scss'
import TabbedPanel from '../../components/TabbedPanel/TabbedPanel';
import AganceRegister from './aganceRegister/AganceRegister';
import CardSalahiyat from './cardSalahiyat/CardSalahiyat';
import Dabirkhane from './dabirkhane/Dabirkhane';
import { Title } from '@mantine/core';
import Estehamhaye3gane from './estehamhaye3gane/Estehamhaye3gane';
import EstelamAmaken from './estelamAmaken/EstelamAmaken';
import RegisterMoayeneFani from './registerMoayeneFani/RegisterMoayeneFani';
import RegisterTarefeAvarez from './registerTarefeAvarez/RegisterTarefeAvarez';
import SodureParvane from './sodureParvane/SodureParvane';
import AganceDriver from './aganceDriver/AganceDriver';
import AganceProfile from './aganceProfile/AganceProfile'



export default function AganceItems() {
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [reportTitle, setReportTitle] = useState<any>('');
  const [reportcomponentName, setReportcomponentName] = useState<any>('');

  const reports = [
    { Title: 'ثبت آژانس', componentName: 'aganceRegister' },
    { Title: 'صدور پروانه آژانس', componentName: 'SodureParvane' },
    { Title: 'ثبت راننده', componentName: 'AganceDriver' },
    { Title: 'صدور کارت صلاحیت', componentName: 'cardSalahiyat' },
    { Title: 'استعلام های 3 گانه (تایید گواهینامه ، تشخیص هویت ، مرکز بهداشت)', componentName: 'estehamhaye3gane' },
    { Title: 'استعلام اداره اماکن', componentName: 'estelamAmaken' },
    { Title: 'ثبت تعرفه عوارض', componentName: 'registerTarefeAvarez' },
    { Title: 'ثبت مرکز معاینه فنی', componentName: 'registerMoayeneFani' },
    { Title: 'دبیر خانه', componentName: 'dabirkhane' },
   { Title: 'پروفایل', componentName: 'aganceProfile' },
  ]
  const handleButtonClick = (item: any) => {

   // console.log(122, item.Title);

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
      case 'aganceRegister':
        return <AganceRegister handleBackClick={handleBackClick} title={reportTitle} />;
      case 'AganceDriver':
        return <AganceDriver handleBackClick={handleBackClick} title={reportTitle} />;
      case 'cardSalahiyat':
        return <CardSalahiyat handleBackClick={handleBackClick} title={reportTitle} />;
      case 'dabirkhane':
        return <Dabirkhane handleBackClick={handleBackClick} title={reportTitle} />;
      case 'estehamhaye3gane':
        return <Estehamhaye3gane handleBackClick={handleBackClick} title={reportTitle} />
      case 'estelamAmaken':
        return <EstelamAmaken handleBackClick={handleBackClick} title={reportTitle} />
      case 'registerMoayeneFani':
        return <RegisterMoayeneFani handleBackClick={handleBackClick} title={reportTitle} />
      case 'registerTarefeAvarez':
        return <RegisterTarefeAvarez handleBackClick={handleBackClick} title={reportTitle} />
      case 'SodureParvane':
        return <SodureParvane handleBackClick={handleBackClick} title={reportTitle} />
      case 'aganceProfile':
        return <AganceProfile handleBackClick={handleBackClick} title={reportTitle} />

    }
  };
  return (
    <>
      <div className="AganceItems-component">
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
