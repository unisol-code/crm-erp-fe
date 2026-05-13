import React, { useState, useEffect } from "react";
import useDropdown from "../../../../../../hooks/dropdown/useDropdown";
import ConcernPersonForm from "./ConcernPersonForm";
import ReactSelect from "react-select";
import _ from "lodash";

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

  const rawValue = _.get(formik.values, name);
  const touched = _.get(formik.touched, name, false);
  const error = _.get(formik.errors, name, "");

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
        isDisabled={loading || isReadOnly}
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
  const value = _.get(formik.values, name, "");
  const touched = _.get(formik.touched, name, false);
  const error = _.get(formik.errors, name, "");

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

        {touched && error && !isReadOnly && (
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
        className={`${baseClass} ${type === "number" ? "no-spinner" : ""}`}
      />

      {touched && error && !isReadOnly && (
        <span className="text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
};

const Kitchen = ({ formik, isReadOnly = false }) => {
  const {
    fetchKitchenType,
    kitchenType,
    loading,
    KWM1,
    fetchkitchenqueone,
    fetchkitchenquetwo,
    KWM2,
    fetchkitchenquefive,
    KWM5,
    fetchkitchenquenine,
    KWM9,
    fetchkitchenqueeleven,
    KWM11,
  } = useDropdown();

  useEffect(() => {
    fetchKitchenType();
    fetchkitchenqueone();
    fetchkitchenquetwo();
    fetchkitchenquefive();
    fetchkitchenquenine();
    fetchkitchenqueeleven();
  }, []);

  const kitchenQ1Options = Array.isArray(KWM1)
    ? KWM1.map((i) => ({ label: i, value: i }))
    : [];

  const kitchenQ2Options = Array.isArray(KWM2)
    ? KWM2.map((i) => ({ label: i, value: i }))
    : [];

  const kitchenQ5Options = Array.isArray(KWM5)
    ? KWM5.map((i) => ({ label: i, value: i }))
    : [];

  const kitchenQ9Options = Array.isArray(KWM9)
    ? KWM9.map((i) => ({ label: i, value: i }))
    : [];

  const kitchenQ11Options = Array.isArray(KWM11)
    ? KWM11.map((i) => ({ label: i, value: i }))
    : [];

  useEffect(() => {
    if (formik.values?.kitchenWasteManagement?.KWMQ3 === false) {
      formik.setFieldValue("kitchenWasteManagement.KWMQ3.briefAnswer", "");
    }
  }, [formik.values?.kitchenWasteManagement?.KWMQ3]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-6">KITCHEN FACILITY</h1>

      <div className="p-6 pt-0 bg-white rounded-md">
        <div className="grid grid-cols-1 gap-y-2">
          {/* Q1 */}

          <Select
            label="1. How many meals are prepared daily?"
            name="kitchenWasteManagement.KWMQ1"
            formik={formik}
            isMulti
            showOtherInput
            isReadOnly={isReadOnly}
            otherFieldName="kitchenWasteManagement.KWMQ1"
            options={kitchenQ1Options}
          />

          {/* Q2 */}
          <Select
            label="2.What types of food are commonly prepared (veg, non-veg, therapeutic diets, etc.)?"
            name="kitchenWasteManagement.KWMQ2"
            formik={formik}
            isMulti
            showOtherInput
            otherFieldName="kitchenWasteManagement.KWMQ2"
            options={kitchenQ2Options}
            loading={loading}
            isReadOnly={isReadOnly}
            placeholder="Select meals"
          />

          {/* Q3 */}
          <QuestionField
            label="3. Do you have records of average food/raw material procurement and consumption?"
            name="kitchenWasteManagement.KWMQ3.answers"
            type="boolean"
            isReadOnly={isReadOnly}
            formik={formik}
          />

          {/* Q3 – Conditional Text Field (only if YES) */}
          {formik.values?.kitchenWasteManagement?.KWMQ3?.answers === true && (
            <QuestionField
              label="Please describe briefly"
              name="kitchenWasteManagement.KWMQ3.briefAnswer"
              type="text"
              isReadOnly={isReadOnly}
              placeholder="Briefly explain the records maintained"
              formik={formik}
            />
          )}

          {/* Q4 */}
          <QuestionField
            label="4.Approximately how much kitchen waste (kg/day) is generated?"
            name="kitchenWasteManagement.KWMQ4"
            type="number"
            isReadOnly={isReadOnly}
            formik={formik}
          />

          {/* Q5 */}
          <Select
            label="5. What types of kitchen waste are most common?"
            name="kitchenWasteManagement.KWMQ5"
            formik={formik}
            isMulti
            showOtherInput
            otherFieldName="kitchenWasteManagement.KWMQ5"
            options={kitchenQ5Options}
            loading={loading}
            isReadOnly={isReadOnly}
            placeholder="Select Options"
          />

          {/* Q6 */}
          <QuestionField
            label="6. Do you categorise waste into wet (biodegradable) and dry (non-biodegradable) waste?"
            name="kitchenWasteManagement.KWMQ6"
            type="boolean"
            isReadOnly={isReadOnly}
            formik={formik}
          />

          {/* Q7 */}
          <QuestionField
            label="7. How is the kitchen waste collected (bins, segrega􀆟on at source)?"
            name="kitchenWasteManagement.KWMQ7"
            type="textarea"
            maxWords={50}
            isReadOnly={isReadOnly}
            formik={formik}
          />

          {/* Q8 */}
          <QuestionField
            label="8. What type of bins/containers store biodegradable waste?"
            name="kitchenWasteManagement.KWMQ8"
            type="textarea"
            maxWords={50}
            formik={formik}
            isReadOnly={isReadOnly}
          />

          {/* Q9 */}
          <Select
            label="9.How frequently is waste collected from the kitchen"
            name="kitchenWasteManagement.KWMQ9"
            formik={formik}
            // isMulti
            showOtherInput
            isReadOnly={isReadOnly}
            otherFieldName="kitchenWasteManagement.KWMQ9"
            options={kitchenQ9Options}
            loading={loading}
            placeholder="Select Options"
          />

          {/* Q10 */}
          <QuestionField
            label="10. How long is waste stored on-site before disposal?"
            name="kitchenWasteManagement.KWMQ10"
            type="textarea"
            maxWords={50}
            formik={formik}
            isReadOnly={isReadOnly}
          />

          {/* Q11 */}
          <Select
            label="11. What is the current method of kitchen waste disposal ?"
            name="kitchenWasteManagement.KWMQ11"
            formik={formik}
            // isMulti
            showOtherInput
            otherFieldName="kitchenWasteManagement.KWMQ11"
            options={kitchenQ11Options}
            loading={loading}
            placeholder="Select Option"
            isReadOnly={isReadOnly}
          />

          <ConcernPersonForm
            title="Concern Persons (Kitchen Waste)"
            sectionName="kitchenWasteManagement.concernPersons"
            formik={formik}
            isReadOnly={isReadOnly}
          />
        </div>
      </div>
    </div>
  );
};

export default Kitchen;
