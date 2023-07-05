import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  IconButton,
  FormControlLabel,
  Checkbox,
  Stack,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Slide from "@mui/material/Slide";
import CloseIcon from "@mui/icons-material/Close";
import styled from "@emotion/styled";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { makeStyles } from "@mui/styles";
import { closeProjectTask } from "redux/actions";
import { useDispatch } from "react-redux";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const initialColumns = [
  { id: "group", title: "Group", isChecked: true },
  { id: "status", title: "Status", isChecked: true },
  { id: "list", title: "List", isChecked: true },
  { id: "assignees", title: "Assignees", isChecked: true },
  { id: "due_date", title: "Due Date", isChecked: true },
  { id: "tags", title: "Tags", isChecked: true },
  { id: "start_date", title: "Start Date", isChecked: false },
  { id: "created_at", title: "Created At", isChecked: false },
  { id: "completed_on", title: "Completed On", isChecked: false },
  { id: "reminder", title: "Reminder", isChecked: false },
  { id: "story_points", title: "Story Points", isChecked: false },
  { id: "tracked_time", title: "Tracked Time", isChecked: false },
];

function EditTasksColumns({ open, onClose }) {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const [id, setId] = useState(null);

  const [columns, setColumns] = useState(initialColumns);
  const classes = useStyles();

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newColumns = Array.from(columns);
    const [removed] = newColumns.splice(result.source.index, 1);
    newColumns.splice(result.destination.index, 0, removed);

    setColumns(newColumns);
  };

  const handleMouseEnter = (id) => {
    setIsHovered(true);
    setId(id);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setId(null);
  };
  return (
    <div className=" m-auto flex h-full justify-center items-center flex-col">
      <Dialog
        maxWidth="sm"
        fullWidth
        open={open}
        TransitionComponent={Transition}
        onClose={onClose}>
        <div className="flex justify-between px-[15px] items-center bg-[#fafbfd] w-full cursor-pointer">
          <div>
            <DialogTitle
              id="responsive-dialog-title"
              className="text-[#373737] text-[24px] font-Manrope font-bold">
              Edit Columns
            </DialogTitle>
          </div>
          <div>
            <IconButton
              edge="start"
              color="inherit"
              onClick={onClose}
              aria-label="close">
              <CloseIcon
                sx={{
                  width: "40px",
                  height: "40px",
                  fill: "gray",
                  fontSize: "18px",
                  padding: "3px 3px",
                }}
                className="border bg-white hover:bg-[#f98a3f] hover:fill-white rounded-md cursor-pointer"
              />
            </IconButton>
          </div>
        </div>
        <DialogContent dividers>
          <div className="px-[15px]">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <p className="font-Manrope font-semibold text-base">
                  Show,Hide,and Reorganize columns to fit your Workflow Help
                </p>
              </Grid>
              <Grid item xs={12}>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="columns">
                    {(provided, snapshot) => (
                      <Container
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        isDraggingOver={snapshot.isDraggingOver}>
                        {columns.map((column, index) => (
                          <Draggable
                            key={column.id}
                            draggableId={column.id}
                            index={index}>
                            {(provided) => (
                              <div
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                                onMouseEnter={() =>
                                  handleMouseEnter(column?.id)
                                }
                                onMouseLeave={handleMouseLeave}>
                                <Stack direction="row" alignItems="center">
                                  <span
                                    className={
                                      isHovered && id == column?.id
                                        ? classes.visibleDiv
                                        : classes.hiddenDiv
                                    }>
                                    <DragIndicatorIcon
                                      style={{ color: "gray" }}
                                    />
                                  </span>
                                  <div
                                    className="flex border-[#01ac9e] mb-[10px]"
                                    style={{
                                      border: "1px solid #01ac9e",
                                      borderRadius: "8px",
                                      boxShadow: "0 2px 2px rgba(0,0,0,.04)",
                                      padding: "10px",
                                      cursor: "move",
                                      width: "100%",
                                    }}>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          sx={{
                                            "&, &.Mui-checked": {
                                              color: "#00A99B",
                                            },
                                          }}
                                          size="small"
                                          checked={column.isChecked}
                                          onChange={() => {
                                            const updatedColumns = [...columns];
                                            const columnIndex =
                                              updatedColumns.findIndex(
                                                (col) => col.id === column.id
                                              );
                                            updatedColumns[
                                              columnIndex
                                            ].isChecked =
                                              !updatedColumns[columnIndex]
                                                .isChecked;
                                            setColumns(updatedColumns);
                                          }}
                                        />
                                      }
                                      label={column.title}
                                    />
                                  </div>
                                </Stack>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </Container>
                    )}
                  </Droppable>
                </DragDropContext>
              </Grid>
            </Grid>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EditTasksColumns;

const Container = styled("div")`
  opacity: ${(props) => (props.isDraggingOver ? "0.5" : "1")};
`;

const useStyles = makeStyles((theme) => ({
  hiddenDiv: {
    visibility: "hidden",
    //   paddingTop: "0.25rem",
    paddingBottom: "0.25rem",
  },
  visibleDiv: {
    visibility: "visible",
    //   paddingTop: "0.25rem",
    paddingBottom: "0.25rem",
  },
}));
