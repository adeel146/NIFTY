import React from "react";
import { getCurrTime } from "utils";

function AssigneDetailsPopOver() {
  const user = {
    name: "Test",
  };
  return (
    <div className="dropdown inline-block relative ">
      <button className=" font-semibold py-2 px-4 rounded inline-flex items-center">
        <span className="items-center font-bold inline-flex text-white align-middle bg-[#8dd7ffd9] border-[#f9a33ad9] h-6 w-6 pl-2 rounded-md text-[9px] ">
          {user?.name?.substr(0, 2)?.toUpperCase() ?? "GJ"}
        </span>
        <span className="h-2 m-0 absolute w-2 1 border border-white bg-green-500 rounded-full top-6 right-3"></span>
      </button>
      <ul className="dropdown-menu absolute hidden text-gray-700  bg-white right-0 min-w-[294px] h-[360px] border  ">
        <div className=" flex">
          <span className="items-center font-bold inline-flex text-white align-middle bg-[#8dd7ffd9] border-[#f9a33ad9] h-16 w-16 pl-5 pb-1 rounded-md ml-5 mt-4 text-xl">
            {user?.name?.substr(0, 2)?.toUpperCase() ?? "GJ"}
          </span>
          <div className="text-[#8e94bb] text-base font-medium inline-flex flex-col ml-24 absolute mt-3">
            <h5 className="">{user?.name ?? "AreebAhmad"}</h5>
            <span className="h-2 m-0 absolute w-2 border border-white bg-green-500 rounded-full -right-3"></span>
            <h6 className=" opacity-60 font-semibold text-xs uppercase mb-2">
              {user?.designation ?? "Owner"}
            </h6>
            <button className=" border border-[#363c5b] text-[#7c88c7]   px-1 flex  text-sm  w-12 rounded ">
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
        <div className="pt-0 px-4 pb-3 flex-col mt-7 hover:text-[#009084]  ">
          <button className="min-w-full px-0 bg-white border border-[#e8e8e8] py-2 rounded-md font-semibold hover:shadow-md">
            Set yourself as
            <span className="font-bold">Away</span>
          </button>
        </div>
        <hr />
        <div className="bg-[#fafbfd] h-[140px] w-full py-3 px-4">
          <div className="text-xs mb-1 text-[#8e94bb] font-medium ">
            <i
              className="fa-solid fa-envelope  mr-1 text-xs"
              style={{ color: "#8e94bb" }}
            ></i>
            {user?.email ?? "areebahmad122@gmail.com"}
          </div>
          <div className="text-xs mb-1 text-[#8e94bb] font-medium ">
            <i
              className="fa-regular fa-clock fa-fw"
              style={{ color: "#8e94bb" }}
            ></i>
            <span>
              <time>{getCurrTime()}</time>
              &nbsp; (local time)
            </span>
          </div>
          <div className="flex mt-3 -mx-1">
            <button className="px-1 w-2/4 flex-auto bg-white border border-[#e8e8e8] h-8 text-sm items-center rounded-md font-semibold hover:text-[#009084] hover:shadow-md ">
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
          <div className="flex mt-3 -mx-1">
            <button
              //   onClick={() => navigate(links.profileSettings)}
              className="px-1 w-2/4 flex-auto bg-white border border-[#e8e8e8] h-8 text-sm items-center rounded-md font-semibold hover:text-[#009084] hover:shadow-md  "
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
        </div>
      </ul>
    </div>
  );
}

export default AssigneDetailsPopOver;
