import React, { useEffect, useState, useId, useMemo, Fragment } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import HookTextField from "hooks/Common/HookTextField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import HookFreeSelect from "hooks/Common/HookFreeSelect";
import * as yup from "yup";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import { split, map, inRange } from "lodash";
import HookSelectField from "hooks/Common/HookSelectField";
import HookCheckBox from "hooks/Common/HookCheckBox";
import { useSnackbar } from "notistack";
import { CircularProgress, List } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  listTypeRequest,
  setHeaderMenuName,
  setNewRequestType,
} from "redux/actions";
import { useDispatch } from "react-redux";
import { useAuth } from "hooks/useAuth";
import { setDateValuePersis } from "redux/actions";

const schema = yup.object().shape({
  description: yup.string().nullable().required(),
  justification: yup.string().nullable().required(),
  benefits: yup.string().nullable().required(),
  proposedAction: yup.string().nullable().required(),
  risk: yup.string().nullable().required(),
  priority: yup.number().nullable().typeError().required("Periority  Required"),
  scope: "",
  cost: "",
  quality: "",
  resources: "",
  schedule: yup.string().nullable().required(),
});

function ChangeRequest() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    getValues,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const dispatch = useDispatch();
  const auth = useAuth();
  const checkType = useSelector((state) => state?.projectTaskSlice?.listType);
  const { projectId } = useParams();
  const { requestId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [mileStoneList, setMileStoneList] = useState([]);
  const [updateMileStoneList, setUpdateMileStoneList] = useState([]);
  const [taskMilestoneList, setTaskMilestoneList] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const [showTaskEdit, setShowTaskEdit] = useState(false);
  const [taskSelected, setTaskSelected] = useState();
  const [dataListing, setDataListing] = useState();
  const [isMileStoneRequired, setIsMileStoneRequired] = useState(false);
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const name = watch("name");
  const mileStoneIdMatch = watch("milstone_id");
  const task_name = watch("task_name");
  const task_startDate = watch("task_startDate");
  const task_endDate = watch("task_endDate");
  const task_milstone_id = watch("task_milstone_id");
  const isTemporary = watch("isMilestoneTemporary");
  const taskUsers = watch("users");
  const isAddNewShow = watch("isAddNewShow");
  const { enqueueSnackbar } = useSnackbar();
  const workspaceId = localStorage.getItem("workspaceId");
  const uuid = uuidv4();
  const isAddTask = watch("isAddTask");
  const isUpdateMileStone = watch("isUpdateMileStone");
  const isScopeShow = watch("isScopeShow");
  const isQualityShow = watch("isQualityShow");
  const isResourceShow = watch("isResourceShow");
  const isCostShow = watch("isCostShow");
  const schedule = watch("schedule");
  const scheduleDate = new Date(schedule).getTime();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const taskStart = new Date(task_startDate).getTime();
  const taskEnd = new Date(task_endDate).getTime();
  const [updatedPayload, setUpdatedPayload] = useState();

  const compareDate = useSelector(
    (state) => state.projectTaskSlice.persisDateValue
  );

  // for edit

  const { data: listingRequest } = useQuery(
    ["list_request", requestId],
    () => {
      return axios.get(`/change_request/get_by_id/${requestId}`);
    },
    {
      onSuccess: (data) => {
        const editSchedule = split(data?.data?.data?.schedule, "T")[0];
        reset(data?.data?.data);
        setValue("schedule", editSchedule);
        setMileStoneList(
          data?.data?.data?.temporaryMilestones?.map((val) => {
            return {
              ...val,
              id: val?.id.toString(),
            };
          }) ?? []
        );
        setUpdateMileStoneList(data?.data?.data?.milestones ?? []);
        setTaskMilestoneList(data?.data?.data?.tasks ?? []);
        setDataListing(data?.data?.data);
        console.log(data?.data?.data?.tasks, "data?.data?.data?.tasks");
        if (data?.data?.data?.temporaryMilestones?.length > 0) {
          setValue("isAddTask", true);
        }
        if (data?.data?.data?.milestones?.length > 0) {
          setValue("isUpdateMileStone", true);
        }
        if (data?.data?.data?.tasks?.length > 0) {
          setValue("isAddNewShow", true);
        }
      },
    },
    {
      enabled: !!requestId && !!checkType == "edit",
    }
  );

  const addMilestone = () => {
    if (start > scheduleDate) {
      enqueueSnackbar("Start Date Exceeded", { variant: "error" });
    } else if (end > scheduleDate) {
      enqueueSnackbar("End Date Exceeded", { variant: "error" });
    } else if (end < start) {
      enqueueSnackbar("End is Less Then Start", { variant: "error" });
    } else if (!name || !start || !end) {
      enqueueSnackbar("Enter All Fields", { variant: "error" });
    } else {
      const milestonesVals = {
        id: uuidv4().toString(),
        name: name,
        startDate: startDate,
        endDate: endDate,
      };
      setMileStoneList([...mileStoneList, milestonesVals]);
      setValue("name", "");
      setValue("startDate", "");
      setValue("endDate", "");
    }
  };
  const deleteMilestone = (id) => {
    setMileStoneList(
      mileStoneList?.filter((val) => {
        return val?.id !== id;
      })
    );
  };

  const { data: workspaceAllUsers } = useQuery(
    ["workspace_members", workspaceId],
    () => {
      return axios.get(`/workspace/workspace_members/${workspaceId}`);
    },
    {
      enabled: !!workspaceId,
      select: (res) => {
        return res?.data?.data?.map((val) => {
          return {
            label: val?.email,
            value: val?.user_Id,
          };
        });
      },
    }
  );

  const { data: projectDetailsListing } = useQuery(
    ["project_detailss"],
    () => {
      return axios.get(`/project/${projectId}`);
    },
    {
      enabled: !!projectId,
      select: (res) => {
        return res?.data?.data;
      },
    }
  );

  const { data: chooseMilestone } = useQuery(
    ["get_milestone_dropdonwlist"],
    () => {
      return axios.get(`/milestone/listing/${projectId}`);
    },
    {
      select: (res) => {
        return res?.data?.data;
      },
    }
  );

  const milestoneDropDown = chooseMilestone?.map((val) => {
    return {
      value: val?.id,
      label: val?.name,
      ...val,
    };
  });

  const mileStoneDataList = chooseMilestone?.find((val) => {
    return val?.id == mileStoneIdMatch;
  });

  const updateStartDate = split(mileStoneDataList?.startDate, "T")[0];
  const updateEndDate = split(mileStoneDataList?.endDate, "T")[0];

  const watchUpdateStart = watch("update_startDate");
  const watchUpdateEnd = watch("update_endDate");
  const updateStart = new Date(watchUpdateStart).getTime();
  const updateEnd = new Date(watchUpdateEnd).getTime();

  const disableRequest = useSelector(
    (state) => state?.projectTaskSlice?.newRequestType
  );
  const moduleInfo = useSelector(
    (state) => state?.projectTaskSlice?.moduleInformation
  );

  console.log(moduleInfo, "moduleInfo");

  useEffect(() => {
    if (mileStoneIdMatch) {
      setValue("update_startDate", updateStartDate);
      setValue("update_endDate", updateEndDate);
    }
  }, [mileStoneIdMatch]);

  const updateSecondMilestone = () => {
    if (updateStart > scheduleDate) {
      enqueueSnackbar("Start Date Exceeded", { variant: "error" });
    } else if (updateEnd > scheduleDate) {
      enqueueSnackbar("End Date Exceeded", { variant: "error" });
    } else if (updateEnd < updateStart) {
      enqueueSnackbar("End is Less Then Start", { variant: "error" });
    } else if (!updateStart || !updateEnd) {
      enqueueSnackbar("Select a Milestone", { variant: "error" });
    } else {
      const list = {
        milstone_id: mileStoneIdMatch,
        milestone_name: null,
        update_startDate: updateStartDate,
        update_endDate: updateEndDate,
      };
      setUpdateMileStoneList([...updateMileStoneList, list]);
      setValue("milstone_id", "");
      setValue("update_startDate", "");
      setValue("update_endDate", "");
      dispatch(setDateValuePersis(updateEnd));
    }
  };

  const impactMilstone = mileStoneList?.map((val) => {
    return {
      value: val?.id,
      label: val?.name,
      ...val,
    };
  });

  const chooseAllMilestone = [
    ...(impactMilstone ?? []),
    ...(milestoneDropDown ?? []),
  ];

  function isDateExceeded(dateToCheck, startDate, endDate) {
    // Create Date objects from the input values
    const date = new Date(dateToCheck);
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Check if the date is between the start and end dates
    return date >= start && date <= end;
  }

  const taskMileStoneAdd = () => {
    const SelectedMilestone = task_milstone_id;
    if (!task_name || !task_startDate || !task_endDate) {
      enqueueSnackbar("Select all Fields", { variant: "error" });
    } else if (
      !isDateExceeded(
        task_startDate,
        SelectedMilestone.startDate,
        SelectedMilestone.endDate
      )
    ) {
      enqueueSnackbar("Start Date Invalid", { variant: "error" });
    } else if (
      !isDateExceeded(
        task_endDate,
        SelectedMilestone.startDate,
        SelectedMilestone.endDate
      )
    ) {
      enqueueSnackbar("End Date Invalid", { variant: "error" });
    } else {
      const taskList = {
        isMilestoneTemporary: isTemporary,
        task_milstone_id: task_milstone_id,
        task_name: task_name,
        task_startDate: task_startDate,
        task_endDate: task_endDate,
        users: taskUsers || [],
      };
      setTaskMilestoneList([...taskMilestoneList, taskList]);
      setValue("task_milstone_id", "");
      setValue("task_name", "");
      setValue("task_startDate", "");
      setValue("task_endDate", "");
      setTimeout(() => {
        setValue("users", "");
      }, 500);
    }
  };

  const idExist = useMemo(
    () =>
      impactMilstone?.find((val) => {
        return val?.value == task_milstone_id?.value;
      }),
    [task_milstone_id]
  );

  useEffect(() => {
    if (idExist) {
      setValue("isMilestoneTemporary", true);
    } else {
      setValue("isMilestoneTemporary", false);
    }
  }, [idExist]);

  console.log(taskMilestoneList, "taskMilestoneList");

  // useEffect(() => {
  //   setUpdatedPayload(
  //     taskMilestoneList?.map((val) => {
  //       return {
  //         ...val,
  //         task_milstone_id: val?.task_milstone_id?.value,
  //         users: val?.users?.map((item) => {
  //           return item?.value;
  //         }),
  //       };
  //     })
  //   );
  // }, [taskMilestoneList]);

  const updatedTaskPayload = taskMilestoneList?.map((val) => {
    return {
      ...val,
      task_milstone_id: val?.task_milstone_id?.value || val?.task_milstone_id,
      users: val?.users?.map((item) => {
        return item?.id || item?.value;
      }),
    };
  });

  console.log(updatedPayload, "updatedPayload");

  console.log(taskMilestoneList, "taskMilestoneList");

  const { mutate: addRequest, isLoading: requestLoding } = useMutation({
    mutationKey: ["add_request"],
    mutationFn: (data) => axios.post(`/change_request`, data),
    onSuccess: (data) => {
      if (data?.data?.success) {
        enqueueSnackbar(data.data.message, { variant: "success" });
        queryClient.invalidateQueries(["get_request_list"]);
        setMileStoneList([]);
        setUpdateMileStoneList([]);
        setTaskMilestoneList([]);
        setValue("description", "");
        setValue("justification", "");
        setValue("benefits", "");
        setValue("proposedAction", "");
        setValue("risk", "");
        setValue("priority", "");
        setValue("scope", "");
        setValue("cost", "");
        setValue("quality", "");
        setValue("resources", "");
        setValue("schedule", "");
        navigate(-1);
        dispatch(setHeaderMenuName("Change Request"));
      }
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });
  const { mutate: changeRequest, isLoading: acceptLoading } = useMutation({
    mutationKey: ["change_request_actions"],
    mutationFn: (data) => axios.post(`/change_request/action`, data),
    onSuccess: (data) => {
      if (data?.data?.success) {
        enqueueSnackbar(data.data.message, { variant: "success" });
        queryClient.invalidateQueries(["get_notification"]);
      }
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  console.log(requestId, "requestId");

  const { mutate: updateRequest, isLoading: updateLoading } = useMutation({
    mutationKey: ["update_change_request", requestId],
    mutationFn: (data) => axios.put(`/change_request/${requestId}`, data),
    onSuccess: (data) => {
      if (data?.data?.success) {
        enqueueSnackbar(data?.data?.message, { variant: "success" });
        queryClient.invalidateQueries(["get_request_list"]);
        navigate(-1);
        dispatch(listTypeRequest("add"));
        dispatch(setHeaderMenuName("Change Request"));
      }
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  const onSubmit = (data) => {
    const payload = {
      project_Id: +projectId,
      description: data.description,
      justification: data.justification,
      benefits: data.benefits,
      proposedAction: data.proposedAction,
      risk: data.risk,
      priority: data.priority,
      scope: data.scope,
      cost: data.cost,
      quality: data.quality,
      resources: data.resources,
      schedule: data.schedule,
      temporaryMilestones: mileStoneList,
      milestones: updateMileStoneList,
      tasks: updatedTaskPayload,
    };

    if (checkType == "edit") {
      updateRequest(payload);
    } else {
      addRequest(payload);
    }
  };

  useEffect(() => {
    if (selectedItem) {
      setValue("milestone_name", null);
      setValue("milstone_id", selectedItem?.val?.milstone_id);
      setValue("update_startDate", selectedItem?.val?.update_startDate);
      setValue("update_endDate", selectedItem?.val?.update_endDate);
    }
  }, [selectedItem]);

  useEffect(() => {
    if (taskSelected) {
      setValue("isMilestoneTemporary", taskSelected?.val?.isMilestoneTemporary);
      setValue("task_endDate", taskSelected?.val?.task_endDate);
      setValue("task_milstone_id", taskSelected?.val?.task_milstone_id);
      setValue("task_name", taskSelected?.val?.task_name);
      setValue("task_startDate", taskSelected?.val?.task_startDate);
      setValue("users", taskSelected?.val?.users);
    }
  }, [taskSelected]);

  const updateTaskUpdate = () => {
    const SelectedMilestone = task_milstone_id;
    if (!task_name || !task_startDate || !task_endDate) {
      enqueueSnackbar("Select all Fields", { variant: "error" });
    } else if (
      !isDateExceeded(
        task_startDate,
        SelectedMilestone.startDate,
        SelectedMilestone.endDate
      )
    ) {
      enqueueSnackbar("Start Date Invalid", { variant: "error" });
    } else if (
      !isDateExceeded(
        task_endDate,
        SelectedMilestone.startDate,
        SelectedMilestone.endDate
      )
    ) {
      enqueueSnackbar("End Date Invalid", { variant: "error" });
    } else {
      let index = taskSelected?.index;
      let payload = {
        isMilestoneTemporary: watch("isMilestoneTemporary"),
        task_endDate: watch("task_endDate"),
        task_milstone_id: watch("task_milstone_id"),
        task_name: watch("task_name"),
        task_startDate: watch("task_startDate"),
        users: watch("users"),
      };
      let List = [...taskMilestoneList];
      List.splice(index, 1);
      List.splice(index, 0, payload);
      setTaskMilestoneList(List);
    }
  };

  const updateUnique = () => {
    if (updateStart > scheduleDate) {
      enqueueSnackbar("Start Date Exceeded", { variant: "error" });
    } else if (updateEnd > scheduleDate) {
      enqueueSnackbar("End Date Exceeded", { variant: "error" });
    } else if (updateEnd < updateStart) {
      enqueueSnackbar("End is Less Then Start", { variant: "error" });
    } else if (!updateStart || !updateEnd) {
      enqueueSnackbar("Select a Milestone", { variant: "error" });
    } else {
      let index = selectedItem?.index;
      let payload = {
        milstone_id: watch("milstone_id"),
        update_endDate: watch("update_endDate"),
        update_startDate: watch("update_startDate"),
        milestone_name: null,
      };
      let List = [...updateMileStoneList];
      List.splice(index, 1);
      List.splice(index, 0, payload);
      setUpdateMileStoneList(List);
    }
  };

  const deleteMilestoneSecond = (index) => {
    let List = [...updateMileStoneList];
    List.splice(index, 1);
    setUpdateMileStoneList(List);
    console.log(id, "iidddd");
  };

  const delTasks = (index) => {
    let List = [...taskMilestoneList];
    List.splice(index, 1);
    setTaskMilestoneList(List);
  };

  const periorityList = [
    {
      value: 1,
      label: "Critical",
    },
    {
      value: 2,
      label: "High",
    },
    {
      value: 3,
      label: "Normal",
    },
    {
      value: 4,
      label: "Low",
    },
  ];

  return (
    <Fragment>
      <div
        className="cursor-pointer px-[1.2rem] mt-2"
        onClick={() => {
          navigate(-1);
          dispatch(listTypeRequest("add"));
          dispatch(setHeaderMenuName("Change Request"));
          dispatch(setNewRequestType(""));
        }}
      >
        <KeyboardBackspaceIcon />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-[100px] changeRequest_page">
          {checkType === "edit" && (
            <div className="px-[24px] pt-6 pb-6">
              <div className="post_box_white bg-white px-7 py-7 rounded-lg relative before:absolute before:-left-[1px] before:top-[0px] before:rounded-l-lg  before:w-[3px] before:h-[100%] before:border-l-[#f1a415] before:border-l-4  shadow-sm border border-[#eee]">
                <ul className="w-full list-none flex flex-wrap">
                  <li className="w-[33%] mb-3 pb-3 border border-b-[#eee] border-t-0 border-l-0 border-r-0">
                    <div className="flex">
                      <h4 className="font-bold text-[16px] mb-0 font-Manrope text-[#2f2f2f] mr-3">
                        CR #:
                      </h4>
                      <p className="text-[15px] mb-0 font-Manrope text-[#2f2f2f] font-normal">
                        {requestId}
                      </p>
                    </div>
                  </li>
                  <li className="w-[33%] mb-3 pb-3 border border-b-[#eee] border-t-0 border-l-0 border-r-0">
                    <div className="flex">
                      <h4 className="font-bold text-[16px] mb-0 font-Manrope text-[#2f2f2f] mr-3">
                        CR Date:
                      </h4>
                      <p className="text-[15px] mb-0 font-Manrope text-[#2f2f2f] font-normal">
                        12-June-2023
                      </p>
                    </div>
                  </li>
                  <li className="w-[33%] mb-3 pb-3 border border-b-[#eee] border-t-0 border-l-0 border-r-0">
                    <div className="flex">
                      <h4 className="font-bold text-[16px] mb-0 font-Manrope text-[#2f2f2f] mr-3">
                        Project ID:
                      </h4>
                      <p className="text-[15px] mb-0 font-Manrope text-[#2f2f2f] font-normal">
                        {projectId}
                      </p>
                    </div>
                  </li>
                  <li className="w-[33%]">
                    <div className="flex">
                      <h4 className="font-bold text-[16px] mb-0 font-Manrope text-[#2f2f2f] mr-3">
                        Project Name:
                      </h4>
                      <p className="text-[15px] mb-0 font-Manrope text-[#2f2f2f] font-normal">
                        {projectDetailsListing?.name}
                      </p>
                    </div>
                  </li>
                  <li className="w-[33%]">
                    <div className="flex">
                      <h4 className="font-bold text-[16px] mb-0 font-Manrope text-[#2f2f2f] mr-3">
                        Project Manager:
                      </h4>
                      <p className="text-[15px] mb-0 font-Manrope text-[#2f2f2f] font-normal">
                        {projectDetailsListing?.managerName}
                      </p>
                    </div>
                  </li>
                  <li className="w-[33%]">
                    <div className="flex">
                      <h4 className="font-bold text-[16px] mb-0 font-Manrope text-[#2f2f2f] mr-3">
                        Requested by:
                      </h4>
                      <p className="text-[15px] mb-0 font-Manrope text-[#2f2f2f] font-normal">
                        {auth?.user?.name}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          )}

          <div className="px-[24px] pb-6 mt-6">
            <div className="post_box_white bg-white px-7 py-7 rounded-lg relative before:absolute before:-left-[1px] before:top-[0px] before:rounded-l-lg  before:w-[3px] before:h-[100%] before:border-l-[#0AD6AB] before:border-l-4  shadow-sm border border-[#eee]">
              <div className="flex gap-5 flex-wrap">
                <div className="w-[32%] mt-1">
                  <div className="relative w-full">
                    <HookTextField
                      name="description"
                      errors={errors}
                      control={control}
                      disabled={disableRequest == "review"}
                      labelText="Change Description"
                      placeholder="Enter Description"
                    />
                  </div>
                </div>
                <div className="w-[32%] ">
                  <div className="relative w-full mt-1">
                    <label className="font-[600]">Periority</label>
                    <HookFreeSelect
                      name="priority"
                      errors={errors}
                      disabled={disableRequest == "review"}
                      control={control}
                      required={false}
                      options={periorityList}
                    />
                  </div>
                </div>
                <div className="w-[32%] mt-1">
                  <div className="relative w-full">
                    <HookTextField
                      name="justification"
                      errors={errors}
                      control={control}
                      disabled={disableRequest == "review"}
                      labelText="Change Justification"
                      placeholder="Enter Justification"
                    />
                  </div>
                </div>
                <div className="w-[32%] mt-1">
                  <div className="relative w-full">
                    <HookTextField
                      name="benefits"
                      errors={errors}
                      control={control}
                      disabled={disableRequest == "review"}
                      labelText="Benefits"
                      placeholder="Enter Benefits"
                    />
                  </div>
                </div>
                <div className="w-[32%] mt-1">
                  <div className="relative w-full">
                    <HookTextField
                      name="proposedAction"
                      errors={errors}
                      control={control}
                      disabled={disableRequest == "review"}
                      labelText="Enter Proposed Actions"
                      placeholder="Proposed Actions"
                    />
                  </div>
                </div>
                <div className="w-[32%] mt-1">
                  <div className="relative w-full">
                    <HookTextField
                      name="risk"
                      errors={errors}
                      control={control}
                      disabled={disableRequest == "review"}
                      labelText="Enter Risk"
                      placeholder="Enter Risks"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* change Impact  */}
          <div className="px-[24px]">
            <h1 className="text-[#2f2f2f] text-[20px] mb-5 font-Manrope font-semibold">
              Change impact{" "}
            </h1>
            <div className="post_box_white bg-white px-7 py-7 rounded-lg relative before:absolute before:-left-[1px] before:top-[0px] before:rounded-l-lg  before:w-[3px] before:h-[100%] before:border-l-[#3061AF] before:border-l-4  shadow-sm border border-[#eee]">
              <div className="flex gap-5 flex-wrap">
                <div className="w-[47%] ">
                  <div className="flex space-x-3">
                    <div className="min-w-[120px]">
                      <HookCheckBox
                        name="isScopeShow"
                        errors={errors}
                        control={control}
                        labelText="Scope"
                      />
                    </div>
                    {isScopeShow && (
                      <div className="w-full">
                        <HookTextField
                          name="scope"
                          disabled={disableRequest == "review"}
                          errors={errors}
                          control={control}
                          width="400px"
                          type="textarea"
                          placeholder="Enter Scope"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-[47%] ml-8 ">
                  <div className="flex">
                    <div className="min-w-[120px]">
                      <HookCheckBox
                        name="isCostShow"
                        errors={errors}
                        control={control}
                        labelText="Cost"
                      />
                    </div>
                    {isCostShow && (
                      <div className="w-full ">
                        <HookTextField
                          name="cost"
                          errors={errors}
                          disabled={disableRequest == "review"}
                          type="textarea"
                          width="400px"
                          control={control}
                          placeholder="Enter Cost"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-[47%]">
                  <div className="flex space-x-2">
                    <div className="min-w-[120px]">
                      <HookCheckBox
                        name="isQualityShow"
                        errors={errors}
                        control={control}
                        labelText="Quality"
                      />
                    </div>
                    {isQualityShow && (
                      <div className="w-full">
                        <HookTextField
                          name="quality"
                          errors={errors}
                          disabled={disableRequest == "review"}
                          control={control}
                          type="textarea"
                          placeholder="Enter Quality"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-[47%] ml-8">
                  <div className="flex space-x-3">
                    <div className="min-w-[110px]">
                      <HookCheckBox
                        name="isResourceShow"
                        errors={errors}
                        control={control}
                        labelText="Resources"
                      />
                    </div>
                    {isResourceShow && (
                      <div className="w-full">
                        <HookTextField
                          name="resources"
                          errors={errors}
                          control={control}
                          disabled={disableRequest == "review"}
                          width="400px"
                          type="textarea"
                          placeholder="Enter Resources"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-[40%]">
                  <div>
                    <div className="flex items-center peer-checked:visible">
                      <HookTextField
                        name="schedule"
                        errors={errors}
                        control={control}
                        disabled={disableRequest == "review"}
                        placeholder=""
                        type="date"
                        width="300px"
                        labelText="Schedule Date"
                      />
                    </div>
                  </div>
                </div>

                {schedule && (
                  <>
                    <div className="w-[100%] mt-3 border border-t-[#eee] border-b-0 border-l-0 border-r-0 pt-8">
                      <div>
                        <HookCheckBox
                          name="isAddTask"
                          errors={errors}
                          control={control}
                          labelText="Add New Milestone"
                        />
                      </div>
                      {isAddTask && (
                        <div>
                          <div className="mt-2 gap-5 flex items-center peer-checked:visible">
                            <div className="relative w-[33%]">
                              <label className="font-semibold text-[15px] mb-1 font-Manrope ">
                                Name
                              </label>
                              <HookTextField
                                name="name"
                                errors={errors}
                                disabled={disableRequest == "review"}
                                control={control}
                                placeholder="Enter Name"
                              />
                            </div>
                            <div className="relative w-[33%]">
                              <label className="font-semibold text-[15px] mb-1 font-Manrope ">
                                Start Date
                              </label>
                              <HookTextField
                                name="startDate"
                                errors={errors}
                                disabled={disableRequest == "review"}
                                control={control}
                                type="date"
                              />
                            </div>
                            <div className="relative w-[33%]">
                              <label className="font-semibold text-[15px] mb-1 font-Manrope ">
                                End Date
                              </label>
                              <HookTextField
                                name="endDate"
                                errors={errors}
                                disabled={disableRequest == "review"}
                                control={control}
                                type="date"
                              />
                            </div>
                            {!disableRequest && (
                              <div className="relative top-[5px]">
                                <div
                                  onClick={addMilestone}
                                  disabled={disableRequest == "review"}
                                  className="w-[120px] h-[40px] px-[14px] py-[8px] font-Manrope font-semibold text-sm bg-[#00A99B] rounded-md text-white flex items-center justify-center"
                                  role="button"
                                >
                                  Add
                                </div>
                              </div>
                            )}
                          </div>
                          {/* /// table /// */}
                          <div className="overflow-auto lg:overflow-visible my-5">
                            <table className="table text-gray-400 border-separate text-sm text-left w-full">
                              <thead className="bg-gray-100 text-gray-500">
                                <tr className="">
                                  <th className="p-3 text-[#2f2f2f] font-semibold ">
                                    Milestone Name
                                  </th>
                                  <th className="p-3 text-[#2f2f2f] font-semibold ">
                                    Start Date
                                  </th>
                                  <th className="p-3 text-[#2f2f2f] font-semibold">
                                    End Date
                                  </th>
                                  {!disableRequest && (
                                    <th className="p-3 text-[#2f2f2f] font-semibold">
                                      Actions
                                    </th>
                                  )}
                                </tr>
                              </thead>
                              <tbody className="">
                                {mileStoneList?.map((val, index) => {
                                  return (
                                    <tr className="bg-gray-100" key={val?.id}>
                                      <td className="p-3">
                                        <div className="text-[#2f2f2f]">
                                          {val?.name}
                                        </div>
                                      </td>
                                      <td className="p-3">
                                        <div className="text-[#2f2f2f] ">
                                          {val?.startDate}
                                        </div>
                                      </td>
                                      <td className="p-3">
                                        <div className="text-[#2f2f2f] ]">
                                          {val?.endDate}
                                        </div>
                                      </td>
                                      {!disableRequest && (
                                        <td className="p-3">
                                          <div
                                            className="text-[#f00] cursor-pointer "
                                            onClick={() =>
                                              deleteMilestone(val?.id)
                                            }
                                          >
                                            <DeleteIcon />
                                          </div>
                                        </td>
                                      )}
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* update milestone  */}
                    <div className="w-[100%] mt-1 border border-t-[#eee] border-b-0 border-l-0 border-r-0 pt-8">
                      <div>
                        <HookCheckBox
                          name="isUpdateMileStone"
                          errors={errors}
                          control={control}
                          labelText="Update Milestone"
                        />
                      </div>
                      {isUpdateMileStone && (
                        <div>
                          <div className="mt-3 gap-5 flex items-center peer-checked:visible">
                            <div className="relative w-[33%] ">
                              <label className="font-[600]">
                                Mile stone name
                              </label>
                              <HookFreeSelect
                                name="milstone_id"
                                errors={errors}
                                control={control}
                                disabled={disableRequest == "review"}
                                required={false}
                                options={milestoneDropDown}
                              />
                            </div>
                            <div className="relative w-[33%] mt-5">
                              <label className="font-semibold text-[15px]  font-Manrope ">
                                Start Date
                              </label>
                              <HookTextField
                                name="update_startDate"
                                errors={errors}
                                disabled={disableRequest == "review"}
                                control={control}
                                type="date"
                              />
                            </div>
                            <div className="relative w-[33%] mt-5">
                              <label className="font-semibold text-[15px]  font-Manrope ">
                                End Date
                              </label>
                              <HookTextField
                                name="update_endDate"
                                errors={errors}
                                disabled={disableRequest == "review"}
                                control={control}
                                type="date"
                              />
                            </div>
                            <div className="relative top-[13px]">
                              <div className="flex space-x-2 items-center">
                                {!disableRequest && (
                                  <div
                                    onClick={updateSecondMilestone}
                                    className="w-[120px] h-[40px] px-[14px] py-[8px] font-Manrope font-semibold text-sm bg-[#00A99B] rounded-md text-white flex items-center justify-center"
                                    role="button"
                                    disabled={disableRequest == "review"}
                                  >
                                    Add
                                  </div>
                                )}

                                {showEdit && (
                                  <div
                                    onClick={updateUnique}
                                    className="w-[120px] h-[40px] px-[14px] py-[8px] font-Manrope font-semibold text-sm bg-[#00A99B] rounded-md text-white flex items-center justify-center"
                                    role="button"
                                  >
                                    Edit
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          {/* /// table /// */}
                          <div className="overflow-auto lg:overflow-visible my-5">
                            <table className="table text-gray-400 border-separate text-sm text-left w-full">
                              <thead className="bg-gray-100 text-gray-500">
                                <tr>
                                  <th className="p-3 text-[#2f2f2f] font-semibold">
                                    Milestone Name
                                  </th>
                                  <th className="p-3 text-[#2f2f2f] font-semibold">
                                    Start Date
                                  </th>
                                  <th className="p-3 text-[#2f2f2f] font-semibold">
                                    End Date
                                  </th>
                                  {!disableRequest && (
                                    <th className="p-3 text-[#2f2f2f] font-semibold">
                                      Actions
                                    </th>
                                  )}
                                </tr>
                              </thead>
                              <tbody>
                                {updateMileStoneList?.map((val, index) => {
                                  const name = milestoneDropDown?.find(
                                    (list) => {
                                      return val?.milstone_id == list?.value;
                                    }
                                  );
                                  return (
                                    <tr className="bg-gray-100" key={index}>
                                      <td className="p-3">
                                        <div className="text-[#2f2f2f]">
                                          {name?.label}
                                        </div>
                                      </td>
                                      <td className="p-3">
                                        <div className="text-[#2f2f2f]">
                                          {val?.update_startDate}
                                        </div>
                                      </td>
                                      <td className="p-3">
                                        <div className="text-[#2f2f2f]">
                                          {val?.update_endDate}
                                        </div>
                                      </td>
                                      {!disableRequest && (
                                        <td className="p-3">
                                          <div className="flex gap-3">
                                            <div
                                              className="text-[#888] cursor-pointer"
                                              onClick={() => {
                                                setSelectedItem({ index, val });
                                                setShowEdit(true);
                                              }}
                                            >
                                              <EditIcon />
                                            </div>
                                            <div
                                              className="text-[#f00] cursor-pointer "
                                              onClick={() =>
                                                deleteMilestoneSecond(index)
                                              }
                                            >
                                              <DeleteIcon />
                                            </div>
                                          </div>
                                        </td>
                                      )}
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                          {/* /// End table /// */}
                        </div>
                      )}
                    </div>
                    {/* Add New Tasks  */}
                    <div className="w-[100%] mt-1 border border-t-[#eee] border-b-0 border-l-0 border-r-0 pt-8">
                      <div>
                        <HookCheckBox
                          name="isAddNewShow"
                          errors={errors}
                          control={control}
                          labelText="Add New Task"
                        />
                      </div>
                      <div>
                        {isAddNewShow && (
                          <div>
                            <div className="flex w-[300px] justify-between  items-center">
                              <div className="w-full">
                                <label className="font-[600]">
                                  Choose Milesteon
                                </label>
                                <HookSelectField
                                  name="task_milstone_id"
                                  errors={errors}
                                  isDisabled={disableRequest == "review"}
                                  control={control}
                                  required={false}
                                  loadOptions={chooseAllMilestone}
                                />
                              </div>
                            </div>
                            {task_milstone_id && (
                              <div className="mt-3 gap-5 flex items-center peer-checked:visible">
                                <div className="relative w-[33%]">
                                  <HookTextField
                                    name="task_name"
                                    errors={errors}
                                    disabled={disableRequest == "review"}
                                    control={control}
                                    placeholder="Enter Name"
                                    labelText="Name"
                                  />
                                </div>
                                <div className="relative w-[33%]">
                                  <label className="font-semibold text-[15px] mb-1 font-Manrope ">
                                    Start Date
                                  </label>
                                  <HookTextField
                                    name="task_startDate"
                                    errors={errors}
                                    disabled={disableRequest == "review"}
                                    control={control}
                                    type="date"
                                  />
                                </div>
                                <div className="relative w-[33%]">
                                  <label className="font-semibold text-[15px] mb-1 font-Manrope ">
                                    End Date
                                  </label>
                                  <HookTextField
                                    name="task_endDate"
                                    errors={errors}
                                    disabled={disableRequest == "review"}
                                    control={control}
                                    type="date"
                                  />
                                </div>
                                <div className="relative w-[33%]">
                                  <HookSelectField
                                    name="users"
                                    errors={errors}
                                    control={control}
                                    required={false}
                                    disabled={disableRequest == "review"}
                                    // placeholder="Search by name or enter email to invite ..."
                                    loadOptions={workspaceAllUsers}
                                    isMulti={true}
                                  />
                                </div>
                                <div className="relative top-[2px]">
                                  <div className="flex space-x-2 items-center">
                                    <div
                                      onClick={taskMileStoneAdd}
                                      className="w-[120px] h-[40px] px-[14px] py-[8px] font-Manrope font-semibold text-sm bg-[#00A99B] rounded-md text-white flex items-center justify-center"
                                      role="button"
                                    >
                                      Add
                                    </div>
                                    {showTaskEdit && (
                                      <div
                                        disabled={disableRequest == "review"}
                                        onClick={updateTaskUpdate}
                                        className="w-[120px] h-[40px] px-[14px] py-[8px] font-Manrope font-semibold text-sm bg-[#00A99B] rounded-md text-white flex items-center justify-center"
                                        role="button"
                                      >
                                        Edit
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                            {/* /// table /// */}
                            <div className="overflow-auto lg:overflow-visible my-5">
                              <table className="table text-gray-400 border-separate text-sm text-left w-full">
                                <thead className="bg-gray-100 text-gray-500">
                                  <tr>
                                    <th className="p-3 text-[#2f2f2f] font-semibold">
                                      Milestone Name
                                    </th>
                                    <th className="p-3 text-[#2f2f2f] font-semibold">
                                      Start Date
                                    </th>
                                    <th className="p-3 text-[#2f2f2f] font-semibold">
                                      End Date
                                    </th>
                                    <th className="p-3 text-[#2f2f2f] font-semibold">
                                      Assign to
                                    </th>
                                    {!disableRequest && (
                                      <th className="p-3 text-[#2f2f2f] font-semibold">
                                        Actions
                                      </th>
                                    )}
                                  </tr>
                                </thead>
                                <tbody>
                                  {taskMilestoneList?.map((val, index) => {
                                    return (
                                      <tr className="bg-gray-100">
                                        <td className="p-3">
                                          <div className="text-[#2f2f2f]">
                                            {val.task_name}
                                          </div>
                                        </td>
                                        <td className="p-3">
                                          <div className="text-[#2f2f2f]">
                                            {val?.task_startDate}
                                          </div>
                                        </td>

                                        <td className="p-3">
                                          <div className="text-[#2f2f2f]">
                                            {val?.task_endDate}
                                          </div>
                                        </td>
                                        <td className="p-3">
                                          <div className="text-[#2f2f2f]">
                                            {val?.users?.map((user) => {
                                              return (
                                                <div>
                                                  {user?.label || user?.email}
                                                </div>
                                              );
                                            })}
                                            {/* {userShow} */}
                                          </div>
                                        </td>
                                        {!disableRequest && (
                                          <td className="p-3 ">
                                            <div className="flex gap-3">
                                              <div
                                                className="text-[#888] cursor-pointer"
                                                onClick={() => {
                                                  setShowTaskEdit(true);
                                                  setTaskSelected({
                                                    index,
                                                    val,
                                                  });
                                                }}
                                              >
                                                <EditIcon />
                                              </div>
                                              <div
                                                className="text-[#f00] cursor-pointer"
                                                onClick={() => delTasks(index)}
                                              >
                                                <DeleteIcon />
                                              </div>
                                            </div>
                                          </td>
                                        )}
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* end new Tasks // */}
                {disableRequest == "review" ? (
                  <div className="flex mt-8 justify-end w-full">
                    <div
                      class=" h-[34px] px-[16px] py-[5px] mr-5 font-Manrope font-semibold text-[14px] bg-[#00A99B] rounded-md text-white flex items-center justify-center"
                      role="button"
                      type="submit"
                      onClick={() => changeRequest(moduleInfo)}
                    >
                      Accept
                      {acceptLoading && <CircularProgress size={20} />}
                    </div>
                    <div
                      class=" h-[34px] px-[16px] py-[5px] font-Manrope font-semibold text-[14px] bg-[#FF614B] rounded-md text-white flex items-center justify-center"
                      role="button"
                      type="submit"
                    >
                      Reject
                    </div>
                  </div>
                ) : (
                  <div className="relative mb-5 flex w-full justify-end">
                    <button
                      className="w-[150px] h-[40px] px-[14px] py-[8px] font-Manrope font-semibold text-[16px] bg-[#00A99B] rounded-md text-white flex items-center justify-center"
                      role="button"
                      type="submit"
                      onClick={handleSubmit(onSubmit)}
                    >
                      {requestLoding || updateLoading ? (
                        <CircularProgress size={25} />
                      ) : checkType == "edit" ? (
                        "Edit"
                      ) : (
                        "Sumbit"
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </Fragment>
  );
}

export default ChangeRequest;
