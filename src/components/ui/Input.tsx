import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", fullWidth = true, ...props }, ref) => {
    const inputStyles = `px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-[#0f3932] focus:ring-[#0f3932] block rounded-md sm:text-sm focus:ring-1 ${
      error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
    } ${fullWidth ? "w-full" : ""} ${className}`;

    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <input ref={ref} className={inputStyles} {...props} />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);
