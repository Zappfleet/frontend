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

const DefaultLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState<any>(false);

  const { authInfo } = useAuthentication();
  const navigate = useNavigate();


  useEffect(() => {
    if (authInfo != null && authInfo.auth == null) {
      navigate(LOGIN_PAGE)
    }
  }, [authInfo])

  if (authInfo?.auth == null) return <Loader />


  //const [sidebarDisplay, setSidebarDisplay] = useState(false)
  // const handleShowSidebar = () => {
  //   setSidebarDisplay(!sidebarDisplay)
  // }

  //  // close on click outside
  //  useEffect(() => {
  //   const clickHandler = ({ target }: MouseEvent) => {
  //     if (!sidebar.current || !trigger.current) return;
  //     if (
  //       !sidebarOpen ||
  //       sidebar.current.contains(target) ||
  //       trigger.current.contains(target)
  //     )
  //       return;
  //     setSidebarOpen(false);
  //   };
  //   document.addEventListener('click', clickHandler);
  //   return () => document.removeEventListener('click', clickHandler);
  // });

  // // close if the esc key is pressed
  // useEffect(() => {
  //   const keyHandler = ({ keyCode }: KeyboardEvent) => {
  //     if (!sidebarOpen || keyCode !== 27) return;
  //     setSidebarOpen(false);
  //   };
  //   document.addEventListener('keydown', keyHandler);
  //   return () => document.removeEventListener('keydown', keyHandler);
  // });

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
          <div className="col-8 handleShowSidebar"
            style={{ display: sidebarOpen === true ? 'block' : 'none' }}
          >
            <Sidebar />
          </div>

          <div className="col-3 d-none d-sm-block">
            <Sidebar />
          </div>
          <div className="col-12 col-md-9">
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
