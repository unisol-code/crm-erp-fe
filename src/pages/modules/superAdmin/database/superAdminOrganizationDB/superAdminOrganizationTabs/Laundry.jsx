import React, { useEffect } from "react";
import useDropdown from "../../../../../../hooks/dropdown/useDropdown";
import ReactSelect from "react-select";

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
  otherFieldName,
}) => {
  const rawValue = name
    .split(".")
    .reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : undefined), formik.values);

  const value = isMulti ? rawValue || [] : rawValue || "";


  const touched = name
    .split(".")
    .reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : false), formik.touched);

  const error = name
    .split(".")
    .reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : ""), formik.errors);

  // 🔹 add "Other" option
  const selectOptions = [
    ...options.map((opt) =>
      typeof opt === "string" ? { label: opt, value: opt } : opt
    ),
    // ...(showOtherInput ? [{ label: "Other", value: "Other" }] : []),
  ];

  const selectedValue = isMulti
    ? selectOptions.filter((opt) => value?.includes(opt.value))
    : selectOptions.find((opt) => opt.value === value) || null;

  const isOtherSelected = isMulti
    ? value?.includes("Other")
    : value === "Other";



  return (
    <div className="flex flex-col w-full mb-4">
      <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>

      <ReactSelect
        options={selectOptions}
        isMulti={isMulti}
        name={name}
        value={selectedValue}
        isLoading={loading}
        isDisabled={loading || isReadOnly} 
        
        onChange={(selected) => {
          if (isMulti) {
            const values = selected ? selected.map((s) => s.value) : [];
            formik.setFieldValue(name, values);
          } else {
            formik.setFieldValue(name, selected?.value || "");
          }
        }}
        onBlur={() => formik.setFieldTouched(name, true)}
        placeholder={placeholder}
        classNamePrefix="react-select"

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

      {/* 🔹 OTHER TEXT FIELD */}
      {showOtherInput && isOtherSelected && !isReadOnly && (
        <input
          type="text"
          className="mt-2 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
          placeholder="Please specify"
          value={
            otherFieldName
              ?.split(".")
              .reduce((obj, key) => (obj ? obj[key] : ""), formik.values) || ""
          }
          onChange={(e) =>
            formik.setFieldValue(otherFieldName, e.target.value)
          }
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

  const baseClass = `border rounded-lg px-3 py-3 focus:outline-none focus:ring-2 ${touched && error
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
                  onChange={() => formik.setFieldValue(name, boolValue)}
                  onBlur={() => formik.setFieldTouched(name, true)}
                />
                {option}
              </label>
            );
          })}
        </div>

        {touched && error && !isReadOnly  (
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
            if (!maxWords || countWords(text) <= maxWords) {
              formik.setFieldValue(name, text);
            }
          }}
          onBlur={formik.handleBlur}
          className={`${baseClass} ${exceeded ? "border-red-500 focus:ring-red-300" : ""
            }`}
        />

        {/* Word Counter */}
        {maxWords && (
          <div
            className={`text-xs mt-1 text-right ${exceeded ? "text-red-500" : "text-gray-500"
              }`}
          >
            {wordCount}/{maxWords} words
          </div>
        )}

        {touched && error && !isReadOnly && (
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

      {touched && error && !isReadOnly  (
        <span className="text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
};

const DoubleTextareaQuestion = ({
  label,
  formik,
  nameA,
  nameB,
  labelA,
  labelB,
  maxWords = 50,
  isReadOnly = false, 
}) => {
  return (
    <div className="flex flex-col w-full mb-6">
      {/* Main Question */}
      <label className="text-sm font-medium text-gray-700 mb-3">{label}</label>

      {/* Normal Linen */}
      <QuestionField
        label={labelA}
        name={nameA}
        type="textarea"
        formik={formik}
        maxWords={maxWords}
        isReadOnly={isReadOnly}
      />

      {/* Infectious Linen */}
      <QuestionField
        label={labelB}
        name={nameB}
        type="textarea"
        formik={formik}
        maxWords={maxWords}
        isReadOnly={isReadOnly}
      />
    </div>
  );
};

// Laundry Component
const Laundry = ({ formik, isReadOnly = false }) => {
  const { fetchLaundryType, laundryType, loading, fetchlaundrytwo,
    IQ2 } = useDropdown();

  useEffect(() => {
    fetchLaundryType();
    fetchlaundrytwo();
  }, []);

  const laundryQ2Options = Array.isArray(IQ2)
    ? IQ2.map((item) => ({
      label: item,
      value: item,
    }))
    : [];
  const laundryTypeValue = formik.values?.Laundry?.laundryType;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-6">LAUNDRY FACILITY</h1>

      <div className="p-6 pt-0 bg-white rounded-md">
        <div className="grid grid-cols-1 gap-y-2 mt-5">
          <QuestionField
            label="1.	On average, how many kg of linen is processed daily (bedsheets, gowns, uniforms, curtains, etc.)?"
            name="laundry.LQ1"
            type="number"
            isReadOnly={isReadOnly}
            formik={formik}
          />

          <Select
            label="2.	Who is responsible for laundry operations "
            name="laundry.LQ2"
            formik={formik}
            options={laundryQ2Options}
            loading={loading}
           isReadOnly={isReadOnly}
            placeholder="Select Options"
          />

          <QuestionField
            label="3.	How is soiled linen collected from wards, ICUs, OTs, and other areas?"
            name="laundry.LQ3"
            formik={formik}
            type="textarea"
            isReadOnly={isReadOnly}
            maxWords={50}
          />

          <QuestionField
            label="4.	Is infectious/contaminated linen segregated separately from non-infectious linen?"
            name="laundry.LQ4"
            type="boolean"
            isReadOnly={isReadOnly}
            formik={formik}
          />

          <QuestionField
            label="5.	What type of bags/containers are used for collection (color-coded bags, trolleys, etc.)?"
            name="laundry.LQ5"
            formik={formik}
            type="textarea"
            isReadOnly={isReadOnly}
            maxWords={50}
          />

          <QuestionField
            label="6.	How is soiled linen transported to the laundry (covered trolleys, chutes, designated lifts)?"
            name="laundry.LQ6"
            formik={formik}
            type="textarea"
            isReadOnly={isReadOnly}
            maxWords={50}
          />

          <QuestionField
            label="7.	Is there a designated area for the temporary storage of soiled linen?"
            name="laundry.LQ7"
            formik={formik}
            type="textarea"
            isReadOnly={isReadOnly}
            maxWords={50}
          />

          <QuestionField
            label="8.	What precautions are taken to prevent mixing of clean and soiled linen during handling?
Text (limit 50 words)
"
            name="laundry.LQ8"
            formik={formik}
            type="textarea"
            isReadOnly={isReadOnly}
            maxWords={50}
          />

          <QuestionField
            label="9.	What type of laundry system is used (manual, semi-automatic, industrial machines)?
Text (limit 50 words)
"
            name="laundry.LQ9"
            formik={formik}
            type="textarea"
            isReadOnly={isReadOnly}
            maxWords={50}
          />

          <DoubleTextareaQuestion
            label="10. What is the washing cycle/process for:"
            formik={formik}
            nameA="laundry.LQ10A"
            nameB="laundry.LQ10B"
            isReadOnly={isReadOnly}
            labelA="Normal linen (limit 50 words)"
            labelB="Infectious linen (e.g., from isolation wards, OTs, ICUs) (limit 50 words)"
            maxWords={50}
          />

          <QuestionField
            label="11.	What disinfectants/chemicals are used in the washing process?"
            name="laundry.LQ11"
            formik={formik}
            type="textarea"
            isReadOnly={isReadOnly}
            maxWords={50}
          />

          <QuestionField
            label="12.	Are separate machines used for infected and non-infected linen?"
            name="laundry.LQ12"
            formik={formik}
            type="textarea"
            isReadOnly={isReadOnly}
            maxWords={50}
          />

          <QuestionField
            label="13.	How is hot water/steam used for disinfection?"
            name="laundry.LQ13"
            formik={formik}
            type="textarea"
            isReadOnly={isReadOnly}
            maxWords={50}
          />

          <QuestionField
            label="14.	How is washed linen dried (dryers, natural sunlight, steam drying)?"
            name="laundry.LQ14"
            formik={formik}
            type="textarea"
            isReadOnly={isReadOnly}
            maxWords={50}
          />

          <QuestionField
            label="15.	Where and how is clean linen stored to ensure hygiene and avoid contamination?"
            name="laundry.LQ15"
            formik={formik}
            type="textarea"
            isReadOnly={isReadOnly}
            maxWords={50}
          />

          <QuestionField
            label="16.	How is linen distributed back to different hospital departments?"
            name="laundry.LQ16"
            formik={formik}
            type="textarea"
            isReadOnly={isReadOnly}
            maxWords={50}
          />

          <QuestionField
            label="17.	How is torn/damaged linen handled (repair, reuse, or discard)?"
            name="laundry.LQ17"
            formik={formik}
            type="textarea"
            isReadOnly={isReadOnly}
            maxWords={50}
          />

          <QuestionField
            label="18.	What is the disposal method for unusable linen (incineration, shredding, vendor sale)?"
            name="laundry.LQ18"
            formik={formik}
            type="textarea"
            isReadOnly={isReadOnly}
            maxWords={50}
          />

          <QuestionField
            label="19.	Do you maintain records of linen rejection and replacement?"
            name="laundry.LQ19"
            formik={formik}
            type="textarea"
            isReadOnly={isReadOnly}
            maxWords={50}
          />
        </div>
      </div>
    </div>
  );
};

export default Laundry;
