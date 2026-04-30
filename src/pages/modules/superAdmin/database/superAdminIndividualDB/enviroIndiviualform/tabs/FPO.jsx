import React, { useEffect } from "react";
import { getIn } from "formik";
import useEnviroIndividualDrop from "../../../../../../../hooks/superAdminHook/superAdmindatabase/enviroDB/useEnviroIndividualDrop";

// Reusable Section Heading
const SectionHeading = ({ title }) => (
  <div className="col-span-1 md:col-span-2 mt-4 mb-2">
    <h3 className="text-lg font-bold text-gray-800 border-b-2 border-blue-500 pb-2">
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
        className="w-full px-3 py-2 border rounded focus:outline-none"
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

const FPOForm = ({ formik }) => {
  const {
    fetchPrimaryCommunicationChannels,
    fetchKeyBuyerTypes,
    fetchMemberCategories,
    fetchMajorRevenueSources,
    primaryCommunicationChannels,
    keyBuyerTypes,
    memberCategories,
    majorRevenueSources,
  } = useEnviroIndividualDrop();

  useEffect(() => {
    fetchPrimaryCommunicationChannels();
    fetchKeyBuyerTypes();
    fetchMemberCategories();
    fetchMajorRevenueSources();
  }, []);

  return (
    <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
      {/* <SectionHeading title="General Information" />
      <FormField
        name="leadOwner"
        label="Lead Owner"
        formik={formik}
        placeholder="Enter lead owner"
      /> */}
      {/* <FormField
        name="productName"
        label="Product Name"
        formik={formik}
        placeholder="Enter product name"
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
      /> */}

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
        className="col-span-1 md:col-span-2"
      />
      <FormField
        name="officialContactNumber"
        label="7. Official Contact Number"
        formik={formik}
        placeholder="Enter Contact Number"
      />
      <FormField
        name="officialEmailId"
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

      <SectionHeading title="SECTION 2: Governance & Staffing" />
      <FormField
        name="numberOfBoardMembers"
        label="10. Number of Board Members"
        formik={formik}
        placeholder="Enter Number"
        type="number"
      />
      <FormField
        name="numberOfStaffMembers"
        label="11. Number of Staff Members"
        formik={formik}
        placeholder="Enter Number"
        type="number"
      />

      <SectionHeading title="SECTION 3: Member Profile & Engagement" />
      <FormField
        name="totalActiveMembers"
        label="12. Total Farmer Members"
        formik={formik}
        placeholder="Enter Total Members"
        type="number"
      />
      <CheckboxGroup
        name="memberCategories"
        label="13. Member Categories"
        options={(memberCategories || []).map((item) => ({
          label: item,
          value: item,
        }))}
        formik={formik}
      />
      {formik.values.memberCategories?.includes("Others") && (
        <FormField
          name="memberCategoriesOthers"
          label="Please specify other category"
          formik={formik}
          placeholder="Enter other category"
          className="col-span-1 md:col-span-2"
        />
      )}
      <CheckboxGroup
        name="primaryCommunicationChannels"
        label="14. Primary Communication Channels"
        options={(primaryCommunicationChannels || []).map((item) => ({
          label: item,
          value: item,
        }))}
        formik={formik}
      />

      <SectionHeading title="SECTION 4: Services & Business Operations" />
      <FormField
        name="majorCropsHandled"
        label="15. Major Crops Handled"
        formik={formik}
        placeholder="Enter major crops"
        className="col-span-1 md:col-span-2"
      />

      <SectionHeading title="SECTION 5: Finance & Member Benefits" />
      <FormField
        name="annualTurnover"
        label="16. Annual Turnover"
        formik={formik}
        placeholder="Enter annual turnover"
      />
      <CheckboxGroup
        name="majorRevenueSources"
        label="17. Major Revenue Sources"
        options={(majorRevenueSources || []).map((item) => ({
          label: item,
          value: item,
        }))}
        formik={formik}
      />
      {formik.values.majorRevenueSources?.includes("Others") && (
        <FormField
          name="majorRevenueSourcesOthers"
          label="Please specify other source"
          formik={formik}
          placeholder="Enter other source"
          className="col-span-1 md:col-span-2"
        />
      )}

      <SectionHeading title="SECTION 6: Partnerships & Market Linkages" />
      <CheckboxGroup
        name="keyBuyerTypes"
        label="18. Key Buyer Types"
        options={(keyBuyerTypes || []).map((item) => ({
          label: item,
          value: item,
        }))}
        formik={formik}
      />

      <SectionHeading title="SECTION 7: Innovation & Future Planning" />
      <FormField
        name="topChallenges"
        label="19. Top Challenges"
        formik={formik}
        placeholder="Enter top challenges"
        className="col-span-1 md:col-span-2"
      />
      <FormField
        name="topPriorities"
        label="20. Top Priorities"
        formik={formik}
        placeholder="Enter top priorities"
        className="col-span-1 md:col-span-2"
      />
    </div>
  );
};

export default FPOForm;
