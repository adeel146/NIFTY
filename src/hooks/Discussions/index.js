import { useAppMutation } from "hooks/useAppMutation";
import { useAppQuery } from "hooks/useAppQuery";
import { ApiMethods, Apis } from "static/apis";

export const useGetDiscussions = ({ id }) => {
  const getDiscussionsResponse = useAppQuery(
    Apis.GetDiscussions,
    `${Apis.GetDiscussions}/${id}`,
    {
      enabled: !!id,
    }
  );
  const discussions = getDiscussionsResponse.data?.data?.data ?? [];

  return { discussions, getDiscussionsResponse };
};

export const useAddDiscussion = ({ onSuccess }) => {
  return useAppMutation(
    Apis.GetDiscussions,
    ApiMethods.POST,
    [Apis.GetDiscussions],
    (data) => {
      if (!data.data) {
        return;
      }
      onSuccess?.(data.data);
    }
  );
};
