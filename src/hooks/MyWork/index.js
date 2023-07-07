import { useAppMutation } from "hooks/useAppMutation";
import { useAppQuery } from "hooks/useAppQuery";
import { ApiMethods, Apis } from "static/apis";

export const useGetProjectTasks = ({ type, search, projects, onSuccess }) => {
  let url = `${Apis.GetProjectTasks}/${type}?`;
  if (search) url += `search=${search}`;
  if (projects) url += `&projects=${projects}`;

  const grtProjectTasks = useAppQuery(url, url, {
    enabled: !!projects,
    onSuccess,
  });
  const projectTasks = grtProjectTasks.data?.data?.data ?? [];

  return { projectTasks, grtProjectTasks };
};
export const useGetAllMyTasks = ({ filter, sortBy, onSuccess }) => {
  let url = `/task/get_all_my_tasks?`;
  if (filter) url += `TaskFilter=${filter}`;
  if (sortBy) url += `&TaskSort=${sortBy}`;
  const getMyAllTasks = useAppQuery(url, url, {
    onSuccess,
  });
  const myAllTasks = getMyAllTasks.data?.data?.data ?? [];

  return { myAllTasks, getMyAllTasks };
};
export const useGellAllTasks = ({ id, filter, sortBy, onSuccess }) => {
  let url = `/task/get_all_workspace_tasks/${id}?`;
  if (filter) url += `TaskFilter=${filter}`;
  if (sortBy) url += `&TaskSort=${sortBy}`;

  const grtProjectTasks = useAppQuery(url, url, {
    onSuccess,
  });
  const projectTasks = grtProjectTasks.data?.data?.data ?? [];

  return { projectTasks, grtProjectTasks };
};

export const useGetProjectStatus = ({ id }) => {
  const getProjectState = useAppQuery(
    `${Apis.GetProjectStatus}/${id}`,
    `${Apis.GetProjectStatus}/${id}`,
    {
      enabled: !!id,
    }
  );
  const projectStatus = getProjectState.data?.data?.data ?? [];

  return { projectStatus };
};

export const useGetProjectList = ({ id }) => {
  const getProjectList = useAppQuery(
    `${Apis.GetMilestoneList}/${id}`,
    `${Apis.GetMilestoneList}/${id}`,
    {
      enabled: !!id,
    }
  );
  const projectList = getProjectList.data?.data?.data ?? [];

  return { projectList };
};

export const useAddProjectTask = ({ type, search, projects, onSuccess }) => {
  let refetchUrl = `${Apis.GetProjectTasks}/${type}?`;
  if (search) refetchUrl += `search=${search}`;
  if (projects) refetchUrl += `&projects=${projects}`;
  return useAppMutation(
    Apis.AddProjectTaskBasic,
    ApiMethods.POST,
    [refetchUrl],
    (data) => {
      if (!data.data) {
        return;
      }
      onSuccess?.(data.data);
    }
  );
};
