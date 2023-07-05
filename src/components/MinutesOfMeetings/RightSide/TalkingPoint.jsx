import React, { useState } from "react";
import {
  Avatar,
  Checkbox,
  Divider,
  ListItemIcon,
  ListItemText,
  Popover,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { Box, IconButton } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Fade from "react-reveal/Fade";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
  assignUserTalkingPoint,
  removeTalkingPoint,
  talkingPointCompleted,
  talkingPointInputChange,
} from "redux/reducers/minutesofmeetings";
import { useDispatch } from "react-redux";
import { ContentCut } from "@mui/icons-material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import { DateRangeIcon } from "@mui/x-date-pickers";
import Select from "react-select";

function TalkingPoint(props) {
  const { data, index: talkingPointIndex, users } = props;
  const ITEM_HEIGHT = 48;
  const [anchorEl, setAnchorEl] = useState(null);
  const [showOptions, setshowOptions] = useState(false);
  const [membersList, setMembersList] = useState(users || []);
  const [isOpenUsers, setIsOpenUsers] = useState(false);
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

  const handleInputChange = (event) => {
    const value = event.target.value;
    const payload = {
      index: talkingPointIndex,
      data: value,
    };
    dispatch(talkingPointInputChange(payload));
  };
  const handleCompleted = (event) => {
    const value = event.target.checked;
    const payload = {
      index: talkingPointIndex,
      data: value,
    };
    dispatch(talkingPointCompleted(payload));
  };

  const handleAssigntoChange = (event) => {
    const payload = {
      index: talkingPointIndex,
      data: event,
    };
    dispatch(assignUserTalkingPoint(payload));
    setIsOpenUsers(false);
    setAnchorEl(null);
  };

  console.log(membersList, "membersList");

  return (
    <div
      onMouseEnter={() => setshowOptions(true)}
      onMouseLeave={() => setshowOptions(false)}
      className="flex justify-between items-center w-full h-full hover:shadow-md rounded-lg duration-700  "
    >
      <div className="flex space-x-1 items-center w-full h-full">
        <Checkbox
          className="!p-0 !py-1"
          icon={<RadioButtonUncheckedIcon sx={{ color: "#6477F8" }} />}
          checkedIcon={<CheckCircleOutlineIcon sx={{ color: "#6477F8" }} />}
          checked={data.completed}
          onChange={handleCompleted}
        />
        <input
          className="text-[gray] !w-full h-full "
          value={data.name}
          onChange={handleInputChange}
        />
      </div>
      <div className="flex space-x-1 items-center ">
        <div className="w-[25px]">
          {data.user_Id && (
            <Avatar
              sx={{ width: "25px", height: "25px" }}
              alt="Remy Sharp"
              src={data.user_Id.photo.file_path}
            />
          )}
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
                      maxHeight: ITEM_HEIGHT * 4.5,
                      width: "30ch",
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      dispatch(removeTalkingPoint(talkingPointIndex));
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
                                  // className="w-full"
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
                </Menu>
              </div>
            </Fade>
          )}
        </div>
      </div>
    </div>
  );
}

export default TalkingPoint;
