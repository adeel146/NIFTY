import React, { useState } from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SettingsIcon from "@mui/icons-material/Settings";
import { Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import "./myWork.css";
import EditColumns from "./EditColumns";
import MyTasks from "./MyTasks";
import { capitalizeFirstLetter } from "utils";
import { useSelector } from "react-redux";
import CalendarArea from "components/KanBan/CalendarArea";
import FileManager from "components/FileManager/FileManager";

function MyWork() {
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
        <MyTasks
          isProjectSelect={isProjectSelect}
          setIsProjectSelect={setIsProjectSelect}
          setIsEditColumn={setIsEditColumn}
          selectedView={selectedList}
        />
      ),
    },
    {
      name: "Calendar",
      component: <CalendarArea />,
    },
    {
      name: "Files",
      component: <FileManager />,
    },
    // {
    //   name: "Notes",
    //   component: <p>notes</p>,
    // },
    // {
    //   name: "Time",
    //   component: <p>time</p>,
    // },
  ];
  const selectedTab = mainNavigation.find((tab) => tab.name === name);
  const { activeWorkspace } = useSelector(({ workspace }) => workspace);

  return (
    <>
      {isEditColumn && (
        <EditColumns open={isEditColumn} onClose={handleEditColumnClose} />
      )}
      {/* top header comes here  */}
      <div className="flex relative">
        <div className="w-[36px] h-[36px] rounded-lg bg-[#D55CF5] absolute left-[25px] flex items-center justify-center text-slate-50 top-[9px]">
          {activeWorkspace?.name?.charAt(0)?.toUpperCase() ?? ""}
        </div>
        <div className="absolute left-[80px] top-1 flex space-x-5 text-[#2f2f2f] font-bold text-[18px] capitalize">
          {activeWorkspace?.name ?? ""}
        </div>
      </div>
      <div className="bg-white flex justify-between items-center pr-8 pl-[80px] border border-b-[#e8e8e8]">
        <div className={` flex space-x-4 items-center pt-7 cursor-pointer`}>
          {mainNavigation.map((val) => {
            return (
              <div
                className={`${
                  name === val?.name
                    ? "text-[#00A99B] border-b-2 border-[#00A99B] cursor-pointer font-semibold text-[13px] 3xl:text-[15px] font-Manrope "
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
            <button className="flex space-x-3 items-center justify-center text-[#2f2f2f] hover:!text-[#009084] font-semibold text-[13px] font-Manrope rounded-md bg-whit shadow-xs px-4 h-[34px] border border-gray-200">
              <CalendarMonthIcon sx={{ marginRight: "5px" }} /> Show Calendar
            </button>
            <button
              onClick={handleButtonClick}
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
            <button className="flex space-x-3 !ml-[0px] hover:text-[#00a99b] items-center justify-center  rounded-md bg-whit shadow-xs w-[10px] px-4 h-[34px] border border-gray-200 border-l-0 rounded-l-none">
              <SettingsIcon onClick={() => setIsEditColumn(true)} />
            </button>
          </div>
        </div>
      </div>
      {/* top header ends here  */}
      {selectedTab && selectedTab.component}
    </>
  );
}

export default MyWork;
