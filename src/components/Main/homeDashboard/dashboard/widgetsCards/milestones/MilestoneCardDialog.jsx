import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import {
  QueryClientProvider,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { useSelector } from "react-redux";
import HookTextField from "hooks/Common/HookTextField";
import { Divider } from "@mui/material";
import { useForm } from "react-hook-form";
import WhiteButton from "hooks/Common/commonButtons/WhiteButton";
import GreenButton from "hooks/Common/commonButtons/GreenButton";
import HookSelectField from "hooks/Common/HookSelectField";
import { makeStyles } from "@mui/styles";
import { yupResolver } from "@hookform/resolvers/yup";
import { milestoneSchema } from "validations/portfolio";
import { useDisplaySuccess } from "hooks/useDisplaySuccess";
import axios from "axios";
import CustomLoader from "hooks/Common/CustomLoader";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import { closeMilestoneCardDilalog } from "redux/actions";
import { useDispatch } from "react-redux";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function MilestoneCardDialog() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const open = useSelector(
    (state) => state.projectTaskSlice.milestoneDialogState
  );
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(milestoneSchema),
  });
  const classes = useStyles();

  const { mutate, isLoading } = useMutation({
    mutationKey: ["addMilestone"],
    mutationFn: (data) => axios.post("/milestone", data),
    onSuccess: (data) => {
      enqueueSnackbar(data.data.message, { variant: "success" });
      queryClient.invalidateQueries(["get-milestone"]);
      handleClose();
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  const handleClose = () => {
    dispatch(closeMilestoneCardDilalog());
  };

  let { projectId } = useParams();
  const onSubmit = (data) => {
    const payload = {
      project_Id: projectId,
      ...data,
    };
    mutate(payload);
  };
  return (
    <div>
      <Dialog
        keepMounted
        maxWidth="lg"
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <CustomLoader isLoading={[isLoading].includes(true)} />
        <DialogTitle>
          <div className="flex justify-center items-center">
            Create a milestone
          </div>
        </DialogTitle>
        <Divider />
        <DialogContent className={classes.dialogPaper}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              {/* <div>
                <label>Select a list to create from:</label>
                <HookSelectField
                  name="members"
                  errors={errors}
                  control={control}
                  required={false}
                  filterOptions={filterOptions()}
                  placeholder="Search..."
                  loadOptions={filterOptions()}
                  isMulti={true}
                  loading={portfolioMembersResponse.isLoading}
                />
              </div> */}
              <div className="border-gray-500">
                <HookTextField
                  name="name"
                  errors={errors}
                  control={control}
                  labelText="Milestone name"
                  required={false}
                  placeholder="eg, Development"
                />
              </div>
              <div className="border-gray-500">
                <HookTextField
                  name="description"
                  errors={errors}
                  control={control}
                  labelText="Description"
                  required={false}
                  placeholder="Add a description..."
                  type="textarea"
                />
              </div>
              <div className="flex space-x-2 ">
                <HookTextField
                  name="startDate"
                  errors={errors}
                  control={control}
                  labelText="Starts"
                  type="date"
                />
                <HookTextField
                  name="endDate"
                  errors={errors}
                  control={control}
                  labelText="End"
                  type="date"
                />
              </div>
              <div>
                <label>Add Milestone Dependency (optional):</label>
                <HookSelectField
                  name="dependency"
                  errors={errors}
                  control={control}
                  required={false}
                  placeholder="Search..."
                  isMulti={true}
                />
              </div>
            </div>
            <input type="submit" className="hidden" />
          </form>
        </DialogContent>
        <DialogActions>
          <div className="flex justify-end my-5 items-center space-x-4 ml-[20px]">
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
    width: "600px",
  },
}));
