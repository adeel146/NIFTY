import React from "react";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch } from "react-redux";
import { removeUsers } from "redux/reducers/minutesofmeetings";
import EmailIcon from "@mui/icons-material/Email";

export const RolesEnum = [
  { label: "Owner", value: 1 },
  { label: "Member", value: 2 },
  { label: "Admin", value: 3 },
  { label: "Guest", value: 4 },
];
function SingleRow(props) {
  const { user, index } = props;
  const dispatch = useDispatch();

  console.log(user, "user");

  return (
    <tr className="bg-gray-100">
      <td className="p-3">
        <div className="flex align-items-center">
          <AccountBoxIcon />
          <div className="ml-3">
            <div className="text-[#2f2f2f]">{user.name}</div>
          </div>
        </div>
      </td>
      <td className="p-3">
        <div className="flex align-items-center">
          <EmailIcon />
          <div className="ml-3">
            <div className="text-[#2f2f2f]"> {user.email || "NA"}</div>
          </div>
        </div>
      </td>

      <td className="p-3">
        <span className="bg-green-400 rounded-md px-2 py-1 font-Manrope text-[#000]">
          {RolesEnum.find((role) => role.value === user.role)?.label || "NA"}
        </span>
      </td>
      <td className="p-3 ">
        <a
          onClick={() => dispatch(removeUsers(index))}
          href="#"
          className="text-[#2f2f2f] hover:text-[#000]"
        >
          <DeleteIcon className="hover:text-red-600" />
        </a>
      </td>
    </tr>
  );
}

export default SingleRow;
