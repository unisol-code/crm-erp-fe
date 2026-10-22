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
   ENVIRO SOLUTION — SERVICE BASED TARGET SHEET
   ------------------------------------------------------------
   Renting  : Overall Target Price = Monthly Rent × Total Rental Months
              (CONFIRMED business rule)

   Spraying : The target calculation rule has NOT been confirmed by
              the business yet. It is therefore NOT computed here.
              The user enters the overall target quantity and the
              unit price manually and the CONFIRMED service
              distribution (Q1 0% | Q2 50% | Q3 50% | Q4 0%) is applied
              to it. A clear "pending" notice is shown on screen.

   The service rules are owned by this form and are NOT
   shared with the product / project forms.
========================================================= */

/* ------------------------------------------------------------
   SERVICE-BASED TARGET SHEET — DISTRIBUTION RULES
   Service based targets (renting / spraying) only run for half
   of the year:
     Quarter 1 (Jan–Mar) : 0%
     Quarter 2 (Apr–Jun) : 50%
     Quarter 3 (Jul–Sep) : 50%
     Quarter 4 (Oct–Dec) : 0%
   Total                 : 100%

   Every month inside a quarter receives an equal share of the
   quarter target (1/3 each), allocated with cumulative rounding
   so the monthly totals always equal the quarterly target.

   NOTE: the service specific calculation (rental total, spraying
   rule, ...) is applied BEFORE this distribution runs.
------------------------------------------------------------ */
const SERVICE_TARGET_DISTRIBUTION = {
  quarterly: [0, 0.5, 0.5, 0],
  monthly: [1 / 3, 1 / 3, 1 / 3],
};

const SERVICE_QUARTER_PERCENT_LABELS = [
  { quarter: "Q1 (Jan–Mar)", percent: 0 },
  { quarter: "Q2 (Apr–Jun)", percent: 50 },
  { quarter: "Q3 (Jul–Sep)", percent: 50 },
  { quarter: "Q4 (Oct–Dec)", percent: 0 },
];

/* Service types supported by the service based target sheet */
const SERVICE_TYPES = [
  { label: "Renting", value: "Renting" },
  { label: "Spraying", value: "Spraying" },
];

/**
 * Renting rule (confirmed by the business):
 *   Total Target Price = Rent per Month × Total Rental Months
 */
const calculateRentingTargetPrice = (rentPerMonth, totalRentalMonths) => {
  const rent = Number(rentPerMonth);
  const months = Number(totalRentalMonths);

  if (Number.isNaN(rent) || Number.isNaN(months)) return 0;

  return Math.round(rent * months * 100) / 100;
};

const SERVICE_TYPE_RENTING = "Renting";
const SERVICE_TYPE_SPRAYING = "Spraying";

const validationSchema = Yup.object({
  organization: Yup.string().required("Organization is required"),
  city: Yup.string().required("City is required"),
  individualName: Yup.string().required("Individual name is required"),
  year: Yup.string().required("Year is required"),
  serviceType: Yup.string().required("Service type is required"),
  /* Renting */
  monthlyRent: Yup.number()
    .typeError("Monthly rent must be a number")
    .min(0, "Monthly rent cannot be negative")
    .when("serviceType", {
      is: SERVICE_TYPE_RENTING,
      then: (schema) => schema.required("Monthly rent is required"),
      otherwise: (schema) => schema.nullable(),
    }),
  totalRentalMonths: Yup.number()
    .typeError("Total rental months must be a number")
    .min(0, "Rental months cannot be negative")
    .when("serviceType", {
      is: SERVICE_TYPE_RENTING,
      then: (schema) => schema.required("Total rental months is required"),
      otherwise: (schema) => schema.nullable(),
    }),
  /* Spraying (manual entry — calculation rule still pending) */
  overallTargetQuantity: Yup.number()
    .typeError("Overall target quantity must be a number")
    .min(0, "Quantity cannot be negative")
    .when("serviceType", {
      is: SERVICE_TYPE_SPRAYING,
      then: (schema) => schema.required("Overall target quantity is required"),
      otherwise: (schema) => schema.nullable(),
    }),
  unitPrice: Yup.number()
    .typeError("Unit price must be a number")
    .min(0, "Unit price cannot be negative")
    .when("serviceType", {
      is: SERVICE_TYPE_SPRAYING,
      then: (schema) => schema.required("Unit price is required"),
      otherwise: (schema) => schema.nullable(),
    }),
});


