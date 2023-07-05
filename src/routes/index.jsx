import { lazy, memo, useMemo } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { links } from "../static/links";
import ErrorBoundary from "./ErrorBoundary";
import NotFound from "./NotFound";
import Scroller from "./Scroller";
import PortfolioCardsView from "components/Main/portfolio/PortfolioCardsView";
import CalendarArea from "components/KanBan/CalendarArea";
import ProfileSettingView from "components/Main/profileSettings/ProfileSettingView";
// import Kanban_Board from "components/KanBan/Kanban_Board";
import SelectedWorkspace from "components/Workspace/SelectedWorkspace";
import HomeMain from "components/Main/homeDashboard/dashboard/HomeMain";
import BillingView from "components/Workspace/billing/BillingView";
import AdsWorkspaceView from "components/Workspace/workspaceAds-on/AdsWorkspaceView";

import AddPorfolioScreen from "components/Main/portfolio/AddPorfolioScreen";
import GuestGuard from "guards/GuestCard";
import AuthGuard from "guards/AuthGuard";

import General_Settings from "components/WorkSpaces/General_Settings";
import Security_Settings from "components/WorkSpaces/Security_Settings";
import SecuritySettingView from "components/Main/profileSettings/SecuritySettingView";
import AppCenterView from "components/Main/profileSettings/AppCenterView";
import Members_Permissions from "components/WorkSpaces/Members_Permissions";
import DashboardOutlet from "./DashboardOutlet";
import ProjectOutlet from "components/Projects/layout";
import SyncfusionGanttChart from "./roadMap";
import MyWork from "components/MyWork";
import NotificationSettingView from "components/Main/profileSettings/NotificationSettingView";
import InviteLinkCard from "components/WorkSpaces/Members_Permissions/InviteLinkCard";
import AllTasks from "components/Layout/AllTasks";
import DuplicateProject from "components/Main/DuplicateProject";
import ChangeRequest from "components/ChangeRequest";
import ProjectOverview from "./projectsOverview";
import ProjectsOverview from "./projectsOverview";
import WorkLoads from "./workLoads";
// PUBLIC ROUTES
const Login = lazy(() => import("../components/Auth/Login"));
const Signup = lazy(() => import("../components/Auth/Signup"));
const Verify = lazy(() => import("../components/Auth/Verify"));
const ProfileSetup = lazy(() => import("../components/Auth/ProfileSetup"));

// PRIVATE ROUTES
const Main = lazy(() => import("../components/Main"));
const Workspace = lazy(() => import("../components/Workspace"));
const Projects = lazy(() => import("../components/Projects"));

const dashboardLayoutConfig = {
  sideBar: true,
  header: true,
  footer: false,
  isMainSideBar: true,
};

const settingLayoutConfig = {
  sideBar: true,
  header: true,
  footer: false,
  isMainSideBar: false,
};

const mainLayoutConfig = {
  sideBar: false,
  header: false,
  footer: false,
};

