import { Button, CircularProgress } from "@mui/material";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import ProjectCreatedIcon from "/public/icons/ProjectCreatedIcon";
import MilestoneCreatedIcon from "/public/icons/MilestoneCreatedIcon";
import TaskCompletedIcon from "/public/icons/TaskCompletedIcon";
import UploadedFileIcon from "/public/icons/UploadedFileIcon";
import { useInView } from "react-intersection-observer";

const Activity = () => {
  const { projectId } = useParams();
  const { ref, inView } = useInView();

  const ActionType = [
    {
      name: "Project Created ",
      value: 1,
      Icon: <ProjectCreatedIcon style={{ color: "#009084" }} />,
    },
    {
      name: "Milestone  ",
      Icon: <MilestoneCreatedIcon />,
      value: 2,
    },
    {
      name: "TaskCompleted  ",
      Icon: <TaskCompletedIcon style={{ color: "#009084" }} />,
      value: 3,
    },
    {
      name: "AddAttachment  ",
      Icon: <UploadedFileIcon style={{ color: "#009084" }} />,
      value: 4,
    },
    {
      name: "TaskCreated  ",
      Icon: <TaskCompletedIcon style={{ color: "#009084" }} />,
      value: 5,
    },
    {
      name: "Tag",
      Icon: <TaskCompletedIcon style={{ color: "#009084" }} />,
      value: 6,
    },
    {
      name: "TaskAssigned",
      Icon: <TaskCompletedIcon style={{ color: "#009084" }} />,
      value: 7,
    },
    {
      name: "TaskDateChanged ",
      Icon: <TaskCompletedIcon style={{ color: "#009084" }} />,
      value: 8,
    },
  ];
  const { hasNextPage, isFetchingNextPage, fetchNextPage, data, isLoading } =
    useInfiniteQuery(
      ["get-logs-list"],
      ({ pageParam = 0 }) =>
        axios.get(`dashboard/projects_logs/${projectId}`, {
          params: {
            page_size: 10,
            page_index: pageParam,
          },
        }),
      {
        getNextPageParam: (lastPage) => {
          return lastPage.data.page_number + 1 < lastPage.data.total_pages
            ? lastPage.data.page_number + 1
            : undefined;
        },
      }
    );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);
  return (
    <div>
      <div className=" mt-2 rounded-lg  border-gray-200  block py-3 pl-4 pr-2 text-black  h-[270px] overflow-y-auto">
        <div className="project-activity nice-scroll ">
          <div>
            {data?.pages?.map((page, pageIndex) =>
              page.data?.data.length === 0 ? (
                <div key={pageIndex}>No Date</div>
              ) : (
                page.data?.data?.map((card, innerIndex) => (
                  <div key={card.id} className="!w-full my-[10px]">
                    <a className="activity-item flex" href="#">
                      <div className="after:content-[''] after:border after:border-dashed after:border-l-[#C4C8E2]  after:flex-auto flex items-center flex-col mr-3  activity-item-side relative top-[8px] pr-2 ">
                        <div className="activity-item-icon">
                          <span className="flex items-center justify-center bg-[#fff] border-[1px] rounded-full shadow-lg w-6 h-6  ">
                            {
                              ActionType.find(
                                (obj) => obj.value === card.actionType
                              )?.Icon
                            }
                          </span>
                        </div>
                      </div>
                      <div className="activity-item-main hover:text-[#00A99B] text-[#8394bb] text-sm mb-2 pt-2 pr-3 font-Manrope">
                        <div className="activity-item-body ">
                          <span className="font-semibold text-[#2f2f2f]">
                            {card.actionUser}
                          </span>{" "}
                          {
                            ActionType.find(
                              (obj) => obj.value === card.actionType
                            )?.name
                          }
                          <span className="font-semibold text-[#2f2f2f]">
                            {card.text}
                          </span>
                        </div>
                        <div className="activity-item-foot">
                          <time className="text-[12px]">
                            {moment(card.when).format("MMM D, YYYY [at] h:mmA")}
                          </time>
                        </div>
                        <div className="activity-item-additional" />
                      </div>
                    </a>
                  </div>
                ))
              )
            )}
            <div className="flex justify-center">
              {isFetchingNextPage ? (
                <CircularProgress size={30} />
              ) : hasNextPage ? (
                <Button ref={ref} onClick={fetchNextPage}>
                  {" "}
                  Load More
                </Button>
              ) : (
                <div className="bg-gray-300 p-2 px-5 rounded ">End</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activity;
