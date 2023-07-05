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
import Splitter from "./Splitter";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DescriptionIcon from "@mui/icons-material/Description";
import AddIcon from "@mui/icons-material/Add";
import AddMileStoneDialog from "./AddMileStoneModal";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useDispatch, useSelector } from "react-redux";
import { openMilestone } from "redux/reducers/mainDashbord";
import MileStoneDrawer from "components/Main/homeDashboard/dashboard/widgetsCards/milestones/MileStoneDrawer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "notistack";
import TaskDrwayer from "components/Main/homeDashboard/dashboard/widgetsCards/taskwidget/TaskDrwayer";
import { taskDrawyerOpen } from "redux/actions";
import { isEmpty } from "lodash";
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
import ArrowBack from "../../../public/icons/ArrowBack";
import MilestoneProgressModal from "./MilestoneProgressModal";
import { openMilestoneProgress } from "redux/actions";
import CircularProgress from "@mui/material/CircularProgress";

function SyncfusionGanttChart() {
  const [defaultWidth, setdefaultWidth] = React.useState("25%");
  const [mileStonesList, setMileStonesList] = React.useState([]);
  const [isOpenAddMileStone, setisOpenAddMileStone] = React.useState(false);
  const [viewMode, setViewMode] = React.useState("Month");
  let ganttInstance;
  const { milestoneState } = useSelector((state) => state?.dashbordSlice);
  const isOpenTaskDrawer = useSelector(
    (state) => state?.projectTaskSlice?.taskState
  );
  const dispatch = useDispatch();
  const isOpen = useSelector(
    (state) => state.projectTaskSlice.milestoneProgress
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
    child: "tasks",
    dependency: "predecessor",
    progress: "progress",
  };

  let { projectId } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const { data: milestoneData, isLoading } = useQuery({
    queryKey: ["get-milestone", projectId],
    queryFn: () => axios.get(`milestone/${projectId}`),
    // onSuccess: (data) => {
    //   // console.log(data, "testresponse");
    //   // let updatedArr = data.data.data.map((obj) => {
    //   //   return {
    //   //     ...obj,
    //   //     progress: obj.completedPercentage,
    //   //     tasks:
    //   //       obj.tasks.length > 0
    //   //         ? obj.tasks.map((task) => {
    //   //             return {
    //   //               ...task,
    //   //               progress: task.completedPercentage,
    //   //             };
    //   //           })
    //   //         : [],
    //   //   };
    //   // });

    //   // console.log(updatedArr, "updatedArr");
    //   setMileStonesList(data.data.data);
    // },
    select: (data) => {
      let updatedArr = data.data.data.map((obj) => {
        return {
          ...obj,
          progress: 30,
          tasks:
            obj.tasks.length > 0
              ? obj.tasks.map((task) => {
                  return {
                    ...task,
                    progress: 30,
                  };
                })
              : [],
        };
      });
      return updatedArr;
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
    refetchOnWindowFocus: false,
  });

  console.log(milestoneData, "milestoneData");

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
    template: <Splitter />,
    separatorSize: 1,
  };

  const timelineSettings = {
    timelineUnitSize: 50,
    timelineViewMode: viewMode,
    // topTier: {
    //   unit: "Month",
    //   format: "MMMMMMMMM",
    // },
    // bottomTier: {
    //   unit: "Day",
    //   format: "ddd DD",
    //   formatter: (date) => {
    //     const day = moment(date).format("ddd");
    //     const dayNumber = moment(date).format("DD");
    //     return `${day} ${dayNumber}`;
    //   },
    // },
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
    const currentDate = new Date();
    if (new Date(args.data.endDate) < currentDate) {
      return (args.taskbarBgColor = "#FF8585");
    }
    if (args.data.taskData.isTask) {
      args.progressBarBgColor = "#22B07D";
      args.taskbarBgColor = "#00AD9F";
    } else if (!args.data.taskData.isTask) {
      args.progressBarBgColor = "#DEDEE0";
      args.taskbarBgColor = args.data.taskData.color || "#9399AB";
    } else {
      args.progressBarBgColor = "#FFBA2F";
      args.taskbarBgColor = "#FFBA2F";
    }
  };

  // Event handler for actionBegin event
  // function handleActionBegin(args) {
  //   console.log(args, "handleActionBegin");
  // }

  //for custom taskabar

  // function TaskbarTemplate(props) {
  //   return (
  //     <div className="e-gantt-child-taskbar-inner-div e-gantt-child-taskbar">
  //       <div className="e-gantt-child-progressbar-inner-div e-gantt-child-progressbar"></div>
  //       <span className="e-task-label">{props.TaskName}</span>
  //     </div>
  //   );
  // }
  // function ParentTaskbarTemplate(props) {
  //   return (
  //     <div className="e-gantt-parent-taskbar-inner-div e-gantt-parent-taskbar">
  //       <div className="e-gantt-parent-progressbar-inner-div e-row-expand e-gantt-parent-progressbar"></div>
  //       <span className="e-task-label">{props.TaskName}</span>
  //     </div>
  //   );
  // }

  // function customizeCell(args) {
  //   console.log(args, "arg");
  //   args.cell.style.backgroundColor = "lightgreen";
  //   if (args.column.field == "Progress") {
  //     args.cell.style.backgroundColor = "lightgreen";
  //   }
  // }
  // function rowDataBound(args) {
  //   if (args.data.TaskID == 43) args.row.style.backgroundColor = "red";
  // }
  const toolbarOptions = [
    "PrevTimeSpan",
    "NextTimeSpan",
    "ExpandAll",
    "CollapseAll",
  ];

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
            top: 50,
            zIndex: 999,
            left: defaultWidth === "0%" ? "0px" : "24.5%",
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
        <div className="h-[100%]">
          <GanttComponent
            id="RoadMap"
            ref={(gantt) => (ganttInstance = gantt)}
            dataSource={milestoneData}
            taskFields={taskFields}
            // editSettings={editSettings}
            queryTaskbarInfo={queryTaskbarInfo}
            // taskbarTemplate={taskbarTemplate}
            rowHeight={114}
            taskbarHeight={30}
            connectorLineBackground="#dedee0"
            connectorLineWidth={2}
            // taskbarTemplate={TaskbarTemplate}
            // parentTaskbarTemplate={ParentTaskbarTemplate}
            // queryCellInfo={customizeCell}
            // rowDataBound={rowDataBound}
            gridLines="Both"
            height="100%"
            splitterSettings={splitterSettings}
            timelineSettings={timelineSettings}
            actionComplete={handleActionComplete}
            // actionBegin={handleActionBegin} // Assign the event handler here
            workWeek={getWorkingDays}
            toolbar={toolbarOptions}
          >
            <ColumnsDirective>
              <ColumnDirective
                field="name"
                template={TaskNameTemplate}
                headerTemplate={CustomHeaderTemplate}
              ></ColumnDirective>
              <ColumnDirective field="id" visible={false}></ColumnDirective>
            </ColumnsDirective>
            <Inject services={[Edit, Toolbar]} />
          </GanttComponent>
        </div>
      </div>

      <Button
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

      <div>
        <Button
          onClick={() => dispatch(openMilestoneProgress())}
          sx={{
            display: "flex",
            position: "absolute",
            zIndex: 999,
            right: 250,
            top: 100,
          }}
          size="small"
          variant="outlined"
          aria-label="outlined button group"
        >
          progress
        </Button>
      </div>

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
          {/* <Button
            onClick={() => setViewMode("Day")}
            variant={viewMode === "Day" ? "contained" : "outlined"}
          >
            Day
          </Button> */}
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
      </Box>
      {isOpen && <MilestoneProgressModal data={mileStonesList} />}
    </>
  );
}

