import { ErrorMessage } from "@hookform/error-message";
import { Box, Grid } from "@mui/material";
import GreenButton from "hooks/Common/commonButtons/GreenButton";
import WhiteButton from "hooks/Common/commonButtons/WhiteButton";
import { Controller, useForm } from "react-hook-form";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useDuplicateProject } from "hooks/Portfolio";
import { useDisplaySuccess } from "hooks/useDisplaySuccess";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { links } from "static/links";


function DuplicateProject() {
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({});

  const display = useDisplaySuccess();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation()
  const activeProjectId = location.pathname.split("/").pop();
  const id = localStorage.getItem("workspaceId");


  const onSuccess = (data) => {
    if (data.data) {
      reset({ name: "" });
      display(data.message);
      navigate(`${links.portfolio}/${id}`);
      dispatch(closePortfolio());
    }
  };

  const duplicateProject = useDuplicateProject({
    activeProjectId: activeProjectId,
    onSuccess,
  });

  const onSubmit = (data) => {
    duplicateProject.mutate({ data: {} });
  };
  return (
    <div className="bg-[#fafbfd]">
      <div className="pt-[4rem] pb-[2rem] bg-white shadow-md  relative">
        <div className="close-btn absolute right-6 top-5 border border-gray text-sm p-3 cursor-pointer rounded-md shadow-sm">
          <span className="icon-only btn-close-large">
            <svg
              className="icon"
              width="1em"
              height="1em"
              viewBox="0 0 36 36"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g
                id="Style-guide"
                stroke="none"
                stroke-width="1"
                fill="none"
                fill-rule="evenodd"
              >
                <g
                  id="nifty-UI-guide"
                  transform="translate(-617.000000, -3111.000000)"
                  fill="currentColor"
                  fill-rule="nonzero"
                >
                  <g
                    id="Group-6-Copy-3"
                    transform="translate(574.000000, 3068.000000)"
                  >
                    <path
                      d="M78.3409625,46.841018 C79.2196575,45.9623537 79.2196823,44.5377325 78.341018,43.6590375 C77.4623537,42.7803425 76.0377325,42.7803177 75.1590375,43.658982 L61,57.8175257 L46.8409625,43.658982 C45.9622675,42.7803177 44.5376463,42.7803425 43.658982,43.6590375 C42.7803177,44.5377325 42.7803425,45.9623537 43.6590375,46.841018 L57.817964,60.9994507 L43.6590375,75.1578834 C42.7803425,76.0365477 42.7803177,77.4611689 43.658982,78.3398639 C44.5376463,79.2185589 45.9622675,79.2185837 46.8409625,78.3399194 L61,64.1813757 L75.1590375,78.3399194 C76.0377325,79.2185837 77.4623537,79.2185589 78.341018,78.3398639 C79.2196823,77.4611689 79.2196575,76.0365477 78.3409625,75.1578834 L64.182036,60.9994507 L78.3409625,46.841018 Z"
                      id="Combined-Shape"
                    ></path>
                  </g>
                </g>
              </g>
            </svg>
          </span>
        </div>
        <Box className="">
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{ maxWidth: "700px" }}
            margin="auto"
            spacing={1}
          >
            <Grid item xs={12} lg={12} md={12}>
              <div className="relative py-3 border-b border-gray-300">
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => {
                    return (
                      <input
                        {...field}
                        className=" w-full text-[24px]  focus:outline-none"
                        placeholder="Enter Project Name ...."
                      />
                    );
                  }}
                />
                <ErrorMessage
                  errors={errors}
                  name="name"
                  render={({ message }) => (
                    <p className="text-red-500 text-[12px]">{message}</p>
                  )}
                />
              </div>
            </Grid>
          </Grid>
        </Box>
      </div>
      <div className="shadow-md pt-2 mt-10 pb-10">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          sx={{ maxWidth: "700px" }}
          margin="auto"
          spacing={1}
        >
          <Grid item xs={12} lg={12} md={12}>
            <p>DUPLICATE</p>
          </Grid>
          <Grid item xs={12} lg={12} md={12}>
            <p className="mb-10">
              Instead of starting a project from scratch you can choose to
              duplicate different parts of Demo Project. All checklists,
              deadlines, assignees, dependencies, and other info will be copied
              too.
            </p>
          </Grid>
          <Grid item xs={6} lg={6} md={6}>
            <div className="border-[#00c7bb] border border-solid  rounded-md text-[#009084] p-[8px] flex gap-3 ">
              <CheckCircleOutlineIcon className="text-[#009084]" />
              <p className="text-[#009084]">Project Modules</p>
            </div>
          </Grid>
          <Grid item xs={6} lg={6} md={6}>
            <div className="border-[#00c7bb] border border-solid  rounded-md text-[#009084] p-[8px] flex gap-3 ">
              <CheckCircleOutlineIcon className="text-[#009084]" />
              <p className="text-[#009084]">Project Modules</p>
            </div>
          </Grid>
          <Grid item xs={6} lg={6} md={6}>
            <div className="border-[#00c7bb] border border-solid  rounded-md text-[#009084] p-[8px] flex gap-3 ">
              <CheckCircleOutlineIcon className="text-[#009084]" />
              <p className="text-[#009084]">Project Modules</p>
            </div>
          </Grid>
          <Grid item xs={6} lg={6} md={6}>
            <div className="border-[#00c7bb] border border-solid  rounded-md text-[#009084] p-[8px] flex gap-3 ">
              <CheckCircleOutlineIcon className="text-[#009084]" />
              <p className="text-[#009084]">Project Modules</p>
            </div>
          </Grid>
        </Grid>
      </div>

      <div className=" bg-[#FAFBFD] w-full sticky bottom-0  border-t border-gray-300">
        <div className="flex space-x-3 items-center justify-center pt-[25px] pb-[70px]">
          <WhiteButton
            buttonText="Cancel"
            onClick={() => 
      navigate(`${links.portfolio}/${id}`)
            
            }
          />
          <GreenButton
            buttonText="Create Project"
            role="button"
              onClick={handleSubmit(onSubmit)}
          />
        </div>
      </div>
    </div>
  );
}

export default DuplicateProject;
