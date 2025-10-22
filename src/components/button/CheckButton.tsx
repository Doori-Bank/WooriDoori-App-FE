import React, { useState } from "react";

interface CheckButtonProps {
  defaultChecked?: boolean;
  size?: number; // px 단위
  disabled?: boolean;
}

const CheckButton = ({
  defaultChecked = false,
  size = 24,
  disabled = false,
}: CheckButtonProps) => {
  const [checked, setChecked] = useState(defaultChecked);

  const toggle = () => {
    if (!disabled) setChecked((prev) => !prev);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={disabled}
      className={`
        flex items-center justify-center
        rounded-full border transition-all duration-200
        ${checked ? "border-green-500 bg-green-500" : "border-gray-300 bg-white"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}
      `}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke={checked ? "white" : "gray"}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-[60%] h-[60%]"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </button>
  );
};

export default CheckButton;
