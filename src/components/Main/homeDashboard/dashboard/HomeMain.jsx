import React, { createRef, useEffect, useRef, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Activity from "./widgetsCards/Activity";
import ProjectMembers from "./widgetsCards/ProjectMembers";
import Milestone from "./widgetsCards/milestones/Milestone";
import Discussions from "./widgetsCards/Discussions";
import DocsWidgets from "./widgetsCards/DocsWidgets";
import GroupIcon from "@mui/icons-material/Group";
import { Divider, Tooltip } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ShortcutIcon from "@mui/icons-material/Shortcut";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import TagIcon from "@mui/icons-material/Tag";
import LinkIcon from "@mui/icons-material/Link";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import SyncfusionGanttChart from "routes/roadMap";
import Projects from "components/Projects";
import { useParams } from "react-router-dom";
import TaskCardView from "./widgetsCards/taskwidget/TaskCardView";
import CalendarArea from "components/KanBan/CalendarArea";
import { map } from "lodash";
import MinutesOfMeetings from "components/MinutesOfMeetings";
import MainDiscussions from "./Discussions";
import FileManager from "components/FileManager/FileManager";
import GreenButton from "hooks/Common/commonButtons/GreenButton";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { openFileDialog } from "redux/reducers/portfolio";
import { useDispatch } from "react-redux";
import CreateFolderDialog from "components/FileManager/CreateFolderDialog";
import FileUploader from "components/FileManager/FileUploader";
import { useDisplaySuccess } from "hooks/useDisplaySuccess";
import { useAddFile } from "hooks/Portfolio";
import { borderRadius } from "@xstyled/system";
import { useSelector } from "react-redux";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { capitalizeFirstLetter } from "utils";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SettingsIcon from "@mui/icons-material/Settings";
import { Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import EditTasksColumns from "components/Layout/AllTasks/EditTasksColumns";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import RiskAssessmentView from "./widgetsCards/risk-assessment/RiskAssessmentView";
import { setSelectedRiskId, taskAssessmentOpen } from "redux/actions";
import RiskAssessmentDialog from "./widgetsCards/risk-assessment/RiskAssessmentDialog";
import Financial from "components/Financial";
import { useDisplayError } from "hooks/useDisplayError";
import PaletteIcon from "@mui/icons-material/Palette";
import axios from "axios";
import { openMatrixDialog } from "redux/actions";
import ChangeRequest from "components/ChangeRequest";
import ChangeRequestListing from "components/ChangeRequest/ChangeRequestListing";
import { useAppGetProject, useGetProjectMembers } from "hooks/ProjectTask.jsx";

const widgetsList = [
  {
    name: "Members",
    icon: <GroupIcon sx={{ fontSize: "19px" }} />,
  },
  {
    name: "Activity",
    icon: <NotificationsIcon sx={{ fontSize: "19px" }} />,
  },
  {
    name: "MileStone",
    icon: <ShortcutIcon sx={{ fontSize: "19px" }} />,
  },
  {
    name: "Tasks",
    icon: <CheckIcon sx={{ fontSize: "19px" }} />,
  },
  {
    name: "Discussions",
    icon: <AlternateEmailIcon sx={{ fontSize: "18px" }} />,
  },
  {
    name: "Docs",
    icon: <TextSnippetIcon sx={{ fontSize: "19px" }} />,
  },
  {
    name: "File",
    icon: <LinkIcon sx={{ fontSize: "19px" }} />,
  },
  {
    name: "Time Tracking ",
    icon: <AccessAlarmIcon sx={{ fontSize: "19px" }} />,
  },
  {
    name: "Rollup",
    icon: <TagIcon sx={{ fontSize: "19px" }} />,
  },
];

const HomeMain = () => {
  const headerMenuName = useSelector(
    (state) => state?.projectTaskSlice?.headerMenuName
  );
  let { projectId } = useParams();
  const [name, setName] = useState(headerMenuName);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showList, setShowList] = useState(map(widgetsList, "name"));
  const [check, setCheck] = useState(true);
  const [checkOne, setCheckOne] = useState(true);
  const [cardWidth, setCardWidth] = useState(4);
  const [cardWidthOne, setCardWidthOne] = useState(4);
  const [discussionWidth, setDiscussionWidth] = useState(4);
  const [discussionCheck, setDiscussionCheck] = useState(true);
  const [assignCheck, setAssignCheck] = useState(true);
  const [assignWidth, setAssignWidth] = useState(4);
  const [file, setFile] = useState(false);
  const { activeWorkspace } = useSelector(({ workspace }) => workspace);
  const [selectedList, setSelectedList] = useState("kanban");
  const [listAnchorEl, setListAnchorEl] = useState(null);
  const [isEditColumn, setIsEditColumn] = useState(false);
  const [workSpaceRiskState, setWorkSpaceRiskState] = useState([]);

  const parentId = useSelector((state) => state?.portfolioSlice?.parentIdState);
  const fileId = useSelector((state) => state?.portfolioSlice?.fileIdState);
  const getFolderId = useSelector(
    (state) => state?.portfolioSlice?.folderIdState
  );
  const workSpaceId = localStorage.getItem("workspaceId");

  const dispatch = useDispatch();
  const handleChange = (e, name) => {
    if (e.target.checked) {
      setShowList([...showList, name]);
    } else {
      setShowList(
        showList?.filter((val) => {
          return val !== name;
        })
      );
    }
  };

  const { data: workSpaceRisk = [] } = useQuery(
    ["workspace_risk", workSpaceId],
    () => {
      return axios.get(`/workspace/risk_assesment/${workSpaceId}`);
    },
    {
      enabled: !!workSpaceId,
      select: (res) => {
        return res?.data;
      },
    }
  );
  const getMemberSuccess = (data) => {};
  const getMembers = useGetProjectMembers({
    id: projectId,
    onSuccess: getMemberSuccess,
  });
  const getProject = useAppGetProject({
    id: projectId,
  });

  const membersList =
    getMembers?.projectMembersResponse?.data?.data?.data?.members;
  const activeProject = getProject?.projectResponse?.data?.data?.data;
  useEffect(() => {
    if (workSpaceRisk?.length) {
      setWorkSpaceRiskState(workSpaceRisk);
    }
  }, [workSpaceRisk]);

  const [anchorElColor, setAnchorElColor] = useState(null);

  const handleClickColor = (event) => {
    setAnchorElColor(event.currentTarget);
  };

  const handleCloseColor = () => {
    setAnchorElColor(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleEditColumnClose = () => {
    setIsEditColumn(false);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const openColor = Boolean(anchorElColor);
  const idColor = openColor ? "simple-popover" : undefined;

  const TestComponent = () => (
    <div className="mt-[2rem] ml-[2rem] flex  justify-between">
      <div>
        <h1 className="text-[18px] ">Project Outline</h1>
        <div className="text-[#9197BD]">
          <p>
            Welcome everyone! This is how we’ll collaborate together in three60.
          </p>
          <p>
            We can add project brief, resource links, and other important
            information here.{" "}
          </p>
        </div>
      </div>
    </div>
  );

  const mainNavigation = [
    {
      name: "Dashboard",
      Component: <TestComponent />,
    },
    {
      name: "Milestone",
      Component: <SyncfusionGanttChart />,
    },
    {
      name: "Tasks",
      Component: <Projects />,
    },
    {
      name: "MOM",
      Component: <MinutesOfMeetings />,
    },
    {
      name: "Calendar",
      Component: <TestComponent />,
    },

    {
      name: "Disscussions",
      Component: <TestComponent />,
    },

    // {
    //   name: "Docs",
    //   Component: <TestComponent />,
    // },
    {
      name: "Files",
      Component: <TestComponent />,
    },
    {
      name: "Risk",
      // Component: <RiskAssessmentView />,
    },
    // {
    //   name: "Forms",
    //   Component: <TestComponent />,
    // },
    {
      name: "Financial",
      Component: <TestComponent />,
    },
    {
      name: "Change Request",
      Component: <ChangeRequestListing />,
    },
  ];

  const fileReference = useRef();

  useEffect(() => {
    const element = fileReference?.current;
  }, []);

  const handleButtonClick = () => {
    setFile(true);
    fileReference?.current?.click();
  };

  const handleListClick = (event) => {
    setListAnchorEl(event.currentTarget);
  };

  const handleListMenuClose = () => {
    setListAnchorEl(null);
  };
  const handleListMenuItemClick = (listType) => {
    setSelectedList(listType);
    setListAnchorEl(null);
  };
  const display = useDisplaySuccess();
  const onSuccess = (data) => {
    display(data?.message);
  };

  const folderId = localStorage.getItem("projectId");
  const addFile = useAddFile({ id: folderId, onSuccess });
  const error = addFile.error;
  useDisplayError(error);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const res = reader.result.replace(/^data:.+;base64,/, "");
        resolve(res);
      };
      reader.onerror = (error) => reject(error);
    });

  const submitForm = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const fileContent = await toBase64(file);
    const uploadedFile = {
      file_name: file?.name,
      file_extension: file?.name.split(".").pop(),
      file_content: fileContent,
      file_identifier: file?.type,
      file_path: file?.webkitRelativePath,
    };

    const body = {
      folder_Id: +(getFolderId ? getFolderId : parentId),
      attachment: uploadedFile,
    };
    addFile?.mutate({ data: body });
  };

  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.invalidateQueries("file");
  }, []);

  const handleRiskChange = (e, val) => {
    e.stopPropagation();
    const updatedArray = workSpaceRiskState.map((innerArray) => {
      const updatedInnerArray = innerArray.map((item) => {
        if (item.id === val.id) {
          return { ...item, value: e.target.value };
        }
        return item;
      });
      return updatedInnerArray;
    });

    setWorkSpaceRiskState(updatedArray);
  };

  return (
    <>
      {isEditColumn && (
        <EditTasksColumns open={isEditColumn} onClose={handleEditColumnClose} />
      )}
      <div className="flex relative">
        <div className="w-[36px] h-[36px] rounded-lg bg-[#D55CF5] absolute left-[25px] flex items-center justify-center text-slate-50 top-[9px]">
          {activeProject?.name?.charAt(0)?.toUpperCase() ?? ""}
        </div>
        <div className="absolute left-[80px] top-1 flex space-x-5 text-[#2f2f2f] font-bold text-[18px] capitalize">
          {activeProject?.name ?? ""} <ExpandMoreIcon />
        </div>
      </div>
      <div className="bg-white flex justify-between items-center pr-8 pl-[80px] border border-b-[#e8e8e8]">
        <div className={` flex space-x-4 items-center pt-7 cursor-pointer`}>
          {mainNavigation.map((val, index) => {
            return (
              <div
                key={index}
                className={`text-sm  ${
                  name === val?.name
                    ? "text-[#00A99B] border-b-2 border-[#00A99B] font-semibold text-[13px] 3xl:text-[15px] font-Manrope cursor-pointer "
                    : "text-[#2f2f2f] border-b-2 border-[#fafbfd] font-semibold text-[13px] 3xl:text-[15px] font-Manrope hover:border-[#00A99B] hover:border-b-2 hover:text-[#00A99B]"
                }`}
                onClick={() => setName(val?.name)}
              >
                {val.name}
              </div>
            );
          })}
        </div>
        <div className="">
          <div className="flex space-x-3 3xl:space-x-6 items-center">
            {name === "Files" ? (
              <>
                <Tooltip title={<h1 className="text-[18px]">Create Folder</h1>}>
                  <div
                    className="p-[5px] hover:!text-[#009084]"
                    style={{ borderRadius: "5px", border: "1px solid #e8e8e8" }}
                  >
                    <CreateNewFolderIcon
                      onClick={() => dispatch(openFileDialog())}
                    />
                  </div>
                </Tooltip>
                <GreenButton
                  buttonText="Upload File"
                  onClick={handleButtonClick}
                />
              </>
            ) : name === "Tasks" ? (
              <div className="bg-white flex justify-end items-center pr-8">
                <div className="">
                  <div className="flex space-x-6 ">
                    <button
                      onClick={handleListClick}
                      className="flex space-x-3 items-center justify-center text-[#2f2f2f] hover:!text-[#009084] font-semibold text-[13px] font-Manrope rounded-md bg-whit shadow-xs px-4 h-[34px] border border-gray-200 rounded-r-none"
                    >
                      <FormatListBulletedIcon sx={{ marginRight: "5px" }} />
                      {capitalizeFirstLetter(selectedList)}
                      <div>
                        <KeyboardArrowDownIcon sx={{ marginLeft: "1px" }} />
                      </div>
                    </button>
                    <Menu
                      id="list-menu"
                      anchorEl={listAnchorEl}
                      open={Boolean(listAnchorEl)}
                      onClose={handleListMenuClose}
                    >
                      <MenuItem
                        onClick={() => handleListMenuItemClick("kanban")}
                        selected={selectedList === "kanban"}
                        className="flex justify-between hover:text-[#00a99b] !hover:background-[#00a99b]"
                      >
                        <ListItemText primary="Kanban" className="flex-grow" />
                        <ListItemIcon>
                          {selectedList === "kanban" && <CheckIcon />}
                        </ListItemIcon>
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleListMenuItemClick("report")}
                        selected={selectedList === "report"}
                        className="flex justify-between"
                      >
                        <ListItemText primary="Report" className="flex-grow" />
                        <ListItemIcon>
                          {selectedList === "report" && <CheckIcon />}
                        </ListItemIcon>
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleListMenuItemClick("list")}
                        selected={selectedList === "list"}
                        className="flex justify-between"
                      >
                        <ListItemText primary="List" className="flex-grow" />
                        <ListItemIcon>
                          {selectedList === "list" && <CheckIcon />}
                        </ListItemIcon>
                      </MenuItem>
                    </Menu>
                    <button className="flex space-x-3 !ml-[0px] hover:text-[#00a99b] items-center justify-center  rounded-md bg-whit shadow-xs w-[10px] px-4 h-[34px] border border-gray-200 border-l-0 rounded-l-none">
                      <SettingsIcon onClick={() => setIsEditColumn(true)} />
                    </button>
                  </div>
                </div>
              </div>
            ) : name === "Risk" ? (
              <>
                <div onClick={handleClickColor}>
                  <GreenButton buttonText="Risk Assessment" />
                </div>
                {/* <button
                  className="flex items-center justify-center  rounded-md bg-whit shadow-xs w-[34px] h-[34px] border border-gray-200 hover:!text-[#009084]"
                >
                  <div>
                    <PaletteIcon />
                  </div>
                </button> */}
                <button
                  onClick={() => dispatch(taskAssessmentOpen())}
                  className="flex items-center justify-center  rounded-md bg-whit shadow-xs w-[34px] h-[34px] border border-gray-200 hover:!text-[#009084]"
                >
                  <div>
                    <AddIcon />
                  </div>
                </button>
              </>
            ) : (
              <>
                <button className="flex space-x-3 items-center justify-center text-[#2f2f2f] hover:!text-[#009084] font-semibold text-[13px] font-Manrope rounded-md bg-whit shadow-xs px-4 h-[34px] border border-gray-200">
                  <div className="relative mr-2">
                    <svg
                      className="icon"
                      width="0.8125em"
                      height="1em"
                      viewBox="0 0 13 16"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g
                        id="Tasks"
                        stroke="none"
                        stroke-width="1"
                        fill="none"
                        fill-rule="evenodd"
                      >
                        <g
                          id="Tasks-kanban-change-default"
                          transform="translate(-954.000000, -24.000000)"
                          fill="currentColor"
                          fill-rule="nonzero"
                        >
                          <g
                            id="Group-17-Copy"
                            transform="translate(940.000000, 11.000000)"
                          >
                            <path
                              d="M20.8765772,15.8579411 L16.538339,20.911236 L18.6585721,20.911236 C19.0647197,20.911236 19.3938209,21.2423744 19.3936417,21.6474687 L19.3920603,25.2224918 L23.7361156,20.1739164 L21.6070614,20.1739164 C21.1992241,20.1739164 20.8692188,19.8424156 20.8699677,19.4368778 L20.8765772,15.8579411 Z M22.3432458,18.6992772 L25.4631368,18.6992772 C26.2771848,18.6992772 26.5082218,19.1985848 25.976314,19.8178398 L19.3606894,27.5198476 C18.5646476,28.4466112 17.9193282,28.2102165 17.9193282,26.9842419 L17.9193282,22.3858752 L14.7994372,22.3858752 C13.9853892,22.3858752 13.7543522,21.8865676 14.28626,21.2673127 L20.9018846,13.5653049 C21.6979264,12.6385413 22.3432458,12.874936 22.3432458,14.1009106 L22.3432458,18.6992772 Z"
                              id="Combined-Shape"
                            ></path>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </div>{" "}
                  Automate
                </button>
                <button
                  onClick={handleClick}
                  className="flex space-x-3 items-center justify-center text-[#2f2f2f] hover:!text-[#009084] font-semibold text-[13px] font-Manrope rounded-md bg-whit shadow-xs px-4 h-[34px] border border-gray-200"
                >
                  <div className="relative mr-2">
                    <svg
                      classname="icon"
                      width="11px"
                      height="11px"
                      viewBox="0 0 12 12"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M6.66667 0.666569C6.66667 0.296631 6.36819 0 6 0C5.62924 0 5.33333 0.298433 5.33333 0.666569V5.33333H0.666569C0.296631 5.33333 0 5.63181 0 6C0 6.37076 0.298433 6.66667 0.666569 6.66667H5.33333V11.3334C5.33333 11.7034 5.63181 12 6 12C6.37076 12 6.66667 11.7016 6.66667 11.3334V6.66667H11.3334C11.7034 6.66667 12 6.36819 12 6C12 5.62924 11.7016 5.33333 11.3334 5.33333H6.66667V0.666569Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>
                  Add Widgets
                </button>
              </>
            )}

            <button className="flex items-center justify-center  rounded-md bg-whit shadow-xs w-[34px] h-[34px] border border-gray-200 hover:!text-[#009084]">
              <div>
                <StarBorderIcon />
              </div>
            </button>
          </div>
        </div>
      </div>
      {name === "Milestone" ? (
        <SyncfusionGanttChart />
      ) : name === "Tasks" ? (
        <Projects selectedList={selectedList} />
      ) : name === "Calendar" ? (
        <div>
          <CalendarArea />
        </div>
      ) : name === "MOM" ? (
        <div>
          <MinutesOfMeetings />
        </div>
      ) : name === "Disscussions" ? (
        <MainDiscussions />
      ) : name === "Docs" ? (
        <div>
          <h2>Not integrated yet</h2>
        </div>
      ) : name === "Files" ? (
        <div>
          <FileManager />
        </div>
      ) : name === "Financial" ? (
        <div>
          <Financial />
        </div>
      ) : name === "Change Request" ? (
        <div>
          <ChangeRequestListing />
        </div>
      ) : name === "Forms" ? (
        <h2>Not integrated yet</h2>
      ) : name === "Risk" ? (
        <div>
          <RiskAssessmentView />
        </div>
      ) : name === "Dashboard" ? (
        <div>
          <div className="flex justify-between items-start">
            {showList.includes("Members") && (
              <div className="ml-[24px] mt-[2.5rem] w-[80%]">
                <ProjectMembers
                  membersList={membersList}
                  activeProject={activeProject}
                />
              </div>
            )}

            {showList.includes("Activity") && (
              <div className="mr-[24px] ">
                <Activity />
              </div>
            )}
          </div>
          <div className="px-[24px]">
            <Box sx={{ marginTop: "5rem" }}>
              <Grid container spacing={2}>
                {showList.map((val) => {
                  return (
                    <>
                      {val === "MileStone" ? (
                        <Grid
                          item
                          xs={cardWidth}
                          md={cardWidth}
                          lg={cardWidth}
                          spacing={2}
                        >
                          <Milestone
                            check={check}
                            setCheck={setCheck}
                            setCardWidth={setCardWidth}
                          />
                        </Grid>
                      ) : val === "Tasks" ? (
                        <Grid
                          item
                          xs={assignWidth}
                          md={assignWidth}
                          lg={assignWidth}
                        >
                          <TaskCardView
                            setAssignWidth={setAssignWidth}
                            assignCheck={assignCheck}
                            setAssignCheck={setAssignCheck}
                          />
                        </Grid>
                      ) : val === "Discussions" ? (
                        <Grid
                          item
                          xs={discussionWidth}
                          md={discussionWidth}
                          lg={discussionWidth}
                        >
                          <Discussions
                            setDiscussionWidth={setDiscussionWidth}
                            discussionCheck={discussionCheck}
                            setDiscussionCheck={setDiscussionCheck}
                          />
                        </Grid>
                      ) : (
                        ""
                      )}
                    </>
                  );
                })}
              </Grid>
            </Box>
          </div>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <div>
              {widgetsList.map((val) => {
                return (
                  <>
                    <div className="flex justify-between px-2  pt-1">
                      <div className="flex space-x-3 items-center ">
                        <small className="text-[12px]">{val.icon}</small>
                        <small className="">{val.name}</small>
                      </div>
                      <div>
                        <Switch
                          checked={showList.includes(val?.name)}
                          onChange={(e) => handleChange(e, val?.name)}
                          size="small"
                          inputProps={{ "aria-label": "controlled" }}
                          sx={{
                            "&.MuiSwitch-root .MuiSwitch-switchBase": {
                              color: "white",
                            },

                            "&.MuiSwitch-root .Mui-checked": {
                              color: "#00A99B",
                            },
                          }}
                        />
                      </div>
                    </div>
                    <div className="mt-2">
                      <Divider />
                    </div>
                  </>
                );
              })}
            </div>
          </Popover>
        </div>
      ) : null}
      <CreateFolderDialog id={getFolderId ? getFolderId : parentId} />
      <RiskAssessmentDialog />

      {/* colors popover */}

      <Popover
        id={idColor}
        open={openColor}
        anchorEl={anchorElColor}
        onClose={handleCloseColor}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <div className="pr-[10px] pb-[1rem]">
          {/* <h1 className="decoration_text">Probability</h1> */}
          <div className="group_table pl-3 mt-5">
            <div>
              <table className=" mt-3 flex ">
                {riskAssessmentMatrix?.map((val, index) => {
                  return (
                    <div className="flex flex-col w-full">
                      <tr className=" flex justify-center items-center text-[12px] bg-[#D6DCE5] border border-[#BFBFBF] p-[2px]">
                        <th>{val.name}</th>
                      </tr>
                      <tr className=" flex justify-center items-center text-[12px] ">
                        <td
                          className={`h-[25px] w-full `}
                          style={{
                            background: val?.color,
                          }}
                        >
                          {val?.col}
                        </td>
                      </tr>
                    </div>
                  );
                })}
              </table>
            </div>
            {/* tableeee */}
            <table>
              <div className="flex flex-col mt-3">
                {/* {workSpaceRiskState[0]?.map((Val) => {
                  return (
                    <tr className="flex-col">
                      <td
                        onClick={() => dispatch(openMatrixDialog())}
                        className={` bg-[${Val?.color}] w-[80px] cursor-pointer border-[1px] border-gray- h-[50px] flex justify-center items-center text-black`}
                      >
                        test
                      </td>
                    </tr>
                  );
                })} */}
              </div>

              <div className="flex mt-3">
                {workSpaceRisk[4]?.map((Val, index) => {
                  return (
                    <tr className="flex">
                      {index === 0 && (
                        <td className=" bg-[#D6DCE5] w-[80px] cursor-pointer border-[1px] border-gray- h-[50px] flex justify-center items-center text-black">
                          5
                        </td>
                      )}
                      <td
                        onClick={() => {
                          dispatch(openMatrixDialog());
                          dispatch(setSelectedRiskId(Val.id));
                        }}
                        className={` bg-[${Val?.color}] w-[80px] cursor-pointer border-[1px] border-gray- h-[50px] flex justify-center items-center text-black`}
                      >
                        {Val?.value ?? "N/A"}
                      </td>
                    </tr>
                  );
                })}
              </div>

              <div className="flex">
                {workSpaceRisk[3]?.map((Val, index) => {
                  return (
                    <tr className="flex ">
                      {index === 0 && (
                        <td className=" bg-[#D6DCE5] w-[80px] cursor-pointer border-[1px] border-gray- h-[50px] flex justify-center items-center text-black">
                          4
                        </td>
                      )}
                      <td
                        onClick={() => {
                          dispatch(openMatrixDialog());
                          dispatch(setSelectedRiskId(Val.id));
                        }}
                        className={` bg-[${Val?.color}] w-[80px] cursor-pointer border-[1px] border-gray- h-[50px] flex justify-center items-center text-black`}
                      >
                        {Val?.value ?? "N/A"}
                      </td>
                    </tr>
                  );
                })}
              </div>
              <div className="flex">
                {workSpaceRisk[2]?.map((Val, index) => {
                  return (
                    <tr className="flex ">
                      {index === 0 && (
                        <td className=" bg-[#D6DCE5] w-[80px] cursor-pointer border-[1px] border-gray- h-[50px] flex justify-center items-center text-black">
                          3
                        </td>
                      )}
                      <td
                        onClick={() => {
                          dispatch(openMatrixDialog());
                          dispatch(setSelectedRiskId(Val.id));
                        }}
                        className={` bg-[${Val?.color}] w-[80px] cursor-pointer border-[1px] border-gray- h-[50px] flex justify-center items-center text-black`}
                      >
                        {Val?.value ?? "N/A"}
                      </td>
                    </tr>
                  );
                })}
              </div>
              <div className="flex">
                {workSpaceRisk[1]?.map((Val, index) => {
                  return (
                    <tr className="flex ">
                      {index === 0 && (
                        <td className=" bg-[#D6DCE5] w-[80px] cursor-pointer border-[1px] border-gray- h-[50px] flex justify-center items-center text-black">
                          2
                        </td>
                      )}
                      <td
                        onClick={() => {
                          dispatch(openMatrixDialog());
                          dispatch(setSelectedRiskId(Val.id));
                        }}
                        className={` bg-[${Val?.color}] w-[80px] cursor-pointer border-[1px] border-gray- h-[50px] flex justify-center items-center text-black`}
                      >
                        {Val?.value ?? "N/A"}
                      </td>
                    </tr>
                  );
                })}
              </div>
              <div className="flex">
                {workSpaceRisk[0]?.map((Val, index) => {
                  return (
                    <tr className="flex ">
                      {index === 0 && (
                        <td className=" bg-[#D6DCE5] w-[80px] cursor-pointer border-[1px] border-gray- h-[50px] flex justify-center items-center text-black">
                          1
                        </td>
                      )}
                      <td
                        onClick={() => {
                          dispatch(openMatrixDialog());
                          dispatch(setSelectedRiskId(Val.id));
                        }}
                        className={` bg-[${Val?.color}] w-[80px] cursor-pointer border-[1px] border-gray- h-[50px] flex justify-center items-center text-black`}
                      >
                        {Val?.value ?? "N/A"}
                      </td>
                    </tr>
                  );
                })}
              </div>
              <div className="flex">
                <tr className="flex ">
                  <td className=" bg-[#aeb3ba] w-[80px] cursor-pointer border-[1px] border-gray- h-[50px] flex justify-center items-center text-black"></td>
                  <td className=" bg-[#D6DCE5] w-[80px] cursor-pointer border-[1px] border-gray- h-[50px] flex justify-center items-center text-black">
                    1
                  </td>
                  <td className=" bg-[#D6DCE5] w-[80px] cursor-pointer border-[1px] border-gray- h-[50px] flex justify-center items-center text-black">
                    2
                  </td>
                  <td className=" bg-[#D6DCE5] w-[80px] cursor-pointer border-[1px] border-gray- h-[50px] flex justify-center items-center text-black">
                    3
                  </td>
                  <td className=" bg-[#D6DCE5] w-[80px] cursor-pointer border-[1px] border-gray- h-[50px] flex justify-center items-center text-black">
                    4
                  </td>
                  <td className=" bg-[#D6DCE5] w-[80px] cursor-pointer border-[1px] border-gray- h-[50px] flex justify-center items-center text-black">
                    5
                  </td>
                </tr>
              </div>
            </table>
          </div>
        </div>
      </Popover>

      <input
        type="file"
        className="hidden"
        ref={fileReference}
        onChange={submitForm}
      ></input>
    </>
  );
};

export default HomeMain;

const riskAssessmentMatrix = [
  {
    name: "Low Risk",
    color: "#93D150",
    col: "",
  },
  {
    name: "Medium Risk",
    color: "#FFFF00",
    col: "",
  },
  {
    name: "High Risk",
    color: "#FFC100",
    col: "",
  },
  {
    name: "Very High Risk",
    color: "#FF0000",
    col: "",
  },
];
