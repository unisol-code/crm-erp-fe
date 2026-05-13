import React, { useEffect } from "react";
import useDropdown from "../../../../../../hooks/dropdown/useDropdown";
import ReactSelect from 'react-select';

const Input = ({ label, name, formik, type = "text", placeholder }) => {
  const value = name.split('.').reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : ''), formik.values);
  const touched = name.split('.').reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : false), formik.touched);
  const error = name.split('.').reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : ''), formik.errors);

  const inputValue = type === 'date' && value instanceof Date
    ? value.toISOString().split('T')[0]
    : value;

  return (
    <div className="flex flex-col w-full mb-4">
      <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        id={name}
        type={type}
        name={name}
        placeholder={placeholder}
        value={inputValue || ''}
        onChange={(e) => {
          const numValue = e.target.value === '' ? '' : Number(e.target.value);
          formik.setFieldValue(name, isNaN(numValue) ? '' : numValue);
        }}
        onBlur={formik.handleBlur}
        // className={`no-spinner border ${touched && error ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}
        className={`no-spinner border ${touched && error ? "border-red-500" : "border-gray-700"
          } rounded-lg px-2 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400`}
      />
      {touched && error && (
        <span className="text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
};

const Select = ({ label, name, formik, options, loading = false, isMulti = false }) => {
  const value = name.split('.').reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : ''), formik.values);
  const touched = name.split('.').reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : false), formik.touched);
  const error = name.split('.').reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : ''), formik.errors);

  const selectOptions = options?.map((opt) => {
    if (typeof opt === 'string') {
      return { label: opt, value: opt };
    }
    return {
      label: opt.name || opt.label,
      value: opt.name || opt.value
    };
  }) || [];

  const selectedOption = isMulti
    ? selectOptions?.filter(opt => value?.includes(opt.value)) || []
    : selectOptions?.find(opt => opt.value === value) || null;

  const handleChange = (selected) => {
    if (isMulti) {
      const selectedValues = selected ? selected.map(opt => opt.value) : [];
      formik.setFieldValue(name, selectedValues);
    } else {
      formik.setFieldValue(name, selected?.value || '');
    }
  };

  return (
    <div className="flex flex-col w-full mb-4">
      <label className="text-sm font-medium text-gray-900 mb-1">{label}</label>
      <ReactSelect
        options={selectOptions}
        isLoading={loading}
        name={name}
        value={selectedOption}
        onChange={handleChange}
        onBlur={() => formik.setFieldTouched(name, true)}
        placeholder={loading ? 'Loading...' : `Select ${label}`}
        classNamePrefix="react-select"
        isDisabled={loading}
        isMulti={isMulti}
        closeMenuOnSelect={!isMulti}
        className={`react-select-container ${touched && error ? 'react-select-container--error' : ''}`}
        styles={{
          control: (base, state) => ({
            ...base,
            minHeight: "48px", // 👈 match input height
            borderRadius: "0.5rem",
            borderColor: state.isFocused
              ? "#60A5FA" // blue-400
              : touched && error
                ? "#EF4444" // red-500
                : "#556581", // gray-300
            boxShadow: state.isFocused ? "0 0 0 2px #60A5FA" : "none",
            // "&:hover": {
            //   borderColor: touched && error ? "#EF4444" : "#60A5FA",
            // },
          }),
          valueContainer: (base) => ({
            ...base,
            padding: "0 6px", // 👈 same px-4
            fontSize: "1rem",
          }),
          input: (base) => ({
            ...base,
            margin: 0,
            padding: 0,
          }),
          placeholder: (base) => ({
            ...base,
            color: "#9CA3AF", // gray-400
          }),
        }}
      />
      {touched && error && (
        <span className="text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
};

const Surgery = ({ formik }) => {
  const {
    fetchSpeciality,
    speciality,
  } = useDropdown();

  useEffect(() => {
    fetchSpeciality();
  }, []);

  const selectedSpecialities = formik.values?.Surgery?.specialityList || [];

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-6">SURGERY DATA</h1>
      <div className="p-6 pt-0 bg-white rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-11">
          {/* Multi-select Speciality */}
          <Select
            label="Specialities"
            name="Surgery.specialityList"
            formik={formik}
            options={speciality || []}
            isMulti={true}
          />
          {/* Total Surgeries in Calendar Year */}
          <Input
            type="number"
            label="Total Surgeries (Yearly)"
            name="Surgery.totalSurgeryYearly"
            formik={formik}
            placeholder="Enter total count"
          />
        </div>

        {selectedSpecialities.map((speciality, index) => (
          <div key={speciality} className="border rounded p-4 mt-4 bg-gray-50">
            <h2 className="font-semibold text-md mb-3 text-blue-500" >
              {speciality} Surgery Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                type="number"
                label="Robotic"
                name={`Surgery.surgeryDetails.${speciality}.robotic`}
                formik={formik}
                placeholder="Enter number"
              />
              <Input
                type="number"
                label="Laparoscopic"
                name={`Surgery.surgeryDetails.${speciality}.laparoscopic`}
                formik={formik}
                placeholder="Enter number"
              />
              <Input
                type="number"
                label="Open"
                name={`Surgery.surgeryDetails.${speciality}.open`}
                formik={formik}
                placeholder="Enter number"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Surgery;
