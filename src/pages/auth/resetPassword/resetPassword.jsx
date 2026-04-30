import React, { useState } from "react";
import ResetPasswordImage from "../../../assets/images/resetPasswordImage.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSignIn } from "../../../hooks/auth/useSignIn";

const ResetPassword = () => {
  const { forgotPassword,loading  } = useSignIn();
  const [showOTPSection, setShowOTPSection] = useState(false);

  const validation = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validation,
    onSubmit: (values) => {
      if (values) {
        forgotPassword(values);
        setShowOTPSection(true);
      }
    },
  });


  setTimeout(() => {
    sessionStorage.removeItem("email");
    console.log("Email removed from sessionStorage after 5 minutes");
  }, 300000);

  return (
    <div className="grid w-full min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left Section */}
      <div className="bg-[#E5E4E0] flex flex-col items-center px-6 py-10">
        <h1 className="font-bold text-2xl lg:text-3xl mt-6 lg:mt-[100px] text-center">
          Reset Password
        </h1>
        <p className="w-full lg:w-[75%] my-6 lg:my-[40px] text-base lg:text-[20px] text-center">
          Enter your email to receive a 6-digit verification code. Check your
          inbox and enter the code below to proceed.
        </p>

        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col items-center w-full"
        >
          <div className="flex flex-col items-center w-full my-6">
            <label
              htmlFor="email"
              className="text-[14px] text-gray-500 w-[80%] lg:w-[70%]"
            >
              Email Address
            </label>
            <input
              type="email"
              required
              name="email"
              className="rounded-full h-[50px] lg:h-[60px] bg-[#E1D4CB] placeholder-gray-800 px-4 w-[80%] lg:w-[70%] mt-2"
              placeholder="Enter your email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.email && formik.touched.email ? (
              <div className="mt-1 text-sm text-red-500">
                {formik.errors.email}
              </div>
            ) : null}
          </div>

         <div className="flex justify-center w-full">
            <button
            type="submit"
            disabled={loading} 
            className={`rounded-full px-8 py-3 ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#E5C1A9]"
            }`}
          >
            {loading ? "Sending..." : "reset password"} 
          </button>
          </div>
        </form>
      </div>

      {/* Right Section */}
      <div className="flex justify-center items-center bg-[#E9EBF7] p-6">
        <div className="w-full max-w-md">
          <img
            src={ResetPasswordImage}
            className="object-contain w-full h-auto"
            alt="Reset Password"
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
