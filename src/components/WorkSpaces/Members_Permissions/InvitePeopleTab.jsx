import HookTextField from "hooks/Common/HookTextField";
import React from "react";
import { workspaceInviteSchema, workspaceSchema } from "validations/workspace";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGetWorkspaceById, useInvitePeople } from "hooks/Workspace";
import { makeStyles } from "@mui/styles";
import { useForm } from "react-hook-form";
import { Grid, Button } from "@mui/material";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import { Snackbar } from "@mui/material";
import { useState } from "react";
import "../../Workspace/workspace.css";
import GreenButton from "hooks/Common/commonButtons/GreenButton";

const InvitePeopleTab = () => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(workspaceInviteSchema),
  });

  const workspaceId = localStorage.getItem("workspaceId");

  const workspace = (data) => {};

  const onSuccess = (data) => {
    if (data) {
      reset({ name: "", email: "", role: "" });
    }
  };
  const workspaceData = useGetWorkspaceById({
    id: workspaceId,
    onSuccess: workspace,
  });

  const addWorkspace = useInvitePeople({ onSuccess });

  const onSubmit = (data) => {
    console.log("data", data);
    const body = {
      workspaceId: workspaceId,
      emailandNames: [
        {
          name: data?.name,
          email: data?.email,
          role: data?.role,
        },
      ],
    };
    addWorkspace.mutate({ data: body });
  };

  const handleClick = () => {
    setOpen(true);
    navigator.clipboard.writeText(
      workspaceData?.workspaceResponse?.data?.data?.data?.link
    );
  };

  return (
    <div className="w-[70%] selectedTabs">
      <p className="text-[14px]">INVITE PEOPLE TO YOUR WORKSPACE</p>
      <div className="pt-[10px]">
        <Grid container spacing={3}>
          <Grid item xs={6} md={3} lg={3}>
            <HookTextField
              //pageName="workspace"
              control={control}
              errors={errors}
              labelText="Email Address"
              name="email"
              placeholder="email@example.com"
              className="border"
            />
          </Grid>
          <Grid item xs={6} md={3} lg={3}>
            <HookTextField
              //pageName="workspace"
              control={control}
              errors={errors}
              labelText="Name (optional)"
              name="name"
              required={false}
            />
          </Grid>
          <Grid item xs={6} md={3} lg={3}>
            <HookTextField
              //pageName="workspace"
              control={control}
              errors={errors}
              labelText="Role (optional)"
              name="role"
              required={false}
            />
          </Grid>
          <Grid item xs={6} md={3} lg={3}>
            <GreenButton
              loading={workspaceData?.workspaceResponse?.isLoading}
              buttonText="Invite"
              style={{ marginTop: "30px" }}
              onClick={handleSubmit(onSubmit)}
            />
          </Grid>
        </Grid>
      </div>
      <div
        className="flex justify-between align-center mt-[20px] pt-[20px]"
        style={{ flexDirection: "column", borderTop: "1px solid gray" }}
      >
        <div className="flex">
          <InsertLinkIcon />
          <p className="text-[14px]">INVITE PEOPLE TO YOUR WORKSPACE</p>
        </div>
        <p className="text-[13px]">
          Anyone can use this link to join DHL on three60
        </p>
        <div className="flex justify-between">
          <Grid container spacing={3}>
            <Grid item xs={6} md={10} lg={10}>
              <HookTextField
                control={control}
                errors={errors}
                name="inviteLink"
                //value={workspaceData?.workspaceResponse?.data?.data?.data?.link}
                placeholder={
                  workspaceData?.workspaceResponse?.data?.data?.data?.link
                }
                required={false}
                disabled={true}
              />
            </Grid>
          </Grid>
          <div className="flex">
            <Button className={classes.primaryBtn} onClick={handleClick}>
              Copy
            </Button>
            <Snackbar
              open={open}
              onClose={() => setOpen(false)}
              autoHideDuration={2000}
              message="Copied to clipboard"
            />
            <Button style={{ fontWeight: 500, height: "40px " }}>Revoke</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitePeopleTab;

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
