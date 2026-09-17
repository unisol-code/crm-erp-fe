import React, { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb";
import Button from "../../../../../components/uiComponents/button/Button";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import useDropdown from "../../../../../hooks/dropdown/useDropdown";
import useTargetSheet from "../../../../../hooks/salesExecutiveHook/customerVisitPlan/useTaregtSheet";

/* =========================================================
   CONSTANTS
========================================================= */

const MONTHS = {
  Quarter1: ["Jan", "Feb", "Mar"],
  Quarter2: ["Apr", "May", "Jun"],
  Quarter3: ["Jul", "Aug", "Sep"],
  Quarter4: ["Oct", "Nov", "Dec"],
};

const QUARTERS = ["Quarter1", "Quarter2", "Quarter3", "Quarter4"];

/* =========================================================
   AUTO-DISTRIBUTION RULES
========================================================= */

const QUARTER_DISTRIBUTION = {
  Quarter1: 0.0,
  Quarter2: 0.24,
  Quarter3: 0.36,
  Quarter4: 0.4,
};

const MONTH_DISTRIBUTION = [0.24, 0.36, 0.4];

const QUARTER_RATIOS = [
  QUARTER_DISTRIBUTION.Quarter1,
  QUARTER_DISTRIBUTION.Quarter2,
  QUARTER_DISTRIBUTION.Quarter3,
  QUARTER_DISTRIBUTION.Quarter4,
];

const MONTH_RATIOS = MONTH_DISTRIBUTION;

/* =========================================================
   SAFE HELPERS
========================================================= */

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.data?.data)) return value.data.data;
  if (Array.isArray(value?.result)) return value.result;
  if (Array.isArray(value?.products)) return value.products;
  if (Array.isArray(value?.productTypes)) return value.productTypes;
  if (Array.isArray(value?.items)) return value.items;
  return [];
};

const getProductName = (product) => {
  if (typeof product === "string") return product;
  return (
    product?.name ||
    product?.productName ||
    product?.label ||
    product?.product ||
    ""
  );
};

const getProductId = (product) => {
  if (typeof product === "string") return null;
  return product?._id || product?.id || product?.productId || null;
};

const getProductType = (product) => {
  if (typeof product === "string") return product;
  return (
    product?.productType ||
    product?.type ||
    product?.name ||
    product?.label ||
    ""
  );
};

const getProductPrice = (product) => {
  if (!product || typeof product === "string") return "";
  return (
    product?.price ??
    product?.productPrice ??
    product?.unitPrice ??
    product?.sellingPrice ??
    ""
  );
};

const numberValue = (value) => {
  const n = Number(value);
  return Number.isNaN(n) ? 0 : n;
};

const roundTo2 = (value) => Math.round(numberValue(value) * 100) / 100;

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(numberValue(value));

/* =========================================================
   SPLIT QUANTITY — cumulative rounding
========================================================= */
const splitQuantity = (total, ratios) => {
  const t = Math.max(0, Math.round(numberValue(total)));
  const result = [];
  let prevCumulative = 0;

  ratios.forEach((ratio, idx) => {
    if (idx === ratios.length - 1) {
      result.push(t - prevCumulative);
      return;
    }

    const cumulativePct = ratios
      .slice(0, idx + 1)
      .reduce((sum, r) => sum + r, 0);

    const expectedCumulative = t * cumulativePct;
    const roundedCumulative = Math.round(expectedCumulative);

    result.push(roundedCumulative - prevCumulative);
    prevCumulative = roundedCumulative;
  });

  return result;
};

/* =========================================================
   COMPUTE QUARTER TOTALS
========================================================= */
const computeQuarterTotals = (quarterData, quarter, price) => {
  const q = { ...quarterData };

  let tQty = 0;
  let tPrice = 0;
  let aQty = 0;
  let aPrice = 0;

  MONTHS[quarter].forEach((month) => {
    const md = q[month] || {};
    const tq = numberValue(md.targetQuantity);
    const aq = numberValue(md.targetAchievementQuantity);

    tQty += tq;
    aQty += aq;
    tPrice += roundTo2(tq * numberValue(price));
    aPrice += roundTo2(aq * numberValue(price));
  });

  q.QuarterTargetQuantity = roundTo2(tQty);
  q.QuarterTargetPrice = roundTo2(tPrice);
  q.QuarterAchievementQuantity = roundTo2(aQty);
  q.QuarterAchievementPrice = roundTo2(aPrice);

  return q;
};

