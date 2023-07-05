import React, { memo } from "react";
import { Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import Checkbox from "@mui/material/Checkbox";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

const HookCheckBox = ({
  name,
  control,
  errors,
  labelText,
  checked,
  onChange,
  defaultValue = false,
}) => {
  return (
    <div>
      <Controller
        name={name}
        defaultValue={defaultValue}
        control={control}
        render={({ field: { onChange, value } }) => {
          return (
            <FormControlLabel
              control={
                <Checkbox
                  checked={value}
                  onChange={onChange}
                  sx={{
                    "&, &.Mui-checked": {
                      color: "#00A99B",
                    },
                  }}
                  size="small"
                />
              }
              label={labelText}
            />
          );
        }}
      />
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => <p className="text-red-500">{message}</p>}
      />
    </div>
  );
};

export default memo(HookCheckBox);
