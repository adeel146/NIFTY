import React, { useState } from "react";
import NiftyLogo from "/images/logo-three60.png";
import "./Verify.css";
import OtpInput from "react-otp-input";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppVerifyOtp } from "hooks/Login";
import { useDisplaySuccess } from "hooks/useDisplaySuccess";
import { links } from "static/links";
import { useDisplayError } from "hooks/useDisplayError";
import { CircularProgress } from "@mui/material";

function Verify() {
  const location = useLocation();
  const otpToekn = location.state && location.state.otp;
  const [otp, setOtp] = useState("");
  const displaySuceess = useDisplaySuccess();
  const navigate = useNavigate();
  const { email } = useParams();

  const onSuccess = (data) => {
    if (data.success) {
      displaySuceess(data.message);
      navigate(`${links.profileSetup}?userId=${data.data.id}`);
    }
  };

  const verifyOtp = useAppVerifyOtp({ onSuccess });
  const error = verifyOtp.error;
  const loading = verifyOtp.isLoading;
  useDisplayError(error);

  const handleVerifyOtp = (otp) => {
    verifyOtp.mutate({
      data: {
        email: email,
        code: otp,
      },
    });
  };

  return (
    <div
      className={`signup-bg  relative h-screen w-full bg-[url('/images/login-bg-full.png')]
    bg-no-repeat box-content  absolute bottom-[-65%] h-full 
    after:bg-[url('/images/login-bg-full.png')] after:bg-no-repeat after:box-content  after:absolute after:bottom-[-65%] after:h-full after:w-full overflow-hidden`}>
      <div className="flex flex-[0_0_auto] z-[3] flex-col h-full overflow-hidden relative">
        <div className="overflow-auto relative z:[1] h-full">
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
              <div className="mb-8 font-sans">
                <h2 className="text-3xl font-bold heading-color">
                  Check your email
                </h2>
                <p className="mt-3">
                  We’ve sent a 4-digit confirmation code to{" "}
                  <span className="font-bold">abc1@mailsac.com.</span> It will
                  expire shortly, so enter it soon.
                </p>
                <p className="mt-3">
                  Your OTP could be
                  <span className="font-bold">{` ${otpToekn}`}.</span> Try it
                  Out
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
                        xmlns="http://www.w3.org/2000/svg">
                        <g
                          id="Page-2"
                          stroke="none"
                          strokeWidth={1}
                          fill="none"
                          fillRule="evenodd">
                          <g
                            id="Team-overview---search"
                            transform="translate(-195.000000, -198.000000)"
                            fill="currentColor">
                            <g
                              id="Group-2"
                              transform="translate(121.000000, 153.000000)">
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
                        xmlns="http://www.w3.org/2000/svg">
                        <g
                          id="Style-guide"
                          stroke="none"
                          strokeWidth={1}
                          fill="none"
                          fillRule="evenodd">
                          <g
                            id="nifty-UI-guide"
                            transform="translate(-617.000000, -2934.000000)"
                            fill="currentColor"
                            fillRule="nonzero">
                            <g
                              id="Group-6-Copy-3"
                              transform="translate(574.000000, 2884.000000)">
                              <path
                                d="M70.5909903,46.8409903 C71.4696699,45.9623106 71.4696699,44.5376894 70.5909903,43.6590097 C69.7123106,42.7803301 68.2876894,42.7803301 67.4090097,43.6590097 L51.6590097,59.4090097 C50.7803301,60.2876894 50.7803301,61.7123106 51.6590097,62.5909903 L67.4090097,78.3409903 C68.2876894,79.2196699 69.7123106,79.2196699 70.5909903,78.3409903 C71.4696699,77.4623106 71.4696699,76.0376894 70.5909903,75.1590097 L56.4319805,61 L70.5909903,46.8409903 Z"
                                id="Path-82"
                                transform="translate(61.125000, 61.000000) rotate(-90.000000) translate(-61.125000, -61.000000) "></path>
                            </g>
                          </g>
                        </g>
                      </svg>
                    </span>
                  </button>
                  <nav
                    tabIndex={0}
                    className=" bg-white invisible border border-[#e8e8e9] rounded w-28 absolute left-0 top-full transition-all opacity-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-1 ">
                    <ul className="py-1 text-sm max-h-60 overflow-y-auto overflow-x-hidden ">
                      <li>
                        <a
                          href="#"
                          className="block px-5 py-1  hover:bg-[#f2fffe] hover:text-[#00b8a9] ">
                          English
                        </a>
                      </li>
                      <hr />
                      <li>
                        <a
                          href="#"
                          className="block px-5 py-2  hover:bg-[#f2fffe] hover:text-[#00b8a9]">
                          Chinese
                        </a>
                      </li>
                      <hr />
                      <li>
                        <a
                          href="#"
                          className="block px-5 py-2   hover:bg-[#f2fffe] hover:text-[#00b8a9]">
                          French
                        </a>
                      </li>
                      <hr />
                      <li>
                        <a
                          href="#"
                          className="block px-5 py-2   hover:bg-[#f2fffe] hover:text-[#00b8a9]">
                          German
                        </a>
                      </li>
                      <hr />
                      <li>
                        <a
                          href="#"
                          className="block px-5 py-2  hover:bg-[#f2fffe] hover:text-[#00b8a9]">
                          Italian
                        </a>
                      </li>
                      <hr />
                      <li>
                        <a
                          href="#"
                          className="block px-5 py-2  hover:bg-[#f2fffe] hover:text-[#00b8a9]">
                          Japanese
                        </a>
                      </li>
                      <hr />
                      <li>
                        <a
                          href="#"
                          className="block pl-3 pr-8 py-2   hover:bg-[#f2fffe] hover:text-[#00b8a9]">
                          Portuguese
                        </a>
                      </li>
                      <hr />
                      <li>
                        <a
                          href="#"
                          className="block px-5 py-2   hover:bg-[#f2fffe] hover:text-[#00b8a9]">
                          Russian
                        </a>
                      </li>
                      <hr />
                      <li>
                        <a
                          href="#"
                          className="block px-5 py-2  hover:bg-[#f2fffe] hover:text-[#00b8a9]">
                          Spanish
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
            <div className="flex flex-col mt-[50px] gap-[20px] items-center ">
              <div id="otp-field">
                <OtpInput
                  isDisabled={false}
                  numInputs={4}
                  onChange={setOtp}
                  separator={<span className="separator">•</span>}
                  value={otp}
                  renderInput={(props) => <input {...props} />}
                />
              </div>
              <button
                type="submit"
                className="w-[20%]  py-2 px-2 rounded-md font-semibold"
                style={{
                  backgroundImage: "linear-gradient(90deg,#02bdad,#00a99b)",
                  boxShadow: "0 1px 2px 0 rgba(0,0,0,.08)",
                  color: "white",
                }}
                disabled={loading}
                onClick={() => handleVerifyOtp(otp)}>
                {loading ? <CircularProgress size={10} /> : "Verify"}
              </button>
              <p className="w-[40%] text-[14px] text-center">
                Don’t forget to check spam. If the code didn’t come request
                another one. Still having issues with registration? Check our
                help guide.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Verify;
