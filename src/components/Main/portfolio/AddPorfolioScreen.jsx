import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import PortfolioBlankProjct from "./PortfolioBlankProjct";
import PortfolioSavedTemplates from "./PortfolioSavedTemplates";
import PortfolioImport from "./PortfolioImport";
import PortfolioNiftyTemplates from "./PortfolioNiftyTemplates";
import HookRadioBox from "hooks/Common/HookRadioBox";
import { Controller, useForm } from "react-hook-form";
import GreenButton from "hooks/Common/commonButtons/GreenButton";
import WhiteButton from "hooks/Common/commonButtons/WhiteButton";
import { showConfigure } from "redux/reducers/portfolio";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import ConfigurePortfolio from "./ConfigurePortfolio";
import { useAppGetWorkSpacePortfolios } from "hooks/Portfolio";
import { useAddProject } from "hooks/Portfolio";
import { useDisplaySuccess } from "hooks/useDisplaySuccess";
import Fade from "react-reveal/Fade";
import { ErrorMessage } from "@hookform/error-message";
import { useDisplayError } from "hooks/useDisplayError";
import { yupResolver } from "@hookform/resolvers/yup";
import { addProjectSchema } from "validations/portfolio";
import { useNavigate } from "react-router-dom";
import { links } from "static/links";
import HookTextField from "hooks/Common/HookTextField";
import HookSelectField from "hooks/Common/HookSelectField";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import axios from "axios";
import { Popper } from "@mui/base";
import { Paper } from "@mui/material";
import Select from "react-select";
import { marginLeft, width } from "@xstyled/styled-components";
import { Divider } from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams } from "react-router-dom";
import HookFreeSelect from "hooks/Common/HookFreeSelect";

