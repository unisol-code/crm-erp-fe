import React, { useEffect } from "react";
import { getIn } from "formik";
import ReactSelect from "react-select";
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

// SearchableMultiSelect Component
const SearchableMultiSelect = ({ label, name, options, formik, placeholder = "Select options..." }) => {
  const value = getIn(formik.values, name) || [];
  const error = getIn(formik.errors, name);
  const touched = getIn(formik.touched, name);

  const selectedOptions = (options || []).filter(opt => value.includes(opt.value));

  const handleChange = (selected) => {
    const values = selected ? selected.map(opt => opt.value) : [];
    formik.setFieldValue(name, values);
  };

  return (
    <div className="mb-4 col-span-1 md:col-span-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <ReactSelect
        isMulti
        name={name}
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        onBlur={() => formik.setFieldTouched(name, true)}
        placeholder={placeholder}
        classNamePrefix="react-select"
        className="basic-multi-select"
        styles={{
          control: (base) => ({
            ...base,
            borderColor: error && touched ? '#ef4444' : '#d1d5db',
            '&:hover': {
              borderColor: '#3b82f6'
            },
            borderRadius: '0.375rem',
            boxShadow: 'none',
            minHeight: '42px'
          }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: '#eff6ff',
            borderRadius: '0.25rem',
          }),
          multiValueLabel: (base) => ({
            ...base,
            color: '#1e40af',
            fontWeight: '500',
          }),
          multiValueRemove: (base) => ({
            ...base,
            color: '#3b82f6',
            '&:hover': {
              backgroundColor: '#dbeafe',
              color: '#1d4ed8',
            },
          }),
          menu: (base) => ({
            ...base,
            zIndex: 50
          })
        }}
      />
      {error && touched && (
        <div className="text-red-500 text-xs mt-1">{error}</div>
      )}
    </div>
  );
};

const FpoForm = ({ formik }) => {
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
      <SearchableMultiSelect
        name="memberCategories"
        label="13. Member Categories"
        placeholder="Select Member Categories"
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
      <SearchableMultiSelect
        name="primaryCommunicationChannels"
        label="14. Primary Communication Channels"
        placeholder="Select Communication Channels"
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
      <SearchableMultiSelect
        name="majorRevenueSources"
        label="17. Major Revenue Sources"
        placeholder="Select Revenue Sources"
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
      <SearchableMultiSelect
        name="keyBuyerTypes"
        label="18. Key Buyer Types"
        placeholder="Select Buyer Types"
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

export default FpoForm;
