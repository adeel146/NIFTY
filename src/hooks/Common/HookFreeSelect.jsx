import React, { memo } from "react";
import { Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

const HookFreeSelect = ({
  name,
  control,
  errors,
  options,
  labelText,
  width,
  height,
  // defaultValue = [],
}) => {
  return (
    <div>
      <Controller
        name={name}
        // defaultValue={defaultValue}
        control={control}
        render={({ field }) => {
          return (
            <div>
              <label>
                <h3 className="text-[#2f2f2f] text-base font-semibold font-Manrope mb-1">
                  {labelText}
                </h3>
                <select
                  style={{
                    width: width ? width : "450px",
                    height: height ? height : "",
                  }}
                  {...field}
                  // onChange={onChange}
                  value={field.value ? field.value : "select"}
                  className=" h-[45px] rounded-md  bg-white shadow-xs border border-gray-200 pl-3 focus:outline-none hover:text-[#00A99B] custom_select  shadow-inner placeholder:text-sm placeholder:font-Manrope placeholder:font-normal"
                >
                  <option value="select" disabled selected>
                    Select{" "}
                  </option>
                  {options?.map((val) => {
                    return <option value={val?.value}>{val?.label}</option>;
                  })}
                </select>
              </label>
            </div>
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

export default HookFreeSelect;
