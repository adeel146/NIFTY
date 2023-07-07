import {
  Menu,
  MenuItem,
  Paper,
  Popper,
  Popover,
  Box,
  Autocomplete,
  TextField,
  IconButton,
} from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Select from "react-select";
import TaskActions from "./TaskActions";
import { isEmpty } from "lodash";
import CancelIcon from "@mui/icons-material/Cancel";

import { useGetOverdueCount, usePortfolios } from "hooks/Portfolio";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useSelector } from "react-redux";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TableViewIcon from "@mui/icons-material/TableView";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
import { DateRangePicker } from "react-date-range";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import CheckIcon from "@mui/icons-material/Check";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import {
  useAddProjectTask,
  useGetAllMyTasks,
  useGetProjectList,
  useGetProjectStatus,
  useGetProjectTasks,
} from "hooks/MyWork";
import { useAuth } from "hooks/useAuth";
import { useDisplaySuccess } from "hooks/useDisplaySuccess";
import ReportsView from "./ReportsView";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import { formateDate } from "utils";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { taskDrawyerOpen } from "redux/actions";
import { Apis } from "static/apis";
import { useParams } from "react-router-dom";
import TaskDrwayer from "components/Main/homeDashboard/dashboard/widgetsCards/taskwidget/TaskDrwayer";
import WhiteButton from "hooks/Common/commonButtons/WhiteButton";
import GreenButton from "hooks/Common/commonButtons/GreenButton";
import { useDisplayError } from "hooks/useDisplayError";
import moment from "moment";

