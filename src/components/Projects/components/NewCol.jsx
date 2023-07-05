import { Droppable, Draggable } from "react-beautiful-dnd";
import styled from "@emotion/styled";
import Task from "./Task";
import { useState } from "react";
import { Button, TextField, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, Stack, Typography, Badge } from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ArticleIcon from "@mui/icons-material/Article";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import WhiteButton from "hooks/Common/commonButtons/WhiteButton";
import GreenButton from "hooks/Common/commonButtons/GreenButton";
import NewTask from "./NewTask";
const NewCol = (props) => {
  const { tasks, column, index, setStarter, starter } = props;
  const [newTaskContent, setNewTaskContent] = useState("");
  const [isOpenNewTask, setIsOpenNewTask] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newColumnName, setNewColumnName] = useState(column.title);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  const { mutate: addTask, isLoading: addingTask } = useMutation({
    mutationKey: ["addTask"],
    mutationFn: (body) => axios.post("task/basic", body),
    onSuccess: (response) => {
      // Reset the new task content
      setStarter((prev) => {
        const updatedTasks = prev.map((obj) => {
          if (obj.statusId === data.statusId) {
            let UpdatedRecord = obj;
            UpdatedRecord.tasks.push(response?.data?.data);
          }
          return obj;
        });
        return updatedTasks;
      });
      setNewTaskContent("");
      setIsOpenNewTask(false);
    },
    onError: (data) => console.log(data, "Error"),
  });

  const { mutate: deleteStatus } = useMutation({
    mutationKey: ["deleteStatus"],
    mutationFn: () => axios.delete(`status/${data?.statusId}`),
    onSuccess: (response) => {
      console.log(response, "res");
      if (response.data.success) {
        return;
      }
    },
    onError: (data) => console.log(data, "data"),
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
  };
  const handleDeleteColumn = (columnId) => {
    // Create a copy of the columns object and remove the specified column
    const updatedColumns = { ...starter.columns };
    delete updatedColumns[columnId];

    // Create a copy of the columnOrder array and remove the specified columnId
    const updatedColumnOrder = starter.columnOrder.filter(
      (id) => id !== columnId
    );

    // Update the state with the updated columns and columnOrder
    setStarter((prevState) => ({
      ...prevState,
      columns: updatedColumns,
      columnOrder: updatedColumnOrder,
    }));
  };

  const handleColumnRename = () => {
    if (newColumnName.trim() === "") {
      return;
    }

    setStarter((prevState) => {
      const updatedColumn = {
        ...prevState.columns[column.id],
        title: newColumnName,
      };

      return {
        ...prevState,
        columns: {
          ...prevState.columns,
          [column.id]: updatedColumn,
        },
      };
    });
    setIsRenaming(false);
  };

  const handleAddTask = (currCol) => {
    if (newTaskContent.trim() === "") {
      return;
    }

    // Create a new task object
    const newTaskId = `task-${new Date().getTime()}`;
    const newTask = {
      id: newTaskId,
      content: newTaskContent,
    };

    // Update the tasks array with the new task
    const updatedTasks = [...tasks, newTask];

    // Update the state with the updated tasks array and add the new task to the respective column
    setStarter((prevState) => {
      const column = prevState.columns[currCol.id]; // Fix the variable name here
      const updatedColumn = {
        ...column,
        taskIds: [...column.taskIds, newTaskId],
      };

      return {
        ...prevState,
        tasks: {
          ...prevState.tasks,
          [newTaskId]: newTask,
        },
        columns: {
          ...prevState.columns,
          [column.id]: updatedColumn,
        },
      };
    });

    // Reset the new task content
    setNewTaskContent("");
  };

  return (
    <Draggable draggableId={`${column.statusId}`} index={index} type="column">
      {(provided, snapshot) => (
        <Container
          ref={provided.innerRef}
          {...provided.draggableProps}
          isDragging={snapshot.isDragging}
        >
          {/* Column content */}
          {/* ... */}
          <Stack direction="column" marginTop="10px" spacing={1}>
            <Box
              {...provided.dragHandleProps}
              sx={{
                border: "1px solid #ebecf4",
                borderRadius: "4px",
                background: "white",
              }}
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
                      <IconButton>
                        <AccountBoxIcon
                          sx={{
                            fontSize: "14px",
                            fill: "#009084",
                          }}
                        />
                      </IconButton>
                      <Typography className="!font-medium">
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
                        <MenuItem
                          onClick={() => handleDeleteColumn(column.statusId)}
                        >
                          Delete
                        </MenuItem>
                      </Menu>
                    </Stack>
                  )}
                </Title>
              </Stack>
            </Box>

            {/* Render tasks within the column */}
            <Droppable
              droppableId={`${column.statusId}`}
              type="task"
              direction="vertical"
            >
              {(_provided, snapshot) => (
                <TaskList
                  isDraggingOver={snapshot.isDraggingOver}
                  ref={_provided.innerRef}
                  //   {..._provided.droppableProps}
                >
                  {tasks.map((task, index) => (
                    <NewTask key={task.taskId} task={task} index={index} />
                  ))}
                  {_provided.placeholder}
                </TaskList>
              )}
            </Droppable>
          </Stack>
        </Container>
      )}
    </Draggable>
  );
};

export default NewCol;

const Container = styled("div")`
  opacity: ${(props) => (props.isDragging ? "0.5" : "1")};
  width: 100%;
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
