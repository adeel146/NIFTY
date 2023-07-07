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
import { Stack, Typography, Badge } from "@mui/material";

import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import {
  closeHeaderDrawyer,
  setModuleInformation,
  taskDrawyerOpen,
} from "redux/actions";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import CircularProgress from "@mui/material/CircularProgress";

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
  const queryClient = useQueryClient();

  const { projectId } = useParams();
  const { enqueueSnackbar } = useSnackbar();

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

  const { mutate: changeRequest, isLoading: acceptLoading } = useMutation({
    mutationKey: ["change_request_actions"],
    mutationFn: (data) => axios.post(`/change_request/action`, data),
    onSuccess: (data) => {
      if (data?.data?.success) {
        enqueueSnackbar(data.data.message, { variant: "success" });
        queryClient.invalidateQueries(["get_notification"]);
      }
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  const { data: UserNotifications } = useQuery(
    ["get_notification"],
    () => {
      return axios.get(`/user_notification`);
    },
    {
      select: (res) => {
        return res?.data?.data;
      },
    }
  );

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
                <p className="text-[#0AD6AB] font-semibold cursor-pointer">
                  <DoneAllOutlinedIcon sx={{ fontSize: "18px" }} /> Mark all as
                  read
                </p>
              </div>
            </div>
          </div>
          {UserNotifications?.map((notification) => {
            const moduleInfo = JSON.parse(notification?.moduleInformation);
            return (
              <div>
                {notification.type == 0 ? (
                  <div className="bg-white  mx-5">
                    <div className="border-2 bg-[#fafbfd] cursor-pointer mt-6 h-16 rounded-md shadow-md">
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
                  </div>
                ) : notification.type == 1 ? (
                  <div>
                    <div
                      className="cursor-pointer"
                      onClick={(e) => {
                        navigate(
                          `/dashboard/add-request/${moduleInfo?.Log_Id}/${projectId}`
                        );
                        dispatch(listTypeRequest("edit"));
                        dispatch(setNewRequestType("review"));
                        dispatch(setModuleInformation(moduleInfo));
                        e.stopPropagation();
                      }}
                    >
                      <div className="mt-5 notificationBody">
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
                            <div className="taskContent flex flex-col w-full">
                              <div className="taskp">
                                <p className="text-sm text-[#333]">
                                  {notification?.text}
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
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    changeRequest(moduleInfo);
                                  }}
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
                            <div className="taskTime min-w-[60px] text-right mr-5">
                              <p className="text-[#9399AB] font-semibold text-sm">
                                {moment(notification?.createdAt).format("L")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            );
          })}

          {isOpenTaskDrawer && <TaskDrwayer />}
          <div className="mt-2">
            <Divider />
          </div>
          <div>
            <Box
              sx={{
                border: "1px solid #ffbe92",
                borderRadius: "4px",
                background: "#fffbf8",
                height: "auto",
                marginBottom: "10px",
                marginLeft: "20px",
                marginRight: "20px",
                marginTop: "20px",
                // width: "100%",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                padding={"10px"}
              >
                <Stack direction="column" spacing={2}>
                  <Badge color="default">
                    <Typography fontSize="13px" color="#8e94bb">
                      Overdue Task : nnenwn
                    </Typography>
                  </Badge>
                  <Stack direction="row" alignItems={"center"} spacing={1}>
                    {/* <ArticleIcon
                    sx={{
                      fill: "#8e94bb",
                      fontSize: "10px",
                    }}
                  /> */}
                    <Typography color="#8e94bb" fontSize="10px">
                      0/1
                    </Typography>
                  </Stack>
                </Stack>
                <Stack direction="column" justifyContent="flex-end">
                  {/* <AccountBoxIcon
                  sx={{
                    fontSize: "13px",
                    fill: "#009084",
                  }}
                /> */}
                </Stack>
              </Stack>
            </Box>
          </div>
        </Box>
      </Drawer>
    </Fragment>
  );
};

export default HeaderDrawyer;
