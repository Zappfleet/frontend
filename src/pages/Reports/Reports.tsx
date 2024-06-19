import TabbedPanel from '../../components/TabbedPanel/TabbedPanel';
import AgencyReport from './AgencyReport/AgencyReport';
import DriverReport from './AgencyReport/DriverReport';
import DriverReportDetails from './AgencyReport/DriverReportDetails';

export default function Reports() {
  return (
    <div className="">
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
    </div>
  );
}
