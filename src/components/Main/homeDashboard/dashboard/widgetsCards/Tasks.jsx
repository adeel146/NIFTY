import React from "react";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ShortcutIcon from "@mui/icons-material/Shortcut";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Divider } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import DoneIcon from "@mui/icons-material/Done";

const Tasks = ({ setAssignWidth, assignCheck, setAssignCheck }) => {
  function MinWidth() {
    setAssignWidth(4);
    setAssignCheck(true);
  }
  function MaxWidth() {
    setAssignWidth(8);
    setAssignCheck(false);
  }

  function changeWidth() {
    if (assignCheck) {
      MaxWidth();
    } else {
      MinWidth();
    }
  }
  return (
    <div className="">
      <div className="flex justify-between border border-t-4 border-t-[#ff6650] bg-white rounded-lg p-4">
        <div className="flex  items-center space-x-[2px]">
          <DoneIcon sx={{ color: "#9798C4", fontSize: "20px" }} />
          <h3>Tasks </h3>
          <KeyboardArrowRightIcon sx={{ fontSize: "25px", color: "#9798C4" }} />
        </div>

        <div className="flex space-x-2 items-center">
          <button className="btn btn-transparent  text-md text-[#009084] font-semibold">
            Assign to Me
          </button>
          <div onClick={changeWidth} className="cursor-pointer">
            <OpenInFullIcon sx={{ fontSize: "18px" }} />
          </div>
        </div>
      </div>
      <div className="relative h-[100%] ">
        <div className=" font-sans h-[400px] overflow-auto bg-white border border-gray-200 rounded-lg">
          {[1, 2, 3, 4, 5, 6].map((val) => {
            return (
              <div>
                <div className="flex justify-between items-center px-4 py-2">
                  <div className="flex space-x-2 items-center">
                    <div>
                      <input type="checkbox" className="" />
                    </div>
                    <h3>some text </h3>
                  </div>
                  <div className="flex space-x-1 items-center">
                    <div className="">
                      <img
                        className="w-[25px] h-[25px] rounded-md"
                        src="https://media.istockphoto.com/id/517188688/photo/mountain-landscape.jpg?s=612x612&w=0&k=20&c=A63koPKaCyIwQWOTFBRWXj_PwCrR4cEoOw2S9Q7yVl8="
                      />
                    </div>
                    <div className="w-[25px] h-[25px] border border-gray-300 rounded-md bg-white flex items-center justify-center">
                      <Tooltip title="Add assignee" arrow>
                        <PersonAddIcon
                          sx={{ color: "#00A99B", fontSize: "18px" }}
                        />
                      </Tooltip>
                    </div>
                  </div>
                </div>
                <div className="pl-10">
                  <h3 className="text-[14px] text-[#9798C4]">
                    Lorem ipsum some text message
                  </h3>
                </div>
                <div className="mt-2">
                  <Divider />
                </div>
              </div>
            );
          })}
        </div>

        <div className="absolute bottom-0 w-[98.4%] h-[40px] mr-2">
          <input
            className="outline-none h-[40px] rounded-md border border-gray-200 w-full pl-2"
            placeholder="Enter ..."
          />
        </div>
      </div>
    </div>
  );
};

export default Tasks;