const AddPorfolioScreen = () => {
  const navigate = useNavigate();
  // const [value, setValue] = useState("BLANK PROJECT");
  const [portfolio, setPortfolio] = useState(null);
  const [taskView, setTaskView] = useState("1");
  const [toggleViewOptions, setToggleViewOptions] = useState(false);
  const [portfolioAnchorEl, setPortfolioAnchorEl] = useState(null);
  const [setNameVal, setSetNameVal] = useState("");
  const [owner, setOwner] = useState();
  const [CRList, setCRList] = useState([]);
  const { portfolioId } = useParams();

  console.log(taskView, "viewww ");

  const queryClient = useQueryClient();

  const [nameError, setnameError] = useState(false);
  const [ownerErr, setownerErr] = useState(false);

  const [questions, setSelectedQuestions] = useState([
    { id: "dashboard", question: "Do you need Dashboard?", isChecked: false },
    { id: "roadmap", question: "Do you need Roadmap?", isChecked: false },
    { id: "tasks", question: "Do you need Tasks?", isChecked: false },
    { id: "calender", question: "Do you need Calendar?", isChecked: false },
    {
      id: "discussion",
      question: "Do you need Discussions?",
      isChecked: false,
    },
    { id: "docs", question: "Do you need Docs?", isChecked: false },
    { id: "files", question: "Do you need Files?", isChecked: false },
  ]);
  const dispatch = useDispatch();
  const display = useDisplaySuccess();
  const configure = useSelector(
    (state) => state?.portfolioSlice?.showConfigure
  );
  const { activeWorkspace } = useSelector(({ workspace }) => workspace);
  const workspaceId = localStorage.getItem("workspaceId");

  const { projectId } = useParams();

  const {
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(addProjectSchema),
  });

  console.log(watch("expectedBenefits"), "expectedBenefits");

  const { data: usersList } = useQuery({
    queryKey: "workspace/workspace_members",
    queryFn: () => axios.get(`workspace/workspace_members/${workspaceId}`),
    select: (res) => {
      return res?.data?.data.map((val) => {
        return {
          value: val?.user_Id,
          label: val?.name,
        };
      });
    },
    onError: (data) => {
      enqueueSnackbar(data.response.data.message, { variant: "error" });
    },
    refetchOnWindowFocus: false,
  });

  const defaultMilestoneViews = [
    { value: "Week", label: "Week" },
    { value: "Month", label: "Month" },
    { value: "Year", label: "Year" },
  ];

  const { data: portfolioProjectDetail } = useQuery(
    ["get_portfolio_single", projectId],
    () => {
      return axios.get(`/project/${projectId}`);
    },
    {
      enabled: !!projectId,
      onSuccess: (res) => {
        if (res.data.success) {
          console.log(res?.data?.data, "ressss");
          reset(res?.data?.data);
          setCRList(res?.data?.data?.requestSteps);
          // setTaskView(3)
          setValue(
            "expectedBenefits",
            res?.data?.data?.projectCharter?.expectedBenefits,
            {
              shouldValidate: true,
              shouldDirty: true,
            }
          );
          const sponserList = usersList?.find((val) => {
            if (val?.value == res?.data?.data?.sponser_Id) {
              return val;
            }
          });
          const managerList = usersList?.find((val) => {
            if (val?.value == res?.data?.data?.manager_Id) {
              return val;
            }
          });
          const championList = usersList?.find((val) => {
            if (val?.value == res?.data?.data?.champion_Id) {
              return val;
            }
          });
          const defaultMilestoneView = defaultMilestoneViews?.find((val) => {
            if (val?.value == res?.data?.data?.milestoneView) {
              return val;
            }
          });

          setValue("sponser_Id", sponserList);
          setValue("manager_Id", managerList);
          setValue("champion_Id", championList);
          setValue("milestoneView", defaultMilestoneView);
          setValue("startDate", res?.data?.data?.startDate?.split("T")[0]);
          setValue("endDate", res?.data?.data?.endDate?.split("T")[0]);
          // setValue("initialBudget", res.data.d);
          setValue(
            "problemStatement",
            res?.data?.data?.projectCharter?.problemStatement,
            {
              shouldValidate: true,
              shouldDirty: true,
            }
          );
          setValue(
            "projectObjectives",
            res?.data?.data?.projectCharter?.projectObjectives,
            {
              shouldValidate: true,
              shouldDirty: true,
            }
          );
          setValue(
            "projectOverview",
            res?.data?.data?.projectCharter?.projectOverview
          );
          setValue(
            "scopeDetails",
            res?.data?.data?.projectCharter?.scopeDetails
          );
        }
      },
    }
  );

  // const { data: singlePortfolio } = useQuery(
  //   ["get_portfolio_single", workspaceId],
  //   () => {
  //     return axios.get(`/portfolio/projects/${workspaceId}`);
  //   },
  //   {
  //     enabled: !!workspaceId,
  //     select: (res) => {
  //       return res?.data?.data;
  //     },
  //   }
  // );

  // const portfolioSet = singlePortfolio?.find((val) => {
  //   if (val?.id == portfolioId) {
  //     return val;
  //   }
  // });

  // useEffect(() => {
  //   if (portfolioSet) {
  //     console.log(portfolioSet, "portfolioSet");
  //     setPortfolio({ label: portfolioSet?.name, value: portfolioSet?.id });
  //   }
  // }, [portfolioSet]);

  const onGetworkspacePortfoliosSuccess = (data) => {
    if (data.data?.data.length) {
      setPortfolio({
        value: data?.data?.data[0].id,
        label: data?.data?.data[0].name,
      });
    }
  };
  const { workspacePortfolios } = useAppGetWorkSpacePortfolios({
    id: activeWorkspace?.id,
    onSuccess: onGetworkspacePortfoliosSuccess,
  });
  const workspacePortfoliosOptions = workspacePortfolios?.map((el) => {
    return {
      value: el.id,
      label: el.name,
    };
  });

  console.log(workspacePortfoliosOptions, "workspacePortfoliosOptions");
  const onSuccess = (data) => {
    navigate(`/dashboard/${data.data.id}`);
    display(data.message);
    queryClient.invalidateQueries(["get_portfolio_project"]);
  };

  const addProject = useAddProject({
    onSuccess,
  });
  const error = addProject.error;
  const loading = addProject.isLoading;
  useDisplayError(error);

  const onSubmit = (data) => {
    const sponser_Id = data?.sponser_Id?.value || null;
    const manager_Id = data?.manager_Id?.value || null;
    const champion_Id = data?.champion_Id?.value || null;
    const milestoneView = data?.milestoneView?.value || null;
    const stakeHolders = data?.stakeHolders?.map((obj) => obj.value) || [];
    const requestSteps =
      CRList.map((cr, index) => {
        return {
          user_Id: cr.user.value,
          name: cr.name,
          orderIndex: index,
        };
      }) || [];
    let payload = {
      ...data,
      name: data.name,
      portfolio_Id: +portfolio.value,
      public: data.type_value === "Public",
      defaultView: +taskView,
      sponser_Id,
      manager_Id,
      champion_Id,
      milestoneView,
      stakeHolders,
      currentBudget: data.initialBudget,
      requestSteps,
    };
    questions.map((el) => {
      payload[el.id] = el.isChecked;
    });
    addProject.mutate({ data: payload });
  };
  const handlePortfolioSelect = (e) => {
    if (portfolioAnchorEl) {
      return setPortfolioAnchorEl(null);
    }
    setPortfolioAnchorEl(e.currentTarget);
  };
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#02bbab" : "white", // Set the background color for selected options
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "white" : "black", // Set the text color for selected options
    }),
  };

  const handleAddCR = () => {
    if (!setNameVal) return setnameError(true);
    if (!owner) return setownerErr(true);
    let payload = {
      name: setNameVal,
      user: owner,
    };
    setCRList((prev) => [...prev, payload]);
    setSetNameVal("");
    setOwner(null);
  };

  const handleDeleteCR = (index) => {
    let crCopy = [...CRList];
    crCopy.splice(index, 1);
    setCRList(crCopy);
  };

  return (
    <div className="bg-[#fafbfd] mb-10">
      <div className="pt-[4rem] pb-[2rem] bg-white shadow-md  relative">
        <div
          onClick={() => navigate(-1)}
          className="close-btn absolute right-6 top-5 border border-gray text-sm p-3 cursor-pointer rounded-md shadow-sm"
        >
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
                strokeWidth="1"
                fill="none"
                fillRule="evenodd"
              >
                <g
                  id="nifty-UI-guide"
                  transform="translate(-617.000000, -3111.000000)"
                  fill="currentColor"
                  fillRule="nonzero"
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
        <Box className="h-full">
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
                <div className="absolute top-[19px] right-0">
                  <button
                    className="flex items-center"
                    onClick={(e) => {
                      handlePortfolioSelect(e);
                    }}
                  >
                    {portfolio
                      ? `Current Selected ${portfolio.label}`
                      : "Select"}
                    <span className="arrow font-bold text-sm ml-2 relative top-1 ">
                      <svg
                        className="text-[12px] inline-flex "
                        width="1.0277777777777777em"
                        height="0.6111111111111112em"
                        viewBox="0 0 37 22"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g
                          id="Style-guide"
                          stroke="none"
                          strokeWidth={1}
                          fill="none"
                          fillRule="evenodd"
                        >
                          <g
                            id="nifty-UI-guide"
                            transform="translate(-617.000000, -2934.000000)"
                            fill="currentColor"
                            fillRule="nonzero"
                          >
                            <g
                              id="Group-6-Copy-3"
                              transform="translate(574.000000, 2884.000000)"
                            >
                              <path
                                d="M70.5909903,46.8409903 C71.4696699,45.9623106 71.4696699,44.5376894 70.5909903,43.6590097 C69.7123106,42.7803301 68.2876894,42.7803301 67.4090097,43.6590097 L51.6590097,59.4090097 C50.7803301,60.2876894 50.7803301,61.7123106 51.6590097,62.5909903 L67.4090097,78.3409903 C68.2876894,79.2196699 69.7123106,79.2196699 70.5909903,78.3409903 C71.4696699,77.4623106 71.4696699,76.0376894 70.5909903,75.1590097 L56.4319805,61 L70.5909903,46.8409903 Z"
                                id="Path-82"
                                transform="translate(61.125000, 61.000000) rotate(-90.000000) translate(-61.125000, -61.000000) "
                              ></path>
                            </g>
                          </g>
                        </g>
                      </svg>
                    </span>
                  </button>
                  <Popper
                    open={Boolean(portfolioAnchorEl)}
                    anchorEl={portfolioAnchorEl}
                    placement="bottom"
                  >
                    <Paper>
                      <div className="flex items-center  justify-center  ">
                        <Select
                          options={workspacePortfoliosOptions}
                          name="portfolio"
                          onChange={(value) => {
                            setPortfolio(value);
                            setPortfolioAnchorEl(null);
                          }}
                          value={portfolio}
                          isSearchable
                          placeholder="Search portfolios"
                          className="react-select"
                          defaultMenuIsOpen
                          styles={customStyles} // Apply the custom styles to the react-select component
                        />
                      </div>
                    </Paper>
                  </Popper>
                </div>
              </div>
              <div className="flex justify-between w-full mt-[19px]">
                <div className="flex flex-col w-[70%]">
                  <label className="font-medium text-[15px] mb-1">
                    Project Policy
                  </label>
                  <div>
                    <HookRadioBox
                      name="type_value"
                      control={control}
                      options={options(workspacePortfolios, portfolio)}
                      errors={errors}
                    />
                  </div>
                </div>
                <div className="flex flex-col w-[30%]">
                  <div className="flex space-x-3 items-center">
                    <label className="font-medium text-[15px] mb-1">
                      Default task view{" "}
                      <HelpOutlineIcon
                        sx={{
                          fontSize: "17px",
                          color: "black",
                          marginLeft: "5px",
                        }}
                      />
                    </label>
                  </div>
                  {/* /// start custom menu /// */}
                  <div className="group relative">
                    <button
                      onClick={() => setToggleViewOptions(!toggleViewOptions)}
                      className="flex justify-between w-full border border-[#e8e8e9] px-2 py-[6px] rounded-md"
                    >
                      <div className="flex items-center">
                        <span className="text-base relative text-center w-10 flex-[0_0_auto] -top-[1px] ">
                          {
                            defaultViews?.filter(
                              (el) => el?.value === taskView
                            )[0]?.svg
                          }
                        </span>
                        {
                          defaultViews?.filter((el) => el.value === taskView)[0]
                            ?.label
                        }
                      </div>
                      <span className="arrow font-bold text-sm ml-2 ">
                        <svg
                          className="text-[12px] inline-flex "
                          width="1.0277777777777777em"
                          height="0.6111111111111112em"
                          viewBox="0 0 37 22"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g
                            id="Style-guide"
                            stroke="none"
                            strokeWidth="1"
                            fill="none"
                            fillRule="evenodd"
                          >
                            <g
                              id="nifty-UI-guide"
                              transform="translate(-617.000000, -2934.000000)"
                              fill="currentColor"
                              fillRule="nonzero"
                            >
                              <g
                                id="Group-6-Copy-3"
                                transform="translate(574.000000, 2884.000000)"
                              >
                                <path
                                  d="M70.5909903,46.8409903 C71.4696699,45.9623106 71.4696699,44.5376894 70.5909903,43.6590097 C69.7123106,42.7803301 68.2876894,42.7803301 67.4090097,43.6590097 L51.6590097,59.4090097 C50.7803301,60.2876894 50.7803301,61.7123106 51.6590097,62.5909903 L67.4090097,78.3409903 C68.2876894,79.2196699 69.7123106,79.2196699 70.5909903,78.3409903 C71.4696699,77.4623106 71.4696699,76.0376894 70.5909903,75.1590097 L56.4319805,61 L70.5909903,46.8409903 Z"
                                  id="Path-82"
                                  transform="translate(61.125000, 61.000000) rotate(-90.000000) translate(-61.125000, -61.000000) "
                                ></path>
                              </g>
                            </g>
                          </g>
                        </svg>
                      </span>
                    </button>
                    {toggleViewOptions && (
                      <div className=" bg-white  border border-[#e8e8e9] w-[210px] absolute left-0 top-[32px] transition-all   group-focus-within:opacity-100 group-focus-within:translate-y-1 block opacity-100 z-[999] shadow-lg rounded-md">
                        <ul className="screen_pop drop_down_custom">
                          <li>
                            <div className="w-full">
                              {defaultViews.map((el) => (
                                <button
                                  className={`${
                                    el.value === taskView ? "selected" : ""
                                  } w-full items-center border-[#ececec] border-b-[1px] cursor-pointer flex text-sm font-medium no-underline py-1 pr-1 pl-[2px] min-h-[36px] hover:bg-[#f4fbfa]`}
                                  onClick={(e) => {
                                    setTaskView(el.value);
                                    setToggleViewOptions(false);
                                  }}
                                >
                                  <span className="text-base relative text-center w-10 flex-[0_0_auto] -top-[1px] ">
                                    {el.svg}
                                  </span>

                                  <span className=" text-[#393939] ml-1 text-color">
                                    {el.label}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-between w-full mt-[19px]">
                <div className="flex space-x-1 ">
                  <div className="flex space-x-2">
                    <HookTextField
                      name="startDate"
                      errors={errors}
                      control={control}
                      labelText="Start Date"
                      type="date"
                      style={{ height: "36px" }}
                    />
                    <HookTextField
                      name="endDate"
                      errors={errors}
                      control={control}
                      labelText="End Date"
                      type="date"
                      style={{ height: "36px" }}
                    />
                  </div>
                </div>
                <div className="flex flex-col w-[30%]">
                  <HookSelectField
                    labelText="Default Milestone View"
                    name="milestoneView"
                    errors={errors}
                    control={control}
                    required={false}
                    placeholder="Search..."
                    loadOptions={defaultMilestoneViews}
                    isMulti={false}
                  />
                </div>
              </div>
            </Grid>
            <Grid item sm={12} md={4}>
              <HookSelectField
                labelText="Sponser"
                name="sponser_Id"
                errors={errors}
                control={control}
                required={false}
                placeholder="Search..."
                loadOptions={usersList}
              />
            </Grid>
            <Grid item sm={12} md={4}>
              <HookSelectField
                labelText="Manager"
                name="manager_Id"
                errors={errors}
                control={control}
                required={false}
                placeholder="Search..."
                loadOptions={usersList}
              />
            </Grid>
            <Grid item sm={12} md={4}>
              <HookSelectField
                labelText="Champion"
                name="champion_Id"
                errors={errors}
                control={control}
                required={false}
                placeholder="Search..."
                loadOptions={usersList}
              />
            </Grid>
            <Grid item sm={12} md={4}>
              <HookTextField
                name="initialBudget"
                errors={errors}
                control={control}
                labelText="Initial Budget"
                type="number"
                style={{ height: "36px" }}
              />
            </Grid>
            <Grid item sm={12} md={4}>
              <HookTextField
                name="initialBudget"
                errors={errors}
                control={control}
                labelText="current Budget"
                type="number"
                style={{ height: "36px", cursor: "not-allowed" }}
                disabled
              />
            </Grid>
            <Grid item sm={12} md={4}>
              <div className="mb-5">
                <HookSelectField
                  isMulti={true}
                  labelText="Stake Holders"
                  name="stakeHolders"
                  errors={errors}
                  control={control}
                  required={false}
                  placeholder="Search..."
                  loadOptions={usersList}
                />
              </div>
            </Grid>

            <Grid sm={12}>
              <Divider sx={{ height: "2px" }} />
              <h2 className="font-bold my-5 ">Project CR Approval Steps</h2>
            </Grid>
            <Grid className="mb-5" container spacing={2}>
              <Grid item sm={12} md={4}>
                <label className="font-Manrope font-semibold text-[#2f2f2f]">
                  Set Name
                </label>
                <input
                  value={setNameVal}
                  onChange={(e) => {
                    setnameError(false);
                    setSetNameVal(e.target.value);
                  }}
                  name="name"
                  type="text"
                  placeholder="Set Name"
                  className=" border mt-1 block focus:outline-[#00a99b] active:shadow-inner global-inputFiled rounded h-[40px]  border-gray-300 w-full px-3 py-2 bg-white text-black placeholder:text-[#8eaedf] shadow-inner"
                />
                {nameError && (
                  <p className="text-red-600 text-sm ">Name Required</p>
                )}
              </Grid>
              <Grid className="!mt-1" item sm={12} md={4}>
                <label className="font-Manrope font-semibold text-[#2f2f2f]">
                  Owner Name
                </label>

                <Select
                  value={owner}
                  onChange={(option) => {
                    setownerErr(false);
                    setOwner(option);
                  }}
                  options={usersList}
                />
                {ownerErr && (
                  <p className="text-red-600 text-sm ">Owner Required</p>
                )}
                {/* <HookFreeSelect
                  name="user_Id"
                  control={control}
                  options={usersList}
                  labelText="Owner Name"
                  errors={errors}
                  width="250px"
                  height="40px"
                /> */}
              </Grid>
              <Grid
                className="!mt-[30px] flex justify-end "
                item
                sm={12}
                md={4}
              >
                <GreenButton
                  buttonText="Save"
                  role="button"
                  onClick={handleAddCR}
                  disabled={loading}
                />
              </Grid>
            </Grid>

            <div className="w-full">
              <div className="overflow-auto lg:overflow-visible mb-5">
                <table className="table text-gray-400 border-separate text-sm text-left w-full">
                  <thead className="bg-gray-100 text-gray-500">
                    <tr>
                      <th className="p-3 text-[#2f2f2f] font-semibold">
                        SetName
                      </th>
                      <th className="p-3 text-[#2f2f2f] font-semibold">
                        SetOwner
                      </th>
                      <th className="p-3 text-[#2f2f2f] font-semibold">
                        Order
                      </th>
                      <th className="p-3 text-[#2f2f2f] font-semibold">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {CRList.length === 0 ? (
                      <td colSpan={4}>
                        <div className="flex justify-center items-center h-[10em]">
                          No Data Found
                        </div>
                      </td>
                    ) : (
                      CRList?.map((obj, index) => {
                        return (
                          <tr key={index} className="bg-gray-100">
                            <td className="p-3">
                              <div className="flex align-items-center">
                                <AccountBoxIcon />
                                <div className="ml-3">
                                  <div className="text-[#2f2f2f]">
                                    {obj?.name}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-3">
                              <span className="text-[#2f2f2f]">
                                {obj?.user?.label || obj?.user?.name}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className="text-[#2f2f2f]">
                                {index + 1}
                              </span>
                            </td>

                            <td className="p-3 ">
                              <a
                                href="#"
                                className="text-[#2f2f2f] hover:text-[#000]"
                                onClick={() => handleDeleteCR(index)}
                              >
                                <DeleteIcon sx={{ fill: "red" }} />
                              </a>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <Grid sm={12}>
              <Divider sx={{ height: "2px" }} />
              <h2 className="font-bold my-5 ">Project Charter</h2>
            </Grid>
            <Grid container sm={12}>
              <HookTextField
                name="problemStatement"
                errors={errors}
                control={control}
                labelText="Problem Statement"
                type="textarea"
              />
            </Grid>
            <Grid container sm={12}>
              <HookTextField
                name="projectObjectives"
                errors={errors}
                control={control}
                labelText="Project Objectives"
                type="textarea"
              />
            </Grid>
            <Grid container sm={12}>
              <HookTextField
                name="projectOverview"
                errors={errors}
                control={control}
                labelText="Project Overview"
                type="textarea"
              />
            </Grid>
            <Grid container sm={12}>
              <HookTextField
                name="expectedBenefits"
                errors={errors}
                control={control}
                labelText="Expected Benefits"
                type="textarea"
              />
            </Grid>
            <Grid container sm={12}>
              <HookTextField
                name="scopeDetails"
                errors={errors}
                control={control}
                labelText="Scope Details"
                type="textarea"
              />
            </Grid>
            <Grid sm={12}>
              <Divider sx={{ height: "2px" }} />
              <h2 className="font-bold my-5 ">Other Information</h2>
            </Grid>
            <Grid container sm={12}>
              <HookTextField
                name="mission"
                errors={errors}
                control={control}
                labelText="Mission"
                type="textarea"
              />
            </Grid>
            <Grid container sm={12}>
              <HookTextField
                name="vision"
                errors={errors}
                control={control}
                labelText="Vision"
                type="textarea"
              />
            </Grid>
            <Grid container sm={12}>
              <HookTextField
                name="scope"
                errors={errors}
                control={control}
                labelText="Scope"
                type="textarea"
              />
            </Grid>
            <Grid item sm={12} md={4}></Grid>
            <Grid item sm={12} md={4}></Grid>
            {projectId ? (
              <Grid item sm={12} md={4} className="flex justify-end">
                <GreenButton
                  buttonText="Update Project"
                  role="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={loading}
                  loading={loading}
                />
              </Grid>
            ) : (
              <Grid item sm={12} md={4} className="flex justify-end">
                <GreenButton
                  buttonText="Create Project"
                  role="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={loading}
                  loading={loading}
                />
              </Grid>
            )}
          </Grid>
        </Box>
      </div>
    </div>
  );
};

export default AddPorfolioScreen;

const options = (workspacePortfolios = [], portfolio) => {
  return [
    {
      label: `Public to ${portfolio ? portfolio.label : ""} `,
      value: `Public`,
    },
    {
      label: "Private ",
      value: "Private",
    },
  ];
};

const defaultViews = [
  {
    value: "1",
    label: "Kanban",
    svg: (
      <svg
        className="icon ml-4"
        width="1em"
        height="0.9230769230769231em"
        viewBox="0 0 12 13"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="currentColor" fillRule="evenodd">
          <rect width="5" height="13" rx="1"></rect>
          <rect x="7" width="5" height="8" rx="1"></rect>
        </g>
      </svg>
    ),
  },
  {
    value: "2",
    label: "List",
    svg: (
      <svg
        className="icon ml-4"
        width="14.181818181818183px"
        height="12px"
        viewBox="0 0 13 10"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M3.365.385h8.76v1.23h-8.76V.385Zm0 4.98v-1.23h8.76v1.23h-8.76Zm0 3.75v-1.23h8.76v1.23h-8.76ZM1.49 7.555c.26 0 .482.095.667.285.186.19.278.41.278.66 0 .25-.095.467-.285.652a.918.918 0 0 1-1.312 0A.893.893 0 0 1 .56 8.5c0-.25.09-.47.27-.66.18-.19.4-.285.66-.285Zm0-7.5a.91.91 0 0 1 .667.277.91.91 0 0 1 .278.668c0 .26-.092.48-.278.66a.923.923 0 0 1-.667.27c-.26 0-.48-.09-.66-.27A.898.898 0 0 1 .56 1C.56.74.65.518.83.332c.18-.185.4-.277.66-.277Zm0 3.75a.91.91 0 0 1 .667.277.91.91 0 0 1 .278.668c0 .26-.092.48-.278.66a.923.923 0 0 1-.667.27c-.26 0-.48-.09-.66-.27a.898.898 0 0 1-.27-.66c0-.26.09-.482.27-.668.18-.185.4-.277.66-.277Z"
        ></path>
      </svg>
    ),
  },
  {
    value: "3",
    label: "Calendar",
    svg: (
      <svg
        className="icon ml-4"
        width="1em"
        height="1em"
        viewBox="0 0 14 15"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.6 3.5c0-.387-.312-.7-.697-.7a.703.703 0 0 1-.703.7c-.387 0-.7-.31-.7-.7H9.1c0 .387-.31.7-.7.7-.387 0-.7-.31-.7-.7H6.3c0 .387-.31.7-.7.7-.387 0-.7-.31-.7-.7H3.5c0 .387-.31.7-.7.7-.387 0-.7-.31-.7-.7-.388 0-.7.313-.7.7v1.4h11.2V3.5zM1.4 6.3v6.3c0 .387.312.7.697.7h9.806a.698.698 0 0 0 .697-.7V6.3H1.4zM14 3.5v9.1c0 1.16-.938 2.1-2.097 2.1H2.097A2.099 2.099 0 0 1 0 12.6V3.5c0-1.16.938-2.1 2.097-2.1L2.1.7c0-.387.31-.7.7-.7.387 0 .7.31.7.7v.7h1.4V.7c0-.387.31-.7.7-.7.387 0 .7.31.7.7v.7h1.4V.7c0-.387.31-.7.7-.7.387 0 .7.31.7.7v.7h1.4V.7c0-.387.31-.7.7-.7.387 0 .7.31.7.7v.7A2.1 2.1 0 0 1 14 3.5z"
          fill="currentColor"
          fillRule="evenodd"
        ></path>
      </svg>
    ),
  },
  {
    value: "4",
    label: "Swimlane",
    svg: (
      <svg
        className="icon ml-4"
        width="1em"
        height="1em"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
      >
        <path d="M226-160q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19ZM226-414q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19ZM226-668q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Zm254 0q-28 0-47-19t-19-47q0-28 19-47t47-19q28 0 47 19t19 47q0 28-19 47t-47 19Z" />
      </svg>
    ),
  },
  {
    value: "5",
    label: "Report",
    svg: (
      <svg
        className="icon ml-4"
        width="12px"
        height="12px"
        viewBox="0 0 11 11"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.195 6.438c.078 0 .149.027.211.082a.255.255 0 0 1 .094.199v4.289c0 .203-.11.375-.328.515v.024L6.07 13.703v.024a.326.326 0 0 1-.14.023.312.312 0 0 1-.211-.082.255.255 0 0 1-.094-.2V9.134c0-.219.102-.39.305-.516L6 8.57l4.031-2.086.047-.023a.26.26 0 0 1 .117-.024zm-.304-1.149c.125.047.187.117.187.211a.252.252 0 0 1-.047.14.265.265 0 0 1-.094.094l-.046.024L5.6 8.03l-.046.024a.672.672 0 0 1-.305.07.672.672 0 0 1-.305-.07l-.047-.024L.61 5.781C.484 5.703.422 5.61.422 5.5c0-.047.015-.086.047-.117a.367.367 0 0 1 .094-.07l.046-.024 4.243-1.922c.171-.078.304-.117.398-.117l.398.117L9.891 5.29zM4.57 8.617c.202.125.304.297.304.516v4.336a.255.255 0 0 1-.094.199.312.312 0 0 1-.21.082.36.36 0 0 1-.141-.047L.328 11.547v-.024C.11 11.383 0 11.211 0 11.008v-4.29c0-.077.031-.144.094-.198a.312.312 0 0 1 .21-.082c.063 0 .102.007.118.023l.047.023L4.477 8.57l.093.047z"
          id="a"
          transform="translate(0 -3)"
          fill="currentColor"
          fillRule="evenodd"
        ></path>
      </svg>
    ),
  },
];

const portfolioTabs = [
  {
    name: "BLANK PROJECT",
  },
  {
    name: "THREE60 TEMPLATES",
  },
  {
    name: "SAVED TEMPLATES",
  },
  {
    name: "IMPORT FROM CSV",
  },
];
