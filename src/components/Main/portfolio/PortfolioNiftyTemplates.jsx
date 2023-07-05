import React, { useState } from "react";
import GroupsIcon from "@mui/icons-material/Groups";
import CodeIcon from "@mui/icons-material/Code";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import { Divider } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import CampaignIcon from "@mui/icons-material/Campaign";
import PaidIcon from "@mui/icons-material/Paid";
import WhiteButton from "hooks/Common/commonButtons/WhiteButton";
import Fade from "react-reveal/Fade";

const PortfolioNiftyTemplates = () => {
  const [name, setName] = useState("");
  const [childListName, setChildListName] = useState("");

  const getChilds = niftyList?.find((val) => {
    return val?.name === name;
  });

  const ParentList = () => {
    return (
      <div className="w-full mb-[4rem]">
        {niftyList.map((val, index) => {
          return (
            <div onClick={() => setName(val?.name)} key={index}>
              <div className="flex space-x-1 mt-[1rem] cursor-pointer w-full">
                <div className="w-[20%]">
                  <div
                    className="w-[100px] h-[70px] flex items-center justify-center rounded-md  text-white"
                    style={{ background: val?.boxColor }}
                  >
                    {val.icon}
                  </div>
                </div>
                <div className="w-[80%]">
                  <div className="flex flex-col">
                    <h3>{val?.name}</h3>
                    <h3 className="text-[#00A99B]">{val?.defaultText}</h3>
                  </div>
                </div>
              </div>
              <div className="mt-[1rem]">
                <Divider />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const ChildList = () => {
    return (
      <div className="mt-[2rem] w-full">
        <WhiteButton buttonText="Go Back" onClick={() => setName("")} />
        {getChilds?.childs?.map((val, index) => {
          return (
            <div
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setChildListName(val?.childName);
              }}
              // className={`${
              //   val?.childName === childListName ? "bg-red-400" : ""
              // }`}
            >
              <div className="flex space-x-1  my-[1rem] cursor-pointer">
                <div className="w-[20%]  ">
                  <div
                    className="w-[100px] h-[70px] rounded-md text-white flex items-center justify-center"
                    style={{ background: getChilds?.boxColor }}
                  >
                    {val.childIcon}
                  </div>
                </div>
                <div className="w-[80%]">
                  <div className="flex flex-col">
                    <h3>{val?.childName}</h3>
                    <h3 className="text-[#00A99B]">{val?.defaultText}</h3>
                  </div>
                </div>
              </div>
              <div className="mt-[1rem]">
                <Divider />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <div>{getChilds ? <ChildList /> : <ParentList />}</div>
    </div>
  );
};

export default PortfolioNiftyTemplates;

const niftyList = [
  {
    name: "Client Collaboration",
    defaultText: "Explore",
    icon: <GroupsIcon />,
    boxColor: "#0D2477",
    childs: [
      {
        childIcon: <GroupsIcon />,
        childName: "Client Meeting Agenda",
        defaultText: "Preview",
        // unique_name: "Client Collaboration",
      },
      {
        childIcon: <GroupsIcon />,
        childName: "Client Invoice Tracker",
        defaultText: "Preview",
        // unique_name: "Client Collaboration",
      },
      {
        childIcon: <GroupsIcon />,
        childName: "Client Management",
        defaultText: "Preview",
        // unique_name: "Client Collaboration",
      },
    ],
  },
  {
    name: "Design",
    boxColor: "#5FC2F6",
    defaultText: "Explore",
    icon: <ColorLensIcon />,
    childs: [
      {
        childIcon: <ColorLensIcon />,
        childName: "Product Design",
        defaultText: "Preview",
      },
      {
        childIcon: <ColorLensIcon />,
        childName: "Software Design Checklist",
        defaultText: "Preview",
      },
      {
        childIcon: <ColorLensIcon />,
        childName: "Interior Design",
        defaultText: "Preview",
      },
      {
        childIcon: <ColorLensIcon />,
        childName: "Graphic Design",
        defaultText: "Preview",
      },
    ],
  },
  {
    name: "Development",
    defaultText: "Explore",
    boxColor: "#8D74FE",
    icon: <CodeIcon />,
    childs: [
      {
        childIcon: <CodeIcon />,
        childName: "Agile Sprint Restrospective",
        defaultText: "Preview",
      },
      {
        childIcon: <CodeIcon />,
        childName: "Bug Tracking ",
        defaultText: "Preview",
      },
      {
        childIcon: <CodeIcon />,
        childName: "Scrum Project",
        defaultText: "Preview",
      },
      {
        childIcon: <CodeIcon />,
        childName: "Agile Development",
        defaultText: "Preview",
      },
    ],
  },
  {
    name: "Getting Things Done",
    defaultText: "Explore",
    boxColor: "#C950E9",
    icon: <DoneAllIcon />,
    childs: [
      {
        childIcon: <DoneAllIcon />,
        childName: "Freelance Monthly Tasks",
        defaultText: "",
      },
      {
        childIcon: <DoneAllIcon />,
        childName: "Personal To-DO's ",
        defaultText: "Preview",
      },
      {
        childIcon: <DoneAllIcon />,
        childName: "Getting Things Done",
        defaultText: "Preview",
      },
      {
        childIcon: <DoneAllIcon />,
        childName: "Daily Task Tracker",
        defaultText: "Preview",
      },
    ],
  },
  {
    name: "Legal",
    defaultText: "Explore",
    boxColor: "#F6B800",
    icon: <DescriptionIcon />,
    childs: [
      {
        childIcon: <DescriptionIcon />,
        childName: "Legal",
        defaultText: "Preview",
      },
    ],
  },

  {
    name: "Marketing",
    defaultText: "Explore",
    boxColor: "#FF6E59",
    icon: <CampaignIcon />,
    childs: [
      {
        childIcon: <CampaignIcon />,
        childName: "Internal Sales Pipleline",
        defaultText: "Preview",
      },
      {
        childIcon: <CampaignIcon />,
        childName: " Marketing Growth Strategy ",
        defaultText: "Preview",
      },
      {
        childIcon: <CampaignIcon />,
        childName: "Marketing Compaigns",
        defaultText: "Preview",
      },
      {
        childIcon: <CampaignIcon />,
        childName: "Link Building Pipeline",
        defaultText: "Preview",
      },
    ],
  },
  {
    name: "Product",
    defaultText: "Explore",
    boxColor: "#555555",
    icon: <DoneAllIcon />,
    childs: [
      {
        childIcon: <DoneAllIcon />,
        childName: "Scrum Project",
        default: "Preview",
      },
      {
        childIcon: <DoneAllIcon />,
        childName: " Product Road Map ",
        default: "Preview",
      },
      {
        childIcon: <DoneAllIcon />,
        childName: "Product Design",
        default: "Preview",
      },
    ],
  },

  {
    name: "Getting Things Done Explore",
    defaultText: "Explore",
    boxColor: "#FFA449",
    icon: <PaidIcon />,
    childs: [
      {
        childIcon: <PaidIcon />,
        childName: "Retail Sales Pipeline",
        default: "Preview",
      },
      {
        childIcon: <PaidIcon />,
        childName: "Real Estate Sales Pipeline",
        default: "Preview",
      },
      {
        childIcon: <PaidIcon />,
        childName: "Internal Sales Pipeline",
        default: "Preview",
      },
    ],
  },
];
