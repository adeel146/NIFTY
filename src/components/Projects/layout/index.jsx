import React, { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProjectOutlet() {
  return (
    <Suspense fallback="loading....">
      <Layout>
        <Outlet />
      </Layout>
    </Suspense>
  );
}

export default ProjectOutlet;

const Layout = ({ children }) => {
  return (
    <>
      <p>Header tabs</p>
      {children}
    </>
  );
};
