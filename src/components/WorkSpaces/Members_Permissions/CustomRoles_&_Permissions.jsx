import HookCheckBox from "hooks/Common/HookCheckBox";
import { checkboxesSchema } from "validations/workspacesSetup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import LockIcon from "@mui/icons-material/Lock";
import { useGetPermission, useUpdatePermission } from "hooks/Workspace";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import { IconButton } from "@mui/material";
import { useDisplaySuccess } from "hooks/useDisplaySuccess";
import { useEffect, useState } from "react";
import { map, find } from "lodash";
import CustomLoader from "hooks/Common/CustomLoader";

const CustomRolesPermissions = () => {
  const display = useDisplaySuccess();
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(checkboxesSchema),
  });
  const onSuccess = (data) => {};

  
  const [disable, setDisable] = useState(false);

  const workSpaceId = localStorage.getItem("workspaceId");
  const getPermission = useGetPermission({
    workspace_id: workSpaceId,
    onSuccess,
  });

  const { isLoading } = getPermission;
  const permissionResponse = getPermission?.workspaceResponse?.data?.data?.data;
  const [permissionArray, setPermission] = useState([]);

  useEffect(() => {
    if (permissionResponse?.length > 0) {
      let newPermission = [];
      permissionResponse?.map((permission) => {
        if (permission?.children?.length > 0) {
          newPermission = [...newPermission, ...permission?.children];
        }
      });
      setPermission(newPermission);
    }
  }, permissionResponse);

  const updatedSuccess = (data) => {
    display(data?.message);
  };

  const updatedPermission = useUpdatePermission({ onSuccess: updatedSuccess });

  const handleChange = (ev, name, key) => {
    const val = ev.target.checked;
    const newPermissions = map(permissionArray, (permission) => {
      if (permission?.uniqueName === name) {
        const newValues = { ...permission.values };
        newValues[key] = val;
        return {
          ...permission,
          values: newValues,
        };
      } else {
        return permission;
      }
    });

    setPermission(newPermissions);
  };

  const isChecked = (uniqueName, key) => {
    const permissionObj = find(permissionArray, { uniqueName });
    if (!permissionObj?.values) {
      return false;
    }
    return permissionObj?.values[key];
  };

  const updatePermissions = () => {
    setDisable(true);
    const payload = map(permissionArray, (val) => {
      return {
        workspace_Id: +workSpaceId,
        uniqueName: val.uniqueName,
        value: val.values,
      };
    });
    updatedPermission?.mutate({ data: payload });
  };

  return (
    <>
      <div>
        <div class="float-right mr-6 mt-4 text-white">
          <button
            class=" border rounded-lg flex bg-[#00ac9e]  gap-1 p-2 mr-2"
            disabled={disable}
            onClick={updatePermissions}
          >
            <LockIcon />
            Save Permissions
          </button>
        </div>
      </div>

      <div>
        {isLoading ? (
          <CustomLoader />
        ): (
<section class=" mx-auto">
          <div class="w-full">
            <div>
              {permissionResponse && permissionResponse?.length > 0
                ? permissionResponse?.map((permission) => {
                    return (
                      <div class="mt-4 mb-[25px] w-full">
                        <table class="w-full customroll_table">
                          <thead>
                            <tr class="text-[16px] font-semibold  text-left text-[#2f324f] ">
                              <th class="ml-5 ">{permission?.name} </th>
                              <th class="text-[14px] pt-8 font-medium px-6  py-2">
                                OWNER
                              </th>
                              <th class="text-[14px] pt-8 font-medium px-6  py-2">
                                ADMIN
                              </th>
                              <th class="text-[14px] pt-8 font-medium px-6  py-2">
                                MEMBER
                              </th>
                              <th class="text-[14px] pt-8 font-medium px-6  py-2">
                                GUEST
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {permission?.children?.length > 0
                              ? permission?.children?.map((child) => {
                                  return (
                                    <tr class="border-gray-400">
                                      <td class=" w-full bg-white px-5  border">
                                        {child?.name}{" "}
                                        <div class="group cursor-pointer relative inline-block border-gray-400 w-12 text-center">
                                          <IconButton
                                            style={{
                                              color: "gray",
                                              paddingTop: "0px",
                                              paddingBottom: "0px",
                                            }}
                                          >
                                            <ContactSupportIcon />
                                          </IconButton>
                                          <div class="opacity-0 w-28 bg-slate-300 text-black text-center text-xs shadow-2xl rounded-lg py-2 absolute z-10 group-hover:opacity-100 bottom-full -left-1/2  px-3 pointer-events-none">
                                            {child?.helpText}
                                          </div>
                                        </div>
                                      </td>
                                      <td class="bg-[#fafbfd] px-6  py-2">
                                        <div>
                                          <HookCheckBox
                                            pageName="knowledge"
                                            control={control}
                                            errors={errors}
                                            checked={isChecked(
                                              child?.uniqueName,
                                              "owner"
                                            )}
                                            name="owner"
                                            onChange={(e) =>
                                              handleChange(
                                                e,
                                                child?.uniqueName,
                                                "owner"
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td class="bg-[#fafbfd] px-6 py-2">
                                        <div>
                                          <HookCheckBox
                                            pageName="knowledge"
                                            control={control}
                                            errors={errors}
                                            checked={isChecked(
                                              child?.uniqueName,
                                              "admin"
                                            )}
                                            name="admin"
                                            onChange={(e) =>
                                              handleChange(
                                                e,
                                                child?.uniqueName,
                                                "admin"
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td class="bg-[#fafbfd] px-6 py-2">
                                        <div>
                                          <HookCheckBox
                                            pageName="knowledge"
                                            control={control}
                                            errors={errors}
                                            checked={isChecked(
                                              child?.uniqueName,
                                              "member"
                                            )}
                                            name="member"
                                            onChange={(e) =>
                                              handleChange(
                                                e,
                                                child?.uniqueName,
                                                "member"
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td class="bg-[#fafbfd] px-6 py-2">
                                        <div>
                                          <HookCheckBox
                                            pageName="knowledge"
                                            control={control}
                                            errors={errors}
                                            checked={isChecked(
                                              child?.uniqueName,
                                              "guest"
                                            )}
                                            name="guest"
                                            onChange={(e) =>
                                              handleChange(
                                                e,
                                                child?.uniqueName,
                                                "guest"
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })
                              : null}
                          </tbody>
                        </table>
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
        </section>
        )}
        
      </div>
    </>
  );
};
export default CustomRolesPermissions;
