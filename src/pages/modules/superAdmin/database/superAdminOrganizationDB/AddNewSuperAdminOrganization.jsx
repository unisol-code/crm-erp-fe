import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb";
import { FaPlusCircle } from "react-icons/fa";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import Button from "../../../../../components/uiComponents/button/Button";
import BasicInfo from "./superAdminOrganizationTabs/BasicInfo";
import Laundry from "./superAdminOrganizationTabs/Laundry";
import Kitchen from "./superAdminOrganizationTabs/Kitchen";
import StpEtp from "./superAdminOrganizationTabs/StpEtp";
import BiomedicalAndSolidWaste from "./superAdminOrganizationTabs/BiomedicalAndSolidWaste";
import ReactSelect from "react-select";
import { useNavigate, useParams } from "react-router-dom";
import useAdminOrganizationDB from "../../../../../hooks/superAdminHook/superAdmindatabase/useAdminOrganizationDB";
import {
  initialValues,
  transformApiDataToForm,
  transformFormDataToApi,
  validationSchema,
} from "./SuperAdminOrganizationInitialValues";
import HospitalData from "./superAdminOrganizationTabs/HospitalData";
import AssignToEmployee from "./superAdminOrganizationTabs/AssignToEmployee";

const Select = ({
  label,
  name,
  formik,
  options,
  loading = false,
  isReadOnly = false,
  isMulti = false,
  placeholder = "Select option"

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

  const selectOptions = options.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt
  );
  const selectedOption = isMulti
    ? selectOptions.filter((opt) => value?.includes?.(opt.value))
    : selectOptions.find((opt) => opt.value === value) || null;

  return (
    <div className="flex flex-col w-full mb-4">
      <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      <ReactSelect
        options={selectOptions}
        isLoading={loading}
        name={name}
        isMulti={isMulti}
        value={selectedOption}
        onChange={(selected) => {
          if (isMulti) {
            formik.setFieldValue(name, selected ? selected.map(s => s.value) : []);
          } else {
            formik.setFieldValue(name, selected?.value || "");
          }
        }}
        onBlur={() => formik.setFieldTouched(name, true)}

        placeholder={placeholder}
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

// ✅ CRITICAL FIX: Move WasteManagementTabs outside the main component
const WasteManagementTabs = ({ formik, isReadOnly }) => {
  const wasteOptions = [
    { label: "Solid Waste Management", value: "solid" },
    { label: "Waste Water Management", value: "water" },
    { label: "Biomedical Waste Management", value: "biomedical" },
  ];

  return (
    <div className="p-4 m-2">
      <div className="w-full md:w-2/3 ml-4">
        <Select
          label="Select Waste Management Type(s)"
          name="wasteManagement.types"
          formik={formik}
          isMulti
          placeholder="Select Waste Type(s)"
          options={wasteOptions}
          isReadOnly={isReadOnly}
        />
      </div>
      <div className="w-full border-b border-gray-300 my-6" />
      {formik.values.wasteManagement?.types?.map((type) => (
        <div key={type} className="mb-8">
          <BiomedicalAndSolidWaste
            formik={formik}
            type={type}
            isReadOnly={isReadOnly}
          />
        </div>
      ))}
    </div>
  );
};
const AddNewSuperAdminOrganization = ({ mode = "add" }) => {
  const { theme } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    loading,
    createAdminOrganization,
    fetchAdminOrganizationalDBByID,
    adminOrganizationalDBByID,
    resestAdminOrganizationalDBByID,
    updateAdminOrganization,
  } = useAdminOrganizationDB();
  const [activeTab, setActiveTab] = useState("Basic Info");
  const [currentStep, setCurrentStep] = useState(0);
  const [touchedSteps, setTouchedSteps] = useState([]);
  const [wasteTab, setWasteTab] = useState("solid waste");

  const isEdit = mode === "edit";
  const isView = mode === "view";
  const isReadOnly = isView;

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validateOnMount: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (isView) return;
      const apiData = transformFormDataToApi(values);
      let success;
      if (isEdit) {
        success = await updateAdminOrganization(id, apiData);
        if (success) {
          navigate(`/database/view-organization/${id}`);
        }
      } else {
        success = await createAdminOrganization(apiData);
        if (success) {
          navigate("/database");
        }
      }
    },
  });

  useEffect(() => {
    if (id) {
      fetchAdminOrganizationalDBByID(id);
    }
    return () => resestAdminOrganizationalDBByID();
  }, [id]);

  useEffect(() => {
    if (adminOrganizationalDBByID && (isEdit || isView)) {
      const formData = transformApiDataToForm(adminOrganizationalDBByID);
      formik.setValues(formData);
    }
  }, [adminOrganizationalDBByID, isEdit]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [activeTab]);

  const tabs = [
    "Basic Info",
    "Hospital Data",
    "Laundry",
    "Kitchen",
    "Physiotherapy Setup",
    "Waste Management",
    "Assign to employee",
  ];

  const renderSection = () => {
    const commonProps = { formik, isReadOnly };

    switch (activeTab) {
      case "Basic Info":
        return <BasicInfo {...commonProps} />;
      case "Hospital Data":
        return <HospitalData {...commonProps} />;
      case "Laundry":
        return <Laundry {...commonProps} />;
      case "Kitchen":
        return <Kitchen {...commonProps} />;
      case "Physiotherapy Setup":
        return <StpEtp {...commonProps} />;
      case "Waste Management":
        return <WasteManagementTabs {...commonProps} />;
      case "Assign to employee":
        return <AssignToEmployee {...commonProps} />;
      default:
        return null;
    }
  };

  const tabKeysMapping = {
    "Basic Info": [
      "segment",
      "hospitalName",
      "typeOfHospital",
      "typeOfOrgOrHospital",
      "ifGovt",
      "address",
      "district",
      "state",
      "region",
      "city",
      "emailAddress",
    ],

    "Hospital Data": [
      "totalBeds",
      "totalICUBeds",
      "totalOT",
      "specialities[].name",
      "specialities[].surgeries[].surgeryType",
      "specialities[].surgeries[].numberOfSurgeries",
      "specialities[].totalSurgeriesCalenderYear",
    ],

    Laundry: ["laundryType", "totalLoadPerDay", "totalManPower", "costPerBed"],
    kitchen: [
      "kitchenType",
      "totalCapacity",
      "breakfast",
      "lunch",
      "dinner",
      "afternoonTea",
      "lateNightMilk",
    ],
    PhysiotherapySetup: [
      "stpStatus",
      "yearOfInstallation",
      "stpCapacity",
      "etpStatus",
      "yearOfInstallation",
      "etpCapacity",
    ],
    "Waste Management": [
      "wasteManagement.type",
      "bioMedicalWaste",
      "solidWaste",
      "wasteWaterManagement",
    ],
    "Assign to employee": ["salesPersonName"],
  };

  const pageTitle = isView
    ? "View Organization"
    : isEdit
      ? "Edit Organization"
      : "Add New Organization";

  return (
    <div className="w-full min-h-screen">
      <BreadCrumb
        linkText={[
          { text: "Organizational Database", href: "/database" },
          { text: pageTitle },
        ]}
      />

      <div className="bg-white min-h-screen rounded-md">
        <div className="text-center">
          <h2
            className="flex p-6 mb-4 items-center justify-center font-semibold text-xl text-black bg-opacity-40 rounded-t-md"
            style={{ backgroundColor: theme.secondaryColor }}
          >
            {pageTitle}
          </h2>
        </div>

        <div className="border-b border-gray-300">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide px-2 sm:justify-between">
            {tabs.map((tab, index) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setTouchedSteps((prev) => [...new Set([...prev, index])]);
                  setActiveTab(tab);
                  setCurrentStep(index);
                }}
                className={`whitespace-nowrap px-4 py-2 text-sm sm:text-md font-semibold border-b-2 transition-all duration-300
                      ${activeTab === tab
                    ? "border-[#355DC4] text-[#355DC4]"
                    : "border-transparent text-gray-500 hover:text-[#355DC4]"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={formik.handleSubmit}>
          {renderSection()}

          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={() => {
                navigate("/database/add-newindividual");
              }}
              className="flex items-center gap-2 px-8 py-1 font-semibold border border-[var(--primary-color)] text-[var(--primary-color)] bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              <FaPlusCircle size={18} /> Add Individual
            </button>
          </div>

          <div className="flex justify-center mt-6 gap-4">
            {currentStep === tabs.length - 1 && (
              <Button
                text="Cancel"
                type="button"
                onClick={() => console.log("Cancel pressed")}
              />
            )}

            {currentStep < tabs.length - 1 ? (
              <Button
                text="Save & Proceed"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  const fields = tabKeysMapping[tabs[currentStep]] || [];
                  fields.forEach((field) =>
                    formik.setFieldTouched(field, true)
                  );
                  setTouchedSteps((prev) => [
                    ...new Set([...prev, currentStep + 1]),
                  ]);
                  setCurrentStep((prev) => prev + 1);
                  setActiveTab(tabs[currentStep + 1]);
                }}
              />
            ) : (
              <Button
                text={isEdit ? "Save Changes" : "Submit"}
                type="submit"
                isFormikButton={true}
                isValid={formik.isValid}
                isDirty={formik.dirty}
                disabled={loading}
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewSuperAdminOrganization;
