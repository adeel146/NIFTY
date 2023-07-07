import React from "react";
import GantChart from "./SyncFusionGanttChart";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

function SyncfusionGanttChart() {
  let { projectId } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const { data: milestoneData = [], isLoading } = useQuery(
    ["get-milestone", projectId],
    async () => {
      return axios.get(`milestone/${projectId}`);
    },
    {
      select: (res) => {
        return res?.data?.data?.map((val) => {
          return {
            ...val,
            progress: Number(val.completePercentage),
            tasks: val.tasks?.map((task) => {
              return {
                ...task,
                progress: Number(task.completePercentage),
              };
            }),
          };
        });
      },
      onError: (data) => {
        enqueueSnackbar(data.response.data.message, { variant: "error" });
      },
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[25em]">
        <CircularProgress />
      </div>
    );
  }
  return milestoneData.length > 0 && <GantChart data={milestoneData} />;
}

export default SyncfusionGanttChart;
