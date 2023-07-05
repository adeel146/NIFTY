/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { getApi } from "../redux/middlewares/api";

export const useAppQuery = (name, endPoint, options) => {
  const query = useQuery([name, options?.delay], () => getApi(endPoint), {
    refetchOnWindowFocus: false,
    retry: 0,
    ...options,
  });
  return query;
};
