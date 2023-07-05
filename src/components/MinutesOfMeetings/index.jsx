import React, { useState } from "react";
import { Grid } from "@mui/material";
import LeftSide from "./LeftSide";
import RightSide from "./RightSide";

function MinutesOfMeetings() {
  const [selectedMeeting, setSelectedMeeting] = useState("Dione");
  return (
    <Grid mt={2} container>
      <Grid
        item
        bgcolor={"white"}
        height={"77vh"}
        overflow={"auto"}
        sm={12}
        md={3}
      >
        <LeftSide
          selectedMeeting={selectedMeeting}
          setSelectedMeeting={setSelectedMeeting}
        />
      </Grid>
      <Grid item sm={12} md={9}>
        <RightSide selectedMeeting={selectedMeeting} />
      </Grid>
    </Grid>
  );
}

export default MinutesOfMeetings;
