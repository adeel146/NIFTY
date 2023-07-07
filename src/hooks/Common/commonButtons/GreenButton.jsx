import CircularProgress from "@mui/material/CircularProgress";

const GreenButton = ({ buttonText, loading, disabled, ...rest }) => {
  return (
    <div
      disabled={disabled}
      {...rest}
      className={`w-[160px] h-[40px] px-[14px] py-[8px] font-Manrope font-semibold text-sm ${
        disabled ? "bg-[#F9C29D] cursor-not-allowed" : "bg-[#00A99B]"
      } rounded-md text-white font-medium text-center flex items-center justify-center`}
      role="button"
    >
      {loading ? <CircularProgress size={20} /> : buttonText}
    </div>
  );
};

export default GreenButton;
