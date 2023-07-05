import React, { useState } from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SettingsIcon from "@mui/icons-material/Settings";
import { Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import "./AllTasks.css";
import EditTasksColumns from "./EditTasksColumns";
import ListViewTasks from "./ListViewTasks";
import { capitalizeFirstLetter } from "utils";
import { useSelector } from "react-redux";

function AllTasks() {
  const [isEditColumn, setIsEditColumn] = useState(false);
  const [isProjectSelect, setIsProjectSelect] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedList, setSelectedList] = useState("list");
  const [name, setName] = useState("Tasks");

  const handleButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleMenuItemClick = (listType) => {
    setSelectedList(listType);
    setAnchorEl(null);
  };

  const handleEditColumnClose = () => {
    setIsEditColumn(false);
  };
  const mainNavigation = [
    {
      name: "Tasks",
      component: (
        <ListViewTasks
          isProjectSelect={isProjectSelect}
          setIsProjectSelect={setIsProjectSelect}
          setIsEditColumn={setIsEditColumn}
          selectedView={selectedList}
        />
      ),
    },
    {
      name: "Calendar",
      component: <p>calendar</p>,
    },
    {
      name: "Files",
      component: <p>files</p>,
    },
    {
      name: "Notes",
      component: <p>notes</p>,
    },
    {
      name: "Time",
      component: <p>time</p>,
    },
  ];
  const selectedTab = mainNavigation.find((tab) => tab.name === name);
  const { activeWorkspace } = useSelector(({ workspace }) => workspace);

  return (
    <>
      {isEditColumn && (
        <EditTasksColumns open={isEditColumn} onClose={handleEditColumnClose} />
      )}
      {/* top header comes here  */}
      <div className="flex relative">
        <div className="w-[38px] h-[38px] rounded-md bg-[#D55CF5] absolute left-4 flex items-center justify-center text-slate-50 top-1">
          {activeWorkspace?.name?.charAt(0)?.toUpperCase() ?? "G"}
        </div>
        <div className="absolute left-16 top-1 flex space-x-5">
          {activeWorkspace?.name ?? "Graffetecs"}
        </div>
      </div>
      <div className="bg-white h-[58px] flex justify-end items-center pr-8">
        <div className="">
          <div className="flex space-x-6">
            <button
              onClick={handleButtonClick}
              className="flex space-x-3 items-center hover:text-[#00a99b] justify-center  rounded-md bg-whit shadow-xs w-[130px] px-6 h-[36px] border border-gray-200"
            >
              <FormatListBulletedIcon sx={{ marginRight: "5px" }} />
              {capitalizeFirstLetter(selectedList)}
              <div>
                <KeyboardArrowDownIcon sx={{ marginLeft: "1px" }} />
              </div>
            </button>
            <Menu
              id="list-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem
                onClick={() => handleMenuItemClick("report")}
                selected={selectedList === "report"}
                className="flex justify-between"
              >
                <ListItemText primary="Report" className="flex-grow" />
                <ListItemIcon>
                  {selectedList === "report" && <CheckIcon />}
                </ListItemIcon>
              </MenuItem>
              <MenuItem
                onClick={() => handleMenuItemClick("list")}
                selected={selectedList === "list"}
                className="flex justify-between"
              >
                <ListItemText primary="List" className="flex-grow" />
                <ListItemIcon>
                  {selectedList === "list" && <CheckIcon />}
                </ListItemIcon>
              </MenuItem>
            </Menu>
            <button className="flex space-x-3 !ml-[0px] hover:text-[#00a99b] items-center justify-center  rounded-md bg-whit shadow-xs w-[10px] px-4 h-[36px] border border-gray-200">
              <SettingsIcon onClick={() => setIsEditColumn(true)} />
            </button>
          </div>
        </div>
      </div>
      {/* top header ends here  */}
      <ListViewTasks
        isProjectSelect={isProjectSelect}
        setIsProjectSelect={setIsProjectSelect}
        setIsEditColumn={setIsEditColumn}
        selectedView={selectedList}
      />
    </>
  );
}

export default AllTasks;
