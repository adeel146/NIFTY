import * as React from "react";
import DescriptionIcon from "@mui/icons-material/Description";
import { IconButton } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Fade from "react-reveal/Fade";
import { setCurrentMeeting } from "redux/reducers/minutesofmeetings";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import DeleteMilestone from "./DeleteMilestone";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import moment from "moment";

function SingleOption(props) {
  const { data } = props;
  const ITEM_HEIGHT = 48;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [showOptions, setshowOptions] = React.useState(false);
  const [isOpenDelete, setIsOpenDelete] = React.useState(false);
  const { selectedmeeting } = useSelector(
    (state) => state.minutesofmeetingSlice
  );
  const open = Boolean(anchorEl);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const { mutate: DeleteMeeting, isLoading } = useMutation({
    mutationKey: ["deleteMilestone"],
    mutationFn: () => axios.delete(`meeting/remove_meeting/${data.id}`),
    onSuccess: (data) => {
      enqueueSnackbar(data.data.message, { variant: "success" });
      queryClient.invalidateQueries(["getmeetings"]);
      setIsOpenDelete(false);
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });
  return (
    <>
      <div
        onMouseEnter={() => setshowOptions(true)}
        onMouseLeave={() => setshowOptions(false)}
        style={
          selectedmeeting?.id === data.id
            ? {
                border: "1px solid blue",
                backgroundColor: "#EEF0FE",
                fontWeight: "bold",
              }
            : {}
        }
        className="font-[12px] mt-2 px-3 py-1 flex justify-between  rounded-md cursor-pointer hover:bg-[#EEF0FE]	 "
        onClick={() => dispatch(setCurrentMeeting(data))}
      >
        <div className="flex leading-4 ">
          <Icon
            style={{ fontSize: "10px", height: "15px", marginTop: "5px" }}
          />
          <div className="ml-2 text-sm ">
            <p>{data.name}</p>
            <small className="text-[gray]">
              {moment(data.when).format("YYYY-MM-DD HH:mm")}
            </small>
          </div>
        </div>
        {showOptions && (
          <div className="max-h-[20px] items-center ">
            <Fade big>
              <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? "long-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="true"
                onClick={handleClick}
                sx={{ padding: "0px" }}
                size="small"
              >
                <MoreVertIcon fontSize="8px" />
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
                <MenuItem
                  onClick={(event) => {
                    setIsOpenDelete(true);
                    handleClose(event);
                  }}
                  disableRipple
                >
                  <EditIcon className="mr-2" />
                  Delete
                </MenuItem>
              </Menu>
            </Fade>
          </div>
        )}
      </div>
      <DeleteMilestone
        open={isOpenDelete}
        handleClose={() => setIsOpenDelete(false)}
        Submit={DeleteMeeting}
        lodaing={isLoading}
      />
    </>
  );
}

export default SingleOption;

const Icon = (props) => {
  return (
    <svg
      {...props}
      aria-hidden="true"
      focusable="false"
      data-prefix="far"
      data-icon="book"
      className="svg-inline--fa fa-book fa-w-14 fa-fw "
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
    >
      <path
        fill="currentColor"
        d="M128 152v-32c0-4.4 3.6-8 8-8h208c4.4 0 8 3.6 8 8v32c0 4.4-3.6 8-8 8H136c-4.4 0-8-3.6-8-8zm8 88h208c4.4 0 8-3.6 8-8v-32c0-4.4-3.6-8-8-8H136c-4.4 0-8 3.6-8 8v32c0 4.4 3.6 8 8 8zm299.1 159.7c-4.2 13-4.2 51.6 0 64.6 7.3 1.4 12.9 7.9 12.9 15.7v16c0 8.8-7.2 16-16 16H80c-44.2 0-80-35.8-80-80V80C0 35.8 35.8 0 80 0h352c8.8 0 16 7.2 16 16v368c0 7.8-5.5 14.2-12.9 15.7zm-41.1.3H80c-17.6 0-32 14.4-32 32 0 17.7 14.3 32 32 32h314c-2.7-17.3-2.7-46.7 0-64zm6-352H80c-17.7 0-32 14.3-32 32v278.7c9.8-4.3 20.6-6.7 32-6.7h320V48z"
      ></path>
    </svg>
  );
};
