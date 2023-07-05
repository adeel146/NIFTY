import React, { memo } from "react";
import { Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

const HookTextField = ({
  name,
  control,
  errors,
  labelText,
  placeholder,
  type = "text",
  required = false,
  labelClass = "",
  rows,
  ...rest
}) => {
  return (
    <div className="relative w-full mb-5">
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          return (
            <label className="block">
              <span
                className={
                  required
                    ? "block font-semibold heading-color text-base  after:content-['*'] after:ml-0.5 after:text-red-500"
                    : "block font-semibold heading-color text-base"
                }></span>

              {labelText && (
                <label
                  className={`font-semibold text-[15px] mb-1 font-Manrope  ${labelClass}`}>
                  {labelText}
                </label>
              )}
              {type === "textarea" ? (
                <textarea
                  {...field}
                  {...rest}
                  rows={rows ? rows : 5}
                  placeholder={placeholder}
                  className=" pb-1 mt-2 block focus:outline-none  global-inputFiled border rounded  !border-gray-300 w-full px-3 py-2 bg-[#f7f7f7] placeholder-slate-400 "
                />
              ) : (
                <input
                  {...field}
                  {...rest}
                  type={type}
                  placeholder={placeholder}
                  className=" border mt-1 block focus:outline-[#00a99b] active:shadow-inner global-inputFiled rounded h-[45px]  border-gray-300 w-full px-3 py-2 bg-white text-black  placeholder:text-[14px] placeholder:font-Manrope placeholder:font-semibold shadow-inner placeholder:text-[#8e8e8e] "
                />
              )}
            </label>
          );
        }}
      />
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => (
          <p className="text-red-500 text-[12px] font-Manrope absolute left-0 bottom-0 !top-[100%]">
            {message}
          </p>
        )}
      />
    </div>
  );
};

export default HookTextField;
