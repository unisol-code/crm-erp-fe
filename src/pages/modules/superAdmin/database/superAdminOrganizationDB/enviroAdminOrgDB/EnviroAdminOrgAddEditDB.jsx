import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../../../../../../hooks/theme/useTheme";
import Button from "../../../../../../components/uiComponents/button/Button";
import BreadCrumb from "../../../../../../components/uiComponents/breadcrumb/BreadCrumb";
import useEnviroAdminOrgDB from "../../../../../../hooks/superAdminHook/superAdmindatabase/enviroDB/useEnviroAdminOrgDB";
import useDropdown from "../../../../../../hooks/dropdown/useDropdown";
import LoaderSpinner from "../../../../../../components/uiComponents/loader/LoaderSpinner";
import ReactSelect from "react-select";
import EnviroAdminOrgAddEditDBfpo from "./EnviroAdminOrgAddEditDBfpo";
import BiomedicalAndSolidWaste from "../../../../superAdmin/database/superAdminOrganizationDB/superAdminOrganizationTabs/BiomedicalAndSolidWaste";
import Kitchen from "../../../../superAdmin/database/superAdminOrganizationDB/superAdminOrganizationTabs/Kitchen";
import Laundry from "../../../../superAdmin/database/superAdminOrganizationDB/superAdminOrganizationTabs/Laundry";
import BasicInfo from "../../../../superAdmin/database/superAdminOrganizationDB/superAdminOrganizationTabs/BasicInfo";

const checkboxOptions = {
  services: [
    "Subsidy",
    "Insurance",
    "Training",
    "Soil Testing",
    "Seed Distribution",
    "Advisory",
    "Credit Support",
    "Others",
  ],
  communications: [
    "Helpline",
    "WhatsApp",
    "SMS",
    "Mobile App",
    "Email",
    "In-person",
    "IVR",
  ],
  grievances: [
    "Portal",
    "Helpline",
    "Office Visit",
    "Mobile App",
    "Written Application",
  ],
};

const sectorOptions = [
  { label: "Agriculture", value: "Agriculture" },
  { label: "Waste Management", value: "Waste Management" },
];

const orgTypeOptions = {
  Agriculture: [
    { label: "FPO", value: "FPO" },
    { label: "FPC", value: "FPC" },
    { label: "CMRC", value: "CMRC" },
    { label: "BACHAT GAT", value: "BACHAT GAT" },
    { label: "SELF HELP GROUP", value: "SELF HELP GROUP" },
    { label: "GOVERNMENT", value: "GOVERNMENT" },
  ],
  "Waste Management": [
    { label: "PRIVATE", value: "PRIVATE" },
    { label: "GOVERNMENT", value: "GOVERNMENT" },
  ],
};

const wasteManagementTypeOptions = [
  { label: "Solid Waste Management", value: "solid" },
  { label: "Waste Water Management", value: "water" },
  { label: "Biomedical Waste Management", value: "biomedical" },
  { label: "Kitchen", value: "kitchen" },
  { label: "Laundry", value: "laundry" },
];

const wasteTypeLabel = {
  biomedical: "Biomedical Waste",
  solid: "Solid Waste",
  water: "Waste Water",
  kitchen: "Kitchen",
  laundry: "Laundry",
};

const tabComponentMap = {
  biomedical: (formik, isView) => (
    <BiomedicalAndSolidWaste formik={formik} type="biomedical" isReadOnly={isView} />
  ),
  solid: (formik, isView) => (
    <BiomedicalAndSolidWaste formik={formik} type="solid" isReadOnly={isView} />
  ),
  water: (formik, isView) => (
    <BiomedicalAndSolidWaste formik={formik} type="water" isReadOnly={isView} />
  ),
  kitchen: (formik, isView) => <Kitchen formik={formik} isReadOnly={isView} />,
  laundry: (formik, isView) => <Laundry formik={formik} isReadOnly={isView} />,
};

const Tabs = ({ tabs, active, onChange }) => (
  <div className="flex w-full gap-2 border-b border-slate-200 mb-6">
    {tabs.map((t) => (
      <button
        key={t.id}
        type="button"
        onClick={() => onChange(t.id)}
        className={`flex-1 px-4 py-2 text-sm font-medium rounded-t-lg transition text-center whitespace-nowrap ${
          active === t.id
            ? "bg-blue-600 text-white"
            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
        }`}
      >
        {t.label}
      </button>
    ))}
  </div>
);

