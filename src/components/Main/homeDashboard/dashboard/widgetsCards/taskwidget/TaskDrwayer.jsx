import React, { useState, useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { closeMilestone } from "redux/reducers/mainDashbord";
import ExpandCircleDownOutlinedIcon from "@mui/icons-material/ExpandCircleDownOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import {
  Avatar,
  Divider,
  Menu,
  MenuItem,
  Popover,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import DateRangeIcon from "@mui/icons-material/DateRange";
import FormControlLabel from "@mui/material/FormControlLabel";

import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { subtaskSideHide, tagsOpen, taskDrawyerClose } from "redux/actions";
import TagIcon from "@mui/icons-material/Tag";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Checkbox from "@mui/material/Checkbox";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import MapsUgcIcon from "@mui/icons-material/MapsUgc";
import AddIcon from "@mui/icons-material/Add";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import TextsmsIcon from "@mui/icons-material/Textsms";
import NearMeIcon from "@mui/icons-material/NearMe";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import MicIcon from "@mui/icons-material/Mic";
import { DateRangePicker } from "react-date-range";
import Fade from "react-reveal/Fade";
import CheckIcon from "@mui/icons-material/Check";
import HookTextField from "hooks/Common/HookTextField";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import * as yup from "yup";
import { isEmpty } from "lodash";
import { useQuery } from "@tanstack/react-query";
import TagsDialog from "./TagsDialog";
import { Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import HookSelectField from "hooks/Common/HookSelectField";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomProgressBar from "hooks/Common/CustomProgressBar";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Zoom from "react-reveal/Zoom";
import Button from "@mui/material/Button";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import SellIcon from "@mui/icons-material/Sell";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import moment from "moment";
import { makeStyles } from "@mui/styles";
import Select from "react-select";
import AvatarGroup from "@mui/material/AvatarGroup";
import HookSelectFileInput from "hooks/Common/HookFileSelect";
import { useAuth } from "hooks/useAuth";
import useDebounce from "hooks/Common/useDebounce";
import { subtaskSideShow } from "redux/actions";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { subTaskHide } from "redux/actions";
import WhiteButton from "hooks/Common/commonButtons/WhiteButton";
import GreenButton from "hooks/Common/commonButtons/GreenButton";
import { paddingTop } from "@xstyled/styled-components";
import LockIcon from "@mui/icons-material/Lock";
import Tooltip from "@mui/material/Tooltip";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { DateCalendar } from "@mui/x-date-pickers";
import CancelIcon from "@mui/icons-material/Cancel";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import CircleIcon from "@mui/icons-material/Circle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CircularProgress from "@mui/material/CircularProgress";
import { useInView } from "react-intersection-observer";

const useStyles = makeStyles((theme) => ({
  datePickerInput: {
    "& .MuiInputBase-root": {},
  },
}));
const TaskDrwayer = ({ taskListId }) => {
  const {
    control,
    watch,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    // resolver: yupResolver(),
  });
  const classes = useStyles();

  const tagName = watch("name");
  const { projectId } = useParams();
  const watchMilestone = watch("milestone");
  const watchPoint = watch("points");
  const auth = useAuth();
  const tagSearch = watch("search");
  const debouncedValue = useDebounce(tagSearch, 500);
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const [name, setName] = useState("Subtasks");
  const [check, setCheck] = useState(true);
  const [isOpendateChange, setIsOpendateChange] = useState(false);
  const [createTags, setCreateTags] = useState(false);
  const [drawyerWidth, setDrawyerWidth] = useState(700);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [colorState, setColorState] = useState("");
  const workspaceId = localStorage.getItem("workspaceId");
  const { enqueueSnackbar } = useSnackbar();
  const [tagId, setTagId] = useState(false);
  const [isOpenDueDate, setIsOpenDueDate] = useState(false);
  const [dueDate, setdueDate] = useState();
  const [base64Files, setBase64Files] = useState([]);
  const [filePayload, setFilePayload] = useState();
  const [newTaskAssignee, setNewTaskAssignee] = useState(null);
  const [isTaskAssigneeDropdown, setIsTaskAssigneeDropdown] = useState(null);
  const [isDependenciesDropdown, setIsDependenciesDropdown] = useState(null);

  const [selectedTaskAssigneeID, setSelectedTaskAssigneeID] = useState(null);
  const [selectedDependencyID, setSelectedDependencyID] = useState(null);
  const [filterAssigneeValue, setFilterAssigneeValue] = useState("");
  const [filterDependencyValue, setFilterDependencyValue] = useState("");
  const [isShown, setIsShown] = useState(false);
  const [isMilestoneDropdown, setIsMilestoneDropdown] = useState(null);
  const [selectedMilstoneId, setSelectedMilstoneId] = useState(null);
  const [filterMilstoneValue, setFilterMilesoneValue] = useState("");
  const [isTagDeleteShow, setIsTagDeleteShow] = useState(false);
  const [priorityIconShow, setPriorityIconShow] = useState(false);
  const [riskStatusShow, setRiskStatusShow] = useState(false);

  const [DateRangeVal, setDateRangeVal] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const queryClient = useQueryClient();

  const currentdate = moment().format();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const open2 = Boolean(anchorEl2);
  const id2 = open2 ? "simple-popover" : undefined;

  const dispatch = useDispatch();
  const { taskState: isOpen } = useSelector((state) => state?.projectTaskSlice);
  const isSubTaskShow = useSelector((state) => state.projectTaskSlice.subTask);
  const taskId = useSelector((state) => state?.projectTaskSlice?.taskId);
  const { ref, inView } = useInView();

  const subtaskSide = useSelector(
    (state) => state.projectTaskSlice.subtaskDetailShow
  );
  const subtaskChild = useSelector(
    (state) => state.projectTaskSlice.childSubTask
  );

  const { data: tagsAssignList } = useQuery(
    ["tags_get_list", workspaceId, debouncedValue],
    () => {
      return axios.get(
        `/tag/task/${workspaceId}?search=${
          debouncedValue ? debouncedValue : ""
        }`
      );
    },
    {
      select: (res) => {
        return res?.data?.data;
      },
    }
  );

  const sliceTags = tagsAssignList?.slice(0, 3);
  const periorityTag = tagsAssignList?.filter((val) => {
    return val?.isCustom === false;
  });

  const customTags = tagsAssignList?.filter((val) => {
    return val?.isCustom === true;
  });

  const { mutate: addTags, isLoading: tagLoading } = useMutation({
    mutationKey: ["task_tags"],
    mutationFn: (data) => axios.post(`/tag/task`, data),
    onSuccess: (data) => {
      if (data.data.success) {
        enqueueSnackbar(data.data.message, { variant: "success" });
        queryClient.invalidateQueries(["tags_get_list"]);
        queryClient.invalidateQueries(["task_details_subtask"]);
        queryClient.invalidateQueries(["task_list_all"]);
        setValue("name", "", {
          shouldDirty: true,
          shouldValidate: true,
        });
        setCreateTags(false);
        setColorState("");
      }
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  const { mutate: updateDueDate, isLoading: dueDateLoading } = useMutation({
    mutationKey: ["update_dueDate"],
    mutationFn: () =>
      axios.put(
        `/task/update_due_date/${taskId}?dueDate=${moment(dueDate)
          .endOf("day")
          .format("YYYY-MM-DDTHH:mm:ss")}`
      ),
    onSuccess: (data) => {
      if (data.data.success) {
        queryClient.invalidateQueries(["task_details_subtask"]);
        queryClient.invalidateQueries(["task_list_all"]);
        setIsOpenDueDate(false);
      }
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  const { mutate: updateTags } = useMutation({
    mutationKey: ["task_tags_update"],
    mutationFn: (id) => axios.put(`task/update_tag/${taskId}/?tag_id=${id}`),
    onSuccess: (data) => {
      if (data.data.success) {
        enqueueSnackbar(data.data.message, { variant: "success" });
        queryClient.invalidateQueries(["tags_get_list"]);
        queryClient.invalidateQueries(["task_details_subtask"]);
        queryClient.invalidateQueries(["task_list_all"]);
      }
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  const { mutate: updateMileStoneList } = useMutation({
    mutationKey: ["update_mile_stonelist"],
    mutationFn: (data) =>
      axios.put(`/task/update_milestone/${taskId}?milestone=${data?.assignee}`),
    onSuccess: (data) => {
      if (data.data.success) {
        enqueueSnackbar(data.data.message, { variant: "success" });
        queryClient.invalidateQueries(["task_details_subtask"]);
        queryClient.invalidateQueries(["task_list_all"]);
        handleClose2();
      }
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });
  const { mutate: tagDelete } = useMutation({
    mutationKey: ["tag_delete"],
    mutationFn: (id) => axios.delete(`/tag/${id}`),
    onSuccess: (data) => {
      if (data.data.success) {
        enqueueSnackbar(data.data.message, { variant: "success" });
        queryClient.invalidateQueries(["tags_get_list"]);
        queryClient.invalidateQueries(["task_details_subtask"]);
        queryClient.invalidateQueries(["task_list_all"]);
      }
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });
  // update pointsss

  const { mutate: updatePointList } = useMutation({
    mutationKey: ["update_story_point"],
    mutationFn: () =>
      axios.put(`/task/update_story_point/${taskId}?storyPoint=${watchPoint}`),
    onSuccess: (data) => {
      if (data.data.success) {
        enqueueSnackbar(data.data.message, { variant: "success" });
        queryClient.invalidateQueries(["task_details_subtask"]);
        queryClient.invalidateQueries(["task_list_all"]);
        setValue("points", "");
      }
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  const { mutate: updateAssignee } = useMutation({
    mutationKey: ["task/update_assignee"],
    mutationFn: (data) =>
      axios.put(`/task/update_assignee/${taskId}?assignee=${data?.assignee}`),
    onSuccess: (data) => {
      if (data.data.success) {
        queryClient.invalidateQueries(["task_list_all"]);
        queryClient.invalidateQueries(["task_details_subtask"]);
        setIsTaskAssigneeDropdown(null);

        enqueueSnackbar(data.data.message, { variant: "success" });
      }
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
      setIsTaskAssigneeDropdown(null);
    },
  });
  const { mutate: updateDependency } = useMutation({
    mutationKey: ["task/dependency"],
    mutationFn: (data) =>
      axios.put(
        `/task/update_dependency/${taskId}?parentTaskId=${data?.assignee}`
      ),
    onSuccess: (data) => {
      if (data.data.success) {
        queryClient.invalidateQueries(["task_list_all"]);
        queryClient.invalidateQueries(["task_details_subtask"]);
        setIsDependenciesDropdown(null);
        enqueueSnackbar(data.data.message, { variant: "success" });
      }
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
      setIsDependenciesDropdown(null);
    },
  });

  const { mutate: postMessages, isLoading: messageLoading } = useMutation({
    mutationKey: ["post_messages"],
    mutationFn: (data) => axios.post(`/task/add_comment/${taskId}`, data),
    onSuccess: (data) => {
      if (data?.data?.success) {
        queryClient.invalidateQueries(["task_list_all"]);
        queryClient.invalidateQueries(["task_details_subtask"]);
        enqueueSnackbar(data.data.message, { variant: "success" });
        setValue("comment", "");
        setFilePayload("");
        setBase64Files([]);
      }
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  const { mutate: updateDateRande, isLoading: updatingDateRange } = useMutation(
    {
      mutationKey: ["task_date_update", taskId],
      mutationFn: (data) => axios.put(`/task/update_duration/${taskId}`, data),
      onSuccess: (data) => {
        if (data.data.success) {
          enqueueSnackbar(data.data.message, { variant: "success" });
          queryClient.invalidateQueries(["task_details_subtask"]);
          setIsOpendateChange(false);
        }
      },
      onError: (data) => {
        enqueueSnackbar(data.response.data.message, { variant: "error" });
      },
    }
  );
  const { mutate: deleteUser } = useMutation({
    mutationKey: ["delete_user_assignee"],
    mutationFn: (id) =>
      axios.delete(`/task/delete_user/${taskId}?user_id=${id}`),
    onSuccess: (data) => {
      if (data.data.success) {
        enqueueSnackbar(data.data.message, { variant: "success" });
        queryClient.invalidateQueries(["task_details_subtask"]);
        setIsOpendateChange(false);
      }
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  const checkKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      isEmpty(watchPoint)
        ? enqueueSnackbar("Enter Points", { variant: "error" })
        : updatePointList();
    }
  };

  const { data: taskDetails } = useQuery(
    ["task_details_subtask", taskId],
    () => {
      return axios.get(`/task/${taskId}`);
    },
    {
      enabled: !!taskId,
      select: (res) => {
        return res?.data?.data;
      },
      onSuccess: (data) => {
        let payload = [
          {
            startDate: new Date(data.startDate),
            endDate: new Date(data.dueDate),
            key: "selection",
          },
        ];
        setDateRangeVal(payload);
      },
      refetchOnWindowFocus: false,
    }
  );

  const { data: mileStoneCardList } = useQuery(
    ["milestone_list", projectId],
    () => {
      return axios.get(`/milestone/listing/${projectId}`);
    },
    {
      select: (res) => {
        return res?.data?.data?.map((val) => {
          return {
            value: val?.id,
            label: val?.name,
          };
        });
      },
    }
  );

  const { mutate: updatePriority } = useMutation({
    mutationKey: ["priority_update_list"],
    mutationFn: (value) =>
      axios.put(`/task/update_priority/${taskId}?priority=${value}`),
    onSuccess: (data) => {
      if (data?.data?.success) {
        queryClient.invalidateQueries(["task_list_all"]);
        queryClient.invalidateQueries(["task_details_subtask"]);
        enqueueSnackbar(data.data.message, { variant: "success" });
      }
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });
  const { mutate: updateRiskStatus } = useMutation({
    mutationKey: ["update_risk_status"],
    mutationFn: (value) =>
      axios.put(`/task/update_risk_status/${taskId}?status=${value}`),
    onSuccess: (data) => {
      if (data?.data?.success) {
        queryClient.invalidateQueries(["task_list_all"]);
        queryClient.invalidateQueries(["task_details_subtask"]);
        enqueueSnackbar(data.data.message, { variant: "success" });
      }
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  const milestoneName = mileStoneCardList?.find((val) => {
    return val?.value === taskDetails?.milestoneId;
  });
  const sliceDetailTags = taskDetails?.tags?.slice(0, 9);

  const onSubmit = (data) => {
    const tagPayload = {
      workspace_Id: workspaceId,
      name: data?.name,
      color: colorState,
    };
    addTags(tagPayload);
  };

  const MaxWidth = () => {
    setDrawyerWidth(1200);
    setCheck(true);
  };
  const MinWidth = () => {
    setDrawyerWidth(700);
    setCheck(false);
  };

  function changeWidth() {
    if (check) {
      MinWidth();
    } else {
      MaxWidth();
    }
  }

  const handleTagsShow = () => {
    setCreateTags(true);
  };
  const handleTagsHide = () => {
    setCreateTags(false);
    setColorState("");
    setValue("name", "", {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const onSubmitMessages = (data) => {
    const payloadMessages = {
      comment: data?.comment,
      when: currentdate,
      userId: 1,
      taskId: taskId,
      attachment: filePayload || [],
    };
    postMessages(payloadMessages);
  };

  const handleOnChange = (ranges) => {
    const { selection } = ranges;
    setDateRangeVal([selection]);
  };

  const handleSubmitDateChange = () => {
    const payload = {
      startDate: DateRangeVal[0]?.startDate,
      dueDate: DateRangeVal[0]?.endDate,
    };
    if (!isEmpty(payload)) {
      updateDateRande(payload);
    }
  };

  const handleFileUpload = (event) => {
    const files = event.target.files;
    // Create an array to store the base64 strings
    const base64Array = [];
    // Loop through each file and read it as base64
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(",")[1]; // Remove the "data:image/jpeg;base64," part
        base64Array.push({
          file_content: base64String,
          file_name: file.name,
          file_extension: file.name.split(".").pop(),
        });
        setBase64Files((prevFiles) => [...prevFiles, base64String]); // Update the base64Files state with the new file

        // Check if all files have been processed
        if (base64Array.length === files.length) {
          // Call a function to handle the base64 data
          handleBase64Upload(base64Array);
        }
      };
      reader.readAsDataURL(file); // Read the file as base64
    });
  };

  const handleBase64Upload = async (base64Array) => {
    // You can perform any desired operations with the base64 data here
    // console.log("Previously uploaded files:", base64Files);
    // console.log("Newly selected files:", base64Array);
    setFilePayload(base64Array);
  };

  const handleDeleteFile = (index) => {
    setBase64Files((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };

  const { data: usersList } = useQuery({
    queryKey: ["workspace/workspace_members"],
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

  const { data: dependenciesList } = useQuery(
    ["dependency", projectId],
    () => {
      return axios.get(`/task/project_tasks/${projectId}`);
    },
    {
      enabled: !!projectId,
      select: (res) => {
        return res?.data?.data?.map((val) => {
          return {
            value: val?.id,
            label: val?.name,
          };
        });
      },
    }
  );

  const handleTaskAssigneeChange = (assignee) => {
    setSelectedTaskAssigneeID(assignee);
    const obj = {
      assignee: assignee,
    };

    updateAssignee(obj);
  };

  const handleFilterChange = (event) => {
    setFilterAssigneeValue(event.target.value);
  };
  const filteredUsersList = usersList?.filter((user) =>
    user?.label?.toLowerCase()?.includes(filterAssigneeValue.toLowerCase())
  );

  const filterDependencyList = dependenciesList?.filter((user) =>
    user?.label?.toLowerCase()?.includes(filterDependencyValue.toLowerCase())
  );

  const filterMilestoneList = mileStoneCardList?.filter((user) =>
    user?.label?.toLowerCase()?.includes(filterMilstoneValue.toLowerCase())
  );


  const handleChangeDependency = (event) => {
    setFilterDependencyValue(event.target.value);
  };

  const handleDependencyChange = (assignee) => {
    setSelectedDependencyID(assignee);
    const obj = {
      assignee: assignee,
    };
    updateDependency(obj);
  };

  const handleMilstoneChnage = (event) => {
    setFilterMilesoneValue(event.target.value);
  };

  const handleMilstoneValuesChnage = (assignee) => {
    setSelectedMilstoneId(assignee);
    const obj = {
      assignee: assignee,
    };
    updateMileStoneList(obj);
  };

  const { hasNextPage, isFetchingNextPage, fetchNextPage, data, isLoading } =
    useInfiniteQuery(
      ["get_task_logs", taskId],
      ({ pageParam = 0 }) =>
        axios.get(`/task/get_task_logs/${taskId}`, {
          params: {
            page_size: 10,
            page_index: pageParam,
          },
        }),

      {
        getNextPageParam: (lastPage) => {
          return lastPage?.data.page_number + 1 < lastPage.data.total_pages
            ? lastPage.data.page_number + 1
            : undefined;
        },
        // refetchOnWindowFocus:true
      }
    );

 

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const priorityList = [
    {
      name: "Low",
      color: "#F5BE6A",
      value: 4,
    },
    {
      name: "Normal",
      color: "#A1ECE8",
      value: 3,
    },
    {
      name: "High",
      color: "#B76CD9",
      value: 2,
    },
    {
      name: "Critical",
      color: "#FF614B",
      value: 1,
    },
  ];

  const riskList = [
    {
      name: "To Do ",
      value: 1,
      color: "#51CCC5",
    },
    {
      name: "Completed",
      value: 2,
      color: "#F9DF71",
    },
    {
      name: "Archived",
      value: 3,
      color: "#F06A6A",
    },
  ];

  function PriorityShow(val) {
    return val == 1
      ? "Critical"
      : val == 2
      ? "High"
      : val == 3
      ? "Normal"
      : "Low";
  }

  const ColorShow = (val) => {
    return val == 1
      ? "#FF614B"
      : val == 2
      ? "#B76CD9"
      : val == 3
      ? "#A1ECE8"
      : "#F5BE6A";
  };

  const riskColorShow = (val) => {
    return val == 1 ? "#51CCC5" : val == 2 ? "#F9DF71" : "#F06A6A";
  };
  const riskStatus = (val) => {
    return val == 1 ? "To Do" : val == 2 ? "Completed" : "Archived";
  };

  return (
    <div>
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => {
          dispatch(taskDrawyerClose());
          setTimeout(() => {
            setDrawyerWidth(1200);
          }, 1000);
        }}
      >
        <Box sx={{ width: drawyerWidth }}>
          <div className="sticky top-0 bg-white z-50">
            <div className="flex justify-between pt-[1rem] px-[1rem] items-center ">
              <h3>Tasks</h3>
              <div className="flex space-x-3 items-center">
                <div
                  className="cursor-pointer "
                  onClick={() => {
                    dispatch(taskDrawyerClose());
                    setTimeout(() => {
                      setDrawyerWidth(1200);
                    }, 1000);
                  }}
                >
                  <CloseIcon />
                </div>
                <div className="cursor-pointer" onClick={changeWidth}>
                  <OpenInFullIcon />
                </div>
              </div>
            </div>
            <div className="mt-2">
              <Divider />
            </div>
          </div>
          <div className="mt-0">
            {/* ///////////////////// new design //////////////// */}
            <div className="public-note bg-[#F9F8F8] px-[1rem] py-2 mb-5 flex justify-between">
              <div className="flex items-center">
                <span className="text-[#747577] mr-2">
                  <LockIcon className="!w-[16px]" />
                </span>
                <p className="text-[13px]">
                  This task is visible to its collaborators.
                </p>
              </div>
              <div className="cursor-pointer text-[13px] px-3 py-1 rounded-md hover:bg-[#efefef]">
                Make public
              </div>
            </div>
            <div className="px-[1rem]">
              <h1 className="text-[22px] font-medium mb-5">
                {taskDetails?.name}
              </h1>
            </div>
            <div className="px-[1rem] flex items-center mb-3">
              <div className="relative w-[20%]">
                <Tooltip title="Add the person" arrow>
                  <span className="text-[13px]">Assignee</span>
                </Tooltip>
              </div>
              <div className="flex space-x-3 items-center">
                <h1
                  className="text-[15px] cursor-pointer"
                  onClick={(e) => setIsTaskAssigneeDropdown(e.currentTarget)}
                >
                  Select Assignee
                </h1>
                <div className="flex space-x-2">
                  {taskDetails?.assigneeName?.length ? (
                    <div className="flex space-x-2 items-center">
                      {taskDetails?.assigneeName?.map((assignee, index) => {
                        return (
                          <div
                            key={index}
                            className="dropdown flex space-x-2 relative items-center "
                            onMouseEnter={() => setIsShown(assignee?.id)}
                            onMouseLeave={() => setIsShown(false)}
                          >
                            <button className="py-[3px] px-[5px] border-0 inline-flex items-center bg-[#ff735f] text-[12px] font-medium rounded-[4px]">
                              <span className="items-center inline-flex text-white align-middle">
                                {assignee.name?.substr(0, 2)?.toUpperCase()}
                              </span>
                            </button>
                            {isShown === assignee?.id && (
                              <div
                                className="absolute top-[-11px] cursor-pointer left-2"
                                onClick={() => deleteUser(assignee?.user_Id)}
                              >
                                <CancelIcon
                                  sx={{ fontSize: "17px", color: "#333346" }}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              {Boolean(isTaskAssigneeDropdown) && (
                <Popover
                  onClose={() => {
                    setIsTaskAssigneeDropdown(null);
                  }}
                  sx={{
                    height: "200px",
                    "& .MuiPaper-root": {
                      boxShadow: "none", // Remove the box shadow
                    },
                  }}
                  open={Boolean(isTaskAssigneeDropdown)}
                  anchorEl={isTaskAssigneeDropdown}
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
                    className=" bg-white  border border-[#E8E8E9] rounded w-[300px]  "
                  >
                    <ul className="py-1">
                      <li>
                        <input
                          type="text"
                          className=" text-[13px] border-0 border-b-slate-50"
                          placeholder="Search assignee"
                          onChange={handleFilterChange}
                        />
                      </li>
                      {filteredUsersList?.map((el) => (
                        <li key={el.value} className="mb-3">
                          <div
                            onClick={() => handleTaskAssigneeChange(el.value)}
                            className="flex cursor-pointer items-center px-4 py-2 font-Manrope text-[12px]  hover:bg-[#F2FFFE] hover:text-[#00B8A9] "
                          >
                            <span className="w-[24px] h-[24px] mr-[5px] rounded-full bg-[#4775d5] flex justify-center items-center text-white text-[11px] font-Manrope font-medium">
                              {el.label.substr(0, 2)?.toUpperCase()}
                            </span>
                            {el.label}{" "}
                            <em className="text-[#666] ml-2 not-italic">
                              {el.email}
                            </em>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Popover>
              )}
            </div>
            {/* due date  */}
            <div className="px-[1rem] flex items-center mb-3">
              <div className="relative w-[20%]">
                <Tooltip title="Due Date" arrow>
                  <span className="text-[13px]">Due date</span>
                </Tooltip>
              </div>
              <div className="flex items-center">
                <PopupState variant="popover" popupId="date-popover">
                  {(popupState) => (
                    <div>
                      <div
                        {...bindTrigger(popupState)}
                        className="w-full cursor-pointer rounded-md bg-white"
                      >
                        <div
                          onClick={() => setIsOpenDueDate(true)}
                          className="flex space-x-1 items-center"
                        >
                          <div className="flex space-x-2 items-center">
                            <CalendarMonthIcon
                              sx={{ fontSize: "16px", color: "#ca2b51" }}
                            />
                          </div>
                          <div className="flex items-center cursor-pointer hover:bg-[#eee] rounded-sm px-2 py-1">
                            <p className="text-[14px] text-[#ca2b51]">
                              {moment(taskDetails?.dueDate).format(
                                "MMM D, YYYY"
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      {isOpenDueDate && (
                        <Popover
                          onClose={() => setIsOpenDueDate(false)}
                          {...bindPopover(popupState)}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "center",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "center",
                          }}
                          style={{ zIndex: 99999999 }}
                        >
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <div>
                              <DateCalendar
                                value={dueDate}
                                onChange={(data) => setdueDate(data)}
                              />
                              <div className="p-2 flex justify-end ">
                                <GreenButton
                                  loading={dueDateLoading}
                                  onClick={() => updateDueDate()}
                                  buttonText="Save"
                                />
                              </div>
                            </div>
                          </LocalizationProvider>
                        </Popover>
                      )}
                    </div>
                  )}
                </PopupState>
              </div>
            </div>
            {/* projects  */}
            <div className="px-[1rem] flex mb-3">
              <div className="relative w-[20%]">
                <span className="text-[13px]">Projects</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center mb-1">
                  <p className="text-[13px] ml-3">{taskDetails?.projectName}</p>
                </div>
              </div>
            </div>
            {/* Dependencies  */}
            <div className="px-[1rem] flex mb-3">
              <div className="relative w-[20%]">
                <span className="text-[13px]">Dependencies</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center mb-1">
                  <div className="incompleteBtn">
                    <div className="group relative flex space-x-5 items-center">
                      <button
                        onClick={(e) =>
                          setIsDependenciesDropdown(e.currentTarget)
                        }
                        className="px-2 h-7 rounded-sm text-[#63636f] hover:bg-[#eee] flex items-center font-Manrope text-[14px]"
                      >
                        Add dependencies
                      </button>
                      <div>
                        <p className="text-[13px]">{taskDetails?.parentName}</p>
                      </div>
                      {Boolean(isDependenciesDropdown) && (
                        <Popover
                          onClose={() => {
                            setIsDependenciesDropdown(null);
                          }}
                          sx={{
                            height: "200px",
                            "& .MuiPaper-root": {
                              boxShadow: "none", // Remove the box shadow
                            },
                          }}
                          open={Boolean(isDependenciesDropdown)}
                          anchorEl={isDependenciesDropdown}
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
                            className=" bg-white  border border-[#E8E8E9] rounded w-[300px]  "
                          >
                            <ul className="py-1">
                              <li>
                                <input
                                  type="text"
                                  className=" text-[13px] border-0 border-b-slate-50"
                                  placeholder="Search"
                                  onChange={handleChangeDependency}
                                />
                              </li>
                              {filterDependencyList?.map((el) => (
                                <li key={el.value} className="mb-3">
                                  <div
                                    onClick={() =>
                                      handleDependencyChange(el.value)
                                    }
                                    className="flex cursor-pointer items-center px-4 py-2 font-Manrope text-[12px]  hover:bg-[#F2FFFE] hover:text-[#00B8A9] "
                                  >
                                    <span className="w-[24px] h-[24px] mr-[5px] rounded-full bg-[#4775d5] flex justify-center items-center text-white text-[11px] font-Manrope font-medium">
                                      {el.label.substr(0, 2)?.toUpperCase()}
                                    </span>
                                    {el.label}{" "}
                                    <em className="text-[#666] ml-2 not-italic">
                                      {el.email}
                                    </em>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </Popover>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Priority  */}
            <div className="px-[1rem] flex mb-4">
              <div className="relative w-[20%]">
                <span className="text-[13px]">
                  <ExpandCircleDownOutlinedIcon
                    sx={{
                      fontSize: "16px",
                      color: "#63636f",
                      marginRight: "3px",
                      position: "relative",
                      top: "-1px",
                    }}
                  />{" "}
                  Priority
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center mb-1">
                  <div className="incompleteBtn">
                    <div className="group relative">
                      <button
                        style={{
                          background: ColorShow(taskDetails?.priority),
                        }}
                        className="px-3 py-[2px] rounded-[16px] bg-[#a1ece8] text-[#fff] hover:bg-[#eee] flex items-center justify-center text-center font-Manrope text-[14px] w-[100px]"
                      >
                        {PriorityShow(taskDetails?.priority)}
                      </button>
                      <div
                        tabIndex={0}
                        className=" bg-white invisible border border-[#E8E8E9] rounded w-[150px] right-1 absolute  top-full transition-all opacity-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-1 z-10"
                      >
                        <div>
                          <ul className="py-3 commonDropDown">
                            {priorityList?.map((val, index) => {
                              return (
                                <li
                                  className={` ${
                                    priorityIconShow == val?.name
                                      ? "selected"
                                      : ""
                                  } px-3 mb-3 `}
                                  key={index}
                                >
                                  <span className=" text-sm relative selected-icon -left-1 pr-2">
                                    <DoneOutlinedIcon
                                      sx={{
                                        fontSize: "16px",
                                        color: "black",
                                      }}
                                    />
                                  </span>

                                  <a
                                    onClick={() => {
                                      setPriorityIconShow(val?.name);
                                      updatePriority(val?.value);
                                    }}
                                    style={{ background: val?.color }}
                                    className="d-flex cursor-pointer px-3 py-1 font-Manrope text-[12px] w-[80px] inline-block text-center rounded-[16px] "
                                  >
                                    {val.name}
                                  </a>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Status  */}
            <div className="px-[1rem] flex mb-3">
              <div className="relative w-[20%]">
                <span className="text-[13px]">
                  <ExpandCircleDownOutlinedIcon
                    sx={{
                      fontSize: "16px",
                      color: "#63636f",
                      marginRight: "3px",
                      position: "relative",
                      top: "-1px",
                    }}
                  />
                  Status
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center mb-1">
                  <div className="incompleteBtn">
                    <div className="group relative">
                      <button
                        style={{
                          background: riskColorShow(taskDetails?.taskRisk),
                        }}
                        className="px-3 py-[2px] w-[100px] justify-center rounded-[16px] text-[#fff] hover:bg-[#eee] flex items-center font-Manrope text-[14px]"
                      >
                        {riskStatus(taskDetails?.taskRisk)}
                      </button>
                      <div
                        tabIndex={0}
                        className=" bg-white invisible border border-[#E8E8E9] rounded w-[150px] right-1 absolute  top-full transition-all opacity-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-1 z-10"
                      >
                        <ul className="py-3 commonDropDown">
                          {riskList.map((val) => {
                            return (
                              <li
                                className={`${
                                  riskStatusShow === val?.name ? "selected" : ""
                                } px-3 mb-3`}
                              >
                                <span className="text-sm selected-icon relative -left-1">
                                  <DoneOutlinedIcon sx={{ fontSize: "16px" }} />
                                </span>
                                <a
                                  style={{ background: val?.color }}
                                  onClick={() => {
                                    setRiskStatusShow(val?.name);
                                    updateRiskStatus(val.value);
                                  }}
                                  className="d-flex cursor-pointer px-3 py-1 font-Manrope text-[12px] w-[90px] inline-block text-center rounded-[16px] "
                                >
                                  {val.name}
                                </a>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-[1rem] flex mb-3">
              <div className="relative w-[20%]">
                <div
                  className="flex space-x-2 items-center cursor-pointer"
                  onClick={handleClick}
                >
                  <LocalOfferIcon sx={{ fontSize: "15px", color: "#B1B5D0" }} />
                  <h3 className="text-[13px]">Tags</h3>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center mb-1">
                  <div className="incompleteBtn">
                    <div className="cursor-pointer mt-4 pl-2">
                      <Grid container spacing={2}>
                        <div className="flex items-center">
                          <div>
                            <p
                              className="text-[13px] pr-1"
                              onClick={handleClick}
                            >
                              Select Tags
                            </p>
                          </div>
                          {sliceDetailTags?.map((val) => {
                            return (
                              <>
                                <div
                                  item
                                  className="px-1 relative"
                                  onMouseEnter={() =>
                                    setIsTagDeleteShow(val?.id)
                                  }
                                  onMouseLeave={() => setIsTagDeleteShow(false)}
                                >
                                  <div
                                    onClick={handleClick}
                                    className="rounded-md h-auto flex items-center justify-center text-[12px] py-[2px] px-[12px] text-[#fff]"
                                    style={{ background: val?.color }}
                                  >
                                    {val.name}
                                  </div>
                                  {isTagDeleteShow == val?.id && (
                                    <span
                                      className=" "
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        tagDelete(val?.id);
                                      }}
                                    >
                                      <CancelIcon
                                        sx={{
                                          position: "absolute",
                                          fontSize: "17px",
                                          bottom: "19px",
                                          right: "0px",
                                          color: "#333346",
                                        }}
                                      />
                                    </span>
                                  )}
                                </div>
                              </>
                            );
                          })}
                          {taskDetails?.tags?.length > 8 && (
                            <span className="">
                              {" "}
                              <div
                                className="cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dispatch(tagsOpen());
                                }}
                              >
                                <MoreHorizIcon sx={{ color: "#02BBAB" }} />
                              </div>
                            </span>
                          )}
                        </div>
                      </Grid>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-[1rem] flex mb-3">
              <div className="relative w-[20%]">
                <div
                  className="flex flex-col cursor-pointer"
                  onClick={handleClick2}
                >
                  <div
                    className="flex space-x-2 items-center"
                    onClick={(e) => setIsMilestoneDropdown(e.currentTarget)}
                  >
                    <FormatListBulletedIcon
                      sx={{ fontSize: "15px", color: "#B1B5D0" }}
                    />
                    <h3 className="text-[13px]">Milestone </h3>
                  </div>

                  {Boolean(isMilestoneDropdown) && (
                    <Popover
                      onClose={() => {
                        setIsMilestoneDropdown(null);
                      }}
                      sx={{
                        height: "200px",
                        "& .MuiPaper-root": {
                          boxShadow: "none", // Remove the box shadow
                        },
                      }}
                      open={Boolean(isMilestoneDropdown)}
                      anchorEl={isMilestoneDropdown}
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
                        className=" bg-white  border border-[#E8E8E9] rounded w-[300px]  "
                      >
                        <ul className="py-1">
                          <li>
                            <input
                              type="text"
                              className=" text-[13px] border-0 border-b-slate-50"
                              placeholder="Search Milestones"
                              onChange={handleMilstoneChnage}
                            />
                          </li>
                          {filterMilestoneList?.map((el) => (
                            <li key={el.value} className="mb-3">
                              <div
                                onClick={() =>
                                  handleMilstoneValuesChnage(el.value)
                                }
                                className="flex cursor-pointer items-center px-4 py-2 font-Manrope text-[12px]  hover:bg-[#F2FFFE] hover:text-[#00B8A9] "
                              >
                                <span className="w-[24px] h-[24px] mr-[5px] rounded-full bg-[#4775d5] flex justify-center items-center text-white text-[11px] font-Manrope font-medium">
                                  {el.label.substr(0, 2)?.toUpperCase()}
                                </span>
                                {el.label}{" "}
                                <em className="text-[#666] ml-2 not-italic">
                                  {el.email}
                                </em>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Popover>
                  )}
                </div>
              </div>

              {/* value milestone  */}
              <div className="flex flex-col">
                <div className="flex items-center mb-1">
                  <div className="incompleteBtn">
                    <div>
                      <h3 className="text-[13px] text-[#B1B5D0] font-[500]">
                        {milestoneName?.label}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-[1rem] flex mb-0">
              <div className="relative w-[20%]">
                <div className=" flex space-x-2 relative items-center cursor-pointer">
                  <DateRangeIcon
                    sx={{
                      fontSize: "13px",
                      color: "#B1B5D0",
                    }}
                  />
                  <h3 className="text-[13px] ">Start & End Date </h3>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center mb-1">
                  <PopupState variant="popover" popupId="demo-popup-popover">
                    {(popupState) => (
                      <div>
                        <div
                          {...bindTrigger(popupState)}
                          className="w-max cursor-pointer rounded-md bg-white flex items-center justify-center"
                        >
                          <div
                            className="cursor-pointer"
                            onClick={() => setIsOpendateChange(true)}
                          >
                            <h3 className="text-[13px] text-[#B1B5D0] font-[500] h-[20px] hover:border-b-2 border-dashed ">
                              {moment(taskDetails?.startDate).format("ll")}-{" "}
                              {moment(taskDetails?.dueDate).format("ll")}
                            </h3>
                          </div>
                        </div>
                        {isOpendateChange && (
                          <Popover
                            onClose={() => setIsOpendateChange(false)}
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
                            <div>
                              <DateRangePicker
                                onChange={handleOnChange}
                                showSelectionPreview={true}
                                moveRangeOnFirstSelection={false}
                                months={2}
                                ranges={DateRangeVal}
                                direction="horizontal"
                              />
                              <div className="flex space-x-2 justify-end p-4 cursor-pointer">
                                <WhiteButton
                                  onClick={() => setIsOpendateChange(false)}
                                  buttonText="Cancel"
                                />
                                <GreenButton
                                  loading={updatingDateRange}
                                  onClick={handleSubmitDateChange}
                                  buttonText="Save"
                                />
                              </div>
                            </div>
                          </Popover>
                        )}
                      </div>
                    )}
                  </PopupState>
                </div>
              </div>
            </div>

            <Box>
              <Grid container sx={{ paddingBottom: "20px" }}>
                <Grid item xs={12} sx={{ borderRight: "1px solid #E5E7EB" }}>
                  <div className="">
                    <Box
                      sx={{ flexGrow: 1, marginTop: "20px", padding: "0 24px" }}
                    >
                      <Grid container spacing={2}>
                        <div className="w-full">
                          {name === "Subtasks" ? (
                            <div className="w-full">
                              <SubTaskInnerList taskDetails={taskDetails} />
                            </div>
                          ) : (
                            <SubTaskInnerList taskDetails={taskDetails} />
                          )}
                        </div>
                      </Grid>
                    </Box>
                  </div>
                </Grid>

                <Grid item xs={12}>
                  {subtaskSide ? (
                    // subtask detailss
                    <div>
                      <div className="relative h-full overflow-auto">
                        <div className="flex justify-between pr-2 mt-1">
                          <div className="flex space-x-2 items-center">
                            <div
                              className="cursor-pointer"
                              onClick={() => dispatch(subtaskSideHide())}
                            >
                              <ArrowBackIosNewIcon
                                sx={{ color: "#B1B5D0", fontSize: "21px" }}
                              />
                            </div>
                            <h3>Name of subtask</h3>s
                          </div>
                          <div className="flex space-x-2 items-center">
                            <div className="cursor-pointer">
                              <MoreHorizIcon
                                sx={{ fontSize: "17px", color: "#B1B5D0" }}
                              />
                            </div>
                            <div
                              className="cursor-pointer"
                              onClick={() => dispatch(subtaskSideHide())}
                            >
                              <CloseIcon sx={{ color: "#B1B5D0" }} />
                            </div>
                          </div>
                        </div>
                        <div className="flex mt-5 items-center">
                          <div>
                            <Checkbox />
                          </div>
                          <h3>Name of subtask</h3>
                        </div>
                        {/*  */}
                        <div className="mt-7">
                          <Divider />
                        </div>
                        {/* bottom section */}
                        <Box sx={{ flexGrow: 1, marginTop: "20px" }}>
                          <Grid container spacing={2}>
                            <Grid item xs={4}>
                              <div className="flex flex-col pl-4">
                                <div className="flex space-x-2 items-center">
                                  <PersonIcon
                                    sx={{ fontSize: "15px", color: "#B1B5D0" }}
                                  />
                                  <h3 className="text-[14px]">Assignee </h3>
                                </div>
                                <div className="flex space-x-2 items-center">
                                  <div>
                                    <AvatarGroup
                                      sx={{
                                        "& .MuiAvatar-root": {
                                          width: 24,
                                          height: 24,
                                          fontSize: 15,
                                        },
                                      }}
                                      variant="rounded"
                                      spacing="medium"
                                      max={3}
                                    >
                                      {taskDetails?.assigneeName?.map(
                                        (obj, index) => {
                                          const sliceName = obj?.name?.slice(
                                            0,
                                            1
                                          );
                                          return (
                                            <Avatar
                                              key={index}
                                              alt={sliceName}
                                              src={obj?.photo?.file_path}
                                            />
                                          );
                                        }
                                      )}
                                    </AvatarGroup>
                                  </div>
                                  <div>
                                    <PopupState
                                      variant="popover"
                                      popupId="demo-popup-popover"
                                    >
                                      {(popupState) => (
                                        <div>
                                          <div
                                            {...bindTrigger(popupState)}
                                            className="w-max cursor-pointer border border-gray-300 rounded-md bg-white flex items-center justify-center"
                                          >
                                            <PersonAddIcon
                                              sx={{
                                                color: "#00A99B",
                                                fontSize: "18px",
                                              }}
                                            />
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
                                                    handleAssigntoChange(e)
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
                            </Grid>
                            <Grid item xs={4}>
                              <div className="flex flex-col">
                                <div
                                  className="flex space-x-2 items-center cursor-pointer"
                                  onClick={handleClick}
                                >
                                  <LocalOfferIcon
                                    sx={{ fontSize: "15px", color: "#B1B5D0" }}
                                  />
                                  <h3 className="text-[14px]">Tags</h3>
                                  <span className="">
                                    {" "}
                                    <div
                                      className="cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        dispatch(tagsOpen());
                                      }}
                                    >
                                      <MoreHorizIcon
                                        sx={{ color: "#02BBAB" }}
                                      />
                                    </div>
                                  </span>
                                </div>
                                <div
                                  onClick={handleClick}
                                  className="cursor-pointer mt-4"
                                >
                                  <Grid container spacing={2}>
                                    {sliceDetailTags?.map((val, index) => {
                                      return (
                                        <>
                                          <Grid item xs={6}>
                                            <div className="relative">
                                              <div
                                                key={index}
                                                className="rounded-md h-auto flex items-center justify-center"
                                                style={{
                                                  background: val?.color,
                                                }}
                                              >
                                                {val?.name}
                                              </div>
                                            </div>
                                          </Grid>
                                        </>
                                      );
                                    })}
                                  </Grid>
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={4}>
                              <div
                                className="flex flex-col cursor-pointer"
                                onClick={handleClick2}
                              >
                                <div className="flex space-x-2 items-center">
                                  <FormatListBulletedIcon
                                    sx={{ fontSize: "15px", color: "#B1B5D0" }}
                                  />
                                  <h3 className="text-[14px]">List </h3>
                                </div>
                                <div>
                                  <h3 className="text-[14px] text-[#B1B5D0] font-[500]">
                                    {milestoneName?.label}
                                  </h3>
                                </div>
                              </div>
                            </Grid>
                          </Grid>
                        </Box>
                      </div>
                    </div>
                  ) : (
                    <div className="relative mt-10 ">
                      {/* logggsss */}
                      {/* <div className="max-h-[100px] overflow-auto">
                        {data?.pages?.map((page, pageIndex) =>
                          page.data?.data?.map((card, innerIndex) => (
                            <div key={card.id} item md={6} lg={6} sx={12}>
                              <div>
                                <h1>helloooo</h1>
                              </div>
                            </div>
                          ))
                        )}
                      </div> */}

                      {/* <Box className="flex justify-center items-center">
                        <h4 ref={ref} className="text-[15px]  font-600">
                          {isFetchingNextPage
                            ? "Loading More"
                            : hasNextPage
                            ? "Load More"
                            : "Nothing More to Load"}
                        </h4>
                      </Box> */}

                      <div className="flex justify-between items-center px-5">
                        <div className="flex space-x-2 items-center">
                          <TextsmsIcon
                            sx={{ fontSize: "15px", color: "#B1B5D0" }}
                          />
                          <h1 className="text-[13px]">
                            {" "}
                            {`${taskDetails?.comments?.length}  Comments `}{" "}
                          </h1>
                        </div>
                      </div>

                      <div className="mt-1">
                        <Divider sx={{ marginRight: "1rem" }}>
                          <h3 className="text-[13px]">Today</h3>
                        </Divider>
                      </div>
                      {taskDetails?.comments?.length > 0 && (
                        <div className="pb-11 px-5 mt-5 ">
                          <div className="mt-1">
                            {taskDetails?.comments?.map((val, index) => {
                              return (
                                <div
                                  key={index}
                                  className="flex space-x-5 pt-4"
                                >
                                  <div>
                                    <img
                                      src={auth?.user?.photo?.file_path}
                                      className="w-[30px] h-[30px] rounded-full"
                                    />
                                  </div>

                                  <div className="border border-gray-200 rounded-md px-2 shadow-sm w-full">
                                    <div className="pt-1">
                                      <h3 className="text-[15px] font-semibold">
                                        {auth?.user?.name}
                                      </h3>
                                      <h3 className="pt-[4px] pb-1 text-[13px]">
                                        {val?.comment}
                                      </h3>
                                    </div>

                                    <div className="pt-1">
                                      {val?.attachments?.length > 0 && (
                                        <div className="flex flex-wrap">
                                          {val?.attachments?.map(
                                            (elem, index) => {
                                              return (
                                                <div
                                                  key={index}
                                                  className="mb-5 p-[2px]"
                                                >
                                                  <img
                                                    className="w-[140px]  rounded-md h-[100px]"
                                                    src={elem?.file_path}
                                                    alt={elem?.file_name}
                                                  />
                                                </div>
                                              );
                                            }
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div className="flex pb-3 flex-wrap mx-5">
                        {base64Files?.map((base64, index) => (
                          <div key={index}>
                            <img
                              src={`data:image/jpeg;base64,${base64}`}
                              alt={`File ${index + 1}`}
                              className="w-[220px]  pr-5 h-[100px] rounded-md"
                            />
                            <button
                              onClick={() => handleDeleteFile(index)}
                              className="cursor-pointer my-3 text-red-500"
                            >
                              <DeleteIcon sx={{ fontSize: "21px" }} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="sticky bottom-0 w-full z-50 px-2">
                        <form onSubmit={handleSubmit(onSubmitMessages)}>
                          <div className="flex space-x-2 items-center mr-3">
                            <label>
                              <input
                                type="file"
                                multiple
                                onChange={handleFileUpload}
                                className="hidden"
                              />
                              <div className="absolute left-5 bottom-2">
                                <AddIcon sx={{ color: "#02BBAB" }} />
                              </div>
                            </label>

                            <Controller
                              control={control}
                              name="comment"
                              render={({
                                field: { onChange, onBlur, value, name, ref },
                              }) => (
                                <div className="w-full">
                                  <input
                                    onChange={onChange}
                                    value={value}
                                    className="bg-white outline:none w-full outline-none border border-gray-200 pl-8 pr-[105px] h-[40px] rounded-md "
                                  />
                                </div>
                              )}
                            />
                            <div className="absolute items-center right-8 flex space-x-2">
                              <div className="cursor-pointer">
                                <EmojiEmotionsIcon
                                  sx={{ fontSize: "18px", color: "#9198CD" }}
                                />
                              </div>

                              <div>
                                <button
                                  type="submit"
                                  className="inline-flex w-[30px] mt-1 h-[30px] justify-center p-1 text-white bg-[#02bbab] rounded-md"
                                >
                                  {messageLoading ? (
                                    <CircularProgress size={20} />
                                  ) : (
                                    <NearMeIcon />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </Grid>
              </Grid>
            </Box>
          </div>
          {/*  */}

          <div>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              sx={{ marginTop: "2px" }}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              {createTags ? (
                <div>
                  <MenuItem
                    sx={{
                      width: "240px",
                      height: "340px",
                      overflow: "auto",
                      background: "white",
                      paddingLeft: "8px",
                      paddingRight: "8px",
                    }}
                  >
                    <div>
                      <div className="flex justify-between">
                        <div>Create Tag</div>
                        <div
                          onClick={handleTagsHide}
                          className="cursor-pointer"
                        >
                          <CloseIcon sx={{ fontSize: "16px" }} />
                        </div>
                      </div>
                      <form>
                        <div onSubmit={handleSubmit(onSubmit)}>
                          <HookTextField
                            name="name"
                            control={control}
                            errors={errors}
                          />
                        </div>
                      </form>

                      <Box>
                        <Grid container spacing={1}>
                          {tagsColors?.map((val, index) => {
                            return (
                              <Grid item xs={3}>
                                <div
                                  key={index}
                                  onClick={() => setColorState(val.color)}
                                  className="h-[30px] w-[47px] rounded flex items-center justify-center"
                                  style={{ background: val.color }}
                                >
                                  {val.color === colorState && (
                                    <CheckIcon
                                      sx={{
                                        fontSize: "15px",
                                        color: val?.tickColor,
                                      }}
                                    />
                                  )}
                                </div>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Box>
                      <div className="mt-2 border-[#eee] border-b"></div>

                      <div className="flex space-x-1 mt-3">
                        <button
                          onClick={handleTagsHide}
                          className="flex justify-center items-center h-[30px] w-[80px] text-black text-[13px] rounded bg-white border border-gray-200"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSubmit(onSubmit)}
                          type="submit"
                          disabled={isEmpty(tagName)}
                          className="flex justify-center items-center h-[30px] text-[13px] w-[80px] text-white rounded bg-[#00A99B]"
                        >
                          {tagLoading ? (
                            <div
                              className="w-[20px] h-[20px] rounded-full animate-spin absolute
                                  border border-solid border-white border-t-transparent"
                            ></div>
                          ) : (
                            "Create"
                          )}
                        </button>
                      </div>
                    </div>
                  </MenuItem>
                </div>
              ) : (
                <MenuItem
                  sx={{
                    width: "240px",
                    height: "",
                    overflow: "auto",
                    background: "white",
                    padding: "9px",
                  }}
                >
                  <div className="flex flex-col">
                    <div className="h-[300px] overflow-auto px-2">
                      <div className="">Tags</div>
                      <div className="">
                        <HookTextField
                          name="search"
                          control={control}
                          errors={errors}
                        />
                      </div>
                      <div>
                        {periorityTag?.map((val, index) => {
                          return (
                            <div
                              key={index}
                              onClick={() => {
                                setTagId(val?.id);
                                updateTags(val?.id);
                              }}
                              className={`w-full h-[30px] text-white rounded flex items-center font-[500] justify-center mb-1`}
                              style={{
                                background: val.color,
                                color: val?.textColor,
                                fontSize: "0.8rem",
                              }}
                            >
                              <h1 className="">
                                {val.name} &nbsp;{" "}
                                {val?.id === tagId && (
                                  <CheckIcon sx={{ fontSize: "18px" }} />
                                )}{" "}
                              </h1>
                            </div>
                          );
                        })}
                      </div>
                      {/* custom tags */}

                      <h3 className="py-2">Custom Tags</h3>
                      <div>
                        {customTags?.map((val, index) => {
                          return (
                            <div className="flex space-x-2 items-center">
                              <div
                                key={index}
                                onClick={() => {
                                  setTagId(val.id);
                                  updateTags(val?.id);
                                }}
                                className={`w-[85%] h-[30px] text-white rounded flex items-center font-[500] justify-center mb-1`}
                                style={{
                                  background: val?.color,
                                  fontSize: "0.8rem",
                                }}
                              >
                                <h1 className="flex space-x-2 items-center">
                                  {val?.name} &nbsp;
                                  {val?.id === tagId && (
                                    <CheckIcon sx={{ fontSize: "18px" }} />
                                  )}
                                </h1>
                              </div>
                              <div className="w-[2%]">
                                {val?.id === tagId && (
                                  <div
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      tagDelete(val?.id);
                                    }}
                                  >
                                    <DeleteIcon
                                      sx={{
                                        fontSize: "20px",
                                        color: val?.color,
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex space-x-1 items-center mt-4 border border-t-gray-300 rounded">
                      <AddIcon sx={{ fontSize: "18px" }} />
                      <h3
                        className="text-[14px] cursor-pointer"
                        onClick={handleTagsShow}
                      >
                        Create a New Tag
                      </h3>
                    </div>
                  </div>
                </MenuItem>
              )}
            </Menu>
          </div>
        </Box>
      </Drawer>
      <TagsDialog tagsAssignList={taskDetails?.tags} />
    </div>
  );
};

export default TaskDrwayer;

const taskList = [
  {
    name: "Open Tasks",
    score: 2,
  },
  {
    name: "Complete Tasks",
    score: 3,
  },
];

const SubTaskInnerList = ({ taskDetails }) => {
  const {
    control,
    watch,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const watchname = watch("name");
  const watchAttachments = watch("attachment");
  const tagName = watch("nameColor");
  const workspaceId = localStorage.getItem("workspaceId");
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const taskId = useSelector((state) => state?.projectTaskSlice?.taskId);
  const [taskStateChange, setTaskStateChange] = useState(false);
  const [showCompleted, setShowCompleted] = useState(true);
  const [dateShow, setDateShow] = useState(false);
  const [date, setDate] = useState({ dueDate: "", id: "" });
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [createCustomTag, setCreateCustomTag] = useState(false);
  const [colorSubtask, setColorSubtask] = useState("");
  const [createSubtaskTags, setCreateSubtaskTags] = useState(false);
  const [subtaskTagColor, setSubtaskTagColor] = useState();
  const [subtaskTagId, setSubtaskTagId] = useState();
  const [subtaskAssigneeId, setSubtaskAssigneeId] = useState();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const { data: subtaskSingleDetails } = useQuery(
    ["subtask_single_detailss", subtaskAssigneeId],
    () => {
      return axios.get(`/task/sub_task/${subtaskAssigneeId}`);
    },
    {
      enabled: !!subtaskAssigneeId,
      select: (res) => {
        return res?.data?.data;
      },
    }
  );

  const { mutate: addSubtaskInTask } = useMutation({
    mutationKey: ["subtask_added"],
    mutationFn: (data) => axios.post(`/task/add_subtask`, data),
    onSuccess: (data) => {
      if (data.data.success) {
        enqueueSnackbar(data.data.message, { variant: "success" });
        queryClient.invalidateQueries(["task_list_all"]);
        queryClient.invalidateQueries(["task_details_subtask"]);
        setValue("name", "");
      }
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  const completedSubTask = taskDetails?.subTasks?.filter((val) => {
    return val?.isCompleted === true;
  });

  const completeLengthCheck = completedSubTask?.length;
  const incompleteTaskLength = taskDetails?.incompleteSubTasks?.length;
  const percentageTask = (
    (completeLengthCheck / (+incompleteTaskLength + +completeLengthCheck) ||
      0) * 100
  ).toFixed(0);

  const { mutate: subTaskCompleted } = useMutation({
    mutationKey: ["sub_task_completed"],
    mutationFn: (id) => axios.put(`/task/update_completed/${id}`),
    onSuccess: (data) => {
      if (data.data.success) {
        enqueueSnackbar(data.data.message, { variant: "success" });
        queryClient.invalidateQueries(["task_list_all"]);
        queryClient.invalidateQueries(["task_details_subtask"]);
      }
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  const { mutate: deleteSubTask, isLoading: deleteTaskLoading } = useMutation({
    mutationKey: ["subtask_delete"],
    mutationFn: (id) => axios.delete(`/task/${id}`),
    onSuccess: (data) => {
      if (data.data.success) {
        enqueueSnackbar(data.data.message, { variant: "success" });
        queryClient.invalidateQueries(["task_list_all"]);
        queryClient.invalidateQueries(["task_details_subtask"]);
      }
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });
  const { mutate: addTaskAttachments } = useMutation({
    mutationKey: ["task_attachements_added"],
    mutationFn: (data) => axios.post(`/task/add_attachment`, data),
    onSuccess: (data) => {
      if (data.data.success) {
        enqueueSnackbar(data.data.message, { variant: "success" });
        queryClient.invalidateQueries(["task_list_all"]);
        queryClient.invalidateQueries(["task_details_subtask"]);
        setValue("attachment", []);
      }
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  const { mutate: convertTotask, isLoading: convertTaskLoading } = useMutation({
    mutationKey: ["convert_task"],
    mutationFn: (id) => axios.put(`/task/convert_to_task/${id}`),
    onSuccess: (data) => {
      if (data.data.success) {
        enqueueSnackbar(data.data.message, { variant: "success" });
        queryClient.invalidateQueries(["task_list_all"]);
        queryClient.invalidateQueries(["task_details_subtask"]);
      }
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });
  const { mutate: changeDueDate, isLoading: dueDateLoading } = useMutation({
    mutationKey: ["change_date"],
    mutationFn: () =>
      axios.put(`/task/update_due_date/${date?.id}?dueDate=${date?.dueDate}`),
    onSuccess: (data) => {
      if (data.data.success) {
        enqueueSnackbar(data.data.message, { variant: "success" });
        queryClient.invalidateQueries(["task_list_all"]);
        queryClient.invalidateQueries(["task_details_subtask"]);
        setDateShow(false);
        setDate({});
      }
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  const { mutate: addTagsSubtask, isLoading: tagLoadingSubtask } = useMutation({
    mutationKey: ["task_tags_subtask"],
    mutationFn: (data) => axios.post(`/tag/task`, data),
    onSuccess: (data) => {
      if (data.data.success) {
        enqueueSnackbar(data.data.message, { variant: "success" });
        queryClient.invalidateQueries(["task_list_all"]);
        queryClient.invalidateQueries(["task_details_subtask"]);
        queryClient.invalidateQueries(["tags_get_list"]);
        setValue("nameColor", "", {
          shouldDirty: true,
          shouldValidate: true,
        });
        setSubtaskTagColor("");
        setCreateSubtaskTags(false);
      }
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  const subTaskPayload = {
    name: watchname,
    projectId: +projectId,
    taskId: taskId,
  };

  const checkKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      isEmpty(watchname)
        ? enqueueSnackbar("Enter Sub Task", { variant: "error" })
        : addSubtaskInTask(subTaskPayload);
    }
  };

  const handleChange = (id) => {
    subTaskCompleted(id);
  };

  const attachmentPayload = {
    taskId: taskId,
    attachment: watchAttachments,
  };

  const onSubmitSubtaskTags = (data) => {
    const tagPayload = {
      workspace_Id: +workspaceId,
      name: data?.nameColor,
      color: subtaskTagColor,
    };
    addTagsSubtask(tagPayload);
  };

  useEffect(() => {
    if (!isEmpty(watchAttachments)) {
      addTaskAttachments(attachmentPayload);
    }
  }, [watchAttachments]);

  const periorityTag = taskDetails?.tags?.filter((val) => {
    return val?.isCustom === false;
  });

  const customTags = taskDetails?.tags?.filter((val) => {
    return val?.isCustom === true;
  });

  const handleSubtaskTag = () => {
    setCreateSubtaskTags(true);
  };

  const handleSubtaskTagHide = () => {
    setCreateSubtaskTags(false);
  };

  return (
    <div className=" w-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[13px] px-3">Progress</h1>
        </div>
        <div className="flex items-center">
          <div className="flex items-center my-4">
            <h3 className="mr-3 text-[13px]">
              {completeLengthCheck}/{incompleteTaskLength + completeLengthCheck}
            </h3>
            <div>
              <CustomProgressBar completed={percentageTask} />
            </div>
          </div>
        </div>
      </div>
      {taskDetails?.incompleteSubTasks?.length > 0 && (
        <div>
          <div className="pl-[0.9rem]">
            <h1 className="text-[13px]">Sub Task</h1>
          </div>
          {taskDetails?.incompleteSubTasks?.map((val, index) => {
            return (
              <>
                <div
                  className="flex justify-between w-full px-[0.2rem] mt-2"
                  key={index}
                >
                  <div className="flex space-x-1 items-center">
                    <Checkbox
                      icon={<CircleOutlinedIcon sx={{ fontSize: "20px" }} />}
                      checked={false}
                      onChange={() => handleChange(val?.subTaskId)}
                    />
                    <div
                      className="flex flex-col cursor-pointer"
                      onClick={() => {
                        dispatch(subtaskSideShow());
                        setSubtaskAssigneeId(val?.subTaskId);
                      }}
                    >
                      <h3 className="text-[13px]">{val?.subTaskName}</h3>
                    </div>
                  </div>
                  <div className="flex space-x-2 items-center">
                    <PopupState variant="popover" popupId="demo-popup-popover">
                      {(popupState) => (
                        <div>
                          <div className="cursor-pointer w-max px-1 py-[3px] border border-gray-300 rounded-md bg-white flex items-center justify-center">
                            <MoreHorizIcon
                              sx={{ fontSize: "16px" }}
                              {...bindTrigger(popupState)}
                            />
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
                              p={2}
                              sx={{
                                width: "200px",
                                color: "#979DC1",
                                fontSize: "15px",
                              }}
                            >
                              <div
                                className="flex space-x-3 items-center cursor-pointer"
                                onClick={() => setDateShow(!dateShow)}
                              >
                                <div>
                                  <EditCalendarIcon sx={{ fontSize: "16px" }} />
                                </div>
                                <h3 className="text-[13px]">Add a Due Date</h3>
                                {dueDateLoading && (
                                  <div
                                    className="w-[20px] h-[20px] rounded-full animate-spin 
                                  border border-solid border-green-700 border-t-transparent"
                                  ></div>
                                )}
                              </div>
                              {dateShow && (
                                <div className="mt-2">
                                  <input
                                    className=""
                                    value={date?.dueDate}
                                    onChange={(e) => {
                                      setDate({
                                        dueDate: e.target.value,
                                        id: val?.subTaskId,
                                      });
                                      changeDueDate(date);
                                    }}
                                    type="date"
                                  />{" "}
                                </div>
                              )}

                              <div
                                className="flex space-x-3 items-center mt-2 cursor-pointer"
                                onClick={handleClick}
                              >
                                <div>
                                  <SellIcon sx={{ fontSize: "16px" }} />
                                </div>
                                <h3 className="text-[13px]">Add tags</h3>
                              </div>
                              <div
                                className="flex space-x-3 items-center mt-2 cursor-pointer"
                                onClick={() => convertTotask(val?.subTaskId)}
                              >
                                <div>
                                  <CheckIcon sx={{ fontSize: "18px" }} />
                                </div>
                                <h3 className="text-[13px]">Convert to Task</h3>
                                {convertTaskLoading && (
                                  <div
                                    className="w-[20px] h-[20px] rounded-full animate-spin 
                                  border border-solid border-green-700 border-t-transparent"
                                  ></div>
                                )}
                              </div>
                              <div className="flex space-x-3 items-center mt-2">
                                <div>
                                  <SwapHorizIcon sx={{ fontSize: "18px" }} />
                                </div>
                                <h3 className="text-[13px]">Move other task</h3>
                              </div>
                              <div
                                onClick={() => {
                                  deleteSubTask(val?.subTaskId);
                                }}
                                className="flex space-x-3 items-center mt-2 cursor-pointer"
                              >
                                <div className="relative -top-[1px]">
                                  <DeleteOutlineIcon
                                    sx={{ fontSize: "18px", color: "red" }}
                                  />
                                </div>
                                <h3 className="text-[13px]">Delete</h3>
                                <div>
                                  {deleteTaskLoading && (
                                    <div
                                      className="w-[20px] h-[20px] rounded-full animate-spin 
                                  border border-solid border-green-700 border-t-transparent"
                                    ></div>
                                  )}
                                </div>
                              </div>
                            </Box>
                          </Popover>
                        </div>
                      )}
                    </PopupState>
                  </div>
                </div>
                <div className="pl-[14px] flex space-x-2 mt-1 items-center">
                  <h3 className="text-[13px]">
                    {moment(val?.dueDate).format("l")}
                  </h3>
                  <div className="flex w-full pl-[1rem] items-center flex-wrap">
                    {taskDetails?.tags?.map((val, index) => {
                      return (
                        <div className="pl-2 mt-1" key={index}>
                          <h3
                            style={{
                              background: val.color,
                            }}
                            className="px-[12px] py-[3px] rounded flex items-center justify-center text-white text-[12px]"
                          >
                            {val?.name}
                          </h3>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="mt-3 border-[#eee] border-b"></div>
              </>
            );
          })}
        </div>
      )}

      {/* for subtask tags  */}

      <div>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          sx={{ marginTop: "2px" }}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          {createSubtaskTags ? (
            <div>
              <MenuItem
                sx={{
                  width: "240px",
                  height: "340px",
                  overflow: "auto",
                  background: "white",
                  paddingLeft: "8px",
                  paddingRight: "8px",
                }}
              >
                <div>
                  <div className="flex justify-between">
                    <div>Create Tag</div>
                    <div
                      onClick={handleSubtaskTagHide}
                      className="cursor-pointer"
                    >
                      <CloseIcon sx={{ fontSize: "16px" }} />
                    </div>
                  </div>
                  <form onSubmit={handleSubmit(onSubmitSubtaskTags)}>
                    <div>
                      <HookTextField
                        name="nameColor"
                        control={control}
                        errors={errors}
                      />
                    </div>
                  </form>

                  <Box>
                    <Grid container spacing={1}>
                      {tagsColors?.map((val, index) => {
                        return (
                          <Grid item xs={3} key={index}>
                            <div
                              onClick={() => setSubtaskTagColor(val.color)}
                              className="h-[30px] w-[47px] rounded flex items-center justify-center"
                              style={{ background: val.color }}
                            >
                              {val?.color === subtaskTagColor && (
                                <CheckIcon
                                  sx={{
                                    fontSize: "15px",
                                    color: val?.tickColor,
                                  }}
                                />
                              )}
                            </div>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                  <div className="mt-2">
                    <Divider />
                  </div>

                  <div className="flex space-x-1 mt-3">
                    <button
                      onClick={handleSubtaskTagHide}
                      className="flex justify-center items-center h-[30px] w-[80px] text-black text-[13px] rounded bg-white border border-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit(onSubmitSubtaskTags)}
                      type="submit"
                      disabled={isEmpty(tagName)}
                      className="flex justify-center items-center h-[30px] text-[13px] w-[80px] text-white rounded bg-[#00A99B]"
                    >
                      {tagLoadingSubtask ? (
                        <div
                          className="w-[20px] h-[20px] rounded-full animate-spin absolute
                                  border border-solid border-white border-t-transparent"
                        ></div>
                      ) : (
                        "Create"
                      )}
                    </button>
                  </div>
                </div>
              </MenuItem>
            </div>
          ) : (
            <MenuItem
              sx={{
                width: "240px",
                height: "",
                overflow: "auto",
                background: "white",
                padding: "9px",
              }}
            >
              <div className="flex flex-col">
                <div className="h-[300px] overflow-auto px-2">
                  <div className="">Tags</div>
                  <div className="">
                    <HookTextField
                      name="name1"
                      control={control}
                      errors={errors}
                    />
                  </div>
                  <div>
                    {periorityTag?.map((val, index) => {
                      return (
                        <div
                          key={index}
                          onClick={() => {
                            setTagId(val?.id);
                            // updateTags(val?.id);
                          }}
                          className={`w-full h-[30px] text-white rounded flex items-center font-[500] justify-center mb-1`}
                          style={{
                            background: val.color,
                            color: val?.textColor,
                            fontSize: "0.8rem",
                          }}
                        >
                          <h1 className="">
                            {val.name} &nbsp;{" "}
                            {val?.id === subtaskTagId && (
                              <CheckIcon sx={{ fontSize: "18px" }} />
                            )}{" "}
                          </h1>
                        </div>
                      );
                    })}
                  </div>
                  {/* custom tags */}

                  <h3 className="py-2">Custom Tags</h3>
                  <div>
                    {customTags?.map((val, index) => {
                      return (
                        <div className="flex space-x-2 items-center">
                          <div
                            key={index}
                            onClick={() => {
                              setSubtaskTagId(val?.id);
                            }}
                            className={`w-[85%] h-[30px] text-white rounded flex items-center font-[500] justify-center mb-1`}
                            style={{
                              background: val?.color,
                              fontSize: "0.8rem",
                            }}
                          >
                            <h1 className="flex space-x-2 items-center">
                              {val?.name} &nbsp;
                              {val?.id === subtaskTagId && (
                                <CheckIcon sx={{ fontSize: "18px" }} />
                              )}
                            </h1>
                          </div>
                          <div className="w-[2%]">
                            {val?.id === subtaskTagId && (
                              <div
                                onClick={(e) => {
                                  // e.stopPropagation();
                                  // tagDelete(val?.id);
                                }}
                              >
                                <DeleteIcon
                                  sx={{
                                    fontSize: "20px",
                                    color: val?.color,
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex space-x-1 items-center mt-4 border border-t-gray-300 rounded">
                  <AddIcon sx={{ fontSize: "18px" }} />
                  <h3
                    className="text-[14px] cursor-pointer"
                    onClick={handleSubtaskTag}
                  >
                    Create a New Tag
                  </h3>
                </div>
              </div>
            </MenuItem>
          )}
        </Menu>
      </div>

      <form onKeyDown={(e) => checkKeyDown(e)}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value, name, ref } }) => (
            <div className=" relative mt-4 flex justify-between pl-3">
              <div className="cursor-pointer px-[9px] min-w-[115px] mr-3 py-[3px] border border-[#eee] rounded-md flex items-center">
                <span className="relative mr-[5px] -top-[2px]">
                  <AddIcon sx={{ fontSize: "16px" }} />
                </span>
                <p
                  className="text-[12px]"
                  onClick={() => addSubtaskInTask(subTaskPayload)}
                >
                  Add subtask
                </p>
              </div>

              <input
                onChange={onChange}
                value={value}
                placeholder="Add a new Task ..."
                className="outline-none w-full bg-none text-[12px] font-[500] h-[35px] pl-[1rem] border border-[#eee] rounded-md"
              />
            </div>
          )}
        />
      </form>

      {completedSubTask?.length > 0 && (
        <div
          className="mt-2 flex items-center ml-[1rem] cursor-pointer"
          onClick={() => setShowCompleted(!showCompleted)}
        >
          <h2 className="text-[13px]">
            {completeLengthCheck} &nbsp;Completed Task
          </h2>
          <div>
            {showCompleted ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </div>
        </div>
      )}

      {showCompleted && (
        <div className="bg-[#FAFBFD]">
          <Zoom effect="left">
            <div className="mt-3">
              {completedSubTask?.map((val, index) => {
                return (
                  <>
                    <div
                      className="flex justify-between w-full px-[0.5rem]"
                      key={index}
                    >
                      <div className="flex space-x-1 items-center">
                        <Checkbox
                          sx={{ fontSize: "6px" }}
                          checked={false}
                          onChange={() => handleChange(val?.subTaskId)}
                          icon={
                            <CheckCircleIcon
                              sx={{ color: "#01B0A2", fontSize: "20px" }}
                            />
                          }
                        />
                        <h3 className="line-through text-[13px]">
                          {" "}
                          {val?.subTaskName}
                        </h3>
                      </div>
                      <div className="flex space-x-2 items-center">
                        <div className="cursor-pointer">
                          <div>
                            <PopupState
                              variant="popover"
                              popupId="demo-popup-popover"
                            >
                              {(popupState) => (
                                <div>
                                  <div
                                    {...bindTrigger(popupState)}
                                    className="w-max px-1 py-[3px] cursor-pointer border border-gray-300 rounded-md bg-white flex items-center justify-center"
                                  >
                                    <MoreHorizIcon sx={{ fontSize: "17px" }} />
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
                                        width: "150px",
                                        height: "50px",
                                        overflow: "auto",
                                      }}
                                    >
                                      <div
                                        className="flex justify-between  pt-3 cursor-pointer px-2 items-center"
                                        onClick={() => {
                                          deleteSubTask(val?.subTaskId);
                                        }}
                                      >
                                        {deleteTaskLoading ? (
                                          <div
                                            className="w-[20px] flex justify-center items-center h-[20px] rounded-full animate-spin 
                                  border border-solid border-green-700 border-t-transparent"
                                          ></div>
                                        ) : (
                                          <>
                                            <h1 className="text-[14px]">
                                              Delete
                                            </h1>
                                            <DeleteIcon
                                              sx={{
                                                fontSize: "18px",
                                                color: "#f00",
                                              }}
                                            />
                                          </>
                                        )}
                                      </div>
                                    </Box>
                                  </Popover>
                                </div>
                              )}
                            </PopupState>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 border-[#eee] border-b"></div>
                  </>
                );
              })}
            </div>
          </Zoom>
        </div>
      )}

      {/* tags popover */}

      <div className="mt-4 px-1">
        <div className="mt-1 flex flex-wrap">
          <div className="pt-2 p-1">
            <HookSelectFileInput
              name="attachment"
              control={control}
              errors={errors}
              allowMulti
            />
          </div>
          {taskDetails?.attachments?.map((val, index) => {
            return (
              <div className="flex flex-wrap pt-2 p-1" key={index}>
                <img
                  src={val?.file_path}
                  className="h-[90px] w-[90px] rounded-md"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const subTaskList = [
  {
    name: "Subtasks",
  },
  // {
  //   name: "Attachments",
  // },
];

export const tagsColors = [
  {
    color: "#00B0A1",
  },
  {
    color: "#FF9946",
  },
  {
    color: "#D057F0",
  },
  {
    color: "#525252",
    tickColor: "white",
  },
  {
    color: "#F8BC0B",
  },
  {
    color: "#FF644F",
  },
  {
    color: "#7DD0FC",
  },
  {
    color: "#E8E8E8",
    tickColor: "black",
  },
  {
    color: "#0FDCB1",
  },

  {
    color: "#7457FA",
    tickColor: "white",
  },
  {
    color: "#0D2578",
    tickColor: "white",
  },
  {
    color: "#7121CF",
    tickColor: "white",
  },
  {
    color: "#45A9FF",
  },
  {
    color: "#FF5CAB",
  },
  {
    color: "#BF741D",
  },
  {
    color: "#E2ECF5",
    tickColor: "black",
  },
  {
    color: "#FEE3E3",
    tickColor: "black",
  },
  {
    color: "#F3EBD6",
    tickColor: "black",
  },
  {
    color: "#B0B0B0",
    tickColor: "black",
  },
  {
    color: "#FFE330",
    tickColor: "black",
  },
];
