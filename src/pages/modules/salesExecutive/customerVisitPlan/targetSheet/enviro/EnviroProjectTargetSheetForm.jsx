import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

import BreadCrumb from "../../../../../../components/uiComponents/breadcrumb/BreadCrumb";
import Button from "../../../../../../components/uiComponents/button/Button";
import { useTheme } from "../../../../../../hooks/theme/useTheme";

import useEnviroOnly from "./hooks/useEnviroOnly";
import useEnviroTargetSheetDropdowns from "./hooks/useEnviroTargetSheetDropdowns";
import useEnviroTargetSheetExecutive from "../../../../../../hooks/superAdminHook/customerVisitPlan/targetSheet/useEnviroTargetSheetExecutive";
import {
  FormSection,
  FormField,
  ReadOnlyField,
  DistributionTable,
  inputBaseClass,
  selectStyles,
  MONTHS,
  numberValue,
  roundTo,
  formatCurrency,
  buildTargetDistribution,
} from "./components/EnviroFormUI";

/* =========================================================
   ENVIRO SOLUTION — PROJECT BASED TARGET SHEET
   ------------------------------------------------------------
   Overall Target Price = Plant Capacity × Projected Price

   The overall target is spread evenly across the four quarters
   (25% each) and then evenly across the three months of every
   quarter.

   The project rules are owned by this form and are NOT shared
   with the product / service forms.
========================================================= */

/* ------------------------------------------------------------
   PROJECT-BASED TARGET SHEET — DISTRIBUTION RULES
   Project based targets are spread evenly over the year:
     Quarter 1 (Jan–Mar) : 25%
     Quarter 2 (Apr–Jun) : 25%
     Quarter 3 (Jul–Sep) : 25%
     Quarter 4 (Oct–Dec) : 25%
   Total                 : 100%

   Every month inside a quarter receives an equal share of the
   quarter target (1/3 each), allocated with cumulative rounding
   so the monthly totals always equal the quarterly target.
------------------------------------------------------------ */
const PROJECT_TARGET_DISTRIBUTION = {
  quarterly: [0.25, 0.25, 0.25, 0.25],
  monthly: [1 / 3, 1 / 3, 1 / 3],
};

const PROJECT_QUARTER_PERCENT_LABELS = [
  { quarter: "Q1 (Jan–Mar)", percent: 25 },
  { quarter: "Q2 (Apr–Jun)", percent: 25 },
  { quarter: "Q3 (Jul–Sep)", percent: 25 },
  { quarter: "Q4 (Oct–Dec)", percent: 25 },
];

/* ------------------------------------------------------------
   Project type / project name are served by the live catalog
   dropdowns (product types + product names). They are the only
   catalogue APIs available for the EnviroSolution company today
   and can be swapped for a dedicated project API later.
------------------------------------------------------------ */

const validationSchema = Yup.object({
  organization: Yup.string().required("Organization is required"),
  city: Yup.string().required("City is required"),
  individualName: Yup.string().required("Individual name is required"),
  year: Yup.string().required("Year is required"),
  projectType: Yup.string().required("Project type is required"),
  projectName: Yup.string().required("Project name is required"),
  plantCapacity: Yup.number()
    .typeError("Plant capacity must be a number")
    .min(0, "Plant capacity cannot be negative")
    .required("Plant capacity is required"),
  projectedPrice: Yup.number()
    .typeError("Projected price must be a number")
    .min(0, "Projected price cannot be negative")
    .required("Projected price is required"),
});


