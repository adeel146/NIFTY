import { useAppMutation } from "hooks/useAppMutation";
import { useAppQuery } from "hooks/useAppQuery";
import { useDisplaySuccess } from "hooks/useDisplaySuccess";
import { ApiMethods, Apis } from "static/apis";

export const useGetWorkSpace = ({ onSuccess }) => {
  const workspaceResponse = useAppQuery(
    "allWorkspaces",
    `${Apis.GetWorkSpace}`,
    {
      onSuccess,
    }
  );

  return { workspaceResponse };
};

export const useGetPermission = ({ workspace_id, onSuccess }) => {
  const workspaceResponse = useAppQuery(
    "permission",
    `${Apis.GetPermission}${workspace_id}`,
    {
      onSuccess,
    }
  );

  return { workspaceResponse };
};

export const useUpdatePermission = (param) => {
  return useAppMutation(
    `${Apis.UpdatePermission}`,
    ApiMethods.PUT,
    ["permission"],
    (data) => {
      if (!data.data) {
        return;
      }
      param?.onSuccess?.(data.data);
    }
  );
};

export const useGetWorkSpaceProjects = ({ id }) => {
  const workspaceResponse = useAppQuery(
    "workspaceProjects",
    `${Apis.WorkSpaceProjects}${id}`,
    {
      enabled: !!id,
    }
  );
  const workspaceProjects = workspaceResponse.data?.data?.data ?? [];
  return { workspaceProjects };
};

export const useGetWorkSpaceMembers = ({ onSuccess, id }) => {
  const workspaceResponse = useAppQuery(
    ["workspaceMembers"],
    `${Apis.GetWorkSpaceMembers}${id}`,
    {
      onSuccess,
    }
  );

  return { workspaceResponse };
};

export const useWorkSpaceLogo = ({ id, onSuccess }) => {
  const workspaceResponse = useAppQuery(
    "workspaceLogo",
    `${Apis.GetLogo}${id}`,
    {
      onSuccess,
    }
  );

  return { workspaceResponse };
};

export const useAddWorkspace = (param) => {
  const display = useDisplaySuccess();

  return useAppMutation(
    Apis.AddWorkspace,
    ApiMethods.POST,
    ["allWorkspaces"],
    (data) => {
      if (!data.data) {
        return;
      }
      display(data.data?.message);
      param?.onSuccess?.(data.data);
    }
  );
};

export const useInvitePeople = (param) => {
  const display = useDisplaySuccess();

  return useAppMutation(
    Apis.InvitePeople,
    ApiMethods.POST,
    ["workspace"],
    (data) => {
      if (!data.data) {
        return;
      }
      display(data.data?.message);
      param?.onSuccess?.(data.data);
    }
  );
};

export const useUpdateLogo = (param) => {
  const display = useDisplaySuccess();

  return useAppMutation(
    Apis.UpdateLogo,
    ApiMethods.POST,
    [
      "updateLogo",
      `${Apis.GetWorkspaceById}${
        param?.workspaceId
          ? param?.workspaceId
          : localStorage.getItem("workspaceId")
      }`,
    ],
    (data) => {
      if (!data.data) {
        return;
      }
      param?.onSuccess?.(data.data);
    }
  );
};

export const useUpdateName = (param) => {
  return useAppMutation(
    `${Apis.UpdateName}${param?.id}`,
    ApiMethods.PUT,
    [
      "updateName",
      `${param?.id ? param?.id : localStorage.getItem("workspaceId")}`,
    ],
    (data) => {
      if (!data.data) {
        return;
      }
      param?.onSuccess?.(data.data);
    }
  );
};

export const useUpdateURL = (param, id) => {
  return useAppMutation(
    `${Apis.UpdateURL}${param?.id}`,
    ApiMethods.PUT,
    [
      "updateURL",
      `${param?.id ? param?.id : localStorage.getItem("workspaceId")}`,
    ],
    (data) => {
      if (!data.data) {
        return;
      }
      param?.onSuccess?.(data.data);
    }
  );
};

export const useUpdateChat = (param, id) => {
  return useAppMutation(
    `${Apis.UpdateChat}${param?.id}`,
    ApiMethods.PUT,
    [
      "updateChat",
      `${param?.id ? param?.id : localStorage.getItem("workspaceId")}`,
    ],
    (data) => {
      if (!data.data) {
        return;
      }
      param?.onSuccess?.(data.data);
    }
  );
};

export const useUpdateGuestChat = (param, id) => {
  return useAppMutation(
    `${Apis.UpdateGuestChat}${param?.id}`,
    ApiMethods.PUT,
    [
      "updateGuestChat",
      `${param?.id ? param?.id : localStorage.getItem("workspaceId")}`,
    ],
    (data) => {
      if (!data.data) {
        return;
      }
      param?.onSuccess?.(data.data);
    }
  );
};

export const useUpdateWeekends = (param, id) => {
  return useAppMutation(
    `${Apis.UpdateWeekends}${param?.id}`,
    ApiMethods.PUT,
    [
      "updateWeekends",
      `${param?.id ? param?.id : localStorage.getItem("workspaceId")}`,
    ],
    (data) => {
      if (!data.data) {
        return;
      }
      param?.onSuccess?.(data.data);
    }
  );
};

export const useUpdateTwoFactor = (param, id) => {
  return useAppMutation(
    `${Apis.UpdateTwoFactor}${param?.id}`,
    ApiMethods.PUT,
    ["updateTwoFactor"],
    (data) => {
      if (!data.data) {
        return;
      }
      param?.onSuccess?.(data.data);
    }
  );
};

export const useGetWorkspaceById = ({ id, enabled }) => {
  const workspaceResponse = useAppQuery(
    `${Apis.GetWorkspaceById}${id ? id : localStorage.getItem("workspaceId")}`,
    `${Apis.GetWorkspaceById}${id ? id : localStorage.getItem("workspaceId")}`,
    {
      enabled,
    }
  );

  return { workspaceResponse };
};

export const useGetWorspaceRiskById = ({ id }) => {
  const worspaceRiskByIdResponse = useAppQuery(
    `${Apis.GetRiskById}/${id}`,
    `${Apis.GetRiskById}/${id}`,
    {
      enabled: !!id,
    }
  );

  return { worspaceRiskByIdResponse };
};

export const useUpdateWorspaceRiskById = (param) => {
  let url = `${Apis.UpdateRiskById}/${param?.id}`;

  return useAppMutation(
    url,
    ApiMethods.PUT,
    [`${Apis.GetRiskById}/${param?.id}`],
    (data) => {
      if (!data.data) {
        return;
      }
      param?.onSuccess?.(data.data);
    }
  );
};
