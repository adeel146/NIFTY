import React from "react";

import Avatar from "@mui/material/Avatar";
import AddIcon from '@mui/icons-material/Add';

const ChatTab = () => {
  const chatList = [
    {
      name: "Sheheryar Sajid",
      image: "",
    },
    {
      name: "Shahroz",
      image: "",
    },
    {
      name: "Adeel",
      image: "",
    },
    {
      name: "Shaheer",
      image: "",
    },
  ];

  return (
    <div className="pl-[2rem]">
      <div>
        {chatList?.map((val, index) => {
          const sliceName = val?.name?.slice(0, 1);
          return (
            <div key={index} className="flex space-x-2 items-center pt-3">
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "3px",
                  background: "#DF67FF",
                  fontSize: "15px",
                }}
                variant="square"
              >
                {sliceName}
              </Avatar>
              <div>
                <h2>{val?.name}</h2>
              </div>
            </div>
          );
        })}
      </div>
      <div className=" flex items-center space-x-1 mt-5 cursor-pointer">
        <AddIcon sx={{fontSize:"17px"}} />
        <h2 className="text-[14px] text-[#4B5272]">Invite People</h2>
      </div>

    </div>
  );
};

export default ChatTab;
