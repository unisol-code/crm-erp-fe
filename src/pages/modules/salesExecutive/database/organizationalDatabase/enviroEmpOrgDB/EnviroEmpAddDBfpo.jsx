import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../../../../../../hooks/theme/useTheme";
import Button from "../../../../../../components/uiComponents/button/Button";
import useEnviroAdminIndDB from "../../../../../../hooks/superAdminHook/superAdmindatabase/enviroDB/useEnviroAdminIndDB";
import useEnviroIndividualDrop from "../../../../../../hooks/superAdminHook/superAdmindatabase/enviroDB/useEnviroIndividualDrop";
import useDropdown from "../../../../../../hooks/dropdown/useDropdown";
import LoaderSpinner from "../../../../../../components/uiComponents/loader/LoaderSpinner";
import ReactSelect from "react-select";
import { getIn } from "formik";

const InputField = ({ label, name, formik, placeholder, type = "text", className }) => {
  const value = getIn(formik.values, name) || "";
  const error = getIn(formik.touched, name) && getIn(formik.errors, name);
  const fieldError = getIn(formik.errors, name);

  return (
    <div className={`flex flex-col gap-2 ${className || ""}`}>
      <label htmlFor={name} className="text-sm font-semibold text-slate-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder={placeholder}
        className={`w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${error ? "border-red-500" : "border-slate-300 bg-white"
          }`}
      />
      {fieldError ? <span className="text-xs text-red-500">{fieldError}</span> : null}
    </div>
  );
};

const SearchableMultiSelect = ({ label, name, options, formik, placeholder = "Select options..." }) => {
  const value = getIn(formik.values, name) || [];
  const error = getIn(formik.errors, name);
  const touched = getIn(formik.touched, name);

  const selectedOptions = (options || []).filter(opt => value.includes(opt.value));

  const handleChange = (selected) => {
    const values = selected ? selected.map(opt => opt.value) : [];
    formik.setFieldValue(name, values);
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
      )}
      <ReactSelect
        isMulti
        name={name}
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        onBlur={() => formik.setFieldTouched(name, true)}
        placeholder={placeholder}
        classNamePrefix="react-select"
        styles={{
          control: (base, state) => ({
            ...base,
            minHeight: "50px",
            borderRadius: "0.5rem",
            borderColor: error && touched ? "#ef4444" : state.isFocused ? "#60A5FA" : "#556581",
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
          multiValue: (base) => ({
            ...base,
            backgroundColor: "#eff6ff",
            borderRadius: "0.25rem",
          }),
          multiValueLabel: (base) => ({
            ...base,
            color: "#1e40af",
            fontWeight: "500",
          }),
          multiValueRemove: (base) => ({
            ...base,
            color: "#3b82f6",
            "&:hover": {
              backgroundColor: "#dbeafe",
              color: "#1d4ed8",
            },
          }),
          menu: (base) => ({
            ...base,
            zIndex: 50,
          }),
        }}
      />
      {error && touched && (
        <div className="text-red-500 text-xs mt-1">{error}</div>
      )}
    </div>
  );
};

const SectionHeading = ({ title }) => (
  <div className="mt-6 mb-4">
    <h3 className="text-lg font-bold text-slate-800 border-b-2 border-blue-500 pb-2">
      {title}
    </h3>
  </div>
);

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

