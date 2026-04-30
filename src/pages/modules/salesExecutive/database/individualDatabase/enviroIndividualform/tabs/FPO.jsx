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
      {formik.touched[name] && formik.errors[name] && (
        <div className="mt-1 text-sm text-red-500">{formik.errors[name]}</div>
      )}
    </div>
  );
};

const FpoForm = ({ formik }) => {
  return (
    <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 gap-y-1">
      {/* SECTION 1: FPO Profile */}
      <SectionHeading title="SECTION 1: FPO Profile" />
      <FormField
        name="fpoName"
        label="1. FPO Name"
        formik={formik}
        placeholder="Enter FPO Name"
      />
      <FormField
        name="registrationNumber"
        label="2. Registration Number"
        formik={formik}
        placeholder="Enter Registration Number"
      />
      <FormField
        name="registrationAct"
        label="3. Registration Act (Companies Act / Cooperative Act / Society Act / Others)"
        formik={formik}
        placeholder="Enter Registration Act"
        className="col-span-1 md:col-span-2"
      />
      <FormField
        name="yearOfEstablishment"
        label="4. Year of Establishment"
        formik={formik}
        placeholder="Enter Year"
      />
      <FormField
        name="operationalArea"
        label="5. Operational Area (State/District/Block/Village)"
        formik={formik}
        placeholder="Enter Operational Area"
        className="col-span-1 md:col-span-2"
      />
      <FormField
        name="officeAddress"
        label="6. Office Address"
        formik={formik}
        placeholder="Enter Office Address"
      />
      <FormField
        name="officialContactNumber"
        label="7. Official Contact Number"
        formik={formik}
        placeholder="Enter Contact Number"
      />
      <FormField
        name="officialEmailID"
        label="8. Official Email ID"
        formik={formik}
        placeholder="Enter Email ID"
      />
      <FormField
        name="websiteAppUrl"
        label="9. Website / App URL (if any)"
        formik={formik}
        placeholder="Enter URL"
      />

      {/* SECTION 2: Governance & Staffing */}
      <SectionHeading title="SECTION 2: Governance & Staffing" />
      <FormField
        name="numBoardMembers"
        label="10. Number of Board Members"
        formik={formik}
        type="number"
        placeholder="0"
      />
      <FormField
        name="numStaffMembers"
        label="11. Number of Staff Members"
        formik={formik}
        type="number"
        placeholder="0"
      />

      {/* SECTION 3: Member Profile & Engagement */}
      <SectionHeading title="SECTION 3: Member Profile & Engagement" />
      <FormField
        name="totalActiveMembers"
        label="15. Total Number of Active Members"
        formik={formik}
        type="number"
        placeholder="0"
      />
      <CheckboxGroup
        name="memberCategories"
        label="16. Member Categories (Tick all that apply)"
        options={[
          { label: "Small Farmers", value: "Small Farmers" },
          { label: "Marginal Farmers", value: "Marginal Farmers" },
          { label: "Women Farmers", value: "Women Farmers" },
          { label: "SC/ST", value: "SC/ST" },
          { label: "Tenant Farmers", value: "Tenant Farmers" },
          { label: "Others", value: "Others" },
        ]}
        formik={formik}
      />
      <CheckboxGroup
        name="communicationChannels"
        label="18. Primary Communication Channels (Tick all that apply)"
        options={[
          { label: "SMS", value: "SMS" },
          { label: "WhatsApp", value: "WhatsApp" },
          { label: "Phone Calls", value: "Phone Calls" },
          { label: "Mobile App", value: "Mobile App" },
          { label: "Meetings", value: "Meetings" },
          { label: "Email", value: "Email" },
        ]}
        formik={formik}
      />

      {/* SECTION 4: Services & Business Operations */}
      <SectionHeading title="SECTION 4: Services & Business Operations" />
      <FormField
        name="majorCropsHandled"
        label="35. Major Crops/Commodities Handled"
        formik={formik}
        placeholder="Enter major crops"
      />

      {/* SECTION 5: Finance & Member Benefits */}
      <SectionHeading title="SECTION 5: Finance & Member Benefits" />
      <FormField
        name="annualTurnover"
        label="40. Annual Turnover (₹)"
        formik={formik}
        placeholder="Enter turnover"
      />
      <CheckboxGroup
        name="majorRevenueSources"
        label="41. Major Revenue Sources (Tick all that apply)"
        options={[
          { label: "Input Sales", value: "Input Sales" },
          { label: "Produce Sales", value: "Produce Sales" },
          { label: "Processing", value: "Processing" },
          { label: "Services", value: "Services" },
          { label: "Grants", value: "Grants" },
          { label: "Others", value: "Others" },
        ]}
        formik={formik}
      />

      {/* SECTION 6: Partnerships & Market Linkages */}
      <SectionHeading title="SECTION 6: Partnerships & Market Linkages" />
      <CheckboxGroup
        name="keyBuyerTypes"
        label="45. Key Buyer Types (Tick all that apply)"
        options={[
          { label: "Wholesalers", value: "Wholesalers" },
          { label: "Retailers", value: "Retailers" },
          { label: "Processors", value: "Processors" },
          { label: "Exporters", value: "Exporters" },
          { label: "e-Marketplaces", value: "e-Marketplaces" },
          { label: "Government Agencies", value: "Government Agencies" },
        ]}
        formik={formik}
      />

      {/* SECTION 7: Innovation & Future Planning */}
      <SectionHeading title="SECTION 7: Innovation & Future Planning" />
      <FormField
        name="topChallenges"
        label="58. Top 3 challenges faced by the FPO"
        formik={formik}
        placeholder="Enter challenges"
      />
      <FormField
        name="topPriorities"
        label="59. Top 3 improvement priorities"
        formik={formik}
        placeholder="Enter priorities"
      />
    </div>
  );
};

export default FpoForm;
