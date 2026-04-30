import React, { useEffect } from "react";
import useDropdown from "../../../../../../hooks/dropdown/useDropdown";
import ReactSelect from "react-select";

const Input = ({ label, name, formik, type = "text", placeholder }) => {
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
  isMulti = false,
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

  const selectOptions =
    options?.map((opt) => {
      if (typeof opt === "string") {
        return { label: opt, value: opt };
      }
      return {
        label: opt.name || opt.label,
        value: opt.name || opt.value,
      };
    }) || [];

  const selectedOption = isMulti
    ? selectOptions?.filter((opt) => value?.includes(opt.value)) || []
    : selectOptions?.find((opt) => opt.value === value) || null;

  const handleChange = (selected) => {
    if (isMulti) {
      const selectedValues = selected ? selected.map((opt) => opt.value) : [];
      formik.setFieldValue(name, selectedValues);
    } else {
      formik.setFieldValue(name, selected?.value || "");
    }
  };

  return (
    <div className="flex flex-col w-full mb-4">
      <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      <ReactSelect
        options={selectOptions}
        isLoading={loading}
        name={name}
        value={selectedOption}
        onChange={handleChange}
        onBlur={() => formik.setFieldTouched(name, true)}
        placeholder={loading ? "Loading..." : `Select ${label}`}
        classNamePrefix="react-select"
        isDisabled={loading}
        isMulti={isMulti}
        closeMenuOnSelect={!isMulti}
        className={`react-select-container ${
          touched && error ? "react-select-container--error" : ""
        }`}
      />
      {touched && error && (
        <span className="text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
};

const Surgery = ({ formik }) => {
  const {
    fetchSurgeryType,
    surgeryType,
    loading,
    fetchProductsNames,
    productList,
  } = useDropdown();
  console.log("productList:", productList);

  useEffect(() => {
    fetchSurgeryType();
    fetchProductsNames();
  }, []);

  return (
    <>
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-6">SURGERY</h1>
        <div className="p-6 pt-0 bg-white rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-11">
            {/*Surgery */}
            <Select
              label="Types Of Surgeries Performed"
              name="Surgery.surgeryType"
              formik={formik}
              options={surgeryType || []}
            />
            <Input
              type="number"
              label="Total No's Of Surgery Yearly"
              name="Surgery.totalSurgeryYearly"
              formik={formik}
              placeholder="Enter No."
            />
            <Input
              type="number"
              label="Open Surgery"
              name="Surgery.openSurgery"
              formik={formik}
              placeholder="Enter No."
            />
            <Input
              type="number"
              label="Lap Surgery"
              name="Surgery.lapSurgery"
              formik={formik}
              placeholder="Enter No."
            />
            <Input
              type="number"
              label="Robotic Surgery"
              name="Surgery.roboticSurgery"
              formik={formik}
              placeholder="Enter No."
            />
            <Select
              label="Product Type"
              name="Surgery.productType"
              formik={formik}
              options={["Product type", "Product A", "Product B"]}
            />
            <Select
              label="Targeted Product"
              name="Surgery.productTarget"
              formik={formik}
              options={productList || []}
              isMulti={true}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Surgery;
