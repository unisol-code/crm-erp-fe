import React, { useEffect, useRef, useState } from "react";
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

  // Helpers that tolerate the API sending a location list in any of the shapes
  // it has used historically - an array of strings ("Maharashtra"), an array of
  // objects ({ name } / { stateName } ...), or an object keyed by value.
  // Without this, one odd list silently empties the whole dropdown chain.
  const toNameList = (list) => {
    if (Array.isArray(list)) return list;
    if (list && typeof list === "object") return Object.values(list);
    return [];
  };

  const locationNameOf = (entry) => {
    if (typeof entry === "string") return entry;
    if (entry && typeof entry === "object") {
      const picked =
        entry.name ||
        entry.stateName ||
        entry.districtName ||
        entry.district ||
        entry.city ||
        entry.cityName ||
        entry.town ||
        entry.village ||
        entry.cityTownVillage ||
        entry.label ||
        entry.title ||
        entry.value ||
        "";
      if (typeof picked === "string") return picked;
      if (picked && typeof picked === "object") return locationNameOf(picked);
    }
    return "";
  };

  const locationCodeOf = (entry) =>
    (entry && typeof entry === "object" && (entry.code || entry.stateCode)) ||
    "";

  const ensureCurrentOption = (options, current) => {
    const normalizedCurrent = (current ?? "").toString().trim();
    if (!normalizedCurrent) return options;
    return options.some((opt) => opt.value === normalizedCurrent)
      ? options
      : [{ label: normalizedCurrent, value: normalizedCurrent }, ...options];
  };

  const handleSelectDistrict = (stateCode) => {
    if (stateCode) {
      fetchDistrictList(stateCode);
    }
  };

  const handleSelectCity = (districtCode) => {
    if (districtCode && selectedStateCode) {
      fetchAllCities(selectedStateCode, districtCode);
    }
  };

  // Auto-fetch districts + cities when a record is opened in edit/view mode.
  // Mirrors the FarmerForm cascade: districts key off the state NAME,
  // cities key off the state CODE (resolved from the fetched state list) + district.
  //
  // Region scoping matters: `allStateName` is refreshed per region whenever the
  // user picks one, so on an edit this list may contain only the record's own
  // region (or still be empty while it loads). When the record's state is not
  // in the list we re-fetch the record's region before giving up - otherwise
  // State/District/City all stay blank.
  // The refill runs once per region. A manual region change needs no help -
  // its onChange already fetches states and clears `stateName`.
  const fetchedRegionRef = useRef("");
  const stateName = formik.values?.stateName;
  const district = formik.values?.districtName;
  const recordRegion = formik.values?.region;

  useEffect(() => {
    if (!stateName || !recordRegion) return;
    const found = toNameList(allStateName).some(
      (s) => locationNameOf(s) === stateName
    );
    if (!found && fetchedRegionRef.current !== recordRegion) {
      fetchedRegionRef.current = recordRegion;
      fetchAllStateName(recordRegion);
    }
  }, [stateName, recordRegion, allStateName]);

  useEffect(() => {
    if (stateName) {
      const selectedState = toNameList(allStateName)?.find(
        (s) => locationNameOf(s) === stateName
      );
      if (selectedState) {
        const fetchedCode = locationCodeOf(selectedState);
        if (fetchedCode) setSelectedStateCode(fetchedCode);
        handleSelectDistrict(stateName);
      }
    }
  }, [stateName, allStateName]);

  useEffect(() => {
    if (stateName && district && selectedStateCode) {
      fetchAllCities(selectedStateCode, district);
    }
  }, [stateName, district, selectedStateCode]);

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
            options={ensureCurrentOption(
              toNameList(region).map((reg) => ({
                label: locationNameOf(reg),
                value: locationNameOf(reg),
              })),
              formik.values.region
            )}
            loading={locationLoading}
            onChange={(val) => {
              formik.setFieldValue("region", val || "");
              formik.setFieldValue("stateName", "");
              formik.setFieldValue("districtName", "");
              formik.setFieldValue("cityTownVillage", "");
              setSelectedStateCode("");
              fetchAllStateName(val || "");
            }}
          />
          <Select
            label="State"
            name="stateName"
            formik={formik}
            isReadOnly={isReadOnly}
            options={ensureCurrentOption(
              toNameList(allStateName).map((state) => ({
                label: locationNameOf(state),
                value: locationNameOf(state),
                stateCode: locationCodeOf(state),
              })),
              formik.values.stateName
            )}
            loading={locationLoading}
            onChange={(val) => {
              formik.setFieldValue("stateName", val || "");
              const selectedState = toNameList(allStateName)?.find(
                (s) => locationNameOf(s) === val
              );
              setSelectedStateCode(locationCodeOf(selectedState));
              formik.setFieldValue("districtName", "");
              formik.setFieldValue("cityTownVillage", "");
              // Districts are fetched by the effect that watches `stateName`
              // (single source of truth) - do not fetch here too.
            }}
          />
          <Select
            label="District"
            name="districtName"
            formik={formik}
            isReadOnly={isReadOnly}
            options={ensureCurrentOption(
              toNameList(districtList).map((district) => ({
                label: locationNameOf(district),
                value: locationNameOf(district),
              })),
              formik.values.districtName
            )}
            loading={locationLoading}
            onChange={(val) => {
              formik.setFieldValue("districtName", val || "");
              formik.setFieldValue("cityTownVillage", "");
              // Cities are fetched by the effect that watches `districtName`
              // (single source of truth) - do not fetch here too.
            }}
          />
          <Select
            label="City"
            name="cityTownVillage"
            formik={formik}
            isReadOnly={isReadOnly}
            options={ensureCurrentOption(
              toNameList(cities).map((city) => ({
                label: locationNameOf(city),
                value: locationNameOf(city),
              })),
              formik.values.cityTownVillage
            )}
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