import { Box, Menu, MenuItem, Paper, Popover, Popper } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import Select from "react-select";
import { usePortfolios } from "hooks/Portfolio";
import { useSelector } from "react-redux";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  useAddProjectTask,
  useGetProjectList,
  useGetProjectStatus,
  useGetProjectTasks,
} from "hooks/MyWork";
import { useAuth } from "hooks/useAuth";
import { useDisplaySuccess } from "hooks/useDisplaySuccess";
import ReportsView from "components/MyWork/ReportsView";
import AddList from "./AddList";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import { formateDate } from "utils";

function ListViewTasks({
  isProjectSelect,
  setIsProjectSelect,
  setIsEditColumn,
  selectedView,
}) {
  const [filterBy, setFilterBy] = useState("");
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [allProjectsAnchorEl, setAllProjectsAnchorEl] = useState(null);
  const [groupByAchorEl, setGroupByAnchorEl] = useState(null);
  const [viewsAchorEl, setViewsAnchorEl] = useState(null);
  const [activeGroupBy, setActiveGroupBy] = useState("list");
  const [addNewView, setAddNewView] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const allProjectsRef = useRef(null);
  const [newView, setNewView] = useState("");
  const [newTask, setNewTask] = useState(null);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  const [statusSelectAnchorEl, setStatusSelectAnchorEl] = useState(null);
  const [selectedList, setSelectedList] = useState(null);
  const [listSelectAnchorEl, setListSelectAnchorEl] = useState(null);
  const [isTaskSelected, setIsTaskSelected] = useState(false);
  const { activeWorkspace } = useSelector(({ workspace }) => workspace);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [expandedPortfolios, setExpandedPortfolios] = useState([]);
  const [searchPortfolio, setSearchPortfolio] = useState("");
  const [searchTask, setSearchTask] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState(null);
  const [newTaskList, setNewTaskList] = useState(null);
  const [isAddList, setIsAddList] = useState(false);
  const [currMilestoneId, setCurrMilestoneId] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [openCollapsibles, setOpenCollapsibles] = useState([]);
  const [isOpenUsers, setIsOpenUsers] = useState(false);
  const [addNewTaskProjectId, setAddNewTaskProjectId] = useState(null);

  const auth = useAuth();

  const handleAddList = () => {
    setIsAddList(true);
  };
  const handleListAddClose = () => {
    setIsAddList(false);
  };

  const handleSearch = (event) => {
    setSearchPortfolio(event.target.value);
  };

  const handleProjectCheckboxChange = (portfolioId) => {
    const updatedPortfolios = selectedProjects?.map((portfolio) => {
      if (portfolio.id === portfolioId) {
        return {
          ...portfolio,
          isChecked: !portfolio.isChecked, // Toggle the isChecked value
        };
      } else {
        portfolio.isChecked = false;
      }

      return portfolio;
    });

    setSelectedProjects(updatedPortfolios);
  };
  const handleTogglePortfolio = (portfolioId) => {
    if (expandedPortfolios.includes(portfolioId)) {
      setExpandedPortfolios(
        expandedPortfolios.filter((id) => id !== portfolioId)
      );
    } else {
      setExpandedPortfolios([...expandedPortfolios, portfolioId]);
    }
  };

  const { workspacePortfolios } = usePortfolios({
    id: activeWorkspace?.id,
  });
  const defaultSelectedProject = selectedProjects.filter((el) => el.isChecked)
    .length
    ? selectedProjects.filter((el) => el.isChecked)[0]
    : null;

  const defaultSelectedProjectId = useMemo(
    () =>
      selectedProjects.filter((el) => el.isChecked).length
        ? selectedProjects.filter((el) => el.isChecked)[0].id
        : null,
    [selectedProjects]
  );
  const defaultSelectedProjectIds = useMemo(
    () =>
      selectedProjects.filter((el) => el.isChecked).length
        ? selectedProjects.filter((el) => el.isChecked).map((el) => el.id)
        : null,
    [selectedProjects]
  );
  const onProjectTasksSuccess = (data) => {
    if (data?.data?.success) {
      handleToggle(data.data?.data[0]?.id);
      data.data?.data.forEach((element) => {
        element.newTask = { name: "", status: "" };
      });
      setMilestones(data.data?.data);
    }
  };

  const { projectTasks } = useGetProjectTasks({
    type: "list",
    search: searchTask,
    projects: defaultSelectedProjectIds,
    onSuccess: onProjectTasksSuccess,
  });
  const { projectStatus } = useGetProjectStatus({
    id: addNewTaskProjectId,
  });
  const { projectList } = useGetProjectList({
    id: addNewTaskProjectId,
  });
  const displaySuccess = useDisplaySuccess();
  const onAddProjectBasicSuccess = (data) => {
    displaySuccess(data.message);
    setNewTask(null);
    setNewTaskStatus(null);
    if (milestones.filter((el) => el.tasks.length).length)
      handleToggle(milestones.filter((el) => el.tasks.length)[0]?.id);
  };

  const addProjetBasicTask = useAddProjectTask({
    type: "list",
    search: searchTask,
    projects: defaultSelectedProjectIds,
    onSuccess: onAddProjectBasicSuccess,
  });

  const projectListOptions = projectList.map((el) => {
    return {
      value: el.id,
      label: el.name,
    };
  });
  const projectStatusOptions = projectStatus.map((el) => {
    return {
      value: el.id,
      label: el.name,
    };
  });

  useEffect(() => {
    if (workspacePortfolios.length) {
      // Add the isChecked key to each portfolio object
      const portfoliosWithChecked = workspacePortfolios.map((portfolio) => ({
        ...portfolio,
        isChecked: true, // Set initial value of isChecked
      }));
      const selected = portfoliosWithChecked.filter((portfolio) =>
        portfolio.name.toLowerCase().includes(searchPortfolio.toLowerCase())
      );
      setSelectedProjects(selected);
    }
  }, [workspacePortfolios]);

  const handleSearchTask = (e) => {
    setSearchTask(e.target.value);
  };
  const handleTaskActionsOpen = () => {
    setIsTaskSelected(!isTaskSelected);
  };

  const handleTaskActionsClose = () => {
    setIsTaskSelected(false);
  };

  const handleListClick = (option) => {
    setSelectedList(option);
    setListSelectAnchorEl(null);
  };

  const handleListSelectClick = (event) => {
    if (!!listSelectAnchorEl) {
      return setListSelectAnchorEl(null);
    }
    setListSelectAnchorEl(event.currentTarget);
  };

  const handleStatusClick = (option) => {
    setSelectedStatus(option);
    setStatusSelectAnchorEl(null);
  };

  const handleStatusSelectClick = (event, project) => {
    if (statusSelectAnchorEl) {
      return setStatusSelectAnchorEl(null);
    }
    setAddNewTaskProjectId(project.project_Id);
    setCurrMilestoneId(project.id);
  };

  const handleToggle = (id) => {
    const isOpen = openCollapsibles.includes(id);

    if (isOpen) {
      setOpenCollapsibles(
        openCollapsibles.filter((collapsibleId) => collapsibleId !== id)
      );
    } else {
      setOpenCollapsibles([...openCollapsibles, id]);
    }
    setIsCollapsed(!isCollapsed);
  };

  const handleViewsMenuClick = (event) => {
    setViewsAnchorEl(event.currentTarget);
  };

  const handleViewsClose = () => {
    setViewsAnchorEl(null);
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };
  const handleGroupByClick = (event) => {
    setGroupByAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setFilterAnchorEl(null);
  };
  const handleProjectsMenuClose = () => {
    setAllProjectsAnchorEl(null);
  };
  const handleGroupByMenuClose = () => {
    setGroupByAnchorEl(null);
  };

  const handleFilterMenuItemClick = (e, listType) => {
    const element = allProjectsRef.current;
    if (listType === "project") {
      setAllProjectsAnchorEl(element);
      setFilterBy(listType);
      setFilterAnchorEl(null);
      return;
    }
    setFilterBy(listType);
    setFilterAnchorEl(null);
    setAllProjectsAnchorEl(null);
  };
  const handleGroupByMenuItemClick = (e, listType) => {
    setActiveGroupBy(listType);
    setGroupByAnchorEl(null);
  };
  const handleMenuItemCick = (listType) => {
    if (listType === "save") {
      setAddNewView(true);
      return;
    }
    setViewsAnchorEl(null);
  };
  const handleSaveView = () => {
    setAddNewView(false);
    setViewsAnchorEl(null);
  };
  const handleSaveViewCancel = () => {
    setAddNewView(false);
    setViewsAnchorEl(null);
  };
  const handleNewTaskValue = (project) => {
    return project?.newTask?.name;
  };
  const handleNewTask = (e, milesstoneId) => {
    const { name, value } = e.target;

    setMilestones((prevMilestones) => {
      const updatedMilestones = [...prevMilestones];
      const milestone = updatedMilestones.filter(
        (el) => el.id === milesstoneId
      );

      milestone[0].newTask.name = value;

      return updatedMilestones;
    });
    setNewTask(e.currentTarget.value);
  };
  const handleNewTaskStatus = (value, milesstoneId) => {
    setIsOpenUsers(false);
    setMilestones((prevMilestones) => {
      const updatedMilestones = [...prevMilestones];
      const milestone = updatedMilestones.filter(
        (el) => el.id === milesstoneId
      );
      milestone[0].newTask.status = value;

      return updatedMilestones;
    });
    setNewTaskStatus(value);
    setAddNewTaskProjectId(null);
    setCurrMilestoneId(null);
    setStatusSelectAnchorEl(null);
  };
  const handleNewTaskList = (value) => {
    setNewTaskList(value);
  };
  const handleTaskSubmit = (project) => {
    const payload = {
      name: project.newTask.name,
      status_Id: project?.newTask?.status?.value,
      milestone_Id: null,
      project_Id: project.project_Id,
    };
    addProjetBasicTask.mutate({ data: payload });
    setMilestones((prevMilestones) => {
      const updatedMilestones = [...prevMilestones];
      const milestone = updatedMilestones.filter((el) => el.id === project.id);

      milestone[0].newTask.name = "";
      milestone[0].newTask.status = "";
      return updatedMilestones;
    });
  };

  return (
    <>
      {isAddList && (
        <AddList open={isAddList} handleClose={handleListAddClose} />
      )}
      <div className="h-full w-full flex">
        {/*sidebar start*/}
        <div
          style={{
            display: isProjectSelect ? "block" : "none",
          }}
          className="sidebar_popup bg-white w-[326px] min-h-[500px] border border-gray-300 rounded px-3 m-7 "
        >
          <div className="flex justify-between mt-4 mx-1 border-b pb-2">
            <h3 className=" font-medium text-sm">Select Projects</h3>
            <span>
              <svg
                onClick={() => setIsProjectSelect(false)}
                className="icon cursor-pointer "
                width="1.0277777777777777em"
                height="0.6111111111111112em"
                viewBox="0 0 37 22"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g
                  id="Style-guide"
                  stroke="none"
                  strokeWidth={1}
                  fill="none"
                  fillRule="evenodd"
                >
                  <g
                    id="nifty-UI-guide"
                    transform="translate(-617.000000, -2934.000000)"
                    fill="currentColor"
                    fillRule="nonzero"
                  >
                    <g
                      id="Group-6-Copy-3"
                      transform="translate(574.000000, 2884.000000)"
                    >
                      <path
                        d="M70.5909903,46.8409903 C71.4696699,45.9623106 71.4696699,44.5376894 70.5909903,43.6590097 C69.7123106,42.7803301 68.2876894,42.7803301 67.4090097,43.6590097 L51.6590097,59.4090097 C50.7803301,60.2876894 50.7803301,61.7123106 51.6590097,62.5909903 L67.4090097,78.3409903 C68.2876894,79.2196699 69.7123106,79.2196699 70.5909903,78.3409903 C71.4696699,77.4623106 71.4696699,76.0376894 70.5909903,75.1590097 L56.4319805,61 L70.5909903,46.8409903 Z"
                        id="Path-82"
                        transform="translate(61.125000, 61.000000) rotate(-90.000000) translate(-61.125000, -61.000000) "
                      ></path>
                    </g>
                  </g>
                </g>
              </svg>
            </span>
          </div>
          <div className="h-9 w-full bg-white border border-gray-400 mt-3 rounded-md shadow-sm">
            <span className="flex px-3 pt-1">
              <svg
                className="icon  mt-1 mr-3 text-[#8e94bb]"
                width="1em"
                height="1em"
                viewBox="0 0 15 15"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.151 13.092a.746.746 0 0 1-.002 1.057.747.747 0 0 1-1.057.002l-4.066-4.066a5.618 5.52 0 1 1 1.06-1.06l4.065 4.067zM5.618 9.738a4.12 4.12 0 1 0 0-8.24 4.12 4.12 0 0 0 0 8.24z"
                  fill="currentColor"
                  fillRule="evenodd"
                />
              </svg>{" "}
              <input
                type="text"
                placeholder="Type to search..."
                value={searchPortfolio}
                onChange={handleSearch}
              />
            </span>
            <ul className="mt-[20px]">
              {selectedProjects?.map((portfolio, index) => (
                <li key={portfolio.id}>
                  <div className=" justify-between portfolio-header flex items-center gap-[10px] text-[14px] cursor-pointer">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={portfolio.isChecked}
                        className="mr-5"
                        //   disabled={index > 0}
                        onClick={(e) => {
                          handleProjectCheckboxChange(portfolio.id);
                        }}
                      />

                      <span className="text-[14px]">{portfolio.name}</span>
                    </div>
                    <span>
                      {expandedPortfolios.includes(portfolio.id) ? (
                        <KeyboardArrowDownIcon
                          className="text-[14px]"
                          onClick={() => {
                            handleTogglePortfolio(portfolio.id);
                          }}
                        />
                      ) : (
                        <ChevronRightIcon
                          className="text-[14px]"
                          onClick={() => {
                            handleTogglePortfolio(portfolio.id);
                          }}
                        />
                      )}
                    </span>
                  </div>
                  {expandedPortfolios.includes(portfolio.id) && (
                    <ul className="project-list">
                      {portfolio.projects.map((project, i) => (
                        <li key={project.id}>
                          <label className="text-[14px] flex items-center gap-[10px] ml-[10px]">
                            <input
                              type="checkbox"
                              //   disabled={index > 0}
                              checked={portfolio.isChecked}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleProjectCheckboxChange(portfolio.id);
                              }}
                            />
                            {project.name}
                          </label>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/*sidebar end*/}

        {/* text part */}
        <div class="px-4 pb-5 flex flex-col w-full bg-[#fafbfd] ">
          <div
            class={`${
              selectedView !== "report" && "sticky"
            } px-4 pb-5 flex flex-col  top-0 z-30`}
          >
            {/* header part */}
            <div className="project-generic-header flex items-center my-3">
              <div
                style={{
                  display: isProjectSelect ? "none" : "flex",
                }}
                className="project-generic-head cursor-pointer flex justify-between px-4 py-2 min-h-[40px] w-80 bg-white shadow-[#000] border border-solid border-[e5e9f1] rounded-md min-w-[240px]"
              >
                <div className="flex">
                  <span className="text-sm font-medium text-[#2f2f2f] mr-1">
                    Select Projects:
                  </span>
                  <span className="text-sm font-normal">
                    {selectedProjects?.filter((el) => el.isChecked)?.length ??
                      "0"}{" "}
                    selected{" "}
                  </span>
                </div>
                <span className="icon relative top-2 text-sm ">
                  <svg
                    onClick={() => setIsProjectSelect(true)}
                    className="icon "
                    width="1.0277777777777777em"
                    height="0.6111111111111112em"
                    viewBox="0 0 37 22"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g
                      id="Style-guide"
                      stroke="none"
                      strokeWidth={1}
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g
                        id="nifty-UI-guide"
                        transform="translate(-617.000000, -2934.000000)"
                        fill="currentColor"
                        fillRule="nonzero"
                      >
                        <g
                          id="Group-6-Copy-3"
                          transform="translate(574.000000, 2884.000000)"
                        >
                          <path
                            d="M70.5909903,46.8409903 C71.4696699,45.9623106 71.4696699,44.5376894 70.5909903,43.6590097 C69.7123106,42.7803301 68.2876894,42.7803301 67.4090097,43.6590097 L51.6590097,59.4090097 C50.7803301,60.2876894 50.7803301,61.7123106 51.6590097,62.5909903 L67.4090097,78.3409903 C68.2876894,79.2196699 69.7123106,79.2196699 70.5909903,78.3409903 C71.4696699,77.4623106 71.4696699,76.0376894 70.5909903,75.1590097 L56.4319805,61 L70.5909903,46.8409903 Z"
                            id="Path-82"
                            transform="translate(61.125000, 61.000000) rotate(-90.000000) translate(-61.125000, -61.000000) "
                          ></path>
                        </g>
                      </g>
                    </g>
                  </svg>
                </span>
              </div>
              {/* filter  start*/}
              <div
                className="filter-box-holder flex items-center p-[14px_20px] pr-0  overflow-x-auto"
                style={{
                  paddingLeft: isProjectSelect ? "0px" : "",
                }}
              >
                <div className="filter-box bg-white rounded-md items-center flex min-[34px]  p-[6px_14px] border border-solid border-[e5e9f1] min-h-[40px] mr-5">
                  <div
                    onClick={handleFilterClick}
                    className="filter-box-title min-w-[115px] text-sm font-medium text-[#2f2f2f] hover:text-[#00a99b] flex cursor-pointer border-r pr-3 border-solid border-[e5e9f1]"
                  >
                    <span className="icon relative top-1 mr-2">
                      <svg
                        className="icon "
                        width="1em"
                        height="1em"
                        viewBox="0 0 16 16"
                        version="1.1"
                      >
                        <path
                          fill="currentColor"
                          d="m13.5 7h-11a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1z"
                        />
                        <path
                          fill="currentColor"
                          d="m11.5 11h-7a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1z"
                        />
                        <path
                          fill="currentColor"
                          d="m9.5 15h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 0 1z"
                        />
                        <path
                          fill="currentColor"
                          d="m14.5 3h-13a.5.5 0 0 1 0-1h13a.5.5 0 0 1 0 1z"
                        />
                      </svg>
                    </span>
                    Filter by
                    <div className="filter-box-arrow cursor-pointer relative ml-3 top-2">
                      <svg
                        className="icon "
                        width="12.333333333333332px"
                        height="7.333333333333334px"
                        viewBox="0 0 37 22"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g
                          id="Style-guide"
                          stroke="none"
                          strokeWidth={1}
                          fill="none"
                          fillRule="evenodd"
                        >
                          <g
                            id="nifty-UI-guide"
                            transform="translate(-617.000000, -2934.000000)"
                            fill="currentColor"
                            fillRule="nonzero"
                          >
                            <g
                              id="Group-6-Copy-3"
                              transform="translate(574.000000, 2884.000000)"
                            >
                              <path
                                d="M70.5909903,46.8409903 C71.4696699,45.9623106 71.4696699,44.5376894 70.5909903,43.6590097 C69.7123106,42.7803301 68.2876894,42.7803301 67.4090097,43.6590097 L51.6590097,59.4090097 C50.7803301,60.2876894 50.7803301,61.7123106 51.6590097,62.5909903 L67.4090097,78.3409903 C68.2876894,79.2196699 69.7123106,79.2196699 70.5909903,78.3409903 C71.4696699,77.4623106 71.4696699,76.0376894 70.5909903,75.1590097 L56.4319805,61 L70.5909903,46.8409903 Z"
                                id="Path-82"
                                transform="translate(61.125000, 61.000000) rotate(-90.000000) translate(-61.125000, -61.000000) "
                              ></path>
                            </g>
                          </g>
                        </g>
                      </svg>
                    </div>
                  </div>
                  <div
                    ref={allProjectsRef}
                    className="filter-box-search  flex "
                  >
                    {!!filterBy.length && (
                      <div className="item-icon flex items-center gap-[4px]  top-1 mx-2 text-sm  ">
                        <svg
                          class="icon "
                          width="1em"
                          height="1em"
                          viewBox="0 0 11 11"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.195 6.438c.078 0 .149.027.211.082a.255.255 0 0 1 .094.199v4.289c0 .203-.11.375-.328.515v.024L6.07 13.703v.024a.326.326 0 0 1-.14.023.312.312 0 0 1-.211-.082.255.255 0 0 1-.094-.2V9.134c0-.219.102-.39.305-.516L6 8.57l4.031-2.086.047-.023a.26.26 0 0 1 .117-.024zm-.304-1.149c.125.047.187.117.187.211a.252.252 0 0 1-.047.14.265.265 0 0 1-.094.094l-.046.024L5.6 8.03l-.046.024a.672.672 0 0 1-.305.07.672.672 0 0 1-.305-.07l-.047-.024L.61 5.781C.484 5.703.422 5.61.422 5.5c0-.047.015-.086.047-.117a.367.367 0 0 1 .094-.07l.046-.024 4.243-1.922c.171-.078.304-.117.398-.117l.398.117L9.891 5.29zM4.57 8.617c.202.125.304.297.304.516v4.336a.255.255 0 0 1-.094.199.312.312 0 0 1-.21.082.36.36 0 0 1-.141-.047L.328 11.547v-.024C.11 11.383 0 11.211 0 11.008v-4.29c0-.077.031-.144.094-.198a.312.312 0 0 1 .21-.082c.063 0 .102.007.118.023l.047.023L4.477 8.57l.093.047z"
                            id="a"
                            transform="translate(0 -3)"
                            fill="currentColor"
                            fill-rule="evenodd"
                          ></path>
                        </svg>
                        {filterBy}
                        <Dropdowns
                          anchor={allProjectsAnchorEl}
                          activeMenu={filterBy}
                          handleClose={handleProjectsMenuClose}
                          handleMenuClick={handleFilterMenuItemClick}
                          id={"all-projects-menu"}
                          options={[
                            {
                              key: 1,
                              name: "all_projects",
                              label: "All Projects",
                              icon: (el) => {
                                return (
                                  <svg
                                    className={`text-[13px] icon hover:text-[#00a99b] ${
                                      filterBy === el.name &&
                                      "!bg-[#F2FFFE] text-[#00a99b]"
                                    }`}
                                    width="1em"
                                    height="1em"
                                    viewBox="0 0 11 11"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M10.195 6.438c.078 0 .149.027.211.082a.255.255 0 0 1 .094.199v4.289c0 .203-.11.375-.328.515v.024L6.07 13.703v.024a.326.326 0 0 1-.14.023.312.312 0 0 1-.211-.082.255.255 0 0 1-.094-.2V9.134c0-.219.102-.39.305-.516L6 8.57l4.031-2.086.047-.023a.26.26 0 0 1 .117-.024zm-.304-1.149c.125.047.187.117.187.211a.252.252 0 0 1-.047.14.265.265 0 0 1-.094.094l-.046.024L5.6 8.03l-.046.024a.672.672 0 0 1-.305.07.672.672 0 0 1-.305-.07l-.047-.024L.61 5.781C.484 5.703.422 5.61.422 5.5c0-.047.015-.086.047-.117a.367.367 0 0 1 .094-.07l.046-.024 4.243-1.922c.171-.078.304-.117.398-.117l.398.117L9.891 5.29zM4.57 8.617c.202.125.304.297.304.516v4.336a.255.255 0 0 1-.094.199.312.312 0 0 1-.21.082.36.36 0 0 1-.141-.047L.328 11.547v-.024C.11 11.383 0 11.211 0 11.008v-4.29c0-.077.031-.144.094-.198a.312.312 0 0 1 .21-.082c.063 0 .102.007.118.023l.047.023L4.477 8.57l.093.047z"
                                      id="a"
                                      transform="translate(0 -3)"
                                      fill="currentColor"
                                      fill-rule="evenodd"
                                    ></path>
                                  </svg>
                                );
                              },
                            },
                            {
                              key: 2,
                              name: "demo_projects",
                              label: "Demo Projects",
                              icon: (el) => {
                                return (
                                  <svg
                                    className={`text-[13px] icon hover:text-[#00a99b] ${
                                      filterBy === el.name &&
                                      "!bg-[#F2FFFE] text-[#00a99b]"
                                    }`}
                                    width="1em"
                                    height="1em"
                                    viewBox="0 0 11 11"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M10.195 6.438c.078 0 .149.027.211.082a.255.255 0 0 1 .094.199v4.289c0 .203-.11.375-.328.515v.024L6.07 13.703v.024a.326.326 0 0 1-.14.023.312.312 0 0 1-.211-.082.255.255 0 0 1-.094-.2V9.134c0-.219.102-.39.305-.516L6 8.57l4.031-2.086.047-.023a.26.26 0 0 1 .117-.024zm-.304-1.149c.125.047.187.117.187.211a.252.252 0 0 1-.047.14.265.265 0 0 1-.094.094l-.046.024L5.6 8.03l-.046.024a.672.672 0 0 1-.305.07.672.672 0 0 1-.305-.07l-.047-.024L.61 5.781C.484 5.703.422 5.61.422 5.5c0-.047.015-.086.047-.117a.367.367 0 0 1 .094-.07l.046-.024 4.243-1.922c.171-.078.304-.117.398-.117l.398.117L9.891 5.29zM4.57 8.617c.202.125.304.297.304.516v4.336a.255.255 0 0 1-.094.199.312.312 0 0 1-.21.082.36.36 0 0 1-.141-.047L.328 11.547v-.024C.11 11.383 0 11.211 0 11.008v-4.29c0-.077.031-.144.094-.198a.312.312 0 0 1 .21-.082c.063 0 .102.007.118.023l.047.023L4.477 8.57l.093.047z"
                                      id="a"
                                      transform="translate(0 -3)"
                                      fill="currentColor"
                                      fill-rule="evenodd"
                                    ></path>
                                  </svg>
                                );
                              },
                            },
                          ]}
                        />
                      </div>
                    )}
                  </div>

                  {/* search  */}
                  <div className="filter-box-search items-center min-w-[180px] flex">
                    <div className="item-icon relative  mx-2 text-sm">
                      <svg
                        className="icon "
                        width="1em"
                        height="1em"
                        viewBox="0 0 15 15"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14.151 13.092a.746.746 0 0 1-.002 1.057.747.747 0 0 1-1.057.002l-4.066-4.066a5.618 5.52 0 1 1 1.06-1.06l4.065 4.067zM5.618 9.738a4.12 4.12 0 1 0 0-8.24 4.12 4.12 0 0 0 0 8.24z"
                          fill="currentColor"
                          fillRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="field-type-text">
                      <input
                        className="field-input focus:outline-none border-none"
                        type="text"
                        placeholder="Search..."
                        defaultValue=""
                        value={searchTask}
                        onChange={handleSearchTask}
                      />
                    </div>
                    {!!filterBy.length && (
                      <p
                        className="text-[#00a99b] min-w-[70px] text-[13px] cursor-pointer"
                        onClick={() => setFilterBy("")}
                      >
                        Clear filters
                      </p>
                    )}
                  </div>
                  {/* end search  */}
                </div>

                {/* Group By  */}
                <div className="filter-box bg-white rounded-md items-center flex min-[34px] min-w-[211px] p-[6px_16px] border border-solid border-[e5e9f1] min-h-[40px] cursor-pointer ml-5 hover:text-[#00a99b]">
                  <div className="filter-box-icon relative top-0 mx-2 text-sm">
                    <svg
                      className="icon "
                      width="14px"
                      height="14px"
                      viewBox="0 0 612 612"
                      version="1.1"
                    >
                      <path
                        d="M306 561.072 40.793 438.806c.918.554-23.466-10.461-40.793-20.368 0 14.784 3.71 41.884 17.5 49.189l259.641 116.72c22.95 10.825 32.837 10.825 57.7 0l259.641-116.72C607.314 461.66 612 433.565 612 418.438c-16.696 8.357-40.335 20.272-40.794 20.368L306 561.072zm0-509.433c1.912 2.238 1.415.459 0 0zM17.5 345.361l259.641 116.72c22.95 10.824 32.837 10.824 57.7 0l259.641-116.72C607.314 339.394 612 311.3 612 296.171c-16.696 8.358-40.335 20.273-40.794 20.369L306 438.806 40.793 316.54c.918.555-23.466-10.462-40.793-20.369 0 14.784 3.71 41.885 17.5 49.19zm0-122.266 259.641 116.72c22.95 10.825 32.837 10.825 57.7 0l259.641-116.72c19.125-8.912 19.756-46.818 0-57.643L334.841 28.364c-20.388-12.087-34.75-11.456-57.701 0L17.5 165.452c-19.757 12.737-20.388 46.818 0 57.643zM306 51.639l265.206 142.634L306 306.04 40.793 194.273 306 51.639z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <div className="flex">
                    <span
                      className="text-sm font-medium mr-1"
                      onClick={(e) => handleGroupByClick(e)}
                    >
                      Group by:
                    </span>
                    <span className="text-sm font-normal">{activeGroupBy}</span>
                    <span className="icon relative top-2 ml-2 text-sm ">
                      <svg
                        className="icon "
                        width="1.0277777777777777em"
                        height="0.6111111111111112em"
                        viewBox="0 0 37 22"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g
                          id="Style-guide"
                          stroke="none"
                          strokeWidth={1}
                          fill="none"
                          fillRule="evenodd"
                        >
                          <g
                            id="nifty-UI-guide"
                            transform="translate(-617.000000, -2934.000000)"
                            fill="currentColor"
                            fillRule="nonzero"
                          >
                            <g
                              id="Group-6-Copy-3"
                              transform="translate(574.000000, 2884.000000)"
                            >
                              <path
                                d="M70.5909903,46.8409903 C71.4696699,45.9623106 71.4696699,44.5376894 70.5909903,43.6590097 C69.7123106,42.7803301 68.2876894,42.7803301 67.4090097,43.6590097 L51.6590097,59.4090097 C50.7803301,60.2876894 50.7803301,61.7123106 51.6590097,62.5909903 L67.4090097,78.3409903 C68.2876894,79.2196699 69.7123106,79.2196699 70.5909903,78.3409903 C71.4696699,77.4623106 71.4696699,76.0376894 70.5909903,75.1590097 L56.4319805,61 L70.5909903,46.8409903 Z"
                                id="Path-82"
                                transform="translate(61.125000, 61.000000) rotate(-90.000000) translate(-61.125000, -61.000000) "
                              ></path>
                            </g>
                          </g>
                        </g>
                      </svg>
                    </span>
                    <Dropdowns
                      anchor={groupByAchorEl}
                      activeMenu={activeGroupBy}
                      handleClose={handleGroupByMenuClose}
                      handleMenuClick={handleGroupByMenuItemClick}
                      id={"group-by-menu"}
                      options={[
                        {
                          key: 1,
                          name: "list",
                          label: "List",
                          icon: (el) => {
                            return (
                              <svg
                                className={`text-[13px] icon hover:text-[#00a99b] ${
                                  filterBy === el.name &&
                                  "!bg-[#F2FFFE] text-[#00a99b]"
                                }`}
                                width="1em"
                                height="1em"
                                viewBox="0 0 11 11"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10.195 6.438c.078 0 .149.027.211.082a.255.255 0 0 1 .094.199v4.289c0 .203-.11.375-.328.515v.024L6.07 13.703v.024a.326.326 0 0 1-.14.023.312.312 0 0 1-.211-.082.255.255 0 0 1-.094-.2V9.134c0-.219.102-.39.305-.516L6 8.57l4.031-2.086.047-.023a.26.26 0 0 1 .117-.024zm-.304-1.149c.125.047.187.117.187.211a.252.252 0 0 1-.047.14.265.265 0 0 1-.094.094l-.046.024L5.6 8.03l-.046.024a.672.672 0 0 1-.305.07.672.672 0 0 1-.305-.07l-.047-.024L.61 5.781C.484 5.703.422 5.61.422 5.5c0-.047.015-.086.047-.117a.367.367 0 0 1 .094-.07l.046-.024 4.243-1.922c.171-.078.304-.117.398-.117l.398.117L9.891 5.29zM4.57 8.617c.202.125.304.297.304.516v4.336a.255.255 0 0 1-.094.199.312.312 0 0 1-.21.082.36.36 0 0 1-.141-.047L.328 11.547v-.024C.11 11.383 0 11.211 0 11.008v-4.29c0-.077.031-.144.094-.198a.312.312 0 0 1 .21-.082c.063 0 .102.007.118.023l.047.023L4.477 8.57l.093.047z"
                                  id="a"
                                  transform="translate(0 -3)"
                                  fill="currentColor"
                                  fill-rule="evenodd"
                                ></path>
                              </svg>
                            );
                          },
                        },
                        {
                          key: 2,
                          name: "assignee",
                          label: "Assignee",
                          icon: (el) => {
                            return (
                              <svg
                                className={`text-[13px] icon hover:text-[#00a99b] ${
                                  filterBy === el.name &&
                                  "!bg-[#F2FFFE] text-[#00a99b]"
                                }`}
                                width="1em"
                                height="1em"
                                viewBox="0 0 11 11"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10.195 6.438c.078 0 .149.027.211.082a.255.255 0 0 1 .094.199v4.289c0 .203-.11.375-.328.515v.024L6.07 13.703v.024a.326.326 0 0 1-.14.023.312.312 0 0 1-.211-.082.255.255 0 0 1-.094-.2V9.134c0-.219.102-.39.305-.516L6 8.57l4.031-2.086.047-.023a.26.26 0 0 1 .117-.024zm-.304-1.149c.125.047.187.117.187.211a.252.252 0 0 1-.047.14.265.265 0 0 1-.094.094l-.046.024L5.6 8.03l-.046.024a.672.672 0 0 1-.305.07.672.672 0 0 1-.305-.07l-.047-.024L.61 5.781C.484 5.703.422 5.61.422 5.5c0-.047.015-.086.047-.117a.367.367 0 0 1 .094-.07l.046-.024 4.243-1.922c.171-.078.304-.117.398-.117l.398.117L9.891 5.29zM4.57 8.617c.202.125.304.297.304.516v4.336a.255.255 0 0 1-.094.199.312.312 0 0 1-.21.082.36.36 0 0 1-.141-.047L.328 11.547v-.024C.11 11.383 0 11.211 0 11.008v-4.29c0-.077.031-.144.094-.198a.312.312 0 0 1 .21-.082c.063 0 .102.007.118.023l.047.023L4.477 8.57l.093.047z"
                                  id="a"
                                  transform="translate(0 -3)"
                                  fill="currentColor"
                                  fill-rule="evenodd"
                                ></path>
                              </svg>
                            );
                          },
                        },
                        {
                          key: 3,
                          name: "due_date",
                          label: "Due Date",
                          icon: (el) => {
                            return (
                              <svg
                                className={`text-[13px] icon hover:text-[#00a99b] ${
                                  filterBy === el.name &&
                                  "!bg-[#F2FFFE] text-[#00a99b]"
                                }`}
                                width="1em"
                                height="1em"
                                viewBox="0 0 11 11"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10.195 6.438c.078 0 .149.027.211.082a.255.255 0 0 1 .094.199v4.289c0 .203-.11.375-.328.515v.024L6.07 13.703v.024a.326.326 0 0 1-.14.023.312.312 0 0 1-.211-.082.255.255 0 0 1-.094-.2V9.134c0-.219.102-.39.305-.516L6 8.57l4.031-2.086.047-.023a.26.26 0 0 1 .117-.024zm-.304-1.149c.125.047.187.117.187.211a.252.252 0 0 1-.047.14.265.265 0 0 1-.094.094l-.046.024L5.6 8.03l-.046.024a.672.672 0 0 1-.305.07.672.672 0 0 1-.305-.07l-.047-.024L.61 5.781C.484 5.703.422 5.61.422 5.5c0-.047.015-.086.047-.117a.367.367 0 0 1 .094-.07l.046-.024 4.243-1.922c.171-.078.304-.117.398-.117l.398.117L9.891 5.29zM4.57 8.617c.202.125.304.297.304.516v4.336a.255.255 0 0 1-.094.199.312.312 0 0 1-.21.082.36.36 0 0 1-.141-.047L.328 11.547v-.024C.11 11.383 0 11.211 0 11.008v-4.29c0-.077.031-.144.094-.198a.312.312 0 0 1 .21-.082c.063 0 .102.007.118.023l.047.023L4.477 8.57l.093.047z"
                                  id="a"
                                  transform="translate(0 -3)"
                                  fill="currentColor"
                                  fill-rule="evenodd"
                                ></path>
                              </svg>
                            );
                          },
                        },
                        {
                          key: 4,
                          name: "tag",
                          label: "Tags",
                          icon: (el) => {
                            return (
                              <svg
                                className={`text-[13px] icon hover:text-[#00a99b] ${
                                  filterBy === el.name &&
                                  "!bg-[#F2FFFE] text-[#00a99b]"
                                }`}
                                width="1em"
                                height="1em"
                                viewBox="0 0 11 11"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10.195 6.438c.078 0 .149.027.211.082a.255.255 0 0 1 .094.199v4.289c0 .203-.11.375-.328.515v.024L6.07 13.703v.024a.326.326 0 0 1-.14.023.312.312 0 0 1-.211-.082.255.255 0 0 1-.094-.2V9.134c0-.219.102-.39.305-.516L6 8.57l4.031-2.086.047-.023a.26.26 0 0 1 .117-.024zm-.304-1.149c.125.047.187.117.187.211a.252.252 0 0 1-.047.14.265.265 0 0 1-.094.094l-.046.024L5.6 8.03l-.046.024a.672.672 0 0 1-.305.07.672.672 0 0 1-.305-.07l-.047-.024L.61 5.781C.484 5.703.422 5.61.422 5.5c0-.047.015-.086.047-.117a.367.367 0 0 1 .094-.07l.046-.024 4.243-1.922c.171-.078.304-.117.398-.117l.398.117L9.891 5.29zM4.57 8.617c.202.125.304.297.304.516v4.336a.255.255 0 0 1-.094.199.312.312 0 0 1-.21.082.36.36 0 0 1-.141-.047L.328 11.547v-.024C.11 11.383 0 11.211 0 11.008v-4.29c0-.077.031-.144.094-.198a.312.312 0 0 1 .21-.082c.063 0 .102.007.118.023l.047.023L4.477 8.57l.093.047z"
                                  id="a"
                                  transform="translate(0 -3)"
                                  fill="currentColor"
                                  fill-rule="evenodd"
                                ></path>
                              </svg>
                            );
                          },
                        },
                      ]}
                    />
                  </div>
                </div>
                {/*End Group By  */}
                {/* views drop down  */}
                <div className="flex flex-1 items-center justify-end">
                  <div
                    className="filter-box bg-white rounded-md items-center flex min-[34px]
                  p-[6px_16px] border border-solid border-[e5e9f1] min-h-[40px] cursor-pointer ml-5 hover:text-[#00a99b]"
                  >
                    <button className="flex" onClick={handleViewsMenuClick}>
                      <span className="icon relative text-sm top-1 mr-2">
                        <svg
                          className="icon "
                          width="1em"
                          height="1em"
                          viewBox="0 0 18.453 18.453"
                          version="1.1"
                        >
                          <path
                            fill="currentColor"
                            d="M2.711 4.058h8.23v1.334h-8.23zM14.972 14.088a2.915 2.915 0 0 0-.475-3.49 2.89 2.89 0 0 0-2.058-.852c-.779 0-1.51.303-2.059.852s-.852 1.279-.852 2.059a2.9 2.9 0 0 0 .852 2.059c.549.547 1.279.85 2.057.85a2.91 2.91 0 0 0 1.434-.375l3.262 3.262 1.101-1.102-3.262-3.263zm-1.308-.207c-.652.652-1.796.652-2.448 0a1.734 1.734 0 0 1 0-2.449c.326-.326.762-.506 1.225-.506s.897.18 1.224.506.507.762.507 1.225-.181.897-.508 1.224z"
                          ></path>
                          <path
                            fill="currentColor"
                            d="M13.332 16.3H1.857a.329.329 0 0 1-.329-.328V1.638c0-.182.147-.329.329-.329h11.475c.182 0 .328.147.328.329V8.95a3.43 3.43 0 0 1 1.31.597V1.638A1.64 1.64 0 0 0 13.332 0H1.857A1.64 1.64 0 0 0 .219 1.638v14.334a1.64 1.64 0 0 0 1.638 1.637h11.475c.685 0 1.009-.162 1.253-.76l-.594-.594c-.219.092-.565.045-.659.045z"
                          ></path>
                          <path
                            fill="currentColor"
                            d="M2.711 7.818h8.23v1.334h-8.23z"
                          />
                        </svg>
                      </span>
                      Views
                      <span className="arrow font-bold text-sm ml-2 relative top-1 ">
                        <svg
                          className="text-[12px] inline-flex "
                          width="1.0277777777777777em"
                          height="0.6111111111111112em"
                          viewBox="0 0 37 22"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g
                            id="Style-guide"
                            stroke="none"
                            strokeWidth={1}
                            fill="none"
                            fillRule="evenodd"
                          >
                            <g
                              id="nifty-UI-guide"
                              transform="translate(-617.000000, -2934.000000)"
                              fill="currentColor"
                              fillRule="nonzero"
                            >
                              <g
                                id="Group-6-Copy-3"
                                transform="translate(574.000000, 2884.000000)"
                              >
                                <path
                                  d="M70.5909903,46.8409903 C71.4696699,45.9623106 71.4696699,44.5376894 70.5909903,43.6590097 C69.7123106,42.7803301 68.2876894,42.7803301 67.4090097,43.6590097 L51.6590097,59.4090097 C50.7803301,60.2876894 50.7803301,61.7123106 51.6590097,62.5909903 L67.4090097,78.3409903 C68.2876894,79.2196699 69.7123106,79.2196699 70.5909903,78.3409903 C71.4696699,77.4623106 71.4696699,76.0376894 70.5909903,75.1590097 L56.4319805,61 L70.5909903,46.8409903 Z"
                                  id="Path-82"
                                  transform="translate(61.125000, 61.000000) rotate(-90.000000) translate(-61.125000, -61.000000) "
                                ></path>
                              </g>
                            </g>
                          </g>
                        </svg>
                      </span>
                      <Menu
                        id={"views-menu"}
                        anchorEl={viewsAchorEl}
                        open={Boolean(viewsAchorEl)}
                        onClose={handleViewsClose}
                      >
                        <MenuItem
                          onClick={() => {
                            handleMenuItemCick("save");
                          }}
                        >
                          {addNewView ? (
                            <div className="flex flex-col">
                              <input
                                value={newView}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  setNewView(e.target.value);
                                }}
                                type="text"
                                placeholder="give it a name"
                                className="text-[14px]  "
                                style={{
                                  border: "1px solid #80808061",
                                  borderRadius: "4px",
                                  padding: "8px",
                                }}
                              />
                              <div className="flex w-[100%] ">
                                <button
                                  className="bg-[#00a99b]  text-[13px]"
                                  style={{
                                    width: "50%",
                                    padding: "4px",
                                    borderRadius: "6px",
                                    color: "white",
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSaveView();
                                  }}
                                >
                                  Save
                                </button>
                                <button
                                  className=" text-[13px]"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSaveViewCancel();
                                  }}
                                  style={{
                                    width: "50%",
                                    padding: "4px",
                                    border: "1px solid #80808061",

                                    borderRadius: "6px",
                                    color: "black",
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-[10px] hover:text-[#009084]">
                              <svg
                                className="icon text-[12px]"
                                width="1em"
                                height="1em"
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
                              <p className="text-[12px]">Save view</p>
                            </div>
                          )}
                        </MenuItem>
                        <MenuItem onClick={() => handleMenuItemCick("")}>
                          <div className="flex items-center gap-[10px] ">
                            <svg
                              class="icon "
                              width="1em"
                              height="1em"
                              viewBox="0 0 36 36"
                              version="1.1"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g
                                id="Style-guide"
                                stroke="none"
                                stroke-width="1"
                                fill="none"
                                fill-rule="evenodd"
                              >
                                <g
                                  id="nifty-UI-guide"
                                  transform="translate(-202.000000, -3111.000000)"
                                  fill="currentColor"
                                >
                                  <g
                                    id="Group-6"
                                    transform="translate(159.000000, 3068.000000)"
                                  >
                                    <path
                                      d="M62.8,67.3 L63.7003465,67.3 C64.6942677,67.3 65.5,68.0989567 65.5,69.1 C65.5,70.0941125 64.70131,70.9 63.7003465,70.9 L58.2996535,70.9 C57.3057323,70.9 56.5,70.1010433 56.5,69.1 C56.5,68.1058875 57.29869,67.3 58.2996535,67.3 L59.2,67.3 L59.2,61.9 L58.3053271,61.9 C57.3082725,61.9 56.5,61.1010433 56.5,60.1 C56.5,59.1058875 57.2978994,58.3 58.3053271,58.3 L60.9946729,58.3 C61.4961808,58.3 61.945471,58.5011282 62.2710699,58.8266925 C62.5986504,59.1510801 62.8,59.600369 62.8,60.1 L62.8,67.3 Z M61,79 C51.0588745,79 43,70.9411255 43,61 C43,51.0588745 51.0588745,43 61,43 C70.9411255,43 79,51.0588745 79,61 C79,70.9411255 70.9411255,79 61,79 Z M61,75.4 C68.9529004,75.4 75.4,68.9529004 75.4,61 C75.4,53.0470996 68.9529004,46.6 61,46.6 C53.0470996,46.6 46.6,53.0470996 46.6,61 C46.6,68.9529004 53.0470996,75.4 61,75.4 Z M61,56.5 C59.5088312,56.5 58.3,55.2911688 58.3,53.8 C58.3,52.3088312 59.5088312,51.1 61,51.1 C62.4911688,51.1 63.7,52.3088312 63.7,53.8 C63.7,55.2911688 62.4911688,56.5 61,56.5 Z"
                                      id="Combined-Shape"
                                    ></path>
                                  </g>
                                </g>
                              </g>
                            </svg>

                            <p className="text-[10px] color-grey ">
                              Auto save is enabled
                            </p>
                          </div>
                        </MenuItem>
                      </Menu>
                    </button>
                  </div>
                </div>
                {/* end views drop down */}
              </div>
              <Dropdowns
                id="filter-menu"
                anchor={filterAnchorEl}
                activeMenu={filterBy}
                handleClose={handleMenuClose}
                handleMenuClick={handleFilterMenuItemClick}
                options={[
                  {
                    key: 1,
                    name: "project",
                    label: "Project",
                    icon: (el) => {
                      return (
                        <svg
                          className={`text-[13px] icon hover:text-[#00a99b] ${
                            filterBy === el.name &&
                            "!bg-[#F2FFFE] text-[#00a99b]"
                          }`}
                          width="1em"
                          height="1em"
                          viewBox="0 0 11 11"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.195 6.438c.078 0 .149.027.211.082a.255.255 0 0 1 .094.199v4.289c0 .203-.11.375-.328.515v.024L6.07 13.703v.024a.326.326 0 0 1-.14.023.312.312 0 0 1-.211-.082.255.255 0 0 1-.094-.2V9.134c0-.219.102-.39.305-.516L6 8.57l4.031-2.086.047-.023a.26.26 0 0 1 .117-.024zm-.304-1.149c.125.047.187.117.187.211a.252.252 0 0 1-.047.14.265.265 0 0 1-.094.094l-.046.024L5.6 8.03l-.046.024a.672.672 0 0 1-.305.07.672.672 0 0 1-.305-.07l-.047-.024L.61 5.781C.484 5.703.422 5.61.422 5.5c0-.047.015-.086.047-.117a.367.367 0 0 1 .094-.07l.046-.024 4.243-1.922c.171-.078.304-.117.398-.117l.398.117L9.891 5.29zM4.57 8.617c.202.125.304.297.304.516v4.336a.255.255 0 0 1-.094.199.312.312 0 0 1-.21.082.36.36 0 0 1-.141-.047L.328 11.547v-.024C.11 11.383 0 11.211 0 11.008v-4.29c0-.077.031-.144.094-.198a.312.312 0 0 1 .21-.082c.063 0 .102.007.118.023l.047.023L4.477 8.57l.093.047z"
                            id="a"
                            transform="translate(0 -3)"
                            fill="currentColor"
                            fill-rule="evenodd"
                          ></path>
                        </svg>
                      );
                    },
                  },
                  {
                    key: 2,
                    name: "due_date",
                    label: "Due Date",

                    icon: (el) => {
                      return (
                        <svg
                          className={` text-[13px] icon hover:text-[#00a99b] ${
                            filterBy === el.name &&
                            "!bg-[#F2FFFE] text-[#00a99b]"
                          }`}
                          width="1em"
                          height="1em"
                          viewBox="0 0 14 15"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12.6 3.5c0-.387-.312-.7-.697-.7a.703.703 0 0 1-.703.7c-.387 0-.7-.31-.7-.7H9.1c0 .387-.31.7-.7.7-.387 0-.7-.31-.7-.7H6.3c0 .387-.31.7-.7.7-.387 0-.7-.31-.7-.7H3.5c0 .387-.31.7-.7.7-.387 0-.7-.31-.7-.7-.388 0-.7.313-.7.7v1.4h11.2V3.5zM1.4 6.3v6.3c0 .387.312.7.697.7h9.806a.698.698 0 0 0 .697-.7V6.3H1.4zM14 3.5v9.1c0 1.16-.938 2.1-2.097 2.1H2.097A2.099 2.099 0 0 1 0 12.6V3.5c0-1.16.938-2.1 2.097-2.1L2.1.7c0-.387.31-.7.7-.7.387 0 .7.31.7.7v.7h1.4V.7c0-.387.31-.7.7-.7.387 0 .7.31.7.7v.7h1.4V.7c0-.387.31-.7.7-.7.387 0 .7.31.7.7v.7h1.4V.7c0-.387.31-.7.7-.7.387 0 .7.31.7.7v.7A2.1 2.1 0 0 1 14 3.5z"
                            fill="currentColor"
                            fill-rule="evenodd"
                          ></path>
                        </svg>
                      );
                    },
                  },
                  {
                    key: 3,
                    name: "tags",
                    label: "Tags",

                    icon: (el) => {
                      return (
                        <svg
                          className={` text-[13px] icon hover:text-[#00a99b] ${
                            filterBy === el.name &&
                            "!bg-[#F2FFFE] text-[#00a99b]"
                          }`}
                          width="1em"
                          height="0.7857142857142857em"
                          viewBox="0 0 14 11"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M2.606 9.4L.272 5.974c-.363-.509-.363-1.272 0-1.78L2.606.787C2.93.333 3.574 0 4.129 0h8.6C13.431 0 14 .571 14 1.27v7.646c0 .701-.57 1.27-1.27 1.27h-8.6c-.557 0-1.2-.332-1.524-.786zM1.3 4.957c-.047.065-.047.234 0 .3L3.642 8.66c.086.12.343.253.487.253h8.598v-7.64H4.129c-.143 0-.402.134-.487.254L1.3 4.957zm1.877.136a1.91 1.91 0 1 1 3.82 0 1.91 1.91 0 0 1-3.82 0zm2.547 0a.637.637 0 1 0-1.274 0 .637.637 0 0 0 1.274 0z"
                            fill="currentColor"
                            fill-rule="evenodd"
                          ></path>
                        </svg>
                      );
                    },
                  },
                ]}
              />

              {/* filter End  */}
            </div>
          </div>
          {selectedView === "report" ? (
            <>
              {selectedProjects.length ? (
                <ReportsView selectedProjects={selectedProjects} />
              ) : (
                <p>Please select project first</p>
              )}
            </>
          ) : (
            <>
              {/* end header part  */}
              <div class="overflow-x-auto customHeight">
                <div class="min-w-[1500px] collapsible-container">
                  {milestones?.filter((el) => el.tasks.length).length ? (
                    milestones
                      ?.filter((el) => el.tasks.length)
                      ?.map((el, milestoneIndex) => {
                        return (
                          <>
                            <div className=" tasks-view-section   w-full flex min-h-[1] collapsible-header">
                              {/* overdue  */}
                              <div className="flex items-center bg-[#f0f2f2] p-[12px] hover:text-[#00a99b] cursor-pointer">
                                <svg
                                  class="icon "
                                  width="1em"
                                  height="0.8125em"
                                  viewBox="0 0 16 13"
                                  version="1.1"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M12.564 3.125l-1.72-1.72a.75.75 0 0 1 1.061-1.06l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 0 1-1.06-1.06l1.72-1.72H5.37a2.999 2.999 0 0 0-2.996 3v3.747a.75.75 0 1 1-1.5 0V7.625c0-2.485 2.013-4.5 4.496-4.5h7.193z"
                                    fill="currentColor"
                                    fill-rule="evenodd"
                                  ></path>
                                </svg>
                              </div>
                              <div
                                className="overdue-btn w-[400px] flex"
                                onClick={(e) => handleToggle(el.id)}
                              >
                                <div
                                  className="filter-box bg-white rounded-md items-center flex min-[34px]
                        p-[6px_16px] border border-solid border-[e5e9f1] h-[42px] cursor-pointer hover:text-[#00a99b]"
                                >
                                  <button className="flex">
                                    {el.name}
                                    <span className="label-bubble bg-[#e7e7e7] rounded-full w-[20px] h-[20px] mx-2 mt-[2px] text-center font-medium text-black text-sm inline-block">
                                      {el.count}
                                    </span>
                                    <span className="arrow font-bold text-[12px] ml-2 relative top-2 ">
                                      {openCollapsibles.includes(el.id) ? (
                                        <svg
                                          class="icon "
                                          width="1.0277777777777777em"
                                          height="0.6111111111111112em"
                                          viewBox="0 0 37 22"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <g
                                            id="Style-guide"
                                            stroke="none"
                                            stroke-width="1"
                                            fill="none"
                                            fill-rule="evenodd"
                                          >
                                            <g
                                              id="nifty-UI-guide"
                                              transform="translate(-617.000000, -2934.000000)"
                                              fill="currentColor"
                                              fill-rule="nonzero"
                                            >
                                              <g
                                                id="Group-6-Copy-3"
                                                transform="translate(574.000000, 2884.000000)"
                                              >
                                                <path
                                                  d="M70.5909903,46.8409903 C71.4696699,45.9623106 71.4696699,44.5376894 70.5909903,43.6590097 C69.7123106,42.7803301 68.2876894,42.7803301 67.4090097,43.6590097 L51.6590097,59.4090097 C50.7803301,60.2876894 50.7803301,61.7123106 51.6590097,62.5909903 L67.4090097,78.3409903 C68.2876894,79.2196699 69.7123106,79.2196699 70.5909903,78.3409903 C71.4696699,77.4623106 71.4696699,76.0376894 70.5909903,75.1590097 L56.4319805,61 L70.5909903,46.8409903 Z"
                                                  id="Path-82"
                                                  transform="translate(61.125000, 61.000000) rotate(-90.000000) translate(-61.125000, -61.000000) "
                                                ></path>
                                              </g>
                                            </g>
                                          </g>
                                        </svg>
                                      ) : (
                                        <svg
                                          onClick={(e) => handleToggle(el.id)}
                                          className="icon "
                                          width="0.5454545454545454em"
                                          height="1em"
                                          viewBox="0 0 6 11"
                                          version="1.1"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <g
                                            id="Overview"
                                            stroke="none"
                                            strokeWidth={1}
                                            fill="none"
                                            fillRule="evenodd"
                                          >
                                            <g
                                              id="Team-overview---profile---2"
                                              transform="translate(-1194.000000, -457.000000)"
                                              fill="currentColor"
                                            >
                                              <g
                                                id="Rectangle-4"
                                                transform="translate(232.000000, 30.000000)"
                                              >
                                                <g
                                                  id="Group-41"
                                                  transform="translate(35.000000, 278.000000)"
                                                >
                                                  <g
                                                    id="Group-40"
                                                    transform="translate(0.000000, 72.000000)"
                                                  >
                                                    <g
                                                      id="Group-36-Copy-2"
                                                      transform="translate(900.000000, 22.000000)"
                                                    >
                                                      <path
                                                        d="M32.8047379,56.1380712 C33.0650874,55.8777217 33.0650874,55.4556117 32.8047379,55.1952621 C32.5443883,54.9349126 32.1222783,54.9349126 31.8619288,55.1952621 L27.1952621,59.8619288 C26.9349126,60.1222783 26.9349126,60.5443883 27.1952621,60.8047379 L31.8619288,65.4714045 C32.1222783,65.731754 32.5443883,65.731754 32.8047379,65.4714045 C33.0650874,65.211055 33.0650874,64.788945 32.8047379,64.5285955 L28.6094757,60.3333333 L32.8047379,56.1380712 Z"
                                                        id="Path-82"
                                                        transform="translate(30.000000, 60.333333) scale(-1, 1) translate(-30.000000, -60.333333) "
                                                      ></path>
                                                    </g>
                                                  </g>
                                                </g>
                                              </g>
                                            </g>
                                          </g>
                                        </svg>
                                      )}
                                    </span>
                                  </button>
                                </div>
                              </div>
                              {/* // status */}
                              <div className="status_filter w-[11%] cursor-pointer relative flex p-[10px_13px] h-[42px]  ">
                                <div className="table-cell-title flex hover:text-[#00a99b]">
                                  <span className="icon text-xs relative top-[5px] mr-1">
                                    <svg
                                      className="icon "
                                      width="1em"
                                      height="1em"
                                      viewBox="0 0 36 36"
                                      version="1.1"
                                    >
                                      <g
                                        id="Style-guide"
                                        stroke="none"
                                        strokeWidth={1}
                                        fill="none"
                                        fillRule="evenodd"
                                      >
                                        <g
                                          id="nifty-UI-guide"
                                          transform="translate(-756.000000, -3291.000000)"
                                          fill="currentColor"
                                        >
                                          <g
                                            id="Group-6"
                                            transform="translate(713.000000, 3248.000000)"
                                          >
                                            <path
                                              d="M61,79 C51.0588745,79 43,70.9411255 43,61 C43,51.0588745 51.0588745,43 61,43 C70.9411255,43 79,51.0588745 79,61 C79,70.9411255 70.9411255,79 61,79 Z M61,75.4 C68.9529004,75.4 75.4,68.9529004 75.4,61 C75.4,53.0470996 68.9529004,46.6 61,46.6 C53.0470996,46.6 46.6,53.0470996 46.6,61 C46.6,68.9529004 53.0470996,75.4 61,75.4 Z M57.0272078,67.6727922 L51.6272078,62.2727922 C50.9242641,61.5698485 50.9242641,60.4301515 51.6272078,59.7272078 C52.3301515,59.0242641 53.4698485,59.0242641 54.1727922,59.7272078 L58.3,63.8797652 L66.9272078,55.2272078 C67.6301515,54.5242641 68.7698485,54.5242641 69.4727922,55.2272078 C70.1757359,55.9301515 70.1757359,57.0698485 69.4727922,57.7727922 L59.5727922,67.6727922 C58.8698485,68.3757359 57.7301515,68.3757359 57.0272078,67.6727922 Z"
                                              id="Combined-Shape"
                                            />
                                          </g>
                                        </g>
                                      </g>
                                    </svg>
                                  </span>
                                  Status
                                </div>
                              </div>
                              {/* // list */}
                              <div className="status_filter w-[11%] cursor-pointer relative flex p-[10px_13px]  h-[42px]">
                                <div className="table-cell-title flex hover:text-[#00a99b]">
                                  <span className="icon text-xs relative top-[5px] mr-1">
                                    <svg
                                      className="icon "
                                      width="1.1818181818181819em"
                                      height="1em"
                                      viewBox="0 0 13 10"
                                      version="1.1"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        fill="currentColor"
                                        d="M3.365.385h8.76v1.23h-8.76V.385Zm0 4.98v-1.23h8.76v1.23h-8.76Zm0 3.75v-1.23h8.76v1.23h-8.76ZM1.49 7.555c.26 0 .482.095.667.285.186.19.278.41.278.66 0 .25-.095.467-.285.652a.918.918 0 0 1-1.312 0A.893.893 0 0 1 .56 8.5c0-.25.09-.47.27-.66.18-.19.4-.285.66-.285Zm0-7.5a.91.91 0 0 1 .667.277.91.91 0 0 1 .278.668c0 .26-.092.48-.278.66a.923.923 0 0 1-.667.27c-.26 0-.48-.09-.66-.27A.898.898 0 0 1 .56 1C.56.74.65.518.83.332c.18-.185.4-.277.66-.277Zm0 3.75a.91.91 0 0 1 .667.277.91.91 0 0 1 .278.668c0 .26-.092.48-.278.66a.923.923 0 0 1-.667.27c-.26 0-.48-.09-.66-.27a.898.898 0 0 1-.27-.66c0-.26.09-.482.27-.668.18-.185.4-.277.66-.277Z"
                                      ></path>
                                    </svg>
                                  </span>
                                  List
                                </div>
                              </div>
                              {/* // list */}
                              <div className="status_filter w-[11%] cursor-pointer relative flex p-[10px_13px]  h-[42px]">
                                <div className="table-cell-title flex hover:text-[#00a99b]">
                                  <span className="icon text-xs relative top-[5px] mr-1">
                                    <svg
                                      className="icon "
                                      width="1em"
                                      height="1em"
                                      viewBox="0 0 36 36"
                                      version="1.1"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <g
                                        id="Style-guide"
                                        stroke="none"
                                        strokeWidth={1}
                                        fill="none"
                                        fillRule="evenodd"
                                      >
                                        <g
                                          id="nifty-UI-guide"
                                          transform="translate(-1171.000000, -2927.000000)"
                                          fill="currentColor"
                                        >
                                          <g
                                            id="Group-6-Copy-3"
                                            transform="translate(1128.000000, 2884.000000)"
                                          >
                                            <path
                                              d="M65.49997,43 C69.476427,43 72.6999822,46.1727902 72.6999822,50.0866253 C72.6999822,51.5761977 72.4297604,53.642761 71.8009222,55.6313551 C73.9766823,56.4246922 75.6668122,57.7057373 76.8830704,59.403688 C78.4059765,61.5297326 79,63.9987634 79,66.3971122 C79,67.0522123 78.6440018,67.6555749 78.0705406,67.9724039 C77.369174,68.3598988 76.1543392,68.9106593 74.5252747,69.4541849 C73.3283766,69.8535213 72.091113,70.1821571 70.8220555,70.4243426 C71.4644882,71.8328143 71.7999831,73.2659042 71.7999831,74.4961126 C71.7999831,75.1910678 71.3998245,75.8239261 70.7719469,76.1219714 C69.9803019,76.4977548 68.611019,77.03852 66.7989999,77.5741357 C63.7853751,78.4649345 60.6089324,79.0000611 57.3999915,79.0000611 C54.1910507,79.0000611 51.014608,78.4649345 48.0009832,77.5741357 C46.188964,77.03852 44.8196812,76.4977548 44.0280362,76.1219714 C43.4001586,75.8239261 43,75.1910678 43,74.4961126 C43,72.3132459 44.0351437,69.5235096 45.9584843,67.3436856 C47.1634459,65.9780388 48.6575593,64.8863858 50.433867,64.1153524 C49.6388918,61.7285805 49.2999425,59.1957871 49.2999425,57.3982229 C49.2999425,52.9252685 52.9264422,49.2992225 57.3999563,49.2992225 C57.7172546,49.2992225 58.0302917,49.3174645 58.3380758,49.3529567 C58.7110515,45.7838509 61.7752075,43 65.49997,43 Z M64.364346,64.1204527 C66.0389176,64.8499616 67.4631508,65.8652287 68.6312367,67.1266818 C70.2691805,66.9237922 71.8640533,66.5474174 73.3857735,66.0397064 C74.1035121,65.8002381 74.7579413,65.5465896 75.3398063,65.2924548 C75.1907761,63.944879 74.7574404,62.6180545 73.9563048,61.4996335 C73.1267613,60.3415538 71.9390737,59.4583799 70.3077108,58.9159333 C69.1834666,60.6572256 67.6141585,61.8976676 65.49997,61.8976676 C65.3225347,61.8976676 65.1489372,61.8889304 64.9791187,61.8718934 C64.8161751,62.6178601 64.612434,63.3762857 64.364346,64.1204527 Z M65.49997,58.2981119 C67.1992611,58.2981119 69.0999761,54.1660078 69.0999761,50.0866253 C69.0999761,48.1735692 67.5007783,46.5995557 65.49997,46.5995557 C63.4991618,46.5995557 61.8999639,48.1735692 61.8999639,50.0866253 C61.8999639,50.2816607 61.9043086,50.4768167 61.9127681,50.6716358 C64.0763603,52.1256768 65.49997,54.5957197 65.49997,57.3982229 C65.49997,57.6810275 65.4915805,57.9820303 65.4743454,58.2977995 C65.4828919,58.2980076 65.4914335,58.2981119 65.49997,58.2981119 Z M48.6580735,69.7250388 C47.6700131,70.8448601 47.0187962,72.1965318 46.7458408,73.3559963 C47.4292736,73.6169436 48.1919631,73.8770333 49.0215802,74.1222602 C51.7256852,74.921568 54.568596,75.4005054 57.3999915,75.4005054 C60.2313871,75.4005054 63.0742979,74.921568 65.7784029,74.1222602 C66.6068907,73.8773671 67.3686329,73.6176516 68.0513509,73.3570619 C67.776366,72.2068059 67.1249807,70.8578225 66.1404515,69.7392439 C65.2743728,68.7552433 64.1907258,67.9604074 62.8689046,67.393039 C61.6001483,69.4332467 59.8164196,70.8965569 57.3999563,70.8965569 C54.9816989,70.8965569 53.197116,69.4310731 51.9281829,67.388494 C50.6059719,67.9534514 49.522797,68.7450018 48.6580735,69.7250388 Z M57.3999563,67.2970012 C59.6397524,67.2970012 61.8999639,62.3053671 61.8999639,57.3982229 C61.8999639,54.9132482 59.8852419,52.8987783 57.3999563,52.8987783 C54.9146707,52.8987783 52.8999486,54.9132482 52.8999486,57.3982229 C52.8999486,62.3053671 55.1601601,67.2970012 57.3999563,67.2970012 Z"
                                              id="Combined-Shape"
                                            />
                                          </g>
                                        </g>
                                      </g>
                                    </svg>
                                  </span>
                                  Assignees
                                </div>
                              </div>
                              {/* // Assignees */}
                              <div className="status_filter w-[11%] cursor-pointer relative flex p-[10px_13px]  h-[42px]">
                                <div className="table-cell-title flex hover:text-[#00a99b]">
                                  <span className="icon text-xs relative top-[6px] mr-1">
                                    <svg
                                      className="icon "
                                      width="1em"
                                      height="1em"
                                      viewBox="0 0 14 15"
                                      version="1.1"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M12.6 3.5c0-.387-.312-.7-.697-.7a.703.703 0 0 1-.703.7c-.387 0-.7-.31-.7-.7H9.1c0 .387-.31.7-.7.7-.387 0-.7-.31-.7-.7H6.3c0 .387-.31.7-.7.7-.387 0-.7-.31-.7-.7H3.5c0 .387-.31.7-.7.7-.387 0-.7-.31-.7-.7-.388 0-.7.313-.7.7v1.4h11.2V3.5zM1.4 6.3v6.3c0 .387.312.7.697.7h9.806a.698.698 0 0 0 .697-.7V6.3H1.4zM14 3.5v9.1c0 1.16-.938 2.1-2.097 2.1H2.097A2.099 2.099 0 0 1 0 12.6V3.5c0-1.16.938-2.1 2.097-2.1L2.1.7c0-.387.31-.7.7-.7.387 0 .7.31.7.7v.7h1.4V.7c0-.387.31-.7.7-.7.387 0 .7.31.7.7v.7h1.4V.7c0-.387.31-.7.7-.7.387 0 .7.31.7.7v.7h1.4V.7c0-.387.31-.7.7-.7.387 0 .7.31.7.7v.7A2.1 2.1 0 0 1 14 3.5z"
                                        fill="currentColor"
                                        fillRule="evenodd"
                                      />
                                    </svg>
                                  </span>
                                  Due Date
                                </div>
                              </div>
                              {/* // Tags */}
                              <div className="status_filter w-[11%] cursor-pointer relative flex p-[10px_13px]  h-[42px]">
                                <div className="table-cell-title flex hover:text-[#00a99b]">
                                  <span className="icon text-xs relative top-[7px] mr-1">
                                    <svg
                                      className="icon "
                                      width="1em"
                                      height="0.7857142857142857em"
                                      viewBox="0 0 14 11"
                                      version="1.1"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M2.606 9.4L.272 5.974c-.363-.509-.363-1.272 0-1.78L2.606.787C2.93.333 3.574 0 4.129 0h8.6C13.431 0 14 .571 14 1.27v7.646c0 .701-.57 1.27-1.27 1.27h-8.6c-.557 0-1.2-.332-1.524-.786zM1.3 4.957c-.047.065-.047.234 0 .3L3.642 8.66c.086.12.343.253.487.253h8.598v-7.64H4.129c-.143 0-.402.134-.487.254L1.3 4.957zm1.877.136a1.91 1.91 0 1 1 3.82 0 1.91 1.91 0 0 1-3.82 0zm2.547 0a.637.637 0 1 0-1.274 0 .637.637 0 0 0 1.274 0z"
                                        fill="currentColor"
                                        fillRule="evenodd"
                                      />
                                    </svg>
                                  </span>
                                  Tags
                                </div>
                              </div>

                              {/* // Plus icon Add more */}
                              <div className="status_filter w-[150px] relative flex justify-end flex-auto p-[10px_13px] pr-0  h-[42px]">
                                <div
                                  className="filter-box bg-white rounded-md items-center flex
                      p-[4px_6px] border border-solid border-[e5e9f1]  h-[28px] cursor-pointer hover:text-[#00a99b]"
                                >
                                  <button
                                    className="flex items-center"
                                    onClick={() => setIsEditColumn(true)}
                                  >
                                    <span className="arrow font-bold text-[12px] ">
                                      <svg
                                        className="icon "
                                        width="1em"
                                        height="1em"
                                        viewBox="0 0 12 12"
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                          d="M6.66667 0.666569C6.66667 0.296631 6.36819 0 6 0C5.62924 0 5.33333 0.298433 5.33333 0.666569V5.33333H0.666569C0.296631 5.33333 0 5.63181 0 6C0 6.37076 0.298433 6.66667 0.666569 6.66667H5.33333V11.3334C5.33333 11.7034 5.63181 12 6 12C6.37076 12 6.66667 11.7016 6.66667 11.3334V6.66667H11.3334C11.7034 6.66667 12 6.36819 12 6C12 5.62924 11.7016 5.33333 11.3334 5.33333H6.66667V0.666569Z"
                                          fill="currentColor"
                                        />
                                      </svg>
                                    </span>
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className=" mb-[20px] bg-white overdue_open_section relative border border-solid border-[#e5e9f1]">
                              {el.tasks.length ? (
                                el.tasks.map((elem) => {
                                  return (
                                    openCollapsibles.includes(el.id) && (
                                      <div className="row-tasks border border-solid border-b border-b-[#e5e9f1] border-l-0 border-r-0 border-t-0">
                                        <div className="flex">
                                          <div className="flex items-center p-[8px_12px] pr-3 w-[400px] border border-solid border-r border-r-[#e5e9f1] border-l-0 border-b-0 border-t-0">
                                            <input
                                              defaultChecked=""
                                              id="checked-checkbox"
                                              type="checkbox"
                                              defaultValue=""
                                              className="accent-[#ececec] w-4 h-4"
                                            />
                                            <div className="flex justify-between w-full ml-3 ">
                                              <div className="flex flex-col">
                                                <div className="flex">
                                                  <h3 className="font-medium text-sm">
                                                    {elem.name}
                                                  </h3>
                                                  <div className="task-actions-holder ml-2 relative top-1 inline-block group duration-300">
                                                    <span className="task-actions-trigger text-sm cursor-pointer">
                                                      <svg
                                                        className="icon "
                                                        width="1em"
                                                        height="1em"
                                                        viewBox="0 0 60 60"
                                                        version="1.1"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                      >
                                                        <path
                                                          d="M8 22c-4.411 0-8 3.589-8 8s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8zM52 22c-4.411 0-8 3.589-8 8s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8zM30 22c-4.411 0-8 3.589-8 8s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8z"
                                                          fill="currentColor"
                                                        />
                                                      </svg>
                                                    </span>
                                                    <span className="absolute hidden group-hover:flex -left-[30px] -top-3 w-[90px] -translate-y-full px-2 py-1 bg-gray-700 rounded-lg text-center text-white text-[12px] after:content-[''] after:absolute after:left-[45%] after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                                                      More Options
                                                    </span>
                                                  </div>
                                                  <div className="meta-item-eye ml-5  relative top-[5px] inline-block group duration-300">
                                                    <span className="meta-icon meta-icon-single text-sm cursor-pointer">
                                                      <svg
                                                        className="icon "
                                                        width="1em"
                                                        height="0.6875em"
                                                        viewBox="0 0 16 11"
                                                        version="1.1"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                      >
                                                        <path
                                                          d="M15.903 4.928C14.397 1.988 11.415 0 8 0 4.585 0 1.602 1.99.097 4.928a.899.899 0 000 .81C1.603 8.679 4.585 10.668 8 10.668c3.415 0 6.398-1.99 7.903-4.928a.899.899 0 000-.811zM8 9.333a4 4 0 110-8 4 4 0 010 8zm0-6.666a2.648 2.648 0 00-.703.105A1.33 1.33 0 015.439 4.63 2.66 2.66 0 108 2.667z"
                                                          fill="currentColor"
                                                          fillRule="nonzero"
                                                        />
                                                      </svg>
                                                    </span>
                                                    <span className="absolute hidden group-hover:flex -left-[5rem] -top-3 -translate-y-full w-48 px-2 py-1 bg-gray-700 rounded-lg text-center text-white text-[12px] after:content-[''] after:absolute after:left-[45%] after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                                                      This task is hidden from
                                                      the Admins, members.
                                                    </span>
                                                  </div>
                                                </div>
                                                <div className="task-name-meta flex mt-2">
                                                  <a
                                                    className="task-project-name flex text-[12px] text-[#8e94bb]"
                                                    href="#"
                                                  >
                                                    <span className="relative top-[3px]">
                                                      <svg
                                                        className="icon"
                                                        width="1em"
                                                        height="1em"
                                                        viewBox="0 0 11 11"
                                                        version="1.1"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                      >
                                                        <path
                                                          d="M10.195 6.438c.078 0 .149.027.211.082a.255.255 0 0 1 .094.199v4.289c0 .203-.11.375-.328.515v.024L6.07 13.703v.024a.326.326 0 0 1-.14.023.312.312 0 0 1-.211-.082.255.255 0 0 1-.094-.2V9.134c0-.219.102-.39.305-.516L6 8.57l4.031-2.086.047-.023a.26.26 0 0 1 .117-.024zm-.304-1.149c.125.047.187.117.187.211a.252.252 0 0 1-.047.14.265.265 0 0 1-.094.094l-.046.024L5.6 8.03l-.046.024a.672.672 0 0 1-.305.07.672.672 0 0 1-.305-.07l-.047-.024L.61 5.781C.484 5.703.422 5.61.422 5.5c0-.047.015-.086.047-.117a.367.367 0 0 1 .094-.07l.046-.024 4.243-1.922c.171-.078.304-.117.398-.117l.398.117L9.891 5.29zM4.57 8.617c.202.125.304.297.304.516v4.336a.255.255 0 0 1-.094.199.312.312 0 0 1-.21.082.36.36 0 0 1-.141-.047L.328 11.547v-.024C.11 11.383 0 11.211 0 11.008v-4.29c0-.077.031-.144.094-.198a.312.312 0 0 1 .21-.082c.063 0 .102.007.118.023l.047.023L4.477 8.57l.093.047z"
                                                          id="a"
                                                          transform="translate(0 -3)"
                                                          fill="currentColor"
                                                          fillRule="evenodd"
                                                        />
                                                      </svg>
                                                    </span>
                                                    <span className="text ml-1">
                                                      {defaultSelectedProject
                                                        ? defaultSelectedProject.name
                                                        : "None"}
                                                    </span>
                                                  </a>
                                                </div>
                                              </div>
                                              <div className="flex">
                                                <div className="group cursor-pointer relative h-[24px] inline-block text-center mr-2 top-[-4px]">
                                                  <span className=" border border-solid border-[#e5e9f1] rounded text-[#8e94bb] text-[12px] h-[18px] p-[0px_4px] font-medium">
                                                    PRO-9
                                                  </span>
                                                  <div className="opacity-0 w-44 bg-gray-700 text-white text-center text-xs rounded-lg py-2 absolute z-10 group-hover:opacity-100 bottom-full left-[-66px] px-3 pointer-events-none">
                                                    Reference This Task in
                                                    discussions and messages.
                                                    <svg
                                                      className="absolute text-black h-2 w-full left-0 top-full"
                                                      x="0px"
                                                      y="0px"
                                                      viewBox="0 0 255 255"
                                                      xmlSpace="preserve"
                                                    >
                                                      <polygon
                                                        className="fill-current"
                                                        points="0,0 127.5,127.5 255,0"
                                                      />
                                                    </svg>
                                                  </div>
                                                </div>
                                                <input
                                                  id="c1"
                                                  type="checkbox"
                                                  className="appearance-none rounded-full mt-[3px] w-[14px] h-[14px] cursor-pointer bg-gray-100 ring-1 focus:ring-gray-600 outline-none focus:ring-2 checked:bg-gray-500"
                                                />
                                              </div>
                                            </div>
                                          </div>
                                          {/* Status  */}
                                          <div className="flex items-center w-[11%] relative p-[10px_13px] border border-t-0 border-b-0 border-l-0 border-r-[#e5e9f1]">
                                            <div className="cursor-pointer hover:text-[#00a99b]">
                                              <button
                                                className="flex"
                                                onClick={(e) => {
                                                  // handleStatusSelectClick(e);
                                                }}
                                              >
                                                {elem.statusName}
                                                <span className="arrow font-bold text-sm ml-2 relative top-1 ">
                                                  {/* <svg
                                                className="text-[12px] inline-flex "
                                                width="1.0277777777777777em"
                                                height="0.6111111111111112em"
                                                viewBox="0 0 37 22"
                                                version="1.1"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <g
                                                  id="Style-guide"
                                                  stroke="none"
                                                  strokeWidth={1}
                                                  fill="none"
                                                  fillRule="evenodd"
                                                >
                                                  <g
                                                    id="nifty-UI-guide"
                                                    transform="translate(-617.000000, -2934.000000)"
                                                    fill="currentColor"
                                                    fillRule="nonzero"
                                                  >
                                                    <g
                                                      id="Group-6-Copy-3"
                                                      transform="translate(574.000000, 2884.000000)"
                                                    >
                                                      <path
                                                        d="M70.5909903,46.8409903 C71.4696699,45.9623106 71.4696699,44.5376894 70.5909903,43.6590097 C69.7123106,42.7803301 68.2876894,42.7803301 67.4090097,43.6590097 L51.6590097,59.4090097 C50.7803301,60.2876894 50.7803301,61.7123106 51.6590097,62.5909903 L67.4090097,78.3409903 C68.2876894,79.2196699 69.7123106,79.2196699 70.5909903,78.3409903 C71.4696699,77.4623106 71.4696699,76.0376894 70.5909903,75.1590097 L56.4319805,61 L70.5909903,46.8409903 Z"
                                                        id="Path-82"
                                                        transform="translate(61.125000, 61.000000) rotate(-90.000000) translate(-61.125000, -61.000000) "
                                                      ></path>
                                                    </g>
                                                  </g>
                                                </g>
                                              </svg> */}
                                                </span>
                                              </button>

                                              <Popper
                                                open={Boolean(
                                                  statusSelectAnchorEl
                                                )}
                                                anchorEl={statusSelectAnchorEl}
                                                placement="bottom-start"
                                              >
                                                <Paper>
                                                  <div className="flex items-center  ">
                                                    <Select
                                                      options={
                                                        projectStatusOptions
                                                      }
                                                      value={selectedStatus}
                                                      onChange={
                                                        handleStatusClick
                                                      }
                                                      isSearchable
                                                      placeholder="Search..."
                                                      className="react-select"
                                                    />
                                                  </div>
                                                </Paper>
                                              </Popper>
                                            </div>
                                          </div>
                                          {/* list  */}
                                          <div className="flex items-center w-[11%] relative p-[10px_13px] border border-t-0 border-b-0 border-l-0 border-r-[#e5e9f1]">
                                            <div className="cursor-pointer hover:text-[#00a99b]">
                                              <button
                                                className="flex items-center"
                                                onClick={(e) => {
                                                  // handleStatusSelectClick(e);
                                                }}
                                              >
                                                {elem.milestoneName}
                                              </button>

                                              <Popper
                                                open={Boolean(
                                                  statusSelectAnchorEl
                                                )}
                                                anchorEl={statusSelectAnchorEl}
                                                placement="bottom-start"
                                              >
                                                <Paper>
                                                  <div className="flex items-center  ">
                                                    <Select
                                                      options={
                                                        projectListOptions
                                                      }
                                                      value={selectedList}
                                                      onChange={handleListClick}
                                                      isSearchable
                                                      placeholder="Search..."
                                                      className="react-select"
                                                    />
                                                  </div>
                                                </Paper>
                                              </Popper>
                                            </div>
                                          </div>
                                          {/* Assignees  */}
                                          <div className="flex items-center w-[11%] relative p-[10px_13px] border border-t-0 border-b-0 border-l-0 border-r-[#e5e9f1]">
                                            {/*dropdown start event"hover"*/}
                                            {elem?.assignees?.map(
                                              (assignee) => (
                                                <div className="dropdown inline-block relative ">
                                                  <button className="py-[3px] px-[5px] border-0 inline-flex items-center bg-[#ff735f] text-[12px] font-medium rounded-[4px]">
                                                    <span className="items-center inline-flex text-white align-middle">
                                                      {assignee.name
                                                        ?.substr(0, 2)
                                                        ?.toUpperCase()}
                                                      <span></span>
                                                    </span>
                                                  </button>
                                                  <ul className="dropdown-menu absolute hidden text-gray-700  bg-white right-0 min-w-[294px] h-[305px] border  ">
                                                    <div className=" flex">
                                                      <span className="items-center font-bold inline-flex text-white align-middle bg-[#8dd7ffd9] border-[#f9a33ad9] h-16 w-16 pl-5 pb-1 rounded-md ml-5 mt-4 text-xl">
                                                        {assignee.name
                                                          ?.substr(0, 2)
                                                          ?.toUpperCase()}
                                                      </span>
                                                      <div className="text-[#8e94bb] text-base font-medium inline-flex flex-col ml-24 absolute mt-3">
                                                        <h5 className="">
                                                          {assignee.email}
                                                        </h5>
                                                        <span className="h-2 m-0 absolute w-2 border border-white bg-green-500 rounded-full -right-3" />
                                                        <h6 className=" opacity-60 font-semibold text-xs uppercase mb-2">
                                                          {assignee.role}
                                                        </h6>
                                                        <button className=" border border-[#363c5b] text-[#7c88c7]   px-1 flex  text-sm  w-12 rounded ">
                                                          <svg
                                                            className="mr-1 mt-1 "
                                                            width="12px"
                                                            height="12px"
                                                            viewBox="0 0 12 12"
                                                            version="1.1"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                          >
                                                            <path
                                                              fillRule="evenodd"
                                                              clipRule="evenodd"
                                                              d="M6.66667 0.666569C6.66667 0.296631 6.36819 0 6 0C5.62924 0 5.33333 0.298433 5.33333 0.666569V5.33333H0.666569C0.296631 5.33333 0 5.63181 0 6C0 6.37076 0.298433 6.66667 0.666569 6.66667H5.33333V11.3334C5.33333 11.7034 5.63181 12 6 12C6.37076 12 6.66667 11.7016 6.66667 11.3334V6.66667H11.3334C11.7034 6.66667 12 6.36819 12 6C12 5.62924 11.7016 5.33333 11.3334 5.33333H6.66667V0.666569Z"
                                                              fill="currentColor"
                                                            />
                                                          </svg>
                                                          Tag
                                                        </button>
                                                      </div>
                                                    </div>
                                                    <div className="pt-0 px-4 pb-3 flex-col mt-7 hover:text-[#009084]  ">
                                                      <button className="min-w-full px-0 bg-white border border-[#e8e8e8] py-2 rounded-md font-semibold hover:shadow-md">
                                                        Set yourself as
                                                        <span className="font-bold">
                                                          Away
                                                        </span>
                                                      </button>
                                                    </div>
                                                    <hr />
                                                    <div className="bg-[#fafbfd] h-[140px] w-full py-3 px-4">
                                                      <div className="text-xs mb-1 text-[#8e94bb] font-medium ">
                                                        <i
                                                          className="fa-solid fa-envelope  mr-1 text-xs"
                                                          style={{
                                                            color: "#8e94bb",
                                                          }}
                                                        />
                                                        {assignee.email}
                                                      </div>
                                                      <div className="text-xs mb-1 text-[#8e94bb] font-medium ">
                                                        <i
                                                          className="fa-regular fa-clock fa-fw"
                                                          style={{
                                                            color: "#8e94bb",
                                                          }}
                                                        />
                                                        <span>
                                                          <time>11:42AM</time>
                                                          &nbsp; (local time)
                                                        </span>
                                                      </div>
                                                      <div className="flex mt-3 -mx-1">
                                                        <button className="px-1 w-2/4 flex-auto bg-white border border-[#e8e8e8] h-8 text-sm items-center rounded-md font-semibold hover:text-[#009084] hover:shadow-md ">
                                                          <svg
                                                            className="inline-flex mr-1 -mt-1"
                                                            width="1em"
                                                            height="1em"
                                                            viewBox="0 0 10 10"
                                                            version="1.1"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                          >
                                                            <g
                                                              id="Page-2"
                                                              stroke="none"
                                                              strokeWidth={1}
                                                              fill="none"
                                                              fillRule="evenodd"
                                                            >
                                                              <g
                                                                id="Team-overview---search"
                                                                transform="translate(-195.000000, -181.000000)"
                                                                fill="currentColor"
                                                              >
                                                                <g
                                                                  id="Group-2"
                                                                  transform="translate(121.000000, 153.000000)"
                                                                >
                                                                  <path
                                                                    d="M75,35.4952421 L75,36.17338 C75.1749893,36.2801701 76.5730894,36.9985151 78.9999999,36.9985149 C81.4269104,36.9985146 82.8251939,36.2809335 83,36.1742018 L83,35.4952421 C83,34.6371765 81.0964783,33.9698598 80.9607895,33.9187773 C80.5350099,34.6829256 79.905538,35.2499999 79,35.25 C78.0949419,35.2500001 77.4656574,34.6835268 77.0398876,33.9199923 C76.9055757,33.9704691 75,34.635437 75,35.4952421 Z M76.25,30.5893243 C76.25,29.15928 77.4812169,28 79,28 C80.5187831,28 81.75,29.15928 81.75,30.5893243 C81.75,31.1961664 81.6440039,32.1272483 81.3568094,32.9981097 C82.3582639,33.3806945 84,34.0003662 84,35.4952421 L84,36.4988173 C84,37.0513451 81.8424683,37.9999997 79,38 C76.1575317,38.0000003 74,37.0494601 74,36.4988173 L74,35.4952421 C74,33.9952087 75.642655,33.3812319 76.6436151,32.9993966 C76.3561006,32.1281657 76.25,31.1964653 76.25,30.5893243 Z M78.9999998,34.25 C79.9847893,34.2499998 80.75,32.4413168 80.75,30.5893243 C80.75,29.7254728 79.9795093,29 79,29 C78.0204907,29 77.25,29.7254728 77.25,30.5893243 C77.25,32.4413169 78.0152107,34.2500002 78.9999998,34.25 Z"
                                                                    id="Combined-Shape"
                                                                  />
                                                                </g>
                                                              </g>
                                                            </g>
                                                          </svg>
                                                          See profile
                                                        </button>
                                                      </div>
                                                      <div className="flex mt-3 -mx-1">
                                                        <button className="px-1 w-2/4 flex-auto bg-white border border-[#e8e8e8] h-8 text-sm items-center rounded-md font-semibold hover:text-[#009084] hover:shadow-md  ">
                                                          <svg
                                                            className="inline-flex mr-1 -mt-1"
                                                            width="1em"
                                                            height="0.9375em"
                                                            viewBox="0 0 16 15"
                                                            version="1.1"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                          >
                                                            <mask
                                                              id="icon-settings-a"
                                                              fill="#fff"
                                                            >
                                                              <path
                                                                fillRule="evenodd"
                                                                d="M.5 6.666v1.32c0 .779.637 1.424 1.424 1.424 1.357 0 1.912.96 1.23 2.136a1.424 1.424 0 0 0 .524 1.942l1.297.742a1.251 1.251 0 0 0 1.71-.45l.082-.143c.682-1.176 1.791-1.176 2.466 0l.083.143a1.251 1.251 0 0 0 1.709.45l1.296-.742c.683-.39.915-1.26.525-1.942-.682-1.177-.127-2.136 1.23-2.136.787 0 1.424-.645 1.424-1.425V6.666c0-.787-.645-1.424-1.424-1.424-1.357 0-1.912-.96-1.23-2.137a1.424 1.424 0 0 0-.524-1.941L11.024.422a1.251 1.251 0 0 0-1.71.45l-.082.142c-.682 1.177-1.792 1.177-2.466 0L6.684.87a1.251 1.251 0 0 0-1.709-.45l-1.297.743a1.424 1.424 0 0 0-.524 1.941c.682 1.177.127 2.137-1.23 2.137C1.137 5.242.5 5.886.5 6.666ZM8 9.18A1.854 1.854 0 1 1 8 5.47 1.854 1.854 0 0 1 8 9.18ZM5.02 7.326a2.98 2.98 0 1 1 5.96 0 2.98 2.98 0 0 1-5.96 0Z"
                                                                clipRule="evenodd"
                                                              />
                                                            </mask>
                                                            <path
                                                              fill="currentColor"
                                                              fillRule="evenodd"
                                                              d="M.5 6.666v1.32c0 .779.637 1.424 1.424 1.424 1.357 0 1.912.96 1.23 2.136a1.424 1.424 0 0 0 .524 1.942l1.297.742a1.251 1.251 0 0 0 1.71-.45l.082-.143c.682-1.176 1.791-1.176 2.466 0l.083.143a1.251 1.251 0 0 0 1.709.45l1.296-.742c.683-.39.915-1.26.525-1.942-.682-1.177-.127-2.136 1.23-2.136.787 0 1.424-.645 1.424-1.425V6.666c0-.787-.645-1.424-1.424-1.424-1.357 0-1.912-.96-1.23-2.137a1.424 1.424 0 0 0-.524-1.941L11.024.422a1.251 1.251 0 0 0-1.71.45l-.082.142c-.682 1.177-1.792 1.177-2.466 0L6.684.87a1.251 1.251 0 0 0-1.709-.45l-1.297.743a1.424 1.424 0 0 0-.524 1.941c.682 1.177.127 2.137-1.23 2.137C1.137 5.242.5 5.886.5 6.666ZM8 9.18A1.854 1.854 0 1 1 8 5.47 1.854 1.854 0 0 1 8 9.18ZM5.02 7.326a2.98 2.98 0 1 1 5.96 0 2.98 2.98 0 0 1-5.96 0Z"
                                                              clipRule="evenodd"
                                                            />
                                                            <path
                                                              fill="currentColor"
                                                              d="m3.154 11.546-.974-.564v.001l.974.563Zm.524 1.942.56-.977h-.001l-.559.977Zm1.297.742.575-.967a.61.61 0 0 0-.016-.01l-.559.977Zm1.71-.45.966.575.007-.011-.974-.564Zm.082-.143-.974-.564.974.564Zm2.466 0-.976.56.002.004.974-.564Zm.083.143-.974.564.007.011.967-.575Zm1.709.45-.56-.977a.54.54 0 0 0-.015.01l.575.967Zm1.296-.742-.558-.977.559.977Zm.525-1.942.977-.558-.003-.006-.974.564Zm0-8.44.974.563-.974-.564Zm-.524-1.942-.56.976h.001l.559-.976ZM11.024.422l-.575.966a.94.94 0 0 0 .016.01l.559-.976Zm-1.71.45L8.35.295l-.007.012.974.563Zm-.082.142.973.564-.973-.564Zm-2.466 0 .976-.56L7.74.45l-.973.564ZM6.684.87l.974-.563-.007-.012-.967.575ZM4.975.421l.559.977.016-.01-.575-.966Zm-1.297.743.559.976-.559-.976Zm-.524 1.941-.974.563v.001l.974-.564Zm-1.53 4.88V6.666h-2.25v1.32h2.25Zm.3.3a.304.304 0 0 1-.3-.3h-2.25a2.553 2.553 0 0 0 2.55 2.55v-2.25Zm2.203 3.825c.461-.795.645-1.778.151-2.635-.493-.857-1.436-1.19-2.354-1.19v2.25c.211 0 .331.037.385.062.048.023.037.03.02.001-.017-.03-.005-.035-.01.018a.942.942 0 0 1-.139.366l1.947 1.128Zm.11.4a.299.299 0 0 1-.11-.401L2.18 10.983a2.549 2.549 0 0 0 .94 3.481l1.117-1.953Zm1.297.743-1.297-.742-1.117 1.953 1.296.742 1.118-1.953Zm.184-.048a.145.145 0 0 1-.088.067.098.098 0 0 1-.08-.01L4.4 15.197c1.148.683 2.594.264 3.251-.84l-1.933-1.151Zm.075-.131-.082.142 1.947 1.128.082-.143-1.947-1.127Zm4.416.004c-.457-.798-1.217-1.448-2.206-1.448-.988 0-1.749.648-2.21 1.443l1.947 1.129c.106-.184.2-.27.25-.304.044-.031.046-.018.013-.018-.034 0-.033-.014.01.016a.93.93 0 0 1 .244.301l1.952-1.119Zm.08.138-.082-.142L8.259 14.2l.083.143 1.947-1.128Zm.16.047a.098.098 0 0 1-.079.009.145.145 0 0 1-.088-.067l-1.933 1.15c.657 1.104 2.103 1.524 3.25.841l-1.15-1.933Zm1.314-.752-1.297.742 1.117 1.953 1.297-.742-1.117-1.953Zm.107-.407a.297.297 0 0 1-.107.407l1.117 1.953a2.547 2.547 0 0 0 .943-3.476l-1.954 1.116Zm2.206-3.82c-.918 0-1.86.334-2.354 1.19-.494.857-.31 1.84.15 2.636l1.948-1.128a.943.943 0 0 1-.14-.366c-.004-.053.008-.047-.009-.018-.017.03-.028.022.02 0a.937.937 0 0 1 .385-.063v-2.25Zm.299-.299c0 .162-.137.3-.3.3v2.25a2.553 2.553 0 0 0 2.55-2.55h-2.25Zm0-1.319v1.32h2.25v-1.32h-2.25Zm-.3-.3c.163 0 .3.138.3.3h2.25a2.553 2.553 0 0 0-2.55-2.55v2.25Zm-2.202-3.825c-.461.796-.645 1.779-.151 2.636.493.856 1.436 1.19 2.354 1.19v-2.25a.938.938 0 0 1-.385-.063c-.048-.022-.037-.03-.02 0 .017.028.005.034.01-.019a.943.943 0 0 1 .139-.366l-1.947-1.128Zm-.11-.4a.299.299 0 0 1 .11.401l1.947 1.126c.7-1.212.286-2.78-.94-3.481L11.763 2.14Zm-1.297-.743 1.297.742L12.88.187l-1.297-.742-1.117 1.953Zm-.184.049a.145.145 0 0 1 .088-.068.098.098 0 0 1 .08.01L11.6-.546c-1.148-.683-2.594-.263-3.251.841l1.933 1.15Zm-.075.13.082-.142L8.342.308 8.259.45l1.948 1.127ZM5.79 1.573c.457.798 1.217 1.448 2.206 1.448.988 0 1.748-.648 2.21-1.443L8.26.45a.948.948 0 0 1-.25.304c-.044.03-.046.017-.013.017.034 0 .033.014-.01-.016a.93.93 0 0 1-.244-.3L5.79 1.572Zm-.08-.138.082.142L7.74.45 7.658.308 5.71 1.435Zm-.16-.047a.098.098 0 0 1 .079-.009c.035.01.066.032.088.068L7.65.297C6.994-.809 5.548-1.229 4.4-.546l1.15 1.933Zm-1.314.752 1.297-.742L4.416-.555 3.12.187 4.237 2.14Zm-.11.402a.299.299 0 0 1 .11-.402L3.12.187a2.549 2.549 0 0 0-.94 3.481l1.948-1.126ZM1.925 6.367c.918 0 1.86-.334 2.354-1.19.494-.857.31-1.84-.151-2.636L2.18 3.67a.942.942 0 0 1 .14.366c.004.053-.008.047.009.018.017-.03.028-.021-.02 0a.938.938 0 0 1-.385.064v2.25Zm-.3.299c0-.162.138-.3.3-.3v-2.25a2.553 2.553 0 0 0-2.55 2.55h2.25Zm3.397.66A2.98 2.98 0 0 0 8 10.305v-2.25a.73.73 0 0 1-.73-.73H5.02ZM8 4.346a2.98 2.98 0 0 0-2.98 2.98h2.25a.73.73 0 0 1 .73-.73v-2.25Zm2.98 2.98A2.98 2.98 0 0 0 8 4.346v2.25a.73.73 0 0 1 .73.73h2.25ZM8 10.305a2.98 2.98 0 0 0 2.98-2.98H8.73a.73.73 0 0 1-.73.73v2.25ZM8 3.22a4.104 4.104 0 0 0-4.104 4.105h2.25c0-1.024.83-1.855 1.854-1.855v-2.25Zm4.104 4.105A4.104 4.104 0 0 0 8 3.22v2.25c1.024 0 1.854.83 1.854 1.855h2.25ZM8 11.43a4.104 4.104 0 0 0 4.104-4.104h-2.25C9.854 8.35 9.024 9.18 8 9.18v2.25ZM3.896 7.326A4.104 4.104 0 0 0 8 11.43V9.18a1.854 1.854 0 0 1-1.854-1.854h-2.25Z"
                                                              mask="url(#icon-settings-a)"
                                                            />
                                                          </svg>
                                                          Profile Settings
                                                        </button>
                                                      </div>
                                                    </div>
                                                  </ul>
                                                </div>
                                              )
                                            )}

                                            {/*dropdown end event"hover"*/}
                                            <div className="add-user text-[12px] cursor-pointer py-[3px] px-[5px] ml-2 border border-gray-100 text-[#009084] rounded-[4px]">
                                              <span className="inline-block bg-white ">
                                                <svg
                                                  className="icon "
                                                  width="1.25em"
                                                  height="0.875em"
                                                  viewBox="0 0 20 14"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                >
                                                  <g
                                                    fill="currentColor"
                                                    fillRule="evenodd"
                                                  >
                                                    <path d="M1.372 10.283v.93c.24.147 2.158 1.133 5.488 1.133 3.33 0 5.248-.985 5.488-1.131v-.932c0-1.177-2.612-2.092-2.798-2.162-.584 1.048-1.448 1.826-2.69 1.826S4.755 9.17 4.17 8.122c-.184.07-2.798.982-2.798 2.161zm1.715-6.73C3.087 1.59 4.777 0 6.86 0c2.084 0 3.773 1.59 3.773 3.553 0 .832-.145 2.11-.54 3.304 1.375.525 3.627 1.376 3.627 3.426v1.377c0 .758-2.96 2.06-6.86 2.06-3.9 0-6.86-1.304-6.86-2.06v-1.377c0-2.058 2.254-2.9 3.627-3.424a11.27 11.27 0 0 1-.54-3.306zM6.86 8.575c1.351 0 2.401-2.482 2.401-5.022 0-1.186-1.057-2.181-2.401-2.181-1.344 0-2.401.995-2.401 2.18 0 2.541 1.05 5.023 2.401 5.023zM18.563 3.086a.913.913 0 1 1 0 1.828h-1.369v1.369a.913.913 0 1 1-1.828 0V4.914h-1.369a.913.913 0 1 1 0-1.828h1.369V1.717a.913.913 0 1 1 1.828 0v1.369h1.369z"></path>
                                                  </g>
                                                </svg>
                                              </span>
                                            </div>
                                          </div>
                                          {/* due date  */}
                                          <div className="flex items-center w-[11%] relative p-[10px_13px] border border-t-0 border-b-0 border-l-0 border-r-[#e5e9f1]">
                                            <div className="task-actions-holder ml-2 relative top-1 inline-block group duration-300">
                                              <span
                                                className="task-actions-trigger text-sm cursor-pointer text-[#e95b4b]
                                    hover:underline hover:decoration-dotted hover:decoration-2"
                                              >
                                                <time>
                                                  {formateDate(elem.dueDate)}
                                                </time>
                                              </span>
                                              <span className="absolute hidden group-hover:flex -left-[1px] -top-3 w-[102px] -translate-y-full px-2 py-1 bg-gray-700 rounded-lg text-center text-white text-[12px] after:content-[''] after:absolute after:left-[45%] after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                                                {formateDate(elem.dueDate)}
                                              </span>
                                            </div>
                                          </div>
                                          {/* Tags  */}
                                          <div className=" overflow-x-auto gap-[7px] flex items-center w-[11%] relative p-[10px_13px] border border-t-0 border-b-0 border-l-0 border-r-[#e5e9f1]">
                                            {elem?.tags?.map((tag) => (
                                              <span className="text-white px-2 font-medium text-xs bg-[#E95B4B] rounded py-1">
                                                {tag.name}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  );
                                })
                              ) : (
                                <div className="row-tasks border border-solid border-b border-b-[#e5e9f1] border-l-0 border-r-0 border-t-0">
                                  <div className="flex">
                                    <p className="text-[13px] ml-[20px] ">
                                      No task found
                                    </p>
                                  </div>
                                </div>
                              )}

                              <div className="row-tasks border border-solid border-b border-b-[#e5e9f1] border-l-0 border-r-0 border-t-0">
                                <div className="flex">
                                  <div className="flex items-center p-[8px_12px] pr-3 w-[400px] border border-solid border-r border-r-[#e5e9f1] border-l-0 border-b-0 border-t-0">
                                    <div className="flex justify-between w-full ">
                                      <svg
                                        onClick={() => handleTaskSubmit(el)}
                                        className="icon text-[#8e94bb] mt-2 ml-2"
                                        width="1em"
                                        height="1em"
                                        viewBox="0 0 12 12"
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                          d="M6.66667 0.666569C6.66667 0.296631 6.36819 0 6 0C5.62924 0 5.33333 0.298433 5.33333 0.666569V5.33333H0.666569C0.296631 5.33333 0 5.63181 0 6C0 6.37076 0.298433 6.66667 0.666569 6.66667H5.33333V11.3334C5.33333 11.7034 5.63181 12 6 12C6.37076 12 6.66667 11.7016 6.66667 11.3334V6.66667H11.3334C11.7034 6.66667 12 6.36819 12 6C12 5.62924 11.7016 5.33333 11.3334 5.33333H6.66667V0.666569Z"
                                          fill="currentColor"
                                        />
                                      </svg>
                                      <div className="w-[340px] items-center">
                                        <input
                                          type="text"
                                          id={el.id}
                                          placeholder="Add a Task"
                                          className="border-none bg-transparent w-full h-full py-2"
                                          name="name"
                                          value={handleNewTaskValue(el)}
                                          onChange={(e) =>
                                            handleNewTask(e, el.id)
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  {/* Status  */}
                                  <div className="flex items-center w-[15%] relative p-[10px_13px]">
                                    <PopupState
                                      variant="popover"
                                      popupId="demo-popup-popover"
                                    >
                                      {(popupState) => (
                                        <div>
                                          <div
                                            {...bindTrigger(popupState)}
                                            className="w-full cursor-pointer rounded-md bg-white"
                                          >
                                            <button
                                              className="flex items-center"
                                              onClick={(e) => {
                                                handleStatusSelectClick(e, el);
                                                setIsOpenUsers(true);
                                              }}
                                            >
                                              {Boolean(el.newTask.status)
                                                ? el.newTask.status.label
                                                : "Select a status"}
                                              <span className="arrow font-bold text-sm ml-2 relative top-1 ">
                                                <svg
                                                  className="text-[12px] inline-flex "
                                                  width="1.0277777777777777em"
                                                  height="0.6111111111111112em"
                                                  viewBox="0 0 37 22"
                                                  version="1.1"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                >
                                                  <g
                                                    id="Style-guide"
                                                    stroke="none"
                                                    strokeWidth={1}
                                                    fill="none"
                                                    fillRule="evenodd"
                                                  >
                                                    <g
                                                      id="nifty-UI-guide"
                                                      transform="translate(-617.000000, -2934.000000)"
                                                      fill="currentColor"
                                                      fillRule="nonzero"
                                                    >
                                                      <g
                                                        id="Group-6-Copy-3"
                                                        transform="translate(574.000000, 2884.000000)"
                                                      >
                                                        <path
                                                          d="M70.5909903,46.8409903 C71.4696699,45.9623106 71.4696699,44.5376894 70.5909903,43.6590097 C69.7123106,42.7803301 68.2876894,42.7803301 67.4090097,43.6590097 L51.6590097,59.4090097 C50.7803301,60.2876894 50.7803301,61.7123106 51.6590097,62.5909903 L67.4090097,78.3409903 C68.2876894,79.2196699 69.7123106,79.2196699 70.5909903,78.3409903 C71.4696699,77.4623106 71.4696699,76.0376894 70.5909903,75.1590097 L56.4319805,61 L70.5909903,46.8409903 Z"
                                                          id="Path-82"
                                                          transform="translate(61.125000, 61.000000) rotate(-90.000000) translate(-61.125000, -61.000000) "
                                                        ></path>
                                                      </g>
                                                    </g>
                                                  </g>
                                                </svg>
                                              </span>
                                            </button>
                                          </div>
                                          {isOpenUsers &&
                                            currMilestoneId === el.id && (
                                              <Popover
                                                onClose={() =>
                                                  setIsOpenUsers(false)
                                                }
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
                                                      placeholder="Search..."
                                                      onChange={(value) =>
                                                        handleNewTaskStatus(
                                                          value,
                                                          el.id
                                                        )
                                                      }
                                                      options={
                                                        projectStatusOptions
                                                      }
                                                      value={
                                                        el?.newTask?.status ??
                                                        ""
                                                      }
                                                    />
                                                  </div>
                                                </Box>
                                              </Popover>
                                            )}
                                        </div>
                                      )}
                                    </PopupState>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })
                  ) : (
                    <div className="flex flex-col gap-5 mt-10 justify-center items-center">
                      <svg
                        class="icon text-[45px]  text-[#8e94bb] "
                        width="0.8611111111111112em"
                        height="1em"
                        viewBox="0 0 31 36"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g
                          id="Style-guide"
                          stroke="none"
                          stroke-width="1"
                          fill="none"
                          fill-rule="evenodd"
                        >
                          <g
                            id="nifty-UI-guide"
                            transform="translate(-900.000000, -3111.000000)"
                            fill="currentColor"
                            fill-rule="nonzero"
                          >
                            <g
                              id="Group-6-Copy"
                              transform="translate(852.000000, 3068.000000)"
                            >
                              <path
                                d="M63.2,79 C60.7316918,79 58.7294118,76.9829826 58.7294118,74.5 C58.7294118,74.0029437 58.3291017,73.6 57.8352941,73.6 C57.3414866,73.6 56.9411765,74.0029437 56.9411765,74.5 C56.9411765,76.984547 54.9373421,79 52.4705882,79 C50.0022801,79 48,76.9829826 48,74.5 L48,58.3029664 C48,49.8509274 54.8040841,43 63.2,43 C71.5946379,43 78.4,49.8518332 78.4,58.3029664 L78.4,74.5 C78.4,76.9852814 76.3984495,79 73.9294118,79 C71.4603741,79 69.4588235,76.9852814 69.4588235,74.5 C69.4588235,74.0029437 69.0585134,73.6 68.5647059,73.6 C68.0708983,73.6 67.6705882,74.0029437 67.6705882,74.5 C67.6705882,76.984547 65.6667539,79 63.2,79 Z M57.6615385,70.25 C60.210545,70.25 62.2769231,72.320683 62.2769231,74.875 C62.2769231,75.3841431 62.6915935,75.8 63.2,75.8 C63.7080846,75.8 64.1230769,75.3844657 64.1230769,74.875 C64.1230769,72.320683 66.189455,70.25 68.7384615,70.25 C71.2874681,70.25 73.3538462,72.320683 73.3538462,74.875 C73.3538462,75.3858634 73.7671218,75.8 74.2769231,75.8 C74.7867244,75.8 75.2,75.3858634 75.2,74.875 L75.2,58.2280488 C75.2,51.5854101 69.8271188,46.2 63.2,46.2 C56.5716078,46.2 51.2,51.5844331 51.2,58.2280488 L51.2,74.875 C51.2,75.3841431 51.6146704,75.8 52.1230769,75.8 C52.6311616,75.8 53.0461538,75.3844657 53.0461538,74.875 C53.0461538,72.320683 55.1125319,70.25 57.6615385,70.25 Z M61.2,60.6 C59.6536027,60.6 58.4,59.3463973 58.4,57.8 C58.4,56.2536027 59.6536027,55 61.2,55 C62.7463973,55 64,56.2536027 64,57.8 C64,59.3463973 62.7463973,60.6 61.2,60.6 Z M70.8,60.6 C69.2536027,60.6 68,59.3463973 68,57.8 C68,56.2536027 69.2536027,55 70.8,55 C72.3463973,55 73.6,56.2536027 73.6,57.8 C73.6,59.3463973 72.3463973,60.6 70.8,60.6 Z"
                                id="Combined-Shape"
                              ></path>
                            </g>
                          </g>
                        </g>
                      </svg>
                      <p className="text-[#8e94bb] text-[15px] font-600">
                        There are no open tasks assigned to you
                      </p>
                    </div>
                  )}
                  <div
                    onClick={handleAddList}
                    className=" w-[100px] p-[6px_16px] mb-5 item-label text-[13px] bg-white rounded-md border border-solid border-[e5e9f1] whitespace-nowrap hover:text-[#00a99b] cursor-pointer "
                  >
                    + Add List
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default ListViewTasks;

const Dropdowns = ({
  id,
  anchor,
  handleClose,
  options,
  handleMenuClick,
  activeMenu,
}) => {
  return (
    <Menu
      id={id}
      anchorEl={anchor}
      open={Boolean(anchor)}
      onClose={handleClose}
    >
      {options.map((el) => (
        <MenuItem
          onClick={(e) => handleMenuClick(e, el.name)}
          selected={activeMenu === el.name}
          className={`hover:text-[#00a99b]  ${
            activeMenu === el.name && "!bg-[#F2FFFE] text-[#00a99b]"
          }`}
        >
          <div
            className={`flex items-center hover:text-[#00a99b] p-[0px 17px] ${
              activeMenu === el.name && "!bg-[#F2FFFE] text-[#00a99b]"
            }`}
          >
            {el.icon(el)}
            <p className="ml-[10px] text-[13px]">{el.label}</p>
          </div>
        </MenuItem>
      ))}
    </Menu>
  );
};
