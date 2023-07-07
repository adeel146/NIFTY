import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { closeMilestone } from "redux/reducers/mainDashbord";
import { Divider, Popover, Tooltip } from "@mui/material";
import Grid from "@mui/material/Grid";
import DateRangeIcon from "@mui/icons-material/DateRange";
import MilestoneOpenTasks from "./MilestoneOpenTasks";
import MilestoneCompleteTask from "./MilestoneCompleteTask";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import MilestoneSubTask from "./MilestoneSubTask";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { addDays, subDays } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { isEmpty } from "lodash";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import CustomLoader from "hooks/Common/CustomLoader";
import { useParams } from "react-router-dom";
import HookSelectField from "hooks/Common/HookSelectField";
import { useForm } from "react-hook-form";
import Select from "react-select";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import GreenButton from "hooks/Common/commonButtons/GreenButton";
import WhiteButton from "hooks/Common/commonButtons/WhiteButton";
import CustomProgressBar from "hooks/Common/CustomProgressBar";
import Slider from "@mui/material/Slider";
import { useAuth } from "hooks/useAuth";

const MileStoneDrawer = () => {
  const {
    control,
    watch,
    formState: { errors },
  } = useForm();

  const [name, setName] = useState("Open Tasks");
  const [check, setCheck] = useState(true);
  const [drawyerWidth, setDrawyerWidth] = useState(700);
  const [dateShow, setDateShow] = useState(false);
  const [sliderVal, setSliderVal] = useState(0);
  const [isOpendateChange, setIsOpendateChange] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { milestoneState: open, milestoneId } = useSelector(
    (state) => state?.dashbordSlice
  );

  const auth = useAuth();
  const isSubTaskShow = useSelector((state) => state.projectTaskSlice.subTask);
  let { projectId } = useParams();
  const [dependencyShow, setDependencyShow] = useState(false);

  const [DateRangeVal, setDateRangeVal] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleOnChange = (ranges) => {
    const { selection } = ranges;
    setDateRangeVal([selection]);
  };

  const { data: mileStoneDetails, isLoading: detailLoading } = useQuery(
    ["milestone_details_list", milestoneId],
    () => {
      return axios.get(`/milestone/detail/${milestoneId}`);
    },
    {
      select: (res) => {
        return res?.data?.data;
      },
      onSuccess: (data) => {
        let payload = [
          {
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            key: "selection",
          },
        ];
        setSliderVal(data.completed);
        setDateRangeVal(payload);
      },
      enabled: !!milestoneId,
      refetchOnWindowFocus: false,
    }
  );

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
      refetchOnWindowFocus: false,
    }
  );

  const { mutate: updateDateRande, isLoading: updatingDateRange } = useMutation(
    {
      mutationKey: ["milestone_date_update", milestoneId],
      mutationFn: (data) =>
        axios.put(`/milestone/change_date/${milestoneId}`, data),
      onSuccess: (data) => {
        if (data.data.success) {
          enqueueSnackbar(data.data.message, { variant: "success" });
          queryClient.invalidateQueries(["milestone_details_list"]);
          setIsOpendateChange(false);
        }
      },
      onError: (data) => {
        enqueueSnackbar(data.response.data.message, { variant: "error" });
      },
    }
  );
  const { mutate: updateCompleted } = useMutation({
    mutationKey: ["updateCompleted", milestoneId],
    mutationFn: (value) =>
      axios.put(`milestone/update_completed/${milestoneId}?completed=${value}`),
    onSuccess: (data) => {
      if (data.data.success) {
        enqueueSnackbar(data.data.message, { variant: "success" });
      }
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });
  const { mutate: updateDependancy } = useMutation({
    mutationKey: ["milestone_dependancy"],
    mutationFn: (dependancyId) =>
      axios.put(
        `/milestone/change_dependency/${milestoneId}?dependency_id=${dependancyId}`
      ),
    onSuccess: (data) => {
      if (data.data.success) {
        enqueueSnackbar(data.data.message, { variant: "success" });
        queryClient.invalidateQueries(["milestone_details_list"]);
        hideDatePopover();
      }
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  const handleSubmitDateChange = () => {
    const payload = {
      startDate: DateRangeVal[0]?.startDate,
      endDate: DateRangeVal[0]?.endDate,
    };
    if (!isEmpty(payload)) {
      updateDateRande(payload);
    }
  };

  const MaxWidth = () => {
    setDrawyerWidth(1200);
    setCheck(true);
  };
  const MinWidth = () => {
    setDrawyerWidth(700);
    setCheck(false);
  };

  function changeWidth() {
    if (check) {
      MinWidth();
    } else {
      MaxWidth();
    }
  }

  const showDatePopover = () => {
    setDateShow(true);
  };
  function hideDatePopover() {
    setDateShow(false);
  }

  const taskList = [
    {
      name: "Open Tasks",
      score: mileStoneDetails?.inCompleteTasks?.length,
    },
    {
      name: "Complete Tasks",
      score: mileStoneDetails?.completeTasks?.length,
    },
  ];

  const handleChangeDependancy = (event) => {
    let value = event.value;
    setDependencyShow(false);
    updateDependancy(value);
  };

  return (
    <div>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => dispatch(closeMilestone())}
      >
        {detailLoading ? (
          <div>
            <CustomLoader />
          </div>
        ) : (
          <Box sx={{ width: drawyerWidth }}>
            <div className="flex justify-end mt-[1rem] px-[1rem] items-center">
              {/* <h3>Milestone Members</h3> */}
              <div className="flex space-x-3 items-center">
                <div
                  className="cursor-pointer "
                  onClick={() => {
                    dispatch(closeMilestone());
                    setTimeout(() => {
                      setDrawyerWidth(1200);
                    }, 1000);
                  }}
                >
                  <CloseIcon />
                </div>
                <div className="cursor-pointer" onClick={changeWidth}>
                  <OpenInFullIcon />
                </div>
              </div>
            </div>
            {/* content */}
            {isSubTaskShow ? (
              <MilestoneSubTask />
            ) : (
              <>
                <div className="px-[1rem]">
                  <div className="flex justify-between items-center">
                    <h3 className=" text-[19px] font-[500]">
                      {mileStoneDetails?.name}
                    </h3>
                    <div className="mr-28 w-[300px] flex space-x-2 ">
                      <div className="w-full">
                        {/* <CustomProgressBar completed={mileStoneDetails?.completed} /> */}
                        <Slider
                          disabled={
                            auth.user.id === mileStoneDetails?.manager_Id
                          }
                          onChange={(a, b) => {
                            setSliderVal(b);
                          }}
                          onChangeCommitted={(a, b) => {
                            updateCompleted(b);
                          }}
                          value={sliderVal}
                          aria-label="Default"
                          valueLabelDisplay="auto"
                        />
                      </div>
                      <p>{sliderVal}</p>
                    </div>
                  </div>

                  <p className="mt-[10px] text-[#B1B5D0] font-[500] text-[15px]">
                    {mileStoneDetails?.description}
                  </p>
                </div>
                <div className="mt-[2rem]">
                  <Divider />
                </div>
                <div className="px-[1rem]">
                  <Box sx={{ flexGrow: 1, marginTop: "20px" }}>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <div className="flex flex-col">
                          <div className="flex space-x-2 relative items-center cursor-pointer">
                            <DateRangeIcon
                              sx={{
                                fontSize: "15px",
                                color: "#B1B5D0",
                              }}
                            />
                            <h3 className="text-[14px] ">
                              Start and End Date{" "}
                            </h3>
                          </div>
                          <PopupState
                            variant="popover"
                            popupId="demo-popup-popover"
                          >
                            {(popupState) => (
                              <div>
                                <div
                                  {...bindTrigger(popupState)}
                                  className="w-max cursor-pointer rounded-md bg-white flex items-center justify-center"
                                >
                                  <div
                                    className="cursor-pointer"
                                    onClick={() => setIsOpendateChange(true)}
                                  >
                                    <h3 className="text-[14px] text-[#B1B5D0] font-[500] h-[20px] hover:border-b-2 border-dashed ">
                                      {moment(
                                        mileStoneDetails?.startDate
                                      ).format("ll")}
                                      -{" "}
                                      {moment(
                                        mileStoneDetails?.endtDate
                                      ).format("ll")}
                                    </h3>
                                  </div>
                                </div>
                                {isOpendateChange && (
                                  <Popover
                                    onClose={() => setIsOpendateChange(false)}
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
                                    <div>
                                      <DateRangePicker
                                        onChange={handleOnChange}
                                        showSelectionPreview={true}
                                        moveRangeOnFirstSelection={false}
                                        months={2}
                                        ranges={DateRangeVal}
                                        direction="horizontal"
                                      />
                                      <div className="flex space-x-2 justify-end p-4 cursor-pointer">
                                        <WhiteButton
                                          onClick={() =>
                                            setIsOpendateChange(false)
                                          }
                                          buttonText="Cancel"
                                        />
                                        <GreenButton
                                          loading={updatingDateRange}
                                          onClick={handleSubmitDateChange}
                                          buttonText="Save"
                                        />
                                      </div>
                                    </div>
                                  </Popover>
                                )}
                              </div>
                            )}
                          </PopupState>
                        </div>
                      </Grid>
                      <Grid item xs={4}>
                        <div className="flex flex-col">
                          <div className="flex space-x-2 items-center">
                            <DateRangeIcon
                              sx={{ fontSize: "15px", color: "#B1B5D0" }}
                            />
                            <h3 className="text-[14px]">Duration </h3>
                          </div>
                          <div>
                            <h3 className="text-[14px] text-[#B1B5D0] font-[500]">
                              6 Days
                            </h3>
                          </div>
                        </div>
                      </Grid>
                      <Grid item xs={4}>
                        <div className="flex flex-col">
                          <div className="flex space-x-2 items-center">
                            <DateRangeIcon
                              sx={{ fontSize: "15px", color: "#B1B5D0" }}
                            />
                            <h3 className="text-[14px]">Dependency </h3>
                          </div>
                          {/* <div>
                            <h3
                              className="text-[14px] text-[#B1B5D0] font-[500] cursor-pointer"
                              onClick={handleDependency}
                            >
                              Set ...
                            </h3>
                            {dependencyShow && (
                              <div>
                                <Select
                                  onChange={handleChangeDependancy}
                                  options={milestoneDependency}
                                />
                              </div>
                            )}
                          </div> */}

                          <PopupState
                            variant="popover"
                            popupId="demo-popup-popover"
                          >
                            {(popupState) => (
                              <div>
                                <div
                                  {...bindTrigger(popupState)}
                                  className=" text-sm cursor-pointer "
                                >
                                  Set...
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
                                  <Box
                                    sx={{
                                      width: "200px",
                                      height: "200px",
                                      overflow: "auto",
                                    }}
                                  >
                                    <div className="mt-2 px-2">
                                      <Select
                                        onChange={handleChangeDependancy}
                                        options={milestoneDependency}
                                      />
                                    </div>
                                  </Box>
                                </Popover>
                              </div>
                            )}
                          </PopupState>
                        </div>
                      </Grid>
                      {/* <Grid item xs={4}>
                        <div className="flex flex-col">
                          <div className="flex space-x-2 items-center">
                            <DateRangeIcon
                              sx={{ fontSize: "15px", color: "#B1B5D0" }}
                            />
                            <h3 className="text-[14px]">Recurring</h3>
                          </div>
                          <div>
                            <h3 className="text-[14px] text-[#B1B5D0] font-[500]">
                              Set ...
                            </h3>
                          </div>
                        </div>
                      </Grid> */}
                      {/* <Grid item xs={4}>
                        <div className="flex flex-col">
                          <div className="flex space-x-2 items-center">
                            <DateRangeIcon
                              sx={{ fontSize: "15px", color: "#B1B5D0" }}
                            />
                            <h3 className="text-[14px]">Story Points</h3>
                          </div>
                          <div>
                            <h3 className="text-[14px] text-[#B1B5D0] font-[500]">
                              0/0{" "}
                            </h3>
                          </div>
                        </div>
                      </Grid> */}
                    </Grid>
                  </Box>
                </div>
                {/* tasksss */}
                <div className="flex item-center w-full mt-12">
                  {taskList.map((val, index) => {
                    return (
                      <div
                        key={index}
                        className={` w-full  text-[13px] font-[400] flex items-center justify-around h-[30px] bg-gray-50 border-b border-b-gray-200  border-t border-t-gray-200`}
                      >
                        <h1
                          onClick={() => setName(val.name)}
                          className={
                            val.name === name
                              ? "border-2 border-b-[#111631] cursor-pointer border-l-transparent border-t-transparent border-r-transparent"
                              : "cursor-pointer"
                          }
                        >
                          {val?.name} &nbsp;{val.score}
                        </h1>
                      </div>
                    );
                  })}
                </div>
                <div className="px-[1rem] mt-[1rem]">
                  {name === "Open Tasks" ? (
                    <MilestoneOpenTasks
                      tasks={mileStoneDetails?.inCompleteTasks}
                    />
                  ) : (
                    <MilestoneCompleteTask tasks={mileStoneDetails} />
                  )}
                </div>
              </>
            )}
          </Box>
        )}
      </Drawer>
    </div>
  );
};

export default MileStoneDrawer;
