import React, { useState } from "react";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ShortcutIcon from "@mui/icons-material/Shortcut";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Box, Checkbox, Divider, Popover } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import DoneIcon from "@mui/icons-material/Done";
import { useDispatch } from "react-redux";
import { taskDrawyerOpen } from "redux/actions";
import TaskDrwayer from "./TaskDrwayer";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Controller } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { isEmpty } from "lodash";
import HookSelectField from "hooks/Common/HookSelectField";
import Grid from "@mui/material/Grid";

const TaskCardView = ({ setAssignWidth, assignCheck, setAssignCheck }) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const statusId = watch("get_status");
  const dispatch = useDispatch();
  let { projectId } = useParams();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const watchname = watch("name");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [taskListId, setTaskListId] = useState();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const { data: assignList } = useQuery(
    ["assign_user_list", projectId],
    () => {
      return axios.get(`/status/${projectId}`);
    },
    {
      select: (res) => {
        return res?.data?.data.map((val) => {
          return {
            value: val?.id,
            label: val?.name,
          };
        });
      },
    }
  );

  const { data: allTaskList } = useQuery(
    ["task_list_all", projectId],
    () => {
      return axios.get(
        `/task/get_tasks/${projectId}?statusId=${statusId?.value}`
      );
    },
    {
      select: (res) => {
        return res?.data?.data;
      },
      enabled: !!statusId?.value,
      refetchOnWindowFocus: false,
    }
  );

  const { mutate: addTaskList } = useMutation({
    mutationKey: ["task_add", projectId],
    mutationFn: (data) => axios.post(`/task/basic`, data),
    onSuccess: (data) => {
      if (data.data.success) {
        enqueueSnackbar(data.data.message, { variant: "success" });
        queryClient.invalidateQueries(["task_list_all"]);
        setValue("name", "");
      }
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  const { mutate: taskCompleted } = useMutation({
    mutationKey: ["task_completed"],
    mutationFn: (id) => axios.put(`/task/update_completed/${id}`),
    onSuccess: (data) => {
      if (data.data.success) {
        enqueueSnackbar(data.data.message, { variant: "success" });
        queryClient.invalidateQueries(["task_list_all"]);
        // queryClient.invalidateQueries(["task_details_subtask"]);
      }
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  const payload = {
    name: watchname,
    statusId: null,
    projectId: projectId,
  };

  const checkKeyDown = (e) => {
    if (e.key === "Enter") {
      isEmpty(watchname)
        ? enqueueSnackbar("Enter Task", { variant: "error" })
        : addTaskList(payload);
    }
  };

  const handleChange = (e, id) => {
    e.stopPropagation();
    taskCompleted(id);
  };
  const onSubmit = () => {};

  function MinWidth() {
    setAssignWidth(4);
    setAssignCheck(true);
  }
  function MaxWidth() {
    setAssignWidth(8);
    setAssignCheck(false);
  }

  function changeWidth() {
    if (assignCheck) {
      MaxWidth();
    } else {
      MinWidth();
    }
  }

  return (
    <div className="">
      <div className="flex justify-between border border-t-4 border-t-[#ff6650] bg-white rounded-lg rounded-b-none border-b-0 p-3">
        <div className="flex  items-center space-x-[2px]">
          <span className="mr-2">
            <DoneIcon sx={{ color: "#9798C4", fontSize: "18px" }} />
          </span>
          <h3 className="text-[15px] flex font-semibold text-[#2f2f2f]">
            Tasks 121
          </h3>
          <span className="ml-2">
            <KeyboardArrowRightIcon
              sx={{ fontSize: "25px", color: "#9798C4" }}
            />
          </span>
        </div>

        <div className="flex space-x-2 items-center">
          <button
            className="btn btn-transparent font-medium text-sm text-[#009084]"
            onClick={handleClick}
          >
            Assign to Me
            <ExpandMoreIcon sx={{ fontSize: "18px" }} />
          </button>
          <div
            onClick={changeWidth}
            className="cursor-pointer bg-[#f7f9fd] px-[2px] text-[#8e94bb] border border-[#f0f3fb] rounded"
          >
            <OpenInFullIcon sx={{ fontSize: "18px" }} />
          </div>
        </div>
      </div>
      <div className="relative h-[100%] cursor-pointer">
        <div className=" font-sans h-[400px] overflow-auto bg-white border border-gray-200 rounded-lg rounded-t-none">
          {allTaskList?.map((val) => {
            const sliceTags = val?.tags?.slice(0, 4);
            return (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(taskDrawyerOpen(val.id));
                }}
                key={val?.id}
              >
                <div
                  className="flex justify-between h-[100px] overflow-auto items-center px-4 py-2"
                  onClick={() => setTaskListId(val?.id)}
                >
                  <div className="flex space-x-0 items-center">
                    <Checkbox
                      checked={false}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleChange(e, val?.id)}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                    <h3>{val?.name} </h3>
                  </div>
                  <div className="flex space-x-1 items-center">
                    <div className="">
                      <img
                        className="w-[25px] h-[25px] rounded-md"
                        src="https://media.istockphoto.com/id/517188688/photo/mountain-landscape.jpg?s=612x612&w=0&k=20&c=A63koPKaCyIwQWOTFBRWXj_PwCrR4cEoOw2S9Q7yVl8="
                      />
                    </div>
                    <div className="w-[25px] h-[25px] border border-gray-300 rounded-md bg-white flex items-center justify-center">
                      <Tooltip title="Add assignee" arrow>
                        <PersonAddIcon
                          sx={{ color: "#00A99B", fontSize: "18px" }}
                        />
                      </Tooltip>
                    </div>
                  </div>
                </div>
                <div className=" px-[16px]">
                  <Grid container spacing={2}>
                    {sliceTags?.map((tagVal) => {
                      return (
                        <Grid item xs={3} sx={{ marginRight: "0px" }}>
                          <div
                            className="text-white rounded items-center flex justify-center"
                            style={{ background: tagVal.color }}
                          >
                            {tagVal?.name}
                          </div>
                        </Grid>
                      );
                    })}
                  </Grid>
                </div>
                <div className="mt-2">
                  <Divider />
                </div>
              </div>
            );
          })}
        </div>

        <div className="absolute bottom-0 w-[98.4%] h-[40px] mr-2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={(e) => checkKeyDown(e)}
          >
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <input
                  onChange={onChange}
                  value={value}
                  className="outline-none h-[40px] rounded-md border border-gray-200 w-full pl-2"
                  placeholder="Enter ..."
                />
              )}
            />
          </form>
        </div>
      </div>
      <TaskDrwayer taskListId={taskListId} queryKeySet="" />

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        // sx={{marginRight:100}}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box sx={{ width: "200px", height: "200px", overflow: "auto" }}>
          <div className="mt-2 px-2">
            <HookSelectField
              name="get_status"
              errors={errors}
              control={control}
              loadOptions={assignList}
              placeholder="Search..."
              // isMulti={true}
            />
          </div>
        </Box>
      </Popover>
    </div>
  );
};

export default TaskCardView;
