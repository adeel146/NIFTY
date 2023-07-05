import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { closePortfolio } from "redux/reducers/portfolio";
import CloseIcon from "@mui/icons-material/Close";
import HookTextField from "hooks/Common/HookTextField";
import { Divider } from "@mui/material";
import { useForm } from "react-hook-form";
import WhiteButton from "hooks/Common/commonButtons/WhiteButton";
import GreenButton from "hooks/Common/commonButtons/GreenButton";
import HookSelectField from "hooks/Common/HookSelectField";
import { makeStyles } from "@mui/styles";
import { yupResolver } from "@hookform/resolvers/yup";
import { portfolioSchema } from "validations/portfolio";
import {
  useAddPortfolio,
  useAppGetPortfolioMembers,
  usePortfolios,
} from "hooks/Portfolio";
import { useDisplaySuccess } from "hooks/useDisplaySuccess";
import { useDisplayError } from "hooks/useDisplayError";
import { useNavigate } from "react-router-dom";
import { links } from "static/links";
import HookCheckBox from "hooks/Common/HookCheckBox";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddList({ open, handleClose }) {
  const navigate = useNavigate();

  const classes = useStyles();
  const display = useDisplaySuccess();
  const dispatch = useDispatch();
  const id = localStorage.getItem("workspaceId");

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
    // resolver: yupResolver(portfolioSchema),
  });

  const { workspacePortfolios, workspacePortfoliosResponse } = usePortfolios({
    id: id,
  });
  const workspacePortfolioOptions = workspacePortfolios.map((el) => {
    return {
      value: el.id,
      label: el.name,
    };
  });
  const filterOptions = (inputValue = "") => {
    return workspacePortfolioOptions?.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const onSuccess = (data) => {
    if (data.data) {
      reset({ name: "", members: "" });
      dispatch(closePortfolio());
      navigate(`${links.portfolio}/${data?.data?.id}`);
      display(data.message);
    }
  };
  const addPortfolio = useAddPortfolio({ onSuccess });
  const isLoading = addPortfolio.isLoading;
  const error = addPortfolio.error;
  useDisplayError(error);

  const onSubmit = (data) => {
    const payload = {
      workspace_Id: +id,
      name: data.name,
      members: data.members.map((el) => {
        return el.email;
      }),
    };
    addPortfolio.mutate({ data: payload });
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
          <div className="flex justify-between px-[5px] items-center">
            <h1>Create a list</h1>
            <div onClick={handleClose} className="cursor-pointer">
              <CloseIcon />
            </div>
          </div>
        </DialogTitle>
        <Divider />
        <DialogContent className={classes.dialogPaper}>
          <form>
            <div className="w-[450px]">
              <div className="border-gray-500">
                <HookTextField
                  name="name"
                  errors={errors}
                  control={control}
                  labelText="List name"
                  required={false}
                  placeholder="e.g., Development"
                />
              </div>
              <div className="mt-6">
                <HookSelectField
                  name="project"
                  errors={errors}
                  control={control}
                  required={false}
                  filterOptions={filterOptions()}
                  placeholder="Select a project"
                  loadOptions={filterOptions()}
                  isMulti={false}
                  loading={workspacePortfoliosResponse.isLoading}
                />
              </div>
              <div className="mt-6">
                <span className={"block  heading-color text-[15px] "}>
                  Hide From
                </span>
                <HookCheckBox
                  control={control}
                  errors={errors}
                  labelText={
                    <p className="text-[13px] color=[#2f2f2f]">Members</p>
                  }
                  name="members"
                />
                <HookCheckBox
                  control={control}
                  errors={errors}
                  labelText={
                    <p className="text-[13px] color=[#2f2f2f]">Guests</p>
                  }
                  name="guests"
                />
              </div>
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <div className="flex justify-end items-center space-x-4 ml-[20px]">
            <WhiteButton buttonText="Cancel" onClick={handleClose} />
            <GreenButton
              disabled={isLoading}
              loading={isLoading}
              buttonText="Create"
              onClick={handleSubmit(onSubmit)}
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