/* =========================================================
   FACTORIES
========================================================= */

const createEmptyMonth = () => ({
  targetQuantity: "",
  targetPrice: 0,
  targetAchievementQuantity: "",
  targetAchievementPrice: 0,
});

const createEmptyQuarter = (months) => {
  const quarter = {};
  months.forEach((month) => {
    quarter[month] = createEmptyMonth();
  });
  quarter.QuarterTargetQuantity = 0;
  quarter.QuarterTargetPrice = 0;
  quarter.QuarterAchievementQuantity = 0;
  quarter.QuarterAchievementPrice = 0;
  return quarter;
};

let __productTempCounter = 0;

const createEmptyProduct = () => {
  __productTempCounter += 1;
  return {
    _tempId: `product-${Date.now()}-${__productTempCounter}`,
    productType: "",
    name: "",
    price: "",
    enteredQuantity: "",
    overAllTargetPrice: 0,
    achievement: {
      Quarter1: createEmptyQuarter(MONTHS.Quarter1),
      Quarter2: createEmptyQuarter(MONTHS.Quarter2),
      Quarter3: createEmptyQuarter(MONTHS.Quarter3),
      Quarter4: createEmptyQuarter(MONTHS.Quarter4),
    },
  };
};

/* =========================================================
   VALIDATION
========================================================= */

const validationSchema = Yup.object({
  organization: Yup.string().required("Organization is required"),
  city: Yup.string().required("City is required"),
  year: Yup.string().required("Year is required"),

  products: Yup.array()
    .min(1, "At least one product is required")
    .test(
      "at-least-one-complete",
      "Please fill at least one product completely",
      (products) => {
        if (!Array.isArray(products)) return false;
        return products.some(
          (p) =>
            p &&
            p.productType &&
            p.name &&
            p.price !== "" &&
            p.price !== null &&
            p.enteredQuantity !== "" &&
            p.enteredQuantity !== null
        );
      }
    ),
});

/* =========================================================
   COMPONENT
========================================================= */

