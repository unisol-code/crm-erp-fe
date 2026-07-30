import React, { useEffect, useState } from "react";
import useDropdown from "../../../../../../hooks/dropdown/useDropdown";
import ReactSelect from "react-select";
import _ from "lodash";

// --- Input Component ---
const Input = ({
  label,
  name,
  formik,
  type = "text",
  placeholder,
  isReadOnly = false,
}) => {
  const value = _.get(formik.values, name, "");
  const touched = _.get(formik.touched, name, false);
  const error = _.get(formik.errors, name, "");

  return (
    <div className="flex flex-col w-full mb-4">
      <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder={placeholder}
        disabled={isReadOnly}
        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300
          ${touched && error ? "border-red-500" : "border-[#556581]"}
          ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
      />
      {touched && error && (
        <span className="text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
};

// --- Select Component ---
const Select = ({
  label,
  name,
  formik,
  options,
  loading,
  placeholder,
  isReadOnly = false,
  onChange, // Optional custom onChange
}) => {
  const value = _.get(formik.values, name, "");
  const touched = _.get(formik.touched, name, false);
  const error = _.get(formik.errors, name, "");

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
        onChange={(selected) => {
          formik.setFieldValue(name, selected?.value || "");
          if (onChange) onChange(selected?.value || "");
        }}
        onBlur={() => formik.setFieldTouched(name, true)}
        placeholder={`Select ${label}`}
        classNamePrefix="react-select"
        isDisabled={isReadOnly}
      />
      {touched && error && (
        <span className="text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
};
const BasicInfo = ({ formik, isReadOnly = false }) => {
  const [isGovt, setIsGovt] = useState(false);
  const [selectedStateCode, setSelectedStateCode] = useState("");
  const {
    fetchSpeciality,
    speciality,
    loading,
    fetchLegalEntity,
    legalEntity,
    fetchOrganizationTypes,
    organizationTypes,
    fetchHospitalTypes,
    hospitalTypes,
    segmentState,
    segment,
    fetchAllRegion,
    region,
    fetchAllStateName,
    allStateName,
    fetchDistrictList,
    districtList,
    cities,
    fetchAllCities,
  } = useDropdown();

  useEffect(() => {
    fetchSpeciality();
    fetchOrganizationTypes();
    fetchHospitalTypes();
    segmentState();
    fetchAllRegion();
    fetchAllStateName();
  }, []);

  // Fetch Legal Entity only when "Govt" is selected and data is not already loaded
  useEffect(() => {
    const orgType = formik.values?.Basic?.typeOfOrgOrHospital;
    if (orgType === "Govt") {
      fetchLegalEntity();
    }
  }, [formik.values?.Basic?.typeOfOrgOrHospital]);

  const handleselectDistrict = (stateCode) => {
    if (stateCode) {
      fetchDistrictList(stateCode);
    }
  };

  const handleSelectCity = (districtCode, stateCode) => {
    const sCode = stateCode || selectedStateCode;
    if (districtCode && sCode) {
      fetchAllCities(sCode, districtCode);
    }
  };

  // ✅ Auto-fetch districts and cities when editing/viewing
  useEffect(() => {
    const stateName = formik.values?.Basic?.state;
    if (stateName) {
      const matchedState = allStateName?.find((s) => s.stateName === stateName);
      if (matchedState) {
        setSelectedStateCode(matchedState.stateCode);
        fetchDistrictList(matchedState.stateCode);
      }
    }
  }, [formik.values?.Basic?.state, allStateName]);

  useEffect(() => {
    const stateName = formik.values?.Basic?.state;
    const district = formik.values?.Basic?.district;
    if (stateName && district && selectedStateCode) {
      fetchAllCities(selectedStateCode, district);
    }
  }, [formik.values?.Basic?.state, formik.values?.Basic?.district, selectedStateCode]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-6">
        BASIC ORGANIZATIONAL INFORMATION
      </h1>
      <div className="p-6 pt-0 bg-white rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-11">
          <Select
            label="Segment"
            name="Basic.segment"
            formik={formik}
            isReadOnly={isReadOnly}
            options={
              Array.isArray(segment)
                ? segment.map((seg) => ({
                  label: seg,
                  value: seg,
                }))
                : []
            }
          />
          <Input
            label="Organization Name"
            name="Basic.hospitalName"
            formik={formik}
            placeholder="organization Name"
            isReadOnly={isReadOnly}
          />
          <Select
            label="Type of Hospital"
            name="Basic.typeOfHospital"
            formik={formik}
            isReadOnly={isReadOnly}
            options={
              Array.isArray(hospitalTypes)
                ? hospitalTypes.map((type) => ({
                  label: type,
                  value: type,
                }))
                : []
            }
          />
          <Select
            label="Organization Type"
            name="Basic.typeOfOrgOrHospital"
            isReadOnly={isReadOnly}
            formik={formik}
            options={
              Array.isArray(organizationTypes)
                ? organizationTypes.map((type) => ({
                  label: type,
                  value: type,
                }))
                : []
            }
          />

          {formik.values?.Basic?.typeOfOrgOrHospital === "Govt" && (
            <Select
              label="If Govt (Legal Entity Type)"
              name="Basic.ifGovt"
              isReadOnly={isReadOnly}
              formik={formik}
              options={legalEntity || []}
              loading={loading}
            />
          )}

          <Select
            label="State"
            name="Basic.state"
            isReadOnly={isReadOnly}
            formik={formik}
            options={
              Array.isArray(allStateName)
                ? allStateName.map((state) => ({
                    label: state.stateName,
                    value: state.stateName,
                  }))
                : []
            }
            onChange={(val) => {
              formik.setFieldValue("Basic.state", val || "");
              const matchedState = allStateName?.find((s) => s.stateName === val);
              setSelectedStateCode(matchedState?.stateCode || "");
              handleselectDistrict(matchedState?.stateCode || "");
            }}
          />

          <Select
            label="District"
            name="Basic.district"
            isReadOnly={isReadOnly}
            formik={formik}
            options={
              Array.isArray(districtList)
                ? districtList.map((district) => ({
                  label: district,
                  value: district,
                }))
                : []
            }
            onChange={(val) => {
              handleSelectCity(val);
            }}
          />

          <Select
            label="Region"
            name="Basic.region"
            isReadOnly={isReadOnly}
            formik={formik}
            options={
              Array.isArray(region)
                ? region.map((reg) => ({
                  label: reg,
                  value: reg,
                }))
                : []
            }
          />
          <Select
            label="City"
            name="Basic.city"
            isReadOnly={isReadOnly}
            formik={formik}
            options={
              Array.isArray(cities)
                ? cities.map((city) => ({
                  label: city,
                  value: city,
                }))
                : []
            }
          />
          <Input
            label="Email Address"
            name="Basic.emailAddress"
            type="email"
            formik={formik}
            isReadOnly={isReadOnly}
            placeholder="example@hospital.com"
          />
          <Input
            label="Full Address"
            name="Basic.address"
            formik={formik}
            isReadOnly={isReadOnly}
            placeholder="123 Street Name, Area"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;
