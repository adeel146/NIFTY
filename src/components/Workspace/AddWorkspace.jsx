import React, { memo } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Button,
  InputAdornment,
  OutlinedInput,
  CircularProgress,
} from "@mui/material";

import { makeStyles } from "@mui/styles";
import CloseIcon from "@mui/icons-material/Close";
import "./workspace.css";
import { Controller, useForm } from "react-hook-form";
import HookTextField from "hooks/Common/HookTextField";
import { ErrorMessage } from "@hookform/error-message";
import { useAddWorkspace } from "hooks/Workspace";
import { useDisplayError } from "hooks/useDisplayError";
import { workspaceSchema } from "validations/workspace";
import { yupResolver } from "@hookform/resolvers/yup";
import { paddingRight } from "@xstyled/styled-components";

const AddWorkspace = ({ setIsAddWorkspace }) => {
  const classes = useStyles();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(workspaceSchema),
  });

  const onSuccess = (data) => {
    if (data) {
      reset({ name: "", url: "" });
      setIsAddWorkspace(false);
    }
  };

  const addWorkspace = useAddWorkspace({ onSuccess });

  const isLoading = addWorkspace.isLoading;
  const error = addWorkspace.error;
  useDisplayError(error);

  const onSubmit = (data) => {
    addWorkspace.mutate({ data });
  };
  return (
    <div>
      <div className="addworkspace-wrapprt h-screen w-full">
        <div className=" m-auto flex h-full justify-center items-center flex-col">
          <Card
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            className={classes.card}
          >
            <CardHeader
              sx={{
                borderBottom: "1px solid #e8e8e8",
                background: "#fafbfd",
                padding: "16px 24px !important",
              }}
              title={
                <h1 className="font-bold text-[#373737] text-[24px] font-Manrope">
                  Create a new workspace
                </h1>
              }
              action={
                <IconButton
                  onClick={() => setIsAddWorkspace(false)}
                  sx={{
                    padding: "4px 6px",
                    border: "1px solid #e8e8e8",
                    borderRadius: "5px",
                    boxShadow: "0 3px 5px 0 rgba(0,0,0,.05)",
                    margin: "0",
                    position: "relative",
                    right: "10px",
                  }}
                >
                  <CloseIcon />
                </IconButton>
              }
              className={classes.header}
            />
            <CardContent className={classes.content}>
              <Typography
                variant="body1"
                className="text-left text-[15px] !mb-[30px]"
              >
                Create a new workspace with its{" "}
                <span className="text-[#2f2f2f] font-semibold font-Manrope">
                  own billing plan, data, and members.
                </span>{" "}
                Use{" "}
                <span className="text-[#2f2f2f] font-semibold font-Manrope">
                  portfolios to separate additional teams
                </span>{" "}
                within a workspace and keep them connected.
              </Typography>

              <HookTextField
                control={control}
                errors={errors}
                labelText="Workspace Name"
                name="name"
                placeholder="What is your workspace name?"
              />
              <Controller
                name="url"
                control={control}
                render={({ field }) => {
                  return (
                    <label className="block mb-5">
                      <span
                        className={
                          "block font-semibold heading-color text-base"
                        }
                      >
                        Workspace URL
                      </span>
                      <OutlinedInput
                        {...field}
                        endAdornment={
                          <InputAdornment position="end">
                            .three60.com
                          </InputAdornment>
                        }
                        type="text"
                        placeholder="Workspace"
                        classes={{
                          input: `${classes.input} bg-white`,
                        }}
                        className="mt-1 block global-inputFiled w-full px-3 py-2 bg-white placeholder-slate-400 "
                      />
                    </label>
                  );
                }}
              />
              <ErrorMessage
                errors={errors}
                name="url"
                render={({ message }) => (
                  <p className="text-red-500">{message}</p>
                )}
              />
            </CardContent>

            <CardActions
              className={classes.actions}
              sx={{
                borderTop: "1px solid #ececec",
                paddingTop: "16px",
                paddingBottom: "16px",
                gap: "10px",
              }}
            >
              <Button
                className={classes.secondaryBtn}
                onClick={() => setIsAddWorkspace(false)}
                sx={{
                  width: "140px",
                  border: "1px solid #ececec",
                  color: "#2f2f2f",
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={isLoading}
                className={classes.primaryBtn}
                type="submit"
                startIcon={isLoading ? <CircularProgress size={20} /> : <></>}
                sx={{
                  paddingLeft: "16px",
                  paddingRight: "16px",
                  marginLeft: "10px",
                  textTransform: "none",
                }}
              >
                Create New Workspace
              </Button>
            </CardActions>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default memo(AddWorkspace);

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: "100%",
    width: "606px",
    margin: "0 auto",
    marginTop: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
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
    color: "#009084 !important",
    padding: "0 32px",
    height: "40px",
    background: "white",
    fontSize: "14px !important",
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
