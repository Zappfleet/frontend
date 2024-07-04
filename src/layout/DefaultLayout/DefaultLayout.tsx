import './style.scss'
import { useState, useEffect } from 'react';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import useAuthentication from '../../hooks/data/useAuthentication';
import Loader from '../../common/Loader';
import { LOGIN_PAGE } from '../../lib/constants';
import Main from '../Main/Main';
import Footer from '../Footer/Footer';
import SendCurrentLocations from '../../hooks/useCurrentLocations/SendCurrentLocations';
import GetPassengerNotification from '../../hooks/usePassengerNotification/GetPassengerNotification';
import useVehicles from '../../hooks/data/useVehicles';
import useSocket from '../../hooks/useSocket';
import { NotificationController } from '../../lib/notificationController';

const DefaultLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState<any>(false);
  const { authInfo } = useAuthentication();
  const { vehicles } = useVehicles();
  const navigate = useNavigate();
  const [permitForSendLocation, setPermitForSendLocation] = useState<boolean>(false);
  const [vehicleID, setVehicleID] = useState<any>(undefined);
  const [isPassenger, setIsPassenger] = useState<any>(undefined);

  useEffect(() => {
    if (authInfo != null && authInfo.auth == null) {
      navigate(LOGIN_PAGE);
    } else {
      //console.log(555, authInfo?.auth?._id);

      try {
        setIsPassenger(authInfo?.auth?.roles?.some((x: any) => x._id === '663902a12733b1e14bcde2f4'));
      } catch {
        setIsPassenger(undefined);
      }
      try {
        const vehicle = vehicles?.docs?.find((ite: any) => ite.driver_user?.id === authInfo?.auth?._id);
        setVehicleID(vehicle ? vehicle._id : undefined);
      } catch {
        setVehicleID(undefined);
      }
    }
  }, [authInfo, vehicles, navigate]);

  //////////listen to notification

  const [payload, setPayload] = useState<any>(null)

  useEffect(() => {
    console.log('Received notification:', payload?.userIDs, authInfo?.auth?._id);
    if (payload && authInfo?.auth?._id) {
      if (payload.userIDs === authInfo?.auth?._id) {
        NotificationController.showSuccess(payload.massage)
      }
    }
  }, [payload, authInfo?.auth?._id])

  const handleGetNotification = (payload: any) => {
    setPayload(payload)
  }

  const socket = useSocket({
    listeners: {
      sendNotification: handleGetNotification,
    },
  });
  /////////////////////////////////////////

  if (authInfo?.auth == null) return <Loader />

  return (
    <>
      <div className="container-fluid DefaultLayout-component">
        <div className="row row-header">
          <div className="col-12">
            <i onClick={() => setSidebarOpen(!sidebarOpen)} className='button-bars fa fa-bars d-block d-sm-none'></i>
            <Header />
          </div>
        </div>
        <div className="row have-sidebar">
          {/* //mobile */}
          <div className="col-8 handleShowSidebar" style={{ display: sidebarOpen === true ? 'block' : 'none' }}>
            <Sidebar />
          </div>
          <div className="col-3 d-none d-sm-block">
            <Sidebar />
          </div>
          <div className="col-12 col-md-9">
            {vehicleID && <SendCurrentLocations vehicleID={vehicleID} />}
            <Main />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default DefaultLayout;
