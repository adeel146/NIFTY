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
import {
  Checkbox,
  Divider,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
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
  useDeletePortfolio,
  usePortfolios,
  useUpdatePortfolio,
} from "hooks/Portfolio";
import { useDisplaySuccess } from "hooks/useDisplaySuccess";
import { useDisplayError } from "hooks/useDisplayError";
import { useNavigate } from "react-router-dom";
import { links } from "static/links";
import InfoIcon from "@mui/icons-material/Info";
import HookCheckBox from "hooks/Common/HookCheckBox";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DeletePortfolio({
  activePortfolioId,
  activePortfolio = [],
  open,
  handleClose,
}) {
  console.log(activePortfolio);
  const navigate = useNavigate();
  const [isDeleteAll, setIsDeleteAll] = React.useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setError,
  } = useForm({
    mode: "onChange",
  });
  const display = useDisplaySuccess();

  const dispatch = useDispatch();

  const confirmation = watch("confirmation");
  const portfolio = watch("portfolio");

  const classes = useStyles();
  const id = localStorage.getItem("workspaceId");

  const { workspacePortfolios, workspacePortfoliosResponse } = usePortfolios({
    id: id,
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

  const deletePortfolio = useDeletePortfolio({
    activePortfolioId: activePortfolioId,
    isDeleteAll: isDeleteAll,
    portfolioId: portfolio?.value,
    onSuccess,
  });

  const workspacePortfoliosOptions = workspacePortfolios?.map((el) => {
    return {
      value: el.id,
      label: el.name,
    };
  });
  const filterOptions = (inputValue = "") => {
    return workspacePortfoliosOptions?.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const onSubmit = (data) => {
    if (!isDeleteAll && !portfolio) {
      setError("portfolio", {
        type: "required",
        message: "Please select ",
      });
      return;
    }
    deletePortfolio.mutate({ data: {} });
  };

  const handleChange = (ev) => {
    const val = ev.target.checked;
    setIsDeleteAll(val);
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
          <div className="flex justify-between">
            <div className="flex flex-col items-center w-full py-[4px]">
              <div className="w-full flex justify-center text-center mb-3">
                <InfoIcon className="text-[#f98d41] !w-[36px] !h-[36px]" />
              </div>
              <h1 className="text-[#f98d41] text-[24px] font-Manrope font-bold">
                Delete{" "}
                {activePortfolio.length
                  ? `"${activePortfolio[0].name}"`
                  : "General"}{" "}
                Portfolio?
              </h1>
            </div>
            <div
              onClick={handleClose}
              className="cursor-pointer border border-[#e8e8e8] bg-[#fff] shadow-[0 3px 5px 0 rgba(0,0,0,.05)] px-[6px] py-[2px] rounded-md hover:bg-[#f98a3f] hover:text-[#fff] h-[38px]"
            >
              <CloseIcon className="relative -top-[1px]" />
            </div>
          </div>
        </DialogTitle>
        <Divider />
        <DialogContent className={classes.dialogPaper}>
          <p className="text-[15px] text-[#2f2f2f]">
            Before you delete this Portfolio, here's what you should know:
          </p>
          <List>
            <ListItem className="flex justify-start items-start !p-0 text-[15px] text-[#2f2f2f]">
              <FiberManualRecordIcon
                sx={{
                  fontSize: 12,
                  marginRight: "12px",
                  position: "relative",
                  top: "-10px",
                  color: "#8e94bb",
                }}
              />
              <ListItemText
                primary={
                  <p className="text-[15px]">
                    If you decide to move all projects into another Portfolio,
                    all projects and their data will be moved to your selected
                    Portfolio, including the project members.
                  </p>
                }
              />
            </ListItem>
            <ListItem className="flex justify-start items-start !p-0 text-[15px] text-[#2f2f2f]">
              <FiberManualRecordIcon
                sx={{
                  fontSize: 12,
                  marginRight: "12px",
                  position: "relative",
                  top: "-10px",
                  color: "#8e94bb",
                }}
              />
              <ListItemText
                className="text-[15px]"
                primary={
                  <p className="text-[15px]">
                    If you delete all projects in this Portfolio, all project
                    data (tasks, messages, docs, etc.) will also be deleted.
                  </p>
                }
              />
            </ListItem>
          </List>
          {!isDeleteAll && (
            <div className="mt-6">
              <p className="text-[13px] text-black font-bold">
                Select Portfolio to move Projects into:
              </p>
              <HookSelectField
                name="portfolio"
                errors={errors}
                control={control}
                required={false}
                filterOptions={filterOptions()}
                placeholder=""
                loadOptions={filterOptions()}
                isMulti={false}
                loading={workspacePortfoliosResponse.isLoading}
              />
            </div>
          )}

          <p className=" mt-6 text-[13px] text-black font-bold relative -top-[3px]">
            Type{" "}
            <span className="bg-[#f8f9f9] border border-[#d6dadc] rounded-sm text-[#e01e5a] text-[12px] p-[2px_5px] font-normal">
              DELETE
            </span>{" "}
            to Confirm
          </p>

          <div className="border-gray-500 mt-1">
            <HookTextField
              name="confirmation"
              errors={errors}
              control={control}
              labelText=""
              required={false}
              placeholder="Enter Name..."
            />
          </div>

          <FormControlLabel
            control={
              <Checkbox
                checked={isDeleteAll}
                sx={{
                  "&, &.Mui-checked": {
                    color: "#00A99B",
                  },
                }}
                size="small"
              />
            }
            onChange={(e) => handleChange(e)}
            label="And delete all projects"
          />
        </DialogContent>
        <DialogActions className="bg-[#fafbfd] border border-t-[#ececec]">
          <div className="flex justify-end items-center space-x-4 px-4 py-4">
            <WhiteButton buttonText="Cancel" onClick={handleClose} />
            <GreenButton
              disabled={confirmation !== "DELETE"}
              buttonText={<p className="text-[13px]">Yes, Delete Portfolio</p>}
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  dialogPaper: {},
}));