export default SyncfusionGanttChart;

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
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const workspaceId = localStorage.getItem("workspaceId");
  const dispatch = useDispatch();

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
      {childRecords?.length > 0 && isEmpty(parentItem) ? (
        <>
          <div
            onClick={() => dispatch(openMilestone(mileStone_Id))}
            className=" space-y-1 px-[20px] cursor-pointer "
          >
            {taskData.name !== "Milestone 0" && (
              <div
                className={`absolute right-0 px-3 py-1 rounded-l-xl items-center ${
                  taskData.completedPercentage === 100
                    ? "text-[#01AD9F] bg-[#D9F2F0]"
                    : "text-[#FF8484] bg-[#FFDBDB] "
                } `}
              >
                {taskData.completedPercentage + "%"}
              </div>
            )}
            <div className=" font-medium ">{name}</div>
            <div className="flex items-center text-gray-400 ">
              <span>
                <CalendarMonthIcon fontSize="22px" />
              </span>
              &nbsp; {startdate} - {enddate} ({taskData.duration.split(":")[0]}
              {Number(taskData.duration) < 2 ? "day" : "days"})
            </div>
            <div
              onClick={handleChange}
              className="flex w-max items-center text-gray-400 hover:border-b-2 border-dashed border-gray-600 cursor-pointer  "
            >
              <span>
                <DescriptionIcon fontSize="22px" />
              </span>
              &nbsp; {childRecords.length} Open tasks
              {/* <span>
            <ArrowForwardIosIcon
              className={`${isOpenSubTasks && "rotate-90"}`}
              fontSize="22px"
            />
          </span> */}
            </div>
          </div>
          <div className="mt-2 relative">
            <span className="absolute top-1 px-6">
              <AddIcon sx={{ fontSize: "22px", color: "#B1B5D0" }} />
            </span>
            <input
              className="outline-none w-full border-t text-[12px] font-[500] border-gray-200 h-[35px] pl-[3rem]"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
              value={taskVal}
              onChange={(e) => seTtaskVal(e.target.value)}
              placeholder="Add a new Task ..."
            />
          </div>
        </>
      ) : !isEmpty(parentItem) ? (
        <div key={taskData.id} className=" px-3 cursor-pointer ">
          <div className="flex justify-between ">
            <p
              onClick={() => dispatch(taskDrawyerOpen(taskData.id))}
              className="font-bold"
            >
              {taskData.taskName}
            </p>
            <div className="flex space-x-2">
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
            </div>
          </div>
          <div
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
          </div>
        </div>
      ) : (
        <div
          onClick={() => dispatch(openMilestone(mileStone_Id))}
          className=" space-y-1 px-[20px] cursor-pointer "
        >
          {taskData.name !== "Milestone 0" && (
            <div
              className={`absolute right-0 px-3 py-1 rounded-l-xl items-center ${
                taskData.completedPercentage === 100
                  ? "text-[#01AD9F] bg-[#D9F2F0]"
                  : "text-[#FF8484] bg-[#FFDBDB] "
              } `}
            >
              {taskData.completedPercentage + "%"}
            </div>
          )}
          <div className=" font-medium ">{name}</div>
          <div className="flex items-center text-gray-400 ">
            <span>
              <CalendarMonthIcon fontSize="22px" />
            </span>
            &nbsp; {startdate} - {enddate} ({taskData.duration.split(":")[0]}{" "}
            {Number(taskData.duration) < 2 ? "day" : "days"})
          </div>
          <div
            onClick={handleAddTask}
            className="flex w-max items-center text-[#00AC9E] border-dashed border-gray-600 cursor-pointer  "
          >
            <span>
              <DescriptionIcon fontSize="22px" />
            </span>
            &nbsp; Add a task...
          </div>
        </div>
      )}
    </div>
  );
};

const CustomHeaderTemplate = () => {
  return (
    <div className="bg-[#FAFBFD] h-full ">
      <span>Custom Header</span>
    </div>
  );
};
