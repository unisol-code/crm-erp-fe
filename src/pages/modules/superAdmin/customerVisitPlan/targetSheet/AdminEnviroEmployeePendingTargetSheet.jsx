import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb.jsx";
import { useTheme } from "../../../../../hooks/theme/useTheme.js";
import useEnviroAdminTargetSheet from "../../../../../hooks/superAdminHook/customerVisitPlan/targetSheet/useEnviroAdminTargetSheet.js";
import LoaderSpinner from "../../../../../components/uiComponents/loader/LoaderSpinner.jsx";

const statusColor = (status = "") => {
  const s = status.toLowerCase();
  if (s.includes("reject")) return "bg-red-100 text-red-700";
  if (s.includes("approv")) return "bg-green-100 text-green-700";
  if (s.includes("pending")) return "bg-yellow-100 text-yellow-700";
  return "bg-gray-100 text-gray-600";
};

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-IN");
};

const AdminEnviroEmployeePendingTargetSheet = () => {
  const { id } = useParams();
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState({});
  const [reviewModal, setReviewModal] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const {
    loading,
    enviroAdminMyApprovalQueue,
    fetchEnviroAdminMyApprovalQueue,
    resetEnviroAdminMyApprovalQueue,
    reviewEnviroTargetSheet,
  } = useEnviroAdminTargetSheet();

  useEffect(() => {
    if (id) {
      fetchEnviroAdminMyApprovalQueue({ _id: id });
    }
    return () => {
      resetEnviroAdminMyApprovalQueue();
    };
  }, [id]);

  const toggleSheet = (idx) =>
    setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }));

  const openReview = (sheetId, action) => {
    if (!sheetId) return;
    setReviewModal({ sheetId, action });
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
    if (action === "reject" && !remarks.trim()) {
      toast.error("Please add a remark before rejecting");
      return;
    }
    setReviewSubmitting(true);
    const res = await reviewEnviroTargetSheet(sheetId, {
      action,
      remarks: remarks.trim(),
    });
    setReviewSubmitting(false);
    if (res) {
      setReviewModal(null);
      setRemarks("");
      if (id) fetchEnviroAdminMyApprovalQueue({ _id: id });
    }
  };

  const data = enviroAdminMyApprovalQueue;
  const sheets = data?.data ?? [];

  return (
    <div className="w-full min-h-screen pb-10">
      <BreadCrumb
        linkText={[
          { text: "Customer Visit Plan" },
          { text: "Target Sheet", href: "/admin/sales-executive/target-sheet" },
          { text: "Enviro Employee Pending Approval" },
        ]}
      />

      <div className="p-4 bg-white rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-gray-800">
            Enviro Employee Pending Approval
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 border border-gray-200 rounded-xl bg-gray-100">
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Employee ID
                </span>
                <p className="text-lg font-semibold text-[#252C58]">
                  {data?._id || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Total Sheet Count
                </span>
                <p className="text-lg font-semibold text-[#252C58]">
                  {data?.count ?? "N/A"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Pending Count
                </span>
                <p className="text-lg font-semibold text-[#252C58]">
                  {data?.pendingCount ?? "N/A"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Awaiting
                </span>
                <p className="text-lg font-semibold text-[#252C58]">
                  {data?.awaiting || "N/A"}
                </p>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Pending Approval Sheets ({sheets.length})
            </h3>
            {sheets.length > 0 ? (
              sheets.map((sheet, sheetIdx) => {
                return (
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
                          <span className="text-sm font-medium text-gray-700">
                            Sheet Type
                          </span>
                          <p className="text-base font-semibold text-[#252C58]">
                            {sheet?.sheetType || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">
                            Segment
                          </span>
                          <p className="text-base font-semibold text-[#252C58]">
                            {sheet?.segment || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">
                            Financial Year
                          </span>
                          <p className="text-base font-semibold text-[#252C58]">
                            {sheet?.financialYear || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">
                            Target Basis
                          </span>
                          <p className="text-base font-semibold text-[#252C58]">
                            {sheet?.targetBasis || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">
                            Individual Name
                          </span>
                          <p className="text-base font-semibold text-[#252C58]">
                            {sheet?.individualName || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">
                            City / Town / Village
                          </span>
                          <p className="text-base font-semibold text-[#252C58]">
                            {sheet?.cityTownVillage || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">
                            Sales Person
                          </span>
                          <p className="text-base font-semibold text-[#252C58]">
                            {sheet?.salesPersonName || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">
                            Status
                          </span>
                          <p className={`text-base font-semibold ${statusColor(sheet?.status)}`}>
                            {sheet?.status?.replace(/_/g, " ") || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">
                            Submitted At
                          </span>
                          <p className="text-base font-semibold text-[#252C58]">
                            {formatDate(sheet?.submittedAt)}
                          </p>
                        </div>
                        {sheet?.organizationName && (
                          <div>
                            <span className="text-sm font-medium text-gray-700">
                              Organization
                            </span>
                            <p className="text-base font-semibold text-[#252C58]">
                              {sheet.organizationName}
                            </p>
                          </div>
                        )}
                        {sheet?.projectName && (
                          <div>
                            <span className="text-sm font-medium text-gray-700">
                              Project
                            </span>
                            <p className="text-base font-semibold text-[#252C58]">
                              {sheet.projectName}
                            </p>
                          </div>
                        )}
                        {sheet?.projectType && (
                          <div>
                            <span className="text-sm font-medium text-gray-700">
                              Project Type
                            </span>
                            <p className="text-base font-semibold text-[#252C58]">
                              {sheet.projectType}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {expanded[sheetIdx] && (
                      <div className="p-4 border-t border-gray-200 bg-gray-50">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-xs font-medium text-gray-500">
                              Sheet ID
                            </span>
                            <p className="text-[#252C58]">{sheet?._id || "N/A"}</p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-500">
                              Sales ID
                            </span>
                            <p className="text-[#252C58]">{sheet?.sales_id || "N/A"}</p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-500">
                              Created At
                            </span>
                            <p className="text-[#252C58]">{formatDate(sheet?.createdAt)}</p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-500">
                              Updated At
                            </span>
                            <p className="text-[#252C58]">{formatDate(sheet?.updatedAt)}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
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

export default AdminEnviroEmployeePendingTargetSheet;
