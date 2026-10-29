import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { toast } from "react-toastify";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb.jsx";
import { useTheme } from "../../../../../hooks/theme/useTheme.js";
import useCompany from "../../../../../hooks/common/useCompany.js";
import useTargetSheet from "../../../../../hooks/salesExecutiveHook/customerVisitPlan/useTaregtSheet.js";
import LoaderSpinner from "../../../../../components/uiComponents/loader/LoaderSpinner.jsx";
import { universalTargetSheetStateAtom } from "../../../../../state/salesExecutiveState/customerVisitPlan/targetSheetState";
import { useRecoilValue } from "recoil";

const currency = (val) =>
  val != null ? `₹ ${Number(val).toLocaleString("en-IN")}` : "₹ 0";

const statusColor = (status = "") => {
  const s = status.toLowerCase();
  if (s.includes("reject")) return "bg-red-100 text-red-700";
  if (s.includes("pending")) return "bg-yellow-100 text-yellow-700";
  if (s.includes("approv")) return "bg-green-100 text-green-700";
  return "bg-gray-100 text-gray-600";
};

const formatStatus = (status) =>
  status ? String(status).replace(/_/g, " ") : "N/A";

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

const TeamWiseUniversalTargetSheet = () => {
  const { theme } = useTheme();
  const { isEnviroSolution } = useCompany();
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    universalTargetSheet,
    loading,
    fetchUniversalTargetSheet,
    resetUniversalTargetSheet,
    reviewTargetSheet,
  } = useTargetSheet();

  const data = useRecoilValue(universalTargetSheetStateAtom);

  const [expanded, setExpanded] = useState({});
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

  const openReview = (sheetId, action) => {
    if (!sheetId) return;
    setReviewModal({ sheetId, action });
    setRemarks("");
  };

  const closeReview = () => {
    setReviewModal(null);
    setRemarks("");
  };

  const submitReview = async () => {
    if (!reviewModal) return;
    const { sheetId, action } = reviewModal;
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
      closeReview();
      if (id) fetchUniversalTargetSheet(id);
    }
  };

  const monthly = data?.monthly ?? [];
  const quarterly = data?.quarterly ?? [];
  const individuals = data?.individuals ?? [];

  const totalTargetQty = monthly.reduce((a, m) => a + (m.targetQuantity ?? 0), 0);
  const totalTargetPrice = monthly.reduce((a, m) => a + (m.targetPrice ?? 0), 0);
  const totalAchievedQty = monthly.reduce((a, m) => a + (m.achievedQuantity ?? 0), 0);
  const totalAchievedPrice = monthly.reduce((a, m) => a + (m.achievedPrice ?? 0), 0);

  return (
    <div className="w-full min-h-screen pb-10">
      <BreadCrumb
        linkText={[
          { text: "Customer Visit Plan" },
          { text: "Target Sheet", href: "/sales-executive/target-sheet" },
          { text: "Universal Target Sheet" },
        ]}
      />

      <div className="p-4 bg-white rounded-2xl">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="text-3xl font-bold text-gray-800">
            Universal Target Sheet
          </h2>
          <button
            onClick={() => navigate("/sales-executive/target-sheet")}
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <Stat label="Target Qty" value={totalTargetQty} />
              <Stat label="Target Price" value={currency(totalTargetPrice)} />
              <Stat label="Achieved Qty" value={totalAchievedQty} />
              <Stat label="Achieved Price" value={currency(totalAchievedPrice)} />
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Monthly</h3>
            <div className="overflow-x-auto border border-gray-200 rounded-xl mb-8">
              <table className="min-w-full text-sm text-left text-gray-700 table-auto">
                <thead className="uppercase bg-gray-100 border-b border-gray-300">
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
                  {monthly.map((m, i) => (
                    <tr key={i}>
                      <td className="p-4">{m.month}</td>
                      <td className="p-4 text-right">{m.targetQuantity ?? 0}</td>
                      <td className="p-4 text-right">{currency(m.targetPrice)}</td>
                      <td className="p-4 text-right">{m.achievedQuantity ?? 0}</td>
                      <td className="p-4 text-right">{currency(m.achievedPrice)}</td>
                      <td className="p-4 text-right">{m.achievementRate ?? 0}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Quarterly</h3>
            <div className="overflow-x-auto border border-gray-200 rounded-xl mb-8">
              <table className="min-w-full text-sm text-left text-gray-700 table-auto">
                <thead className="uppercase bg-gray-100 border-b border-gray-300">
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
                  {quarterly.map((q, i) => (
                    <tr key={i}>
                      <td className="p-4">{q.quarter}</td>
                      <td className="p-4 text-right">{q.targetQuantity ?? 0}</td>
                      <td className="p-4 text-right">{currency(q.targetPrice)}</td>
                      <td className="p-4 text-right">{q.achievedQuantity ?? 0}</td>
                      <td className="p-4 text-right">{currency(q.achievedPrice)}</td>
                      <td className="p-4 text-right">{q.achievementRate ?? 0}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Individuals ({individuals.length})
            </h3>
            {individuals.length > 0 ? (
              individuals.map((ind, idx) => (
                <div
                  key={ind?.sheetId || idx}
                  className="mb-4 border border-gray-200 rounded-xl overflow-hidden"
                >
                  <div
                    className="p-4 flex items-center justify-between flex-wrap gap-2"
                    style={{ backgroundColor: theme.secondaryColor }}
                  >
                    <div>
                      <h4 className="text-lg font-semibold text-[#252C58]">
                        {ind?.individualName || "N/A"}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {ind?.organization || "N/A"} — {ind?.city || "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-block px-3 py-1 text-sm font-semibold rounded-md ${statusColor(
                          ind?.status
                        )}`}
                      >
                        {formatStatus(ind?.status)}
                      </span>
                      {ind?.status?.toLowerCase().includes("pending") && (
                        <>
                          <button
                            type="button"
                            onClick={() => openReview(ind?.sheetId, "approve")}
                            className="px-3 py-1 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 transition-all disabled:opacity-60"
                            disabled={reviewSubmitting}
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => openReview(ind?.sheetId, "reject")}
                            className="px-3 py-1 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 transition-all disabled:opacity-60"
                            disabled={reviewSubmitting}
                          >
                            Reject
                          </button>
                        </>
                      )}
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

                  <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Speciality</span>
                      <p className="text-base font-semibold text-[#252C58]">{ind?.speciality || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Product Count</span>
                      <p className="text-base font-semibold text-[#252C58]">{ind?.productCount ?? 0}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Target Qty</span>
                      <p className="text-base font-semibold text-[#252C58]">{ind?.totals?.targetQuantity ?? 0}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Target Price</span>
                      <p className="text-base font-semibold text-[#252C58]">{currency(ind?.totals?.targetPrice)}</p>
                    </div>
                  </div>

                  {expanded[idx] && (
                    <div className="overflow-x-auto border-t border-gray-200">
                      <table className="min-w-full text-sm text-left text-gray-700 table-auto">
                        <thead className="uppercase bg-gray-100 border-b border-gray-300">
                          <tr>
                            <th className="p-4 text-base font-semibold text-left">Product Type</th>
                            <th className="p-4 text-base font-semibold text-left">Product Name</th>
                            <th className="p-4 text-base font-semibold text-right">Price</th>
                            <th className="p-4 text-base font-semibold text-right">Qty</th>
                            <th className="p-4 text-base font-semibold text-right">Target Price</th>
                            <th className="p-4 text-base font-semibold text-right">Achieved Price</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {(ind?.products ?? []).map((p, pi) => (
                            <tr key={p?.productId || pi}>
                              <td className="p-4">{p?.productType || "-"}</td>
                              <td className="p-4">{p?.name || "-"}</td>
                              <td className="p-4 text-right">{currency(p?.price)}</td>
                              <td className="p-4 text-right">{p?.enteredQuantity ?? "-"}</td>
                              <td className="p-4 text-right">{currency(p?.totals?.targetPrice)}</td>
                              <td className="p-4 text-right">{currency(p?.totals?.achievedPrice)}</td>
                            </tr>
                          ))}
                          {(ind?.products ?? []).length === 0 && (
                            <tr>
                              <td colSpan={6} className="p-4 text-center text-gray-500">
                                No products found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">
                No individuals found.
              </p>
            )}
          </>
        )}
      </div>

      {reviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-5 py-4 flex items-center justify-between" style={{ backgroundColor: theme.secondaryColor }}>
              <h3 className="text-lg font-semibold text-[#252C58]">
                {reviewModal.action === "approve" ? "Approve Target Sheet" : "Reject Target Sheet"}
              </h3>
              <button type="button" onClick={closeReview} className="text-[#252C58] hover:text-black text-xl leading-none">
                ×
              </button>
            </div>
            <div className="p-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remarks
                {reviewModal.action === "reject" && <span className="text-red-600"> *</span>}
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

export default TeamWiseUniversalTargetSheet;
