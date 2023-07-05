import Tooltip from "@mui/material/Tooltip";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import { useEffect, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  TextField,
  IconButton,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { usePortfolios } from "hooks/Portfolio";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { Icon } from "@mui/material";
import { Popover } from "@mui/material";
import { useDispatch } from "react-redux";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { makeStyles } from "@mui/styles";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { links } from "static/links";
import GreenButton from "hooks/Common/commonButtons/GreenButton";
import AddPortfolioDialog from "components/Main/portfolio/AddPortfolioDialog";
import ManagePortfolio from "components/Main/portfolio/ManagePortfolio";
import DeletePortfolio from "components/Main/portfolio/DeletePortfolio";
import ArchiveProject from "components/Main/portfolio/ArchiveProject";
import DeleteProject from "components/Main/portfolio/DeleteProject";
import WhiteButton from "hooks/Common/commonButtons/WhiteButton";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import { portfolioIdSet } from "redux/actions";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const sideBarPortfolio = () => {
  const navigate = useNavigate();
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [id, setId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [portfolios, setPortfolio] = useState([]);
  const [projects, setProjects] = useState([]);
  const [childIsHovered, setChildIsHovered] = useState(false);
  const [childId, setChildId] = useState(null);
  const { activeWorkspace } = useSelector(({ workspace }) => workspace);
  const [portfolioMenuAnchor, setPortfolioMenuAnchor] = useState(null);
  const [isManagePortfolio, setIsManagePortfolio] = useState(null);
  const [activePortfolioId, setActivePortfolioId] = useState(null);
  const [isDeletePortfolio, setIsDeletePortfolio] = useState(false);
  const [projectMenuAnchor, setProjectMenuAnchor] = useState(null);
  const [isProjectArchive, setIsProjectArchive] = useState(false);
  const [isProjectDelete, setIsProjectDelete] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [workspacePortfolios, setWorkspacePortfolios] = useState([]);

  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick1 = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const idPopover = open ? "simple-popover" : undefined;

  const handleClick = (id) => {
    setIsOpen(!isOpen);
    setId(id);
    const single = portfolios?.filter((portfolio) => portfolio?.id == id);
    // setProjects(single[0])

    setProjects(single[0].projects);
  };

  const handleMouseEnter = (id) => {
    setIsHovered(true);
    setHoveredId(id);
    // setIsOpen(false);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setHoveredId(null);
    setPortfolioMenuAnchor(null);
    setProjectMenuAnchor(null);

    // setIsOpen(false);
  };

  const handleChildMouseLeave = () => {
    setChildIsHovered(false);
    setChildId(null);
  };

  const handleChildMouseEnter = (id) => {
    setChildIsHovered(true);
    setChildId(id);
  };

  //  const usePortfolios = ({ id }) => {
  //   const workspacePortfoliosResponse = useAppQuery(
  //     [Apis.GetPortfolios, id],
  //     `${Apis.GetPortfolios}${id}`,
  //     {
  //       enabled: !!id,
  //     }
  //   );
  //   const workspacePortfolios =
  //     workspacePortfoliosResponse.data?.data?.data ?? [];

  //   return { workspacePortfolios, workspacePortfoliosResponse };
  // };

  const { data: portfolioData } = useQuery(
    ["get_portfolio_project", activeWorkspace?.id],
    () => {
      return axios.get(`/portfolio/projects/${activeWorkspace?.id}`);
    },
    {
      enabled: !!activeWorkspace?.id,
      onSuccess: (res) => {
        setWorkspacePortfolios(res?.data?.data);
      },
    }
  );

  // const { workspacePortfolios, workspacePortfoliosResponse } = usePortfolios({
  //   id: activeWorkspace?.id,
  // });

  useEffect(() => {
    if (workspacePortfolios?.length !== portfolios?.length) {
      setPortfolio(workspacePortfolios);
    } else if (!workspacePortfolios?.length && portfolios?.length > 0) {
      setPortfolio([]);
    } else if (workspacePortfolios.length) {
      setPortfolio(workspacePortfolios);
    }
  }, [workspacePortfolios, portfolios]);

  const reOrderList = (startIndex, endIndex, type) => {
    const parentResult = [...portfolios]; // copy of list array
    const childResult = [...projects]; // copy of list array

    if (type == "parent") {
      const removed = parentResult.splice(startIndex, 1); // removed an item from startIndex
      parentResult.splice(endIndex, 0, removed[0]); // add an item an endIndex

      return parentResult;
    } else if (type == "child") {
      const removed = childResult.splice(startIndex, 1); // removed an item from startIndex
      childResult.splice(endIndex, 0, removed[0]); // add an item an endIndex

      return childResult;
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    if (
      result.source.droppableId === result.destination.droppableId &&
      result.source.index === result.destination.index
    ) {
      return;
    }

    const reOrderFeed = reOrderList(
      result.source.index,
      result.destination.index,
      result.type
    );
    if (result?.type == "parent") {
      setPortfolio(reOrderFeed);
    } else if (result?.type == "child") {
      setProjects(reOrderFeed);
    }
  };

  const handlePortfolioMenu = (e) => {
    e.stopPropagation();
    setPortfolioMenuAnchor(e.currentTarget);
  };
  const handlePortfolioMenuClose = () => {
    setPortfolioMenuAnchor(null);
  };
  const handleManagePortfolioClick = (id) => {
    setActivePortfolioId(id);
    setIsManagePortfolio(true);
    handlePortfolioMenuClose();
  };
  const handleManagePortfolioClose = () => {
    setIsManagePortfolio(false);
    setActivePortfolioId(null);
  };

  const handleDeletePortfolio = (id) => {
    setActivePortfolioId(id);
    setIsDeletePortfolio(true);
  };
  const handleDeletePortfolioClose = () => {
    setIsDeletePortfolio(false);
    setActivePortfolioId(null);
  };

  const handleProjectMenu = (e) => {
    setProjectMenuAnchor(e.currentTarget);
  };
  const handleProjectMenuClose = () => {
    setProjectMenuAnchor(null);
    setActiveProjectId(null);
  };

  const handleProjectClick = (key, id) => {
    setActiveProjectId(id);
    if (key === "manage") {
      navigate("/workspaces/members-permissions");
      return;
    }
    if (key === "invite") {
      navigate("/workspaces/members-permissions");
      return;
    }
    if (key === "settings") {
      navigate("/workspaces/general-settings");
      return;
    }
    if (key === "move") {
      navigate(`/upadte/project/${id}`);
      return;
    }
    if (key === "duplicate") {
      navigate(`/project/duplicate/${id}`);
      return;
    }
    if (key === "archive") {
      setIsProjectArchive(true);
      return;
    }
    if (key === "delete") {
      setIsProjectDelete(true);
      return;
    }
  };
  const handleProjectDeleteClose = () => {
    setIsProjectDelete(false);
  };

  const handleProjectArchiveClose = () => {
    setIsProjectArchive(false);
  };

  return (
    <>
      {isProjectDelete && (
        <DeleteProject
          activeProjectId={activeProjectId}
          open={isProjectDelete}
          activeProject={projects.filter((el) => el.id === +activeProjectId)}
          handleClose={handleProjectDeleteClose}
        />
      )}
      {isProjectArchive && (
        <ArchiveProject
          activeProjectId={activeProjectId}
          activeProject={projects.filter((el) => el.id === +activeProjectId)}
          open={isProjectArchive}
          handleClose={handleProjectArchiveClose}
        />
      )}
      {isDeletePortfolio && (
        <DeletePortfolio
          activePortfolioId={activePortfolioId}
          activePortfolio={portfolios.filter(
            (el) => el.id === +activePortfolioId
          )}
          open={isDeletePortfolio}
          handleClose={handleDeletePortfolioClose}
        />
      )}
      {isManagePortfolio && (
        <ManagePortfolio
          activePortfolioId={activePortfolioId}
          open={isManagePortfolio}
          handleClose={handleManagePortfolioClose}
        />
      )}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" type="parent" direction="vertical">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              isDraggingOver={snapshot.isDraggingOver}
            >
              {portfolios?.map((portfolio, index) => {
                return (
                  <>
                    <Draggable
                      draggableId={portfolio?.name}
                      key={portfolio?.id}
                      index={index}
                    >
                      {(draggableProvided) => (
                        <>
                          <div
                            className="w-full flex flex-col "
                            onMouseEnter={() => handleMouseEnter(portfolio?.id)}
                            onClick={() =>
                              dispatch(portfolioIdSet(portfolio.id))
                            }
                            onMouseLeave={handleMouseLeave}
                            {...draggableProvided.draggableProps}
                            {...draggableProvided.dragHandleProps}
                            ref={draggableProvided.innerRef}
                          >
                            <div
                              className="w-full border-[#eee] border-b py-2 pl-0 flex align-center items-center cursor-pointer justify-between mr-3"
                              onClick={() => {
                                navigate(`${links.portfolio}/${portfolio.id}`);
                              }}
                            >
                              <span
                                className={
                                  isHovered && hoveredId == portfolio?.id
                                    ? classes.visibleDiv
                                    : classes.hiddenDiv
                                }
                              >
                                <DragIndicatorIcon
                                  style={{ color: "#9399AB" }}
                                />
                              </span>
                              <div className="text flex w-[60%]  py-1 hover:text-[#333]">
                                <span className="flex font-bold text-sm capitalize">
                                  {portfolio?.name}
                                </span>
                              </div>
                              <div className="flex mr-5 ">
                                <span className="w-[30px]">
                                  <IconButton>
                                    {isHovered && hoveredId == portfolio?.id ? (
                                      <>
                                        <MoreHorizIcon
                                          className="cursor-pointer "
                                          width="1.0277777777777777em"
                                          height="0.6111111111111112em"
                                          style={{ color: "#9399AB" }}
                                          onClick={handlePortfolioMenu}
                                        />
                                        <Popover
                                          open={Boolean(portfolioMenuAnchor)}
                                          anchorEl={portfolioMenuAnchor}
                                          onClose={handlePortfolioMenuClose}
                                          anchorOrigin={{
                                            vertical: "bottom",
                                            horizontal: "center",
                                          }}
                                          transformOrigin={{
                                            vertical: "top",
                                            horizontal: "center",
                                          }}
                                        >
                                          <List disablePadding>
                                            <ListItem
                                              button
                                              className={classes.listItem}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleManagePortfolioClick(
                                                  portfolio?.id
                                                );
                                              }}
                                            >
                                              <ListItemText
                                                primary={
                                                  <p className="text-[13px]">
                                                    Manage Portfolio
                                                  </p>
                                                }
                                              />
                                            </ListItem>
                                            <ListItem
                                              button
                                              className={classes.listItem}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeletePortfolio(
                                                  portfolio?.id
                                                );
                                              }}
                                            >
                                              <ListItemText
                                                primary={
                                                  <p className="text-[13px]">
                                                    Delete Portfolio{" "}
                                                  </p>
                                                }
                                              />
                                            </ListItem>
                                          </List>
                                        </Popover>
                                      </>
                                    ) : null}
                                  </IconButton>
                                </span>
                                <span className="w-[30px]">
                                  <IconButton
                                  // onClick={() =>
                                  //   navigate(
                                  //     `${links.portfolio}/${portfolio.id}`
                                  //   )
                                  // }
                                  >
                                    {isHovered && hoveredId == portfolio?.id ? (
                                      <>
                                        <AddIcon
                                          className="text-[#9399AB]"
                                          width="1.0277777777777777em"
                                          height="0.6111111111111112em"
                                          style={{ color: "#9399AB" }}
                                        />
                                      </>
                                    ) : null}
                                  </IconButton>
                                </span>
                                <span className="w-[30px]">
                                  <IconButton
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleClick(portfolio?.id);
                                    }}
                                  >
                                    {isOpen && id == portfolio?.id ? (
                                      <>
                                        <KeyboardArrowDownIcon
                                          className="text-[#9399AB]"
                                          width="1.0277777777777777em"
                                          height="0.6111111111111112em"
                                          style={{ color: "#9399AB" }}
                                        />
                                      </>
                                    ) : (
                                      <>
                                        <KeyboardArrowRightIcon
                                          className="text-[#9399AB] hover:text-[#333]"
                                          width="1.0277777777777777em"
                                          height="0.6111111111111112em"
                                        />
                                      </>
                                    )}
                                  </IconButton>
                                </span>
                              </div>
                            </div>
                            <div
                              className=""
                              // style={{ flexDirection: "column" }}
                            >
                              {isOpen && id == portfolio?.id && (
                                <>
                                  {/* <div className="flex justify-between items-center w-[80%] m-auto">
                                    <div className="flex">
                                      {portfolio?.members?.map(
                                        (memberImage) => {
                                          const nameSlice =
                                            memberImage?.name?.slice(0, 1);
                                          return (
                                            <>
                                              <Tooltip
                                                PopperProps={{
                                                  sx: {
                                                    "& .MuiTooltip-tooltip": {
                                                      backgroundColor:
                                                        "#fef9f3",
                                                      marginLeft: "15px",
                                                      width: "270px",
                                                    },
                                                  },
                                                }}
                                                title={
                                                  <div
                                                    className="flex space-y-2 !justify-center bg-[#fff]"
                                                    style={{
                                                      flexDirection: "column",
                                                      alignItems:
                                                        "center !important",
                                                    }}
                                                  >
                                                    <div className="flex space-x-4 mt-5">
                                                      <div>
                                                        {memberImage?.image
                                                          ?.file_path ? (
                                                          <>
                                                            <div className="w-[80px] h-[70px] rounded-md border border-gray-300 flex justify-center items-center bg-slate-50">
                                                              <img
                                                                className="w-[70px] h-[auto] rounded-md"
                                                                src={
                                                                  memberImage
                                                                    ?.image
                                                                    ?.file_path
                                                                }
                                                                alt="portfolio"
                                                              />
                                                            </div>
                                                          </>
                                                        ) : (
                                                          <IconButton
                                                            className="!bg-white flex  justify-center align-center h-[40px] w-[40px]"
                                                            style={{
                                                              borderRadius:
                                                                "5px",
                                                              border:
                                                                "1px solid #00a99b",
                                                            }}
                                                          >
                                                            <Icon className="!text-[12px] text-[#000]">
                                                              {
                                                                memberImage?.name
                                                              }
                                                            </Icon>
                                                          </IconButton>
                                                        )}
                                                      </div>
                                                      <div>
                                                        <h2 className=" text-[18px] text-[#9197BD]">
                                                          {memberImage?.name}
                                                        </h2>
                                                        <div className="flex space-x-2 items-center">
                                                          <p className="text-[#000] text-[15px]">
                                                            {memberImage?.role
                                                              ? memberImage?.role ==
                                                                1
                                                                ? "owner"
                                                                : "member"
                                                              : ""}
                                                          </p>
                                                          <h3 className="w-[50px] h-[18px] rounded bg-[#02BDAD] border border-gray-400 text-white flex items-center justify-center">
                                                            Tag &nbsp;
                                                            <AddIcon
                                                              sx={{
                                                                fontSize:
                                                                  "15px",
                                                              }}
                                                            />
                                                          </h3>
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div className="!mt-5">
                                                      <WhiteButton
                                                        className="!text-[#2f2f2f] "
                                                        buttonText="Set yourself as Away"
                                                        width="250px"
                                                      />
                                                    </div>
                                                    <Divider />
                                                    <div className="bg-gray-50">
                                                      <div className="bottom_section pt-4 ">
                                                        <div className="flex space-x-1  items-center">
                                                          <EmailIcon
                                                            sx={{
                                                              color: "#9197BD",
                                                              fontSize: "15px",
                                                            }}
                                                          />
                                                          <p className="text-[#9197BD]">
                                                            {memberImage?.email}
                                                          </p>
                                                        </div>
                                                      </div>
                                                      <div className="w-full mt-3 bg-white border border-gray-200 shadow text-black rounded-md h-[35px] flex space-x-1 justify-center items-center ">
                                                        <PersonIcon
                                                          sx={{
                                                            fontSize: "17px",
                                                          }}
                                                        />
                                                        <h1 className="pt-1">
                                                          See Profile{" "}
                                                        </h1>
                                                      </div>
                                                      <div className="w-full !mb-[1rem]  mt-2 bg-white border space-x-1 border-gray-200 shadow text-black rounded-md h-[35px] flex justify-center items-center py-2">
                                                        <SettingsIcon
                                                          sx={{
                                                            fontSize: "17px",
                                                          }}
                                                        />
                                                        <h1 className="pt-1">
                                                          Profile Settings
                                                        </h1>
                                                      </div>
                                                    </div>
                                                  </div>
                                                }
                                              >
                                                {memberImage?.image
                                                  ?.file_path ? (
                                                  <img
                                                  style={{
                                                    borderRadius: "3px",
                                                  }}
                                                    src={
                                                      memberImage?.image
                                                        ?.file_path
                                                    }
                                                    className="h-[20px] w-[20px]"
                                                    alt="portfolio"
                                                  />
                                                ) : (
                                                  <AvatarGroup
                                                  sx={{
                                                    "& .MuiAvatar-root": {
                                                      width: 20,
                                                      height: 20,
                                                      fontSize: 13,
                                                    },
                                                  }}
                                                    className="!bg-white  flex items-center"
                                                    style={{
                                                      borderRadius: "3px",
                                                    }}
                                                  >
                                                    <Avatar className="!text-[10px] h-[20px] w-[20px] !bg-white !text-[#000] flex items-center justify-center" src={nameSlice} alt={nameSlice}>
                                                     
                                                    </Avatar>
                                                  </AvatarGroup>
                                                )}
                                              </Tooltip>
                                            </>
                                          );
                                        }
                                      )}
                                    </div>

                                    <Button
                                      startIcon={
                                        <i
                                          className="fa-solid fa-plus ml-[5px] text-xs !text-[11px]"
                                          style={{ color: "gray" }}
                                        />
                                      }
                                      className="!text-[11px]"
                                      style={{ color: "gray" }}
                                    >
                                      Invite People
                                    </Button>
                                  </div> */}
                                  {projects?.length == 0 ? (
                                    <p className="flex items-center justify-center py-3">
                                      Drag or create a new project...
                                    </p>
                                  ) : (
                                    <>
                                      <div>
                                        {projects?.map(
                                          (project, indexChild) => {
                                            const sliceName =
                                              project.name.slice(0, 1);
                                            return (
                                              <>
                                                <div
                                                  className="flex items-center justify-center  mt-[10px] mb-[10px]"
                                                  onMouseEnter={() =>
                                                    handleChildMouseEnter(
                                                      project?.id
                                                    )
                                                  }
                                                  onMouseLeave={
                                                    handleChildMouseLeave
                                                  }
                                                >
                                                  <div
                                                    className="flex items-center"
                                                    style={{
                                                      width:
                                                        "-webkit-fill-available",
                                                    }}
                                                    onClick={() => {
                                                      navigate(
                                                        `/dashboard/${project?.id}`
                                                      );
                                                      localStorage.setItem(
                                                        "projectId",
                                                        project?.id
                                                      );
                                                    }}
                                                  >
                                                    <DragIndicatorIcon
                                                      className={
                                                        childIsHovered &&
                                                        childId == project?.id
                                                          ? classes.visibleDiv
                                                          : classes.hiddenDiv
                                                      }
                                                      style={{
                                                        color: "gray",
                                                      }}
                                                    />
                                                    <p className=" capitalize text-[#9399AB] flex !align-center cursor-pointer  ">
                                                      <Icon
                                                        style={{
                                                          borderRadius: "4px",
                                                          backgroundColor:
                                                            "rgb(223, 103, 255)",
                                                          display: "flex",
                                                          justifyContent:
                                                            "center",
                                                          alignItems: "center",
                                                          height: "18px",
                                                          width: "18px",
                                                        }}
                                                        className="text-[2px] h-[15px]  w-[15px] mr-[8px] flex align-center justify-center"
                                                      >
                                                        <h2 className="text-[10px]">
                                                          {sliceName}
                                                        </h2>
                                                      </Icon>
                                                    </p>
                                                    <h3 className="text-[14px]">
                                                      {project?.name}
                                                    </h3>
                                                  </div>

                                                  {childIsHovered &&
                                                  childId == project?.id ? (
                                                    <>
                                                      <span className="mr-[2rem]">
                                                        <MoreHorizIcon
                                                          className="text-[#9399AB]"
                                                          width="1.0277777777777777em"
                                                          height="0.6111111111111112em"
                                                          style={{
                                                            color: "#9399AB",
                                                          }}
                                                          // onClick={
                                                          //   handlePopoverClick
                                                          // }
                                                          onClick={
                                                            handleProjectMenu
                                                          }
                                                        />
                                                      </span>
                                                      <Popover
                                                        open={Boolean(
                                                          projectMenuAnchor
                                                        )}
                                                        anchorEl={
                                                          projectMenuAnchor
                                                        }
                                                        onClose={
                                                          handleProjectMenuClose
                                                        }
                                                        anchorOrigin={{
                                                          vertical: "bottom",
                                                          horizontal: "center",
                                                        }}
                                                        transformOrigin={{
                                                          vertical: "top",
                                                          horizontal: "center",
                                                        }}
                                                      >
                                                        <List disablePadding>
                                                          {projectContextOptions.map(
                                                            (el) => (
                                                              <ListItem
                                                                onClick={(
                                                                  e
                                                                ) => {
                                                                  handleProjectClick(
                                                                    el.key,
                                                                    project?.id
                                                                  );
                                                                }}
                                                                key={el.key}
                                                                button
                                                                className={
                                                                  classes.listItem
                                                                }
                                                              >
                                                                <ListItemText
                                                                  primary={
                                                                    <p className="text-[13px]">
                                                                      {el.name}
                                                                    </p>
                                                                  }
                                                                />
                                                              </ListItem>
                                                            )
                                                          )}
                                                        </List>
                                                      </Popover>
                                                    </>
                                                  ) : null}
                                                </div>
                                              </>
                                            );
                                          }
                                        )}
                                      </div>
                                    </>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </Draggable>
                  </>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};

export default sideBarPortfolio;

const projectContextOptions = [
  { name: "Manage Members", key: "manage" },
  { name: "Invite Guests", key: "invite" },
  { name: "Project Settings", key: "settings" },
  { name: "Duplicate Project", key: "duplicate" },
  { name: "Move Project", key: "move" },
  { name: "Archive Project", key: "archive" },
  { name: "Delete Project", key: "delete" },
];

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
  listItem: {
    "&:hover": {
      backgroundColor: "#f2fffe !important",
      color: "#00b8a9 !important",
    },
  },
}));
