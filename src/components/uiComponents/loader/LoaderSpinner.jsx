import React from "react";
import { HashLoader } from "react-spinners";
import { useTheme } from "../../../hooks/theme/useTheme";

const LoaderSpinner = () => {
  const { theme } = useTheme();
  return (
    <div className="loader-container">
      <HashLoader color={theme.primaryColor} />
    </div>
  );
};

export default LoaderSpinner;