import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import GreenButton from "hooks/Common/commonButtons/GreenButton";

const AdsWorkspaceView = () => {
  return (
    <div>
      <Box sx={{ maxWidth: "lg", marginTop: "2rem", marginLeft: "2rem" }}>
        <Grid container spacing={2}>
          {[
            { name: "Workloads" },
            { name: "Overview" },
            { name: "Custom Domain (CNAME)" },
            { name: "Forms" },
          ].map((val) => {
            return (
              <Grid item xs={3}>
                <div className="max-w-sm rounded overflow-hidden border border-gray-300">
                  <div className="px-4 py-4">
                    <div className="font-[400] text-[16px] mb-2">
                      {val?.name}
                    </div>
                    <p className="text-gray-700 text-base ">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Voluptatibus quia, nulla! Maiores et perferendis eaque,
                    </p>
                  </div>
                  <div className="w-[80%] m-auto rounded h-[30px] mb-4 bg-[#00A99B] text-white flex items-center justify-center">
                    <button>add for $20/mo</button>
                  </div>
                </div>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </div>
  );
};

export default AdsWorkspaceView;