const validationSchema = yup.object({
  organizationName: yup.string().trim().required("Organization Name is required"),
  // registrationNumber: yup.string().trim().required("Registration Number is required"),
  // registrationAct: yup.string().trim().required("Registration Act is required"),
  // yearOfEstablishment: yup
  //   .string()
  //   .trim()
  //   .required("Year of Establishment is required")
  //   .matches(/^\d{4}$/, "Enter a valid 4-digit year"),
  // operationalArea: yup.string().trim().required("Operational Area is required"),
  officeAddress: yup.string().trim().required("Office Address is required"),
  officialContactNumber: yup
    .string()
    .trim()
    .required("Official Contact Number is required")
    .matches(/^[0-9+()\- ]+$/, "Enter a valid phone number"),
  // officialEmailId: yup.string().email("Invalid email").required("Official Email ID is required"),
  // websiteAppUrl: yup.string().trim().nullable().notRequired().url("Enter a valid URL"),
  region: yup.string().trim().required("Region is required"),
  cityTownVillage: yup.string().trim().required("City/Town/Village is required"),
  // The form state keys are `stateName` / `districtName` (they are what the org
  // payload carries). Validating `state` / `district` checked keys Formik never
  // has, so those required rules could never fire.
  districtName: yup.string().trim().required("District is required"),
  stateName: yup.string().trim().required("State is required"),
  // pincode: yup.string().trim().required("Pincode is required").matches(/^(?!0{6})[0-9]{6}$/, "Must be a valid 6-digit pincode"),
  // landmark: yup.string().trim().required("Landmark is required"),
  // numberOfBoardMembers: yup
  //   .number()
  //   .typeError("Enter a number")
  //   .integer("Enter a whole number")
  //   .min(0, "Cannot be negative")
  //   .required("Number of Board Members is required"),
  // numberOfStaffMembers: yup
  //   .number()
  //   .typeError("Enter a number")
  //   .integer("Enter a whole number")
  //   .min(0, "Cannot be negative")
  //   .required("Number of Staff Members is required"),
  // totalActiveMembers: yup
  //   .number()
  //   .typeError("Enter a number")
  //   .integer("Enter a whole number")
  //   .positive("Must be greater than zero")
  //   .required("Total Active Members is required"),
  // memberCategories: yup.array().min(1, "Select at least one member category").required("Member Categories are required"),
  // memberCategoriesOthers: yup.string().when("memberCategories", {
  //   is: (memberCategories) => memberCategories?.includes("Others"),
  //   then: (schema) => schema.trim().required("Please specify other category"),
  //   otherwise: (schema) => schema.nullable(),
  // }),
  // primaryCommunicationChannels: yup.array().min(1, "Select at least one communication channel").required("Communication Channels are required"),
  // majorCropsHandledHandled: yup.string().trim().required("Major Crops/Commodities are required"),
  // annualTurnover: yup
  //   .number()
  //   .typeError("Enter a number")
  //   .min(0, "Cannot be negative")
  //   .required("Annual Turnover is required"),
  // majorRevenueSources: yup.array().min(1, "Select at least one revenue source").required("Revenue Sources are required"),
  // majorRevenueSourcesOthers: yup.string().when("majorRevenueSources", {
  //   is: (majorRevenueSources) => majorRevenueSources?.includes("Others"),
  //   then: (schema) => schema.trim().required("Please specify other source"),
  //   otherwise: (schema) => schema.nullable(),
  // }),
  // keyBuyerTypes: yup.array().min(1, "Select at least one buyer type").required("Buyer Types are required"),
  // topChallenges: yup.string().trim().required("Top Challenges are required"),
  // topPriorities: yup.string().trim().required("Top Priorities are required"),
});

