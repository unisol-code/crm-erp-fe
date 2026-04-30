import React, { useEffect, useState } from "react";
import useDropdown from "../../../../../../hooks/dropdown/useDropdown";
import ReactSelect from "react-select";
import { values } from "lodash";

const Input = ({ label, name, formik, type = "text", placeholder ,isReadOnly = false}) => {
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
  const inputValue =
    type === "date" && value instanceof Date
      ? value.toISOString().split("T")[0]
      : value;

  return (
    <div className="flex flex-col w-full mb-4">
      <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        disabled={isReadOnly}
        placeholder={placeholder}
        value={inputValue || ""}
        onChange={(e) => {
          if (type === "number") {
            const numValue =
              e.target.value === "" ? "" : Number(e.target.value);
            formik.setFieldValue(name, isNaN(numValue) ? "" : numValue);
          } else if (type === "date") {
            formik.setFieldValue(
              name,
              e.target.value ? new Date(e.target.value) : ""
            );
          } else {
            formik.handleChange(e);
          }
        }}
        onBlur={formik.handleBlur}
        className={`no-spinner border ${
          touched && error ? "border-red-500" : "border-gray-300"
        } rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}
      />
      {touched && error && (
        <span className="text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
};

const Select = ({
  label,
  name,
  formik,
  options,
  loading = false,
  onChange,
  isReadOnly = false,
}) => {
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
        onChange={(selected) => {
          // always update formik value
          formik.setFieldValue(name, selected?.value || "");

          // call custom onChange if passed
          if (onChange) {
            onChange(selected);
          }
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
const BasicInfo = ({ formik ,isReadOnly = false}) => {
  const [isGovt, setIsGovt] = useState(false);
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
    cities,
    fetchAllCities,
  } = useDropdown();

  useEffect(() => {
    fetchSpeciality();
    fetchLegalEntity();
    fetchOrganizationTypes();
    fetchHospitalTypes();
    segmentState();
    fetchAllRegion();
    fetchAllStateName();
  }, []);

  const handleSelectCity = (stateCode) => {
    if (stateCode) {
      fetchAllCities(stateCode);
    }
  };

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
            label="Hospital / Organization Name"
            name="Basic.hospitalName"
            formik={formik}
            placeholder="Enter Hospital /  organization Name"
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
            />
          )}

          <Input
            label="Address"
            name="Basic.address"
            formik={formik}
            isReadOnly={isReadOnly}
            placeholder="Enter Address"
          />
          <Input
            label="District"
            name="Basic.district"
            formik={formik}
            isReadOnly={isReadOnly}
            placeholder="Enter District"
          />
          <Select
            label="State"
            name="Basic.state"
            formik={formik}
            isReadOnly={isReadOnly}
            options={
              Array.isArray(allStateName)
                ? allStateName.map((type) => ({
                    label: type.stateName,
                    value: type.stateCode,
                  }))
                : []
            }
            onChange={(selectedOption) =>
              handleSelectCity(selectedOption.value)
            }
          />

          <Select
            label="City"
            name="Basic.city"
            formik={formik}
            isReadOnly={isReadOnly}
            isDisabled={!formik.values?.Basic?.state}
            options={
              Array.isArray(cities)
                ? cities.map((city) => ({
                    label: city,
                    value: city,
                  }))
                : []
            }
          />

          <Select
            label="region"
            name="Basic.region"
            formik={formik}
            isReadOnly={isReadOnly}
            options={
              Array.isArray(region)
                ? region.map((type) => ({
                    label: type,
                    value: type,
                  }))
                : []
            }
          />

          <Input
            label="Email Address"
            name="Basic.emailAddress"
            formik={formik}
            isReadOnly={isReadOnly}
            placeholder="Enter Email Address"
          />
          
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;
