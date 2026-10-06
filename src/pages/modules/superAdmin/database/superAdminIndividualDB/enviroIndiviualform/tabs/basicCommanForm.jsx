import React, { useEffect, useRef, useState } from "react";
import { getIn } from "formik";
import ReactSelect from "react-select";
import useDropdown from "../../../../../../../hooks/dropdown/useDropdown";
import useEnviroAdminIndDB from "../../../../../../../hooks/superAdminHook/superAdmindatabase/enviroDB/useEnviroAdminIndDB";
import useEnviroIndividualDrop from "../../../../../../../hooks/superAdminHook/superAdmindatabase/enviroDB/useEnviroIndividualDrop";
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

const Select = ({
  label,
  name,
  formik,
  options,
  loading,
  placeholder,
  onChange,
  isDisabled = false,
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
        isDisabled={isDisabled}
        onChange={(selected) => {
          formik.setFieldValue(name, selected?.value || "");
          if (onChange) onChange(selected?.value || "");
        }}
        onBlur={() => formik.setFieldTouched(name, true)}
        placeholder={placeholder || `Select ${label}`}
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

const BasicCommonForm = ({ formik }) => {
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
    fetchEnviroOrganizationName,
    enviroOrganizationName,
  } = useEnviroIndividualDrop();

  // Sales persons list (same source as the Farmers tab: name -> label, _id -> value)
  const {
    fetchEnviroSalesPersonsList,
    salesPersonList,
  } = useEnviroAdminIndDB();

  const organizationNameOptions = Array.isArray(enviroOrganizationName)
    ? enviroOrganizationName.map((item) => {
        const name = item?.name || item?.organizationName || item;
        return { label: name, value: name };
      })
    : [];

  useEffect(() => {
    fetchAllRegion();
    fetchAllStateName();
    fetchEnviroSalesPersonsList();
  }, []);

  // The Segment is chosen once in the parent form's "Fragment" dropdown, which
  // writes straight into `formik.values.segment` - so it is not repeated here.
  // This form only reacts to it: reload the organization list for that segment and
  // drop an organization picked under the previous segment.
  useEffect(() => {
    fetchEnviroOrganizationName(formik.values.segment || "");
  }, [formik.values.segment]);

  // Changing segment must invalidate the chosen organization. The first pass is
  // skipped on purpose: in edit mode the record hydrates `segment` and
  // `orgnizationName` together, so clearing there would wipe the saved value.
  const previousSegmentRef = useRef(undefined);

  useEffect(() => {
    const currentSegment = formik.values.segment || "";
    if (previousSegmentRef.current === undefined) {
      previousSegmentRef.current = currentSegment;
      return;
    }
    if (previousSegmentRef.current !== currentSegment) {
      previousSegmentRef.current = currentSegment;
      formik.setFieldValue("orgnizationName", "");
    }
  }, [formik.values.segment]);

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

      {/* Associated with Organization */}
      <SectionHeading title="Associated with Organization" />
      <Select
        label="Organization Name"
        name="orgnizationName"
        formik={formik}
        options={organizationNameOptions}
        loading={locationLoading}
        placeholder={
          !formik.values.segment
            ? "Select Fragment first"
            : "Select Organization Name"
        }
        isDisabled={!formik.values.segment}
      />

      {/* Address Details */}
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
          formik.setFieldValue("villageName", "");
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
          formik.setFieldValue("villageName", "");
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
          formik.setFieldValue("villageName", "");
          handleSelectCity(val || "");
        }}
      />
      <Select
        label="City/Town/Village"
        name="villageName"
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
        name="address"
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
      {/* Sales Person (stored in formik.values.salesId, same as the Farmers tab) */}
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

export default BasicCommonForm;