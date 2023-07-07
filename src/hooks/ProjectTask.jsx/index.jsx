import { useAppMutation } from "hooks/useAppMutation";
import { useAppQuery } from "hooks/useAppQuery";
import { useDisplaySuccess } from "hooks/useDisplaySuccess";
import { ApiMethods, Apis } from "static/apis";

export const useAddTask = (param) => {
  const display = useDisplaySuccess();

  return useAppMutation(Apis.AddTask, ApiMethods.POST, ["addtask"], (data) => {
    if (!data.data) {
      return;
    }
    display(data.data?.message);
    param?.onSuccess?.(data.data);
  });
};

export const useGetCalendarTasks = ({ workspace_id, onSuccess }) => {
  const workspaceResponse = useAppQuery(
    "calendarTasks",
    `${Apis.GetCalendarTasks}${workspace_id}`,
    {
      onSuccess,
    }
  );

  return { workspaceResponse };
};

export const useGetKanbanListTasks = ({ id, filter, sortBy, onSuccess }) => {
  let url = `${Apis.GetKanbanList}/${id}?`;
  if (filter) url += `TaskFilter=${filter}`;
  if (sortBy) url += `&TaskSort=${sortBy}`;

  const grtProjectTasks = useAppQuery(url, url, {
    enabled: !!id,
    onSuccess,
  });
  const projectTasks = grtProjectTasks.data?.data?.data ?? [];

  return { projectTasks, grtProjectTasks };
};

export const useAddBasicProjectTask = ({ id, onSuccess }) => {
  let refetchUrl = `${Apis.GetKanbanList}/${id}`;

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
export const useAddNewTask = ({ onSuccess }) => {
  let refetchUrl = `/task`;

  return useAppMutation("/task", ApiMethods.POST, [refetchUrl], (data) => {
    if (!data.data) {
      return;
    }
    onSuccess?.(data.data);
  });
};

export const useDeleteMember = (param) => {
  let url = `${Apis.RemoveMember}${param.project_id}`;
  return useAppMutation(url, ApiMethods.DELETE, ["getMembers"], (data) => {
    //getFolderFiles/${param?.parentId}
    if (!data.data) {
      return;
    }
    param?.onSuccess?.(data.data);
  });
};

export const useAddMembers = ({ project_id, onSuccess }) => {
  let refetchUrl = `${Apis.AddMember}${
    project_id ? project_id : localStorage.getItem("projectId")
  }`;

  return useAppMutation(
    `${Apis.AddMember}${
      project_id ? project_id : localStorage.getItem("projectId")
    }`,
    ApiMethods.POST,
    [
      refetchUrl,
      `${Apis.GETProjectMembers}${project_id}`,
      `${Apis.GetProject}/${project_id}`,
    ],
    (data) => {
      if (!data.data) {
        return;
      }
      onSuccess?.(data.data);
    }
  );
};

export const useGetProjectMembers = ({ id, onSuccess }) => {
  const projectMembersResponse = useAppQuery(
    [`${Apis.GETProjectMembers}${id}`],
    `${Apis.GETProjectMembers}${id}`,
    {
      onSuccess,
    }
  );

  return { projectMembersResponse };
};
export const useAppGetProject = ({ id }) => {
  const projectResponse = useAppQuery(
    [`${Apis.GetProject}/${id}`],
    `${Apis.GetProject}/${id}`,
    {}
  );

  return { projectResponse };
};
