// src/components/Input.jsx
import React from "react";

const Input = ({ type = "text", value, onChange, placeholder, ...props }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
      {...props}
    />
  );
};

export default Input;
