import React, { useEffect } from "react";
import ReactSelect from "react-select";

const Select = ({ label, name, formik, options, loading = false, isReadOnly = false }) => {
  const value = name
    .split(".")
    .reduce(
      (obj, key) => (obj && obj[key] !== undefined ? obj[key] : ""),
      formik.values
    );
  const touched = name
    .split(".")
    .reduce(
      (obj, key) => (obj && obj[key] !== undefined ? obj[key] : false),
      formik.touched
    );
  const error = name
    .split(".")
    .reduce(
      (obj, key) => (obj && obj[key] !== undefined ? obj[key] : ""),
      formik.errors
    );

  const selectOptions = options.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt
  );
  const selectedOption =
    selectOptions.find((opt) => opt.value === value) || null;

  return (
    <div className="flex flex-col w-full mb-4">
      <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      <ReactSelect
        options={selectOptions}
        isLoading={loading}
        name={name}
        value={selectedOption}
        onChange={(selected) =>
          formik.setFieldValue(name, selected?.value || "")
        }
        onBlur={() => formik.setFieldTouched(name, true)}
        placeholder={`Select ${label}`}
        classNamePrefix="react-select"
        isDisabled={loading || isReadOnly}
        styles={{
          control: (base, state) => ({
            ...base,
            minHeight: "48px",
            borderRadius: "0.5rem",
            borderColor: state.isFocused
              ? "#60A5FA"
              : touched && error
              ? "#EF4444"
              : "#556581",
            boxShadow: state.isFocused ? "0 0 0 2px #60A5FA" : "none",
            backgroundColor: isReadOnly ? "#F3F4F6" : base.backgroundColor,
            cursor: isReadOnly ? "not-allowed" : base.cursor,
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
        }}
      />
      {touched && error && !isReadOnly && (
        <span className="text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
};

// Reusable Text Area
const TextArea = ({ label, name, formik, placeholder, isReadOnly = false }) => {
  const value = name
    .split(".")
    .reduce(
      (obj, key) => (obj && obj[key] !== undefined ? obj[key] : ""),
      formik.values
    );
  const touched = name
    .split(".")
    .reduce(
      (obj, key) => (obj && obj[key] !== undefined ? obj[key] : false),
      formik.touched
    );
  const error = name
    .split(".")
    .reduce(
      (obj, key) => (obj && obj[key] !== undefined ? obj[key] : ""),
      formik.errors
    );

  return (
    <div className="flex flex-col w-full mb-4 col-span-2">
      <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows="4"
        placeholder={placeholder}
        value={value || ""}
        disabled={isReadOnly}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={`border ${
          touched && error ? "border-red-500" : "border-gray-700"
        } rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
          isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
      />
      {touched && error && !isReadOnly && (
        <span className="text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
};

// Section Wrapper
const Section = ({ title, children }) => (
  <div className="px-6 py-2 bg-white rounded-md">
    <h1 className="text-xl font-semibold mb-6">{title}</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-11 px-8">
      {children}
    </div>
  </div>    
);

// Main Physiotherapy Setup Component
const PhysiotherapySetup = ({ formik, isReadOnly = false }) => {
  return (
    <Section title="PHYSIOTHERAPY SETUP">
      {/* Row 1 - Select Input */}
      <Select
        label="Focus Speciality"
        name="physiotherapy.focus"
        formik={formik}
        isReadOnly={isReadOnly}
        options={[
          "Orthopedic",
          "Neurological",
          "Cardiopulmonary",
          "Pediatric",
          "Geriatric",
        ]}
        placeholder="Select Speciality"
      />

      {/* Row 2 - Text Area (spanning both columns) */}
      <TextArea
        label="Summary"
        name="physiotherapy.summary"
        formik={formik}
        isReadOnly={isReadOnly}
        placeholder="Enter summary of physiotherapy setup"
      />
    </Section>
  );
};

export default PhysiotherapySetup;