import React, { useEffect, useRef, useState } from "react";
import Divider from "@mui/material/Divider";
import {
  Box,
  CircularProgress,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import HookTextField from "hooks/Common/HookTextField";
import HookSelectField from "hooks/Common/HookSelectField";
import { useForm } from "react-hook-form";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import VideocamIcon from "@mui/icons-material/Videocam";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import NearMeIcon from "@mui/icons-material/NearMe";
import ShortcutIcon from "@mui/icons-material/Shortcut";
import MicIcon from "@mui/icons-material/Mic";
import DescriptionIcon from "@mui/icons-material/Description";
import ComputerIcon from "@mui/icons-material/Computer";
import DropboxIcon from "@mui/icons-material/CloudCircle";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import EmojiPicker from "./EmojiPicker";
import { useAddDiscussion, useGetDiscussions } from "hooks/Discussions";
import { useLocation, useNavigate } from "react-router";
import { getCurrTime } from "utils";
import CreateDocument from "./Editor";
import { links } from "static/links";
import { toBase64 } from "hooks/Common/toBase64";
import UploadFileDialog from "./FileUploadDialog";

const MainDiscussions = ({
  setDiscussionCheck,
  setDiscussionWidth,
  discussionCheck,
}) => {
  const [message, setMessage] = useState("");
  const discussionsRef = useRef(null);
  const currentDate = new Date();
  const options = { weekday: "long", month: "long", day: "numeric" };
  const formattedDate = currentDate.toLocaleDateString(undefined, options);
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.pathname.split("/").pop();
  const fileInputRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [open, setOpen] = useState(false);
  const [documentContent, setDocumentContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadFileDialog, setUploadFileDialog] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const { discussions, getDiscussionsResponse } = useGetDiscussions({ id });
  const onSuccess = (data) => {
    if (data.success) {
      setMessage("");
      setOpen(false);
      setSelectedFiles([]);
      setUploadFileDialog(false);
      setDocumentContent("");
    }
  };
  const submitDiscussion = useAddDiscussion({ onSuccess });

  useEffect(() => {
    discussionsRef.current.scrollTop = discussionsRef.current.scrollHeight;
  }, [discussions, discussionsRef]);

  const onSubmit = () => {
    const payload = {
      text: message,
      project_Id: id,
      attachments: selectedFiles,
    };
    submitDiscussion.mutate({ data: payload });
  };
  const fileReference  = useRef();

  const handleIconClick = (event) => {
    // setAnchorEl(event.currentTarget);
    fileReference?.current?.click();
  };

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files) return;

    const uploadedFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileContent = await toBase64(file);
      const uploadedFile = {
        file_name: file.name,
        file_extension: file.name.split(".").pop(),
        file_content: fileContent,
      };
      uploadedFiles.push(uploadedFile);
    }

    setSelectedFiles(uploadedFiles);
  };
  useEffect(() => {
    if (selectedFiles.length > 0) {
      setUploadFileDialog(true);
    }
  }, [selectedFiles]);

  const handleUploadFileClose = () => {
    setUploadFileDialog(false);
    setMessage("");
    setSelectedFiles([]);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOption(null);
  };
  const handleMenuItemClick = (option) => {
    // Handle the selected option accordingly
    setSelectedOption(option);
  };
  const handleSubMenuItemClick = (option) => {
    if (option === "Nifty document") {
      handleCreateDocument();
      handleMenuClose();
      return;
    }
    if (option === "Google Docs file") {
      navigate(links.appCenter);
      return;
    }
    if (option === "Your Computer") {
      fileInputRef.current.click();
      handleMenuClose();
      return;
    }
    // Handle the selected option accordingly
    handleMenuClose();
  };

  const handleCreateDocument = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleSaveDocument = () => {
    // Handle saving the document content here
    setOpen(false);
  };

  return (
    <>
      {uploadFileDialog && (
        <UploadFileDialog
          open={uploadFileDialog}
          handleClose={handleUploadFileClose}
          message={message}
          setMessage={setMessage}
          uploadedFiles={selectedFiles}
          setUploadedFiles={setSelectedFiles}
          handleSubmit={handleSubmit(onSubmit)}
          submitDiscussion={submitDiscussion}
        />
      )}
      {open && (
        <CreateDocument
          open={open}
          handleCloseDialog={handleCloseDialog}
          documentContent={documentContent}
          setDocumentContent={setDocumentContent}
          handleSaveDocument={handleSaveDocument}
        />
      )}

      <div className="w-full h-full">
        <div
          ref={discussionsRef}
          onClick={() => setShowPicker(false)}
          className="flex-col scrollBottom flex w-full font-sans h-[100%] overflow-x-auto bg-white border border-gray-200 rounded-lg shadow "
        >
          <div className="relative w-full pb-16">
            <Box sx={{ marginTop: "4px", position: "sticky" }}>
              <Divider>{formattedDate}</Divider>
            </Box>
            {discussions
              ?.slice()
              .reverse()
              .map((chat, index) => {
                return (
                  <div className="mb-4 p-6 mt-3 flex gap-3  " key={index}>
                    <span>
                      <button className=" font-semibold py-2  rounded inline-flex items-center pt-4">
                        <span className="items-center font-bold flex text-white align-middle bg-[#ffc107] border-[#f9a33ad9] h-8 w-8 pl-2 rounded-md text-[12px] ">
                          {chat?.user?.name?.substr(0, 2)?.toUpperCase() ?? ""}
                          <span>
                            <span className="h-2 m-0 absolute rounded-full top-6 right-3" />
                          </span>
                        </span>
                      </button>
                    </span>
                    <div className="pt-4 w-full">
                      <h2 className="font-semibold">
                        {chat?.user?.name}{" "}
                        <span className="text-gray-400">
                          . {getCurrTime(new Date(chat.when))}
                        </span>
                      </h2>
                      <p className="">{chat.text}</p>
                      {chat.attachments.map((el) => (
                        <img
                          src={el.file_path}
                          alt={el.file_identifier}
                          className=""
                          width={220}
                          height={250}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="sticky bottom-[47px] bg-white left-0 w-full px-5">
            <div className="w-full border border-gray-200 min-h-[50px] rounded-md px-5 relative">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex space-x-2 items-center relative">
                  <div className="absolute left-1 top-[5px]">
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileUpload}
                      multiple
                    />
                    {/* <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                      transformOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                    > */}
                      {/* {!selectedOption && (
                        <MenuList>
                          <MenuItem
                            onClick={() =>
                              handleMenuItemClick("Create a new...")
                            }
                          >
                            <ListItemIcon>
                              <CreateNewFolderIcon />
                            </ListItemIcon>
                            <ListItemText primary="Create a new..." />
                          </MenuItem>
                          <MenuItem
                            onClick={() =>
                              handleMenuItemClick("Upload a file from...")
                            }
                          >
                            <ListItemIcon>
                              <DescriptionIcon />
                            </ListItemIcon>
                            <ListItemText primary="Upload a file from..." />
                          </MenuItem>
                        </MenuList>
                      )} */}
                      {/* {selectedOption === "Create a new..." && (
                        <MenuList>
                          {DocumentUploadOptions.map((el) => (
                            <MenuItem
                              onClick={() => handleSubMenuItemClick(el.id)}
                            >
                              <ListItemText primary={el.title} />
                            </MenuItem>
                          ))}
                        </MenuList>
                      )} */}
                      {/* {selectedOption === "Upload a file from..." && (
                        <MenuList>
                          {cloudUploadOptions.map((el) => (
                            <MenuItem
                              onClick={() => handleSubMenuItemClick(el.id)}
                            >
                              <ListItemIcon>
                                <DropboxIcon />
                              </ListItemIcon>
                              <ListItemText primary={el.title} />
                            </MenuItem>
                          ))}
                        </MenuList>
                      )} */}
                    {/* </Menu> */}
                    <AddIcon
                      sx={{
                        color: "#02BBAB",
                        marginRight: "5px",
                        cursor: "pointer",
                      }}
                      onClick={handleIconClick}
                    />
                  </div>
                  <div className="w-full m-0 pr-[80px] pl-[10px] text-sm">
                    <textarea
                      onChange={(e) => {
                        setMessage(e.target.value);
                      }}
                      value={message}
                      className="bg-white outline:none w-full outline-none border-none px-[12px] rounded-md resize-none mt-2"
                    />
                  </div>
                  <div className="absolute items-center right-[6px] flex space-x-2">
                    <div className="cursor-pointer">
                      <EmojiPicker
                        setMessage={setMessage}
                        showPicker={showPicker}
                        setShowPicker={setShowPicker}
                      />
                    </div>

                    <div>
                      <button
                        disabled={submitDiscussion.isLoading}
                        type="submit"
                        className="inline-flex justify-center p-1 text-white bg-[#02bbab] rounded-md"
                      >
                        {submitDiscussion.isLoading ? (
                          <CircularProgress size={20} />
                        ) : (
                          <NearMeIcon />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <input
        type="file"
        className="hidden"
        ref={fileReference}
        onChange={handleFileUpload}
      ></input>
      </div>
    </>
  );
};

export default MainDiscussions;

const cloudUploadOptions = [
  {
    id: "Dropbox",
    title: "Dropbox",
  },
  {
    id: "OneDrive",
    title: "OneDrive",
  },
  {
    id: "Google Drive",
    title: "Google Drive",
  },
  {
    id: "Your Computer",
    title: "Your Computer",
  },
];
const DocumentUploadOptions = [
  {
    id: "Nifty document",
    title: "Nifty document",
  },
  {
    id: "Google Docs file",
    title: "Google Docs file",
  },
];
