import { useState } from "react";
import { Tabs, Tab } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NativaApps from "./NativaApps";
import ThirdPartyApps from "./ThirdPartyApps";
import ZapierApps from "./ZapierApps";
import { useNavigate } from "react-router-dom";

const AppCenterView = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState("Native Apps");
  const selectedTab = portfolioTabs.find((tab) => tab.name === value);

  const handleGoBack = () => {
    navigate(-1); // Redirects back to the previous route
  };
  return (
    <div class="w-full h-[100vh] bg-white">
      <div class="items-center flex h-9 px-11  justify-between">
        <h1 class="text-2xl mt-2 font-bold font-Manrope text-[#373737]">
          App Center
        </h1>
        <div
          class="focus:border focus:border-red-500 cursor-pointer "
          onClick={handleGoBack}>
          <CloseIcon
            sx={{
              fontSize: "35px",
              color: "#373737",
              "&:hover": { color: "#f98c42" },
              marginTop: "40px",
            }}
          />
        </div>
      </div>
      <div class=" ml-11  flex flex-col  font-semibold font-Manrope capitalize border rounded-lg bg-transparent md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 dark:border-gray-700 space-x-4">
        {portfolioTabs.map((val) => {
          return (
            <div
              key={val.name}
              className=""
              onClick={() => setValue(val?.name)}>
              <h2
                style={{
                  color: value === val.name ? "#00A99B" : "black",
                  borderBottom: value === val.name ? "2px solid #00A99B" : "",
                }}
                className={`      
                      flex space-x-8 flex-row mt-4 text-[15px] cursor-pointer font-semibold font-Manrope hover:text-[#00A99B] hover:border-b-2 hover:border-b-[#00A99B] `}>
                {val?.name}
              </h2>
            </div>
          );
        })}
      </div>

      <hr></hr>
      {selectedTab && selectedTab.component}
    </div>
  );
};

export default AppCenterView;

const portfolioTabs = [
  {
    name: "Native Apps",
    component: <NativaApps />,
  },
  {
    name: "Integrate with API",
    component: <ThirdPartyApps />,
  },
  {
    name: "Powered by Zapier",
    component: <ZapierApps />,
  },
];
