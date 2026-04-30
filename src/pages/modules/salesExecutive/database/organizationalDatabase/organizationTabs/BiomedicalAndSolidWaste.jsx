import React, { useState, useEffect } from "react";
import ReactSelect from "react-select";
import useDropdown from "../../../../../../hooks/dropdown/useDropdown";

const Select = ({
  label,
  name,
  formik,
  options,   
  isReadOnly = false,
  loading = false,
  placeholder = "Select option",
  isMulti = false,
  showOtherInput = false,
}) => {
  const [showOther, setShowOther] = useState(false);

  const rawValue = name
    .split(".")
    .reduce(
      (obj, key) => (obj && obj[key] !== undefined ? obj[key] : undefined),
      formik.values
    );

  const value = isMulti ? rawValue || [] : rawValue || "";

  /* 🔹 Add "Other" option */
  const selectOptions = [
    ...options.map((opt) =>
      typeof opt === "string" ? { label: opt, value: opt } : opt
    ),
    ...(showOtherInput ? [{ label: "Other", value: "Other" }] : []),
  ];

  const selectedValue = isMulti
    ? selectOptions.filter((opt) => value?.includes?.(opt.value))
    : selectOptions.find((opt) => opt.value === value) || null;

  return (
    <div className="flex flex-col w-full mb-4">
      <label className="text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      <ReactSelect
        options={selectOptions}
        isMulti={isMulti}
        value={selectedValue}
        isLoading={loading}
        placeholder={placeholder}
        onChange={(selected) => {
          if (isMulti) {
            const values = selected ? selected.map((s) => s.value) : [];

            if (values.includes("Other")) {
              setShowOther(true);
              formik.setFieldValue(name, "");
            } else {
              setShowOther(false);
              formik.setFieldValue(name, values);
            }
          } else {
            if (selected?.value === "Other") {
              setShowOther(true);
              formik.setFieldValue(name, "");
            } else {
              setShowOther(false);
              formik.setFieldValue(name, selected?.value || "");
            }
          }
        }}
      />

      {/* 🔹 OTHER INPUT */}
      {showOtherInput && showOther && (
        <input
          type="text"
          className="mt-2 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
          placeholder="Please specify"
          value={value || ""}
          onChange={(e) => formik.setFieldValue(name, e.target.value)}
        />
      )}
    </div>
  );
};

const countWords = (text = "") => {
  return text.trim().split(/\s+/).filter(Boolean).length;
};