function MyTasks({
  isProjectSelect,
  setIsProjectSelect,
  setIsEditColumn,
  selectedView,
}) {
  const [filterBy, setFilterBy] = useState("");
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [allProjectsAnchorEl, setAllProjectsAnchorEl] = useState(null);
  const [groupByAchorEl, setGroupByAnchorEl] = useState(null);
  const [viewsAchorEl, setViewsAnchorEl] = useState(null);
  const [activeGroupBy, setActiveGroupBy] = useState("list");
  const [addNewView, setAddNewView] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [newView, setNewView] = useState("");
  const [newTask, setNewTask] = useState(null);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  const [statusSelectAnchorEl, setStatusSelectAnchorEl] = useState(null);
  const [selectedList, setSelectedList] = useState(null);
  const [listSelectAnchorEl, setListSelectAnchorEl] = useState(null);
  const [isTaskSelected, setIsTaskSelected] = useState(false);
  const { activeWorkspace } = useSelector(({ workspace }) => workspace);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [expandedPortfolios, setExpandedPortfolios] = useState([]);
  const [searchPortfolio, setSearchPortfolio] = useState("");
  const [searchTask, setSearchTask] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState(null);
  const [newTaskList, setNewTaskList] = useState(null);
  const [openCollapsibles, setOpenCollapsibles] = useState([]);
  const auth = useAuth();
  let { projectId } = useParams();
  const [tagId, setTagId] = useState(false);
  const dispatch = useDispatch();
  const [addNewTaskProjectId, setAddNewTaskProjectId] = useState(null);
  const [currMilestoneId, setCurrMilestoneId] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [isOpenUsers, setIsOpenUsers] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElDateNewTask, setAnchorElDateNewTask] = useState(null);
  const [newTaskDueDate, setNewTaskDueDate] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [newTaskAssignee, setNewTaskAssignee] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isOpendateChange, setIsOpendateChange] = useState(false);
  const allProjectsRef = useRef(null);
  const workspaceId = localStorage.getItem("workspaceId");
  const [filters, setFilters] = useState([
    { name: "Incomplete tasks", key: 1 },
    { name: "Completed Tasks", key: 2 },
    { name: "All Tasks", key: 3 },
  ]);
  const [sortings, setSortings] = useState([
    { name: "Start Date", key: 1 },
    { name: "Created on", key: 2 },
    { name: "Last Modified on", key: 3 },
    { name: "Likes", key: 4 },
    { name: "Alphabetical", key: 5 },
  ]);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [sortBy, setSortBy] = useState(null);

  const [isOpendateChangeAnchorEl, setIsOpendateChangeAnchorEl] =
    useState(null);
  const [DateRangeVal, setDateRangeVal] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const queryClient = useQueryClient();
  const isOpenTaskDrawer = useSelector(
    (state) => state?.projectTaskSlice?.taskState
  );
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSearch = (event) => {
    setSearchPortfolio(event.target.value);
  };
  const handleNewDateClick = (event) => {
    setAnchorElDateNewTask(event.currentTarget);
  };
  const { data: usersList } = useQuery({
    queryKey: "workspace/workspace_members",
    queryFn: () => axios.get(`workspace/workspace_members/${workspaceId}`),
    select: (res) => {
      return res?.data?.data.map((val) => {
        return {
          value: val?.user_Id,
          label: val?.name,
          email: val?.email,
        };
      });
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
    refetchOnWindowFocus: false,
  });

  const handleProjectCheckboxChange = (portfolioId) => {
    const updatedPortfolios = selectedProjects?.map((portfolio) => {
      if (portfolio.id === portfolioId) {
        return {
          ...portfolio,
          isChecked: !portfolio.isChecked, // Toggle the isChecked value
        };
      } else {
        portfolio.isChecked = false;
      }

      return portfolio;
    });

    setSelectedProjects(updatedPortfolios);
  };
  const handleTogglePortfolio = (portfolioId) => {
    if (expandedPortfolios.includes(portfolioId)) {
      setExpandedPortfolios(
        expandedPortfolios.filter((id) => id !== portfolioId)
      );
    } else {
      setExpandedPortfolios([...expandedPortfolios, portfolioId]);
    }
  };

  const { workspacePortfolios } = usePortfolios({
    id: activeWorkspace?.id,
  });
  const { overDueCountResponse } = useGetOverdueCount();
  const defaultSelectedProject = selectedProjects.filter((el) => el.isChecked)
    .length
    ? selectedProjects.filter((el) => el.isChecked)[0]
    : null;

  const defaultSelectedProjectIds = useMemo(
    () =>
      selectedProjects.filter((el) => el.isChecked).length
        ? selectedProjects
            .filter((el) => el.isChecked)[0]
            ?.projects?.map((el) => el.id)
        : null,
    [selectedProjects]
  );

  const onProjectTasksSuccess = (data) => {
    if (data?.data?.success) {
      const modifiedMilestones = data.data?.data.map((milestone) => {
        if (milestone.milestoneName === "Milestone 0") {
          return { ...milestone, milestoneName: "Untitled" };
        }
        return milestone;
      });
      handleToggle(
        modifiedMilestones.filter((el) => el.tasks.length)[0]?.id,
        true
      );
      modifiedMilestones.forEach((element) => {
        element.newTask = { name: "", status: "" };
      });
      setMilestones(modifiedMilestones);
    }
  };

  const { myAllTasks, getMyAllTasks } = useGetAllMyTasks({
    filter: selectedFilter,
    sortBy: sortBy,
    onSuccess: onProjectTasksSuccess,
  });
  useEffect(() => {
    if (!isOpenTaskDrawer) {
      getMyAllTasks.refetch();
    }
  }, [isOpenTaskDrawer]);

  const { projectStatus } = useGetProjectStatus({
    id: addNewTaskProjectId,
  });
  const { projectList } = useGetProjectList({
    id: addNewTaskProjectId,
  });
  const displaySuccess = useDisplaySuccess();
  const onAddProjectBasicSuccess = (data) => {
    displaySuccess(data.message);
    setNewTask(null);
    setNewTaskStatus(null);
    if (milestones.filter((el) => el.tasks.length).length)
      handleToggle(milestones.filter((el) => el.tasks.length)[0]?.id);
  };

  const addProjetBasicTask = useAddProjectTask({
    type: "list",
    search: searchTask,
    projects: defaultSelectedProjectIds,
    onSuccess: onAddProjectBasicSuccess,
  });

  const projectListOptions = projectList.map((el) => {
    return {
      value: el.id,
      label: el.name,
    };
  });
  const projectStatusOptions = projectStatus.map((el) => {
    return {
      value: el.id,
      label: el.name,
    };
  });

  useEffect(() => {
    if (workspacePortfolios.length) {
      // Add the isChecked key to each portfolio object
      const portfoliosWithChecked = workspacePortfolios.map((portfolio) => ({
        ...portfolio,
        isChecked: true, // Set initial value of isChecked
      }));
      const selected = portfoliosWithChecked.filter((portfolio) =>
        portfolio.name.toLowerCase().includes(searchPortfolio.toLowerCase())
      );
      setSelectedProjects(selected);
    }
  }, [workspacePortfolios]);

  const handleSearchTask = (e) => {
    setSearchTask(e.target.value);
  };
  const handleTaskActionsOpen = () => {
    setIsTaskSelected(!isTaskSelected);
  };

  const handleTaskActionsClose = () => {
    setIsTaskSelected(false);
  };

  const handleListClick = (option) => {
    setSelectedList(option);
    setListSelectAnchorEl(null);
  };

  const handleListSelectClick = (event) => {
    if (listSelectAnchorEl) {
      return setListSelectAnchorEl(null);
    }
    setListSelectAnchorEl(event.currentTarget);
  };

  const handleStatusClick = (option) => {
    setSelectedStatus(option);
    setStatusSelectAnchorEl(null);
  };

  const handleStatusSelectClick = (event, project) => {
    if (statusSelectAnchorEl) {
      return setStatusSelectAnchorEl(null);
    }
    setAddNewTaskProjectId(project.project_Id);
    setCurrMilestoneId(project.id);
  };

  const handleToggle = (id, displayFirst = false) => {
    const isOpen = openCollapsibles.includes(id);
    if (isOpen && !displayFirst) {
      setOpenCollapsibles(
        openCollapsibles.filter((collapsibleId) => collapsibleId !== id)
      );
    } else {
      setOpenCollapsibles([...openCollapsibles, id]);
    }
    setIsCollapsed(!isCollapsed);
  };
  console.log(openCollapsibles);

  const handleViewsMenuClick = (event) => {
    if (viewsAchorEl) {
      return setViewsAnchorEl(null);
    }
    setViewsAnchorEl(event.currentTarget);
  };

  const handleViewsClose = () => {
    setViewsAnchorEl(null);
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };
  const handleGroupByClick = (event) => {
    setGroupByAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setFilterAnchorEl(null);
  };
  const handleProjectsMenuClose = () => {
    setAllProjectsAnchorEl(null);
  };
  const handleGroupByMenuClose = () => {
    setGroupByAnchorEl(null);
  };

  const handleFilterMenuItemClick = (e, listType) => {
    const element = allProjectsRef.current;
    if (listType === "project") {
      setAllProjectsAnchorEl(element);
      setFilterBy(listType);
      setFilterAnchorEl(null);
      return;
    }
    setFilterBy(listType);
    setFilterAnchorEl(null);
    setAllProjectsAnchorEl(null);
  };
  const handleGroupByMenuItemClick = (e, listType) => {
    setActiveGroupBy(listType);
    setGroupByAnchorEl(null);
  };
  const handleMenuItemCick = (listType) => {
    if (listType === "save") {
      setAddNewView(true);
      return;
    }
    setViewsAnchorEl(null);
  };
  const handleSaveView = () => {
    setAddNewView(false);
    setViewsAnchorEl(null);
  };
  const handleSaveViewCancel = () => {
    setAddNewView(false);
    setViewsAnchorEl(null);
  };
  const handleNewTaskValue = (project) => {
    return project?.newTask?.name;
  };
  const handleNewTask = (e, milesstoneId) => {
    const { name, value } = e.target;

    setMilestones((prevMilestones) => {
      const updatedMilestones = [...prevMilestones];
      const milestone = updatedMilestones.filter(
        (el) => el.id === milesstoneId
      );

      milestone[0].newTask.name = value;

      return updatedMilestones;
    });
    setNewTask(e.currentTarget.value);
  };

  const handleNewTaskStatus = (value, milesstoneId) => {
    setIsOpenUsers(false);
    setMilestones((prevMilestones) => {
      const updatedMilestones = [...prevMilestones];
      const milestone = updatedMilestones.filter(
        (el) => el.id === milesstoneId
      );
      milestone[0].newTask.status = value;
      return updatedMilestones;
    });
    setNewTaskStatus(value);
    setAddNewTaskProjectId(null);
    setCurrMilestoneId(null);
    setStatusSelectAnchorEl(null);
  };
  const handleNewTaskList = (value) => {
    setNewTaskList(value);
  };
  const handleTaskSubmit = (project) => {
    if (!project.newTask.name) {
      return enqueueSnackbar("Please add task name", { variant: "error" });
    }
    const payload = {
      name: project.newTask.name,
      status_Id: project?.newTask?.status?.value ?? null,
      milestone_Id: project.id,
      project_Id: null,
    };
    const data = {
      name: payload.name,
      description: "",
      status_Id: payload.status_Id ?? null,
      project_Id: +defaultSelectedProject?.id,
      dueDate: newTaskDueDate,
      assignees: [newTaskAssignee?.assignee] ?? [],
      addOnTop: true,
    };
    addProjetBasicTask.mutate({ data: data });
    setMilestones((prevMilestones) => {
      const updatedMilestones = [...prevMilestones];
      const milestone = updatedMilestones.filter((el) => el.id === project.id);

      milestone[0].newTask.name = "";
      milestone[0].newTask.status = "";
      return updatedMilestones;
    });
    setNewTaskAssignee(null);
    setNewTaskDueDate(null);
    setTagId(null);
  };

  // add new functionality
  const handleAssigntoChange = (event) => {
    let Id = event.value;
    let payload = {
      assignee: Id,
    };
    setNewTaskAssignee(payload);
  };
  const { data: tagsAssignList } = useQuery(
    ["tags_get_list", workspaceId],
    () => {
      return axios.get(`/tag/task/${workspaceId}?search=${""}`);
    },
    {
      select: (res) => {
        return res?.data?.data;
      },
    }
  );
  const periorityTag = tagsAssignList?.filter((val) => {
    return val?.isCustom === false;
  });

  const handleOnChange = (ranges) => {
    const { selection } = ranges;
    setDateRangeVal([selection]);
  };
  const { mutate: updateDateRande, isLoading: updatingDateRange } = useMutation(
    {
      mutationKey: ["date_update", selectedTaskId],
      mutationFn: (data) =>
        axios.put(`/task/update_duration/${selectedTaskId}`, data),
      onSuccess: (data) => {
        if (data?.data?.success) {
          enqueueSnackbar(data.data.message, { variant: "success" });
          getMyAllTasks.refetch();
          setIsOpendateChange(false);
          setIsOpendateChangeAnchorEl(null);
          setSelectedTaskId(null);
        }
      },
      onError: (data) => {
        enqueueSnackbar(data?.response?.data?.message, { variant: "error" });
      },
    }
  );

  const handleSubmitDateChange = (id) => {
    const payload = {
      startDate: DateRangeVal[0]?.startDate,
      dueDate: DateRangeVal[0]?.endDate,
    };
    if (!isEmpty(payload)) {
      updateDateRande(payload);
    }
  };
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [isTaskStatusDropdown, setIsTaskStatusDropdown] = useState(null);
  const [isTaskAssigneeDropdown, setIsTaskAssigneeDropdown] = useState(null);
  const [isTaskTagDropdown, setIsTaskTagDropdown] = useState(null);
  const [filterStatusValue, setFilterStatusValue] = useState("");
  const [filterAssigneeValue, setFilterAssigneeValue] = useState("");
  const [selectedTaskAssigneeID, setSelectedTaskAssigneeID] = useState(null);
  const [selectedTaskTagID, setSelectedTaskTagID] = useState(null);
  const [selectedTaskStatusID, setSelectedTaskStatusID] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [hoveredAssignee, setHoveredAssignee] = useState(null);
  const [hoveredTag, setHoveredTag] = useState(null);
  const [hoveredTaskAssignee, setHoveredTaskAssignee] = useState(null);

  const newTaskInputRef = useRef();
  const { mutate: updateAssignee, isLoading: updatingAssignee } = useMutation({
    mutationKey: ["update_assignee", selectedTaskAssigneeID],
    mutationFn: (data) =>
      axios.put(
        `/task/update_assignee/${selectedTask?.id}/?assignee=${selectedTaskAssigneeID}`,
        data
      ),
    onSuccess: (data) => {
      if (data?.data?.success) {
        enqueueSnackbar(data.data.message, { variant: "success" });
        getMyAllTasks.refetch();

        setSelectedTask(null);
        setSelectedTaskAssigneeID(null);
        setIsTaskAssigneeDropdown(null);
      }
    },
    onError: (data) => {
      enqueueSnackbar(data?.response?.data?.message, { variant: "error" });
      setSelectedTask(null);
      setSelectedTaskAssigneeID(null);
      setIsTaskAssigneeDropdown(null);
    },
  });
  const { mutate: updateTaskTag, isLoading: updatingTag } = useMutation({
    mutationKey: ["update_tag", selectedTaskTagID],
    mutationFn: (data) =>
      axios.put(
        `/task/update_tag/${selectedTask?.id}/?tag_id=${selectedTaskTagID}`,
        data
      ),
    onSuccess: (data) => {
      if (data?.data?.success) {
        enqueueSnackbar(data.data.message, { variant: "success" });
        getMyAllTasks.refetch();

        setSelectedTask(null);
        setIsTaskTagDropdown(null);
      }
    },
    onError: (data) => {
      enqueueSnackbar(data?.response?.data?.message, { variant: "error" });
      setSelectedTask(null);
      setIsTaskTagDropdown(null);
    },
  });
  const { mutate: updateTaskStatus, isLoading: updatingTaskStatus } =
    useMutation({
      mutationKey: ["update_status", selectedTaskStatusID],
      mutationFn: (data) => axios.put(`/task/update_status`, data),
      onSuccess: (data) => {
        if (data?.data?.success) {
          enqueueSnackbar(data.data.message, { variant: "success" });
          getMyAllTasks.refetch();

          setIsTaskStatusDropdown(null);
          setSelectedTask(null);
          setSelectedMilestone(null);
          setSelectedTaskStatusID(null);
        }
      },
      onError: (data) => {
        enqueueSnackbar(data?.response?.data?.message, { variant: "error" });
        setIsTaskStatusDropdown(null);
        setSelectedTask(null);
        setSelectedMilestone(null);
        setSelectedTaskStatusID(null);
      },
    });
  const {
    mutate: updateTaskOrder,
    isLoading: updatingTaskOrder,
    error: updatingTaskOrderError,
  } = useMutation({
    mutationKey: ["update_order"],
    mutationFn: (data) => axios.put(`/task/task_reorder_milestone`, data),
    onSuccess: (data) => {
      if (data?.data?.success) {
        enqueueSnackbar(data.data.message, { variant: "success" });
        getMyAllTasks.refetch();
      }
    },
    onError: (data) => {
      enqueueSnackbar(data?.response?.data?.message, { variant: "error" });
    },
  });
  const { data: projectTaskStatus } = useQuery(
    ["task_status_list", selectedTask],
    () => {
      return axios.get(`${Apis.GetProjectStatus}/${selectedMilestone?.id}`);
    },
    {
      select: (res) => {
        return res?.data?.data;
      },
    }
  );
  const loading = updatingTaskOrder;
  const error = updatingTaskOrderError;
  useDisplayError(error || addProjetBasicTask.error);
  const projectTaskStatusOptions = projectTaskStatus?.map((el) => {
    return {
      value: el.id,
      label: el.name,
    };
  });
  const handleTaskStatusCick = (e, task, milestone) => {
    setSelectedTask(task);
    setSelectedMilestone(milestone);
    setIsTaskStatusDropdown(e.currentTarget);
  };
  const handleTaskStatusChange = (status) => {
    setSelectedTaskStatusID(status);
    const payload = {
      taskId: selectedTask?.id,
      statusId: status,
    };
    if (!isEmpty(payload)) {
      updateTaskStatus(payload);
    }
  };
  const handleFilterStatusChange = (event) => {
    setFilterStatusValue(event.target.value);
  };
  const filteredStatusList = projectTaskStatusOptions?.filter((user) =>
    user?.label?.toLowerCase()?.includes(filterStatusValue.toLowerCase())
  );

  const handleTaskAssigneeClick = (e, task) => {
    setSelectedTask(task);
    setIsTaskAssigneeDropdown(e.currentTarget);
  };
  const handleTaskAssigneeChange = (assignee) => {
    setSelectedTaskAssigneeID(assignee);
    updateAssignee();
  };

  const handleFilterChange = (event) => {
    setFilterAssigneeValue(event.target.value);
  };
  const filteredUsersList = usersList?.filter((user) =>
    user?.label?.toLowerCase()?.includes(filterAssigneeValue.toLowerCase())
  );
  const handleTaskTagClick = (e, task) => {
    setSelectedTask(task);
    setIsTaskTagDropdown(e.currentTarget);
  };
  const handleTaskTagChange = (tag) => {
    setSelectedTaskTagID(tag);
    updateTaskTag();
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    if (
      result.source.droppableId === result.destination.droppableId &&
      result.source.index === result.destination.index
    ) {
      return;
    }

    const reOrderListPayload = {
      order: result.destination.index,
      milestoneId: milestones.filter(
        (el) => el.id === parseInt(result.destination.droppableId)
      )[0].id,
      taskId: milestones
        .filter((el) => el.id === parseInt(result.destination.droppableId))[0]
        .tasks.filter((task) => task.name === result.draggableId)[0].id,
    };
    // Switch the tasks based on destination index
    const milestone = milestones.find(
      (el) => el.id === parseInt(result.destination.droppableId)
    );
    const taskIndexSource = milestone.tasks.findIndex(
      (task) => task.name === result.draggableId
    );
    const taskIndexDestination = result.destination.index;

    if (taskIndexSource !== -1 && taskIndexDestination !== -1) {
      const taskSource = milestone.tasks[taskIndexSource];
      const taskDestination = milestone.tasks[taskIndexDestination];
      milestone.tasks[taskIndexSource] = taskDestination;
      milestone.tasks[taskIndexDestination] = taskSource;
    }
    updateTaskOrder(reOrderListPayload);
  };
  const { mutate: removeTaskAssignee, isLoading: removeTaskAssigneeLoading } =
    useMutation({
      mutationKey: ["remove_task_assignee"],
      mutationFn: (data) =>
        axios.delete(
          `/task/delete_user/${data.taskId}?user_id=${data.assigneeId}`
        ),
      onSuccess: (data) => {
        if (data.data.success) {
          enqueueSnackbar(data.data.message, { variant: "success" });
          getMyAllTasks.refetch();

          setSelectedTasks([]);
        }
      },
      onError: (data) => {
        enqueueSnackbar(data.response.data.message, { variant: "error" });
      },
    });
  const handleRemoveTaskAssignee = (taskId, id) => {
    removeTaskAssignee({ taskId: taskId, assigneeId: id });
  };
  const handleRemoveTag = (id) => {};

  const handleTaskSelect = (e, task) => {
    e.stopPropagation();
    const taskId = task.id;
    const isChecked = e.target.checked;
    setSelectedTasks((prevSelectedTasks) => {
      if (isChecked) {
        return [...prevSelectedTasks, taskId];
      } else {
        return prevSelectedTasks.filter((id) => id !== taskId);
      }
    });
  };

  const TaskModal = ({ selectedTasks, setSelectedTasks }) => {
    const [moreActionsAnchorEl, setMoreActionsAnchorEl] = useState(null);

    const {
      mutate: deleteMultipleTask,
      isLoading: deleteMultipleTasksLoading,
    } = useMutation({
      mutationKey: ["delete_tasks"],
      mutationFn: (data) =>
        axios.delete(`/task/delete_multiple_tasks?ids=[${data}]`),
      onSuccess: (data) => {
        if (data.data.success) {
          enqueueSnackbar(data.data.message, { variant: "success" });
          getMyAllTasks.refetch();

          setSelectedTasks([]);
        }
      },
      onError: (data) => {
        enqueueSnackbar(data.response.data.message, { variant: "error" });
      },
    });

    const { mutate: duplicateTasks, isLoading: duplicateTasksLoading } =
      useMutation({
        mutationKey: ["duplicate_tasks"],
        mutationFn: (data) => axios.post(`/task/duplicate_tasks?ids=[${data}]`),
        onSuccess: (data) => {
          if (data.data.success) {
            enqueueSnackbar(data.data.message, { variant: "success" });

            getMyAllTasks.refetch();

            setSelectedTasks([]);
          }
        },
        onError: (data) => {
          enqueueSnackbar(data.response.data.message, { variant: "error" });
        },
      });
    const { mutate: completeTasks, isLoading: completeTasksLoading } =
      useMutation({
        mutationKey: ["complete_tasks"],
        mutationFn: (data) => axios.put(`/task/complete_multiple`, data),
        onSuccess: (data) => {
          if (data.data.success) {
            enqueueSnackbar(data.data.message, { variant: "success" });
            getMyAllTasks.refetch();
            setSelectedTasks([]);
          }
        },
        onError: (data) => {
          enqueueSnackbar(data.response.data.message, { variant: "error" });
        },
      });

    const handleMoreActions = (e) => {
      setMoreActionsAnchorEl(e.currentTarget);
    };
    const handleDeleteTasks = () => {
      deleteMultipleTask(selectedTasks);
    };
    const handleDuplicateTasks = () => {
      duplicateTasks(selectedTasks);
    };
    const handleCompleteTasks = () => {
      completeTasks(selectedTasks);
    };

    return (
      <div className="task-modal flex justify-evenly ">
        <span className="text-white mr-10 text-[16px]">
          {selectedTasks.length}{" "}
          <span className="text-white ml-2 text-[16px]">tasks selected</span>
        </span>
        <span>
          <IconButton
            aria-label="AttachFileIcon"
            onClick={handleDuplicateTasks}
          >
            <Tooltip title="Copy and create task">
              <AttachFileIcon style={{ fill: "white" }} />
            </Tooltip>
          </IconButton>
          <IconButton
            aria-label="DeleteOutlineIcon"
            onClick={handleDeleteTasks}
          >
            <Tooltip title="Delete task">
              <DeleteOutlineIcon style={{ fill: "white" }} />
            </Tooltip>
          </IconButton>
          <IconButton aria-label="MoreHorizIcon" onClick={handleMoreActions}>
            <MoreHorizIcon style={{ fill: "white" }} />
          </IconButton>
          <Popover
            onClose={() => {
              setMoreActionsAnchorEl(null);
            }}
            sx={{
              height: "200px",
              "& .MuiPaper-root": {
                boxShadow: "none", // Remove the box shadow
              },
              zIndex: 2000000,
            }}
            open={Boolean(moreActionsAnchorEl)}
            anchorEl={moreActionsAnchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "top",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "top",
            }}
          >
            <div
              tabIndex={0}
              className=" cursor-pointer bg-white  border border-[#E8E8E9] rounded w-[170px]  "
            >
              <ul className="py-1">
                <li onClick={handleCompleteTasks}>
                  <CheckCircleIcon className="mr-2" />
                  Complete Task
                </li>
              </ul>
            </div>
          </Popover>
          <IconButton
            aria-label="CloseIcon"
            onClick={() => setSelectedTasks([])}
          >
            <Tooltip title="Close">
              <CloseIcon style={{ fill: "white" }} />
            </Tooltip>
          </IconButton>
        </span>
      </div>
    );
  };

  return (
    <>
      {isOpenTaskDrawer && <TaskDrwayer />}
      {selectedTasks.length > 0 && (
        <TaskModal
          setSelectedTasks={setSelectedTasks}
          selectedTasks={selectedTasks}
        />
      )}
      <TaskActions
        isOpen={isTaskSelected}
        handleCloseModal={handleTaskActionsClose}
      />

      {/* text part */}
      <div className="px-[24px] py-5 flex flex-col w-full  ">
        <div
          className={`${
            selectedView !== "report" && "sticky "
          } px-5 py-5 flex flex-col  top-0 z-30`}
        >
          <h1 className="text-[28px] font-bold font-Manrope mb-2 text-[#2f2f2f]">
            Hey, {auth?.user?.name} 👋
          </h1>
          <p className="font-semibold text-[#8d93bd]">
            You have{" "}
            <span className="bg-[#e3e4ef] rounded text-sm px-2 py-1 text-[#4c5383]">
              {overDueCountResponse?.data?.data?.data?.overdueTodayCount ?? 0}{" "}
              tasks
            </span>{" "}
            for today, and{" "}
            <span className="bg-[#e3e4ef] rounded text-sm px-2 py-1 text-[#4c5383]">
              {overDueCountResponse?.data?.data?.data?.overdueCount ?? 0} tasks
            </span>{" "}
            are overdue now.
          </p>
          {/* header part */}
          <div className="project-generic-header flex items-center my-3">
            {/* filter  start*/}
            {/* updated section start */}
            <div className="px-[0px] py-5 flex flex-col w-full">
              <div className="rowTaskViewHeader w-full relative flex justify-between">
                <div className="right-rowTabs flex gap-3">
                  {/* in complete task btn  */}
                  <div className="incompleteBtn">
                    <div className="group relative">
                      <button
                        onClick={() => setIsProjectSelect(!isProjectSelect)}
                        className="px-2 h-7 rounded-md text-[#2F2F2F] hover:text-[#00B8A9] hover:bg-[#eee] flex items-center font-Manrope text-[14px]"
                      >
                        <CheckCircleOutlineIcon className="!w-[14px] mr-1" />
                        Select Projects:{" "}
                        <span className="text-sm font-normal text-[#2f2f2f]">
                          {selectedProjects?.filter((el) => el.isChecked)
                            ?.length ?? "0"}{" "}
                          selected{" "}
                        </span>
                      </button>
                      {isProjectSelect && (
                        <div
                          tabIndex={0}
                          className=" bg-white  border border-[#E8E8E9] rounded w-[230px] right-1 absolute  top-full transition-all opacity-0  group-focus-within:opacity-100 group-focus-within:translate-y-1 z-10"
                        >
                          <ul className="py-1">
                            {selectedProjects?.map((portfolio, index) => (
                              <li key={portfolio.id}>
                                <div className=" hover:bg-[#F2FFFE] hover:text-[#00B8A9] justify-between portfolio-header flex items-center px-[10px] text-[14px] cursor-pointer">
                                  <div className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={portfolio.isChecked}
                                      className="mr-5 "
                                      //   disabled={index > 0}
                                      onClick={(e) => {
                                        handleProjectCheckboxChange(
                                          portfolio.id
                                        );
                                      }}
                                    />

                                    <span className="block  py-2 font-Manrope text-[12px]   ">
                                      {portfolio.name}
                                    </span>
                                  </div>
                                  <span>
                                    {expandedPortfolios.includes(
                                      portfolio.id
                                    ) ? (
                                      <KeyboardArrowDownIcon
                                        className="block  py-2 font-Manrope !text-[35px]   "
                                        onClick={() => {
                                          handleTogglePortfolio(portfolio.id);
                                        }}
                                      />
                                    ) : (
                                      <ChevronRightIcon
                                        className="block  py-2 font-Manrope !text-[35px]  "
                                        onClick={() => {
                                          handleTogglePortfolio(portfolio.id);
                                        }}
                                      />
                                    )}
                                  </span>
                                </div>
                                {expandedPortfolios.includes(portfolio.id) && (
                                  <ul className="project-list">
                                    {portfolio.projects.map((project, i) => (
                                      <li key={project.id}>
                                        <label className="block px-4 py-2 font-Manrope text-[12px]  hover:bg-[#F2FFFE] hover:text-[#00B8A9] ">
                                          <input
                                            type="checkbox"
                                            className="mr-5 "
                                            //   disabled={index > 0}
                                            checked={portfolio.isChecked}
                                            onChange={(e) => {
                                              e.stopPropagation();
                                              handleProjectCheckboxChange(
                                                portfolio.id
                                              );
                                            }}
                                          />
                                          {project.name}
                                        </label>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="incompleteBtn">
                    <div className="group relative">
                      <button className="px-2 h-7 rounded-md text-[#2F2F2F] hover:text-[#00B8A9] hover:bg-[#eee] flex items-center font-Manrope text-[14px]">
                        <CheckCircleOutlineIcon className="!w-[14px] mr-1" />
                        {selectedFilter
                          ? `filter: ${
                              filters.find((el) => el.key === selectedFilter)
                                .name
                            }`
                          : "Filter By"}
                      </button>
                      <div
                        tabIndex={0}
                        className=" bg-white invisible border border-[#E8E8E9] rounded w-[200px] right-1 absolute  top-full transition-all opacity-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-1 z-10"
                      >
                        <ul className="py-1">
                          {filters.map((el) => (
                            <li onClick={() => setSelectedFilter(el.key)}>
                              <span
                                className={`cursor-pointer block px-4 py-2 font-Manrope text-[12px]  hover:bg-[#F2FFFE] hover:text-[#00B8A9]
                          ${
                            selectedFilter === el.key
                              ? "text-[#00B8A9] bg-[#F2FFFE]"
                              : ""
                          }
                          `}
                              >
                                {el.name}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  {/* group by btn  */}
                  {/* <div className="incompleteBtn">
                    <div className="group relative">
                      <button className="px-2 h-7 rounded-md text-[#2F2F2F] hover:text-[#00B8A9] hover:bg-[#eee] flex items-center font-Manrope text-[14px]">
                        <TableViewIcon className="!w-[14px] mr-1" />
                        Group By
                      </button>
                      <div
                        tabIndex={0}
                        className=" bg-white invisible border border-[#E8E8E9] rounded w-[200px] right-1 absolute  top-full transition-all opacity-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-1 z-10"
                      >
                        <ul className="py-1">
                          <li>
                            <a
                              href="#"
                              className="block px-4 py-2 font-Manrope text-[12px]  hover:bg-[#F2FFFE] hover:text-[#00B8A9] "
                            >
                              None
                            </a>
                          </li>

                          <li>
                            <a
                              href="#"
                              className="block px-4 py-2 font-Manrope text-[12px] hover:bg-[#F2FFFE] hover:text-[#00B8A9]"
                            >
                              Due Date
                            </a>
                          </li>

                          <li>
                            <a
                              href="#"
                              className="block px-4 py-2 font-Manrope text-[12px] hover:bg-[#F2FFFE] hover:text-[#00B8A9]"
                            >
                              Project
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="block px-4 py-2 font-Manrope text-[12px] hover:bg-[#F2FFFE] hover:text-[#00B8A9]"
                            >
                              Created By
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="block px-4 py-2 font-Manrope text-[12px] hover:bg-[#F2FFFE] hover:text-[#00B8A9]"
                            >
                              Custom sections
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div> */}
                  {/* sort modification on  */}
                  <div className="incompleteBtn">
                    <div className="group relative">
                      <button className="px-2 h-7 rounded-md text-[#2F2F2F] hover:text-[#00B8A9] hover:bg-[#eee] flex items-center font-Manrope text-[14px]">
                        <ImportExportIcon className="!w-[14px] mr-1" />

                        {sortBy
                          ? `Sort: ${
                              sortings.find((el) => el.key === sortBy).name
                            }`
                          : "Sort By"}
                      </button>
                      <div
                        tabIndex={0}
                        className=" bg-white invisible border border-[#E8E8E9] rounded w-[200px] right-1 absolute  top-full transition-all opacity-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-1 z-10"
                      >
                        <ul className="py-1">
                          {sortings.map((el) => (
                            <li onClick={() => setSortBy(el.key)}>
                              <span
                                className={` cursor-pointer block px-4 py-2 font-Manrope text-[12px]  hover:bg-[#F2FFFE] hover:text-[#00B8A9] 
                        ${
                          sortBy === el.key ? "text-[#00B8A9] bg-[#F2FFFE]" : ""
                        }
                        `}
                              >
                                {el.name}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* filter End  */}
          </div>
        </div>
      </div>

      {/* main body start */}
      {selectedView === "report" ? (
        <>
          {selectedProjects.length ? (
            <ReportsView selectedProjects={selectedProjects} />
          ) : (
            <p>Please select project first</p>
          )}
        </>
      ) : (
        <>
          <div className="mb-32">
            <div className="overflow-x-auto">
              <div className="min-w-[1400px] pb-5">
                {/* main column start */}
                <div className="rowTaskView w-full relative mt-5">
                  <div className="repeatBlock flex w-full border border-[#eee] border-l-0 border-r-0">
                    <div className="leftTasview-fixed min-w-[49%] w-[49%] pl-[23px] border border-[#eee] border-l-0 border-b-0 border-t-0 py-2 px-2 hover:bg-[#E7F7F6] cursor-pointer">
                      <p className="text-[13px] text-[#313135]">Task Name</p>
                    </div>
                    <div className="leftTasview-screen min-w-[10%] w-[10%] border border-[#eee] border-l-0 border-b-0 border-t-0 py-2 px-2 hover:bg-[#E7F7F6] cursor-pointer text-[#E7F7F6] hover:text-[#313135]">
                      <Tooltip title="Due Date" arrow>
                        <p className="text-[13px]">
                          <span className="text-[#313135]">Status</span>
                          <span className="text-[12px] ml-1 ">
                            <ExpandMoreIcon className="!w-[18px]" />
                          </span>
                        </p>
                      </Tooltip>
                    </div>
                    <div className="leftTasview-screen min-w-[10%] w-[10%] border border-[#eee] border-l-0 border-b-0 border-t-0 py-2 px-2 hover:bg-[#E7F7F6] cursor-pointer text-[#E7F7F6] hover:text-[#313135]">
                      <Tooltip title="Projects" arrow>
                        <p className="text-[13px]">
                          <span className="text-[#313135]">Assignees </span>
                          <span className="text-[12px] ml-1 ">
                            <ExpandMoreIcon className="!w-[18px]" />
                          </span>
                        </p>
                      </Tooltip>
                    </div>
                    <div className="leftTasview-screen min-w-[10%] w-[10%] border border-[#eee] border-l-0 border-b-0 border-t-0 py-2 px-2 hover:bg-[#E7F7F6] cursor-pointer text-[#E7F7F6] hover:text-[#313135]">
                      <Tooltip title="Task visibility" arrow>
                        <p className="text-[13px]">
                          <span className="text-[#313135]">Due Date</span>
                          <span className="text-[12px] ml-1 ">
                            <ExpandMoreIcon className="!w-[18px]" />
                          </span>
                        </p>
                      </Tooltip>
                    </div>
                    <div className="leftTasview-screen min-w-[10%] w-[10%] border border-[#eee] border-l-0 border-b-0 border-t-0 py-2 px-2 hover:bg-[#E7F7F6] cursor-pointer text-[#E7F7F6] hover:text-[#313135]">
                      <Tooltip title="Collaborators" arrow>
                        <p className="text-[13px]">
                          <span className="text-[#313135]">Tags </span>
                          <span className="text-[12px] ml-1 ">
                            <ExpandMoreIcon className="!w-[18px]" />
                          </span>
                        </p>
                      </Tooltip>
                    </div>
                  </div>
                </div>
                {/* main column end */}
                {/* render milestones here */}
                {/* paste milestones */}
                {milestones?.filter((el) => el.tasks.length).length ? (
                  milestones
                    ?.filter((el) => el.tasks.length)
                    ?.map((el, milestoneIndex) => {
                      return (
                        <>
                          <div className="relative mt-5">
                            <input
                              type="checkbox"
                              name="agree"
                              id="agree"
                              className="peer opacity-0 ml-5"
                            />

                            <label
                              for="agree"
                              className="relative -left-4 cursor-pointer text-[15px] text-[#E7F7F6] hover:text-[#313135]"
                            >
                              <span className="relative mr-2 text-[#00A99B]">
                                {openCollapsibles.includes(el.id) ? (
                                  <ExpandCircleDownIcon
                                    onClick={(e) => handleToggle(el.id)}
                                  />
                                ) : (
                                  <ExpandCircleDownIcon
                                    sx={{ rotate: "-180deg" }}
                                    onClick={(e) => handleToggle(el.id)}
                                  />
                                )}
                              </span>
                            </label>

                            <label className="leftTasview-fixed relative text-[15px] -left-3 text-[#E7F7F6] hover:text-[#313135]">
                              <span
                                className="text-[#313135] mr-1 cursor-pointer"
                                onClick={(e) => handleToggle(el.id)}
                              >
                                {el.name}
                              </span>
                              {/* <span className="py-1 inline-block px-1 hover:bg-[#E7F7F6] rounded-sm  cursor-pointer">
                          <Tooltip title="Add a task to this section" arrow>
                            <span className="text-[12px]">
                              <AddIcon className="!w-[18px]" />
                            </span>
                          </Tooltip>
                        </span>
                        <span className="py-1 inline-block px-1 hover:bg-[#E7F7F6] rounded-sm cursor-pointer">
                          <Tooltip title="More section actions" arrow>
                            <span className="text-[12px]">
                              <MoreHorizIcon className="!w-[18px]" />
                            </span>
                          </Tooltip>
                        </span> */}
                            </label>
                            <DragDropContext onDragEnd={onDragEnd}>
                              <Droppable
                                droppableId={`${el.id}`}
                                type="parent"
                                direction="vertical"
                              >
                                {(provided, snapshot) => (
                                  <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    isDraggingOver={snapshot.isDraggingOver}
                                  >
                                    {el.tasks.length ? (
                                      el.tasks.map((elem, index) => {
                                        console.log(elem, el);
                                        return (
                                          <>
                                            <Draggable
                                              draggableId={elem?.name}
                                              key={elem?.id}
                                              index={index}
                                            >
                                              {(draggableProvided) => (
                                                <>
                                                  {openCollapsibles.includes(
                                                    el.id
                                                  ) && (
                                                    <div
                                                      className="mt-2 block w-full border-t border-t-[#eee]"
                                                      {...draggableProvided.draggableProps}
                                                      {...draggableProvided.dragHandleProps}
                                                      ref={
                                                        draggableProvided.innerRef
                                                      }
                                                    >
                                                      {/* row 1 */}
                                                      <div className="repeatBlock flex w-full border-b border-b-[#eee] hover:bg-[#E7F7F6]">
                                                        <div
                                                          onClick={() =>
                                                            dispatch(
                                                              taskDrawyerOpen(
                                                                elem.id
                                                              )
                                                            )
                                                          }
                                                          className="leftTasview-fixed relative flex justify-between min-w-[49%] w-[49%] py-2 px-2 before:absolute before:w-full before:left-0 before:top-0 before:h-full before:border-l-0 before:border before:border-[#fafbfd] before:hover:border-[#ccc] cursor-pointer pl-[23px]"
                                                        >
                                                          <div
                                                            className="flex w-[80%]"
                                                            onClick={() =>
                                                              dispatch(
                                                                taskDrawyerOpen(
                                                                  elem.id
                                                                )
                                                              )
                                                            }
                                                          >
                                                            <input
                                                              type="checkbox"
                                                              name="taskName"
                                                              id="taskId"
                                                              checked={selectedTasks.includes(
                                                                elem.id
                                                              )}
                                                              className="mr-2 rounded-full w-[14px] h-[14px] relative top-[4px]"
                                                              onClick={(e) =>
                                                                handleTaskSelect(
                                                                  e,
                                                                  elem
                                                                )
                                                              }
                                                            />

                                                            <label
                                                              for="taskName"
                                                              className={`relative cursor-pointer text-[13px] ${
                                                                elem.statusName !==
                                                                "Completed"
                                                                  ? "text-[#333334]"
                                                                  : "text-[#afafb1]"
                                                              }`}
                                                            >
                                                              {elem.name}
                                                            </label>
                                                          </div>
                                                          <div className="flex items-center relative">
                                                            <span className="cursor-pointer w-[24px] h-[20px] flex justify-center items-center rounded-md hover:bg-[#efefef]">
                                                              <Tooltip
                                                                title="Details"
                                                                arrow
                                                              >
                                                                <ChevronRightIcon
                                                                  className="!w-[16px]"
                                                                  onClick={() =>
                                                                    dispatch(
                                                                      taskDrawyerOpen(
                                                                        elem.id
                                                                      )
                                                                    )
                                                                  }
                                                                />
                                                              </Tooltip>
                                                            </span>
                                                          </div>
                                                        </div>
                                                        <div
                                                          onClick={(e) =>
                                                            handleTaskStatusCick(
                                                              e,
                                                              elem,
                                                              el
                                                            )
                                                          }
                                                          className="leftTasview-screen min-w-[10%] w-[10%] border-l border-l-[#eee] py-2 px-2 hover:bg-[#E7F7F6] cursor-pointer relative before:absolute before:w-full before:left-0 before:top-0 before:h-full before:border before:border-[#fafbfd] before:hover:border-[#ccc] text-[#E7F7F6] hover:text-[#313135]"
                                                        >
                                                          <p className="text-[13px] flex justify-between">
                                                            <span
                                                              className={`${
                                                                elem.statusName !==
                                                                "Completed"
                                                                  ? "text-[#333334]"
                                                                  : "text-[#afafb1]"
                                                              }`}
                                                            >
                                                              {elem.statusName}
                                                            </span>
                                                          </p>
                                                        </div>
                                                        {Boolean(
                                                          isTaskStatusDropdown
                                                        ) && (
                                                          <Popover
                                                            onClose={() => {
                                                              setSelectedTask(
                                                                null
                                                              );
                                                              setIsTaskStatusDropdown(
                                                                null
                                                              );
                                                            }}
                                                            sx={{
                                                              height: "200px",
                                                              "& .MuiPaper-root":
                                                                {
                                                                  boxShadow:
                                                                    "none", // Remove the box shadow
                                                                },
                                                            }}
                                                            open={Boolean(
                                                              isTaskStatusDropdown
                                                            )}
                                                            anchorEl={
                                                              isTaskStatusDropdown
                                                            }
                                                            anchorOrigin={{
                                                              vertical:
                                                                "bottom",
                                                              horizontal:
                                                                "center",
                                                            }}
                                                            transformOrigin={{
                                                              vertical: "top",
                                                              horizontal:
                                                                "center",
                                                            }}
                                                          >
                                                            <div
                                                              tabIndex={0}
                                                              className=" bg-white  border border-[#E8E8E9] rounded w-[170px]  "
                                                            >
                                                              <ul className="py-1">
                                                                <li>
                                                                  <input
                                                                    type="text"
                                                                    className=" text-[13px] border-0 border-b-slate-50"
                                                                    placeholder="Search status"
                                                                    onChange={
                                                                      handleFilterStatusChange
                                                                    }
                                                                  />
                                                                </li>
                                                                {filteredStatusList?.length ? (
                                                                  filteredStatusList?.map(
                                                                    (el) => (
                                                                      <li
                                                                        key={
                                                                          el.value
                                                                        }
                                                                      >
                                                                        <span
                                                                          onClick={() =>
                                                                            handleTaskStatusChange(
                                                                              el.value
                                                                            )
                                                                          }
                                                                          className=" cursor-pointer block px-4 py-2 font-Manrope text-[12px]  hover:bg-[#F2FFFE] hover:text-[#00B8A9] "
                                                                        >
                                                                          {
                                                                            el.label
                                                                          }
                                                                        </span>
                                                                      </li>
                                                                    )
                                                                  )
                                                                ) : (
                                                                  <li>
                                                                    <span className=" cursor-pointer block px-4 py-2 font-Manrope text-[12px]  hover:bg-[#F2FFFE] hover:text-[#00B8A9] ">
                                                                      No status
                                                                      found
                                                                    </span>
                                                                  </li>
                                                                )}
                                                              </ul>
                                                            </div>
                                                          </Popover>
                                                        )}

                                                        <div
                                                          onClick={(e) =>
                                                            handleTaskAssigneeClick(
                                                              e,
                                                              elem
                                                            )
                                                          }
                                                          className="leftTasview-screen min-w-[10%] w-[10%] border-l border-l-[#eee] overflow-hidden py-2 px-2 hover:bg-[#E7F7F6] relative  before:border before:border-[#fafbfd] before:hover:border-[#ccc] cursor-pointer"
                                                        >
                                                          {elem?.assignees
                                                            ?.length ? (
                                                            elem?.assignees?.map(
                                                              (assignee) => (
                                                                <div
                                                                  onMouseEnter={() => {
                                                                    setHoveredAssignee(
                                                                      assignee.id
                                                                    );
                                                                    setHoveredTaskAssignee(
                                                                      elem.taskId
                                                                    );
                                                                  }}
                                                                  onMouseLeave={() => {
                                                                    setHoveredAssignee(
                                                                      null
                                                                    );
                                                                    setHoveredTaskAssignee(
                                                                      null
                                                                    );
                                                                  }}
                                                                  className="dropdown  inline-block relative mr-2 "
                                                                >
                                                                  <button className="py-[3px] mb-1 px-[5px] border-0 inline-flex items-center bg-[#ff735f] text-[12px] font-medium rounded-[4px]">
                                                                    <span className="items-center inline-flex text-white align-middle">
                                                                      {assignee.name
                                                                        ?.substr(
                                                                          0,
                                                                          2
                                                                        )
                                                                        ?.toUpperCase()}
                                                                    </span>
                                                                  </button>
                                                                  {hoveredAssignee ===
                                                                    assignee.id &&
                                                                    hoveredTaskAssignee ===
                                                                      elem.id && (
                                                                      <span
                                                                        className="ml-1 cursor-pointer absolute -top-[10px] -right-[5px]"
                                                                        onClick={(
                                                                          e
                                                                        ) => {
                                                                          e.stopPropagation();
                                                                          setSelectedTask(
                                                                            elem
                                                                          );
                                                                          handleRemoveTaskAssignee(
                                                                            elem.id,
                                                                            assignee.id
                                                                          );
                                                                        }}
                                                                      >
                                                                        <CancelIcon
                                                                          sx={{
                                                                            fontSize:
                                                                              "17px",
                                                                            color:
                                                                              "#333346",
                                                                          }}
                                                                        />
                                                                      </span>
                                                                    )}
                                                                </div>
                                                              )
                                                            )
                                                          ) : (
                                                            <div className="dropdown inline-block relative mr-2 ">
                                                              <button className="py-[3px] px-[5px] border-0 inline-flex items-center bg-[#c1c1c2] text-[12px] font-medium rounded-[4px]">
                                                                <span className="items-center inline-flex text-white align-middle">
                                                                  <span>
                                                                    no assignee
                                                                    yet
                                                                  </span>
                                                                </span>
                                                              </button>
                                                            </div>
                                                          )}
                                                        </div>
                                                        {Boolean(
                                                          isTaskAssigneeDropdown
                                                        ) && (
                                                          <Popover
                                                            onClose={() => {
                                                              setSelectedTask(
                                                                null
                                                              );
                                                              setIsTaskAssigneeDropdown(
                                                                null
                                                              );
                                                              setSelectedTaskAssigneeID(
                                                                null
                                                              );
                                                            }}
                                                            sx={{
                                                              height: "200px",
                                                              "& .MuiPaper-root":
                                                                {
                                                                  boxShadow:
                                                                    "none", // Remove the box shadow
                                                                },
                                                            }}
                                                            open={Boolean(
                                                              isTaskAssigneeDropdown
                                                            )}
                                                            anchorEl={
                                                              isTaskAssigneeDropdown
                                                            }
                                                            anchorOrigin={{
                                                              vertical:
                                                                "bottom",
                                                              horizontal:
                                                                "center",
                                                            }}
                                                            transformOrigin={{
                                                              vertical: "top",
                                                              horizontal:
                                                                "center",
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
                                                                    onChange={
                                                                      handleFilterChange
                                                                    }
                                                                  />
                                                                </li>
                                                                {filteredUsersList?.map(
                                                                  (el) => (
                                                                    <li
                                                                      key={
                                                                        el.value
                                                                      }
                                                                      className="mb-3"
                                                                    >
                                                                      <div
                                                                        onClick={() =>
                                                                          handleTaskAssigneeChange(
                                                                            el.value
                                                                          )
                                                                        }
                                                                        className="flex items-center px-4 py-2 font-Manrope text-[12px]  hover:bg-[#F2FFFE] hover:text-[#00B8A9] "
                                                                      >
                                                                        <span className="w-[24px] h-[24px] mr-[5px] rounded-full bg-[#4775d5] flex justify-center items-center text-white text-[11px] font-Manrope font-medium">
                                                                          {el.label
                                                                            .substr(
                                                                              0,
                                                                              2
                                                                            )
                                                                            ?.toUpperCase()}
                                                                        </span>
                                                                        {
                                                                          el.label
                                                                        }{" "}
                                                                        <em className="text-[#666] ml-2 not-italic">
                                                                          {
                                                                            el.email
                                                                          }
                                                                        </em>
                                                                      </div>
                                                                    </li>
                                                                  )
                                                                )}
                                                              </ul>
                                                            </div>
                                                          </Popover>
                                                        )}
                                                        <div className="leftTasview-screen min-w-[10%] w-[10%] border-l border-l-[#eee] py-2 px-2 hover:bg-[#E7F7F6] cursor-pointer relative before:absolute before:w-full before:left-0 before:top-0 before:h-full before:border before:border-[#fafbfd] before:hover:border-[#ccc]">
                                                          <div className="relative">
                                                            <Tooltip
                                                              title="Task task is only visible to you"
                                                              arrow
                                                            >
                                                              <p
                                                                className="text-[13px]"
                                                                onClick={(
                                                                  e
                                                                ) => {
                                                                  setIsOpendateChangeAnchorEl(
                                                                    e.currentTarget
                                                                  );
                                                                  setIsOpendateChange(
                                                                    true
                                                                  );
                                                                  setSelectedTaskId(
                                                                    elem.id
                                                                  );
                                                                }}
                                                              >
                                                                <span className="text-[12px] mr-1 ">
                                                                  <AccessAlarmsIcon className="!w-[18px]" />
                                                                </span>
                                                                <span
                                                                  className={`${
                                                                    elem.statusName !==
                                                                    "Completed"
                                                                      ? "text-[#333334]"
                                                                      : "text-[#afafb1]"
                                                                  }`}
                                                                >
                                                                  {formateDate(
                                                                    elem.dueDate
                                                                  )}
                                                                </span>
                                                              </p>
                                                            </Tooltip>

                                                            <div className="w-max cursor-pointer rounded-md bg-white flex items-center justify-center">
                                                              <div
                                                                className="cursor-pointer"
                                                                onClick={() =>
                                                                  setIsOpendateChange(
                                                                    true
                                                                  )
                                                                }
                                                              ></div>
                                                            </div>
                                                            {isOpendateChange && (
                                                              <Popover
                                                                onClose={() => {
                                                                  setIsOpendateChange(
                                                                    false
                                                                  );
                                                                  setSelectedTaskId(
                                                                    null
                                                                  );
                                                                  setIsOpendateChangeAnchorEl(
                                                                    null
                                                                  );
                                                                }}
                                                                sx={{
                                                                  "& .MuiPaper-root":
                                                                    {
                                                                      boxShadow:
                                                                        "none", // Remove the box shadow
                                                                    },
                                                                }}
                                                                open={
                                                                  isOpendateChange
                                                                }
                                                                anchorEl={
                                                                  isOpendateChangeAnchorEl
                                                                }
                                                                anchorOrigin={{
                                                                  vertical:
                                                                    "bottom",
                                                                  horizontal:
                                                                    "center",
                                                                }}
                                                                transformOrigin={{
                                                                  vertical:
                                                                    "top",
                                                                  horizontal:
                                                                    "center",
                                                                }}
                                                              >
                                                                <div>
                                                                  <DateRangePicker
                                                                    onChange={
                                                                      handleOnChange
                                                                    }
                                                                    showSelectionPreview={
                                                                      true
                                                                    }
                                                                    moveRangeOnFirstSelection={
                                                                      false
                                                                    }
                                                                    months={2}
                                                                    ranges={
                                                                      DateRangeVal
                                                                    }
                                                                    direction="horizontal"
                                                                  />
                                                                  <div className="flex space-x-2 justify-end p-4 cursor-pointer">
                                                                    <WhiteButton
                                                                      onClick={() => {
                                                                        setIsOpendateChange(
                                                                          false
                                                                        );
                                                                        setIsOpendateChangeAnchorEl(
                                                                          null
                                                                        );
                                                                      }}
                                                                      buttonText="Cancel"
                                                                    />
                                                                    <GreenButton
                                                                      loading={
                                                                        updatingDateRange
                                                                      }
                                                                      onClick={
                                                                        handleSubmitDateChange
                                                                      }
                                                                      buttonText="Save"
                                                                    />
                                                                  </div>
                                                                </div>
                                                              </Popover>
                                                            )}
                                                          </div>
                                                        </div>

                                                        <div
                                                          onClick={(e) =>
                                                            handleTaskTagClick(
                                                              e,
                                                              elem
                                                            )
                                                          }
                                                          className="leftTasview-screen min-w-[10%] w-[10%] border-l border-l-[#eee] overflow-hidden py-2 px-2 hover:bg-[#E7F7F6] relative before:absolute before:w-full before:left-0 before:top-0 before:h-full before:border before:border-[#fafbfd] before:hover:border-[#ccc] cursor-pointer"
                                                        >
                                                          {elem?.tags
                                                            ?.length ? (
                                                            elem?.tags?.map(
                                                              (tag) => (
                                                                <div
                                                                  onMouseEnter={() => {
                                                                    setHoveredTag(
                                                                      tag.id
                                                                    );
                                                                    setHoveredTaskAssignee(
                                                                      elem.id
                                                                    );
                                                                  }}
                                                                  onMouseLeave={() => {
                                                                    setHoveredTag(
                                                                      null
                                                                    );
                                                                    setHoveredTaskAssignee(
                                                                      null
                                                                    );
                                                                  }}
                                                                  className="dropdown inline-block relative mr-2 mb-1 "
                                                                >
                                                                  <button
                                                                    className={`py-[3px] mb-1 px-[5px] border-0 inline-flex items-center bg-[${
                                                                      tag.color ??
                                                                      "#c1c1c2"
                                                                    }] text-[12px] font-medium rounded-[4px]`}
                                                                  >
                                                                    <span className="items-center inline-flex text-white align-middle">
                                                                      {tag.name}
                                                                      <span></span>
                                                                    </span>
                                                                  </button>
                                                                  {hoveredTag ===
                                                                    tag.id &&
                                                                    hoveredTaskAssignee ===
                                                                      elem.id && (
                                                                      <span
                                                                        className="ml-1 cursor-pointer absolute -top-[10px] -right-[5px] "
                                                                        onClick={(
                                                                          e
                                                                        ) => {
                                                                          e.stopPropagation();
                                                                          setSelectedTask(
                                                                            elem
                                                                          );
                                                                          handleTaskTagChange(
                                                                            tag?.id
                                                                          );
                                                                        }}
                                                                      >
                                                                        <CancelIcon
                                                                          sx={{
                                                                            fontSize:
                                                                              "17px",
                                                                            color:
                                                                              "#333346",
                                                                          }}
                                                                        />
                                                                      </span>
                                                                    )}
                                                                </div>
                                                              )
                                                            )
                                                          ) : (
                                                            <div className="dropdown inline-block relative mr-2 ">
                                                              <button className="py-[3px] px-[5px] border-0 inline-flex items-center bg-[#c1c1c2] text-[12px] font-medium rounded-[4px]">
                                                                <span className="items-center inline-flex text-white align-middle">
                                                                  <span>
                                                                    no tag added
                                                                  </span>
                                                                </span>
                                                              </button>
                                                            </div>
                                                          )}
                                                        </div>
                                                        {Boolean(
                                                          isTaskTagDropdown
                                                        ) && (
                                                          <Popover
                                                            onClose={() => {
                                                              setSelectedTask(
                                                                null
                                                              );
                                                              setIsTaskTagDropdown(
                                                                null
                                                              );
                                                            }}
                                                            sx={{
                                                              "& .MuiPaper-root":
                                                                {
                                                                  boxShadow:
                                                                    "none", // Remove the box shadow
                                                                },
                                                            }}
                                                            open={Boolean(
                                                              isTaskTagDropdown
                                                            )}
                                                            anchorEl={
                                                              isTaskTagDropdown
                                                            }
                                                            anchorOrigin={{
                                                              vertical:
                                                                "bottom",
                                                              horizontal:
                                                                "center",
                                                            }}
                                                            transformOrigin={{
                                                              vertical: "top",
                                                              horizontal:
                                                                "center",
                                                            }}
                                                          >
                                                            <div className="flex flex-col">
                                                              <div className="h-[auto] p-2 overflow-auto ">
                                                                <div className="mb-4">
                                                                  Tags
                                                                </div>

                                                                <div>
                                                                  {periorityTag?.map(
                                                                    (val) => {
                                                                      return (
                                                                        <div
                                                                          onClick={() => {
                                                                            handleTaskTagChange(
                                                                              val?.id
                                                                            );
                                                                          }}
                                                                          className={`cursor-pointer w-full h-[30px] p-2 text-white rounded flex items-center font-[500] justify-center mb-1`}
                                                                          style={{
                                                                            background:
                                                                              val.color,
                                                                            color:
                                                                              val?.textColor,
                                                                            fontSize:
                                                                              "0.8rem",
                                                                          }}
                                                                        >
                                                                          <h1 className="">
                                                                            {
                                                                              val.name
                                                                            }{" "}
                                                                            &nbsp;{" "}
                                                                            {val?.id ===
                                                                              tagId && (
                                                                              <CheckIcon
                                                                                sx={{
                                                                                  fontSize:
                                                                                    "18px",
                                                                                }}
                                                                              />
                                                                            )}{" "}
                                                                          </h1>
                                                                        </div>
                                                                      );
                                                                    }
                                                                  )}
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </Popover>
                                                        )}
                                                      </div>
                                                    </div>
                                                  )}
                                                </>
                                              )}
                                            </Draggable>
                                          </>
                                        );
                                      })
                                    ) : (
                                      <div className="row-tasks border border-solid border-b border-b-[#e5e9f1] border-l-0 border-r-0 border-t-0">
                                        <div className="flex">
                                          <p className="text-[13px] ml-[20px] text-[#313135] ">
                                            No task found
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            </DragDropContext>
                          </div>
                        </>
                      );
                    })
                ) : (
                  <div className="flex flex-col gap-5 mt-10 justify-center items-center">
                    <svg
                      class="icon text-[45px]  text-[#8e94bb] "
                      width="0.8611111111111112em"
                      height="1em"
                      viewBox="0 0 31 36"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g
                        id="Style-guide"
                        stroke="none"
                        stroke-width="1"
                        fill="none"
                        fill-rule="evenodd"
                      >
                        <g
                          id="nifty-UI-guide"
                          transform="translate(-900.000000, -3111.000000)"
                          fill="currentColor"
                          fill-rule="nonzero"
                        >
                          <g
                            id="Group-6-Copy"
                            transform="translate(852.000000, 3068.000000)"
                          >
                            <path
                              d="M63.2,79 C60.7316918,79 58.7294118,76.9829826 58.7294118,74.5 C58.7294118,74.0029437 58.3291017,73.6 57.8352941,73.6 C57.3414866,73.6 56.9411765,74.0029437 56.9411765,74.5 C56.9411765,76.984547 54.9373421,79 52.4705882,79 C50.0022801,79 48,76.9829826 48,74.5 L48,58.3029664 C48,49.8509274 54.8040841,43 63.2,43 C71.5946379,43 78.4,49.8518332 78.4,58.3029664 L78.4,74.5 C78.4,76.9852814 76.3984495,79 73.9294118,79 C71.4603741,79 69.4588235,76.9852814 69.4588235,74.5 C69.4588235,74.0029437 69.0585134,73.6 68.5647059,73.6 C68.0708983,73.6 67.6705882,74.0029437 67.6705882,74.5 C67.6705882,76.984547 65.6667539,79 63.2,79 Z M57.6615385,70.25 C60.210545,70.25 62.2769231,72.320683 62.2769231,74.875 C62.2769231,75.3841431 62.6915935,75.8 63.2,75.8 C63.7080846,75.8 64.1230769,75.3844657 64.1230769,74.875 C64.1230769,72.320683 66.189455,70.25 68.7384615,70.25 C71.2874681,70.25 73.3538462,72.320683 73.3538462,74.875 C73.3538462,75.3858634 73.7671218,75.8 74.2769231,75.8 C74.7867244,75.8 75.2,75.3858634 75.2,74.875 L75.2,58.2280488 C75.2,51.5854101 69.8271188,46.2 63.2,46.2 C56.5716078,46.2 51.2,51.5844331 51.2,58.2280488 L51.2,74.875 C51.2,75.3841431 51.6146704,75.8 52.1230769,75.8 C52.6311616,75.8 53.0461538,75.3844657 53.0461538,74.875 C53.0461538,72.320683 55.1125319,70.25 57.6615385,70.25 Z M61.2,60.6 C59.6536027,60.6 58.4,59.3463973 58.4,57.8 C58.4,56.2536027 59.6536027,55 61.2,55 C62.7463973,55 64,56.2536027 64,57.8 C64,59.3463973 62.7463973,60.6 61.2,60.6 Z M70.8,60.6 C69.2536027,60.6 68,59.3463973 68,57.8 C68,56.2536027 69.2536027,55 70.8,55 C72.3463973,55 73.6,56.2536027 73.6,57.8 C73.6,59.3463973 72.3463973,60.6 70.8,60.6 Z"
                              id="Combined-Shape"
                            ></path>
                          </g>
                        </g>
                      </g>
                    </svg>
                    <p className="text-[#8e94bb] text-[15px] font-600">
                      There are no open tasks assigned to you
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default MyTasks;
