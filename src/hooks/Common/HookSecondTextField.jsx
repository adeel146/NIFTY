import React from "react";
import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

const HookSecondTextField = ({
  control,
  errors,
  name,
  label,
  defaultValue = null,
}) => {
  return (
    <div>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        render={({ field: { onChange, value } }) => (
          // can use onchange={field.onchnage} value={field.value}
          // or can spread {...field} inplace of value and onchange
          <TextField onChange={onChange} value={value} />
        )}
      />
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => <p className="text-red-500">{message}</p>}
      />
    </div>
  );
};

export default HookSecondTextField;