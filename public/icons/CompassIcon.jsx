import React from "react";

function CompassIcon(props) {
  return (
    <svg
      {...props}
      className="icon "
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.168 7.168a.8.8 0 101.13 1.13.8.8 0 00-1.13-1.13zM8 0a8 8 0 100 16A8 8 0 008 0zm4.209 4.61l-2.062 4.51a.998.998 0 01-.493.494l-4.51 2.061a.618.618 0 01-.82-.818l2.063-4.511a.998.998 0 01.492-.493L11.39 3.79a.618.618 0 01.819.819z"
        fill="currentColor"
        fillRule="evenodd"
      ></path>
    </svg>
  );
}

export default CompassIcon;
