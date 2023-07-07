import { Controller } from "react-hook-form";
import { LinearProgress, Slider } from "@mui/material";

export const ProgressInput = ({
  control,
  labelText,
  name,
  defaultValue,
  labelClass = "",
}) => {
  const formatValueLabel = (value) => `${value}%`;
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <div>
          {labelText && (
            <label
              className={`font-semibold text-[15px] mb-1 font-Manrope w-full flex justify-between  ${labelClass}`}
            >
              {labelText}
              <span>{`${field.value ? field.value : 0}%`}</span>
            </label>
          )}
          <Slider
            {...field}
            aria-label="progress-slider"
            value={field.value}
            min={0}
            max={100}
            valueLabelDisplay="auto"
            valueLabelFormat={formatValueLabel}
            sx={{
              color: "#00A99B",
              marginTop: "8px", // Specify the color you want
              "& .MuiSlider-thumb": {
                // Styling for the thumb
                backgroundColor: "#00A99B", // Specify the color you want
              },
              "& .MuiSlider-track": {
                // Styling for the track
                backgroundColor: "#00A99B", // Specify the color you want
              },
              "& .MuiSlider-rail": {
                // Styling for the rail
                backgroundColor: "#00A99B", // Specify the color you want
              },
            }}
          />
        </div>
      )}
    />
  );
};
