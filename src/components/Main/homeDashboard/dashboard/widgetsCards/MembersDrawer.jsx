import React from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";

const MembersDrawer = ({ open, setOpen }) => {
  
  return (
    <div>
      <Drawer anchor="right" open={open}>
        <Box sx={{ width: 600 }}>
          <div className="flex justify-between mt-[1rem] px-[1rem] items-center">
            <h3>Project Members</h3>
            <div className="cursor-pointer " onClick={() => setOpen(false)}>
              <CloseIcon />
            </div>
          </div>
        </Box>
      </Drawer>
    </div>
  );
};

export default MembersDrawer;
