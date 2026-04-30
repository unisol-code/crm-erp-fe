// import React from "react";

// const Input = ({ label, name, formik, type = "text", placeholder }) => {
//   const value = name.split('.').reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : ''), formik.values);
//   const touched = name.split('.').reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : false), formik.touched);
//   const error = name.split('.').reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : ''), formik.errors);

//   const inputValue = type === 'date' && value instanceof Date
//     ? value.toISOString().split('T')[0]
//     : value;

//   return (
//     <div className="flex flex-col w-full mb-4">
//       <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1">{label}</label>
//       <input
//         id={name}
//         type={type}
//         name={name}
//         placeholder={placeholder}
//         value={inputValue || ''}
//         onChange={(e) => {
//           if (type === 'number') {
//             const numValue = e.target.value === '' ? '' : Number(e.target.value);
//             formik.setFieldValue(name, isNaN(numValue) ? '' : numValue);
//           } else if (type === 'date') {
//             formik.setFieldValue(name, e.target.value ? new Date(e.target.value) : '');
//           } else {
//             formik.handleChange(e);
//           }
//         }}
//         onBlur={formik.handleBlur}
//         className={`no-spinner border ${touched && error ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}
//       />
//       {touched && error && (
//         <span className="text-red-500 text-xs mt-1">{error}</span>
//       )}
//     </div>
//   );
// };

// const Select = ({ label, name, formik, options }) => {
//   const value = name.split('.').reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : ''), formik.values);
//   const touched = name.split('.').reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : false), formik.touched);
//   const error = name.split('.').reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : ''), formik.errors);

//   return (
//     <div className="flex flex-col w-full mb-4">
//       <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
//       <select
//         name={name}
//         value={value}
//         onChange={formik.handleChange}
//         onBlur={formik.handleBlur}
//         className={`border ${touched && error ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400`}
//       >
//         <option value="">Select {label}</option>
//         {options.map((option, index) => (
//           <option key={index} value={option}>
//             {option}
//           </option>
//         ))}
//       </select>
//       {touched && error && (
//         <span className="text-red-500 text-xs mt-1">{error}</span>
//       )}
//     </div>
//   );
// };

// const StpEtp = ({ formik }) => {
//   return (
//     <>
//       <div className="p-4 bg-white rounded-md">
//         <h1 className="text-xl font-semibold mb-6">STP</h1>
//         <div className="p-6 pt-0">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-11">
//             <Input label="STP Status" name="stp.stpStatus" formik={formik} placeholder="Enter STP Status" />
//             <Input type="number" label="Year of Installation" name="stp.yearOfInstallation" formik={formik} placeholder="Enter Year" />
//             <Input label="STP Capacity" name="stp.stpCapacity" formik={formik} placeholder="Enter STP Capacity" />
//             {/* <Input type="date" label="Year of Installation" name="stpInstallYear" formik={formik} placeholder="Select Year" /> */}
//           </div>
//         </div>
//         <h1 className="text-xl font-semibold mb-6">ETP</h1>
//         <div className="p-6 pt-0">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Input label="ETP Status" name="etp.etpStatus" formik={formik} placeholder="Enter ETP Status" />
//             <Input type="number" label="Year of Installation" name="etp.yearOfInstallation" formik={formik} placeholder="Enter Year" />
//             <Input label="ETP Capacity" name="etp.etpCapacity" formik={formik} placeholder="Enter ETP Capacity" />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default StpEtp;


import React, { useEffect } from "react";
import ReactSelect from "react-select";
// Reusable Select Input
// const SelectInput = ({ label, name, formik, options, placeholder = "Select" }) => {
//   const value = name.split('.').reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : ''), formik.values);
//   const touched = name.split('.').reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : false), formik.touched);
//   const error = name.split('.').reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : ''), formik.errors);

//   return (
//     <div className="flex flex-col w-full mb-4">
//       <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1">{label}</label>
//       <select
//         id={name}
//         name={name}
//         value={value}
//         onChange={formik.handleChange}
//         onBlur={formik.handleBlur}
//         className={`border ${touched && error ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}
//       >
//         <option value="" disabled>{placeholder}</option>
//         {options.map((option) => (
//           <option key={option} value={option}>{option}</option>
//         ))}
//       </select>
//       {touched && error && (
//         <span className="text-red-500 text-xs mt-1">{error}</span>
//       )}
//     </div>
//   );
// };
const Select = ({ label, name, formik, options, loading = false, isReadOnly = false }) => {
  const value = name.split('.').reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : ''), formik.values);
  const touched = name.split('.').reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : false), formik.touched);
  const error = name.split('.').reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : ''), formik.errors);

  const selectOptions = options.map((opt) =>
    typeof opt === 'string' ? { label: opt, value: opt } : opt
  );
  const selectedOption = selectOptions.find((opt) => opt.value === value) || null;
  
  return (
    <div className="flex flex-col w-full mb-4">
      <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      <ReactSelect
        options={selectOptions}
        isLoading={loading}
        name={name}
        value={selectedOption}
        onChange={(selected) => formik.setFieldValue(name, selected?.value || '')}
        onBlur={() => formik.setFieldTouched(name, true)}
        placeholder={`Select ${label}`}
        classNamePrefix="react-select"
         isDisabled={loading || isReadOnly}
        
       styles={{
          control: (base, state) => ({
            ...base,
            minHeight: "48px",
            borderRadius: "0.5rem",
            borderColor: state.isFocused
              ? "#60A5FA"
              : touched && error
              ? "#EF4444"
              : "#556581",
            boxShadow: state.isFocused ? "0 0 0 2px #60A5FA" : "none",
            backgroundColor: isReadOnly ? "#F3F4F6" : base.backgroundColor,
            cursor: isReadOnly ? "not-allowed" : base.cursor,
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
      {touched && error && !isReadOnly && (
        <span className="text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
};
// Reusable Text Area
const TextArea = ({ label, name, formik, placeholder , isReadOnly = false }) => {
  const value = name.split('.').reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : ''), formik.values);
  const touched = name.split('.').reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : false), formik.touched);
  const error = name.split('.').reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : ''), formik.errors);

  return (
    <div className="flex flex-col w-full mb-4 col-span-2">
      <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        id={name}
        name={name}
        rows="4"
        placeholder={placeholder}
        value={value || ''}
        onChange={formik.handleChange}
          disabled={isReadOnly}
        onBlur={formik.handleBlur}
        className={`border ${touched && error ? 'border-red-500' : 'border-gray-700'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}
      />
      {touched && error && !isReadOnly && (
        <span className="text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
};

// Section Wrapper
const Section = ({ title, children }) => (
  <div className="px-6 py-2 bg-white rounded-md">
    <h1 className="text-xl font-semibold mb-6">{title}</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-11 px-8">
      {children}
    </div>
  </div>
);   

// Main Physiotherapy Setup Component
const PhysiotherapySetup = ({ formik, isReadOnly = false }) => {
  return (
    <Section title="PHYSIOTHERAPY SETUP">
      {/* Row 1 - Select Input */}
      <Select
        label="Focus Speciality"
        name="physiotherapy.focus"
        formik={formik}
        options={["Orthopedic", "Neurological", "Cardiopulmonary", "Pediatric", "Geriatric"]}
        placeholder="Select Speciality"
          isReadOnly={isReadOnly}
      />

      {/* Row 2 - Text Area (spanning both columns) */}
      <TextArea
        label="Summary"
        name="physiotherapy.summary"
        formik={formik}
         isReadOnly={isReadOnly}
        placeholder="Enter summary of physiotherapy setup"
      />
    </Section>
  );
};

export default PhysiotherapySetup;