const AppRoutes = () => {
  const navigation = useMemo(
    () => [
      {
        id: "home",
        path: links.home,
        permission: "admin",
        element: <Navigate to={links.workspace} />,
        layoutConfig: null,
      },
      {
        id: "timeline",
        path: links.timeline,
        permission: "admin",
        element: <SyncfusionGanttChart />,
        layoutConfig: dashboardLayoutConfig,
      },
      {
        id: "workspaces",
        path: links.workspace,
        permission: "admin",
        element: <Workspace />,
        layoutConfig: null,
      },
      {
        id: "workspace_detail",
        path: links.workspaceDetails,
        permission: "admin",
        element: <SelectedWorkspace />,
        layoutConfig: settingLayoutConfig,
      },
      {
        id: "dashboard",
        path: links.dashboard,
        permission: "admin",
        element: <HomeMain />,
        layoutConfig: dashboardLayoutConfig,
      },
      {
        id: "my_work",
        path: links.myWork,
        permission: "admin",
        element: <MyWork />,
        layoutConfig: dashboardLayoutConfig,
      },
      {
        id: "projects-overview",
        path: links.projectsOverview,
        permission: "admin",
        element: <ProjectsOverview />,
        layoutConfig: dashboardLayoutConfig,
      },
      {
        id: "workLoads",
        path: links.workLoads,
        permission: "admin",
        element: <WorkLoads />,
        layoutConfig: dashboardLayoutConfig,
      },
      {
        id: "duplicate_project",
        path: links.projectDuplicate,
        permission: "admin",
        element: <DuplicateProject />,
        layoutConfig: dashboardLayoutConfig,
      },
      {
        id: "all_tasks",
        path: links.allTasks,
        permission: "admin",
        element: <AllTasks />,
        layoutConfig: dashboardLayoutConfig,
      },
      {
        id: "calender",
        path: links.calendar,
        permission: "admin",
        element: <CalendarArea />,
        layoutConfig: dashboardLayoutConfig,
      },
      {
        id: "portfolio",
        path: `${links.portfolio}/:id`,
        permission: "admin",
        element: <PortfolioCardsView />,
        layoutConfig: dashboardLayoutConfig,
      },
      {
        id: "profileSettings",
        path: links.profileSettings,
        permission: "admin",
        element: <ProfileSettingView />,
        layoutConfig: settingLayoutConfig,
      },
      {
        id: "billing",
        path: links.billing,
        permission: "admin",
        element: <BillingView />,
        layoutConfig: settingLayoutConfig,
      },
      {
        id: "workspace-on",
        path: links.workspaceAdsOn,
        permission: "admin",
        element: <AdsWorkspaceView />,
        layoutConfig: settingLayoutConfig,
      },
      {
        id: "securitySettings",
        path: links.profileSecuritySettings,
        permission: "admin",
        element: <SecuritySettingView />,
        layoutConfig: settingLayoutConfig,
      },
      {
        id: "appCenter",
        path: links.appCenter,
        permission: "admin",
        element: <AppCenterView />,
        layoutConfig: settingLayoutConfig,
      },
      {
        id: "add-profile",
        path: links.addWorkspaceProject,
        permission: "admin",
        element: <AddPorfolioScreen />,
        layoutConfig: dashboardLayoutConfig,
      },
      {
        id: "update-project",
        path: links.updateWorkspaceProject,
        permission: "admin",
        element: <AddPorfolioScreen />,
        layoutConfig: dashboardLayoutConfig,
      },
      {
        id: "project-home",
        path: links.projectHome,
        permission: "admin",
        element: <Projects />,
        layoutConfig: dashboardLayoutConfig,
      },
      {
        id: "login",
        path: links.login,
        permission: "guest",
        element: <Login />,
        layoutConfig: null,
      },
      {
        id: "signup",
        path: links.signup,
        permission: "guest",
        element: <Signup />,
        layoutConfig: null,
      },
      {
        id: "verify",
        path: `${links.verify}/:email`,
        permission: "guest",
        element: <Verify />,
        layoutConfig: null,
      },
      {
        id: "profile-setup",
        path: links.profileSetup,
        permission: "anyone",
        element: <ProfileSetup />,
        layoutConfig: null,
      },
      {
        id: "general-settings",
        path: links.generalSettings,
        permission: "admin",
        element: <General_Settings />,
        layoutConfig: settingLayoutConfig,
      },
      {
        id: "security-settings",
        path: links.securitySettings,
        permission: "admin",
        element: <Security_Settings />,
        layoutConfig: settingLayoutConfig,
      },
      {
        id: "workspace-members_&_permissions",
        path: links.membersPermissions,
        permission: "admin",
        element: <Members_Permissions />,
        layoutConfig: settingLayoutConfig,
      },
      {
        id: "notification-setting",
        path: links.notificationSettings,
        permission: "admin",
        element: <NotificationSettingView />,
        layoutConfig: settingLayoutConfig,
      },
      {
        id: "invite-link",
        path: links.inviteCard,
        permission: "admin",
        element: <InviteLinkCard />,
        layoutConfig: null,
      },
      {
        id: "change-request",
        path: links.addChageRequest,
        permission: "admin",
        element: <ChangeRequest />,
        layoutConfig: dashboardLayoutConfig,
      },
      {
        id: "change-request-edit",
        path: links.addChageRequestEdit,
        permission: "admin",
        element: <ChangeRequest />,
        layoutConfig: dashboardLayoutConfig,
      },
    ],
    [links]
  );

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Scroller>
          <Routes>
            {navigation.map((val) => {
              if (val.permission === "guest" || val.permission === "anyone") {
                return (
                  <Route
                    key={val.id}
                    element={
                      <GuestGuard
                        permission={val.permission}
                        layoutConfig={val.layoutConfig}
                      >
                        {val.element}
                      </GuestGuard>
                    }
                    path={val.path}
                  />
                );
              }
              return (
                <Route
                  key={val.id}
                  element={
                    <AuthGuard
                      permission={val.permission}
                      layoutConfig={val.layoutConfig}
                    >
                      {val.element}
                    </AuthGuard>
                  }
                  path={val.path}
                />
              );
            })}
            <Route element={<NotFound />} path={links.notFound} />
          </Routes>
        </Scroller>
      </BrowserRouter>
    </ErrorBoundary>
  );
};
export default memo(AppRoutes);
