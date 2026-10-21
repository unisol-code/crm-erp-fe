import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb.jsx";
import { useTheme } from "../../../../../hooks/theme/useTheme.js";
import useAdminTargetSheet from "../../../../../hooks/superAdminHook/customerVisitPlan/targetSheet/useAdminTargetSheet.js";
import LoaderSpinner from "../../../../../components/uiComponents/loader/LoaderSpinner.jsx";

const QUARTERS = ["Quarter1", "Quarter2", "Quarter3", "Quarter4"];

const currency = (val) =>
  val != null
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(val)
    : "0";

const statusColor = (status = "") => {
  const s = status.toLowerCase();
  if (s.includes("reject")) return "bg-red-100 text-red-700";
  if (s.includes("approv")) return "bg-green-100 text-green-700";
  if (s.includes("pending")) return "bg-yellow-100 text-yellow-700";
  return "bg-gray-100 text-gray-600";
};

const AdminApprovalPendingEMpSheet = () => {
  const { theme } = useTheme();
  const [searchParams] = useSearchParams();
  const employeeId = searchParams.get("employeeId");

  const {
    myApprovalQueue,
    loading,
    fetchMyApprovalQueue,
    resetMyApprovalQueue,
    reviewTargetSheet,
  } = useAdminTargetSheet();

  const [expanded, setExpanded] = useState({});
  // Review modal state: null or { sheetId, action: "approve" | "reject", orgLabel }
  const [reviewModal, setReviewModal] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    if (employeeId) {
      fetchMyApprovalQueue({ employeeId });
    }
    return () => {
      resetMyApprovalQueue();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);

  const toggleSheet = (idx) =>
    setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }));

  const toggleProduct = (sheetIdx, prodIdx) =>
    setExpanded((prev) => ({ ...prev, [`${sheetIdx}-${prodIdx}`]: !prev[`${sheetIdx}-${prodIdx}`] }));

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
    const res = await reviewTargetSheet(sheetId, {
      action,
      remarks: remarks.trim(),
    });
    setReviewSubmitting(false);
    if (res) {
      setReviewModal(null);
      setRemarks("");
      // Refresh to reflect the updated review status
      if (employeeId) fetchMyApprovalQueue({ employeeId });
    }
  };

  const data = myApprovalQueue;
  const sheets = data?.data ?? [];
  const summaryByYear = data?.summaryByYear ?? [];

  return (
    <div className="w-full min-h-screen pb-10">
      <BreadCrumb
        linkText={[
          { text: "Customer Visit Plan" },
          { text: "Target Sheet", href: "/admin/sales-executive/target-sheet" },
          { text: "My Approval Queue" },
        ]}
      />

      <div className="p-4 bg-white rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-gray-800">
            My Approval Queue
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
            {/* Sheet Info */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 border border-gray-200 rounded-xl bg-gray-100">
              <div>
                <span className="text-sm font-medium text-gray-600">Employee ID</span>
                <p className="text-lg font-semibold text-[#252C58]">{data?.employeeId || "N/A"}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Total Sheet Count</span>
                <p className="text-lg font-semibold text-[#252C58]">{data?.totalSheetCount || "N/A"}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Pending Sheet Count</span>
                <p className="text-lg font-semibold text-[#252C58]">{data?.pendingSheetCount || "N/A"}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Count</span>
                <p className="text-lg font-semibold text-[#252C58]">{data?.count || "N/A"}</p>
              </div>
            </div>

            {/* Summary By Year */}
            {summaryByYear.length > 0 && (
              <div className="mb-8 border border-gray-200 rounded-xl overflow-hidden">
                <div className="p-4" style={{ backgroundColor: theme.secondaryColor }}>
                  <h3 className="text-lg font-semibold text-[#252C58]">Summary By Year</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-left text-gray-700 table-auto">
                    <thead className="uppercase bg-gray-100 border-b border-gray-300">
                      <tr>
                        <th className="p-4 text-base font-semibold text-left">Year</th>
                        <th className="p-4 text-base font-semibold text-left">Organization Count</th>
                        <th className="p-4 text-base font-semibold text-left">Product Count</th>
                        <th className="p-4 text-base font-semibold text-left">Individual Count</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {summaryByYear.map((yearItem, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-all">
                          <td className="px-4 py-3 text-[15px] text-[#252C58]">{yearItem?.year || "N/A"}</td>
                          <td className="px-4 py-3 text-[15px] text-[#252C58]">{yearItem?.organizationCount ?? 0}</td>
                          <td className="px-4 py-3 text-[15px] text-[#252C58]">{yearItem?.productCount ?? 0}</td>
                          <td className="px-4 py-3 text-[15px] text-[#252C58]">{yearItem?.individualCount ?? 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Approval Queue Sheets */}
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Pending Approval Sheets ({sheets.length})
            </h3>
            {sheets.length > 0 ? (
              sheets.map((sheet, sheetIdx) => {
                const products = sheet?.products ?? [];
                const approvalsList = sheet?.approvals ?? {};

                const totalTargetQuantity = products.reduce(
                  (acc, p) => acc + (p?.enteredQuantity ?? 0),
                  0
                );
                const totalTargetPrice = products.reduce(
                  (acc, p) => acc + (p?.overAllTargetPrice ?? 0),
                  0
                );

                return (
                  <div
                    key={sheet?._id || sheetIdx}
                    className="mb-6 border border-gray-200 rounded-xl overflow-hidden"
                  >
                    {/* Sheet Header */}
                    <div className="p-4" style={{ backgroundColor: theme.secondaryColor }}>
                      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                        <h4 className="text-lg font-semibold text-[#252C58]">
                          Sheet #{sheetIdx + 1}
                        </h4>
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() =>
                              openReview(sheet?._id, "approve")
                            }
                            className="px-3 py-1 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 transition-all disabled:opacity-60"
                            disabled={reviewSubmitting}
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              openReview(sheet?._id, "reject")
                            }
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
                          <span className="text-sm font-medium text-gray-700">Organization</span>
                          <p className="text-base font-semibold text-[#252C58]">{sheet?.organization || "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Individual Name</span>
                          <p className="text-base font-semibold text-[#252C58]">{sheet?.individualName || "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Speciality</span>
                          <p className="text-base font-semibold text-[#252C58]">{sheet?.speciality || "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Type of Surgery</span>
                          <p className="text-base font-semibold text-[#252C58]">{sheet?.typeOfSurgeryPerformed || "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Org Code</span>
                          <p className="text-base font-semibold text-[#252C58]">{sheet?.uniqueCodeOrganization || "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Individual Code</span>
                          <p className="text-base font-semibold text-[#252C58]">{sheet?.uniqueCodeIndividual || "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">City</span>
                          <p className="text-base font-semibold text-[#252C58]">{sheet?.city || "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Year</span>
                          <p className="text-base font-semibold text-[#252C58]">{sheet?.year || "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Status</span>
                          <p className="text-base font-semibold text-[#252C58]">{sheet?.status?.replace(/_/g, " ") || "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Frozen</span>
                          <p className="text-base font-semibold text-[#252C58]">{sheet?.isFrozen ? "Yes" : "No"}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Products</span>
                          <p className="text-base font-semibold text-[#252C58]">{products.length}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Total Quantity</span>
                          <p className="text-base font-semibold text-[#252C58]">{totalTargetQuantity}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Total Target Price</span>
                          <p className="text-base font-semibold text-[#252C58]">{currency(totalTargetPrice)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Expanded: Approvals + Products */}
                    {expanded[sheetIdx] && (
                      <div className="p-4 border-t border-gray-200">
                        {/* Approvals */}
                        {Object.keys(approvalsList).length > 0 && (
                          <div className="mb-6">
                            <h5 className="text-base font-semibold text-gray-800 mb-3">
                              Approvals
                            </h5>
                            <div className="overflow-x-auto">
                              <table className="min-w-full text-sm text-left text-gray-700 table-auto">
                                <thead className="uppercase bg-gray-100 border-b border-gray-300">
                                  <tr>
                                    <th className="p-4 text-base font-semibold text-left">Role</th>
                                    <th className="p-4 text-base font-semibold text-left">Status</th>
                                    <th className="p-4 text-base font-semibold text-left">Remarks</th>
                                    <th className="p-4 text-base font-semibold text-left">Action Date</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {Object.entries(approvalsList).map(([role, a]) => (
                                    <tr key={role} className="hover:bg-gray-50 transition-all">
                                      <td className="px-4 py-3 text-[15px] text-[#252C58]">{role}</td>
                                      <td className="px-4 py-3 text-[15px]">
                                        <span className={`inline-block px-2 py-1 rounded text-sm font-semibold ${statusColor(a?.status)}`}>
                                          {a?.status || "N/A"}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3 text-[15px] text-[#252C58]">{a?.remarks || "-"}</td>
                                      <td className="px-4 py-3 text-[15px] text-[#252C58]">
                                        {a?.actionDate ? new Date(a.actionDate).toLocaleString("en-IN") : "-"}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {/* Products */}
                        <h5 className="text-base font-semibold text-gray-800 mb-3">
                          Products ({products.length})
                        </h5>
                        {products.length > 0 ? (
                          products.map((product, prodIdx) => {
                            const achievement = product?.achievement || {};
                            return (
                              <div
                                key={product?._id || prodIdx}
                                className="mb-4 border border-gray-200 rounded-xl overflow-hidden"
                              >
                                {/* Product Header */}
                                <div className="p-3" style={{ backgroundColor: theme.secondaryColor }}>
                                  <div className="flex items-center justify-between mb-2">
                                    <h6 className="text-sm font-semibold text-[#252C58]">
                                      {product?.name || "N/A"}
                                      {product?.productType ? ` — ${product.productType}` : ""}
                                    </h6>
                                    <button
                                      type="button"
                                      onClick={() => toggleProduct(sheetIdx, prodIdx)}
                                      className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-white/70 text-[#252C58] hover:bg-white transition-all"
                                    >
                                      {expanded[`${sheetIdx}-${prodIdx}`] ? "Collapse" : "Expand"}
                                    </button>
                                  </div>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div>
                                      <span className="text-xs font-medium text-gray-700">Price</span>
                                      <p className="text-sm font-semibold text-[#252C58]">{currency(product?.price)}</p>
                                    </div>
                                    <div>
                                      <span className="text-xs font-medium text-gray-700">Entered Quantity</span>
                                      <p className="text-sm font-semibold text-[#252C58]">{product?.enteredQuantity ?? 0}</p>
                                    </div>
                                    <div>
                                      <span className="text-xs font-medium text-gray-700">Over All Target Price</span>
                                      <p className="text-sm font-semibold text-[#252C58]">{currency(product?.overAllTargetPrice)}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Expanded: Achievement Table */}
                                {expanded[`${sheetIdx}-${prodIdx}`] && (
                                  <div className="p-3 border-t border-gray-200">
                                    <div className="overflow-x-auto">
                                      <table className="min-w-full text-sm text-left text-gray-700 table-auto">
                                        <thead
                                          className="sticky top-0 z-10 text-xs uppercase bg-gray-100 border-b border-gray-300"
                                          style={{ backgroundColor: theme.secondaryColor }}
                                        >
                                          <tr>
                                            <th className="p-3 text-base font-semibold text-center">Quarter</th>
                                            <th className="p-3 text-base font-semibold text-center">Month</th>
                                            <th className="p-3 text-base font-semibold text-center">Target Quantity</th>
                                            <th className="p-3 text-base font-semibold text-center">Target Price</th>
                                            <th className="p-3 text-base font-semibold text-center">Achievement Quantity</th>
                                            <th className="p-3 text-base font-semibold text-center">Achievement Price</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                          {QUARTERS.map((q, qIdx) => {
                                            const qData = achievement?.[q];
                                            if (!qData) return null;
                                            const monthKeys = Object.keys(qData).filter(
                                              (k) => !k.startsWith("Quarter")
                                            );
                                            const hasMonths = monthKeys.length > 0;
                                            return (
                                              <React.Fragment key={q}>
                                                {hasMonths ? (
                                                  monthKeys.map((month, mIdx) => {
                                                    const mData = qData[month];
                                                    return (
                                                      <tr key={month} className="hover:bg-gray-50 transition-all">
                                                        {mIdx === 0 && (
                                                          <td
                                                            className="p-3 text-center text-[17px] font-normal text-[#252C58] align-middle"
                                                            rowSpan={monthKeys.length}
                                                          >
                                                            {`Q${qIdx + 1}`}
                                                          </td>
                                                        )}
                                                        <td className="px-3 py-3 text-[17px] font-normal text-center text-[#252C58]">{month}</td>
                                                        <td className="p-3 text-[17px] font-normal text-center text-[#252C58]">{mData?.targetQuantity ?? 0}</td>
                                                        <td className="p-3 text-[17px] font-normal text-center text-[#252C58]">{currency(mData?.targetPrice)}</td>
                                                        <td className="p-3 text-[17px] font-normal text-center text-[#252C58]">{mData?.targetAchievementQuantity ?? 0}</td>
                                                        <td className="p-3 text-[17px] font-normal text-center text-[#252C58]">{currency(mData?.targetAchievementPrice)}</td>
                                                      </tr>
                                                    );
                                                  })
                                                ) : (
                                                  <tr className="hover:bg-gray-50 transition-all">
                                                    <td className="p-3 text-center text-[17px] font-normal text-[#252C58] align-middle" colSpan="2">{`Q${qIdx + 1}`}</td>
                                                    <td className="p-3 text-[17px] font-normal text-center text-[#252C58]">{qData?.QuarterTargetQuantity ?? 0}</td>
                                                    <td className="p-3 text-[17px] font-normal text-center text-[#252C58]">{currency(qData?.QuarterTargetPrice)}</td>
                                                    <td className="p-3 text-[17px] font-normal text-center text-[#252C58]">{qData?.QuarterAchievementQuantity ?? 0}</td>
                                                    <td className="p-3 text-[17px] font-normal text-center text-[#252C58]">{currency(qData?.QuarterAchievementPrice)}</td>
                                                  </tr>
                                                )}

                                                {/* Quarter Summary Row */}
                                                <tr className="bg-gray-300 font-semibold">
                                                  <td className="p-3 text-center text-[17px] font-semibold text-[#252C58] align-middle" colSpan="2">{`Q${qIdx + 1} Summary`}</td>
                                                  <td className="p-3 text-[17px] font-semibold text-center text-[#252C58]">{qData?.QuarterTargetQuantity ?? 0}</td>
                                                  <td className="p-3 text-[17px] font-semibold text-center text-[#252C58]">{currency(qData?.QuarterTargetPrice)}</td>
                                                  <td className="p-3 text-[17px] font-semibold text-center text-[#252C58]">{qData?.QuarterAchievementQuantity ?? 0}</td>
                                                  <td className="p-3 text-[17px] font-semibold text-center text-[#252C58]">{currency(qData?.QuarterAchievementPrice)}</td>
                                                </tr>
                                              </React.Fragment>
                                            );
                                          })}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-center text-gray-500 py-6">No products available.</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500 py-6">No pending approval sheets available.</p>
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
                  {sheet?.organization || "N/A"}
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

export default AdminApprovalPendingEMpSheet;