const TargetSheetForm = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const dropdownHook = useDropdown();

  const {
    loading: dropDownLoading,
    fetchOrganizationNames,
    fetchProductsNames,
    fetchProductDetails,
    resetProductDetails,
    fetchProductTypes,
  } = dropdownHook;

  const productList = dropdownHook.productList;
  const productTypes = dropdownHook.productTypes;
  const productDetails = dropdownHook.productDetails;

  const { createTargetSheet, loading } = useTargetSheet();

  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProductIndex, setSelectedProductIndex] = useState(null);

  /* ---------------------------------------------------------
     🔎 LOCATE ORGANIZATION ARRAY
  --------------------------------------------------------- */
  const organizationRawData = useMemo(() => {
    const candidates = [
      "organizationNames",
      "organizationList",
      "organizationNameList",
      "organizationName",
      "organizations",
      "organizationData",
      "orgNames",
      "orgList",
      "orgNameList",
      "organization",
    ];

    for (const key of candidates) {
      const value = dropdownHook?.[key];
      if (value != null) {
        const arr = toArray(value);
        if (arr.length > 0) return value;
      }
    }

    for (const key of Object.keys(dropdownHook || {})) {
      const value = dropdownHook[key];
      const tryArr = Array.isArray(value) ? value : toArray(value);
      if (tryArr.length > 0) {
        const first = tryArr[0];
        if (
          first &&
          typeof first === "object" &&
          (first.hospitalName || first.uniqueCode || first.city)
        ) {
          return value;
        }
      }
    }

    return null;
  }, [dropdownHook]);

  /* =========================================================
     FORMIK
  ========================================================= */

  const formik = useFormik({
    initialValues: {
      organization: "",
      city: "",
      year: new Date().getFullYear().toString(),
      products: [createEmptyProduct()],
    },

    validationSchema,

    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const filledProducts = values.products.filter(
          (p) => p?.productType && p?.name
        );

        if (filledProducts.length === 0) {
          alert("Please fill at least one product before submitting.");
          setSubmitting(false);
          return;
        }

        const payload = {
          organization: values.organization,
          city: values.city,
          year: String(values.year),

          products: filledProducts.map((product) => {
            const cleanAchievement = {};

            QUARTERS.forEach((quarter) => {
              const quarterData = product.achievement?.[quarter] || {};
              const quarterMonths = {};

              MONTHS[quarter].forEach((month) => {
                const monthData = quarterData?.[month] || {};
                quarterMonths[month] = {
                  targetQuantity: numberValue(monthData.targetQuantity),
                  targetPrice: numberValue(monthData.targetPrice),
                  targetAchievementQuantity: numberValue(
                    monthData.targetAchievementQuantity
                  ),
                  targetAchievementPrice: numberValue(
                    monthData.targetAchievementPrice
                  ),
                };
              });

              cleanAchievement[quarter] = {
                ...quarterMonths,
                QuarterTargetQuantity: numberValue(
                  quarterData.QuarterTargetQuantity
                ),
                QuarterTargetPrice: numberValue(
                  quarterData.QuarterTargetPrice
                ),
                QuarterAchievementQuantity: numberValue(
                  quarterData.QuarterAchievementQuantity
                ),
                QuarterAchievementPrice: numberValue(
                  quarterData.QuarterAchievementPrice
                ),
              };
            });

            return {
              productType: product.productType,
              name: product.name,
              price: numberValue(product.price),
              enteredQuantity: numberValue(product.enteredQuantity),
              overAllTargetPrice: numberValue(product.overAllTargetPrice),
              achievement: cleanAchievement,
            };
          }),
        };

        // eslint-disable-next-line no-console
        console.log(
          "FINAL TARGET SHEET PAYLOAD:",
          JSON.stringify(payload, null, 2)
        );

        const res = await createTargetSheet(payload);

        if (res?.success) {
          resetForm();
          navigate("/sales-executive/target-Sheet");
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error while creating target sheet:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  /* =========================================================
     SAFE DROPDOWN ARRAYS
  ========================================================= */

  const organizationArray = useMemo(
    () => toArray(organizationRawData),
    [organizationRawData]
  );

  const productTypeArray = useMemo(
    () => toArray(productTypes),
    [productTypes]
  );
  const productArray = useMemo(() => toArray(productList), [productList]);

  /* =========================================================
     CITY OPTIONS
  ========================================================= */

  const cityOptions = useMemo(() => {
    const citySet = new Set();

    organizationArray.forEach((org) => {
      const cityName =
        typeof org === "string" ? "" : org?.city || org?.cityName || "";
      if (cityName) citySet.add(cityName);
    });

    return Array.from(citySet)
      .sort((a, b) => a.localeCompare(b))
      .map((c) => ({ label: c, value: c }));
  }, [organizationArray]);

  /* =========================================================
     ORGANIZATION OPTIONS
  ========================================================= */

  const organizationOptions = useMemo(() => {
    return organizationArray
      .filter((org) => {
        if (!formik.values.city) return true;
        const orgCity =
          typeof org === "string" ? "" : org?.city || org?.cityName || "";
        return orgCity === formik.values.city;
      })
      .map((org) => {
        const name =
          typeof org === "string"
            ? org
            : org?.hospitalName ||
              org?.organizationName ||
              org?.name ||
              org?.label ||
              "";
        const orgCity =
          typeof org === "string" ? "" : org?.city || org?.cityName || "";

        return { label: name, value: name, city: orgCity };
      })
      .filter((o) => o.value);
  }, [organizationArray, formik.values.city]);

  /* =========================================================
     PRODUCT OPTIONS
  ========================================================= */

  const productTypeOptions = useMemo(
    () =>
      productTypeArray
        .map((item) => {
          const type = getProductType(item);
          return { label: type, value: type };
        })
        .filter((o) => o.value),
    [productTypeArray]
  );

  const productOptions = useMemo(
    () =>
      productArray
        .map((product) => {
          const name = getProductName(product);
          return { label: name, value: name, product };
        })
        .filter((o) => o.value),
    [productArray]
  );

  /* =========================================================
     INITIAL API CALLS
  ========================================================= */

  useEffect(() => {
    fetchOrganizationNames();
    fetchProductsNames();
    fetchProductTypes();
    resetProductDetails();
    return () => {
      resetProductDetails();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =========================================================
     PRODUCT PRICE FETCH
  ========================================================= */

  useEffect(() => {
    if (selectedProductId === null || selectedProductIndex === null) return;
    fetchProductDetails(selectedProductId);
  }, [selectedProductId, selectedProductIndex]);

  /* =========================================================
     APPLY PRODUCT PRICE + RECALC TARGETS
  ========================================================= */

  useEffect(() => {
    if (selectedProductIndex === null || !productDetails) return;

    const price = getProductPrice(productDetails);
    if (price === "" || price === null) return;

    const index = selectedProductIndex;
    const product = formik.values.products?.[index];
    if (!product) return;

    const numericPrice = numberValue(price);
    const quantity = numberValue(product.enteredQuantity);

    formik.setFieldValue(`products[${index}].price`, numericPrice, false);
    formik.setFieldValue(
      `products[${index}].overAllTargetPrice`,
      roundTo2(numericPrice * quantity),
      false
    );

    recomputeAllTargetPrices(index, numericPrice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productDetails]);

  /* =========================================================
     AUTO-DISTRIBUTE ENTERED QUANTITY
  ========================================================= */
  const autoDistributeQuantity = (
    productIndex,
    enteredQuantity,
    productPrice
  ) => {
    const totalQty = numberValue(enteredQuantity);
    const price = numberValue(productPrice);

    const quarterQty = splitQuantity(totalQty, QUARTER_RATIOS);
    const achievement = createEmptyProduct().achievement;

    QUARTERS.forEach((quarter, qIdx) => {
      const qtyForQuarter = quarterQty[qIdx];
      const monthQty = splitQuantity(qtyForQuarter, MONTH_RATIOS);

      MONTHS[quarter].forEach((month, mIdx) => {
        const qty = monthQty[mIdx];
        const monthPrice = roundTo2(qty * price);

        achievement[quarter][month] = {
          targetQuantity: qty,
          targetPrice: monthPrice,
          targetAchievementQuantity: "",
          targetAchievementPrice: 0,
        };
      });

      achievement[quarter] = computeQuarterTotals(
        achievement[quarter],
        quarter,
        price
      );
    });

    formik.setFieldValue(
      `products[${productIndex}].achievement`,
      achievement,
      false
    );
  };

  /* =========================================================
     RECOMPUTE TARGET PRICES
  ========================================================= */
  const recomputeAllTargetPrices = (productIndex, productPrice) => {
    const price = numberValue(productPrice);
    const currentProduct = formik.values.products?.[productIndex];
    if (!currentProduct) return;

    const achievement = JSON.parse(
      JSON.stringify(currentProduct.achievement || {})
    );

    QUARTERS.forEach((quarter) => {
      achievement[quarter] = achievement[quarter] || {};

      MONTHS[quarter].forEach((month) => {
        const monthData = achievement[quarter][month] || {};
        const tq = numberValue(monthData.targetQuantity);
        const aq = numberValue(monthData.targetAchievementQuantity);

        achievement[quarter][month] = {
          ...monthData,
          targetPrice: roundTo2(tq * price),
          targetAchievementPrice: roundTo2(aq * price),
        };
      });

      achievement[quarter] = computeQuarterTotals(
        achievement[quarter],
        quarter,
        price
      );
    });

    formik.setFieldValue(
      `products[${productIndex}].achievement`,
      achievement,
      false
    );
  };

  /* =========================================================
     PRODUCT TYPE CHANGE
  ========================================================= */

  const handleProductTypeChange = (index, selectedOption) => {
    const value = selectedOption?.value || "";

    formik.setFieldValue(`products[${index}].productType`, value);
    formik.setFieldValue(`products[${index}].name`, "");
    formik.setFieldValue(`products[${index}].price`, "");
    formik.setFieldValue(`products[${index}].enteredQuantity`, "");
    formik.setFieldValue(`products[${index}].overAllTargetPrice`, 0);
    formik.setFieldValue(
      `products[${index}].achievement`,
      createEmptyProduct().achievement
    );

    if (selectedProductIndex === index) {
      setSelectedProductId(null);
      setSelectedProductIndex(null);
      resetProductDetails();
    }
  };

  /* =========================================================
     PRODUCT NAME CHANGE
  ========================================================= */

  const handleProductNameChange = (index, selectedOption) => {
    const name = selectedOption?.value || "";
    const selectedProduct =
      selectedOption?.product ||
      productArray.find((p) => getProductName(p) === name);

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

      formik.setFieldValue(`products[${index}].price`, numericPrice);
      formik.setFieldValue(
        `products[${index}].overAllTargetPrice`,
        roundTo2(numericPrice * quantity)
      );

      recomputeAllTargetPrices(index, numericPrice);

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

  /* =========================================================
     ENTERED QUANTITY CHANGE
  ========================================================= */

  const handleEnteredQuantityChange = (index, value) => {
    const quantity = numberValue(value);
    const price = numberValue(formik.values.products?.[index]?.price);

    formik.setFieldValue(`products[${index}].enteredQuantity`, value);
    formik.setFieldValue(
      `products[${index}].overAllTargetPrice`,
      roundTo2(quantity * price)
    );

    autoDistributeQuantity(index, value, price);
  };

  /* =========================================================
     MONTH TARGET QUANTITY CHANGE
  ========================================================= */

  const handleTargetQuantityChange = (productIndex, quarter, month, value) => {
    const product = formik.values.products?.[productIndex];
    if (!product) return;

    const price = numberValue(product?.price);
    const quantity = numberValue(value);

    const achievement = JSON.parse(
      JSON.stringify(product.achievement || {})
    );

    achievement[quarter] = achievement[quarter] || {};
    achievement[quarter][month] = {
      ...(achievement[quarter][month] || {}),
      targetQuantity: value,
      targetPrice: roundTo2(quantity * price),
    };

    achievement[quarter] = computeQuarterTotals(
      achievement[quarter],
      quarter,
      price
    );

    formik.setFieldValue(
      `products[${productIndex}].achievement`,
      achievement,
      false
    );
  };

  /* =========================================================
     MONTH ACHIEVEMENT QUANTITY CHANGE
  ========================================================= */

  const handleAchievementQuantityChange = (
    productIndex,
    quarter,
    month,
    value
  ) => {
    const product = formik.values.products?.[productIndex];
    if (!product) return;

    const price = numberValue(product?.price);
    const quantity = numberValue(value);

    const achievement = JSON.parse(
      JSON.stringify(product.achievement || {})
    );

    achievement[quarter] = achievement[quarter] || {};
    achievement[quarter][month] = {
      ...(achievement[quarter][month] || {}),
      targetAchievementQuantity: value,
      targetAchievementPrice: roundTo2(quantity * price),
    };

    achievement[quarter] = computeQuarterTotals(
      achievement[quarter],
      quarter,
      price
    );

    formik.setFieldValue(
      `products[${productIndex}].achievement`,
      achievement,
      false
    );
  };

  /* =========================================================
     ADD PRODUCT — insert AFTER clicked index, then scroll
  ========================================================= */
  const addProduct = (clickedIndex) => {
    const insertAt = clickedIndex + 1;

    const newProducts = [...formik.values.products];
    newProducts.splice(insertAt, 0, createEmptyProduct());

    formik.setFieldValue("products", newProducts);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = document.getElementById(`product-card-${insertAt}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  };

  /* =========================================================
     REMOVE PRODUCT
  ========================================================= */
  const removeProduct = (index) => {
    if (formik.values.products.length === 1) return;

    const products = formik.values.products.filter(
      (_, productIndex) => productIndex !== index
    );
    formik.setFieldValue("products", products);

    if (selectedProductIndex === index) {
      setSelectedProductId(null);
      setSelectedProductIndex(null);
      resetProductDetails();
    }
  };

  /* =========================================================
     YEAR OPTIONS
  ========================================================= */

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, index) => {
      const year = currentYear + index;
      return { label: String(year), value: String(year) };
    });
  }, []);

  const selectStyles = {
    menu: (provided) => ({ ...provided, zIndex: 9999 }),
    menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
  };

  /* =========================================================
     MONTH UI
  ========================================================= */

  const renderMonth = (product, productIndex, quarter, month) => {
    const monthData =
      product?.achievement?.[quarter]?.[month] || createEmptyMonth();

    return (
      <div key={month} className="border rounded-lg p-4 bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <h5 className="font-semibold text-gray-800">{month}</h5>
          <span className="text-xs text-gray-500">{quarter}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Target Quantity
            </label>
            <input
              type="number"
              min="0"
              value={monthData.targetQuantity}
              onChange={(e) =>
                handleTargetQuantityChange(
                  productIndex,
                  quarter,
                  month,
                  e.target.value
                )
              }
              onWheel={(e) => e.target.blur()}
              className="w-full border rounded-md p-2 no-spinner"
              placeholder="Target quantity"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Target Price
            </label>
            <input
              type="number"
              value={monthData.targetPrice || 0}
              readOnly
              className="w-full border rounded-md p-2 bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              ₹ {formatCurrency(monthData.targetPrice)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Achievement Quantity
            </label>
            <input
              type="number"
              min="0"
              value={monthData.targetAchievementQuantity}
              onChange={(e) =>
                handleAchievementQuantityChange(
                  productIndex,
                  quarter,
                  month,
                  e.target.value
                )
              }
              onWheel={(e) => e.target.blur()}
              className="w-full border rounded-md p-2 no-spinner"
              placeholder="Achievement quantity"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Achievement Price
            </label>
            <input
              type="number"
              value={monthData.targetAchievementPrice || 0}
              readOnly
              className="w-full border rounded-md p-2 bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              ₹ {formatCurrency(monthData.targetAchievementPrice)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  /* =========================================================
     QUARTER UI
  ========================================================= */

  const renderQuarter = (product, productIndex, quarter) => {
    const quarterData = product?.achievement?.[quarter] || {};

    return (
      <div key={quarter} className="border rounded-xl p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5 p-4 rounded-lg bg-gray-100">
          <h4 className="text-lg font-semibold text-gray-800">
            {quarter.replace("Quarter", "Quarter ")}
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white border rounded-md p-3">
              <p className="text-xs text-gray-500">Target Qty</p>
              <p className="font-semibold">
                {quarterData.QuarterTargetQuantity || 0}
              </p>
            </div>
            <div className="bg-white border rounded-md p-3">
              <p className="text-xs text-gray-500">Target Price</p>
              <p className="font-semibold">
                ₹ {formatCurrency(quarterData.QuarterTargetPrice)}
              </p>
            </div>
            <div className="bg-white border rounded-md p-3">
              <p className="text-xs text-gray-500">Achievement Qty</p>
              <p className="font-semibold">
                {quarterData.QuarterAchievementQuantity || 0}
              </p>
            </div>
            <div className="bg-white border rounded-md p-3">
              <p className="text-xs text-gray-500">Achievement Price</p>
              <p className="font-semibold">
                ₹ {formatCurrency(quarterData.QuarterAchievementPrice)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {MONTHS[quarter].map((month) =>
            renderMonth(product, productIndex, quarter, month)
          )}
        </div>
      </div>
    );
  };

  /* =========================================================
     PRODUCT UI
  ========================================================= */

  const renderProduct = (product, productIndex) => {
    const productTouched = formik.touched.products?.[productIndex];
    const productError = formik.errors.products?.[productIndex];

    return (
      <fieldset className="border border-gray-300 rounded-xl p-5 bg-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
              {productIndex + 1}
            </span>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Product {productIndex + 1}
              </h3>
              <p className="text-sm text-gray-500">
                Product and monthly target details
              </p>
            </div>
          </div>

          {formik.values.products.length > 1 && (
            <button
              type="button"
              onClick={() => removeProduct(productIndex)}
              className="px-4 py-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 text-sm font-medium transition-colors"
            >
              Remove Product
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Product Type
            </label>
            <Select
              isLoading={dropDownLoading}
              isClearable
              options={productTypeOptions}
              value={
                productTypeOptions.find(
                  (o) => o.value === product.productType
                ) || null
              }
              onChange={(option) =>
                handleProductTypeChange(productIndex, option)
              }
              onBlur={() =>
                formik.setFieldTouched(
                  `products[${productIndex}].productType`,
                  true
                )
              }
              placeholder="Select Product Type"
              classNamePrefix="react-select"
              styles={selectStyles}
              menuPortalTarget={document.body}
            />
            {productTouched?.productType && productError?.productType && (
              <p className="text-sm text-red-500 mt-1">
                {productError.productType}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Product Name
            </label>
            <Select
              isLoading={dropDownLoading}
              isClearable
              options={productOptions}
              value={
                productOptions.find((o) => o.value === product.name) || null
              }
              onChange={(option) =>
                handleProductNameChange(productIndex, option)
              }
              onBlur={() =>
                formik.setFieldTouched(`products[${productIndex}].name`, true)
              }
              placeholder={
                product.productType
                  ? "Select Product"
                  : "Select Product Type First"
              }
              isDisabled={!product.productType}
              classNamePrefix="react-select"
              styles={selectStyles}
              menuPortalTarget={document.body}
            />
            {productTouched?.name && productError?.name && (
              <p className="text-sm text-red-500 mt-1">{productError.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Product Price
            </label>
            <input
              type="number"
              value={product.price || ""}
              readOnly
              className="w-full border rounded-md p-2 bg-gray-100"
              placeholder="Product price"
            />
            {product.price !== "" && (
              <p className="text-xs text-gray-500 mt-1">
                ₹ {formatCurrency(product.price)}
              </p>
            )}
            {productTouched?.price && productError?.price && (
              <p className="text-sm text-red-500 mt-1">{productError.price}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Entered Quantity
            </label>
            <input
              type="number"
              min="0"
              value={product.enteredQuantity}
              onChange={(e) =>
                handleEnteredQuantityChange(productIndex, e.target.value)
              }
              onWheel={(e) => e.target.blur()}
              onBlur={() =>
                formik.setFieldTouched(
                  `products[${productIndex}].enteredQuantity`,
                  true
                )
              }
              className="w-full border rounded-md p-2 no-spinner"
              placeholder="Enter quantity"
            />
            <p className="text-xs text-gray-500 mt-1">
              Auto-splits → Q1: 0% | Q2: 24% | Q3: 36% | Q4: 40%
            </p>
            {productTouched?.enteredQuantity &&
              productError?.enteredQuantity && (
                <p className="text-sm text-red-500 mt-1">
                  {productError.enteredQuantity}
                </p>
              )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Overall Target Price
            </label>
            <input
              type="number"
              value={product.overAllTargetPrice || 0}
              readOnly
              className="w-full border rounded-md p-2 bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              ₹ {formatCurrency(product.overAllTargetPrice)}
            </p>
          </div>
        </div>

        <div className="border-t my-6" />

        <div>
          <h4 className="text-xl font-semibold text-gray-800 mb-4">
            Monthly Target &amp; Achievement
          </h4>

          {QUARTERS.map((quarter) =>
            renderQuarter(product, productIndex, quarter)
          )}
        </div>
      </fieldset>
    );
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="w-full min-h-screen">
      <BreadCrumb
        linkText={[
          { text: "Customer Visit Plan" },
          { text: "Target Sheet", href: "/sales-executive/target-Sheet" },
          { text: "Create Target Sheet" },
        ]}
      />

      <div className="border rounded-2xl shadow-md bg-white overflow-hidden">
        <div className="text-center">
          <h2
            className="flex p-6 mb-2 items-center justify-center font-semibold text-xl text-black rounded-t-md"
            style={{ backgroundColor: theme.secondaryColor }}
          >
            Create Target Sheet
          </h2>
        </div>

        <p className="text-black font-bold text-center mb-5 px-6">
          PLEASE FILL OUT THE FOLLOWING DETAILS TO CREATE A TARGET SHEET
        </p>

        <form onSubmit={formik.handleSubmit} className="px-6 py-4">
          {/* Global error banner */}
          {formik.submitCount > 0 && !formik.isValid && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-300 text-red-700 text-sm">
              Please complete all required fields (organization, city, year,
              and at least one product) before submitting.
            </div>
          )}

          {/* ORGANIZATION */}
          <fieldset className="border border-gray-200 rounded-lg p-5 mb-6">
            <legend className="text-lg font-semibold px-2 text-gray-700">
              Organization Details
            </legend>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* ORGANIZATION */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Organization
                </label>
                <Select
                  isLoading={dropDownLoading}
                  isClearable
                  options={organizationOptions}
                  value={
                    organizationOptions.find(
                      (o) => o.value === formik.values.organization
                    ) || null
                  }
                  onChange={(option) => {
                    formik.setFieldValue("organization", option?.value || "");
                    formik.setFieldValue("city", option?.city || "");
                  }}
                  onBlur={() => formik.setFieldTouched("organization", true)}
                  placeholder="Select Organization"
                  classNamePrefix="react-select"
                  styles={selectStyles}
                  menuPortalTarget={document.body}
                  noOptionsMessage={() =>
                    organizationOptions.length === 0
                      ? "Loading organizations..."
                      : "No organizations found"
                  }
                />
                {formik.touched.organization && formik.errors.organization && (
                  <p className="text-sm text-red-500 mt-1">
                    {formik.errors.organization}
                  </p>
                )}
              </div>

              {/* CITY */}
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <Select
                  isLoading={dropDownLoading}
                  isClearable
                  options={cityOptions}
                  value={
                    cityOptions.find((o) => o.value === formik.values.city) ||
                    null
                  }
                  onChange={(option) => {
                    formik.setFieldValue("city", option?.value || "");
                    formik.setFieldValue("organization", "");
                  }}
                  onBlur={() => formik.setFieldTouched("city", true)}
                  placeholder="Select City"
                  classNamePrefix="react-select"
                  styles={selectStyles}
                  menuPortalTarget={document.body}
                />
                {formik.touched.city && formik.errors.city && (
                  <p className="text-sm text-red-500 mt-1">
                    {formik.errors.city}
                  </p>
                )}
              </div>

              {/* YEAR */}
              <div>
                <label className="block text-sm font-medium mb-1">Year</label>
                <Select
                  options={yearOptions}
                  value={
                    yearOptions.find(
                      (o) => o.value === String(formik.values.year)
                    ) || null
                  }
                  onChange={(option) =>
                    formik.setFieldValue("year", option?.value || "")
                  }
                  placeholder="Select Year"
                  classNamePrefix="react-select"
                  styles={selectStyles}
                  menuPortalTarget={document.body}
                />
                {formik.touched.year && formik.errors.year && (
                  <p className="text-sm text-red-500 mt-1">
                    {formik.errors.year}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

          {/* =====================================================
              PRODUCTS
          ===================================================== */}
          <fieldset className="border border-gray-200 rounded-lg p-5">
            <legend className="text-lg font-semibold px-2 text-gray-700">
              Products
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({formik.values.products.length})
              </span>
            </legend>

            {formik.values.products.map((product, index) => (
              <React.Fragment key={product._tempId || index}>
                {/* Product card — scroll target */}
                <div id={`product-card-${index}`}>
                  {renderProduct(product, index)}
                </div>

                {/* ✨ Elegant insert-product divider — dashed line with
                    a floating pill button in the middle */}
                <div className="relative my-8">
                  {/* Dashed line behind the button */}
                  <div
                    className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-gray-300"
                    aria-hidden="true"
                  />

                  {/* Centered pill button */}
                  <div className="relative flex justify-center">
                    <button
                      type="button"
                      onClick={() => addProduct(index)}
                      className="group inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-dashed border-gray-400 rounded-full text-gray-700 font-medium text-sm hover:border-blue-500 hover:text-blue-600 hover:shadow-md hover:bg-blue-50/50 transition-all duration-200"
                    >
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-lg leading-none font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                        +
                      </span>
                      <span>Add Product</span>
                    </button>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </fieldset>

          {/* BUTTONS */}
          <div className="flex justify-center gap-4 mt-6 mb-6">
            <Button
              type="button"
              text="Clear"
              onClick={() => {
                formik.resetForm();
                setSelectedProductId(null);
                setSelectedProductIndex(null);
                resetProductDetails();
              }}
            />
            <Button
              type="submit"
              text={loading ? "Submitting..." : "Submit"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default TargetSheetForm;