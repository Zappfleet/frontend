import { useEffect, useState } from 'react';
import './style.scss'
import useAuthentication from '../../hooks/data/useAuthentication.tsx';
import AmarRequest from './AmarRequest/AmarRequest.tsx';
import DispatureReport from './dispatureReport/DispatureReport.tsx';
import DarkhasthayeTafkikShode from './DarkhasthayeTafkikShode/DarkhasthayeTafkikShode.tsx';
import ReportDriverTrips from './ReportDriverTrips/ReportDriverTrips.tsx';
import MonthRequest from './MonthRequest/MonthRequest.tsx';
import AmarMissons from './AmarMisson/AmarMissons.tsx';
import { DB_ROLE_DRIVER_TITLE, DB_ROLE_MOSAFER_TITLE } from '../../lib/constants.ts';

const Dashboard = () => {

  const { authInfo } = useAuthentication();
  const [role, setRole] = useState<boolean>(false)

  const [showMore, setShowMore] = useState<boolean>(false)
  const [componentName, setComponentName] = useState<any>('')

  const handleShowMore = (componentName: any, status: boolean) => {
    setShowMore(status)
    setComponentName(componentName)
  }

  useEffect(() => {
    if (authInfo) {
      if (authInfo?.auth?.roles[0]?.title === DB_ROLE_DRIVER_TITLE) {
        setRole(false)
      } else {
        if (authInfo?.auth?.roles[0]?.title === DB_ROLE_MOSAFER_TITLE) {
          setRole(false)
        }
        else {
          setRole(true)
        }
      }
    }
  }, [authInfo])

  ////////////////////////////////////
  return <>
    {role === true && import.meta.env.VITE_SHOW_DASHBOARD !== 'false' &&
      <div className="Dashboard-component">

        {showMore && <>
          <div className="show-more-div">
            <i onClick={() => setShowMore(false)} className='fa fa-remove close-icon'></i>
            <div className="show-more-subdiv">

              {componentName === 'DispatureReport' && <DispatureReport />}
            </div>
          </div>
        </>
        }
        <div className="row">
          <div className="col-12">
            {/* داشبورد */}
          </div>
        </div>

        <div className="row">
          <AmarMissons />
        </div>

        <div className="row">
          <AmarRequest />
        </div>

        <div className="row">
          <div className="col-5">
            <div className="row">
              <div className="col-12">
                <DispatureReport count={5} handleShowMore={handleShowMore} />
              </div>
              <div className="col-12">
                <DarkhasthayeTafkikShode />
              </div>
            </div>
          </div>
          <div className="col-7">
            <div className="col-12">
              <ReportDriverTrips />
            </div>
          </div>
        </div>


        <div className="row">
          <div className="col-12">
            <MonthRequest />
          </div>
        </div>

      </div>
    }
    {role === true && import.meta.env.VITE_SHOW_DASHBOARD === 'false' &&
      <p>خوش آمدید</p>}
  </>
};

export default Dashboard;
