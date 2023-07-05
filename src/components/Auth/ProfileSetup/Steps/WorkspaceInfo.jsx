import React, { useRef, useState } from "react";
import "../profileSetup.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAddWorkspace } from "hooks/Workspace";
import { useDisplaySuccess } from "hooks/useDisplaySuccess";
import { useDisplayError } from "hooks/useDisplayError";
import HookTextField from "hooks/Common/HookTextField";

function WorkspaceInfo({ handleNext }) {
  const [selectedFile, setSelectedFile] = useState({});
  const display = useDisplaySuccess();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    // resolver: yupResolver(profileSetupSchema),
  });

  const onSuccess = (data) => {
    display(data.message);
    localStorage.setItem("workspaceId", data?.data);
    handleNext();
  };

  const addWorkspace = useAddWorkspace({ onSuccess });

  const error = addWorkspace.error;
  useDisplayError(error);

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

  const onSubmit = (data) => {
    const payload = {
      name: data.name,
      url: data.url,
      image: selectedFile,
    };
    addWorkspace.mutate({ data: payload });
  };
  return (
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
                  className="h-auto ml-0 min-h-[30px] px-1 text-center w-full border border-[#e8e8e8] bg-white text-[#8e94bb]  text-sm font-semibold rounded-md hover:text-[#00b8a9]  hover:shadow-[0_1px_2px_0 _rgba(0,0,0,.04)]"
                >
                  Add Logo
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
                  labelText="Workspace Name"
                  name="name"
                  type="text"
                  required={false}
                  placeholder="What’s your workspace name?"
                />
              </div>
            </div>
            <div className="mb-5 relative">
              <div className="p-0">
                <HookTextField
                  labelClass="block mb-2 text-sm font-bold opacity-100"
                  control={control}
                  errors={errors}
                  labelText="Workspace URL"
                  name="url"
                  type="text"
                  required={false}
                  placeholder="workspace"
                />
              </div>
            </div>
            <div className="mb-5 relative">
              <div className="p-0">
                <label className="block mb-2 text-sm font-bold opacity-100 text-[#2f2f2f]">
                  Workspace Chat
                </label>
                <p>
                  Will your workspace be using three60 built-in direct messaging
                  for members? You can always turn this feature on/off in your
                  Workspace Settings later.
                </p>
                <label className="relative inline-flex items-center cursor-pointer mt-2">
                  <input
                    type="checkbox"
                    defaultValue=""
                    className="sr-only peer"
                    defaultChecked=""
                  />
                  <div className="w-[60px] h-7 bg-[#e5e8ef] rounded-full peer   peer-checked:after:translate-x-full peer-checked:after:border-gray-600 after:content-['']  after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-[28px] after:transition-all peer-checked:bg-[#009084]"></div>
                </label>
              </div>
            </div>
            <div className="mb-5 relative">
              <div className="p-0 text-right">
                <button
                  onClick={() => handleSubmit(onSubmit)()}
                  className=" ml-0 min-w-[200px] px-5 text-center py-2  border border-[#00b8a9] text-white  text-sm font-semibold rounded-md bg-[#00b8a9] "
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default WorkspaceInfo;