const EnviroServiceTargetSheetForm = () => {
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
      serviceType: "",
      monthlyRent: "",
      totalRentalMonths: "",
      overallTargetQuantity: "",
      unitPrice: "",
      overAllTargetPrice: 0,
      achievement: {},
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const payload = {
          typeOfTargetSheet: "service",
          segment: values.segment,
          profileType: values.profileType,
          organization: values.organization,
          uniqueCodeOrganization: values.uniqueCode,
          city: values.city,
          individualName: values.individualName,
          uniqueCodeIndividual: values.individualUniqueCode,
          year: String(values.year),
          serviceType: values.serviceType,
          monthlyRent:
            values.serviceType === SERVICE_TYPE_RENTING
              ? numberValue(values.monthlyRent)
              : null,
          totalRentalMonths:
            values.serviceType === SERVICE_TYPE_RENTING
              ? numberValue(values.totalRentalMonths)
              : null,
          overallTargetQuantity:
            values.serviceType === SERVICE_TYPE_SPRAYING
              ? numberValue(values.overallTargetQuantity)
              : null,
          unitPrice:
            values.serviceType === SERVICE_TYPE_SPRAYING
              ? numberValue(values.unitPrice)
              : null,
          overAllTargetPrice: numberValue(values.overAllTargetPrice),
          achievement: values.achievement,
        };

        // eslint-disable-next-line no-console
        console.log(
          "ENVIRO SERVICE TARGET SHEET PAYLOAD:",
          JSON.stringify(payload, null, 2)
        );

        const res = await createEnviroTargetSheet(payload);

        if (res) {
          setPreviewData(payload);
          resetForm();
        }
      } catch (error) {
        console.error("EnviroServiceTargetSheetForm submission error:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const isRenting = formik.values.serviceType === SERVICE_TYPE_RENTING;
  const isSpraying = formik.values.serviceType === SERVICE_TYPE_SPRAYING;

  /* ---------------------------------------------------------
     RECALCULATE THE OVERALL TARGET AND ITS DISTRIBUTION
  --------------------------------------------------------- */
  const applyDistribution = (overallQuantity, unitPrice) => {
    const quarters = buildTargetDistribution({
      overallQuantity,
      unitPrice,
      quarterlyRatios: SERVICE_TARGET_DISTRIBUTION.quarterly,
      monthlyRatios: SERVICE_TARGET_DISTRIBUTION.monthly,
    });

    formik.setFieldValue("achievement", quarters, false);
  };

  const recalculateRenting = (monthlyRent, totalRentalMonths) => {
    const targetPrice = calculateRentingTargetPrice(
      monthlyRent,
      totalRentalMonths
    );

    formik.setFieldValue("overAllTargetPrice", targetPrice, false);

    /* For renting the "quantity" carried into the distribution is the
       number of rental months, the unit price is the monthly rent. */
    applyDistribution(
      numberValue(totalRentalMonths),
      numberValue(monthlyRent)
    );
  };

  const recalculateSpraying = (overallTargetQuantity, unitPrice) => {
    const quantity = numberValue(overallTargetQuantity);
    const price = numberValue(unitPrice);

    formik.setFieldValue(
      "overAllTargetPrice",
      roundTo(quantity * price, 2),
      false
    );

    applyDistribution(quantity, price);
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

  const handleServiceTypeChange = (option) => {
    const serviceType = option?.value || "";

    formik.setFieldValue("serviceType", serviceType);

    /* Reset the fields that do not belong to the selected type */
    formik.setFieldValue("monthlyRent", "");
    formik.setFieldValue("totalRentalMonths", "");
    formik.setFieldValue("overallTargetQuantity", "");
    formik.setFieldValue("unitPrice", "");
    formik.setFieldValue("overAllTargetPrice", 0);
    formik.setFieldValue("achievement", {}, false);
  };

  const handleMonthlyRentChange = (value) => {
    formik.setFieldValue("monthlyRent", value, false);
    recalculateRenting(value, formik.values.totalRentalMonths);
  };

  const handleTotalRentalMonthsChange = (value) => {
    formik.setFieldValue("totalRentalMonths", value, false);
    recalculateRenting(formik.values.monthlyRent, value);
  };

  const handleOverallTargetQuantityChange = (value) => {
    formik.setFieldValue("overallTargetQuantity", value, false);
    recalculateSpraying(value, formik.values.unitPrice);
  };

  const handleUnitPriceChange = (value) => {
    formik.setFieldValue("unitPrice", value, false);
    recalculateSpraying(formik.values.overallTargetQuantity, value);
  };

  const handleAchievementChange = (quarter, month, field, value) => {
    const achievements = JSON.parse(
      JSON.stringify(formik.values.achievement || {})
    );
    const monthData = achievements[quarter]?.[month] || {};

    monthData[field] = value;

    /* For renting the unit price is the monthly rent, for spraying it is
       the entered unit price. */
    const unitPrice = isRenting
      ? numberValue(formik.values.monthlyRent)
      : numberValue(formik.values.unitPrice);

    monthData.targetAchievementPrice = roundTo(
      numberValue(value) * unitPrice,
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
    cityOptions,
    yearOptions,
  } = useEnviroTargetSheetDropdowns({
    organization: formik.values.organization,
    city: formik.values.city,
    segment: formik.values.segment,
    profileType: formik.values.profileType,
  });

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
          { text: "Service Based Target Sheet" },
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
            EnviroSolution — Service Based Target Sheet
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

          {/* ---------------- SERVICE DETAILS ---------------- */}
          <FormSection
            title="Service Details"
            description="Choose the service type. The service target is distributed over Q2 and Q3 (50% each)."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <FormField
                label="Service Type"
                required
                error={formik.touched.serviceType && formik.errors.serviceType}
              >
                <Select
                  options={SERVICE_TYPES}
                  value={
                    SERVICE_TYPES.find(
                      (option) => option.value === formik.values.serviceType
                    ) || null
                  }
                  onChange={(option) => {
                    handleServiceTypeChange(option);
                    formik.setFieldTouched("serviceType", true);
                  }}
                  onBlur={() => formik.setFieldTouched("serviceType", true)}
                  placeholder="Select service type"
                  styles={selectStyles}
                />
              </FormField>

              {/* ---------- RENTING FIELDS ---------- */}
              {isRenting ? (
                <>
                  <FormField
                    label="Monthly Rent (₹)"
                    required
                    error={
                      formik.touched.monthlyRent && formik.errors.monthlyRent
                    }
                  >
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formik.values.monthlyRent ?? ""}
                      onChange={(event) => {
                        handleMonthlyRentChange(event.target.value);
                        formik.setFieldTouched("monthlyRent", true);
                      }}
                      onBlur={() => formik.setFieldTouched("monthlyRent", true)}
                      onWheel={(event) => event.target.blur()}
                      className={inputBaseClass}
                      placeholder="Enter monthly rent"
                    />
                  </FormField>

                  <FormField
                    label="Total Rental Months"
                    required
                    error={
                      formik.touched.totalRentalMonths &&
                      formik.errors.totalRentalMonths
                    }
                  >
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={formik.values.totalRentalMonths ?? ""}
                      onChange={(event) => {
                        handleTotalRentalMonthsChange(event.target.value);
                        formik.setFieldTouched("totalRentalMonths", true);
                      }}
                      onBlur={() =>
                        formik.setFieldTouched("totalRentalMonths", true)
                      }
                      onWheel={(event) => event.target.blur()}
                      className={inputBaseClass}
                      placeholder="Enter rental months"
                    />
                  </FormField>
                </>
              ) : null}

              {/* ---------- SPRAYING FIELDS ---------- */}
              {isSpraying ? (
                <>
                  <FormField
                    label="Overall Target Quantity"
                    required
                    error={
                      formik.touched.overallTargetQuantity &&
                      formik.errors.overallTargetQuantity
                    }
                  >
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={formik.values.overallTargetQuantity ?? ""}
                      onChange={(event) => {
                        handleOverallTargetQuantityChange(event.target.value);
                        formik.setFieldTouched("overallTargetQuantity", true);
                      }}
                      onBlur={() =>
                        formik.setFieldTouched("overallTargetQuantity", true)
                      }
                      onWheel={(event) => event.target.blur()}
                      className={inputBaseClass}
                      placeholder="Enter target quantity"
                    />
                  </FormField>

                  <FormField
                    label="Unit Price (₹)"
                    required
                    error={formik.touched.unitPrice && formik.errors.unitPrice}
                  >
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formik.values.unitPrice ?? ""}
                      onChange={(event) => {
                        handleUnitPriceChange(event.target.value);
                        formik.setFieldTouched("unitPrice", true);
                      }}
                      onBlur={() => formik.setFieldTouched("unitPrice", true)}
                      onWheel={(event) => event.target.blur()}
                      className={inputBaseClass}
                      placeholder="Enter unit price"
                    />
                  </FormField>
                </>
              ) : null}
            </div>

            {/* ---------- RENTING RULE HINT ---------- */}
            {isRenting ? (
              <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-300 text-green-800 text-sm">
                <strong>Renting rule:</strong> Overall Target Price = Monthly Rent
                × Total Rental Months.
              </div>
            ) : null}

            {/* ---------- SPRAYING PENDING NOTICE ---------- */}
            {isSpraying ? (
              <div className="mt-4 p-3 rounded-lg bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm">
                <strong>Pending confirmation:</strong> the business rule for
                calculating a spraying target has not been confirmed yet. The
                overall target is therefore taken directly from the quantity
                and unit price entered above, and only the confirmed quarter /
                month distribution (Q1 0% | Q2 50% | Q3 50% | Q4 0%) is applied
                to it.
              </div>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <ReadOnlyField
                label="Overall Target Quantity"
                value={
                  isRenting
                    ? formik.values.totalRentalMonths ?? 0
                    : formik.values.overallTargetQuantity ?? 0
                }
                hint={
                  isRenting
                    ? "Number of rental months"
                    : "Entered target quantity"
                }
              />
              <ReadOnlyField
                label="Overall Target Price"
                value={`₹ ${formatCurrency(formik.values.overAllTargetPrice)}`}
                hint={
                  isRenting
                    ? "Monthly Rent × Total Rental Months"
                    : "Overall Target Quantity × Unit Price"
                }
              />
            </div>
          </FormSection>

          {/* ---------------- QUARTER / MONTH DISTRIBUTION ---------------- */}
          <FormSection
            title="Quarter & Month Distribution"
            description="The overall target is distributed Q2 50% and Q3 50% (Q1 and Q4 are 0%) and then evenly across the three months of each quarter."
          >
            <div className="flex flex-wrap gap-2 text-xs mb-4">
              {SERVICE_QUARTER_PERCENT_LABELS.map((label) => (
                <span
                  key={label.quarter}
                  className="px-2 py-1 rounded bg-blue-100 text-blue-800"
                >
                  {label.quarter}: {label.percent}%
                </span>
              ))}
            </div>

            {isRenting && formik.values.totalRentalMonths ? (
              <DistributionTable
                distribution={{
                  quarters: formik.values.achievement || {},
                  quarterlyRatios: SERVICE_TARGET_DISTRIBUTION.quarterly,
                  monthlyRatios: SERVICE_TARGET_DISTRIBUTION.monthly,
                }}
                onAchievementChange={handleAchievementChange}
              />
            ) : null}

            {isSpraying && formik.values.overallTargetQuantity ? (
              <DistributionTable
                distribution={{
                  quarters: formik.values.achievement || {},
                  quarterlyRatios: SERVICE_TARGET_DISTRIBUTION.quarterly,
                  monthlyRatios: SERVICE_TARGET_DISTRIBUTION.monthly,
                }}
                onAchievementChange={handleAchievementChange}
              />
            ) : null}

            {!isRenting && !isSpraying ? (
              <p className="text-sm text-gray-500 italic">
                Select a service type and enter the target details to see the
                quarter and month wise distribution.
              </p>
            ) : null}

            {isRenting && !formik.values.totalRentalMonths ? (
              <p className="text-sm text-gray-500 italic">
                Enter the total rental months to see the quarter and month wise
                distribution.
              </p>
            ) : null}

            {isSpraying && !formik.values.overallTargetQuantity ? (
              <p className="text-sm text-gray-500 italic">
                Enter the overall target quantity to see the quarter and month
                wise distribution.
              </p>
            ) : null}
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
                Service Target Sheet Preview
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
                  <span className="font-semibold">Service Type:</span>{" "}
                  {previewData.serviceType}
                </p>
                {previewData.serviceType === SERVICE_TYPE_RENTING ? (
                  <>
                    <p>
                      <span className="font-semibold">Monthly Rent:</span> ₹{" "}
                      {formatCurrency(previewData.monthlyRent)}
                    </p>
                    <p>
                      <span className="font-semibold">Total Rental Months:</span>{" "}
                      {previewData.totalRentalMonths}
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      <span className="font-semibold">
                        Overall Target Quantity:
                      </span>{" "}
                      {previewData.overallTargetQuantity}
                    </p>
                    <p>
                      <span className="font-semibold">Unit Price:</span> ₹{" "}
                      {formatCurrency(previewData.unitPrice)}
                    </p>
                  </>
                )}
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

export default EnviroServiceTargetSheetForm;
