
import React from "react";
import { useFormikContext } from "formik";

const Input = ({ label, name, type = "text", placeholder }) => {
  const formik = useFormikContext();

  const value = name.split(".").reduce((obj, key) => obj?.[key], formik.values);
  const touched = name.split(".").reduce((obj, key) => obj?.[key], formik.touched);
  const error = name.split(".").reduce((obj, key) => obj?.[key], formik.errors);

  const inputValue =
    type === "date" && value instanceof Date
      ? value.toISOString().split("T")[0]
      : value ?? "";

  return (
    <div className="flex flex-col w-full mb-4">
      <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        placeholder={placeholder}
        value={inputValue}
        onWheel={(e) => e.target.blur()}
        onChange={(e) => {
          if (type === "number") {
            const numValue = e.target.value === "" ? "" : Number(e.target.value);
            formik.setFieldValue(name, isNaN(numValue) ? "" : numValue);
          } else if (type === "date") {
            formik.setFieldValue(name, e.target.value ? new Date(e.target.value) : "");
          } else {
            formik.handleChange(e);
          }
        }}
        onBlur={formik.handleBlur}
        className={`no-spinner border border-gray-300 rounded-lg px-2 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400`}

      />
      {touched && error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
};

export default Input;