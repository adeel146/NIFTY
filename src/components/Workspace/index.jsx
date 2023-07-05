import { memo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import NiftyLogo from "/images/logo-three60.png";
import "./workspace.css";
import { makeStyles } from "@mui/styles";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import AddWorkspace from "./AddWorkspace";
import { useGetWorkSpace } from "hooks/Workspace";
import { useDispatch, useSelector } from "react-redux";
import { onWorkspaceGetSuccess } from "redux/actions";
import { generateRandomColor } from "utils";
import { useNavigate } from "react-router";
import { links } from "static/links";
import { useAuth } from "hooks/useAuth";

const Workspace = () => {
  const [isAddWorkspace, setIsAddWorkspace] = useState(false);
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { workspaces = [] } = useSelector(({ workspace }) => workspace);
  const { user } = useAuth();

  const handleAddWorkspace = () => {
    setIsAddWorkspace(true);
  };
  const onSuccess = (data) => {
    dispatch(onWorkspaceGetSuccess(data?.data?.data));
  };
  const { workspaceResponse } = useGetWorkSpace({ onSuccess });

  if (workspaceResponse.isLoading)
    return <CircularProgress className="!flex" sx={{ margin: "0 auto" }} />;
  if (isAddWorkspace)
    return <AddWorkspace setIsAddWorkspace={setIsAddWorkspace} />;
  return (
    <>
      <div>
        <div className="login-wrapprt h-screen w-full">
          <div className="login-container m-auto flex h-full justify-center items-center flex-col">
            <div className="text-center w-full flex justify-center mt-5">
              <a href="#">
                <img src={NiftyLogo} alt="" className="w-28" />
              </a>
            </div>
            <div className="bg-white flex login-content justify-center w-full mt-7">
              <div className=" border-[#f1f1f1] p-10">
                <div className="mb-8 flex flex-col items-center ">
                  <h2 className="color-[#373737] font-400 text-[24px] mb-2">
                    Welcome back, {user?.name}!
                  </h2>
                  <p className="mb-8">
                    Which workspace would you like to access?
                  </p>

                  <Grid
                    container
                    spacing={2}
                    className="text-center justify-center flex"
                  >
                    {workspaces?.map((workSpace, index) => (
                      <Grid item key={index}>
                        <Box
                          className={classes.box}
                          onClick={() => {
                            localStorage.setItem("workspaceId", workSpace.id);
                            navigate(`${links.myWork}`);
                          }}
                          sx={{
                            "& > .username": {
                              background: generateRandomColor(),
                            },
                          }}
                        >
                          <Typography
                            variant="h6"
                            component="span"
                            className="username"
                          >
                            {workSpace.name.substr(0, 2)}
                          </Typography>
                        </Box>
                        <Typography className="text-[#1f2b37] w-[128px] break-words font-[16px] font-700 text-center">
                          {workSpace.name}
                        </Typography>
                      </Grid>
                    ))}
                    <Grid item>
                      <Box
                        className={classes.createBox}
                        onClick={handleAddWorkspace}
                      >
                        <AddIcon />
                      </Box>
                      <Typography className="text-[#1f2b37] w-[128px] break-words font-[16px] font-700 text-center">
                        Create New Workspace
                      </Typography>
                    </Grid>
                  </Grid>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(Workspace);

const useStyles = makeStyles((theme) => {
  return {
    box: {
      height: "128px",
      width: "128px",
      border: `1px solid #80808040`,
      borderRadius: "4px",
      boxShadow: "0 1px 2px 0 rgba(0,0,0,.08)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 24,
      fontWeight: "bold",
      cursor: "pointer",
      "&:hover": {
        boxShadow: "0 1px 10px 0 rgba(0,0,0,.2)",
        transition: ".8s",
      },
      "& > .username": {
        display: "inline-block",
        fontWeight: "bold",
        fontSize: "20px",
        height: "72px",
        width: "72px",
        borderRadius: "4%",
        textAlign: "center",
        lineHeight: "80px",
        color: "white",
      },
    },
    createBox: {
      height: "128px",
      width: "128px",
      border: `1px solid #80808040`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 24,
      fontWeight: "bold",
      cursor: "pointer",
      "&:hover": {
        boxShadow: "0 1px 10px 0 rgba(0,0,0,.2)",
        transition: ".8s",
      },
    },
  };
});

// const useStyles = makeStyles((theme) => ({
//   box: {
//     height: "128px",
//     width: "128px",
//     border: `1px solid #80808040`,
//     borderRadius: "4px",
//     boxShadow: "0 1px 2px 0 rgba(0,0,0,.08)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: 24,
//     fontWeight: "bold",
//     cursor: "pointer",
//     "&:hover": {
//       boxShadow: "0 1px 10px 0 rgba(0,0,0,.2)",
//       transition: ".8s",
//     },
//     "& > .username": {
//       display: "inline-block",
//       fontWeight: "bold",
//       fontSize: "20px",
//       height: "72px",
//       width: "72px",
//       borderRadius: "4%",
//       textAlign: "center",
//       lineHeight: "80px",
//       background: generateRandomColor(),
//       color: "white",
//     },
//   },
//   createBox: {
//     height: "128px",
//     width: "128px",
//     border: `1px solid #80808040`,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: 24,
//     fontWeight: "bold",
//     cursor: "pointer",
//     "&:hover": {
//       boxShadow: "0 1px 10px 0 rgba(0,0,0,.2)",
//       transition: ".8s",
//     },
//   },
// }));
