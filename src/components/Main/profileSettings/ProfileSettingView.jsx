import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import HookFreeSelect from "hooks/Common/HookFreeSelect";
import HelpIcon from "@mui/icons-material/Help";
import GreenButton from "hooks/Common/commonButtons/GreenButton";
import { Divider } from "@mui/material";
import HookTextField from "hooks/Common/HookTextField";
import CloseIcon from "@mui/icons-material/Close";
import ProfileEmailChangeDialog from "./ProfileEmailChangeDialog";
import { toBase64 } from "hooks/Common/toBase64";
import WhiteButton from "hooks/Common/commonButtons/WhiteButton";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from "react-redux";
import { useUpdateProfile } from ".";
import { useDisplayError } from "hooks/useDisplayError";
import { useDisplaySuccess } from "hooks/useDisplaySuccess";
import CustomLoader from "hooks/Common/CustomLoader";
import { useUpdateAvatar } from ".";
import { useAuth } from "hooks/useAuth";
import { useAppGetCurrentUser } from "hooks/Login";
// import HookSecondTextField from "hooks/Common/HookSecondTextField";

const schema = yup.object().shape({
  language_Id: yup.number().required("Language Required"),
  weekStart: yup.number().required("Week Required"),
  is24Format: yup.number().required("Time Format  Required"),
  dateFormat: yup.string().required("Date Format Required"),
  name: yup.string().required("Name Required"),
  // first_name: yup.string().required("First name  Required"),
});
const ProfileSettingView = () => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const [showLinks, setShowLinks] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = useState({});
  const loginUserDetail = useAuth();
  const onAvatarSuccess = (data) => {
    display(data.message);
  };

  const updateUserAvatar = useUpdateAvatar({ onSuccess: onAvatarSuccess });
  const { error: avatarError, isLoading: avatarLoading } = updateUserAvatar;
  useDisplayError(avatarError);

  const uploadFile = async (ev) => {
    const file = ev.target.files[0];

    if (!file) {
      return;
    }
    const name = file?.name;
    const fileExtension = file?.name.split(".").pop();
    const fileContent = await toBase64(file);
    const obj = {
      file_name: name,
      file_path: "",
      file_content: fileContent,
      file_extension: fileExtension,
      file_identification: "",
    };
    setProfile(obj);

    updateUserAvatar.mutate({ data: obj });
  };

  useEffect(() => {
    if (loginUserDetail?.user) {
      reset(loginUserDetail?.user);
    }
  }, [loginUserDetail?.user]);

  const display = useDisplaySuccess();
  const onSuccess = (data) => {
    display(data.message);
  };
  const updateUser = useUpdateProfile({ onSuccess });
  const { error, isLoading } = updateUser;
  useDisplayError(error);

  if (isLoading) {
    return <CustomLoader />;
  }

  const onSubmit = (data) => {
    const payload = {
      language_Id: data.language_Id,
      weekStart: data.weekStart,
      dateFormat: data.dateFormat,
      is24Format: data.is24Format,
      name: data.name,
    };

    updateUser.mutate({ data: payload });
  };

  return (
    <div className=" pl-8 pt-5 h-full overflow-y-auto profileSetting-page">
      <div className="flex justify-between items-center mb-3 mr-5 pb-2">
        <h2 className="text-xl font-bold font-Manrope text-[#373737]">
          Profile Setting
        </h2>
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
      <form id="avatar_profile">
        <div className="mt-8">
          <h3 className="text-black text-base font-semibold mb-1 font-Manrope">
            Avatar
          </h3>
          <div className="flex space-x-3 items-center">
            <img
              className="w-[100px] h-[auto] rounded-lg shadow-md"
              src={
                loginUserDetail?.user?.photo?.file_path
                  ? loginUserDetail?.user?.photo?.file_path
                  : ` data:image/${profile?.file_extension};base64,${profile?.file_content}`
              }
            />
            <label htmlFor="img-select">
              <input
                id="img-select"
                type="file"
                name="image"
                className="hidden"
                accept=".jpg, .jpeg, .png"
                onChange={uploadFile}
              />
              <div className="avatar_profile">
                <WhiteButton
                  buttonText="Upload avatar"
                  type="submit"
                  id="avatar_profile"
                />
              </div>
            </label>
          </div>
        </div>
      </form>
      <h1 className="text-black text-base font-semibold  font-Manrope mt-[1.5rem] mb-3">
        User Role
      </h1>
      <div className="flex space-x-2 items-center text-sm font-Manrope font-medium ">
        <h3 className="text-[#333] text-base font-semibold ">Owner</h3>
        <HelpIcon
          sx={{
            fontSize: "15px",
            color: "#A096BB",
            cursor: "pointer",
            "&:hover": { backgroundColor: "black" },
            borderRadius: "90px",
          }}
        />
      </div>
      <form id="user_data_update">
        <div className="flex space-x-3 items-center mt-5">
          <div>
            <HookFreeSelect
              name="language_Id"
              control={control}
              labelText="Language"
              errors={errors}
              options={languages}
            />
          </div>
          <div>
            <HookFreeSelect
              name="weekStart"
              control={control}
              labelText="Week Start"
              errors={errors}
              options={weeks}
            />
          </div>
        </div>
        <div className="flex space-x-3 items-center mt-5">
          <div>
            <HookFreeSelect
              name="dateFormat"
              control={control}
              labelText="Date Format"
              errors={errors}
              options={dateFormat}
            />
          </div>
          <div>
            <HookFreeSelect
              name="is24Format"
              control={control}
              labelText="Time Format"
              errors={errors}
              options={timeFormat}
            />
          </div>
        </div>
        <div className="flex space-x-3 items-center ">
          <div className="w-[450px] mt-4 mb-4">
            <HookTextField
              name="name"
              control={control}
              labelText="Full Name"
              errors={errors}
              placeholder="Full Name"
            />
          </div>
          {/* <HookSecondTextField
            name="first_name"
            control={control}
            label="first_name"
            errors={errors}
          /> */}

          <div className="w-[450px] mt-4 mb-4 relative">
            <HookTextField
              name="email"
              control={control}
              labelText="Email"
              errors={errors}
              placeholder="Email"
            />
            <span
              onClick={() => setProfileOpen(true)}
              className="absolute top-[40px] left-[90%] text-xs font-medium cursor-pointer"
              role="button"
            >
              EDIT
            </span>
          </div>
        </div>
        <div className="mb-2">
          <GreenButton
            buttonText="Save Changes"
            id="user_data_update"
            onClick={handleSubmit(onSubmit)}
          />
        </div>
      </form>
      <div className="w-full mb-4 mt-5">
        <Divider />
      </div>

      <div className="mt-7">
        <h3 className="text-black font-Manrope text-base font-bold ">
          Link Additional Workspaces
        </h3>
      </div>
      {showLinks && (
        <form>
          <div>
            <div className="mt-[1rem] flex space-x-3">
              <div className="w-[450px]">
                <HookTextField
                  name="other_email"
                  control={control}
                  labelText="Other Account Email"
                  errors={errors}
                  placeholder="Email"
                />
              </div>
              <div className="w-[450px]">
                <HookTextField
                  name="other_password"
                  control={control}
                  labelText="Other Account Password"
                  errors={errors}
                  placeholder="Password"
                />
              </div>
            </div>
            <div className=" flex space-x-3">
              <div className="w-[450px]">
                <HookTextField
                  name="current_password"
                  control={control}
                  labelText="Current Account Password"
                  errors={errors}
                  placeholder="Password"
                />
              </div>
            </div>
          </div>
        </form>
      )}
      <div className="mb-16 mt-4">
        <GreenButton
          buttonText="Link Account"
          onClick={() => setShowLinks(!showLinks)}
        />
      </div>
      <ProfileEmailChangeDialog
        profileOpen={profileOpen}
        setProfileOpen={setProfileOpen}
      />
    </div>
  );
};

export default ProfileSettingView;

const dateFormat = [
  {
    label: "dd/mm/yyyy",
    value: "dd/mm/yyyy",
  },
  {
    label: "mm/dd/yyyy",
    value: "mm/dd/yyyy",
  },
  {
    label: "yyyy/mm/dd",
    value: "yyyy/mm/dd",
  },
];

const timeFormat = [
  {
    label: "12-Hour Time",
    value: 0,
  },
  {
    label: "24-Hour Time",
    value: 1,
  },
];

const weeks = [
  {
    label: "Sunday",
    value: 0,
  },
  {
    label: "Monday",
    value: 1,
  },

  {
    label: "Saturday",
    value: 6,
  },
];

const languages = [
  {
    label: "English",
    value: 1,
  },
  {
    label: "Arabic",
    value: 2,
  },
];
