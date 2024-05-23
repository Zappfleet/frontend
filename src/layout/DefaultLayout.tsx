import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import useAuthentication from '../hooks/data/useAuthentication';
import Loader from '../common/Loader';
import { LOGIN_PAGE } from '../lib/constants';

const DefaultLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { authInfo } = useAuthentication();
  const navigate = useNavigate();


  useEffect(() => {
    if (authInfo != null && authInfo.auth == null) {
      navigate(LOGIN_PAGE)
    }
  }, [authInfo])

  if (authInfo?.auth == null) return <Loader />

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen overflow-hidden">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* <!-- ===== Header Start ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div
              style={{
                paddingTop: "5rem"
              }}
              className="mx-auto max-w-screen-2xl pb-4 px-4 md:p-6 2xl:p-10 content-height">
              <Outlet />
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
  );
};

export default DefaultLayout;
