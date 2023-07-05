import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { closePortfolio } from "redux/reducers/portfolio";
import CloseIcon from "@mui/icons-material/Close";
import HookTextField from "hooks/Common/HookTextField";
import { Divider } from "@mui/material";
import { useForm } from "react-hook-form";
import WhiteButton from "hooks/Common/commonButtons/WhiteButton";
import GreenButton from "hooks/Common/commonButtons/GreenButton";
import HookSelectField from "hooks/Common/HookSelectField";
import { makeStyles } from "@mui/styles";
import { yupResolver } from "@hookform/resolvers/yup";
import { portfolioSchema } from "validations/portfolio";
import { useAddPortfolio, useAppGetPortfolioMembers } from "hooks/Portfolio";
import { useDisplaySuccess } from "hooks/useDisplaySuccess";
import { useDisplayError } from "hooks/useDisplayError";
import { useNavigate } from "react-router-dom";
import { links } from "static/links";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddPortfolioDialog() {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: { name: "", members: [] },
    mode: "onChange",
    resolver: yupResolver(portfolioSchema),
  });
  const classes = useStyles();
  const display = useDisplaySuccess();
  const dispatch = useDispatch();
  const id = localStorage.getItem("workspaceId");
  const open = useSelector((state) => state?.portfolioSlice?.portfolioState);
  const { portfolioMembers, portfolioMembersResponse } =
    useAppGetPortfolioMembers({
      id: id,
    });
  const onSuccess = (data) => {
    if (data.data) {
      reset({ name: "", members: "" });
      dispatch(closePortfolio());
      navigate(`${links.portfolio}/${data?.data?.id}`);
      display(data.message);
    }
  };
  const addPortfolio = useAddPortfolio({ onSuccess });
  const isLoading = addPortfolio.isLoading;
  const error = addPortfolio.error;
  useDisplayError(error);

  const portfolioMembersOptions = portfolioMembers?.map((el) => {
    return {
      value: el.id,
      label: el.name,
      email: el.email,
    };
  });
  const filterOptions = (inputValue = "") => {
    return portfolioMembersOptions?.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };
  const onSubmit = (data) => {
    const payload = {
      workspace_Id: +id,
      name: data.name,
      members: data?.members?.length
        ? data.members?.map((el) => {
            return el.email;
          })
        : [],
    };
    addPortfolio.mutate({ data: payload });
  };
  return (
    <div>
      <Dialog
        keepMounted
        maxWidth="sm"
        classes={{
          paper: classes.dialogPaper,
        }}
        open={open}
        onClose={() => dispatch(closePortfolio())}
        TransitionComponent={Transition}>
        <DialogTitle className="bg-[#fafbfd]">
          <div className="flex justify-between px-[5px] items-center">
            <h1>Add New Porfolio</h1>
            <div
              onClick={() => dispatch(closePortfolio())}
              className="cursor-pointer border border-[#e8e8e8] bg-[#fff] shadow-[0 3px 5px 0 rgba(0,0,0,.05)] px-[6px] py-[2px] rounded-md hover:bg-[#f98a3f] hover:text-[#fff]">
              <CloseIcon className="relative -top-[1px]" />
            </div>
          </div>
        </DialogTitle>
        <Divider />
        <DialogContent className={classes.dialogPaper}>
          <form>
            <div className="w-[450px]">
              <div className="border-gray-500">
                <HookTextField
                  name="name"
                  errors={errors}
                  control={control}
                  labelText="Name Your Porfolio"
                  required={false}
                  placeholder="Enter Name..."
                />
              </div>
              <div>
                <h2 className="text-[#2f2f2f] text-[15px] font-bold font-Manrope">
                  Add Portfolio Members
                </h2>
                <h6 className="mt-1 text-[#2f2f2f] text-[14px] font-Manrope font-medium">
                  Members added to this portfolio will be given access to all
                  public projects within the portfolio.
                </h6>
              </div>
              <div className="mt-4">
                <HookSelectField
                  name="members"
                  errors={errors}
                  control={control}
                  required={false}
                  filterOptions={filterOptions()}
                  placeholder="Search by name or enter email to invite ..."
                  loadOptions={filterOptions()}
                  isMulti={true}
                  loading={portfolioMembersResponse.isLoading}
                />
              </div>
            </div>
          </form>
        </DialogContent>
        <DialogActions className="bg-[#fafbfd] border border-t-[#ececec]">
          <div className="flex justify-end items-center space-x-4 px-4 py-4">
            <WhiteButton
              buttonText="Cancel"
              onClick={() => dispatch(closePortfolio())}
            />
            <GreenButton
              disabled={isLoading}
              loading={isLoading}
              buttonText="Create"
              onClick={handleSubmit(onSubmit)}
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
  },
}));
