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
const FormField = ({ label, name, formik, type = "text", ...props }) => {
  const value = getIn(formik.values, name) || "";
  const error = getIn(formik.errors, name);
  const touched = getIn(formik.touched, name);

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
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

// CheckboxGroup Component
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

const FarmerForm = ({ formik }) => {
  return (
    <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
      {/* General Details */}
      <SectionHeading title="General Details" />
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
      {/* <FormField
        name="leadOwner"
        label="Lead Owner"
        formik={formik}
        placeholder="Enter lead owner"
      /> */}
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
        name="totalLandOwned"
        label="Total Land Owned"
        formik={formik}
        placeholder="Enter total land"
      />

      {/* Address Details */}
      <SectionHeading title="Address Details" />
      <FormField
        name="villageName"
        label="Village Name"
        formik={formik}
        placeholder="Enter village name"
      />
      <FormField
        name="state"
        label="State"
        formik={formik}
        placeholder="Enter state"
      />
      <FormField
        name="district"
        label="District"
        formik={formik}
        placeholder="Enter district"
      />
      <FormField
        name="address"
        label="Address"
        formik={formik}
        placeholder="Enter address"
      />
      <FormField
        name="pinCode"
        label="Pin Code"
        formik={formik}
        type="text"
        placeholder="Enter 6-digit pincode"
      />
      <FormField
        name="taluka"
        label="Taluka"
        formik={formik}
        placeholder="Enter taluka"
      />

      {/* Lead Generation */}
      <SectionHeading title="Lead Generation Details" />
      <CheckboxGroup
        name="leadGeneratedThrough"
        label="Lead Generated Through"
        options={[
          { value: "Email", label: "Email" },
          { value: "Calling", label: "Calling" },
          { value: "Meeting", label: "Meeting" },
        ]}
        formik={formik}
      />
      {/* <FormField
        name="lastMeeting"
        label="Last Meeting"
        formik={formik}
        type="date"
        max={new Date().toISOString().split("T")[0]}
      />
      <FormField
        name="nextMeeting"
        label="Next Meeting"
        formik={formik}
        type="date"
        min={new Date().toISOString().split("T")[0]}
      /> */}
      {/* <FormField
        name="nextfollowup"
        label="Next Follow Up"
        formik={formik}
        type="date"
      />
      <FormField name="status" label="Status" formik={formik} /> */}

      {/* Financial Information */}
      <SectionHeading title="Financial Information" />
      <FormField
        name="panNo"
        label="PAN Number"
        formik={formik}
        placeholder="Enter PAN number"
      />
      <FormField
        name="paymentMode"
        label="Payment Mode"
        formik={formik}
        placeholder="Enter payment mode"
      />
      <FormField
        name="existingLoan"
        label="Existing Loan"
        formik={formik}
        placeholder="Enter existing loan"
      />
      <FormField
        name="bankName"
        label="Bank Name"
        formik={formik}
        placeholder="Enter bank name"
      />

      {/* Agricultural Details */}
      <SectionHeading title="Agricultural Details" />
            <FormField
        name="productName"
        label="Product Name"
        formik={formik}
        placeholder="Enter product name"
      />
      <FormField
        name="sprayingType"
        label="Spraying Type"
        formik={formik}
        placeholder="Enter spraying type"
      />
      <FormField
        name="tentativeBuyingDate"
        type="date"
        label="Tentative Buying Date"
        formik={formik}
      />
      <FormField
        name="cropType"
        label="Crop Type"
        formik={formik}
        placeholder="Enter crop type"
      />
      <FormField
        name="cropName"
        label="Crop Name"
        formik={formik}
        placeholder="Enter crop name"
      />
      <FormField
        name="sprayingDuration"
        label="Crop Duration"
        formik={formik}
        placeholder="Enter duration"
      />
      <FormField
        name="purposeForBuying"
        label="Purpose for Buying"
        formik={formik}
        placeholder="Enter purpose"
      />
            <FormField
        name="Comments"
        label="Comment Box"
        formik={formik}
        placeholder="Enter any comments"
      />
    </div>
  );
};

export default FarmerForm;