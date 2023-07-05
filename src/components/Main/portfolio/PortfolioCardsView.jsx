import React, { useEffect, useState } from "react";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import HiveIcon from "@mui/icons-material/Hive";
import FilterVintageIcon from "@mui/icons-material/FilterVintage";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import BugReportIcon from "@mui/icons-material/BugReport";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import EmailIcon from "@mui/icons-material/Email";
import CallIcon from "@mui/icons-material/Call";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CustomProgressBar from "hooks/Common/CustomProgressBar";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import WhiteButton from "hooks/Common/commonButtons/WhiteButton";
import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import GreenButton from "hooks/Common/commonButtons/GreenButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import ManagePortfolio from "./ManagePortfolio";
import { useSelector } from "react-redux";
import { Box, Tooltip } from "@mui/material";
import Chart from "react-apexcharts";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  useGetFinanceByPortfolio,
  useGetPortfolioMembersCount,
  useGetPortfolioReportsProjects,
  useGetPortfolioReportsTasksCount,
} from "hooks/Reports";
import {
  TextField,
  IconButton,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Icon } from "@mui/material";

const PortfolioCardsView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  console.log(id,"id")

  const [sectionShow, setSectionShow] = useState(true);
  const idPortfolio = useSelector(
    (state) => state.projectTaskSlice.portfolioIdcheck
  );
  const [open, setOpen] = useState(false);
  const { data: porfolioData } = useQuery(
    ["portfolio_details", id],
    () => {
      return axios.get(`portfolio/${id}`);
    },
    {
      enabled: !!id,
      select: (res) => {
        return res?.data?.data;
      },
    }
  );

  console.log(porfolioData, "porfolioData");

  const { data: portfolioReportsStats } = useQuery(
    ["portfolio_reports/stats", id],
    () => {
      return axios.get(`portfolio_reports/stats/${id}`);
    },
    {
      enabled: !!id,
      select: (res) => {
        return res?.data?.data;
      },
    }
  );

  const { portfolioReportsTasksCount } = useGetPortfolioReportsTasksCount(id);
  const { FinanceByPortfolio } = useGetFinanceByPortfolio(id); //its remaining
  const { PortfolioMembersCount } = useGetPortfolioMembersCount(id);
  const { PortfolioReportsProjects } = useGetPortfolioReportsProjects(id);

  console.log(PortfolioMembersCount, "PortfolioMembersCount");
  console.log(PortfolioReportsProjects, "PortfolioReportsProjects");
  const checkPercentage = (percentage) => {
    if (percentage === 0) {
      return "NOT STARTED";
    } else if (percentage > 0 && percentage < 100) {
      return "IN PROGRESS";
    } else {
      return "DONE";
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  // const handleManagePortfolioClose = () => {
  //   setIsManagePortfolio(false);
  //   setActivePortfolioId(null);
  // };
  const styles = {
    colors: ["#FF0000", "#FDBD19", "#111631", "#E9EBEE", "#64B735", "#0E62E1"],
  };

  const [
    portfolioReportsTasksCountOptions,
    setPortfolioReportsTasksCountOptions,
  ] = useState(null);
  const [projectsByPhaseOptions, setProjectsByPhaseOptions] = useState(null);
  const [financialInfoOptions, setFinancialInfoOptions] = useState(null);
  useEffect(() => {
    if (PortfolioMembersCount?.projects?.length) {
      const projectsByPhaseSettings = {
        series: [
          {
            data: PortfolioMembersCount?.memberCount.map((el) => el),
          },
        ],
        options: {
          chart: {
            height: 350,
            type: "bar",
            events: {
              click: function (chart, w, e) {
                // console.log(chart, w, e)
              },
            },
          },
          colors: styles.colors,

          plotOptions: {
            bar: {
              columnWidth: "45%",
              distributed: true,
            },
          },
          dataLabels: {
            enabled: false,
          },
          legend: {
            show: false,
          },

          xaxis: {
            categories: PortfolioMembersCount?.projects.map((el) => el.name),
            labels: {
              style: {
                colors: styles.colors,
                fontSize: "12px",
              },
            },
          },
        },
      };

      setProjectsByPhaseOptions(projectsByPhaseSettings);
    } else {
      setProjectsByPhaseOptions(null);
    }
  }, [PortfolioMembersCount, id]);
  useEffect(() => {
  if (FinanceByPortfolio?.projects?.length) {
      const financialInfoSettings = {
        series: [
          {
            data: FinanceByPortfolio?.amount?.map((el) => el),
          },
        ],
        options: {
          chart: {
            height: 350,
            type: "bar",
            events: {
              click: function (chart, w, e) {
                // console.log(chart, w, e)
              },
            },
          },
          colors: styles.colors,

          plotOptions: {
            bar: {
              columnWidth: "45%",
              distributed: true,
            },
          },
          dataLabels: {
            enabled: false,
          },
          legend: {
            show: false,
          },
          xaxis: {
            categories: FinanceByPortfolio?.projects.map((el) => el.name),
            labels: {
              style: {
                colors: styles.colors,
                fontSize: "12px",
              },
            },
          },
        },
      };

      setFinancialInfoOptions(financialInfoSettings);
    } else {
      setFinancialInfoOptions(null);
    }
  }, [FinanceByPortfolio]);

  useEffect(() => {
    if (portfolioReportsTasksCount?.projects?.length > 0) {
      const colors = portfolioReportsTasksCount?.projects?.map(
        () => "#" + Math.floor(Math.random() * 16777215).toString(16)
      );
      const projectByProjectStatus = {
        options: {
          chart: {
            type: "donut",
          },
          dataLabels: {
            enabled: false,
          },
          labels: portfolioReportsTasksCount?.projects?.map((el) => el.name),
          colors: colors,
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  total: {
                    showAlways: true,
                    show: true,
                  },
                },
              },
            },
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200,
                },
                legend: {
                  show: false,
                },
              },
            },
          ],
        },
        series: portfolioReportsTasksCount?.taskCount?.map((el) => el),
      };
      setPortfolioReportsTasksCountOptions(projectByProjectStatus);
    } else {
      setPortfolioReportsTasksCountOptions(null);
    }
  }, [portfolioReportsTasksCount?.projects, id]);

  console.log(
    portfolioReportsTasksCountOptions,
    "portfolioReportsTasksCountOptions"
  );
  const status = [
    { name: "Delayed", id: 1 },
    { name: "OnTime", id: 2 },
    { name: "Closed", id: 3 },
  ];

  return (
    <div>
      <div className="bg-white flex justify-between items-center pr-8 pl-8 border border-b-[#e8e8e8]">
        <div className="flex space-x-2 items-center">
          <div className="flex flex-col">
            <div className="flex relative left-1">
              <h1 className=" flex  text-[#2f2f2f] font-bold text-[18px] capitalize">
                {porfolioData?.name}{" "}
                <span className="relative top-[2px]">
                  <MoreHorizIcon />
                </span>
              </h1>
            </div>
            <div
              onClick={() => setOpen(true)}
              className="flex space-x-1 items-center cursor-pointer"
            >
              <AddIcon />
              <h3 className="text-[#2f2f2f] font-semibold text-[14px]">
                Invite People
              </h3>
            </div>
          </div>
        </div>
        <div className="pt-0">
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem />}
            spacing={1}
          >
            {/* <div className="w-[50px] border border-gray-200 h-[39px] rounded-md bg-white flex justify-center items-center">
                <ImportExportIcon />
              </div> */}

            <div onClick={() => navigate(`/add/project/${id}`)}>
              <GreenButton buttonText="Create a Project" />
            </div>
          </Stack>
        </div>
      </div>

      <div className="px-8 py-8 mb-11">
        <h2 class="text-[#2f2f2f] text-[20px] mb-3 font-Manrope font-semibold">
          Dashboard
        </h2>

        <div className="flex gap-5 lg:flex-wrap xl:flex-nowrap mb-5">
          <div className="post_box_white w-[20%] bg-white p-4 rounded-lg relative before:absolute before:-left-[1px] before:top-[0px] before:rounded-l-lg  before:w-[3px] before:h-[100%] before:border-l-[#ff6650] before:border-l-4  shadow-sm border border-[#eee]">
            <div className="flex justify-between">
              <p className="text-[#2f2f2f] text-[15px] font-Manrope font-normal">
                Projects
              </p>
              <span className="text-[#fff] bg-[#ff6650] w-8 h-8 rounded-full flex justify-center items-center">
                <FilterVintageIcon />
              </span>
            </div>
            <p className="text-[#2f2f2f] text-[18px] font-Manrope font-semibold mt-5">
              {portfolioReportsStats?.projects ?? 0}
            </p>
          </div>
          <div className="post_box_white w-[20%] bg-white p-4 rounded-lg relative before:absolute before:-left-[1px] before:top-[0px] before:rounded-l-lg  before:w-[3px] before:h-[100%] before:border-l-[#CD7F32] before:border-l-4  shadow-sm border border-[#eee]">
            <div className="flex justify-between">
              <p className="text-[#2f2f2f] text-[15px] font-Manrope font-normal">
                Members
              </p>
              <span className="text-[#fff] bg-[#CD7F32] w-8 h-8 rounded-full flex justify-center items-center">
                <CollectionsBookmarkIcon />
              </span>
            </div>
            <div className="flex justify-between mt-5">
              <p className="text-[#2f2f2f] text-[18px] font-Manrope font-semibold">
                {portfolioReportsStats?.members ?? 0}
              </p>
              <AvatarGroup max={4}>
                {porfolioData?.members?.map((el) => (
                  <>
                    <Tooltip
                      PopperProps={{
                        sx: {
                          "& .MuiTooltip-tooltip": {
                            backgroundColor: "#fef9f3",
                            marginLeft: "15px",
                            width: "270px",
                          },
                        },
                      }}
                      title={
                        <div
                          className="flex space-y-2 !justify-center bg-[#fff]"
                          style={{
                            flexDirection: "column",
                            alignItems: "center !important",
                          }}
                        >
                          <div className="flex space-x-4 mt-5">
                            <div>
                              {el?.image?.file_path ? (
                                <>
                                  <div className="w-[80px] h-[70px] rounded-md border border-gray-300 flex justify-center items-center bg-slate-50">
                                    <img
                                      className="w-[70px] h-[auto] rounded-md"
                                      src={el?.image?.file_path}
                                      alt="portfolio"
                                    />
                                  </div>
                                </>
                              ) : (
                                <IconButton
                                  className="!bg-white flex  justify-center align-center h-[40px] w-[40px]"
                                  style={{
                                    borderRadius: "5px",
                                    border: "1px solid #00a99b",
                                  }}
                                >
                                  <Icon className="!text-[12px] text-[#000]">
                                    {el?.name}
                                  </Icon>
                                </IconButton>
                              )}
                            </div>
                            <div>
                              <h2 className=" text-[18px] text-[#9197BD]">
                                {el?.name}
                              </h2>
                              <div className="flex space-x-2 items-center">
                                <p className="text-[#000] text-[15px]">
                                  {el?.role
                                    ? el?.role == 1
                                      ? "owner"
                                      : "member"
                                    : ""}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="!mt-5"></div>
                          <Divider />
                          <div className="bg-gray-50">
                            <div className="bottom_section pt-4 ">
                              <div className="flex space-x-1  items-center">
                                <EmailIcon
                                  sx={{
                                    color: "#9197BD",
                                    fontSize: "15px",
                                  }}
                                />
                                <p className="text-[#9197BD]">{el?.email}</p>
                              </div>
                            </div>
                            <div className="w-full mt-3 mb-3 bg-white border border-gray-200 shadow text-black rounded-md h-[35px] flex space-x-1 justify-center items-center ">
                              <PersonIcon
                                sx={{
                                  fontSize: "17px",
                                }}
                              />
                              <h1 className="pt-1">See Profile </h1>
                            </div>
                          </div>
                        </div>
                      }
                    >
                      <Avatar
                        key={el.id}
                        alt={el.name}
                        src={el.image.file_path}
                        sx={{
                          height: "25px",
                          width: "25px",
                        }}
                      />
                    </Tooltip>
                  </>
                ))}
              </AvatarGroup>
            </div>
          </div>
          <div className="post_box_white w-[20%] bg-white p-4 rounded-lg relative before:absolute before:-left-[1px] before:top-[0px] before:rounded-l-lg  before:w-[3px] before:h-[100%] before:border-l-[#CD7F32] before:border-l-4  shadow-sm border border-[#eee]">
            <div className="flex justify-between">
              <p className="text-[#2f2f2f] text-[15px] font-Manrope font-normal">
                Overdue Tasks
              </p>
              <span className="text-[#fff] bg-[#CD7F32] w-8 h-8 rounded-full flex justify-center items-center">
                <CollectionsBookmarkIcon />
              </span>
            </div>
            <p className="text-[#2f2f2f] text-[18px] font-Manrope font-semibold mt-5">
              {portfolioReportsStats?.overdueTasks ?? 0}
            </p>
          </div>
          <div className="post_box_white w-[20%] bg-white p-4 rounded-lg relative before:absolute before:-left-[1px] before:top-[0px] before:rounded-l-lg  before:w-[3px] before:h-[100%] before:border-l-[#FDBD19] before:border-l-4  shadow-sm border border-[#eee]">
            <div className="flex justify-between">
              <p className="text-[#2f2f2f] text-[15px] font-Manrope font-normal">
                Risks
              </p>
              <span className="text-[#fff] bg-[#FDBD19] w-8 h-8 rounded-full flex justify-center items-center">
                <DoDisturbIcon />
              </span>
            </div>
            <p className="text-[#2f2f2f] text-[18px] font-Manrope font-semibold mt-5">
              {portfolioReportsStats?.riskFactor ?? 0}
            </p>
          </div>
          <div className="post_box_white w-[20%] bg-white p-4 rounded-lg relative before:absolute before:-left-[1px] before:top-[0px] before:rounded-l-lg  before:w-[3px] before:h-[100%] before:border-l-[#1FC2D1] before:border-l-4  shadow-sm border border-[#eee]">
            <div className="flex justify-between">
              <p className="text-[#2f2f2f] text-[15px] font-Manrope font-normal">
                Tasks
              </p>
              <span className="text-[#fff] bg-[#DE3B3B] w-8 h-8 rounded-full flex justify-center items-center">
                <BugReportIcon />
              </span>
            </div>
            <p className="text-[#2f2f2f] text-[18px] font-Manrope font-semibold mt-5">
              {portfolioReportsStats?.tasks ?? 0}
            </p>
          </div>
        </div>

        {/* graph section  */}

        <div className="flex gap-5 lg:flex-wrap xl:flex-nowrap mb-5">
          <div className="post_box_white w-[33%] h-[400px] bg-white p-4 rounded-lg relative shadow-sm border border-[#eee]">
            <div className="chart-topSection pb-2 mb-2 flex justify-between border border-b[#eee] border-t-0 border-l-0 border-r-0">
              <h4 className="text-[#2f2f2f] text-[12px] font-Manrope font-semibold">
                Projects by Status
              </h4>
              <span className="cursor-pointer text-[#2f2f2f]">
                <MoreVertIcon />
              </span>
            </div>
            <Box height={300}>
              {portfolioReportsTasksCountOptions ? (
                <Chart
                  options={portfolioReportsTasksCountOptions?.options}
                  series={portfolioReportsTasksCountOptions?.series}
                  type="donut"
                  width="100%"
                  height="300"
                />
              ) : (
                <p className="flex justify-center items-center  h-full">
                  No data found
                </p>
              )}
            </Box>
          </div>
          <div className="post_box_white w-[33%] h-[400px] bg-white p-4 rounded-lg relative shadow-sm border border-[#eee]">
            <div className="chart-topSection pb-2 mb-2 flex justify-between border border-b[#eee] border-t-0 border-l-0 border-r-0">
              <h4 className="text-[#2f2f2f] text-[12px] font-Manrope font-semibold">
                Projects By Phase
              </h4>
              <span className="cursor-pointer text-[#2f2f2f]">
                <MoreVertIcon />
              </span>
            </div>

            <Box height={300}>
              {projectsByPhaseOptions ? (
                <Chart
                  options={projectsByPhaseOptions.options}
                  series={projectsByPhaseOptions.series}
                  type="bar"
                  width="100%"
                  height="300"
                />
              ) : (
                <p className="flex justify-center items-center  h-full">
                  no data found
                </p>
              )}
            </Box>
          </div>
          <div className="post_box_white w-[33%] h-[400px] bg-white p-4 rounded-lg relative shadow-sm border border-[#eee]">
            <div className="chart-topSection pb-2 mb-2 flex justify-between border border-b[#eee] border-t-0 border-l-0 border-r-0">
              <h4 className="text-[#2f2f2f] text-[12px] font-Manrope font-semibold">
                Financial Info
              </h4>
              <span className="cursor-pointer text-[#2f2f2f]">
                <MoreVertIcon />
              </span>
            </div>
            <Box height={300}>
              {financialInfoOptions ? (
                <Chart
                  options={financialInfoOptions?.options}
                  series={financialInfoOptions?.series}
                  type="bar"
                  width="100%"
                  height="300"
                />
              ) : (
                <p className="flex justify-center items-center h-full">
                  no data found
                </p>
              )}
            </Box>
          </div>
        </div>

        {/* Portfolios section  */}
        <h2 class="text-[#2f2f2f] text-[20px] mb-3 font-Manrope font-semibold">
          Projects
        </h2>

        <div className="flex gap-4 lg:flex-wrap flex-wrap mb-5">
          {/* 1st BOX overdelayed red */}
          {PortfolioReportsProjects?.length > 0 ? (
            PortfolioReportsProjects?.map((el) => {
              const selectedStatus = status.find((s) => s?.id === el?.status);
              return (
                <div
                  onClick={() => navigate(`/dashboard/${el?.id}`)}
                  className="post_box_white  3xl:w-[24%] xl:w-[32%] lg:w-[49%] relative cursor-pointer"
                >
                  <div className="post_box_white bg-white p-4 rounded-lg relative shadow-sm border border-[#eee] rounded-b-none">
                    <span
                      className={`absolute -left-[2px] top-3 w-1 h-[60px] ${
                        selectedStatus && selectedStatus.name === "Delayed"
                          ? "issueBg"
                          : selectedStatus.name === "OnTime"
                          ? "onTrackBg"
                          : selectedStatus.name === "Closed"
                          ? "riskBg"
                          : ""
                      } rounded-full`}
                    ></span>
                    <div className="portf-header flex justify-between items-center mb-2">
                      <span
                        class={`${
                          selectedStatus && selectedStatus.name === "Delayed"
                            ? "issueBg"
                            : selectedStatus.name === "OnTime"
                            ? "onTrackBg"
                            : selectedStatus.name === "Closed"
                            ? "riskBg"
                            : ""
                        } text-white text-xs font-medium font-Manrope mr-2 px-2.5 py-0.5 rounded-full `}
                      >
                        {selectedStatus ? selectedStatus.name : ""}
                      </span>
                      <div className="flex gap-3">
                        <div className="flex">
                          <span className="text-[#fff] bg-[#FDBD19] w-[22px] h-[22px] rounded-full flex justify-center items-center">
                            <DoDisturbIcon sx={{ fontSize: "16px" }} />
                          </span>
                          <span className="text-[14px] font-Manrope font-medium ml-1">
                            3
                          </span>
                        </div>
                        <div className="flex">
                          <span
                            className={`text-[#fff] ${
                              selectedStatus &&
                              selectedStatus.name === "Delayed"
                                ? "issueBg"
                                : selectedStatus.name === "OnTime"
                                ? "onTrackBg"
                                : selectedStatus.name === "Closed"
                                ? "riskBg"
                                : ""
                            } w-[22px] h-[22px] rounded-full flex justify-center items-center`}
                          >
                            <BugReportIcon sx={{ fontSize: "16px" }} />
                          </span>
                          <span className="text-[14px] font-Manrope font-medium ml-1">
                            2
                          </span>
                        </div>
                      </div>
                    </div>
                    <h4 className="text-[#2f2f2f] text-[13px] mb-3 font-Manrope font-semibold">
                      {el.name}
                    </h4>

                    <div className="portf-btm flex justify-between items-center mt-[24px]">
                      <div className="userProfile flex items-center">
                        <div className="userImg relative flex justify-center items-center text-[#888] w-[30px] h-[30px] rounded-full border border-[#eee] mr-2">
                          {el?.manager?.photo ? (
                            <img
                              src={el.manager.photo.file_path}
                              className="rounded-full"
                            />
                          ) : (
                            <AccountCircleIcon />
                          )}
                          <span className="active-user block text-[1px] absolute -right-[2px] bottom-1 bg-[#64B735] w-[5px] h-[5px] rounded-full">
                            active
                          </span>
                        </div>
                        <div className="userName flex flex-col">
                          <h6 className="text-[#2f2f2f] text-[12px] font-Manrope font-semibold">
                            {el?.manager?.name}
                          </h6>
                          <p className="text-[#888] text-[11px] font-Manrope font-normal">
                            {el?.manager?.email}
                          </p>
                        </div>
                      </div>
                      <div className="social-connection flex gap-4">
                        <div className="flex flex-col">
                          <div className="circle-bg cursor-pointer p-1 w-[24px] text-[#AAA7A7] h-[24px] rounded-full bg-[#eee] flex justify-center items-center">
                            <ChatBubbleOutlineIcon className="!w-[16px]" />
                          </div>
                          <p className="text-[#888] text-[11px] font-Manrope font-normal">
                            Chat
                          </p>
                        </div>
                        <div className="flex flex-col">
                          <div className="circle-bg cursor-pointer p-1 w-[24px] text-[#AAA7A7] h-[24px] rounded-full bg-[#eee] flex justify-center items-center">
                            <CallIcon className="!w-[16px]" />
                          </div>
                          <p className="text-[#888] text-[11px] font-Manrope font-normal">
                            Call
                          </p>
                        </div>
                        <div className="flex flex-col">
                          <div className="circle-bg cursor-pointer p-1 w-[24px] text-[#AAA7A7] h-[24px] rounded-full bg-[#eee] flex justify-center items-center">
                            <EmailIcon className="!w-[16px]" />
                          </div>
                          <p className="text-[#888] text-[11px] font-Manrope font-normal">
                            Email
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="progress-section bg-[#E9EBEE] p-4">
                    <div className="mb-1 flex justify-between items-center">
                      <div className="w-full bg-white rounded-full h-2.5">
                        <div
                          className={`${
                            selectedStatus && selectedStatus.name === "Delayed"
                              ? "issueBg"
                              : selectedStatus.name === "OnTime"
                              ? "onTrackBg"
                              : selectedStatus.name === "Closed"
                              ? "riskBg"
                              : ""
                          }  h-2.5 rounded-full w-[${Math.round(
                            el.completePercentage
                          ).toFixed()}%]`}
                        ></div>
                      </div>
                      <span className="ml-3 text-[15px] font-semibold text-[#DE3B3B]">
                        {Math.round(el.completePercentage).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <div className="post_box_white bg-white rounded-lg relative shadow-sm border border-[#eee] rounded-t-none">
                    <div className="flex border px-4 border-b-[#eee] border-t-0 border-r-0 border-l-0">
                      <div className="flex w-[33%] py-3 pr-[2px] flex-col border border-r-[#eee] border-l-0 border-b-0 border-t-0">
                        <p className="text-[#2f2f2f] text-[12px] font-Manrope">
                          Allocated
                        </p>
                        <h4 className="text-[13px] text-[#1FC2D1] font-semibold">
                          {el.allocatedBudget.toLocaleString()} AED
                        </h4>
                      </div>
                      <div className="flex w-[33%] py-3 pl-3 pr-[2px] flex-col border border-r-[#eee] border-l-0 border-b-0 border-t-0">
                        <p className="text-[#2f2f2f] text-[12px] font-Manrope">
                          Consumed
                        </p>
                        <h4 className="text-[13px] text-[#1FC2D1] font-semibold">
                          {el.consumedBudget.toLocaleString()} AED
                        </h4>
                      </div>
                      <div className="flex w-[33%] py-3 pl-3 flex-col">
                        <p className="text-[#2f2f2f] text-[12px] font-Manrope">
                          Remaning
                        </p>
                        <h4 className="text-[13px] text-[#1FC2D1] font-bold">
                          {el.remaininBudget.toLocaleString()} AED
                        </h4>
                      </div>
                    </div>
                    <div className="flex px-4">
                      <div className="w-[49%] py-3 border border-r-[#eee] border-l-0 border-b-0 border-t-0 flex flex-col">
                        <p className="text-[#2f2f2f] text-[12px] font-Manrope mb-3">
                          Total Tasks
                          <span className="text-[#1FC2D1] font-bold">
                            {" "}
                            ({el?.totalTasks ?? 0})
                          </span>{" "}
                        </p>
                        <div className="flex gap-1">
                          <span className="riskBg font-bold w-[26px] h-[26px] rounded-full flex text-white text-sm justify-center items-center">
                            {el?.totalTasks ?? 0}
                          </span>
                        </div>
                      </div>
                      <div className="w-[51%] py-3 flex flex-col pl-3">
                        <p className="text-[#2f2f2f] text-[12px] font-Manrope mb-3">
                          Total MilesStones
                          <span className="text-[#1FC2D1] font-bold">
                            {" "}
                            ({el?.totalMilestones ?? 0})
                          </span>{" "}
                        </p>
                        <div className="flex gap-1">
                          <span className="onTrackBg font-bold w-[26px] h-[26px] rounded-full flex text-white text-sm justify-center items-center">
                            {el?.totalMilestones ?? 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex justify-center items-center w-full mt-4">
              <h1>No Data Found </h1>
            </div>
          )}
        </div>
      </div>

      {/* end new page design  */}

      <ManagePortfolio
        open={open}
        handleClose={handleClose}
        activePortfolioId={idPortfolio}
        // open={isManagePortfolio}
        // handleClose={handleManagePortfolioClose}
      />
    </div>
  );
};

export default PortfolioCardsView;
