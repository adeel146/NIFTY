import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  OutlinedInput,
  CircularProgress,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useState } from "react";
import { useGetWorkSpaceMembers } from "hooks/Workspace";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import Tooltip from "@mui/material/Tooltip";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import AddProjectTask from "components/AddProjectTask";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Avatar } from "@mui/material";
import AvatarGroup from "@mui/material/AvatarGroup";

const ManageMembersTab = () => {
  const [members, setMembers] = useState([]);
  const classes = useStyles();
  const [dropDown, setDropdown] = useState("");
  const [workspaceId, setWorkspaceId] = useState(
    localStorage.getItem("workspaceId")
  );

  const onSuccess = (data) => {
    if (data.data) {
      setMembers(data?.data?.data);
    }
  };

  const { workspaceResponse } = useGetWorkSpaceMembers({
    id: workspaceId,
    onSuccess,
  });

  console.log("workspace", members);

  return (
    <>
      <div className="w-[100%] selectedTabs">
        <div>
          <p className="text-[14px]">
            DHL WORKSPACE MEMBERS ({`${members?.length}`})
            <Tooltip
              title={
                <p
                  className="bg-[#fff] text-[#2f2f2f] text-[14px] p-[10px]"
                  style={{
                    borderRadius: "8px",
                    boxShadow: "0 2px 12px 0 rgba(0,0,0,.36)",
                  }}
                >
                  <b>Owner</b> can manage all projects, members and billing for
                  the workspace account.<br></br>
                  <br></br>
                  <b>Admins</b> are project managers that can create and archive
                  projects, as well as manage project members.<br></br>
                  <br></br>
                  <b>Members</b> can assign fellow members and create projects
                  within their portfolios but can’t invite new members into the
                  workspace.<br></br>
                  <br></br>
                </p>
              }
            >
              <IconButton>
                <ContactSupportIcon />
              </IconButton>
            </Tooltip>
          </p>
        </div>

        {workspaceResponse.isLoading ? (
          <CircularProgress className="!flex" sx={{ margin: "0 auto" }} />
        ) : (
          <div className="flex flex-wrap" style={{ flexDirection: "row" }}>
            {members && members?.length > 0
              ? members?.map((member, index) => {
                  const memberSlice = member?.name?.slice(0, 1);

                  return (
                    <Card key={index} className={classes.card} style={{maxWidth: "350px", marginBottom: "10px", marginTop: "10px"}}>
                      <CardContent>
                        <div className="flex align-center">
                          {member?.photo?.file_path ? (
                            <IconButton>
                              <img
                                className="avatar-image !w-[30px] !h-[30px]"
                                style={{ borderRadius: "10px" }}
                                src={`${member?.photo?.file_path}?tr=w-30,h-30`}
                              />
                            </IconButton>
                          ) : (
                            <>
                              <Avatar
                                className="avatar-image"
                                sx={{
                                  fontSize: "15px",
                                  borderRadius: "10px",
                                  width: "30px",
                                  height: "30px",
                                }}
                                variant="square"
                                alt={memberSlice}
                                src={memberSlice}
                              />
                            </>
                          )}

                          <div>
                            <p className="color-[#303030] text-[14px] font-[500] mb-[4px]">
                              {member?.name}
                              {member?.role == 1 ? (
                                " (you)"
                              ) : member?.role == 3 ? (
                                <Tooltip
                                  className="bg-[#fff]"
                                  title={
                                    <p
                                      className="text-[14px] p-[10px]"
                                      style={{
                                        borderRadius: "8px",
                                        boxShadow:
                                          "0 2px 12px 0 rgba(0,0,0,.36)",
                                      }}
                                    >
                                      <b>Send Message</b>
                                    </p>
                                  }
                                >
                                  <IconButton>
                                    <QuestionAnswerIcon
                                      style={{ height: "15px", width: "15px" }}
                                    />
                                  </IconButton>
                                </Tooltip>
                              ) : null}
                            </p>
                            <p className="color-[#8e94bb] text-[13px] font-[500] mt-[2px]">
                              {member?.email}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                      <CardActions
                        className="flex align-center bg-[#fafbfd] justify-between p-[6px]"
                        style={{ borderTop: "1px solid #ececec" }}
                      >
                        <p className="flex align-center text-[#8e94bb] font-[13px]">
                          {member?.role == 1 ? (
                            "Owner"
                          ) : member?.role == 2 ? (
                            "Admin"
                          ) : member?.role == 3 ? (
                            <>
                              Member
                              {/* <select
                                onChange={(e) => setDropdown(e.target.value)}
                                value={dropDown}
                              >
                                <option value="Member">Member</option>
                                <option value="Change Role">Change Role </option>
                                <option value="Remove from all projects">Remove from all projects </option>
                                <option value="Remove from your workspace">Remove from your workspace </option>
                              </select>
                              <KeyboardArrowDownIcon/> */}
                            </>
                          ) : member?.role == 4 ? (
                            "Guest"
                          ) : null}
                        </p>
                        <Button
                          className={classes.secondaryBtn}
                          style={{ textTransform: "capitalize" }}
                          // onClick={() => setIsAddWorkspace(false)}
                        >
                          See profile
                        </Button>
                      </CardActions>
                    </Card>
                  );
                })
              : null}
          </div>
        )}
        <AddProjectTask />
      </div>
    </>
  );
};

export default ManageMembersTab;

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: "100%",
    //margin: "0 auto",
    marginTop: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "left",
    width: "40%",
    marginRight: "10px",
  },
  header: {
    width: "100%",
    background: "#fafbfd",
    display: "flex",
    justifyContent: "space-between",
    padding: "16px 16px 16px 35px !important",
  },
  content: {
    textAlign: "left",
    padding: "40px 35px 16px 35px !important",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "8px",
    width: "100%",
    background: "#fafbfd",
    padding: "16px 35px 16px 35px !important",
  },
  input: {
    padding: "0px !important", // Set padding to 0 to remove the default padding
  },
  secondaryBtn: {
    boxShadow: "0 1px 2px 0 rgba(0,0,0,.14)",
    color: "#2f2f2f !important",
    padding: "0 16px",
    height: "40px",
    background: "#fff",
    fontSize: "14px !important",
    border: "1px solid #e8e8e8",
  },
  primaryBtn: {
    backgroundImage: "linear-gradient(90deg,#02bdad,#00a99b) ",
    boxShadow: "0 1px 2px 0 rgba(0,0,0,.08) !important",
    color: "#fff !important",
    fontWeight: 500,
    height: "40px ",
    padding: "0 32px",
    transition: ".15s",
    fontSize: "14px !important",
  },
}));
