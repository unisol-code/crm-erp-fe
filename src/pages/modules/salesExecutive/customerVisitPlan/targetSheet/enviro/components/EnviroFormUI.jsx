import React from "react";

/* =========================================================
   SHARED, RULE-AGNOSTIC DISTRIBUTION HELPERS
   ------------------------------------------------------------
   These helpers only implement the cumulative-rounding maths.
   They contain NO business rules.

   Every target sheet type keeps its OWN distribution rules
   (inlined inside its own form) so that the three business rules
   stay completely independent from one another.
========================================================= */

export const QUARTERS = ["Quarter1", "Quarter2", "Quarter3", "Quarter4"];

export const MONTHS = {
  Quarter1: ["Jan", "Feb", "Mar"],
  Quarter2: ["Apr", "May", "Jun"],
  Quarter3: ["Jul", "Aug", "Sep"],
  Quarter4: ["Oct", "Nov", "Dec"],
};

export const QUARTER_LABELS = {
  Quarter1: "Quarter 1 (Jan – Mar)",
  Quarter2: "Quarter 2 (Apr – Jun)",
  Quarter3: "Quarter 3 (Jul – Sep)",
  Quarter4: "Quarter 4 (Oct – Dec)",
};

export const numberValue = (value) => {
  const n = Number(value);
  return Number.isNaN(n) ? 0 : n;
};

/**
 * Round a number to a given precision.
 *
 * `Math.round(value * factor) / factor` alone is not enough: binary
 * floating point makes values such as `1.005` land slightly BELOW the
 * midpoint (`1.005 * 100 === 100.49999999999999`), so they get rounded
 * DOWN instead of UP. A relative epsilon is added before rounding to
 * compensate for that representation error.
 */
export const roundTo = (value, precision = 2) => {
  const number = numberValue(value);
  const factor = Math.pow(10, precision);
  const scaled = number * factor;
  const epsilon = Number.EPSILON * Math.abs(scaled);

  const rounded =
    (Math.sign(scaled) * Math.round(Math.abs(scaled) + epsilon)) / factor;

  /* Normalise "-0" so it never leaks into the form state / preview. */
  return rounded === 0 ? 0 : rounded;
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(
    numberValue(value)
  );

/**
 * Split `total` across `ratios` using cumulative rounding, so the sum of the
 * returned parts is ALWAYS exactly `total` (never over / short allocated).
 *
 * @param {number} total      overall value to distribute
 * @param {number[]} ratios   distribution ratios (need not add up to 1)
 * @param {number} precision  decimal places kept for every part
 */
export const distributeWithRounding = (total, ratios, precision = 0) => {
  const safeTotal = numberValue(total);
  const parts = [];
  let previousCumulative = 0;

  ratios.forEach((ratio, index) => {
    if (index === ratios.length - 1) {
      // Last part absorbs the rounding remainder so the total always matches
      parts.push(roundTo(safeTotal - previousCumulative, precision));
      return;
    }

    const cumulativeRatio = ratios
      .slice(0, index + 1)
      .reduce((sum, value) => sum + numberValue(value), 0);

    const roundedCumulative = roundTo(safeTotal * cumulativeRatio, precision);

    parts.push(roundTo(roundedCumulative - previousCumulative, precision));
    previousCumulative = roundedCumulative;
  });

  return parts;
};

/**
 * Build the full quarter -> month target structure for an overall target.
 *
 * @param {number} overallQuantity overall target quantity
 * @param {number} unitPrice       price of a single unit (used for target price)
 * @param {number[]} quarterlyRatios per-quarter distribution (4 entries)
 * @param {number[]} monthlyRatios   per-month distribution inside a quarter (3 entries)
 * @param {number} quantityPrecision decimals kept for quantities
 * @param {number} pricePrecision    decimals kept for prices
 */
export const buildTargetDistribution = ({
  overallQuantity,
  unitPrice = 0,
  quarterlyRatios,
  monthlyRatios,
  quantityPrecision = 0,
  pricePrecision = 2,
}) => {
  const totalQuantity = numberValue(overallQuantity);
  const price = numberValue(unitPrice);

  const quarterQuantities = distributeWithRounding(
    totalQuantity,
    quarterlyRatios,
    quantityPrecision
  );

  const quarters = {};

  QUARTERS.forEach((quarter, quarterIndex) => {
    const quarterQuantity = quarterQuantities[quarterIndex] || 0;
    const monthQuantities = distributeWithRounding(
      quarterQuantity,
      monthlyRatios,
      quantityPrecision
    );

    const months = {};
    let quarterTargetPrice = 0;

    MONTHS[quarter].forEach((month, monthIndex) => {
      const monthQuantity = monthQuantities[monthIndex] || 0;
      const monthTargetPrice = roundTo(monthQuantity * price, pricePrecision);

      quarterTargetPrice = roundTo(
        quarterTargetPrice + monthTargetPrice,
        pricePrecision
      );

      months[month] = {
        targetQuantity: monthQuantity,
        targetPrice: monthTargetPrice,
        targetAchievementQuantity: "",
        targetAchievementPrice: 0,
      };
    });

    quarters[quarter] = {
      ...months,
      QuarterTargetQuantity: roundTo(quarterQuantity, quantityPrecision),
      QuarterTargetPrice: quarterTargetPrice,
      QuarterAchievementQuantity: 0,
      QuarterAchievementPrice: 0,
    };
  });

  return quarters;
};

/* =========================================================
   ENVIRO SOLUTION — SHARED DROPDOWN HELPERS
   ------------------------------------------------------------
   These mappers turn the raw dropdown API payloads into
   react-select options.

   IMPORTANT: an API row can come back with a NULL `name` /
   `organizationName`. Falling back to the whole object would hand
   React an object to render and crash the select with
   "Objects are not valid as a React child", so every mapper
   always falls back to a STRING (unique code / placeholder).
   ========================================================= */

/**
 * Normalise the different shapes an API list can arrive in
 * (plain array, `{ data: [...] }`, `{ data: { data: [...] } }`, ...).
 */
export const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.data?.data)) return value.data.data;
  if (Array.isArray(value?.result)) return value.result;
  if (Array.isArray(value?.products)) return value.products;
  if (Array.isArray(value?.items)) return value.items;
  return [];
};

