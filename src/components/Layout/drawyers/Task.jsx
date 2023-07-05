import React, { useEffect, useState } from "react";
import { CheckBox } from "@mui/icons-material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Divider, Popover, Box } from "@mui/material";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import Select from "react-select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
// import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import moment from "moment";
import { DateCalendar } from "@mui/x-date-pickers";
import GreenButton from "hooks/Common/commonButtons/GreenButton";

function Task(props) {
  const { data, projects } = props;
  const [isOpenUsers, setIsOpenUsers] = useState(false);
  const [dueDate, setdueDate] = useState(
    data.dueDate ? new Date(data.dueDate) : new Date()
  );
  const [isOpenDueDate, setIsOpenDueDate] = useState(false);
  const [membersList, setmembersList] = useState(projects || []);
  const [projectId, setprojectId] = useState(null);
  const [openStatus, setOpenStatus] = useState(false);
  const queryClient = useQueryClient();

  console.log(openStatus, "openStatus");

  const { data: statusList = [] } = useQuery({
    queryKey: ["workspace/workspace_members", { projectId }],
    queryFn: () => axios.get(`status/${projectId}`),
    select: (res) => {
      console.log(res, "res");
      return res?.data?.data.map((val) => {
        return {
          value: val?.user_Id,
          label: val?.name,
          ...val,
        };
      });
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
    enabled: !!projectId,
    refetchOnWindowFocus: false,
  });

  const { mutate: updateDueDate, isLoading } = useMutation({
    mutationKey: ["update_dueDate"],
    mutationFn: () =>
      axios.put(
        `/personaltask/update_due_date/${data?.id}?dueDate=${moment(dueDate)
          .endOf("day")
          .format("YYYY-MM-DDTHH:mm:ss")}`
      ),
    onSuccess: (data) => {
      if (data.data.success) {
        queryClient.invalidateQueries(["personal_task_list"]);
        setIsOpenDueDate(false);
      }
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });
  const { mutate: convertToTask } = useMutation({
    mutationKey: ["update_dueDate"],
    mutationFn: (data) => axios.post(`/personaltask/convert_to_task`, data),
    onSuccess: (data) => {
      if (data.data.success) {
        queryClient.invalidateQueries(["personal_task_list"]);
        setOpenStatus(false);
      }
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  const handleAssigntoChange = (event) => {
    setprojectId(event.value);
    setOpenStatus(true);
  };

  const closeChildren = () => {
    setOpenStatus(false);
  };

  const handleChangeStatus = (event) => {
    const payload = {
      personalTaskId: data.id,
      statusId: event.value,
      projectId: projectId,
    };
    convertToTask(payload);
    setIsOpenUsers(false);
  };
  return (
    <div className="">
      <div className="flex space-x-1 items-center px-4 py-0">
        <CheckBox
        // onClick={() => completePersonalTask(data?.id)}
        />
        <h3>{data?.name}</h3>
      </div>
      <div className="flex space-x-4 text-[14px] text-[#9399BE]">
        <PopupState variant="popover" popupId="demo-popup-popover">
          {(popupState) => (
            <div>
              {!popupState.isOpen && closeChildren()}
              <div
                {...bindTrigger(popupState)}
                className="w-full cursor-pointer rounded-md bg-white"
              >
                <div
                  onClick={() => setIsOpenUsers(true)}
                  className="flex space-x-2 items-center pl-[3.8rem]"
                >
                  <EditNoteIcon sx={{ fontSize: "16px" }} />
                  <h3 className="border-b-white border-dashed border-b-2 hover:border-b-[#52A99B] hover:text-[#52A99B]">
                    Add a project
                  </h3>
                </div>
              </div>
              {isOpenUsers && (
                <Popover
                  {...bindPopover(popupState)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  style={{ zIndex: 9999999999 }}
                >
                  <Box
                    sx={{
                      width: "200px",
                      height: "200px",
                      overflow: "auto",
                    }}
                  >
                    <div className="mt-2 px-2">
                      {!openStatus ? (
                        <Select
                          menuIsOpen={true}
                          options={membersList}
                          placeholder="Search..."
                          onChange={handleAssigntoChange}
                        />
                      ) : (
                        <Select
                          menuIsOpen={true}
                          options={statusList}
                          placeholder="Search..."
                          onChange={handleChangeStatus}
                        />
                      )}
                    </div>
                  </Box>
                </Popover>
              )}
            </div>
          )}
        </PopupState>
        <PopupState variant="popover" popupId="date-popover">
          {(popupState) => (
            <div>
              <div
                {...bindTrigger(popupState)}
                className="w-full cursor-pointer rounded-md bg-white"
              >
                <div
                  onClick={() => setIsOpenDueDate(true)}
                  className="flex space-x-2 items-center"
                >
                  <CalendarMonthIcon sx={{ fontSize: "16px" }} />
                  <h3
                    className={`${
                      moment(data.dueDate) < new Date() && "text-red-300"
                    } border-b-white border-dashed border-b-2 hover:border-b-[#52A99B] hover:text-[#52A99B] `}
                  >
                    {" "}
                    {data.dueDate
                      ? moment(data.dueDate).format("MMM D, YYYY")
                      : "Due Date"}{" "}
                  </h3>
                </div>
              </div>
              {isOpenDueDate && (
                <Popover
                  onClose={() => setIsOpenDueDate(false)}
                  {...bindPopover(popupState)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  style={{ zIndex: 99999999 }}
                >
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <div>
                      <DateCalendar
                        value={dueDate}
                        onChange={(data) => setdueDate(data)}
                      />
                      <div className="p-2 flex justify-end ">
                        <GreenButton
                          loading={isLoading}
                          onClick={() => updateDueDate()}
                          buttonText="Save"
                        />
                      </div>
                    </div>
                  </LocalizationProvider>
                </Popover>
              )}
            </div>
          )}
        </PopupState>
      </div>
      <div className="py-3">
        <Divider />
      </div>
    </div>
  );
}

export default Task;
