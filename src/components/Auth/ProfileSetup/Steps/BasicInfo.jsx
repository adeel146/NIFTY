import { useRef, useState } from "react";
import "../profileSetup.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import HookTextField from "hooks/Common/HookTextField";
import HookSelectField from "hooks/Common/HookSelectField";
import { CircularProgress } from "@mui/material";
import { profileSetupSchema } from "validations/profileSetup";
import { useLocation } from "react-router";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "notistack";

function BasicInfo({ handleNext }) {
  const { enqueueSnackbar } = useSnackbar();
  const [selectedFile, setSelectedFile] = useState({});
  const [isLoading, setLoading] = useState(false);
  const { register } = useAuth();
  const location = useLocation();
  const userId = location?.search?.split("=").pop();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(profileSetupSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        id: +userId,
        name: data.username,
        password: data.password,
        phone: data.number,
        role: data.role?.value,
        image: selectedFile,
      };
      await register(payload);
      handleNext();
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

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const fileContent = await toBase64(file);
    const uploadedFile = {
      file_name: file.name,
      file_extension: file.name.split(".").pop(),
      file_content: fileContent,
    };

    setSelectedFile(uploadedFile);
  };
  const fileInputRef = useRef(null);
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const res = reader.result.replace(/^data:.+;base64,/, "");
        resolve(res);
      };
      reader.onerror = (error) => reject(error);
    });

  return (
    <>
      <>
        {/* Main Section */}
        <div className="py-16 px-0 mt-1">
          <div className="flex my-0 mx-auto text-left w-[560px]">
            <div className="flex-[0_0_auto] mr-12">
              <div className="w-[120px]">
                <span className="rounded-lg flex h-[120px] mb-2 w-full shadow-[0_0_5px_0_rgba(0,0,0,.09)]">
                  <img
                    src={
                      !!selectedFile
                        ? `data:image/${selectedFile.extention};base64,  ${selectedFile?.file_content}`
                        : "/images/google.usericon.png"
                    }
                    alt=""
                  />
                </span>
                <label className="relative">
                  <button
                    onClick={handleButtonClick}
                    className="h-auto ml-0 min-h-[30px] text-center w-full border border-[#e8e8e8] bg-white text-[#8e94bb] text-sm font-semibold rounded-md hover:text-[#00b8a9] hover:shadow-md "
                  >
                    Add Profile Photo
                  </button>
                  <input
                    ref={fileInputRef}
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 z-[-1]"
                    onChange={handleFileInputChange}
                  />
                </label>
              </div>
            </div>
            <div className="flex-[1_1_auto]">
              <div className="mb-5 relative">
                <div className="p-0">
                  <HookTextField
                    labelClass="block mb-2 text-sm font-bold opacity-100"
                    control={control}
                    errors={errors}
                    labelText="Full Name"
                    name="username"
                    type="text"
                    required={false}
                    placeholder="Your first & last name…"
                  />
                </div>
              </div>
              <div className="mb-5 relative">
                <div className="p-0">
                  <HookTextField
                    labelClass="block mb-2 text-sm font-bold opacity-100"
                    control={control}
                    errors={errors}
                    labelText="Create Password"
                    name="password"
                    type="password"
                    required={false}
                    placeholder="Min 8 characters and one symbol"
                  />
                </div>
              </div>
              <div className="mb-5 relative">
                <div className="p-0">
                  <HookTextField
                    labelClass="block mb-2 text-sm font-bold opacity-100"
                    control={control}
                    errors={errors}
                    labelText="Phone Number"
                    name="number"
                    type="number"
                    required={false}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              <div className="mb-24 mt-3">
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
              </div>
            </div>
          </div>
          <div className=" relative">
            <div className="ml-[337px] text-center -mt-14">
              <button
                className=" ml-0 min-w-[210px] px-5 text-center py-2  border border-[#00b8a9] text-white text-sm font-semibold rounded-md bg-[#00b8a9] "
                onClick={() => handleSubmit(onSubmit)()}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={10} /> : "Next"}
              </button>
            </div>
          </div>
        </div>
      </>
    </>
  );
}

export default BasicInfo;
