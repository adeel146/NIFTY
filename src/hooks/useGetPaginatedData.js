import { useQuery } from "@tanstack/react-query";
import { getApi } from "../redux/middlewares/api";

export const useGetPaginatedData = (
  name,
  endPoint,
  refetchOptions,
  options
) => {
  const query = useQuery(
    [name, { ...refetchOptions }],
    () => getApi(endPoint),
    {
      keepPreviousData: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      retry: 1,
      ...options,
    }
  );
  return query;
};
