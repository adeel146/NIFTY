import { useAppMutation } from "hooks/useAppMutation";
import { useAppQuery } from "hooks/useAppQuery";
import { ApiMethods, Apis } from "static/apis";

export const useGetProjectFinance = ({ id }) => {
  const getProjectFinanceResponse = useAppQuery(
    `${Apis.GetProjectFinance}/${id}`,
    `${Apis.GetProjectFinance}/${id}`,
    {
      enabled: !!id,
    }
  );
  const projectFinance = getProjectFinanceResponse.data?.data?.data ?? [];

  return { projectFinance };
};
export const useGetProjectFinanceSummary = ({ id }) => {
  const getProjectFinanceSummaryResponse = useAppQuery(
    `${Apis.GetProjectFinanceSummary}/${id}`,
    `${Apis.GetProjectFinanceSummary}/${id}`,
    {
      enabled: !!id,
    }
  );
  const projectFinanceSummary =
    getProjectFinanceSummaryResponse.data?.data?.data ?? [];

  return { projectFinanceSummary };
};

export const useAddProjectFinance = ({ id, onSuccess }) => {
  let refetchUrl = `${Apis.GetProjectFinance}/${id}`;

  return useAppMutation(
    Apis.AddFinance,
    ApiMethods.POST,
    [refetchUrl],
    (data) => {
      if (!data.data) {
        return;
      }
      onSuccess?.(data.data);
    }
  );
};

export const useEditProjectFinance = ({ id, selectedFinanceId, onSuccess }) => {
  let refetchUrl = `${Apis.GetProjectFinance}/${id}`;

  return useAppMutation(
    `${Apis.AddFinance}/${selectedFinanceId}`,
    ApiMethods.PUT,
    [refetchUrl],
    (data) => {
      if (!data.data) {
        return;
      }
      onSuccess?.(data.data);
    }
  );
};

export const useDeletePayment = ({ id, selectedFinanceId, onSuccess }) => {
  let refetchUrl = `${Apis.GetProjectFinance}/${id}`;

  return useAppMutation(
    `${Apis.AddFinance}/${selectedFinanceId}`,
    ApiMethods.DELETE,
    [refetchUrl],
    (data) => {
      if (!data.data) {
        return;
      }
      onSuccess?.(data.data);
    }
  );
};
