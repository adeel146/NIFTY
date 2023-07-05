import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { IconButton, TextField } from "@mui/material";
import { get } from "lodash";
import { Controller } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import moment from "moment";
import { makeStyles } from "@mui/styles";
import { lighten } from "@mui/system";
import { ErrorMessage } from "@hookform/error-message";
const useStyles = makeStyles((theme) => ({
  datePickerInput: {
    "& .MuiInputBase-root": {
      //   background: lighten(theme?.palette?.background.default, 0.4),
      //   color: lighten(theme?.palette?.text.secondary, 0.4),
    },
  },
}));
const HookDateTimePicker = ({
  control,
  labelText,
  name,
  errors,
  defaultValue = null,
  clearable = true,
  hideDefaultLabel = false,
  variant,
  size,
  ...rest
}) => {
  const classes = useStyles();
  return (
    <div className="relative ">
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => (
          <>
            {labelText}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label={hideDefaultLabel ? "" : "Set Due Date..."}
                sx={{ width: "100%", height: "100%" }}
                slotProps={{
                  popper: {
                    sx: {
                      zIndex: 9999999,
                    },
                  },
                  field: {
                    className: classes.datePickerInput,
                  },
                }}
                {...field}
                size={size}
                value={field?.value ? moment(field?.value).toDate() : null}
              />
            </LocalizationProvider>
          </>
        )}
      />
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => (
          <p className="text-red-500 text-[12px] absolute left-0 bottom-0 !top-[100%]">
            {message}
          </p>
        )}
      />
    </div>
  );
};

export default HookDateTimePicker;