export const getProductName = (product) => {
  if (typeof product === "string") return product;
  return (
    product?.name ||
    product?.productName ||
    product?.label ||
    product?.title ||
    ""
  );
};

export const getProductPrice = (product) => {
  if (!product || typeof product === "string") return "";
  const price =
    product?.price ??
    product?.productPrice ??
    product?.unitPrice ??
    product?.sellingPrice ??
    product?.mrp;
  return price === undefined || price === null ? "" : price;
};

export const getProductId = (product) => {
  if (typeof product === "string") return null;
  return product?._id || product?.id || product?.productId || null;
};

export const getProductTypeName = (item) => {
  if (typeof item === "string") return item;
  return item?.name || item?.productType || item?.type || item?.label || "";
};

/* ------------------------------------------------------------
   Organization options (EnviroSolution organization dropdown)
------------------------------------------------------------ */
export const mapOrganizationOptions = (list) =>
  toArray(list)
    .map((item) => {
      const label =
        item?.name ||
        item?.organizationName ||
        item?.hospitalName ||
        item?.uniqueCode ||
        "";

      return {
        label,
        value: label,
        uniqueCode: item?.uniqueCode || "",
        city: item?.city || item?.organizationCity || "",
        raw: item,
      };
    })
    .filter((option) => option.value);

/* ------------------------------------------------------------
   Individual options (EnviroSolution individual dropdown)
------------------------------------------------------------ */
export const mapIndividualOptions = (list) =>
  toArray(list)
    .map((item) => {
      const label =
        item?.name ||
        item?.fullName ||
        item?.individualName?.trim() ||
        item?.uniqueCode ||
        "";

      return {
        label,
        value: label,
        uniqueCode: item?.uniqueCode || "",
        designation: item?.designation || "",
        speciality: item?.speciality || item?.specialty || "",
        city: item?.city || "",
        visitDetails: {
          startTime: item?.visitStartTime || item?.visitDetails?.startTime || "",
          endTime: item?.visitEndTime || item?.visitDetails?.endTime || "",
          duration: item?.visitDuration || item?.visitDetails?.duration || "",
        },
        raw: item,
      };
    })
    .filter((option) => option.value);

/* ------------------------------------------------------------
   Product / product type / city / year options
------------------------------------------------------------ */
export const mapProductOptions = (list) =>
  toArray(list)
    .map((product) => {
      const name = getProductName(product);
      return {
        label: name,
        value: name,
        price: getProductPrice(product),
        product,
      };
    })
    .filter((option) => option.value);

export const mapProductTypeOptions = (list) =>
  toArray(list)
    .map((item) => {
      const type = getProductTypeName(item);
      return { label: type, value: type };
    })
    .filter((option) => option.value);

export const mapStringOptions = (list) =>
  toArray(list)
    .map((item) => {
      const value = typeof item === "string" ? item : item?.name || item?.value || "";
      return { label: value, value };
    })
    .filter((option) => option.value);

export const mapCityOptions = (list) =>
  toArray(list)
    .map((item) => {
      const value = typeof item === "string" ? item : item?.name || item?.city || "";
      return { label: value, value };
    })
    .filter((option) => option.value);

export const buildYearOptions = () => {
  const currentYear = new Date().getFullYear();
  return [currentYear - 1, currentYear, currentYear + 1].map((year) => ({
    label: String(year),
    value: String(year),
  }));
};



