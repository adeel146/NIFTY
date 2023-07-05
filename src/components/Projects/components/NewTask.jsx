import React from "react";
import styled from "@emotion/styled";
import { Draggable } from "react-beautiful-dnd";

import { Button, TextField, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, Stack, Typography, Badge } from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ArticleIcon from "@mui/icons-material/Article";

const NewTask = ({ task, index }) => {
  return (
    <Draggable draggableId={`${task.taskId}`} index={index} type="task">
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
              <Stack direction="column" spacing={2}>
                <Badge color="default">
                  <Typography fontSize="13px" color="#8e94bb">
                    {task.name}
                  </Typography>
                </Badge>
                <Typography fontSize="14px"> {task.name}</Typography>
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
              <Stack direction="column" justifyContent="flex-end">
                <AccountBoxIcon
                  sx={{
                    fontSize: "13px",
                    fill: "#009084",
                  }}
                />
              </Stack>
            </Stack>
          </Box>
        </Container>
      )}
    </Draggable>
  );
};

export default NewTask;

const Container = styled("div")`
  opacity: ${(props) => (props.isDragging ? "0.5" : "1")};
  width: 100%;
`;
