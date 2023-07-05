const WhiteButton = ({ buttonText, width, height, ...rest }) => {
  return (
    <div
      {...rest}
      style={{
        width: width ? width : "140px",
        height: height ? height : "40px",
      }}
      className="px-[12px] py-[7px] bg-[#FFFFFF] rounded-md text-black flex items-center border border-gray-200 justify-center hover:text-[#00A99B] text-sm font-Manrope font-semibold"
      role="button">
      {buttonText}
    </div>
  );
};

export default WhiteButton;
