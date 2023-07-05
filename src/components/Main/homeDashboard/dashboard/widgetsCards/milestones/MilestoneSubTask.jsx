import { Box, Divider, Grid } from "@mui/material";
import React, { useState } from "react";
import { subTaskHide } from "redux/actions";
import { useDispatch } from "react-redux";
import WhiteButton from "hooks/Common/commonButtons/WhiteButton";
import Fade from "react-reveal/Fade";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CheckIcon from "@mui/icons-material/Check";
import TagIcon from "@mui/icons-material/Tag";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Checkbox from "@mui/material/Checkbox";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import MapsUgcIcon from "@mui/icons-material/MapsUgc";
import AddIcon from "@mui/icons-material/Add";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import TextsmsIcon from "@mui/icons-material/Textsms";
import NearMeIcon from "@mui/icons-material/NearMe";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import MicIcon from "@mui/icons-material/Mic";
import { subChildTaskShow } from "redux/actions";
import { useSelector } from "react-redux";
import MilestoneSubTaskChild from "./MilestoneSubTaskChild";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSnackbar } from "notistack";

const MilestoneSubTask = ({ mileStoneId }) => {
  const dispatch = useDispatch();
  const subtaskChild = useSelector(
    (state) => state.projectTaskSlice.childSubTask
  );
  const [name, setName] = useState("Subtasks");

  const subTaskList = [
    {
      name: "Subtasks",
    },
    {
      name: "Attachments",
    },
  ];

  return (
    <React.Fragment>
      <Fade left>
        <div className="px-[1rem] mt-2">
          <WhiteButton
            buttonText="back"
            onClick={() => dispatch(subTaskHide())}
          />
        </div>
        <Grid container spacing={2} sx={{ height: "90vh" }}>
          <Grid item xs={6} sx={{ borderRight: "1px solid #E5E7EB" }}>
            <div className="">
              <Box sx={{ flexGrow: 1, marginTop: "20px" }}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <div className="flex flex-col pl-4">
                      <div className="flex space-x-2 items-center">
                        <PersonIcon
                          sx={{ fontSize: "15px", color: "#B1B5D0" }}
                        />
                        <h3 className="text-[14px]">Assignee </h3>
                      </div>
                      <div>
                        <h3 className="text-[14px] text-[#B1B5D0] font-[500]">
                          Jun 1, 23 - Jun 6, 23
                        </h3>
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={4}>
                    <div className="flex flex-col">
                      <div className="flex space-x-2 items-center">
                        <LocalOfferIcon
                          sx={{ fontSize: "15px", color: "#B1B5D0" }}
                        />
                        <h3 className="text-[14px]">Tags </h3>
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
                        <FormatListBulletedIcon
                          sx={{ fontSize: "15px", color: "#B1B5D0" }}
                        />
                        <h3 className="text-[14px]">List </h3>
                      </div>
                      <div>
                        <h3 className="text-[14px] text-[#B1B5D0] font-[500]">
                          Set ...
                        </h3>
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={4}>
                    <div className="flex flex-col pl-4">
                      <div className="flex space-x-2 items-center">
                        <DateRangeIcon
                          sx={{ fontSize: "15px", color: "#B1B5D0" }}
                        />
                        <h3 className="text-[14px]">Dates</h3>
                      </div>
                      <div>
                        <h3 className="text-[14px] text-[#B1B5D0] font-[500]">
                          Set ...
                        </h3>
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={4}>
                    <div className="flex flex-col">
                      <div className="flex space-x-2 items-center">
                        <CheckIcon
                          sx={{ fontSize: "15px", color: "#B1B5D0" }}
                        />
                        <h3 className="text-[14px]">Dependency</h3>
                      </div>
                      <div>
                        <h3 className="text-[14px] text-[#B1B5D0] font-[500]">
                          0/0{" "}
                        </h3>
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={4}>
                    <div className="flex flex-col">
                      <div className="flex space-x-2 items-center">
                        <TagIcon sx={{ fontSize: "15px", color: "#B1B5D0" }} />
                        <h3 className="text-[14px]">Story Points</h3>
                      </div>
                      <div>
                        <h3 className="text-[14px] text-[#B1B5D0] font-[500]">
                          0/0{" "}
                        </h3>
                      </div>
                    </div>
                  </Grid>
                  <div className="flex item-center w-full mt-12">
                    {subTaskList.map((val) => {
                      return (
                        <div
                          onClick={() => setName(val.name)}
                          className={`w-full cursor-pointer text-[13px] font-[400] flex items-center justify-around h-[30px] bg-gray-50 border-b border-b-gray-200  border-t border-t-gray-200`}
                        >
                          <h1
                            className={
                              val.name === name
                                ? "border-2 border-b-[#111631] border-l-transparent border-t-transparent border-r-transparent cursor-pointer"
                                : ""
                            }
                          >
                            {val?.name} &nbsp;{val.score}
                          </h1>
                        </div>
                      );
                    })}
                  </div>
                  {/* tags rendering  */}
                  <div className="w-full">
                    {name === "Subtasks" ? (
                      <SubTaskInnerList />
                    ) : (
                      <Attachments mileStoneId={mileStoneId} />
                    )}
                  </div>
                </Grid>
              </Box>
            </div>
          </Grid>

          <Grid item xs={6}>
            {subtaskChild ? (
              <div>
                <MilestoneSubTaskChild />
              </div>
            ) : (
              <div className="relative h-full">
                <div className="flex justify-between items-center pr-4">
                  <div className="flex space-x-2 items-center">
                    <TextsmsIcon sx={{ fontSize: "15px", color: "#B1B5D0" }} />
                    <h1> 1comments </h1>
                  </div>
                  <h1>icons </h1>
                </div>
                <Divider sx={{ marginRight: "1rem" }}>
                  <h3 className="text-[14px]">Today</h3>
                </Divider>
                {/* messages will start from here  */}
                <div>
                  <h1>messages listing</h1>
                  <h1>messages listing</h1>
                </div>

                <div className="absolute bottom-0 w-full z-50">
                  <form>
                    <div className="flex space-x-2 items-center mr-6">
                      <div className="absolute left-4">
                        <AddIcon sx={{ color: "#02BBAB" }} />
                      </div>
                      <div className="w-full">
                        <input className="bg-white outline:none w-full outline-none border border-gray-200 pl-8 h-[40px] rounded-md " />
                      </div>
                      <div className="absolute items-center right-8 flex space-x-2">
                        <div className="cursor-pointer">
                          <EmojiEmotionsIcon
                            sx={{ fontSize: "18px", color: "#9198CD" }}
                          />
                        </div>
                        <div>
                          <MicIcon
                            sx={{ fontSize: "18px", color: "#9198CD" }}
                          />
                        </div>
                        <div>
                          <MicIcon
                            sx={{ fontSize: "18px", color: "#9198CD" }}
                          />
                        </div>
                        <div>
                          <button
                            type="submit"
                            className="inline-flex justify-center p-1 text-white bg-[#02bbab] rounded-md"
                          >
                            <NearMeIcon />
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </Grid>
        </Grid>
      </Fade>
    </React.Fragment>
  );
};

export default MilestoneSubTask;

const Attachments = ({ mileStoneId }) => {
  const [taskVal, seTtaskVal] = useState("");
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["addMilestoneTask"],
    mutationFn: (data) => axios.post("/task/milestone", data),
    onSuccess: (data) => {
      seTtaskVal("");
      enqueueSnackbar(data.data.message, { variant: "success" });
      queryClient.invalidateQueries(["get-milestone"]);
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  const handleSubmit = () => {
    if (!taskVal) return;
    let payload = {
      name: taskVal,
      mileStone_Id: mileStoneId,
    };
    mutate(payload);
  };
  return (
    <div className=" w-full">
      <h1 className="px-[2rem] text-[14px] mt-4">Attachments</h1>
      <div className="flex justify-between w-full px-[2rem]">
        <div className="flex space-x-1 items-center">
          <Checkbox />
          <div>
            <h3 className="text-[13px]">task list attachments</h3>
          </div>
        </div>
        <div className="flex space-x-2 items-center">
          <div className="flex justify-center items-center h-[20px] rounded-md w-[20px] bg-white text-[#00A99B] border border-gray-200">
            <MapsUgcIcon sx={{ fontSize: "16px" }} />
          </div>
          <div className="flex justify-center items-center h-[20px] rounded-md w-[20px] bg-white text-[#00A99B] border border-gray-200">
            <PersonAddIcon sx={{ fontSize: "16px" }} />
          </div>

          <div>
            <MoreHorizIcon sx={{ fontSize: "17px" }} />
          </div>
        </div>
      </div>

      {/* input field */}

      <div className="mt-[0.1px] relative">
        <span className="absolute top-1 px-6">
          <AddIcon sx={{ fontSize: "22px", color: "#B1B5D0" }} />
        </span>
        <input
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
          value={taskVal}
          onChange={(e) => seTtaskVal(e.target.value)}
          placeholder="Add a new Task ..."
          className="outline-none w-full border-t text-[12px] font-[500] border-gray-200 border-b h-[35px] pl-[3rem]"
        />
      </div>
      <div className="mt-4 w-[92%] m-auto">
        <label>
          <div className="flex ml-2 justify-center items-center h-[65px] w-full border-dashed border border-[#00A99B] rounded bg-[#F2F8FA] cursor-pointer">
            <AttachFileIcon sx={{ fontSize: "16px", color: "#B1B5D0" }} />
            &nbsp;<small className="text-[#B1B5D0]">choose files</small>
          </div>
          <input type="file" accept="" className="hidden" />
        </label>
      </div>
    </div>
  );
};

const SubTaskInnerList = () => {
  const dispatch = useDispatch();
  return (
    <div className=" w-full">
      <h1 className="px-[2rem] text-[14px] mt-4">Progress</h1>
      <div className="flex justify-between w-full px-[2rem]">
        <div className="flex space-x-1 items-center">
          <Checkbox />
          <div>
            <h3
              className="text-[13px] cursor-pointer"
              onClick={() => dispatch(subChildTaskShow())}
            >
              task list text
            </h3>
          </div>
        </div>
        <div className="flex space-x-2 items-center">
          <div className="flex justify-center items-center h-[20px] rounded-md w-[20px] bg-white text-[#00A99B] border border-gray-200">
            <MapsUgcIcon sx={{ fontSize: "16px" }} />
          </div>
          <div className="flex justify-center items-center h-[20px] rounded-md w-[20px] bg-white text-[#00A99B] border border-gray-200">
            <PersonAddIcon sx={{ fontSize: "16px" }} />
          </div>

          <div>
            <MoreHorizIcon sx={{ fontSize: "17px" }} />
          </div>
        </div>
      </div>

      <div className="mt-[0.1px] relative">
        <span className="absolute top-1 px-6">
          <AddIcon sx={{ fontSize: "22px", color: "#B1B5D0" }} />
        </span>
        <input
          placeholder="Add a new Task ..."
          className="outline-none w-full border-t text-[12px] font-[500] border-gray-200 border-b h-[35px] pl-[3rem]"
        />
      </div>
      <div className="mt-4 w-[92%] m-auto">
        <label>
          <div className="flex ml-2 justify-center items-center h-[65px] w-full border-dashed border border-[#00A99B] rounded bg-[#F2F8FA] cursor-pointer">
            <AttachFileIcon sx={{ fontSize: "16px", color: "#B1B5D0" }} />
            &nbsp;<small className="text-[#B1B5D0]">choose files</small>
          </div>
          <input type="file" accept="" className="hidden" />
        </label>
      </div>
    </div>
  );
};
