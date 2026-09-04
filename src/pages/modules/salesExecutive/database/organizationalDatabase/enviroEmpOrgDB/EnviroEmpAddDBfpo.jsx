import React, { useEffect, useState } from "react";
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
  fpoName: yup.string().trim().required("FPO Name is required"),
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
  district: yup.string().trim().required("District is required"),
  state: yup.string().trim().required("State is required"),
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
  // majorCropsHandled: yup.string().trim().required("Major Crops/Commodities are required"),
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

const EnviroEmpAddDBfpo = ({ mode = "add", orgType = "FPO" }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    createEnviroFPO,
    loading,
    resetEnviroFPODetails,
    enviroFPODetails,
    fetchEnviroFPODetails,
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

  useEffect(() => {
    fetchPrimaryCommunicationChannels();
    fetchKeyBuyerTypes();
    fetchMemberCategories();
    fetchMajorRevenueSources();
    fetchAllRegion();
    // fetchAllStateName();
  }, []);

  useEffect(() => {
    if (id) {
      fetchEnviroFPODetails(id);
    }
    return () => resetEnviroFPODetails();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      fpoName: "",
      registrationNumber: "",
      registrationAct: "",
      yearOfEstablishment: "",
      operationalArea: "",
      officeAddress: "",
      officialContactNumber: "",
      officialEmailId: "",
      websiteAppUrl: "",
      region: "",
      cityTownVillage: "",
      district: "",
      state: "",
      pincode: "",
      landmark: "",
      numberOfBoardMembers: "",
      numberOfStaffMembers: "",
      totalActiveMembers: "",
      memberCategories: [],
      memberCategoriesOthers: "",
      primaryCommunicationChannels: [],
      majorCropsHandled: "",
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
        if (isEditMode) {
          await updateEnviroFPO(id, values);
        } else {
          await createEnviroFPO(values);
        }
        navigate(-1);
      } catch (err) {
        console.error("Submission failed:", err);
      }
    },
  });

  useEffect(() => {
    if (enviroFPODetails) {
      const d = enviroFPODetails;
      formik.setValues({
        fpoName: d.fpoName || "",
        registrationNumber: d.registrationNumber || "",
        registrationAct: d.registrationAct || "",
        yearOfEstablishment: d.yearOfEstablishment || "",
        operationalArea: d.operationalArea || "",
        officeAddress: d.officeAddress || "",
        officialContactNumber: d.officialContactNumber || "",
        officialEmailId: d.officialEmailId || "",
        websiteAppUrl: d.websiteAppUrl || "",
        region: d.region || "",
        cityTownVillage: d.cityTownVillage || "",
        district: d.district || "",
        state: d.state || "",
        pincode: d.pincode || "",
        landmark: d.landmark || "",
        numberOfBoardMembers: d.numberOfBoardMembers || "",
        numberOfStaffMembers: d.numberOfStaffMembers || "",
        totalActiveMembers: d.totalActiveMembers || "",
        memberCategories: d.memberCategories || [],
        memberCategoriesOthers: d.memberCategoriesOthers || "",
        primaryCommunicationChannels: d.primaryCommunicationChannels || [],
        majorCropsHandled: d.majorCropsHandled || "",
        annualTurnover: d.annualTurnover || "",
        majorRevenueSources: d.majorRevenueSources || [],
        majorRevenueSourcesOthers: d.majorRevenueSourcesOthers || "",
        keyBuyerTypes: d.keyBuyerTypes || [],
        topChallenges: d.topChallenges || "",
        topPriorities: d.topPriorities || "",
      });
    }
  }, [enviroFPODetails]);

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

  if (loading && !enviroFPODetails && id) {
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

  return (
    <div className="">


      <form onSubmit={formik.handleSubmit} className="space-y-4 bg-white ">
        <fieldset disabled={isView} className="space-y-4">
          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeading title={`SECTION 1: ${orgType} Profile`} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label={`1. Orgnization Name`}
                name="fpoName"
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
                    formik.setFieldValue("state", "");
                    formik.setFieldValue("district", "");
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
                      .find((option) => option.value === formik.values.state) || null
                  }
                  onChange={(selected) => {
                    formik.setFieldValue("state", selected?.value || "");
                    setSelectedStateCode(selected?.stateCode || "");
                    formik.setFieldValue("district", "");
                    formik.setFieldValue("cityTownVillage", "");
                    fetchDistrictList(selected?.value);
                  }}
                  onBlur={() => formik.setFieldTouched("state", true)}
                  placeholder="Select State"
                  isClearable
                />
                {formik.touched.state && formik.errors.state && (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.state}</div>
                )}
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700">District</label>
                <ReactSelect
                  className="w-full"
                  isLoading={locationLoading}
                  styles={selectStyles}
                  isDisabled={!formik.values.state}
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
                      .find((option) => option.value === formik.values.district) || null
                  }
                  onChange={(selected) => {
                    formik.setFieldValue("district", selected?.value || "");
                    formik.setFieldValue("cityTownVillage", "");
                    fetchAllCities(selectedStateCode, selected?.value);
                  }}
                  onBlur={() => formik.setFieldTouched("district", true)}
                  placeholder="Select District"
                  isClearable
                />
                {formik.touched.district && formik.errors.district && (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.district}</div>
                )}
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700">City/Town/Village</label>
                <ReactSelect
                  className="w-full"
                  isLoading={locationLoading}
                  styles={selectStyles}
                  isDisabled={!formik.values.district}
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
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeading title="SECTION 2: Governance & Staffing" />
            <div className="grid gap-6 lg:grid-cols-2">
              <InputField
                label="10. Number of Board Members"
                name="numberOfBoardMembers"
                formik={formik}
                placeholder="Enter Number"
                type="number"
              />
              <InputField
                label="11. Number of Staff Members"
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
                label="12. Total Active Members"
                name="totalActiveMembers"
                formik={formik}
                placeholder="Enter Total Members"
                type="number"
              />
              <SearchableMultiSelect
                label="13. Member Categories (Tick all that apply)"
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
                label="14. Primary Communication Channels (Tick all that apply)"
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
              <InputField
                label="15. Major Crops/Commodities Handled"
                name="majorCropsHandled"
                formik={formik}
                placeholder="Enter Major Crops/Commodities"
                className="lg:col-span-2"
              />
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeading title="SECTION 5: Finance & Member Benefits" />
            <div className="grid gap-6 lg:grid-cols-2">
              <InputField
                label="16. Annual Turnover"
                name="annualTurnover"
                formik={formik}
                placeholder="Enter Annual Turnover"
                type="number"
              />
              <SearchableMultiSelect
                label="17. Major Revenue Sources (Tick all that apply)"
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
                label="18. Key Buyer Types (Tick all that apply)"
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
                label="19. Top 3 Challenges Faced by the FPO"
                name="topChallenges"
                formik={formik}
                placeholder="Enter Top 3 Challenges"
                className="lg:col-span-2"
              />
              <InputField
                label="20. Top 3 Improvement Priorities"
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
