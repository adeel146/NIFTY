import Layout from "components/Layout";
import SplashScreen from "components/SplashScreen";
import { useAuth } from "hooks/useAuth";
import { Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { links } from "static/links";
import PropTypes from "prop-types";

const GuestGuard = ({ permission, layoutConfig, children }) => {
  const navigate = useNavigate();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const auth = useAuth();
  const workSpace = localStorage.getItem("workspaceId");

  useEffect(() => {
    if (permission === "anyone") {
       setIsAuthChecked(true);
    } else if (auth.isAuthenticated && !workSpace) {
      navigate(links.workspace);
    } else if (auth.isAuthenticated) {
      navigate(links.myWork);
    } else {
      setIsAuthChecked(true);
    }
  }, [auth.isAuthenticated, navigate, workSpace, permission]);

  if (!isAuthChecked) {
    return <SplashScreen />;
  }

  if (!!layoutConfig) {
    return (
      <Suspense fallback={<SplashScreen />}>
        <Layout layoutConfig={layoutConfig}>{children}</Layout>
      </Suspense>
    );
  }

  return <Suspense fallback={<SplashScreen />}>{children}</Suspense>;
};

export default GuestGuard;

GuestGuard.propTypes = {
  children: PropTypes.node,
  permission: PropTypes.string,
  layoutConfig: PropTypes.any,
};
