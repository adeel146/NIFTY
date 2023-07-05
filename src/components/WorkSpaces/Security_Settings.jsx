import { workspaceSetupSchema } from "validations/workspacesSetup";
import HookTextField from "hooks/Common/HookTextField";
import HookSelectField from "hooks/Common/HookSelectField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Switch from "@mui/material/Switch";
import { useState } from "react";
import { useGetWorkspaceById, useUpdateTwoFactor } from "hooks/Workspace";
import { useDisplaySuccess } from "hooks/useDisplaySuccess";
import CloseIcon from "@mui/icons-material/Close";
const Security_Settings = () => {
  const workSpaceId = localStorage.getItem("workspaceId");
  const display = useDisplaySuccess();

  const securitySettings = (data) => {
    display(data?.message);
    useGetWorkspaceById({ id: workSpaceId, onSuccess });
  };

  const onSuccess = (data) => {
    // display(data?.message)
  };

  const updateSecuritySettings = useUpdateTwoFactor({
    id: workSpaceId,
    onSuccess: securitySettings,
  });
  const getWorkspace = useGetWorkspaceById({ id: workSpaceId, onSuccess });
  const handleClick = (event) => {
    updateSecuritySettings.mutate({ data: { data: event?.target?.checked } });
  };

  return (
    <>
      <div class="w-full h-[100vh] mb-16 px-0">
        <div class="items-center flex h-16 px-11  justify-between  ">
          <h1 class="font-bold text-xl text-[#373737]">
            Graffitects: Security Settings
          </h1>
          {/* <div class="border border-red-500 ">Close icon </div> */}
          <CloseIcon />
        </div>
        <hr></hr>
        <div class="px-11 mt-4 flex flex-col">
          <div class="mb-5 relative">
            <div class="mt-5">
              <label class="block mb-2 text-base font-medium text-[#2f2f2f]">
                Wokspace Members Login Policy
              </label>
              <p class="text-gray-700 mb-3">
                Require SSO or Two Factor Authentication to be enabled for all
                members.
              </p>
              <label class="relative inline-flex items-center cursor-pointer mt-4">
                <Switch
                  value={
                    getWorkspace?.workspaceResponse?.data?.data?.data
                      ?.enableTwoFactor
                      ? getWorkspace?.workspaceResponse?.data?.data?.data
                          ?.enableTwoFactor
                      : false
                  }
                  name="Off"
                  onChange={(e) => handleClick(e)}
                  className="w-[60px] h-7 bg-[#e5e8ef] rounded-full peer   peer-checked:after:translate-x-full  peer-checked:bg-[#fff]"
                />
                {/* <div
                                    class="w-[60px] h-7 bg-[#e5e8ef] rounded-full peer   peer-checked:after:translate-x-full peer-checked:after:border-gray-600 after:content-['']  after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-[28px] after:transition-all peer-checked:bg-[#009084]">
                                </div> */}
                <span class="text-gray-700">
                  &nbsp; Require Two Factor Authentication
                </span>
              </label>
            </div>
          </div>
          <hr class="mt-5 w-[60%] -ml-11"></hr>
          <label class="block mb-2 text-base font-medium text-[#2f2f2f] mt-6">
            Transfer Workspace
          </label>
          <p class="text-gray-700 mb-4">
            The account owner is the only person who can access all workspace
            settings and data. <br></br>
            You can transfer the workspace ownership to another user on the
            workspace.
          </p>
          <div class="w-full">
            <button class="text-[#8e94bb] border border-[#8e94bb] text-sm px-5 font-normal py-2 rounded-md hover:shadow-md hover:text-[#00A99B]">
              Transfer Workspace
            </button>
          </div>
          <label class="block mb-2 text-base font-medium text-[#2f2f2f] mt-6">
            Delete Workspace
          </label>
          <p class="text-gray-700 mb-4">
            Deleting your workspace on three60 cannot be undone. All projects,
            files, and data will be
            <br></br>
            irretrievable. Please use caution before deleting your workspace.
          </p>
          <div class="w-full">
            <button class="text-[#8e94bb] border border-[#8e94bb] text-sm px-5 font-normal py-2 rounded-md hover:shadow-md hover:text-[#00A99B]">
              Delete Workspace
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Security_Settings;
