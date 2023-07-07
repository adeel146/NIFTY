import React, { Fragment } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import GreenButton from "hooks/Common/commonButtons/GreenButton";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { changeRequestDialogClose, listTypeRequest } from "redux/actions";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "notistack";
import moment from "moment";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import CloseIcon from "@mui/icons-material/Close";
import { Divider } from "@mui/material";
import WhiteButton from "hooks/Common/commonButtons/WhiteButton";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
const ChangeRequestHistoryDialog = () => {
    const open = useSelector((state) => state?.projectTaskSlice?.changeRequestDialogState);
  const { projectId } = useParams();
  const auth = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();
  const checkType = useSelector((state) => state?.projectTaskSlice?.listType);
  const navigate = useNavigate();
  const {
    data: changeRequestList,
    isLoading,
    refetch,
  } = useQuery(
    ["get_request_list", projectId],
    () => {
      return axios.get(`/change_request/${projectId}`);
    },
    {
      enabled: !!projectId,
      select: (res) => {
        return res?.data?.data;
      },
    }
  );

  const { data: projectDetailsListing } = useQuery(
    ["project_detailss_listing", projectId],
    () => {
      return axios.get(`/project/${projectId}`);
    },
    {
      enabled: !!projectId,
      select: (res) => {
        return res?.data?.data;
      },
    }
  );

  const { mutate: activeRequest, isLoading: editLoading } = useMutation({
    mutationKey: ["activate_request"],
    mutationFn: (id) => axios.put(`/change_request/start_request/${id}`),
    onSuccess: (data) => {
      if (data?.data?.success) {
        enqueueSnackbar(data.data.message, { variant: "success" });
        queryClient.invalidateQueries(["get_request_list"]);
        queryClient.invalidateQueries(["project_detailss_listing"]);
      }
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
  });

  const periorityEnum = [
    { name: "Critical", value: 1 },
    { name: "High", value: 2 },
    { name: "Normal", value: 3 },
    { name: "Low", value: 4 },
  ];

  if (isLoading)
    return (
      <div className="mt-[5rem]">
        <SkeletonTheme baseColor="#E5E5E5" highlightColor="#9399AB">
          <Skeleton count={8} className="h-[200px]" />
        </SkeletonTheme>
      </div>
    );

    const closeModal = () => {
       dispatch(changeRequestDialogClose());
    };
    

  return (
    <Dialog
      maxWidth="md"
      open={open}
      onClose={closeModal}
      TransitionComponent={Transition}
    >
              <DialogTitle className="bg-[#fafbfd] w-full">
        <div className=" flex justify-between">
          <h1 className="font-Manrope font-extrabold text-black text-2xl">
            Change Request History
          </h1>
          <div className="space-x-3">
            <CloseIcon
              sx={{
                width: "33px",
                height: "33px",
                fill: "gray",
                fontSize: "18px",
                padding: "3px 3px",
              }}
              className="border bg-white hover:bg-[#f98a3f] hover:fill-white rounded-md cursor-pointer "
              onClick={() => dispatch(changeRequestDialogClose())}
            />
          </div>
        </div>
      </DialogTitle>
      <Divider />
      <DialogContent>
      <div className="">
      {changeRequestList?.length > 0 ? (
        <div className="mt-10 pb-[3rem] ">
          {changeRequestList?.map((val) => {
            const randomColor = Math?.floor(
              Math?.random() * 32423430
            )?.toString(16);
            const periority = periorityEnum?.find((item) => {
              return item?.value == val?.priority;
            });
            return (
              <div className="px-[24px] pt-2 pb-2" key={val?.id}>
                {isLoading ? (
                  <SkeletonTheme baseColor="gray" highlightColor="#9399AB">
                    <Skeleton count={10} className="h-[120px]" />
                  </SkeletonTheme>
                ) : (
                  <div
                    className={`post_box_white bg-white px-7 py-7 cursor-pointer rounded-lg relative before:absolute before:-left-[1px] before:top-[0px] before:rounded-l-lg  before:w-[3px] before:h-[100%] before:border-l-[#${randomColor}] before:border-l-4  shadow-sm border border-[#eee]`}
                  >
                    <ul
                      className="w-full list-none flex flex-wrap"
                    >
                      <li className="w-[33%] mb-3 pb-3 border border-b-[#eee] border-t-0 border-l-0 border-r-0">
                        <div className="flex">
                          <h4 className="font-bold text-[16px] mb-0 font-Manrope text-[#2f2f2f] mr-3">
                            CR 
                          </h4>
                          <p className="text-[15px] mb-0 font-Manrope text-[#2f2f2f] font-normal">
                            {val?.id}
                          </p>
                        </div>
                      </li>
                      <li className="w-[33%] mb-3 pb-3 border border-b-[#eee] border-t-0 border-l-0 border-r-0">
                        <div className="flex">
                          <h4 className="font-bold text-[16px] mb-0 font-Manrope text-[#2f2f2f] mr-3">
                            Cost
                          </h4>
                          <p className="text-[15px] mb-0 font-Manrope text-[#2f2f2f] font-normal">
                            {val?.cost}
                          </p>
                        </div>
                      </li>
                      <li className="w-[33%] mb-3 pb-3 border border-b-[#eee] border-t-0 border-l-0 border-r-0">
                        <div className="flex">
                          <h4 className="font-bold text-[16px] mb-0 font-Manrope text-[#2f2f2f] mr-3">
                            Description
                          </h4>
                          <p className="text-[15px] mb-0 font-Manrope text-[#2f2f2f] font-normal">
                            {val?.description}
                          </p>
                        </div>
                      </li>
                      <li className="w-[33%]">
                        <div className="flex">
                          <h4 className="font-bold text-[16px] mb-0 font-Manrope text-[#2f2f2f] mr-3">
                            Created By
                          </h4>
                          <p className="text-[15px] mb-0 font-Manrope text-[#2f2f2f] font-normal">
                            {auth?.user?.name}
                          </p>
                        </div>
                      </li>

                      <li className="w-[33%]">
                        <div className="flex">
                          <h4 className="font-bold text-[16px] mb-0 font-Manrope text-[#2f2f2f] mr-3">
                            Periority
                          </h4>
                          <p className="text-[15px] mb-0 font-Manrope text-[#2f2f2f] font-normal">
                            {periority?.name}
                          </p>
                        </div>
                      </li>
                      <li className="w-[33%]">
                        <div className="flex">
                          <h4 className="font-bold text-[16px] mb-0 font-Manrope text-[#2f2f2f] mr-3">
                            Benefits
                          </h4>
                          <p className="text-[15px] mb-0 font-Manrope text-[#2f2f2f] font-normal">
                            {val.benefits}
                          </p>
                        </div>
                      </li>
                      <li className="w-[33%]">
                        <div className="flex mt-5">
                          <h4 className="font-bold text-[16px] mb-0 font-Manrope text-[#2f2f2f] mr-3">
                            Project Name
                          </h4>
                          <p className="text-[15px] mb-0 font-Manrope text-[#2f2f2f] font-normal">
                            {projectDetailsListing?.name}
                          </p>
                        </div>
                      </li>
                      <li className="w-[33%]">
                        <div className="flex mt-5">
                          <h4 className="font-bold  text-[16px] mb-0 font-Manrope text-[#2f2f2f] mr-3">
                            Portfolio Name
                          </h4>
                          <p className="text-[15px] mb-0 font-Manrope text-[#2f2f2f] font-normal">
                            {projectDetailsListing?.portfolioName}
                          </p>
                        </div>
                      </li>
                      <li className="w-[33%] ">
                        <div className="flex mt-5">
                          <h4 className="font-bold text-[16px] mb-0 font-Manrope text-[#2f2f2f] mr-3">
                            Created At
                          </h4>
                          <p className="text-[15px] mb-0 font-Manrope text-[#2f2f2f] font-normal">
                            {moment(val?.createdAt).format("L")}
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <h1>No Data Found</h1>
        </div>
      )}
    </div>
      </DialogContent>
      <DialogActions className="border-t bg-[#fafbfd]">
        <div className="flex justify-end my-5 items-center mr-4 space-x-2">
          <WhiteButton
            style={{ width: "60px" }}
            buttonText="Close"
            onClick={() => dispatch(changeRequestDialogClose())}
          />
          {/* <GreenButton
            style={{ width: "140px" }}
            disabled={isLoading}
            loading={isLoading}
            buttonText="Save"
            type="submit"
            onClick={
              watch("custom") ? handleSubmitCustomUser : handleSubmit(onSubmit)
            }
          /> */}
        </div>
      </DialogActions>
    </Dialog>
   
  );
};

export default ChangeRequestHistoryDialog;
