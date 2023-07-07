import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import MembersDrawer from "./MembersDrawer";
import { useDispatch } from "react-redux";
import { openAddMembersDialog } from "redux/reducers/mainDashbord";
import AddMembersDialog from "./AddMembersDialog";
import moment from "moment";
import HookRadioBox from "hooks/Common/HookRadioBox";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import GreenButton from "hooks/Common/commonButtons/GreenButton";
import { changeRequestDialogOpen } from "redux/actions";
import ChangeRequestHistoryDialog from "./ChangeRequestHistoryDialog";
import { fontSize } from "@xstyled/system";

const ProjectInfo = ({ membersList, activeProject }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  console.log("active:", { activeProject });
  const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
  return (
    <div>
      <div className="projectOutline mb-4">
        <FormControl>
          <FormLabel
            id="demo-radio-buttons-group-label"
            className="!text-[18px] !font-semibold cursor-pointer !font-Manrope !text-[#000] mb-2"
          >
            Project Policy
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="Public"
            name="radio-buttons-group"
          >
            <FormControlLabel
              value="Public"
              control={
                <Radio
                  sx={{
                    "&, &.Mui-checked": {
                      color: "#00A99B",
                    },
                  }}
                  checked
                  disabled
                />
              }
              label="Public"
            />
            <FormControlLabel
              value="Private"
              control={<Radio disabled />}
              label="Private"
            />
          </RadioGroup>
        </FormControl>

        {/* <label className="font-medium text-[15px] mb-1">
                    Project Policy
                  </label>
                  <div>
                    <HookRadioBox
                      name="type_value"
                      control={control}
                      options={options}
                      defaultValue={options[0]?.label}
                      errors={errors}
                    />
                  </div> */}

        <h2 className="text-[18px] font-semibold font-Manrope mb-2 mt-1">
          Project Scope
        </h2>
        <div className=" w-[75%] font-normal text-sm text-[#8394bb]">
          <p className="line-clamp-3">{activeProject?.scope}</p>
        </div>
      </div>
      <div className="flex justify-between w-[75%]">
        <h2 className="text-[18px] font-semibold cursor-pointer text-[#9399AB] mb-2">
          Project OwnerShip
        </h2>
        <GreenButton
            //   disabled={isLoading}
            //   loading={isLoading}
              buttonText="Change Request History"
            onClick={() => dispatch(changeRequestDialogOpen())}
            />
      </div>
      
      <div
        className="flex space-x-4 items-start mt-3 cursor-pointer border-[#eee] border-b pb-5"
        // onClick={() => {
        //   dispatch(openAddMembersDialog());
        // }}
      >
        {/* <div className="flex space-x-4  items-center  cursor-pointer">
          <div
            className={`flex justify-center cursor-pointer border border-[#e9ebfa]  hover:bg-[#02bdad]  text-[#02bdad] hover:text-[#fff] items-center w-[50px] h-[50px] rounded-md shadow-sm bg-white `}
          >
            <AddIcon sx={{ fontSize: "18px", cursor: "pointer" }} />
          </div>
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-[#009084] text-[13px] font-medium cursor-pointer">
              Add Members
            </h3>
          </div>
        </div> */}
        <div className="flex gap-3 w-[15%] flex-col">
          <h2 className="text-[14px] font-semibold font-Manrope mb-1">
            Manager Name
          </h2>
          <div className="flex space-x-4 items-center  cursor-pointer">
            <div
              className={`flex justify-center cursor-pointer border border-[#e9ebfa]  text-[white] hover:text-[#fff] items-center w-[50px] h-[50px] rounded-md shadow-sm bg-white `}
              style={{
                background: color,
              }}
            >
              {activeProject?.managerName?.charAt(0)?.toUpperCase() ?? ""}
            </div>
            <div className="flex flex-col items-start justify-start">
              <h3
                className=" text-[13px] font-medium cursor-pointer"
                style={{
                  color: "#8394bb",
                }}
              >
                {activeProject?.managerName}
              </h3>
            </div>
          </div>
        </div>

        <div className="flex gap-3 w-[15%] flex-col">
          <h2 className="text-[14px] font-semibold font-Manrope mb-1">
            Sponser Name
          </h2>
          <div className="flex space-x-4  items-center  cursor-pointer">
            <div
              className={`flex justify-center cursor-pointer border border-[#e9ebfa]  text-[white] hover:text-[#fff] items-center w-[50px] h-[50px] rounded-md shadow-sm bg-white `}
              style={{
                background: color,
              }}
            >
              {activeProject?.sponserName?.charAt(0)?.toUpperCase() ?? ""}
            </div>
            <div className="flex flex-col items-start justify-start">
              <h3
                className=" text-[13px] font-medium cursor-pointer"
                style={{
                  color: "#8394bb",
                }}
              >
                {activeProject?.sponserName}
              </h3>
            </div>
          </div>
        </div>

        <div className="flex gap-3 w-[15%] flex-col">
          <h2 className="text-[14px] font-semibold font-Manrope mb-1">
            Champion Name
          </h2>
          <div className="flex space-x-4  items-center  cursor-pointer">
            <div
              className={`flex justify-center cursor-pointer border border-[#e9ebfa]  text-[white] hover:text-[#fff] items-center w-[50px] h-[50px] rounded-md shadow-sm bg-white `}
              style={{
                background: color,
              }}
            >
              {activeProject?.championName?.charAt(0)?.toUpperCase() ?? ""}
            </div>
            <div className="flex flex-col items-start justify-start">
              <h3
                className=" text-[13px] font-medium cursor-pointer"
                style={{
                  color: "#8394bb",
                }}
              >
                {activeProject?.championName}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row space-x-4 my-4 border-[#eee] border-b pb-5">
        <div className="flex min-w-[15%] flex-col items-start justify-start text-[13px] text-[#8394bb]">
          <h3 className=" text-[14px] font-semibold font-Manrope mb-1 text-[#333]">
            Start Date
          </h3>
          {moment(activeProject?.startDate).format("MMM D, YYYY [at] h:mmA")}
        </div>
        <div className="flex min-w-[15%] flex-col items-start justify-start text-[13px] text-[#8394bb]">
          <h3 className="text-[14px] font-semibold font-Manrope mb-1 text-[#333]">
            End Date
          </h3>
          {moment(activeProject?.endDate).format("MMM D, YYYY [at] h:mmA")}
        </div>
        <div className="flex min-w-[15%] flex-col items-start justify-start text-[13px] text-[#8394bb]">
          <h3 className=" text-[14px] font-semibold font-Manrope mb-1 text-[#333]">
            Initial Budget
          </h3>
          {activeProject?.initialBudget}
        </div>
        <div className="flex min-w-[15%] flex-col items-start justify-start text-[13px] text-[#8394bb]">
          <h3 className=" text-[14px] font-semibold font-Manrope mb-1 text-[#333]">
            Expected Budget
          </h3>
          {activeProject?.expectedBudget}
        </div>
      </div>

      <h2 className="text-[18px] font-semibold font-Manrope mb-3 text-[#9399AB]">
        Projetc Charter
      </h2>

      <div className="projectOutline mb-4 ">
        <h2 className="text-[16px] font-semibold font-Manrope mb-2">
          Project Members
        </h2>
        <div
          className="flex space-x-4 w-full items-start mt-3 cursor-pointer justify-start"
          // onClick={() => {
          //   dispatch(openAddMembersDialog());
          // }}
        >
          {/* <div className="flex space-x-4  items-center  cursor-pointer">
          <div
            className={`flex justify-center cursor-pointer border border-[#e9ebfa]  hover:bg-[#02bdad]  text-[#02bdad] hover:text-[#fff] items-center w-[50px] h-[50px] rounded-md shadow-sm bg-white `}
          >
            <AddIcon sx={{ fontSize: "18px", cursor: "pointer" }} />
          </div>
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-[#009084] text-[13px] font-medium cursor-pointer">
              Add Members
            </h3>
          </div>
        </div> */}
          <div className="flex gap-10 w-[100%] flex-wrap mb-3 border-[#eee] border-b pb-5">
            {membersList?.map((el, i) => {
              const color =
                "#" + Math.floor(Math.random() * 16777215).toString(16);
              const role = roles.find((role) => role.id === el.role);
              return (
                <div
                  className="flex space-x-4  items-center  cursor-pointer"
                  // onClick={() => {
                  //   dispatch(openAddMembersDialog());
                  // }}
                >
                  <div
                    className={`flex justify-center cursor-pointer border border-[#e9ebfa]  text-[white] hover:text-[#fff] items-center w-[50px] h-[50px] rounded-md shadow-sm bg-white `}
                    style={{
                      background: color,
                    }}
                  >
                    {el?.name?.charAt(0)?.toUpperCase() ?? ""}
                  </div>
                  <div className="flex flex-col items-start justify-start">
                    <h3
                      className=" text-[13px] font-medium cursor-pointer"
                      style={{
                        color: "black",
                      }}
                    >
                      {el.name}
                    </h3>
                    <h3
                      className=" text-[13px] font-medium cursor-pointer"
                      style={{
                        color: "#8394bb",
                      }}
                    >
                      {role ? role.name : ""}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <h2 className="text-[16px] font-semibold font-Manrope mb-2">
          Problem Statement
        </h2>
        <div className=" w-[75%] font-normal text-sm text-[#8394bb]">
          <p className="line-clamp-3">
            {activeProject?.projectCharter?.problemStatement}
          </p>
        </div>
      </div>

      <div className="projectOutline mb-4 ">
        <h2 className="text-[16px] font-semibold font-Manrope mb-2">
          Project Objectives
        </h2>
        <div className=" w-[75%] font-normal text-sm text-[#8394bb]">
          <p className="line-clamp-3">
            {activeProject?.projectCharter?.projectObjectives}
          </p>
        </div>
      </div>

      <div className="projectOutline mb-4">
        <h2 className="text-[16px] font-semibold font-Manrope mb-2">
          Project Overview
        </h2>
        <div className=" w-[75%] font-normal text-sm text-[#8394bb]">
          <p className="line-clamp-3">
            {activeProject?.projectCharter?.projectOverview}
          </p>
        </div>
      </div>

      <div className="projectOutline mb-4">
        <h2 className="text-[16px] font-semibold font-Manrope mb-2">
          Expected Benefits
        </h2>
        <div className=" w-[75%] font-normal text-sm text-[#8394bb]">
          <p className="line-clamp-3">
            {activeProject?.projectCharter?.expectedBenefits}
          </p>
        </div>
      </div>

      <div className="projectOutline mb-4 border-[#eee] border-b pb-5">
        <h2 className="text-[16px] font-semibold font-Manrope mb-2">
          Scope Details
        </h2>
        <div className=" w-[75%] font-normal text-sm text-[#8394bb]">
          <p className="line-clamp-3">
            {activeProject?.projectCharter?.scopeDetails}
          </p>
        </div>
      </div>

      <h2 className="text-[18px] font-semibold font-Manrope mb-3 text-[#9399AB]">
        Other Information
      </h2>

      <div className="projectOutline mb-4">
        <h2 className="text-[16px] font-semibold font-Manrope mb-2">Mission</h2>
        <div className=" w-[75%] font-normal text-sm text-[#8394bb]">
          <p className="line-clamp-3">{activeProject?.mission}</p>
        </div>
      </div>

      <div className="projectOutline mb-4">
        <h2 className="text-[16px] font-semibold font-Manrope mb-2">Vision</h2>
        <div className=" w-[75%] font-normal text-sm text-[#8394bb]">
          <p className="line-clamp-3">{activeProject?.vision}</p>
        </div>
      </div>

      <div className="projectOutline mb-4">
        <h2 className="text-[16px] font-semibold font-Manrope mb-2">Scope</h2>
        <div className=" w-[75%] font-normal text-sm text-[#8394bb]">
          <p className="line-clamp-3">{activeProject?.scope}</p>
        </div>
      </div>
      <ChangeRequestHistoryDialog />
    </div>
  );
};

export default ProjectInfo;

const options = [
  {
    label: `Public `,
    value: `PublicKey`,
  },
  {
    label: "Private ",
    value: "Private",
  },
];
const roles = [
  { name: "Owner", id: 1 },
  { name: "Member", id: 2 },
  { name: "Admin", id: 3 },
  { name: "Guest", id: 4 },
];
