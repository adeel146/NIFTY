import {
  Card,
  Box,
  Divider,
  Typography,
  Menu,
  MenuItem,
  Button,
  Snackbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ForumIcon from "@mui/icons-material/Forum";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useEditFolder, useGetFolder } from "hooks/Portfolio";
import { makeStyles } from "@mui/styles";
import moment from "moment";
import React from "react";
import HookTextField from "hooks/Common/HookTextField";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import CloseIcon from "@mui/icons-material/Close";
import Grid from "@mui/material/Grid";
import { isEmpty } from "lodash";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import { minWidth } from "@xstyled/styled-components";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import DeleteFileDialog from "./DeleteFileDialog";
import useDebounce from "hooks/Common/useDebounce";
import { useDispatch } from "react-redux";
import {
  openDeleteDialog,
  setActiveFileId,
  setActiveFolderId,
  setParentFolderId,
} from "redux/reducers/portfolio";
import { useSelector } from "react-redux";
import { useDisplayError } from "hooks/useDisplayError";
import { useParams } from "react-router";
import SourceIcon from "@mui/icons-material/Source";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

const FileManager = () => {
  const {
    control,
    watch,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    // resolver: yupResolver(),
  });

  const { projectId } = useParams();

  const dispatch = useDispatch();
  const classes = useStyles();
  const [dialog, setDialog] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [createTags, setCreateTags] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [tagId, setTagId] = useState(null);
  const [colorState, setColorState] = useState("");
  const [tagsName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState("");
  const workspaceId = localStorage.getItem("workspaceId");
  const tagName = watch("name");
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [updatedTagsList, setList] = useState([]);
  const [updatedList, seUpdatedtList] = useState([]);
  const [activeFolderId, setActiveFolderID] = useState(null);
  const [disableValue, setDisable] = useState(true);
  const [openSnackbar, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [id, setId] = useState(null);

  const parentId = useSelector((state) => state?.portfolioSlice?.parentIdState);
  const fileId = useSelector((state) => state?.portfolioSlice?.fileIdState);
  const folderId = useSelector((state) => state?.portfolioSlice?.folderIdState);
  const tagsSearch = watch("name1");
  const debounceTagsValue = useDebounce(tagsSearch, 1000);
  const debouncedValue = useDebounce(name, 5000);

  const openDialog = () => {
    setDialog(true);
  };

  const onSuccess = (data) => {
    data?.data?.data?.url?.map((file, index) => {
      if (file?.name === "Root") {
        dispatch(setParentFolderId(file?.id));
        // localStorage.setItem("rootFolderId", file.id);
      }
    });
    const tagssListtt = data?.data?.data?.content?.map((val) => {
      return {
        tags: val?.object?.tags,
        id: val?.object?.id,
      };
    });

    seUpdatedtList(tagssListtt);
  };

  const handleMouseEnter = (id) => {
    setHovered(true);
    setHoveredId(id);
    // setIsOpen(false);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setHoveredId(null);
    // setActiveFolderID(null)
    // setIsOpen(false);
  };

  const open = Boolean(anchorEl);

  const handleClick = (event, id) => {
    dispatch(setActiveFileId(id));
    setAnchorEl(event.currentTarget);
  };

  // const fileId = localStorage.getItem("fileId");
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTagsShow = () => {
    setCreateTags(true);
  };

  const handleTagsHide = () => {
    setCreateTags(false);
    setColorState("");
    setValue("name", "", {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const onSubmit = (data) => {
    const tagPayload = {
      workspace_Id: workspaceId,
      name: data?.name,
      color: colorState,
    };
    addTags(tagPayload);
  };

  const newfolderId = folderId ? folderId : parentId ? parentId : 0;

  // const Files = useGetFolder({ id: folderId, onSuccess })

  const { data: Files } = useQuery(
    ["file", newfolderId, projectId],
    () => {
      return axios.get(`/folder/${newfolderId}?project_id=${projectId}`);
    },
    {
      select: (res) => {
        return res?.data?.data;
      },
      onSuccess: (data) => {
        data?.url?.map((file, index) => {
          if (file?.name === "Root") {
            dispatch(setParentFolderId(file?.id));
          }
        });
        const tagssListtt = data?.content?.map((val) => {
          return {
            tags: val?.object?.tags,
            id: val?.object?.id,
          };
        });
        seUpdatedtList(tagssListtt);
      },
      onError: (data) => {
        enqueueSnackbar(data.response.data.message, { variant: "error" });
      },
    }
  );

  const { data: tagsAssignList, refetch } = useQuery(
    ["tags_list", workspaceId, debounceTagsValue],
    () => {
      return axios.get(
        `/tag/task/${workspaceId}?search=${
          debounceTagsValue ? debounceTagsValue : ""
        }`
      );
    },
    {
      select: (res) => {
        return res?.data?.data;
      },
      onError: (data) => {
        enqueueSnackbar(data.response.data.message, { variant: "error" });
      },
    }
  );

  useEffect(() => {
    queryClient.invalidateQueries("file");
    // setName("");
    setId(null);
  }, [folderId]);

  const { mutate: tagDelete } = useMutation({
    mutationKey: ["tag_delete"],
    mutationFn: (id) => axios.delete(`/tag/${id}`),
    onSuccess: (data) => {
      if (data?.data?.success) {
        enqueueSnackbar(data.data.message, { variant: "success" });
        // queryClient.invalidateQueries(["tags_list"]);
        refetch();
        queryClient.invalidateQueries(["file"]);
      }
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  const { mutate: addTags, isLoading: tagLoading } = useMutation({
    mutationKey: ["task_tags"],
    mutationFn: (data) => axios.post(`/tag/task`, data),
    onSuccess: (data) => {
      if (data?.data?.success) {
        enqueueSnackbar(data.data.message, { variant: "success" });
        // queryClient.invalidateQueries(["tags_list"]);
        refetch();
        queryClient.invalidateQueries(["file"]);
        setValue("name", "", {
          shouldDirty: true,
          shouldValidate: true,
        });
        setCreateTags(false);
        setColorState("");
      }
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  const { mutate: updateTags } = useMutation({
    mutationKey: ["tags_update"],
    mutationFn: (id) => axios.put(`File/update_tag/${fileId}/?tag_id=${id}`),
    onSuccess: (data) => {
      if (data?.data?.success) {
        enqueueSnackbar(data.data.message, { variant: "success" });
        // queryClient.invalidateQueries(["tags_list"]);
        refetch();
        queryClient.invalidateQueries(["file"]);
      }
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  const periorityTag = tagsAssignList?.filter((val) => {
    return val?.isCustom === false;
  });

  const customTags = tagsAssignList?.filter((val) => {
    return val?.isCustom === true;
  });

  const setFolderId = (id, type, parent_Id, isContextMenu) => {
    if (isContextMenu && type == "Folder") {
      setActiveFolderID(id);
    }
    if (!isContextMenu && type == "Folder") {
      dispatch(setActiveFolderId(id));
    } else {
      dispatch(setActiveFileId(id));
    }

    if (type && parent_Id) {
      localStorage.setItem("type", type);
      dispatch(setParentFolderId(parent_Id));
    } else {
      localStorage.setItem("type", "");
    }
  };

  const editFolderName = (data) => {
    // setId(null)
    //  setName("")
  };

  const editFolder = useEditFolder({
    id: activeFolderId,
    parentId: parentId,
    debouncedValue: debouncedValue,
    onSuccess: editFolderName,
  });
  const error = editFolder.error;
  useDisplayError(error);

  const EditName = (id) => {
    setId(id);
    setName("");
    // setDisable(false);
  };

  const submitData = (e) => {
    setName(e);

    const body = {
      name: e,
      description: "",
      parent_Id: parentId,
    };
    editFolder?.mutate({ data: body });
    // setName("")
  };

  const handleClickCopyURL = (filePath) => {
    setOpen(true);
    navigator.clipboard.writeText(filePath);
  };

  return (
    <>
      <div className="relative">
        {/* <CustomLoader isLoading={[addLoading].includes(true)} /> */}
        <Stack spacing={2} className="mx-[2rem] my-[3rem]">
          <Breadcrumbs separator="/" aria-label="breadcrumb">
            {Files?.url?.map((number) => {
              return (
                <>
                  <Link
                    className="py-[1rem]  cursor-pointer"
                    style={{ borderRadius: "3px", textDecoration: "none" }}
                    // sx={BtnStyling}
                    onClick={() => setFolderId(number?.id, "Folder")}
                  >
                    {number?.name}
                  </Link>
                </>
              );
            })}
          </Breadcrumbs>
        </Stack>
        {Files && Files?.content?.length > 0 ? (
          Files?.content?.map((file, index) => {
            const fileExtension = file?.object?.file_name?.split(".").pop();
            console.log("files", fileExtension)
            return (
              <>
                <div class="py-3 w-full px-7 mt-5 flex justify-between">
                  <div class=" flex items-center">
                    <div
                      class="w-[117px] h-[80px] shadow-md px-4 flex-[0_0_auto] rounded-lg items-center flex justify-center border"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setFolderId(
                          file?.object?.id,
                          file?.type,
                          file?.object?.parent_Id,
                          false
                        );
                      }}
                    >
                      {file?.type == "Folder" ? (
                        <FolderOpenIcon className="!w-36 !h-[70px]" />
                      ) : (
                        <>
                          {file?.object?.file_name ? (
                            fileExtension ==
                            "docx"? (
                              <SourceIcon className="!w-36 !h-[70px]" />
                            ) : fileExtension ==
                              "pdf" ? (
                              <PictureAsPdfIcon className="!w-36 !h-[70px]" />
                            ) : (
                              <img
                                src={file?.object?.file_path}
                                alt=""
                                class="w-16 h-[70px]"
                              ></img>
                            )
                          ) : null}
                        </>
                      )}
                    </div>
                    <div class="px-5 ">
                      <div
                        class="flex items-center gap-2 "
                        onMouseEnter={() => handleMouseEnter(file?.object?.id)} //portfolio?.id
                        onMouseLeave={handleMouseLeave}
                      >
                        {id !== file?.object?.id ? (
                          <>
                          {file?.type == "Folder" ? (
                                                        <h4 className="font-semibold text-base min-h-[25px] mb-0 cursor-pointer" onClick={(e) => {
                                                          e.stopPropagation();
                                                          e.preventDefault();
                                                          setFolderId(
                                                            file?.object?.id,
                                                            file?.type,
                                                            file?.object?.parent_Id,
                                                            false
                                                          );
                                                        }}>
                                                        {file?.type == "Folder"
                                                          ? file?.object?.name
                                                          : file?.object?.file_name}
                                                      </h4>
                          ): (
                            <h4 className="font-semibold text-base min-h-[25px] mb-0 cursor-pointer">
                              {file?.type == "Folder"
                                ? file?.object?.name
                                : file?.object?.file_name}
                            </h4>
                          )}

                          </>
                        ) : (
                          <input
                            className="font-semibold text-base min-h-[25px] mb-0 cursor-pointer"
                            style={{ background: "none" }}
                            value={name}
                            placeholder={
                              file?.type == "Folder"
                                ? file?.object?.name
                                : file?.object?.file_name
                            }
                            // disabled={disableValue}
                            onChange={(e) => submitData(e.target.value)}
                          />
                        )}

                        <div class="group relative">
                          <span className="w-[30px]">
                            <IconButton
                              className={
                                hovered && hoveredId == file?.object?.id
                                  ? classes.visibleDiv
                                  : classes.hiddenDiv
                              }
                            >
                              <MoreHorizIcon
                                className="text-[#fff]"
                                width="1.0277777777777777em"
                                height="0.6111111111111112em"
                                style={{ color: "gray" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // e.preventDefault()
                                  setFolderId(
                                    file?.object?.id,
                                    file?.type,
                                    file?.object?.parent_Id,
                                    true
                                  );
                                }}
                              />
                            </IconButton>
                          </span>
                          <div class=" invisible rounded w-44 absolute left-0  opacity-100 z-[999] transition-all  group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-1  border-[#ececec] bg-white border -mt-3 shadow-md">
                            {file.type == "File" ? (
                              <>
                                {/* <ul class="py-2 hover:bg-[#f2fffe] text-black font-normal text-base  hover:text-[#00b8a9] ">
                        <li class="">
                          <a href="#" class="px-4 py-2 ">
                            Share
                          </a>
                        </li>
                      </ul> */}
                                <hr></hr>
                                <ul class="py-2 hover:bg-[#f2fffe] text-black font-normal hover:text-[#00b8a9] ">
                                  <li
                                    onClick={() =>
                                      handleClickCopyURL(
                                        file?.object?.file_path
                                      )
                                    }
                                  >
                                    <a href="#" class="px-4 py-2">
                                      Copy URL
                                    </a>
                                  </li>
                                  <Snackbar
                                    open={openSnackbar}
                                    onClose={() => setOpen(false)}
                                    autoHideDuration={2000}
                                    message="Copied to clipboard"
                                  />
                                </ul>
                                <hr></hr>
                                <ul class="py-2 hover:bg-[#f2fffe] text-black font-normal hover:text-[#00b8a9]">
                                  <li
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      // file?.type == "File" ? dispatch(setActiveFileId(file?.object?.id)): null
                                      dispatch(openDeleteDialog());
                                    }}
                                  >
                                    <span class="px-4 py-2">Delete</span>
                                  </li>
                                </ul>
                              </>
                            ) : (
                              <>
                                <ul class="py-2 hover:bg-[#f2fffe] text-black font-normal text-base  hover:text-[#00b8a9] ">
                                  <li
                                    class=""
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      EditName(file?.object?.id);
                                    }}
                                  >
                                    <a href="#" class="px-4 py-2 ">
                                      Edit name
                                    </a>
                                  </li>
                                </ul>
                                <hr></hr>
                                <ul class="py-2 hover:bg-[#f2fffe] text-black font-normal hover:text-[#00b8a9]">
                                  <li
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      // file?.type == "File" ? dispatch(setActiveFileId(file?.object?.id)): null
                                      dispatch(openDeleteDialog());
                                    }}
                                  >
                                    <span class="px-4 py-2">Delete Folder</span>
                                  </li>
                                </ul>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <ul class="mb-1 text-sm text-[#8e94bb] font-normal">
                        <li>
                          <time>
                            {" "}
                            {file?.type == "Folder"
                              ? `Created on ${moment(file?.object?.when).format(
                                  "MMM DD, h:mm"
                                )}`
                              : moment(file?.object?.when).format(
                                  "MMM DD, h:mm"
                                )}
                          </time>{" "}
                          by{" "}
                          {file?.object?.username
                            ? file?.object?.username
                            : "admin"}
                        </li>
                        <li>{file?.object?.fileSize}</li>
                        {file?.type == "File" ? (
                          <li class="flex items-center gap-[6px] ">
                            <div>
                              <svg
                                class="icon "
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
                            </div>

                            <div
                              onClick={(e) => handleClick(e, file?.object?.id)}
                            >
                              {/* {updatedList ? (
                      <span class="text-[#00a99b] font-medium">
                        Add tags
                      </span>
                    ) : ( */}
                              <div
                                onClick={handleClick}
                                className="cursor-pointer flex items-center !w-[370px]"
                              >
                                <Grid container spacing={2}>
                                  {updatedList?.map((val) => {
                                    return file?.object?.id === +val?.id ? (
                                      val?.tags?.length == 0 ? (
                                        <span class="text-[#00a99b] font-medium text-center pl-[1em] pt-[1em]">
                                          Add tags
                                        </span>
                                      ) : (
                                        val?.tags?.map((tag) => {
                                          return (
                                            <>
                                              <Grid item xs={6}>
                                                <div
                                                  className="rounded-md !px-[20px] text-[#fff] font-bold h-auto flex items-center justify-center !flex-wrap"
                                                  style={{
                                                    background: tag?.color,
                                                    width: "177px",
                                                  }}
                                                >
                                                  {tag?.name}
                                                </div>
                                              </Grid>
                                            </>
                                          );
                                        })
                                      )
                                    ) : null;
                                  })}
                                </Grid>
                              </div>
                              {/* // )
                    // } */}
                            </div>
                          </li>
                        ) : null}
                      </ul>
                    </div>
                  </div>
                  {file?.type == "File" ? (
                    <div class="mt-3 mr-2">
                      <div class="flex gap-3">
                        <Button
                          variant="contained"
                          className=" border !h-9 !w-9 !text-[#000] !bg-white items-center !px-[6px] !py-[5px]
                        rounded-md hover:shadow-md"
                          style={{ minWidth: "2.25rem", minHeight: "2.25rem" }}
                          href={file?.object?.file_path}
                          download
                        >
                          <FileDownloadIcon className="!h-5 !w-5" />
                        </Button>
                        {/* <div
              class=" border h-9 w-9 bg-white items-center pl-[7px] pt-[8px]
                        rounded-md  hover:shadow-md"
            >
              <ForumIcon className="h-5 w-5" />
            </div> */}
                      </div>
                    </div>
                  ) : null}
                </div>
                <Divider />
              </>
            );
          })
        ) : (
          <h2 className="mx-[2rem] my-[3rem]"> No Files to Display</h2>
        )}
        <DeleteFileDialog
          type={
            localStorage.getItem("type") ? localStorage.getItem("type") : "File"
          }
          id={
            localStorage.getItem("type") == "Folder"
              ? activeFolderId
                ? activeFolderId
                : parentId
              : fileId
          }
          parentId={parentId}
        />
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          sx={{ marginTop: "2px" }}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          {createTags ? (
            <div>
              <MenuItem
                sx={{
                  width: "240px",
                  height: "340px",
                  overflow: "auto",
                  background: "white",
                  paddingLeft: "8px",
                  paddingRight: "8px",
                }}
              >
                <div>
                  <div className="flex justify-between">
                    <div>Create Tag</div>
                    <div onClick={handleTagsHide} className="cursor-pointer">
                      <CloseIcon sx={{ fontSize: "16px" }} />
                    </div>
                  </div>
                  <form>
                    <div onSubmit={handleSubmit(onSubmit)}>
                      <HookTextField
                        name="name"
                        control={control}
                        errors={errors}
                        placeholder={"Type a name..."}
                      />
                    </div>
                  </form>

                  <Box>
                    <Grid container spacing={1}>
                      {tagsColors?.map((val) => {
                        return (
                          <Grid item xs={3}>
                            <div
                              onClick={() => setColorState(val.color)}
                              className="h-[30px] w-[47px] rounded flex items-center justify-center"
                              style={{ background: val.color }}
                            >
                              {val.color === colorState && (
                                <CheckIcon
                                  sx={{
                                    fontSize: "15px",
                                    color: val?.tickColor,
                                  }}
                                />
                              )}
                            </div>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                  <div className="mt-2">
                    <Divider />
                  </div>

                  <div className="flex space-x-1 mt-3">
                    <button
                      onClick={handleTagsHide}
                      className="flex justify-center items-center h-[30px] w-[80px] text-black text-[13px] rounded bg-white border border-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit(onSubmit)}
                      type="submit"
                      disabled={isEmpty(tagName)}
                      className="flex justify-center items-center h-[30px] text-[13px] w-[80px] text-white rounded bg-[#00A99B]"
                    >
                      {tagLoading ? (
                        <div
                          className="w-[20px] h-[20px] rounded-full animate-spin absolute
                                  border border-solid border-white border-t-transparent"
                        ></div>
                      ) : (
                        "Create"
                      )}
                    </button>
                  </div>
                </div>
              </MenuItem>
            </div>
          ) : (
            <MenuItem
              sx={{
                width: "240px",
                height: "",
                overflow: "auto",
                background: "white",
                padding: "9px",
              }}
            >
              <div className="flex flex-col">
                <div className="h-[300px] overflow-auto px-2">
                  <div className="">Tags</div>

                  <div className="">
                    <HookTextField
                      name="name1"
                      control={control}
                      errors={errors}
                      placeholder={"Search tags..."}
                    />
                  </div>
                  <div>
                    {periorityTag?.map((val) => {
                      return (
                        <div
                          onClick={() => {
                            setTagId(val?.id);
                            updateTags(val?.id);
                            setTagName(val?.name);
                            setTagColor(val?.color);
                          }}
                          className={`w-full h-[30px] text-white rounded flex items-center font-[500] justify-center mb-1`}
                          style={{
                            background: val.color,
                            color: val?.textColor,
                            fontSize: "0.8rem",
                          }}
                        >
                          <h1 className="">
                            {val.name} &nbsp;{" "}
                            {val?.id === tagId && (
                              <CheckIcon sx={{ fontSize: "18px" }} />
                            )}{" "}
                          </h1>
                        </div>
                      );
                    })}
                  </div>
                  {/* custom tags */}

                  <h3 className="py-2">Custom Tags</h3>
                  <div>
                    {customTags?.map((val) => {
                      return (
                        <div className="flex space-x-2 items-center">
                          <div
                            key={val.id}
                            onClick={() => {
                              setTagId(val.id);
                              updateTags(val?.id);
                              setTagName(val?.name);
                              setTagColor(val?.color);
                            }}
                            className={`w-[85%] h-[30px] text-white rounded flex items-center font-[500] justify-center mb-1`}
                            style={{
                              background: val?.color,
                              fontSize: "0.8rem",
                            }}
                          >
                            <h1 className="flex space-x-2 items-center">
                              {val?.name} &nbsp;
                              {val?.id === tagId && (
                                <CheckIcon sx={{ fontSize: "18px" }} />
                              )}
                            </h1>
                          </div>
                          <div className="w-[2%]">
                            {val?.id === tagId && (
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  tagDelete(val?.id);
                                }}
                              >
                                <DeleteIcon
                                  sx={{
                                    fontSize: "20px",
                                    color: val?.color,
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex space-x-1 items-center mt-4 border border-t-gray-300 rounded">
                  <AddIcon sx={{ fontSize: "18px" }} />
                  <h3
                    className="text-[14px] cursor-pointer"
                    onClick={handleTagsShow}
                  >
                    Create a New Tag
                  </h3>
                </div>
              </div>
            </MenuItem>
          )}
        </Menu>

        {/* <Menu
        anchorEl={anchorElRename}
        open={Boolean(anchorElRename)}
        onClose={handleMenuCloseRename}
      >
        <MenuItem onClick={handleRenameTodo}>Edit Name</MenuItem>
      </Menu> */}
      </div>
    </>
  );
};

export default FileManager;

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
}));

const tagsColors = [
  {
    color: "#00B0A1",
  },
  {
    color: "#FF9946",
  },
  {
    color: "#D057F0",
  },
  {
    color: "#525252",
    tickColor: "white",
  },
  {
    color: "#F8BC0B",
  },
  {
    color: "#FF644F",
  },
  {
    color: "#7DD0FC",
  },
  {
    color: "#E8E8E8",
    tickColor: "black",
  },
  {
    color: "#0FDCB1",
  },

  {
    color: "#7457FA",
    tickColor: "white",
  },
  {
    color: "#0D2578",
    tickColor: "white",
  },
  {
    color: "#7121CF",
    tickColor: "white",
  },
  {
    color: "#45A9FF",
  },
  {
    color: "#FF5CAB",
  },
  {
    color: "#BF741D",
  },
  {
    color: "#E2ECF5",
    tickColor: "black",
  },
  {
    color: "#FEE3E3",
    tickColor: "black",
  },
  {
    color: "#F3EBD6",
    tickColor: "black",
  },
  {
    color: "#B0B0B0",
    tickColor: "black",
  },
  {
    color: "#FFE330",
    tickColor: "black",
  },
];
