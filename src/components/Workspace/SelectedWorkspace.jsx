import React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import InvitePeopleTab from '../WorkSpaces/Members_Permissions/InvitePeopleTab';
import { useState } from 'react';
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Typography from '@mui/material/Typography'
import ManageMembersTab from '../WorkSpaces/Members_Permissions/ManageMembersTab';

const SelectedWorkspace = () => {
    const [value, setValue] = useState("1");
    const handleChange = (event, newValue) => {
        setValue(newValue);
      };
    return (
        <div className='w-full selectedTabs'>
        <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ marginLeft: "30px", marginTop: "20px" }}>
            <TabList onChange={handleChange} aria-label="My Workspace" style={{fontFamily: "SFProTextCustom,Helvetica Neue,Helvetica,Arial,sans-serif"}}
            // TabIndicatorProps={
            //     {
            //     borderBottomColor: value == "1" ? "#00a99b": "transparent"
            //     }
            // }
            >
            <Tab
        
                label={
                  <Typography className="text-primary !font-[600]">
                    Invite People
                  </Typography>
                }
                value="1"
                style={{textTransform: "capitalize", color: value == "1" ? "#00a99b" : "#2f2f2f", borderBottom: value == "1" ? "!2px solid #00a99b": "2px solid transparent", backgroundColor: value == "1" ? "00a99b": "transparent"}}
              />
              <Tab
                label={
                  <Typography className="text-primary !font-[600]">
                    Manage Members
                  </Typography>
                }
                value="2"
                style={{textTransform: "capitalize", color: value == "2" ? "#00a99b" : "#2f2f2f", borderBottom: value == "2" ? "2px solid #00a99b": "2px solid transparent"}}
              />
              <Tab
                label={
                  <Typography className="text-primary !font-[600]">
                    Custom Roles & Permissions
                  </Typography>
                }
                value="3"
                style={{textTransform: "capitalize", color: value == "3" ? "#00a99b" : "#2f2f2f", borderBottom: value == "3" ? "2px solid #00a99b": "2px solid transparent"}}
              />
            </TabList>
          </Box>
          <TabPanel value="1">
            <InvitePeopleTab/>
          </TabPanel>
          <TabPanel value="2">
            <ManageMembersTab />
          </TabPanel>
        </TabContext>
      </Box>
    </div>

    )
}

export default SelectedWorkspace;