import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../../../../../../hooks/theme/useTheme";
import Button from "../../../../../../components/uiComponents/button/Button";
import BreadCrumb from "../../../../../../components/uiComponents/breadcrumb/BreadCrumb";
import useEnviroAdminOrgDB from "../../../../../../hooks/superAdminHook/superAdmindatabase/enviroDB/useEnviroAdminOrgDB";
import LoaderSpinner from "../../../../../../components/uiComponents/loader/LoaderSpinner";

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

const validationSchema = yup.object({
  departmentName: yup.string().trim().required("Department Name is required"),
  jurisdictionLevel: yup.string().required("Jurisdiction Level is required"),
  stateName: yup.string().trim().required("State / UT Name is required"),
  districtName: yup.string().trim().required("District Name is required"),
  officeAddress: yup.string().trim().required("Office Address is required"),
  officialContactNumber: yup
    .string()
    .trim()
    .required("Official Contact Number is required")
    .matches(/^[0-9+()\- ]+$/, "Enter a valid phone number"),
  officialEmail: yup.string().email("Invalid email").required("Official Email is required"),
  departmentWebsite: yup
    .string()
    .trim()
    .nullable()
    .notRequired()
    .url("Enter a valid website URL"),
  totalOfficers: yup
    .number()
    .typeError("Enter a number")
    .integer("Enter a whole number")
    .positive("Must be greater than zero")
    .required("Total Number of Officers is required"),
  activeSchemes: yup.string().trim().required("Active schemes are required"),
  farmersRegistered: yup
    .number()
    .typeError("Enter a number")
    .integer("Enter a whole number")
    .positive("Must be greater than zero")
    .required("Estimated number of farmers is required"),
  servicesOthersText: yup.string().when("servicesOffered", {
    is: (servicesOffered) => servicesOffered?.Others === true,
    then: (schema) => schema.trim().required("Please specify other service"),
    otherwise: (schema) => schema.nullable(),
  }),
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

const EnviroEmpOrgAddEditDB = ({ mode = "add" }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    createEnviroAdminOrg,
    loading,
    resetEnviroAdminOrgDetails,
    enviroAdminOrgDetails,
    fetchEnviroAdminOrgDetails,
    updateEnviroAdminOrg
  } = useEnviroAdminOrgDB();
  const { theme } = useTheme();
  const isEdit = mode === "edit";
  const isView = mode === "view";
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (id) {
      fetchEnviroAdminOrgDetails(id);
    }
    return () => resetEnviroAdminOrgDetails();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      departmentName: "",
      jurisdictionLevel: "",
      stateName: "",
      districtName: "",
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

  // Helper: convert array ["A", "B"] to object { A: true, B: false, ... }
  const arrayToCheckboxObj = (arr, defaultObj) => {
    const result = { ...defaultObj };
    (arr || []).forEach((key) => {
      if (key in result) result[key] = true;
    });
    return result;
  };

  useEffect(() => {
    if (enviroAdminOrgDetails) {
      const d = enviroAdminOrgDetails;
      formik.setValues({
        departmentName: d.departmentName || "",
        jurisdictionLevel: d.jurisdictionLevel || "",
        stateName: d.state || "",
        districtName: d.district || "",
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
      });
    }
  }, [enviroAdminOrgDetails]);

  // Log validation errors when submission is attempted
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

  console.log("enviroAdminOrgDetails", enviroAdminOrgDetails)

  return (
    <div className="min-h-screen">
      <BreadCrumb
        linkText={[
          { text: "Database", href: "/sales-executive/database" },
          { text: pageTitle },
        ]}
      />
      {/* <div className="mx-auto w-full max-w-7xl rounded-[2rem] border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/40 sm:p-2"> */}
      <div className="rounded-t-xl bg-gradient-to-r p-6 shadow-lg shadow-slate-900/10"
        style={{ backgroundColor: theme.secondaryColor }}>
        <h2
          className="flex px-6 items-center justify-center font-semibold text-xl text-black bg-opacity-40"
        >Enviro Department Profile</h2>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-4 bg-white rounded-b-xl p-2 shadow-lg shadow-slate-900/10 sm:p-6">
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
              <InputField
                label="State / UT Name"
                name="stateName"
                formik={formik}
                placeholder="Enter state or union territory"
              />
              <InputField
                label="District Name"
                name="districtName"
                formik={formik}
                placeholder="Enter district name"
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
    </div>
    // </div>
  );
}

export default EnviroEmpOrgAddEditDB