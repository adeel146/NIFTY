import { useAppQuery } from "hooks/useAppQuery";
import { Apis } from "static/apis";

export const useGetReportsStats = (id) => {
  const getReportsStats = useAppQuery(
    `${Apis.GetReportStats}/${id}`,
    `${Apis.GetReportStats}/${id}`,
    {
      enabled: !!id,
    }
  );
  const reportsStats = getReportsStats.data?.data?.data ?? [];

  return { reportsStats };
};

export const useGetReportsUserwise = (id) => {
  const getReportsUserwise = useAppQuery(
    `${Apis.GetReportUserwise}/${id}`,
    `${Apis.GetReportUserwise}/${id}`,
    {
      enabled: !!id,
    }
  );
  const ReportsUserwise = getReportsUserwise.data?.data?.data ?? [];

  return { ReportsUserwise };
};

export const useGetReportsMonthWise = (id) => {
  const getReportsMonthWise = useAppQuery(
    `${Apis.GetReportsMonthWise}/${id}`,
    `${Apis.GetReportsMonthWise}/${id}`,
    {
      enabled: !!id,
    }
  );
  const ReportsMonthWise = getReportsMonthWise.data?.data?.data ?? [];

  return { ReportsMonthWise };
};

export const useGetReportsByTasksCreated = (id) => {
  const getReportsByTasksCreated = useAppQuery(
    `${Apis.GetReportsTasksCreated}/${id}`,
    `${Apis.GetReportsTasksCreated}/${id}`,
    {
      enabled: !!id,
    }
  );
  const ReportsByTasksCreated = getReportsByTasksCreated.data?.data?.data ?? [];

  return { ReportsByTasksCreated };
};

export const useGetUpcomingtasks = (id) => {
  const getReportsUpcoming = useAppQuery(
    `${Apis.GetReportsTasksUpcoming}/${id}`,
    `${Apis.GetReportsTasksUpcoming}/${id}`,
    {
      enabled: !!id,
    }
  );
  const ReportsUpcoming = getReportsUpcoming.data?.data?.data ?? [];

  return { ReportsUpcoming };
};

export const useGetPortfolioReportsTasksCount = (id) => {
  const getPortfolioReportsTasksCount = useAppQuery(
    `${Apis.GetPortfolioReportsTasksCount}/${id}`,
    `${Apis.GetPortfolioReportsTasksCount}/${id}`,
    {
      enabled: !!id,
    }
  );
  const portfolioReportsTasksCount =
    getPortfolioReportsTasksCount.data?.data?.data ?? [];

  return { portfolioReportsTasksCount };
};
export const useGetFinanceByPortfolio = (id) => {
  const getFinanceByPortfolio = useAppQuery(
    `${Apis.GetFinanceByPortfolio}/${id}`,
    `${Apis.GetFinanceByPortfolio}/${id}`,
    {
      enabled: !!id,
    }
  );
  const FinanceByPortfolio = getFinanceByPortfolio.data?.data?.data ?? [];

  return { FinanceByPortfolio };
};
export const useGetPortfolioMembersCount = (id) => {
  const getPortfolioMembersCount = useAppQuery(
    `${Apis.GetPortfolioMembersCount}/${id}`,
    `${Apis.GetPortfolioMembersCount}/${id}`,
    {
      enabled: !!id,
    }
  );
  const PortfolioMembersCount = getPortfolioMembersCount.data?.data?.data ?? [];

  return { PortfolioMembersCount };
};

export const useGetPortfolioReportsProjects = (id) => {
  const getPortfolioReportsProjects = useAppQuery(
    `${Apis.GetPortfolioReportsProjects}/${id}`,
    `${Apis.GetPortfolioReportsProjects}/${id}`,
    {
      enabled: !!id,
    }
  );
  const PortfolioReportsProjects =
    getPortfolioReportsProjects.data?.data?.data ?? [];

  return { PortfolioReportsProjects };
};
