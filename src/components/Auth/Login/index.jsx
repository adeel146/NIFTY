import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import MainLogin from "/images/main.png";
import { useForm } from "react-hook-form";
import HookTextField from "hooks/Common/HookTextField";
import { loginSchema } from "validations/login";
import NiftyLogo from "/images/logo-three60.png";
import "./login.css";
import { links } from "static/links";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useSnackbar } from "notistack";

const Login = () => {
  const { login } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setLoading] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data);
      navigate(links.workspace);
    } catch (error) {
      enqueueSnackbar(
        error?.response?.data?.message ??
          error?.message ??
          "Something went wrong",
        { variant: "error", preventDuplicate: true }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = () => {
    navigate(links.signup);
  };
  return (
    <div>
      <div className="login-wrapprt h-screen w-full">
        <div className="login-container m-auto flex h-full justify-center items-center flex-col">
          <div className="text-center w-full flex justify-center mt-5">
            {/* <h1>three60</h1> */}
            <a href="#">
              <img src={NiftyLogo} alt="" className="w-28" />
            </a>
          </div>
          <div className="bg-white flex login-content w-full mt-7">
            <div className="col-left w-2/4 border-r-[1px] border-[#f1f1f1] p-10">
              <div className="mb-8">
                <h2 className="heading-color font-bold mb-2">
                  <span className="label">Coming Soon</span> Reporting Dashboard
                </h2>
                <p>
                Robust analysis for staying ahead of your business and workload. Personalize your control panel to acquire valuable information and make well-informed choices.Robust analysis for staying ahead of your business and workload. Personalize your control panel to acquire valuable information and make well-informed choices.
                </p>
              </div>
              <div className="rounded-md mt-2 relative login-image ">
                <img className="rounded-md" src={MainLogin} alt="main-bg" />
              </div>
            </div>
            <div className="col-right w-2/4 p-10">
              <h1 className="font-bold text-2xl heading-color mb-5">
                Log in to your account
              </h1>
              <div className="mb-5">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <HookTextField
                    control={control}
                    errors={errors}
                    labelText={
                      <span className="block font-semibold heading-color text-base  after:content-['*'] after:ml-0.5 after:text-red-500">
                        Email Address
                      </span>
                    }
                    name="username"
                    type="email"
                    required={false}
                    placeholder="name@company.com"
                  />
                  <HookTextField
                    control={control}
                    errors={errors}
                    type="password"
                    required={false}
                    labelText={
                      <div className="flex justify-between">
                        <span className="block font-semibold heading-color text-base  after:content-['*'] after:ml-0.5 after:text-red-500">
                          Password
                        </span>
                        <a className="text-[#8e94bb]" href="#">
                          Forgot password?
                        </a>
                      </div>
                    }
                    name="password"
                    placeholder="Password"
                  />

                  <div className="w-full mt-4">
                    <button
                      type="submit"
                      className="w-full  py-2 px-2 rounded-md font-semibold"
                      style={{
                        backgroundImage:
                          "linear-gradient(90deg,#02bdad,#00a99b)",
                        boxShadow: "0 1px 2px 0 rgba(0,0,0,.08)",
                        color: "white",
                      }}
                      disabled={isLoading}
                    >
                      Log in
                    </button>
                  </div>
                </form>
              </div>
              {/* <div className="google-login-form flex justify-center">
                <div className="flex-col flex text-center">
                  <a
                    href="#"
                    className="flex text-[#f57d2c] mb-3 hover:underline"
                  >
                    <svg
                      className="icon mr-2 relative top-1"
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
                        ></path>
                      </defs>
                      <clipPath id="icon-google-clippath">
                        <use href="#icon-google-path" overflow="visible"></use>
                      </clipPath>
                      <path
                        clipPath="url(#icon-google-clippath)"
                        fill="#FBBC05"
                        d="M0 37V11l17 13z"
                      ></path>
                      <path
                        clipPath="url(#icon-google-clippath)"
                        fill="#EA4335"
                        d="M0 11l17 13 7-6.1L48 14V0H0z"
                      ></path>
                      <path
                        clipPath="url(#icon-google-clippath)"
                        fill="#34A853"
                        d="M0 37l30-23 7.9 1L48 0v48H0z"
                      ></path>
                      <path
                        clipPath="url(#icon-google-clippath)"
                        fill="#4285F4"
                        d="M48 48L17 24l-4-3 35-10z"
                      ></path>
                    </svg>
                    Sign in with Google
                  </a>
                  <a href="#" className=" hover:underline">
                    Sign in with SSO
                  </a>
                </div>
              </div> */}
              <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
                <p className="mx-4 mb-0 text-center divder-text">OR</p>
              </div>

              <div className="flex flex-col text-center">
                <p className="mb-3">Don't have an account?</p>
                <button
                  className="btn-secondary py-2 m-auto px-2 rounded-md font-semibold"
                  onClick={handleRedirect}
                >
                  Sign up for free
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
