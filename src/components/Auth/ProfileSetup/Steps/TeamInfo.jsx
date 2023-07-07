import { Snackbar } from "@mui/material";
import HookTextField from "hooks/Common/HookTextField";
import { useGetWorkspaceById } from "hooks/Workspace";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { links } from "static/links";

function TeamInfo() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({});

  const workspace = (data) => {};

  const workspaceId = localStorage.getItem("workspaceId");
  const workspaceData = useGetWorkspaceById({
    id: workspaceId,
    onSuccess: workspace,
  });

  const onSuccess = (data) => {};

  const handleClick = () => {
    setOpen(true);
    navigator.clipboard.writeText(
      workspaceData?.workspaceResponse?.data?.data?.data?.link
    );
  };

  const goToApp = () => {
    navigate(links.workspace);
  };
  return (
    <>
      {/* Main Section */}
      <div className="py-16 px-0 mt-1">
        <div className="flex my-0 mx-auto text-left w-[560px]">
          <div className="flex-[1_1_auto]">
            <div className="mb-2 relative">
              <div className="p-0">
                <HookTextField
                  labelClass="block mb-2 text-sm font-bold opacity-100"
                  control={control}
                  errors={errors}
                  labelText="Email Address"
                  name="email1"
                  type="text"
                  required={false}
                  placeholder="Teammate's email..."
                />
                {/* <label className="block mb-2 text-sm font-bold opacity-100">
                  Email Address
                </label>
                <div className="bg-white border border-[#e8e8e8] rounded-md flex h-auto relative  font-normal text-sm w-full leading-9">
                  <input
                    type="text"
                    placeholder="Teammate's email..."
                    className="font-normal text-base leading-[46px] py-0 px-4 bg-transparent block w-full global-inputFiled"
                  />
                </div> */}
              </div>
            </div>
            <div className="mb-2 relative">
              <div className="p-0">
                <HookTextField
                  labelClass="block mb-2 text-sm font-bold opacity-100"
                  control={control}
                  errors={errors}
                  name="email2"
                  type="text"
                  required={false}
                  placeholder="Teammate's email..."
                />
                {/* <div className="bg-white border border-[#e8e8e8] rounded-md flex h-auto relative  font-normal text-sm w-full leading-9">
                  <input
                    type="text"
                    placeholder="Teammate's email..."
                    className="font-normal text-base leading-[46px] py-0 px-4 bg-transparent block w-full global-inputFiled"
                  />
                </div> */}
              </div>
            </div>
            <div className="mb-5 relative">
              <div className="p-0">
                <HookTextField
                  labelClass="block mb-2 text-sm font-bold opacity-100"
                  control={control}
                  errors={errors}
                  name="email3"
                  type="text"
                  required={false}
                  placeholder="Teammate's email..."
                />
              </div>
            </div>
            <h4 className="text-base font-medium">
              Copy invite link to share with your team via Slack, email, or any
              messenger
            </h4>
            <div className=" mt-4 flex gap-3">
              <input
                type="text"
                readOnly=""
                disabled={true}
                defaultValue={
                  workspaceData?.workspaceResponse?.data?.data?.data?.link
                }
                className="font-normal text-base leading-8 py-0 px-4 bg-white block w-full global-inputFiled"
              />
              <button
                className="border border-gray-200 px-5 rounded-md hover:text-[#00A99B] hover:shadow-md"
                onClick={handleClick}
              >
                Copy
              </button>
              <Snackbar
                open={open}
                onClose={() => setOpen(false)}
                autoHideDuration={2000}
                message="Copied to clipboard"
              />
            </div>
            <div className="mt-10 text-right ">
              <button
                onClick={goToApp}
                className="ml-0 min-w-[210px] px-5 text-center py-2  border border-[#00b8a9] text-white text-sm font-semibold rounded-md bg-[#00b8a9] hover:shadow-lg"
              >
                Go to App&nbsp;&nbsp;
                <span>🎉</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TeamInfo;
