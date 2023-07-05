import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiMethods } from "../static/apis";
import { api } from "../redux/middlewares/api";

export const useAppMutation = (
  endPoint,
  method = ApiMethods.POST,
  refetchQueries,
  onSuccess
) => {
  const queryClient = useQueryClient();
  const queryKey = refetchQueries ?? [];
  const { data, error, isLoading, mutate, reset } = useMutation(
    ({ data, id, params }) => api({ data, endPoint, id, method, params }),
    {
      onMutate: async () => {
        await queryClient.cancelQueries(queryKey);
        refetchQueries &&
          queryClient.setQueryData(queryKey ?? "", (oldQueryData) => {
            if (!oldQueryData) return;
            return { data: oldQueryData?.data, oldQueryData };
          });
      },
      onSuccess: (response) => {
        const data = response;
        onSuccess?.(data);
        refetchQueries?.forEach((query) => {
          queryClient.invalidateQueries(query);
          setTimeout(() => reset(), 0);
        });
      },
    }
  );
  const customData = data;
  return { data: customData, error, isLoading, mutate, reset };
};
