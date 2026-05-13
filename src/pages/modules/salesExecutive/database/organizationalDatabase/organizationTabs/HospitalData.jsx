import React, { useEffect, useState } from "react";
import useDropdown from "../../../../../../hooks/dropdown/useDropdown";
import ReactSelect from "react-select";
import _ from "lodash";

// --- Input Component ---
const Input = ({ label, name, formik, type = "text", placeholder, isReadOnly = false }) => {
  const value = _.get(formik.values, name, "");
  const touched = _.get(formik.touched, name, false);
  const error = _.get(formik.errors, name, "");

  const inputValue =
    type === "number" && (value === 0 || value === "0") ? "" : value;

  return (
    <div className="flex flex-col w-full mb-4">
      <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={inputValue}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder={placeholder}
        disabled={isReadOnly}
        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300
          ${touched && error ? "border-red-500" : "border-[#556581]"}
          ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
          ${type === "number" ? "no-spinner" : ""}`}
      />
      {touched && error && (
        <span className="text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
};

// --- Select Component ---
const Select = ({ label, name, formik, options, loading, placeholder, isReadOnly = false }) => {
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
        onChange={(selected) => formik.setFieldValue(name, selected?.value || "")}
        onBlur={() => formik.setFieldTouched(name, true)}
        placeholder={placeholder || `Select ${label}`}
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
const HospitalData = ({ formik, isReadOnly = false }) => {
  const { fetchSpeciality, speciality, fetchSurgeryType, surgeryType } =
    useDropdown();

  useEffect(() => {
    // Only call APIs if data is empty to avoid redundant calls when switching tabs
    if (speciality.length === 0) {
      fetchSpeciality();
    }
    if (surgeryType.length === 0) {
      fetchSurgeryType();
    }
  }, []);

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

  const removeSpeciality = (index) => {
    const updated = specialities.filter((_, i) => i !== index);
    formik.setFieldValue("hospitalData.specialities", updated);
  };

  const addSurgery = (specIndex) => {
    const updated = [...specialities];
    const spec = { ...updated[specIndex] };
    spec.surgeries = [...spec.surgeries, { surgeryType: "", numberOfSurgeries: 0 }];
    updated[specIndex] = spec;
    formik.setFieldValue("hospitalData.specialities", updated);
  };

  const removeSurgery = (specIndex, surgIndex) => {
    const updated = [...specialities];
    const spec = { ...updated[specIndex] };
    spec.surgeries = spec.surgeries.filter((_, i) => i !== surgIndex);
    updated[specIndex] = spec;
    formik.setFieldValue("hospitalData.specialities", updated);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-2">
        Hospital Bed & Infrastructure Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Input label="Total Beds" name="hospitalData.totalBeds" type="number" formik={formik} isReadOnly={isReadOnly} placeholder="Enter total beds" />
        <Input label="Total ICU Beds" name="hospitalData.totalICUBeds" type="number" formik={formik} isReadOnly={isReadOnly} placeholder="Enter total ICU beds" />
        <Input label="Total Operation Theaters (OT)" name="hospitalData.totalOT" type="number" formik={formik} isReadOnly={isReadOnly} placeholder="Enter total OT" />
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-md font-semibold text-gray-700">Specialities & Surgeries</h4>
          {!isReadOnly && (
            <button
              type="button"
              onClick={addSpeciality}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm"
            >
              + Add Speciality
            </button>
          )}
        </div>

        {specialities.map((spec, specIndex) => {
          const otherSelectedSpecialities = specialities
            .filter((_, i) => i !== specIndex)
            .map((s) => s.name)
            .filter(Boolean);

          const filteredSpecialityOptions = speciality.filter((opt) => {
            const val = typeof opt === "string" ? opt : opt.value;
            return !otherSelectedSpecialities.includes(val);
          });

          return (
            <div key={specIndex} className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50 relative group">
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={() => removeSpeciality(specIndex)}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Remove Speciality
                </button>
              )}

              <div className="w-full md:w-1/2">
                <Select
                  label="Speciality Name"
                  name={`hospitalData.specialities[${specIndex}].name`}
                  formik={formik}
                  options={filteredSpecialityOptions}
                  placeholder="Search or select speciality"
                  isReadOnly={isReadOnly}
                />
              </div>

              <div className="mt-4 ml-4 pl-4 border-l-2 border-blue-200">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-600">Surgeries</span>
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => addSurgery(specIndex)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      + Add Surgery Type
                    </button>
                  )}
                </div>

                {spec.surgeries.map((surg, surgIndex) => {
                  const otherSelectedSurgeries = spec.surgeries
                    .filter((_, i) => i !== surgIndex)
                    .map((s) => s.surgeryType)
                    .filter(Boolean);

                  const filteredSurgeryOptions = surgeryType.filter((opt) => {
                    const val = typeof opt === "string" ? opt : opt.value;
                    return !otherSelectedSurgeries.includes(val);
                  });

                  return (
                    <div key={surgIndex} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 items-end relative pr-8">
                      <Select
                        label="Surgery Type"
                        name={`hospitalData.specialities[${specIndex}].surgeries[${surgIndex}].surgeryType`}
                        formik={formik}
                        options={filteredSurgeryOptions}
                        placeholder="Search or select surgery"
                        isReadOnly={isReadOnly}
                      />
                      <Input
                        label="No. of Surgeries"
                        name={`hospitalData.specialities[${specIndex}].surgeries[${surgIndex}].numberOfSurgeries`}
                        type="number"
                        formik={formik}
                        isReadOnly={isReadOnly}
                        placeholder="Enter count"
                      />
                      {!isReadOnly && spec.surgeries.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSurgery(specIndex, surgIndex)}
                          className="absolute right-0 top-10 text-red-400 hover:text-red-600"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="w-full md:w-1/3">
                  <Input
                    label="Total Surgeries in Calendar Year"
                    name={`hospitalData.specialities[${specIndex}].totalSurgeriesCalenderYear`}
                    type="number"
                    formik={formik}
                    isReadOnly={isReadOnly}
                    placeholder="Enter total surgeries"
                  />
                </div>
              </div>
            </div>
          );
        })}

        {specialities.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 italic">
            No specialities added yet. Click "+ Add Speciality" to begin.
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalData;