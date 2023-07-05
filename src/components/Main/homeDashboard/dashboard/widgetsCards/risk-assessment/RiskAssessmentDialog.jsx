import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";
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
import {
  removeSelectedRiskAssesment,
  taskAssessmentClose,
} from "redux/actions";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import HookFreeSelect from "hooks/Common/HookFreeSelect";
import { ProgressInput } from "hooks/Common/HookProgressBarField";

const schema = yup.object().shape({
  riskDescription: yup.string().required("Risk Description Required"),
  impactDescription: yup.string().required("Impact Description Required"),
  migrationNotes: yup.string().required("Migration Notes Required"),
  notes: yup.string().required("Notes Required"),
  impactLevel: yup
    .number()
    .nullable()
    .typeError()
    .required("Impatct Level Required"),
  probabilityLevel: yup
    .number()
    .nullable()
    .typeError()
    .required("Probability Level  Required"),
  // severityLevel: yup
  //   .number()
  //   .nullable()
  //   .typeError()
  //   .required("Severity Level  Required"),
  progress: yup.number().nullable().typeError().required("progress  Required"),
  userId: yup.number().typeError().required("User Id Required"),
  riskStatus: yup.number().typeError().required("Risk Status Required"),
});
const edicSchema = yup.object().shape({
  riskDescription: yup.string().required("Risk Description Required"),
  impactDescription: yup.string().required("Impact Description Required"),
  migrationNotes: yup.string().required("Migration Notes Required"),
  notes: yup.string().required("Notes Required"),
  impactLevel: yup
    .number()
    .nullable()
    .typeError()
    .required("Impatct Level Required"),
  probabilityLevel: yup
    .number()
    .nullable()
    .typeError()
    .required("Probability Level  Required"),
  // severityLevel: yup
  //   .number()
  //   .nullable()
  //   .typeError()
  //   .required("Severity Level  Required"),
  progress: yup.number().nullable().typeError().required("progress  Required"),
});
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function RiskAssessmentDialog(props) {
  const { queryKeySet } = props;
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const selectedRiskAssesment = useSelector(
    (state) => state.projectTaskSlice.selectedRiskAssesment
  );
  const isEdit = !!selectedRiskAssesment;
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      progress: "",
      impactLevel: null,
      probabilityLevel: null,
      riskStatus: null,
      userId: null,
      riskDescription: "",
      impactDescription: "",
      migrationNotes: "",
      notes: "",
    },
    mode: "onChange",
    resolver: yupResolver(isEdit ? edicSchema : schema),
  });
  const classes = useStyles();
  const { projectId } = useParams();

  const isOpen = useSelector(
    (state) => state?.projectTaskSlice?.taskAssessmentState
  );

  const proId = useSelector((state) => state.projectTaskSlice.portfolioIdcheck);

  const workSpaceId = localStorage.getItem("workspaceId");

  const riskStatusEnum = [
    {
      value: 1,
      label: "Active",
    },
    {
      value: 2,
      label: "Hold",
    },
    {
      value: 3,
      label: "Close",
    },
  ];
  const impactLevelOptions = [
    {
      value: 1,
      label: "1",
    },
    {
      value: 2,
      label: "2",
    },
    {
      value: 3,
      label: "3",
    },
    {
      value: 4,
      label: "4",
    },
    {
      value: 5,
      label: "5",
    },
  ];
  const ProbabilityLevelOptions = [
    {
      value: 1,
      label: "1",
    },
    {
      value: 2,
      label: "2",
    },
    {
      value: 3,
      label: "3",
    },
    {
      value: 4,
      label: "4",
    },
    {
      value: 5,
      label: "5",
    },
  ];

  const handleClose = () => {
    reset({
      progress: "",
      impactLevel: null,
      probabilityLevel: null,
      riskStatus: null,
      userId: null,
      riskDescription: "",
      impactDescription: "",
      migrationNotes: "",
      notes: "",
    });
    dispatch(taskAssessmentClose());
    dispatch(removeSelectedRiskAssesment());
  };
  const { mutate: addRisk, isLoading } = useMutation({
    mutationKey: ["addMilestone"],
    mutationFn: (data) => axios.post("/riskmanagement", data),
    onSuccess: (data) => {
      if (data.status === 200) {
        enqueueSnackbar("Data Successfully Added", { variant: "success" });
        queryClient.invalidateQueries(["get_risk_assesment"]);
      }
      handleClose();
      reset({
        progress: "",
        impactLevel: null,
        probabilityLevel: null,
        riskStatus: null,
        userId: null,
        riskDescription: "",
        impactDescription: "",
        migrationNotes: "",
        notes: "",
      });
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });
  const { mutate: editRisk, isLoading: isEditLoading } = useMutation({
    mutationKey: ["editRiskManagement"],
    mutationFn: (data) =>
      axios.put(
        `/riskmanagement/update_risk_management/${selectedRiskAssesment.id}`,
        data
      ),
    onSuccess: (data) => {
      if (data.status === 200) {
        enqueueSnackbar("Data Successfully Updated", { variant: "success" });
        queryClient.invalidateQueries(["get_risk_assesment"]);
      }
      handleClose();
      reset({
        progress: "",
        impactLevel: null,
        probabilityLevel: null,
        riskStatus: null,
        userId: null,
        riskDescription: "",
        impactDescription: "",
        migrationNotes: "",
        notes: "",
      });
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  const { data: workspaceUserId } = useQuery(
    ["dropdown_dependency", workSpaceId],
    () => {
      return axios.get(`/workspace/workspace_members/${workSpaceId}`);
    },
    {
      enabled: !!workSpaceId,
      select: (res) => {
        return res?.data?.data.map((val) => {
          return {
            label: val?.name,
            value: val?.user_Id,
          };
        });
      },
    }
  );
  React.useEffect(() => {
    if (selectedRiskAssesment && workspaceUserId.length) {
      reset({
        progress: selectedRiskAssesment.progress,
        impactLevel: selectedRiskAssesment.impactLevel,
        probabilityLevel: selectedRiskAssesment.probabilityLevel,
        severityLevel: selectedRiskAssesment.severityLevel,
        riskStatus: riskStatusEnum.filter(
          (el) => el.value === selectedRiskAssesment.riskStatus
        )[0].value,
        userId: workspaceUserId.filter(
          (el) => el.value === selectedRiskAssesment.owner.user_Id
        )[0].value,
        riskDescription: selectedRiskAssesment.riskDescription,
        impactDescription: selectedRiskAssesment.impactDescription,
        migrationNotes: selectedRiskAssesment.migrationNotes,
        notes: selectedRiskAssesment.notes,
      });
    }
  }, [selectedRiskAssesment, workspaceUserId, reset]);

  const onSubmit = (data) => {
    if (isEdit) {
      const payload = {
        projectId: projectId,
        ...data,
        riskStatus: +data.riskStatus,
        userId: +data.userId,
      };
      editRisk(payload);
      return;
    }
    const payload = {
      projectId: projectId,
      ...data,
    };
    addRisk(payload);
  };
  return (
    <div>
      <Dialog
        keepMounted
        maxWidth=""
        open={isOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        {/* <CustomLoader isLoading={[isLoading].includes(true)} /> */}
        <DialogTitle className="bg-[#fafbfd]">
          <div className="flex justify-between px-[5px] items-center">
            <h1>
              {" "}
              {isEdit ? "Edit Risk Assessment" : "Create Risk Assessment"}
            </h1>
            <div className="cursor-pointer border border-[#e8e8e8] bg-[#fff] shadow-[0 3px 5px 0 rgba(0,0,0,.05)] px-[6px] py-[2px] rounded-md hover:bg-[#f98a3f] hover:text-[#fff]">
              <CloseIcon
                className="relative -top-[1px]"
                onClick={handleClose}
              />
            </div>
          </div>
        </DialogTitle>
        <Divider />
        <DialogContent className={classes.dialogPaper}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <div className="border-gray-500 mt-3">
                <HookTextField
                  name="riskDescription"
                  errors={errors}
                  control={control}
                  labelText="Risk Description"
                  required={false}
                  placeholder="Add a Risk description..."
                  type="textarea"
                  rows={3}
                />
              </div>
              <div className="border-gray-500">
                <HookTextField
                  name="impactDescription"
                  errors={errors}
                  control={control}
                  labelText="Impact Description"
                  required={false}
                  placeholder="Add a Impact description..."
                  type="textarea"
                  rows={3}
                />
              </div>
              <div className="flex w-[550px] gap-4">
                <div className="mt-3 w-[50%] ">
                  <label>Impact Level</label>

                  <HookFreeSelect
                    name="impactLevel"
                    errors={errors}
                    control={control}
                    required={false}
                    options={impactLevelOptions}
                    width="100%"
                  />
                </div>
                <div className="mt-3 w-[50%] ">
                  <label>Probability Level</label>
                  <HookFreeSelect
                    name="probabilityLevel"
                    errors={errors}
                    control={control}
                    required={false}
                    options={ProbabilityLevelOptions}
                    width="100%"
                  />
                </div>
              </div>

              {/* <div className="border-gray-500 mt-3">
                <HookTextField
                  name="severityLevel"
                  errors={errors}
                  control={control}
                  labelText="Severity Level"
                />
              </div> */}
              <div className="border-gray-500 mt-3">
                <HookTextField
                  name="migrationNotes"
                  errors={errors}
                  control={control}
                  labelText="Migration Notes"
                  required={false}
                  placeholder="Add a Migration Notes..."
                  type="textarea"
                  rows={3}
                />
              </div>
              <div className="border-gray-500 ">
                <HookTextField
                  name="notes"
                  errors={errors}
                  control={control}
                  labelText=" Notes"
                  required={false}
                  placeholder="Add  Notes..."
                  type="textarea"
                  rows={3}
                />
              </div>
              <div className="border-gray-500 mt-3">
                {/* <HookTextField
                  name="progress"
                  errors={errors}
                  control={control}
                  labelText="Progress"
                /> */}
                <ProgressInput
                  control={control}
                  name="progress"
                  defaultValue={0}
                  labelText="Progress"
                />
              </div>
              <div className="flex w-[550px] gap-4">
                <div className="mt-3 w-[50%]">
                  <label>Owner</label>
                  <HookFreeSelect
                    name="userId"
                    errors={errors}
                    control={control}
                    options={workspaceUserId}
                    required={false}
                    width="100%"
                  />
                </div>
                <div className="mt-3 w-[50%] ">
                  <label>Status</label>
                  <HookFreeSelect
                    name="riskStatus"
                    errors={errors}
                    control={control}
                    required={false}
                    options={riskStatusEnum}
                    width="100%"
                  />
                </div>
              </div>
            </div>
            <input type="submit" className="hidden" />
          </form>
        </DialogContent>
        <DialogActions className="bg-[#fafbfd] border border-t-[#ececec]">
          <div className="flex justify-end items-center space-x-4 px-4 py-4">
            <WhiteButton buttonText="Cancel" onClick={handleClose} />
            <GreenButton
              disabled={isLoading}
              loading={isLoading}
              buttonText={isEdit ? "Updtae" : "Create"}
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