const EnviroEmpAddDBfpo = ({ mode = "add", orgType = "FPO", sectionName = "", orgDetails = null }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    createEnviroFPO,
    loading,
    enviroFPODetails,
    updateEnviroFPO,
  } = useEnviroAdminIndDB();
  const { theme } = useTheme();
  const isEdit = mode === "edit";
  const isView = mode === "view";
  const isEditMode = Boolean(id);

  const {
    fetchPrimaryCommunicationChannels,
    fetchKeyBuyerTypes,
    fetchMemberCategories,
    fetchMajorRevenueSources,
    primaryCommunicationChannels,
    keyBuyerTypes,
    memberCategories,
    majorRevenueSources,
    loading: dropLoading,
  } = useEnviroIndividualDrop();

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

  const [companyResolved, setCompanyResolved] = useState(false);
  const [selectedStateCode, setSelectedStateCode] = useState("");
  // `allStateName` is scoped to whichever region was last requested, so it needs a
  // one-shot refill per region when a record is opened. See the cascade effects
  // below the hydration effect.
  const fetchedRegionRef = useRef("");

  // Turns an array of selected strings into the { option: boolean } shape
  // the checkbox groups in this form expect.
  const arrayToCheckboxObj = (arr, defaultObj) => {
    const result = { ...defaultObj };
    (Array.isArray(arr) ? arr : []).forEach((key) => {
      if (key in result) result[key] = true;
    });
    return result;
  };

  useEffect(() => {
    fetchPrimaryCommunicationChannels();
    fetchKeyBuyerTypes();
    fetchMemberCategories();
    fetchMajorRevenueSources();
    fetchAllRegion();
    // fetchAllStateName();
  }, []);

  // NOTE: the record is fetched once by the parent (EnviroEmpOrgAddEditDB) through
  // the common `fetchEnviroAdminOrgDetails` hook and passed down as `orgDetails`.
  // This component used to run its own `fetchEnviroFPODetails(id)`, which meant a
  // second request to the individual-DB endpoint for the same record. That endpoint
  // returns a different shape, so it overwrote the form with empty values - and its
  // cleanup also reset a shared Recoil atom on unmount.

  const formik = useFormik({
    initialValues: {
      sectionName: "",
      OrganizationType: orgType,
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
      officialEmailId: "",
      departmentWebsite: "",
      associatedWithOrganization: "",
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
      organizationName: "",
      registrationNumber: "",
      registrationAct: "",
      yearOfEstablishment: "",
      operationalArea: "",
      websiteAppUrl: "",
      numberOfBoardMembers: "",
      numberOfStaffMembers: "",
      totalActiveMembers: "",
      memberCategories: [],
      memberCategoriesOthers: "",
      primaryCommunicationChannels: [],
      majorCropsHandled: [{ crop: "", duration: "" }],
      annualTurnover: "",
      majorRevenueSources: [],
      majorRevenueSourcesOthers: "",
      keyBuyerTypes: [],
      topChallenges: "",
      topPriorities: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        console.log("FPO Form onSubmit called with values:", values);
        let success = false;
        if (isEditMode) {
          success = await updateEnviroFPO(id, values);
        } else {
          success = await createEnviroFPO(values);
        }
        if (success) {
          navigate(-1);
        }
      } catch (err) {
        console.error("Submission failed:", err);
      }
    },
  });

  useEffect(() => {
    formik.setFieldValue("sectionName", sectionName || "");
    formik.setFieldValue("OrganizationType", orgType || "");
  }, [sectionName, orgType]);

  // `orgDetails` (the parent's single common fetch) is the source of truth;
  // `enviroFPODetails` stays as a fallback so this component still works standalone.
  const details = orgDetails || enviroFPODetails;

  useEffect(() => {
    if (details) {
      const d = details;
      formik.setValues({
        sectionName: d.sectionName || formik.values.sectionName,
        OrganizationType: d.OrganizationType || formik.values.OrganizationType,
        departmentName: d.departmentName || "",
        jurisdictionLevel: d.jurisdictionLevel || "",
        region: d.region || "",
        stateName: d.stateName || d.state || "",
        districtName: d.districtName || d.district || "",
        cityTownVillage: d.cityTownVillage || "",
        pincode: d.pincode || "",
        landmark: d.landmark || "",
        officeAddress: d.officeAddress || "",
        officialContactNumber: d.officialContactNumber || "",
        officialEmailId: d.officialEmailId || "",
        departmentWebsite: d.departmentWebsite || "",
        associatedWithOrganization: d.associatedWithOrganization || "",
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
        organizationName: d.organizationName || "",
        registrationNumber: d.registrationNumber || "",
        registrationAct: d.registrationAct || "",
        yearOfEstablishment: d.yearOfEstablishment || "",
        operationalArea: d.operationalArea || "",
        websiteAppUrl: d.websiteAppUrl || "",
        numberOfBoardMembers: d.numberOfBoardMembers || "",
        numberOfStaffMembers: d.numberOfStaffMembers || "",
        totalActiveMembers: d.totalActiveMembers || "",
        memberCategories: d.memberCategories || [],
        memberCategoriesOthers: d.memberCategoriesOthers || "",
        primaryCommunicationChannels: d.primaryCommunicationChannels || [],
        majorCropsHandled:
          Array.isArray(d.majorCropsHandled) && d.majorCropsHandled.length
            ? d.majorCropsHandled.map((item) =>
                typeof item === "string" ? { crop: item, duration: "" } : item
              )
            : d.majorCropsHandled
              ? [{ crop: d.majorCropsHandled, duration: "" }]
              : [{ crop: "", duration: "" }],
        annualTurnover: d.annualTurnover || "",
        majorRevenueSources: d.majorRevenueSources || [],
        majorRevenueSourcesOthers: d.majorRevenueSourcesOthers || "",
        keyBuyerTypes: d.keyBuyerTypes || [],
        topChallenges: d.topChallenges || "",
        topPriorities: d.topPriorities || "",
      });
    }
  }, [details]);

  // Auto-hydrate the Region -> State -> District -> City cascade when a record is
  // opened in view/edit mode.
  //
  // Each ReactSelect resolves its displayed value by looking that value up in its
  // own option list, so a select renders blank until its list has loaded. On mount
  // only `region` is fetched (states are fetched per region on demand), so State,
  // District and City all stayed empty on view even though the record had values -
  // which is why "5. Operational Area (State/District/Block/Village)" looked blank.
  const recordRegion = formik.values?.region;
  const recordState = formik.values?.stateName;
  const recordDistrict = formik.values?.districtName;

  const stateNameOf = (entry) => entry?.name || entry?.stateName || entry || "";
  const stateCodeOf = (entry) => entry?.code || entry?.stateCode || "";

  // Refill the region-scoped state list once when the record's state is missing
  // from it (the list may still be empty, or scoped to a different region).
  useEffect(() => {
    if (!recordState || !recordRegion) return;
    const found = (Array.isArray(allStateName) ? allStateName : []).some(
      (s) => stateNameOf(s) === recordState
    );
    if (!found && fetchedRegionRef.current !== recordRegion) {
      fetchedRegionRef.current = recordRegion;
      fetchAllStateName(recordRegion);
    }
  }, [recordState, recordRegion, allStateName]);

  // Once states are loaded, resolve the record's state code and fetch its districts.
  useEffect(() => {
    if (!recordState) return;
    const selectedState = (Array.isArray(allStateName) ? allStateName : []).find(
      (s) => stateNameOf(s) === recordState
    );
    const code = stateCodeOf(selectedState);
    if (code) setSelectedStateCode(code);
    fetchDistrictList(recordState);
  }, [recordState, allStateName]);

  // Cities are keyed off the state CODE + district, so this runs last.
  useEffect(() => {
    if (recordState && recordDistrict && selectedStateCode) {
      fetchAllCities(selectedStateCode, recordDistrict);
    }
  }, [recordState, recordDistrict, selectedStateCode]);

  // Log validation errors when submission is attempted
  useEffect(() => {
    if (formik.submitCount > 0 && !formik.isValid) {
      console.log("FPO Formik Validation Errors:", formik.errors);
    }
  }, [formik.submitCount, formik.isValid, formik.errors]);

  const pageTitle = isView
    ? `View ${orgType}`
    : isEdit
      ? `Edit ${orgType}`
      : `Add New ${orgType}`;

  if (loading && !details && id) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoaderSpinner />
      </div>
    );
  }

  const registrationActOptions = [
    { label: "Companies Act", value: "Companies Act" },
    { label: "Cooperative Act", value: "Cooperative Act" },
    { label: "Society Act", value: "Society Act" },
    { label: "Others", value: "Others" },
  ];

  const memberCategoryOptions = (memberCategories || []).map((item) => ({
    label: item,
    value: item,
  }));

  const communicationChannelOptions = (primaryCommunicationChannels || []).map((item) => ({
    label: item,
    value: item,
  }));

  const revenueSourceOptions = (majorRevenueSources || []).map((item) => ({
    label: item,
    value: item,
  }));

  const buyerTypeOptions = (keyBuyerTypes || []).map((item) => ({
    label: item,
    value: item,
  }));

  const handleCropChange = (index, field, value) => {
    const updated = [...(formik.values.majorCropsHandled || [])];
    updated[index] = { ...updated[index], [field]: value };
    formik.setFieldValue("majorCropsHandled", updated);
  };

  const addCropRow = () => {
    formik.setFieldValue("majorCropsHandled", [
      ...(formik.values.majorCropsHandled || []),
      { crop: "", duration: "" },
    ]);
  };

  const removeCropRow = (index) => {
    const updated = (formik.values.majorCropsHandled || []).filter(
      (_, i) => i !== index
    );
    formik.setFieldValue(
      "majorCropsHandled",
      updated.length ? updated : [{ crop: "", duration: "" }]
    );
  };

  return (
    <div className="">


      <form onSubmit={formik.handleSubmit} className="space-y-4 bg-white " onKeyDown={(e) => { if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') e.preventDefault(); }}>
        <fieldset disabled={isView} className="space-y-4">
          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeading title={`SECTION 1: ${orgType} Profile`} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label={`1. Organization Name`}
                name="organizationName"
                formik={formik}
                placeholder={`Enter Orgnization Name`}
              />
              <InputField
                label="2. Registration Number"
                name="registrationNumber"
                formik={formik}
                placeholder="Enter Registration Number"
              />
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">3. Registration Act</label>
                <ReactSelect
                  options={registrationActOptions}
                  value={registrationActOptions.find(opt => opt.value === formik.values.registrationAct) || null}
                  onChange={(selected) => formik.setFieldValue("registrationAct", selected?.value || "")}
                  placeholder="Select Registration Act"
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
                {formik.touched.registrationAct && formik.errors.registrationAct ? (
                  <span className="text-xs text-red-500">{formik.errors.registrationAct}</span>
                ) : null}
              </div>
              <InputField
                label="4. Year of Establishment"
                name="yearOfEstablishment"
                formik={formik}
                placeholder="Enter Year"
              />
              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-semibold text-slate-700">5. Operational Area (State/District/Block/Village)</label>
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
                <label className="block mb-2 text-sm font-medium text-slate-700">State</label>
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
                  placeholder="Select State"
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
                label="6. Office Address"
                name="officeAddress"
                formik={formik}
                placeholder="Enter Office Address"
                className="md:col-span-2"
              />
              <InputField
                label="7. Official Contact Number"
                name="officialContactNumber"
                formik={formik}
                placeholder="Enter Contact Number"
                type="tel"
              />
              <InputField
                label="8. Official Email ID"
                name="officialEmailId"
                formik={formik}
                placeholder="Enter Email ID"
                type="email"
              />
              <InputField
                label="9. Website / App URL (if any)"
                name="websiteAppUrl"
                formik={formik}
                placeholder="Enter URL"
                type="url"
              />
              <InputField
                label="10. Associated With Organization"
                name="associatedWithOrganization"
                formik={formik}
                placeholder="Enter Organization Name"
              />
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeading title="SECTION 2: Governance & Staffing" />
            <div className="grid gap-6 lg:grid-cols-2">
              <InputField
                label="11. Number of Board Members"
                name="numberOfBoardMembers"
                formik={formik}
                placeholder="Enter Number"
                type="number"
              />
              <InputField
                label="12. Number of Staff Members"
                name="numberOfStaffMembers"
                formik={formik}
                placeholder="Enter Number"
                type="number"
              />
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeading title="SECTION 3: Member Profile & Engagement" />
            <div className="grid gap-6 lg:grid-cols-2">
              <InputField
                label="13. Total Active Members"
                name="totalActiveMembers"
                formik={formik}
                placeholder="Enter Total Members"
                type="number"
              />
              <SearchableMultiSelect
                label="14. Member Categories (Tick all that apply)"
                name="memberCategories"
                placeholder="Select Member Categories"
                options={memberCategoryOptions}
                formik={formik}
              />
              {formik.values.memberCategories?.includes("Others") && (
                <InputField
                  label="Please specify other category"
                  name="memberCategoriesOthers"
                  formik={formik}
                  placeholder="Enter other category"
                  className="lg:col-span-2"
                />
              )}
              <SearchableMultiSelect
                label="15. Primary Communication Channels (Tick all that apply)"
                name="primaryCommunicationChannels"
                placeholder="Select Communication Channels"
                options={communicationChannelOptions}
                formik={formik}
              />
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeading title="SECTION 4: Services & Business Operations" />
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="lg:col-span-2 flex flex-col gap-3">
                <label className="text-sm font-semibold text-slate-700">
                  16. Major Crops/Commodities Handled
                </label>

                <div className="hidden sm:flex sm:items-center sm:gap-3">
                  <span className="flex-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                    Crop / Commodity
                  </span>
                  <span className="flex-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                    Duration
                  </span>
                  <span className="w-[46px] shrink-0" />
                </div>

                {(formik.values.majorCropsHandled || []).map((row, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-3 sm:flex-row sm:items-center"
                  >
                    <input
                      type="text"
                      value={row.crop || ""}
                      onChange={(e) =>
                        handleCropChange(index, "crop", e.target.value)
                      }
                      placeholder="Enter Crop/Commodity"
                      className="w-full flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                    <input
                      type="text"
                      value={row.duration || ""}
                      onChange={(e) =>
                        handleCropChange(index, "duration", e.target.value)
                      }
                      placeholder="Enter Duration (e.g. 4 months)"
                      className="w-full flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeCropRow(index)}
                      disabled={
                        isView || (formik.values.majorCropsHandled || []).length === 1
                      }
                      className="flex h-[46px] w-full shrink-0 items-center justify-center rounded-2xl border border-red-200 bg-red-50 text-lg font-bold text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40 sm:w-[46px]"
                      aria-label="Remove crop"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addCropRow}
                  disabled={isView}
                  className="flex w-fit items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className="text-lg leading-none">+</span> Add
                  Crop/Commodity
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeading title="SECTION 5: Finance & Member Benefits" />
            <div className="grid gap-6 lg:grid-cols-2">
              <InputField
                label="17. Annual Turnover"
                name="annualTurnover"
                formik={formik}
                placeholder="Enter Annual Turnover"
                type="number"
              />
              <SearchableMultiSelect
                label="18. Major Revenue Sources (Tick all that apply)"
                name="majorRevenueSources"
                placeholder="Select Revenue Sources"
                options={revenueSourceOptions}
                formik={formik}
              />
              {formik.values.majorRevenueSources?.includes("Others") && (
                <InputField
                  label="Please specify other source"
                  name="majorRevenueSourcesOthers"
                  formik={formik}
                  placeholder="Enter other source"
                  className="lg:col-span-2"
                />
              )}
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeading title="SECTION 6: Partnerships & Market Linkages" />
            <div className="grid gap-6 lg:grid-cols-2">
              <SearchableMultiSelect
                label="19. Key Buyer Types (Tick all that apply)"
                name="keyBuyerTypes"
                placeholder="Select Buyer Types"
                options={buyerTypeOptions}
                formik={formik}
              />
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeading title="SECTION 7: Innovation & Future Planning" />
            <div className="grid gap-6 lg:grid-cols-2">
              <InputField
                label="20. Top 3 Challenges Faced by the FPO"
                name="topChallenges"
                formik={formik}
                placeholder="Enter Top 3 Challenges"
                className="lg:col-span-2"
              />
              <InputField
                label="21. Top 3 Improvement Priorities"
                name="topPriorities"
                formik={formik}
                placeholder="Enter Top 3 Improvement Priorities"
                className="lg:col-span-2"
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
    </div>
  );
};

export default EnviroEmpAddDBfpo;
