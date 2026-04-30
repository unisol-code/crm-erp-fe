import React, { useEffect, useState } from "react";
import CRM from "../../../assets/images/crm 2.png";

import { useSignIn } from "../../../hooks/auth/useSignIn";
import { Link, useNavigate } from "react-router-dom";
import SuperAdminLoginForm from "./SuperAdminLoginForm";
import SalesExecutiveLoginForm from "./SalesExecutiveLoginForm";
import SalesManagerLoginForm from "./SalesManagerLoginForm";

const LoginTabs = () => {
  const navigate = useNavigate();
  const { superAdminLogin, employeeLogin, loading, resetSuperAdmin } =
    useSignIn();

  const [activeTab, setActiveTab] = useState("superadmin");
  const [initialValues, setInitialValues] = useState({
    superadmin: { email: "", password: "", rememberMe: false },
    salesmanager: { email: "", password: "", rememberMe: false },
    salesExecutive: { officialEmailId: "", empPassword: "", rememberMe: false },
  });

  useEffect(() => {
    const rememberMe = localStorage.getItem("rememberMe") === "true";
    setInitialValues({
      superadmin: {
        email: localStorage.getItem("email") || "",
        password: localStorage.getItem("password") || "",
        rememberMe,
      },
      salesmanager: {
        email: localStorage.getItem("email") || "",
        password: localStorage.getItem("password") || "",
        rememberMe,
      },
      salesExecutive: {
        officialEmailId: localStorage.getItem("officialEmailId") || "",
        empPassword: localStorage.getItem("empPassword") || "",
        rememberMe,
      },
    });
  }, []);

  const handleSuperAdminSubmit = async (email, password, rememberMe) => {
    try {
      if (!email.startsWith("users")) {
        await superAdminLogin(email, password);
      } else {
        console.log("Users must log in through the admin form.");
      }

      rememberMe
        ? (localStorage.setItem("email", email),
          localStorage.setItem("password", password),
          localStorage.setItem("rememberMe", true))
        : (localStorage.removeItem("email"),
          localStorage.removeItem("password"),
          localStorage.removeItem("rememberMe"));
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  const handleEmployeeSubmit = async (email, password, rememberMe) => {
    try {
      if (!email.startsWith("users")) {
        await employeeLogin(email, password);
        rememberMe
          ? (localStorage.setItem("email", email),
            localStorage.setItem("password", password),
            localStorage.setItem("rememberMe", true))
          : (localStorage.removeItem("email"),
            localStorage.removeItem("password"),
            localStorage.removeItem("rememberMe"));
      } else {
        console.log("Users must log in through the admin form.");
      }
    } catch (error) {
      console.error("Error during sales Executive sign-in:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      {/* Image Section */}
      <div className="w-full md:w-1/2 bg-[#E9EBF7] py-14 md:py-16 flex flex-col items-center justify-center space-y-10">
        <img
          src={CRM}
          alt="CRM"
          className="h-[100px] w-[200px] md:h-[200px] md:w-[297px]"
        />
        <p className="px-6 text-sm text-left md:px-14 md:text-2xl">
          Welcome to the Sales & CRM System. Log in to efficiently manage your
          customer relationships, track sales performance, and access valuable
          insights. Your data is protected with the highest security standards.
        </p>
      </div>

      {/* Login Form Section */}
      <div className="w-full md:w-1/2 bg-[#E5E4E0] py-10 md:py-0 flex justify-center items-center">
        <div className="w-full max-w-2xl px-6 space-y-6 md:px-10">
          {/* Tab Buttons */}
          <div className="flex flex-col justify-center w-full overflow-hidden bg-white rounded-full shadow-lg md:flex-row">
            {["superadmin", "salesmanager", "salesExecutive"].map((role) => (
              <button
                key={role}
                className={`flex-1 py-2 text-xl font-normal transition-all duration-300 ${
                  activeTab === role ? "bg-[#E1D4CB]" : ""
                }`}
                onClick={() => setActiveTab(role)}
              >
                {role === "superadmin"
                  ? "Super Admin"
                  : role === "salesmanager"
                  ? "Sales Manager"
                  : "Sales Executive"}
              </button>
            ))}
          </div>

          {/* Headers */}
          <h1 className="text-[40px] font-medium text-center">Welcome</h1>
          <h2 className="text-[36px] text-[#135078] font-extrabold text-center">
            {activeTab === "superadmin"
              ? "Super Admin Login"
              : activeTab === "salesmanager"
              ? "Sales Manager Login"
              : "Sales Executive Login"}
          </h2>
          <p className="text-[18px] font-light text-center">
            Log in to your account to continue
          </p>

          {/* Forms */}
          {activeTab === "superadmin" && (
            <SuperAdminLoginForm
              loading={loading}
              onSubmit={handleSuperAdminSubmit}
              initialValues={initialValues.superadmin}
            />
          )}

          {activeTab === "salesExecutive" && (
            <SalesExecutiveLoginForm
              loading={loading}
              onSubmit={handleEmployeeSubmit}
              initialValues={initialValues.salesExecutive}
            />
          )}

          {/* Uncomment if SalesManagerLoginForm is functional */}
          {/* {activeTab === "salesmanager" && (
            <SalesManagerLoginForm
              loading={loading}
              initialValues={initialValues.salesmanager}
            />
          )} */}
        </div>
      </div>
    </div>
  );
};

export default LoginTabs;
