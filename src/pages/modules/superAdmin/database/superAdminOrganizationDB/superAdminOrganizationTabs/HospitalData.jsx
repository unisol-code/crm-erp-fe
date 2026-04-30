import React, { useEffect } from "react";
import useDropdown from "../../../../../../hooks/dropdown/useDropdown";
import ReactSelect from "react-select";

// --- Helper for nested paths with arrays ---
const getValueByPath = (obj, path) => {
  if (!obj) return "";
  return path
    .replace(/\[(\d+)\]/g, ".$1") // convert [0] into .0
    .split(".")
    .reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : ""), obj);
};

// --- Input Component ---
const Input = ({ label, name, formik, type = "text", placeholder ,isReadOnly = false}) => {
  const value = getValueByPath(formik.values, name);
  const touched = getValueByPath(formik.touched, name);
  const error = getValueByPath(formik.errors, name);

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
        className={`no-spinner border ${touched && error ? "border-red-500" : "border-gray-300"
          } rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}
      />
      {touched && error && (
        <span className="text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
};

// --- Select Component ---
const Select = ({ label, name, formik, options, loading = false ,isReadOnly = false}) => {
  const value = getValueByPath(formik.values, name);
  const touched = getValueByPath(formik.touched, name);
  const error = getValueByPath(formik.errors, name);

  const selectOptions =
    options?.map((opt) =>
      typeof opt === "string"
        ? { label: opt, value: opt }
        : { label: opt.label, value: opt.value }
    ) || [];

  const selectedOption =
    selectOptions.find((opt) => opt.value === value) || null;

  return (
    <div className="flex flex-col w-full mb-4">
      <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      <ReactSelect
        options={selectOptions}
        key={`${name}-${selectOptions.length}`}
        isLoading={loading}
        name={name}
        value={selectedOption}
        onChange={(selected) =>
          formik.setFieldValue(name, selected?.value || "")
        }
        onBlur={() => formik.setFieldTouched(name, true)}
        placeholder={`Select ${label}`}
        classNamePrefix="react-select"
        isDisabled={loading || isReadOnly}
      />
      {touched && error && (
        <span className="text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
};

// --- Hospital Data Component ---
const HospitalData = ({ formik ,isReadOnly = false}) => {
  const { fetchSpeciality, speciality, fetchSurgeryType, surgeryType } =
    useDropdown();


  const specialities = formik.values?.hospitalData?.specialities || [];

  const addSpeciality = () => {
    const updated = [
      ...specialities,
      {
        name: "",
        surgeries: [{ surgeryType: "", numberOfSurgeries: 0 }],
        totalSurgeriesCalenderYear: 0,
      },
    ];
    formik.setFieldValue("hospitalData.specialities", updated);
  };

  const addSurgery = (specIndex) => {
    const updated = [...specialities];
    updated[specIndex].surgeries.push({
      surgeryType: "",
      numberOfSurgeries: 0,
    });
    formik.setFieldValue("hospitalData.specialities", updated);
  };
  


  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-6">HOSPITAL DATA</h1>
      <div className="p-6 pt-0 bg-white rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-11">
          <Input
            type="number"
            label="Total Beds"
            name="hospitalData.totalBeds"
            formik={formik}
            isReadOnly={isReadOnly}
            placeholder="Enter Total Beds"
          />
          <Input
            type="number"
            label="Total ICU Beds"
            name="hospitalData.totalICUBeds"
            formik={formik}
            isReadOnly={isReadOnly}
            placeholder="Enter Total ICU Beds"
          />
          <Input
            type="number"
            label="Total Operation Theaters"
            name="hospitalData.totalOT"
            formik={formik}
            isReadOnly={isReadOnly}
            placeholder="Enter Total Operation Theaters"
          />
        </div>

        {/* Specialities Section */}
        <h2 className="text-lg font-medium mt-6 mb-3">Specialities</h2>
        {/* {specialities.map((spec, specIndex) => ( */}
        {specialities.map((spec, specIndex) => {
          // --- Speciality Filtering ---
          const selectedSpecialityValues = specialities.map((s) => s.name);
          const filteredSpecialities = (speciality || []).filter((opt) => {
            const value = typeof opt === "string" ? opt : opt.value;
            return (
              !selectedSpecialityValues.includes(value) || value === spec.name
            );
          });
          return (
            <div key={specIndex} className="border p-4 rounded-md mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-11">
                <Select
                  label="Speciality"
                  name={`hospitalData.specialities[${specIndex}].name`}
                  formik={formik}
                  isReadOnly={isReadOnly}
                  options={filteredSpecialities}
                />
                <Input
                  type="number"
                  label="Total Surgeries (Calendar Year)"
                  name={`hospitalData.specialities[${specIndex}].totalSurgeriesCalenderYear`}
                  formik={formik}
                  isReadOnly={isReadOnly}
                  placeholder="Enter Total Surgeries (Calendar Year)"
                />
              </div>

              {/* Surgeries inside Speciality */}
              <h3 className="text-md font-semibold mt-3 mb-2">Surgeries</h3>
              {spec.surgeries.map((surg, surgIndex) => {
                // find what surgeries are already selected in this speciality
                const selectedTypes = spec.surgeries.map((s) => s.surgeryType);

                // filter out selected ones, except keep the one already chosen for this row
                const availableOptions = (surgeryType || []).filter(
                  (option) =>
                    !selectedTypes.includes(option) || option === surg.surgeryType
                );

                return (
                  <div
                    key={surgIndex}
                    className="grid grid-cols-1 md:grid-cols-2 gap-x-11 mb-3"
                  >
                    <Select
                      label="Surgery Type"
                      name={`hospitalData.specialities[${specIndex}].surgeries[${surgIndex}].surgeryType`}
                      formik={formik}
                      isReadOnly={isReadOnly}
                      options={availableOptions}
                    />
                    <Input
                      type="number"
                      label="Number of Surgeries"
                      name={`hospitalData.specialities[${specIndex}].surgeries[${surgIndex}].numberOfSurgeries`}
                      formik={formik}
                      isReadOnly={isReadOnly}
                      placeholder="Enter Number of Surgeries"
                    />
                  </div>
                );
              })}

              {spec.surgeries.length < (surgeryType?.length || 0) && (
                <button
                  type="button"
                  onClick={() => addSurgery(specIndex)}
                  className="mt-2 px-4 py-1 text-sm bg-blue-100 text-blue-600 rounded-md"
                >
                  + Add Surgery
                </button>
              )}
            </div>
          );
        })}

        <button
          type="button"
          onClick={addSpeciality}
          className="mt-4 px-6 py-2 bg-green-100 text-green-600 rounded-md"
        >
          + Add Speciality
        </button>
      </div>
    </div>
  );
};

export default HospitalData;
