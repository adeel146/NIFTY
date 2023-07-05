import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { useSelector } from "react-redux";
import { Divider } from "@mui/material";
import { useForm } from "react-hook-form";
import WhiteButton from "hooks/Common/commonButtons/WhiteButton";
import GreenButton from "hooks/Common/commonButtons/GreenButton";
import { makeStyles } from "@mui/styles";
import { yupResolver } from "@hookform/resolvers/yup";
import { milestoneSchema } from "validations/portfolio";
import axios from "axios";
import CustomLoader from "hooks/Common/CustomLoader";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { closeMatrixDialog, removeSelectedRiskId } from "redux/actions";
import CheckIcon from "@mui/icons-material/Check";
import { useState } from "react";
import HookTextField from "hooks/Common/HookTextField";
import {
  useGetWorspaceRiskById,
  useUpdateWorspaceRiskById,
} from "hooks/Workspace";
import { useDisplaySuccess } from "hooks/useDisplaySuccess";
import { useDisplayError } from "hooks/useDisplayError";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function MatrixColorDialog(props) {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(""),
  });
  const classes = useStyles();
  const displaySuccess = useDisplaySuccess();

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedRiskItem, setSelectedRiskItem] = useState(null);

  const riskValue = watch("value");
  const isOpen = useSelector((state) => state?.projectTaskSlice?.matrixState);
  const id = useSelector((state) => state?.projectTaskSlice?.selectedRiskId);
  const workSpaceId = localStorage.getItem("workspaceId");

  const onSuccess = (data) => {
    dispatch(closeMatrixDialog());
    dispatch(removeSelectedRiskId());
    setSelectedColor("");
    displaySuccess(data?.data?.message);
  };
  const { data: workSpaceRisk = [] } = useQuery(
    ["workspace_risk", workSpaceId],
    () => {
      return axios.get(`/workspace/risk_assesment/${workSpaceId}`);
    },
    {
      enabled: !!workSpaceId,
      select: (res) => {
        return res?.data;
      },
    }
  );
  React.useEffect(() => {
    if (workSpaceRisk.length && id) {
      workSpaceRisk.forEach((innerArray) => {
        innerArray.forEach((item) => {
          if (item.id === id) {
            setSelectedRiskItem({ ...item });
          }
        });
      });
    }
  }, [workSpaceRisk, id]);
  React.useEffect(() => {
    if (selectedRiskItem) {
      reset({ value: selectedRiskItem.value });
    }
  }, [selectedRiskItem]);
  const { worspaceRiskByIdResponse } = useGetWorspaceRiskById({ id });
  const updateRisk = useUpdateWorspaceRiskById({
    id,
    onSuccess,
  });
  const isLoading = updateRisk.isLoading;
  const error = updateRisk.error;
  useDisplayError(error);

  const handleClose = () => {
    dispatch(closeMatrixDialog());
    dispatch(removeSelectedRiskId());
    setSelectedColor("");
  };

  const onSubmit = (data) => {
    const payload = {
      color: selectedColor,
      value: riskValue,
    };
    updateRisk.mutate({
      data: payload,
    });
  };
  return (
    <div>
      <Dialog
        keepMounted
        maxWidth="lg"
        open={isOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
        sx={{ zIndex: "9999999" }}
      >
        {/* <CustomLoader isLoading={[isLoading].includes(true)} /> */}
        <DialogTitle>
          <div className="flex px-1">
            <h1> Change Color</h1>
          </div>
        </DialogTitle>
        <Divider />
        <DialogContent className={classes.dialogPaper}>
          {/* onSubmit={handleSubmit(onSubmit)} */}
          <form>
            <div className="flex space-x-1 py-9">
              {colorsList.map((val, index) => {
                return (
                  <div
                    onClick={() => setSelectedColor(val.color)}
                    key={index}
                    className={`bg-[${val?.color}] cursor-pointer h-[30px] w-[132px] rounded flex justify-center items-center text-white`}
                  >
                    {val.color === selectedColor && <CheckIcon />}
                  </div>
                );
              })}
            </div>

            {/* <HookTextField
              control={control}
              name="value"
              fullWidth
              errors={errors}
              labelText="Risk Value"
              placeholder="Enter risk value..."
              type="number"
            /> */}
          </form>
        </DialogContent>
        <DialogActions>
          <div className="flex justify-end my-5 items-center space-x-4 ml-[20px]">
            <WhiteButton buttonText="Cancel" onClick={handleClose} />
            <GreenButton
              disabled={isLoading}
              loading={isLoading}
              buttonText="Change"
              onClick={() => {
                handleSubmit(onSubmit());
              }}
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

const colorsList = [
  {
    name: "Low Risk",
    color: "#93D150",
  },
  {
    name: "Medium Risk",
    color: "#FFFF00",
  },
  {
    name: "High Risk",
    color: "#FFC100",
  },
  {
    name: "Very High Risk",
    color: "#FF0000",
  },
];
