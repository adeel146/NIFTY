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

// const data = [
//   {
//     TaskID: 1,
//     TaskName: "Project Initiation",
//     StartDate: new Date("04/02/2019"),
//     EndDate: new Date("04/04/2019"),
//     subtasks: [
//       {
//         TaskID: 2,
//         TaskName: "Identify Site location",
//         StartDate: new Date("04/02/2019"),
//         Duration: 4,
//         progress: 50,
//       },
//       {
//         TaskID: 3,
//         TaskName: "Perform Soil test",
//         StartDate: new Date("04/02/2019"),
//         Duration: 4,
//         Predecessor: "2FS",
//       },
//       {
//         TaskID: 4,
//         TaskName: "Soil test approval",
//         StartDate: new Date("04/02/2019"),
//         Duration: 4,
//       },
//     ],
//   },
//   {
//     TaskID: 2,
//     TaskName: "Identify Site location",
//     StartDate: new Date("04/02/2019"),
//     Duration: 4,
//     progress: 50,
//   },
//   {
//     TaskID: 3,
//     TaskName: "Perform Soil test",
//     StartDate: new Date("04/07/2019"),
//     Duration: 8,
//     Predecessor: "2",
//   },
//   {
//     TaskID: 4,
//     TaskName: "Soil test approval",
//     StartDate: new Date("04/02/2019"),
//     Duration: 4,
//   },
//   {
//     TaskID: 43,
//     TaskName: "Soil test approval",
//     StartDate: new Date("04/02/2019"),
//     Duration: 4,
//   },
//   {
//     TaskID: 42,
//     TaskName: "Soil test approval",
//     StartDate: new Date("04/02/2019"),
//     Duration: 4,
//   },
//   {
//     TaskID: 41,
//     TaskName: "Soil test approval",
//     StartDate: new Date("04/02/2019"),
//     Duration: 4,
//     Predecessor: "3",
//   },
//   {
//     TaskID: 5,
//     TaskName: "Project Estimation",
//     StartDate: new Date("04/02/2019"),
//     EndDate: new Date("04/21/2019"),
//     // subtasks: [
//     //   {
//     //     TaskID: 6,
//     //     TaskName: "Develop floor plan for estimation",
//     //     StartDate: new Date("04/04/2019"),
//     //     Duration: 3,
//     //   },
//     // ],
//   },
// ];

