import { memo, Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";

import Layout from "../components/Layout";
import { links } from "../static/links";

const DashboardOutlet = () => {
  const isAuth = !!localStorage.getItem("user");

  return isAuth ? (
    <Navigate to={links.workspace} />
  ) : (
    <Navigate to={links.login} />
  );
};
export default memo(DashboardOutlet);
