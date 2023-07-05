import { memo } from "react";
import Header from "./Header";
import SideBar from "./SideBar";
import { Box, Hidden } from "@mui/material";
import { makeStyles } from "@mui/styles";
import MainSideBar from "./SideBar/MainSideBar";
import { useSelector } from "react-redux";

const Layout = ({ children, layoutConfig = {} }) => {
  // const location = useLocation();
  const classes = useStyles();
  // const path = location.pathname;
  // const excludedPaths = [links.workspace, "/add/project"];
  const sideWidth = useSelector((state) => state.projectTaskSlice.sidebarWidth);
  const settingsWidth = useSelector(
    (state) => state.projectTaskSlice.settingSide
  );

  return (
    <Box component="main" className={classes.MainContainer}>
      {layoutConfig?.header && (
        <Box className="w-full fixed top-0 left-0 right-0 z-50">
          <Header />
        </Box>
      )}
      <Box className="flex flex-1 flex-grow pt-[40px] overflow-auto">
        {layoutConfig?.isMainSideBar ? (
          <div
            className=" flex flex-col flex-shrink-0  sidebarMenu-section"
            style={{ width: sideWidth }}
          >
            <MainSideBar className="fixed h-full" />
          </div>
        ) : (
          <div
            className="flex flex-col flex-shrink-0  sidebarMenu-section"
            style={{ width: settingsWidth }}
          >
            <SideBar className="fixed h-full" />
          </div>
        )}
        <Box className="flex flex-col flex-1 flex-grow overflow-auto">
          <Box className="h-[100vh] w-full overflow-y-auto">{children}</Box>
        </Box>
      </Box>
    </Box>
  );
};

export default memo(Layout);

const useStyles = makeStyles({
  MainContainer: {
    height: "100vh",
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
  },
});
