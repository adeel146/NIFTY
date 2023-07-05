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
import { useDisplaySuccess } from "hooks/useDisplaySuccess";
import axios from "axios";
import CustomLoader from "hooks/Common/CustomLoader";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import HookDateTimePicker from "hooks/Common/HookDateTimePicker";
import { ErrorMessage } from "@hookform/error-message";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";
import * as yup from "yup";
import { RolesEnum } from "./RightSide/SingleRow";
import moment from "moment";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddMeetingModal(props) {
  const { isOpen, handleClose } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [customUser, setCustomUser] = React.useState(false);
  const [customUsers, setCustomUsers] = React.useState([]);
  const queryClient = useQueryClient();
  const meetingsSchema = yup.object({
    meetingName: yup.string().required("Name is Required"),
    when: yup.string().required("Date is Required"),
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
    setValue,
    watch,
    register,
  } = useForm({
    mode: "onChange",
    defaultValues: { custom: false },
    resolver: yupResolver(meetingsSchema),
  });

  const classes = useStyles();
  const { projectId } = useParams();
  const initalState = {
    members: null,
    name: "",
    email: "",
    when: "",
    meetingName: "",
  };
  const closeModal = () => {
    reset(initalState);
    setCustomUsers([]);
    setCustomUser(false);
    handleClose();
  };
  const workspaceId = localStorage.getItem("workspaceId");

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

  const { mutate, isLoading } = useMutation({
    mutationKey: ["addMeeting"],
    mutationFn: (data) => axios.post("/meeting", data),
    onSuccess: (data) => {
      enqueueSnackbar(data.data.message, { variant: "success" });
      queryClient.invalidateQueries(["getmeetings"]);
      closeModal();
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  const onSubmit = (data) => {
    const users =
      data.members.map((member) => {
        return {
          name: member.name,
          email: member.email,
          role: RolesEnum.find((obj) => obj.value === "member.role") || "",
        };
      }) || [];
    const payload = {
      name: data.meetingName,
      when: data.when,
      project_Id: +projectId,
      users,
    };
    mutate(payload);
  };

  const handleSubmitCustomUser = () => {
    const payload = {
      name: watch("meetingName"),
      when: watch("when"),
      project_Id: +projectId,
      users: customUsers,
    };
    mutate(payload);
  };

  const handleAddCustomUser = (data) => {
    let user = { name: data.name, email: data.email, role: data.role };
    setCustomUsers((prev) => [...prev, user]);
    setValue("name", "");
    setValue("email", "");
    setValue("role", "");
  };
  const handleDeleteCustomUser = (index) => {
    let copyCustomUser = [...customUsers];
    copyCustomUser.splice(index, 1);
    setCustomUsers(copyCustomUser);
  };
  return (
    <div>
      <Dialog
        keepMounted
        maxWidth="sm"
        open={isOpen}
        onClose={closeModal}
        TransitionComponent={Transition}
      >
        <CustomLoader isLoading={[isLoading].includes(true)} />
        <DialogTitle className="bg-[#fafbfd] w-full">
          <div className="flex justify-between">
            <h1 className="font-Manrope font-bold text-black text-2xl">
              Create a new Meeting
            </h1>
            <div onClick={closeModal} className="space-x-3">
              <CloseIcon
                sx={{
                  width: "40px",
                  height: "40px",
                  fill: "gray",
                  fontSize: "18px",
                  padding: "3px 3px",
                }}
                className="cursor-pointer border border-[#e8e8e8] bg-[#fff] shadow-[0 3px 5px 0 rgba(0,0,0,.05)] px-[6px] py-[2px] rounded-md hover:bg-[#f98a3f] hover:fill-white"
              />
            </div>
          </div>
        </DialogTitle>
        <Divider />
        <DialogContent className={classes.dialogPaper}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <div>
                <h6 className="font-Manrope font-bold text-base mb-2">
                  Add Portfolio Members
                </h6>
              </div>
              <div className="border-gray-500 placeholder:font-Manrope placeholder:text-sm">
                <HookTextField
                  name="meetingName"
                  errors={errors}
                  control={control}
                  required={false}
                  placeholder="Name this Meeting ..."
                  style={{ height: "38px" }}
                />
              </div>
              <div>
                <h6 className="font-Manrope font-bold text-base mb-1">
                  Start Date
                </h6>
                <HookTextField
                  defaultValue={moment().format("YYYY-MM-DDTHH:mm")}
                  min={new Date().toISOString().slice(0, 16)}
                  name="when"
                  errors={errors}
                  control={control}
                  required={false}
                  placeholder="Name this Meeting ..."
                  style={{ height: "38px" }}
                  type="datetime-local"
                />
              </div>
              <div className="mt-4">
                <div className="flex flex-col">
                  <h6 className="font-Manrope font-bold text-base mb-1">
                    Add teammates
                  </h6>
                  <div className="flex justify-between">
                    <p className="font-Manrope font-semibold text-sm">
                      Access to notes
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
                      <label className="font-semibold text-[15px] mb-1 font-Manrope">
                        Name
                      </label>
                      <input
                        {...register("name")}
                        value={watch("name")}
                        onChange={(event) =>
                          setValue("name", event.target.value)
                        }
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
                        placeholder="ed,Admin"
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
                  <div className="mt-4 w-[480px] cursor-pointer">
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
                watch("custom")
                  ? handleSubmitCustomUser
                  : handleSubmit(onSubmit)
              }
            />
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    overflowY: "unset !important",
    width: "600px",
  },
}));
