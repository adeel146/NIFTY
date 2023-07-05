import React from "react";
import AddIcon from "@mui/icons-material/Add";

const PortfolioSavedTemplates = () => {
  return (
    <div className="mt-[10px]">
      <div className="mt-[10px]">
        <div className="w-full rounded border border-[#00A99B] bg-[#F2F8FA] h-28 flex space-x-8 items-center px-8">
          <div className="w-100%">
            <div className="flex flex-col ">
              <h2>Coming Soon</h2>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="w-full rounded border border-[#00A99B] bg-[#F2F8FA] h-28 flex space-x-8 items-center px-8">
        <div className="w-30%">
          <div className="flex justify-center items-center bg-white w-[100px] h-[75px] rounded-md shadow-md">
            <AddIcon sx={{ color: "#00A99B", fontSize: "35px" }} />
          </div>
        </div>
        <div className="w-70%">
          <div className="flex flex-col">
            <h2>Blank Project</h2>
            <h3>
              Set up a fully custom project and save it as a template later.
            </h3>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default PortfolioSavedTemplates;