const QuestionField = ({
  label,
  name,
  type = "text", // number | boolean | textarea | text
  formik,
  maxWords,
  placeholder,
  isReadOnly = false,
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

  const baseClass = `border rounded-lg px-3 py-3 focus:outline-none focus:ring-2 ${
    touched && error
      ? "border-red-500 focus:ring-red-300"
      : "border-gray-700 focus:ring-blue-400"
  }`;

  // 🔹 BOOLEAN (Yes / No)
  if (type === "boolean") {
    return (
      <div className="flex flex-col w-full mb-4">
        <label className="text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>

        <div className="flex gap-4">
          {["Yes", "No"].map((option) => {
            const boolValue = option === "Yes";
            return (
              <label
                key={option}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name={name}
                  value={boolValue}
                  disabled={isReadOnly}
                  checked={value === boolValue}
                  onChange={() => {
                    if (isReadOnly) return;
                    formik.setFieldValue(name, boolValue);
                  }}
                  onBlur={() => formik.setFieldTouched(name, true)}
                />
                {option}
              </label>
            );
          })}
        </div>

        {touched && error && (
          <span className="text-red-500 text-xs mt-1">{error}</span>
        )}
      </div>
    );
  }

  // 🔹 TEXTAREA
  // 🔹 TEXTAREA WITH WORD LIMIT
  if (type === "textarea") {
    const wordCount = countWords(value);
    const exceeded = maxWords && wordCount > maxWords;

    return (
      <div className="flex flex-col w-full mb-4">
        <label className="text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>

        <textarea
          name={name}
          rows={4}
          disabled={isReadOnly}
          placeholder={placeholder || "Enter details"}
          value={value}
          onChange={(e) => {
            const text = e.target.value;
            if (isReadOnly) return;
            if (!maxWords || countWords(text) <= maxWords) {
              formik.setFieldValue(name, text);
            }
          }}
          onBlur={formik.handleBlur}
          className={`${baseClass} ${
            exceeded ? "border-red-500 focus:ring-red-300" : ""
          }`}
        />

        {/* Word Counter */}
        {maxWords && (
          <div
            className={`text-xs mt-1 text-right ${
              exceeded ? "text-red-500" : "text-gray-500"
            }`}
          >
            {wordCount}/{maxWords} words
          </div>
        )}

        {touched && error && (
          <span className="text-red-500 text-xs mt-1">{error}</span>
        )}
      </div>
    );
  }

  // 🔹 NUMBER / TEXT (default)
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
          if (isReadOnly) return;
          if (type === "number") {
            const numValue =
              e.target.value === "" ? "" : Number(e.target.value);
            formik.setFieldValue(name, isNaN(numValue) ? "" : numValue);
          } else {
            formik.handleChange(e);
          }
        }}
        onBlur={formik.handleBlur}
        className={baseClass}
      />

      {touched && error && (
        <span className="text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
};

// ✅ FIXED: Removed DoubleTextareaQuestion - use two separate QuestionField components instead
const BiomedicalAndSolidWaste = ({ formik, type, isReadOnly = false }) => {
  // Clear conditional field when parent changes
  const { fetchbiomedicalfour, BMW4, loading } = useDropdown();

  useEffect(() => {
    if (formik.values?.bioMedicalWaste?.BMWQ6?.answers === false) {
      formik.setFieldValue("bioMedicalWaste.BMWQ6.briefAnswer", "");
    }
    if (formik.values?.solidWaste?.SWQ9?.answers === false) {
      formik.setFieldValue("solidWaste.SWQ9.frequency", "");
    }
    if (formik.values?.solidWaste?.SWQ29?.answers === false) {
      formik.setFieldValue("solidWaste.SWQ29.type", "");
    }
  }, [
    formik.values?.bioMedicalWaste?.BMWQ6?.answers,
    formik.values?.solidWaste?.SWQ9?.answers,
    formik.values?.solidWaste?.SWQ29?.answers,
  ]);

  useEffect(() => {
    fetchbiomedicalfour();
  }, []);

  const biomedicalQ4Options = Array.isArray(BMW4)
    ? BMW4.map((item) => ({
      label: item,
      value: item,
    }))
    : [];

  const renderBiomedicalWaste = () => (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-6">Biomedical Waste Management</h1>
      <div className="grid grid-cols-1 gap-y-2">
        <QuestionField
          label="1A. Who oversees biomedical waste management? - Designation (Ans in Brief)"
          name="bioMedicalWaste.BMWQ1A"
          type="textarea"
          formik={formik}
          isReadOnly={isReadOnly}
          maxWords={50}
        />
        <QuestionField
          label="1B. Who oversees biomedical waste management? - Committee (Ans in Brief)"
          name="bioMedicalWaste.BMWQ1B"
          type="textarea"
          formik={formik}
          isReadOnly={isReadOnly}
          maxWords={50}
        />
        <QuestionField
          label="2. Approximately how much biomedical waste (kg/day) is generated?"
          name="bioMedicalWaste.BMWQ2"
          type="number"
          isReadOnly={isReadOnly}
          formik={formik}
        />
        <QuestionField
          label="3. Can you provide a category-wise breakdown (yellow, red, blue, white, general)?"
          name="bioMedicalWaste.BMWQ3"
          formik={formik}
          isReadOnly={isReadOnly}
        />
        <Select
          label="4. What are your hospital's primary sources of BMW"
          name="bioMedicalWaste.BMWQ4"
          formik={formik}
          isMulti
          showOtherInput
          isReadOnly={isReadOnly}
          options={biomedicalQ4Options}
        />
        <QuestionField
          label="5. How is waste segregated at the point of generation?"
          name="bioMedicalWaste.BMWQ5"
          formik={formik}
          type="textarea"
          isReadOnly={isReadOnly}
          maxWords={100}
        />
        <QuestionField
          label="6. Are colour-coded bins/bags placed in all required locations?"
          name="bioMedicalWaste.BMWQ6.answers"
          type="boolean"
          isReadOnly={isReadOnly}
          formik={formik}
        />
        {formik.values?.bioMedicalWaste?.BMWQ6?.answers === true && (
          <QuestionField
            label="Please describe briefly"
            name="bioMedicalWaste.BMWQ6.briefAnswer"
            type="text"
            isReadOnly={isReadOnly}
            placeholder="Briefly explain"
            formik={formik}
          />
        )}
        <QuestionField
          label="7. How often are bins replaced/emptied?"
          name="bioMedicalWaste.BMWQ7"
          formik={formik}
          isReadOnly={isReadOnly}
          type="textarea"
          maxWords={50}
        />
        <QuestionField
          label="8. How is waste transported from the generation point to the storage area?"
          name="bioMedicalWaste.BMWQ8"
          formik={formik}
          type="textarea"
          isReadOnly={isReadOnly}
          maxWords={50}
        />
        <QuestionField
          label="9. Where is the temporary storage area located, and what safety measures are followed?"
          name="bioMedicalWaste.BMWQ9"
          formik={formik}
          type="textarea"
          isReadOnly={isReadOnly}
          maxWords={50}
        />
        <QuestionField
          label="10. How long is biomedical waste stored on-site before final disposal (max 48 hrs rule)?"
          name="bioMedicalWaste.BMWQ10"
          type="number"
          isReadOnly={isReadOnly}
          formik={formik}
        />
        <QuestionField
          label="11. Which Common Biomedical Waste Treatment Facility (CBWTF) or in-house system do you use?"
          name="bioMedicalWaste.BMWQ11"
          formik={formik}
          type="textarea"
          isReadOnly={isReadOnly}
          maxWords={50}
        />
        <QuestionField
          label="12. What methods of treatment are applied?"
          name="bioMedicalWaste.BMWQ12"
          formik={formik}
          type="textarea"
          isReadOnly={isReadOnly}
          maxWords={50}
        />
        <QuestionField
          label="13. How do you ensure proper sharps disposal?"
          name="bioMedicalWaste.BMWQ13"
          formik={formik}
          type="textarea"
          isReadOnly={isReadOnly}
          maxWords={50}
        />
        <QuestionField
          label="14. How is liquid biomedical waste (lab, blood, body fluids) treated?"
          name="bioMedicalWaste.BMWQ14"
          formik={formik}
          type="textarea"
          isReadOnly={isReadOnly}
          maxWords={50}
        />
        <QuestionField
          label="15. Do you have a system for the disposal of expired/unused medicines and cytotoxic drugs?"
          name="bioMedicalWaste.BMWQ15"
          formik={formik}
          type="textarea"
          isReadOnly={isReadOnly}
          maxWords={50}
        />
        <QuestionField
          label="16. Are you following the Biomedical Waste Management Rules, 2016 (and amendments)?"
          name="bioMedicalWaste.BMWQ16"
          type="boolean"
          isReadOnly={isReadOnly}
          formik={formik}
        />
        <QuestionField
          label="17. Do you maintain daily logs of waste generation and disposal?"
          name="bioMedicalWaste.BMWQ17"
          type="boolean"
          isReadOnly={isReadOnly}
          formik={formik}
        />
        <QuestionField
          label="18. Do you submit annual reports on biomedical waste to the Pollution Control Board?"
          name="bioMedicalWaste.BMWQ18"
          type="boolean"
          isReadOnly={isReadOnly}
          formik={formik}
        />
        <QuestionField
          label="19. Has your hospital received authorisation from the State Pollution Control Board?"
          name="bioMedicalWaste.BMWQ19"
          type="boolean"
          isReadOnly={isReadOnly}
          formik={formik}
        />
        <QuestionField
          label="20. What are the biggest challenges your hospital faces in BMW management?"
          name="bioMedicalWaste.BMWQ20"
          formik={formik}
          type="textarea"
          isReadOnly={isReadOnly}
          maxWords={50}
        />
      </div>
    </div>
  );

  const renderSolidWaste = () => (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-6">Solid Waste Management</h1>
      <div className="grid grid-cols-1 gap-y-4">
        <QuestionField
          label="Estimated total waste generated per day (TPD)"
          name="solidWaste.SWQ1"
          type="number"
          formik={formik}
          isReadOnly={isReadOnly}
        />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">8. Waste composition (approx. %)</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <QuestionField label="Wet/Biodegradable (%)" name="solidWaste.SWQ8.wet" type="number" formik={formik} isReadOnly={isReadOnly} />
            <QuestionField label="Dry/Recyclable (%)" name="solidWaste.SWQ8.dry" type="number" formik={formik} isReadOnly={isReadOnly} />
            <QuestionField label="Domestic Hazardous (%)" name="solidWaste.SWQ8.hazardous" type="number" formik={formik} isReadOnly={isReadOnly} />
            <QuestionField label="C&D (%)" name="solidWaste.SWQ8.cd" type="number" formik={formik} isReadOnly={isReadOnly} />
            <QuestionField label="Sanitary (%)" name="solidWaste.SWQ8.sanitary" type="number" formik={formik} isReadOnly={isReadOnly} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <QuestionField
            label="9. Are waste audits or characterization studies conducted regularly?"
            name="solidWaste.SWQ9.answers"
            type="boolean"
            formik={formik}
            isReadOnly={isReadOnly}
          />
          {formik.values?.solidWaste?.SWQ9?.answers && (
            <QuestionField
              label="Frequency"
              name="solidWaste.SWQ9.frequency"
              type="text"
              formik={formik}
              isReadOnly={isReadOnly}
            />
          )}
        </div>

        <QuestionField
          label="10. Is source segregation mandated as per SWM Rules 2016?"
          name="solidWaste.SWQ10"
          type="boolean"
          formik={formik}
          isReadOnly={isReadOnly}
        />

        <Select
          label="11. Collection method"
          name="solidWaste.SWQ11"
          formik={formik}
          isReadOnly={isReadOnly}
          options={["Door-to-door", "Community bins", "Both"]}
        />

        <Select
          label="12. Collection frequency"
          name="solidWaste.SWQ12"
          formik={formik}
          isReadOnly={isReadOnly}
          options={["Daily", "Alternate days", "Weekly", "On-call"]}
        />

        <Select
          label="13. Types of collection vehicles used"
          name="solidWaste.SWQ13"
          formik={formik}
          isMulti
          showOtherInput
          isReadOnly={isReadOnly}
          options={["Handcarts", "Tricycles", "Auto tippers", "Compactors", "Hook loaders"]}
        />

        <Select
          label="14. Waste processing facilities available"
          name="solidWaste.SWQ14"
          formik={formik}
          isMulti
          isReadOnly={isReadOnly}
          options={["Composting", "Biomethanation", "MRF", "RDF", "WtE", "None"]}
        />

        <QuestionField
          label="15. Capacity of processing facilities (TPD)"
          name="solidWaste.SWQ15"
          type="number"
          formik={formik}
          isReadOnly={isReadOnly}
        />

        <QuestionField
          label="16. % of total waste processed"
          name="solidWaste.SWQ16"
          type="number"
          formik={formik}
          isReadOnly={isReadOnly}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <QuestionField
            label="29. Treatment of wet waste at source?"
            name="solidWaste.SWQ29.answers"
            type="boolean"
            formik={formik}
            isReadOnly={isReadOnly}
          />
          {formik.values?.solidWaste?.SWQ29?.answers && (
            <Select
              label="Type"
              name="solidWaste.SWQ29.type"
              formik={formik}
              isReadOnly={isReadOnly}
              options={["Home composting", "Community composting", "On-site biogas"]}
            />
          )}
        </div>

        <Select
          label="30. Handling of dry waste"
          name="solidWaste.SWQ30"
          formik={formik}
          isReadOnly={isReadOnly}
          options={["MRF", "Sold to recyclers", "Informal sector", "Landfilled"]}
        />

        <Select
          label="31. Final disposal method"
          name="solidWaste.SWQ31"
          formik={formik}
          showOtherInput
          isReadOnly={isReadOnly}
          options={["Sanitary landfill", "Dumpsite", "Co-processing"]}
        />

        <Select
          label="32. Is the landfill/dumpsite compliant with CPCB/MoHUA norms?"
          name="solidWaste.SWQ32"
          formik={formik}
          isReadOnly={isReadOnly}
          options={["Yes", "No", "Partially"]}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuestionField label="33. Measures for leachate management?" name="solidWaste.SWQ33" type="boolean" formik={formik} isReadOnly={isReadOnly} />
          <QuestionField label="34. Gas collection or flaring system?" name="solidWaste.SWQ34" type="boolean" formik={formik} isReadOnly={isReadOnly} />
          <QuestionField label="35. Dumpsite remediation or biomining initiated?" name="solidWaste.SWQ35" type="boolean" formik={formik} isReadOnly={isReadOnly} />
        </div>

        <QuestionField
          label="36. Total number of sanitation workers"
          name="solidWaste.SWQ36"
          type="number"
          formik={formik}
          isReadOnly={isReadOnly}
        />

        <Select
          label="37. Mode of employment"
          name="solidWaste.SWQ37"
          formik={formik}
          isReadOnly={isReadOnly}
          options={["Regular", "Contract", "Outsourced"]}
        />

        <QuestionField label="60. Key operational challenges" name="solidWaste.SWQ60" type="textarea" formik={formik} isReadOnly={isReadOnly} />
        <QuestionField label="61. Key infrastructure gaps" name="solidWaste.SWQ61" type="textarea" formik={formik} isReadOnly={isReadOnly} />
        <QuestionField label="62. Financial constraints" name="solidWaste.SWQ62" type="textarea" formik={formik} isReadOnly={isReadOnly} />
        <QuestionField label="63. Regulatory/compliance issues" name="solidWaste.SWQ63" type="textarea" formik={formik} isReadOnly={isReadOnly} />
        <QuestionField label="64. Behavioral/change management challenges" name="solidWaste.SWQ64" type="textarea" formik={formik} isReadOnly={isReadOnly} />
        <QuestionField label="65. Priority areas for improvement (next 1–3 years)" name="solidWaste.SWQ65" type="textarea" formik={formik} isReadOnly={isReadOnly} />
      </div>
    </div>
  );

  const renderWasteWater = () => (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-6">Wastewater Management</h1>
      <div className="grid grid-cols-1 gap-y-4">
        <Select
          label="Source of Wastewater"
          name="wasteWaterManagement.WWWQ1"
          formik={formik}
          isMulti
          isReadOnly={isReadOnly}
          options={["Domestic", "Industrial", "Commercial", "Stormwater"]}
        />

        <QuestionField label="Major Industrial Sources (if applicable)" name="wasteWaterManagement.WWWQ2" type="textarea" formik={formik} isReadOnly={isReadOnly} />
        <QuestionField label="Average Daily Influent Volume" name="wasteWaterManagement.WWWQ3" type="text" formik={formik} isReadOnly={isReadOnly} />

        <div className="w-full border-t border-gray-200 mt-4 pt-4">
          <h2 className="text-lg font-medium mb-4">4. Treatment Process & Technology</h2>
          <Select
            label="Treatment Type"
            name="wasteWaterManagement.WWWQ4"
            formik={formik}
            isMulti
            isReadOnly={isReadOnly}
            options={["Primary", "Secondary", "Tertiary"]}
          />
          <QuestionField label="Treatment Technologies Used" name="wasteWaterManagement.WWWQ5" type="textarea" formik={formik} isReadOnly={isReadOnly} />
          <QuestionField label="Sludge Treatment Method" name="wasteWaterManagement.WWWQ6" type="textarea" formik={formik} isReadOnly={isReadOnly} />
          <QuestionField label="Treated Water Utilization" name="wasteWaterManagement.WWWQ7" type="textarea" formik={formik} isReadOnly={isReadOnly} />
          <QuestionField label="Disposal Location" name="wasteWaterManagement.WWWQ8" type="textarea" formik={formik} isReadOnly={isReadOnly} />
        </div>

        <div className="w-full border-t border-gray-200 mt-4 pt-4">
          <h2 className="text-lg font-medium mb-4">5. Operations & Maintenance (O&M)</h2>
          <Select
            label="O&M Managed By"
            name="wasteWaterManagement.WWWQ9"
            formik={formik}
            isReadOnly={isReadOnly}
            options={["In-house", "Third Party"]}
          />
          <QuestionField label="Name of O&M Agency" name="wasteWaterManagement.WWWQ10" type="text" formik={formik} isReadOnly={isReadOnly} />
          <QuestionField label="Key Challenges" name="wasteWaterManagement.WWWQ11" type="textarea" formik={formik} isReadOnly={isReadOnly} />
        </div>

        <div className="w-full border-t border-gray-200 mt-4 pt-4">
          <h2 className="text-lg font-medium mb-4">6. Automation & Digital Systems</h2>
          <Select
            label="Level of Automation"
            name="wasteWaterManagement.WWWQ12"
            formik={formik}
            isReadOnly={isReadOnly}
            options={["Manual", "Semi-automatic", "Fully automatic"]}
          />
        </div>

        <div className="w-full border-t border-gray-200 mt-4 pt-4">
          <h2 className="text-lg font-medium mb-4">7. Expansion Plans & Future Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuestionField label="Planned Capacity Expansion?" name="wasteWaterManagement.WWWQ13" type="boolean" formik={formik} isReadOnly={isReadOnly} />
            <QuestionField label="Planned Technology Upgrades?" name="wasteWaterManagement.WWWQ14" type="boolean" formik={formik} isReadOnly={isReadOnly} />
            <QuestionField label="Interest in Advanced Solutions?" name="wasteWaterManagement.WWWQ15" type="boolean" formik={formik} isReadOnly={isReadOnly} />
          </div>
          <QuestionField label="Additional CRM Requirements" name="wasteWaterManagement.WWWQ16" type="textarea" formik={formik} isReadOnly={isReadOnly} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-md shadow-sm border border-gray-200">
      {type === "biomedical" && renderBiomedicalWaste()}
      {type === "solid" && renderSolidWaste()}
      {type === "water" && renderWasteWater()}
    </div>
  );
};

export default BiomedicalAndSolidWaste;
