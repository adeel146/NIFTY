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
import { useDispatch, useSelector } from "react-redux";
import { openMilestone } from "redux/reducers/mainDashbord";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "notistack";
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
import AddMileStoneDialog from "routes/roadMap/AddMileStoneModal";
import MileStoneDrawer from "components/Main/homeDashboard/dashboard/widgetsCards/milestones/MileStoneDrawer";
import TaskDrwayer from "components/Main/homeDashboard/dashboard/widgetsCards/taskwidget/TaskDrwayer";
import ArrowBack from "../../../public/icons/ArrowBack";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CircularProgress from "@mui/material/CircularProgress";

function WorkloadTimeLine() {
  const workspaceId = localStorage.getItem("workspaceId");
  const [defaultWidth, setdefaultWidth] = React.useState("25%");
  const [mileStonesList, setMileStonesList] = React.useState([]);
  const [viewMode, setViewMode] = React.useState("Month");

  const { isLoading, data = {} } = useQuery(
    ["get-workloads", workspaceId],
    async () => {
      return axios.get(`workload?workspace_id=${workspaceId}`);
    },
    {
      select: (res) => {
        const resData = res?.data?.data;
        return {
          startDate: moment(resData?.startDate)
            .subtract(2, "days")
            .format("MM/DD/YYYY"),
          endDate: moment(resData?.endDate)
            .add(15, "days")
            .format("MM/DD/YYYY"),
          resources:
            resData.resources?.map((val) => {
              return {
                resourceId: val.resourceId,
                resourceName: val.resourceName ?? "no name",
                resourceGroup: val.resourceName ?? "no name",
                isExpand: false,
                data: val.data,
              };
            }) ?? [],
          tasks: resData?.tasks?.map((val) => {
            return {
              task_Id: val.task_Id,
              taskName: val.taskName,
              startDate: new Date(moment(val.startDate).format("DD/MM/YYYY")),
              duration: val.duration,
              resources: val.resources,
              Progress: val.progress,
              work: val.work,
            };
          }),
        };
      },
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  let ganttInstance;
  const isOpenTaskDrawer = useSelector(
    (state) => state?.projectTaskSlice?.taskState
  );

  const taskFields = {
    id: "task_Id",
    name: "taskName",
    startDate: "startDate",
    // endDate: "EndDate",
    duration: "duration",
    progress: "progress",
    resourceInfo: "resources",
    expandState: "isExpand",
  };

  const resourceFields = {
    id: "resourceId",
    name: "resourceName",
    data: "data",
  };

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
    timelineUnitSize: 60,
    timelineViewMode: viewMode,
    // topTier: {
    //   unit: "Day",
    //   format: "ddd",
    // },
    bottomTier: {
      unit: "Day",
      format: "ddd DD",
      formatter: (date) => {
        const day = moment(date).format("ddd");
        const dayNumber = moment(date).format("DD");
        return `${day} ${dayNumber}`;
      },
    },
  };
  const projectStartDate = new Date("03/28/2019");
  const projectEndDate = new Date("05/18/2023");
  const labelSettings = {
    taskLabel: "taskName",
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[25em]">
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
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
        <div className="h-[100%]">
          <GanttComponent
            id="WorkLoad-TimeLine"
            // ref={(gantt) => (ganttInstance = gantt)}
            // resources={resources}
            // dataSource={multiTaskbarData}
            // resourceFields={resourceFields}
            // showOverAllocation={true}
            // viewType="ResourceView"
            // enableMultiTaskbar={true}
            // taskFields={taskFields}
            // editSettings={editSettings}
            // queryTaskbarInfo={queryTaskbarInfo}
            // taskbarTemplate={childTaskbarTemplate}
            rowHeight={100}
            taskbarHeight={50}
            // connectorLineBackground="#dedee0"
            // connectorLineWidth={2}
            gridLines="Both"
            height="100%"
            // splitterResizing={false}
            // splitterSettings={splitterSettings}
            timelineSettings={timelineSettings}
            // actionComplete={handleActionComplete}
            // // actionBegin={handleActionBegin} // Assign the event handler here
            // workWeek={getWorkingDays}
            // allowTaskbarOverlap={false}
            // // toolbar={toolbarOptions}
            // key={JSON.stringify(workLoadsList)}
            ref={(gantt) => (ganttInstance = gantt)}
            taskFields={taskFields}
            treeColumnIndex={1}
            viewType="ResourceView"
            enableMultiTaskbar={true}
            allowSelection={true}
            allowResizing={true}
            highlightWeekends={true}
            // toolbar={toolbar}
            editSettings={editSettings}
            projectStartDate={
              data?.startDate ? new Date(data?.startDate) : new Date()
            }
            projectEndDate={
              data?.endDate ? new Date(data?.endDate) : new Date()
            }
            // projectStartDate={projectStartDate}
            // projectEndDate={projectEndDate}
            resourceFields={resourceFields}
            labelSettings={labelSettings}
            splitterSettings={splitterSettings}
            resources={data?.resources ?? []}
            dataSource={data?.tasks ?? []}
            showOverAllocation={true}
            allowTaskbarOverlap={false}
          >
            <ColumnsDirective>
              <ColumnDirective
                field="TaskName"
                template={TaskNameTemplate}
                headerTemplate={CustomHeaderTemplate}
              ></ColumnDirective>
              <ColumnDirective
                field="task_Id"
                visible={false}
              ></ColumnDirective>
            </ColumnsDirective>
          </GanttComponent>
        </div>
      </div>
    </>
  );
}

export default WorkloadTimeLine;

const TaskNameTemplate = (props) => {
  const { name, id: mileStone_Id, expanded, taskData } = props;

  console.log(taskData, "taskData");

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

  return (
    taskData.resourceId && (
      <div className="absolute top-0 w-full" key={mileStone_Id}>
        <div
          onClick={() => dispatch(openMilestone(mileStone_Id))}
          className=" space-y-1 px-3 cursor-pointer "
        >
          <div className=" font-medium ">{name}</div>
          <div
            onClick={handleChange}
            className="flex items-center flex-col text-gray-400 cursor-pointer  "
          >
            {/* <span>
            <DescriptionIcon fontSize="22px" />
          </span>
          &nbsp; {childRecords.length} Open tasks */}
            <div className="flex w-full mt-1">
              <Avatar
                variant="rounded"
                src={taskData.data.photo.file_path}
                sx={{ width: "32px", height: "32px" }}
              />
              <div className="flex w-full mt-2 ml-[5px] relative">
                <h5 className="pb-[16px] text-[#333] font-medium">
                  {taskData.data.name}
                </h5>
                <div className="px-[6px] py-2 absolute bottom-0 text-[11px] rounded-[3px] text-[#fff] bg-[#00B9A9] inline">
                  Front end developer
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col gap-1 mt-1">
              <div className="flex items-center">
                <CalendarTodayOutlinedIcon sx={{ fontSize: "13px" }} />
                <p className="text-[11px] ml-1">2 hours track Nov 1 - Nov 8</p>
              </div>
              <div className="flex items-center">
                <AssignmentOutlinedIcon sx={{ fontSize: "13px" }} />
                <p className="text-[11px] ml-1">
                  {taskData?.Children?.length} open tasks{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

const CustomHeaderTemplate = () => {
  const [open, setopen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [portfolio, setportfolio] = React.useState({});
  const handleClose = () => {
    setAnchorEl(null);
    setopen(false);
  };
  return (
    <div className="bg-[#FAFBFD] h-full px-3 py-1 ">
      <div className="flex w-full justify-between">
        <h3 className="text-[14px] text-[#333] font-medium">Members</h3>
        {/* <div className="group relative">
          <button className="px-0 py-0  text-[#9399AB] flex items-center font-Manrope text-[13px]">
            Filter By{" "}
            <KeyboardArrowDownOutlinedIcon
              sx={{ fontSize: "17px", marginLeft: "3px" }}
            />
          </button>
          <div
            tabIndex={0}
            className=" bg-white invisible border border-[#E8E8E9] rounded w-[120px] right-1 absolute  top-full transition-all opacity-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-1 z-[999]"
          >
            <ul className="py-1 commonDropDown">
              <li className="px-2 mb-1">
                <a href="#" className="d-flex font-Manrope text-[12px]">
                  On track
                </a>
              </li>
              <li className="px-2 mb-1 selected">
                <a href="#" className="d-flex font-Manrope text-[12px]">
                  At risk
                </a>
              </li>
            </ul>
          </div>
        </div> */}
        {/* {Boolean(open) && (
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
                      // setSelectedPortfolio(null);
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
        )} */}
      </div>
      <div className=" relative mt-[1px] flex">
        <span className="relative -top-1">
          <SearchOutlinedIcon sx={{ fontSize: "16px", cursor: "pointer" }} />
        </span>
        <input
          placeholder="Search by name or tag ..."
          className="outline-none w-full bg-none text-[12px] font-[400] h-[24px] bg-transparent pl-[4px] border-none"
          value=""
        />
      </div>
    </div>
  );
};
