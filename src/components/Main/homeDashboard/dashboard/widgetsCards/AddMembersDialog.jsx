import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import {
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { useSelector } from "react-redux";
import HookTextField from "hooks/Common/HookTextField";
import { Divider } from "@mui/material";
import { useForm } from "react-hook-form";
import WhiteButton from "hooks/Common/commonButtons/WhiteButton";
import GreenButton from "hooks/Common/commonButtons/GreenButton";
import HookSelectField from "hooks/Common/HookSelectField";
import { makeStyles } from "@mui/styles";
import { yupResolver } from "@hookform/resolvers/yup";
import { meetingsSchema, milestoneSchema } from "validations/portfolio";
import { useDisplaySuccess } from "hooks/useDisplaySuccess";
import axios from "axios";
import CustomLoader from "hooks/Common/CustomLoader";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import Select from "react-select";
import Avatar from "@mui/material/Avatar";
import { useDispatch } from "react-redux";
import { addUsers } from "redux/reducers/minutesofmeetings";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import { width } from "@xstyled/styled-components";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import EmailIcon from "@mui/icons-material/Email";
import { closeAddMembersDialog } from "redux/reducers/mainDashbord";
import {
  useAddMembers,
  useDeleteMember,
  useGetProjectMembers,
} from "hooks/ProjectTask.jsx";
import { useDisplayError } from "hooks/useDisplayError";
import DeleteIcon from "@mui/icons-material/Delete";
import { useGetWorkSpaceMembers } from "hooks/Workspace";
import * as yup from "yup";
import { ErrorMessage } from "@hookform/error-message";
import { Apis } from "static/apis";
import { RolesEnum } from "components/MinutesOfMeetings/RightSide/SingleRow";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddMembersDialog() {
  const open = useSelector((state) => state?.dashbordSlice?.addMembersState);
  const { enqueueSnackbar } = useSnackbar();
  const [customUser, setCustomUser] = React.useState(false);
  const [customUsers, setCustomUsers] = React.useState([]);
  const queryClient = useQueryClient();
  const meetingsSchema = yup.object({
    custom: yup.boolean().default(false),
    members: yup
      .array()
      .nullable()
      .when("custom", {
        is: false,
        then: () => yup.array().required("Required"),
      }),
    name: yup
      .string()
      .nullable()
      .when("custom", {
        is: true,
        then: () => yup.string().required("Name Required"),
      }),
    email: yup
      .string()
      .email()
      .nullable()
      .when("custom", {
        is: true,
        then: () => yup.string().required("Email Required"),
      }),
    role: yup
      .string()
      .nullable()
      .when("custom", {
        is: true,
        then: () => yup.string().required("Role Required"),
      }),
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    register,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(meetingsSchema),
  });
  const dispatch = useDispatch();
  const displaySuccess = useDisplaySuccess();
  const classes = useStyles();
  const { projectId } = useParams();
  const workspaceId = localStorage.getItem("workspaceId");
  const { selectedmeeting } = useSelector(
    (state) => state.minutesofmeetingSlice
  );

  const [addNewMember, setNewMember] = React.useState([]);

  const closeModal = () => {
    reset({ name: "" });
    dispatch(closeAddMembersDialog());
    setCustomUser(false);
    setCustomUsers([]);
  };

  const { mutate, isLoading } = useMutation({
    mutationKey: ["addmembers"],
    mutationFn: (data) => axios.post(`/project/add_members/${projectId}`, data),
    onSuccess: (data) => {
      enqueueSnackbar(data.data.message, { variant: "success" });
      queryClient.invalidateQueries([`${Apis.GETProjectMembers}`]);
      closeModal();
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  const onSuccess = (data) => {
    displaySuccess(data?.msesage);
  };

  const addMemberSuccess = (data) => {
    displaySuccess(data?.message);
    reset({ members: "" });
  };

  const getMember = (data) => {
    displaySuccess(data?.message);
  };

  const workspaceMembers = (data) => {
    displaySuccess(data?.message);
  };

  const project_Id = localStorage.getItem("projectId");
  const removeMember = useDeleteMember({ project_id: project_Id, onSuccess });

  const addMembers = useAddMembers({
    project_id: project_Id,
    onSuccess: addMemberSuccess,
  });

  const getMembers = useGetProjectMembers({
    id: project_Id,
    onSuccess: getMember,
  });

  const membersList =
    getMembers?.projectMembersResponse?.data?.data?.data?.members;

  const { workspaceResponse } = useGetWorkSpaceMembers({
    id: workspaceId,
    onSuccess: workspaceMembers,
  });

  const workspaceData = workspaceResponse?.data?.data?.data;

  const searchMembers = workspaceData?.map((searchMember) => {
    return {
      value: searchMember?.id,
      label: searchMember?.email,
      email: searchMember?.email,
    };
  });

  const onSubmit = (data) => {
    const payload =
      data.members.map((member) => {
        return {
          name: member.name,
          email: member.email,
          role: RolesEnum.find((obj) => obj.value === "member.role") || "",
        };
      }) || [];
    mutate(payload);
  };

  const deleteMember = (email) => {
    const body = {
      email: email,
    };
    removeMember.mutate({ data: body });
  };

  const handleSubmitCustomUser = () => {
    // if (customUser) {
    const payload = customUsers.map((obj) => {
      return { name: obj.name, email: obj.email, role: obj.role };
    });
    mutate(payload);
    // }
  };

  const handleAddCustomUser = (data) => {
    let user = { name: data.name, email: data.email, role: data.role };
    setCustomUsers((prev) => [...prev, user]);
    setValue("name", "");
    setValue("email", "");
    setValue("role", "");
    // reset({ name: "", email: "" });
  };
  const handleDeleteCustomUser = (index) => {
    let copyCustomUser = [...customUsers];
    copyCustomUser.splice(index, 1);
    setCustomUsers(copyCustomUser);
  };

  return (
    <Dialog
      maxWidth="sm"
      open={open}
      onClose={closeModal}
      TransitionComponent={Transition}
    >
      <CustomLoader isLoading={[isLoading].includes(true)} />
      <DialogTitle className="bg-[#fafbfd] w-full">
        <div className=" flex justify-between">
          <h1 className="font-Manrope font-extrabold text-black text-2xl">
            Add Members
          </h1>
          <div className="space-x-3">
            <HelpOutlineIcon
              sx={{
                fontSize: "24px",
              }}
            />
            <CloseIcon
              sx={{
                width: "33px",
                height: "33px",
                fill: "gray",
                fontSize: "18px",
                padding: "3px 3px",
              }}
              className="border bg-white hover:bg-[#f98a3f] hover:fill-white rounded-md cursor-pointer "
              onClick={() => dispatch(closeAddMembersDialog())}
            />
          </div>
        </div>
      </DialogTitle>
      <Divider />

      <DialogContent className={classes.dialogPaper}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full">
            <div className="mt-4">
              <div className="flex flex-col">
                <h6 className="font-Manrope font-bold text-base mb-1">
                  Add member
                </h6>
                <p className="font-Manrope font-semibold text-sm">
                  Access to all members
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex flex-col">
                <h6 className="font-Manrope font-bold text-base mb-1">
                  Share with teammates
                </h6>
                <div className="flex justify-between">
                  <p className="font-Manrope font-semibold text-sm">
                    Access to all notes
                  </p>
                  <a
                    onClick={() => {
                      setValue("custom", !watch("custom"));
                      setCustomUser(!customUser);
                    }}
                    href="#"
                    className="font-Manrope font-semibold text-sm hover:underline text-[#00A99B]"
                  >
                    {!customUser ? "Custom User" : "WorkSpace User"}
                  </a>
                </div>
              </div>
              <input
                type="checkbox"
                {...register("custom")}
                checked={watch("custom")}
                onChange={(e) => setValue("custom", e.target.checked)}
                className="hidden"
              />
            </div>
            {customUser ? (
              <>
                <div className="mt-2 flex gap-2 mb-2">
                  <div className="relative w-[45%]">
                    <label className="font-semibold text-[15px] mb-1 font-Manrope ">
                      Name
                    </label>
                    <input
                      {...register("name")}
                      value={watch("name")}
                      onChange={(event) => setValue("name", event.target.value)}
                      type="text"
                      placeholder="Name..."
                      className=" border mt-1 block focus:outline-[#00a99b] active:shadow-inner global-inputFiled rounded h-[45px]  border-gray-300 w-full px-3 py-2 bg-white text-black placeholder:text-[#8eaedf] shadow-inner"
                    />
                    <ErrorMessage
                      errors={errors}
                      name="name"
                      render={({ message }) => (
                        <p className="text-red-500 font-Manrope">{message}</p>
                      )}
                    />
                  </div>

                  <div className="relative w-[45%]">
                    <label className="font-semibold text-[15px] mb-1 font-Manrope ">
                      Email
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="Name"
                      className=" border mt-1 block focus:outline-[#00a99b] active:shadow-inner global-inputFiled rounded h-[45px]  border-gray-300 w-full px-3 py-2 bg-white text-black placeholder:text-[#8eaedf] shadow-inner"
                    />
                    <ErrorMessage
                      errors={errors}
                      name="email"
                      render={({ message }) => (
                        <p className="text-red-500 font-Manrope">{message}</p>
                      )}
                    />
                  </div>
                  <div className="relative w-[45%]">
                    <label className="font-semibold text-[15px] mb-1 font-Manrope ">
                      Role
                    </label>
                    <input
                      {...register("role")}
                      placeholder="eh,Admin"
                      className=" border mt-1 block focus:outline-[#00a99b] active:shadow-inner global-inputFiled rounded h-[45px]  border-gray-300 w-full px-3 py-2 bg-white text-black placeholder:text-[#8eaedf] shadow-inner"
                    />
                    <ErrorMessage
                      errors={errors}
                      name="role"
                      render={({ message }) => (
                        <p className="text-red-500 font-Manrope">{message}</p>
                      )}
                    />
                  </div>
                  <div className="mt-8 ml-2">
                    <Button
                      onClick={handleSubmit(handleAddCustomUser)}
                      sx={{
                        backgroundColor: "#00A99B",
                        "&:hover": {
                          backgroundColor: "#00A99B",
                        },
                      }}
                      variant="contained"
                      type="submit"
                    >
                      Add
                    </Button>
                  </div>
                </div>
                <div className="overflow-auto lg:overflow-visible mb-5">
                  <table className="table text-gray-400 border-separate text-sm text-left w-full">
                    <thead className="bg-gray-100 text-gray-500">
                      <tr>
                        <th className="p-3 text-[#2f2f2f] font-semibold">
                          Name
                        </th>
                        <th className="p-3 text-[#2f2f2f] font-semibold">
                          Email
                        </th>
                        <th className="p-3 text-[#2f2f2f] font-semibold">
                          Role
                        </th>

                        <th className="p-3 text-[#2f2f2f] font-semibold">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {customUsers.map((user, index) => (
                        <tr key={index} className="bg-gray-100">
                          <td className="p-3">
                            <div className="flex align-items-center">
                              <AccountBoxIcon />
                              <div className="ml-3">
                                <div className="text-[#2f2f2f]">
                                  {user.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex align-items-center">
                              <EmailIcon />
                              <div className="ml-3">
                                <div className="text-[#2f2f2f]">
                                  {" "}
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex align-items-center">
                              <AccountBoxIcon />
                              <div className="ml-3">
                                <div className="text-[#2f2f2f]">
                                  {" "}
                                  {user.role}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="p-3 ">
                            <a
                              onClick={() => handleDeleteCustomUser(index)}
                              href="#"
                              className="text-[#2f2f2f] hover:text-[#000]"
                            >
                              <DeleteIcon className="hover:text-red-600" />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="flex pb-3 cursor-pointer">
                <div className="mt-4 w-[450px] cursor-pointer">
                  <HookSelectField
                    name="members"
                    errors={errors}
                    control={control}
                    required={false}
                    placeholder="Search..."
                    isMulti={true}
                    loadOptions={searchMembers}
                  />
                </div>
                <div className="mt-5 ml-2">
                  <Button
                    sx={{
                      backgroundColor: "#00A99B",
                      "&:hover": {
                        backgroundColor: "#00A99B",
                      },
                    }}
                    variant="contained"
                    type="submit"
                  >
                    Add
                  </Button>
                </div>
              </div>
            )}

            <Divider
              sx={{
                marginTop: "12px",
                marginBottom: "12px",
              }}
            />
            <div className="mt-3">
              <p className="font-Manrope font-semibold text-base ">
                Access to all members
              </p>
              {membersList && membersList?.length > 0
                ? membersList?.map((member) => {
                    return (
                      <>
                        <div className="flex justify-between mt-[5px]">
                          <div className="flex mt-2 space-x-2">
                            <Avatar
                              sx={{
                                width: "24px",
                                height: "24px",
                              }}
                            />
                            <div className="">
                              <p>{member?.name}</p>
                            </div>
                          </div>
                          <div className="border bg-gray-200 px-1 rounded-md flex ">
                            <p
                              className="font-medium pl-2 pr-2 pt-[2px]"
                              onClick={() => deleteMember(member?.email)}
                            >
                              <DeleteIcon />
                            </p>{" "}
                          </div>
                        </div>
                      </>
                    );
                  })
                : null}
            </div>
          </div>
          <input type="submit" className="hidden" />
        </form>
      </DialogContent>
      <DialogActions className="border-t bg-[#fafbfd]">
        <div className="flex justify-end my-5 items-center mr-4 space-x-2">
          <WhiteButton
            style={{ width: "60px" }}
            buttonText="Cancel"
            onClick={() => dispatch(closeAddMembersDialog())}
          />
          <GreenButton
            style={{ width: "140px" }}
            disabled={isLoading}
            loading={isLoading}
            buttonText="Save"
            type="submit"
            onClick={
              watch("custom") ? handleSubmitCustomUser : handleSubmit(onSubmit)
            }
          />
        </div>
      </DialogActions>
    </Dialog>
  );
}

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    overflowY: "unset !important",
    width: "550px",
  },
}));
