import { useCallback, useEffect } from "react";
import { useSnackbar } from "notistack";

export const useDisplayError = (error) => {
  const { enqueueSnackbar } = useSnackbar();

  const errorHandler = useCallback(() => {
    const err = Array.isArray(error) ? error[0] : error;
    error && enqueueSnackbar(err, { variant: "error", preventDuplicate: true });
  }, [enqueueSnackbar, error]);

  useEffect(() => {
    errorHandler();
  }, [errorHandler]);
  return null;
};
