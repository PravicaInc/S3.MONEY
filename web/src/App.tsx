import React, { FC, lazy, Suspense, useEffect } from "react";
import styles from "./app.module.css";
import { Route, Routes, useLocation } from "react-router-dom";
import Loading from "./components/Loading";
import { AppHeader } from "./components/AppHeader";
import { Providers } from "./providers.tsx";
import { useCurrentWallet } from "@mysten/dapp-kit";
import { PAGES_URLS } from "./utils/const.ts";
import { Sidebar } from "./components/Sidebar";

const SignIn = lazy(() => import("./views/SignIn"));
const UserTypeSelection = lazy(() => import("./views/UserTypeSelection"));
const Home = lazy(() => import("./views/Home"));

const App: FC = () => {
  return (
    <Providers>
      <div className={styles.app}>
        <AppHeader />
        <AppMain />
      </div>
    </Providers>
  );
};

export default App;

const AppMain: FC = () => {
  const { isConnected } = useCurrentWallet();
  const { pathname } = useLocation();
  const sidebarEnabled = !pathname.includes("/onboarding") && isConnected;

  useEffect(() => {
    if (!sidebarEnabled) {
      document.title = `S3 - Onboarding`;
    }
  }, [sidebarEnabled]);

  return (
    <div className={styles.main}>
      {sidebarEnabled && <Sidebar />}
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path={PAGES_URLS.home} element={isConnected ? <Home /> : <SignIn />} />
          {isConnected && (
            <>
              <Route path={PAGES_URLS.userTypeSelection} element={<UserTypeSelection />} />
            </>
          )}
        </Routes>
      </Suspense>
    </div>
  );
};
