import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiChevronDown, FiChevronUp, FiEye } from "react-icons/fi";
import { toast } from "react-toastify";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb.jsx";
import { useTheme } from "../../../../../hooks/theme/useTheme.js";
import useAdminTargetSheet from "../../../../../hooks/superAdminHook/customerVisitPlan/targetSheet/useAdminTargetSheet.js";
import LoaderSpinner from "../../../../../components/uiComponents/loader/LoaderSpinner.jsx";

const currency = (val) =>
  val != null
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(val)
    : "₹ 0";

const Stat = ({ label, value }) => (
  <div className="relative overflow-hidden rounded-xl bg-white border border-gray-200 shadow-sm p-4 flex-1 min-w-[135px]">
    <span className="absolute left-0 top-0 h-full w-1.5 bg-orange-500" />
    <p className="pl-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
      {label}
    </p>
    <p className="mt-1 pl-3 text-xl font-bold tracking-tight text-[#252C58] break-words">
      {value}
    </p>
  </div>
);

const AdminUniversalTargetSheet = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    universalTargetSheet,
    loading,
    fetchUniversalTargetSheet,
    resetUniversalTargetSheet,
    reviewTargetSheet,
  } = useAdminTargetSheet();

  const [expanded, setExpanded] = useState({});
  // Review modal state: null or { sheetId, action: "approve" | "reject", orgLabel }
  const [reviewModal, setReviewModal] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchUniversalTargetSheet(id);
    }
    return () => {
      resetUniversalTargetSheet();
    };
  }, [id]);

  const toggleOrg = (idx) =>
    setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }));

  const openReview = (sheetId, action, orgLabel) => {
    if (!sheetId) return;
    setReviewModal({ sheetId, action, orgLabel });
    setRemarks("");
  };

  const closeReview = () => {
    if (reviewSubmitting) return;
    setReviewModal(null);
    setRemarks("");
  };

  const submitReview = async () => {
    if (!reviewModal) return;
    const { sheetId, action } = reviewModal;
    // Remarks are required when rejecting
    if (action === "reject" && !remarks.trim()) {
      toast.error("Please add a remark before rejecting");
      return;
    }
    setReviewSubmitting(true);
    const res = await reviewTargetSheet(sheetId, {
      action,
      remarks: remarks.trim(),
    });
    setReviewSubmitting(false);
    if (res) {
      setReviewModal(null);
      setRemarks("");
      // Refresh to reflect the updated review status
      if (id) fetchUniversalTargetSheet(id);
    }
  };

  const data = universalTargetSheet;
  const employee = data?.employee;
  const summary = data?.summary;
  const quarterly = data?.quarterly ?? [];
  const monthly = data?.monthly ?? [];
  const organizations = data?.organizations ?? [];

  return (
    <div className="w-full min-h-screen pb-10">
      <BreadCrumb
        linkText={[
          { text: "Customer Visit Plan" },
          { text: "Target Sheet", href: "/admin/sales-executive/target-sheet" },
          { text: "Universal Target Sheet" },
        ]}
      />

      <div className="p-4 bg-white rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="text-3xl font-bold text-gray-800">
            Universal Target Sheet
          </h2>
          <button
            onClick={() => navigate("/admin/sales-executive/target-sheet")}
            className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all"
          >
            ← Back to Target Sheet
          </button>
        </div>
        <hr
          className="h-1 border-0 mb-6"
          style={{ backgroundColor: theme.secondaryColor }}
        />

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoaderSpinner />
          </div>
        ) : !data ? (
          <p className="text-center text-gray-500 py-8">
            No universal target sheet data found.
          </p>
        ) : (
          <>
            {/* Employee Info */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 border border-gray-200 rounded-xl bg-gray-100">
              <div>
                <span className="text-sm font-medium text-gray-700">Employee Name</span>
                <p className="text-lg font-semibold text-[#252C58]">{employee?.employeeName || "N/A"}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Designation</span>
                <p className="text-lg font-semibold text-[#252C58]">{employee?.designation || "N/A"}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Year</span>
                <p className="text-lg font-semibold text-[#252C58]">{data?.year || "N/A"}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Total Sheets</span>
                <p className="text-lg font-semibold text-[#252C58]">{data?.totalSheets ?? 0}</p>
              </div>
            </div>

            {/* Summary */}
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              <Stat label="Hospitals" value={summary?.hospitalCount ?? 0} />
              <Stat label="Individuals" value={summary?.individualCount ?? 0} />
              <Stat label="Products" value={summary?.annualProductCount ?? 0} />
              <Stat label="Target Qty" value={summary?.annualTargetQuantity ?? 0} />
              <Stat label="Achieved Qty" value={summary?.annualAchievedQuantity ?? 0} />
              <Stat label="Target Price" value={currency(summary?.annualTargetPrice)} />
              <Stat label="Achieved Price" value={currency(summary?.annualAchievedPrice)} />
              <Stat label="Achievement %" value={`${summary?.annualAchievementRate ?? 0}%`} />
            </div>
            {/* Quarterly Table */}
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Quarterly Target</h3>
            <div className="overflow-x-auto shadow rounded-t-2xl border border-gray-200 mb-8">
              <table className="min-w-full text-sm text-left text-gray-700 table-auto">
                <thead className="sticky top-0 z-10 uppercase bg-gray-100 border-b border-gray-300" style={{ backgroundColor: theme.secondaryColor }}>
                  <tr>
                    <th className="p-4 text-base font-semibold text-left">Quarter</th>
                    <th className="p-4 text-base font-semibold text-right">Target Qty</th>
                    <th className="p-4 text-base font-semibold text-right">Target Price</th>
                    <th className="p-4 text-base font-semibold text-right">Achieved Qty</th>
                    <th className="p-4 text-base font-semibold text-right">Achieved Price</th>
                    <th className="p-4 text-base font-semibold text-right">Achievement %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {quarterly.length > 0 ? (
                    quarterly.map((q, i) => (
                      <tr key={q?.quarter || i} className="hover:bg-gray-50 transition-all">
                        <td className="px-4 py-3 text-[15px] text-[#252C58]">{q?.quarter}</td>
                        <td className="px-4 py-3 text-[15px] text-right text-[#252C58]">{q?.targetQuantity ?? 0}</td>
                        <td className="px-4 py-3 text-[15px] text-right text-[#252C58]">{currency(q?.targetPrice)}</td>
                        <td className="px-4 py-3 text-[15px] text-right text-[#252C58]">{q?.achievedQuantity ?? 0}</td>
                        <td className="px-4 py-3 text-[15px] text-right text-[#252C58]">{currency(q?.achievedPrice)}</td>
                        <td className="px-4 py-3 text-[15px] text-right text-[#252C58]">{q?.achievementRate ?? 0}%</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-4 text-center text-gray-500">No quarterly data available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Monthly Table */}
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Monthly Target</h3>
            <div className="overflow-x-auto shadow rounded-t-2xl border border-gray-200 mb-8">
              <table className="min-w-full text-sm text-left text-gray-700 table-auto">
                <thead className="sticky top-0 z-10 uppercase bg-gray-100 border-b border-gray-300" style={{ backgroundColor: theme.secondaryColor }}>
                  <tr>
                    <th className="p-4 text-base font-semibold text-left">Month</th>
                    <th className="p-4 text-base font-semibold text-right">Target Qty</th>
                    <th className="p-4 text-base font-semibold text-right">Target Price</th>
                    <th className="p-4 text-base font-semibold text-right">Achieved Qty</th>
                    <th className="p-4 text-base font-semibold text-right">Achieved Price</th>
                    <th className="p-4 text-base font-semibold text-right">Achievement %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {monthly.length > 0 ? (
                    monthly.map((m, i) => (
                      <tr key={m?.monthNumber || i} className="hover:bg-gray-50 transition-all">
                        <td className="px-4 py-3 text-[15px] text-[#252C58]">{m?.month}</td>
                        <td className="px-4 py-3 text-[15px] text-right text-[#252C58]">{m?.targetQuantity ?? 0}</td>
                        <td className="px-4 py-3 text-[15px] text-right text-[#252C58]">{currency(m?.targetPrice)}</td>
                        <td className="px-4 py-3 text-[15px] text-right text-[#252C58]">{m?.achievedQuantity ?? 0}</td>
                        <td className="px-4 py-3 text-[15px] text-right text-[#252C58]">{currency(m?.achievedPrice)}</td>
                        <td className="px-4 py-3 text-[15px] text-right text-[#252C58]">{m?.achievementRate ?? 0}%</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-4 text-center text-gray-500">No monthly data available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Organizations */}
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Organizations ({organizations.length})
            </h3>
            {organizations.length > 0 ? (
              organizations.map((org, idx) => (
                <div
                  key={org?.sheetId || idx}
                  className="mb-6 border border-gray-200 rounded-xl overflow-hidden"
                >
                  {/* Org Header */}
                  <div className="p-4" style={{ backgroundColor: theme.secondaryColor }}>
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                      <h4 className="text-lg font-semibold text-[#252C58]">
                        {org?.organization || "N/A"}
                        {org?.individualName ? ` — ${org.individualName}` : ""}
                      </h4>
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          title="View individual wise target sheet"
                          aria-label="View individual wise target sheet"
                          onClick={() =>
                            navigate(
                              `/admin/sales-executive/target-sheet/individual-wise-target-sheet/${org?.sheetId}?salesId=${employee?._id ?? ""}`
                            )
                          }
                          className="flex items-center justify-center w-8 h-8 rounded-md bg-white/70 text-[#252C58] hover:bg-white transition-all"
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            openReview(
                              org?.sheetId,
                              "approve",
                              org?.organization || "N/A"
                            )
                          }
                          className="px-3 py-1 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 transition-all"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            openReview(
                              org?.sheetId,
                              "reject",
                              org?.organization || "N/A"
                            )
                          }
                          className="px-3 py-1 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 transition-all"
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleOrg(idx)}
                          className="flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-md bg-white/70 text-[#252C58] hover:bg-white transition-all"
                        >
                          {expanded[idx] ? "Collapse" : "Expand"}
                          {expanded[idx] ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Speciality</span>
                        <p className="text-base font-semibold text-[#252C58]">{org?.speciality || "N/A"}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">City</span>
                        <p className="text-base font-semibold text-[#252C58]">{org?.city || "N/A"}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Products</span>
                        <p className="text-base font-semibold text-[#252C58]">{org?.productCount ?? 0}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Achievement %</span>
                        <p className="text-base font-semibold text-[#252C58]">{org?.achievementRate ?? 0}%</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 pt-3 border-t border-gray-300">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Target Qty</span>
                        <p className="text-base font-semibold text-[#252C58]">{org?.targetQuantity ?? 0}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Target Price</span>
                        <p className="text-base font-semibold text-[#252C58]">{currency(org?.targetPrice)}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Achieved Qty</span>
                        <p className="text-base font-semibold text-[#252C58]">{org?.achievedQuantity ?? 0}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Achieved Price</span>
                        <p className="text-base font-semibold text-[#252C58]">{currency(org?.achievedPrice)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Products Table (expandable) */}
                  {expanded[idx] && (
                    <div className="overflow-x-auto border-t border-gray-200">
                      <table className="min-w-full text-sm text-left text-gray-700 table-auto">
                        <thead className="uppercase bg-gray-100 border-b border-gray-300">
                          <tr>
                            <th className="p-4 text-base font-semibold text-left">Product Type</th>
                            <th className="p-4 text-base font-semibold text-left">Product Name</th>
                            <th className="p-4 text-base font-semibold text-right">Price</th>
                            <th className="p-4 text-base font-semibold text-right">Target Qty</th>
                            <th className="p-4 text-base font-semibold text-right">Target Price</th>
                            <th className="p-4 text-base font-semibold text-right">Achieved Qty</th>
                            <th className="p-4 text-base font-semibold text-right">Achieved Price</th>
                            <th className="p-4 text-base font-semibold text-right">Achievement %</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {(org?.products || []).length > 0 ? (
                            org.products.map((p, pIdx) => (
                              <tr key={p?.productId || pIdx} className="hover:bg-gray-50 transition-all">
                                <td className="px-4 py-3 text-[15px] text-[#252C58]">{p?.productType || "N/A"}</td>
                                <td className="px-4 py-3 text-[15px] text-[#252C58]">{p?.name || "N/A"}</td>
                                <td className="px-4 py-3 text-[15px] text-right text-[#252C58]">{currency(p?.price)}</td>
                                <td className="px-4 py-3 text-[15px] text-right text-[#252C58]">{p?.targetQuantity ?? 0}</td>
                                <td className="px-4 py-3 text-[15px] text-right text-[#252C58]">{currency(p?.targetPrice)}</td>
                                <td className="px-4 py-3 text-[15px] text-right text-[#252C58]">{p?.achievedQuantity ?? 0}</td>
                                <td className="px-4 py-3 text-[15px] text-right text-[#252C58]">{currency(p?.achievedPrice)}</td>
                                <td className="px-4 py-3 text-[15px] text-right text-[#252C58]">{p?.achievementRate ?? 0}%</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="8" className="p-4 text-center text-gray-500">No products available.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-6">No organization data available.</p>
            )}
          </>
        )}
      </div>

      {/* Review Modal (Approve / Reject) */}
      {reviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
            <div
              className="px-5 py-4 flex items-center justify-between"
              style={{ backgroundColor: theme.secondaryColor }}
            >
              <h3 className="text-lg font-semibold text-[#252C58]">
                {reviewModal.action === "approve"
                  ? "Approve Target Sheet"
                  : "Reject Target Sheet"}
              </h3>
              <button
                type="button"
                onClick={closeReview}
                className="text-[#252C58] hover:text-black text-xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="p-5">
              <p className="text-sm text-gray-600 mb-4">
                Organization:{" "}
                <span className="font-semibold text-[#252C58]">
                  {reviewModal.orgLabel}
                </span>
              </p>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remarks
                {reviewModal.action === "reject" && (
                  <span className="text-red-600"> *</span>
                )}
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={4}
                placeholder={
                  reviewModal.action === "approve"
                    ? "Add a remark (optional)"
                    : "Add a reason for rejection"
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-[15px] text-[#252C58] outline-none focus:border-gray-400 resize-none"
              />

              <div className="flex justify-end gap-3 mt-5">
                <button
                  type="button"
                  onClick={closeReview}
                  disabled={reviewSubmitting}
                  className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitReview}
                  disabled={reviewSubmitting}
                  className={`px-4 py-2 text-sm font-medium rounded-md text-white transition-all disabled:opacity-60 ${
                    reviewModal.action === "approve"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {reviewSubmitting
                    ? "Submitting..."
                    : reviewModal.action === "approve"
                    ? "Approve"
                    : "Reject"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUniversalTargetSheet;
