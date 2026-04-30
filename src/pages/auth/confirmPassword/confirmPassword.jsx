import React, { useState } from "react";
import ConfirmPasswordImage from "../../../assets/images/confirmPasswordImage.png";
import { useSignIn } from "../../../hooks/auth/useSignIn";
import { useFormik } from "formik";
import * as Yup from "yup";

const ConfirmPassword = () => {
  const { confirmPassword,loading  } = useSignIn();
  const [isPasswordReset, setIsPasswordReset] = useState(false);

  const validationSchema = Yup.object().shape({
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const email = sessionStorage.getItem("email");

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const data = {
          email: email,
          password: values.password,
        };
        await confirmPassword(data);
        setIsPasswordReset(true);
      } catch (error) {
        console.error("Error during password reset:", error);
      }
    },
  });

  return (
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#E5E4E0]">
      <div className="flex flex-col items-center px-4 py-10">
        {isPasswordReset ? (
          <div className="text-center mt-16 lg:mt-[100px]">
            <div className="bg-[#E1D4CB] border border-gray-300 shadow-lg rounded-lg p-10 w-full lg:w-[75%] h-auto mx-auto">
              <h1 className="font-bold text-2xl lg:text-3xl text-[#B68666]">
                Your password has been successfully reset!
                You can now log in with your new  credentials.
              </h1>
            </div>
            <button
              onClick={() => (window.location.href = "/login")}
              className="mt-8 bg-[#E5C1A9] text-white px-10 py-3 rounded-full shadow-lg"
            >
              Login
            </button>
          </div>
        ) : (
          <>
            <h1 className="font-bold text-[40px] mt-[50px]">Reset Password</h1>
            <p className="w-[75%] my-[40px] font-semibold md:text-[24px] sm:text-[20px] text-center">
              Set your new password. <br/> Enter and confirm your password to reset it.
            </p>
            <form
              onSubmit={formik.handleSubmit}
              className="my-[40px] w-full flex flex-col gap-[30px]"
            >
              <input
                type="password"
                required
                className="rounded-full h-[60px] bg-[#E1D4CB] placeholder-gray-800 text-center text-lg font-semibold px-4 w-[70%] mx-auto"
                placeholder="Enter password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.password && formik.touched.password && (
                <div className="text-sm text-center text-red-500">
                  {formik.errors.password}
                </div>
              )}
              <input
                type="password"
                required
                className="rounded-full h-[60px] bg-[#E1D4CB] placeholder-gray-800 text-center text-lg font-semibold px-4 w-[70%] mx-auto"
                placeholder="Confirm password"
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.confirmPassword &&
                formik.touched.confirmPassword && (
                  <div className="text-sm text-center text-red-500">
                    {formik.errors.confirmPassword}
                  </div>
                )}
             <div className="flex justify-center w-full">
            <button
            type="submit"
            disabled={loading} 
            className={`rounded-full px-8 py-3 ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#E5C1A9]"
            }`}
          >
            {loading ? "Sending..." : "confirm password"} 
          </button>
          </div>
            </form>
          </>
        )}
      </div>
      <div className="flex justify-center items-center bg-[#E9EBF7] hidden lg:flex">
  <div className="h-[600px] flex justify-center items-center">
    <img
      src={ConfirmPasswordImage}
      className="object-contain w-full h-full"
      alt="Confirm Password"
    />
  </div>
</div>

    </div>
  );
};

export default ConfirmPassword; 