import * as React from "react";
import {
  GanttComponent,
  Inject,
  Edit,
  ColumnsDirective,
  ColumnDirective,
  Toolbar,
} from "@syncfusion/ej2-react-gantt";
import "../../syncfusion.css";
import "./index.css";
import { Button, ButtonGroup } from "@mui/material";
import moment from "moment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DescriptionIcon from "@mui/icons-material/Description";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useDispatch, useSelector } from "react-redux";
import { openMilestone } from "redux/reducers/mainDashbord";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "notistack";
import { taskDrawyerOpen } from "redux/actions";
import CustomLoader from "hooks/Common/CustomLoader";
import * as _ from "lodash";
import { Box } from "@mui/system";
import Select from "react-select";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import { Popover, Tooltip } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { useAuth } from "hooks/useAuth";
import AddMileStoneDialog from "routes/roadMap/AddMileStoneModal";
import MileStoneDrawer from "components/Main/homeDashboard/dashboard/widgetsCards/milestones/MileStoneDrawer";
import TaskDrwayer from "components/Main/homeDashboard/dashboard/widgetsCards/taskwidget/TaskDrwayer";
import TurnRightIcon from "@mui/icons-material/TurnRight";
import PixIcon from "@mui/icons-material/Pix";
import HelpIcon from "@mui/icons-material/Help";
import ArrowBack from "../../../public/icons/ArrowBack";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { isEmpty } from "lodash";
import CircularProgress from "@mui/material/CircularProgress";

