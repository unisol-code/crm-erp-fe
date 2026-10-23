import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useSearchParams } from "react-router-dom";
import Select from "react-select";

import BreadCrumb from "../../../../../../components/uiComponents/breadcrumb/BreadCrumb";
import Button from "../../../../../../components/uiComponents/button/Button";
import { useTheme } from "../../../../../../hooks/theme/useTheme";

import useEnviroOnly from "./hooks/useEnviroOnly";
import useEnviroTargetSheetDropdowns from "./hooks/useEnviroTargetSheetDropdowns";
import useEnviroTargetSheetExecutive from "../../../../../../hooks/salesExecutiveHook/customerVisitPlan/useEnviroTargetSheetExecutive";
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
   NORMALISE THE ACHIEVEMENT BLOCK BEFORE SENDING.
   Guarantees every quarter / month carries a numeric
   `targetAchievementQuantity` (default 0) + its price, and
   ensures the `overall` totals are always present.
------------------------------------------------------------ */
const buildAchievementPayload = (achievement) => {
  const source = achievement || {};
  const normalized = {};

  Object.keys(MONTHS).forEach((quarter) => {
    const quarterSource = source[quarter] || {};
    const quarterData = {};

    MONTHS[quarter].forEach((month) => {
      const monthSource = quarterSource[month] || {};

      quarterData[month] = {
        ...monthSource,
        targetAchievementQuantity: numberValue(
          monthSource.targetAchievementQuantity
        ), // defaults to 0
        targetAchievementPrice: numberValue(
          monthSource.targetAchievementPrice
        ),
      };
    });

    quarterData.QuarterAchievementQuantity = numberValue(
      quarterSource.QuarterAchievementQuantity
    );
    quarterData.QuarterAchievementPrice = numberValue(
      quarterSource.QuarterAchievementPrice
    );
    quarterData.QuarterTargetQuantity = numberValue(
      quarterSource.QuarterTargetQuantity
    );
    quarterData.QuarterTargetPrice = numberValue(
      quarterSource.QuarterTargetPrice
    );

    normalized[quarter] = quarterData;
  });

  normalized.overall = {
    totalQuantity: numberValue(source.overall?.totalQuantity),
    totalPrice: numberValue(source.overall?.totalPrice),
  };

  return normalized;
};

/**
 * Normalise the achievement block returned by the backend for a
 * project target sheet so it matches the shape the form expects.
 */
const normalizeProjectAchievementFromBackend = (achievement) => {
  const source = achievement || {};
  const normalized = {};

  Object.keys(MONTHS).forEach((quarter) => {
    const quarterSource = source[quarter] || {};
    const quarterData = {};

    MONTHS[quarter].forEach((month) => {
      const monthSource = quarterSource[month] || {};
      quarterData[month] = {
        targetQuantity: numberValue(monthSource.targetQuantity),
        targetPrice: numberValue(monthSource.targetPrice),
        targetAchievementQuantity: numberValue(
          monthSource.targetAchievementQuantity
        ),
        targetAchievementPrice: numberValue(
          monthSource.targetAchievementPrice
        ),
      };
    });

    quarterData.QuarterTargetQuantity = numberValue(
      quarterSource.QuarterTargetQuantity
    );
    quarterData.QuarterTargetPrice = numberValue(
      quarterSource.QuarterTargetPrice
    );
    quarterData.QuarterAchievementQuantity = numberValue(
      quarterSource.QuarterAchievementQuantity
    );
    quarterData.QuarterAchievementPrice = numberValue(
      quarterSource.QuarterAchievementPrice
    );

    normalized[quarter] = quarterData;
  });

  normalized.overall = {
    totalQuantity: numberValue(source.overall?.totalQuantity),
    totalPrice: numberValue(source.overall?.totalPrice),
  };

  return normalized;
};

/* ------------------------------------------------------------
   Project type / project name are served by the live catalog
   dropdowns (product types + product names). They are the only
   catalogue APIs available for the EnviroSolution company today
   and can be swapped for a dedicated project API later.
------------------------------------------------------------ */

const validationSchema = Yup.object({
  organization: Yup.string().nullable(),
  city: Yup.string().required("City is required"),
  individualName: Yup.string().nullable(),
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
})
.test(
  "organization-or-individual",
  "Organization or Individual name is required",
  function (value) {
    return !!(value?.organization || value?.individualName);
  }
);


const EnviroProjectTargetSheetForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const { theme } = useTheme();
  const { isEnviroSolution, isCompanyLoaded } = useEnviroOnly();

  const [previewData, setPreviewData] = useState(null);

  const {
    createEnviroTargetSheet,
    loading: submitLoading,
    fetchProjectIndividualOrganizationTargetSheetById,
    projectIndividualOrganizationTargetSheetDetails,
  } = useEnviroTargetSheetExecutive();

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
          sheetType: "Project",
          segment: values.segment,
          profileType: values.profileType,
          cityTownVillage: values.city || "",
          financialYear: String(values.year),
          ...(values.individualUniqueCode
            ? { uniqueCodeIndividual: values.individualUniqueCode }
            : {}),
          ...(values.individualName
            ? { individualName: values.individualName }
            : {}),
          ...(values.uniqueCode
            ? { uniqueCodeOrganization: values.uniqueCode }
            : {}),
          ...(values.organization ? { organizationName: values.organization } : {}),
          projectType: values.projectType,
          projectName: values.projectName,
          plantCapacity: numberValue(values.plantCapacity),
          projectPrice: numberValue(values.projectedPrice),
          // 👇 normalise so every month always ships targetAchievementQuantity: 0
          achievement: buildAchievementPayload(values.achievement),
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
      roundTo(price, 2),
      false
    );
    formik.setFieldValue("achievement", quarters, false);
  };

  useEffect(() => {
    if (id) {
      fetchProjectIndividualOrganizationTargetSheetById(id);
    }
  }, [id]);

  /* Populate the form when an existing project sheet is loaded for editing. */
  useEffect(() => {
    const data = projectIndividualOrganizationTargetSheetDetails;
    if (!data || typeof data !== "object") return;

    formik.setValues({
      segment: data.segment || "",
      profileType: "",
      organization: data.organizationName || "",
      uniqueCode: data.uniqueCodeOrganization || "",
      city: data.cityTownVillage || "",
      individualName: data.individualName || "",
      individualUniqueCode: data.uniqueCodeIndividual || "",
      year: data.financialYear || new Date().getFullYear().toString(),
      projectType: data.projectType || "",
      projectName: data.projectName || "",
      plantCapacity: data.plantCapacity ?? "",
      projectedPrice: data.projectPrice ?? "",
      overAllTargetPrice: numberValue(data.overAllTargetPrice),
      achievement: normalizeProjectAchievementFromBackend(data.achievement),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectIndividualOrganizationTargetSheetDetails]);

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

  const isReadOnly = Boolean(id);

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
        onSubmit={isReadOnly ? (e) => e.preventDefault() : formik.handleSubmit}
        className={`border rounded-2xl shadow-md bg-white overflow-hidden ${
          isReadOnly ? "enviro-read-only-form" : ""
        }`}
      >
        {isReadOnly ? (
          <style>{`
            .enviro-read-only-form input,
            .enviro-read-only-form select,
            .enviro-read-only-form textarea,
            .enviro-read-only-form [class*="react-select"],
            .enviro-read-only-form .react-select__control {
              pointer-events: none;
              user-select: none;
              background-color: #f9fafb;
              cursor: not-allowed;
            }
          `}</style>
        ) : null}
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

               <div>
                 <label className="block text-sm font-medium mb-1">
                   Organization Unique Code
                 </label>
                 <input
                   type="text"
                   readOnly
                   value={formik.values.uniqueCode || "-"}
                   className="w-full border rounded-md p-2 bg-gray-100 text-gray-600"
                   placeholder="Select an organization"
                 />
               </div>

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

               <div>
                 <label className="block text-sm font-medium mb-1">
                   Individual Unique Code
                 </label>
                 <input
                   type="text"
                   readOnly
                   value={formik.values.individualUniqueCode || "-"}
                   className="w-full border rounded-md p-2 bg-gray-100 text-gray-600"
                   placeholder="Select an individual"
                 />
               </div>

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
            {!isReadOnly ? (
              <Button
                type="button"
                text="Reset"
                onClick={handleReset}
                variant={2}
              />
            ) : null}
            {!isReadOnly ? (
              <Button
                type="submit"
                text={formik.isSubmitting ? "Submitting..." : "Submit"}
                disabled={
                  formik.isSubmitting || formik.isValidating || submitLoading
                }
              />
            ) : null}
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