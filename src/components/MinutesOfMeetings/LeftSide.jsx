import * as React from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { Box, IconButton, LinearProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Fade from "react-reveal/Fade";
import SingleOption from "./SingleOption";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import AddMeetingModal from "./AddMeetingModal";
import { enqueueSnackbar } from "notistack";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  "&:not(:last-child)": {
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
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

export default function LeftSide(props) {
  const { selectedMeeting, setSelectedMeeting } = props;
  const ITEM_HEIGHT = 48;
  const { projectId } = useParams();
  const [isOpenAddModal, setIsOpenAddModal] = React.useState(false);
  const [expanded, setExpanded] = React.useState("panel1");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [showOptions, setshowOptions] = React.useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const { data: Meetingslist = [], isLoading } = useQuery({
    queryKey: ["getmeetings", { projectId }],
    queryFn: () => axios.get(`meeting/${projectId}`),
    select: (res) => res.data.data,
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
    enabled: !!projectId,
    refetchOnWindowFocus: false,
  });
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
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
  return isLoading ? (
    <LinearProgress />
  ) : (
    <div>
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary
          onMouseEnter={() => setshowOptions(true)}
          onMouseLeave={() => setshowOptions(false)}
          aria-controls="panel1d-content"
          id="panel1d-header"
        >
          <Box display={"flex"} justifyContent={"space-between"} width={"100%"}>
            <Typography sx={{ fontWeight: "bold" }}>
              Minutes Of Meetings
            </Typography>
            <Box className="flex justify-center items-center ">
              {/* {showOptions && (
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
              )} */}
              <Typography
                sx={{
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "gainsboro",
                    borderRadius: "50%",
                  },
                }}
                onClick={(event) => {
                  event.stopPropagation();
                  setIsOpenAddModal(true);
                }}
              >
                <AddIcon />
              </Typography>
            </Box>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {Meetingslist.length > 0 ? (
            Meetingslist.map((val) => (
              <SingleOption
                key={val.id}
                data={val}
                setSelectedMeeting={setSelectedMeeting}
                selectedMeeting={selectedMeeting}
              />
            ))
          ) : (
            <div className="text-[gray] text-sm flex justify-center items-center  ">
              No Data, Create New Meeting
            </div>
          )}
        </AccordionDetails>
      </Accordion>
      <AddMeetingModal
        isOpen={isOpenAddModal}
        handleClose={() => setIsOpenAddModal(false)}
      />
    </div>
  );
}
