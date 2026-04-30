import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import conf from "../../config/index";
import {
  userAuthState,
  userForgotPasswordAtom,
  confirmPasswordAtom,
  otpVerifyAtom,
  sAdminResponseAtom,
  employeeLoginDataAtom,
} from "../../state/authenticatedState/authenticatedState.js";
import { toast } from "react-toastify";

import useFetch from "../useFetch";
import { useTheme } from "../theme/useTheme.js";

export const useSignIn = () => {
  const [fetchData] = useFetch();
  const { switchTheme } = useTheme();
  const navigate = useNavigate();
  const setUserInfo = useSetRecoilState(userAuthState);
  const [loading, setLoading] = useState(false);
  const [sAdminResponse, setSAdminResponse] =
    useRecoilState(sAdminResponseAtom);

  const [employeeLoginData, setEmployeeLoginData] = useRecoilState(
    employeeLoginDataAtom
  );
  const [password, setPassword] = useRecoilState(userForgotPasswordAtom);
  const [confirmPass, setConfirmPass] = useRecoilState(confirmPasswordAtom);
  const [otpRes, setOtpRes] = useRecoilState(otpVerifyAtom);

  // ---------------- Super Admin Login -------------------
  const superAdminLogin = async (email, password) => {
    const data = { email, password };
    console.log("hook", email, password);
    setLoading(true);
    try {
      const res = await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}superAdmin/login`,
        data,
      });
      if (res) {
        setLoading(false);
        setSAdminResponse(res);
        toast.success(res?.message);
        sessionStorage.setItem("token", res?.token);
        sessionStorage.setItem("superAdminId", res?.user?.id);
        sessionStorage.setItem("companyId", res?.user?.companyId);
        sessionStorage.setItem("name", res?.user?.name);
        sessionStorage.setItem("companyName", res?.user?.companyName);
        sessionStorage.setItem("isSuperAdminLogin", res?.user?.isSuperAdmin);
        switchTheme(res?.user?.companyName);
        setUserInfo({
          isAuthenticated: true,
        });
        navigate("/crm-dashboard");
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching Sign in:", error);
      toast.error("Invalid Credentials");
      setLoading(false);
    }
  };

  // ---------------- Employee Login -------------------
  const employeeLogin = async (email, password) => {
    const data = { email, password };
    setLoading(true);
    try {
      const url = new URL(`${conf.apiBaseUrl}employee/login-employee`);
      const res = await fetchData({
        method: "POST",
        url: url.toString(),
        data,
      });
      console.log("res", res);
      if (res) {
        setLoading(false);
        setEmployeeLoginData(res);

        sessionStorage.setItem("token", res?.token);
        sessionStorage.setItem("empId", res?.id);
        sessionStorage.setItem("companyId", res?.companyId);
        sessionStorage.setItem("companyName", res?.companyName);
        sessionStorage.setItem("name", res?.name);
        sessionStorage.setItem("profile", res?.photo);
        sessionStorage.setItem(
          "isSalesExecutiveLogin",
          res?.isSalesExecutiveLogin
        );
        switchTheme(res?.companyName);
        setUserInfo({
          isAuthenticated: true,
        });
        toast.success(res?.message);
        navigate("/sales-executive/dashboard");
        return true;
      }
    } catch (error) {
      toast.error("Invalid Credentials");
      // eslint-disable-next-line no-console
      console.error("Error fetching Sign in:", error);
      setLoading(false);
      return false;
    }
  };

  // ---------------- Forgot Password ------------------

  const forgotPassword = async (data) => {
    setLoading(true);
    try {
      const url = new URL(`${conf.apiBaseUrl}superadmin/forgot-password`);

      const res = await fetchData({
        method: "POST",
        url: url.toString(),
        data: data,
      });

      console.log("Forgot Password Response:", res);

      if (res) {
        setPassword(res);
        toast.success(res.message);
        sessionStorage.setItem("email", data.email);
        navigate("/verify-otp");
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error fetching forgot password:", error);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Confirm Password ------------------

  const confirmPassword = async (data) => {
    setLoading(true);
    try {
      const url = new URL(`${conf.apiBaseUrl}superadmin/reset-password`);

      const res = await fetchData({
        method: "POST",
        url: url.toString(),
        data: data,
      });
      console.log("res", res);
      if (res) {
        toast.success(res.message);
        setConfirmPass(res);
        setLoading(false);
      }
      if (!loading) {
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error fetching forgot password:", error);
      setLoading(false);
    }
  };

  // ---------------- Verify Otp ------------------

  const verifyOtp = async (data) => {
    setLoading(true);
    try {
      const url = new URL(`${conf.apiBaseUrl}superadmin/verify-otp`);

      const res = await fetchData({
        method: "POST",
        url: url.toString(),
        data: data,
      });

      console.log("Verify OTP Response:", res);

      if (res) {
        setOtpRes(res);
        toast.success(res.message);
        navigate("/confirm-password");
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error fetching Verify OTP:", error);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Reset Super Admin ------------------
  const resetSuperAdmin = () => {
    setSAdminResponse(null);
  };

  // ---------------- Reset Employee Login ------------------

  const resetEmployee = () => {
    employeeLoginData(null);
  };

  return {
    superAdminLogin,
    sAdminResponse,
    loading,
    resetSuperAdmin,
    forgotPassword,
    password,
    verifyOtp,
    otpRes,
    confirmPassword,
    confirmPass,
    employeeLogin,
    resetEmployee,
    employeeLoginData,
  };
};
