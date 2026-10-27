import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { FiChevronDown, FiChevronUp, FiEye } from "react-icons/fi";
import { toast } from "react-toastify";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb.jsx";
import { useTheme } from "../../../../../hooks/theme/useTheme.js";
import useCompany from "../../../../../hooks/common/useCompany.js";
import useEnviroAdminTargetSheet from "../../../../../hooks/superAdminHook/customerVisitPlan/targetSheet/useEnviroAdminTargetSheet.js";
import LoaderSpinner from "../../../../../components/uiComponents/loader/LoaderSpinner.jsx";

const QUARTERS = ["Quarter1", "Quarter2", "Quarter3", "Quarter4"];

const currency = (val) =>
  val != null
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(val)
    : "₹ 0";

const PENDING_CEO_APPROVAL = "pending_CEO_approval";

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

const EnviroUniversalTargetSheet = () => {
  const { theme } = useTheme();
  const { isEnviroSolution } = useCompany();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    enviroAdminProductUniversalTargetSheet,
    enviroAdminServiceUniversalTargetSheet,
    enviroAdminProjectUniversalTargetSheet,
    fetchAdminProductUniversalTargetSheet,
    fetchAdminServiceUniversalTargetSheet,
    fetchAdminProjectUniversalTargetSheet,
    reviewEnviroTargetSheet,
    loading,
  } = useEnviroAdminTargetSheet();

  const initialSheetType = searchParams.get("sheetType") || "Product";
  const [selectedSheetType, setSelectedSheetType] = useState(initialSheetType);
  const [expanded, setExpanded] = useState({});
  const [reviewModal, setReviewModal] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [currentData, setCurrentData] = useState(null);

  useEffect(() => {
    if (id) {
      fetchEnviroUniversalSheet(selectedSheetType);
    }
    return () => {
      setCurrentData(null);
    };
  }, [id]);

  const fetchEnviroUniversalSheet = (sheetType) => {
    if (!id) return;
    switch (sheetType) {
      case "Product":
        fetchAdminProductUniversalTargetSheet(id);
        break;
      case "Service":
        fetchAdminServiceUniversalTargetSheet(id);
        break;
      case "Project":
        fetchAdminProjectUniversalTargetSheet(id);
        break;
      default:
        fetchAdminProductUniversalTargetSheet(id);
    }
  };

  useEffect(() => {
    const res =
      selectedSheetType === "Product"
        ? enviroAdminProductUniversalTargetSheet
        : selectedSheetType === "Service"
        ? enviroAdminServiceUniversalTargetSheet
        : enviroAdminProjectUniversalTargetSheet;
    setCurrentData(res);
  }, [selectedSheetType, enviroAdminProductUniversalTargetSheet, enviroAdminServiceUniversalTargetSheet, enviroAdminProjectUniversalTargetSheet]);

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
      fetchEnviroUniversalSheet(selectedSheetType);
    }
  };

  const data = currentData;
  const employee = data?.employee;
  const summary = data?.summary;
  const sheets = data?.sheets ?? [];

  const achievementRate = (achieved, target) => {
    if (!target || target === 0) return achieved ? `${((achieved / target) * 100).toFixed(2)}%` : "0%";
    return `${((achieved / target) * 100).toFixed(2)}%`;
  };

  const sheetTotalPrice = (sheet) => {
    if (selectedSheetType === "Product") {
      return sheet?.sheets?.reduce((acc, s) => acc + (s.overAllTargetPrice ?? 0), 0) ?? 0;
    }
    if (selectedSheetType === "Service") {
      return sheet?.sheets?.reduce((acc, s) => acc + (s.totalPrice ?? 0), 0) ?? 0;
    }
    if (selectedSheetType === "Project") {
      return sheet?.sheets?.reduce((acc, s) => acc + (s.projectPrice ?? 0), 0) ?? 0;
    }
    return 0;
  };

  const sheetAchievedPrice = (sheet) => {
    if (selectedSheetType === "Product") {
      return sheet?.sheets?.reduce((acc, s) => {
        let ach = 0;
        QUARTERS.forEach((q) => {
          Object.values(s.achievement?.[q] ?? {}).forEach((m) => {
            ach += m.targetAchievementPrice ?? 0;
          });
        });
        return acc + ach;
      }, 0) ?? 0;
    }
    if (selectedSheetType === "Service") {
      return sheet?.sheets?.reduce((acc, s) => {
        let ach = 0;
        QUARTERS.forEach((q) => {
          Object.values(s.achievement?.[q] ?? {}).forEach((m) => {
            ach += m.targetAchievementPrice ?? 0;
          });
        });
        return acc + ach;
      }, 0) ?? 0;
    }
    if (selectedSheetType === "Project") {
      return sheet?.sheets?.reduce((acc, s) => {
        let ach = 0;
        QUARTERS.forEach((q) => {
          Object.values(s.achievement?.[q] ?? {}).forEach((m) => {
            ach += m.targetAchievementPrice ?? 0;
          });
        });
        return acc + ach;
      }, 0) ?? 0;
    }
    return 0;
  };

  return (
    <div className="w-full min-h-screen pb-10">
      <BreadCrumb
        linkText={[
          { text: "Customer Visit Plan" },
          { text: "Target Sheet", href: "/admin/sales-executive/target-sheet" },
          { text: "Enviro Universal Target Sheet" },
        ]}
      />

      <div className="p-4 bg-white rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="text-3xl font-bold text-gray-800">
            Enviro Universal Target Sheet
          </h2>
          <div className="flex items-center gap-3">
            <select
              value={selectedSheetType}
              onChange={(e) => {
                setSelectedSheetType(e.target.value);
                setExpanded({});
              }}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            >
              {["Product", "Service", "Project"].map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <button
              onClick={() => navigate("/admin/sales-executive/target-sheet")}
              className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all"
            >
              ← Back to Target Sheet
            </button>
          </div>
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
                <span className="text-sm font-medium text-gray-700">Total Sheets</span>
                <p className="text-lg font-semibold text-[#252C58]">{data?.totalSheets ?? 0}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Sheet Type</span>
                <p className="text-lg font-semibold text-[#252C58]">{selectedSheetType}</p>
              </div>
            </div>

            {/* Summary */}
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              <Stat label="Individuals" value={summary?.individualCount ?? 0} />
              <Stat label="Organizations" value={summary?.organizationCount ?? 0} />
              {selectedSheetType === "Product" && (
                <>
                  <Stat label="Products" value={summary?.annualProductCount ?? 0} />
                  <Stat label="Target Qty" value={summary?.annualTargetQuantity ?? 0} />
                  <Stat label="Achieved Qty" value={summary?.annualAchievedQuantity ?? 0} />
                </>
              )}
              {selectedSheetType === "Service" && (
                <>
                  <Stat label="Services" value={summary?.annualServiceCount ?? 0} />
                  <Stat label="Target Price" value={currency(summary?.annualServiceTargetPrice)} />
                  <Stat label="Achieved Price" value={currency(summary?.annualServiceAchievedPrice)} />
                </>
              )}
              {selectedSheetType === "Project" && (
                <>
                  <Stat label="Projects" value={summary?.annualProjectCount ?? 0} />
                  <Stat label="Target Price" value={currency(summary?.annualProjectTargetPrice)} />
                  <Stat label="Achieved Price" value={currency(summary?.annualProjectAchievedPrice)} />
                </>
              )}
              <Stat label="Target Price" value={currency(summary?.annualTargetPrice)} />
              <Stat label="Achieved Price" value={currency(summary?.annualAchievedPrice)} />
              <Stat label="Achievement %" value={`${achievementRate(summary?.annualAchievedPrice, summary?.annualTargetPrice)}`} />
            </div>

            {/* Sheets List */}
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Sheets ({sheets.length})
            </h3>
            {sheets.length > 0 ? (
              sheets.map((sheet, sIdx) => (
                <div
                  key={sheet?._id || sIdx}
                  className="mb-6 border border-gray-200 rounded-xl overflow-hidden"
                >
                  {/* Sheet Header */}
                  <div className="p-4" style={{ backgroundColor: theme.secondaryColor }}>
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                      <h4 className="text-lg font-semibold text-[#252C58]">
                        {selectedSheetType === "Product" && sheet?.uniqueCodeIndividual && `Individual: ${sheet.uniqueCodeIndividual}`}
                        {selectedSheetType === "Product" && sheet?.uniqueCodeOrganization && ` — Org: ${sheet.uniqueCodeOrganization}`}
                        {selectedSheetType === "Service" && sheet?.uniqueCodeIndividual && `Individual: ${sheet.uniqueCodeIndividual}`}
                        {selectedSheetType === "Project" && sheet?.uniqueCodeIndividual && `Individual: ${sheet.uniqueCodeIndividual}`}
                        {selectedSheetType === "Project" && sheet?.uniqueCodeOrganization && ` — Org: ${sheet.uniqueCodeOrganization}`}
                        {selectedSheetType === "Product" && sheet?.individualName && ` — ${sheet.individualName}`}
                        {selectedSheetType === "Project" && sheet?.projectName && ` — ${sheet.projectName}`}
                      </h4>
                      <div className="flex items-center gap-2 flex-wrap">
                        {sheet?.status === PENDING_CEO_APPROVAL ? (
                          <>
                            <button
                              type="button"
                              onClick={() => openReview(sheet?._id, "approve", sheet?._id)}
                              className="px-3 py-1 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 transition-all"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => openReview(sheet?._id, "reject", sheet?._id)}
                              className="px-3 py-1 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 transition-all"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span
                            title={`Status: ${formatStatus(sheet?.status)}`}
                            className={`inline-block px-3 py-1 text-sm font-semibold rounded-md ${statusColor(
                              sheet?.status
                            )}`}
                          >
                            {formatStatus(sheet?.status)}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => toggleOrg(sIdx)}
                          className="flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-md bg-white/70 text-[#252C58] hover:bg-white transition-all"
                        >
                          {expanded[sIdx] ? "Collapse" : "Expand"}
                          {expanded[sIdx] ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Segment</span>
                        <p className="text-base font-semibold text-[#252C58]">{sheet?.segment || "N/A"}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Financial Year</span>
                        <p className="text-base font-semibold text-[#252C58]">{sheet?.financialYear || "N/A"}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Target Price</span>
                        <p className="text-base font-semibold text-[#252C58]">{currency(sheetTotalPrice(sheet))}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Achieved Price</span>
                        <p className="text-base font-semibold text-[#252C58]">{currency(sheetAchievedPrice(sheet))}</p>
                      </div>
                    </div>
                  </div>

                  {/* Items Table (expandable) */}
                  {expanded[sIdx] && (
                    <div className="overflow-x-auto border-t border-gray-200">
                      <table className="min-w-full text-sm text-left text-gray-700 table-auto">
                        <thead className="uppercase bg-gray-100 border-b border-gray-300">
                          <tr>
                            {selectedSheetType === "Product" && (
                              <>
                                <th className="p-4 text-base font-semibold text-left">Product Type</th>
                                <th className="p-4 text-base font-semibold text-left">Product Name</th>
                                <th className="p-4 text-base font-semibold text-right">Price</th>
                                <th className="p-4 text-base font-semibold text-right">Qty</th>
                                <th className="p-4 text-base font-semibold text-right">Target Price</th>
                                <th className="p-4 text-base font-semibold text-right">Achieved Price</th>
                                <th className="p-4 text-base font-semibold text-right">Achievement %</th>
                              </>
                            )}
                            {selectedSheetType === "Service" && (
                              <>
                                <th className="p-4 text-base font-semibold text-left">Service Name</th>
                                <th className="p-4 text-base font-semibold text-left">Product Type</th>
                                <th className="p-4 text-base font-semibold text-right">Service Price</th>
                                <th className="p-4 text-base font-semibold text-right">Months</th>
                                <th className="p-4 text-base font-semibold text-right">Acres</th>
                                <th className="p-4 text-base font-semibold text-right">Total Price</th>
                                <th className="p-4 text-base font-semibold text-right">Achieved Price</th>
                                <th className="p-4 text-base font-semibold text-right">Achievement %</th>
                              </>
                            )}
                            {selectedSheetType === "Project" && (
                              <>
                                <th className="p-4 text-base font-semibold text-left">Project Name</th>
                                <th className="p-4 text-base font-semibold text-left">Project Type</th>
                                <th className="p-4 text-base font-semibold text-right">Plant Capacity</th>
                                <th className="p-4 text-base font-semibold text-right">Project Price</th>
                                <th className="p-4 text-base font-semibold text-right">Achieved Price</th>
                                <th className="p-4 text-base font-semibold text-right">Achievement %</th>
                              </>
                            )}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {(() => {
                            const items =
                              selectedSheetType === "Product"
                                ? sheet?.products ?? []
                                : selectedSheetType === "Service"
                                ? sheet?.services ?? []
                                : sheet?.projects ?? [];
                            return items.length > 0 ? (
                              items.map((item, i) => {
                                let targetPrice = 0;
                                let achievedPrice = 0;
                                QUARTERS.forEach((q) => {
                                  Object.values(item.achievement?.[q] ?? {}).forEach((m) => {
                                    targetPrice += m.targetPrice ?? 0;
                                    achievedPrice += m.targetAchievementPrice ?? 0;
                                  });
                                });
                                return (
                                  <tr key={item?._id || i} className="hover:bg-gray-50 transition-all">
                                    {selectedSheetType === "Product" && (
                                      <>
                                        <td className="px-4 py-3 text-[15px] text-[#252C58]">{item?.productType || "N/A"}</td>
                                        <td className="px-4 py-3 text-[15px] text-[#252C58]">{item?.name || "N/A"}</td>
                                        <td className="px-4 py-3 text-[15px] text-right text-[#252C58]">{currency(item?.price)}</td>
                                        <td className="px-4 py-3 text-[15px] text-right text-[#252C58]">{item?.enteredQuantity ?? 0}</td>
                                        <td className="px-4 py-3 text-[15px] text-right text-[#252C58]">{currency(targetPrice)}</td>
                                        <td className="px-4 py-3 text-[15px] text-right text-[#252C58]">{currency(achievedPrice)}</td>
                                        <td className="px-4 py-3 text-[15px] text-right text-[#252C58]">{achievementRate(achievedPrice, targetPrice)}</td>
                                      </>
                                    )}
                                    {selectedSheetType === "Service" && (
                                      <>
                                        <td className="px-4 py-3 text-[15px] text-[#252C58]">{item?.serviceName || "N/A"}</td>
                                        <td className="px-4 py-3 text-[15px] text-[#252C58]">{item?.productName || "N/A"}</td>
                                        <td className="px-4 py-3 text-[15px] text-right text-[#252C58]">{currency(item?.servicePrice)}</td>
                                        <td className="px-4 py-3 text-[15px] text-right text-[#252C58]">{item?.months ?? 0}</td>
                                        <td className="px-4 py-3 text-[15px] text-right text-[#252C58]">{item?.acres ?? 0}</td>
                                        <td className="px-4 py-3 text-[15px] text-right text-[#252C58]">{currency(item?.totalPrice)}</td>
                                        <td className="px-4 py-3 text-[15px] text-right text-[#252C58]">{currency(achievedPrice)}</td>
                                        <td className="px-4 py-3 text-[15px] text-right text-[#252C58]">{achievementRate(achievedPrice, item?.totalPrice)}</td>
                                      </>
                                    )}
                                    {selectedSheetType === "Project" && (
                                      <>
                                        <td className="px-4 py-3 text-[15px] text-[#252C58]">{item?.projectName || "N/A"}</td>
                                        <td className="px-4 py-3 text-[15px] text-[#252C58]">{item?.projectType || "N/A"}</td>
                                        <td className="px-4 py-3 text-[15px] text-right text-[#252C58]">{item?.plantCapacity || "N/A"}</td>
                                        <td className="px-4 py-3 text-[15px] text-right text-[#252C58]">{currency(item?.projectPrice)}</td>
                                        <td className="px-4 py-3 text-[15px] text-right text-[#252C58]">{currency(achievedPrice)}</td>
                                        <td className="px-4 py-3 text-[15px] text-right text-[#252C58]">{achievementRate(achievedPrice, item?.projectPrice)}</td>
                                      </>
                                    )}
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan={selectedSheetType === "Product" ? 7 : selectedSheetType === "Service" ? 8 : 6} className="p-4 text-center text-gray-500">
                                  No {selectedSheetType.toLowerCase()} data available.
                                </td>
                              </tr>
                            );
                          })()}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-6">No {selectedSheetType.toLowerCase()} sheets available.</p>
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
                Sheet ID:{" "}
                <span className="font-semibold text-[#252C58]">
                  {reviewModal.sheetId}
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

export default EnviroUniversalTargetSheet;