const validationSchema = yup.object({
  sectionName: yup.string().required("Section Name is required"),
  OrganizationType: yup.string().required("Organization Type is required"),
  departmentName: yup.string().trim().required("Department Name is required"),
  jurisdictionLevel: yup.string().required("Jurisdiction Level is required"),
  region: yup.string().trim().required("Region is required"),
  stateName: yup.string().trim().required("State / UT Name is required"),
  officialContactNumber: yup
    .string()
    .trim()
    .required("Official Contact Number is required")
    .matches(/^[0-9+()\- ]+$/, "Enter a valid phone number"),
});

const InputField = ({ label, name, formik, placeholder, type = "text" }) => {
  const error = formik.touched[name] && formik.errors[name];

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-semibold text-slate-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={formik.values[name] || ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder={placeholder}
        className={`w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${error ? "border-red-500" : "border-slate-300 bg-white"
          }`}
      />
      {error ? <span className="text-xs text-red-500">{error}</span> : null}
    </div>
  );
};

const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "50px",
    borderRadius: "0.5rem",
    borderColor: state.isFocused ? "#60A5FA" : "#556581",
    boxShadow: state.isFocused ? "0 0 0 2px #60A5FA" : "none",
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
  menu: (base) => ({
    ...base,
    zIndex: 50,
  }),
};

const CheckboxGroup = ({ title, groupName, options, formik, showOtherField, otherName }) => (
  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
    <h2 className="mb-4 text-base font-semibold text-slate-800">{title}</h2>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {options.map((option) => {
        const checked = formik.values[groupName][option] || false;
        return (
          <label
            key={option}
            className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 transition hover:border-blue-400"
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => {
                formik.setFieldValue(`${groupName}.${option}`, !checked);
                if (groupName === "servicesOffered" && option === "Others" && checked) {
                  formik.setFieldValue("servicesOthersText", "");
                }
              }}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span>{option}</span>
          </label>
        );
      })}
    </div>
    {showOtherField ? (
      <div className="mt-4">
        <InputField
          label="If Others, please specify"
          name={otherName}
          formik={formik}
          placeholder="Enter other service"
        />
      </div>
    ) : null}
  </div>
);

