import React from "react";
import styled from "@emotion/styled";
import { Draggable } from "react-beautiful-dnd";

import { Button, TextField, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, Stack, Typography, Badge, Avatar, Popover } from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ArticleIcon from "@mui/icons-material/Article";
import { useDispatch } from "react-redux";
import { taskDrawyerOpen } from "redux/actions";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { DateRangePicker } from "react-date-range";
import moment from "moment";
import { useState } from "react";
import Select from "react-select";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useMutation } from "@tanstack/react-query";
import WhiteButton from "hooks/Common/commonButtons/WhiteButton";
import GreenButton from "hooks/Common/commonButtons/GreenButton";
import axios from "axios";
import { isEmpty } from "lodash";
import AvatarGroup from "@mui/material/AvatarGroup";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const Task = ({ task, index }) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const workspaceId = localStorage.getItem("workspaceId");
  const [isOpendateChange, setIsOpendateChange] = useState(false);
  const [assigneeName, setAssigneeName] = useState("");
  const [DateRangeVal, setDateRangeVal] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleOnChange = (ranges) => {
    const { selection } = ranges;
    setDateRangeVal([selection]);
  };

  const handleAssigntoChange = (event) => {
    let Id = event.value;
    let payload = {
      assignee: Id,
    };
    updateAssignee(payload);
  };

  const { mutate: updateDateRande, isLoading: updatingDateRange } = useMutation(
    {
      mutationKey: ["date_update", task?.taskId],
      mutationFn: (data) => axios.put(`/task/update_duration/${task?.taskId}`, data),
      onSuccess: (data) => {
        if (data?.data?.success) {
          enqueueSnackbar(data.data.message, { variant: "success" });
          queryClient.invalidateQueries(["task_details"]);
          setIsOpendateChange(false);
        }
      },
      onError: (data) => {
        enqueueSnackbar(data?.response?.data?.message, { variant: "error" });
      },
    }
  );

  const handleSubmitDateChange = () => {
    const payload = {
      startDate: DateRangeVal[0]?.startDate,
      dueDate: DateRangeVal[0]?.endDate,
    };
    if (!isEmpty(payload)) {
      updateDateRande(payload);
    }
  };

  const { data: usersList } = useQuery({
    queryKey: "workspace_members",
    queryFn: () => axios.get(`workspace/workspace_members/${workspaceId}`),
    select: (res) => {
      return res?.data?.data.map((val) => {
        return {
          value: val?.user_Id,
          label: val?.name,
        };
      });
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
    refetchOnWindowFocus: false,
  });

  const { mutate: updateAssignee } = useMutation({
    mutationKey: ["update_assignee"],
    mutationFn: (data) =>
      axios.put(`/task/update_assignee/${task?.taskId}?assignee=${data.assignee}`),
    onSuccess: (data) => {
      if (data.data.success) {
        // queryClient.invalidateQueries(["task_list_all"]);
        queryClient.invalidateQueries(["task_details"]);

        enqueueSnackbar(data.data.message, { variant: "success" });
      }
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  const { mutate: deleteTask } = useMutation({
    mutationKey: ["delete_task"],
    mutationFn: () =>
      axios.delete(`/task/${task?.taskId}`),
    onSuccess: (data) => {
        enqueueSnackbar(data.data.message, { variant: "success" });
        queryClient.invalidateQueries(["task_list_all"]);
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  const { data: taskDetails } = useQuery(
    ["task_details", task?.taskId],
    () => {
      return axios.get(`/task/${task?.taskId}`);
    },
    {
      enabled: !!task?.taskId,
      select: (res) => {
        return res?.data?.data;
      },
      onSuccess: (data) => {
        let payload = [
          {
            startDate: new Date(data.startDate),
            endDate: new Date(data.dueDate),
            key: "selection",
          },
        ];
        setDateRangeVal(payload);
      },
      refetchOnWindowFocus: false,
    }
  );


  return (
    <Draggable draggableId={`task-${task.taskId}`} index={index} type="task">
      {(provided, snapshot) => (
        <Container
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          isDragging={snapshot.isDragging}
          
        >
          <Box
            sx={{
              border: "1px solid #ebecf4",
              borderRadius: "4px",
              background: "white",
              height: "auto",
              marginBottom: "10px",
              width: "100%",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              padding={"10px"}
            >
              <Stack direction="column" spacing={2} onClick={() => dispatch(taskDrawyerOpen(task.taskId))}>
                <Badge color="default">
                  <Typography fontSize="13px" color="#8e94bb">
                    {task.name}
                  </Typography>
                  
                </Badge>
                <Typography fontSize="14px"> {task?.description ? task?.description: task.name}</Typography>
                <Stack direction="row" alignItems={"center"} spacing={1}>
                  <ArticleIcon
                    sx={{
                      fill: "#8e94bb",
                      fontSize: "10px",
                    }}
                  />
                  <Typography color="#8e94bb" fontSize="10px">
                    0/1
                  </Typography>
                </Stack>
              </Stack>
              <Stack direction="column" className="flex justify-between items-end">
                <DeleteOutlineIcon className="cursor-pointer" onClick={deleteTask}/>
                <div className= "flex space-x-1 pl-[15px] items-center">
                <div>
                              <PopupState
                                variant="popover"
                                popupId="demo-popup-popover"
                              >
                                {(popupState) => (
                                  <div>
                                    <div
                                      {...bindTrigger(popupState)}
                                      className="w-max cursor-pointer rounded-md bg-white flex items-center justify-center"
                                    >
                                      <div
                                        className="cursor-pointer"
                                        onClick={() =>
                                          setIsOpendateChange(true)
                                        }
                                      >
                                        {/* <h3 className="text-[14px] text-[#B1B5D0] font-[500] h-[20px] hover:border-b-2 border-dashed ">
                                        {moment(taskDetails?.startDate).format(
                                          "ll"
                                        )}
                                        -{" "}
                                        {moment(taskDetails?.dueDate).format(
                                          "ll"
                                        )}
                                      </h3> */}
                                        {!DateRangeVal[0]? (
                                          <DateRangeIcon
                                            sx={{
                                              fontSize: "15px",
                                              color: "#B1B5D0",
                                            }}
                                            // onClick={() => setIsOpendateChange(true)}
                                          />
                                        ) : (
                                          <p className="text-[12px] mr-[5px]">
                                            {moment(
                                              DateRangeVal[0]
                                            ).format("ll")}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    {isOpendateChange && (
                                      <Popover
                                        onClose={() =>
                                          setIsOpendateChange(false)
                                        }
                                        {...bindPopover(popupState)}
                                        anchorOrigin={{
                                          vertical: "bottom",
                                          horizontal: "center",
                                        }}
                                        transformOrigin={{
                                          vertical: "top",
                                          horizontal: "center",
                                        }}
                                      >
                                        <div>
                                          <DateRangePicker
                                            onChange={handleOnChange}
                                            showSelectionPreview={true}
                                            moveRangeOnFirstSelection={false}
                                            months={2}
                                            ranges={DateRangeVal}
                                            direction="horizontal"
                                          />
                                          <div className="flex space-x-2 justify-end p-4 cursor-pointer">
                                            <WhiteButton
                                              onClick={() =>
                                                setIsOpendateChange(false)
                                              }
                                              buttonText="Cancel"
                                            />
                                            <GreenButton
                                              loading={updatingDateRange}
                                              onClick={handleSubmitDateChange}
                                              buttonText="Save"
                                            />
                                          </div>
                                        </div>
                                      </Popover>
                                    )}
                                  </div>
                                )}
                              </PopupState>
                            </div>
                            <div>
                              <PopupState
                                variant="popover"
                                popupId="demo-popup-popover"
                              >
                                {(popupState) => (
                                  <div>
                                    <div
                                      {...bindTrigger(popupState)}
                                      className="w-max cursor-pointer border bg-white flex items-center justify-center"
                                    >
                                                                  {taskDetails?.assigneeName?.length <= 0 ? (
                                      <AccountBoxIcon
                                        sx={{
                                          fontSize: "13px",
                                          fill: "#009084",
                                        }}
                                      />
                                                                  ): (

                                                                    <AvatarGroup
                                  sx={{
                                    "& .MuiAvatar-root": {
                                      width: 20,
                                      height: 20,
                                      fontSize: 13,
                                    },
                                  }}
                                  variant="rounded"
                                  spacing="medium"
                                  max={3}
                                >
                                  {taskDetails?.assigneeName?.map(
                                    (obj, index) => {
                                      const sliceName = obj?.name?.slice(0, 1);
                                      return (
                                        <Avatar
                                          key={index}
                                          alt={sliceName}
                                          src={sliceName}
                                        />
                                      );
                                    }
                                  )}
                                </AvatarGroup>
                                                                    
                                                                  )}
                                    </div>

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
                                    >
                                      <Box
                                        sx={{
                                          width: "200px",
                                          height: "200px",
                                          overflow: "auto",
                                        }}
                                      >
                                        <div className="mt-2 px-2">
                                          <Select
                                            options={usersList}
                                            placeholder="Search..."
                                            onChange={(e) =>
                                              handleAssigntoChange(e)
                                            }
                                          />
                                        </div>
                                      </Box>
                                    </Popover>
                                  </div>
                                )}
                              </PopupState>
                            </div>
                </div>
                
              </Stack>
            </Stack>
          </Box>
        </Container>
      )}
    </Draggable>
  );
};

export default Task;

const Container = styled("div")`
  opacity: ${(props) => (props.isDragging ? "0.5" : "1")};
  width: 100%;
`;
