import React, { useEffect } from "react";
import ReactSelect from "react-select";
import _ from "lodash";
import useDropdown from "../../../../../../hooks/dropdown/useDropdown";

const Select = ({
  label,
  name,
  formik,
  options,
  loading = false,
  isReadOnly = false,
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
        isDisabled={isReadOnly || loading}
        onChange={(selected) => {
          if (isReadOnly) return;
          formik.setFieldValue(name, selected?.value || "");
        }}
        onBlur={() => formik.setFieldTouched(name, true)}
        placeholder={`Select ${label}`}
        classNamePrefix="react-select"
      />

      {touched && error && (
        <span className="text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
};


const AssignToEmployee = ({ formik ,isReadOnly = false }) => {
  const { fetchAllEmployees, employees } = useDropdown();

  useEffect(() => {
    fetchAllEmployees();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-6">ASSIGN TO EMPLOYEE</h1>
      <div className="p-6 pt-0 bg-white rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-11">
          <Select
            label="Sales Person Name"
            name="salesPersonName"
            formik={formik}
              isReadOnly={isReadOnly}  
            options={
              Array.isArray(employees)
                ? employees.map((emp) => ({
                    label: emp.salesPersonName,
                    value: emp.salesPersonName,
                  }))
                : []
            }
          />
        </div>
      </div>
    </div>
  );
};

export default AssignToEmployee;
