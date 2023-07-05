import HookCheckBox from "hooks/Common/HookCheckBox";
import { checkboxesSchema } from "validations/workspacesSetup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import LockIcon from "@mui/icons-material/Lock";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import { IconButton } from "@mui/material";
import { useDisplaySuccess } from "hooks/useDisplaySuccess";
import { useEffect, useState, Fragment } from "react";
import { map, find } from "lodash";
import { useGetNotification, useUpdateNotification } from "hooks/ProfileSetup";
import { notificationSchema } from "validations/profileSetup";
import CustomLoader from "hooks/Common/CustomLoader";
import CloseIcon from "@mui/icons-material/Close";

const NotificationSettingView = () => {
  const [sectionShow, setSectionShow] = useState(true);
  const display = useDisplaySuccess();
  const {
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(notificationSchema),
  });

  const onSuccess = (data) => {};

  const getPermission = useGetNotification({
    onSuccess,
  });

  const { isLoading } = getPermission;

  const [disable, setDisable] = useState(false);

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

  const updatedPermission = useUpdateNotification({
    onSuccess: updatedSuccess,
  });

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
        uniqueName: val.uniqueName,
        value: val.values,
      };
    });
    updatedPermission?.mutate({ data: payload });
  };

  return (
    <>
      <Fragment>
        <div class="items-center flex h-16 px-7 justify-between ">
          <h1 class="text-2xl mt-2 font-bold font-Manrope text-[#373737]">
            Notification Settings
          </h1>
          <CloseIcon
            sx={{
              fontSize: "35px",
              color: "#373737",
              "&:hover": { color: "#f98c42" },
              cursor: "pointer",
            }}
          />
        </div>
        <hr></hr>
        <div>
          {sectionShow && (
            <div className="h-[180px] rounded-md bg-[#f7fefd] border-[#e0f3f1] mt-6 w-[92%] m-auto border">
              <div className="flex justify-between px-4">
                <div className="flex flex-col w-[100%]">
                  <h4 className="pt-3 text-[#434343] text-[12px] font-Manrope  tracking-wider mt-1 font-bold">
                    WHAT ARE NOTIFICATIONS?
                  </h4>
                  <p className="font-Manrope text-[13px] font-medium  mt-[12px] mb-3 tracking-wider text-[#2f2f2f]">
                    Notifications are customizable alerts that keep you updated
                    on specific activities in Nifty. For example, you can
                    receive desktop push notifications whenever you receive a
                    new message or email notifications when tasks are assigned
                    to you. Notifications ensure you never miss anything while
                    you’re away from Nifty.
                  </p>
                </div>

                <div
                  className="pt-3  cursor-pointer"
                  onClick={() => setSectionShow(false)}>
                  <CloseIcon
                    sx={{
                      color: "#02bebd",

                      "&:hover": {
                        color: "#F98A3F",
                      },
                    }}
                  />
                </div>
              </div>
              <div className="border-t  border-t-[#02bebe33] ">
                <p className="font-Manrope text-[14px] font-medium mt-[5px] mb-3 tracking-wide text-[#434343] pt-1 px-4">
                  Download our
                  <a
                    href="#"
                    className="font-Manrope text-[#00ac9e] ml-[6px] font-medium">
                    iOS
                  </a>{" "}
                  and
                  <a
                    href="#"
                    className="font-Manrope text-[#00ac9e] ml-[6px] font-medium">
                    Android
                  </a>{" "}
                  mobile applications to stay in touch while on the go and
                  customize its push notifications below.
                </p>
              </div>

              <div className="border-t border-t-[#02bebe33] mb-8">
                <div className="font-Manrope text-[12px] px-4 py-2 text-[#434343] font-semibold">
                  Have more questions?
                  <a
                    href="#"
                    className="font-Manrope text-[#00ac9e] ml-[6px] font-medium">
                    Ask us
                    <span className="ml-[3px]">✌️</span>
                  </a>
                </div>
              </div>
            </div>
          )}
          <div class="float-left ml-11 mt-4 text-white">
            <button
              class=" border rounded-lg flex bg-[#00ac9e]  gap-1 p-2 mr-2"
              disabled={disable}
              onClick={updatePermissions}>
              <LockIcon />
              Enable browser notifications
            </button>
          </div>
        </div>

        <div>
          {isLoading ? (
            <CustomLoader />
          ) : (
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
                                  <th class="px-11 ">{permission?.name} </th>
                                  <th class="text-[14px] pt-8 font-medium px-6  py-2">
                                    BROWSER
                                  </th>
                                  <th class="text-[14px] pt-8 font-medium px-6  py-2">
                                    MOBILE
                                  </th>
                                  <th class="text-[14px] pt-8 font-medium px-6  py-2">
                                    EMAIL
                                  </th>
                                </tr>
                              </thead>

                              <tbody>
                                {permission?.children?.length > 0
                                  ? permission?.children?.map((child) => {
                                      return (
                                        <tr class="border-gray-400">
                                          <td class=" w-full bg-white px-11  border">
                                            {child?.name}{" "}
                                            {/* <div class="group cursor-pointer relative inline-block border-gray-400 w-12 text-center">
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
                                        </div> */}
                                          </td>
                                          <td class="bg-[#fafbfd] px-6  py-2">
                                            <div>
                                              {child?.values?.browser ==
                                              null ? (
                                                "N/A"
                                              ) : (
                                                <HookCheckBox
                                                  pageName="knowledge"
                                                  control={control}
                                                  errors={errors}
                                                  checked={isChecked(
                                                    child?.uniqueName,
                                                    "browser"
                                                  )}
                                                  name="browser"
                                                  onChange={(e) =>
                                                    handleChange(
                                                      e,
                                                      child?.uniqueName,
                                                      "browser"
                                                    )
                                                  }
                                                />
                                              )}
                                            </div>
                                          </td>
                                          <td class="bg-[#fafbfd] px-6 py-2">
                                            <div>
                                              {child?.values?.mobile == null ? (
                                                "N/A"
                                              ) : (
                                                <HookCheckBox
                                                  pageName="knowledge"
                                                  control={control}
                                                  errors={errors}
                                                  checked={isChecked(
                                                    child?.uniqueName,
                                                    "mobile"
                                                  )}
                                                  name="mobile"
                                                  onChange={(e) =>
                                                    handleChange(
                                                      e,
                                                      child?.uniqueName,
                                                      "mobile"
                                                    )
                                                  }
                                                />
                                              )}
                                            </div>
                                          </td>
                                          <td class="bg-[#fafbfd] px-6 py-2">
                                            <div>
                                              {child?.values?.email == null ? (
                                                "N/A"
                                              ) : (
                                                <HookCheckBox
                                                  pageName="knowledge"
                                                  control={control}
                                                  errors={errors}
                                                  checked={isChecked(
                                                    child?.uniqueName,
                                                    "email"
                                                  )}
                                                  name="email"
                                                  onChange={(e) =>
                                                    handleChange(
                                                      e,
                                                      child?.uniqueName,
                                                      "email"
                                                    )
                                                  }
                                                />
                                              )}
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
      </Fragment>
    </>
  );
};
export default NotificationSettingView;
