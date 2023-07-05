import React, { useState, useEffect, Fragment } from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { closeMilestone } from "redux/reducers/mainDashbord";
import { Divider } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AirplayIcon from "@mui/icons-material/Airplay";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { closeHeaderDrawyer, taskDrawyerOpen } from "redux/actions";
import AcUnitIcon from "@mui/icons-material/AcUnit";

import { makeStyles } from "@mui/styles";
import { display, margin, paddingBottom } from "@xstyled/styled-components";
import { useAppGetUserNotification } from "hooks/Portfolio";
import { useDisplaySuccess } from "hooks/useDisplaySuccess";
import { useNavigate } from "react-router";
import moment from "moment";
import TaskDrwayer from "components/Main/homeDashboard/dashboard/widgetsCards/taskwidget/TaskDrwayer";
import { listTypeRequest } from "redux/actions";
import { useParams } from "react-router-dom";
import { setNewRequestType } from "redux/actions";

const useStyles = makeStyles((theme) => ({
  datePickerInput: {
    "& .MuiInputBase-root": {},
  },
}));

const HeaderDrawyer = () => {
  const classes = useStyles();
  const display = useDisplaySuccess();
  const isOpenTaskDrawer = useSelector(
    (state) => state?.projectTaskSlice?.taskState
  );

  const { projectId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isOpen = useSelector((state) => state.projectTaskSlice.headerState);

  const [value, setValue] = useState("All");

  const checkTaskStatus = (createdDate) => {
    if (createdDate) {
      const today = moment().startOf("day");
      const taskDate = moment(createdDate).startOf("day");
      const daysOverdue = today.diff(taskDate, "days");

      if (daysOverdue > 0) {
        return `${daysOverdue} days ago`;
      } else {
        return daysOverdue;
      }
    }
  };

  const onSuccess = (data) => {
    display(data?.message);
  };
  const { UserNotifications } = useAppGetUserNotification({ onSuccess });

  const AllList = () => {
    return (
      <div className="bg-white  mx-5">
        {UserNotifications && UserNotifications?.length > 0 ? (
          UserNotifications?.map((notification) => {
            return (
              <div
                className="border-2 bg-[#fafbfd] cursor-pointer mt-6 h-16 rounded-md shadow-md"
                onClick={() => {
                  // dispatch(taskDrawyerOpen(notification?.project_Id));
                  navigate(
                    `/dashboard/add-request/${notification?.id}/${projectId}`
                  );
                  dispatch(listTypeRequest("edit"));
                  dispatch(setNewRequestType("review"));
                }}
              >
                <div className="flex">
                  <div className="mt-2 mx-3 px-[6px] pt-[5px] rounded-md border-2 w-10 h-10 bg-white">
                    <AirplayIcon />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex mt-1 space-x-56">
                      <h2 className="font-Manrope font-semibold text-md text-lg">
                        Overdue Task: {notification?.projectName}
                      </h2>
                      <p className="font-Manrope flex items-center justify-center font-medium text-sm mt-1 text-[#9da2bd]">
                        {checkTaskStatus(notification?.createdAt)}
                      </p>
                    </div>
                    <div className="flex space-x-56">
                      <div className="flex gap-1">
                        <AcUnitIcon
                          sx={{
                            fontSize: "20px",
                            fill: "gray",
                            marginTop: "3px",
                          }}
                        />
                        <p className="text-gray-600 font-Manrope font-semibold">
                          {notification?.text}
                        </p>
                        <div className="border bg-white px-3 py-[1px] h-5 rounded-md mt-1 ml-2">
                          <p className="font-Manrope font-semibold text-[11px] text-gray-600">
                            {notification?.user_Id}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <h3>No data To Display</h3>
        )}
      </div>
    );
  };

  return (
    <Fragment>
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={() => {
          dispatch(closeHeaderDrawyer());
        }}
      >
        <Box sx={{ width: "650px", paddingBottom: "70px" }}>
          <div className="bg-[#fefefe] py-3 border-[#eee] border-b">
            <div className="flex justify-between px-5 items-center">
              <div className="flex space-x-1">
                <div
                  className="cursor-pointer -mr-1 mt-[3px]"
                  onClick={() => {
                    dispatch(closeHeaderDrawyer());
                  }}
                >
                  <ArrowBackIosIcon
                    style={{
                      fontSize: "21px",
                      color: "#9399AB",
                      "&:hover": { color: "#f98c42" },
                    }}
                  />
                </div>
                <h1 className="font-Manrope font-bold text-[#9399AB] text-[20px]">
                  Notifications
                </h1>
              </div>
              <div
                className=" cursor-pointer"
                onClick={() => {
                  navigate(`/profile/notification`),
                    dispatch(closeHeaderDrawyer());
                }}
              >
                {/* <SettingsIcon
                  sx={{
                    fontSize: "27px",
                    "&:hover": { color: "#00ac9e" },
                    color: "black",
                  }}
                /> */}
                <p className="text-[#0AD6AB] font-semibold cursor-pointer">
                  <DoneAllOutlinedIcon sx={{ fontSize: "18px" }} /> Mark all as
                  read
                </p>
              </div>
            </div>

            {/* <div className="flex justify-between">
              <div class=" ml-5 flex space-x-3">
                {notificationsTabs.map((val) => {
                  return (
                    <div
                      key={val.name}
                      className=""
                      onClick={() => setValue(val?.name)}>
                      <h2
                        style={{
                          color: value === val.name ? "#00A99B" : "black",
                          borderBottom:
                            value === val.name ? "1px solid #00A99B" : "",
                        }}
                        className={`      
                      flex flex-row mt-3 text-[16px] cursor-pointer font-bold font-Manrope hover:text-[#00A99B] hover:border-b-2 hover:border-b-[#00A99B] pb-1`}>
                        {val?.name}
                      </h2>
                    </div>
                  );
                })}
              </div>
              <div className="mt-2 mr-4">
                <div className="group relative">
                  <button className="bg-gray-200 border border-gray-400 pl-4 pr-2 h-7 rounded-2xl text-[#2f2f2f] hover:text-[#00b8a9] flex items-center font-Manrope text-[13px]">
                    Show All
                    <KeyboardArrowDownIcon />
                  </button>

                  <div
                    tabIndex={0}
                    className=" bg-white invisible border border-[#e8e8e9] rounded w-32 right-1 absolute  top-full transition-all opacity-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-1 ">
                    <ul className="py-1 text-sm max-h-60">
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-2 font-Manrope font-semibold  hover:bg-[#f2fffe] hover:text-[#00b8a9] ">
                          Show All
                        </a>
                      </li>
                      <hr />
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-3 font-Manrope font-semibold hover:bg-[#f2fffe] hover:text-[#00b8a9]">
                          Show Read
                        </a>
                      </li>
                      <hr />
                      <li>
                        <a
                          href="#"
                          className="block px-3 py-3 font-Manrope font-semibold hover:bg-[#f2fffe] hover:text-[#00b8a9]">
                          Show unread
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div> */}
          </div>

          <div className="mt-5 notificationBody">
            {/* /// today /// */}
            <div className="notificationPost mb-5">
              <h2 className="text-[16px] mb-1 font-Manrope font-semibold text-[#333] px-5">
                Today
              </h2>
              <div className="taskListToday px-5 relative flex border-[#eee] py-5 border-b">
                <div className="userProfile min-w-[50px] w-[50px] h-[50px] mr-3 bg-[#9399AB] rounded-full flex justify-center items-center relative">
                  <span className="absolute right-3 top-[1px] w-2 h-2 bg-[#0AD6AB] text-[0px] rounded-full indent-[9999px]">
                    active
                  </span>
                </div>
                <div className="taskContent flex flex-col">
                  <div className="taskp">
                    <p className="text-sm text-[#333]">
                      <span className="font-bold">Mohammad Abu Halib </span>
                      update the task
                      <span className="font-bold">
                        {" "}
                        "Prepare the infrastructute for the new system"
                      </span>{" "}
                      on project
                      <span className="font-bold"> "Project Plus v4.0"</span>
                    </p>
                  </div>
                  <div className="progressBar flex items-center">
                    <div className="w-full bg-gray-200 my-5 mx-auto rounded-lg overflow-hidden border border-gray-300">
                      <div className="bg-green-500 text-xs leading-none py-1 w-[70%]"></div>
                    </div>
                    <p className="text-xs text-[#9399AB] min-w-[50px] text-right">
                      80%
                    </p>
                  </div>
                  <div className="flex">
                    <div
                      class=" h-[34px] px-[16px] py-[5px] mr-5 font-Manrope font-semibold text-[14px] bg-[#00A99B] rounded-md text-white flex items-center justify-center"
                      role="button"
                      type="submit"
                    >
                      Accept
                    </div>
                    <div
                      class=" h-[34px] px-[16px] py-[5px] font-Manrope font-semibold text-[14px] bg-[#FF614B] rounded-md text-white flex items-center justify-center"
                      role="button"
                      type="submit"
                    >
                      Reject
                    </div>
                  </div>
                </div>
                <div className="taskTime min-w-[60px] text-right">
                  <p className="text-[#9399AB] font-semibold text-sm">6 min</p>
                </div>
              </div>
              {/* // 2nd /// */}
              <div className="taskListToday px-5 relative flex border-[#eee] py-5 border-b">
                <div className="userProfile min-w-[50px] w-[50px] h-[50px] mr-3 bg-[#9399AB] rounded-full flex justify-center items-center relative">
                  <span className="absolute right-3 top-[1px] w-2 h-2 bg-[#0AD6AB] text-[0px] rounded-full indent-[9999px]">
                    active
                  </span>
                </div>
                <div className="taskContent flex flex-col w-full">
                  <div className="taskp">
                    <p className="text-sm text-[#333]">
                      <span className="font-bold">Ghulam Fayyaz </span>
                      update the task on project
                      <span className="font-bold">
                        {" "}
                        "Project Three 60 v4.0"
                      </span>
                    </p>
                  </div>
                  <div className="progressBar flex items-center">
                    <div className="w-full bg-gray-200 my-5 mx-auto rounded-lg overflow-hidden border border-gray-300">
                      <div className="bg-green-500 text-xs leading-none py-1 w-[70%]"></div>
                    </div>
                    <p className="text-xs text-[#9399AB] min-w-[50px] text-right">
                      80%
                    </p>
                  </div>
                  <div className="flex">
                    <div
                      class=" h-[34px] px-[16px] py-[5px] mr-5 font-Manrope font-semibold text-[14px] bg-[#00A99B] rounded-md text-white flex items-center justify-center"
                      role="button"
                      type="submit"
                    >
                      Accept
                    </div>
                    <div
                      class=" h-[34px] px-[16px] py-[5px] font-Manrope font-semibold text-[14px] bg-[#FF614B] rounded-md text-white flex items-center justify-center"
                      role="button"
                      type="submit"
                    >
                      Reject
                    </div>
                  </div>
                </div>
                <div className="taskTime min-w-[60px] text-right">
                  <p className="text-[#9399AB] font-semibold text-sm">6 min</p>
                </div>
              </div>
            </div>
            {/* /// yesterday /// */}
            <div className="notificationPost mb-5">
              <h2 className="text-[16px] mb-1 font-Manrope font-semibold text-[#333] px-5">
                Yesterday
              </h2>
              <div className="taskListToday px-5 relative flex border-[#eee] py-5 border-b">
                <div className="userProfile min-w-[50px] w-[50px] h-[50px] mr-3 bg-[#9399AB] rounded-full flex justify-center items-center relative">
                  <span className="absolute right-3 top-[1px] w-2 h-2 bg-[#0AD6AB] text-[0px] rounded-full indent-[9999px]">
                    active
                  </span>
                </div>
                <div className="taskContent flex flex-col">
                  <div className="taskp">
                    <p className="text-sm text-[#333]">
                      <span className="font-bold">Mohammad Abu Halib </span>
                      update the task
                      <span className="font-bold">
                        {" "}
                        "Prepare the infrastructute for the new system"
                      </span>{" "}
                      on project
                      <span className="font-bold"> "Project Plus v4.0"</span>
                    </p>
                  </div>
                  <div className="progressBar flex items-center">
                    <div className="w-full bg-gray-200 my-5 mx-auto rounded-lg overflow-hidden border border-gray-300">
                      <div className="bg-green-500 text-xs leading-none py-1 w-[70%]"></div>
                    </div>
                    <p className="text-xs text-[#9399AB] min-w-[50px] text-right">
                      80%
                    </p>
                  </div>
                  <div className="flex">
                    <div
                      class=" h-[34px] px-[16px] py-[5px] mr-5 font-Manrope font-semibold text-[14px] bg-[#00A99B] rounded-md text-white flex items-center justify-center"
                      role="button"
                      type="submit"
                    >
                      Accept
                    </div>
                    <div
                      class=" h-[34px] px-[16px] py-[5px] font-Manrope font-semibold text-[14px] bg-[#FF614B] rounded-md text-white flex items-center justify-center"
                      role="button"
                      type="submit"
                    >
                      Reject
                    </div>
                  </div>
                </div>
                <div className="taskTime min-w-[60px] text-right">
                  <p className="text-[#9399AB] font-semibold text-sm">6 min</p>
                </div>
              </div>
              {/* // 2nd /// */}
              <div className="taskListToday px-5 relative flex border-[#eee] py-5 border-b">
                <div className="userProfile min-w-[50px] w-[50px] h-[50px] mr-3 bg-[#9399AB] rounded-full flex justify-center items-center relative">
                  <span className="absolute right-3 top-[1px] w-2 h-2 bg-[#0AD6AB] text-[0px] rounded-full indent-[9999px]">
                    active
                  </span>
                </div>
                <div className="taskContent flex flex-col w-full">
                  <div className="taskp">
                    <p className="text-sm text-[#333]">
                      <span className="font-bold">Ghulam Fayyaz </span>
                      update the task on project
                      <span className="font-bold">
                        {" "}
                        "Project Three 60 v4.0"
                      </span>
                    </p>
                  </div>
                  <div className="progressBar flex items-center">
                    <div className="w-full bg-gray-200 my-5 mx-auto rounded-lg overflow-hidden border border-gray-300">
                      <div className="bg-green-500 text-xs leading-none py-1 w-[70%]"></div>
                    </div>
                    <p className="text-xs text-[#9399AB] min-w-[50px] text-right">
                      80%
                    </p>
                  </div>
                  <div className="flex">
                    <div
                      class=" h-[34px] px-[16px] py-[5px] mr-5 font-Manrope font-semibold text-[14px] bg-[#00A99B] rounded-md text-white flex items-center justify-center"
                      role="button"
                      type="submit"
                    >
                      Accept
                    </div>
                    <div
                      class=" h-[34px] px-[16px] py-[5px] font-Manrope font-semibold text-[14px] bg-[#FF614B] rounded-md text-white flex items-center justify-center"
                      role="button"
                      type="submit"
                    >
                      Reject
                    </div>
                  </div>
                </div>
                <div className="taskTime min-w-[60px] text-right">
                  <p className="text-[#9399AB] font-semibold text-sm">6 min</p>
                </div>
              </div>
            </div>
          </div>

          <div>{<AllList />}</div>
          {isOpenTaskDrawer && <TaskDrwayer />}
        </Box>
      </Drawer>
    </Fragment>
  );
};

export default HeaderDrawyer;
