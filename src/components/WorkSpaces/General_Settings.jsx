import { workspaceSetupSchema } from "validations/workspacesSetup";
import HookTextField from "hooks/Common/HookTextField";
import HookSelectField from "hooks/Common/HookSelectField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Switch from "@mui/material/Switch";
import { useState } from "react";
import {
  useGetWorkspaceById,
  useUpdateChat,
  useUpdateGuestChat,
  useUpdateLogo,
  useUpdateName,
  useUpdateURL,
  useUpdateWeekends,
} from "hooks/Workspace";
import { useDisplayError } from "hooks/useDisplayError";
import { useDisplaySuccess } from "hooks/useDisplaySuccess";
import { toBase64 } from "hooks/Common/toBase64";
import WhiteButton from "hooks/Common/commonButtons/WhiteButton";
import { useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";

const General_Settings = () => {
  const [switchState, setSwitchState] = useState(false);
  const [profile, setProfile] = useState({});

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(workspaceSetupSchema),
  });

  const workspaceId = localStorage.getItem("workspaceId");

  const display = useDisplaySuccess();
  const userName = watch("name");
  const url = watch("url");

  const onSuccess = (data) => {};

  const onLogoUpdated = (data) => {
    display(data.message);
    // useGetWorkspaceById({ id: workspaceId, onSuccess });
  };

  const onNameUpdated = (data) => {
    display(data.message);
    // useGetWorkspaceById({ id: workspaceId, onSuccess });
  };

  const onURLUpdated = (data) => {
    display(data.message);
    // useGetWorkspaceById({ id: workspaceId, onSuccess });
  };

  const onChatUpdated = (data) => {
    display(data.message);
    // useGetWorkspaceById({ id: workspaceId, onSuccess });
  };

  const onGuestChatUpdated = (data) => {
    display(data.message);
    // useGetWorkspaceById({ id: workspaceId, onSuccess });
  };

  const onWeekendsUpdated = (data) => {
    display(data.message);
    // useGetWorkspaceById({ id: workspaceId, onSuccess });
  };

  const getWorkspace = useGetWorkspaceById({ id: workspaceId, onSuccess });
  const updateChat = useUpdateChat({
    id: workspaceId,
    onSuccess: onChatUpdated,
  });
  const updateGuestChat = useUpdateGuestChat({
    id: workspaceId,
    onSuccess: onGuestChatUpdated,
  });
  const updateWeekends = useUpdateWeekends({
    id: workspaceId,
    onSuccess: onWeekendsUpdated,
  });
  const updateLogo = useUpdateLogo({ workspaceId, onSuccess: onLogoUpdated });
  const updateName = useUpdateName({
    id: workspaceId,
    onSuccess: onNameUpdated,
  });
  const updateURL = useUpdateURL({ id: workspaceId, onSuccess: onURLUpdated });

  const { error: logoError, isLoading: logoLoading } = updateLogo;
  useDisplayError(logoError);

  const handleEditClick = (payload, event) => {
    if (payload == "name" && userName) {
      updateName.mutate({ data: { name: userName } });
    } else if (payload == "url" && url) {
      updateURL.mutate({ data: { url: url } });
    } else if (payload == "customDomain") {
      //apicall({url: url})
    } else if (payload == "workspaceChat") {
      updateChat.mutate({ data: { data: event?.target?.checked } });
    } else if (payload == "guestChat") {
      updateGuestChat.mutate({ data: { data: event?.target?.checked } });
    } else if (payload == "weekend") {
      updateWeekends.mutate({ data: { data: event?.target?.checked } });
    }
  };

  const uploadLogo = async (ev) => {
    const file = ev.target.files[0];

    if (!file) {
      return;
    }
    const name = file?.name;
    const fileExtension = file?.name.split(".").pop();
    const fileContent = await toBase64(file);
    const obj = {
      workspaceId: workspaceId,
      logo: {
        file_name: name,
        file_path: "",
        file_content: fileContent,
        file_extension: fileExtension,
        file_identifier: "",
      },
    };

    setProfile(obj?.logo);
    updateLogo.mutate({ data: obj });
  };

  useEffect(() => {
    reset({
      name: getWorkspace?.workspaceResponse?.data?.data?.data?.name,
      url: getWorkspace?.workspaceResponse?.data?.data?.data?.url,
    });
  }, [getWorkspace?.workspaceResponse?.data?.data?.data]);

  return (
    <>
      {/* Main Section */}
      <div className="w-full h-[100vh] ">
        <div class="items-center flex h-16 px-11  justify-between">
          <h1 class="font-bold text-xl text-[#373737]">
            Graffitects: General Settings
          </h1>
          <CloseIcon
            sx={{
              fontSize: "35px",
              color: "#373737",
              cursor: "pointer",
              "&:hover": { color: "#f98c42" },
            }}
          />
          {/* <div class="border border-red-500 ">Close icon </div> */}
        </div>
        <hr></hr>
        <div className="px-11 mt-4 mb-7 flex flex-col">
          <span class="text-[15px] mb-3 font-Manrope  text-[#373737] text-base font-semibold">
            Workspace Logo
          </span>
          <form id="avatar_profile">
            <div>
              <div className="flex space-x-3 mb-[10px] items-center">
                <img
                  className="w-[75px] h-[55px] items-center font-bold inline-flex text-white align-middle bg-[#f9a33a] border-[#f9a33a] rounded-md text-lg shadow-sm"
                  src={
                    getWorkspace?.workspaceResponse?.data?.data?.data?.logo
                      ?.file_path
                      ? getWorkspace?.workspaceResponse?.data?.data?.data?.logo
                          ?.file_path
                      : ` data:image/${profile?.file_extension};base64,${profile?.file_content}`
                  }
                />
                <label htmlFor="img-select">
                  <input
                    id="img-select"
                    type="file"
                    name="logo"
                    className="hidden"
                    accept=".jpg, .jpeg, .png"
                    onChange={uploadLogo}
                  />
                  <div className="avatar_profile">
                    <WhiteButton
                      buttonText="Add a logo"
                      type="submit"
                      id="avatar_profile"
                    />
                  </div>
                </label>
              </div>
            </div>
          </form>

          <div className="mt-3 w-[40%] flex items-center space-x-3">
            {/* <div className="bg-[#f7f7f7] border border-[#ececec] flex rounded-md mt-2"> */}
            <HookTextField
              labelClass="text-[#9399AB] text-[14px] font-medium "
              control={control}
              errors={errors}
              labelText="Workspace Name"
              name="name"
              required={false}
              placeholder="Graffitecs"
              className="bg-[#f7f7f7] border border-[#ececec] flex rounded-md mt-2"
            />
            <span
              class="!border-left-0 text-[#fff] mt-[6px] bg-[#9399AB] font-semibold global-inputFiled text-[13px] px-5 items-center h-[45px] py-2 !border-gray-300 cursor-pointer flex justify-center uppercase"
              onClick={() => handleEditClick("name")}
            >
              Edit
            </span>
            {/* </div> */}
          </div>
          <div className="mt-3 w-[40%] flex items-center  space-x-3">
            {/* <div className="bg-[#f7f7f7] border border-[#ececec] flex rounded-md mt-2"> */}
            <HookTextField
              labelClass="text-[#9399AB] text-[14px] font-medium"
              control={control}
              errors={errors}
              labelText="Workspace URL"
              name="url"
              required={false}
              placeholder="graffitecs2.three60.com"
              className="bg-[#f7f7f7] border border-[#ececec] flex rounded-md mt-2"
            />
            <span
              class="!border-left-0 text-[#fff] mt-[6px] bg-[#9399AB] font-semibold global-inputFiled text-[13px] px-5 items-center h-[45px] py-2 !border-gray-300 cursor-pointer flex justify-center uppercase"
              onClick={() => handleEditClick("url")}
            >
              Edit
            </span>
            {/* </div> */}
          </div>
          <div className="mb-5 w-[40%]">
            <div className="mt-5">
              <label class="block mb-2 text-[15px] font-semibold text-[#373737]">
                Custom Domain
              </label>
              <p class="text-[#9399AB] text-[14px] mb-2">
                Use a custom domain for your team to access your <br></br>{" "}
                workspace from.
              </p>
              <Switch
                value={
                  getWorkspace?.workspaceResponse?.data?.data?.data
                    ?.CustomSubdomain
                    ? getWorkspace?.workspaceResponse?.data?.data?.data
                        ?.CustomSubdomain
                    : false
                }
                name="Off"
                className="!w-[60px] bg-[#e5e8ef] !h-[36px] text-[#fff] rounded-full peer   peer-checked:after:translate-x-full  peer-checked:bg-[#fff]"
                onChange={(e) => handleEditClick("customDomain", e)}
              />
            </div>
          </div>

          <div className="mb-5 w-[40%]">
            <div className="mt-5">
              <label class="block mb-2 text-[15px] font-semibold text-[#373737]">
                Workspace Chat
              </label>
              <p class="text-[#9399AB] text-[14px] mb-2">
                Will your workspace be using three60 built-in Workspace Chat for
                direct messaging? You can always turn this feature on/off in
                your Workspace Settings later.
              </p>
              <Switch
                value={
                  getWorkspace?.workspaceResponse?.data?.data?.data
                    ?.workspaceChat
                    ? getWorkspace?.workspaceResponse?.data?.data?.data
                        ?.workspaceChat
                    : false
                }
                label="Off"
                className="w-[60px] h-7 bg-[#e5e8ef] text-[#fff] rounded-full peer   peer-checked:after:translate-x-full  peer-checked:bg-[#fff]"
                onChange={(e) => handleEditClick("workspaceChat", e)}
              />
            </div>
          </div>

          <div className="mb-5 w-[40%]">
            <div className="mt-5">
              <label class="block mb-2 text-[15px] font-semibold text-[#373737]">
                Guest Chat
              </label>
              <p class="text-[#9399AB] text-[14px] mb-2">
                Allow Guests to send and receive direct messages from workspace
                owners.
              </p>
              <Switch
                value={
                  getWorkspace?.workspaceResponse?.data?.data?.data?.guestChat
                    ? getWorkspace?.workspaceResponse?.data?.data?.data
                        ?.guestChat
                    : false
                }
                label="Off"
                className="w-[60px] h-7 bg-[#e5e8ef] text-[#fff] rounded-full peer   peer-checked:after:translate-x-full  peer-checked:bg-[#fff]"
                onChange={(e) => handleEditClick("guestChat", e)}
              />
            </div>
          </div>
          <div className="mb-5 w-[40%]">
            <div className="mt-5">
              <label class="block mb-2 text-[15px] font-semibold text-[#373737]">
                Disable Weekends
              </label>
              <Switch
                value={
                  getWorkspace?.workspaceResponse?.data?.data?.data
                    ?.disableWeekend
                    ? getWorkspace?.workspaceResponse?.data?.data?.data
                        ?.disableWeekend
                    : false
                }
                label="Off"
                className="w-[60px] h-7 bg-[#e5e8ef] text-[#fff] rounded-full peer   peer-checked:after:translate-x-full  peer-checked:bg-[#fff]"
                onChange={(e) => handleEditClick("weekend", e)}
              />
            </div>
          </div>
          <div class="w-[40%] mb-5">
            <div class="mt-3">
              <label class="block mb-2 text-[15px] font-semibold text-[#373737]">
                Default Time Tracker
              </label>
              <p class="text-[#9399AB] text-[14px] mb-2">
                Select your default time tracking solution between three60 and{" "}
                <br></br> Harvest.
              </p>
              <HookSelectField
                control={control}
                errors={errors}
                loadOptions={[
                  { value: "Product Manager", label: "Product Manager" },
                  { value: "Developer", label: "Developer" },
                  { value: "Designer", label: "Designer" },
                  { value: "Marketing & Sales", label: "Marketing & Sales" },
                  { value: "Entrepreneur", label: "Entrepreneur" },
                  {
                    value: "Management / Executive",
                    label: "Management / Executive",
                  },
                  { value: "Operations & HR", label: "Operations & HR" },
                  { value: "Other", label: "Other" },
                ]}
                name="role"
                placeholder="Select Work Role"
                className="bg-[#f7f7f7] border border-[#ececec] flex rounded-md mt-2"
              />
            </div>
          </div>
          <div className="mb-5"></div>
          {/* <div className="mb-24 mt-3">
                <HookSelectField
                  control={control}
                  errors={errors}
                  labelText="Your Role"
                  loadOptions={[
                    { value: "Product Manager", label: "Product Manager" },
                    { value: "Developer", label: "Developer" },
                    { value: "Designer", label: "Designer" },
                    { value: "Marketing & Sales", label: "Marketing & Sales" },
                    { value: "Entrepreneur", label: "Entrepreneur" },
                    {
                      value: "Management / Executive",
                      label: "Management / Executive",
                    },
                    { value: "Operations & HR", label: "Operations & HR" },
                    { value: "Other", label: "Other" },
                  ]}
                  name="role"
                  placeholder="Select Work Role"
                />
              </div> */}
        </div>
      </div>
      {/* <div className=" relative">
            <div className="ml-[337px] text-center -mt-14">
              <button
                className=" ml-0 min-w-[210px] px-5 text-center py-2  border border-[#00b8a9] text-white text-sm font-semibold rounded-md bg-[#00b8a9] " */}
      {/* // onClick={() => handleSubmit(onSubmit)()}
                // disabled={isLoading}
              > */}
      {/* {isLoading ? <CircularProgress size={10} /> : "Next"} */}
      {/* </button>
            </div>
          </div>
        </div> */}
    </>
  );
};

export default General_Settings;