function WorkloadTimeLine() {
  const [defaultWidth, setdefaultWidth] = React.useState("25%");
  const [mileStonesList, setMileStonesList] = React.useState([]);
  const [isOpenAddMileStone, setisOpenAddMileStone] = React.useState(false);
  const [viewMode, setViewMode] = React.useState("Month");
  let ganttInstance;
  const { milestoneState } = useSelector((state) => state?.dashbordSlice);
  const isOpenTaskDrawer = useSelector(
    (state) => state?.projectTaskSlice?.taskState
  );
  const loginUserDetail = useAuth();

  // const workWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
  // const taskFields = {
  //   id: "TaskID",
  //   name: "TaskName",
  //   startDate: "StartDate",
  //   endDate: "EndDate",
  //   duration: "duration",
  //   child: "subtasks",
  //   dependency: "predecessor",
  // };

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
    id: "TaskID",
    name: "TaskName",
    startDate: "StartDate",
    endDate: "EndDate",
    duration: "Duration",
    progress: "Progress",
    dependency: "Predecessor",
    resourceInfo: "resources",
    work: "work",
    expandState: "isExpand",
    child: "subtasks",
  };

  const resourceFields = {
    id: "resourceId",
    name: "resourceName",
    unit: "resourceUnit",
    group: "resourceGroup",
  };

  let { projectId } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const { isLoading } = useQuery({
    queryKey: ["get-milestone", projectId],
    queryFn: () => axios.get(`milestone/${144}`),
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
      args.progressBarBgColor = "#374253";
      args.taskbarBgColor = args.data.taskData.color || "#DEDEE0";
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

  function TaskbarTemplate(props) {
    return (
      <div className="e-gantt-child-taskbar-inner-div e-gantt-child-taskbar ">
        <div className="e-gantt-child-progressbar-inner-div e-gantt-child-progressbar"></div>
        <span className="e-task-label">{props.TaskName}</span>
      </div>
    );
  }

  const childTaskbarTemplate = TaskbarTemplate.bind(this);
  function ParentTaskbarTemplate(props) {
    return (
      <div className="e-gantt-parent-taskbar-inner-div e-gantt-parent-taskbar">
        <div className="e-gantt-parent-progressbar-inner-div e-row-expand e-gantt-parent-progressbar"></div>
        <span className="e-task-label">{props.TaskName}</span>
      </div>
    );
  }

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
  //   const toolbarOptions = [
  //     "PrevTimeSpan",
  //     "NextTimeSpan",
  //     "ExpandAll",
  //     "CollapseAll",
  //   ];

  const resources = [
    {
      resourceId: 1,
      resourceName: "Martin Tamer",
      resourceGroup: "Planning Team",
      isExpand: false,
    },
    {
      resourceId: 2,
      resourceName: "Rose Fuller",
      resourceGroup: "Testing Team",
      isExpand: false,
    },
    {
      resourceId: 3,
      resourceName: "Margaret Buchanan",
      resourceGroup: "Approval Team",
      isExpand: false,
    },
    {
      resourceId: 4,
      resourceName: "Fuller King",
      resourceGroup: "Development Team",
      isExpand: false,
    },
    {
      resourceId: 5,
      resourceName: "Davolio Fuller",
      resourceGroup: "Approval Team",
      isExpand: false,
    },
  ];

  const multiTaskbarData = [
    {
      TaskID: 1,
      TaskName: "Project initiation",
      StartDate: new Date("03/29/2019"),
      EndDate: new Date("04/21/2019"),
      subtasks: [
        {
          TaskID: 2,
          TaskName: "Identify site location",
          StartDate: new Date("03/29/2019"),
          Duration: 3,
          Progress: 30,
          work: 10,
          resources: [{ resourceId: 1, resourceUnit: 50 }],
        },
        {
          TaskID: 3,
          TaskName: "Perform soil test",
          StartDate: new Date("04/03/2019"),
          Duration: 4,
          resources: [{ resourceId: 1, resourceUnit: 70 }],
          Predecessor: 2,
          Progress: 30,
          work: 20,
        },
        {
          TaskID: 4,
          TaskName: "Soil test approval",
          StartDate: new Date("04/09/2019"),
          Duration: 4,
          resources: [{ resourceId: 1, resourceUnit: 25 }],
          Predecessor: 3,
          Progress: 30,
          work: 10,
        },
      ],
    },
    {
      TaskID: 5,
      TaskName: "Project estimation",
      StartDate: new Date("03/29/2019"),
      EndDate: new Date("04/21/2019"),
      subtasks: [
        {
          TaskID: 6,
          TaskName: "Develop floor plan for estimation",
          StartDate: new Date("04/01/2019"),
          Duration: 5,
          Progress: 30,
          resources: [{ resourceId: 2, resourceUnit: 50 }],
          work: 30,
        },
        {
          TaskID: 7,
          TaskName: "List materials",
          StartDate: new Date("04/04/2019"),
          Duration: 4,
          resources: [{ resourceId: 2, resourceUnit: 40 }],
          Predecessor: "6FS-2",
          Progress: 30,
          work: 40,
        },
        {
          TaskID: 8,
          TaskName: "Estimation approval",
          StartDate: new Date("04/09/2019"),
          Duration: 4,
          resources: [{ resourceId: 2, resourceUnit: 75 }],
          Predecessor: "7FS-1",
          Progress: 30,
          work: 60,
        },
      ],
    },
    {
      TaskID: 9,
      TaskName: "Site work",
      StartDate: new Date("04/04/2019"),
      EndDate: new Date("04/21/2019"),
      subtasks: [
        {
          TaskID: 10,
          TaskName: "Install temporary power service",
          StartDate: new Date("04/01/2019"),
          Duration: 14,
          Progress: 30,
          resources: [{ resourceId: 3, resourceUnit: 75 }],
        },
        {
          TaskID: 11,
          TaskName: "Clear the building site",
          StartDate: new Date("04/08/2019"),
          Duration: 9,
          Progress: 30,
          Predecessor: "10FS-9",
          resources: [3],
        },
        {
          TaskID: 12,
          TaskName: "Sign contract",
          StartDate: new Date("04/12/2019"),
          Duration: 5,
          resources: [3],
          Predecessor: "11FS-5",
        },
      ],
    },
    {
      TaskID: 13,
      TaskName: "Foundation",
      StartDate: new Date("04/04/2019"),
      EndDate: new Date("04/21/2019"),
      subtasks: [
        {
          TaskID: 14,
          TaskName: "Excavate for foundations",
          StartDate: new Date("04/01/2019"),
          Duration: 2,
          Progress: 30,
          resources: [4],
        },
        {
          TaskID: 15,
          TaskName: "Dig footer",
          StartDate: new Date("04/04/2019"),
          Duration: 2,
          Predecessor: "14FS + 1",
          resources: [4],
        },
        {
          TaskID: 16,
          TaskName: "Install plumbing grounds",
          StartDate: new Date("04/08/2019"),
          Duration: 2,
          Progress: 30,
          Predecessor: 15,
          resources: [4],
        },
      ],
    },
    {
      TaskID: 17,
      TaskName: "Framing",
      StartDate: new Date("04/04/2019"),
      EndDate: new Date("04/21/2019"),
      subtasks: [
        {
          TaskID: 18,
          TaskName: "Add load-bearing structure",
          StartDate: new Date("04/03/2019"),
          Duration: 2,
          Progress: 30,
          resources: [5],
        },
        {
          TaskID: 19,
          TaskName: "Natural gas utilities",
          StartDate: new Date("04/08/2019"),
          Duration: 4,
          Predecessor: "18",
          resources: [5],
        },
        {
          TaskID: 20,
          TaskName: "Electrical utilities",
          StartDate: new Date("04/11/2019"),
          Duration: 2,
          Progress: 30,
          Predecessor: "19FS + 1",
          resources: [5],
        },
      ],
    },
  ];
  const projectStartDate = new Date("03/28/2019");
  const projectEndDate = new Date("05/18/2019");
  const labelSettings = {
    taskLabel: "TaskName",
  };

  if (isLoading) {
    <CustomLoader />;
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
            taskbarHeight={30}
            // connectorLineBackground="#dedee0"
            // connectorLineWidth={2}
            // // parentTaskbarTemplate={ParentTaskbarTemplate}
            // // queryCellInfo={customizeCell}
            // // rowDataBound={rowDataBound}
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

            ref={(gantt) => (ganttInstance = gantt)}
            dataSource={multiTaskbarData}
            treeColumnIndex={1}
            viewType="ResourceView"
            enableMultiTaskbar={true}
            allowSelection={true}
            allowResizing={true}
            highlightWeekends={true}
            // toolbar={toolbar}
            editSettings={editSettings}
            projectStartDate={projectStartDate}
            projectEndDate={projectEndDate}
            resourceFields={resourceFields}
            taskFields={taskFields}
            labelSettings={labelSettings}
            splitterSettings={splitterSettings}
            resources={resources}
            showOverAllocation={true}
            allowTaskbarOverlap={false}
          >
            <ColumnsDirective>
              <ColumnDirective
                field="TaskName"
                // template={TaskNameTemplate}
                headerTemplate={CustomHeaderTemplate}
              ></ColumnDirective>
              <ColumnDirective field="TaskID" visible={false}></ColumnDirective>
            </ColumnsDirective>
            <Inject services={[Edit]} />
          </GanttComponent>
        </div>
      </div>
    </>
  );
}

export default WorkloadTimeLine;

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

  return (
    <div key={mileStone_Id}>
      <div
        onClick={() => dispatch(openMilestone(mileStone_Id))}
        className=" space-y-1 px-[20px] cursor-pointer "
      >
        <div className=" font-medium ">{name}</div>
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
