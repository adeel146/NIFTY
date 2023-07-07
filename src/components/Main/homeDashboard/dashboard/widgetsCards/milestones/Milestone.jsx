import React, { useState } from "react";
import Fade from "react-reveal/Fade";
import ShortcutIcon from "@mui/icons-material/Shortcut";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddIcon from "@mui/icons-material/Add";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { useDispatch } from "react-redux";
import { openMilestone } from "redux/reducers/mainDashbord";
import MileStoneDrawer from "./MileStoneDrawer";
import AddMileStoneDialog from "routes/roadMap/AddMileStoneModal";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import moment from "moment";

const Milestone = ({ setCardWidth, setCheck, check }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mileStoneId, setMileStoneId] = useState();
  const dispatch = useDispatch();
  let { projectId } = useParams();

  const { data: mileStoneCardList } = useQuery(
    ["milestone_list", projectId],
    () => {
      return axios.get(`/milestone/listing/${projectId}`);
    },
    {
      select: (res) => {
        return res?.data?.data;
      },
      refetchOnWindowFocus: false,
    }
  );

  function MinWidth() {
    setCardWidth(4);
    setCheck(true);
  }
  function MaxWidth() {
    setCardWidth(8);
    setCheck(false);
  }

  function changeWidth() {
    if (check) {
      MaxWidth();
    } else {
      MinWidth();
    }
  }

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };
  console.log(mileStoneCardList,"mileStoneCardList")

  return (
    <div>
      <div className="mb-20 ">
        <div className="flex justify-between border border-t-4 border-t-[#ff6650] bg-white rounded-lg rounded-b-none border-b-0 p-3 w-full">
          <h3 className="text-[15px] flex font-semibold text-[#2f2f2f]">
            <span className="mr-2">
              <ShortcutIcon sx={{ color: "#9198CA" }} />
            </span>{" "}
            Milestones{" "}
            <span className="ml-2">
              <ChevronRightIcon sx={{ color: "#9198CA" }} />
            </span>
          </h3>
          <div className="flex space-x-1 items-center">
            <AddIcon sx={{ color: "#009084", fontSize: "14px" }} />
            <button
              className="btn btn-transparent pr-2 text-[#009084] font-medium text-sm flex items-center"
              onClick={handleOpen}
            >
              Add a Milestone
            </button>
            <div
              onClick={changeWidth}
              className="cursor-pointer bg-[#f7f9fd] px-[2px] text-[#8e94bb] border border-[#f0f3fb] rounded"
            >
              <OpenInFullIcon sx={{ fontSize: "18px" }} />
            </div>
          </div>
        </div>

        <div className=" w-full font-sans h-[400px] overflow-x-auto bg-white border border-gray-200 rounded-lg rounded-t-none">
          <div className="px-[10px] w-full mt-3">
            {mileStoneCardList?.map((val) => {
              return (
                <div
                  key={val?.id}
                  onClick={() => {
                    dispatch(openMilestone(val?.id));
                  }}
                  className="bg-white cursor-pointer mt-2 rounded-[4px] shadow-sm  border h-[120px]  border-gray-200 border-l-4 border-l-[#9198CA]"
                >
                  <div className="flex justify-between items-center px-2 pt-4">
                    <div className="flex space-x-1 items-center">
                      <h3 className="text-[#2f2f2f] text-sm font-Manrope font-semibold">
                        {val?.name}
                      </h3>
                      <span>
                        <MoreHorizIcon
                          sx={{ color: "#9198CA", fontWeight: "500" }}
                        />
                      </span>
                    </div>
                    <span className="entry-progress relative text-[14px] font-semibold -right-2 tag-pill completed float-right bg-[#d9f2f0] rounded-xl rounded-r-none pl-2 pr-2 text-[#009084] ">
                      {val?.completedPercentage + "%"}
                    </span>
                  </div>
                  <div className="flex space-x-2 px-2 pt-2 items-center">
                    <DateRangeIcon
                      sx={{
                        fontSize: "14px",
                        color: "#9198CA",
                        fontWeight: "500",
                      }}
                    />
                    <p className="text-[13px] text-[#9198CA] font-semibold">
                      {moment(val?.startDate).format("ll")}
                    </p>
                  </div>
                  <div className="flex space-x-2 px-2 pt-1 items-center">
                    <DateRangeIcon
                      sx={{ fontSize: "14px", color: "#9198CA" }}
                    />
                    <p className="text-[13px] font-semibold text-[#009084]">
                      Add a task ...
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <MileStoneDrawer mileStoneId={mileStoneId} />
      <AddMileStoneDialog
        isOpen={isOpen}
        handleClose={handleClose}
        queryKeySet="milestone_list"
      />
    </div>
  );
};

export default Milestone;