const EnviroAdminOrgAddEditDB = ({ mode = "add" }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    createEnviroAdminOrg,
    loading,
    resetEnviroAdminOrgDetails,
    enviroAdminOrgDetails,
    fetchEnviroAdminOrgDetails,
    updateEnviroAdminOrg,
  } = useEnviroAdminOrgDB();
  const { theme } = useTheme();
  const isEdit = mode === "edit";
  const isView = mode === "view";
  const isEditMode = Boolean(id);
  const [selectedSector, setSelectedSector] = useState(null);
  const [selectedOrgType, setSelectedOrgType] = useState(null);
  const [selectedStateCode, setSelectedStateCode] = useState("");
  const [selectedWasteTypes, setSelectedWasteTypes] = useState([]);
  const [activeTab, setActiveTab] = useState("basic");

  const {
    fetchAllRegion,
    region,
    allStateName,
    fetchAllCities,
    cities,
    loading: locationLoading,
    fetchAllStateName,
    fetchDistrictList,
    districtList,
  } = useDropdown();

  useEffect(() => {
    fetchAllRegion();
  }, []);

  useEffect(() => {
    if (id) {
      fetchEnviroAdminOrgDetails(id);
    }
    return () => resetEnviroAdminOrgDetails();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      sectionName: "",
      OrganizationType: "",
      departmentName: "",
      jurisdictionLevel: "",
      region: "",
      stateName: "",
      districtName: "",
      cityTownVillage: "",
      pincode: "",
      landmark: "",
      officeAddress: "",
      officialContactNumber: "",
      officialEmail: "",
      departmentWebsite: "",
      totalOfficers: "",
      activeSchemes: "",
      servicesOffered: {
        Subsidy: false,
        Insurance: false,
        Training: false,
        "Soil Testing": false,
        "Seed Distribution": false,
        Advisory: false,
        "Credit Support": false,
        Others: false,
      },
      servicesOthersText: "",
      communicationChannels: {
        Helpline: false,
        WhatsApp: false,
        SMS: false,
        "Mobile App": false,
        Email: false,
        "In-person": false,
        IVR: false,
      },
      farmersRegistered: "",
      grievanceChannels: {
        Portal: false,
        Helpline: false,
        "Office Visit": false,
        "Mobile App": false,
        "Written Application": false,
      },
      wasteManagementType: [],
      bioMedicalWaste: {},
      solidWaste: {},
      wasteWaterManagement: {},
      kitchenWasteManagement: {},
      laundry: {},
      Basic: {
        segment: "",
        hospitalName: "",
        typeOfHospital: "",
        typeOfOrgOrHospital: "",
        ifGovt: "",
        region: "",
        state: "",
        district: "",
        city: "",
        emailAddress: "",
        address: "",
      },
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        console.log("Enviro Org data submitting:", values);
        if (isEditMode) {
          await updateEnviroAdminOrg(id, values);
        } else {
          await createEnviroAdminOrg(values);
        }
        navigate(-1);
      } catch (err) {
        console.error("Submission failed:", err);
      }
    },
  });

  const arrayToCheckboxObj = (arr, defaultObj) => {
    const result = { ...defaultObj };
    (arr || []).forEach((key) => {
      if (key in result) result[key] = true;
    });
    return result;
  };

  useEffect(() => {
    if (selectedSector) {
      formik.setFieldValue("sectionName", selectedSector.value);
    }
    if (selectedOrgType) {
      formik.setFieldValue("OrganizationType", selectedOrgType.value);
    }
  }, [selectedSector, selectedOrgType]);

  useEffect(() => {
    if (selectedSector) {
      setSelectedOrgType(null);
      setSelectedWasteTypes([]);
      setActiveTab("basic");
      formik.setFieldValue("wasteManagementType", []);
    }
  }, [selectedSector]);

  useEffect(() => {
    if (enviroAdminOrgDetails) {
      const d = enviroAdminOrgDetails;
      const matchedSector = sectorOptions.find((s) => s.value === d.sectionName) || null;
      const matchedOrgType = matchedSector
        ? (orgTypeOptions[matchedSector.value] || []).find((o) => o.value === d.OrganizationType) || null
        : null;
      formik.setValues({
        sectionName: d.sectionName || "",
        OrganizationType: d.OrganizationType || "",
        departmentName: d.departmentName || "",
        jurisdictionLevel: d.jurisdictionLevel || "",
        region: d.region || "",
        stateName: d.state || "",
        districtName: d.district || "",
        cityTownVillage: d.cityTownVillage || "",
        pincode: d.pincode || "",
        landmark: d.landmark || "",
        officeAddress: d.officeAddress || "",
        officialContactNumber: d.officialContactNumber || "",
        officialEmail: d.officialEmailId || "",
        departmentWebsite: d.departmentWebsite || "",
        totalOfficers: d.totalOfficers || "",
        activeSchemes: d.activeSchemes || "",
        servicesOffered: arrayToCheckboxObj(d.servicesOffered, {
          Subsidy: false, Insurance: false, Training: false,
          "Soil Testing": false, "Seed Distribution": false,
          Advisory: false, "Credit Support": false, Others: false,
        }),
        servicesOthersText: d.servicesOthersText || "",
        communicationChannels: arrayToCheckboxObj(d.communicationChannels, {
          Helpline: false, WhatsApp: false, SMS: false,
          "Mobile App": false, Email: false, "In-person": false, IVR: false,
        }),
        farmersRegistered: d.totalFarmersRegistered || "",
        grievanceChannels: arrayToCheckboxObj(d.grievanceChannels, {
          Portal: false, Helpline: false, "Office Visit": false,
          "Mobile App": false, "Written Application": false,
        }),
        wasteManagementType: Array.isArray(d.wasteManagementType) ? d.wasteManagementType : [],
        bioMedicalWaste: d.bioMedicalWaste || {},
        solidWaste: d.solidWaste || {},
        wasteWaterManagement: d.wasteWaterManagement || {},
        kitchenWasteManagement: d.kitchenWasteManagement || {},
        laundry: d.laundry || {},
        Basic: d.Basic || {
          segment: "",
          hospitalName: "",
          typeOfHospital: "",
          typeOfOrgOrHospital: "",
          ifGovt: "",
          region: "",
          state: "",
          district: "",
          city: "",
          emailAddress: "",
          address: "",
        },
      });
      if (Array.isArray(d.wasteManagementType)) {
        setSelectedWasteTypes(d.wasteManagementType);
      }
      if (matchedSector) setSelectedSector(matchedSector);
      if (matchedOrgType) setSelectedOrgType(matchedOrgType);
    }
  }, [enviroAdminOrgDetails]);

  useEffect(() => {
    if (formik.submitCount > 0 && !formik.isValid) {
      console.log("Formik Validation Errors:", formik.errors);
    }
  }, [formik.submitCount, formik.isValid, formik.errors]);

  const pageTitle = isView
    ? "View Organization"
    : isEdit
      ? "Edit Organization"
      : "Add New Organization";

  if (loading && !enviroAdminOrgDetails && id) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoaderSpinner />
      </div>
    );
  }

  console.log("enviroAdminOrgDetails", enviroAdminOrgDetails);

  return (
    <div className="min-h-screen">
      <BreadCrumb
        linkText={[
          { text: "Database" },
          { text: "Organizational Database", href: "/database" },
          { text: pageTitle },
        ]}
      />
      <div className="rounded-t-xl bg-gradient-to-r p-6 shadow-lg shadow-slate-900/10"
        style={{ backgroundColor: theme.secondaryColor }}>
        <h2
          className="flex px-6 items-center justify-center font-semibold text-xl text-black bg-opacity-40"
        >Enviro Department Profile</h2>
      </div>

      <div className="space-y-4 bg-white rounded-b-xl p-2 shadow-lg shadow-slate-900/10 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">Sector</label>
            <ReactSelect
              options={sectorOptions}
              value={selectedSector}
              onChange={(selected) => {
                setSelectedSector(selected);
                setSelectedOrgType(null);
                setSelectedWasteTypes([]);
                formik.setFieldValue("sectionName", selected?.value || "");
                formik.setFieldValue("OrganizationType", "");
                formik.setFieldValue("wasteManagementType", []);
              }}
              placeholder="Select Sector"
              isClearable
              styles={{
                control: (base, state) => ({
                  ...base,
                  minHeight: "50px",
                  borderRadius: "0.5rem",
                  borderColor: state.isFocused ? "#60A5FA" : "#556581",
                  boxShadow: state.isFocused ? "0 0 0 2px #60A5FA" : "none",
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
            {formik.touched.sectionName && formik.errors.sectionName ? (
              <span className="text-xs text-red-500">{formik.errors.sectionName}</span>
            ) : null}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">Organization Type</label>
            <ReactSelect
              options={selectedSector ? orgTypeOptions[selectedSector.value] || [] : []}
              value={selectedOrgType}
              onChange={(selected) => {
                setSelectedOrgType(selected);
                setSelectedWasteTypes([]);
                setActiveTab("basic");
                formik.setFieldValue("OrganizationType", selected?.value || "");
                formik.setFieldValue("wasteManagementType", []);
              }}
              placeholder="Select Organization Type"
              isClearable
              isDisabled={!selectedSector}
              styles={{
                control: (base, state) => ({
                  ...base,
                  minHeight: "50px",
                  borderRadius: "0.5rem",
                  borderColor: state.isFocused ? "#60A5FA" : "#556581",
                  boxShadow: state.isFocused ? "0 0 0 2px #60A5FA" : "none",
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
            {formik.touched.OrganizationType && formik.errors.OrganizationType ? (
              <span className="text-xs text-red-500">{formik.errors.OrganizationType}</span>
            ) : null}
          </div>
        </div>

        {selectedSector?.value === "Waste Management" && selectedOrgType ? (
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Select Waste Management Type(s)
            </label>
            <ReactSelect
              isMulti
              options={wasteManagementTypeOptions}
              value={wasteManagementTypeOptions.filter((opt) =>
                selectedWasteTypes.includes(opt.value)
              )}
              onChange={(selected) => {
                const values = selected ? selected.map((s) => s.value) : [];
                setSelectedWasteTypes(values);
                formik.setFieldValue("wasteManagementType", values);
              }}
              placeholder="Select waste management type(s)"
              isClearable
              styles={{
                control: (base, state) => ({
                  ...base,
                  minHeight: "50px",
                  borderRadius: "0.5rem",
                  borderColor: state.isFocused ? "#60A5FA" : "#556581",
                  boxShadow: state.isFocused ? "0 0 0 2px #60A5FA" : "none",
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
          </div>
        ) : null}

        {selectedOrgType?.value === "GOVERNMENT" && selectedSector?.value === "Agriculture" ? (
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <fieldset disabled={isView} className="space-y-4">
              <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">SECTION 1: Department Profile</p>
                    <p className="mt-1 text-sm text-slate-600">Basic profile details for the department office.</p>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <InputField
                    label="Department Name"
                    name="departmentName"
                    formik={formik}
                    placeholder="Enter department name"
                  />
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">Jurisdiction Level</label>
                    <select
                      name="jurisdictionLevel"
                      value={formik.values.jurisdictionLevel}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${formik.touched.jurisdictionLevel && formik.errors.jurisdictionLevel
                        ? "border-red-500"
                        : "border-slate-300 bg-white"
                        }`}
                    >
                      <option value="">Select jurisdiction</option>
                      <option value="State">State</option>
                      <option value="District">District</option>
                      <option value="Block">Block</option>
                      <option value="Village">Village</option>
                    </select>
                    {formik.touched.jurisdictionLevel && formik.errors.jurisdictionLevel ? (
                      <span className="text-xs text-red-500">{formik.errors.jurisdictionLevel}</span>
                    ) : null}
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">Region</label>
                    <ReactSelect
                      className="w-full"
                      isLoading={locationLoading}
                      styles={selectStyles}
                      options={
                        Array.isArray(region)
                          ? region.map((item) => ({
                              label: item.name || item,
                              value: item.name || item,
                            }))
                          : []
                      }
                      value={
                        Array.isArray(region)
                          ? region
                              .map((item) => ({
                                label: item.name || item,
                                value: item.name || item,
                              }))
                              .find((option) => option.value === formik.values.region) || null
                          : null
                      }
                      onChange={(selected) => {
                        formik.setFieldValue("region", selected?.value || "");
                        formik.setFieldValue("stateName", "");
                        formik.setFieldValue("districtName", "");
                        formik.setFieldValue("cityTownVillage", "");
                        fetchAllStateName(selected?.value || "");
                      }}
                      onBlur={() => formik.setFieldTouched("region", true)}
                      placeholder="Select Region"
                      isClearable
                    />
                    {formik.touched.region && formik.errors.region && (
                      <div className="text-red-500 text-xs mt-1">{formik.errors.region}</div>
                    )}
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">State / UT</label>
                    <ReactSelect
                      className="w-full"
                      isLoading={locationLoading}
                      styles={selectStyles}
                      isDisabled={!formik.values.region}
                      options={
                        Array.isArray(allStateName)
                          ? allStateName.map((state) => ({
                              label: state.name || state.stateName,
                              value: state.name || state.stateName,
                              stateCode: state.code || state.stateCode,
                            }))
                          : []
                      }
                      value={
                        allStateName
                          ?.map((state) => ({
                            label: state.name || state.stateName,
                            value: state.name || state.stateName,
                            stateCode: state.code || state.stateCode,
                          }))
                          .find((option) => option.value === formik.values.stateName) || null
                      }
                      onChange={(selected) => {
                        formik.setFieldValue("stateName", selected?.value || "");
                        setSelectedStateCode(selected?.stateCode || "");
                        formik.setFieldValue("districtName", "");
                        formik.setFieldValue("cityTownVillage", "");
                        fetchDistrictList(selected?.value);
                      }}
                      onBlur={() => formik.setFieldTouched("stateName", true)}
                      placeholder="Select State / UT"
                      isClearable
                    />
                    {formik.touched.stateName && formik.errors.stateName && (
                      <div className="text-red-500 text-xs mt-1">{formik.errors.stateName}</div>
                    )}
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">District</label>
                    <ReactSelect
                      className="w-full"
                      isLoading={locationLoading}
                      styles={selectStyles}
                      isDisabled={!formik.values.stateName}
                      options={
                        Array.isArray(districtList)
                          ? districtList.map((district) => ({
                              label: district,
                              value: district,
                            }))
                          : []
                      }
                      value={
                        districtList
                          ?.map((district) => ({
                            label: district,
                            value: district,
                          }))
                          .find((option) => option.value === formik.values.districtName) || null
                      }
                      onChange={(selected) => {
                        formik.setFieldValue("districtName", selected?.value || "");
                        formik.setFieldValue("cityTownVillage", "");
                        fetchAllCities(selectedStateCode, selected?.value);
                      }}
                      onBlur={() => formik.setFieldTouched("districtName", true)}
                      placeholder="Select District"
                      isClearable
                    />
                    {formik.touched.districtName && formik.errors.districtName && (
                      <div className="text-red-500 text-xs mt-1">{formik.errors.districtName}</div>
                    )}
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">City/Town/Village</label>
                    <ReactSelect
                      className="w-full"
                      isLoading={locationLoading}
                      styles={selectStyles}
                      isDisabled={!formik.values.districtName}
                      options={
                        Array.isArray(cities)
                          ? cities.map((city) => ({
                              label: city,
                              value: city,
                            }))
                          : []
                      }
                      value={
                        cities
                          ?.map((city) => ({
                            label: city,
                            value: city,
                          }))
                          .find((option) => option.value === formik.values.cityTownVillage) || null
                      }
                      onChange={(selected) => {
                        formik.setFieldValue("cityTownVillage", selected?.value || "");
                      }}
                      onBlur={() => formik.setFieldTouched("cityTownVillage", true)}
                      placeholder="Select City/Town/Village"
                      isClearable
                    />
                    {formik.touched.cityTownVillage && formik.errors.cityTownVillage && (
                      <div className="text-red-500 text-xs mt-1">{formik.errors.cityTownVillage}</div>
                    )}
                  </div>
                  <InputField
                    label="Pincode"
                    name="pincode"
                    formik={formik}
                    placeholder="Enter Pincode"
                  />
                  <InputField
                    label="Landmark"
                    name="landmark"
                    formik={formik}
                    placeholder="Enter Landmark"
                  />
                  <InputField
                    label="Office Address"
                    name="officeAddress"
                    formik={formik}
                    placeholder="Enter office address"
                  />
                  <InputField
                    label="Official Contact Number"
                    name="officialContactNumber"
                    formik={formik}
                    placeholder="Enter contact number"
                    type="tel"
                  />
                  <InputField
                    label="Official Email ID"
                    name="officialEmail"
                    formik={formik}
                    placeholder="Enter official email"
                    type="email"
                  />
                  <InputField
                    label="Department Website"
                    name="departmentWebsite"
                    formik={formik}
                    placeholder="Enter website URL"
                    type="url"
                  />
                </div>
              </section>

              <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6">
                  <p className="text-lg font-semibold text-slate-900">SECTION 2: Organisational Structure</p>
                  <p className="mt-1 text-sm text-slate-600">Provide high-level organisational metrics for the department.</p>
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                  <InputField
                    label="Total Number of Officers"
                    name="totalOfficers"
                    formik={formik}
                    placeholder="Enter total officers"
                    type="number"
                  />
                </div>
              </section>

              <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6">
                  <p className="text-lg font-semibold text-slate-900">SECTION 3: Schemes & Services</p>
                  <p className="mt-1 text-sm text-slate-600">Record active schemes and services offered by the department.</p>
                </div>
                <div className="grid gap-6">
                  <div>
                    <label className="text-sm font-semibold text-slate-700">List of Active Schemes Implemented</label>
                    <textarea
                      id="activeSchemes"
                      name="activeSchemes"
                      value={formik.values.activeSchemes}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Describe active schemes"
                      rows={4}
                      className={`w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${formik.touched.activeSchemes && formik.errors.activeSchemes
                        ? "border-red-500"
                        : "border-slate-300 bg-white"
                        }`}
                    />
                    {formik.touched.activeSchemes && formik.errors.activeSchemes ? (
                      <span className="text-xs text-red-500">{formik.errors.activeSchemes}</span>
                    ) : null}
                  </div>
                  <CheckboxGroup
                    title="Types of Services Offered (Tick all that apply)"
                    groupName="servicesOffered"
                    options={checkboxOptions.services}
                    formik={formik}
                    showOtherField={formik.values.servicesOffered.Others}
                    otherName="servicesOthersText"
                  />
                </div>
              </section>

              <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6">
                  <p className="text-lg font-semibold text-slate-900">SECTION 4: Farmer Engagement & CRM</p>
                  <p className="mt-1 text-sm text-slate-600">Capture communication and grievance channels used by farmers.</p>
                </div>
                <div className="grid gap-6">
                  <CheckboxGroup
                    title="Primary Communication Channels (Tick all that apply)"
                    groupName="communicationChannels"
                    options={checkboxOptions.communications}
                    formik={formik}
                  />
                  <div className="grid gap-6 lg:grid-cols-2">
                    <InputField
                      label="Estimated Number of Farmers Registered"
                      name="farmersRegistered"
                      formik={formik}
                      placeholder="Enter number of farmers"
                      type="number"
                    />
                    <div />
                  </div>
                  <CheckboxGroup
                    title="How are farmer grievances registered? (Tick all that apply)"
                    groupName="grievanceChannels"
                    options={checkboxOptions.grievances}
                    formik={formik}
                  />
                </div>
              </section>
            </fieldset>
            <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <Button type="button" text={isView ? "Back" : "Cancel"} variant={3} onClick={() => navigate(-1)} />
                {!isView && (
                  <Button
                    type="submit"
                    text={isEdit ? "Update" : "Save"}
                    variant={1}
                    loading={loading}
                  />
                )}
              </div>
            </div>
          </form>
        ) : selectedOrgType?.value === "FPO" || selectedOrgType?.value === "FPC" || selectedOrgType?.value === "CMRC" || selectedOrgType?.value === "BACHAT GAT" || selectedOrgType?.value === "SELF HELP GROUP" ? (
          <EnviroAdminOrgAddEditDBfpo OrganizationType={selectedOrgType?.value} mode={isEdit ? "edit" : isView ? "view" : "add"} />
        ) : selectedSector?.value === "Waste Management" && selectedOrgType && selectedWasteTypes.length > 0 ? (
          (() => {
            const dynamicTabs = selectedWasteTypes.map((t) => ({
              id: t,
              label: wasteTypeLabel[t] || t,
            }));
            const tabIds = ["basic", ...dynamicTabs.map((t) => t.id)];
            const safeActive = tabIds.includes(activeTab) ? activeTab : "basic";
            const currentIndex = tabIds.indexOf(safeActive);
            const isLastTab = currentIndex === tabIds.length - 1;
            return (
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <fieldset disabled={isView} className="space-y-4">
                  <Tabs
                    active={safeActive}
                    onChange={setActiveTab}
                    tabs={[{ id: "basic", label: "Basic Info" }, ...dynamicTabs]}
                  />
                  {safeActive === "basic" && (
                    <BasicInfo formik={formik} isReadOnly={isView} />
                  )}
                  {dynamicTabs.map((t) =>
                    safeActive === t.id ? (
                      <div key={t.id}>{tabComponentMap[t.id]?.(formik, isView)}</div>
                    ) : null
                  )}
                </fieldset>
                <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-3">
                    <Button type="button" text={isView ? "Back" : "Cancel"} variant={3} onClick={() => navigate(-1)} />
                    {!isView && !isLastTab && (
                      <Button
                        type="button"
                        text="Save and Proceed"
                        variant={1}
                        loading={loading}
                        onClick={() => {
                          if (currentIndex >= 0 && currentIndex < tabIds.length - 1) {
                            setActiveTab(tabIds[currentIndex + 1]);
                          }
                        }}
                      />
                    )}
                    {!isView && isLastTab && (
                      <Button
                        type="submit"
                        text={isEdit ? "Update" : "Save"}
                        variant={1}
                        loading={loading}
                      />
                    )}
                  </div>
                </div>
              </form>
            );
          })()
        ) : null}
      </div>
    </div>
  );
};

export default EnviroAdminOrgAddEditDB;
