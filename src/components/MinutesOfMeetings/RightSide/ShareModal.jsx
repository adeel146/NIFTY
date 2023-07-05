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
import * as yup from "yup";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";
import { ErrorMessage } from "@hookform/error-message";
import { RolesEnum } from "./SingleRow";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ShareModal(props) {
  const { isOpen, handleClose } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [customUser, setCustomUser] = React.useState(false);
  const [customUsers, setCustomUsers] = React.useState([]);
  console.log(customUsers, "customUsers");
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
    register,
    setValue,
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: { custom: false },
    resolver: yupResolver(meetingsSchema),
  });
  const dispatch = useDispatch();
  const classes = useStyles();
  const { projectId } = useParams();
  const workspaceId = localStorage.getItem("workspaceId");
  const { selectedmeeting } = useSelector(
    (state) => state.minutesofmeetingSlice
  );

  const initalState = { members: null, name: "", email: "" };

  console.log(watch(), "watch");
  console.log(errors, "errors");

  const closeModal = () => {
    reset(initalState);
    setCustomUsers([]);
    setCustomUser(false);
    handleClose();
  };

  const { mutate, isLoading } = useMutation({
    mutationKey: ["addMeeting"],
    mutationFn: (data) => axios.post("/meeting/add_user", data),
    onSuccess: (data) => {
      enqueueSnackbar(data.data.message, { variant: "success" });
      dispatch(addUsers(data.data.data));
      closeModal();
      reset(initalState);
      setCustomUsers([]);
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  const { data: usersList } = useQuery({
    queryKey: "workspace/workspace_members",
    queryFn: () => axios.get(`workspace/workspace_members/${workspaceId}`),
    select: (res) => {
      return res?.data?.data.map((val) => {
        return {
          value: val?.user_Id,
          label: val?.email,
          ...val,
        };
      });
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
    refetchOnWindowFocus: false,
  });

  const onSubmit = (data) => {
    const members =
      data.members.map((member) => {
        return {
          name: member.name,
          email: member.email,
          role: RolesEnum.find((obj) => obj.value === "member.role") || "",
        };
      }) || [];
    const payload = {
      meetingId: selectedmeeting.id,
      users: members,
    };
    mutate(payload);
  };

  const handleSubmitCustomUser = () => {
    // if (customUser) {
    // const users = customUsers.map((obj) => obj.email);
    const payload = {
      meetingId: selectedmeeting.id,
      users: customUsers,
    };
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
      keepMounted
      maxWidth="sm"
      open={isOpen}
      onClose={closeModal}
      TransitionComponent={Transition}
    >
      <CustomLoader isLoading={[isLoading].includes(true)} />
      <DialogTitle className="bg-[#fafbfd] w-full cursor-pointer">
        <div className=" flex justify-between">
          <h1 className="font-Manrope font-extrabold text-black text-2xl">
            Share With Others
          </h1>
          <div className="space-x-3">
            <HelpOutlineIcon
              sx={{
                fontSize: "24px",
              }}
            />
            <CloseIcon
              onClick={closeModal}
              sx={{
                width: "33px",
                height: "33px",
                fill: "gray",
                fontSize: "18px",
                padding: "3px 3px",
              }}
              className="border bg-white hover:bg-[#f98a3f] hover:fill-white rounded-md cursor-pointer "
            />
          </div>
        </div>
      </DialogTitle>
      <Divider />

      <DialogContent className={classes.dialogPaper}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full cursor-pointer">
            {/* <div className="flex justify-between border bg-[#cef5e4] rounded-md space-x-2 w-full h-14 -mt-2">
              <div className="flex mt-4 ml-3">
                <InfoOutlinedIcon
                  sx={{
                    fill: "gray",
                  }}
                />
              </div>
              <div className="flex text-sm my-2 font-Manrope font-normal w-[80%] tracking-wide">
                <p>
                  <a
                    href="#"
                    className="font-Manrope text-[#00a99b] underline "
                  >
                    Learn More{" "}
                  </a>{" "}
                  about adding guest users from outside graffitecs.com
                </p>
              </div>
              <p className="pr-3 pt-4 font-Manrope font-normal text-[14px]">
                Dismiss
              </p>
            </div>
            <Divider
              sx={{
                marginTop: "12px",
                marginBottom: "12px",
              }}
            /> */}
            {/* <div>
              <h6 className="font-Manrope font-bold text-base mb-2">
                General Access
              </h6>
            </div>
            <div className="flex justify-between">
              <div className="flex">
                <div className="border h-7 w-7 mr-3 mt-3 rounded-3xl bg-gray-200">
                  <PublicOutlinedIcon
                    sx={{
                      fontSize: "16px",
                      margin: "5px 5px",
                      fill: "gray",
                    }}
                  />
                </div>
                <div className="font-Manrope text-xs font-medium mt-2">
                  <p className="font-semibold text-sm">Public</p>
                  <p>Public links are turned off for your workspace</p>
                </div>
              </div>
              <p className="pr-3 pt-3 font-Manrope font-normal text-[14px]">
                No access
              </p>
            </div>
            <Divider
              sx={{
                marginTop: "12px",
                marginBottom: "12px",
              }}
            /> */}
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
                      placeholder="eg,Admin"
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
                    loadOptions={usersList}
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
            <div className="mt-3 cursor-pointer">
              <p className="font-Manrope font-semibold text-base">
                Access to all notes
              </p>
              <div className="flex justify-between ">
                <div className="flex mt-2 space-x-2">
                  <Avatar
                    sx={{
                      width: "24px",
                      height: "24px",
                    }}
                  />
                  <div className="">
                    <p>Zarmeen Iqbal</p>
                  </div>
                </div>
                <div className="border bg-gray-200 px-1 rounded-md flex ">
                  <p className="font-medium pl-2 pt-[2px]">Can edit</p>{" "}
                  <ArrowDropDownOutlinedIcon
                    sx={{
                      marginTop: "3px",
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-between mt-2">
                <div className="flex mt-2 space-x-2">
                  <Avatar
                    sx={{
                      width: "24px",
                      height: "24px",
                    }}
                  />
                  <div className="">
                    <p>Zarmeen Iqbal</p>
                  </div>
                </div>
                <div className="flex space-x-1 mr-2">
                  <p className="font-medium pl-2 pt-[2px]">Can edit</p>{" "}
                  <LockOutlinedIcon
                    sx={{
                      fontSize: "16px",
                      marginTop: "7px",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <input type="submit" className="hidden" />
        </form>
      </DialogContent>
      <DialogActions className="border-t bg-[#fafbfd] cursor-pointer">
        <div className="flex justify-end my-5 items-center mr-4 space-x-2">
          <WhiteButton
            style={{ width: "60px" }}
            buttonText="Cancel"
            onClick={closeModal}
          />
          <GreenButton
            style={{ width: "140px" }}
            disabled={isLoading}
            loading={isLoading}
            buttonText="Create"
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
