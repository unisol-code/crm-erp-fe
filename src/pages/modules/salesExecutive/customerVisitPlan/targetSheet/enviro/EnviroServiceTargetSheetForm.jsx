import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";

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
  getProductPrice,
  getProductId,
} from "./components/EnviroFormUI";

/* =========================================================
   ENVIRO SOLUTION — SERVICE BASED TARGET SHEET
   ------------------------------------------------------------
   Multi-service rows. Each service carries:
     serviceName, servicePrice, months, acres
   Total Price = servicePrice × months × acres

   The total is distributed evenly across the four quarters
   (25% each) and then evenly across the three months of every
   quarter.
   ========================================================= */

const SERVICE_TYPES = [
  { label: "Renting", value: "Renting" },
  { label: "Spraying", value: "Spraying" },
];

let __serviceRowCounter = 0;

const createEmptyServiceRow = () => {
  __serviceRowCounter += 1;
  return {
    _tempId: `enviro-service-${Date.now()}-${__serviceRowCounter}`,
    serviceName: "",
    productType: "",
    productName: "",
    servicePrice: "",
    months: "",
    acres: "",
    totalPrice: 0,
    achievement: {},
  };
};

const validationSchema = Yup.object({
  organization: Yup.string().required("Organization is required"),
  city: Yup.string().required("City is required"),
  individualName: Yup.string().required("Individual name is required"),
  year: Yup.string().required("Year is required"),
  services: Yup.array()
    .of(
      Yup.object({
        serviceName: Yup.string().required("Service name is required"),
        productType: Yup.string().required("Product type is required"),
        productName: Yup.string().required("Product name is required"),
        servicePrice: Yup.number()
          .typeError("Service price must be a number")
          .min(0, "Service price cannot be negative")
          .required("Service price is required"),
        months: Yup.number()
          .typeError("Months must be a number")
          .min(0, "Months cannot be negative")
          .required("Months is required"),
        acres: Yup.number()
          .typeError("Acres must be a number")
          .min(0, "Acres cannot be negative")
          .when("serviceName", {
            is: "Renting",
            then: (schema) => schema.nullable(),
            otherwise: (schema) => schema.required("Acres is required"),
          }),
      })
    )
    .min(1, "At least one service is required")
    .required("At least one service is required"),
});

const SERVICE_TARGET_DISTRIBUTION = {
  quarterly: [0.25, 0.25, 0.25, 0.25],
  monthly: [1 / 3, 1 / 3, 1 / 3],
};

