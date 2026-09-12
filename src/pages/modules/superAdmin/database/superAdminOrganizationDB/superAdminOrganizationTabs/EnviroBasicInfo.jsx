import React, { useEffect, useState } from "react";
import useDropdown from "../../../../../../hooks/dropdown/useDropdown";
import useEnviroAdminIndDB from "../../../../../../hooks/superAdminHook/superAdmindatabase/enviroDB/useEnviroAdminIndDB";
import ReactSelect from "react-select";
import _ from "lodash";

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

const Select = ({
  label,
  name,
  formik,
  options,
  loading,
  placeholder,
  isReadOnly = false,
  onChange,
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
        <span className="text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
};

const EnviroBasicInfo = ({ formik, isReadOnly = false }) => {
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

  const {
    fetchEnviroSalesPersonsList,
    salesPersonList,
  } = useEnviroAdminIndDB();

  useEffect(() => {
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
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-6">BASIC INFORMATION</h1>
      <div className="p-6 pt-0 bg-white rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-11">
          <Input
            label="Organization Name"
            name="organizationName"
            formik={formik}
            placeholder="Enter Organization Name"
            isReadOnly={isReadOnly}
          />
          <Select
            label="Region"
            name="region"
            formik={formik}
            isReadOnly={isReadOnly}
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
              formik.setFieldValue("stateName", "");
              formik.setFieldValue("districtName", "");
              formik.setFieldValue("cityTownVillage", "");
              fetchAllStateName(val || "");
            }}
          />
          <Select
            label="State"
            name="stateName"
            formik={formik}
            isReadOnly={isReadOnly}
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
              formik.setFieldValue("stateName", val || "");
              setSelectedStateCode(
                allStateName?.find((s) => (s.name || s.stateName) === val)
                  ?.stateCode || ""
              );
              formik.setFieldValue("districtName", "");
              formik.setFieldValue("cityTownVillage", "");
              handleSelectDistrict(val || "");
            }}
          />
          <Select
            label="District"
            name="districtName"
            formik={formik}
            isReadOnly={isReadOnly}
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
              formik.setFieldValue("districtName", val || "");
              formik.setFieldValue("cityTownVillage", "");
              handleSelectCity(val || "");
            }}
          />
          <Select
            label="City"
            name="cityTownVillage"
            formik={formik}
            isReadOnly={isReadOnly}
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
          <Input
            label="Pincode"
            name="pincode"
            formik={formik}
            placeholder="Enter Pincode"
            isReadOnly={isReadOnly}
          />
          <Input
            label="Landmark"
            name="landmark"
            formik={formik}
            placeholder="Enter Landmark"
            isReadOnly={isReadOnly}
          />
          <Input
            label="Full Address"
            name="officeAddress"
            formik={formik}
            placeholder="Enter Full Address"
            isReadOnly={isReadOnly}
          />
          <Input
            label="Official Contact Number"
            name="officialContactNumber"
            formik={formik}
            placeholder="Enter Contact Number"
            type="tel"
            isReadOnly={isReadOnly}
          />
          <Input
            label="Email Address"
            name="officialEmail"
            formik={formik}
            placeholder="Enter Email Address"
            type="email"
            isReadOnly={isReadOnly}
          />
                    <Select
            label="Assign Sales Person"
            name="salesId"
            formik={formik}
            isReadOnly={isReadOnly}
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
      </div>
    </div>
  );
};

export default EnviroBasicInfo;