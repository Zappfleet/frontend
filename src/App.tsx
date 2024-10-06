import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import ECommerce from './pages/Dashboard/Dashboard';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Loader from './common/Loader';
import routes from './routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { sendEnvToAndroidClient } from './pages/Authentication/utils';
import useNavigationMenu from './hooks/useNavigationMenu';

import './CustomForCustomer/CustomStyle/zarghan/style.scss'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import Profile from './pages/Profile/Profile';

const DefaultLayout = lazy(() => import('./layout/DefaultLayout/DefaultLayout'));

function App() {

  const navigatioMenu = useNavigationMenu();

  useEffect(() => {
    sendEnvToAndroidClient();
  }, []);

  return (
    <>
      <div className={import.meta.env.VITE_CUSTOMER_NAME}>

        <ToastContainer style={{ zIndex: 10000000 }} />
        <ErrorBoundary>
          <Routes>
            <Route path="/auth/signin" element={<ErrorBoundary><SignIn /></ErrorBoundary>} />
            <Route path="/auth/signup" element={<ErrorBoundary><SignUp /></ErrorBoundary>} />
            <Route element={<DefaultLayout />}>
              <Route index element={<ErrorBoundary><ECommerce /></ErrorBoundary>} />
              {routes
                .filter(({ path }) => {
                  return navigatioMenu?.find(({ href }: any) => {
                     // console.log(123,'D', path);
                    return path == href || `${path}/` == href || path == `${href}/`;
                  });
                })
                .map(({ path, component: Component }) => (
                  <Route
                    path={path}
                    key={path}
                    element={
                      <Suspense fallback={<Loader />}>

                        <ErrorBoundary>
                          <Component />
                        </ErrorBoundary>

                      </Suspense>
                    }
                  />
                ))}
            </Route>
          </Routes>
        </ErrorBoundary>
      </div>
    </>
  );
}

export default App;
