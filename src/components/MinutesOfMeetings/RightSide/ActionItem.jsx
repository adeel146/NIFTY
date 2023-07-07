import React, { useMemo, useState } from "react";
import {
  Avatar,
  AvatarGroup,
  Checkbox,
  Divider,
  ListItemIcon,
  ListItemText,
  Popover,
  Tooltip,
} from "@mui/material";
import { DateRangePicker } from "react-date-range";

import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { Box, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Fade from "react-reveal/Fade";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import { useDispatch } from "react-redux";
import { ContentCut } from "@mui/icons-material";
import {
  actionItemsCompleted,
  actionItemsDateChange,
  actionItemsInputChange,
  assignMileStoneActionItem,
  assignUserActionItem,
  convertActionItemtoTask,
  removeactionItems,
} from "redux/reducers/minutesofmeetings";
import Select from "react-select";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import moment from "moment";

function ActionItem(props) {
  const { data, index, users } = props;
  const filteredArray = useMemo(
    () =>
      users?.filter(
        (user) => !data?.userIds.some((user2) => user.user_Id === user2.user_Id)
      ),
    []
  );
  const ITEM_HEIGHT = 48;
  const [anchorEl, setAnchorEl] = useState(null);
  const [showOptions, setshowOptions] = useState(false);
  const [isOpenUsers, setIsOpenUsers] = useState(false);
  const [isOpenMilestone, setIsOpenMilestone] = useState(false);
  const [membersList, setMembersList] = useState(filteredArray);
  const [milestonelist, setMilestonelist] = useState([]);
  let { projectId } = useParams();

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
    const payload = {
      index,
      startDate: selection.startDate.toISOString(),
      endDate: selection.endDate.toISOString(),
    };
    dispatch(actionItemsDateChange(payload));
  };

  const open = Boolean(anchorEl);
  const dispatch = useDispatch();

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const options = [
    "None",
    "Atria",
    "Pyxis",
    "Sedna",
    "Titania",
    "Triton",
    "Umbriel",
  ];
  const handleCompleted = (event) => {
    const value = event.target.checked;
    const payload = {
      index,
      data: value,
    };
    dispatch(actionItemsCompleted(payload));
  };
  const handleInputChange = (event) => {
    const value = event.target.value;
    const payload = {
      index,
      data: value,
    };
    dispatch(actionItemsInputChange(payload));
  };

  const {} = useQuery({
    queryKey: ["get-milestone", projectId],
    queryFn: () => axios.get(`milestone/${projectId}`),
    onSuccess: (data) => {
      setMilestonelist(data);
    },
    select: (res) => {
      return res?.data?.data.map((val) => {
        return {
          value: val?.id,
          label: val?.name,
        };
      });
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
    refetchOnWindowFocus: false,
  });

  const handleAssigntoChange = (event) => {
    const payload = {
      index: index,
      data: event,
    };
    dispatch(assignUserActionItem(payload));
    let updatedList = membersList.filter((obj) => obj.id !== event.id);
    setMembersList(updatedList);
    setIsOpenUsers(false);
    setAnchorEl(null);
  };
  const handleMilestoneChange = (event) => {
    const payload = {
      index: index,
      data: event.value,
    };
    dispatch(assignMileStoneActionItem(payload));
    // let updatedList = milestonelist.filter((obj) => obj.id !== event.id);
    // setMilestonelist(updatedList);
    setIsOpenMilestone(false);
    setAnchorEl(null);
  };
  return (
    <div
      onMouseEnter={() => setshowOptions(true)}
      onMouseLeave={() => setshowOptions(false)}
      className={`flex justify-between items-center hover:shadow-md rounded-lg duration-700  `}
    >
      <div className="flex space-x-1 items-center w-full ">
        <Checkbox
          className="!p-0 !py-1"
          sx={{
            color: data?.isTask ? "#DAD5DD" : "#6477F8",
            "&.Mui-checked": {
              color: data?.isTask ? "#DAD5DD" : "#6477F8",
            },
          }}
          checked={data.completed}
          onChange={handleCompleted}
        />
        <Tooltip title={data?.isTask && "Moved to Task"} arrow>
          <input
            className={`text-[gray] !w-[80%] h-full pr-5 ${
              data?.isTask && "text-gray-300"
            }  `}
            value={data.name}
            onChange={handleInputChange}
          />
        </Tooltip>
      </div>
      <div className="flex space-x-1 items-center ">
        <PopupState variant="popover" popupId="date">
          {(popupState) => (
            <div>
              <div
                {...bindTrigger(popupState)}
                className="w-max cursor-pointer rounded-md bg-white flex items-center justify-center"
              >
                <div className="w-max text-xs font-bold text-[gray] ">
                  {showOptions &&
                    (data.startDate ? (
                      <span className="hover:underline hover:text-[#00A9A8]  ">
                        {moment(data.startDate).format("DD, MMMM")} -{" "}
                        {moment(data.endDate).format("DD, MMMM")}
                      </span>
                    ) : (
                      <QueryBuilderIcon />
                    ))}
                </div>
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
                <DateRangePicker
                  onChange={handleOnChange}
                  showSelectionPreview={true}
                  moveRangeOnFirstSelection={false}
                  months={2}
                  ranges={DateRangeVal}
                  direction="horizontal"
                />
              </Popover>
            </div>
          )}
        </PopupState>
        <div className="">
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
            total={data?.userIds.length}
            max={3}
          >
            {data?.userIds?.map((obj, index) => {
              return (
                <Avatar
                  key={index}
                  alt="Travis Howard"
                  src={obj.photo.file_path}
                />
              );
            })}
          </AvatarGroup>
        </div>
        <div className="w-[25px]">
          {showOptions && (
            <Fade big>
              <div>
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
                      // maxHeight: ITEM_HEIGHT * 4.5,
                      width: "30ch",
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      dispatch(removeactionItems(index));
                      setAnchorEl(null);
                    }}
                  >
                    <ListItemIcon>
                      <ContentCut fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                    <Typography variant="body2" color="text.secondary">
                      ⌘X
                    </Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={() => {
                      dispatch(convertActionItemtoTask(index));
                      setAnchorEl(null);
                    }}
                  >
                    <ListItemIcon>
                      <ContentCut fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>
                      {data?.isTask ? "Remove from Task" : "Convert to Task"}
                    </ListItemText>
                    <Typography variant="body2" color="text.secondary">
                      ⌘X
                    </Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem>
                    <ListItemIcon>
                      <ContentCut fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Copy Link</ListItemText>
                    <Typography variant="body2" color="text.secondary">
                      ⌘C
                    </Typography>
                  </MenuItem>

                  <PopupState variant="popover" popupId="demo-popup-popover">
                    {(popupState) => (
                      <div>
                        <div
                          {...bindTrigger(popupState)}
                          className="w-full cursor-pointer rounded-md bg-white"
                        >
                          <MenuItem onClick={() => setIsOpenUsers(true)}>
                            <ListItemIcon>
                              <ContentCut fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Assign to users</ListItemText>
                            <Typography variant="body2" color="text.secondary">
                              <ChevronRightIcon />
                            </Typography>
                          </MenuItem>
                        </div>
                        {isOpenUsers && (
                          <Popover
                            onClose={() => setIsOpenUsers(false)}
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
                                  menuIsOpen={true}
                                  className="w-full"
                                  options={membersList}
                                  placeholder="Search..."
                                  onChange={handleAssigntoChange}
                                />
                              </div>
                            </Box>
                          </Popover>
                        )}
                      </div>
                    )}
                  </PopupState>
                  <PopupState variant="popover" popupId="milestone-popover">
                    {(popupState) => (
                      <div>
                        <div
                          {...bindTrigger(popupState)}
                          className="w-full cursor-pointer rounded-md bg-white"
                        >
                          <MenuItem onClick={() => setIsOpenMilestone(true)}>
                            <ListItemIcon>
                              <ContentCut fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Assign Milestone</ListItemText>
                            <Typography variant="body2" color="text.secondary">
                              <ChevronRightIcon />
                            </Typography>
                          </MenuItem>
                        </div>
                        {isOpenMilestone && (
                          <Popover
                            onClose={() => setIsOpenUsers(false)}
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
                                  menuIsOpen={true}
                                  className="w-full"
                                  options={milestonelist}
                                  placeholder="Search..."
                                  onChange={handleMilestoneChange}
                                />
                              </div>
                            </Box>
                          </Popover>
                        )}
                      </div>
                    )}
                  </PopupState>
                </Menu>
              </div>
            </Fade>
          )}
        </div>
      </div>
    </div>
  );
}

export default ActionItem;
