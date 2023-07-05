import { useAppQuery } from "hooks/useAppQuery";
import { ApiMethods, Apis } from "../../static/apis";
import { useAppMutation } from "../useAppMutation";

export const useAppLogin = (param) => {
  return useAppMutation(Apis.login, ApiMethods.POST, [], (data) => {
    if (!data.data) {
      return;
    }
    param?.onSuccess?.(data.data);
  });
};

export const useAppSignup = (param) => {
  return useAppMutation(Apis.Signup, ApiMethods.POST, [], (data) => {
    if (!data.data) {
      return;
    }
    param?.onSuccess?.(data.data);
  });
};

export const useAppVerifyOtp = (param) => {
  return useAppMutation(Apis.VerifyOtp, ApiMethods.POST, [], (data) => {
    if (!data.data) {
      return;
    }
    param?.onSuccess?.(data.data);
  });
};

export const useAppGetCurrentUser = ({ onSuccess }) => {
  return useAppMutation(Apis.GetCurrUser, ApiMethods.GET, [], (data) => {
    if (!data.data) {
      return;
    }

    onSuccess?.(data.data);
  });
};
