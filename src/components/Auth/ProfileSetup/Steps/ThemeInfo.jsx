import React, { useState } from "react";
import "../profileSetup.css";
import { useNavigate } from "react-router-dom";

function ThemeInfo({ handleNext }) {
  const navigate=useNavigate()
  const [activeThemeId, setActiveThemeId] = useState(null);
  const selectTheme = (number) => {
    setActiveThemeId(number);
  };
  return (
    <>
      {/* Main Section */}
      <div className="py-16 px-0 mt-1 cursor-pointer">
        <div className="pl-12 pr-12 w-full max-w-[1200px] m-[0_auto] flex item text-left">
          <div className="flex justify-center text-center mb-5 relative">
            <div className="flex justify-between">
              <div className="p-[0_18px]">
                <div className="text-gray-800 text-sm font-semibold mb-5" onClick={()=>navigate('/profile/settings')}>
                  Classic Mode
                </div>
                <div
                  onClick={() => selectTheme(1)}
                  className={`rounded overflow-hidden shadow-[0_3px_7px_0_rgba(0,0,0,. 17);] ${
                    activeThemeId === 1 ? ' border-[4px] border-[#01ac9e]"' : ""
                  }`}
                >
                  <img
                    src="/images/google-theme-classic.png"
                    alt="Classic Mode"
                    className="w-[700px] border border-[#01ac9e]"
                  />
                </div>
              </div>
              <div className="p-[0_18px]">
                <div className="text-gray-800 text-sm font-semibold mb-5">
                  Light Mode
                </div>
                <div
                  onClick={() => selectTheme(2)}
                  className={`rounded overflow-hidden shadow-[0_3px_7px_0_rgba(0,0,0,. 17);] ${
                    activeThemeId === 2 ? ' border-[4px] border-[#01ac9e]"' : ""
                  }`}
                >
                  <img
                    src="/images/google-theme-light.png"
                    alt="Light Mode"
                    className="w-[700px] border border-[#01ac9e]"
                  />
                </div>
              </div>
              <div className="p-[0_18px]">
                <div className="text-gray-800 text-sm font-semibold mb-5">
                  Dark Mode
                </div>
                <div
                  onClick={() => selectTheme(3)}
                  className={`rounded overflow-hidden shadow-[0_3px_7px_0_rgba(0,0,0,. 17);] ${
                    activeThemeId === 3 ? ' border-[4px] border-[#01ac9e]"' : ""
                  }`}
                >
                  <img
                    src="/images/google-theme-dark.png"
                    alt="Dark Mode<"
                    className="w-[700px] border border-[#01ac9e]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-5 relative">
        <div className="p-0 text-right mx-[325px]">
          <button
            onClick={handleNext}
            className="ml-0 min-w-[200px] px-5 text-center py-2 border border-[#00b8a9] text-white text-sm font-semibold rounded-md bg-[#00b8a9]"
            disabled={!activeThemeId}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default ThemeInfo;
