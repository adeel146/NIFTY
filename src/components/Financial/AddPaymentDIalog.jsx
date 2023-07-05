import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import CloseIcon from "@mui/icons-material/Close";
import HookTextField from "hooks/Common/HookTextField";
import { Divider } from "@mui/material";
import { useForm } from "react-hook-form";
import WhiteButton from "hooks/Common/commonButtons/WhiteButton";
import GreenButton from "hooks/Common/commonButtons/GreenButton";
import HookSelectField from "hooks/Common/HookSelectField";
import { makeStyles } from "@mui/styles";
import { yupResolver } from "@hookform/resolvers/yup";
import { financeSchema } from "validations/portfolio";
import { useDisplaySuccess } from "hooks/useDisplaySuccess";
import { useDisplayError } from "hooks/useDisplayError";
import { useAddProjectFinance, useEditProjectFinance } from "hooks/Finance";
import HookSelectFileInput from "hooks/Common/HookFileSelect";
import HookDatePicker from "hooks/Common/HookDatePicker";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddPaymentDialog({
  open,
  selectedPayment,
  handleCLose,
}) {
  const id = location.pathname.split("/").pop();
  const isEdit = Boolean(selectedPayment);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: defaultPaymentValues,
    mode: "onChange",
    resolver: yupResolver(financeSchema),
  });
  const classes = useStyles();
  const display = useDisplaySuccess();

  React.useEffect(() => {
    if (selectedPayment) {
      reset({ ...selectedPayment });
      if (selectedPayment.status) {
        setValue("status", StatusOptions[0]);
      } else {
        setValue("status", StatusOptions[1]);
      }
    }
  }, [selectedPayment]);
  const onSuccess = (data) => {
    if (data.data) {
      display(data.message);
      reset(defaultPaymentValues);
      handleCLose();
    }
  };
  const addFinance = useAddProjectFinance({ id, onSuccess });
  const editFinance = useEditProjectFinance({
    id,
    selectedFinanceId: selectedPayment?.id,
    onSuccess,
  });

  const isLoading = addFinance.isLoading || editFinance.isLoading;
  const error = addFinance.error || editFinance.error;
  useDisplayError(error);

  const onSubmit = (data) => {
    if (isEdit) {
      const payload = {
        comment: data.comment,
        amount: data.amount,
        date: data.date,
        status: data.status.value === "paid" ? true : false,
      };
      editFinance.mutate({ data: payload });
      return;
    }
    const payload = {
      project_Id: id,
      comment: data.comment,
      amount: data.amount,
      date: data.date,
      status: data.status.value === "paid" ? true : false,
      attachment: data.attachment,
    };
    addFinance.mutate({ data: payload });
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
        onClose={() => {
          reset(defaultPaymentValues);
          handleCLose();
        }}
        TransitionComponent={Transition}
      >
        <DialogTitle className="bg-[#fafbfd] w-full cursor-pointer">
          <div className="flex justify-between items-center">
            <h6 className="font-Manrope font-extrabold text-black text-2xl">
              {isEdit ? "Edit Payment" : "Add New Payment"}
            </h6>
            <div
              onClick={() => {
                reset(defaultPaymentValues);
                handleCLose();
              }}
              className="cursor-pointer"
            >
              <CloseIcon
                sx={{
                  width: "40px",
                  height: "40px",
                  fill: "gray",
                  fontSize: "18px",
                  padding: "3px 3px",
                }}
                className="border bg-white hover:bg-[#f98a3f] hover:fill-white rounded-md cursor-pointer"
              />
            </div>
          </div>
        </DialogTitle>
        <Divider />
        <DialogContent className={classes.dialogPaper}>
          <form>
            <div className="w-[450px]">
              <div className="border-gray-500">
                <HookDatePicker
                  hideDefaultLabel={true}
                  control={control}
                  errors={errors}
                  labelText="Date"
                  name="date"
                />
                <div className="mt-3">
                  <HookTextField
                    name="amount"
                    errors={errors}
                    control={control}
                    labelText="Amount"
                    required={false}
                    placeholder="Enter Amount..."
                    type="number"
                  />
                </div>
                <div className="mt-3">
                  <h3 className="font-Manrope font-bold text-base mb-1">
                    Select Status
                  </h3>
                </div>
                <HookSelectField
                  name="status"
                  errors={errors}
                  control={control}
                  required={false}
                  filterOptions={StatusOptions}
                  loadOptions={StatusOptions}
                  isMulti={false}
                />
                <div className="mt-3">
                  <HookTextField
                    name="comment"
                    errors={errors}
                    control={control}
                    labelText="Comments"
                    required={false}
                    placeholder="Enter Comments..."
                    type="textarea"
                  />
                </div>
                <div className="mt-3">
                  <HookSelectFileInput
                    name="attachment"
                    control={control}
                    errors={errors}
                    allowMulti={false}
                  />
                </div>
              </div>
            </div>
          </form>
        </DialogContent>
        <DialogActions className="border-t bg-[#fafbfd] cursor-pointer">
          <div className="flex justify-end items-center mt-4 space-x-3 mb-3 mr-5">
            <WhiteButton
              buttonText="Cancel"
              onClick={() => {
                reset(defaultPaymentValues);
                handleCLose();
              }}
            />
            <GreenButton
              disabled={isLoading}
              loading={isLoading}
              buttonText={isEdit ? "Update" : "Add"}
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const defaultPaymentValues = { date: "", amount: "", status: "", comment: "" };
const StatusOptions = [
  { label: "Paid", value: "paid" },
  { label: "Pending", value: "pending" },
];

const useStyles = makeStyles((theme) => ({
  dialogPaper: {},
}));
