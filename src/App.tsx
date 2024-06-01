import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import ECommerce from './pages/Dashboard/ECommerce';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Loader from './common/Loader';
import routes from './routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { sendEnvToAndroidClient } from './pages/Authentication/utils';
import useNavigationMenu from './hooks/useNavigationMenu';
const DefaultLayout = lazy(() => import('./layout/DefaultLayout/DefaultLayout'));

function App() {
  const navigatioMenu = useNavigationMenu();

  useEffect(() => {
    sendEnvToAndroidClient();
  }, []);

  return (
    <>
      <ToastContainer style={{ zIndex: 10000000 }} />
      <Routes>
        <Route path="/auth/signin" element={<SignIn />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route element={<DefaultLayout />}>
          <Route index element={<ECommerce />} />
          {routes
            .filter(({ path }) => {
              return navigatioMenu?.find(({ href }: any) => {
                console.log('D');
                return path == href || `${path}/` == href || path == `${href}/`;
              });
            })
            .map(({ path, component: Component }) => (
              <Route
                path={path}
                key={path}
                element={
                  <Suspense fallback={<Loader />}>
                    <Component />
                  </Suspense>
                }
              />
            ))}
        </Route>
      </Routes>
    </>
  );
}

export default App;
