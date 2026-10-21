import React from "react";
import { TrendingUp, Pill, CalendarDays, Info } from "lucide-react";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import LoaderSpinner from "../../../../../components/uiComponents/loader/LoaderSpinner";

// Month keys returned by the target sheet yearly summary API (calendar order)
const SUMMARY_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
// Current month in the same short format ("Jan".."Dec") for column highlighting
const SUMMARY_CURRENT_MONTH = new Date().toLocaleString("en-US", {
  month: "short",
});
// Display labels for the 12 month columns (positional match with SUMMARY_MONTHS)
const SUMMARY_MONTH_DISPLAY = [
  "Jan", "Feb", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * Monthly Product Target Planning card: header details (organization, individual,
 * products, year) + 12-month target/achievement columns with horizontal scroll.
 * Shared by CreateMonthlyPlanning and ViewMonthlyPlanningDetails.
 *
 * @param {object}  data     response.summary → { Jan: { targetQuantity, targetAchievementQuantity }, ... }
 * @param {object}  filters  response.filters → { organization, individualName, productName, year }
 * @param {boolean} loading  true while the yearly summary request is in flight
 * @param {string}  message  response.message shown as empty-state when no summary found (success: false)
 */
const MonthlyProductTargetPlanningTable = ({
  data,
  filters = {},
  loading = false,
  message = "",
}) => {
  const { theme } = useTheme();

  return (
    <>
      {(data || loading || message) && (
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50">
          {/* 1. Header details */}
          <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-5">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-lg bg-emerald-100 p-1.5">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-800">
                Monthly Product Target Planning
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Organization Name
                </p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  {filters.organization || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Individual Name
                </p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  {filters.individualName || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Product Name
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  {(Array.isArray(filters.productName)
                    ? filters.productName
                    : []
                  ).map((product, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700"
                    >
                      <Pill className="h-2.5 w-2.5" />
                      {product}
                    </span>
                  ))}
                  {(!Array.isArray(filters.productName) ||
                    filters.productName.length === 0) && (
                    <span className="text-sm text-slate-800">—</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Year
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-800">
                  <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                  {filters.year || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* 2. Monthly table — 12 month columns, horizontal scroll on small screens */}
          <div className="overflow-x-auto">
            {loading && !data ? (
              <div className="py-8">
                <LoaderSpinner />
              </div>
            ) : data ? (
              <table className="w-full min-w-[1040px] text-center">
                <thead>
                  <tr className="bg-slate-100/80">
                    <th className="sticky left-0 z-10 border-r border-b border-slate-200 bg-slate-100 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Particulars
                    </th>
                    {SUMMARY_MONTH_DISPLAY.map((label, idx) => (
                      <th
                        key={SUMMARY_MONTHS[idx]}
                        className={`border-b border-r border-slate-200 px-2 py-3 text-xs font-semibold uppercase tracking-wider last:border-r-0 ${
                          SUMMARY_MONTHS[idx] === SUMMARY_CURRENT_MONTH
                            ? "bg-emerald-50 text-emerald-700"
                            : "text-slate-600"
                        }`}
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="sticky left-0 z-10 border-r border-slate-200 bg-white px-4 py-4 text-left text-sm font-semibold text-slate-700">
                      Target Qty
                    </td>
                    {SUMMARY_MONTHS.map((month) => {
                      const cell = data[month] || {};
                      const target = Number(cell.targetQuantity) || 0;
                      const isCurrent = month === SUMMARY_CURRENT_MONTH;
                      return (
                        <td
                          key={month}
                          className={`border-r border-slate-100 px-2 py-4 text-sm text-slate-700 last:border-r-0 ${
                            isCurrent ? "bg-emerald-50/60" : ""
                          }`}
                        >
                          {target}
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="sticky left-0 z-10 border-r border-slate-200 bg-white px-4 py-4 text-left text-sm font-semibold text-slate-700">
                      Achieved Qty
                    </td>
                    {SUMMARY_MONTHS.map((month) => {
                      const cell = data[month] || {};
                      const achieved =
                        Number(cell.targetAchievementQuantity) || 0;
                      const isCurrent = month === SUMMARY_CURRENT_MONTH;
                      return (
                        <td
                          key={month}
                          className={`border-r border-slate-100 px-2 py-4 text-sm font-medium last:border-r-0 ${
                            isCurrent ? "bg-emerald-50/60" : ""
                          }`}
                          style={{
                            color: achieved > 0 ? "#16A34A" : "#94A3B8",
                          }}
                        >
                          {achieved}
                        </td>
                      );
                    })}
                  </tr>
                  {/* <tr>
                    <td className="sticky left-0 z-10 border-r border-slate-200 bg-white px-4 py-4 text-left text-sm font-semibold text-slate-700">
                      Balance Qty
                    </td>
                    {SUMMARY_MONTHS.map((month) => {
                      const cell = data[month] || {};
                      const target = Number(cell.targetQuantity) || 0;
                      const achieved =
                        Number(cell.targetAchievementQuantity) || 0;
                      const isCurrent = month === SUMMARY_CURRENT_MONTH;
                      return (
                        <td
                          key={month}
                          className={`border-r border-slate-100 px-2 py-4 text-sm text-slate-500 last:border-r-0 ${
                            isCurrent ? "bg-emerald-50/60" : ""
                          }`}
                        >
                          {Math.max(target - achieved, 0)}
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="sticky left-0 z-10 border-r border-slate-200 bg-white px-4 py-4 text-left text-sm font-semibold text-slate-700">
                      Achievement %
                    </td>
                    {SUMMARY_MONTHS.map((month) => {
                      const cell = data[month] || {};
                      const target = Number(cell.targetQuantity) || 0;
                      const achieved =
                        Number(cell.targetAchievementQuantity) || 0;
                      const percent =
                        target > 0
                          ? Math.round((achieved / target) * 100)
                          : null;
                      const isCurrent = month === SUMMARY_CURRENT_MONTH;
                      return (
                        <td
                          key={month}
                          className={`border-r border-slate-100 px-2 py-4 text-sm font-semibold last:border-r-0 ${
                            isCurrent ? "bg-emerald-50/60" : ""
                          }`}
                          style={{
                            color:
                              percent === null
                                ? "#94A3B8"
                                : percent >= 100
                                  ? "#16A34A"
                                  : theme.primaryColor,
                          }}
                        >
                          {percent === null ? "—" : `${percent}%`}
                        </td>
                      );
                    })}
                  </tr> */}
                </tbody>
              </table>
            ) : message ? (
              <div className="flex flex-col items-center justify-center gap-2 px-6 py-10 text-center">
                <div className="rounded-full bg-amber-50 p-3">
                  <Info className="h-6 w-6 text-amber-500" />
                </div>
                <p className="max-w-md text-sm font-medium text-slate-700">
                  {message}
                </p>
                <p className="text-sm text-red-500">
                  Add target sheet summary for this Product.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};

export default MonthlyProductTargetPlanningTable;