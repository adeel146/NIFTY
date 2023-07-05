import React from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { personalTaskDrawyerClose } from "redux/actions";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { Controller } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { isEmpty } from "lodash";
import Checkbox from "@mui/material/Checkbox";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Divider } from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import Task from "./Task";
const PersonalTaskDrawyer = () => {
  const {
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const personalTask = watch("name");
  const open = useSelector(
    (state) => state?.projectTaskSlice?.personalTaskDrwayerState
  );

  const { enqueueSnackbar } = useSnackbar();
  const workspaceId = localStorage.getItem("workspaceId");

  const queryClient = useQueryClient();

  const { data: personalTaskList } = useQuery(
    ["personal_task_list"],
    () => {
      return axios.get("personaltask/get_personal_tasks");
    },
    {
      select: (res) => {
        return res?.data?.data;
      },
    }
  );

  const { data: workspaceProjects } = useQuery(
    ["workspace_project_listing"],
    () => {
      return axios.get(`workspace/projects/${workspaceId}`);
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

  const { data: usersList } = useQuery({
    queryKey: "workspace/workspace_members",
    queryFn: () => axios.get(`workspace/workspace_members/${workspaceId}`),
    select: (res) => {
      return res?.data?.data.map((val) => {
        return {
          value: val?.user_Id,
          label: val?.name,
          ...val,
        };
      });
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
    refetchOnWindowFocus: false,
  });




  const { mutate: addPersonalTask } = useMutation({
    mutationKey: ["personal_task"],
    mutationFn: (data) => axios.post(`personaltask`, data),
    onSuccess: (data) => {
      if (data.data.success) {
        enqueueSnackbar(data.data.message, { variant: "success" });
        queryClient.invalidateQueries(["personal_task_list"]);
        setValue("name", "");
      }
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  const { mutate: completePersonalTask } = useMutation({
    mutationKey: ["personal_task_complete"],
    mutationFn: (id) => axios.put(`personaltask/update_completed/${id}`),
    onSuccess: (data) => {
      if (data.data.success) {
        enqueueSnackbar(data.data.message, { variant: "success" });
        queryClient.invalidateQueries(["personal_task_list"]);
        setValue("name", "");
      }
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  const personalTaskPayload = {
    name: personalTask,
    description: null,
    dueDate: null,
    startDate: null,
  };

  const checkKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      isEmpty(personalTask)
        ? enqueueSnackbar("Enter Points", { variant: "error" })
        : addPersonalTask(personalTaskPayload);
    }
  };

  return (
    <div>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => dispatch(personalTaskDrawyerClose())}
        sx={{ zIndex: "99999" }}
      >
        <Box sx={{ width: 600 }}>
          <div className="flex justify-between  mt-[1rem] px-[1rem] items-center">
            <h3 className="text-[25px] font-[600]">Add new tasks</h3>
            <div className="flex items-center space-x-3">
              <div className="cursor-pointer w-[35px] h-[35px]  rounded border border-gray-200 flex justify-center items-center">
                <StarBorderIcon
                  CloseIcon
                  sx={{
                    fontSize: "25px",
                    color: "#9296C4",
                    "&:hover": {
                      color: "#02BDAD",
                    },
                  }}
                />
              </div>
              <div
                className="cursor-pointer hover:bg-[#F57D2C] w-[35px] h-[35px]  rounded border border-gray-200 flex justify-center items-center"
                onClick={() => dispatch(personalTaskDrawyerClose())}
              >
                <CloseIcon
                  sx={{
                    fontSize: "25px",
                    color: "#9296C4",
                    "&:hover": {
                      color: "white",
                    },
                  }}
                />
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-[#9298BD] px-4 mt-5 font-[600]">
              Add personal tasks that aren’t visible to anyone else, or project
              tasks that can be assigned to you or your workspace members.
            </h3>
          </div>

          <div className="mt-3">
            {personalTaskList?.map((val, index) => {
              return <Task projects={workspaceProjects} data={val} key={index} />;
            })}
          </div>

          <div>
            <form className="" onKeyDown={(e) => checkKeyDown(e)}>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value, name, ref } }) => (
                  <div className="mt-[0.1px] relative">
                    <span className="absolute top-2 px-6">
                      <AddIcon sx={{ fontSize: "22px", color: "#B1B5D0" }} />
                    </span>
                    <input
                      onChange={onChange}
                      value={value}
                      placeholder="Add a new Task ..."
                      className="outline-none w-full  text-[12px] font-[500] border-gray-200 border-b border-t h-[43px] pl-[3rem]"
                    />
                  </div>
                )}
              />
            </form>
          </div>
        </Box>
      </Drawer>
    </div>
  );
};

export default PersonalTaskDrawyer;
