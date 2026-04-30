import React from "react";
import { getIn } from "formik";

// Reusable Section Heading
const SectionHeading = ({ title }) => (
  <div className="col-span-1 md:col-span-2 mt-4 mb-4">
    <h3 className="text-lg font-bold text-gray-800 border-b-2 border-green-500 pb-2">
      {title}
    </h3>
  </div>
);

// Reusable Form Field Component
const FormField = ({ label, name, formik, type = "text", className = "", ...props }) => {
  const value = getIn(formik.values, name) || "";
  const error = getIn(formik.errors, name);
  const touched = getIn(formik.touched, name);

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1 min-h-[40px] md:min-h-[30px]">
          {label}
        </label>
      )}
      <input
        {...props}
        type={type}
        name={name}
        value={value}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${error && touched
          ? "border-red-500 focus:ring-red-200"
          : "border-gray-300 focus:ring-green-200"
          }`}
      />
      {error && touched && (
        <div className="text-red-500 text-xs mt-1">{error}</div>
      )}
    </div>
  );
};

// CheckboxGroup Component (can be used for multi-select)
const CheckboxGroup = ({ name, label, options, formik }) => {
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    const currentValues = formik.values[name] || [];
    if (checked) {
      formik.setFieldValue(name, [...currentValues, value]);
    } else {
      formik.setFieldValue(
        name,
        currentValues.filter((item) => item !== value)
      );
    }
  };

  return (
    <div className="mb-4 col-span-1 md:col-span-2">
      <label className="block mb-2 font-semibold text-gray-700">{label}</label>
      <div className="flex flex-wrap gap-4 p-3 border border-gray-300 rounded-md">
        {options.map((option) => (
          <div key={option.value} className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={formik.values[name]?.includes(option.value) || false}
              onChange={handleCheckboxChange}
              onBlur={formik.handleBlur}
              className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
            />
            <label
              htmlFor={`${name}-${option.value}`}
              className="text-gray-700 cursor-pointer text-sm"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

// RadioGroup Component for single select from list
const RadioGroup = ({ name, label, options, formik }) => {
  return (
    <div className="mb-4 col-span-1 md:col-span-2">
      <label className="block mb-2 font-semibold text-gray-700">{label}</label>
      <div className="flex flex-wrap gap-6 p-3 border border-gray-300 rounded-md">
        {options.map((option) => (
          <div key={option.value} className="flex items-center gap-2">
            <input
              type="radio"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={formik.values[name] === option.value}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-4 h-4 text-green-600 focus:ring-green-500"
            />
            <label
              htmlFor={`${name}-${option.value}`}
              className="text-gray-700 cursor-pointer text-sm"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

const GovForm = ({ formik }) => {
  return (
    <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
      <SectionHeading title="General Information" />
      <FormField
        name="birthday"
        label="Birthday"
        formik={formik}
        type="date"
      />
      <FormField
        name="anniversary"
        label="Anniversary"
        formik={formik}
        type="date"
      />
      <FormField
        name="hobbies"
        label="Hobbies"
        formik={formik}
        placeholder="Enter hobbies"
        className="col-span-1 md:col-span-2"
      />

      <SectionHeading title="Section A: Officer & Office Profile" />
      <FormField
        name="officeName"
        label="1. Name of Office / Department"
        formik={formik}
        placeholder="Enter Office Name"
      />
      <FormField
        name="designation"
        label="2. Designation of Officer"
        formik={formik}
        placeholder="Enter Designation"
      />
      <FormField
        name="districtBlockRegion"
        label="3. District / Block / Region Covered"
        formik={formik}
        placeholder="Enter Coverage Area"
      />
      <RadioGroup
        name="yearsOfExperienceInAgri"
        label="4. Years of Experience in the Agriculture Department"
        options={[
          { label: "Less than 5 years", value: "Less than 5 years" },
          { label: "5–10 years", value: "5–10 years" },
          { label: "More than 10 years", value: "More than 10 years" },
        ]}
        formik={formik}
      />

      <SectionHeading title="Section B: Farmer Interaction & Communication" />
      <CheckboxGroup
        name="frequentlyRequestedServices"
        label="7. Frequently requested services"
        options={[
          { label: "Crop advisory", value: "Crop advisory" },
          { label: "Subsidy schemes", value: "Subsidy schemes" },
          { label: "Soil Health Card", value: "Soil Health Card" },
          { label: "Insurance / Compensation", value: "Insurance / Compensation" },
          { label: "Loan guidance", value: "Loan guidance" },
        ]}
        formik={formik}
      />
      <RadioGroup
        name="farmersUnderstandSchemes"
        label="8. Do farmers clearly understand government schemes at first interaction?"
        options={[
          { label: "Yes", value: "Yes" },
          { label: "Partially", value: "Partially" },
          { label: "No", value: "No" },
        ]}
        formik={formik}
      />
      <RadioGroup
        name="effectiveCommunicationLanguage"
        label="9. Most effective language for communication"
        options={[
          { label: "Local language", value: "Local language" },
          { label: "Hindi", value: "Hindi" },
          { label: "English", value: "English" },
        ]}
        formik={formik}
      />

      <SectionHeading title="Section D: Data Management & Technology Use" />
      <RadioGroup
        name="isFarmerDataMaintainedDigitally"
        label="13. Is farmer data maintained digitally?"
        options={[
          { label: "Yes", value: "Yes" },
          { label: "Partially", value: "Partially" },
          { label: "No", value: "No" },
        ]}
        formik={formik}
      />
      <CheckboxGroup
        name="dataManagementTools"
        label="14. Tools used for farmer data management"
        options={[
          { label: "Government portal", value: "Government portal" },
          { label: "Excel / manual registers", value: "Excel / manual registers" },
          { label: "Mobile applications", value: "Mobile applications" },
          { label: "No formal system", value: "No formal system" },
        ]}
        formik={formik}
      />
    </div>
  );
};

export default GovForm;