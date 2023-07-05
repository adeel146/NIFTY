import { useAppMutation } from "hooks/useAppMutation";
import { useAppQuery } from "hooks/useAppQuery";
import { ApiMethods, Apis } from "static/apis";

export const useAppAddBasicInfo = (param) => {
  return useAppMutation(Apis.AddBasicInfo, ApiMethods.POST, [], (data) => {
    if (!data.data) {
      return;
    }
    param?.onSuccess?.(data.data);
  });
};

export const useUpdatePassword = (param) => {

  return useAppMutation(
    `${Apis.UpdatePassword}`,
    ApiMethods.PUT,
    ["updatePassword"],
    (data) => {
      if(!data.data) {
        return;
      }
      param?.onSuccess?.(data.data);
    }
  )
}

export const useGetNotification = ({ onSuccess }) => {
  const workspaceResponse = useAppQuery(
    "notifications",
    `${Apis.GetNotifications}`,
    {
      onSuccess,
    }
  );

  return { workspaceResponse };
};

export const useUpdateNotification = (param) => {

  return useAppMutation(
    `${Apis.UpdateNotification}`,
    ApiMethods.PUT,
    ["notifications"],
    (data) => {
      if(!data.data) {
        return;
      }
      param?.onSuccess?.(data.data);
    }
  )
}


