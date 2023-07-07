import * as React from "react";
import Button from "@mui/material/Button";
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
import { yupResolver } from "@hookform/resolvers/yup";
// import { portfolioSchema } from "validations/portfolio";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ProfileEmailChangeDialog({
  profileOpen,
  setProfileOpen,
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(""),
  });

  const classes = useStyles();

  const profileDialogClose = () => {
    setProfileOpen(false);
  };

  //   const loadOptions = (inputValue, callback) => {
  //     setTimeout(() => {
  //       callback(filterColors(inputValue));
  //     }, 1000);
  //   };
  // ;

  return (
    <div>
      <Dialog
        keepMounted
        maxWidth="sm"
        classes={{
          paper: classes.dialogPaper,
        }}
        open={profileOpen}
        onClose={profileDialogClose}
        TransitionComponent={Transition}
      >
        <DialogTitle className="bg-[#fafbfd] w-full">
          <div className="flex justify-between items-center ">
            <h1 className="font-bold text-[#373737] text-[20px] font-Manrope">
              Change Email
            </h1>
            <div
              onClick={profileDialogClose}
              className="cursor-pointer border border-[#e8e8e8] bg-[#fff] shadow-[0 3px 5px 0 rgba(0,0,0,.05)] px-[6px] py-[2px] rounded-md hover:bg-[#f98a3f] hover:text-[#fff]"
            >
              <CloseIcon className="relative -top-[1px]" />
            </div>
          </div>
        </DialogTitle>
        <Divider />
        <DialogContent className={classes.dialogPaper}>
          <form>
            <div className="w-[450px]">
              <h3 className="font-Manrope text-[14px] my-1 text-[#2f2f2f]">
                Just enter your new email and your current password and <br />
                you’ll be all set.
              </h3>
              <div
                className="border-gray-500 mt-[1rem] mb-1
              "
              >
                <HookTextField
                  name="name"
                  errors={errors}
                  control={control}
                  labelText={
                    <h6 className="text-[14px] font-Manrope font-semibold">
                      Enter New Email
                    </h6>
                  }
                  required={false}
                  placeholder="Enter new email"
                />
              </div>
              <div className="border-gray-500  my-[1rem]">
                <HookTextField
                  name="name"
                  errors={errors}
                  control={control}
                  labelText={
                    <h6 className="text-[14px] font-Manrope font-semibold">
                      Enter Current Password
                    </h6>
                  }
                  required={false}
                  placeholder="Enter current password"
                />
              </div>
            </div>
          </form>
        </DialogContent>
        <DialogActions className="bg-[#fafbfd] border border-t-[#ececec]">
          <div className="flex justify-end items-center space-x-4 px-4 py-4">
            <WhiteButton buttonText="Cancel" onClick={profileDialogClose} />
            <GreenButton
              buttonText="Update"
              // disabled={true}
              //   loading={true}
              //   onClick={handleSubmit(onSubmit)}
            />
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    overflowY: "unset !important",
  },
}));
