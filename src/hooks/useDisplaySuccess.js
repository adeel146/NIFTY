import { useSnackbar } from "notistack";

export const useDisplaySuccess = () => {
  const { enqueueSnackbar } = useSnackbar();

  const successHandler = (message) => {
    const msg = Array.isArray(message) ? message[0] : message;
    message && enqueueSnackbar(msg, { variant: "success" });
  };
  return successHandler;
};
