import { Droppable, Draggable } from "react-beautiful-dnd";
import styled from "@emotion/styled";
import Task from "./Task";
import { useState } from "react";
import {
  Button,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  Stack,
  Typography,
  Badge,
  Avatar,
  AvatarGroup,
  Popover,
} from "@mui/material";
import moment from "moment";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ArticleIcon from "@mui/icons-material/Article";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import WhiteButton from "hooks/Common/commonButtons/WhiteButton";
import GreenButton from "hooks/Common/commonButtons/GreenButton";
import { filter, reject, random, find } from "lodash";
import { useParams } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { useSelector } from "react-redux";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import Select from "react-select";
import { DateRangePicker } from "react-date-range";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import HookSelectField from "hooks/Common/HookSelectField";

const Column = (props) => {
  const { tasks, column, index, setStarter, starter } = props;
  const [newTaskContent, setNewTaskContent] = useState("");
  const [isOpenNewTask, setIsOpenNewTask] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newColumnName, setNewColumnName] = useState(column.title);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const { projectId } = useParams();

  const { mutate: addTask, isLoading: addingTask } = useMutation({
    mutationKey: ["addTask"],
    mutationFn: (body) => axios.post("task/basic", body),
    onSuccess: (response) => {
      // Create a new task object
      const newTask = {
        taskId: response.data.data.id,
        ...response.data.data,
      };

      const newList = starter.map((val) => {
        if (val.statusId === column.statusId) {
          return {
            ...val,
            tasks: [...val.tasks, newTask],
          };
        } else {
          return val;
        }
      });

      setStarter(newList);
      setIsOpenNewTask(false);
      // Reset the new task content
      setNewTaskContent("");
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const { data: mileStoneCardList } = useQuery(
    ["milestone_list", +projectId],
    () => {
      return axios.get(`/milestone/listing/${+projectId}`);
    },
    {
      select: (res) => {
        return res?.data?.data.map((val) => {
          return {
            value: val?.id,
            label: val?.name,
          };
        });
      },
    }
  );

  const open2 = Boolean(anchorEl2);
  const id2 = open2 ? "simple-popover" : undefined;

  const [milestoneValue, setMilestoneValue] = useState(null);
  const handleMilestoneChange = (e) => {
    setMilestoneValue(e?.value);
  };

  const { mutate: deleteStatus, isLoading } = useMutation({
    mutationKey: ["deleteStatus"],
    mutationFn: () => axios.delete(`status/${column.statusId}`),
    onSuccess: (response) => {
      if (response.data.success) {
        // Create a copy of the columns object and remove the specified column
        const updatedColumns = reject(starter, { statusId: column.statusId });

        // Update the state with the updated columns and columnOrder
        setStarter(updatedColumns);
      }
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
    setIsMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setIsMenuOpen(false);
  };

  const handleRename = () => {
    setIsRenaming(true);
    setIsMenuOpen(false);
    setNewColumnName(column?.statusName);
  };
  const handleDeleteColumn = (columnId) => {
    deleteStatus();
  };

  const handleColumnRename = () => {
    if (newColumnName.trim() === "") {
      return;
    }

    const newList = starter.map((val) => {
      if (val.statusId === column?.statusId) {
        return {
          ...val,
          statusName: newColumnName,
        };
      } else {
        return val;
      }
    });

    setStarter(newList);
    setNewColumnName("");
    setIsRenaming(false);
  };

  const handleAddTask = (currColumnId) => {
    if (newTaskContent.trim() === "") {
      return;
    }
    let payload = {
      name: newTaskContent,
      statusId: +currColumnId,
      projectId: +projectId,
      milestone_Id: milestoneValue ? milestoneValue : null,
      dueDate: DateRangeVal[0]?.endDate,
      assignees: [assignee ? assignee : null],
    };
    addTask(payload);
  };

  const [isOpendateChange, setIsOpendateChange] = useState(false);
  const [DateRangeVal, setDateRangeVal] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const workspaceId = localStorage.getItem("workspaceId");

  const taskId = useSelector((state) => state?.projectTaskSlice?.taskId);

  const handleSubmitDateChange = (e) => {
    // const { selection } = ranges;
    // setDateRangeVal([selection]);
    setIsOpendateChange(false);
  };

  const { data: usersList } = useQuery({
    queryKey: "workspace/workspace_members",
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

  const [assignee, setAssignee] = useState(null);
  const [assigneeName, setAssigneeName] = useState("");

  const handleAssigntoChange = (event) => {
    let Id = event.value;
    setAssignee(Id);
    setAssigneeName(event?.label);
    // updateAssignee(payload);
  };

  const handleOnChange = (ranges) => {
    const { selection } = ranges;
    setDateRangeVal([selection]);
  };

  return (
    <>
      <Draggable
        draggableId={`column-${column.statusId}`}
        index={index}
        type="column"
      >
        {(provided, snapshot) => (
          <Container
            ref={provided.innerRef}
            {...provided.draggableProps}
            isDragging={snapshot.isDragging}
          >
            <Stack direction="column" marginTop="10px" spacing={1}>
              <Box
                sx={{
                  border: "1px solid #ebecf4",
                  borderRadius: "4px",
                  background: "white",
                }}
                {...provided.dragHandleProps}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                >
                  <Title>
                    {isRenaming ? (
                      <TextField
                        value={newColumnName}
                        onChange={(e) => setNewColumnName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleColumnRename();
                          }
                        }}
                      />
                    ) : (
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        width="100%"
                        alignItems="center"
                      >
                        {/* <IconButton>
                          <AccountBoxIcon
                            sx={{
                              fontSize: "14px",
                              fill: "#009084",
                            }}
                          />
                        </IconButton> */}
                        <Typography className="!font-medium pl-[15px]">
                          {column.statusName}
                        </Typography>
                        <IconButton>
                          <MoreHorizIcon onClick={(e) => handleMenuOpen(e)} />
                        </IconButton>
                        <Menu
                          anchorEl={menuAnchorEl}
                          open={isMenuOpen}
                          onClose={handleMenuClose}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                          }}
                        >
                          <MenuItem onClick={handleRename}>Rename</MenuItem>
                          <MenuItem onClick={deleteStatus}>
                            Delete {isLoading && <CircularProgress size={20} />}
                          </MenuItem>
                        </Menu>
                      </Stack>
                    )}
                  </Title>
                  {snapshot.placeholder}
                </Stack>
              </Box>

              <Droppable droppableId={`column-${column.statusId}`} type="task">
                {(_provided, _snapshot) => (
                  <Box>
                    <TaskList
                      isDraggingOver={_snapshot.isDraggingOver}
                      ref={_provided.innerRef}
                      {..._provided.droppableProps}
                    >
                      {tasks?.length > 0 ? (
                        tasks?.map((task, indexidx) => (
                          <>
                            <Task
                              key={task.taskId}
                              task={task}
                              index={indexidx}
                            />
                            {/* {_snapshot.isDraggingOver && (
                              <Box
                                sx={{
                                  border: "1px dotted #ebecf4",
                                  borderRadius: "4px",
                                  background: "gray",
                                  height: "100px",
                                  marginBottom: "10px",
                                  width: "100%",
                                }}
                              ></Box>
                            )} */}
                          </>
                        ))
                      ) : (
                        <div className="p-3 border-[1px] mb-3 text-gray-400 rounded-md cursor-default ">
                          Drag tasks from another status or add a new task
                          here...
                        </div>
                      )}

                      {_provided.placeholder}
                    </TaskList>
                    <Box
                      sx={{
                        border: "1px solid #ebecf4",
                        borderRadius: "8px",
                        background: "white",
                        height: "auto",
                        marginBottom: "10px",
                      }}
                    >
                      {isOpenNewTask ? (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleAddTask(column?.statusId);
                          }}
                          className="border  rounded-md "
                        >
                          <TextField
                            variant="standard"
                            style={{
                              width: "100%",
                              height: "40px",
                              padding: "5px",
                            }}
                            inputRef={(input) => input && input.focus()}
                            type="text"
                            placeholder="New task"
                            value={newTaskContent}
                            onChange={(e) => setNewTaskContent(e.target.value)}
                            autoComplete="off"
                          />

                          {/* <div className="flex" style={{flexDirection: "column"}}> */}
                          {/* <DateRangeIcon
                                sx={{
                                  fontSize: "15px",
                                  color: "#B1B5D0",
                                }}
                                onClick={() => setIsOpendateChange(true)}
                              /> */}

                          {/* </div> */}
                          <div className="flex space-x-1 pl-[15px] items-center">
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
                                        {!DateRangeVal[0]?.endDate ? (
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
                                              DateRangeVal[0]?.endDate
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
                                          {/* <div className="flex space-x-2 justify-end p-4 cursor-pointer">
                                            <WhiteButton
                                              onClick={() =>
                                                setIsOpendateChange(false)
                                              }
                                              buttonText="Cancel"
                                            />
                                            <GreenButton
                                              // loading={updatingDateRange}
                                              onClick={handleSubmitDateChange}
                                              buttonText="Save"
                                            />
                                          </div> */}
                                        </div>
                                      </Popover>
                                    )}
                                  </div>
                                )}
                              </PopupState>
                            </div>
                            {/* {!assigneeName ? (
                              <div>
                                <AvatarGroup
                                  sx={{
                                    "& .MuiAvatar-root": {
                                      width: 24,
                                      height: 24,
                                      fontSize: 15,
                                    },
                                  }}
                                  variant="rounded"
                                  spacing="medium"
                                  max={3}
                                >
                                  
                                </AvatarGroup>
                              </div>
                            ) : (
                              <Avatar
                                sx={{
                                  "& .MuiAvatar-root": {
                                    width: 24,
                                    height: 24,
                                    fontSize: 15,
                                  },
                                }}
                                variant="rounded"
                                spacing="medium"
                                max={3}
                                alt={assigneeName?.slice(0, 1)}
                                src={assigneeName?.slice(0, 1)}
                              />
                            )} */}

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
                                      {!assigneeName ? (
                                        <AccountBoxIcon
                                          sx={{
                                            fontSize: "13px",
                                            fill: "#009084",
                                          }}
                                        />
                                      ) : (
                                        <Avatar
                                          sx={{
                                            fill: "#009084",
                                          }}
                                          style={{
                                            width: "20px",
                                            height: "20px",
                                            fontSize: "13px",
                                          }}
                                          variant="rounded"
                                          spacing="medium"
                                          max={3}
                                          alt={assigneeName?.slice(0, 1)}
                                          src={assigneeName?.slice(0, 1)}
                                        />
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

                            <div onClick={handleClick2}>
                              <FormatListBulletedIcon
                                sx={{ fontSize: "15px", color: "#B1B5D0" }}
                              />
                            </div>
                          </div>

                          <Box className="flex justify-end p-[10px] space-x-2 ">
                            <WhiteButton
                              buttonText="Cancel"
                              style={{ width: "40%", height: "35px" }}
                              onClick={() => setIsOpenNewTask(false)}
                            />
                            <GreenButton
                              buttonText="Save"
                              style={{ width: "40%", height: "35px" }}
                              onClick={() => handleAddTask(column?.statusId)}
                              type="submit"
                              loading={addingTask}
                            />
                          </Box>
                        </form>
                      ) : (
                        <Typography
                          padding="20px"
                          fontSize={"13px"}
                          textAlign="center"
                          color="#009084"
                          className="cursor-pointer mb-10 "
                          onClick={() => setIsOpenNewTask(true)}
                        >
                          Add a new task
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}
              </Droppable>
            </Stack>
          </Container>
        )}
      </Draggable>
      <Popover
        id2={id2}
        open={open2}
        anchorEl={anchorEl2}
        onClose={handleClose2}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box
          sx={{
            width: "180px",
            height: "220px",
            background: "white",
            paddingLeft: "2px",
            paddingRight: "2px",
          }}
        >
          <div className="mt-2 px-4">
            <Select
              options={mileStoneCardList}
              placeholder="Search..."
              onChange={(e) => handleMilestoneChange(e)}
              // isMulti={true}
            />
          </div>
        </Box>
      </Popover>
    </>
  );
};

export default Column;

const Container = styled("div")`
  opacity: ${(props) => (props.isDragging ? "0.5" : "1")};
  width: 280px;
`;
const Title = styled("h3")`
  // padding: 8px;
  width: 100%;
  font-weight: 700;
`;

const TaskList = styled("div")`
  border: ${(props) =>
    props.isDraggingOver ? "2px solid lightgreen" : "none"};
  transition: background-color ease 0.2s;
  width: 100%;
  max-height: 75vh;
  overflow: auto;
`;
