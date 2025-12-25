// src/components/Button.jsx
import React from "react";

const Button = ({
  children,
  onClick,
  type = "button",
  disabled,
  className,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:text-gray-600 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
