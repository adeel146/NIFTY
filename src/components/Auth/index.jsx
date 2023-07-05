import { Navigate, Outlet } from "react-router-dom";
import { memo, Suspense } from "react";
import { useAuth } from "../../hooks/useAuth";
import SplashScreen from "../SplashScreen";

const Auth = () => {
  const auth = useAuth();

  if (auth.isAuthenticated) return <Navigate to={"/"} />;
  return (
    <Suspense fallback={<SplashScreen />}>
      <Outlet />
    </Suspense>
  );
};
export default memo(Auth);
