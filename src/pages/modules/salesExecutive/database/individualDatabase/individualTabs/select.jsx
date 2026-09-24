
import React from "react";
import ReactSelect from "react-select";
import { useFormikContext } from "formik";

const Select = ({ label, name, options, formik, loading = false, isMulti = false, isDisabled = false, required }) => {
  // Support both context and prop patterns
  const formikContext = useFormikContext();
  const form = formik || formikContext;
  
  // ✅ SAFETY CHECK
  if (!name || typeof name !== "string") {
    console.error("Select component: 'name' prop is required and must be a string.");
    return null;
  }
  
  // ✅ Get value from nested Formik path (e.g., "address.city")
  const value = name
    .split(".")
    .reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : isMulti ? [] : ""), form.values);
  
  const touched = name
    .split(".")
    .reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : false), form.touched);
  
  const error = name
    .split(".")
    .reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : ""), form.errors);
  
  // ✅ Normalize options to { label, value } format
  const selectOptions = Array.isArray(options)
    ? options.map((opt) =>
        typeof opt === "string" ? { label: opt, value: opt } : opt
      )
    : [];
  
  // ✅ Get selected value(s)
  const selectedOption = isMulti
    ? selectOptions.filter((opt) => value.includes(opt.value))
    : selectOptions.find((opt) => opt.value === value) || null;
  
  return (
    <div className="flex flex-col w-full mb-4">
      {label && (
        <label className="text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <ReactSelect
        options={selectOptions}
        isLoading={loading}
        name={name}
        value={selectedOption}
        onChange={(selected) => {
          if (isMulti) {
            form.setFieldValue(
              name,
              selected ? selected.map((opt) => opt.value) : []
            );
          } else {
            form.setFieldValue(name, selected?.value || "");
          }
        }}
        onBlur={() => form.setFieldTouched(name, true)}
        placeholder={`Select ${label}`}
        classNamePrefix="react-select"
        isDisabled={isDisabled || loading}
        isMulti={isMulti}
        styles={{
          control: (base, state) => ({
            ...base,
            minHeight: "50px",
            borderRadius: "0.5rem",
            borderColor: state.isFocused
              ? "#60A5FA"
              : touched && error
              ? "#EF4444"
              : "#CBD5E1",
            boxShadow: state.isFocused ? "0 0 0 2px #60A5FA" : "none",
            "&:hover": {
              borderColor: state.isFocused ? "#60A5FA" : touched && error ? "#EF4444" : "#94A3B8",
            },
          }),
          valueContainer: (base) => ({
            ...base,
            padding: "0 6px",
            fontSize: "1rem",
          }),
          input: (base) => ({
            ...base,
            margin: 0,
            padding: 0,
          }),
          placeholder: (base) => ({
            ...base,
            color: "#9CA3AF",
          }),
          menu: (base) => ({
            ...base,
            zIndex: 1000,
            borderRadius: "0.5rem",
          }),
        }}
      />
      
      {touched && error && (
        <span className="text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
};

export default Select;
