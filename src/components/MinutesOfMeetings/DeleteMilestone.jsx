import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import CloseIcon from "@mui/icons-material/Close";
import HookTextField from "hooks/Common/HookTextField";
import { Divider } from "@mui/material";
import { useForm } from "react-hook-form";
import WhiteButton from "hooks/Common/commonButtons/WhiteButton";
import GreenButton from "hooks/Common/commonButtons/GreenButton";
import { makeStyles } from "@mui/styles";
import { useDisplaySuccess } from "hooks/useDisplaySuccess";
import InfoIcon from "@mui/icons-material/Info";
import { useDeletePayment } from "hooks/Finance";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DeleteMilestone({
  open,
  Submit,
  handleClose: Close,
  lodaing,
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    mode: "onChange",
  });

  const handleClose = () => {
    reset({ confirmation: "" });
    Close();
  };

  const confirmation = watch("confirmation");

  const classes = useStyles();

  const onSubmit = (data) => {
    Submit();
  };

  return (
    <div>
      <Dialog
        keepMounted
        maxWidth="md"
        classes={{
          paper: classes.dialogPaper,
        }}
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}>
        <DialogTitle className="bg-[#fafbfd]">
          <div className="flex justify-between  px-[1px] items-center">
            <div className="flex flex-row items-center gap-2">
              <InfoIcon className="text-[#f98d41]" />
              <h1 className="text-[#f98d41] text-[24px] font-Manrope font-bold">
                Delete Milestone?
              </h1>
            </div>
            <div
              onClick={handleClose}
              className="cursor-pointer justify-end border border-[#e8e8e8] bg-[#fff] shadow-[0 3px 5px 0 rgba(0,0,0,.05)] px-[6px] py-[2px] rounded-md hover:bg-[#f98a3f] hover:text-[#fff]">
              <CloseIcon />
            </div>
          </div>
        </DialogTitle>
        <Divider />
        <DialogContent className={classes.dialogPaper}>
          <p className=" mt-6 text-[13px] text-black font-bold mb-3">
            Type{" "}
            <span className="bg-[#f8f9f9] border border-[#d6dadc] rounded-md text-[#e01e5a] text-sm m-5px-0 p-2px-5px font-Manrope font-semibold">
              DELETE
            </span>{" "}
            to Confirm
          </p>

          <div className="border-gray-500">
            <HookTextField
              name="confirmation"
              errors={errors}
              control={control}
              labelText=""
              required={false}
              placeholder="Enter Name..."
            />
          </div>
        </DialogContent>
        <DialogActions className="bg-[#fafbfd] border border-t-[#ececec] pt-6">
          <div className="flex justify-end items-center space-x-3 ml-[20px] py-2 mr-3">
            <WhiteButton
              buttonText={
                <p className="text-[13px] font-Manrope font-semibold">Cancel</p>
              }
              onClick={() => {
                handleClose();
              }}
            />
            <GreenButton
              loading={lodaing}
              disabled={confirmation !== "DELETE"}
              buttonText={
                <p className="text-[13px] font-Manrope font-semibold">
                  Yes, Delete
                </p>
              }
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  dialogPaper: { width: "450px" },
}));
