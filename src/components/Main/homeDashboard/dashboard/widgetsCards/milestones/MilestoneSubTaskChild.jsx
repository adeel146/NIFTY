import React from "react";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CloseIcon from "@mui/icons-material/Close";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Fade from "react-reveal/Fade";
import { useDispatch } from "react-redux";
import TextsmsIcon from "@mui/icons-material/Textsms";
import NearMeIcon from "@mui/icons-material/NearMe";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import MicIcon from "@mui/icons-material/Mic";
import { Box, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { subChileTaskHide } from "redux/actions";
import { useSelector } from "react-redux";

const MilestoneSubTaskChild = () => {
  const dispatch = useDispatch();

  return (
    <div className="z-50 ">
      <Fade right>
        <div className="flex justify-between mr-5 items-center">
          <div className="flex space-x-2 items-center">
            <div
              className="cursor-pointer text-[#B1B5D0 ]"
              onClick={() => dispatch(subChileTaskHide())}
            >
              <ChevronLeftIcon />
            </div>
          </div>
          <div className="cursor-pointer flex items-center space-x-2 text-[#B1B5D0] text-[12px] ">
            <MoreHorizIcon sx={{ fontSize: "18px" }} />
            <div onClick={() => dispatch(subChileTaskHide())}>
              <CloseIcon sx={{ fontSize: "18px" }} />
            </div>
          </div>
        </div>
        <div className="relative h-[85vh]">
          <div className="flex justify-between items-center pr-4">
            <div className="flex space-x-2 items-center">
              <TextsmsIcon sx={{ fontSize: "15px", color: "#B1B5D0" }} />
              <h1> 1comments </h1>
            </div>
            <h1>icons </h1>
          </div>
          <Divider sx={{ marginRight: "1rem" }}>
            <h3 className="text-[14px]">Today Task</h3>
          </Divider>
          {/* messages will start from here  */}
          <div>
            <h1>messages listing sub child </h1>
            <h1>messages listing sub child</h1>
            <h1>messages listing sub child</h1>
            <h1>messages listing sub child</h1>
            <h1>messages listing sub child</h1>
            <h1>messages listing sub child</h1>
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
                    <MicIcon sx={{ fontSize: "18px", color: "#9198CD" }} />
                  </div>
                  <div>
                    <MicIcon sx={{ fontSize: "18px", color: "#9198CD" }} />
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
      </Fade>
    </div>
  );
};

export default MilestoneSubTaskChild;
