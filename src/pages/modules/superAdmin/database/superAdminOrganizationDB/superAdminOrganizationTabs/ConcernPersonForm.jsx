import React from "react";
import _ from "lodash";

const Input = ({ label, name, formik, type = "text", placeholder, isReadOnly = false }) => {
  const value = _.get(formik.values, name, "");
  const touched = _.get(formik.touched, name, false);
  const error = _.get(formik.errors, name, "");

  return (
    <div className="flex flex-col w-full mb-4">
      <label className="text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder || `Enter ${label}`}
        value={value}
        disabled={isReadOnly}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 transition-all ${
          touched && error
            ? "border-red-500 focus:ring-red-300"
            : "border-gray-300 focus:ring-blue-400"
        } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : "bg-white"} ${type === "number" ? "no-spinner" : ""}`}
      />
      {touched && error && !isReadOnly && (
        <span className="text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
};

const ConcernPersonForm = ({ title, sectionName, formik, isReadOnly = false }) => {
  const persons = _.get(formik.values, sectionName, []);

  const addPerson = () => {
    const updated = [...persons, { name: "", contact: "", designation: "" }];
    formik.setFieldValue(`${sectionName}`, updated);
  };

  const removePerson = (index) => {
    const updated = persons.filter((_, i) => i !== index);
    formik.setFieldValue(`${sectionName}`, updated);
  };

  return (
    <div className="mt-8 border-t pt-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-md font-semibold text-gray-700">{title || "Concern Persons"}</h4>
        {!isReadOnly && (
          <button
            type="button"
            onClick={addPerson}
            className="text-sm px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
          >
            + Add Person
          </button>
        )}
      </div>

      {persons.map((_, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 mb-4 bg-gray-50 rounded-lg relative group">
          {!isReadOnly && persons.length > 1 && (
            <button
              type="button"
              onClick={() => removePerson(index)}
              className="absolute -top-2 -right-2 bg-white text-red-500 border border-red-200 rounded-full w-6 h-6 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
              title="Remove Person"
            >
              ×
            </button>
          )}
          <Input
            label="Name"
            name={`${sectionName}[${index}].name`}
            formik={formik}
            isReadOnly={isReadOnly}
            placeholder="Enter full name"
          />
          <Input
            label="Contact"
            name={`${sectionName}[${index}].contact`}
            formik={formik}
            isReadOnly={isReadOnly}
            placeholder="Enter contact number"
          />
          <Input
            label="Designation"
            name={`${sectionName}[${index}].designation`}
            formik={formik}
            isReadOnly={isReadOnly}
            placeholder="Enter designation"
          />
        </div>
      ))}

      {persons.length === 0 && (
        <div className="text-center py-4 text-gray-400 text-sm italic border-2 border-dashed border-gray-200 rounded-lg">
          No concern persons added.
        </div>
      )}
    </div>
  );
};

export default ConcernPersonForm;
