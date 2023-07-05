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

export default function DeletePayment({ open, selectedPayment, handleClose }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    mode: "onChange",
  });
  const display = useDisplaySuccess();
  const id = location.pathname.split("/").pop();

  const confirmation = watch("confirmation");

  const classes = useStyles();

  const onSuccess = (data) => {
    if (data.data) {
      reset({ confirmation: "" });
      display(data.message);
      handleClose();
    }
  };

  const deletePayment = useDeletePayment({
    id: id,
    selectedFinanceId: selectedPayment,
    onSuccess,
  });

  const onSubmit = (data) => {
    deletePayment.mutate({ data: {} });
  };

  return (
    <div>
      <Dialog
        keepMounted
        maxWidth="sm"
        classes={{
          paper: classes.dialogPaper,
        }}
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <div className="flex justify-between  px-[5px] items-center">
            <div className="flex flex-row items-center gap-3">
              <InfoIcon className="text-[#f98d41]" />
              <h1 className="text-[#f98d41] text-[24px]">Delete Payment?</h1>
            </div>
            <div onClick={handleClose} className="cursor-pointer justify-end">
              <CloseIcon />
            </div>
          </div>
        </DialogTitle>
        <Divider />
        <DialogContent className={classes.dialogPaper}>
          <p className=" mt-6 text-[13px] text-black font-bold">
            Type{" "}
            <span className="bg-[#f8f9f9] border border-[#d6dadc] rounded-md text-[#e01e5a] text-sm m-5px-0 p-2px-5px">
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
        <DialogActions>
          <div className="flex justify-end items-center space-x-4 ml-[20px]">
            <WhiteButton
              buttonText="Cancel"
              onClick={() => {
                handleClose();
              }}
            />
            <GreenButton
              disabled={confirmation !== "DELETE"}
              buttonText={<p className="text-[13px]">Yes, Delete</p>}
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  dialogPaper: {},
}));
