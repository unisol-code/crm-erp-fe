import React from "react";
import ReactSelect from "react-select";
import _ from "lodash";

// --- Select Component ---
const Select = ({ label, name, formik, options, loading = false, isReadOnly = false, isMulti = false }) => {
  const rawValue = _.get(formik.values, name);
  const touched = _.get(formik.touched, name, false);
  const error = _.get(formik.errors, name, "");

  const value = isMulti ? rawValue || [] : rawValue || "";

  const selectOptions = options.map((opt) =>
    typeof opt === 'string' ? { label: opt, value: opt } : opt
  );
  
  const selectedOption = isMulti
    ? selectOptions.filter((opt) => value?.includes?.(opt.value))
    : selectOptions.find((opt) => opt.value === value) || null;

  return (
    <div className="flex flex-col w-full mb-4">
      <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      <ReactSelect
        options={selectOptions}
        isMulti={isMulti}
        isLoading={loading}
        name={name}
        value={selectedOption}
        onChange={(selected) => {
          if (isMulti) {
            formik.setFieldValue(name, selected ? selected.map(s => s.value) : []);
          } else {
            formik.setFieldValue(name, selected?.value || '');
          }
        }}
        onBlur={() => formik.setFieldTouched(name, true)}
        placeholder={`Select ${label}`}
        classNamePrefix="react-select"
        isDisabled={loading || isReadOnly}
        styles={{
          control: (base, state) => ({
            ...base,
            minHeight: "48px",
            borderRadius: "0.5rem",
            borderColor: state.isFocused ? "#60A5FA" : touched && error ? "#EF4444" : "#556581",
            boxShadow: state.isFocused ? "0 0 0 2px #60A5FA" : "none",
            backgroundColor: isReadOnly ? "#F3F4F6" : base.backgroundColor,
            cursor: isReadOnly ? "not-allowed" : base.cursor,
          }),
        }}
      />
      {touched && error && !isReadOnly && (
        <span className="text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
};

// --- QuestionField Component (Handles Boolean, Number, Text) ---
const QuestionField = ({ label, name, type = "text", formik, isReadOnly = false, placeholder }) => {
  const value = _.get(formik.values, name, "");
  const touched = _.get(formik.touched, name, false);
  const error = _.get(formik.errors, name, "");

  if (type === "boolean") {
    return (
      <div className="flex flex-col w-full mb-4">
        <label className="text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="flex gap-4">
          {["Yes", "No"].map((option) => {
            const boolValue = option === "Yes";
            return (
              <label key={option} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={name}
                  value={boolValue}
                  disabled={isReadOnly}
                  checked={value === boolValue}
                  onChange={() => formik.setFieldValue(name, boolValue)}
                  onBlur={() => formik.setFieldTouched(name, true)}
                />
                {option}
              </label>
            );
          })}
        </div>
        {touched && error && !isReadOnly && <span className="text-red-500 text-xs mt-1">{error}</span>}
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full mb-4">
      <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder || "Enter answer"}
        value={value}
        disabled={isReadOnly}
        onChange={(e) => {
          if (type === "number") {
            const val = e.target.value === "" ? "" : Number(e.target.value);
            formik.setFieldValue(name, isNaN(val) ? "" : val);
          } else {
            formik.handleChange(e);
          }
        }}
        onBlur={formik.handleBlur}
        className={`border ${touched && error ? 'border-red-500' : 'border-gray-700'} rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 ${isReadOnly ? 'bg-gray-100' : 'bg-white'} ${type === "number" ? "no-spinner" : ""}`}
      />
      {touched && error && !isReadOnly && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
};

// --- TextArea Component ---
const TextArea = ({ label, name, formik, placeholder, isReadOnly = false }) => {
  const value = _.get(formik.values, name, "");
  const touched = _.get(formik.touched, name, false);
  const error = _.get(formik.errors, name, "");

  return (
    <div className="flex flex-col w-full mb-4 col-span-2">
      <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        id={name}
        name={name}
        rows="3"
        placeholder={placeholder}
        value={value || ''}
        onChange={formik.handleChange}
        disabled={isReadOnly}
        onBlur={formik.handleBlur}
        className={`border ${touched && error ? 'border-red-500' : 'border-gray-700'} rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 ${isReadOnly ? 'bg-gray-100' : 'bg-white'}`}
      />
      {touched && error && !isReadOnly && (
        <span className="text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
};

// --- Section Wrapper ---
const Section = ({ title, children }) => (
  <div className="px-6 py-2 bg-white rounded-md">
    <h1 className="text-xl font-semibold mb-6 border-b pb-2">{title}</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-11 px-4">
      {children}
    </div>
  </div>
);

// --- Main Physiotherapy Setup Component ---
const PhysiotherapySetup = ({ formik, isReadOnly = false }) => {
  return (
    <div className="p-4">
      <Section title="PHYSIOTHERAPY SETUP">
        <TextArea
          label="1. What is the primary objective of the physiotherapy center?"
          name="physiotherapy.primaryObjective"
          formik={formik}
          isReadOnly={isReadOnly}
          placeholder="Enter primary objective"
        />

        <Select
          label="2. Is the setup intended for OPD patients, IPD patients, sports rehab, etc.?"
          name="physiotherapy.intendedFor"
          formik={formik}
          isMulti
          options={["OPD patients", "IPD patients", "Sports rehabilitation", "Neuro rehabilitation", "Geriatric care", "Pediatric therapy", "Multi-specialty rehabilitation"]}
          isReadOnly={isReadOnly}
        />

        <Select
          label="3. Will it function as part of an existing hospital or as an independent center?"
          name="physiotherapy.setupContext"
          formik={formik}
          options={["Part of existing hospital", "Independent rehabilitation center"]}
          isReadOnly={isReadOnly}
        />

        <QuestionField
          label="4. What is the expected patient load per day?"
          name="physiotherapy.expectedPatientLoad"
          type="number"
          formik={formik}
          isReadOnly={isReadOnly}
          placeholder="Enter number"
        />

        <Select
          label="5. Will the center provide only physiotherapy or multidisciplinary services?"
          name="physiotherapy.serviceType"
          formik={formik}
          options={["Physiotherapy only", "Multidisciplinary rehabilitation services"]}
          isReadOnly={isReadOnly}
        />

        <Select
          label="6. Is the facility planned for urban, semi-urban, rural, or institutional use?"
          name="physiotherapy.plannedLocation"
          formik={formik}
          options={["Urban", "Semi-urban", "Rural", "Institutional"]}
          isReadOnly={isReadOnly}
        />

        <QuestionField
          label="7. What is the total area available for the physiotherapy department?"
          name="physiotherapy.totalArea"
          type="text"
          formik={formik}
          isReadOnly={isReadOnly}
          placeholder="e.g. 2000 sq ft"
        />

        <TextArea
          label="8. How should the area be divided (Reception, Consultation, Electrotherapy, etc.)?"
          name="physiotherapy.areaDivision"
          formik={formik}
          isReadOnly={isReadOnly}
          placeholder="Describe area division for various sections"
        />

        <TextArea
          label="9. What should be the ideal patient movement flow?"
          name="physiotherapy.patientMovementFlow"
          formik={formik}
          isReadOnly={isReadOnly}
          placeholder="Describe movement flow"
        />

        <QuestionField
          label="10. Is barrier-free accessibility available for disabled patients?"
          name="physiotherapy.barrierFreeAccessibility"
          type="boolean"
          formik={formik}
          isReadOnly={isReadOnly}
        />

        <QuestionField
          label="11. Are ramps, lifts, handrails, and wheelchair pathways planned?"
          name="physiotherapy.infrastructurePlanned"
          type="boolean"
          formik={formik}
          isReadOnly={isReadOnly}
        />

        <QuestionField
          label="12. Is there sufficient ventilation and natural lighting?"
          name="physiotherapy.ventilationLighting"
          type="boolean"
          formik={formik}
          isReadOnly={isReadOnly}
        />

        <TextArea
          label="13. What flooring is suitable for rehabilitation and patient safety?"
          name="physiotherapy.suitableFlooring"
          formik={formik}
          isReadOnly={isReadOnly}
          placeholder="Describe flooring type"
        />

        <QuestionField
          label="14. Are acoustic and privacy requirements addressed?"
          name="physiotherapy.privacyRequirements"
          type="boolean"
          formik={formik}
          isReadOnly={isReadOnly}
        />

        <TextArea
          label="15. What physiotherapy equipment is essential initially?"
          name="physiotherapy.essentialEquipment"
          formik={formik}
          isReadOnly={isReadOnly}
          placeholder="List essential equipment"
        />

        <TextArea
          label="16. Which advanced rehabilitation technologies are required?"
          name="physiotherapy.advancedTechnologies"
          formik={formik}
          isReadOnly={isReadOnly}
          placeholder="List advanced technologies"
        />

        <QuestionField
          label="17. How many treatment stations are needed?"
          name="physiotherapy.treatmentStations"
          type="number"
          formik={formik}
          isReadOnly={isReadOnly}
          placeholder="Enter count"
        />

        <Select
          label="18. Should imported or indigenous equipment be preferred?"
          name="physiotherapy.equipmentPreference"
          formik={formik}
          options={["Imported", "Indigenous", "Both"]}
          isReadOnly={isReadOnly}
        />

        <TextArea
          label="19. What are the power and electrical requirements of the equipment?"
          name="physiotherapy.powerRequirements"
          formik={formik}
          isReadOnly={isReadOnly}
          placeholder="Describe power requirements"
        />

        <QuestionField
          label="20. How many physiotherapists are there?"
          name="physiotherapy.physiotherapistCount"
          type="number"
          formik={formik}
          isReadOnly={isReadOnly}
          placeholder="Enter count"
        />
      </Section>
    </div>
  );
};

export default PhysiotherapySetup;
