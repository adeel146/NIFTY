import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import MembersDrawer from "./MembersDrawer";
import { useDispatch } from "react-redux";
import { openAddMembersDialog } from "redux/reducers/mainDashbord";
import AddMembersDialog from "./AddMembersDialog";

const ProjectMembers = ({ membersList, activeProject }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  return (
    <div>
      <div className="projectOutline mb-4">
        <h2 className="text-[18px] font-semibold font-Manrope mb-2">
          Project Scope
        </h2>
        <div
          style={{ height: "84px", overflow: "hidden" }}
          className=" w-[75%] font-medium px-2 py-2 border rounded-md border-[#fafbfd] text-[#8394bb] hover:bg-[#fff] hover:border-[#e9ebfa]"
        >
          <p className="line-clamp-3">{activeProject?.scope}</p>
        </div>
      </div>
      <h2 className="text-[18px] font-semibold font-Manrope">
        Project Members
      </h2>
      <div
        className="flex space-x-4 w-max items-start mt-3 cursor-pointer justify-start"
        onClick={() => {
          dispatch(openAddMembersDialog());
        }}
      >
        <div className="flex space-x-4  items-center  cursor-pointer">
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
        </div>
        <div className="flex gap-10 w-[70%] flex-wrap ">
          {membersList?.map((el, i) => {
            const color =
              "#" + Math.floor(Math.random() * 16777215).toString(16);
            const role = roles.find((role) => role.id === el.role);
            return (
              <div
                className="flex space-x-4  items-center  cursor-pointer"
                onClick={() => {
                  dispatch(openAddMembersDialog());
                }}
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

      <MembersDrawer open={open} setOpen={setOpen} />
      <AddMembersDialog />
    </div>
  );
};

export default ProjectMembers;

const roles = [
  { name: "Owner", id: 1 },
  { name: "Member", id: 2 },
  { name: "Admin", id: 3 },
  { name: "Guest", id: 4 },
];
