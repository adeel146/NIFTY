import React, { useState } from "react";
import ListAltIcon from "@mui/icons-material/ListAlt";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import Checkbox from "@mui/material/Checkbox";
import { Divider, Popover, Tooltip } from "@mui/material";
import DateRangeIcon from "@mui/icons-material/DateRange";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AddIcon from "@mui/icons-material/Add";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CalculateIcon from "@mui/icons-material/Calculate";
import SubjectIcon from "@mui/icons-material/Subject";
import RepeatOneOnIcon from "@mui/icons-material/RepeatOneOn";
import RadarIcon from "@mui/icons-material/Radar";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import InsightsIcon from "@mui/icons-material/Insights";
import WhiteButton from "hooks/Common/commonButtons/WhiteButton";
import Fade from "react-reveal/Fade";
import { useDispatch, useSelector } from "react-redux";
import { subTaskShow, taskDrawyerOpen } from "redux/actions";
import { useSnackbar } from "notistack";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import { Box } from "@mui/system";
import Select from "react-select";
import HookSelectField from "hooks/Common/HookSelectField";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";

const MilestoneOpenTasks = ({ tasks }) => {
  const { milestoneId: mileStoneId } = useSelector(
    (state) => state?.dashbordSlice
  );

  const [showFields, setShowFields] = useState(false);
  const [taskVal, seTtaskVal] = useState("");
  const [name, setName] = useState("Create New");
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const workspaceId = localStorage.getItem("workspaceId");

  const { mutate } = useMutation({
    mutationKey: ["addMilestoneTask"],
    mutationFn: (data) => axios.post("/task/milestone", data),
    onSuccess: (data) => {
      seTtaskVal("");
      enqueueSnackbar(data.data.message, { variant: "success" });
      queryClient.invalidateQueries(["milestone_details_list"]);
      queryClient.invalidateQueries(["get-milestone"]);
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });
  const { mutate: updateAssignee } = useMutation({
    mutationKey: ["task/update_assignee"],
    mutationFn: (data) =>
      axios.put(
        `/task/update_assignee/${data.TaskId}?assignee=${data.assignee}`
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["milestone_details_list"]);
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });
  const { mutate: updateTaskCompleted } = useMutation({
    mutationKey: ["updateTaskCompleted"],
    mutationFn: (TaskId) => axios.put(`task/update_completed/${TaskId}`),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["milestone_details_list"]);
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  const { data: usersList } = useQuery({
    queryKey: "workspace/workspace_members",
    queryFn: () => axios.get(`workspace/workspace_members/${workspaceId}`),
    select: (res) => {
      return res?.data?.data.map((val) => {
        return {
          value: val?.user_Id,
          label: val?.name,
        };
      });
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
    refetchOnWindowFocus: false,
  });

  const handleSubmit = () => {
    if (!taskVal) return;
    let payload = {
      name: taskVal,
      mileStone_Id: mileStoneId,
    };
    mutate(payload);
  };

  const handleAssigntoChange = (event, TaskId) => {
    let Id = event.value;
    let payload = {
      TaskId,
      assignee: Id,
    };
    updateAssignee(payload);
  };

  const handleTaskCompleted = (TaskId) => {
    updateTaskCompleted(TaskId);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex space-x-2 items-center">
          <ListAltIcon sx={{ color: "#B1B5D0", fontSize: "15px" }} />
          <h3 className="text-[14px]">Tasks</h3>
        </div>
        <div className="flex space-x-3 items-center ">
          <CompareArrowsIcon sx={{ color: "#B1B5D0", fontSize: "22px" }} />
          <h3 className="text-[14px]">Status</h3>
        </div>
      </div>
      {tasks?.map((task) => {
        return (
          <div key={task.id}>
            <div className="mt-[1rem] flex justify-between items-center">
              <div className="flex flex-col items-center">
                <div className="flex items-center">
                  <div>
                    <Checkbox
                      onChange={() => handleTaskCompleted(task.id)}
                      color="success"
                    />
                  </div>
                  <h3>{task.taskName}</h3>
                </div>
              </div>
              <div className=" text-sm flex space-x-2 items-center">
                <div>
                  <AvatarGroup
                    sx={{
                      "& .MuiAvatar-root": {
                        width: 24,
                        height: 24,
                        fontSize: 15,
                      },
                    }}
                    variant="rounded"
                    spacing="medium"
                    total={task?.assignees.length}
                    max={3}
                  >
                    {task?.assignees?.map((obj, index) => {
                      return (
                        <Avatar
                          key={index}
                          alt="Travis Howard"
                          src={obj.image.file_path}
                        />
                      );
                    })}
                  </AvatarGroup>
                </div>
                <PopupState variant="popover" popupId="demo-popup-popover">
                  {(popupState) => (
                    <div>
                      <div
                        {...bindTrigger(popupState)}
                        className="w-max cursor-pointer border border-gray-300 rounded-md bg-white flex items-center justify-center"
                      >
                        <Tooltip title="Add assignee" arrow>
                          <PersonAddIcon
                            sx={{ color: "#00A99B", fontSize: "18px" }}
                          />
                        </Tooltip>
                      </div>
                      <Popover
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
                              options={usersList}
                              placeholder="Search..."
                              onChange={(e) => handleAssigntoChange(e, task.id)}
                            />
                          </div>
                        </Box>
                      </Popover>
                    </div>
                  )}
                </PopupState>
                <div>To do</div>
              </div>
            </div>
            <div className="ml-[2.5rem] flex space-x-6">
              <div className="flex space-x-1 items-center">
                <DateRangeIcon sx={{ fontSize: "14px", color: "#B1B5D0" }} />
                <h6 className="text-[12px] text-[#B1B5D0] font-[700]">
                  {moment(task.dueDate).format("MMM DD, h:mm")}
                </h6>
              </div>
              <div
                className="flex space-x-1 items-center cursor-pointer"
                onClick={() => dispatch(taskDrawyerOpen(task.id))}
              >
                <AssignmentIcon sx={{ fontSize: "14px", color: "#B1B5D0" }} />
                <h6 className="text-[12px] text-[#B1B5D0] font-[700]">
                  {task.subTaskCount} sub Task
                </h6>
              </div>
            </div>
          </div>
        );
      })}
      <div className="mt-[1rem]">
        <Divider />
      </div>
      <div className="mt-[0.1px] relative">
        <span className="absolute top-1 px-6">
          <AddIcon sx={{ fontSize: "22px", color: "#B1B5D0" }} />
        </span>
        <input
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
          value={taskVal}
          onChange={(e) => seTtaskVal(e.target.value)}
          placeholder="Add a new Task ..."
          className="outline-none w-full border-t text-[12px] font-[500] border-gray-200 border-b h-[35px] pl-[3rem]"
        />
      </div>
      <div className="mt-[1rem] flex space-x-2 items-center">
        <h3 className="text-[13px] font-[500]">Custom Fields</h3>
        <div
          onClick={() => setShowFields(!showFields)}
          className="flex cursor-pointer justify-center items-center p-2 h-[20px] w-[20px] rounded-md bg-white shadow-sm border border-gray-200"
        >
          <AddIcon sx={{ fontSize: "16px", color: "#009084" }} />
        </div>
      </div>
      <div>
        {showFields && (
          <>
            <div className="flex space-x-4 mt-5">
              {fieldList.map((val) => {
                return (
                  <div
                    onClick={() => setName(val?.name)}
                    className="cursor-pointer"
                  >
                    <h3
                      className={` ${
                        val.name === name
                          ? "text-[#00A99B] border-b-2 border-[#00A99B] cursor-pointer"
                          : ""
                      } text-[13px] font-[500]`}
                    >
                      {val.name}
                    </h3>
                  </div>
                );
              })}
            </div>
            <div className="mt-[1rem]">
              {name == "Create New" ? (
                <FileType />
              ) : (
                <ChooseLibrary setName={setName} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MilestoneOpenTasks;

const fieldList = [
  {
    name: "Create New",
  },
  {
    name: "Choose From Library",
  },
];

const FileType = () => {
  const [bgColor, setBgColor] = useState();

  return (
    <Fade left className="">
      <div className="flex flex-wrap rounded-md border border-gray-100  ">
        {fileTypeList.map((val, index) => {
          return (
            <div
              className="w-[100px] space-x-5 mx-2 mt-2 cursor-pointer"
              key={index}
              onClick={() => setBgColor(val?.id)}
            >
              <div
                className={` ${
                  val.id === bgColor
                    ? "bg-[#F2F8FA] border border-[#00A99B] "
                    : "bg-white border border-gray-200"
                }  shadow-sm  flex items-center  justify-center w-full h-[38px] rounded-md`}
              >
                <Tooltip title={val.toolTipText} arrow>
                  {val.icon}
                </Tooltip>
              </div>
            </div>
          );
        })}
      </div>
    </Fade>
  );
};

const ChooseLibrary = ({ setName }) => {
  return (
    <div>
      <h1 className="text-[12px] text-[#B1B5D0]">
        Saved custom fields will be accessible here.
      </h1>
      <div className="mt-[1rem]">
        <WhiteButton buttonText="Back" onClick={() => setName("Create New")} />
      </div>
    </div>
  );
};

const fileTypeList = [
  {
    id: 1,
    icon: (
      <MonetizationOnIcon
        sx={{
          fontSize: "17px",
          borderRadius: "50px",
          background: "#F2F8FA",
          color: "#00A99B",
        }}
      />
    ),
    toolTipText: "Budget",
  },
  {
    id: 2,
    icon: <InsightsIcon sx={{ fontSize: "16px", color: "#EDC372" }} />,
    toolTipText: "Text",
  },
  {
    id: 3,
    icon: <SubjectIcon sx={{ fontSize: "16px", color: "#CA5DE7" }} />,
    toolTipText: "Dropdown",
  },
  {
    id: 4,
    icon: <RepeatOneOnIcon sx={{ fontSize: "15px", color: "#DF9E7B" }} />,
    toolTipText: "Number",
  },
  {
    id: 5,
    icon: (
      <ContentPasteSearchIcon sx={{ fontSize: "16px", color: "#2C94CA" }} />
    ),
    toolTipText: "URL",
  },
  {
    id: 6,
    icon: <LocalPhoneIcon sx={{ fontSize: "16px", color: "#CF6C38" }} />,
    toolTipText: "Phone",
  },
  {
    id: 7,
    icon: <PersonIcon sx={{ fontSize: "16px", color: "#56A9D4" }} />,
    toolTipText: "Email",
  },
  {
    id: 8,
    icon: (
      <EmailIcon
        sx={{
          fontSize: "16px",
          borderRadius: "50px",
          background: "#F2F8FA",
          color: "#E6AA39",
        }}
      />
    ),
    toolTipText: "Location",
  },
  {
    id: 9,
    icon: <RadarIcon sx={{ fontSize: "16px", color: "#DE9AEF" }} />,
    toolTipText: "Currency",
  },
  {
    id: 10,
    icon: (
      <CheckCircleOutlineIcon
        sx={{
          fontSize: "17px",
          borderRadius: "50px",
          background: "#F2F8FA",
          color: "#00A99B",
        }}
      />
    ),
    toolTipText: "Checkbox",
  },
  {
    id: 11,
    icon: <CalendarMonthIcon sx={{ fontSize: "16px", color: "#E6AA39" }} />,
    toolTipText: "Date",
  },
  {
    id: 12,
    icon: <CalculateIcon sx={{ fontSize: "16px", color: "#80BEDE" }} />,
    toolTipText: "Formula",
  },
];
