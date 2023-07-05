import React from "react";
import styled from "styled-components";

const CustomProgressBar = ({ bgcolor, completed,width ,margin}) => {
  const containerStyles = {
    height: 13,
    textAlign:"center",
    width: width? width:"150%",
    backgroundColor: "#e0e0de",
    borderRadius: 50,
    margin: margin ? margin:50,
    
  };

  const fillerStyles = {
    height: "100%",
    width: `${completed}%`,
    backgroundColor: `${completed == 100 ? "#00A99B" : "rgb(244,166,70)"}`,
    borderRadius: "inherit",
    textAlign: "right",
    fontSize: "9px",
    fontWeight:"bold",
    transition: "width 0.2s ease-in-out",
    
  };

  const labelStyles = {
    padding: 8,
    color: completed == 100 ? "white":"black",
    fontWeight: "bold",
  };

  return (
    <div>
      <div style={containerStyles}>
        <div style={fillerStyles}>
          <span style={labelStyles}>{`${completed}%`}</span>
        </div>
      </div>
    </div>
  );
};

export default CustomProgressBar;
