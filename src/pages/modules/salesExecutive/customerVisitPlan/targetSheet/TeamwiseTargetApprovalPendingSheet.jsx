import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb.jsx";
import { useTheme } from "../../../../../hooks/theme/useTheme.js";
import useCompany from "../../../../../hooks/common/useCompany.js";
import useTargetSheet from "../../../../../hooks/salesExecutiveHook/customerVisitPlan/useTaregtSheet.js";
import LoaderSpinner from "../../../../../components/uiComponents/loader/LoaderSpinner.jsx";
import { teamWiseTargetQueueStateAtom } from "../../../../../state/salesExecutiveState/customerVisitPlan/targetSheetState";
import { useRecoilValue } from "recoil";

const QUARTERS = ["Quarter1", "Quarter2", "Quarter3", "Quarter4"];

const currency = (val) =>
  val != null ? `₹ ${Number(val).toLocaleString("en-IN")}` : "₹ 0";

const statusColor = (status = "") => {
  const s = status.toLowerCase();
  if (s.includes("reject")) return "bg-red-100 text-red-700";
  if (s.includes("pending")) return "bg-yellow-100 text-yellow-700";
  if (s.includes("approv")) return "bg-green-100 text-green-700";
  return "bg-gray-100 text-gray-600";
};

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-IN");
};

const TeamwiseTargetApprovalPendingSheet = () => {
  const { theme } = useTheme();
  const { isEnviroSolution, isCompanyLoaded } = useCompany();
  const navigate = useNavigate();
  const {
    loading,
    teamWiseTargetQueue,
    fetchTeamWiseTargetQueue,
    reviewTargetSheet,
    resetTeamWiseTargetQueue,
  } = useTargetSheet();

  const queueData = useRecoilValue(teamWiseTargetQueueStateAtom);

  const [expanded, setExpanded] = useState({});
  const [reviewModal, setReviewModal] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    if (isCompanyLoaded && !isEnviroSolution) {
      fetchTeamWiseTargetQueue();
    }
    return () => {
      resetTeamWiseTargetQueue();
    };
  }, [isEnviroSolution, isCompanyLoaded]);

  const toggleSheet = (idx) =>
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
      fetchTeamWiseTargetQueue();
    }
  };

  const data = queueData;
  const sheets = data?.data ?? [];

  const sheetTotalPrice = (sheet) => {
    return (sheet?.products ?? []).reduce((acc, p) => {
      const q = p?.achievement?.Quarter1?.QuarterTargetPrice ?? 0;
      return acc + (p?.overAllTargetPrice ?? 0);
    }, 0);
  };

  return (
    <div className="w-full min-h-screen pb-10">
      <BreadCrumb
        linkText={[
          { text: "Customer Visit Plan" },
          { text: "Target Sheet", href: "/sales-executive/target-sheet" },
          { text: "Pending Approval" },
        ]}
      />

      <div className="p-4 bg-white rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-gray-800">
            Teamwise Pending Approval
          </h2>
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
            No approval queue data found.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 border border-gray-200 rounded-xl bg-gray-100">
              <div>
                <span className="text-sm font-medium text-gray-600">Total Sheets</span>
                <p className="text-lg font-semibold text-[#252C58]">{data?.count ?? sheets.length}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Sheets</span>
                <p className="text-lg font-semibold text-[#252C58]">{sheets.length}</p>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Pending Approval Sheets ({sheets.length})
            </h3>
            {sheets.length > 0 ? (
              sheets.map((sheet, sheetIdx) => (
                <div
                  key={sheet?._id || sheetIdx}
                  className="mb-6 border border-gray-200 rounded-xl overflow-hidden"
                >
                  <div className="p-4" style={{ backgroundColor: theme.secondaryColor }}>
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                      <h4 className="text-lg font-semibold text-[#252C58]">
                        Sheet #{sheetIdx + 1}
                      </h4>
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => openReview(sheet?._id, "approve")}
                          className="px-3 py-1 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 transition-all disabled:opacity-60"
                          disabled={reviewSubmitting}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => openReview(sheet?._id, "reject")}
                          className="px-3 py-1 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 transition-all disabled:opacity-60"
                          disabled={reviewSubmitting}
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleSheet(sheetIdx)}
                          className="flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-md bg-white/70 text-[#252C58] hover:bg-white transition-all"
                        >
                          {expanded[sheetIdx] ? "Collapse" : "Expand"}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Individual</span>
                        <p className="text-base font-semibold text-[#252C58]">
                          {sheet?.individualName || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Organization</span>
                        <p className="text-base font-semibold text-[#252C58]">
                          {sheet?.organization || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">City</span>
                        <p className="text-base font-semibold text-[#252C58]">
                          {sheet?.city || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Financial Year</span>
                        <p className="text-base font-semibold text-[#252C58]">
                          {sheet?.year || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Status</span>
                        <p className={`text-base font-semibold ${statusColor(sheet?.status)}`}>
                          {sheet?.status?.replace(/_/g, " ") || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Submitted At</span>
                        <p className="text-base font-semibold text-[#252C58]">
                          {formatDate(sheet?.submittedAt)}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Target Price</span>
                        <p className="text-base font-semibold text-[#252C58]">
                          {currency(sheetTotalPrice(sheet))}
                        </p>
                      </div>
                    </div>
                  </div>

                  {expanded[sheetIdx] && (
                    <div className="overflow-x-auto border-t border-gray-200">
                      <table className="min-w-full text-sm text-left text-gray-700 table-auto">
                        <thead className="uppercase bg-gray-100 border-b border-gray-300">
                          <tr>
                            <th className="p-4 text-base font-semibold text-left">Product Type</th>
                            <th className="p-4 text-base font-semibold text-left">Product Name</th>
                            <th className="p-4 text-base font-semibold text-right">Price</th>
                            <th className="p-4 text-base font-semibold text-right">Qty</th>
                            <th className="p-4 text-base font-semibold text-right">Target Price</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {(sheet?.products ?? []).map((p, pi) => (
                            <tr key={p?._id || pi}>
                              <td className="p-4">{p?.productType || "-"}</td>
                              <td className="p-4">{p?.name || "-"}</td>
                              <td className="p-4 text-right">{currency(p?.price)}</td>
                              <td className="p-4 text-right">{p?.enteredQuantity ?? "-"}</td>
                              <td className="p-4 text-right">{currency(p?.overAllTargetPrice)}</td>
                            </tr>
                          ))}
                          {(sheet?.products ?? []).length === 0 && (
                            <tr>
                              <td colSpan={5} className="p-4 text-center text-gray-500">
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
              <p className="text-center text-gray-500 py-6">
                No pending approval sheets available.
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
              <button
                type="button"
                onClick={closeReview}
                className="text-[#252C58] hover:text-black text-xl leading-none"
              >
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

export default TeamwiseTargetApprovalPendingSheet;
