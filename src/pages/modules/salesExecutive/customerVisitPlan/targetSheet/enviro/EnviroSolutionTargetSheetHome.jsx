import React from "react";
import { useNavigate } from "react-router-dom";
import { FaBoxOpen, FaProjectDiagram, FaConciergeBell } from "react-icons/fa";

import BreadCrumb from "../../../../../../components/uiComponents/breadcrumb/BreadCrumb";
import Button from "../../../../../../components/uiComponents/button/Button";
import { useTheme } from "../../../../../../hooks/theme/useTheme";
import useEnviroOnly from "./hooks/useEnviroOnly";

/* =========================================================
   ENVIRO SOLUTION — TARGET SHEET LANDING PAGE
   ------------------------------------------------------------
   Only reachable for the EnviroSolution company. It lets the user
   pick one of the three EnviroSolution target sheet types:
     1. Product-Based Target Sheet
     2. Project-Based Target Sheet
     3. Service-Based Target Sheet
========================================================= */

const TARGET_SHEET_OPTIONS = [
  {
    id: "product",
    title: "Product-Based Target Sheet",
    description:
      "Create a target based on products. The overall target quantity and price are split across quarters and months using the product distribution rules (Q1 0% | Q2 24% | Q3 36% | Q4 40%).",
    icon: <FaBoxOpen className="w-6 h-6" />,
    path: "/sales-executive/enviro-target-sheet/product",
    accent: "bg-green-100 text-green-700",
  },
  {
    id: "project",
    title: "Project-Based Target Sheet",
    description:
      "Create a target for a project with plant capacity and projected price. The overall target is spread evenly across the four quarters (25% each).",
    icon: <FaProjectDiagram className="w-6 h-6" />,
    path: "/sales-executive/enviro-target-sheet/project",
    accent: "bg-blue-100 text-blue-700",
  },
  {
    id: "service",
    title: "Service-Based Target Sheet",
    description:
      "Create a target for services such as renting and spraying. The overall service target is distributed over Q2 and Q3 (50% each).",
    icon: <FaConciergeBell className="w-6 h-6" />,
    path: "/sales-executive/enviro-target-sheet/service",
    accent: "bg-amber-100 text-amber-700",
  },
];

const EnviroSolutionTargetSheetHome = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { companyName, isEnviroSolution, isCompanyLoaded } = useEnviroOnly();

  /* Wait until the company name has been read from sessionStorage,
     otherwise a valid Enviro user briefly sees "Access Restricted". */
  if (!isCompanyLoaded) return null;

  /* Other companies never see these screens */
  if (!isEnviroSolution) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="max-w-md text-center bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Access Restricted
          </h2>
          <p className="text-sm text-gray-600">
            The EnviroSolution Target Sheets are only available for the
            EnviroSolution company.
          </p>
          <div className="mt-5">
            <Button
              text="Go to Target Sheet"
              onClick={() => navigate("/sales-executive/target-sheet")}
            />
          </div>
        </div>
      </div>
    );
  }

  const handleOpenForm = (option) => {
    navigate(option.path);
  };

  return (
    <div className="w-full min-h-screen">
      <BreadCrumb
        linkText={[
          { text: "Customer Visit Plan" },
          { text: "Target Sheet" },
          { text: "EnviroSolution Target Sheet" },
        ]}
      />

      <div className="border rounded-2xl shadow-md bg-white overflow-hidden">
        <div className="text-center">
          <h2
            className="flex p-6 mb-2 items-center justify-center font-semibold text-xl text-black rounded-t-md"
            style={{ backgroundColor: theme.secondaryColor }}
          >
            EnviroSolution Target Sheet
          </h2>
        </div>

        <p className="text-black font-bold text-center mb-5 px-6">
          SELECT THE TYPE OF TARGET SHEET YOU WANT TO CREATE
        </p>

        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {TARGET_SHEET_OPTIONS.map((option) => (
              <div
                key={option.id}
                className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full ${option.accent} mb-4`}
                >
                  {option.icon}
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {option.title}
                </h3>

                <p className="text-sm text-gray-600 mb-5 flex-grow">
                  {option.description}
                </p>

                <Button
                  text="Open Form"
                  onClick={() => handleOpenForm(option)}
                  variant={1}
                />
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-300 text-blue-800 text-sm">
            <strong>Note:</strong> All dropdowns (section, profile type,
            organization, individual, product and city) are loaded from the
            live APIs. Pick a target sheet type to start.
          </div>

          <p className="text-xs text-gray-500 mt-3">
            Logged in company: {companyName || "Unknown"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnviroSolutionTargetSheetHome;
