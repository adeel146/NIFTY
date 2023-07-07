import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { Box, Divider, Checkbox, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Fade from "react-reveal/Fade";
import ActionItem from "./ActionItem";
import TalkingPoint from "./TalkingPoint";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import NotePad from "./NotePad";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useSelector } from "react-redux";
import { isEmpty } from "lodash";
import moment from "moment";
import EmptyComponent from "./EmptyComponent";
import { useDispatch } from "react-redux";

import {
  addNewTalkingPoint,
  addNewactionItems,
  changeMeetingDate,
  changeMeetingName,
  removeUsers,
  resetMeetingState,
  setCurrentMeeting,
} from "redux/reducers/minutesofmeetings";
import { v4 as uuidv4 } from "uuid";
import GreenButton from "hooks/Common/commonButtons/GreenButton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import AddMeetingModal from "../AddMeetingModal";
import ShareModal from "./ShareModal";
import SingleRow from "./SingleRow";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteMilestone from "../DeleteMilestone";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} {...props} />
))(({ theme }) => ({
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&.Mui-expanded": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  // backgroundColor:
  //   theme.palette.mode === "dark"
  //     ? "rgba(255, 255, 255, .05)"
  //     : "rgba(0, 0, 0, .03)",
  backgroundColor: "white",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
  "&.Mui-expanded": {
    borderBottom: 0,
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: 0,
}));

function RightSide(props) {
  const ITEM_HEIGHT = 48;
  const [expanded, setExpanded] = useState(["panel1", "panel2", "panel3"]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showOptions, setshowOptions] = useState(false);
  const [newTalkingPoint, setNewTalkingPoint] = useState(false);
  const [newActionItem, setNewActionItem] = useState(false);
  const [isOpenShareModal, setIsOpenShareModal] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = React.useState(false);

  const open = Boolean(anchorEl);
  const queryClient = useQueryClient();
  const { selectedmeeting } = useSelector(
    (state) => state.minutesofmeetingSlice
  );

  const { projectId } = useParams();

  const dispatch = useDispatch();
  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  // useEffect(() => {
  //   return () => {
  //     dispatch(resetMeetingState());
  //   };
  // }, []);

  const handleChange = (panel) => (event, newExpanded) => {
    if (expanded.includes(panel)) {
      const NewVal = expanded.filter((val) => val !== panel);
      setExpanded(NewVal);
    } else {
      setExpanded((prev) => [...prev, panel]);
    }
  };
  const options = [
    "None",
    "Atria",
    "Callisto",
    "Dione",
    "Ganymede",
    "Hangouts Call",
    "Luna",
    "Oberon",
    "Phobos",
    "Pyxis",
    "Sedna",
    "Titania",
    "Triton",
    "Umbriel",
  ];

  const workspaceId = localStorage.getItem("workspaceId");

  const { data: usersList } = useQuery({
    queryKey: "workspace/workspace_members",
    queryFn: () => axios.get(`workspace/workspace_members/${workspaceId}`),
    select: (res) => {
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
    refetchOnWindowFocus: false,
  });

  const { mutate, isLoading } = useMutation({
    mutationKey: ["updateMeeting"],
    mutationFn: (data) => axios.put(`meeting/${selectedmeeting.id}`, data),
    onSuccess: (data) => {
      enqueueSnackbar(data.data.message, { variant: "success" });
      queryClient.invalidateQueries(["getmeetings"]);
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  const handleAddActionItem = (event) => {
    const value = event.target.value;
    const payload = {
      id: 0,
      name: value,
      completed: newActionItem,
      userIds: [],
      isTask: false,
      milestoneId: null,
      startDate: "",
      endDate: "",
    };
    dispatch(addNewactionItems(payload));
    event.target.value = "";
    setNewActionItem(false);
  };

  const handleAddTalkingPoint = (event) => {
    const value = event.target.value;
    const payload = {
      id: 0,
      name: value,
      completed: newTalkingPoint,
      user_Id: null,
    };
    dispatch(addNewTalkingPoint(payload));
    event.target.value = "";
    setNewTalkingPoint(false);
  };

  const { mutate: DeleteMeeting, isLoading: isDeletingMeeting } = useMutation({
    mutationKey: ["deleteMilestone"],
    mutationFn: () =>
      axios.delete(`meeting/remove_meeting/${selectedmeeting.id}`),
    onSuccess: (data) => {
      enqueueSnackbar(data.data.message, { variant: "success" });
      queryClient.invalidateQueries(["getmeetings"]);
      dispatch(resetMeetingState());
      setIsOpenDelete(false);
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  const handleSubmit = () => {
    const actionItems = selectedmeeting.actionItems?.map((item) => {
      let userIds = [];
      if (item.userIds.length > 0) {
        userIds = item.userIds.map((obj) => obj.user_Id);
      }
      return {
        ...item,
        userIds,
      };
    });
    const talkingPoints = selectedmeeting.talkingPoints?.map((item) => {
      let user_Id = null;
      if (item.user_Id) {
        user_Id = item.user_Id.user_Id;
      }
      return {
        ...item,
        user_Id,
      };
    });

    const users = selectedmeeting.users.map((user) => user.email) || [];
    const payload = {
      ...selectedmeeting,
      users,
      project_Id: projectId,
      actionItems,
      talkingPoints,
    };
    mutate(payload);
  };
  return isEmpty(selectedmeeting) ? (
    <EmptyComponent />
  ) : (
    <>
      <ShareModal
        isOpen={isOpenShareModal}
        handleClose={() => setIsOpenShareModal(false)}
      />
      <div className="bg-white h-[77vh] overflow-y-auto mx-[3em] ">
        {/* Header */}
        <div className="items-center px-8 py-5 border border-t-0 border-l-0 border-r-0 border-b-[#eee]">
          <div className="flex justify-between items-center  ">
            <div>
              <input
                className="w-[300px] font-bold mb-2 "
                value={selectedmeeting.name}
                onChange={(event) =>
                  dispatch(changeMeetingName(event.target.value))
                }
              />
              <p className=" w-max mt-1 text-[gray] bg-[#f6f6f6] hover:bg-[#E4E9ED] rounded-sm ">
                <input
                  value={moment(selectedmeeting.when).format(
                    "YYYY-MM-DDTHH:mm"
                  )}
                  onChange={(e) => dispatch(changeMeetingDate(e.target.value))}
                  type="datetime-local"
                  className=" w-[180px] h-[30px] mt-1 text-[gray] bg-[#f6f6f6] text-xs hover:bg-[#E4E9ED] rounded-sm border-none"
                  min={new Date().toISOString().slice(0, 16)}
                />
              </p>
            </div>
            <div className="flex items-center space-x-1 ">
              <a
                onClick={() => setIsOpenDelete(true)}
                href="#"
                className="text-[#2f2f2f] hover:text-[#000]"
              >
                <DeleteIcon className="hover:text-red-600" />
              </a>
              <div className="w-full flex justify-end ">
                <GreenButton
                  buttonText="Save"
                  style={{ width: "70px", height: "30px" }}
                  onClick={handleSubmit}
                  loading={isLoading}
                />
              </div>
            </div>
          </div>

          <div className="fullTanle-info mt-3 ">
            <h1 className="text-[#2f2f2f] flex text-[18px] mb-3 font-semibold font-Manrope">
              Share with Teammates{" "}
              <Tooltip title="Share" arrow>
                <Avatar
                  style={{
                    marginLeft: "5px",
                    width: 30,
                    height: 30,
                    fontSize: 20,
                    border: "1px solid lightgray",
                  }}
                  alt="Travis Howard"
                  className="cursor-pointer !bg-white hover:!bg-gray-100 "
                  onClick={() => setIsOpenShareModal(true)}
                >
                  {" "}
                  <AddIcon sx={{ color: "black" }} />{" "}
                </Avatar>
              </Tooltip>
            </h1>
            <div className="overflow-auto lg:overflow-visible mb-5">
              <table className="table text-gray-400 border-separate text-sm text-left w-full">
                <thead className="bg-gray-100 text-gray-500">
                  <tr>
                    <th className="p-3 text-[#2f2f2f] font-semibold">Name</th>
                    <th className="p-3 text-[#2f2f2f] font-semibold">Email</th>
                    <th className="p-3 text-[#2f2f2f] font-semibold">Role</th>
                    <th className="p-3 text-[#2f2f2f] font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedmeeting.users.map((user, index) => (
                    <SingleRow key={user.id} user={user} index={index} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Body Component  */}

          <div>
            <Accordion
              expanded={expanded.includes("panel2")}
              onChange={handleChange("panel2")}
            >
              <AccordionSummary
                onMouseEnter={() => setshowOptions(2)}
                onMouseLeave={() => setshowOptions(null)}
                aria-controls="panel2d-content"
                id="panel2d-header"
              >
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  width={"100%"}
                >
                  <Typography sx={{ fontWeight: "bold" }}>
                    Talking Points
                  </Typography>
                  <Box className="flex justify-center items-center ">
                    {showOptions === 2 && (
                      <Fade big>
                        <div className="max-h-[20px]">
                          <IconButton
                            aria-label="more"
                            id="long-button"
                            aria-controls={open ? "long-menu" : undefined}
                            aria-expanded={open ? "true" : undefined}
                            aria-haspopup="true"
                            onClick={handleClick}
                            sx={{ padding: "0px" }}
                          >
                            <MoreVertIcon fontSize="12px" />
                          </IconButton>
                          <Menu
                            id="long-menu"
                            MenuListProps={{
                              "aria-labelledby": "long-button",
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            PaperProps={{
                              style: {
                                maxHeight: ITEM_HEIGHT * 4.5,
                                width: "20ch",
                              },
                            }}
                          >
                            {options.map((option) => (
                              <MenuItem
                                key={option}
                                selected={option === "Pyxis"}
                                onClick={handleClose}
                              >
                                {option}
                              </MenuItem>
                            ))}
                          </Menu>
                        </div>
                      </Fade>
                    )}
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <div className="px-9">
                  <small className="text-[gray]">
                    The things to talk about
                  </small>
                  {selectedmeeting.talkingPoints.map((option, index) => (
                    <>
                      <TalkingPoint
                        key={option}
                        data={option}
                        index={index}
                        users={usersList}
                      />
                      <Divider />
                    </>
                  ))}
                  <div className="flex space-x-1 items-center">
                    <Checkbox
                      className="!p-0 !py-1 "
                      icon={
                        <RadioButtonUncheckedIcon sx={{ color: "#6477F8" }} />
                      }
                      checkedIcon={
                        <CheckCircleOutlineIcon sx={{ color: "#6477F8" }} />
                      }
                      checked={newTalkingPoint}
                      onChange={(event) =>
                        setNewTalkingPoint(event.target.checked)
                      }
                    />
                    <input
                      className="text-[gray] w-full"
                      placeholder="New Talking Point"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddTalkingPoint(e);
                        }
                      }}
                    />
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded.includes("panel1")}
              onChange={handleChange("panel1")}
            >
              <AccordionSummary
                onMouseEnter={() => setshowOptions(1)}
                onMouseLeave={() => setshowOptions(null)}
                aria-controls="panel1d-content"
                id="panel1d-header"
              >
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  width={"100%"}
                >
                  <Typography sx={{ fontWeight: "bold" }}>
                    Action Items
                  </Typography>
                  <Box className="flex justify-center items-center ">
                    {showOptions === 1 && (
                      <Fade big>
                        <div className="max-h-[20px]">
                          <IconButton
                            aria-label="more"
                            id="long-button"
                            aria-controls={open ? "long-menu" : undefined}
                            aria-expanded={open ? "true" : undefined}
                            aria-haspopup="true"
                            onClick={handleClick}
                            sx={{ padding: "0px" }}
                          >
                            <MoreVertIcon fontSize="12px" />
                          </IconButton>
                          <Menu
                            id="long-menu"
                            MenuListProps={{
                              "aria-labelledby": "long-button",
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            PaperProps={{
                              style: {
                                maxHeight: ITEM_HEIGHT * 4.5,
                                width: "20ch",
                              },
                            }}
                          >
                            {options.map((option) => (
                              <MenuItem
                                key={option}
                                selected={option === "Pyxis"}
                                onClick={handleClose}
                              >
                                {option}
                              </MenuItem>
                            ))}
                          </Menu>
                        </div>
                      </Fade>
                    )}
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <div className="px-9">
                  <small className="text-[gray]">
                    What came out of this meeting? What are your next steps?
                  </small>
                  {selectedmeeting?.actionItems.map((option, index) => (
                    <>
                      <ActionItem
                        key={option}
                        data={option}
                        index={index}
                        users={usersList}
                      >
                        {option}
                      </ActionItem>
                      <Divider />
                    </>
                  ))}
                  <div className="flex space-x-1 items-center">
                    <Checkbox
                      className=" !py-1 "
                      sx={{
                        color: "#6477F8",
                        borderColor: "#6477F8",
                        "&.Mui-checked": {
                          color: "#6477F8",
                        },
                        padding: "0px",
                      }}
                      onChange={(e) => setNewActionItem(e.target.checked)}
                    />
                    <input
                      className="text-[gray] w-full"
                      placeholder="New Action Item"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddActionItem(e);
                        }
                      }}
                    />
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={expanded.includes("panel3")}
              onChange={handleChange("panel3")}
            >
              <AccordionSummary
                onMouseEnter={() => setshowOptions(3)}
                onMouseLeave={() => setshowOptions(null)}
                aria-controls="panel3d-content"
                id="panel3d-header"
              >
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  width={"100%"}
                >
                  <Typography sx={{ fontWeight: "bold" }}>NotePad</Typography>
                  <Box className="flex justify-center items-center ">
                    {showOptions === 3 && (
                      <Fade big>
                        <div className="max-h-[20px]">
                          <IconButton
                            aria-label="more"
                            id="long-button"
                            aria-controls={open ? "long-menu" : undefined}
                            aria-expanded={open ? "true" : undefined}
                            aria-haspopup="true"
                            onClick={handleClick}
                            sx={{ padding: "0px" }}
                          >
                            <MoreVertIcon fontSize="12px" />
                          </IconButton>
                          <Menu
                            id="long-menu"
                            MenuListProps={{
                              "aria-labelledby": "long-button",
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            PaperProps={{
                              style: {
                                maxHeight: ITEM_HEIGHT * 4.5,
                                width: "20ch",
                              },
                            }}
                          >
                            {options.map((option) => (
                              <MenuItem
                                key={option}
                                selected={option === "Pyxis"}
                                onClick={handleClose}
                              >
                                {option}
                              </MenuItem>
                            ))}
                          </Menu>
                        </div>
                      </Fade>
                    )}
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <div className="px-9">
                  <small className="mb-5 text-[gray] ">
                    Anything else to write down?
                  </small>
                  <NotePad />
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      </div>
      <DeleteMilestone
        open={isOpenDelete}
        handleClose={() => setIsOpenDelete(false)}
        Submit={DeleteMeeting}
        lodaing={isDeletingMeeting}
      />
    </>
  );
}

export default RightSide;