const EnviroProjectTargetSheetForm = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { isEnviroSolution, isCompanyLoaded } = useEnviroOnly();

  const [previewData, setPreviewData] = useState(null);

  const { createEnviroTargetSheet, loading: submitLoading } =
    useEnviroTargetSheetExecutive();

  const formik = useFormik({
    initialValues: {
      segment: "",
      profileType: "",
      organization: "",
      uniqueCode: "",
      city: "",
      individualName: "",
      individualUniqueCode: "",
      year: new Date().getFullYear().toString(),
      projectType: "",
      projectName: "",
      plantCapacity: "",
      projectedPrice: "",
      overAllTargetPrice: 0,
      achievement: {},
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const payload = {
          typeOfTargetSheet: "project",
          segment: values.segment,
          profileType: values.profileType,
          organization: values.organization,
          uniqueCodeOrganization: values.uniqueCode,
          city: values.city,
          individualName: values.individualName,
          uniqueCodeIndividual: values.individualUniqueCode,
          year: String(values.year),
          projectType: values.projectType,
          projectName: values.projectName,
          plantCapacity: numberValue(values.plantCapacity),
          projectedPrice: numberValue(values.projectedPrice),
          overAllTargetPrice: numberValue(values.overAllTargetPrice),
          achievement: values.achievement,
        };

        // eslint-disable-next-line no-console
        console.log(
          "ENVIRO PROJECT TARGET SHEET PAYLOAD:",
          JSON.stringify(payload, null, 2)
        );

        const res = await createEnviroTargetSheet(payload);

        if (res) {
          setPreviewData(payload);
          resetForm();
        }
      } catch (error) {
        console.error("EnviroProjectTargetSheetForm submission error:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  /* ---------------------------------------------------------
     RECALCULATE THE OVERALL TARGET AND ITS DISTRIBUTION
  --------------------------------------------------------- */
  const recalculate = (plantCapacity, projectedPrice) => {
    const capacity = numberValue(plantCapacity);
    const price = numberValue(projectedPrice);

    const quarters = buildTargetDistribution({
      overallQuantity: capacity,
      unitPrice: price,
      quarterlyRatios: PROJECT_TARGET_DISTRIBUTION.quarterly,
      monthlyRatios: PROJECT_TARGET_DISTRIBUTION.monthly,
    });

    formik.setFieldValue(
      "overAllTargetPrice",
      roundTo(capacity * price, 2),
      false
    );
    formik.setFieldValue("achievement", quarters, false);
  };

  /* ---------------------------------------------------------
     HANDLERS
  --------------------------------------------------------- */
  const handleSegmentChange = (option) => {
    formik.setFieldValue("segment", option?.value || "");
    formik.setFieldValue("profileType", "");
    formik.setFieldValue("organization", "");
    formik.setFieldValue("uniqueCode", "");
    formik.setFieldValue("city", "");
    formik.setFieldValue("individualName", "");
    formik.setFieldValue("individualUniqueCode", "");
  };

  const handleProfileTypeChange = (option) => {
    formik.setFieldValue("profileType", option?.value || "");
    formik.setFieldValue("individualName", "");
    formik.setFieldValue("individualUniqueCode", "");
  };

  const handleOrganizationChange = (option) => {
    formik.setFieldValue("organization", option?.value || "");
    formik.setFieldValue("uniqueCode", option?.uniqueCode || "");
    formik.setFieldValue("city", option?.city || "");
    formik.setFieldValue("individualName", "");
    formik.setFieldValue("individualUniqueCode", "");
  };

  const handleIndividualChange = (option) => {
    formik.setFieldValue("individualName", option?.value || "");
    formik.setFieldValue("individualUniqueCode", option?.uniqueCode || "");
    if (option?.city) {
      formik.setFieldValue("city", option.city);
    }
  };

  const handlePlantCapacityChange = (value) => {
    formik.setFieldValue("plantCapacity", value, false);
    recalculate(value, formik.values.projectedPrice);
  };

  const handleProjectedPriceChange = (value) => {
    formik.setFieldValue("projectedPrice", value, false);
    recalculate(formik.values.plantCapacity, value);
  };

  const handleAchievementChange = (quarter, month, field, value) => {
    const achievements = JSON.parse(
      JSON.stringify(formik.values.achievement || {})
    );
    const monthData = achievements[quarter]?.[month] || {};

    monthData[field] = value;
    monthData.targetAchievementPrice = roundTo(
      numberValue(value) * numberValue(formik.values.projectedPrice),
      2
    );

    achievements[quarter] = {
      ...achievements[quarter],
      [month]: monthData,
    };

    let quarterAchievementQuantity = 0;
    let quarterAchievementPrice = 0;

    MONTHS[quarter].forEach((monthName) => {
      const data = achievements[quarter]?.[monthName] || {};
      quarterAchievementQuantity += numberValue(data.targetAchievementQuantity);
      quarterAchievementPrice += numberValue(data.targetAchievementPrice);
    });

    achievements[quarter].QuarterAchievementQuantity = roundTo(
      quarterAchievementQuantity,
      0
    );
    achievements[quarter].QuarterAchievementPrice = roundTo(
      quarterAchievementPrice,
      2
    );

    formik.setFieldValue("achievement", achievements, false);
  };

  const handleReset = () => {
    formik.resetForm();
    setPreviewData(null);
  };

  /* ---------------------------------------------------------
     DROPDOWN OPTIONS (live APIs)
  --------------------------------------------------------- */
  const {
    loading: dropdownLoading,
    segmentOptions,
    profileTypeOptions,
    organizationOptions,
    individualOptions,
    productTypeOptions,
    productOptions,
    cityOptions,
    yearOptions,
  } = useEnviroTargetSheetDropdowns({
    organization: formik.values.organization,
    city: formik.values.city,
    segment: formik.values.segment,
    profileType: formik.values.profileType,
  });

  const projectTypeOptions = productTypeOptions;
  const projectOptions = productOptions;


  /* Wait until the company name has been read from sessionStorage,
     otherwise a valid Enviro user briefly sees "Access Restricted". */
  if (!isCompanyLoaded) return null;

  if (!isEnviroSolution) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="max-w-md text-center bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Access Restricted
          </h2>
          <p className="text-sm text-gray-600">
            The EnviroSolution Target Sheets are only available for the
            EnviroSolution company.
          </p>
          <div className="mt-5">
            <Button
              text="Go to Target Sheet"
              onClick={() => navigate("/sales-executive/target-sheet")}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <BreadCrumb
        linkText={[
          { text: "Customer Visit Plan" },
          { text: "Target Sheet" },
          { text: "EnviroSolution Target Sheet" },
          { text: "Project Based Target Sheet" },
        ]}
      />

      <form
        onSubmit={formik.handleSubmit}
        className="border rounded-2xl shadow-md bg-white overflow-hidden"
      >
        <div className="text-center">
          <h2
            className="flex p-6 mb-2 items-center justify-center font-semibold text-xl text-black rounded-t-md"
            style={{ backgroundColor: theme.secondaryColor }}
          >
            EnviroSolution — Project Based Target Sheet
          </h2>
        </div>

        <div className="px-6 pb-6">
          {/* ---------------- BASIC DETAILS ---------------- */}
          <FormSection
            title="Basic Details"
            description="Select the organization, city, individual and year for this target sheet."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <FormField label="Section" required>
                <Select
                  isLoading={dropdownLoading}
                  options={segmentOptions}
                  value={
                    segmentOptions.find(
                      (option) => option.value === formik.values.segment
                    ) || null
                  }
                  onChange={(option) => {
                    handleSegmentChange(option);
                    formik.setFieldTouched("segment", true);
                  }}
                  onBlur={() => formik.setFieldTouched("segment", true)}
                  isSearchable
                  isClearable
                  placeholder="Select section"
                  styles={selectStyles}
                />
              </FormField>

              <FormField label="Profile Type" required>
                <Select
                  isLoading={dropdownLoading}
                  options={profileTypeOptions}
                  value={
                    profileTypeOptions.find(
                      (option) => option.value === formik.values.profileType
                    ) || null
                  }
                  onChange={(option) => {
                    handleProfileTypeChange(option);
                    formik.setFieldTouched("profileType", true);
                  }}
                  onBlur={() => formik.setFieldTouched("profileType", true)}
                  isSearchable
                  isClearable
                  placeholder="Select profile type"
                  styles={selectStyles}
                />
              </FormField>

              <FormField
                label="Organization"
                required
                error={formik.touched.organization && formik.errors.organization}
              >
                <Select
                  isLoading={dropdownLoading}
                  options={organizationOptions}
                  value={
                    organizationOptions.find(
                      (option) => option.value === formik.values.organization
                    ) || null
                  }
                  onChange={(option) => {
                    handleOrganizationChange(option);
                    formik.setFieldTouched("organization", true);
                  }}
                  onBlur={() => formik.setFieldTouched("organization", true)}
                  isSearchable
                  isClearable
                  placeholder="Select organization"
                  styles={selectStyles}
                />
              </FormField>

              <FormField
                label="City"
                required
                error={formik.touched.city && formik.errors.city}
              >
                <Select
                  isLoading={dropdownLoading}
                  options={cityOptions}
                  value={
                    cityOptions.find(
                      (option) => option.value === formik.values.city
                    ) || null
                  }
                  onChange={(option) => {
                    formik.setFieldValue("city", option?.value || "");
                    formik.setFieldTouched("city", true);
                  }}
                  onBlur={() => formik.setFieldTouched("city", true)}
                  isSearchable
                  isClearable
                  placeholder="Select city"
                  styles={selectStyles}
                />
              </FormField>

              <FormField
                label="Individual Name"
                required
                error={
                  formik.touched.individualName && formik.errors.individualName
                }
              >
                <Select
                  isLoading={dropdownLoading}
                  options={individualOptions}
                  value={
                    individualOptions.find(
                      (option) => option.value === formik.values.individualName
                    ) || null
                  }
                  onChange={(option) => {
                    handleIndividualChange(option);
                    formik.setFieldTouched("individualName", true);
                  }}
                  onBlur={() =>
                    formik.setFieldTouched("individualName", true)
                  }
                  isSearchable
                  isClearable
                  placeholder="Select individual"
                  styles={selectStyles}
                />
              </FormField>

              <FormField
                label="Year"
                required
                error={formik.touched.year && formik.errors.year}
              >
                <Select
                  options={yearOptions}
                  value={
                    yearOptions.find(
                      (option) => option.value === formik.values.year
                    ) || null
                  }
                  onChange={(option) => {
                    formik.setFieldValue("year", option?.value || "");
                    formik.setFieldTouched("year", true);
                  }}
                  onBlur={() => formik.setFieldTouched("year", true)}
                  isSearchable
                  placeholder="Select year"
                  styles={selectStyles}
                />
              </FormField>
            </div>
          </FormSection>

          {/* ---------------- PROJECT DETAILS ---------------- */}
          <FormSection
            title="Project Details"
            description="Enter the plant capacity and projected price. The overall target price and the quarter/month wise distribution are calculated automatically."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <FormField
                label="Project Type"
                required
                error={formik.touched.projectType && formik.errors.projectType}
              >
                <Select
                  isLoading={dropdownLoading}
                  options={projectTypeOptions}
                  value={
                    projectTypeOptions.find(
                      (option) => option.value === formik.values.projectType
                    ) || null
                  }
                  onChange={(option) => {
                    formik.setFieldValue("projectType", option?.value || "");
                    formik.setFieldValue("projectName", "");
                    formik.setFieldTouched("projectType", true);
                  }}
                  onBlur={() => formik.setFieldTouched("projectType", true)}
                  isSearchable
                  isClearable
                  placeholder="Select project type"
                  styles={selectStyles}
                />
              </FormField>

              <FormField
                label="Project Name"
                required
                error={formik.touched.projectName && formik.errors.projectName}
              >
                <Select
                  isLoading={dropdownLoading}
                  options={projectOptions}
                  value={
                    projectOptions.find(
                      (option) => option.value === formik.values.projectName
                    ) || null
                  }
                  onChange={(option) => {
                    formik.setFieldValue("projectName", option?.value || "");
                    formik.setFieldTouched("projectName", true);
                  }}
                  onBlur={() => formik.setFieldTouched("projectName", true)}
                  isSearchable
                  isClearable
                  placeholder="Select project"
                  styles={selectStyles}
                />
              </FormField>

              <FormField
                label="Plant Capacity"
                required
                error={formik.touched.plantCapacity && formik.errors.plantCapacity}
              >
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={formik.values.plantCapacity ?? ""}
                  onChange={(event) => {
                    handlePlantCapacityChange(event.target.value);
                    formik.setFieldTouched("plantCapacity", true);
                  }}
                  onBlur={() => formik.setFieldTouched("plantCapacity", true)}
                  onWheel={(event) => event.target.blur()}
                  className={inputBaseClass}
                  placeholder="Enter plant capacity"
                />
              </FormField>

              <FormField
                label="Projected Price (₹)"
                required
                error={formik.touched.projectedPrice && formik.errors.projectedPrice}
              >
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formik.values.projectedPrice ?? ""}
                  onChange={(event) => {
                    handleProjectedPriceChange(event.target.value);
                    formik.setFieldTouched("projectedPrice", true);
                  }}
                  onBlur={() => formik.setFieldTouched("projectedPrice", true)}
                  onWheel={(event) => event.target.blur()}
                  className={inputBaseClass}
                  placeholder="Enter projected price"
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <ReadOnlyField
                label="Overall Target Quantity (Plant Capacity)"
                value={formik.values.plantCapacity ?? 0}
              />
              <ReadOnlyField
                label="Overall Target Price"
                value={`₹ ${formatCurrency(formik.values.overAllTargetPrice)}`}
                hint="Plant Capacity × Projected Price"
              />
            </div>
          </FormSection>

          {/* ---------------- QUARTER / MONTH DISTRIBUTION ---------------- */}
          <FormSection
            title="Quarter & Month Distribution"
            description="The overall target is distributed evenly across the four quarters and then evenly across the three months of each quarter."
          >
            <div className="flex flex-wrap gap-2 text-xs mb-4">
              {PROJECT_QUARTER_PERCENT_LABELS.map((label) => (
                <span
                  key={label.quarter}
                  className="px-2 py-1 rounded bg-blue-100 text-blue-800"
                >
                  {label.quarter}: {label.percent}%
                </span>
              ))}
            </div>

            {formik.values.plantCapacity ? (
              <DistributionTable
                distribution={{
                  quarters: formik.values.achievement || {},
                  quarterlyRatios: PROJECT_TARGET_DISTRIBUTION.quarterly,
                  monthlyRatios: PROJECT_TARGET_DISTRIBUTION.monthly,
                }}
                onAchievementChange={handleAchievementChange}
              />
            ) : (
              <p className="text-sm text-gray-500 italic">
                Enter the plant capacity to see the quarter and month wise
                distribution.
              </p>
            )}
          </FormSection>

          {/* ---------------- ACTIONS ---------------- */}
          <div className="flex flex-wrap items-center justify-end gap-3 border-t pt-4">
            <Button
              type="button"
              text="Cancel"
              onClick={() => navigate("/sales-executive/enviro-target-sheet")}
              variant={2}
            />
            <Button type="button" text="Reset" onClick={handleReset} variant={2} />
            <Button
              type="submit"
              text={formik.isSubmitting ? "Submitting..." : "Submit"}
              disabled={
                formik.isSubmitting || formik.isValidating || submitLoading
              }
            />
          </div>
        </div>
      </form>

      {/* ---------------- PREVIEW MODAL ---------------- */}
      {previewData ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[85vh] overflow-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                Project Target Sheet Preview
              </h3>
              <button
                type="button"
                onClick={() => setPreviewData(null)}
                className="text-gray-500 hover:text-gray-800 text-xl leading-none"
              >
                &times;
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <p>
                  <span className="font-semibold">Section:</span>{" "}
                  {previewData.segment || "-"}
                </p>
                <p>
                  <span className="font-semibold">Profile Type:</span>{" "}
                  {previewData.profileType || "-"}
                </p>
                <p>
                  <span className="font-semibold">Organization:</span>{" "}
                  {previewData.organization}
                </p>
                <p>
                  <span className="font-semibold">City:</span> {previewData.city}
                </p>
                <p>
                  <span className="font-semibold">Individual:</span>{" "}
                  {previewData.individualName}
                </p>
                <p>
                  <span className="font-semibold">Year:</span> {previewData.year}
                </p>
                <p>
                  <span className="font-semibold">Project:</span>{" "}
                  {previewData.projectName} ({previewData.projectType})
                </p>
                <p>
                  <span className="font-semibold">Plant Capacity:</span>{" "}
                  {previewData.plantCapacity}
                </p>
                <p>
                  <span className="font-semibold">Projected Price:</span> ₹{" "}
                  {formatCurrency(previewData.projectedPrice)}
                </p>
                <p>
                  <span className="font-semibold">Overall Target Price:</span> ₹{" "}
                  {formatCurrency(previewData.overAllTargetPrice)}
                </p>
              </div>

              <p className="text-xs text-gray-500">
                This is a local preview only — no data has been sent to or
                saved in the backend.
              </p>
            </div>

            <div className="px-6 py-4 border-t flex justify-end">
              <Button
                type="button"
                text="Close"
                onClick={() => setPreviewData(null)}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default EnviroProjectTargetSheetForm;
