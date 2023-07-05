import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardHeader,
  Divider,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { styled } from "@mui/styles";
import Chart from "react-apexcharts";
import SouthIcon from "@mui/icons-material/South";
import GaugeChart from "react-gauge-chart";
import "./Financial.css";
import AddPaymentDialog from "./AddPaymentDIalog";
import {
  useGetProjectFinance,
  useGetProjectFinanceSummary,
} from "hooks/Finance";
import DeleteIcon from "@mui/icons-material/Delete";
import { formateDate } from "utils";
import PanToolIcon from "@mui/icons-material/PanTool";
import PaidIcon from "@mui/icons-material/Paid";
import DeletePayment from "./DeletePayment";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import "./Financial.css";

const Financial = () => {
  const [isAddPayment, setIsAddPayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [isDeletePayment, setIsDeletePayment] = useState(false);
  const [pieChartData, setPieChartData] = useState(null);

  const id = location.pathname.split("/").pop();

  const { projectFinance } = useGetProjectFinance({ id: id });
  const { projectFinanceSummary } = useGetProjectFinanceSummary({ id: id });

  useEffect(() => {
    if (projectFinanceSummary?.months?.length) {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;

      const lastFourMonths = [];
      const lastFourMonthsData = [];

      for (let i = 3; i >= 0; i--) {
        const month = (currentMonth - i + 12) % 12;
        const monthLabel = new Date(currentDate.getFullYear(), month, 1)
          .toLocaleString("default", { month: "short" })
          .slice(0, 3);

        lastFourMonths.push(monthLabel);
        const monthData = projectFinanceSummary?.months?.find(
          (m) => m.month === month
        );
        lastFourMonthsData.push(monthData ? monthData.budget : 0);
      }

      const chartData = {
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
            categories: lastFourMonths,
          },
          yaxis: {
            show: false,
          },
          colors: ["#00A99B", "#FF0000"],
          fill: {
            opacity: 1,
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return "$ " + val + " thousands";
              },
            },
          },
        },
        series: [
          {
            name: "Paid",
            data: projectFinanceSummary.months.map(
              (item) => item.approvedBudget
            ),
          },
          {
            name: "Un Paid",
            data: projectFinanceSummary.months.map(
              (item) => item.pendingBudget
            ),
          },
        ],
      };
      setPieChartData(chartData);
    }
  }, [projectFinanceSummary]);

  const handleAddPaymentClose = () => {
    setIsAddPayment(false);
    setSelectedPayment(null);
  };
  const handleDeletePaymentClose = () => {
    setSelectedPayment(null);
    setIsDeletePayment(false);
    setSelectedPaymentId(null);
  };
  return (
    <>
      {isDeletePayment && Boolean(selectedPaymentId) && (
        <DeletePayment
          open={isDeletePayment}
          selectedPayment={selectedPaymentId}
          handleClose={handleDeletePaymentClose}
        />
      )}
      {(isAddPayment || Boolean(selectedPayment)) && (
        <AddPaymentDialog
          open={isAddPayment || Boolean(selectedPayment)}
          selectedPayment={selectedPayment}
          handleCLose={handleAddPaymentClose}
        />
      )}
      <Grid container spacing={2} padding="25px">
        <Grid item xs={8}>
          <Card>
            <CardHeader
              title={<p className="text-[16px] font-[500]">Project Payments</p>}
              action={
                <IconButton>
                  <AddIcon onClick={() => setIsAddPayment(true)} />
                </IconButton>
              }
            />
            <Divider />
            <CardContent>
              <Table>
                <TableHead>
                  <TableRow>
                    {tableColumns.map((col, index) => (
                      <TableCell>
                        {<p className="text-[13px] font-[500]">{col}</p>}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projectFinance.length ? (
                    projectFinance.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {
                            <p className="text-[13px] font-[400]">
                              {Boolean(row.date)
                                ? formateDate(row.date)
                                : "N/A"}
                            </p>
                          }
                        </TableCell>
                        <TableCell>
                          {
                            <p className="text-[13px] font-[400]">
                              {Boolean(row.amount) ? row.amount : "N/A"}
                            </p>
                          }
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <DotIcon status={row.status ? "Paid" : "Pending"} />
                            <p className="text-[13px] font-[400]">
                              {row.status ? "Paid" : "Pending"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {
                            <p className="text-[13px] font-[400]">
                              {Boolean(row.comment) ? row.comment : "N/A"}
                            </p>
                          }
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => {
                              setSelectedPayment(row);
                            }}
                          >
                            <EditIcon className="!text-[18px]" />
                          </IconButton>

                          <IconButton
                            onClick={() => {
                              setSelectedPaymentId(row.id);
                              setIsDeletePayment(true);
                            }}
                          >
                            <DeleteIcon className="!text-[18px]" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <p className="text-[13px] text-center mt-5">
                      No data found
                    </p>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={4}>
          <div className="flex gap-4 mb-5">
            <Card className="w-[50%] border-t-4 border-t-[red]">
              <CardHeader
                title={
                  <div className="flex justify-between items-center">
                    <p className="text-[13px] font-[500]">Spending</p>
                    <IconButton className="border rounded-md ">
                      <PaidIcon />
                    </IconButton>
                  </div>
                }
              />
              <CardContent>
                <div>
                  <p className="text-[16px] font-[500]">
                    {projectFinanceSummary?.spent}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="w-[50%] border-t-4 border-t-[red]">
              <CardHeader
                title={
                  <div className="flex justify-between items-center">
                    <p className="text-[13px] font-[500]">Total</p>
                    <IconButton className="border rounded-md ">
                      <PointOfSaleIcon />
                    </IconButton>
                  </div>
                }
              />
              <CardContent>
                <div>
                  <p className="text-[16px] font-[500]">
                    {projectFinanceSummary?.total}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader
              title={
                <p className="text-[16px] font-[500]">Financial Information</p>
              }
            />
            <CardContent>
              <ChartContainer>
                {pieChartData && (
                  <Chart
                    options={pieChartData.options}
                    series={pieChartData.series}
                    type="bar"
                    height={250}
                  />
                )}
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className="mt-[30px] ">
            <CardHeader
              title={
                <p className="text-[16px] font-[500]">Project Budget Health</p>
              }
            />
            <CardContent>
              <RiskMeter
                value={projectFinanceSummary?.spent}
                max={projectFinanceSummary?.total}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Financial;

const ChartContainer = styled("div")({
  height: "250px",
});
const DotIcon = styled(FiberManualRecordIcon)(({ theme, status }) => ({
  color: status === "Paid" ? "green" : "red",
  fontSize: "12px",
  marginRight: "4px",
}));

const RiskMeter = ({ value = 0, max = 0 }) => {
  const riskPercentage = value / max;

  return (
    <div>
      <GaugeChart
        id="riskMeter"
        nrOfLevels={20}
        percent={riskPercentage}
        textColor="#000000"
      />
      <div>
        <p className="text-center">
          {isNaN(riskPercentage) ? 0 : Math.round(riskPercentage * 100)}%
        </p>
      </div>
    </div>
  );
};

const tableColumns = ["Date", "Amount", "Status", "Comments", "Actions"];
