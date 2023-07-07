import "../Header.css";
import { useNavigate, useLocation } from "react-router";
import { Input } from "@mui/material";
import SideBarPortfolio from "./sideBarPortfolio";
import { openPortfolio } from "redux/reducers/portfolio";
import { useDispatch } from "react-redux";
import AddPortfolioDialog from "components/Main/portfolio/AddPortfolioDialog";
import { links } from "static/links";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ExploreIcon from "@mui/icons-material/Explore";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EventNoteIcon from "@mui/icons-material/EventNote";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AddIcon from "@mui/icons-material/Add";
import ChatTab from "./ChatTab";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";

import { closeSidebarWidth, openSidebarWidth } from "redux/actions";
import { useSelector } from "react-redux";
function MainSideBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation().pathname;
  const [favouriteShow, setFavouriteShow] = useState(false);
  const sideWidth = useSelector((state) => state.projectTaskSlice.sidebarWidth);

  const [selected, setSelected] = useState("PROJECTS");
  const [isActive, setIsActive] = useState(false);
  const tabList = [
    {
      name: "PROJECTS",
    },
    {
      name: "CHAT",
    },
  ];
  console.log(location, "location");
  return (
    <div className="flex relative flex-auto">
      {/* show and hide sidebar start */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          dispatch(closeSidebarWidth());
          setIsActive(true);
        }}
        // onClick={handleClick}
        className="onClick-btn absolute z-[20] cursor-pointer -right-[11px] top-[5px] w-[22px] h-[22px] bg-[#9399AB] rounded-full text-[#fff] flex justify-center"
      >
        <div className="btn btn-sidebar-collapse text-white text-[16px] relative left-[2px] -top-[2px]">
          {sideWidth === "60px" ? (
            <div
              className="cursor-pointer text-[16px]"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(openSidebarWidth());
                setIsActive(false);
              }}
            >
              <ArrowForwardIosIcon sx={{ fontSize: "14px" }} />
            </div>
          ) : (
            <ArrowBackIosIcon sx={{ fontSize: "14px" }} />
          )}
        </div>
      </div>

      {/* end sidebar show and hide */}

      <div className="w-full min-w-0 z-10">
        <div className="sidebar_collapse w-[auto] bg-[#fefefe] border-[#f6f8fc] border-r flex flex-[0_0_auto] flex-col z-20  text-[#9399AB] h-[100vh] overflow-auto">
          <div
            className="relative flex flex-col  bg-[#fefefe] pb-11 "
            id="sidebar"
          >
            <div className={isActive ? "smallMenu-icons" : ""}>
              <div className="items-center flex h-16 py-0 px-5 flex-[0_0_auto]">
                <h2 className="font-bold text-2xl">Dashboard</h2>
              </div>
              <div className=" flex-[0_0_auto]">
                <div className="flex flex-col pt-0">
                  <div className=" px-0 relative">
                    <div
                      onClick={() => navigate(links.projectsOverview)}
                      className={` ${
                        location === "/projects-overview" ? "active" : ""
                      } flex space-x-2 border-[#eee] border-b items-center hover:text-[#333] py-3 pl-[1.3rem] cursor-pointer`}
                    >
                      <WorkspacesIcon sx={{ fontSize: "18px" }} />
                      <h2 className="text-[14px] font-semibold">Analysis</h2>
                    </div>
                    {/* <div
                      onClick={() => navigate(links.workLoads)}
                      className="flex space-x-2 border-[#eee] border-b items-center hover:text-[#333] py-3 pl-[1.3rem] cursor-pointer"
                    >
                      <BarChartOutlinedIcon sx={{ fontSize: "18px" }} />
                      <h2 className="text-[14px] font-semibold">WorkLoads</h2>
                    </div> */}
                    <div
                      className={`${
                        location === "/workLoads" ? "active" : ""
                      } flex space-x-2 border-[#eee] border-b py-3 pl-[1.3rem] hover:text-[#333] items-center cursor-pointer`}
                      onClick={() => navigate(links.workLoads)}
                    >
                      <AssignmentIcon sx={{ fontSize: "18px" }} />
                      <h2 className="text-[14px] font-semibold">WorkLoads</h2>
                    </div>
                    <div
                      className={`${
                        location === "/calendar" ? "active" : ""
                      } flex space-x-2 border-[#eee] border-b py-3 pl-[1.3rem] hover:text-[#333] items-center cursor-pointer`}
                      onClick={() => navigate(links.calendar)}
                    >
                      <EventNoteIcon sx={{ fontSize: "18px" }} />
                      <h2 className="text-[14px] font-semibold">Calendar</h2>
                    </div>
                    <div
                      className={` ${
                        location === "/all/tasks" ? "active" : ""
                      } flex space-x-2 hover:text-[#333] border-[#eee] border-b py-3 pl-[1.3rem] items-center cursor-pointer`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(links.allTasks);
                      }}
                    >
                      <FormatListBulletedIcon sx={{ fontSize: "18px" }} />
                      <h2 className="text-[14px] font-semibold">All Tasks</h2>
                    </div>
                    <div
                      className={` ${
                        location === "/my/work" ? "active" : ""
                      } flex space-x-2 border-[#eee] border-b py-3 hover:text-[#333] pl-[1.3rem] items-center cursor-pointer`}
                      onClick={(e) => {
                        navigate(links.myWork);
                      }}
                    >
                      <PersonOutlineIcon sx={{ fontSize: "18px" }} />
                      <h2 className="text-[14px] font-semibold">My Work</h2>
                    </div>
                  </div>
                  {/* <div
                    className="py-2 pl-[1.3rem] border-[#eee] border-b hover:text-[#333] cursor-pointer flex items-center "
                    onClick={() => setFavouriteShow(!favouriteShow)}
                  >
                    <h3 className="font-semibold text-[14px]">Favourites</h3>
                    <div>
                      {favouriteShow ? (
                        <KeyboardArrowDownIcon />
                      ) : (
                        <KeyboardArrowRightIcon />
                      )}
                    </div>
                  </div> */}
                  {/* {favouriteShow && (
                    <div>
                      <h3 className="px-[1.6rem] mt-4">
                        you dont have any favourite list{" "}
                      </h3>
                    </div>
                  )} */}
                  {/* tabs */}
                  <div
                    onClick={() => dispatch(openPortfolio())}
                    className="py-3 pl-[1.3rem] border-[#eee] border-b hover:text-[#333] cursor-pointer flex items-center mt-[44px] bg-[#f6f6f6]"
                  >
                    <h3 className="font-semibold text-[14px]">Portfolios</h3>
                    <span className="mr-2 leading-none">
                      <div className="h-5 w-5 rounded-full ">
                        <i className="fa-solid fa-add mt-[2px] ml-[9px] text-xs"></i>
                      </div>
                    </span>
                  </div>
                  {/* <div className="mt-[2.4rem]">
                  <div className="flex w-[85%] m-auto border border-gray-500 rounded-md cursor-pointer">
                    {tabList.map((val, index) => {
                      return (
                        <div
                          onClick={() => setSelected(val?.name)}
                          style={{
                            background: val.name === selected ? "#2E365D" : "",
                          }}
                          key={index}
                          className="w-full h-[32px] flex items-center justify-center rounded-md "
                        >
                          <h3 className="text-[13px]">{val?.name}</h3>
                        </div>
                      );
                    })}
                  </div>
                </div> */}
                  <div className="px-0 relative search_sidebar">
                    {/* <div className="flex justify-between items-center">
                      <div className="flex text-xs font-medium relative border-l-4 border-l-transparent my-0 mr-3 py-1 pr-0 pl-[1rem]">
                        <div className="items-center flex justify-center flex-auto text-[#9399AB] text-xs  ">
                          <span className="mr-2 leading-none ">
                            <div className="h-5 w-5 rounded-full mt-2">
                              <i
                                className="fa-solid fa-search mt-[1px] text-xs "
                                style={{ color: "#9399AB" }}
                              ></i>
                            </div>
                          </span>
                          <Input
                            placeholder="Go to projects..."
                            disableUnderline
                            fullWidth
                            style={{
                              color: "#9399AB",
                              fontSize: "14px",
                              borderBottom: "1px solid #eee",
                            }}
                            inputProps={{
                              "aria-label": "Search",
                            }}
                          />
                        </div>
                      </div>
                      <span className=" leading-none mr-[1.5rem]">
                        <div className="bg-[#9399AB] h-6 w-6 flex items-center rounded justify-center">
                          <AddIcon sx={{ fontSize: "18px", color: "#fff" }} />
                        </div>
                      </span>
                    </div> */}
                    {selected === "PROJECTS" ? (
                      <div className="mt-0">
                        <SideBarPortfolio />
                      </div>
                    ) : (
                      <div className="mt-0">
                        <ChatTab />
                      </div>
                    )}

                    {/* {selected === "PROJECTS" && (
                      <div
                        className="items-center flex justify-right flex-auto text-[#c4c8e2] text-xs  pl-[1.3rem] cursor-pointer"
                        onClick={() => dispatch(openPortfolio())}
                      >
                        <span className="mr-2 leading-none">
                          <div className="h-5 w-5 rounded-full ">
                            <i
                              className="fa-solid fa-add mt-[2px] ml-[5px] text-xs "
                              style={{ color: "gray" }}
                            ></i>
                          </div>
                        </span>
                        <p
                          className="hover:text-[#009084] font-medium"
                          style={{ color: "gray", fontSize: "14px" }}
                        >
                          Add Portfolio
                        </p>
                      </div>
                    )} */}

                    {/* <div className="relative py-6 pb-14 px-3 mt-[30rem] getting_started-btn">
                      <a
                        className="w-full flex bg-[#2e365d] justify-center items-center font-medium text-sm text-white  h-10 px-5 rounded-mdF"
                        href="#"
                      >
                        <div className="mr-2">
                          <i
                            className="fa-solid fa-circle-question"
                            style={{ color: "#ffffff" }}
                          ></i>
                        </div>
                        Getting Started
                      </a>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddPortfolioDialog />
    </div>
  );
}

export default MainSideBar;
