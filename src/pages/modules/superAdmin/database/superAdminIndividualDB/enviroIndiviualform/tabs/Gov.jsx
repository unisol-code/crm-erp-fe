import React, { useEffect, useState } from "react";
import { getIn } from "formik";
import ReactSelect from "react-select";
import useEnviroIndividualDrop from "../../../../../../../hooks/superAdminHook/superAdmindatabase/enviroDB/useEnviroIndividualDrop";
import useDropdown from "../../../../../../../hooks/dropdown/useDropdown";
import useEnviroAdminIndDB from "../../../../../../../hooks/superAdminHook/superAdmindatabase/enviroDB/useEnviroAdminIndDB";
import _ from "lodash";

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

// Select Component for Dropdown
const Select = ({
  label,
  name,
  formik,
  options,
  loading,
  placeholder,
  onChange,
}) => {
  const value = getIn(formik.values, name, "");
  const touched = getIn(formik.touched, name, false);
  const error = getIn(formik.errors, name, "");

  const selectOptions = options.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt
  );
  const selectedOption =
    selectOptions.find((opt) => opt.value === value) || null;

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <ReactSelect
        options={selectOptions}
        isLoading={loading}
        name={name}
        value={selectedOption}
        onChange={(selected) => {
          formik.setFieldValue(name, selected?.value || "");
          if (onChange) onChange(selected?.value || "");
        }}
        onBlur={() => formik.setFieldTouched(name, true)}
        placeholder={`Select ${label}`}
        classNamePrefix="react-select"
        styles={{
          control: (base, state) => ({
            ...base,
            minHeight: "50px",
            borderRadius: "0.5rem",
            borderColor: state.isFocused ? "#60A5FA" : "#556581",
            boxShadow: state.isFocused ? "0 0 0 2px #60A5FA" : "none",
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
      {touched && error && (
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

  const {
    fetchEnviroSalesPersonsList,
    salesPersonList,
  } = useEnviroAdminIndDB();

  const [selectedStateCode, setSelectedStateCode] = useState("");
  const {
    fetchAllRegion,
    region,
    allStateName,
    fetchAllCities,
    cities,
    loading: locationLoading,
    fetchAllStateName,
    fetchDistrictList,
    districtList,
  } = useDropdown();

  useEffect(() => {
    fetchFrequentlyRequestedServices();
    fetchDataManagementTools();
    fetchAllRegion();
    fetchAllStateName();
    fetchEnviroSalesPersonsList();
  }, []);

  const handleSelectDistrict = (stateCode) => {
    if (stateCode) {
      fetchDistrictList(stateCode);
    }
  };

  const handleSelectCity = (districtCode) => {
    if (districtCode) {
      fetchAllCities(selectedStateCode, districtCode);
    }
  };

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
        label="1. Department Name"
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
        name="orgnizationName"
        label="3. Orgnization Name "
        formik={formik}
        placeholder="Enter Orgnization Name "
      />
      <FormField
        name="districtBlockRegion"
        label="4. District / Block / Region Covered"
        formik={formik}
        placeholder="Enter Coverage Area"
      />
      
      {/* Address Details - Cascading Dropdowns */}
      <SectionHeading title="Address Details" />
      <Select
        label="Region"
        name="region"
        formik={formik}
        options={
          Array.isArray(region)
            ? region.map((reg) => ({
                label: reg.name || reg,
                value: reg.name || reg,
              }))
            : []
        }
        loading={locationLoading}
        onChange={(val) => {
          formik.setFieldValue("region", val || "");
          formik.setFieldValue("state", "");
          formik.setFieldValue("district", "");
          formik.setFieldValue("city", "");
          fetchAllStateName(val || "");
        }}
      />
      <Select
        label="State"
        name="state"
        formik={formik}
        options={
          Array.isArray(allStateName)
            ? allStateName.map((state) => ({
                label: state.name || state.stateName,
                value: state.name || state.stateName,
                stateCode: state.code || state.stateCode,
              }))
            : []
        }
        loading={locationLoading}
        onChange={(val) => {
          formik.setFieldValue("state", val || "");
          const selectedState = allStateName?.find(
            (s) => (s.name || s.stateName) === val
          );
          setSelectedStateCode(selectedState?.code || selectedState?.stateCode || "");
          formik.setFieldValue("district", "");
          formik.setFieldValue("city", "");
          handleSelectDistrict(val || "");
        }}
      />
      <Select
        label="District"
        name="district"
        formik={formik}
        options={
          Array.isArray(districtList)
            ? districtList.map((district) => ({
                label: district,
                value: district,
              }))
            : []
        }
        loading={locationLoading}
        onChange={(val) => {
          formik.setFieldValue("district", val || "");
          formik.setFieldValue("city", "");
          handleSelectCity(val || "");
        }}
      />
      <Select
        label="City/Town/Village"
        name="city"
        formik={formik}
        options={
          Array.isArray(cities)
            ? cities.map((city) => ({
                label: city,
                value: city,
              }))
            : []
        }
        loading={locationLoading}
      />
      <FormField
        name="officeAddress"
        label="Full Address"
        formik={formik}
        placeholder="Enter full address"
      />
      <FormField
        name="pinCode"
        label="Pin Code"
        formik={formik}
        type="text"
        placeholder="Enter 6-digit pincode"
      />

      <RadioGroup
        name="yearsOfExperience"
        label="5. Years of Experience in the Agriculture Department"
        options={[
          { label: "Less than 5 years", value: "Less than 5 years" },
          { label: "5–10 years", value: "5–10 years" },
          { label: "More than 10 years", value: "More than 10 years" },
        ]}
        formik={formik}
      />
      <SectionHeading title="Section B: Farmer Interaction & Communication" />
      <SearchableMultiSelect
        name="frequentlyRequestedServices"
        label="7. Frequently requested services"
        placeholder="Select Services"
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
      <SearchableMultiSelect
        name="dataManagementTools"
        label="14. Tools used for farmer data management"
        placeholder="Select Tools"
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
<FormField
        name="commentBox"
        label="Comment Box"
        formik={formik}
        placeholder="Enter any comments"
      />
      <Select
        label="Sales Person"
        name="salesId"
        formik={formik}
        options={
          Array.isArray(salesPersonList)
            ? salesPersonList.map((person) => ({
                label: person.name,
                value: person._id,
              }))
            : []
        }
        loading={false}
      />
    </div>
  );
};

export default GovForm;