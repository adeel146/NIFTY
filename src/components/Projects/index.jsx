import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Column from "./components/column";
import styled from "@emotion/styled";
import { Grid, Button, TextField, CircularProgress } from "@mui/material";
import { useParams } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import _ from "lodash";
import NewCol from "./components/NewCol";
import { enqueueSnackbar } from "notistack";
import TaskDrwayer from "components/Main/homeDashboard/dashboard/widgetsCards/taskwidget/TaskDrwayer";
import { useSelector } from "react-redux";
import ListViewProjects from "./components/ListViewProjects";
import ReportsViewTasks from "components/Layout/AllTasks/ReportsViewTasks";

function Projects({ selectedList }) {
  let { projectId } = useParams();

  const [starter, setStarter] = useState([]);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [apiData, setData] = useState(data);
  const isOpenTaskDrawer = useSelector(
    (state) => state?.projectTaskSlice?.taskState
  );

  const { isloading } = useQuery({
    queryKey: ["get-kanban", projectId],
    queryFn: () => axios.get(`/task/get_kanban_status/${projectId}`),
    onSuccess: (data) => {
      setStarter(data.data.data);
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
    enabled: !!projectId,
    refetchOnWindowFocus: false,
  });

  const { mutate: addStatus, isLoading: addingStatus } = useMutation({
    mutationKey: ["addStatus"],
    mutationFn: (body) => axios.post("status", body),
    onSuccess: (response) => {
      console.log(response, "res");
      if (response.data.success) {
        // Reset the new task content
        starter.push(response.data.data);
        setNewColumnTitle("");
        setIsAddingColumn(false);
      }
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });
  const { mutate: taskReorder } = useMutation({
    mutationKey: ["task-status_reorder"],
    mutationFn: (body) => axios.put("/task/status_reorder", body),
    // onSuccess: (response) => {
    //   console.log(response, "res");
    //   if (response.data.success) {
    //     // Reset the new task content
    //     starter.push(response.data.data);
    //     setNewColumnTitle("");
    //     setIsAddingColumn(false);
    //   }
    // },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });
  const { mutate: statusReorder } = useMutation({
    mutationKey: ["status/organize"],
    mutationFn: (body) => axios.put("/status/organize", body),
    // onSuccess: (response) => {
    //   console.log(response, "res");
    //   if (response.data.success) {
    //     // Reset the new task content
    //     starter.push(response.data.data);
    //     setNewColumnTitle("");
    //     setIsAddingColumn(false);
    //   }
    // },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  // a little function to help us with reordering the result
  const reorderList = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const reorderCardList = (lists, source, destination) => {
    const current = _.find(lists, {
      statusId: +source.droppableId?.split("-").pop(),
    });
    const next = _.find(lists, {
      statusId: +destination.droppableId?.split("-").pop(),
    });
    const target = current.tasks[source.index];

    // moving to same list
    if (source.droppableId === destination.droppableId) {
      const reordered = reorderList(
        current.tasks,
        source.index,
        destination.index
      );
      return lists.map((list) => {
        if (list.statusId === +source.droppableId?.split("-").pop()) {
          list.tasks = reordered;
        }
        return list;
      });
    }

    // moving to different list

    // remove from original
    current.tasks.splice(source.index, 1);
    // insert into next
    next.tasks.splice(destination.index, 0, target);

    return lists.map((list) => {
      if (list.statusId === +source.droppableId?.split("-").pop()) {
        return current;
      }
      if (list.statusId === +destination.droppableId?.split("-")?.pop()) {
        return next;
      }
      return list;
    });
  };

  const onDragEnd = ({ destination, source, type, ...rest }) => {
    console.log({ destination, source, type, rest }, "test");
    // dropped nowhere
    if (!destination) {
      return;
    }

    // did not move anywhere - can bail early
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // reordering list
    if (type === "column") {
      let payload = {
        status_Id: starter[source.index].statusId,
        orderIndex: destination.index,
      };
      statusReorder(payload);
      setStarter(reorderList([...starter], source.index, destination.index));
    }

    // reordering card
    if (type === "task") {
      const current = _.find(starter, {
        statusId: +source.droppableId?.split("-").pop(),
      });
      const currentobj = current.tasks[source.index];

      let payload = {
        taskId: +currentobj.taskId,
        statusId: +destination.droppableId?.split("-").pop(),
        order: +destination.index,
      };
      taskReorder(payload);

      setStarter(reorderCardList([...starter], source, destination));
    }
  };

  // const onDragEnd = ({ destination, source, draggableId, type }) => {
  //   if (!destination) return;
  //   if (
  //     destination.droppableId === source.droppableId &&
  //     destination.index === source.index
  //   ) {
  //     return;
  //   }

  //   const start = starter.columns[source.droppableId];
  //   const end = starter.columns[destination.droppableId];

  //   if (type === "column") {
  //     console.log(destination, source, draggableId);
  //     const newOrder = [...starter.columnOrder];
  //     newOrder.splice(source.index, 1);
  //     newOrder.splice(destination.index, 0, draggableId);

  //     setStarter({
  //       ...starter,
  //       columnOrder: newOrder,
  //     });
  //     return;
  //   }

  //   if (start === end) {
  //     const column = starter.columns[source.droppableId];
  //     const taskIds = [...column.taskIds];
  //     taskIds.splice(source.index, 1);
  //     taskIds.splice(destination.index, 0, draggableId);
  //     const newColumn = {
  //       ...column,
  //       taskIds,
  //     };
  //     setStarter({
  //       ...starter,
  //       columns: {
  //         ...starter.columns,
  //         [column.id]: newColumn,
  //       },
  //     });
  //     return;
  //   }

  //   const startTaskIds = [...start.taskIds];
  //   const endTaskIds = [...end.taskIds];

  //   startTaskIds.splice(source.index, 1);
  //   endTaskIds.splice(destination.index, 0, draggableId);

  //   const newStartColumn = {
  //     ...start,
  //     taskIds: startTaskIds,
  //   };
  //   const endTaskColumn = {
  //     ...end,
  //     taskIds: endTaskIds,
  //   };

  //   setStarter({
  //     ...starter,
  //     columns: {
  //       ...starter.columns,
  //       [start.id]: newStartColumn,
  //       [end.id]: endTaskColumn,
  //     },
  //   });
  // };
  const handleAddColumnClick = () => {
    setIsAddingColumn(true);
  };
  const handleAddColumn = () => {
    if (newColumnTitle.trim() === "") {
      return;
    }

    let payload = {
      name: newColumnTitle,
      project_Id: projectId,
    };

    addStatus(payload);
  };
  const AddColumnButton = styled(Button)`
    margin-top: 10px;
    border: 1px solid #ebecf4;
    border-radius: 4px;
    background: white;
    color: #2f2f2f;
    width: max-content;
    padding: 5px 20px 5px 20px;
  `;
  return isloading ? (
    <div className="flex justify-center items-center h-[30em] ">
      <CircularProgress />
    </div>
  ) : selectedList === "list" ? (
    <ListViewProjects selectedView={selectedList} />
  ) : selectedList === "report" ? (
    <ReportsViewTasks />
  ) : (
    <>
      {isOpenTaskDrawer && <TaskDrwayer />}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" type="column" direction="horizontal">
          {(provided, snapshot) => (
            <Container
              isDraggingOver={snapshot.isDraggingOver}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <div className="space-x-5 flex  w-[100%] overflow-auto   " >
                {starter?.map((column, index) => {
                  return (
                    <div key={column.statusId} className=" flex-shrink-0 ">
                      <Column
                        index={index}
                        column={column}
                        tasks={column?.tasks}
                        setStarter={setStarter}
                        starter={starter}
                        setIsAddingColumn={setIsAddingColumn}
                        isAddingColumn={isAddingColumn}
                      />
                    </div>
                  );
                })}
                <div>
                  {isAddingColumn ? (
                    <div className="flex flex-col mt-[10px] w-[230px] ">
                      <TextField
                        type="text"
                        placeholder="Enter column name"
                        value={newColumnTitle}
                        onChange={(e) => setNewColumnTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleAddColumn();
                          }
                        }}
                      />
                      <Button onClick={handleAddColumn}>
                        Add Column {addingStatus && <CircularProgress />}{" "}
                      </Button>
                    </div>
                  ) : (
                    <AddColumnButton onClick={handleAddColumnClick}>
                      + Add status
                    </AddColumnButton>
                  )}
                </div>
              </div>

              {provided.placeholder}
            </Container>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}
export default Projects;
const data = [
  {
    statusId: 1,
    statusName: "Todo",
    orderIndex: 0,
    taskCount: 0,
    tasks: [
      {
        taskId: 1,
        name: "Task 1",
        dueDate: "2023-06-12T09:05:14.033Z",
        milestoneName: "Milestone 1",
        noOfComments: 0,
        noOfAttachments: 0,
        picture: {
          file_name: "string",
          file_identifier: "string",
          file_path: "string",
        },
        totalSubTasks: 0,
        doneSubTasks: 0,
        completedOn: "2023-06-12T09:05:14.033Z",
        orderIndex: 0,
        assignees: [
          {
            id: 0,
            user_Id: 0,
            workspace_Id: 0,
            name: "John Doe",
            email: "john.doe@example.com",
            role: 1,
            photo: {
              file_name: "string",
              file_identifier: "string",
              file_path: "string",
            },
            tags: [
              {
                id: 0,
                name: "Tag 1",
              },
            ],
          },
        ],
        subTasks: [
          {
            subTaskId: 0,
            subTaskName: "Subtask 1",
            noOfComments: 0,
            isCompleted: true,
          },
        ],
      },
    ],
  },
  {
    statusId: 2,
    statusName: "In Progress",
    orderIndex: 1,
    taskCount: 0,
    tasks: [
      {
        taskId: 2,
        name: "Task 2",
        dueDate: "2023-06-12T09:05:14.033Z",
        milestoneName: "Milestone 1",
        noOfComments: 0,
        noOfAttachments: 0,
        picture: {
          file_name: "string",
          file_identifier: "string",
          file_path: "string",
        },
        totalSubTasks: 0,
        doneSubTasks: 0,
        completedOn: "2023-06-12T09:05:14.033Z",
        orderIndex: 0,
        assignees: [
          {
            id: 0,
            user_Id: 0,
            workspace_Id: 0,
            name: "John Doe",
            email: "john.doe@example.com",
            role: 1,
            photo: {
              file_name: "string",
              file_identifier: "string",
              file_path: "string",
            },
            tags: [
              {
                id: 0,
                name: "Tag 1",
              },
            ],
          },
        ],
        subTasks: [
          {
            subTaskId: 0,
            subTaskName: "Subtask 1",
            noOfComments: 0,
            isCompleted: true,
          },
        ],
      },
    ],
  },
  {
    statusId: 3,
    statusName: "Done",
    orderIndex: 2,
    taskCount: 0,
    tasks: [
      {
        taskId: 3,
        name: "Task 2",
        dueDate: "2023-06-12T09:05:14.033Z",
        milestoneName: "Milestone 1",
        noOfComments: 0,
        noOfAttachments: 0,
        picture: {
          file_name: "string",
          file_identifier: "string",
          file_path: "string",
        },
        totalSubTasks: 0,
        doneSubTasks: 0,
        completedOn: "2023-06-12T09:05:14.033Z",
        orderIndex: 0,
        assignees: [
          {
            id: 0,
            user_Id: 0,
            workspace_Id: 0,
            name: "John Doe",
            email: "john.doe@example.com",
            role: 1,
            photo: {
              file_name: "string",
              file_identifier: "string",
              file_path: "string",
            },
            tags: [
              {
                id: 0,
                name: "Tag 1",
              },
            ],
          },
        ],
        subTasks: [
          {
            subTaskId: 0,
            subTaskName: "Subtask 1",
            noOfComments: 0,
            isCompleted: true,
          },
        ],
      },
    ],
  },
];

const Container = styled("div")`
  display: flex;
  padding: 15px;
`;
// const initialData = {
//   tasks: {
//     "task-1": { id: "task-1", content: "I am task 1" },
//     "task-2": { id: "task-2", content: "I am task 2" },
//     "task-3": { id: "task-3", content: "I am task 3" },
//     "task-4": { id: "task-4", content: "I am task 4" },
//     "task-5": { id: "task-5", content: "I am task 5" },
//     "task-6": { id: "task-6", content: "I am task 6" },
//   },
//   columns: {
//     "column-1": {
//       id: "column-1",
//       title: "Todo",
//       taskIds: ["task-1", "task-2"],
//     },
//     "column-2": {
//       id: "column-2",
//       title: "In Progress",
//       taskIds: ["task-3", "task-4"],
//     },
//     "column-3": {
//       id: "column-3",
//       title: "Done",
//       taskIds: ["task-5", "task-6"],
//     },
//   },
//   columnOrder: ["column-1", "column-2", "column-3"],
// };
