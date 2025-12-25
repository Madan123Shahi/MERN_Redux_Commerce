import { useState } from "react";

export default function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium mb-1">{label}</label>
      )}

      <div className="relative">
        <input
          type={isPassword && show ? "text" : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full px-3 py-2 border rounded outline-none
            focus:ring-2 focus:ring-black
            ${error ? "border-red-500" : "border-gray-300"}
          `}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-2 text-xs text-gray-600"
          >
            {show ? "Hide" : "Show"}
          </button>
        )}
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
