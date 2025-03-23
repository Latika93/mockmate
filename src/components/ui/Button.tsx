import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  fullWidth = false,
  loading = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md focus:outline-none transition-colors duration-200 ease-in-out";

  const variantStyles = {
    primary:
      "bg-[#0f3932] text-white hover:bg-[#0a2b26] focus:ring-2 focus:ring-offset-2 focus:ring-[#0f3932]",
    secondary:
      "bg-[#f5f5f0] text-[#0f3932] hover:bg-[#e5e5e0] focus:ring-2 focus:ring-offset-2 focus:ring-[#0f3932]",
    outline:
      "border border-[#0f3932] text-[#0f3932] bg-transparent hover:bg-[#f5f5f0] focus:ring-2 focus:ring-offset-2 focus:ring-[#0f3932]",
  };

  const widthStyles = fullWidth ? "w-full" : "";

  const loadingStyles = loading ? "opacity-70 cursor-not-allowed" : "";

  const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${widthStyles} ${loadingStyles} ${className}`;

  return (
    <button className={buttonStyles} disabled={disabled || loading} {...props}>
      {loading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};
