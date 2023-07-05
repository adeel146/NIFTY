import CustomRolesPermissions from "./CustomRoles_&_Permissions";
import InvitePeopleTab from "./InvitePeopleTab";
import ManageMembersTab from "./ManageMembersTab";
import Grid from "@mui/material/Grid";
import { useState } from "react";

const Members_Permissions = () => {
  const [value, setValue] = useState("Invite People");
  return (
    <div className="w-[100%] px-10 mb-[85px]">
      <div className="mt-[2rem] mb-[1rem] flex space-x-7 ">
        {portfolioTabs.map((val) => {
          return (
            <div
              key={val.name}
              className=""
              onClick={() => setValue(val?.name)}
            >
              <h2
                style={{
                  color: value === val.name ? "#00A99B" : "gray",
                  borderBottom: value === val.name ? "2px solid #00A99B" : "",
                }}
                className={`      
                      flex space-x-8 flex-row  text-[15px] cursor-pointer font-[500] hover:text-[#00A99B]`}
              >
                {val?.name}
              </h2>
            </div>
          );
        })}
      </div>
      <div>
        {value === "Invite People" ? (
          <div>
            <InvitePeopleTab />
          </div>
        ) : value === "Manage Members" ? (
          <div>
            <ManageMembersTab />
          </div>
        ) : value === "Custom Roles & Permissions" ? (
          <div>
            <CustomRolesPermissions />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Members_Permissions;

const portfolioTabs = [
  {
    name: "Invite People",
  },
  {
    name: "Manage Members",
  },
  {
    name: "Custom Roles & Permissions",
  },
];
