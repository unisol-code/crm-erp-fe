
import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";
import _ from "lodash";
import useDropdown from "../../../../../../hooks/dropdown/useDropdown";

// Normalize options returned by different APIs.
const normalizeOptions = (options = []) => {
  if (!Array.isArray(options)) return [];

  return options.map((item) => {
    if (typeof item === "string" || typeof item === "number") {
      return {
        label: String(item),
        value: String(item),
      };
    }

    const label =
      item?.label ??
      item?.name ??
      item?.stateName ??
      item?.districtName ??
      item?.cityName ??
      item?.type ??
      item?.organizationType ??
      item?.title ??
      item?.value ??
      "";

    const value =
      item?.value ??
      item?.name ??
      item?.stateName ??
      item?.districtName ??
      item?.cityName ??
      item?.type ??
      item?.organizationType ??
      item?.label ??
      item?.title ??
      "";

    return {
      ...item,
      label: String(label),
      value: String(value),
    };
  });
};

const normalizeText = (value) =>
  String(value ?? "").trim().toLowerCase();

const getStateName = (state) =>
  typeof state === "string"
    ? state
    : state?.name ?? state?.stateName ?? state?.label ?? "";

const getStateCode = (state) =>
  state?.code ??
  state?.stateCode ??
  state?.state_code ??
  state?.value ??
  "";

const getDistrictName = (district) =>
  typeof district === "string"
    ? district
    : district?.districtName ??
      district?.name ??
      district?.label ??
      district?.value ??
      "";

const getCityName = (city) =>
  typeof city === "string"
    ? city
    : city?.cityName ??
      city?.name ??
      city?.label ??
      city?.value ??
      "";

// Input component
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
    <div className="mb-4 flex w-full flex-col">
      <label className="mb-1 text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder={placeholder}
        disabled={isReadOnly}
        className={`w-full rounded-md border px-4 py-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          touched && error ? "border-red-500" : "border-[#556581]"
        } ${
          isReadOnly
            ? "cursor-not-allowed bg-gray-100"
            : "bg-white"
        }`}
      />

      {touched && error && (
        <span className="mt-1 text-xs text-red-500">{error}</span>
      )}
    </div>
  );
};

// Reusable Select component
const Select = ({
  label,
  name,
  formik,
  options = [],
  loading = false,
  placeholder,
  isReadOnly = false,
  onChange,
}) => {
  const value = _.get(formik.values, name, "");
  const touched = _.get(formik.touched, name, false);
  const error = _.get(formik.errors, name, "");

  const selectOptions = normalizeOptions(options);

  // Match by option value or label, ignoring letter case.
  const selectedOption = selectOptions.find(
    (option) =>
      normalizeText(option.value) === normalizeText(value) ||
      normalizeText(option.label) === normalizeText(value)
  );

  // Preserve the saved value even while dropdown options are loading.
  const displayedOption =
    selectedOption ||
    (value !== "" && value !== null && value !== undefined
      ? {
          label: String(value),
          value: String(value),
        }
      : null);

  return (
    <div className="mb-4 flex w-full flex-col">
      <label className="mb-1 text-sm font-medium text-gray-700">
        {label}
      </label>

      <ReactSelect
        options={selectOptions}
        value={displayedOption}
        isLoading={loading}
        isDisabled={isReadOnly}
        isClearable={!isReadOnly}
        name={name}
        placeholder={placeholder || `Select ${label}`}
        classNamePrefix="react-select"
        onChange={(selected) => {
          const selectedValue = selected?.value ?? "";

          formik.setFieldValue(name, selectedValue);

          if (onChange) {
            onChange(selectedValue);
          }
        }}
        onBlur={() => formik.setFieldTouched(name, true)}
      />

      {touched && error && (
        <span className="mt-1 text-xs text-red-500">{error}</span>
      )}
    </div>
  );
};

