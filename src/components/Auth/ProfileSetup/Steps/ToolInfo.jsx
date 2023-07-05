import React from "react";

function ToolInfo({ handleSkip }) {
  return (
    <>
      {/* Main Section */}
      <div className="py-16 px-0 cursor-pointer">
        <div className="w-[700px] m-[0_auto] flex text-left">
          <div className="flex-auto">
            <div className="mb-5 relative">
              <div className="text-base font-semibold block m-1 text-center">
                Import data from another tool(optional)
              </div>
              <div className="flex justify-center flex-wrap m-[0_-40px] p-[0_10px]  ">
                <div className="rounded-lg h-48 m-1 text-center w-44 p-[0px_2px] border border-[#e8e8e8;] hover:bg-[rgba(34,181,169,.07)] hover:border  hover:border-[#22b5a9]">
                  <div className="items-center cursor-pointer flex flex-col h-full justify-center">
                    <div className="icon-box h-10 mb-3 text-[41px] leading-10">
                      <svg
                        className="icon "
                        width="1em"
                        height="1em"
                        viewBox="0 0 512 512"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill="#89c429"
                          d="M511.344 274.266c.426-6.035.656-12.123.656-18.266C512 114.615 397.385 0 256 0S0 114.615 0 256c0 117.769 79.53 216.949 187.809 246.801l323.535-228.535z"
                        ></path>
                        <path
                          fill="#709e21"
                          d="M511.344 274.266 314.991 77.913 119.096 434.087l68.714 68.714C209.522 508.787 232.385 512 256 512c135.243 0 245.976-104.875 255.344-237.734z"
                        ></path>
                        <path
                          fill="#fff"
                          d="m278.328 333.913-22.617-256H119.096v233.739z"
                        />
                        <path
                          fill="#e8e6e6"
                          d="M392.904 311.652V155.826l-55.652-22.261-22.261-55.652h-59.28l.356 256z"
                        ></path>
                        <path
                          fill="#fff"
                          d="M314.991 155.826V77.913l77.913 77.913z"
                        ></path>
                        <path
                          fill="#b3da73"
                          d="M119.096 311.652h273.809v122.435H119.096z"
                        />
                        <path
                          fill="#fff"
                          d="m227.424 354.863-7.796 9.233c-3.48-4.238-8.626-6.887-13.32-6.887-8.4 0-14.757 6.659-14.757 15.363 0 8.854 6.357 15.589 14.757 15.589 4.466 0 9.612-2.422 13.32-6.206l7.871 8.324c-5.677 5.827-14.076 9.687-21.871 9.687-15.969 0-27.849-11.73-27.849-27.245 0-15.287 12.184-26.79 28.305-26.79 7.87.002 16.042 3.482 21.34 8.932zM276.772 351.684l-5.071 10.519c-5.6-3.255-12.638-5.524-16.952-5.524-3.482 0-5.827 1.287-5.827 3.86 0 9.157 28.001 3.936 28.001 23.082 0 10.595-9.384 16.196-21.19 16.196-8.854 0-17.936-3.33-24.218-8.476l5.221-10.368c5.449 4.768 13.623 7.947 19.148 7.947 4.237 0 6.886-1.589 6.886-4.617 0-9.384-28.001-3.783-28.001-22.552 0-9.763 8.4-15.969 21.116-15.969 7.644-.001 15.438 2.346 20.887 5.902zM301.372 399.362l-20.585-52.975h14.379l13.547 38.975 13.547-38.975h13.848l-20.811 52.975h-13.925z"
                        ></path>
                      </svg>
                    </div>
                    <h5 className="text-gray-900 text-sm font-medium mb-1">
                      {" "}
                      Spreadsheet
                    </h5>
                    <p className="text-gray-500 text-xs font-medium">
                      Import data from CSV,Excel, and XLS files
                    </p>
                  </div>
                </div>
                <div className="rounded-lg h-48 m-1 text-center w-44 p-[0px_2px] border border-[#e8e8e8;] hover:bg-[rgba(34,181,169,.07)] hover:border  hover:border-[#22b5a9]">
                  <div className="items-center cursor-pointer flex flex-col h-full justify-center">
                    <div className="icon-box h-10 mb-3 text-[41px] leading-10">
                      <svg
                        className="icon "
                        width="1em"
                        height="0.926829268292683em"
                        viewBox="0 0 41 38"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          <radialGradient
                            cy="54.652%"
                            fx="50%"
                            fy="54.652%"
                            r="71.69%"
                            gradientTransform="matrix(.9243 0 0 1 .038 0)"
                            id="icon-asana-gradient"
                          >
                            <stop stopColor="#FFB900" offset="0%" />
                            <stop stopColor="#F95D8F" offset="60%" />
                            <stop stopColor="#F95353" offset="99.91%" />
                          </radialGradient>
                        </defs>
                        <path
                          d="M31.483 19.61a8.715 8.715 0 0 0-8.715 8.714 8.715 8.715 0 1 0 17.43 0 8.715 8.715 0 0 0-8.715-8.715zm-22.643 0a8.715 8.715 0 1 0 0 17.43 8.715 8.715 0 0 0 0-17.43zM28.876 8.715a8.715 8.715 0 1 1-17.43 0 8.715 8.715 0 0 1 17.43 0z"
                          fill="url(#icon-asana-gradient)"
                          fillRule="nonzero"
                        />
                      </svg>
                    </div>
                    <h5 className="text-gray-900 text-sm font-medium mb-1">
                      {" "}
                      Asana
                    </h5>
                    <p className="text-gray-500 text-xs font-medium">
                      Import projects, tasks, files, and people.
                    </p>
                  </div>
                </div>
                <div className="rounded-lg h-48 m-1 text-center w-44 p-[0px_2px] border border-[#e8e8e8;] hover:bg-[rgba(34,181,169,.07)] hover:border  hover:border-[#22b5a9]">
                  <div className="items-center cursor-pointer flex flex-col h-full justify-center">
                    <div className="icon-box h-10 mb-3 text-[41px] leading-10">
                      <svg
                        className="icon "
                        width="1em"
                        height="0.825em"
                        viewBox="0 0 40 33"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g fillRule="nonzero" fill="none">
                          <path
                            d="M20 0C9.235 0 .799 13.486 0 24.877c3.379 5.773 11.527 7.944 20 7.944 8.475 0 16.623-2.17 20-7.944C39.202 13.487 30.767 0 20 0"
                            fill="#B6DEFF"
                          />
                          <path
                            d="M37.71 22.65s-2.396-5.154-4.833-8.16c-2.438-3.01-5.415-6.285-7.176-6.285-1.76 0-6.678 8.661-8.934 8.661-2.257 0-3.43-3.926-6.205-3.926-2.776 0-7.186 9.468-7.186 9.468l-.3 1.605S4.61 30.77 20.639 30.77c16.03 0 17.31-6.645 17.31-6.645l-.237-1.474"
                            fill="#6C6"
                          />
                          <path
                            d="M17.07 20.513c-2.44 0-3.69-2.433-4.368-3.935-.61-1.353-.716-3.489-2.446-3.549.17-.068.334-.108.487-.108 2.72 0 3.869 3.91 6.08 3.91 2.212 0 7.031-8.626 8.756-8.626.325 0 .69.116 1.088.322-.294-.039-.67-.012-.961.283-.557.563-5.617 11.703-8.637 11.703"
                            fill="#17AD49"
                          />
                        </g>
                      </svg>
                    </div>
                    <h5 className="text-gray-900 text-sm font-medium mb-1">
                      {" "}
                      Basecamp
                    </h5>
                    <p className="text-gray-500 text-xs font-medium">
                      Import projects, tasks, files, docs, and users.
                    </p>
                  </div>
                </div>
                <div className="rounded-lg h-48 m-1 text-center w-44 p-[0px_2px] border border-[#e8e8e8;] hover:bg-[rgba(34,181,169,.07)] hover:border  hover:border-[#22b5a9]">
                  <div className="items-center cursor-pointer flex flex-col h-full justify-center">
                    <div className="icon-box h-10 mb-3 text-[41px] leading-10">
                      <svg
                        className="icon "
                        width="1em"
                        height="1em"
                        viewBox="0 0 130 155"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          <linearGradient
                            x1="0%"
                            y1="68.01%"
                            y2="68.01%"
                            id="icon-trello-a"
                          >
                            <stop stopColor="#8930FD" offset="0%" />
                            <stop stopColor="#49CCF9" offset="100%" />
                          </linearGradient>
                          <linearGradient
                            x1="0%"
                            y1="68.01%"
                            y2="68.01%"
                            id="icon-trello-b"
                          >
                            <stop stopColor="#FF02F0" offset="0%" />
                            <stop stopColor="#FFC800" offset="100%" />
                          </linearGradient>
                        </defs>
                        <g fill="none">
                          <path
                            d="M.4 119.12l23.81-18.24C36.86 117.39 50.3 125 65.26 125c14.88 0 27.94-7.52 40.02-23.9l24.15 17.8C112 142.52 90.34 155 65.26 155c-25 0-46.87-12.4-64.86-35.88z"
                            fill="url(#icon-trello-a)"
                          />
                          <path
                            fill="url(#icon-trello-b)"
                            d="M65.18 39.84L22.8 76.36 3.21 53.64 65.27.16l61.57 53.52-19.68 22.64z"
                          ></path>
                        </g>
                      </svg>
                    </div>
                    <h5 className="text-gray-900 text-sm font-medium mb-1">
                      {" "}
                      ClickUp
                    </h5>
                    <p className="text-gray-500 text-xs font-medium">
                      Import projects, tasks, files, comments, and users.
                    </p>
                  </div>
                </div>
                <div className="rounded-lg h-48 m-1 text-center w-44 p-[0px_2px] border border-[#e8e8e8;] hover:bg-[rgba(34,181,169,.07)] hover:border  hover:border-[#22b5a9]">
                  <div className="items-center cursor-pointer flex flex-col h-full justify-center">
                    <div className="icon-box h-10 mb-3 text-[41px] leading-10">
                      <svg
                        className="icon "
                        width="0.975609756097561em"
                        height="1em"
                        viewBox="0 0 40 41"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          <linearGradient
                            x1="91.867%"
                            y1="40.328%"
                            x2="28.264%"
                            y2="81.66%"
                            id="icon-jira-gradient-a"
                          >
                            <stop stopColor="#0052CC" offset="18%" />
                            <stop stopColor="#2684FF" offset="100%" />
                          </linearGradient>
                          <linearGradient
                            x1="8.71%"
                            y1="59.166%"
                            x2="72.243%"
                            y2="17.99%"
                            id="icon-jira-gradient-b"
                          >
                            <stop stopColor="#0052CC" offset="18%" />
                            <stop stopColor="#2684FF" offset="100%" />
                          </linearGradient>
                        </defs>
                        <g fillRule="nonzero" fill="none">
                          <path
                            d="M39.521 19.353L21.725 1.71 20 0 6.604 13.28.479 19.354a1.614 1.614 0 0 0 0 2.294l12.239 12.134L20 41l13.396-13.28.208-.206 5.917-5.867a1.614 1.614 0 0 0 0-2.294zM20 26.56L13.886 20.5 20 14.439l6.114 6.061L20 26.561z"
                            fill="#2684FF"
                          />
                          <path
                            d="M20 14.054A9.967 9.967 0 0 1 19.958 0L7 12.95 14.052 20 20 14.054z"
                            fill="url(#icon-jira-gradient-a)"
                          />
                          <path
                            d="M25.942 20L20 25.925a9.935 9.935 0 0 1 2.925 7.037A9.935 9.935 0 0 1 20 40l13-12.962L25.942 20z"
                            fill="url(#icon-jira-gradient-b)"
                          />
                        </g>
                      </svg>
                    </div>
                    <h5 className="text-gray-900 text-sm font-medium mb-1">
                      {" "}
                      Jira
                    </h5>
                    <p className="text-gray-500 text-xs font-medium">
                      Import projects, tasks, files, comments, and users.
                    </p>
                  </div>
                </div>
                <div className="rounded-lg h-48 m-1 text-center w-44 p-[0px_2px] border border-[#e8e8e8;] hover:bg-[rgba(34,181,169,.07)] hover:border  hover:border-[#22b5a9]">
                  <div className="items-center cursor-pointer flex flex-col h-full justify-center">
                    <div className="icon-box h-10 mb-3 text-[41px] leading-10">
                      <svg
                        className="icon "
                        width="1em"
                        height="1em"
                        viewBox="-1.66 -4.10204932 243.05 147.51204932"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="m120.24 143.16c-10.63-.26-19.4-4.95-25-14.74-5.74-10.12-5.49-20.48.63-30.35 14.57-23.49 29.33-46.85 44-70.27 3-4.79 5.93-9.65 9.07-14.35a29.4 29.4 0 0 1 40-9.09c13.81 8.51 18.43 26.21 9.83 40.16q-26.37 42.95-53.49 85.48c-5.57 8.77-14.02 13-25.04 13.16z"
                          fill="#ffcb00"
                        />
                        <path
                          d="m28.94 143.16c-10.73-.26-19.45-5.16-24.94-14.91-5.66-10.12-5.3-20.5.84-30.37q23.51-37.72 47.23-75.33c2-3.24 4-6.56 6.14-9.7a29.41 29.41 0 0 1 49.41 31.86c-17.52 28.29-35.28 56.48-53.05 84.64-5.77 9.13-14.26 13.65-25.63 13.81z"
                          fill="#ff3d57"
                        />
                        <path
                          d="m212.13 85.82c16.17.08 29.26 12.93 29.23 28.69 0 16-13.44 28.9-29.76 28.7s-29.18-12.91-29.16-28.74c.02-16.06 13.16-28.75 29.69-28.65z"
                          fill="#00d647"
                        />
                      </svg>
                    </div>
                    <h5 className="text-gray-900 text-sm font-medium mb-1">
                      {" "}
                      Monday
                    </h5>
                    <p className="text-gray-500 text-xs font-medium">
                      Import projects, tasks, files, comments, and users.
                    </p>
                  </div>
                </div>
                <div className="rounded-lg h-48 m-1 text-center w-44 p-[0px_2px] border border-[#e8e8e8;] hover:bg-[rgba(34,181,169,.07)] hover:border  hover:border-[#22b5a9]">
                  <div className="items-center cursor-pointer flex flex-col h-full justify-center">
                    <div className="icon-box h-10 mb-3 text-[41px] leading-10">
                      <svg
                        className="icon "
                        width="1em"
                        height="1em"
                        viewBox="0 0 43 43"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          <linearGradient
                            x1="50%"
                            y1="0%"
                            x2="50%"
                            y2="100%"
                            id="icon-trello-gradient"
                          >
                            <stop stopColor="#0091E6" offset="0%" />
                            <stop stopColor="#0079BF" offset="100%" />
                          </linearGradient>
                        </defs>
                        <g fillRule="nonzero" fill="none">
                          <rect
                            fill="url(#icon-trello-gradient)"
                            width={43}
                            height={43}
                            rx={8}
                          />
                          <rect
                            fill="#FFF"
                            x={24}
                            y={6}
                            width={13}
                            height={19}
                            rx={3}
                          />
                          <rect
                            fill="#FFF"
                            x={6}
                            y={6}
                            width={13}
                            height={30}
                            rx={3}
                          ></rect>
                        </g>
                      </svg>
                    </div>
                    <h5 className="text-gray-900 text-sm font-medium mb-1">
                      {" "}
                      Trello
                    </h5>
                    <p className="text-gray-500 text-xs font-medium">
                      Import boards, tasks, files, comments, and users.
                    </p>
                  </div>
                </div>
                <div className="rounded-lg h-48 m-1 text-center w-44 p-[0px_2px] border border-[#e8e8e8;] hover:bg-[rgba(34,181,169,.07)] hover:border  hover:border-[#22b5a9]">
                  <div className="items-center cursor-pointer flex flex-col h-full justify-center">
                    <div className="icon-box h-10 mb-3 text-[41px] leading-10">
                      <svg
                        className="icon "
                        width="1em"
                        height="0.6347557551937114em"
                        viewBox="0 0 356.2 226.1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          <path id="icon-wrike-a" d="M0 0h356.2v226.1H0z" />
                        </defs>
                        <clipPath id="icon-wrike-b">
                          <use href="#icon-wrike-a" overflow="visible" />
                        </clipPath>
                        <g fill="#08CF65" clipPath="url(#icon-wrike-b)">
                          <path d="M83.6 82.2c17.1 0 25.2 3.3 38 15.7l67 67c1.4.9 2.4 2.4 2.8 3.8.5.9.5 1.9 0 2.8-.5 1.4-1.4 2.8-2.8 3.8l-46.1 46.1c-.9 1.4-2.4 2.4-3.8 2.8-.9.5-1.9.5-2.8 0-1.4-.5-2.8-1.4-3.8-2.8L1.9 91.7c-3.8-3.8-2.4-9.5 3.8-9.5h77.9zM272.6 0c-17.1 0-25.2 3.3-38 15.7l-66.5 67c-1.4.9-2.4 2.4-2.8 3.8-.5.9-.5 1.9 0 2.8.5 1.4 1.4 2.8 2.8 3.8l46.1 46.1c.9 1.4 2.4 2.4 3.8 2.8.9.5 1.9.5 2.8 0 1.4-.5 2.8-1.4 3.8-2.8L354.3 9.5c3.8-3.8 2.4-9.5-3.8-9.5h-77.9z"></path>
                        </g>
                      </svg>
                    </div>
                    <h5 className="text-gray-900 text-sm font-medium mb-1">
                      {" "}
                      Wrike
                    </h5>
                    <p className="text-gray-500 text-xs font-medium">
                      Import projects, tasks, files, comments, and users.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative mb-4">
        <div className="p-0 text-right mx-[520px] -mt-16">
          <button
            onClick={handleSkip}
            className="ml-0 min-w-[200px] px-5 text-center py-2 border border-[#00b8a9] text-white text-sm font-semibold rounded-md bg-[#00b8a9] "
          >
            Skip
          </button>
        </div>
      </div>
    </>
  );
}

export default ToolInfo;
