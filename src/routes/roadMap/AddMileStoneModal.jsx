import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { Popover } from "@mui/material";
import {
  QueryClientProvider,
  useMutation,
  useQuery,
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
import { tagsColors } from "components/Main/homeDashboard/dashboard/widgetsCards/taskwidget/TaskDrwayer";
import { Menu } from "@mui/icons-material";
import { Grid } from "@syncfusion/ej2-grids";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import CheckIcon from "@mui/icons-material/Check";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddMileStoneDialog(props) {
  const { isOpen, handleClose, queryKeySet } = props;
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    register,
  } = useForm({
    mode: "onChange",
    defaultValues: { color: "#00B0A1" },
    resolver: yupResolver(milestoneSchema),
  });
  const classes = useStyles();
  const { projectId } = useParams();

  const workspaceId = localStorage.getItem("workspaceId");

  const { mutate, isLoading } = useMutation({
    mutationKey: ["addMilestone"],
    mutationFn: (data) => axios.post("/milestone", data),
    onSuccess: (data) => {
      console.log(data, "success");
      enqueueSnackbar(data.data.message, { variant: "success" });
      queryClient.invalidateQueries(["get-milestone"]);
      reset();
      queryClient.invalidateQueries([queryKeySet]);
      handleClose();
      reset();
    },
    onError: (data) => {
      console.log(data, "error");
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  const { data: usersList } = useQuery({
    queryKey: "workspace/workspace_members",
    queryFn: () => axios.get(`workspace/workspace_members/${workspaceId}`),
    select: (res) => {
      return res?.data?.data.map((val) => {
        return {
          value: val?.user_Id,
          label: val?.name,
        };
      });
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
    refetchOnWindowFocus: false,
  });

  const { data: milestoneDependency } = useQuery(
    ["dropdown_dependency", projectId],
    () => {
      return axios.get(`/milestone/listing/${projectId}`);
    },
    {
      enabled: !!projectId,
      select: (res) => {
        return res.data.data.map((val) => {
          return {
            label: val?.name,
            value: val?.id,
          };
        });
      },
    }
  );

  const onSubmit = (data) => {
    const manager_Id = data.manager_Id.value;
    data.parent_Id = data?.parent_Id?.value || null;
    const payload = {
      project_Id: projectId,
      ...data,
      manager_Id,
    };
    mutate(payload);
  };
  return (
    <div>
      <Dialog
        keepMounted
        maxWidth="lg"
        open={isOpen}
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

                <PopupState variant="popover" popupId="demo-popup-popover">
                  {(popupState) => (
                    <div>
                      <div>
                        <label className="font-semibold text-[14px] ">
                          Select Color
                        </label>
                        <div
                          {...bindTrigger(popupState)}
                          {...register("color")}
                          style={{ backgroundColor: watch("color") }}
                          className={`cursor-pointer rounded-md mt-1  w-[150px] h-[45px] `}
                        ></div>
                      </div>
                      <Popover
                        {...bindPopover(popupState)}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "center",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "center",
                        }}
                      >
                        <div className="flex flex-wrap w-[300px] first:mt-2 h-max space-y-2 space-x-2 mb-2 ">
                          {tagsColors?.map((val, index) => {
                            return (
                              <div
                                key={index}
                                onClick={() => setValue("color", val.color)}
                                className={`h-[30px] w-[47px] rounded cursor-pointer ${
                                  index === 0 && "mt-[8px] ml-[8px] "
                                } `}
                                style={{ background: val.color }}
                              >
                                {val.color === watch("color") && (
                                  <div className="flex justify-center items-center h-full">
                                    <CheckIcon
                                      sx={{
                                        fontSize: "15px",
                                        color: val?.tickColor,
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </Popover>
                    </div>
                  )}
                </PopupState>
              </div>
              <div className="mb-1">
                {" "}
                <HookSelectField
                  labelText="Sponser"
                  name="manager_Id"
                  errors={errors}
                  control={control}
                  required={false}
                  placeholder="Search..."
                  loadOptions={usersList}
                />
              </div>
              <div>
                <label>Add Milestone Dependency (optional):</label>
                <HookSelectField
                  name="parent_Id"
                  errors={errors}
                  control={control}
                  required={false}
                  placeholder="Search..."
                  // isMulti={true}
                  loadOptions={milestoneDependency}
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
