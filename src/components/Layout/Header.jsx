import { useNavigate } from "react-router";
import AddProjectTask from "components/AddProjectTask";
import { useDispatch, useSelector } from "react-redux";
import {
  onWorkspaceGetByIdSuccess,
  openHeaderDrawyer,
  openProjectTask,
  personalTaskDrawyerOpen,
} from "redux/actions";
import CheckIcon from "@mui/icons-material/Check";
import GppGoodIcon from "@mui/icons-material/GppGood";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import EditNoteIcon from "@mui/icons-material/EditNote";
import "./Header.css";
import { useState } from "react";
import { Popover } from "@mui/material";
import { links } from "static/links";
import { useAuth } from "hooks/useAuth";
import { getCurrTime } from "utils";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonalTaskDrawyer from "./drawyers/PersonalTaskDrawyer";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import HeaderDrawyer from "./drawyers/HeaderDrawyer";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

function Header() {
  const { activeWorkspace } = useSelector(({ workspace }) => workspace);

  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const auth = useAuth();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutUser = async () => {
    await dispatch(onWorkspaceGetByIdSuccess(null));
    await logout();
  };

  return (
    <div className="bg-[#9399AB] border-[#9399AB] border-b text-[#fff] flex justify-between pr-4 h-[40px] flex-[0_0_auto] items-center py-[5px]">
      <div className="flex w-[300px] flex-[0_0_auto] ">
        <div className="items-center flex-auto">
          <div className="w-full p-[0_5px_0_18px] flex">
            <div className="image mr-3 ">
              <span className="items-center font-bold flex justify-center text-white align-middle bg-[#ffc107] border-[#ffc107] h-6 w-6 text-center rounded-md text-[10px] ">
                {activeWorkspace?.name?.charAt(0)?.toUpperCase() ?? ""}
              </span>
            </div>

            <div className="group relative">
              <button className="flex font-thin hover:text-[#eee]">
                <div className="font-bold">{activeWorkspace?.name ?? ""}</div>

                <span className="arrow text-sm ml-2 mt-[2px] font-thin">
                  <svg
                    className="text-[12px] inline-flex "
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
              <div className=" bg-white border border-[#efefef] invisible rounded w-[343px] h-[75vh] overflow-y-auto absolute -left-10 top-full transition-all  group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-1 block opacity-100 z-[999] shadow-lg">
                <ul className="py-1">
                  <li>
                    <div className=" font-semibold py-2 px-4 rounded inline-flex items-center">
                      <span className="items-center font-bold inline-flex text-white align-middle bg-[#f9a33a] border-[#f9a33a] h-12 w-12 pl-4 rounded-md text-lg">
                        {activeWorkspace?.name?.charAt(0)?.toUpperCase() ?? ""}
                      </span>

                      <div className="ml-10">
                        <h2 className="text-base font-semibold m-0 text-[#2f2f2f]">
                          {activeWorkspace?.name ?? ""}
                        </h2>
                        <h5 className="font-normal text-sm text-[#8e94bb;]">
                          {activeWorkspace?.url ?? ""}
                        </h5>
                      </div>
                    </div>

                    <div className="p-1 gap-1 bg-[#f4f4fb] rounded-lg flex mx-3 shadow-md mt-1">
                      <div className="bg-white  items-center rounded cursor-pointer flex text-xs font-medium h-6 justify-center text-[#8e94bb] w-1/3 ">
                        <div className="mr-1 relative -top-[2px]">
                          <svg
                            className="icon inline-flex self-center text-black "
                            width="1em"
                            height="1em"
                            viewBox="0 0 36 36"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill="currentColor"
                              d="M36.042 13.909a1.006 1.006 0 0 0-.85-.688l-11.549-1.172L18.96 1.43a1 1 0 0 0-1.83.002L12.446 12.05.899 13.221a1.003 1.003 0 0 0-.565 1.743l8.652 7.738-2.453 11.343a1 1 0 0 0 1.481 1.074l10.032-5.84 10.03 5.84a.997.997 0 0 0 1.091-.059 1 1 0 0 0 .391-1.02l-2.453-11.344 8.653-7.737a.992.992 0 0 0 .284-1.05zm-10.706 7.689a1 1 0 0 0-.311.957l2.097 9.695-8.574-4.99a.995.995 0 0 0-1.006 0l-8.576 4.99 2.097-9.695a1 1 0 0 0-.311-.957l-7.396-6.613 9.87-1.002c.358-.035.668-.264.814-.592l4.004-9.077 4.003 9.077c.146.328.456.557.814.592l9.87 1.002-7.395 6.613z"
                            ></path>
                          </svg>
                        </div>
                        <div className="text-black mr-2">Classic</div>
                      </div>
                      <div className=" items-center rounded cursor-pointer flex text-xs font-medium h-6 justify-center text-[#8e94bb] w-1/3 ">
                        <div className="mr-1 relative -top-[1px]">
                          <svg
                            className="icon "
                            width="1em"
                            height="1em"
                            viewBox="0 0 12 12"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              r="2.47917"
                              transform="matrix(-1 0 0 1 5.99999 5.99992)"
                              fill="currentColor"
                              stroke="currentColor"
                              strokeWidth="0.875"
                            ></circle>
                            <path
                              d="M6 0.458252V1.91659"
                              stroke="currentColor"
                              strokeWidth="0.875"
                              strokeLinecap="round"
                            ></path>
                            <path
                              d="M6.00003 10.0831V11.5415"
                              stroke="currentColor"
                              strokeWidth="0.875"
                              strokeLinecap="round"
                            ></path>
                            <path
                              d="M0.458313 6L1.91665 6"
                              stroke="currentColor"
                              strokeWidth="0.875"
                              strokeLinecap="round"
                            ></path>
                            <path
                              d="M10.0833 6.00012L11.5416 6.00012"
                              stroke="currentColor"
                              strokeWidth="0.875"
                              strokeLinecap="round"
                            ></path>
                            <path
                              d="M9.91809 2.08142L9.0987 2.90081"
                              stroke="currentColor"
                              strokeWidth="0.875"
                              strokeLinecap="round"
                            ></path>
                            <path
                              d="M2.89175 9.10791L2.08116 9.91851"
                              stroke="currentColor"
                              strokeWidth="0.875"
                              strokeLinecap="round"
                            ></path>
                            <path
                              d="M2.0813 2.08142L2.90069 2.90081"
                              stroke="currentColor"
                              strokeWidth="0.875"
                              strokeLinecap="round"
                            ></path>
                            <path
                              d="M9.10779 9.10779L9.91838 9.91838"
                              stroke="currentColor"
                              strokeWidth="0.875"
                              strokeLinecap="round"
                            ></path>
                          </svg>
                        </div>
                        <div className="text-black ml-[2px]">Light</div>
                      </div>
                      <div className="  items-center  rounded cursor-pointer flex text-xs font-medium h-6 justify-center text-[#8e94bb] w-1/3 ">
                        <div className="mr-1 relative -top-[1px]">
                          <svg
                            className="icon "
                            width="1em"
                            height="1em"
                            viewBox="0 0 12 12"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6.19771 11.3959C3.21768 11.3959 0.80188 8.98012 0.80188 6.00008C0.80188 3.33763 2.73065 1.12478 5.26719 0.684112C5.29074 0.68002 5.30051 0.68427 5.30438 0.686089C5.31056 0.688991 5.32252 0.696887 5.33502 0.716096C5.36196 0.757501 5.37452 0.826578 5.34455 0.896386C4.75197 2.27675 4.37763 4.09258 5.06258 5.63827C5.76802 7.2302 7.51097 8.36151 10.7567 8.53034C10.8193 8.53359 10.8647 8.56627 10.8861 8.59956C10.8961 8.61522 10.8987 8.62754 10.8991 8.63482C10.8994 8.64031 10.899 8.65044 10.8892 8.66771C9.95988 10.2982 8.20672 11.3959 6.19771 11.3959Z"
                              fill="currentColor"
                              stroke="currentColor"
                              strokeWidth="0.875"
                              strokeLinejoin="round"
                            ></path>
                            <path
                              d="M9.90078 4.61313C9.8351 4.54745 9.78326 4.4731 9.74036 4.39432C9.69746 4.4731 9.64562 4.54745 9.57994 4.61313C9.51426 4.67882 9.43991 4.73065 9.36112 4.77355C9.43991 4.81646 9.51426 4.86829 9.57994 4.93398C9.64562 4.99966 9.69746 5.07401 9.74036 5.15279C9.78326 5.07401 9.8351 4.99966 9.90078 4.93398C9.96647 4.86829 10.0408 4.81646 10.1196 4.77355C10.0408 4.73065 9.96647 4.67882 9.90078 4.61313Z"
                              stroke="currentColor"
                              strokeWidth="0.875"
                              strokeLinejoin="round"
                            ></path>
                            <path
                              d="M7.62827 2.46362C7.62009 2.45571 7.61204 2.44766 7.60413 2.43948C7.59621 2.44766 7.58817 2.45571 7.57999 2.46362C7.58817 2.47153 7.59621 2.47958 7.60413 2.48776C7.61204 2.47958 7.62009 2.47153 7.62827 2.46362Z"
                              stroke="currentColor"
                              strokeWidth="0.875"
                              strokeLinejoin="round"
                            ></path>
                          </svg>
                        </div>
                        <div className="text-black ml-[3px]">Dark</div>
                      </div>
                    </div>
                    <hr className="mt-3 color-[#8e94bb]" />

                    <div className="p-2 mt-1">
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate("/profile/settings");
                        }}
                        className="items-center rounded-lg cursor-pointer flex text-sm font-medium no-underline py-1 pr-1 pl-[2px] min-h-[36px] "
                      >
                        <span className="text-base relative text-center w-10 flex-[0_0_auto] -top-[1px] ">
                          <svg
                            className="icon ml-4 "
                            width="1em"
                            height="0.9375em"
                            viewBox="0 0 16 15"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                          >
                            <mask id="icon-settings-a" fill="#fff">
                              <path
                                fillRule="evenodd"
                                d="M.5 6.666v1.32c0 .779.637 1.424 1.424 1.424 1.357 0 1.912.96 1.23 2.136a1.424 1.424 0 0 0 .524 1.942l1.297.742a1.251 1.251 0 0 0 1.71-.45l.082-.143c.682-1.176 1.791-1.176 2.466 0l.083.143a1.251 1.251 0 0 0 1.709.45l1.296-.742c.683-.39.915-1.26.525-1.942-.682-1.177-.127-2.136 1.23-2.136.787 0 1.424-.645 1.424-1.425V6.666c0-.787-.645-1.424-1.424-1.424-1.357 0-1.912-.96-1.23-2.137a1.424 1.424 0 0 0-.524-1.941L11.024.422a1.251 1.251 0 0 0-1.71.45l-.082.142c-.682 1.177-1.792 1.177-2.466 0L6.684.87a1.251 1.251 0 0 0-1.709-.45l-1.297.743a1.424 1.424 0 0 0-.524 1.941c.682 1.177.127 2.137-1.23 2.137C1.137 5.242.5 5.886.5 6.666ZM8 9.18A1.854 1.854 0 1 1 8 5.47 1.854 1.854 0 0 1 8 9.18ZM5.02 7.326a2.98 2.98 0 1 1 5.96 0 2.98 2.98 0 0 1-5.96 0Z"
                                clipRule="evenodd"
                              ></path>
                            </mask>
                            <path
                              fill="currentColor"
                              fillRule="evenodd"
                              d="M.5 6.666v1.32c0 .779.637 1.424 1.424 1.424 1.357 0 1.912.96 1.23 2.136a1.424 1.424 0 0 0 .524 1.942l1.297.742a1.251 1.251 0 0 0 1.71-.45l.082-.143c.682-1.176 1.791-1.176 2.466 0l.083.143a1.251 1.251 0 0 0 1.709.45l1.296-.742c.683-.39.915-1.26.525-1.942-.682-1.177-.127-2.136 1.23-2.136.787 0 1.424-.645 1.424-1.425V6.666c0-.787-.645-1.424-1.424-1.424-1.357 0-1.912-.96-1.23-2.137a1.424 1.424 0 0 0-.524-1.941L11.024.422a1.251 1.251 0 0 0-1.71.45l-.082.142c-.682 1.177-1.792 1.177-2.466 0L6.684.87a1.251 1.251 0 0 0-1.709-.45l-1.297.743a1.424 1.424 0 0 0-.524 1.941c.682 1.177.127 2.137-1.23 2.137C1.137 5.242.5 5.886.5 6.666ZM8 9.18A1.854 1.854 0 1 1 8 5.47 1.854 1.854 0 0 1 8 9.18ZM5.02 7.326a2.98 2.98 0 1 1 5.96 0 2.98 2.98 0 0 1-5.96 0Z"
                              clipRule="evenodd"
                            ></path>
                            <path
                              fill="#8e94bb"
                              d="m3.154 11.546-.974-.564v.001l.974.563Zm.524 1.942.56-.977h-.001l-.559.977Zm1.297.742.575-.967a.61.61 0 0 0-.016-.01l-.559.977Zm1.71-.45.966.575.007-.011-.974-.564Zm.082-.143-.974-.564.974.564Zm2.466 0-.976.56.002.004.974-.564Zm.083.143-.974.564.007.011.967-.575Zm1.709.45-.56-.977a.54.54 0 0 0-.015.01l.575.967Zm1.296-.742-.558-.977.559.977Zm.525-1.942.977-.558-.003-.006-.974.564Zm0-8.44.974.563-.974-.564Zm-.524-1.942-.56.976h.001l.559-.976ZM11.024.422l-.575.966a.94.94 0 0 0 .016.01l.559-.976Zm-1.71.45L8.35.295l-.007.012.974.563Zm-.082.142.973.564-.973-.564Zm-2.466 0 .976-.56L7.74.45l-.973.564ZM6.684.87l.974-.563-.007-.012-.967.575ZM4.975.421l.559.977.016-.01-.575-.966Zm-1.297.743.559.976-.559-.976Zm-.524 1.941-.974.563v.001l.974-.564Zm-1.53 4.88V6.666h-2.25v1.32h2.25Zm.3.3a.304.304 0 0 1-.3-.3h-2.25a2.553 2.553 0 0 0 2.55 2.55v-2.25Zm2.203 3.825c.461-.795.645-1.778.151-2.635-.493-.857-1.436-1.19-2.354-1.19v2.25c.211 0 .331.037.385.062.048.023.037.03.02.001-.017-.03-.005-.035-.01.018a.942.942 0 0 1-.139.366l1.947 1.128Zm.11.4a.299.299 0 0 1-.11-.401L2.18 10.983a2.549 2.549 0 0 0 .94 3.481l1.117-1.953Zm1.297.743-1.297-.742-1.117 1.953 1.296.742 1.118-1.953Zm.184-.048a.145.145 0 0 1-.088.067.098.098 0 0 1-.08-.01L4.4 15.197c1.148.683 2.594.264 3.251-.84l-1.933-1.151Zm.075-.131-.082.142 1.947 1.128.082-.143-1.947-1.127Zm4.416.004c-.457-.798-1.217-1.448-2.206-1.448-.988 0-1.749.648-2.21 1.443l1.947 1.129c.106-.184.2-.27.25-.304.044-.031.046-.018.013-.018-.034 0-.033-.014.01.016a.93.93 0 0 1 .244.301l1.952-1.119Zm.08.138-.082-.142L8.259 14.2l.083.143 1.947-1.128Zm.16.047a.098.098 0 0 1-.079.009.145.145 0 0 1-.088-.067l-1.933 1.15c.657 1.104 2.103 1.524 3.25.841l-1.15-1.933Zm1.314-.752-1.297.742 1.117 1.953 1.297-.742-1.117-1.953Zm.107-.407a.297.297 0 0 1-.107.407l1.117 1.953a2.547 2.547 0 0 0 .943-3.476l-1.954 1.116Zm2.206-3.82c-.918 0-1.86.334-2.354 1.19-.494.857-.31 1.84.15 2.636l1.948-1.128a.943.943 0 0 1-.14-.366c-.004-.053.008-.047-.009-.018-.017.03-.028.022.02 0a.937.937 0 0 1 .385-.063v-2.25Zm.299-.299c0 .162-.137.3-.3.3v2.25a2.553 2.553 0 0 0 2.55-2.55h-2.25Zm0-1.319v1.32h2.25v-1.32h-2.25Zm-.3-.3c.163 0 .3.138.3.3h2.25a2.553 2.553 0 0 0-2.55-2.55v2.25Zm-2.202-3.825c-.461.796-.645 1.779-.151 2.636.493.856 1.436 1.19 2.354 1.19v-2.25a.938.938 0 0 1-.385-.063c-.048-.022-.037-.03-.02 0 .017.028.005.034.01-.019a.943.943 0 0 1 .139-.366l-1.947-1.128Zm-.11-.4a.299.299 0 0 1 .11.401l1.947 1.126c.7-1.212.286-2.78-.94-3.481L11.763 2.14Zm-1.297-.743 1.297.742L12.88.187l-1.297-.742-1.117 1.953Zm-.184.049a.145.145 0 0 1 .088-.068.098.098 0 0 1 .08.01L11.6-.546c-1.148-.683-2.594-.263-3.251.841l1.933 1.15Zm-.075.13.082-.142L8.342.308 8.259.45l1.948 1.127ZM5.79 1.573c.457.798 1.217 1.448 2.206 1.448.988 0 1.748-.648 2.21-1.443L8.26.45a.948.948 0 0 1-.25.304c-.044.03-.046.017-.013.017.034 0 .033.014-.01-.016a.93.93 0 0 1-.244-.3L5.79 1.572Zm-.08-.138.082.142L7.74.45 7.658.308 5.71 1.435Zm-.16-.047a.098.098 0 0 1 .079-.009c.035.01.066.032.088.068L7.65.297C6.994-.809 5.548-1.229 4.4-.546l1.15 1.933Zm-1.314.752 1.297-.742L4.416-.555 3.12.187 4.237 2.14Zm-.11.402a.299.299 0 0 1 .11-.402L3.12.187a2.549 2.549 0 0 0-.94 3.481l1.948-1.126ZM1.925 6.367c.918 0 1.86-.334 2.354-1.19.494-.857.31-1.84-.151-2.636L2.18 3.67a.942.942 0 0 1 .14.366c.004.053-.008.047.009.018.017-.03.028-.021-.02 0a.938.938 0 0 1-.385.064v2.25Zm-.3.299c0-.162.138-.3.3-.3v-2.25a2.553 2.553 0 0 0-2.55 2.55h2.25Zm3.397.66A2.98 2.98 0 0 0 8 10.305v-2.25a.73.73 0 0 1-.73-.73H5.02ZM8 4.346a2.98 2.98 0 0 0-2.98 2.98h2.25a.73.73 0 0 1 .73-.73v-2.25Zm2.98 2.98A2.98 2.98 0 0 0 8 4.346v2.25a.73.73 0 0 1 .73.73h2.25ZM8 10.305a2.98 2.98 0 0 0 2.98-2.98H8.73a.73.73 0 0 1-.73.73v2.25ZM8 3.22a4.104 4.104 0 0 0-4.104 4.105h2.25c0-1.024.83-1.855 1.854-1.855v-2.25Zm4.104 4.105A4.104 4.104 0 0 0 8 3.22v2.25c1.024 0 1.854.83 1.854 1.855h2.25ZM8 11.43a4.104 4.104 0 0 0 4.104-4.104h-2.25C9.854 8.35 9.024 9.18 8 9.18v2.25ZM3.896 7.326A4.104 4.104 0 0 0 8 11.43V9.18a1.854 1.854 0 0 1-1.854-1.854h-2.25Z"
                              mask="url(#icon-settings-a)"
                            ></path>
                          </svg>
                        </span>

                        <span className="flex-auto text-[#393939] ml-1">
                          Settings
                        </span>
                      </a>
                      <a
                        href="#"
                        className="items-center rounded-lg cursor-pointer flex text-sm font-medium no-underline py-1 pr-1 pl-[2px] min-h-[36px] "
                      >
                        <span className="text-base relative text-center w-10 flex-[0_0_auto] -top-[1px] ">
                          <svg
                            className="icon ml-4 "
                            width="1em"
                            height="1em"
                            viewBox="0 0 16 16"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                          >
                            <mask id="icon-apps-a" fill="#fff">
                              <path
                                fillRule="evenodd"
                                d="M.786 4.061C.5 4.895.5 5.93.5 8c0 2.07 0 3.105.286 3.939a5.276 5.276 0 0 0 3.275 3.275C4.895 15.5 5.93 15.5 8 15.5c2.07 0 3.105 0 3.939-.286a5.277 5.277 0 0 0 3.275-3.275c.286-.834.286-1.869.286-3.939 0-2.07 0-3.105-.286-3.939A5.276 5.276 0 0 0 11.939.786C11.105.5 10.07.5 8 .5 5.93.5 4.895.5 4.061.786A5.276 5.276 0 0 0 .786 4.061ZM8 9.875c-.77 0-.934-.01-1.041-.038a1.125 1.125 0 0 1-.796-.796C6.135 8.934 6.125 8.77 6.125 8c0-.77.01-.934.038-1.041.104-.388.408-.692.796-.796.107-.028.271-.038 1.041-.038.77 0 .934.01 1.041.038.388.104.692.408.796.796.028.107.038.271.038 1.041 0 .77-.01.934-.038 1.041a1.125 1.125 0 0 1-.796.796c-.107.028-.271.038-1.041.038ZM5 8c0-.697 0-1.046.077-1.332a2.25 2.25 0 0 1 1.59-1.591C6.955 5 7.304 5 8 5s1.046 0 1.332.077a2.25 2.25 0 0 1 1.591 1.59C11 6.955 11 7.304 11 8s0 1.046-.077 1.332a2.25 2.25 0 0 1-1.59 1.591C9.045 11 8.696 11 8 11s-1.046 0-1.332-.077a2.25 2.25 0 0 1-1.591-1.59C5 9.045 5 8.696 5 8Z"
                                clipRule="evenodd"
                              ></path>
                            </mask>
                            <path
                              fill="currentColor"
                              fillRule="evenodd"
                              d="M.786 4.061C.5 4.895.5 5.93.5 8c0 2.07 0 3.105.286 3.939a5.276 5.276 0 0 0 3.275 3.275C4.895 15.5 5.93 15.5 8 15.5c2.07 0 3.105 0 3.939-.286a5.277 5.277 0 0 0 3.275-3.275c.286-.834.286-1.869.286-3.939 0-2.07 0-3.105-.286-3.939A5.276 5.276 0 0 0 11.939.786C11.105.5 10.07.5 8 .5 5.93.5 4.895.5 4.061.786A5.276 5.276 0 0 0 .786 4.061ZM8 9.875c-.77 0-.934-.01-1.041-.038a1.125 1.125 0 0 1-.796-.796C6.135 8.934 6.125 8.77 6.125 8c0-.77.01-.934.038-1.041.104-.388.408-.692.796-.796.107-.028.271-.038 1.041-.038.77 0 .934.01 1.041.038.388.104.692.408.796.796.028.107.038.271.038 1.041 0 .77-.01.934-.038 1.041a1.125 1.125 0 0 1-.796.796c-.107.028-.271.038-1.041.038ZM5 8c0-.697 0-1.046.077-1.332a2.25 2.25 0 0 1 1.59-1.591C6.955 5 7.304 5 8 5s1.046 0 1.332.077a2.25 2.25 0 0 1 1.591 1.59C11 6.955 11 7.304 11 8s0 1.046-.077 1.332a2.25 2.25 0 0 1-1.59 1.591C9.045 11 8.696 11 8 11s-1.046 0-1.332-.077a2.25 2.25 0 0 1-1.591-1.59C5 9.045 5 8.696 5 8Z"
                              clipRule="evenodd"
                            ></path>
                            <path
                              fill="#8e94bb"
                              d="m.786 4.061-1.063-.365 1.063.365Zm0 7.878 1.064-.366-1.064.366Zm3.275 3.275-.365 1.063.365-1.063Zm7.878 0 .365 1.063-.365-1.063Zm3.275-3.275 1.063.365-1.063-.365Zm0-7.878 1.063-.365-1.063.365ZM11.939.786l-.366 1.064.366-1.064Zm-7.878 0L3.696-.277 4.06.786Zm2.898 9.05L7.25 8.75l-.291 1.087Zm-.796-.795L7.25 8.75l-1.087.291Zm0-2.082 1.087.291-1.087-.291Zm.796-.796L7.25 7.25l-.291-1.087Zm2.082 0L8.75 7.25l.291-1.087Zm.796.796L8.75 7.25l1.087-.291Zm0 2.082L8.75 8.75l1.087.291Zm-.796.796L8.75 8.75l.291 1.087Zm-3.964-3.17-1.087-.29 1.087.29Zm1.59-1.59-.29-1.087.29 1.087Zm2.665 0 .292-1.087-.292 1.087Zm1.591 1.59 1.087-.29-1.087.29Zm0 2.665 1.087.292-1.087-.292Zm-1.59 1.591.29 1.087-.29-1.087Zm-2.665 0-.292 1.087.292-1.087Zm-1.591-1.59-1.087.29 1.087-.29ZM1.625 8c0-2.163.015-2.962.225-3.573l-2.127-.731C-.64 4.752-.625 6.022-.625 8h2.25Zm.225 3.573c-.21-.611-.225-1.41-.225-3.573h-2.25c0 1.978-.015 3.248.348 4.304l2.127-.731Zm2.577 2.577a4.15 4.15 0 0 1-2.577-2.577l-2.127.731a6.401 6.401 0 0 0 3.973 3.973l.731-2.127ZM8 14.375c-2.163 0-2.962-.015-3.573-.225l-.731 2.127c1.056.363 2.326.348 4.304.348v-2.25Zm3.573-.225c-.611.21-1.41.225-3.573.225v2.25c1.978 0 3.248.015 4.304-.348l-.731-2.127Zm2.577-2.577a4.15 4.15 0 0 1-2.577 2.577l.731 2.127a6.401 6.401 0 0 0 3.973-3.973l-2.127-.731ZM14.375 8c0 2.163-.015 2.962-.225 3.573l2.127.731c.363-1.056.348-2.326.348-4.304h-2.25Zm-.225-3.573c.21.611.225 1.41.225 3.573h2.25c0-1.978.015-3.248-.348-4.304l-2.127.731ZM11.573 1.85a4.15 4.15 0 0 1 2.577 2.577l2.127-.731a6.401 6.401 0 0 0-3.973-3.973l-.731 2.127ZM8 1.625c2.163 0 2.962.015 3.573.225l.731-2.127C11.248-.64 9.978-.625 8-.625v2.25Zm-3.573.225c.611-.21 1.41-.225 3.573-.225v-2.25c-1.978 0-3.248-.015-4.304.348l.731 2.127ZM1.85 4.427A4.151 4.151 0 0 1 4.427 1.85L3.696-.277A6.401 6.401 0 0 0-.277 3.696l2.127.731Zm4.818 6.496c.177.048.345.06.518.068.176.007.43.009.814.009V8.75c-.387 0-.6-.003-.724-.008-.129-.005-.096-.01-.026.008l-.582 2.173Zm-1.591-1.59a2.25 2.25 0 0 0 1.59 1.59L7.25 8.75l-2.173.582ZM5 8c0 .383.002.638.01.814.006.173.02.341.067.518L7.25 8.75c.019.07.013.103.008-.026A21.072 21.072 0 0 1 7.25 8H5Zm.077-1.332c-.048.177-.06.345-.068.518C5.002 7.362 5 7.616 5 8h2.25c0-.387.003-.6.008-.724.005-.129.01-.096-.008-.026l-2.173-.582Zm1.59-1.591a2.25 2.25 0 0 0-1.59 1.59l2.173.583-.582-2.173ZM8 5c-.383 0-.638.002-.814.01-.173.006-.341.02-.518.067L7.25 7.25c-.07.019-.103.013.026.008.125-.005.337-.008.724-.008V5Zm1.332.077a2.302 2.302 0 0 0-.518-.068C8.638 5.002 8.384 5 8 5v2.25c.387 0 .6.003.724.008.129.005.096.01.026-.008l.582-2.173Zm1.591 1.59a2.25 2.25 0 0 0-1.59-1.59L8.75 7.25l2.173-.582ZM11 8c0-.383-.002-.638-.01-.814a2.302 2.302 0 0 0-.067-.518L8.75 7.25c-.019-.07-.013-.103-.008.026.005.125.008.337.008.724H11Zm-.077 1.332c.048-.177.06-.345.068-.518.007-.176.009-.43.009-.814H8.75c0 .387-.003.6-.008.724-.005.129-.01.096.008.026l2.173.582Zm-1.59 1.591a2.25 2.25 0 0 0 1.59-1.59L8.75 8.75l.582 2.173ZM8 11c.383 0 .638-.002.814-.01.173-.006.341-.02.518-.067L8.75 8.75c.07-.019.103-.013-.026-.008-.125.005-.337.008-.724.008V11ZM3.99 6.376c-.125.466-.115.999-.115 1.624h2.25c0-.77.01-.934.038-1.041L3.99 6.376ZM6.376 3.99A3.375 3.375 0 0 0 3.99 6.376l2.173.583c.104-.388.408-.692.796-.796L6.376 3.99ZM8 3.875c-.625 0-1.158-.01-1.624.115l.583 2.173c.107-.028.271-.038 1.041-.038v-2.25Zm1.624.115c-.466-.125-.999-.115-1.624-.115v2.25c.77 0 .934.01 1.041.038l.583-2.173Zm2.386 2.386A3.375 3.375 0 0 0 9.624 3.99L9.04 6.163c.388.104.692.408.796.796l2.173-.583ZM12.125 8c0-.625.01-1.158-.115-1.624l-2.173.583c.028.107.038.271.038 1.041h2.25Zm-.115 1.624c.125-.466.115-.999.115-1.624h-2.25c0 .77-.01.934-.038 1.041l2.173.583ZM9.624 12.01a3.375 3.375 0 0 0 2.386-2.386L9.837 9.04a1.125 1.125 0 0 1-.796.796l.583 2.173ZM8 12.125c.625 0 1.158.01 1.624-.115L9.04 9.837c-.107.028-.271.038-1.041.038v2.25Zm-1.624-.115c.466.125.999.115 1.624.115v-2.25c-.77 0-.934-.01-1.041-.038l-.583 2.173ZM3.99 9.624a3.375 3.375 0 0 0 2.386 2.386l.583-2.173a1.125 1.125 0 0 1-.796-.796l-2.173.583ZM3.875 8c0 .625-.01 1.158.115 1.624l2.173-.583C6.135 8.934 6.125 8.77 6.125 8h-2.25Z"
                              mask="url(#icon-apps-a)"
                            ></path>
                          </svg>
                        </span>

                        <span className="flex-auto text-[#393939] ml-1">
                          App Center
                        </span>
                      </a>
                      <a
                        href="#"
                        className="items-center rounded-lg cursor-pointer flex text-sm font-medium no-underline py-1 pr-1 pl-[2px] min-h-[36px] text-[#393939] "
                      >
                        <span className="text-base relative text-center w-10 flex-[0_0_auto] -top-[1px] ">
                          <svg
                            className="icon ml-4 "
                            width="1em"
                            height="1em"
                            viewBox="0 0 16 16"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill="#8e94bb"
                              fillRule="evenodd"
                              d="m6.167 1.262-4.75 4.636C.462 6.831.223 8.363.842 9.59l2.197 4.358c.483.958 1.404 1.553 2.403 1.553h4.998c.98 0 1.886-.572 2.377-1.5l2.315-4.383c.653-1.236.42-2.804-.557-3.75L9.814 1.254C8.772.245 7.204.249 6.167 1.262ZM8 7.25a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm3 1.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </span>
                        <span className="text-[#393939] ml-1">
                          Template Center
                        </span>
                      </a>
                    </div>
                    <hr />
                    <a
                      href="#"
                      className="items-center rounded-lg cursor-pointer flex text-sm font-medium no-underline py-1 pr-1 pl-[2px] min-h-[36px] text-[#393939] ml-2 mt-2 "
                    >
                      <span className="text-base relative text-center w-10 flex-[0_0_auto] -top-[1px] ">
                        <svg
                          className="icon ml-4"
                          width="1em"
                          height="1em"
                          viewBox="0 0 16 16"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="0.5"
                            y="0.5"
                            width="6.71642"
                            height="6.71642"
                            rx="2.25"
                            fill="#8e94bb"
                          ></rect>
                          <rect
                            x="0.5"
                            y="8.78357"
                            width="6.71642"
                            height="6.71642"
                            rx="2.25"
                            fill="currentColor"
                          ></rect>
                          <rect
                            x="8.7836"
                            y="8.78357"
                            width="6.71642"
                            height="6.71642"
                            rx="2.25"
                            fill="currentColor"
                          ></rect>
                          <path
                            d="M14.3918 3.85828L9.89185 3.85828"
                            stroke="currentColor"
                            strokeWidth="1.125"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></path>
                          <path
                            d="M12.1418 6.10828L12.1418 1.60828"
                            stroke="currentColor"
                            strokeWidth="1.125"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></path>
                        </svg>
                      </span>
                      <span className="text-[#393939] ml-1">
                        Import Projects
                      </span>
                    </a>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(onWorkspaceGetByIdSuccess(null));
                        localStorage.removeItem("workspaceId");
                        navigate(links.workspace);
                      }}
                      className="items-center rounded-lg cursor-pointer flex text-sm font-medium no-underline py-1 pr-1 pl-[2px] min-h-[36px] text-[#393939] ml-2  "
                    >
                      <span className="text-base relative text-center w-10 flex-[0_0_auto] -top-[1px] ">
                        <svg
                          className="icon ml-4"
                          width="1em"
                          height="1em"
                          viewBox="0 0 16 16"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill="#8e94bb"
                            fillRule="evenodd"
                            d="M.5 8c0-2.07 0-3.105.286-3.939A5.276 5.276 0 0 1 4.061.786C4.895.5 5.93.5 8 .5c2.07 0 3.105 0 3.939.286a5.276 5.276 0 0 1 3.275 3.275C15.5 4.895 15.5 5.93 15.5 8c0 2.07 0 3.105-.286 3.939a5.277 5.277 0 0 1-3.275 3.275c-.834.286-1.869.286-3.939.286-2.07 0-3.105 0-3.939-.286a5.276 5.276 0 0 1-3.275-3.275C.5 11.105.5 10.07.5 8Zm10.313 0c0 .31-.252.563-.563.563H8.562v1.687a.562.562 0 1 1-1.124 0V8.562H5.75a.563.563 0 0 1 0-1.124h1.688V5.75a.563.563 0 0 1 1.125 0v1.688h1.687c.31 0 .563.251.563.562Z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </span>
                      <span className="text-[#393939] ml-1">New Workspace</span>
                    </a>
                    <a
                      href="#"
                      className="items-center rounded-lg cursor-pointer flex text-sm font-medium no-underline  pr-1 pl-[2px] min-h-[36px] text-[#393939] ml-2  "
                    >
                      <svg
                        className="icon ml-4"
                        width="20px"
                        height="20px"
                        viewBox="0 0 16 16"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill="#8e94bb"
                          fillRule="evenodd"
                          d="M.786 4.061C.5 4.895.5 5.93.5 8c0 2.07 0 3.105.286 3.939a5.276 5.276 0 0 0 3.275 3.275C4.895 15.5 5.93 15.5 8 15.5c2.07 0 3.105 0 3.939-.286a5.277 5.277 0 0 0 3.275-3.275c.286-.834.286-1.869.286-3.939 0-2.07 0-3.105-.286-3.939A5.276 5.276 0 0 0 11.939.786C11.105.5 10.07.5 8 .5 5.93.5 4.895.5 4.061.786A5.276 5.276 0 0 0 .786 4.061ZM9.92 5a.562.562 0 0 0-.84-.748l-3 3.375a.562.562 0 0 0 .42.936h1.747l-2.167 2.44a.562.562 0 1 0 .84.747l3-3.375a.562.562 0 0 0-.42-.937H7.753L9.92 5Z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <span className="text-[#393939] ml-3 ">
                        Connect Workspace
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-auto py-0 px-4">
        <div
          className="app-noti py-1 px-1 cursor-pointer my-0 "
          onClick={() => dispatch(openHeaderDrawyer())}
        >
          <span className="icon-holder text-[#fff] opacity-90 hover:text-[#eee]">
            <NotificationsNoneOutlinedIcon />
          </span>
        </div>
      </div>
      <div className="flex m-[0_auto] w-[90%]">
        <div className="flex flex-[0_0_auto]">
          <div className="ml-3 mt-[2px]">
            {/* <button className="bg-[#fff] hover:bg-[#eee] text-[#9399AB] text-sm rounded-md h-6 w-6 pl-2 opacity-70">
              <svg
                className="color-[white]  text-sm "
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
            </button>
            <button className="bg-[#fff] text-[#9399AB] hover:bg-[#eee] text-sm rounded-md h-6 w-6 ml-1 pl-2 opacity-70">
              <svg
                className="color-[white]"
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
                              transform="translate(30.000000, 60.333333) scale(-1, 1) translate(-30.000000, -60.333333) "
                            ></path>
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </button> */}
          </div>
        </div>

        <div className="items-center self-center bg-[#fff] rounded text-[#9399AB] flex text-xs font-medium h-[26px] flex-[1_0_auto] m-[0_auto] max-w-[60%] py-0 px-3 ">
          <div className="items-center flex justify-center flex-auto text-[#9399AB] text-xs  ">
            <svg
              className="mr-1 mt-[2px] "
              width="1em"
              height="1em"
              viewBox="0 0 15 15"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.151 13.092a.746.746 0 0 1-.002 1.057.747.747 0 0 1-1.057.002l-4.066-4.066a5.618 5.52 0 1 1 1.06-1.06l4.065 4.067zM5.618 9.738a4.12 4.12 0 1 0 0-8.24 4.12 4.12 0 0 0 0 8.24z"
                fill="currentColor"
                fillRule="evenodd"
              ></path>
            </svg>
            Search
          </div>
          <span className="flex-[0_0_auto]">
            <span className="inline-block text-center align-middle min-w-[10px] text-[#9399AB]">
              <span className="ml-0 mr-1">CTRL</span>
            </span>
            <span className="inline-block text-center align-middle min-w-[10px] text-[#9399AB]">
              {" "}
              K
            </span>
          </span>
        </div>
      </div>
      <div className="items-center flex flex-[0_0_auto] text-[#9399AB]">
        <button
          onClick={handleClick}
          className="bg-[#fff] hover:bg-[#eee] border-transparent text-[#9399AB] h-6  mr-1 py-0 px-4 flex  text-[13px] ml-3 font-medium rounded-md pt-[2px]"
        >
          Create
          <KeyboardArrowDownIcon sx={{ position: "relative", top: "-1px" }} />
        </button>
        {/* <button className="bg-[#fff] hover:bg-[#eee] border-transparent text-[#9399AB] h-6 py-0 px-4 flex  text-[13px] ml-3 font-medium rounded-md pt-[2px]">
          14 days left on trial
        </button> */}
        <div className="dropdown inline-block relative ">
          <button className=" font-semibold py-2 px-4 rounded inline-flex items-center">
            <span className="items-center font-bold flex justify-center text-white align-middle bg-[#ff735f] border-[#f9a33ad9] h-6 w-6 rounded-md text-[9px] ">
              {auth?.user?.name?.substr(0, 2)?.toUpperCase() ?? ""}
            </span>
            <span className="h-2 m-0 absolute w-2 1 border border-white bg-green-500 rounded-full top-6 right-3"></span>
          </button>
          <ul className="dropdown-menu absolute hidden text-gray-700  bg-white right-0 min-w-[294px] h-[360px] border  ">
            <div className=" flex">
              <span className="items-center font-bold inline-flex text-white align-middle bg-[#ff735f] border-[#f9a33ad9] h-16 w-16 pl-5 pb-1 rounded-md ml-5 mt-4 text-xl">
                {auth?.user?.name?.substr(0, 2)?.toUpperCase() ?? ""}
              </span>
              <div className="text-[#8e94bb] text-base font-medium inline-flex flex-col ml-24 absolute mt-3">
                <h5 className="font-semibold">
                  {auth?.user?.name ?? "AreebAhmad"}
                </h5>
                <span className="h-2 m-0 absolute w-2 border border-white bg-green-500 rounded-full -right-2"></span>
                <h6 className=" opacity-60 font-semibold text-xs uppercase mb-2">
                  {auth?.user?.designation ?? ""}
                </h6>
                <button className="font-semibold border border-[#363c5b] text-[#7c88c7] px-1 flex text-sm w-12 rounded">
                  <svg
                    className="mr-1 mt-1 "
                    width="12px"
                    height="12px"
                    viewBox="0 0 12 12"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6.66667 0.666569C6.66667 0.296631 6.36819 0 6 0C5.62924 0 5.33333 0.298433 5.33333 0.666569V5.33333H0.666569C0.296631 5.33333 0 5.63181 0 6C0 6.37076 0.298433 6.66667 0.666569 6.66667H5.33333V11.3334C5.33333 11.7034 5.63181 12 6 12C6.37076 12 6.66667 11.7016 6.66667 11.3334V6.66667H11.3334C11.7034 6.66667 12 6.36819 12 6C12 5.62924 11.7016 5.33333 11.3334 5.33333H6.66667V0.666569Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  Tag
                </button>
              </div>
            </div>
            <div className="pt-0 px-4 pb-3 flex-col mt-5 hover:text-[#009084]  ">
              <button className="min-w-full font-Manrope text-[14px] px-0 bg-white border border-[#e8e8e8] py-2 rounded-md font-medium hover:shadow-md">
                Set yourself as
                <span className="font-bold"> Away</span>
              </button>
            </div>
            <hr />
            <div className="bg-[#fafbfd] h-[140px] w-full py-3 px-4">
              <div className="text-xs mb-1 text-[#8e94bb] font-medium ">
                <i
                  className="fa-solid fa-envelope  mr-1 text-xs"
                  style={{ color: "#8e94bb" }}
                ></i>
                {auth?.user?.email ?? ""}
              </div>
              <div className="text-xs mb-1 text-[#8e94bb] font-medium ">
                <i
                  className="fa-regular fa-clock fa-fw"
                  style={{ color: "#8e94bb" }}
                ></i>
                <span>
                  <time>{getCurrTime(new Date())}</time>
                  &nbsp; (local time)
                </span>
              </div>
              <div className="flex mt-3 -mx-1">
                <button className="px-1 w-2/4 flex-auto bg-white border border-[#e8e8e8] h-8 text-sm items-center rounded-md font-semibold text-[14px] hover:text-[#009084] hover:shadow-md ">
                  <svg
                    className="inline-flex mr-1 -mt-1"
                    width="1em"
                    height="1em"
                    viewBox="0 0 10 10"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g
                      id="Page-2"
                      s
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g
                        id="Team-overview---search"
                        transform="translate(-195.000000, -181.000000)"
                        fill="currentColor"
                      >
                        <g
                          id="Group-2"
                          transform="translate(121.000000, 153.000000)"
                        >
                          <path
                            d="M75,35.4952421 L75,36.17338 C75.1749893,36.2801701 76.5730894,36.9985151 78.9999999,36.9985149 C81.4269104,36.9985146 82.8251939,36.2809335 83,36.1742018 L83,35.4952421 C83,34.6371765 81.0964783,33.9698598 80.9607895,33.9187773 C80.5350099,34.6829256 79.905538,35.2499999 79,35.25 C78.0949419,35.2500001 77.4656574,34.6835268 77.0398876,33.9199923 C76.9055757,33.9704691 75,34.635437 75,35.4952421 Z M76.25,30.5893243 C76.25,29.15928 77.4812169,28 79,28 C80.5187831,28 81.75,29.15928 81.75,30.5893243 C81.75,31.1961664 81.6440039,32.1272483 81.3568094,32.9981097 C82.3582639,33.3806945 84,34.0003662 84,35.4952421 L84,36.4988173 C84,37.0513451 81.8424683,37.9999997 79,38 C76.1575317,38.0000003 74,37.0494601 74,36.4988173 L74,35.4952421 C74,33.9952087 75.642655,33.3812319 76.6436151,32.9993966 C76.3561006,32.1281657 76.25,31.1964653 76.25,30.5893243 Z M78.9999998,34.25 C79.9847893,34.2499998 80.75,32.4413168 80.75,30.5893243 C80.75,29.7254728 79.9795093,29 79,29 C78.0204907,29 77.25,29.7254728 77.25,30.5893243 C77.25,32.4413169 78.0152107,34.2500002 78.9999998,34.25 Z"
                            id="Combined-Shape"
                          ></path>
                        </g>
                      </g>
                    </g>
                  </svg>
                  See profile
                </button>
              </div>
              <PersonalTaskDrawyer />

              <div className="flex mt-3 -mx-1">
                <button
                  onClick={() => navigate(links.profileSettings)}
                  className="px-1 w-2/4 flex-auto bg-white border border-[#e8e8e8] h-8 text-sm items-center rounded-md font-semibold text-[14px] hover:text-[#009084] hover:shadow-md  "
                >
                  <svg
                    className="inline-flex mr-1 -mt-1"
                    width="1em"
                    height="0.9375em"
                    viewBox="0 0 16 15"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                  >
                    <mask id="icon-settings-a" fill="#fff">
                      <path
                        fillRule="evenodd"
                        d="M.5 6.666v1.32c0 .779.637 1.424 1.424 1.424 1.357 0 1.912.96 1.23 2.136a1.424 1.424 0 0 0 .524 1.942l1.297.742a1.251 1.251 0 0 0 1.71-.45l.082-.143c.682-1.176 1.791-1.176 2.466 0l.083.143a1.251 1.251 0 0 0 1.709.45l1.296-.742c.683-.39.915-1.26.525-1.942-.682-1.177-.127-2.136 1.23-2.136.787 0 1.424-.645 1.424-1.425V6.666c0-.787-.645-1.424-1.424-1.424-1.357 0-1.912-.96-1.23-2.137a1.424 1.424 0 0 0-.524-1.941L11.024.422a1.251 1.251 0 0 0-1.71.45l-.082.142c-.682 1.177-1.792 1.177-2.466 0L6.684.87a1.251 1.251 0 0 0-1.709-.45l-1.297.743a1.424 1.424 0 0 0-.524 1.941c.682 1.177.127 2.137-1.23 2.137C1.137 5.242.5 5.886.5 6.666ZM8 9.18A1.854 1.854 0 1 1 8 5.47 1.854 1.854 0 0 1 8 9.18ZM5.02 7.326a2.98 2.98 0 1 1 5.96 0 2.98 2.98 0 0 1-5.96 0Z"
                        clipRule="evenodd"
                      ></path>
                    </mask>
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M.5 6.666v1.32c0 .779.637 1.424 1.424 1.424 1.357 0 1.912.96 1.23 2.136a1.424 1.424 0 0 0 .524 1.942l1.297.742a1.251 1.251 0 0 0 1.71-.45l.082-.143c.682-1.176 1.791-1.176 2.466 0l.083.143a1.251 1.251 0 0 0 1.709.45l1.296-.742c.683-.39.915-1.26.525-1.942-.682-1.177-.127-2.136 1.23-2.136.787 0 1.424-.645 1.424-1.425V6.666c0-.787-.645-1.424-1.424-1.424-1.357 0-1.912-.96-1.23-2.137a1.424 1.424 0 0 0-.524-1.941L11.024.422a1.251 1.251 0 0 0-1.71.45l-.082.142c-.682 1.177-1.792 1.177-2.466 0L6.684.87a1.251 1.251 0 0 0-1.709-.45l-1.297.743a1.424 1.424 0 0 0-.524 1.941c.682 1.177.127 2.137-1.23 2.137C1.137 5.242.5 5.886.5 6.666ZM8 9.18A1.854 1.854 0 1 1 8 5.47 1.854 1.854 0 0 1 8 9.18ZM5.02 7.326a2.98 2.98 0 1 1 5.96 0 2.98 2.98 0 0 1-5.96 0Z"
                      clipRule="evenodd"
                    ></path>
                    <path
                      fill="currentColor"
                      d="m3.154 11.546-.974-.564v.001l.974.563Zm.524 1.942.56-.977h-.001l-.559.977Zm1.297.742.575-.967a.61.61 0 0 0-.016-.01l-.559.977Zm1.71-.45.966.575.007-.011-.974-.564Zm.082-.143-.974-.564.974.564Zm2.466 0-.976.56.002.004.974-.564Zm.083.143-.974.564.007.011.967-.575Zm1.709.45-.56-.977a.54.54 0 0 0-.015.01l.575.967Zm1.296-.742-.558-.977.559.977Zm.525-1.942.977-.558-.003-.006-.974.564Zm0-8.44.974.563-.974-.564Zm-.524-1.942-.56.976h.001l.559-.976ZM11.024.422l-.575.966a.94.94 0 0 0 .016.01l.559-.976Zm-1.71.45L8.35.295l-.007.012.974.563Zm-.082.142.973.564-.973-.564Zm-2.466 0 .976-.56L7.74.45l-.973.564ZM6.684.87l.974-.563-.007-.012-.967.575ZM4.975.421l.559.977.016-.01-.575-.966Zm-1.297.743.559.976-.559-.976Zm-.524 1.941-.974.563v.001l.974-.564Zm-1.53 4.88V6.666h-2.25v1.32h2.25Zm.3.3a.304.304 0 0 1-.3-.3h-2.25a2.553 2.553 0 0 0 2.55 2.55v-2.25Zm2.203 3.825c.461-.795.645-1.778.151-2.635-.493-.857-1.436-1.19-2.354-1.19v2.25c.211 0 .331.037.385.062.048.023.037.03.02.001-.017-.03-.005-.035-.01.018a.942.942 0 0 1-.139.366l1.947 1.128Zm.11.4a.299.299 0 0 1-.11-.401L2.18 10.983a2.549 2.549 0 0 0 .94 3.481l1.117-1.953Zm1.297.743-1.297-.742-1.117 1.953 1.296.742 1.118-1.953Zm.184-.048a.145.145 0 0 1-.088.067.098.098 0 0 1-.08-.01L4.4 15.197c1.148.683 2.594.264 3.251-.84l-1.933-1.151Zm.075-.131-.082.142 1.947 1.128.082-.143-1.947-1.127Zm4.416.004c-.457-.798-1.217-1.448-2.206-1.448-.988 0-1.749.648-2.21 1.443l1.947 1.129c.106-.184.2-.27.25-.304.044-.031.046-.018.013-.018-.034 0-.033-.014.01.016a.93.93 0 0 1 .244.301l1.952-1.119Zm.08.138-.082-.142L8.259 14.2l.083.143 1.947-1.128Zm.16.047a.098.098 0 0 1-.079.009.145.145 0 0 1-.088-.067l-1.933 1.15c.657 1.104 2.103 1.524 3.25.841l-1.15-1.933Zm1.314-.752-1.297.742 1.117 1.953 1.297-.742-1.117-1.953Zm.107-.407a.297.297 0 0 1-.107.407l1.117 1.953a2.547 2.547 0 0 0 .943-3.476l-1.954 1.116Zm2.206-3.82c-.918 0-1.86.334-2.354 1.19-.494.857-.31 1.84.15 2.636l1.948-1.128a.943.943 0 0 1-.14-.366c-.004-.053.008-.047-.009-.018-.017.03-.028.022.02 0a.937.937 0 0 1 .385-.063v-2.25Zm.299-.299c0 .162-.137.3-.3.3v2.25a2.553 2.553 0 0 0 2.55-2.55h-2.25Zm0-1.319v1.32h2.25v-1.32h-2.25Zm-.3-.3c.163 0 .3.138.3.3h2.25a2.553 2.553 0 0 0-2.55-2.55v2.25Zm-2.202-3.825c-.461.796-.645 1.779-.151 2.636.493.856 1.436 1.19 2.354 1.19v-2.25a.938.938 0 0 1-.385-.063c-.048-.022-.037-.03-.02 0 .017.028.005.034.01-.019a.943.943 0 0 1 .139-.366l-1.947-1.128Zm-.11-.4a.299.299 0 0 1 .11.401l1.947 1.126c.7-1.212.286-2.78-.94-3.481L11.763 2.14Zm-1.297-.743 1.297.742L12.88.187l-1.297-.742-1.117 1.953Zm-.184.049a.145.145 0 0 1 .088-.068.098.098 0 0 1 .08.01L11.6-.546c-1.148-.683-2.594-.263-3.251.841l1.933 1.15Zm-.075.13.082-.142L8.342.308 8.259.45l1.948 1.127ZM5.79 1.573c.457.798 1.217 1.448 2.206 1.448.988 0 1.748-.648 2.21-1.443L8.26.45a.948.948 0 0 1-.25.304c-.044.03-.046.017-.013.017.034 0 .033.014-.01-.016a.93.93 0 0 1-.244-.3L5.79 1.572Zm-.08-.138.082.142L7.74.45 7.658.308 5.71 1.435Zm-.16-.047a.098.098 0 0 1 .079-.009c.035.01.066.032.088.068L7.65.297C6.994-.809 5.548-1.229 4.4-.546l1.15 1.933Zm-1.314.752 1.297-.742L4.416-.555 3.12.187 4.237 2.14Zm-.11.402a.299.299 0 0 1 .11-.402L3.12.187a2.549 2.549 0 0 0-.94 3.481l1.948-1.126ZM1.925 6.367c.918 0 1.86-.334 2.354-1.19.494-.857.31-1.84-.151-2.636L2.18 3.67a.942.942 0 0 1 .14.366c.004.053-.008.047.009.018.017-.03.028-.021-.02 0a.938.938 0 0 1-.385.064v2.25Zm-.3.299c0-.162.138-.3.3-.3v-2.25a2.553 2.553 0 0 0-2.55 2.55h2.25Zm3.397.66A2.98 2.98 0 0 0 8 10.305v-2.25a.73.73 0 0 1-.73-.73H5.02ZM8 4.346a2.98 2.98 0 0 0-2.98 2.98h2.25a.73.73 0 0 1 .73-.73v-2.25Zm2.98 2.98A2.98 2.98 0 0 0 8 4.346v2.25a.73.73 0 0 1 .73.73h2.25ZM8 10.305a2.98 2.98 0 0 0 2.98-2.98H8.73a.73.73 0 0 1-.73.73v2.25ZM8 3.22a4.104 4.104 0 0 0-4.104 4.105h2.25c0-1.024.83-1.855 1.854-1.855v-2.25Zm4.104 4.105A4.104 4.104 0 0 0 8 3.22v2.25c1.024 0 1.854.83 1.854 1.855h2.25ZM8 11.43a4.104 4.104 0 0 0 4.104-4.104h-2.25C9.854 8.35 9.024 9.18 8 9.18v2.25ZM3.896 7.326A4.104 4.104 0 0 0 8 11.43V9.18a1.854 1.854 0 0 1-1.854-1.854h-2.25Z"
                      mask="url(#icon-settings-a)"
                    ></path>
                  </svg>
                  Profile Settings
                </button>
              </div>
              <div className="flex mt-3 -mx-1">
                <button
                  onClick={logoutUser}
                  className="px-1 w-2/4 flex-auto bg-white border border-[#e8e8e8] h-8 text-sm items-center rounded-md font-semibold text-[14px] hover:text-[#009084] hover:shadow-md  "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="inline-flex mr-1 -mt-1 w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                    />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </ul>
        </div>
      </div>
      <AddProjectTask />
      <HeaderDrawyer />

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        sx={{ marginTop: "5px" }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <div className=" py-4 text-[#9EACD1]">
          <div
            onClick={() => navigate("/add/project")}
            className="flex space-x-3 cursor-pointer  hover:text-[#00A99B] px-3 py-1 hover:bg-[#F2F8FA]  items-center"
          >
            <GppGoodIcon
              sx={{
                fontSize: "20px",
              }}
            />
            <h3 className="hover:text-[#00A99B]">Project</h3>
          </div>
          <div
            className="flex space-x-3 py-1 px-3  hover:text-[#00A99B] cursor-pointer pt-1 items-center hover:bg-[#F2F8FA]"
            onClick={() => dispatch(personalTaskDrawyerOpen())}
          >
            <CheckIcon
              sx={{
                fontSize: "20px",
              }}
            />
            <h3 className="">Personal Task</h3>
          </div>
          <div className="flex space-x-3 py-1  px-3 hover:text-[#00A99B]  hover:bg-[#F2F8FA]   pt-1 items-center">
            <PlaylistAddCheckIcon
              sx={{
                fontSize: "20px",
              }}
            />
            <h3
              onClick={() => dispatch(openProjectTask())}
              className="cursor-pointer hover:text-[#00A99B]"
            >
              Project Task
            </h3>
          </div>
          {/* <div className="flex space-x-3 pt-1 items-center">
            <TextSnippetIcon sx={{ fontSize: "20px" }} />
            <h3>Document</h3>
          </div>
          <div className="flex space-x-3 pt-1 items-center">
            <EditNoteIcon sx={{ fontSize: "24px" }} />
            <h3>Note</h3>
          </div> */}
          {/* <div className="flex space-x-3 items-center">
            <EditNoteIcon sx={{ fontSize: "28px" }} />
            <h3>Note</h3>
          </div> */}
        </div>
      </Popover>
    </div>
  );
}

export default Header;
