import { memo, Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Layout from "../components/Layout";
import { links } from "../static/links";
import { useAuth } from "../hooks/useAuth";
import SplashScreen from "../components/SplashScreen";

const PrivateOutlet = () => {
  const auth = useAuth();

  return auth?.isAuthenticated ? (
    <Suspense fallback={<SplashScreen />}>
      <Layout>
        <Outlet />
      </Layout>
    </Suspense>
  ) : (
    <Navigate to={links.login} />
  );
};
export default memo(PrivateOutlet);
