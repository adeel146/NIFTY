import {
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  DialogTitle,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import HookSelectField from "hooks/Common/HookSelectField";
import HookRadioBox from "hooks/Common/HookRadioBox";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { projectTaskSchema } from "validations/projectTask";
import Slide from "@mui/material/Slide";
import { IconButton } from "@mui/material";
import React from "react";
import HookTextField from "hooks/Common/HookTextField";
import GreenButton from "hooks/Common/commonButtons/GreenButton";
import WhiteButton from "hooks/Common/commonButtons/WhiteButton";
import HookCheckBox from "hooks/Common/HookCheckBox";
import HookDateTimePicker from "hooks/Common/HookDateTimePicker";
import { useAddTask } from "hooks/ProjectTask.jsx";
import { useSelector } from "react-redux";
import { closeProjectTask } from "redux/reducers/projectTask";
import { useDispatch } from "react-redux";
import { useGetWorkSpaceProjects } from "hooks/Workspace";
import CustomLoader from "hooks/Common/CustomLoader";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const AddProjectTask = () => {
  const dispatch = useDispatch();
  const open = useSelector(
    (state) => state?.projectTaskSlice?.projectTaskState
  );
  //   const [openDialog, setCloseDialog] = useState(open);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(projectTaskSchema),
  });

  //   const handleClose = () => {
  //     setCloseDialog(false);
  //     console.log("dialog", openDialog)
  //   };

  const onSuccess = (data) => {
    if (data.data) {
      reset({ name: "", members: "" });
      dispatch(closeProjectTask());
      display(data.message);
    }
  };

  const id = localStorage.getItem("workspaceId");
  const projects = useGetWorkSpaceProjects({ id });

  const task = useAddTask({ onSuccess });
  const { isLoading } = task;

  const onSubmit = (data) => {
    const payload = {
      name: data?.name,
      description: data?.description,
      status_Id: data?.status_Id,
      project_Id: data?.project_Id,
      dueDate: data?.dueDate,
      addOnTop: true,
      assignees: [],
    };
    task.mutate({ data: payload });
  };

  return (
    <div className=" m-auto flex h-full justify-center items-center flex-col">
      <Dialog
        maxWidth="sm"
        fullWidth
        open={open}
        onClose={() => dispatch(closeProjectTask())}
        TransitionComponent={Transition}>
        {/* <CustomLoader isLoading={[addLoading].includes(true)} /> */}
        <div className="flex justify-between px-[15px] items-center bg-[#fafbfd] w-full cursor-pointer">
          <div>
            <DialogTitle
              id="responsive-dialog-title"
              className="font-Manrope font-extrabold text-black text-2xl">
              Add a Task
            </DialogTitle>
          </div>
          <div>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => dispatch(closeProjectTask())}
              aria-label="close">
              <CloseIcon
                sx={{
                  width: "40px",
                  height: "40px",
                  fill: "gray",
                  fontSize: "18px",
                  padding: "3px 3px",
                }}
                className="border bg-white hover:bg-[#f98a3f] hover:fill-white rounded-md cursor-pointer"
              />
            </IconButton>
          </div>
        </div>
        <DialogContent dividers>
          <div className="px-[15px]">
            <Grid container spacing={1}>
              <Grid item xs={12} lg={12} md={12}>
                <HookTextField
                  control={control}
                  name="name"
                  fullWidth
                  errors={errors}
                  labelText="Task Name"
                  placeholder="Give it a name..."
                />
              </Grid>
              <Grid item xs={12} lg={12} md={12}>
                <HookTextField
                  control={control}
                  name="description"
                  fullWidth
                  errors={errors}
                  labelText="Task Description"
                  placeholder="Add a description..."
                />
              </Grid>

              <Grid item md={6} xs={6}>
                <HookSelectField
                  control={control}
                  errors={errors}
                  //label="PRIORITY"
                  name="project_Id"
                  fullWidth
                  placeholder="Select a project"
                  //options={priorities}
                />
              </Grid>
              <Grid item md={6} xs={6}>
                <HookSelectField
                  control={control}
                  errors={errors}
                  //label="PRIORITY"
                  name="project_Status"
                  fullWidth
                  placeholder="Select a status"
                  //options={priorities}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <HookDateTimePicker
                  control={control}
                  errors={errors}
                  labelText="Due Date"
                  name="dueDate"
                  //   fullWidth
                  //   size="small"
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <HookCheckBox
                  control={control}
                  errors={errors}
                  labelText="Add at the top of the list"
                  name="addOnTop"
                />
              </Grid>
            </Grid>
          </div>
        </DialogContent>

        <DialogActions className="border-t bg-[#fafbfd] cursor-pointer">
          <div className="flex justify-end items-center mt-4 space-x-3 mb-3 mr-5">
            <WhiteButton
              className="!text-[#2f2f2f]"
              buttonText="Cancel"
              onClick={() => dispatch(closeProjectTask())}
            />
            <GreenButton
              disabled={isLoading}
              loading={isLoading}
              buttonText="Add a Task"
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddProjectTask;
