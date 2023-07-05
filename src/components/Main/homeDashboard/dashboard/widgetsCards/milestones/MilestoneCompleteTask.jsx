import React from "react";
import ListAltIcon from "@mui/icons-material/ListAlt";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import DoneIcon from "@mui/icons-material/Done";
import { Divider } from "@mui/material";
import moment from "moment";

const MilestoneCompleteTask = ({ tasks }) => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex space-x-2 items-center">
          <ListAltIcon sx={{ color: "#B1B5D0", fontSize: "15px" }} />
          <h3 className="text-[14px]">Tasks</h3>
        </div>
        <div className="flex space-x-3 items-center ">
          <CompareArrowsIcon sx={{ color: "#B1B5D0", fontSize: "22px" }} />
          <h3 className="text-[14px]">Status</h3>
        </div>
      </div>
      {tasks?.completeTasks?.map((task) => {
        return (
          <div key={task.id} className="bg-[#FAFBFD] h-[70px] mt-6">
            <h3 className="pl-7 text-[#9798C8]">{task.taskName}</h3>
            <div className="flex space-x-3 items-center text-[#9798C8]">
              <div className="flex space-x-2 items-center text-[13px]">
                <DoneIcon sx={{ fontSize: "18px" }} />
                <h3>{moment(task.startDate).format("MMM DD, h:mm")} by shehreyar sajid</h3>
              </div>
              <div className="flex space-x-2 items-center text-[13px]">
                <DoneIcon sx={{ fontSize: "18px" }} />
                <h3>Jun 6 2020</h3>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MilestoneCompleteTask;
