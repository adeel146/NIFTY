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

  //   const { mutate, isLoading } = useMutation({
  //     mutationKey: ["addMilestone"],
  //     mutationFn: (data) => axios.post("/milestone", data),
  //     onSuccess: (data) => {
  //       console.log(data, "success");
  //       enqueueSnackbar(data.data.message, { variant: "success" });
  //       queryClient.invalidateQueries(["get-milestone"]);
  //       reset();
  //       queryClient.invalidateQueries([queryKeySet]);
  //       handleClose();
  //       reset();
  //     },
  //     onError: (data) => {
  //       console.log(data, "error");
  //       enqueueSnackbar(data.response.data.message, { variant: "error" });
  //     },
  //   });

  //   const { data: milestoneDependency } = useQuery(
  //     ["dropdown_dependency", projectId],
  //     () => {
  //       return axios.get(`/milestone/listing/${projectId}`);
  //     },
  //     {
  //       enabled: !!projectId,
  //       select: (res) => {
  //         return res.data.data.map((val) => {
  //           return {
  //             label: val?.name,
  //             value: val?.id,
  //           };
  //         });
  //       },
  //     }
  //   );

  //   const onSubmit = (data) => {
  //     data.parent_Id = data?.parent_Id?.value || null;
  //     const payload = {
  //       project_Id: projectId,
  //       ...data,
  //     };
  //     mutate(payload);
  //   };

  useEffect(() => {
    const list = map(milestoneWeight, "completedPercentage");
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
          completedPercentage: elem?.completedPercentage + 1,
        };
      } else if (elem?.id == id && values > 95 && values < 100) {
        return {
          ...elem,
          completedPercentage: 100,
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
          completedPercentage: elem?.completedPercentage - 1,
        };
      } else if (elem?.id == id && values > 0 && values <= 3) {
        return {
          ...elem,
          completedPercentage: 0,
        };
      }
      return elem;
    });
    setMilestoneWeight(newPercentage);
  };

  function EnableButton(value) {
    if (value > 0 && value < 100) {
      return true;
    } else if (value > 100) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <div>
      <Dialog
        keepMounted
        maxWidth="md"
        open={isOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        {/* <CustomLoader isLoading={[isLoading].includes(true)} /> */}
        <DialogTitle>
          <div className="flex justify-center items-center">
            <h1 className="text-[22px]">Milestones Waight Setup </h1>
          </div>
        </DialogTitle>
        <Divider />
        <DialogContent className={classes.dialogPaper}>
          <div className="h-[100px] py-2 w-full px-3 border border-gray-300 rounded-[14px]">
            <h1 className="text-[18px] font-bold">Milesone Percetange</h1>
            <div className="flex space-x-6  items-center">
              <div className="mt-4 w-[80%]">
                <div style={containerStyles}>
                  <div style={fillerStyles}>
                    <span style={labelStyles}>{`${completed}%`}</span>
                  </div>
                </div>
              </div>
              <div className="w-[20%] border h-[32px] rounded-[12px] mt-4 flex justify-center items-center border-gray-300">
                <button disabled={EnableButton(completed)}>save</button>
              </div>
            </div>
          </div>
          <div>
            <div className="py-2 w-full px-3 border border-gray-300 rounded-[14px] min-h-[200px] mt-8">
              {milestoneWeight.map((val) => {
                return (
                  <div key={val?.id}>
                    <div className="flex space-x-5 items-center">
                      <div>
                        <button
                          disabled={val?.completedPercentage <= 0}
                          onClick={() =>
                            minusPercentageWeight(
                              val?.id,
                              val?.completedPercentage
                            )
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
                              width: `${val?.completedPercentage}%`,
                              backgroundColor: `${
                                val?.completedPercentage == 100
                                  ? "#00A99B"
                                  : "#FF614B"
                              }`,
                              borderRadius: "inherit",
                              textAlign: "right",
                              fontSize: "16px",
                              fontWeight: "400",
                              paddingTop: "3px",
                              transition: "width 0.2s ease-in-out",
                            }}
                          >
                            <span
                              style={{
                                padding: 8,
                                color:
                                  val?.completedPercentage == 100
                                    ? "#fff"
                                    : "#333",
                                fontWeight: "400",
                              }}
                            >{`${val?.completedPercentage?.toFixed(0)}%`}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <button
                          disabled={val?.completedPercentage >= 100}
                          onClick={() =>
                            addPercentageWeight(
                              val?.id,
                              val?.completedPercentage
                            )
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