const EnviroServiceTargetSheetForm = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { isEnviroSolution, isCompanyLoaded } = useEnviroOnly();

  const [previewData, setPreviewData] = useState(null);

  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(null);

  const { createEnviroTargetSheet, loading: submitLoading } =
    useEnviroTargetSheetExecutive();

  const formik = useFormik({
    initialValues: {
      segment: "",
      profileType: "",
      organization: "",
      uniqueCodeOrganization: "",
      district: "",
      city: "",
      individualName: "",
      individualUniqueCode: "",
      year: new Date().getFullYear().toString(),
      services: [createEmptyServiceRow()],
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const payload = {
          sheetType: "Service",
          segment: values.segment,
          uniqueCodeIndividual: values.individualUniqueCode,
          individualName: values.individualName,
          uniqueCodeOrganization: values.uniqueCodeOrganization,
          organizationName: values.organization,
          district: values.district || "",
          cityTownVillage: values.city || "",
          year: String(values.year),
          services: (values.services || []).map((row) => ({
            serviceName: row.serviceName,
            productType: row.productType,
            productName: row.productName,
            servicePrice: numberValue(row.servicePrice),
            months: numberValue(row.months),
            acres: numberValue(row.acres),
            totalPrice: numberValue(row.totalPrice),
            achievement: row.achievement,
          })),
        };

        const res = await createEnviroTargetSheet(payload);

        if (res) {
          setPreviewData(payload);
          resetForm();
        }
      } catch (error) {
        toast.error("Failed to submit service target sheet");
        console.error("EnviroServiceTargetSheetForm submission error:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const { values } = formik;

  const {
    loading: dropdownLoading,
    segmentOptions,
    profileTypeOptions,
    organizationOptions,
    individualOptions,
    productOptions,
    productTypeOptions,
    cityOptions,
    yearOptions,
    fetchProductDetails,
    productDetails,
    resetProductDetails,
  } = useEnviroTargetSheetDropdowns({
    organization: values.organization,
    city: values.city,
    segment: values.segment,
    profileType: values.profileType,
  });

  /* ---------------------------------------------------------
     RECALCULATE THE DISTRIBUTION OF A SINGLE SERVICE ROW
  --------------------------------------------------------- */
  const recalculateRow = (index, { servicePrice, months, acres }) => {
    const row = formik.values.services?.[index];
    if (!row) return;

    const unitPrice = numberValue(servicePrice);
    const m = numberValue(months);
    const a = numberValue(acres);

    /* Renting: total = rent per month × rented months (no acres)
       Spraying: total = service price × months × acres */
    const isRenting = row.serviceName === SERVICE_TYPES[0].value;
    const qty = isRenting ? m : m * a;

    const quarters = buildTargetDistribution({
      overallQuantity: qty,
      unitPrice,
      quarterlyRatios: SERVICE_TARGET_DISTRIBUTION.quarterly,
      monthlyRatios: SERVICE_TARGET_DISTRIBUTION.monthly,
    });

    Object.keys(MONTHS).forEach((quarter) => {
      const oldQuarter = row.achievement?.[quarter];
      if (!oldQuarter) return;

      MONTHS[quarter].forEach((month) => {
        const oldMonth = oldQuarter[month];
        if (!oldMonth) return;

        const entered = oldMonth.targetAchievementQuantity;
        if (entered === undefined || entered === null || entered === "") return;

        quarters[quarter][month].targetAchievementQuantity =
          numberValue(entered) || 0;
      });
    });

    let overallAchievementQuantity = 0;
    let overallAchievementPrice = 0;

    Object.keys(MONTHS).forEach((quarter) => {
      const quarterData = quarters[quarter];
      let quarterAchievementQuantity = 0;
      let quarterAchievementPrice = 0;

      MONTHS[quarter].forEach((month) => {
        const monthData = quarterData[month];

        monthData.targetAchievementPrice = roundTo(
          numberValue(monthData.targetAchievementQuantity) * unitPrice,
          2
        );

        quarterAchievementQuantity += numberValue(
          monthData.targetAchievementQuantity
        );
        quarterAchievementPrice += numberValue(monthData.targetAchievementPrice);
      });

      quarterData.QuarterAchievementQuantity = roundTo(
        quarterAchievementQuantity,
        0
      );
      quarterData.QuarterAchievementPrice = roundTo(quarterAchievementPrice, 2);

      overallAchievementQuantity += quarterAchievementQuantity;
      overallAchievementPrice += quarterAchievementPrice;
    });

    row.achievement = {
      ...quarters,
      overall: {
        totalQuantity: overallAchievementQuantity,
        totalPrice: overallAchievementPrice,
      },
    };
    row.totalPrice = roundTo(qty * unitPrice, 2);

    formik.setFieldValue(`services[${index}].achievement`, row.achievement, false);
    formik.setFieldValue(
      `services[${index}].totalPrice`,
      roundTo(qty * unitPrice, 2),
      false
    );
  };

  /* ---------------------------------------------------------
     HANDLERS
  --------------------------------------------------------- */
  const handleSegmentChange = (option) => {
    formik.setFieldValue("segment", option?.value || "");
    formik.setFieldValue("profileType", "");
    formik.setFieldValue("organization", "");
    formik.setFieldValue("uniqueCodeOrganization", "");
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
    formik.setFieldValue("uniqueCodeOrganization", option?.uniqueCode || "");
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

  const handleServiceNameChange = (index, value) => {
    formik.setFieldValue(`services[${index}].serviceName`, value, false);
    formik.setFieldValue(`services[${index}].servicePrice`, "", false);
    formik.setFieldValue(`services[${index}].months`, "", false);
    formik.setFieldValue(`services[${index}].acres`, "", false);
    formik.setFieldValue(`services[${index}].totalPrice`, 0, false);
    formik.setFieldValue(`services[${index}].achievement`, {}, false);
  };

  const handleServicePriceChange = (index, value) => {
    formik.setFieldValue(`services[${index}].servicePrice`, value, false);
    const row = formik.values.services?.[index];
    recalculateRow(index, {
      servicePrice: value,
      months: row?.months,
      acres: row?.acres,
    });
  };

  const handleMonthsChange = (index, value) => {
    formik.setFieldValue(`services[${index}].months`, value, false);
    const row = formik.values.services?.[index];
    recalculateRow(index, {
      servicePrice: row?.servicePrice,
      months: value,
      acres: row?.acres,
    });
  };

  const handleAcresChange = (index, value) => {
    formik.setFieldValue(`services[${index}].acres`, value, false);
    const row = formik.values.services?.[index];
    recalculateRow(index, {
      servicePrice: row?.servicePrice,
      months: row?.months,
      acres: value,
    });
  };

  const handleAchievementChange = (index, quarter, month, field, value) => {
    const row = formik.values.services?.[index];
    if (!row) return;

    const achievements = JSON.parse(JSON.stringify(row.achievement || {}));
    const quarterData = achievements[quarter] || {};
    const monthData = quarterData[month] || {};

    monthData[field] = value;
    monthData.targetAchievementPrice = roundTo(
      numberValue(value) * numberValue(row.servicePrice),
      2
    );

    quarterData[month] = monthData;

    let quarterAchievementQuantity = 0;
    let quarterAchievementPrice = 0;

    MONTHS[quarter].forEach((monthName) => {
      const data = quarterData[monthName] || {};
      quarterAchievementQuantity += numberValue(data.targetAchievementQuantity);
      quarterAchievementPrice += numberValue(data.targetAchievementPrice);
    });

    quarterData.QuarterAchievementQuantity = roundTo(
      quarterAchievementQuantity,
      0
    );
    quarterData.QuarterAchievementPrice = roundTo(quarterAchievementPrice, 2);

    achievements[quarter] = quarterData;

    formik.setFieldValue(`services[${index}].achievement`, achievements, false);
  };

  const addServiceRow = (clickedIndex) => {
    const services = [...(formik.values.services || [])];
    services.splice(clickedIndex + 1, 0, createEmptyServiceRow());
    formik.setFieldValue("services", services);
  };

  const removeServiceRow = (index) => {
    if ((formik.values.services || []).length <= 1) return;
    const services = formik.values.services.filter((_, i) => i !== index);
    formik.setFieldValue("services", services);
  };

  const handleReset = () => {
    formik.resetForm();
    setPreviewData(null);
    setSelectedServiceId(null);
    setSelectedServiceIndex(null);
  };

  /* ---------------------------------------------------------
     FETCH PRODUCT DETAILS (price) — depends on selected service
  --------------------------------------------------------- */
  useEffect(() => {
    if (selectedServiceId === null || selectedServiceIndex === null) return;
    fetchProductDetails(selectedServiceId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedServiceId, selectedServiceIndex]);

  useEffect(() => {
    if (selectedServiceIndex === null || !productDetails) return;

    const price = getProductPrice(productDetails);
    if (price === "" || price === null || price === undefined) return;

    const index = selectedServiceIndex;
    const service = formik.values.services?.[index];
    if (!service) return;

    const numericPrice = numberValue(price);
    const months = numberValue(service.months);
    const acres = numberValue(service.acres);

    formik.setFieldValue(`services[${index}].servicePrice`, numericPrice, false);
    recalculateRow(index, { servicePrice: numericPrice, months, acres });

    setSelectedServiceId(null);
    setSelectedServiceIndex(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productDetails]);

  /* ---------------------------------------------------------
     SUMMARY TOTALS
  --------------------------------------------------------- */
  const summary = (formik.values.services || []).reduce(
    (acc, row) => ({
      totalServices: acc.totalServices + 1,
      totalPrice: acc.totalPrice + numberValue(row.totalPrice),
    }),
    { totalServices: 0, totalPrice: 0 }
  );

  /* Wait until the company name has been read from sessionStorage */
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
            description="Select the section, profile type, organization, individual and year for this target sheet."
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
                error={
                  formik.touched.organization && formik.errors.organization
                }
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
                  value={formik.values.uniqueCodeOrganization || "-"}
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

          {/* ---------------- SERVICE DETAILS ---------------- */}
          <FormSection
            title="Service Details"
            description="Add one row per service. The service price, months and acres build the total target, which is distributed across the quarters and months."
          >
            {formik.values.services.map((row, index) => (
              <div
                key={row._tempId}
                className="border rounded-xl p-4 mb-4 bg-gray-50"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  <FormField
                    label="Service Name"
                    required
                    error={
                      formik.touched.services?.[index]?.serviceName &&
                      formik.errors.services?.[index]?.serviceName
                    }
                  >
                    <Select
                      options={SERVICE_TYPES}
                      value={
                        SERVICE_TYPES.find(
                          (option) => option.value === row.serviceName
                        ) || null
                      }
                      onChange={(option) => {
                        handleServiceNameChange(index, option?.value || "");
                        formik.setFieldTouched(
                          `services[${index}].serviceName`,
                          true
                        );
                      }}
                      onBlur={() =>
                        formik.setFieldTouched(
                          `services[${index}].serviceName`,
                          true
                        )
                      }
                      placeholder="Select service"
                      styles={selectStyles}
                    />
                  </FormField>

                  <FormField
                    label="Product Type"
                    required
                    error={
                      formik.touched.services?.[index]?.productType &&
                      formik.errors.services?.[index]?.productType
                    }
                  >
                    <Select
                      isLoading={dropdownLoading}
                      options={productTypeOptions}
                      value={
                        productTypeOptions.find(
                          (option) => option.value === row.productType
                        ) || null
                      }
                      onChange={(option) => {
                        formik.setFieldValue(
                          `services[${index}].productType`,
                          option?.value || ""
                        );
                        formik.setFieldValue(
                          `services[${index}].productName`,
                          ""
                        );
                        formik.setFieldTouched(
                          `services[${index}].productType`,
                          true
                        );
                      }}
                      isSearchable
                      isClearable
                      placeholder="Select product type"
                      styles={selectStyles}
                    />
                  </FormField>

                  <FormField
                    label="Product Name"
                    required
                    error={
                      formik.touched.services?.[index]?.productName &&
                      formik.errors.services?.[index]?.productName
                    }
                  >
                    <Select
                      isLoading={dropdownLoading}
                      options={productOptions}
                      value={
                        productOptions.find(
                          (option) => option.value === row.productName
                        ) || null
                      }
                      onChange={(option) => {
                        const name = option?.value || "";
                        const selectedProduct = option?.product;

                        formik.setFieldValue(
                          `services[${index}].productName`,
                          name
                        );

                        const directPrice = getProductPrice(selectedProduct);

                        if (
                          directPrice !== "" &&
                          directPrice !== null &&
                          directPrice !== undefined
                        ) {
                          const numericPrice = numberValue(directPrice);
                          const months = numberValue(
                            formik.values.services?.[index]?.months
                          );
                          const acres = numberValue(
                            formik.values.services?.[index]?.acres
                          );

                          formik.setFieldValue(
                            `services[${index}].servicePrice`,
                            numericPrice,
                            false
                          );
                          recalculateRow(index, {
                            servicePrice: numericPrice,
                            months,
                            acres,
                          });

                          setSelectedServiceId(null);
                          setSelectedServiceIndex(null);
                          return;
                        }

                        const productId = getProductId(selectedProduct);
                        if (productId) {
                          resetProductDetails();
                          setSelectedServiceIndex(index);
                          setSelectedServiceId(productId);
                        } else {
                          formik.setFieldValue(
                            `services[${index}].servicePrice`,
                            "",
                            false
                          );
                        }
                        formik.setFieldTouched(
                          `services[${index}].productName`,
                          true
                        );
                      }}
                      isSearchable
                      isClearable
                      placeholder="Select product"
                      styles={selectStyles}
                    />
                  </FormField>

                  {row.serviceName === "Renting" ? (
                    <FormField
                      label="Rent Per Month (₹)"
                      required
                      error={
                        formik.touched.services?.[index]?.servicePrice &&
                        formik.errors.services?.[index]?.servicePrice
                      }
                    >
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={row.servicePrice ?? ""}
                        onChange={(event) =>
                          handleServicePriceChange(index, event.target.value)
                        }
                        onBlur={() =>
                          formik.setFieldTouched(
                            `services[${index}].servicePrice`,
                            true
                          )
                        }
                        onWheel={(event) => event.target.blur()}
                        className={inputBaseClass}
                        placeholder="Enter rent per month"
                      />
                    </FormField>
                  ) : (
                    <FormField
                      label="Service Price (₹)"
                      required
                      error={
                        formik.touched.services?.[index]?.servicePrice &&
                        formik.errors.services?.[index]?.servicePrice
                      }
                    >
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={row.servicePrice ?? ""}
                        onChange={(event) =>
                          handleServicePriceChange(index, event.target.value)
                        }
                        onBlur={() =>
                          formik.setFieldTouched(
                            `services[${index}].servicePrice`,
                            true
                          )
                        }
                        onWheel={(event) => event.target.blur()}
                        className={inputBaseClass}
                        placeholder="Enter service price"
                      />
                    </FormField>
                  )}

                  {row.serviceName === "Renting" ? (
                    <FormField
                      label="Rented Months"
                      required
                      error={
                        formik.touched.services?.[index]?.months &&
                        formik.errors.services?.[index]?.months
                      }
                    >
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={row.months ?? ""}
                        onChange={(event) =>
                          handleMonthsChange(index, event.target.value)
                        }
                        onBlur={() =>
                          formik.setFieldTouched(
                            `services[${index}].months`,
                            true
                          )
                        }
                        onWheel={(event) => event.target.blur()}
                        className={inputBaseClass}
                        placeholder="Enter rented months"
                      />
                    </FormField>
                  ) : (
                    <FormField
                      label="Months"
                      required
                      error={
                        formik.touched.services?.[index]?.months &&
                        formik.errors.services?.[index]?.months
                      }
                    >
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={row.months ?? ""}
                        onChange={(event) =>
                          handleMonthsChange(index, event.target.value)
                        }
                        onBlur={() =>
                          formik.setFieldTouched(
                            `services[${index}].months`,
                            true
                          )
                        }
                        onWheel={(event) => event.target.blur()}
                        className={inputBaseClass}
                        placeholder="Enter months"
                      />
                    </FormField>
                  )}

                  {row.serviceName !== "Renting" ? (
                    <FormField
                      label="Acres (Land In Acres)"
                      required
                      error={
                        formik.touched.services?.[index]?.acres &&
                        formik.errors.services?.[index]?.acres
                      }
                    >
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={row.acres ?? ""}
                        onChange={(event) =>
                          handleAcresChange(index, event.target.value)
                        }
                        onBlur={() =>
                          formik.setFieldTouched(
                            `services[${index}].acres`,
                            true
                          )
                        }
                        onWheel={(event) => event.target.blur()}
                        className={inputBaseClass}
                        placeholder="Enter acres"
                      />
                    </FormField>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <ReadOnlyField
                    label="Total Price"
                    value={`₹ ${formatCurrency(row.totalPrice)}`}
                    hint={
                      row.serviceName === "Renting"
                        ? "Rent Per Month × Rented Months"
                        : "Service Price × Months × Acres"
                    }
                  />
                  <ReadOnlyField
                    label="Quantity"
                    value={
                      row.serviceName === "Renting"
                        ? numberValue(row.months)
                        : numberValue(row.months) * numberValue(row.acres)
                    }
                  />
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <Button
                    type="button"
                    text="Add Row"
                    onClick={() => addServiceRow(index)}
                  />
                  <Button
                    type="button"
                    text="Remove Row"
                    onClick={() => removeServiceRow(index)}
                    variant={2}
                  />
                </div>

                {/* ---------- QUARTER / MONTH DISTRIBUTION ---------- */}
                {row.serviceName === "Renting"
                  ? numberValue(row.months) > 0
                  : numberValue(row.months) * numberValue(row.acres) > 0 ? (
                  <div className="mt-5">
                    <DistributionTable
                      distribution={{
                        quarters: row.achievement || {},
                        quarterlyRatios: SERVICE_TARGET_DISTRIBUTION.quarterly,
                        monthlyRatios: SERVICE_TARGET_DISTRIBUTION.monthly,
                      }}
                      onAchievementChange={(quarter, month, field, value) =>
                        handleAchievementChange(
                          index,
                          quarter,
                          month,
                          field,
                          value
                        )
                      }
                    />
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic mt-4">
                    Enter the months and acres to see the quarter and month wise
                    distribution.
                  </p>
                )}
              </div>
            ))}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <ReadOnlyField
                label="Total Services"
                value={summary.totalServices}
              />
              <ReadOnlyField
                label="Total Overall Target Price"
                value={`₹ ${formatCurrency(summary.totalPrice)}`}
              />
            </div>
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
                  {previewData.organizationName}
                </p>
                <p>
                  <span className="font-semibold">City:</span>{" "}
                  {previewData.cityTownVillage}
                </p>
                <p>
                  <span className="font-semibold">Individual:</span>{" "}
                  {previewData.individualName}
                </p>
                <p>
                  <span className="font-semibold">Year:</span> {previewData.year}
                </p>
              </div>

              <div className="space-y-3">
                {previewData.services.map((row, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-3 text-sm space-y-1"
                  >
                    <p className="font-semibold">{row.serviceName}</p>
                    <p>
                      Service Price: ₹ {formatCurrency(row.servicePrice)} |
                      Months: {row.months} | Acres: {row.acres} | Total: ₹{" "}
                      {formatCurrency(row.totalPrice)}
                    </p>
                  </div>
                ))}
              </div>
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
