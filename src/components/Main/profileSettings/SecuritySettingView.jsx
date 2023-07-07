import HookTextField from "hooks/Common/HookTextField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { profileSetupSchema } from "validations/profileSetup";
import { openProfile } from "redux/reducers/profile";
import { useDispatch } from "react-redux";
import GoogleIcon from "@mui/icons-material/Google";
import { useUpdatePassword } from "hooks/ProfileSetup";
import ChangePasswordDialog from "./ChangePasswordDialog";
import CloseIcon from "@mui/icons-material/Close";
const SecuritySettingView = () => {
  const dispatch = useDispatch();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(profileSetupSchema),
  });

  return (
    <div class="">
      <div class="items-center flex h-16 px-7 justify-between">
        <h1 class="text-xl font-bold font-Manrope text-[#373737]">
          Security Settings
        </h1>
        <CloseIcon
          sx={{
            fontSize: "35px",
            color: "#373737",
            cursor: "pointer",
            "&:hover": { color: "#f98c42" },
          }}
        />
      </div>
      <hr></hr>
      <div class="px-11 mt-4 flex flex-col">
        <div class="mb-5 relative">
          <div>
            {/* class="bg-[#f7f7f7] border border-[#ececec] flex rounded-md mt-2" */}
            <div className="flex w-[40%] space-x-3">
              <HookTextField
                labelClass="text-[#373737] text-base font-medium "
                control={control}
                errors={errors}
                labelText="Update Password"
                name="password"
                type="password"
                required={false}
                disabled
                readonly
                placeholder="Your first & last name…"
              />
              {/* <input disabled readonly value="......." type="password"
                                    class="h-11 px-4 text-[#8e94bb] text-base font-normal "> */}
              <span class="!border-left-0 text-[#fff] mt-7 bg-[#9399AB] font-semibold global-inputFiled text-[13px] px-5 items-center h-[45px] py-2 !border-gray-300 cursor-pointer flex justify-center uppercase ">
                Edit
              </span>
            </div>
          </div>

          <hr class="mt-5 w-[55%] -ml-11"></hr>
          <label class="block mb-2 font-Manrope font-semibold text-[15px] text-[#2f2f2f] mt-9">
            Two Factor Authentication
          </label>
          <p class="mb-4 font-Manrope font-medium text-[14px] text-[#9399AB]">
            Enable Two Factor Authentication
          </p>
          <div class="w-full">
            <button
              class="text-white font-Manrope font-semibold  bg-[#02b9a9] border border-[#02b9a9] text-sm px-8  py-2 rounded-md hover:shadow-md "
              onClick={() => dispatch(openProfile())}
            >
              Enable
            </button>
          </div>
          <hr class="mt-5 w-[55%] -ml-11"></hr>
          <label class="block mb-2 font-Manrope font-semibold text-[15px] text-[#2f2f2f] mt-9">
            Manage SSO Authentication Methods
          </label>
          <span class="max-w-[350px] min-w-[300px] ">
            <span class="flex text-center border border[#e8e8e8] p-[15px] rounded-md text-[16px] text-[#9399AB] max-w-[350px] min-w-[300px] font-Manrope font-semibold ">
              <svg
                class="icon mr-3 relative"
                width="1.5em"
                height="1.5em"
                viewBox="0 0 48 48"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <path
                    id="icon-google-path"
                    d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
                  ></path>
                </defs>
                <clipPath id="icon-google-clippath">
                  <use href="#icon-google-path" overflow="visible"></use>
                </clipPath>
                <path
                  clip-path="url(#icon-google-clippath)"
                  fill="#FBBC05"
                  d="M0 37V11l17 13z"
                ></path>
                <path
                  clip-path="url(#icon-google-clippath)"
                  fill="#EA4335"
                  d="M0 11l17 13 7-6.1L48 14V0H0z"
                ></path>
                <path
                  clip-path="url(#icon-google-clippath)"
                  fill="#34A853"
                  d="M0 37l30-23 7.9 1L48 0v48H0z"
                ></path>
                <path
                  clip-path="url(#icon-google-clippath)"
                  fill="#4285F4"
                  d="M48 48L17 24l-4-3 35-10z"
                ></path>
              </svg>
              {/* <GoogleIcon/> */}
              Google SSO
              <div class="ml-[125px] font-normal">
                <a className="text-[#333] font-semibold text-[14px]" href="#">
                  Connect
                </a>
              </div>
            </span>
          </span>
          <span class="max-w-[320px] min-w-[300px] mt-4">
            <span class="flex text-center border border[#e8e8e8] p-[15px] rounded-md text-[16px] text-[#9399AB] font-Manrope font-semibold max-w-[350px] min-w-[300px] mt-4">
              <svg
                class="icon mr-2 relative"
                width="1.5em"
                height="1.5em"
                viewBox="0 0 23 23"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path fill="#f3f3f3" d="M0 0h23v23H0z"></path>
                <path fill="#f35325" d="M1 1h10v10H1z"></path>
                <path fill="#81bc06" d="M12 1h10v10H12z"></path>
                <path fill="#05a6f0" d="M1 12h10v10H1z"></path>
                <path fill="#ffba08" d="M12 12h10v10H12z"></path>
              </svg>
              Microsoft SSO
              <div class="ml-[105px]  font-normal">
                <a className="text-[#333] font-semibold text-[14px]" href="#">
                  Connect
                </a>
              </div>
            </span>
          </span>
        </div>
      </div>
      <ChangePasswordDialog />
    </div>
  );
};
export default SecuritySettingView;