/* =========================================================
   GENERIC FORM UI PIECES
   ------------------------------------------------------------
   Pure presentation helpers (labels, inputs, read-only boxes,
   section wrappers). They hold NO business / calculation rules
   so they can be reused by the product, project and service
   EnviroSolution target sheet forms.
========================================================= */

export const inputBaseClass =
  "w-full border rounded-md p-2 no-spinner focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all";

export const readOnlyInputClass =
  "w-full border rounded-md p-2 bg-gray-100 text-gray-700 cursor-not-allowed";

export const selectStyles = {
  menu: (provided) => ({ ...provided, zIndex: 9999 }),
  menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
};

/* ------------------------------------------------------------
   Section wrapper
------------------------------------------------------------ */
export const FormSection = ({ title, description, children, className = "" }) => (
  <fieldset
    className={`border border-gray-200 rounded-lg p-5 mb-6 bg-white ${className}`}
  >
    <legend className="text-lg font-semibold px-2 text-gray-700">
      {title}
    </legend>
    {description ? (
      <p className="text-sm text-gray-500 mb-4">{description}</p>
    ) : null}
    {children}
  </fieldset>
);

/* ------------------------------------------------------------
   Field wrapper with error message
------------------------------------------------------------ */
export const FormField = ({ label, error, required, children, hint }) => (
  <div>
    <label className="block text-sm font-medium mb-1 text-gray-700">
      {label}
      {required ? <span className="text-red-500 ml-1">*</span> : null}
    </label>
    {children}
    {hint ? <p className="text-xs text-gray-500 mt-1">{hint}</p> : null}
    {error ? <p className="text-sm text-red-500 mt-1">{error}</p> : null}
  </div>
);

/* ------------------------------------------------------------
   Read only calculated field
------------------------------------------------------------ */
export const ReadOnlyField = ({ label, value, hint, prefix }) => (
  <div>
    <label className="block text-sm font-medium mb-1 text-gray-700">
      {label}
    </label>
    <input
      type="text"
      readOnly
      value={value}
      className={readOnlyInputClass}
    />
    {hint ? <p className="text-xs text-gray-500 mt-1">{hint}</p> : null}
  </div>
);


/* ------------------------------------------------------------
   Quarter / Month distribution table
   ------------------------------------------------------------
   `distribution` (the business rules) is passed IN by each form so
   the product / project / service rules stay independent. This
   component only renders the numbers it receives.
------------------------------------------------------------ */
export const DistributionTable = ({
  distribution,
  onAchievementChange,
}) => {
  const quarters = distribution?.quarters || {};
  const monthlyRatios = distribution?.monthlyRatios || [];

  return (
    <div className="space-y-4">
      {QUARTERS.map((quarter, quarterIndex) => {
        const quarterData = quarters[quarter] || {};
        const ratio = distribution?.quarterlyRatios?.[quarterIndex] ?? 0;

        return (
          <div key={quarter} className="border rounded-xl p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5 p-4 rounded-lg bg-gray-100">
              <div>
                <h4 className="text-lg font-semibold text-gray-800">
                  {QUARTER_LABELS[quarter]}
                </h4>
                <p className="text-sm text-gray-500">
                  Distribution: {Math.round(ratio * 100)}% of the overall target
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white border rounded-md p-3">
                  <p className="text-xs text-gray-500">Target Qty</p>
                  <p className="font-semibold">
                    {quarterData.QuarterTargetQuantity ?? 0}
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
                    {quarterData.QuarterAchievementQuantity ?? 0}
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
              {MONTHS[quarter].map((month, monthIndex) => {
                const monthData = quarterData?.[month] || {};

                return (
                  <div
                    key={month}
                    className="border rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-semibold text-gray-800">{month}</h5>
                      <span className="text-xs text-gray-500">
                        {Math.round((monthlyRatios[monthIndex] || 0) * 100)}% of
                        quarter
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ReadOnlyField
                        label="Target Quantity"
                        value={monthData.targetQuantity ?? 0}
                      />
                      <ReadOnlyField
                        label="Target Price"
                        value={`₹ ${formatCurrency(monthData.targetPrice)}`}
                      />

                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                          Achievement Quantity
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={monthData.targetAchievementQuantity ?? ""}
                          onChange={(event) =>
                            onAchievementChange?.(
                              quarter,
                              month,
                              "targetAchievementQuantity",
                              event.target.value
                            )
                          }
                          onWheel={(event) => event.target.blur()}
                          className={inputBaseClass}
                          placeholder="Enter achievement qty"
                        />
                      </div>

                      <ReadOnlyField
                        label="Achievement Price"
                        value={`₹ ${formatCurrency(
                          monthData.targetAchievementPrice
                        )}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
