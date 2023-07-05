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
import {
  Checkbox,
  Divider,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useForm } from "react-hook-form";
import WhiteButton from "hooks/Common/commonButtons/WhiteButton";
import GreenButton from "hooks/Common/commonButtons/GreenButton";
import HookSelectField from "hooks/Common/HookSelectField";
import { makeStyles } from "@mui/styles";
import { yupResolver } from "@hookform/resolvers/yup";
import { portfolioSchema } from "validations/portfolio";
import {
  useAddPortfolio,
  useAppGetPortfolioById,
  useAppGetPortfolioMembers,
  useArchiveProject,
  useDeletePortfolio,
  usePortfolios,
  useUpdatePortfolio,
} from "hooks/Portfolio";
import { useDisplaySuccess } from "hooks/useDisplaySuccess";
import { useDisplayError } from "hooks/useDisplayError";
import { useNavigate } from "react-router-dom";
import { links } from "static/links";
import InfoIcon from "@mui/icons-material/Info";
import HookCheckBox from "hooks/Common/HookCheckBox";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ArchiveProject({
  activeProjectId,
  activeProject = [],
  open,
  handleClose,
}) {
  const navigate = useNavigate();
  const [isDeleteAll, setIsDeleteAll] = React.useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setError,
  } = useForm({
    mode: "onChange",
  });
  const display = useDisplaySuccess();

  const dispatch = useDispatch();

  const confirmation = watch("confirmation");

  const classes = useStyles();
  const id = localStorage.getItem("workspaceId");

  const onSuccess = (data) => {
    if (data.data) {
      reset({ name: "", members: "" });
      display(data.message);
      navigate(`${links.portfolio}/${id}`);
      dispatch(closePortfolio());
      handleClose();
    }
  };

  const archiveProject = useArchiveProject({
    activeProjectId: activeProjectId,
    onSuccess,
  });

  const onSubmit = (data) => {
    if (confirmation !== "ARCHIVE") {
      return;
    }
    archiveProject.mutate({ data: {} });
  };

  const handleChange = (ev) => {
    const val = ev.target.checked;
    setIsDeleteAll(val);
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
              <h1 className="text-[#f98d41] text-[24px]">
                Archive{" "}
                {activeProject.length
                  ? `"${activeProject[0].name}"`
                  : "General"}{" "}
                project?
              </h1>
            </div>
            <div onClick={handleClose} className="cursor-pointer justify-end">
              <CloseIcon />
            </div>
          </div>
        </DialogTitle>
        <Divider />
        <DialogContent className={classes.dialogPaper}>
          <p className="text-[15px]">
            Before you delete this Portfolio, here's what you should know:
          </p>
          <List>
            <ListItem className="flex justify-start items-start">
              <FiberManualRecordIcon
                sx={{ fontSize: 15, marginTop: "7px", marginRight: "10px" }}
              />
              <ListItemText
                primary={
                  <p className="text-[15px]">
                    All activity, messages and data will be saved, but you won't
                    be able to post anything.
                  </p>
                }
              />
            </ListItem>
            <ListItem className="flex justify-start items-start">
              <FiberManualRecordIcon
                sx={{ fontSize: 15, marginTop: "7px", marginRight: "10px" }}
              />
              <ListItemText
                className="text-[15px]"
                primary={
                  <p className="text-[15px]">
                    You will be able to view the project from the Dashboard by
                    clicking on "Archived Projects" from the dropdown.
                  </p>
                }
              />
            </ListItem>
            <ListItem className="flex justify-start items-start">
              <FiberManualRecordIcon
                sx={{ fontSize: 15, marginTop: "7px", marginRight: "10px" }}
              />
              <ListItemText
                className="text-[15px]"
                primary={
                  <p className="text-[15px]">
                    All workspace members and non-members will see the project
                    under archived but will not be able to access or view the
                    data.{" "}
                  </p>
                }
              />
            </ListItem>
          </List>

          <p className=" mt-6 text-[13px] text-black font-bold">
            Type{" "}
            <span className="bg-[#f8f9f9] border border-[#d6dadc] rounded-md text-[#e01e5a] text-sm m-5px-0 p-2px-5px">
              ARCHIVE
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
            <WhiteButton buttonText="Cancel" onClick={handleClose} />
            <GreenButton
              disabled={confirmation !== "ARCHIVE"}
              buttonText={<p className="text-[13px]">Yes, archive project</p>}
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
