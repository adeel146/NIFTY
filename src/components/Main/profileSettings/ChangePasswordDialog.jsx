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
import { closeProfile } from "redux/reducers/profile";
import { useDispatch } from "react-redux";
import { useGetWorkSpaceProjects } from "hooks/Workspace";
import { useUpdatePassword } from "hooks/ProfileSetup";
import { profileSetupSchema } from "validations/profileSetup";
import { profileSetup } from "validations/profileSetup";
import { useDisplaySuccess } from "hooks/useDisplaySuccess";
import CustomLoader from "hooks/Common/CustomLoader";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const ChangePasswordDialog = () => {
  const dispatch = useDispatch();
  const display = useDisplaySuccess();
  const open = useSelector((state) => state?.profile?.profileState);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(profileSetup),
  });

  //   const handleClose = () => {
  //     setCloseDialog(false);
  //     console.log("dialog", openDialog)
  //   };

  console.log(errors, "erriririir");
  const onSuccess = (data) => {
    if (data.data) {
      display(data.message);
    }
  };

  const updatePassword = useUpdatePassword({ onSuccess });
  const { isLoading } = updatePassword;

  const onSubmit = (data) => {
    console.log(data, "dataaa");

    const payload = {
      old_password: data?.old_password,
      password: data?.password,
    };
    updatePassword.mutate({ data: payload });
  };

  return (
    <div className=" m-auto flex h-full justify-center items-center flex-col">
      <Dialog
        maxWidth="sm"
        fullWidth
        open={open}
        onClose={() => dispatch(closeProfile())}
        TransitionComponent={Transition}>
        <CustomLoader isLoading={[isLoading].includes(true)} />
        <div className="flex justify-between px-[5px] items-center bg-[#fafbfd]">
          <div>
            <DialogTitle
              id="responsive-dialog-title"
              className="font-bold text-[24px] font-Manrope">
              Change Password
            </DialogTitle>
          </div>
          <div>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => dispatch(closeProfile())}
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
          <form>
            <div className="text-[18px] font-Manrope font-bold">
              <h6 className="mb-3">
                Just enter your current password and your new password
              </h6>
              <Grid container spacing={0}>
                <Grid item xs={12} lg={12} md={12}>
                  <HookTextField
                    control={control}
                    name="old_password"
                    type="password"
                    fullWidth
                    errors={errors}
                    labelText={
                      <p className="text-[15px] font-Manrope font-bold ">
                        Enter current password
                      </p>
                    }
                  />
                </Grid>
                <Grid item xs={12} lg={12} md={12}>
                  <HookTextField
                    control={control}
                    name="password"
                    type="password"
                    fullWidth
                    errors={errors}
                    labelText={
                      <p className="text-[15px] font-Manrope font-bold ">
                        Enter New password
                      </p>
                    }
                    placeholder="Min 8 characters and one symbol"
                  />
                </Grid>

                <Grid item xs={12} lg={12} md={12}>
                  <HookTextField
                    control={control}
                    name="new_password"
                    type="password"
                    fullWidth
                    errors={errors}
                    labelText={
                      <p className="text-[15px] font-Manrope font-bold">
                        Confirm new password
                      </p>
                    }
                  />
                </Grid>
              </Grid>
            </div>
          </form>
        </DialogContent>

        <DialogActions className="bg-[#fafbfd] border border-t-[#ececec]">
          <div className="flex justify-end items-center space-x-4 px-4 py-2">
            <WhiteButton
              className="!text-[#2f2f2f]"
              buttonText="Cancel"
              onClick={() => dispatch(closeProfile())}
            />
            <GreenButton buttonText="Update" onClick={handleSubmit(onSubmit)} />
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ChangePasswordDialog;
