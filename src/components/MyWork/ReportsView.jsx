import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";
import Chart from "react-apexcharts";
import DownloadIcon from "@mui/icons-material/Download";
import "apexcharts/dist/apexcharts.css";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  useGetReportsByTasksCreated,
  useGetReportsMonthWise,
  useGetReportsStats,
  useGetReportsUserwise,
  useGetUpcomingtasks,
} from "hooks/Reports";

const ReportsViewTasks = ({ selectedProjects }) => {
  let projectId = selectedProjects.length ? selectedProjects[0].id : 0;
  const { reportsStats } = useGetReportsStats(projectId);
  const { ReportsUserwise } = useGetReportsUserwise(projectId);
  const { ReportsMonthWise } = useGetReportsMonthWise(projectId);
  const { ReportsByTasksCreated } = useGetReportsByTasksCreated(projectId);
  const { ReportsUpcoming } = useGetUpcomingtasks(projectId);

  const [
    incompleteTasksByProjectChartData,
    setIncompleteTasksByProjectChartData,
  ] = useState(null);
  const [completedTasksByMonth, setCompletedTasksByMonth] = useState(null);
  const [tasksCreatedByMonth, setTasksCreatedByMonth] = useState(null);
  const [upcomingTasksComing, setUpcomingTasksComing] = useState(null);

  useEffect(() => {
    if (ReportsUserwise?.labels?.length) {
      const barChartOptions = {
        options: {
          chart: {
            type: "bar",
          },
          plotOptions: {
            bar: {
              horizontal: false,
              endingShape: "rounded",
            },
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            show: true,
            width: 2,
            colors: ["transparent"],
          },
          xaxis: {
            categories: ReportsUserwise?.labels?.map((item) =>
              item === "Unassigned" ? item : item.name
            ),
          },
          yaxis: {
            show: true,
          },
          colors: ["rgb(255, 158, 170)"],
          fill: {
            opacity: 1,
          },
          tooltip: {
            show: true,
          },
        },
        series: [
          {
            name: "Tasks",
            data: ReportsUserwise?.counts?.map((item) => item),
          },
        ],
      };
      setIncompleteTasksByProjectChartData(barChartOptions);
    }
  }, [ReportsUserwise]);
  useEffect(() => {
    if (ReportsMonthWise) {
      const pieChartOptions = {
        options: {
          chart: {
            type: "donut",
          },
          dataLabels: {
            enabled: false,
          },
          labels: ["Upcoming", "Overdue", "Completed"],
          colors: ["#144272", "#8696FE", "#C4B0FF", "#9AC5F4"],
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  total: {
                    showAlways: true,
                    show: true,
                  },
                },
              },
            },
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200,
                },
                legend: {
                  show: false,
                },
              },
            },
          ],
        },
        series: [
          ReportsMonthWise.upcomingTasks,
          ReportsMonthWise.overDue,
          ReportsMonthWise.completedTasks,
        ],
      };

      setCompletedTasksByMonth(pieChartOptions);
    }
  }, [ReportsMonthWise]);
  useEffect(() => {
    if (ReportsByTasksCreated?.labels?.length) {
      const totalTasksByCreatorChartOptions = {
        options: {
          chart: {
            height: 350,
            type: "rangeBar",
            zoom: {
              enabled: false,
            },
          },
          plotOptions: {
            bar: {
              isDumbbell: true,
              columnWidth: 3,
              dumbbellColors: [["#4942E4", "#8696FE"]],
            },
          },
          legend: {
            show: false,
            showForSingleSeries: false,
            position: "top",
            horizontalAlign: "left",
            customLegendItems: ["Product A", "Product B"],
          },
          fill: {
            type: "gradient",
            gradient: {
              type: "vertical",
              gradientToColors: ["#8696FE"],
              inverseColors: true,
              stops: [0, 100],
            },
          },
          grid: {
            xaxis: {
              lines: {
                show: true,
              },
            },
            yaxis: {
              lines: {
                show: false,
              },
            },
          },
          xaxis: {
            tickPlacement: "on",
            labels: {
              formatter: (value) => {
                return value;
              },
            },
          },
        },
        series: [
          {
            data: ReportsByTasksCreated?.labels.map((label, index) => ({
              x: label.name,
              y: [0, ReportsByTasksCreated?.counts[index]],
            })),
          },
        ],
      };
      setTasksCreatedByMonth(totalTasksByCreatorChartOptions);
    }
  }, [ReportsByTasksCreated]);
  useEffect(() => {
    if (ReportsUpcoming.length) {
      const rangeBarChartOptions = {
        options: {
          chart: {
            height: 350,
            type: "rangeBar",
            zoom: {
              enabled: false,
            },
          },
          plotOptions: {
            bar: {
              isDumbbell: true,
              columnWidth: 3,
              dumbbellColors: [["#C4B0FF", "#9336B4"]],
            },
          },
          legend: {
            show: false,
            showForSingleSeries: false,
            position: "top",
            horizontalAlign: "left",
            customLegendItems: ["Product A", "Product B"],
          },
          fill: {
            type: "gradient",
            gradient: {
              type: "vertical",
              gradientToColors: ["#9336B4"],
              inverseColors: true,
              stops: [0, 100],
            },
          },
          grid: {
            xaxis: {
              lines: {
                show: true,
              },
            },
            yaxis: {
              lines: {
                show: false,
              },
            },
          },
          xaxis: {
            tickPlacement: "on",
            labels: {
              formatter: (value) => {
                return value;
              },
            },
          },
        },
        series: [
          {
            data: ReportsUpcoming?.labels.map((label, index) => ({
              x: label.name,
              y: [0, ReportsUpcoming?.counts[index]],
            })),
          },
        ],
      };
      setUpcomingTasksComing(rangeBarChartOptions);
    }
  }, [ReportsUpcoming]);
  console.log(upcomingTasksComing);
  return (
    <div className=" px-4 py-5 w-full   ">
      <Grid container spacing={2} className="  px-4 py-5  flex flex-row  ">
        {[
          {
            title: "Completed Tasks",
            amount: reportsStats?.completedTasks ?? 0,
          },
          {
            title: "Incomplete Tasks",
            amount: reportsStats?.incompleteTasks ?? 0,
          },
          { title: "Overdue Tasks", amount: reportsStats?.overDueTasks ?? 0 },
          { title: "Total Tasks", amount: reportsStats?.totalTasks ?? 0 },
        ].map((el) => (
          <Grid item xs={3}>
            <Card>
              <CardContent>
                <div className="flex flex-col items-center gap-4 ">
                  <h1 className=" font-[400] text-[18px]">{el.title}</h1>
                  <h1 className=" font-[300] text-[28px]">
                    {el?.amount?.toLocaleString()}
                  </h1>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
        <Grid item xs={6}>
          <Card>
            <CardHeader
              sx={{
                borderBottom: "1px solid #ebecf4",
              }}
              title={
                <p className="text-[18px] font-[500]">Users tasks by project</p>
              }
            />
            <CardContent className="!px-[0px] !pb-[0px]">
              <Box height={300}>
                {incompleteTasksByProjectChartData ? (
                  <Chart
                    options={incompleteTasksByProjectChartData?.options}
                    series={incompleteTasksByProjectChartData?.series}
                    type="bar"
                    width="100%"
                    height="300"
                  />
                ) : (
                  <p className="text-[13px] text-center">No Data Found</p>
                )}
              </Box>
              <Box
                height={50}
                className="flex items-center border-t border-gray-300 mt-[17px] p-4"
              >
                <FilterListIcon className="text-[10px] mr-[10px]" />
                <p className="text-[10px] font-[500] ">
                  Users tasks by project
                </p>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardHeader
              sx={{
                borderBottom: "1px solid #ebecf4",
              }}
              title={
                <p className="text-[18px] font-[500]">
                  Tasks by complettion status this month
                </p>
              }
            />
            <CardContent className="!px-[0px] !pb-[0px]">
              <Box height={300}>
                {completedTasksByMonth && (
                  <Chart
                    options={completedTasksByMonth?.options}
                    series={completedTasksByMonth?.series}
                    type="donut"
                    width="100%"
                    height="300"
                  />
                )}
              </Box>
              <Box
                height={50}
                className="flex items-center border-t border-gray-300 mt-[17px] p-4"
              >
                <FilterListIcon className="text-[10px] mr-[10px]" />
                <p className="text-[10px] font-[500] ">
                  Tasks by complettion status this month
                </p>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardHeader
              sx={{
                borderBottom: "1px solid #ebecf4",
              }}
              title={
                <p className="text-[18px] font-[500]">
                  Upcoming tasks by assignee this week
                </p>
              }
            />
            <CardContent className="!px-[0px] !pb-[0px]">
              <Box height={300}>
                {upcomingTasksComing ? (
                  <Chart
                    options={upcomingTasksComing.options}
                    series={upcomingTasksComing.series}
                    type="rangeBar"
                    width="100%"
                    height="300"
                  />
                ) : (
                  <p className="text-[13px] text-center">No Data Found</p>
                )}
              </Box>
              <Box
                height={50}
                className="flex items-center border-t border-gray-300 mt-[17px] p-4"
              >
                <FilterListIcon className="text-[10px] mr-[10px]" />
                <p className="text-[10px] font-[500] ">
                  Upcoming tasks by assignee this week
                </p>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardHeader
              sx={{
                borderBottom: "1px solid #ebecf4",
              }}
              title={
                <p className="text-[18px] font-[500]">Total tasks by creator</p>
              }
            />
            <CardContent className="!px-[0px] !pb-[0px]">
              <Box height={300}>
                {tasksCreatedByMonth ? (
                  <Chart
                    options={tasksCreatedByMonth?.options}
                    series={tasksCreatedByMonth?.series}
                    type="rangeBar"
                    width="100%"
                    height="300"
                  />
                ) : (
                  <p className="text-[13px] text-center">No Data Found</p>
                )}
              </Box>
              <Box
                height={50}
                className="flex items-center border-t border-gray-300 mt-[17px] p-4"
              >
                <FilterListIcon className="text-[10px] mr-[10px]" />
                <p className="text-[10px] font-[500] ">
                  Total tasks by creator
                </p>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardHeader
              sx={{
                borderBottom: "1px solid #ebecf4",
              }}
              title={
                <p className="text-[18px] font-[500]">
                  Projects by project status
                </p>
              }
            />
            <CardContent className="!px-[0px] !pb-[0px]">
              <Box height={300}>
                <Chart
                  options={projectByProjectStatus.options}
                  series={projectByProjectStatus.series}
                  type="donut"
                  width="100%"
                  height="300"
                />
              </Box>
              <Box
                height={50}
                className="flex items-center border-t border-gray-300 mt-[17px] p-4"
              >
                <FilterListIcon className="text-[10px] mr-[10px]" />
                <p className="text-[10px] font-[500] ">
                  Projects by project status
                </p>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardHeader
              sx={{
                borderBottom: "1px solid #ebecf4",
              }}
              title={<p className="text-[18px] font-[500]">Goals by team</p>}
            />
            <CardContent className="!px-[0px] !pb-[0px]">
              <Box height={300}>
                <Chart
                  options={goalsByTeamChart.options}
                  series={goalsByTeamChart.series}
                  type="line"
                  width="100%"
                  height="300"
                />
              </Box>
              <Box
                height={50}
                className="flex items-center border-t border-gray-300 mt-[17px] p-4"
              >
                <FilterListIcon className="text-[10px] mr-[10px]" />
                <p className="text-[10px] font-[500] ">Goals by team</p>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default ReportsViewTasks;

const projectByProjectStatus = {
  options: {
    chart: {
      type: "donut",
    },
    dataLabels: {
      enabled: false,
    },
    labels: ["Completed"],
    colors: ["#B0A4A4"],
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              showAlways: true,
              show: true,
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
  },
  series: [100],
};

const goalsByTeamChart = {
  options: {
    chart: {
      height: 350,
      type: "line",
      zoom: {
        enabled: false,
      },
    },
    colors: ["#DDE6ED"],

    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    title: {
      text: "Product Trends by Month",
      align: "left",
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
      ],
    },
  },
  series: [
    {
      name: "Desktops",
      data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
    },
  ],
};
