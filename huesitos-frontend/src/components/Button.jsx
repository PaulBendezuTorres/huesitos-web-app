import { useState } from "react";

const Button = ({ children, onClick, primary = false, size = "normal", ...props }) => {
  const sizes = {
    small: "px-3 py-1.5 text-sm",
    normal: "px-4 py-2.5 text-base",
  };

  return (
    <button
      onClick={onClick}
      className={`font-medium rounded-xl transition-all duration-200 ${
        primary
          ? `bg-sky-500 hover:bg-sky-600 text-white shadow-md shadow-sky-200 ${sizes[size]}`
          : `bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 ${sizes[size]}`
      }`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;