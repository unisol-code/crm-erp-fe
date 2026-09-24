import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb";
import { FaPlusCircle } from "react-icons/fa";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import Button from "../../../../../components/uiComponents/button/Button";
import BasicInfo from "./organizationTabs/BasicInfo";
import Laundry from "./organizationTabs/Laundry";
import Kitchen from "./organizationTabs/Kitchen";
import StpEtp from "./organizationTabs/StpEtp";
import BiomedicalAndSolidWaste from "./organizationTabs/BiomedicalAndSolidWaste";
import { useNavigate, useParams } from "react-router-dom";
import useDropdown from "../../../../../hooks/dropdown/useDropdown";
import {
  initialValues,
  transformApiDataToForm,
  validationSchema,
} from "./organizationInitialValues";
import ReactSelect from "react-select";
import HospitalData from "./organizationTabs/HospitalData";
import useAdminOrganizationDB from "../../../../../hooks/superAdminHook/superAdmindatabase/useAdminOrganizationDB";
import Vendor, {
  isVendorProfileType,
  vendorInitialValues,
} from "../individualDatabase/tabs/Vendor";
import * as Yup from "yup";

// ✅ CRITICAL FIX: Move Select component outside
const Select = ({
  label,
  name,
  formik,
  options,
  loading = false,
  placeholder = "Select option",
  isReadOnly = false,
  isMulti = false,
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

  const selectedValue = isMulti
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
        value={selectedValue}
        onChange={(selected) => {
          if (isMulti) {
            formik.setFieldValue(name, selected ? selected.map((s) => s.value) : []);
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


// ✅ Vendor Management segment -> extra "Vendor Type" dropdown (Supplier / Distributor)
const VENDOR_SEGMENT_NAMES = ["vendor management"];
const VENDOR_PROFILE_TYPES = ["Supplier", "Distributor"];
const isVendorManagementSegment = (value) => {
  const n = (value || "").toString().trim().toLowerCase();
  return VENDOR_SEGMENT_NAMES.includes(n) || n.includes("vendor");
};

// Vendor validation - same rules as the individual vendor form
// (vendorUniqueId is left out because its input is commented out inside Vendor.jsx)
const vendorValidationSchema = Yup.object({
  vendorType: Yup.string().required("Vendor Type is required"),
  companyName: Yup.string().required("Company Name is required"),
  // contactPersonName: Yup.string().required("Contact Person Name is required"),
  contactNumber: Yup.string()
    .required("Contact Number is required")
    .matches(/^[0-9]{10}$/, "Contact Number must be 10 digits"),
  // alternateContactNumber: Yup.string().matches(
  //   /^[0-9]{10}$/,
  //   "Alternate Number must be 10 digits"
  // ),
  emailAddress: Yup.string().required("Email is required").email("Invalid email"),
  website: Yup.string().url("Invalid URL"),
  organizationType: Yup.string().required("Organization Type is required"),
  businessCategory: Yup.string().required("Business Category is required"),
  // country: Yup.string().required("Country is required"),
  region: Yup.string().required("Region is required"),
  state: Yup.string().required("State is required"),
  district: Yup.string().required("District is required"),
  city: Yup.string().required("City is required"),
  pincode: Yup.string()
    .required("Pincode is required")
    .matches(/^(?!0{6})[0-9]{6}$/, "Must be a valid 6-digit pincode"),
  completeAddress: Yup.string().required("Complete Address is required"),
  gstNumber: Yup.string().matches(
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    "Invalid GST Number"
  ),
  panNumber: Yup.string().matches(
    /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    "Invalid PAN (e.g. ABCDE1234F)"
  ),
  supplierType: Yup.string().when("vendorType", {
    is: "Supplier",
    then: (s) => s.required("Supplier Type is required"),
    otherwise: (s) => s.notRequired(),
  }),
  distributorType: Yup.string().when("vendorType", {
    is: "Distributor",
    then: (s) => s.required("Distributor Type is required"),
    otherwise: (s) => s.notRequired(),
  }),
});

// ✅ Vendor form documents (file inputs) are File objects inside formik values, and
// axios JSON-serializes a File to {} - that is why the uploads looked missing from the
// payload. Same convention as the individual module: send the file name(s) instead
// (a document that was not uploaded is sent as "").
// NOTE: add a field here if a file input is ever added to an organization tab.
const VENDOR_FILE_FIELDS = [
  "gstCertificate",
  "panDocument",
  "certificationDocument",
  "pricingContract",
  "licenseDocument",
  "complianceDocuments",
  "agreementDocument",
  "otherDocuments",
];

const fileToName = (file) =>
  !file ? "" : typeof file === "string" ? file : file.name || "";

// payload sent to the API - files replaced by their names
const withFileNames = (values) => {
  const payload = { ...values };
  VENDOR_FILE_FIELDS.forEach((field) => {
    const value = payload[field];
    if (value === undefined) return;
    payload[field] = Array.isArray(value)
      ? value.map(fileToName).filter(Boolean)
      : fileToName(value);
  });
  return payload;
};

// ✅ Segment + vendor profile selectors. The parent owns both values (so it can decide
//    whether the Vendor form has to be rendered); nothing is stored in formik here.
const SegmentSelector = ({
  isReadOnly = false,
  selectedSegment = "",
  onSegmentChange,
  vendorProfileType = "",
  onVendorProfileChange,
}) => {
  const { segmentState, segment, loading } = useDropdown();

  useEffect(() => {
    segmentState();
  }, []);

  const segmentOptions = Array.isArray(segment)
    ? segment.map((seg) => ({ label: seg, value: seg }))
    : [];
  const vendorProfileOptions = VENDOR_PROFILE_TYPES.map((type) => ({
    label: type,
    value: type,
  }));
  // Segment = "Vendor Management" -> show the extra Vendor Type dropdown
  const showVendorProfile = isVendorManagementSegment(selectedSegment);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
      <div className="flex flex-col w-full">
        <label className="text-sm font-medium text-gray-700 mb-1">Segment</label>
        <ReactSelect
          options={segmentOptions}
          isLoading={loading}
          isDisabled={isReadOnly || loading}
          value={
            segmentOptions.find((opt) => opt.value === selectedSegment) || null
          }
          onChange={(selected) => {
            // the parent resets the vendor profile when the segment changes
            onSegmentChange?.(selected?.value || "");
          }}
          placeholder="Select Segment"
          classNamePrefix="react-select"
          isClearable
        />
      </div>

      {showVendorProfile && (
        <div className="flex flex-col w-full">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Vendor Type
          </label>
          <ReactSelect
            options={vendorProfileOptions}
            isDisabled={isReadOnly}
            value={
              vendorProfileOptions.find(
                (opt) => opt.value === vendorProfileType
              ) || null
            }
            onChange={(selected) => onVendorProfileChange?.(selected?.value || "")}
            placeholder="Select Type"
            classNamePrefix="react-select"
            isClearable
          />
        </div>
      )}
    </div>
  );
};


// ✅ small hint shown while the page waits for a selection (no tabs / no form yet)
const HintBox = ({ children }) => (
  <div className="p-4 m-2">
    <div className="border border-dashed border-gray-300 rounded-md px-6 py-8 text-center text-sm text-gray-600">
      {children}
    </div>
  </div>
);

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

const AddNewOrganization = ({ mode = "add" }) => {
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
  // Segment / vendor profile selection (drives the Vendor form below)
  const [selectedSegment, setSelectedSegment] = useState("");
  const [vendorProfileType, setVendorProfileType] = useState("");

  // Add flow waits for a Segment -> no tabs / no form until it is picked.
  // Edit / View keep showing the saved record (their tabs + form) as before.
  const hasSegment = mode !== "add" || !!selectedSegment;
  // the vendor flow only drives the add screen; edit / view keep the tabbed org form
  const isVendorSegment =
    mode === "add" && isVendorManagementSegment(selectedSegment);

  // Segment = "Vendor Management" + any vendor profile (Supplier / Distributor) -> Vendor form
  const showVendorForm =
    isVendorSegment && isVendorProfileType(vendorProfileType);
  // the tabbed organization form is only for non-vendor segments
  const showOrgForm = hasSegment && !isVendorSegment;

  const isEdit = mode === "edit";
  const isView = mode === "view";
  const isReadOnly = isView;

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validateOnMount: true,
    validationSchema: showVendorForm ? vendorValidationSchema : validationSchema,
    onSubmit: async (values) => {
      console.log("Submitting values:", values);
      if (isView) return;

      // File objects (vendor documents) are replaced by their file names so the
      // uploads are actually part of the JSON payload
      const payload = withFileNames(values);

      // wait until the API confirms success before leaving the page.
      // on failure stay on the form (the hook already shows the error toast)
      const saved = isEdit
        ? await updateAdminOrganization(id, payload)
        : await createAdminOrganization(payload);
      if (!saved) return;

      navigate("/sales-executive/database");
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
      // reflect the saved segment (same field the Basic form uses: Basic.segment)
      setSelectedSegment(formData?.Basic?.segment || "");
    }
  }, [adminOrganizationalDBByID, isEdit]);

  // the vendor form has its own defaults (country "India", conditional flags, ...)
  useEffect(() => {
    if (!showVendorForm) return;
    const missing = {};
    Object.entries(vendorInitialValues).forEach(([key, value]) => {
      if (formik.values[key] === undefined) missing[key] = value;
    });
    if (Object.keys(missing).length) {
      formik.setValues({ ...formik.values, ...missing }, false);
    }
  }, [showVendorForm]);

  // The segment is stored in the same field the Basic form already uses
  // (Basic.segment) - so it stays validated and saved exactly like before,
  // for the organization form as well as for the vendor form.
  const handleSegmentChange = (value) => {
    formik.setFieldValue("Basic.segment", value || "");
    formik.setFieldTouched("Basic.segment", true);
    setSelectedSegment(value || "");
    // segment changed -> reset the vendor profile (and hide the vendor form)
    setVendorProfileType("");
  };

  // keep the selector in sync when the Segment field is changed directly inside
  // the Basic Info tab (both write to the same field: Basic.segment)
  useEffect(() => {
    const segmentValue = formik.values?.Basic?.segment || "";
    setSelectedSegment((prev) => (prev === segmentValue ? prev : segmentValue));
  }, [formik.values?.Basic?.segment]);

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
  ];

  const renderSection = () => {
    const commonProps = { formik, isReadOnly };

    // No segment selected -> show nothing (no tabs / no form)
    if (!hasSegment) {
      return (
        <HintBox>
          Please select a <b>Segment</b> to continue.
        </HintBox>
      );
    }

    // Vendor Management without Supplier / Distributor -> nothing to render yet
    if (isVendorSegment && !showVendorForm) {
      return (
        <HintBox>
          Please select <b>Vendor Type</b> (Supplier / Distributor) to continue.
        </HintBox>
      );
    }

    // Segment = "Vendor Management" + Supplier / Distributor -> Vendor form
    // (same behaviour as the individual form: the vendor form replaces the tab content)
    if (showVendorForm) {
      return (
        <div className="px-6 pt-6 pb-6">
          <Vendor
            {...commonProps}
            selectedSector={{ label: selectedSegment, value: selectedSegment }}
            selectedDoctor={{
              label: vendorProfileType,
              value: vendorProfileType,
            }}
          />
        </div>
      );
    }

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
    "Physiotherapy Setup": [
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
  };

  const pageTitle = isView
    ? "View Organization"
    : isEdit
      ? "Edit Organization"
      : "Add New Organization";

  // primary action label - shows the pending state while the API call resolves
  const submitLabel = formik.isSubmitting
    ? "Submitting..."
    : isEdit
      ? "Save Changes"
      : "Submit";

  return (
    <div className="w-full min-h-screen">
      <BreadCrumb
        linkText={[
          { text: "Database", href: "/sales-executive/database" },
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

        {/* Segment (+ Vendor Type) selection - separated from the form below */}
        <div className="px-6 pt-6 pb-6">
          <div className="w-full md:w-2/3">
            <SegmentSelector
              isReadOnly={isReadOnly}
              selectedSegment={selectedSegment}
              onSegmentChange={handleSegmentChange}
              vendorProfileType={vendorProfileType}
              onVendorProfileChange={setVendorProfileType}
            />
          </div>
        </div>
        <div className="border-b border-gray-200" />


        {/* no segment selected -> no tabs */}
        {showOrgForm && (
          <div className="border-b border-gray-300 mt-2">
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
        )}

        <form onSubmit={formik.handleSubmit}>
          {renderSection()}

          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={() => {
                navigate("/sales-executive/database/individual");
              }}
              className="flex items-center gap-2 px-8 py-1 mr-5 font-semibold border border-[var(--primary-color)] text-[var(--primary-color)] bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              <FaPlusCircle size={18} /> Add Individual
            </button>
          </div>

          {/* action buttons only when a form is actually rendered */}
          {(showOrgForm || showVendorForm) && (
            <div className="flex justify-center mt-6 gap-4">
              {showOrgForm && currentStep === tabs.length - 1 && (
                <Button
                  text="Cancel"
                  type="button"
                  onClick={() => console.log("Cancel pressed")}
                />
              )}

              {showOrgForm && currentStep < tabs.length - 1 ? (
                <Button
                  text="Save & Proceed"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    const fields = tabKeysMapping[tabs[currentStep]];
                    fields?.forEach((field) =>
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
                  text={submitLabel}
                  type="submit"
                  isFormikButton={true}
                  isValid={formik.isValid}
                  isDirty={formik.dirty}
                  disabled={loading || formik.isSubmitting}
                />
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddNewOrganization;