const BasicInfo = ({ formik, isReadOnly = false }) => {
  const [selectedStateCode, setSelectedStateCode] = useState("");

  const {
    fetchSpeciality,
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

  const basic = formik.values?.Basic ?? {};

  // Load dropdown data once.
  useEffect(() => {
    fetchSpeciality();
    fetchOrganizationTypes();
    fetchHospitalTypes();
    segmentState();
    fetchAllRegion();
  }, []);

  // Load states for the saved region, including View/Edit mode.
  useEffect(() => {
    if (basic.region) {
      fetchAllStateName(basic.region);
    }
  }, [basic.region]);

  // Resolve the saved state and load its districts.
  useEffect(() => {
    if (!basic.state || !Array.isArray(allStateName)) {
      return;
    }

    const matchedState = allStateName.find(
      (state) =>
        normalizeText(getStateName(state)) ===
        normalizeText(basic.state)
    );

    if (!matchedState) {
      return;
    }

    const stateCode = getStateCode(matchedState);

    if (stateCode !== "") {
      setSelectedStateCode(String(stateCode));
      fetchDistrictList(stateCode);
    }
  }, [basic.state, allStateName]);

  // Load cities after the saved district and district options are ready.
  useEffect(() => {
    if (
      !basic.district ||
      !selectedStateCode ||
      !Array.isArray(districtList)
    ) {
      return;
    }

    const matchedDistrict = districtList.find(
      (district) =>
        normalizeText(getDistrictName(district)) ===
        normalizeText(basic.district)
    );

    const districtName = matchedDistrict
      ? getDistrictName(matchedDistrict)
      : basic.district;

    if (districtName) {
      fetchAllCities(selectedStateCode, districtName);
    }
  }, [basic.district, selectedStateCode, districtList]);

  // Load legal entity options only for Government organizations.
  useEffect(() => {
    if (
      normalizeText(basic.typeOfOrgOrHospital) === "govt"
    ) {
      fetchLegalEntity();
    }
  }, [basic.typeOfOrgOrHospital]);

  // Region changes are user initiated: reset dependent fields.
  const handleRegionChange = (value) => {
    formik.setFieldValue("Basic.state", "");
    formik.setFieldValue("Basic.district", "");
    formik.setFieldValue("Basic.city", "");

    setSelectedStateCode("");

    if (value) {
      fetchAllStateName(value);
    }
  };

  // State changes reset district and city.
  const handleStateChange = (value) => {
    formik.setFieldValue("Basic.district", "");
    formik.setFieldValue("Basic.city", "");

    const matchedState = Array.isArray(allStateName)
      ? allStateName.find(
          (state) =>
            normalizeText(getStateName(state)) ===
            normalizeText(value)
        )
      : null;

    const stateCode = matchedState
      ? getStateCode(matchedState)
      : "";

    setSelectedStateCode(String(stateCode));

    if (stateCode !== "") {
      fetchDistrictList(stateCode);
    }
  };

  // District changes reset city; the city-loading effect fetches options.
  const handleDistrictChange = () => {
    formik.setFieldValue("Basic.city", "");
  };

  const stateOptions = (Array.isArray(allStateName)
    ? allStateName
    : []
  ).map((state) => {
    const name = getStateName(state);

    return {
      label: String(name),
      value: String(name),
    };
  });

  const districtOptions = (Array.isArray(districtList)
    ? districtList
    : []
  ).map((district) => {
    const name = getDistrictName(district);

    return {
      label: String(name),
      value: String(name),
    };
  });

  const cityOptions = (Array.isArray(cities) ? cities : []).map(
    (city) => {
      const name = getCityName(city);

      return {
        label: String(name),
        value: String(name),
      };
    }
  );

  return (
    <div className="p-4">
      <h1 className="mb-6 text-xl font-semibold">
        BASIC ORGANIZATIONAL INFORMATION
      </h1>

      <div className="rounded-md bg-white p-6 pt-0">
        <div className="grid grid-cols-1 gap-x-11 md:grid-cols-2">
          <Select
            label="Segment"
            name="Basic.segment"
            formik={formik}
            isReadOnly={isReadOnly}
            options={segment || []}
          />

          <Input
            label="Organization Name"
            name="Basic.hospitalName"
            formik={formik}
            placeholder="Organization Name"
            isReadOnly={isReadOnly}
          />

          <Select
            label="Type of Hospital"
            name="Basic.typeOfHospital"
            formik={formik}
            isReadOnly={isReadOnly}
            options={hospitalTypes || []}
          />

          <Select
            label="Organization Type"
            name="Basic.typeOfOrgOrHospital"
            formik={formik}
            isReadOnly={isReadOnly}
            options={organizationTypes || []}
          />

          {normalizeText(basic.typeOfOrgOrHospital) === "govt" && (
            <Select
              label="If Govt (Legal Entity Type)"
              name="Basic.ifGovt"
              formik={formik}
              isReadOnly={isReadOnly}
              options={legalEntity || []}
              loading={loading}
            />
          )}

          <Select
            label="Region"
            name="Basic.region"
            formik={formik}
            isReadOnly={isReadOnly}
            options={region || []}
            onChange={handleRegionChange}
          />

          <Select
            label="State"
            name="Basic.state"
            formik={formik}
            isReadOnly={isReadOnly}
            options={stateOptions}
            onChange={handleStateChange}
          />

          <Select
            label="District"
            name="Basic.district"
            formik={formik}
            isReadOnly={isReadOnly}
            options={districtOptions}
            onChange={handleDistrictChange}
          />

          <Select
            label="City"
            name="Basic.city"
            formik={formik}
            isReadOnly={isReadOnly}
            options={cityOptions}
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

          <Input
            label="Pincode"
            name="Basic.pincode"
            formik={formik}
            isReadOnly={isReadOnly}
            placeholder="Enter pincode"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;
