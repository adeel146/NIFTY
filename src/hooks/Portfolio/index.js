import { useAppQuery } from "hooks/useAppQuery";
import { ApiMethods, Apis } from "../../static/apis";
import { createRef } from "react";
import { useAppMutation } from "hooks/useAppMutation";

export const eventsCalendarRef = createRef(null);

export const useAppGetPortfolioMembers = ({ id }) => {
  const portfolioMembersResponse = useAppQuery(
    Apis.GetPortfolioMembers,
    `${Apis.GetPortfolioMembers}${id}`,
    {
      enabled: !!id,
    }
  );
  const portfolioMembers = portfolioMembersResponse.data?.data?.data;

  return { portfolioMembers, portfolioMembersResponse };
};

export const useAppGetPortfolioById = ({ id, onSuccess }) => {
  const portfolioByIdResponse = useAppQuery(
    `${Apis.GetPortfolioById}/${id}`,
    `${Apis.GetPortfolioById}/${id}`,
    {
      enabled: !!id,
      onSuccess,
    }
  );

  return { portfolioByIdResponse };
};

export const useAppGetPortfolio = ({ onSuccess }) => {
  const portfolioResponse = useAppQuery(
    ["portfolio"],
    Apis.GetPortfolio,
    `${Apis.GetPortfolio}`,
    {
      onSuccess,
    }
  );
  const portfolios = portfolioResponse.data?.data?.data ?? [];

  return { portfolios };
};

export const useAppGetUserNotification = ({ onSuccess }) => {
  const notificationsResponse = useAppQuery(
    Apis.GetUserNotifications,
    `${Apis.GetUserNotifications}`,
    {
      onSuccess,
    }
  );
  const UserNotifications = notificationsResponse.data?.data?.data ?? [];

  return { UserNotifications };
};

export const useAddPortfolio = (param) => {
  return useAppMutation(
    Apis.AddPortfolio,
    ApiMethods.POST,
    ["portfolio"],
    (data) => {
      if (!data.data) {
        return;
      }
      param?.onSuccess?.(data.data);
    }
  );
};

export const useUpdatePortfolio = (param) => {
  return useAppMutation(
    `${Apis.UpdatePortfolio}/${param.activePortfolioId}`,
    ApiMethods.PUT,
    ["portfolio"],
    (data) => {
      if (!data.data) {
        return;
      }
      param?.onSuccess?.(data.data);
    }
  );
};
export const useDeletePortfolio = (param) => {
  let url = `${Apis.DeletePortfolio}/${param.activePortfolioId}?`;
  if (param.isDeleteAll) url += `removeAllProjects=${param.isDeleteAll}`;
  if (!param.isDeleteAll) url += `&protfolioToAssign=${param.portfolioId}`;

  return useAppMutation(url, ApiMethods.DELETE, ["portfolio"], (data) => {
    if (!data.data) {
      return;
    }
    param?.onSuccess?.(data.data);
  });
};

export const useDeleteFolder = (param) => {
  console.log("param", param)
  let url = `${Apis.DeleteFolder}${param.id}`;
  return useAppMutation(url, ApiMethods.DELETE, [`getFolderFiles/${param?.parentId}`], (data) => {
    if (!data.data) {
      return;
    }
    param?.onSuccess?.(data.data);
  });
};

export const useEditFolder = (param) => {
  console.log("param", param)
  let url = `${Apis.EditFolder}${param.id}`;
  return useAppMutation(url, ApiMethods.PUT, [`getFolderFiles/${param?.parentId}`, param?.debouncedValue], (data) => {
    if (!data.data) {
      return;
    }
    param?.onSuccess?.(data.data);
  });
};

export const useDeleteFile = (param) => {
  let url = `${Apis.DeleteFile}${param.id}`;
  return useAppMutation(url, ApiMethods.DELETE, [`getFolderFiles/${param?.parentId}`], (data) => {
    if (!data.data) {
      return;
    }
    param?.onSuccess?.(data.data);
  });
};

export const useArchiveProject = (param) => {
  let url = `${Apis.ArchiveProject}/${param.activeProjectId}?`;

  return useAppMutation(url, ApiMethods.PUT, ["portfolio"], (data) => {
    if (!data.data) {
      return;
    }
    param?.onSuccess?.(data.data);
  });
};

export const useDeleteProject = (param) => {
  let url = `${Apis.DeleteProject}/${param.activeProjectId}?`;

  return useAppMutation(url, ApiMethods.DELETE, ["portfolio"], (data) => {
    if (!data.data) {
      return;
    }
    param?.onSuccess?.(data.data);
  });
};

export const useDuplicateProject = (param) => {
  let url = `${Apis.DuplicateProject}/${param.activeProjectId}?`;

  return useAppMutation(url, ApiMethods.POST, ["portfolio"], (data) => {
    if (!data.data) {
      return;
    }
    param?.onSuccess?.(data.data);
  });
};

export const usePortfolios = ({ id }) => {
  const workspacePortfoliosResponse = useAppQuery(
    [Apis.GetPortfolios, id],
    `${Apis.GetPortfolios}${id}`,
    {
      enabled: !!id,
    }
  );
  const workspacePortfolios =
    workspacePortfoliosResponse.data?.data?.data ?? [];

  return { workspacePortfolios, workspacePortfoliosResponse };
};
export const useGetOverdueCount = () => {
  const overDueCountResponse = useAppQuery(
    Apis.GetOverdueCount,
    `${Apis.GetOverdueCount}`,
    {}
  );

  return { overDueCountResponse };
};

export const useGetFolder = ({ id, onSuccess }) => {
  const workspacePortfoliosResponse = useAppQuery(
    [`getFolderFiles/${id}`],
    `${Apis.GetFolder}${id}?project_id=${localStorage?.getItem("projectId")}`,
    {
      onSuccess,
    }
  );
  const workspacePortfolios =
    workspacePortfoliosResponse.data?.data?.data ?? [];

  return { workspacePortfolios };
};

export const useCreateFolder = ({ onSuccess }) => {
  return useAppMutation(
    Apis.CreateFolder,
    ApiMethods.POST,
    ["file"],
    (data) => {
      if (!data.data) {
        return;
      }
      onSuccess?.(data.data);
    }
  );
};

export const useAddFile = ({ id, onSuccess }) => {
  return useAppMutation(
    `${Apis.AddFile}${id}`,
    ApiMethods.POST,
    [`getFolderFiles/${id}`],
    (data) => {
      if (!data.data) {
        return;
      }
     
      onSuccess?.(data.data);
    }
  );
};

export const useAppGetWorkSpacePortfolios = ({ id, onSuccess }) => {
  const workspacePortfoliosResponse = useAppQuery(
    Apis.GetWorkspacePortfolios,
    `${Apis.GetWorkspacePortfolios}${id}`,
    {
      enabled: !!id,
      onSuccess,
    }
  );
  const workspacePortfolios =
    workspacePortfoliosResponse.data?.data?.data ?? [];

  return { workspacePortfolios };
};

export const useAddProject = (param) => {
  return useAppMutation(Apis.AddProject, ApiMethods.POST, [], (data) => {
    if (!data.data) {
      return;
    }
    param?.onSuccess?.(data.data);
  });
};
