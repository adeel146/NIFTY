import React, { Fragment, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

function ThirdPartyApps() {
  const [sectionShow, setSectionShow] = useState(true);
  return (
    <>
      <Fragment>
        {sectionShow && (
          <div className="h-[145px] rounded-md bg-[#f7fefd] border-[#e0f3f1] mt-6 w-[92%] m-auto border">
            <div className="flex justify-between px-4">
              <div className="flex flex-col w-[100%]">
                <h4 className="pt-3  text-[15px] font-Manrope  tracking-wider mt-1 font-bold">
                  CREATE WITH three60 API.
                </h4>
                <p className="font-Manrope text-[15px] font-medium mt-[10px] mb-3 tracking-wide">
                  Build your own custom integrations and three60 apps with our
                  public Application Programming Interface (API). <br />
                  Ready to build? See
                  <a
                    href="#"
                    className="font-Manrope text-[#00ac9e] text-[15px] ml-[6px] font-bold"
                  >
                    API Documentation
                  </a>
                </p>
              </div>

              <div
                className="pt-3 cursor-pointer"
                onClick={() => setSectionShow(false)}
              >
                <CloseIcon
                  sx={{
                    color: "#02bebd",
                    "&:hover": {
                      color: "#F98A3F",
                    },
                  }}
                />
              </div>
            </div>
            <div className="border-t border-t-[#02bebe33] ">
              <div className="font-Manrope text-[14px] px-4 py-2 text-[#434343] font-semibold ">
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

        <div className="px-10 mt-7 cursor-pointer">
          <div className="flex flex-wrap">
            <div className="box-1">
              <div className="rounded-lg flex flex-col p-4 max-w-[300px] min-w-[280px] border border-[#00b8a9] m-1">
                <div className="flex mt-2">
                  <div className="text-[40px] mr-3 text-center mb-4 w-9">
                    <img className="" src="/images/only nifty logo.svg" />
                  </div>
                  <div className="mb-4 flex-[0_0_auto]">
                    <div className="font-semibold font-Manrope text-base">
                      Create a new App
                    </div>
                  </div>
                </div>
                <div className="text-[#9399AB] text-[14px] mb-2">
                  Create a new app to integrate with three60...
                </div>
                <div className="flex-[0_0_auto]">
                  <button className="min-w-full px-0 bg-[#00A99B] hover:bg-[#02bdad] hover:shadow-lg text-white font-semibold font-Manrope shadow-md text-[14px] rounded-md h-10">
                    Create a new App
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    </>
  );
}

export default ThirdPartyApps;
