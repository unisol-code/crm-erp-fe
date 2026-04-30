import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Link } from "react-router-dom";
import validator from "validator";

const SuperAdminLoginForm = ({ loading, onSubmit, initialValues }) => {
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      const sanitizedEmail = validator.trim(values.email);
      const sanitizedPassword = validator.trim(values.password);
      await onSubmit(sanitizedEmail, sanitizedPassword, values.rememberMe);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="m-auto w-full">
      <div className="flex flex-col justify-center px-10 items-center space-y-8 md:my-4 w-full">
        <input
          type="email"
          className="rounded-[41px] placeholder:text-black placeholder:font-medium bg-[#E1D4CB] text-black font-semibold text-center py-2 text-xl w-full"
          placeholder="Email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.email && formik.errors.email ? (
          <div className="text-red-500">{formik.errors.email}</div>
        ) : null}
        <input
          type="password"
          className="rounded-[41px] placeholder:text-black placeholder:font-medium text-center bg-[#E1D4CB] text-xl py-2 w-full"
          placeholder="Password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.password && formik.errors.password ? (
          <div className="text-red-500">{formik.errors.password}</div>
        ) : null}
      </div>
      <div className="flex justify-between mb-6 py-4 px-16 font-semibold">
        <div className="mx-2">
          <label>
            <input
              type="checkbox"
              name="rememberMe"
              onChange={formik.handleChange}
              checked={formik.values.rememberMe}
            />
            Remember Me
          </label>
        </div>
        <Link to={"/reset-password"}>
          <p className="hover:text-blue-600">Forgot password?</p>
        </Link>
      </div>
      <div className="text-center py-4 w-full flex justify-center">
        <button
          type="submit"
          className="flex justify-center items-center text-[16px] text-center font-bold bg-[#E5C1A9] h-[40px] rounded-full hover:bg-[#dcad8b] hover:shadow-md w-[120px] disabled:bg-[#D3D3D3]"
          disabled={loading}
        >
          {loading ? (
            <AiOutlineLoading3Quarters className="animate-spin" />
          ) : (
            <h2>Login</h2>
          )}
        </button>
      </div>
    </form>
  );
};

export default SuperAdminLoginForm;