import React, { useEffect, useState } from "react";
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
import { Divider } from "@mui/material";
import { useForm } from "react-hook-form";
import WhiteButton from "hooks/Common/commonButtons/WhiteButton";
import GreenButton from "hooks/Common/commonButtons/GreenButton";
import { makeStyles } from "@mui/styles";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import CustomLoader from "hooks/Common/CustomLoader";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import { closeMilestoneProgress } from "redux/actions";
import { useDispatch } from "react-redux";
import { map } from "lodash";
import CircularProgress from "@mui/material/CircularProgress";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function MilestoneProgressModal({ data }) {
  // const {   queryKeySet } = props;
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
    resolver: yupResolver(""),
  });
  const classes = useStyles();
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const [completed, setCompleted] = useState();
  const [milestoneWeight, setMilestoneWeight] = useState(data || []);
  const [totalWeight, setTotalWeight] = useState([]);

  const isOpen = useSelector(
    (state) => state.projectTaskSlice.milestoneProgress
  );

  const handleClose = () => {
    dispatch(closeMilestoneProgress());
  };

  console.log(milestoneWeight, "milestoneWeight");
  const containerStyles = {
    height: 30,
    textAlign: "center",
    width: "100%",
    backgroundColor: "#e0e0de",
    borderRadius: 4,
    margin: 0,
  };

  const fillerStyles = {
    height: "100%",
    width: `100%`,
    backgroundColor: `${completed == 100 ? "#00A99B" : "#FF614B  "}`,
    borderRadius: "inherit",
    textAlign: "right",
    fontSize: "16px",
    fontWeight: "400",
    paddingTop: "3px",
    transition: "width 0.2s ease-in-out",
  };

  const labelStyles = {
    padding: 8,
    color: completed == 100 ? "white" : "#efefef",
    fontWeight: "400",
  };

  const containerStyles_show = {
    height: 30,
    textAlign: "center",
    width: "100%",
    backgroundColor: "#e0e0de",
    borderRadius: 4,
    margin: 0,
  };

  const labelStyles_show = {
    padding: 8,
    color: completed == 100 ? "white" : "black",
    fontWeight: "400",
  };

  useEffect(() => {
    const list = map(milestoneWeight, "weightage");
    const totalValue = list?.reduce(
      (previousScore, currentScore, index) => previousScore + currentScore,
      0
    );
    const fixedValue = totalValue.toFixed(0);
    setCompleted(fixedValue);
  }, [milestoneWeight]);

  const addPercentageWeight = (id, value) => {
    const values = value?.toFixed(0);
    const newPercentage = milestoneWeight?.map((elem) => {
      if (elem?.id == id && values <= 95) {
        return {
          ...elem,
          weightage: elem?.weightage + 1,
        };
      } else if (elem?.id == id && values > 95 && values < 100) {
        return {
          ...elem,
          weightage: 100,
        };
      } else {
        return elem;
      }
    });
    setMilestoneWeight(newPercentage);
  };
  const minusPercentageWeight = (id, value) => {
    const values = value?.toFixed(0);
    const newPercentage = milestoneWeight?.map((elem) => {
      if (elem?.id == id && values > 3) {
        return {
          ...elem,
          weightage: elem?.weightage - 1,
        };
      } else if (elem?.id == id && values > 0 && values <= 3) {
        return {
          ...elem,
          weightage: 0,
        };
      }
      return elem;
    });
    setMilestoneWeight(newPercentage);
  };

  function EnableButton(value) {
    if (value >= 0 && value < 100) {
      return true;
    } else if (value > 100) {
      return true;
    } else {
      return false;
    }
  }

  const payloadWeight = milestoneWeight?.map((val) => {
    return {
      id: val?.id,
      weightage: val?.weightage,
    };
  });

  const { mutate: updateWeight, isLoading } = useMutation({
    mutationKey: ["update_weight"],
    mutationFn: (data) => axios.put(`milestone/update_weightage`, data),
    onSuccess: (data) => {
      if (data.data.success) {
        enqueueSnackbar(data.data.message, { variant: "success" });
        dispatch(closeMilestoneProgress());
        queryClient.invalidateQueries(["get-milestone"]);
      }
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  return (
    <div>
      <Dialog
        keepMounted
        maxWidth="md"
        open={isOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <div className="flex justify-center items-center">
            <h1 className="text-[22px]">Milestones Waight Setup </h1>
          </div>
        </DialogTitle>
        <Divider />
        <DialogContent className={classes.dialogPaper}>
          <div className="h-[120px] py-2 w-full px-3 border border-gray-300 rounded-[14px]">
            <h1 className="text-[18px] font-bold">Milesone Percetange</h1>
            <div className="flex space-x-6  items-center">
              <div className="mt-4 w-[80%]">
                <div style={containerStyles}>
                  <div style={fillerStyles}>
                    <span style={labelStyles}>{`${completed}%`}</span>
                  </div>
                </div>
              </div>
              <div
                style={{
                  background: completed == 100 ? "#00A99B" : "white",
                  color: completed == 100 ? "white" : "black",
                }}
                className="w-[20%] border h-[32px] rounded-[12px] mt-4 flex justify-center items-center border-gray-300"
              >
                <button
                  disabled={EnableButton(completed)}
                  onClick={() => updateWeight(payloadWeight)}
                >
                  {isLoading ? <CircularProgress size={20} /> : "Save"}
                </button>
              </div>
            </div>
            {completed > 100 && (
                <p className="text-[15px] pl-[1px] pt-[1px] text-red-500">
                  Cannot Exceeded to 100
                </p>
            )}
          </div>
          <div>
            <div className="py-2 w-full px-3 border border-gray-300 rounded-[14px] min-h-[200px] mt-8">
              {milestoneWeight.map((val) => {
                return (
                  <div key={val?.id}>
                    <div className="flex space-x-5 items-center">
                      <div>
                        <button
                          disabled={val?.weightage <= 0}
                          onClick={() =>
                            minusPercentageWeight(val?.id, val?.weightage)
                          }
                          className="w-[35px] mt-4 h-[30px] flex justify-center items-center text-white text-[25px] border bg-[#9399AB] rounded-[5px]"
                        >
                          -
                        </button>
                      </div>
                      <div className="mt-4 w-[80%]">
                        <div style={containerStyles_show}>
                          <div
                            style={{
                              height: "100%",
                              width: `${val?.weightage}%`,
                              backgroundColor: `${
                                val?.weightage == 100 ? "#00A99B" : val?.color
                              }`,
                              borderRadius: "inherit",
                              textAlign: "right",
                              fontSize: "16px",
                              fontWeight: "400",
                              paddingTop: "3px",
                              transition: "width 0.2s ease-in-out",
                              position: "relative",
                            }}
                          >
                            <span
                              style={{
                                padding: 8,
                                color: val?.weightage == 100 ? "#fff" : "#333",
                                fontWeight: "400",
                                position: "absolute",
                                left: "80px",
                                top: "-5px",
                                fontSize: "14px",
                              }}
                            >{` (${val?.weightage?.toFixed(0)}%) `}</span>
                            <p className="absolute w-[100px] text-left left-[6px] top-[3px] text-[14px]">
                              {val?.name}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <button
                          disabled={val?.weightage >= 100}
                          onClick={() =>
                            addPercentageWeight(val?.id, val?.weightage)
                          }
                          className="w-[35px] flex justify-center items-center mt-4 h-[30px] text-white text-[25px] border bg-[#9399AB] rounded-[5px]"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <div className="flex justify-end my-5 items-center space-x-4 mr-[1rem]">
            <WhiteButton buttonText="Cancel" onClick={handleClose} />
            {/* <GreenButton
              disabled={}
                loading={isLoading}
              buttonText="Create"
                onClick={handleSubmit(onSubmit)}
            /> */}
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
