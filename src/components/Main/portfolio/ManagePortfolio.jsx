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
import {
  useAddPortfolio,
  useAppGetPortfolioById,
  useAppGetPortfolioMembers,
  useUpdatePortfolio,
} from "hooks/Portfolio";
import { useDisplaySuccess } from "hooks/useDisplaySuccess";
import { useDisplayError } from "hooks/useDisplayError";
import { useNavigate } from "react-router-dom";
import { links } from "static/links";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ManagePortfolio({
  activePortfolioId,
  open,
  handleClose,
}) {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(portfolioSchema),
  });

  const classes = useStyles();
  const display = useDisplaySuccess();
  const dispatch = useDispatch();
  const id = localStorage.getItem("workspaceId");
  const { portfolioMembers, portfolioMembersResponse } =
    useAppGetPortfolioMembers({
      id: id,
    });

  const handleGetPortfolioByIdSuccess = (data) => {
    if (data?.data?.success) {
      const filteredMembers = data?.data?.data?.members?.map((obj) => {
        return {
          label: obj.name,
          value: obj.id,
        };
      });

      reset({
        name: data?.data?.data?.name,
        members: filteredMembers,
      });
    }
  };

  const { portfolioByIdResponse } = useAppGetPortfolioById({
    id: activePortfolioId,
    onSuccess: handleGetPortfolioByIdSuccess,
  });

  const onSuccess = (data) => {
    if (data.data) {
      reset({ name: "", members: "" });
      display(data.message);
      navigate(`${links.portfolio}/${id}`);
      dispatch(closePortfolio());

      handleClose();
    }
  };
  const updatePortfolio = useUpdatePortfolio({ onSuccess, activePortfolioId });
  const isLoading =
    updatePortfolio.isLoading || portfolioByIdResponse.isLoading;
  const error = updatePortfolio.error || portfolioByIdResponse.error;
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
    console.log(data, "dataaaaaaa");
    const payload = {
      workspace_Id: +id,
      name: data.name,
      members: data.members.map((el) => {
        return el.email;
      }),
    };

    console.log(payload, "payloadddddd");

    updatePortfolio.mutate({ data: payload });
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
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <DialogTitle className="bg-[#fafbfd]">
          <div className="flex justify-between px-[5px] items-center">
            <h1 className="font-bold text-[#373737] text-[20px] font-Manrope">
              Manage Portfolio
            </h1>
            <div
              onClick={handleClose}
              className="cursor-pointer border border-[#e8e8e8] bg-[#fff] shadow-[0 3px 5px 0 rgba(0,0,0,.05)] px-[6px] py-[2px] rounded-md hover:bg-[#f98a3f] hover:text-[#fff]"
            >
              <CloseIcon className="relative -top-[1px]" />
            </div>
          </div>
        </DialogTitle>
        <Divider />
        <DialogContent className={classes.dialogPaper}>
          <form>
            <div className="w-[450px]">
              <p className="text-[16px] font-bold mb-3 font-Manrope text-[#2f2f2f]">
                Portfolio Name
              </p>
              <h6 className="mb-1 font-Manrope font-medium text-[14px] text-[#9399AB]">
                All workspace members will join the General portfolio by
                default.
              </h6>
              <div className="border-gray-500">
                <HookTextField
                  name="name"
                  errors={errors}
                  control={control}
                  labelText=""
                  required={false}
                  placeholder="Enter Name..."
                />
              </div>
              <div className="mt-3">
                <h3 className="text-[16px] mb-3 font-bold font-Manrope text-[#2f2f2f]">
                  Portfolio Members
                </h3>
                <h6 className="mb-1 font-Manrope font-medium text-[14px] text-[#9399AB]">
                  Members added to this portfolio will be given access to all
                  public projects within the portfolio.
                </h6>
              </div>
              <div className="mt-1">
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
            <WhiteButton buttonText="Cancel" onClick={handleClose} />
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
