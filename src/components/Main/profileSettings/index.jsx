
import { useAppMutation } from "hooks/useAppMutation";
import { ApiMethods,Apis } from "static/apis";

export const useUpdateProfile = (param) => {
  return useAppMutation(Apis.profile, ApiMethods.PUT, [Apis.GetCurrUser], (data) => {
    if (!data.data) {
      return;
    }
    param?.onSuccess?.(data.data);
  });
};

export const useUpdateAvatar = (param) => {
  return useAppMutation(Apis.avatar, ApiMethods.PUT, [], (data) => {
    if (!data.data) {
      return;
    }
    param?.onSuccess?.(data.data);
  });
};

