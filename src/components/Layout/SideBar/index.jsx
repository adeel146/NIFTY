import "../Header.css";
import { useNavigate } from "react-router";
import { Input } from "@mui/material";
import SideBarPortfolio from "./sideBarPortfolio";
import { openPortfolio } from "redux/reducers/portfolio";
import { useDispatch } from "react-redux";
import AddPortfolioDialog from "components/Main/portfolio/AddPortfolioDialog";
import { links } from "static/links";
import { Link } from "react-router-dom";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AppsIcon from "@mui/icons-material/Apps";
import { settingSidebarClose, settingSidebarOpen } from "redux/actions";
import { useState } from "react";
import { useSelector } from "react-redux";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ViewCompactIcon from "@mui/icons-material/ViewCompact";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import ScreenLockRotationOutlinedIcon from "@mui/icons-material/ScreenLockRotationOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";

function SideBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const sideWidth = useSelector((state) => state.projectTaskSlice.settingSide);

  const handleBack = () => navigate(links.myWork);

  return (
    <div className="flex relative flex-auto">
      {/* show and hide sidebar start */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          dispatch(settingSidebarClose());
          setIsActive(true);
        }}
        // onClick={handleClick}
        className="onClick-btn absolute z-[20] cursor-pointer -right-[11px] top-[5px] w-[22px] h-[22px] bg-[#9399AB] rounded-full text-[#fff] flex justify-center items-center"
      >
        <div className="btn btn-sidebar-collapse text-white text-[16px] relative left-[2px] -top-[2px] ">
          {sideWidth === "60px" ? (
            <div
              className="cursor-pointer text-[16px]"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(settingSidebarOpen());
                setIsActive(false);
              }}
            >
              <ArrowForwardIosIcon sx={{ fontSize: "14px" }} />
            </div>
          ) : (
            <ArrowBackIosIcon sx={{ fontSize: "14px" }} />
          )}
        </div>
      </div>

      {/* end sidebar show and hide */}
      <div className="w-full min-w-0 z-10">
        <div className=" w-[auto]  bg-[#fefefe] border-[#f6f8fc] border-r flex flex-[0_0_auto] flex-col z-20  text-[#9399AB] h-[100vh] overflow-auto">
          <div className=" flex flex-col  bg-[#fefefe] " id="sidebar">
            <div className={isActive ? "setting_menuList" : ""}>
              <div className="items-center flex h-16 py-0 px-5 flex-[0_0_auto] ">
                <span className="rounded mt-[3px] cursor-pointer flex text-base h-6 justify-center mr-3 w-6 bg-[#9399AB] text-[#fff] flex-[0_0_auto]">
                  <svg
                    onClick={handleBack}
                    className="self-center inline-flex flex-[0_0_auto] "
                    width="0.5454545454545454em"
                    height="1em"
                    viewBox="0 0 6 11"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g
                      id="Overview"
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g
                        id="Team-overview---profile---2"
                        transform="translate(-1194.000000, -457.000000)"
                        fill="currentColor"
                      >
                        <g
                          id="Rectangle-4"
                          transform="translate(232.000000, 30.000000)"
                        >
                          <g
                            id="Group-41"
                            transform="translate(35.000000, 278.000000)"
                          >
                            <g
                              id="Group-40"
                              transform="translate(0.000000, 72.000000)"
                            >
                              <g
                                id="Group-36-Copy-2"
                                transform="translate(900.000000, 22.000000)"
                              >
                                <path
                                  d="M32.8047379,56.1380712 C33.0650874,55.8777217 33.0650874,55.4556117 32.8047379,55.1952621 C32.5443883,54.9349126 32.1222783,54.9349126 31.8619288,55.1952621 L27.1952621,59.8619288 C26.9349126,60.1222783 26.9349126,60.5443883 27.1952621,60.8047379 L31.8619288,65.4714045 C32.1222783,65.731754 32.5443883,65.731754 32.8047379,65.4714045 C33.0650874,65.211055 33.0650874,64.788945 32.8047379,64.5285955 L28.6094757,60.3333333 L32.8047379,56.1380712 Z"
                                  id="Path-82"
                                  transform="translate(30.000000, 60.333333) translate(-30.000000, -60.333333) "
                                ></path>
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </span>
                <h2 className="font-bold text-2xl hide_text">Settings</h2>
              </div>
              <div className=" flex-[0_0_auto]">
                <div className="flex flex-col pt-0">
                  <div className="py-3 px-0 relative">
                    <div className="text-xs hide_text font-medium relative uppercase border-l-4 border-l-transparent my-0 mr-3 ml-2 py-1 pr-0 pl-4 mb-3">
                      Profile
                    </div>
                    <div>
                      <div className="text-[14px] font-semibold">
                        <a
                          className="  mt-0 items-center cursor-pointer flex relative  border-[#eee] border-b py-3 pl-[1.3rem] hover:text-[#333]"
                          onClick={() => navigate(links.profileSettings)}
                        >
                          <span className="mr-2 leading-none ">
                            <div className="text-xs w-[24px]">
                              <PersonOutlineOutlinedIcon
                                sx={{ fontSize: "18px" }}
                              />
                            </div>
                          </span>
                          <span className=" text-[14px] font-semibold hide_text">
                            Profile Settings
                          </span>
                        </a>
                        <a
                          className=" mt-0 items-center cursor-pointer flex relative  border-[#eee] border-b py-3 pl-[1.3rem] hover:text-[#333]"
                          href=" #"
                        >
                          <span className="mr-2 leading-none ">
                            <div className="text-xs w-[24px]">
                              <LockOutlinedIcon sx={{ fontSize: "18px" }} />
                            </div>
                          </span>
                          <span
                            className="text-[14px] font-semibold hide_text"
                            onClick={() => navigate("/profile/security")}
                          >
                            Security Settings
                          </span>
                        </a>
                        <a
                          className=" mt-0 items-center cursor-pointer flex relative  border-[#eee] border-b py-3 pl-[1.3rem] hover:text-[#333]"
                          href=" #"
                        >
                          <span className="mr-2 leading-none ">
                            <div className="text-xs w-[24px]">
                              <NotificationsOutlinedIcon
                                sx={{ fontSize: "16px" }}
                              />
                            </div>
                          </span>
                          <span
                            className="text-[14px] font-semibold hide_text"
                            onClick={() => navigate("/profile/notification")}
                          >
                            Notification Settings
                          </span>
                        </a>
                        <a
                          className=" mt-0 items-center cursor-pointer flex relative  border-[#eee] border-b py-3 pl-[1.3rem] hover:text-[#333]"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate("/profile/app-center");
                          }}
                        >
                          <span className="mr-2 leading-none ">
                            <div className="text-xs w-[24px]">
                              <ViewCompactIcon sx={{ fontSize: "18px" }} />
                            </div>
                          </span>
                          <span className="text-[14px] font-semibold hide_text">
                            App Center
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className=" px-0 relative">
                    <div className="text-xs hide_text font-medium relative uppercase border-l-4 border-l-transparent my-0 mr-3 py-3 pr-0 pl-[1.3rem] mb-2">
                      Workspaces
                    </div>
                    <div className="w-full p-[0_5px_0_18px] pl-5 flex mb-3">
                      <div className=" image  mr-3 ">
                        <span className="items-center font-bold inline-flex text-white align-middle bg-[#f9a33ad9] border-[#f9a33ad9] h-5 w-5 pl-[7px] rounded-md text-[9px] ">
                          G
                        </span>
                      </div>
                      <div className="text flex py-1 pr-[10px]">
                        <span className="font-semibold text-sm hide_text">
                          GRAFFiTECS
                          <span className="arrow text-xs">
                            <svg
                              className="text-xs inline-flex ml-32"
                              width="1.0277777777777777em"
                              height="0.6111111111111112em"
                              viewBox="0 0 37 22"
                              version="1.1"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g
                                id="Style-guide"
                                stroke="none"
                                strokeWidth="1"
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
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium">
                        <a
                          className="mt-0 items-center cursor-pointer flex relative  border-[#eee] border-b min-h-[35px] py-3 pl-[1.3rem] hover:text-[#333]"
                          href="#"
                        >
                          <span className="mr-2 leading-none ">
                            <div className="text-xs w-[24px] ">
                              <SettingsIcon sx={{ fontSize: "16px" }} />
                            </div>
                          </span>
                          <span
                            className="text-[14px] font-semibold hide_text"
                            onClick={() =>
                              navigate("/workspaces/general-settings")
                            }
                          >
                            General Settings
                          </span>
                        </a>
                        <a
                          className=" mt-0 items-center cursor-pointer flex relative  border-[#eee] border-b py-3 pl-[1.3rem] hover:text-[#333]"
                          href=" #"
                        >
                          <span className="mr-2 leading-none ">
                            <div className="text-xs w-[24px] ">
                              <ScreenLockRotationOutlinedIcon
                                sx={{ fontSize: "16px" }}
                              />
                            </div>
                          </span>
                          <span
                            className="text-[14px] font-semibold hide_text"
                            onClick={() =>
                              navigate("/workspaces/security-settings")
                            }
                          >
                            Security Settings
                          </span>
                        </a>
                        <a
                          className=" mt-0 items-center cursor-pointer flex relative  border-[#eee] border-b py-3 pl-[1.3rem] hover:text-[#333]"
                          href=" #"
                        >
                          <span className="mr-2 leading-none ">
                            <div className="text-xs w-[24px]">
                              <PeopleAltIcon sx={{ fontSize: "16px" }} />
                            </div>
                          </span>
                          <span
                            className="text-[14px] font-semibold hide_text"
                            onClick={() =>
                              navigate("/workspaces/members-permissions")
                            }
                          >
                            Members & Permissions
                          </span>
                        </a>

                        <a
                          className=" mt-0 items-center cursor-pointer flex relative  border-[#eee] border-b py-3 pl-[1.3rem] hover:text-[#333]"
                          href=" #"
                        >
                          <span className="mr-2 leading-none ">
                            <div className=" text-xs w-[24px]">
                              <AttachMoneyIcon sx={{ fontSize: "18px" }} />
                            </div>
                          </span>
                          <Link
                            className="hide_text text-[14px] font-semibold"
                            to="/billing"
                          >
                            Billing
                          </Link>
                        </a>
                        {/* <div className="flex space-x-2 items-center pl-[1.2rem] rounded-full ">
                        <AppsIcon
                          sx={{
                            fontSize: "15px",
                            marginLeft: "5px",
                            height: "30px",
                            borderRadius: "50px",
                          }}
                        />
                        <Link to="/workspace-ads">Workspace Add-on</Link>
                      </div> */}
                        <a
                          className=" mt-0 items-center cursor-pointer flex relative  border-[#eee] border-b py-3 pl-[1.3rem] hover:text-[#333]"
                          href=" #"
                        >
                          <span className="mr-2 leading-none ">
                            <div className="text-xs w-[24px]">
                              <ViewCompactIcon sx={{ fontSize: "18px" }} />
                            </div>
                          </span>
                          <span
                            className="text-[14px] font-semibold hide_text"
                            onClick={() => navigate("/workspace-ads")}
                          >
                            App Center
                          </span>
                        </a>
                      </div>
                    </div>
                    <div className="py-3 pl-[1.3rem] hide_text border-[#eee] border-b">
                      <div className="group relative">
                        <button className="h-10 rounded text-[15px] font-medium hover:text-[#333]">
                          Active Projects
                          <span className="arrow ml-3">
                            <svg
                              className="text-sm inline-flex ml-1 "
                              width="1.0277777777777777em"
                              height="0.6111111111111112em"
                              viewBox="0 0 37 22"
                              version="1.1"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g
                                id="Style-guide"
                                stroke="none"
                                strokeWidth="1"
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
                        <div className=" bg-white invisible border-gray-800 rounded w-60 absolute left-0 top-full transition-all opacity-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-1">
                          <ul className="py-1">
                            <li>
                              <a
                                href="#"
                                className="block px-4 py-2 text-[#888] text-[14px] font-semibold hover:text-[#111631]"
                              >
                                Active Projects
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* <div className="flex justify-between">
                    <div className="flex text-xs font-medium relative border-l-4 border-l-transparent my-0 mr-3 ml-2 py-1 pr-0 pl-4 mb-3">
                      <div className="items-center flex justify-center flex-auto text-[#c4c8e2] text-xs  ">
                        <span className="mr-2 leading-none ">
                          <div className="h-5 w-5 rounded-full ">
                            <i
                              className="fa-solid fa-search mt-[2px] ml-[5px] text-xs "
                              style={{ color: "gray" }}
                            ></i>
                          </div>
                        </span>
                        <Input
                          placeholder="Go to projects..."
                          disableUnderline
                          fullWidth
                          style={{
                            color: "gray",
                          }}
                          // value={searchText}
                          inputProps={{
                            "aria-label": "Search",
                          }}
                          // onChange={(ev) => dispatch(setContactsSearchText(ev))}
                        />
                      </div>
                    </div>
                    <span className="mr-2 leading-none ">
                      <div className="bg-gray-600 h-5 w-5 ">
                        <i
                          className="fa-solid fa-plus mt-[2px] ml-[5px] text-xs "
                          style={{ color: "gray" }}
                        ></i>
                      </div>
                    </span>
                  </div> */}

                    <div className="hide_text text-[14px] font-semibold">
                      <SideBarPortfolio />
                    </div>

                    <div
                      className="hide_text items-center flex justify-right flex-auto text-[#c4c8e2] hover:text-[#111631] text-xs mt-5 pl-[27px] cursor-pointer"
                      onClick={() => dispatch(openPortfolio())}
                    >
                      <span className="mr-2 leading-none">
                        <div className="h-5 w-5 rounded-full ">
                          <i className="fa-solid fa-add mt-[2px] text-xs "></i>
                        </div>
                      </span>
                      <p className="text-sm">Add Portfolio</p>
                    </div>

                    {/* <div className="relative py-6 pb-14 px-3 mt-16 hide_text">
                      <a
                        className="w-full flex bg-[#2e365d] justify-center items-center font-medium text-sm text-white  h-10 px-5 rounded-mdF"
                        href="#"
                      >
                        <div className="mr-1">
                          <i
                            className="fa-solid fa-circle-question"
                            style={{ color: "#ffffff" }}
                          ></i>
                        </div>
                        Help
                      </a>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddPortfolioDialog />
    </div>
  );
}

export default SideBar;