function TimeLine() {
  const [defaultWidth, setdefaultWidth] = React.useState("25%");
  const [mileStonesList, setMileStonesList] = React.useState([]);
  const [isOpenAddMileStone, setisOpenAddMileStone] = React.useState(false);
  const [viewMode, setViewMode] = React.useState("Month");
  const [selectedPortfolio, setSelectedPortfolio] = React.useState(null);
  let ganttInstance;
  const { milestoneState } = useSelector((state) => state?.dashbordSlice);
  const isOpenTaskDrawer = useSelector(
    (state) => state?.projectTaskSlice?.taskState
  );
  const loginUserDetail = useAuth();

  const getWorkingDays = React.useMemo(() => {
    const startDay = loginUserDetail.user.day || 0;
    const workWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // Get the working days by slicing the workWeek array
    const workingDays = workWeek.slice(startDay, startDay + 5);

    return workingDays;
  }, []);
  const taskFields = {
    id: "id",
    name: "name",
    startDate: "startDate",
    endDate: "endDate",
    // duration: "duration",
    child: "milestone",
    dependency: "predecessor",
    // progress: "completed",
  };

  const { enqueueSnackbar } = useSnackbar();

  const workspaceId = localStorage.getItem("workspaceId");

  const { isLoading } = useQuery({
    queryKey: ["get-portfolio-milestone", selectedPortfolio],
    queryFn: () =>
      axios.get(
        `portfolio/all_portfolio_details?workspace_Id=${workspaceId}${
          selectedPortfolio !== null ? "&model=" + selectedPortfolio.value : ""
        }`
      ),
    onSuccess: (data) => {
      setMileStonesList(data.data.data);
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
    refetchOnWindowFocus: false,
  });

  const { mutate: updateMilestoneDate } = useMutation({
    mutationKey: ["milestone/change_date/"],
    mutationFn: (data) =>
      axios.put(`milestone/change_date/${data.id}`, data.body),
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });
  const { mutate: updateTaskDate } = useMutation({
    mutationKey: ["task/change_date/"],
    mutationFn: (data) =>
      axios.put(`task/update_duration/${data.id}`, data.body),
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  const editSettings = {
    allowTaskbarEditing: true,
  };

  function clickHandler() {
    if (defaultWidth === "25%") {
      ganttInstance.setSplitterPosition("0%", "position");
      setdefaultWidth("0%");
    } else {
      ganttInstance.setSplitterPosition("25%", "position");
      setdefaultWidth("25%");
    }
  }

  const splitterSettings = {
    position: defaultWidth,
    columnIndex: 2,
    separatorSize: 1,
  };

  const timelineSettings = {
    timelineUnitSize: 100,
    height: 100,
    timelineViewMode: viewMode,
    topTier: {
      unit: "Month",
      format: "MMMMMMMMM",
    },
  };

  // Event handler for actionComplete event

  function handleActionComplete(args) {
    console.log(args, "args");
    if (args.action === "TaskbarEditing" && !args.data.taskData.isTask) {
      let payload = {
        id: args.data.id,
        body: {
          startDate: moment(args.data.startDate).toISOString(),
          endDate: moment(args.data.endDate).toISOString(),
        },
      };
      updateMilestoneDate(payload);
    } else if (args.action === "TaskbarEditing" && args.data.taskData.isTask) {
      let payload = {
        id: args.data.id,
        body: {
          startDate: moment(args.data.startDate).toISOString(),
          endDate: moment(args.data.endDate).toISOString(),
        },
      };
      updateTaskDate(payload);
    }
  }

  const queryTaskbarInfo = (args) => {
    console.log(args, "queryTaskbarInfo");
    args.taskbarBorderColor = "transparent";
    // const currentDate = new Date();
    // if (new Date(args.data.endDate) < currentDate) {
    //   return (args.taskbarBgColor = "#FF8585");
    // }

    if (!args.data.taskData.isProject) {
      args.progressBarBgColor = "#22B07D";
      args.taskbarBgColor = "#00AD9F";
    } else {
      args.progressBarBgColor = "#374253";
      args.taskbarBgColor = args.data.taskData.color || "#DEDEE0";
    }
  };

  const CustomHeaderTemplate = () => {
    const [open, setopen] = React.useState(false);
    console.log(mileStonesList?.projectCount, "mileStonesList?.projectCount");
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [portfolio, setportfolio] = React.useState({});
    const handleClose = () => {
      setAnchorEl(null);
      setopen(false);
    };

    const { data: PortfolioList } = useQuery(
      ["workspace_portfolios"],
      () => {
        return axios.get(`portfolio/workspace_portfolios/${workspaceId}`);
      },
      {
        enabled: !!workspaceId,
        select: (res) => {
          return res.data.data.map((val) => {
            return {
              label: val?.name,
              value: val?.id,
            };
          });
        },
        refetchOnWindowFocus: false,
      }
    );

    return (
      <div key={mileStonesList?.id} className="bg-[#FAFBFD] !h-[80px] px-3  ">
        <p
          onClick={(event) => {
            setAnchorEl(event.currentTarget);
            setopen(true);
          }}
          className="font-bold text-sm leading-4 pt-3 w-max cursor-pointer "
        >
          {isEmpty(portfolio)
            ? "All Portfolios"
            : portfolio.label + " Portfoli"}

          <span>
            <KeyboardArrowDownIcon />
          </span>
        </p>
        <p className="text-gray-300 text-[12px] leading-6">
          {mileStonesList?.projectCount} Projects{" "}
          <span>
            <HelpIcon fontSize="12px" />
          </span>{" "}
        </p>
        {Boolean(open) && (
          <Popover
            onClose={handleClose}
            sx={{
              height: "200px",
            }}
            open={Boolean(open)}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <div
              tabIndex={0}
              className=" bg-white  border border-[#E8E8E9] rounded w-[270px]  "
            >
              <ul className="py-1">
                <li>
                  <input
                    type="text"
                    className=" text-[13px] border-0 border-b-slate-50"
                    placeholder="Search assignee"
                    // onChange={handleFilterChange}
                  />
                </li>
                <li>
                  <div
                    onClick={() => {
                      setSelectedPortfolio(null);
                      setportfolio(null);
                      handleClose();
                    }}
                    className="flex cursor-pointer items-center px-4 py-2 font-Manrope capitalize text-[14px] font-semibold  hover:bg-[#F2FFFE] hover:text-[#00B8A9] "
                  >
                    All Portfolios
                  </div>
                </li>
                {PortfolioList?.map((el) => (
                  <li key={el.value}>
                    <div
                      onClick={() => {
                        setSelectedPortfolio(el);
                        setportfolio(el);
                        handleClose();
                      }}
                      className="flex cursor-pointer items-center px-4 py-2 font-Manrope capitalize text-[14px] font-semibold  hover:bg-[#F2FFFE] hover:text-[#00B8A9] "
                    >
                      {el.label}{" "}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Popover>
        )}
      </div>
    );
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[25em]">
        <CircularProgress />;
      </div>
    );
  }
  return (
    <>
      {isOpenAddMileStone && (
        <AddMileStoneDialog
          isOpen={isOpenAddMileStone}
          handleClose={() => setisOpenAddMileStone(false)}
        />
      )}
      {milestoneState && <MileStoneDrawer />}
      {isOpenTaskDrawer && <TaskDrwayer />}

      <div className="w-full relative h-[calc(100vh-150px)]  overflow-auto ">
        <p
          style={{
            position: "absolute",
            top: 25,
            zIndex: 999,
            left: defaultWidth === "0%" ? "0px" : "24.2%",
            backgroundColor: "white",
            cursor: "pointer",
            transform: defaultWidth === "0%" && "rotate(180deg)",
            fontSize: "25px",
          }}
          className={`absolute rounded-full border-2 border-[#DEDEE0] top-[25px] left-[${
            defaultWidth === "0%" ? "0px" : "24.5%"
          }]`}
        >
          <ArrowBack
            style={{ width: "22px", height: "22px" }}
            onClick={clickHandler}
            fontSize="medium"
          />
        </p>
        <div className="h-[100%] overflow-auto ">
          <GanttComponent
            id="Default"
            key={mileStonesList?.projectCount}
            ref={(gantt) => (ganttInstance = gantt)}
            dataSource={mileStonesList?.projects}
            taskFields={taskFields}
            editSettings={editSettings}
            queryTaskbarInfo={queryTaskbarInfo}
            // taskbarTemplate={taskbarTemplate}
            rowHeight={55}
            disabled={true}
            taskbarHeight={30}
            connectorLineBackground="#dedee0"
            connectorLineWidth={2}
            // taskbarTemplate={TaskbarTemplate}
            // parentTaskbarTemplate={ParentTaskbarTemplate}
            // queryCellInfo={customizeCell}
            // rowDataBound={rowDataBound}
            gridLines="Both"
            height="100%"
            splitterResizing={false}
            splitterSettings={splitterSettings}
            timelineSettings={timelineSettings}
            actionComplete={handleActionComplete}
            // actionBegin={handleActionBegin} // Assign the event handler here
            workWeek={getWorkingDays}
            // toolbar={toolbarOptions}
            enableVirtualization={true}
          >
            <ColumnsDirective>
              <ColumnDirective
                field="name"
                template={TaskNameTemplate}
                headerTemplate={CustomHeaderTemplate}
              ></ColumnDirective>
              <ColumnDirective field="id" visible={false}></ColumnDirective>
            </ColumnsDirective>
            {/* <Inject services={[Edit]} /> */}
          </GanttComponent>
        </div>
      </div>
      {/* <Button
        onClick={() => setisOpenAddMileStone(true)}
        sx={{
          position: "absolute",
          zIndex: 999,
          bottom: 5,
          left: "310px",
          width: "20em",
          background: "#00AC9E",
          color: "white",
          "&:hover": {
            background: "#00AC9E",
          },
        }}
      >
        + Add A MileStone
      </Button>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          "& > *": {
            m: 1,
          },
        }}
      >
        <ButtonGroup
          sx={{
            display: "flex",
            position: "absolute",
            zIndex: 999,
            right: 20,
            top: 90,
            // background: "#00AC9E",
            // color: "white",
          }}
          size="small"
          variant="outlined"
          aria-label="outlined button group"
        >
          <Button
            onClick={() => setViewMode("Day")}
            variant={viewMode === "Day" ? "contained" : "outlined"}
          >
            Day
          </Button>
          <Button
            onClick={() => setViewMode("Week")}
            variant={viewMode === "Week" ? "contained" : "outlined"}
          >
            Week
          </Button>
          <Button
            onClick={() => setViewMode("Month")}
            variant={viewMode === "Month" ? "contained" : "outlined"}
          >
            Month
          </Button>
          <Button
            onClick={() => setViewMode("Year")}
            variant={viewMode === "Year" ? "contained" : "outlined"}
          >
            Year
          </Button>
        </ButtonGroup>
      </Box> */}
    </>
  );
}

export default TimeLine;

const TaskNameTemplate = (props) => {
  const {
    name,
    id: mileStone_Id,
    taskData: { tasks },
    taskData,
    childRecords,
    expanded,
    parentItem,
    startDate,
    endDate,
    duration,
    ...rest
  } = props;

  console.log(taskData, "propsmilestone");
  const [isOpenSubTasks, setisOpenSubTasks] = React.useState(expanded);
  const [taskVal, seTtaskVal] = React.useState("");
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const workspaceId = localStorage.getItem("workspaceId");

  const handleChange = (e) => {
    e.stopPropagation();
    setisOpenSubTasks(!isOpenSubTasks);
  };

  const handleAddTask = (e) => {
    e.stopPropagation();
    dispatch(openMilestone(mileStone_Id));
  };

  const { mutate } = useMutation({
    mutationKey: ["addMilestoneTask"],
    mutationFn: (data) => axios.post("/task/milestone", data),
    onSuccess: (data) => {
      seTtaskVal("");
      enqueueSnackbar(data.data.message, { variant: "success" });
      queryClient.invalidateQueries(["get-milestone"]);
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  const { data: usersList } = useQuery({
    queryKey: "workspace/workspace_members",
    queryFn: () => axios.get(`workspace/workspace_members/${workspaceId}`),
    select: (res) => {
      return res?.data?.data.map((val) => {
        return {
          value: val?.user_Id,
          label: val?.name,
        };
      });
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
    refetchOnWindowFocus: false,
  });

  const { mutate: updateAssignee } = useMutation({
    mutationKey: ["task/update_assignee"],
    mutationFn: (data) =>
      axios.put(
        `/task/update_assignee/${data.TaskId}?assignee=${data.assignee}`
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["get-milestone"]);
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  const handleAssigntoChange = (event, TaskId) => {
    let Id = event.value;
    let payload = {
      TaskId,
      assignee: Id,
    };
    updateAssignee(payload);
  };

  const handleSubmit = () => {
    if (!taskVal) return;
    let payload = {
      name: taskVal,
      mileStone_Id: mileStone_Id,
    };
    mutate(payload);
  };

  const startdate = _.upperFirst(moment(startDate).format("MMM DD"));
  const enddate = _.upperFirst(moment(endDate).format("MMM DD"));

  const todayDate = moment();

  return (
    <div key={mileStone_Id}>
      {taskData?.isProject ? (
        <>
          <div
            // onClick={() => dispatch(openMilestone(mileStone_Id))}
            className=" px-[20px] cursor-pointer "
          >
            <div
              className={`absolute right-0 px-3 py-1 rounded-l-xl items-center ${
                taskData.completed === 100
                  ? "text-[#01AD9F] bg-[#D9F2F0]"
                  : "text-[#FF8484] bg-[#FFDBDB] "
              } `}
            >
              {taskData.completed + "%"}
            </div>
            <div className=" font-medium ">
              {" "}
              <span>
                <PixIcon fontSize="22px" />
              </span>
              &nbsp;
              {name}
            </div>
            {/* <div className="flex items-center text-gray-400 ">
              <span>
                <CalendarMonthIcon fontSize="22px" />
              </span>
              &nbsp; {startdate} - {enddate} ({taskData.duration.split(":")[0]}
              {Number(taskData.duration) < 2 ? "day" : "days"})
            </div> */}
            <div
              onClick={handleChange}
              className="flex w-max items-center text-gray-400 border-b-2 border-white border-dashed hover:border-gray-600 cursor-pointer  "
            >
              <span>
                <TurnRightIcon fontSize="22px" />
              </span>
              &nbsp; {childRecords.length} Milestones
              {/* <span>
            <ArrowForwardIosIcon
              className={`${isOpenSubTasks && "rotate-90"}`}
              fontSize="22px"
            />
          </span> */}
            </div>
          </div>
        </>
      ) : (
        <div
          onClick={() => dispatch(openMilestone(mileStone_Id))}
          key={taskData.id}
          className="relative px-3 cursor-pointer  "
        >
          <div className="flex justify-between ">
            <p className="font-bold">{taskData.name}</p>

            {/* <div className="flex space-x-2">
              <div className=" text-sm flex space-x-2 items-center">
                <div>
                  <AvatarGroup
                    sx={{
                      "& .MuiAvatar-root": {
                        width: 18,
                        height: 18,
                        fontSize: 15,
                      },
                    }}
                    variant="rounded"
                    spacing="medium"
                    total={taskData?.assignees.length}
                    max={3}
                  >
                    {taskData?.assignees?.map((obj, index) => {
                      return (
                        <Avatar
                          key={index}
                          alt="Travis Howard"
                          src={obj.image.file_path}
                        />
                      );
                    })}
                  </AvatarGroup>
                </div>
                <PopupState variant="popover" popupId="demo-popup-popover">
                  {(popupState) => (
                    <div>
                      <div
                        {...bindTrigger(popupState)}
                        className="w-max cursor-pointer border border-gray-300 rounded-md bg-white flex items-center justify-center"
                      >
                        <Tooltip title="Add assignee" arrow>
                          <PersonAddIcon
                            sx={{ color: "#00A99B", fontSize: "18px" }}
                          />
                        </Tooltip>
                      </div>
                      <Popover
                        {...bindPopover(popupState)}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "center",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "center",
                        }}
                      >
                        <Box
                          sx={{
                            width: "200px",
                            height: "200px",
                            overflow: "auto",
                          }}
                        >
                          <div className="mt-2 px-2">
                            <Select
                              options={usersList}
                              placeholder="Search..."
                              onChange={(e) =>
                                handleAssigntoChange(e, taskData.id)
                              }
                            />
                          </div>
                        </Box>
                      </Popover>
                    </div>
                  )}
                </PopupState>
              </div>
            </div> */}
          </div>
          <div
            className={`absolute right-0 top-[-10px] px-3 py-1 rounded-l-xl items-center ${
              taskData.completed === 100
                ? "text-[#01AD9F] bg-[#D9F2F0]"
                : "text-[#FF8484] bg-[#FFDBDB] "
            } `}
          >
            {taskData.completed + "%"}
          </div>

          {/* <div
            onClick={() => dispatch(taskDrawyerOpen(taskData.id))}
            className="flex items-center justify-between space-x-1 "
          >
            <div className="flex space-x-3 items-center ">
              <div
                className={`w-max items-center ${
                  moment(taskData.endDate) < todayDate
                    ? "text-red-400"
                    : "text-gray-400"
                } hover:border-b-2 border-dashed border-red-600 cursor-pointer`}
              >
                <span>
                  <CalendarMonthIcon fontSize="22px" />
                </span>
                &nbsp; {moment(taskData.endDate).format("MMM D, HH:mm")}
              </div>
              <div className="flex space-x-1 items-center cursor-pointer">
                <AssignmentIcon sx={{ fontSize: "14px", color: "#B1B5D0" }} />
                <h6 className="text-[12px] text-[#B1B5D0] font-[700]">
                  {taskData?.subTaskCount} sub Task
                </h6>
              </div>
            </div>
            <div className=" text-[#B1B5D0] font-bold text-[11px]">
              In Progress
            </div>
          </div> */}
        </div>
      )}
    </div>
  );
};
