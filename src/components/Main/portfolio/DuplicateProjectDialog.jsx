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
import { useAddPortfolio, useAppGetPortfolioMembers } from "hooks/Portfolio";
import { useDisplaySuccess } from "hooks/useDisplaySuccess";
import { useDisplayError } from "hooks/useDisplayError";
import { useNavigate } from "react-router-dom";
import { links } from "static/links";
import { duplicateProjectDialogClose } from "redux/actions";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { duplicateProjectSchema } from "validations/projectTask";
import axios from "axios";
import { enqueueSnackbar } from "notistack";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DuplicateProjectDialog({projectId}) {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: { name: "" },
    mode: "onChange",
    resolver: yupResolver(duplicateProjectSchema),
  });
  
  const classes = useStyles();
  const display = useDisplaySuccess();
  const dispatch = useDispatch();
  const id = localStorage.getItem("workspaceId");
  const open = useSelector((state) => state?.projectTaskSlice?.duplicateProjectDialogState);
  const queryClient = useQueryClient();
  const name = watch("name");
  const { mutate: duplicateProject, isLoading: creatingDuplicate } = useMutation(
    {
      mutationFn: (data) => axios.post(`/project/duplicate/${projectId}?name=${name}`, data),
      onSuccess: (data) => {
        if (data?.data?.success) {
          enqueueSnackbar(data?.data?.message, { variant: "success" });
          queryClient?.invalidateQueries(["get_portfolio_project"])
          dispatch(duplicateProjectDialogClose());
          setValue("name", "");
        }
      },
      onError: (data) => {
        enqueueSnackbar(data?.response?.data?.message, { variant: "error" });
      },
    }
  );
  

  const onSubmit = (data) => {
   duplicateProject();
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
        onClose={() => dispatch(duplicateProjectDialogClose())}
        TransitionComponent={Transition}>
        <DialogTitle className="bg-[#fafbfd]">
          <div className="flex justify-between px-[5px] items-center">
            <h1>Duplicate Project</h1>
            <div
              onClick={() => dispatch(duplicateProjectDialogClose())}
              className="cursor-pointer border border-[#e8e8e8] bg-[#fff] shadow-[0 3px 5px 0 rgba(0,0,0,.05)] px-[6px] py-[2px] rounded-md hover:bg-[#f98a3f] hover:text-[#fff]">
              <CloseIcon className="relative -top-[1px]" />
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
                  labelText="Duplicate Project Name"
                  placeholder="Duplicate Project Name..."
                />
              </div>
            </div>
          </form>
        </DialogContent>
        <DialogActions className="bg-[#fafbfd] border border-t-[#ececec]">
          <div className="flex justify-end items-center space-x-4 px-4 py-4">
            <WhiteButton
              buttonText="Cancel"
              onClick={() => dispatch(duplicateProjectDialogClose())}
            />
            <GreenButton
              disabled={creatingDuplicate}
              loading={creatingDuplicate}
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
