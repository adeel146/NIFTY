import React from "react";
import NiftyLogo from "/images/logo-three60.png";
import "./signup.css";
import { Controller, useForm } from "react-hook-form";
import { signupScheme } from "validations/login";
import { useAppSignup } from "hooks/Login";
import { useDisplayError } from "hooks/useDisplayError";
import { yupResolver } from "@hookform/resolvers/yup";
import { ErrorMessage } from "@hookform/error-message";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { links } from "static/links";
import { useDisplaySuccess } from "hooks/useDisplaySuccess";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

function Signup() {
  const navigate = useNavigate();
  const displaySuceess = useDisplaySuccess();
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(signupScheme),
  });
  const email = watch("email");

  const onSuccess = (data) => {
    if (data.success) {
      displaySuceess(data.message);
      navigate(`${links.verify}/${email}`, {
        state: {
          otp: data.data,
        },
      });
    }
  };

  const signup = useAppSignup({ onSuccess });

  const { error, isLoading } = signup;
  useDisplayError(error);
  const onSubmit = (data) => {
    signup.mutate({ data });
  };

  return (
    <div
      className={`signup-bg  relative h-screen w-full bg-[url('/images/login-bg-full.png')]
      bg-no-repeat box-content  absolute bottom-[-65%] h-full 
      after:bg-[url('/images/login-bg-full.png')] after:bg-no-repeat after:box-content  after:absolute after:bottom-[-65%] after:h-full after:w-full overflow-hidden`}
    >
      <div className="flex flex-[0_0_auto] z-[3] flex-col h-full overflow-hidden relative">
        <div className="overflow-auto relative z:[1] h-full">
          <div className="min-h-full overflow-hidden relative">
            {/* Header section */}
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
              <div className="mb-8 font-sans">
                <h2 className="text-3xl font-bold heading-color">
                  Get started with three60
                </h2>
                <p className="mt-3">
                  Over 20,000 teams trust three60 to empower their project
                  management.
                </p>
              </div>
              {/* end text-section */}
              {/* start Button section */}
              <div className="p-4 absolute right-0 top-32 mr-8 ">
                <div className="group relative">
                  <button className="bg-white border border-[#e8e8e9] px-2 h-10 rounded text-[#2f2f2f] hover:text-[#00b8a9] flex items-center   ">
                    <span className="icon mr-2  text-[#ccc] hover:text-[#00b8a9] ">
                      <svg
                        className="icon"
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
                    <span className="arrow ml-2 text-xs">
                      <svg
                        className="icon"
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
                    <ul className="py-1 text-sm max-h-60 overflow-y-auto overflow-x-hidden ">
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
              <div
                onClick={() => navigate(-1)}
                className="px-3 py-1 absolute left-2 top-36  border rounded-md   cursor-pointer bg-[#00b8a9b5] text-white"
              >
                <ArrowBackIosIcon
                  sx={{ fontSize: "16px", marginTop: "-2px" }}
                />
                <button className="">Back</button>
              </div>
            </div>
            {/* Main Section */}
            <div className="py-16 px-0 mt-6">
              <div className="flex my-0 mx-auto text-left w-[580px]">
                <div className="flex justify-between w-full gap-5 px-5">
                  <span className="w-1/2">
                    <a
                      href="#"
                      className="flex text-center border border[#e8e8e8] bg-[#fbfbfb] p-[9px_32px] rounded-md hover:text-[#00b8a9] "
                    >
                      <svg
                        className="icon mr-2 top-[4px] relative"
                        width="1em"
                        height="1em"
                        viewBox="0 0 48 48"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          <path
                            id="icon-google-path"
                            d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
                          />
                        </defs>
                        <clipPath id="icon-google-clippath">
                          <use href="#icon-google-path" overflow="visible" />
                        </clipPath>
                        <path
                          clipPath="url(#icon-google-clippath)"
                          fill="#FBBC05"
                          d="M0 37V11l17 13z"
                        />
                        <path
                          clipPath="url(#icon-google-clippath)"
                          fill="#EA4335"
                          d="M0 11l17 13 7-6.1L48 14V0H0z"
                        />
                        <path
                          clipPath="url(#icon-google-clippath)"
                          fill="#34A853"
                          d="M0 37l30-23 7.9 1L48 0v48H0z"
                        />
                        <path
                          clipPath="url(#icon-google-clippath)"
                          fill="#4285F4"
                          d="M48 48L17 24l-4-3 35-10z"
                        />
                      </svg>
                      Sign up with Google
                    </a>
                  </span>
                  <span className="w-1/2">
                    <a
                      href="#"
                      className="flex text-center border border[#e8e8e8] bg-[#fbfbfb] p-[9px_32px] rounded-md hover:text-[#00b8a9] "
                    >
                      <svg
                        className="icon mr-2 top-[4px] relative"
                        width="1em"
                        height="1em"
                        viewBox="0 0 23 23"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path fill="#f3f3f3" d="M0 0h23v23H0z" />
                        <path fill="#f35325" d="M1 1h10v10H1z" />
                        <path fill="#81bc06" d="M12 1h10v10H12z" />
                        <path fill="#05a6f0" d="M1 12h10v10H1z" />
                        <path fill="#ffba08" d="M12 12h10v10H12z" />
                      </svg>
                      Sign up with Office 365
                    </a>
                  </span>
                </div>
              </div>
              {/* Divider */}
              <div className="my-5 flex items-center before:mt-0.5 before:flex-1 before:border-t border-color[#eeeded] after:mt-0.5 after:flex-1 after:border-t after:border-color[#eeeded] mx-auto w-[580px]">
                <p className="mx-4 mb-0 text-center divder-text">OR</p>
              </div>
              <div className=" my-0 mx-auto text-left w-[580px]">
                <div className="flex justify-between w-full gap-5">
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => {
                      return (
                        <input
                          {...field}
                          type="text"
                          placeholder="Enter Email..."
                          className="mt-1 block global-inputFiled px-3 py-3 bg-white placeholder-slate-400 w-3/4"
                        />
                      );
                    }}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="email"
                    render={({ message }) => (
                      <p className="text-red-500">{message}</p>
                    )}
                  />

                  <button
                    type="submit"
                    className=" ml-0 min-w-[140px] px-5 text-center py-2  border border-[#00b8a9] text-white  text-sm font-semibold rounded-md !bg-[#00b8a9] "
                    onClick={handleSubmit(onSubmit)}
                    disabled={isLoading}
                  >
                    {isLoading ? <CircularProgress size={10} /> : "Get Started"}
                  </button>
                </div>
                <p className="font-medium text-xs mt-2">
                  Free Forever. No Credit Card Required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
