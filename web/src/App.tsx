import React, { FC, lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useCurrentWallet } from '@mysten/dapp-kit';

import { Providers } from './providers.tsx';
import { AppHeader } from './components/AppHeader';
import Loading from './components/Loading';
import { Sidebar } from './components/Sidebar';
import { PAGES_URLS } from './utils/const.ts';

import styles from './app.module.css';

const SignIn = lazy(() => import('./views/SignIn'));
const UserTypeSelection = lazy(() => import('./views/UserTypeSelection'));
const Home = lazy(() => import('./views/Home'));

const App: FC = () => (
  <Providers>
    <AppMain />
  </Providers>
);

export default App;

const AppMain: FC = () => {
  const [isConnecting, toggleConnecting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => toggleConnecting(false), 1000);

    return () => clearTimeout(timer);
  }, []);

  return isConnecting
    ? (
      <Loading />
    )
    : (
      <AppMainRoutes />
    );
};
const AppMainRoutes: FC = () => {
  const navigate = useNavigate();
  const { isConnected } = useCurrentWallet();
  const { pathname } = useLocation();
  const sidebarEnabled = !pathname.includes('/onboarding') && isConnected;

  console.log('isConnected', isConnected);

  useEffect(() => {
    if (!sidebarEnabled) {
      document.title = 'S3 - Onboarding';
    }
  }, [sidebarEnabled]);

  useEffect(() => {
    if (!isConnected) {
      navigate(PAGES_URLS.signIn);
    }
  }, [isConnected]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <div className={styles.main}>
        {sidebarEnabled && <Sidebar />}
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path={PAGES_URLS.signIn} element={<SignIn />} />
            {isConnected && (
              <>
                <Route path={PAGES_URLS.home} element={<Home />} />
                <Route path={PAGES_URLS.userTypeSelection} element={<UserTypeSelection />} />
              </>
            )}
          </Routes>
        </Suspense>
      </div>
    </div>
  );
};
