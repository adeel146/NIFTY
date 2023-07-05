import Layout from "components/Layout";
import SplashScreen from "components/SplashScreen";
import { useAuth } from "hooks/useAuth";
import { Suspense, useEffect, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { links } from "static/links";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { onWorkspaceGetByIdSuccess } from "redux/actions";
import { useGetWorkspaceById } from "hooks/Workspace";
import { useSelector } from "react-redux";

const AuthGuard = ({ permission, layoutConfig, children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const auth = useAuth();

  const [workspaceId, setWorkspaceId] = useState(null);
  const storedWorkspaceId = localStorage.getItem("workspaceId") || null;
  useLayoutEffect(() => {
    if (storedWorkspaceId) {
      setWorkspaceId(storedWorkspaceId);
    } else {
      setWorkspaceId(null);
      localStorage.removeItem("workspaceId");
    }
  }, [storedWorkspaceId, setWorkspaceId]);

  const workspaceResponse = useGetWorkspaceById({
    id: workspaceId,
    enabled: !!workspaceId,
  });
  useEffect(() => {
    if (workspaceResponse?.workspaceResponse?.data) {
      dispatch(
        onWorkspaceGetByIdSuccess(
          workspaceResponse?.workspaceResponse?.data?.data?.data
        )
      );
    }
  }, [workspaceResponse?.workspaceResponse, dispatch]);
  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate(links.login);
    } else {
      setIsAuthChecked(true);
    }
  }, [auth.isAuthenticated, navigate]);

  if (!isAuthChecked) {
    return <SplashScreen />;
  }

  if (layoutConfig) {
    return (
      <Suspense fallback={<SplashScreen />}>
        <Layout layoutConfig={layoutConfig}>{children}</Layout>
      </Suspense>
    );
  }

  return <Suspense fallback={<SplashScreen />}>{children}</Suspense>;
};

export default AuthGuard;

AuthGuard.propTypes = {
  children: PropTypes.node,
  permission: PropTypes.string,
  layoutConfig: PropTypes.any,
};
