import React, { useEffect } from "react";
import { getIn } from "formik";
import useEnviroIndividualDrop from "../../../../../../../hooks/superAdminHook/superAdmindatabase/enviroDB/useEnviroIndividualDrop";

const SectionHeading = ({ title }) => (
  <div className="col-span-1 md:col-span-2 mt-4 mb-2">
    <h3 className="text-lg font-bold text-gray-800 border-b-2 border-blue-500 pb-2">
      {title}
    </h3>
  </div>
);

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
        className="w-full px-3 py-2 border rounded focus:outline-none"
      />
      {error && touched && (
        <div className="text-red-500 text-xs mt-1">{error}</div>
      )}
    </div>
  );
};

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
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
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
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
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
  const {
    fetchFrequentlyRequestedServices,
    fetchDataManagementTools,
    frequentlyRequestedServices,
    dataManagementTools,
  } = useEnviroIndividualDrop();

  useEffect(() => {
    fetchFrequentlyRequestedServices();
    fetchDataManagementTools();
  }, []);

  return (
    <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
      <SectionHeading title="General Information" />
      <FormField
        name="firstName"
        label="First Name"
        formik={formik}
        placeholder="Enter first name"
      />
      <FormField
        name="lastName"
        label="Last Name"
        formik={formik}
        placeholder="Enter last name"
      />
      <FormField
        name="email"
        type="email"
        label="Email"
        formik={formik}
        placeholder="Enter email"
      />
      <FormField
        name="contact"
        label="Contact"
        formik={formik}
        placeholder="Enter phone number"
      />
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
      />
      <FormField
        name="goals"
        label="Goals"
        formik={formik}
        placeholder="Enter goals"
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
        name="yearsOfExperience"
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
        options={(frequentlyRequestedServices || []).map((item) => ({
          label: item,
          value: item,
        }))}
        formik={formik}
      />
      {formik.values.frequentlyRequestedServices?.includes("Others") && (
        <FormField
          name="frequentlyRequestedServicesOthers"
          label="Please specify other service"
          formik={formik}
          placeholder="Enter other service"
          className="col-span-1 md:col-span-2"
        />
      )}
      <RadioGroup
        name="schemeUnderstanding"
        label="8. Do farmers clearly understand government schemes at first interaction?"
        options={[
          { label: "Yes", value: "Yes" },
          { label: "Partially", value: "Partially" },
          { label: "No", value: "No" },
        ]}
        formik={formik}
      />
      <RadioGroup
        name="effectiveLanguage"
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
        name="dataMaintainedDigitally"
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
        options={(dataManagementTools || []).map((item) => ({
          label: item,
          value: item,
        }))}
        formik={formik}
      />
      {formik.values.dataManagementTools?.includes("Others") && (
        <FormField
          name="dataManagementToolsOthers"
          label="Please specify other tool"
          formik={formik}
          placeholder="Enter other tool"
          className="col-span-1 md:col-span-2"
        />
      )}
    </div>
  );
};

export default GovForm;