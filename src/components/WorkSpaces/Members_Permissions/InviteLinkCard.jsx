import {
    Grid,
  } from "@mui/material";
import HookTextField from "hooks/Common/HookTextField";
import { workspaceInviteCardSchema } from "validations/workspace";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import GreenButton from "hooks/Common/commonButtons/GreenButton";
import { IconButton } from "@mui/material";
import { Icon } from "@mui/material";

const InviteLinkCard = ()  => {
    const {
        handleSubmit,
        control,
        formState: { errors },
      } = useForm({
        resolver: yupResolver(workspaceInviteCardSchema),
      });

    return (
      <>
      <div className="items-center bg-[#fbfbfb] flex text-[15px] justify-between py-[20px] relative text-center h-[215px]" style={{flexDirection: "column", backgroundImage: "url('https://nifty.pm/static/media/onboarding-header-bg@2x.9774903d32a9252110c9.png')"}}>
            <IconButton style={{ color: "#fff", whiteSpace: "nowrap" , backgroundColor: "rgb(223, 103, 255)", height: "55px", width: "55px",  borderRadius: "8px"}}>
              <Icon style={{fontSize: "14px", fontWeight: "bold"}}>G</Icon>
            </IconButton>
            <h2 className="text-[#000] text-[30px] font-bold">Join Graffitecs on Nifty</h2>
            <p>You have been invited to join Nifty.</p>
          </div>
        <div className="flex justify-center items-center py-[2em]" style={{flexDirection: "column"}}>
          <div className="w-[500px]">
          <form >
            <Grid container spacing={2}>
              <Grid item xs={12} lg={12} md={12}>
                <HookTextField
                  control={control}
                  name="name"
                  fullWidth
                  errors={errors}
                  labelText="Full Name"
                  placeholder="Your first & last name..."
                />
            </Grid>
<Grid item xs={12} lg={12} md={12}>
                <HookTextField
                  control={control}
                  name="email"
                  fullWidth
                  errors={errors}
                  labelText="Email Address"
                  placeholder="name@company.com"
                />
</Grid>
<Grid item xs={12} lg={12} md={12}>
                <HookTextField
                  control={control}
                  name="password"
                  fullWidth
                  errors={errors}
                  labelText="Create Password"
                  placeholder="Min 8 characters and one symbol"
                />

              </Grid>
            </Grid>
            </form>
            <p>By signing up, you confirm that you've read and accepted Nifty's <br></br> <a>Terms of Service</a> and <a>Privacy Policy.</a></p>
            <GreenButton style={{width: "100%", marginTop: "20px"}} buttonText="Join now"/>
          </div>

        </div>
      </>
    )
}

export default InviteLinkCard;