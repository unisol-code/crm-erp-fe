
import React from "react";
import { useFormikContext } from "formik";

const Input = ({ label, name, formik, type = "text", placeholder, disabled }) => {
  // Support both context and prop patterns
  const formikContext = useFormikContext();
  const form = formik || formikContext;
  
  const value = name.split(".").reduce((obj, key) => obj?.[key], form.values);
  const touched = name.split(".").reduce((obj, key) => obj?.[key], form.touched);
  const error = name.split(".").reduce((obj, key) => obj?.[key], form.errors);
  
  const inputValue =
    type === "date" && value instanceof Date
      ? value.toISOString().split("T")[0]
      : value ?? "";
  
  return (
    <div className="flex flex-col w-full mb-4">
      <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1">
        {label}
        {/* {required && <span className="text-red-500 ml-1">*</span>} */}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        placeholder={placeholder}
        value={inputValue}
        disabled={disabled}
        onWheel={(e) => e.target.blur()}
        onChange={(e) => {
          if (type === "number") {
            const numValue = e.target.value === "" ? "" : Number(e.target.value);
            form.setFieldValue(name, isNaN(numValue) ? "" : numValue);
          } else if (type === "date") {
            form.setFieldValue(name, e.target.value ? new Date(e.target.value) : "");
          } else {
            form.handleChange(e);
          }
        }}
        onBlur={form.handleBlur}
        className={`no-spinner w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm ${disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`}
      />
      {touched && error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
};

export default Input;