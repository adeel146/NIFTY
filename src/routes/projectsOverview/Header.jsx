import React, { useEffect, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { Tooltip } from "@mui/material";
import CompassIcon from "../../../public/icons/CompassIcon";

import SyncfusionGanttChart from "routes/roadMap";
import { useParams } from "react-router-dom";
import GreenButton from "hooks/Common/commonButtons/GreenButton";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { openFileDialog } from "redux/reducers/portfolio";
import { useDispatch } from "react-redux";
import { useDisplaySuccess } from "hooks/useDisplaySuccess";
import { useAddFile } from "hooks/Portfolio";
import { useSelector } from "react-redux";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { capitalizeFirstLetter } from "utils";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SettingsIcon from "@mui/icons-material/Settings";
import { Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { taskAssessmentOpen } from "redux/actions";
import { useDisplayError } from "hooks/useDisplayError";
import PaletteIcon from "@mui/icons-material/Palette";
import axios from "axios";

const ProjectOverviewHeader = () => {
  const headerMenuName = useSelector(
    (state) => state?.projectTaskSlice?.headerMenuName
  );
  const [name, setName] = useState(headerMenuName);
  const [anchorEl, setAnchorEl] = useState(null);
  const [file, setFile] = useState(false);
  const [selectedList, setSelectedList] = useState("kanban");
  const [listAnchorEl, setListAnchorEl] = useState(null);
  const [isEditColumn, setIsEditColumn] = useState(false);
  const [workSpaceRiskState, setWorkSpaceRiskState] = useState([]);

  const parentId = useSelector((state) => state?.portfolioSlice?.parentIdState);
  const getFolderId = useSelector(
    (state) => state?.portfolioSlice?.folderIdState
  );
  const workSpaceId = localStorage.getItem("workspaceId");

  const dispatch = useDispatch();

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

  useEffect(() => {
    if (workSpaceRisk?.length) {
      setWorkSpaceRiskState(workSpaceRisk);
    }
  }, [workSpaceRisk]);

  const [anchorElColor, setAnchorElColor] = useState(null);

  const handleClickColor = (event) => {
    setAnchorElColor(event.currentTarget);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const fileReference = useRef();

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

  return (
    <>
      <div className="bg-white flex justify-between items-center h-[4em] px-8  border border-b-[#e8e8e8]">
        <div className="flex items-center space-x-5 ">
          <div className=" rounded-lg   flex items-center justify-center text-slate-50 ">
            <CompassIcon style={{ color: "black", fontSize: "25px" }} />
          </div>
          <div className=" flex space-x-5 text-[#2f2f2f] font-bold text-[18px] capitalize">
            Overview
          </div>
          {/* <input
            placeholder="Jump to Project..."
            className=" border w-[300px] mt-1 block focus:outline-[#00a99b] active:shadow-inner global-inputFiled rounded h-[40px]  border-gray-300 px-3 py-2 bg-white text-black  placeholder:text-[14px] placeholder:font-Manrope placeholder:font-semibold shadow-inner placeholder:text-[#8e8e8e] "
          /> */}
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
              <div className="bg-white h-[58px] flex justify-end items-center pr-8">
                <div className="">
                  <div className="flex space-x-6">
                    <button
                      onClick={handleListClick}
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
                    <button className="flex space-x-3 !ml-[0px] hover:text-[#00a99b] items-center justify-center  rounded-md bg-whit shadow-xs w-[10px] px-4 h-[36px] border border-gray-200">
                      <SettingsIcon onClick={() => setIsEditColumn(true)} />
                    </button>
                  </div>
                </div>
              </div>
            ) : name === "Risk" ? (
              <>
                <button
                  onClick={handleClickColor}
                  className="flex items-center justify-center  rounded-md bg-whit shadow-xs w-[34px] h-[34px] border border-gray-200 hover:!text-[#009084]"
                >
                  <div>
                    <PaletteIcon />
                  </div>
                </button>
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
                        strokeWidth="1"
                        fill="none"
                        fillRule="evenodd"
                      >
                        <g
                          id="Tasks-kanban-change-default"
                          transform="translate(-954.000000, -24.000000)"
                          fill="currentColor"
                          fillRule="nonzero"
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
                      className="icon"
                      width="11px"
                      height="11px"
                      viewBox="0 0 12 12"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
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
      <input
        type="file"
        className="hidden"
        ref={fileReference}
        onChange={submitForm}
      ></input>
    </>
  );
};

export default ProjectOverviewHeader;
