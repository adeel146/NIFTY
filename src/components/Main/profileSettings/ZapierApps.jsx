import React, { Fragment, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

function ZapierApps() {
  const [sectionShow, setSectionShow] = useState(true);
  const zapierApps = [
    { id: 1, img: "/images/google-sheet.png", title: "Google Sheets" },
    { id: 2, img: "/images/Google Calendar.png", title: "Google Calendar" },
    { id: 3, img: "/images/Slack.png", title: "Slack" },
    { id: 4, img: "/images/google-gmail.png", title: "Gmail" },
    { id: 5, img: "/images/LeadConnector.png", title: "LeadConnector" },
    { id: 6, img: "/images/Google Drive.png", title: "Google Drive" },
  ];
  const popularZapierApps = [
    {
      id: 1,
      primaryAppImage: "/images/typeform.jpeg",
      secondaryAppImage: "/images/only nifty logo.svg",
      desc: (
        <div className="ml-3">
          <h3 className="font-Manrope font-semibold">
            Create tasks in three60 from new Typeform entries
          </h3>
          <p className="text-[#424242] font-Manrope text-sm">
            Typeform + three60
          </p>
        </div>
      ),
    },
    {
      id: 2,
      primaryAppImage: "/images/Google Calendar.png",
      secondaryAppImage: "/images/only nifty logo.svg",
      desc: (
        <div className="ml-3">
          <h3 className="font-Manrope font-semibold">
            Create tasks in three60 when new events are added to Google Calendar
          </h3>
          <p className="text-[#424242] font-Manrope text-sm">
            Google Calendar + three60
          </p>
        </div>
      ),
    },
    {
      id: 3,
      primaryAppImage: "/images/airtabs.png",
      secondaryAppImage: "/images/only nifty logo.svg",
      desc: (
        <div className="ml-3">
          <h3 className="font-Manrope font-semibold">
            Create three60 tasks from new Airtable records
          </h3>
          <p className="text-[#424242] font-Manrope text-sm">
            Airtable + three60
          </p>
        </div>
      ),
    },
    {
      id: 4,
      primaryAppImage: "/images/airtabs.png",
      secondaryAppImage: "/images/only nifty logo.svg",
      desc: (
        <div className="ml-3">
          <h3 className="font-Manrope font-semibold">
            Add new three60 tasks as records in Airtable
          </h3>
          <p className="text-[#424242] font-Manrope text-sm">
            three60 + Airtable
          </p>
        </div>
      ),
    },
    {
      id: 5,
      primaryAppImage: "/images/google-gmail.png",
      secondaryAppImage: "/images/only nifty logo.svg",
      desc: (
        <div className="ml-3">
          <h3 className="font-Manrope font-semibold">
            Create three60 tasks from new emails in Gmail
          </h3>
          <p className="text-[#424242] font-Manrope text-sm">Gmail + three60</p>
        </div>
      ),
    },
    {
      id: 6,
      primaryAppImage: "/images/google-sheet.png",
      secondaryAppImage: "/images/only nifty logo.svg",
      desc: (
        <div className="ml-3">
          <h3 className="font-Manrope font-semibold">
            Create three60 tasks from new Google Sheets spreadsheet rows
          </h3>
          <p className="text-[#424242] font-Manrope text-sm">
            Google Sheets + three60
          </p>
        </div>
      ),
    },
    {
      id: 7,
      primaryAppImage: "/images/only nifty logo.svg",
      secondaryAppImage: "/images/harvest.png",
      desc: (
        <div className="ml-3">
          <h3 className="font-Manrope font-semibold">
            Add new three60 projects to Harvest
          </h3>
          <p className="text-[#424242] font-Manrope text-sm">
            three60 + Harvest (Legacy)
          </p>
        </div>
      ),
    },
    {
      id: 8,
      primaryAppImage: "/images/googleforms.png",
      secondaryAppImage: "/images/only nifty logo.svg",
      desc: (
        <div className="ml-3">
          <h3 className="font-Manrope font-semibold">
            Create three60 tasks from new Google Forms responses
          </h3>
          <p className="text-[#424242] font-Manrope text-sm">
            Google Forms + three60
          </p>
        </div>
      ),
    },
    {
      id: 9,
      primaryAppImage: "/images/only nifty logo.svg",
      secondaryAppImage: "/images/toggle.png",
      desc: (
        <div className="ml-3">
          <h3 className="font-Manrope font-semibold">
            Create Toggl projects from new three60 projects
          </h3>
          <p className="text-[#424242] font-Manrope text-sm">three60 + Toggl</p>
        </div>
      ),
    },
    {
      id: 10,
      primaryAppImage: "/images/jira.png",
      secondaryAppImage: "/images/only nifty logo.svg",
      desc: (
        <div className="ml-3">
          <h3 className="font-Manrope font-semibold">
            Add new JIRA issues to three60 as tasks
          </h3>
          <p className="text-[#424242] text-sm font-Manrope">
            Jira Software Cloud + three60
          </p>
        </div>
      ),
    },
  ];
  return (
    <Fragment>
      <>
        {sectionShow && (
          <div className="h-[250px] rounded-md bg-[#f7fefd]  border-[#e0f3f1] mt-6 w-[25%] mr-12 m-auto border float-right">
            <div className="flex justify-between px-4">
              <div className="flex flex-col w-[100%]">
                <h4 className="pt-3  text-[14px] font-Manrope  tracking-wider mt-1 font-bold ">
                  ZAPIER WORKS WITH EVERYTHING YOU WORK WITH. CHOOSE FROM 3,000+
                  INTEGRATIONS.
                </h4>
                <p className="font-Manrope text-[15px] font-medium mt-[15px] mb-3 tracking-wide">
                  Build workflows that solve problems fast, without writing any
                  code.
                </p>
                <p className="font-Manrope text-[15px] font-medium mt-[3px] mb-3 tracking-wide">
                  Automate the repetitive work that slows you down.
                </p>
              </div>

              <div
                className="pt-3  cursor-pointer"
                onClick={() => setSectionShow(false)}
              >
                <CloseIcon
                  sx={{
                    color: "#02bebd",
                    fontSize: "20px",
                    "&:hover": {
                      color: "#F98A3F",
                    },
                  }}
                />
              </div>
            </div>

            <div className="border-t border-t-[#02bebe33] mb-8">
              <div className="font-Manrope text-[14px] px-4 py-2 text-[#434343] font-semibold">
                Have more questions?
                <a
                  href="#"
                  className="font-Manrope text-[#00ac9e] ml-[6px] text-[15px] font-semibold"
                >
                  Ask us
                  <span className="ml-[3px]">✌️</span>
                </a>
              </div>
            </div>
          </div>
        )}
        <div className="flex ml-11 mt-11 gap-3 ">
          <div className="">
            <h3 className="font-bold font-Manrope text-base mb-3">
              Connect this app...
            </h3>
            <div className="h-11 flex border border-gray-500 bg-[#FAFBFD] w-64 pt-2 pl-2 ">
              <span className="border border-gray-400 h-7 w-7 p-1 bg-white rounded mr-3 ">
                <img
                  className="w-5 "
                  src="/images/only nifty logo.svg"
                  alt=""
                />
              </span>
              <span className="font-Manrope font-normal">three60</span>
            </div>
          </div>
          <span> </span>
          <div className="">
            <h3 className="font-bold font-Manrope text-base mb-3">
              with this one!
            </h3>
            <input
              className="border-2 border-gray-400 bg-[#FAFBFD] h-11 w-[490px] pl-4 placeholder:text-black placeholder:font-normal global-inputFiled placeholder:font-Manrope"
              type="text"
              placeholder="Search for 5,000+ apps"
            />
          </div>
        </div>
        <div className="h-[240px] w-[55%] mt-6 cursor-pointer ml-11 flex flex-wrap flex-col ">
          {zapierApps.map((el) => (
            <div
              key={el.id}
              className={` ${
                el.id === 1 || el.id === 4 ? "border-t" : ""
              } hover:outline hover:outline-[#00A99B] hover:outline-1 border-b  font-semibold font-Manrope text-black hover:text-[#00A99B] mt-3 h-16 w-[45%] py-3 pl-5 ml-3`}
            >
              <span className=" flex ml-2 mb-2 gap-4">
                <img
                  className="w-10 h-10 border p-1 rounded-lg"
                  src={el.img}
                  alt=""
                />
                <button className="font-Manrope font-semibold">
                  {el.title}
                </button>
              </span>
            </div>
          ))}
        </div>
        <div className="ml-11 cursor-pointer ">
          <h2 className="font-bold text-1xl mb-6 font-Manrope">
            Popular with three60 users
          </h2>
          {popularZapierApps.map((el) => (
            <div
              className="border border-gray-300 w-[58%] bg-[#fafbfd] py-6 text-base font-semibold font-Manrope shadow-md 
                   hover:border hover:border-[#00A99B] hover:text-[#00A99B] mb-3 flex justify-between"
            >
              <div className="flex ml-7 gap-2 flex-auto ">
                <img
                  className="w-10 h-10 border border-gray-300 p-[5px] rounded-lg  bg-white"
                  src={el.primaryAppImage}
                  alt=""
                />
                <img
                  className="w-10 h-10 border border-gray-300 p-1 rounded-lg bg-white"
                  src={el.secondaryAppImage}
                  alt=""
                />
                {el.desc}
              </div>
              <div className="bg-[#9399AB] text-white py-[9px] px-7 rounded font-semibold text-center font-Manrope float-right mr-5 hover:bg-black">
                <button className="min-w-[30px]">Use this Zap</button>
              </div>
            </div>
          ))}
          <div className="text-center w-[58%] mb-14 ">
            <p className="font-medium font-Manrope">
              Not seeing what you're looking for?
            </p>
            <p>
              <a
                href="#"
                className="underline text-[#02bdad] font-Manrope hover:text-[#009084]"
              >
                Create from scratch
              </a>{" "}
              or
              <a
                href="#"
                className="underline text-[#02bdad] font-Manrope hover:text-[#009084]"
              >
                learn more
              </a>
            </p>
          </div>
        </div>
      </>
    </Fragment>
  );
}

export default ZapierApps;
