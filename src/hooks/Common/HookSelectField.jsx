import React from "react";
import { Controller } from "react-hook-form";
import AsyncSelect from "react-select/async";
import { ErrorMessage } from "@hookform/error-message";
import Select from "react-select";

function HookSelectField({
  name,
  control,
  errors,
  labelText,
  placeholder,
  loadOptions,
  required = false,
  isMulti,
  loading,
  isDisabled,
}) {
  return (
    <div>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          return (
            <label className="text-[13px] mb-1 font-Manrope font-semibold">
              <span
                className={
                  required
                    ? "block font-medium  mb-1  after:content-['*'] after:ml-0.5 after:text-red-500"
                    : "block font-medium  mb-1"
                }
              >
                {labelText}
              </span>

              <Select
                isDisabled={isDisabled}
                isMulti={isMulti}
                isLoading={loading}
                {...field}
                options={loadOptions}
                placeholder={placeholder}
              />
            </label>
          );
        }}
      />
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => (
          <p className="text-red-500 font-Manrope font-semibold">{message}</p>
        )}
      />
    </div>
  );
}

export default HookSelectField;
