import React from "react";
import PropTypes from "prop-types";
import { useTheme } from "../../../hooks/theme/useTheme";

const Button = ({
  text = "Button",
  icon = null,
  onClick,
  type = "button",
  variant = 1,
  disabled = false,
  loading = false,
}) => {
  const { theme } = useTheme();

  const getButtonStyle = () => {
    if (disabled || loading) {
      return {
        base: "opacity-70 cursor-not-allowed",
        style: {
          backgroundColor: "#e5e7eb",
          borderColor: "#d1d5db",
          color: "#6b7280",
        },
      };
    }
    switch (variant) {
      case 1:
        return {
          base: "text-white border",
          style: {
            backgroundColor: theme?.primaryColor,
            borderColor: theme?.primaryColor,
            color: "white",
          },
          hover: {
            backgroundColor: theme?.highlightColor,
            color: "black",
          },
        };
      case 2:
        return {
          base: "text-white border",
          style: {
            backgroundColor: theme?.secondaryColor,
            color: "black",
          },
        };
      case 3:
        return {
          base: "border",
          style: {
            backgroundColor: "transparent",
            borderColor: theme?.primaryColor,
            color: theme?.primaryColor,
          },
          hover: {
            backgroundColor: theme?.highlightColor,
            color: "black",
          },
        };
      default:
        return {};
    }
  };

  const variantStyles = getButtonStyle();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`text-base px-6 py-1 rounded-lg hover:scale-105 mb-2 transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2 ${variantStyles.base}`}
      style={variantStyles.style}
      onMouseEnter={(e) => {
        if (!disabled && !loading && variantStyles.hover) {
          e.currentTarget.style.backgroundColor =
            variantStyles.hover.backgroundColor;
          e.currentTarget.style.color = variantStyles.hover.color;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading && variantStyles.style) {
          e.currentTarget.style.backgroundColor =
            variantStyles.style.backgroundColor;
          e.currentTarget.style.color = variantStyles.style.color;
        }
      }}
    >
      {loading ? (
        <svg
          className="h-5 w-5 animate-spin text-current"
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
      ) : (
        <>
          {text}
          {icon}
        </>
      )}
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.element,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  variant: PropTypes.oneOf([1, 2, 3]),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
};

export default Button;
