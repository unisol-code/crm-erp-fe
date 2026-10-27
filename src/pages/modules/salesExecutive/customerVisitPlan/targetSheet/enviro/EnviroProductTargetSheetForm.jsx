import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate , useSearchParams,useParams} from "react-router-dom";
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
   ENVIRO SOLUTION — PRODUCT BASED TARGET SHEET
   ------------------------------------------------------------
   Every product row carries its own price / quantity and gets
   its own quarter + month wise target distribution.

   Dropdowns are backed by the live APIs:
     Section / Profile Type / Organization / Individual /
     Product / Product Type / City / Year
   ========================================================= */

let __productRowCounter = 0;

const createEmptyProductRow = () => {
  __productRowCounter += 1;
  return {
    _tempId: `enviro-product-${Date.now()}-${__productRowCounter}`,
    productType: "",
    name: "",
    price: "",
    enteredQuantity: "",
    overAllTargetPrice: 0,
    achievement: {},
  };
};

/**
 * Normalise the achievement block returned by the backend so it
 * matches the shape the form expects (months carry
 * targetAchievementQuantity + targetAchievementPrice, quarters
 * carry QuarterTargetQuantity / QuarterTargetPrice).
 */
const normalizeAchievementFromBackend = (achievement) => {
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

const validationSchema = Yup.object({
  organization: Yup.string().required("Organization is required"),
  city: Yup.string().required("City is required"),
  individualName: Yup.string().required("Individual name is required"),
  year: Yup.string().required("Year is required"),
  products: Yup.array()
    .of(
      Yup.object({
        productType: Yup.string().required("Product type is required"),
        name: Yup.string().required("Product is required"),
        price: Yup.number()
          .typeError("Price must be a number")
          .min(0, "Price cannot be negative")
          .required("Price is required"),
        enteredQuantity: Yup.number()
          .typeError("Quantity must be a number")
          .min(0, "Quantity cannot be negative")
          .required("Quantity is required"),
      })
    )
    .min(1, "At least one product is required")
    .required("At least one product is required"),
});

/* ------------------------------------------------------------
   PRODUCT-BASED TARGET SHEET — DISTRIBUTION RULES
     Quarter 1 (Jan–Mar) : 25%
     Quarter 2 (Apr–Jun) : 25%
     Quarter 3 (Jul–Sep) : 25%
     Quarter 4 (Oct–Dec) : 25%
   Every month inside a quarter receives an equal share (1/3).
------------------------------------------------------------ */
const PRODUCT_TARGET_DISTRIBUTION = {
  quarterly: [0, 0.24, 0.36, 0.4],
  monthly: [1 / 3, 1 / 3, 1 / 3],
};

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


const EnviroProductTargetSheetForm = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { isEnviroSolution, isCompanyLoaded } = useEnviroOnly();
const [searchParams] = useSearchParams();
const id = searchParams.get("id");
const mode = searchParams.get("mode");

console.log("Target Sheet ID:", id);
  const [previewData, setPreviewData] = useState(null);

  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProductIndex, setSelectedProductIndex] = useState(null);

  const { createEnviroTargetSheet, loading: submitLoading ,fetchEnviroProductWiseTargetSheetById, loading: fetchLoading,productWiseTargetSheetDetails, updateEnviroTargetSheet} =
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
      products: [createEmptyProductRow()],
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const payload = {
          sheetType: "Product",
          segment: values.segment,
          organizationName: values.organization,
          uniqueCodeOrganization: values.uniqueCodeOrganization,
          uniqueCodeIndividual: values.individualUniqueCode,
          individualName: values.individualName,
          district: values.district || "",
          cityTownVillage: values.city || "",
          financialYear: String(values.year),
          products: (values.products || []).map((row) => ({
            productType: row.productType,
            name: row.name,
            price: numberValue(row.price),
            enteredQuantity: numberValue(row.enteredQuantity),
            overAllTargetPrice: numberValue(row.overAllTargetPrice),
            achievement: buildAchievementPayload(row.achievement),
          })),
        };

        if (isReadOnly && id && mode === "edit") {
          // should not happen
        }

        let res;
        if (mode === "edit" && id) {
          res = await updateEnviroTargetSheet(id, payload);
        } else {
          res = await createEnviroTargetSheet(payload);
        }

        if (res) {
          if (!(mode === "edit" && id)) {
            setPreviewData(payload);
            resetForm();
          } else {
            navigate("/sales-executive/enviro-target-sheet");
          }
        }
      } catch (error) {
        toast.error(mode === "edit" ? "Failed to update product target sheet" : "Failed to submit product target sheet");
        console.error("EnviroProductTargetSheetForm submission error:", error);
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

  useEffect(() => {
    if (id) {
      fetchEnviroProductWiseTargetSheetById(id);
    }
  }, [id]);

  /* Populate the form when an existing sheet is loaded for editing. */
  useEffect(() => {
    const data = productWiseTargetSheetDetails;
    if (!data || typeof data !== "object") return;

    const products = (data.products || []).map((p) => ({
      productType: p?.productType || "",
      name: p?.name || "",
      price: p?.price ?? "",
      enteredQuantity: p?.enteredQuantity ?? "",
      overAllTargetPrice: numberValue(p?.overAllTargetPrice),
      achievement: normalizeAchievementFromBackend(p?.achievement),
    }));

    formik.setValues({
      segment: data.segment || "",
      profileType: "",
      organization: data.organizationName || "",
      uniqueCodeOrganization: data.uniqueCodeOrganization || "",
      district: data.district || "",
      city: data.cityTownVillage || "",
      individualName: data.individualName || "",
      individualUniqueCode: data.uniqueCodeIndividual || "",
      year: data.financialYear || new Date().getFullYear().toString(),
      products: products.length > 0 ? products : [createEmptyProductRow()],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productWiseTargetSheetDetails]);

  /* ---------------------------------------------------------
     RECALCULATE THE DISTRIBUTION OF A SINGLE PRODUCT ROW
  --------------------------------------------------------- */
  const recalculateRow = (index, { price, quantity }) => {
    const row = formik.values.products?.[index];
    if (!row) return;

    const unitPrice = numberValue(price);
    const qty = numberValue(quantity);

    const quarters = buildTargetDistribution({
      overallQuantity: qty,
      unitPrice,
      quarterlyRatios: PRODUCT_TARGET_DISTRIBUTION.quarterly,
      monthlyRatios: PRODUCT_TARGET_DISTRIBUTION.monthly,
    });

    /* Keep the achievements that were already entered for this row so a
       price / quantity change does not wipe the user's progress. */
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

    /* Recompute the achievement price + the quarter / overall totals. */
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

    const achievement = {
      ...quarters,
      overall: {
        totalQuantity: overallAchievementQuantity,
        totalPrice: overallAchievementPrice,
      },
    };

    row.achievement = achievement;
    row.overAllTargetPrice = roundTo(qty * unitPrice, 2);

    formik.setFieldValue(`products[${index}].achievement`, achievement, false);
    formik.setFieldValue(
      `products[${index}].overAllTargetPrice`,
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

  const handleProductTypeChange = (index, option) => {
    formik.setFieldValue(`products[${index}].productType`, option?.value || "");
    formik.setFieldValue(`products[${index}].name`, "");
    formik.setFieldValue(`products[${index}].price`, "");
    formik.setFieldValue(`products[${index}].enteredQuantity`, "");
    formik.setFieldValue(`products[${index}].overAllTargetPrice`, 0);
    formik.setFieldValue(`products[${index}].achievement`, {}, false);

    if (selectedProductIndex === index) {
      setSelectedProductId(null);
      setSelectedProductIndex(null);
      resetProductDetails();
    }
  };

  const handleProductNameChange = (index, option) => {
    const name = option?.value || "";
    const selectedProduct = option?.product;

    formik.setFieldValue(`products[${index}].name`, name);

    const directPrice = getProductPrice(selectedProduct);

    if (
      directPrice !== "" &&
      directPrice !== null &&
      directPrice !== undefined
    ) {
      const numericPrice = numberValue(directPrice);
      const quantity = numberValue(
        formik.values.products?.[index]?.enteredQuantity
      );

      formik.setFieldValue(`products[${index}].price`, numericPrice, false);
      recalculateRow(index, { price: numericPrice, quantity });

      setSelectedProductId(null);
      setSelectedProductIndex(null);
      return;
    }

    const productId = getProductId(selectedProduct);
    if (productId) {
      resetProductDetails();
      setSelectedProductIndex(index);
      setSelectedProductId(productId);
    } else {
      formik.setFieldValue(`products[${index}].price`, "");
      formik.setFieldValue(`products[${index}].overAllTargetPrice`, 0);
    }
  };

  const handlePriceChange = (index, value) => {
    formik.setFieldValue(`products[${index}].price`, value, false);
    const quantity = numberValue(
      formik.values.products?.[index]?.enteredQuantity
    );
    recalculateRow(index, { price: value, quantity });
  };

  const handleQuantityChange = (index, value) => {
    formik.setFieldValue(`products[${index}].enteredQuantity`, value, false);
    const price = numberValue(formik.values.products?.[index]?.price);
    recalculateRow(index, { price, quantity: value });
  };

const handleAchievementChange = (index, quarter, month, field, value) => {
  if (isReadOnly) return;
  const row = formik.values.products?.[index];
  if (!row) return;

    const achievements = JSON.parse(JSON.stringify(row.achievement || {}));
    const quarterData = achievements[quarter] || {};
    const monthData = quarterData[month] || {};

    monthData[field] = value;
    monthData.targetAchievementPrice = roundTo(
      numberValue(value) * numberValue(row.price),
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

    formik.setFieldValue(`products[${index}].achievement`, achievements, false);
  };

  const addProductRow = (clickedIndex) => {
    const products = [...(formik.values.products || [])];
    products.splice(clickedIndex + 1, 0, createEmptyProductRow());
    formik.setFieldValue("products", products);
  };

  const removeProductRow = (index) => {
    if ((formik.values.products || []).length <= 1) return;
    const products = formik.values.products.filter((_, i) => i !== index);
    formik.setFieldValue("products", products);
  };

  const handleReset = () => {
    formik.resetForm();
    setPreviewData(null);
    setSelectedProductId(null);
    setSelectedProductIndex(null);
    resetProductDetails();
  };

  /* ---------------------------------------------------------
     FETCH PRODUCT DETAILS (price) — depends on selected product
  --------------------------------------------------------- */
  useEffect(() => {
    if (selectedProductId === null || selectedProductIndex === null) return;
    fetchProductDetails(selectedProductId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProductId, selectedProductIndex]);

  /* ---------------------------------------------------------
     APPLY PRODUCT PRICE + RECALC TARGETS
  --------------------------------------------------------- */
  useEffect(() => {
    if (selectedProductIndex === null || !productDetails) return;

    const price = getProductPrice(productDetails);
    if (price === "" || price === null || price === undefined) return;

    const index = selectedProductIndex;
    const product = formik.values.products?.[index];
    if (!product) return;

    const numericPrice = numberValue(price);
    const quantity = numberValue(product.enteredQuantity);

    formik.setFieldValue(`products[${index}].price`, numericPrice, false);
    formik.setFieldValue(
      `products[${index}].overAllTargetPrice`,
      roundTo(numericPrice * quantity, 2),
      false
    );

    recalculateRow(index, { price: numericPrice, quantity });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productDetails]);

  /* ---------------------------------------------------------
     SUMMARY TOTALS
  --------------------------------------------------------- */
  const summary = (formik.values.products || []).reduce(
    (acc, row) => ({
      overallQuantity: acc.overallQuantity + numberValue(row.enteredQuantity),
      overallPrice: acc.overallPrice + numberValue(row.overAllTargetPrice),
    }),
    { overallQuantity: 0, overallPrice: 0 }
  );

  /* Wait until the company name has been read from sessionStorage,
     otherwise a valid Enviro user briefly sees "Access Restricted". */
  const isReadOnly = Boolean(id) && mode !== "edit";

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
          { text: "Product Based Target Sheet" },
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
            EnviroSolution — Product Based Target Sheet
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
                    if (isReadOnly) return;
                    handleSegmentChange(option);
                    formik.setFieldTouched("segment", true);
                  }}
                  onBlur={() => formik.setFieldTouched("segment", true)}
                  isSearchable={!isReadOnly}
                  isClearable={!isReadOnly}
                  isDisabled={isReadOnly}
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
                    if (isReadOnly) return;
                    handleProfileTypeChange(option);
                    formik.setFieldTouched("profileType", true);
                  }}
                  onBlur={() => formik.setFieldTouched("profileType", true)}
                  isSearchable={!isReadOnly}
                  isClearable={!isReadOnly}
                  isDisabled={isReadOnly}
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
                      if (isReadOnly) return;
                      handleOrganizationChange(option);
                      formik.setFieldTouched("organization", true);
                    }}
                    onBlur={() => formik.setFieldTouched("organization", true)}
                    isSearchable={!isReadOnly}
                    isClearable={!isReadOnly}
                    isDisabled={isReadOnly}
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
                    if (isReadOnly) return;
                    formik.setFieldValue("city", option?.value || "");
                    formik.setFieldTouched("city", true);
                  }}
                  onBlur={() => formik.setFieldTouched("city", true)}
                  isSearchable={!isReadOnly}
                  isClearable={!isReadOnly}
                  isDisabled={isReadOnly}
                  placeholder="Select city"
                  styles={selectStyles}
                />
              </FormField>

                <FormField
                  label="Individual Name"
                  required
                  error={
                    formik.touched.individualName &&
                    formik.errors.individualName
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
                      if (isReadOnly) return;
                      handleIndividualChange(option);
                      formik.setFieldTouched("individualName", true);
                    }}
                    onBlur={() =>
                      formik.setFieldTouched("individualName", true)
                    }
                    isSearchable={!isReadOnly}
                    isClearable={!isReadOnly}
                    isDisabled={isReadOnly}
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
                    if (isReadOnly) return;
                    formik.setFieldValue("year", option?.value || "");
                    formik.setFieldTouched("year", true);
                  }}
                  onBlur={() => formik.setFieldTouched("year", true)}
                  isSearchable={!isReadOnly}
                  isDisabled={isReadOnly}
                  placeholder="Select year"
                  styles={selectStyles}
                />
              </FormField>
            </div>
          </FormSection>

          {/* ---------------- PRODUCT DETAILS ---------------- */}
          <FormSection
            title="Product Details"
            description="Add one row per product. The price and quantity build the overall target, which is distributed across the quarters and months."
          >
            {formik.values.products.map((row, index) => (
              <div
                key={row._tempId}
                className="border rounded-xl p-4 mb-4 bg-gray-50"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  <FormField
                    label="Product Type"
                    required
                    error={
                      formik.touched.products?.[index]?.productType &&
                      formik.errors.products?.[index]?.productType
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
                        if (isReadOnly) return;
                        handleProductTypeChange(index, option);
                        formik.setFieldTouched(
                          `products[${index}].productType`,
                          true
                        );
                      }}
                      isSearchable={!isReadOnly}
                      isClearable={!isReadOnly}
                      isDisabled={isReadOnly}
                      placeholder="Select product type"
                      styles={selectStyles}
                    />
                  </FormField>

                  <FormField
                    label="Product"
                    required
                    error={
                      formik.touched.products?.[index]?.name &&
                      formik.errors.products?.[index]?.name
                    }
                  >
                    <Select
                      isLoading={dropdownLoading}
                      options={productOptions}
                      value={
                        productOptions.find(
                          (option) => option.value === row.name
                        ) || null
                      }
                      onChange={(option) => {
                        if (isReadOnly) return;
                        handleProductNameChange(index, option);
                        formik.setFieldTouched(
                          `products[${index}].name`,
                          true
                        );
                      }}
                      isSearchable={!isReadOnly}
                      isClearable={!isReadOnly}
                      isDisabled={isReadOnly}
                      placeholder="Select product"
                      styles={selectStyles}
                    />
                  </FormField>

                  <FormField
                    label="Price (₹)"
                    required
                    error={
                      formik.touched.products?.[index]?.price &&
                      formik.errors.products?.[index]?.price
                    }
                  >
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={row.price ?? ""}
                      onChange={(event) =>
                        isReadOnly ? null : handlePriceChange(index, event.target.value)
                      }
                      onBlur={() =>
                        formik.setFieldTouched(
                          `products[${index}].price`,
                          true
                        )
                      }
                      onWheel={(event) => event.target.blur()}
                      className={`${inputBaseClass} ${isReadOnly ? 'bg-gray-100 text-gray-600 cursor-not-allowed' : ''}`}
                      placeholder="Enter price"
                      readOnly={isReadOnly}
                    />
                  </FormField>

                  <FormField
                    label="Quantity"
                    required
                    error={
                      formik.touched.products?.[index]?.enteredQuantity &&
                      formik.errors.products?.[index]?.enteredQuantity
                    }
                  >
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={row.enteredQuantity ?? ""}
                      onChange={(event) =>
                        isReadOnly ? null : handleQuantityChange(index, event.target.value)
                      }
                      onBlur={() =>
                        formik.setFieldTouched(
                          `products[${index}].enteredQuantity`,
                          true
                        )
                      }
                      onWheel={(event) => event.target.blur()}
                      className={`${inputBaseClass} ${isReadOnly ? 'bg-gray-100 text-gray-600 cursor-not-allowed' : ''}`}
                      placeholder="Enter quantity"
                      readOnly={isReadOnly}
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <ReadOnlyField
                    label="Overall Target Quantity"
                    value={numberValue(row.enteredQuantity)}
                  />
                  <ReadOnlyField
                    label="Overall Target Price"
                    value={`₹ ${formatCurrency(row.overAllTargetPrice)}`}
                    hint="Quantity × Price"
                  />
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {!isReadOnly ? (
                    <Button
                      type="button"
                      text="Add Row"
                      onClick={() => addProductRow(index)}
                    />
                  ) : null}
                  {!isReadOnly ? (
                    <Button
                      type="button"
                      text="Remove Row"
                      onClick={() => removeProductRow(index)}
                      variant={2}
                    />
                  ) : null}
                </div>

                {/* ---------- QUARTER / MONTH DISTRIBUTION ---------- */}
                {numberValue(row.enteredQuantity) > 0 ? (
                  <div className="mt-5">
                    <DistributionTable
                      distribution={{
                        quarters: row.achievement || {},
                        quarterlyRatios:
                          PRODUCT_TARGET_DISTRIBUTION.quarterly,
                        monthlyRatios: PRODUCT_TARGET_DISTRIBUTION.monthly,
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
                    Enter the quantity to see the quarter and month wise
                    distribution.
                  </p>
                )}
              </div>
            ))}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <ReadOnlyField
                label="Total Quantity (all products)"
                value={roundTo(summary.overallQuantity, 0)}
              />
              <ReadOnlyField
                label="Total Overall Target Price"
                value={`₹ ${formatCurrency(summary.overallPrice)}`}
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
          {!(mode === "edit" && id) && !isReadOnly ? (
              <Button
                type="button"
                text="Reset"
                onClick={handleReset}
                variant={2}
              />
            ) : null}
            {!isReadOnly || (mode === "edit" && id) ? (
              <Button
                type="submit"
                text={
                  formik.isSubmitting
                    ? mode === "edit" && id
                      ? "Updating..."
                      : "Submitting..."
                    : mode === "edit" && id
                    ? "Update"
                    : "Submit"
                }
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
                Product Target Sheet Preview
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
                  <span className="font-semibold">City:</span>{" "}
                  {previewData.city}
                </p>
                <p>
                  <span className="font-semibold">Individual:</span>{" "}
                  {previewData.individualName}
                </p>
                <p>
                  <span className="font-semibold">Year:</span>{" "}
                  {previewData.year}
                </p>
              </div>

              <div className="space-y-3">
                {previewData.products.map((row, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-3 text-sm space-y-1"
                  >
                    <p className="font-semibold">
                      {row.productType} — {row.name}
                    </p>
                    <p>
                      Price: ₹ {formatCurrency(row.price)} | Quantity:{" "}
                      {row.enteredQuantity} | Overall Target: ₹{" "}
                      {formatCurrency(row.overAllTargetPrice)}
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

export default EnviroProductTargetSheetForm;