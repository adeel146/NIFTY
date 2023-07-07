import React, { memo } from "react";
import { Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

const HookRadioBox = ({
  name,
  control,
  errors,
  options,
  defaultValue = [],
  color,
}) => {
  return (
    <div>
      <Controller
        name={name}
        defaultValue={defaultValue}
        control={control}
        render={({ field: { onChange, value } }) => {
          return (
            <FormControl>
              <RadioGroup
                row
                // aria-labelledby="demo-row-radio-buttons-group-label"
                onChange={onChange}
                checked={value}
              >
                {options?.map((val) => {
                  return (
                    <FormControlLabel
                      value={val.value}
                      control={
                        <Radio
                          sx={{
                            "&, &.Mui-checked": {
                              color: "#00A99B",
                            },
                          }}
                          size="small"
                          // checked={val?.value === "PublicKey"? true: false}
                          // disabled={val?.value === "PublicKey" ? true: false }
                        />
                      }
                      label={val.label}
                    />
                  );
                })}
              </RadioGroup>
            </FormControl>
          );
        }}
      />
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => <p className="text-red-500 text-[12px]">{message}</p>}
      />
    </div>
  );
};

export default memo(HookRadioBox);
