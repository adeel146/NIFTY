import React from "react";
import "./profileSetup.css";
import BasicInfo from "./Steps/BasicInfo";
import NiftyLogo from "/images/logo-three60.png";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { opacity } from "@xstyled/styled-components";
import WorkspaceInfo from "./Steps/WorkspaceInfo";
import ThemeInfo from "./Steps/ThemeInfo";
import ToolInfo from "./Steps/ToolInfo";
import TeamInfo from "./Steps/TeamInfo";

function ProfileSetup() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  function a11yProps(index) {
    return {
      id: `vertical-tab-${index}`,
      "aria-controls": `vertical-tabpanel-${index}`,
    };
  }

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  const handleNext = () => {
    setValue(value + 1);
  };
  const handleBack = () => {
    setValue(value - 1);
  };
  const handleSkip = () => {
    setValue(value + 1);
  };
  const handleSubmit = () => {};
  const tabs = [
    {
      key: 0,
      heading: "Welcome! First things first...",
      subheading:
        "Create a profile to personalize how you'll appear on your workspace.",
      component: <BasicInfo handleNext={handleNext} />,
    },
    {
      key: 1,
      heading: "Now, let’s setup your workspace",
      subheading:
        "Setup and personalize how your workspace will appear to members.",
      component: <WorkspaceInfo handleNext={handleNext} />,
    },
    {
      key: 2,
      heading: "How should three60 appear for you?",
      subheading:
        "Choose the mode you're more comfortable with. You can change it at anytime from Settings.",
      component: <ThemeInfo handleNext={handleNext} />,
    },
    {
      key: 3,
      heading: "Moving from another tool?",
      subheading:
        "Start where you left off. three60 lets you import projects, members, tasks, Files, and more from other tools.",
      component: <ToolInfo handleSkip={handleSkip} />,
    },
    {
      key: 4,
      heading: "Who's on your team?",
      subheading:
        "Maximize your collaboration and teamwork efficiency by inviting your teammates.",
      component: <TeamInfo handleSubmitProfile={handleSubmit} />,
    },
  ];

  return (
    <div class="google-main-bg">
      <div class="bg-white flex flex-[0_0_auto] z-[3] flex-col h-full overflow-hidden relative">
        <div class="overflow-auto relative z:[1] h-full">
          <div className="min-h-full overflow-hidden relative">
            <div className="google-head-bg items-center bg-[#fbfbfb] bg-no-repeat flex flex-col text-base h-[215px] justify-between p-[20px 0px] relative bg-bottom">
              {/* < logo section> */}
              <div className="text-center w-full mt-5 flex justify-center">
                <a href="#">
                  <img
                    src={NiftyLogo}
                    alt=""
                    className="block h-auto w-[86px]"
                  />
                </a>
              </div>
              {/* start text-section */}
              <div className="mb-16 font-sans">
                <h2 className="text-3xl font-bold heading-color">
                  {tabs[value].heading}
                </h2>
                <p className="mt-5">{tabs[value].subheading}</p>
              </div>
              {/* end text-section */}
              {/* start slider section */}
              <div className="items-center flex justify-center px-1 py-0 cursor-pointer -mt-16 mb-5">
                <Tabs
                  disableRipple={true}
                  disableTouchRipple={true}
                  orientation="horizontal"
                  variant="scrollable"
                  value={value}
                  // onChange={handleChange}
                  TabIndicatorProps={{
                    style: {
                      display: "none",
                    },
                  }}
                  aria-label="horizontal tabs"
                >
                  {tabs.map((el) => (
                    <Tab
                      icon={
                        <>
                          <span
                            className={`bg-yellow-600 rounded-sm h-1 w-8 ${
                              el.key === value ? "opacity-100" : "opacity-10"
                            } mx-1`}
                          />
                        </>
                      }
                      {...a11yProps(el.key)}
                      sx={{
                        minWidth: "auto !important",
                        maxWidth: "none !important",
                        padding: "0px !important",
                      }}
                    />
                  ))}
                </Tabs>
              </div>
              {(value === 3 || value === 4) && (
                <button
                  onClick={handleBack}
                  class="rounded-bl-none rounded-tl-none left-0 absolute bottom-5 bg-white text-gray-800 border border-[#e8e8e8] hover:shadow-md text-xs h-9 w-20 p-[0_16px ] items-center self-center rounded-md inline-flex font-medium justify-center no-underline align-middle normal-case hover:text-[#00A99B]"
                >
                  <svg
                    class="icon mr-2 text-sm"
                    width="1em"
                    height="1em"
                    viewBox="0 0 14 14"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g
                      id="Onboarding"
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g
                        id="onboarding-4"
                        transform="translate(-10.000000, -217.000000)"
                        fill="currentColor"
                      >
                        <g
                          id="Group-3"
                          transform="translate(-6.000000, 205.000000)"
                        >
                          <circle
                            id="Oval"
                            opacity="0.2"
                            cx="23"
                            cy="19"
                            r="7"
                          ></circle>
                          <path
                            d="M24.3860971,16.6638749 C24.5379676,16.5120043 24.5379676,16.2657735 24.3860971,16.1139029 C24.2342265,15.9620324 23.9879957,15.9620324 23.8361251,16.1139029 L21.1139029,18.8361251 C20.9620324,18.9879957 20.9620324,19.2342265 21.1139029,19.3860971 L23.8361251,22.1083193 C23.9879957,22.2601899 24.2342265,22.2601899 24.3860971,22.1083193 C24.5379676,21.9564487 24.5379676,21.7102179 24.3860971,21.5583474 L21.9388608,19.1111111 L24.3860971,16.6638749 Z"
                            id="Path-82"
                            fillRule="nonzero"
                          ></path>
                        </g>
                      </g>
                    </g>
                  </svg>
                  Back
                </button>
              )}
              {/* end slider section */}
              {/* start Button section */}
              <div className="p-4 absolute right-0 top-36 mr-8 ">
                <div className="group relative">
                  <button className="bg-white border border-[#e8e8e9] text-black px-2 h-10 rounded  flex items-center   ">
                    <span className="icon mr-2   ">
                      <svg
                        className="icon    "
                        width="1em"
                        height="1em"
                        viewBox="0 0 10 10"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g
                          id="Page-2"
                          stroke="none"
                          strokeWidth={1}
                          fill="none"
                          fillRule="evenodd"
                        >
                          <g
                            id="Team-overview---search"
                            transform="translate(-195.000000, -198.000000)"
                            fill="currentColor"
                          >
                            <g
                              id="Group-2"
                              transform="translate(121.000000, 153.000000)"
                            >
                              <path
                                d="M79,55 C76.2385763,55 74,52.7614237 74,50 C74,47.2385763 76.2385763,45 79,45 C81.7614237,45 84,47.2385763 84,50 C84,52.7614237 81.7614237,55 79,55 Z M75.0309469,50.5 C75.208709,51.9255384 76.1366002,53.1181211 77.4071554,53.670283 C76.9357098,52.8292114 76.5937378,51.680877 76.516502,50.5 L75.0309469,50.5 Z M75.0309469,49.5 L76.5161037,49.5 C76.5916478,48.317783 76.9269429,47.1740909 77.3938197,46.3355415 C76.1301105,46.8902345 75.2080865,48.0794538 75.0309469,49.5 Z M82.9690531,49.5 C82.7919135,48.0794538 81.8698895,46.8902345 80.6061803,46.3355415 C81.0730571,47.1740909 81.4083522,48.317783 81.4838963,49.5 L82.9690531,49.5 Z M80.5928446,53.670283 C81.8633998,53.1181211 82.791291,51.9255384 82.9690531,50.5 L81.483498,50.5 C81.4062622,51.680877 81.0642902,52.8292114 80.5928446,53.670283 Z M78.1628985,52.9592955 C78.4874196,53.6116943 78.8678547,54 79,54 C79.1321453,54 79.5125804,53.6116943 79.8371015,52.9592955 C80.1845447,52.2608155 80.4178852,51.399083 80.4820843,50.5 L77.5179157,50.5 C77.5821148,51.399083 77.8154553,52.2608155 78.1628985,52.9592955 Z M78.154199,47.0393228 C77.8109093,47.7348235 77.5806882,48.5976169 77.5175474,49.5 L80.4824526,49.5 C80.4193118,48.5976169 80.1890907,47.7348235 79.845801,47.0393228 C79.522454,46.3842257 79.144037,46 79,46 C78.855963,46 78.477546,46.3842257 78.154199,47.0393228 Z"
                                id="Combined-Shape"
                              />
                            </g>
                          </g>
                        </g>
                      </svg>
                    </span>
                    English
                    <span className="arrow ml-2 text-xs ">
                      <svg
                        className="icon  "
                        width="1.0277777777777777em"
                        height="0.6111111111111112em"
                        viewBox="0 0 37 22"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g
                          id="Style-guide"
                          stroke="none"
                          strokeWidth={1}
                          fill="none"
                          fillRule="evenodd"
                        >
                          <g
                            id="nifty-UI-guide"
                            transform="translate(-617.000000, -2934.000000)"
                            fill="currentColor"
                            fillRule="nonzero"
                          >
                            <g
                              id="Group-6-Copy-3"
                              transform="translate(574.000000, 2884.000000)"
                            >
                              <path
                                d="M70.5909903,46.8409903 C71.4696699,45.9623106 71.4696699,44.5376894 70.5909903,43.6590097 C69.7123106,42.7803301 68.2876894,42.7803301 67.4090097,43.6590097 L51.6590097,59.4090097 C50.7803301,60.2876894 50.7803301,61.7123106 51.6590097,62.5909903 L67.4090097,78.3409903 C68.2876894,79.2196699 69.7123106,79.2196699 70.5909903,78.3409903 C71.4696699,77.4623106 71.4696699,76.0376894 70.5909903,75.1590097 L56.4319805,61 L70.5909903,46.8409903 Z"
                                id="Path-82"
                                transform="translate(61.125000, 61.000000) rotate(-90.000000) translate(-61.125000, -61.000000) "
                              ></path>
                            </g>
                          </g>
                        </g>
                      </svg>
                    </span>
                  </button>
                  <nav
                    tabIndex={0}
                    className=" bg-white invisible border border-[#e8e8e9] rounded w-28 absolute left-0 top-full transition-all opacity-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-1 "
                  >
                    <ul className="py-1  font-medium text-sm max-h-60 overflow-y-auto overflow-x-hidden ">
                      <li>
                        <a
                          href="#"
                          className="block px-5 py-1  hover:bg-[#f2fffe] hover:text-[#00b8a9] "
                        >
                          English
                        </a>
                      </li>
                      <hr />
                      <li>
                        <a
                          href="#"
                          className="block px-5 py-2  hover:bg-[#f2fffe] hover:text-[#00b8a9]"
                        >
                          Chinese
                        </a>
                      </li>
                      <hr />
                      <li>
                        <a
                          href="#"
                          className="block px-5 py-2   hover:bg-[#f2fffe] hover:text-[#00b8a9]"
                        >
                          French
                        </a>
                      </li>
                      <hr />
                      <li>
                        <a
                          href="#"
                          className="block px-5 py-2   hover:bg-[#f2fffe] hover:text-[#00b8a9]"
                        >
                          German
                        </a>
                      </li>
                      <hr />
                      <li>
                        <a
                          href="#"
                          className="block px-5 py-2  hover:bg-[#f2fffe] hover:text-[#00b8a9]"
                        >
                          Italian
                        </a>
                      </li>
                      <hr />
                      <li>
                        <a
                          href="#"
                          className="block px-5 py-2  hover:bg-[#f2fffe] hover:text-[#00b8a9]"
                        >
                          Japanese
                        </a>
                      </li>
                      <hr />
                      <li>
                        <a
                          href="#"
                          className="block pl-3 pr-8 py-2   hover:bg-[#f2fffe] hover:text-[#00b8a9]"
                        >
                          Portuguese
                        </a>
                      </li>
                      <hr />
                      <li>
                        <a
                          href="#"
                          className="block px-5 py-2   hover:bg-[#f2fffe] hover:text-[#00b8a9]"
                        >
                          Russian
                        </a>
                      </li>
                      <hr />
                      <li>
                        <a
                          href="#"
                          className="block px-5 py-2  hover:bg-[#f2fffe] hover:text-[#00b8a9]"
                        >
                          Spanish
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
            {tabs.map((el) => (
              <TabPanel value={value} index={el.key}>
                {el.component}
              </TabPanel>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSetup;
