import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { toast } from "react-toastify";
import BreadCrumb from "../../../../../../components/uiComponents/breadcrumb/BreadCrumb.jsx";
import { useTheme } from "../../../../../../hooks/theme/useTheme.js";
import useCompany from "../../../../../../hooks/common/useCompany.js";
import useEnviroTargetSheetExecutive from "../../../../../../hooks/salesExecutiveHook/customerVisitPlan/useEnviroTargetSheetExecutive.js";
import LoaderSpinner from "../../../../../../components/uiComponents/loader/LoaderSpinner.jsx";
import { enviroUniversalTargetSheetStateAtom } from "../../../../../../state/salesExecutiveState/customerVisitPlan/targetSheetState";
import { useRecoilValue } from "recoil";

const QUARTERS = ["Quarter1", "Quarter2", "Quarter3", "Quarter4"];

const currency = (val) =>
  val != null
    ? `â¹ ${Number(val).toLocaleString("en-IN")}`
    : "-";

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

const EnviroUniveralTeamvisetargetSheet = () => {
  const { theme } = useTheme();
  const { isEnviroSolution } = useCompany();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    loading,
    enviroUniversalTargetSheetDetails,
    fetchEnviroUniversalTargetSheet,
    reviewEnviroTargetSheet,
    resetEnviroUniversalTargetSheetDetails,
  } = useEnviroTargetSheetExecutive();

  const universalSheet = useRecoilValue(enviroUniversalTargetSheetStateAtom);

  const initialSheetType = searchParams.get("sheetType") || "Product";
  const [selectedSheetType, setSelectedSheetType] = useState(initialSheetType);
  const [expanded, setExpanded] = useState({});
  const [reviewModal, setReviewModal] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEnviroUniversalTargetSheet(id);
    }
    return () => {
      resetEnviroUniversalTargetSheetDetails();
      setReviewModal(null);
      setRemarks("");
    };
  }, [id]);

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
    const res = await reviewEnviroTargetSheet(sheetId, {
      action,
      remarks: remarks.trim(),
    });
    setReviewSubmitting(false);
    if (res) {
      closeReview();
      fetchEnviroUniversalTargetSheet(id);
    }
  };

  const data = universalSheet;
  const employee = data?.employee;
  const summary = data?.summary;
  const sheets = data?.sheets ?? {};

  const getItemsForType = (sheet) => {
    if (selectedSheetType === "Product") return sheet?.products ?? [];
    if (selectedSheetType === "Service") return sheet?.services ?? [];
    if (selectedSheetType === "Project") return sheet?.projects ?? [];
    return [];
  };

  const sheetTotalPrice = (sheet) => {
    if (selectedSheetType === "Product") {
      return (sheet?.products ?? []).reduce((acc, s) => acc + (s.overAllTargetPrice ?? 0), 0);
    }
    if (selectedSheetType === "Service") {
      return (sheet?.services ?? []).reduce((acc, s) => acc + (s.totalPrice ?? 0), 0);
    }
    if (selectedSheetType === "Project") {
      return (sheet?.projects ?? []).reduce((acc, s) => acc + (s.projectPrice ?? 0), 0);
    }
    return 0;
  };

  const sheetAchievedPrice = (sheet) => {
    let total = 0;
    const items = getItemsForType(sheet);
    items.forEach((item) => {
      QUARTERS.forEach((q) => {
        Object.values(item.achievement?.[q] ?? {}).forEach((m) => {
          total += m.targetAchievementPrice ?? 0;
        });
      });
    });
    return total;
  };

  const achievementRate = (achieved, target) => {
    if (!target || target === 0) return "0%";
    return `${((achieved / target) * 100).toFixed(2)}%`;
  };

  const getSummaryForType = () => {
    const s = summary?.[selectedSheetType] || {};
    if (selectedSheetType === "Product") {
      return {
        count: s.annualProductCount ?? 0,
        target: s.annualTargetPrice,
        achieved: s.annualAchievedPrice,
        qtyTarget: s.annualTargetQuantity ?? 0,
        qtyAchieved: s.annualAchievedQuantity ?? 0,
      };
    }
    if (selectedSheetType === "Service") {
      return {
        count: s.annualServiceCount ?? 0,
        target: s.annualServiceTargetPrice,
        achieved: s.annualServiceAchievedPrice,
      };
    }
    if (selectedSheetType === "Project") {
      return {
        count: s.annualProjectCount ?? 0,
        target: s.annualProjectTargetPrice,
        achieved: s.annualProjectAchievedPrice,
      };
    }
    return {};
  };

  const currentSummary = getSummaryForType();

  return (
    <div className="w-full min-h-screen pb-10">
      <BreadCrumb
        linkText={[
          { text: "Customer Visit Plan" },
          { text: "Target Sheet", href: "/sales-executive/target-sheet" },
          { text: "Enviro Universal Target Sheet" },
        ]}
      />

      <div className="p-4 bg-white rounded-2xl">
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
              onClick={() => navigate("/sales-executive/target-sheet")}
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

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              <Stat label="Individuals" value={summary?.individualCount ?? 0} />
              <Stat label="Organizations" value={summary?.organizationCount ?? 0} />
              {selectedSheetType === "Product" && (
                <>
                  <Stat label="Products" value={currentSummary.count} />
                  <Stat label="Target Qty" value={currentSummary.qtyTarget} />
                  <Stat label="Achieved Qty" value={currentSummary.qtyAchieved} />
                </>
              )}
              {selectedSheetType === "Service" && (
                <>
                  <Stat label="Services" value={currentSummary.count} />
                  <Stat label="Target Price" value={currency(currentSummary.target)} />
                  <Stat label="Achieved Price" value={currency(currentSummary.achieved)} />
                </>
              )}
              {selectedSheetType === "Project" && (
                <>
                  <Stat label="Projects" value={currentSummary.count} />
                  <Stat label="Target Price" value={currency(currentSummary.target)} />
                  <Stat label="Achieved Price" value={currency(currentSummary.achieved)} />
                </>
              )}
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              {selectedSheetType} Sheets ({sheets[selectedSheetType]?.length || 0})
            </h3>
            {(sheets[selectedSheetType] || []).length > 0 ? (
              (sheets[selectedSheetType] || []).map((sheet, sIdx) => (
                <div
                  key={sheet?._id || sIdx}
                  className="mb-4 border border-gray-200 rounded-xl overflow-hidden"
                >
                  <div className="p-4" style={{ backgroundColor: theme.secondaryColor }}>
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                      <h4 className="text-lg font-semibold text-[#252C58]">
                        {selectedSheetType === "Product" && sheet?.uniqueCodeIndividual && `Individual: ${sheet.uniqueCodeIndividual}`}
                        {selectedSheetType === "Product" && sheet?.uniqueCodeOrganization && ` — Org: ${sheet.uniqueCodeOrganization}`}
                        {selectedSheetType === "Product" && sheet?.individualName && ` — ${sheet.individualName}`}
                        {selectedSheetType === "Project" && sheet?.uniqueCodeIndividual && `Individual: ${sheet.uniqueCodeIndividual}`}
                        {selectedSheetType === "Project" && sheet?.uniqueCodeOrganization && ` — Org: ${sheet.uniqueCodeOrganization}`}
                        {selectedSheetType === "Project" && sheet?.projectName && ` — ${sheet.projectName}`}
                      </h4>
                      <div className="flex items-center gap-2 flex-wrap">
                        {sheet?.status === "pending_Sales Manager_approval" ? (
                          <>
                            <button
                              type="button"
                              onClick={() => openReview(sheet?._id, "approve")}
                              className="px-3 py-1 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 transition-all"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => openReview(sheet?._id, "reject")}
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
                          onClick={() => setExpanded((prev) => ({ ...prev, [sIdx]: !prev[sIdx] }))}
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
                            const items = getItemsForType(sheet);
                            return items.length > 0 ? (
                              items.map((item, i) => {
                                let targetPrice = 0;
                                if (selectedSheetType === "Product") {
                                  targetPrice = item.overAllTargetPrice ?? 0;
                                } else if (selectedSheetType === "Service") {
                                  targetPrice = (item.services ?? []).reduce((acc, s) => acc + (s.totalPrice ?? 0), 0);
                                } else if (selectedSheetType === "Project") {
                                  targetPrice = (item.projects ?? []).reduce((acc, s) => acc + (s.projectPrice ?? 0), 0);
                                }
                                let achievedPrice = 0;
                                QUARTERS.forEach((q) => {
                                  Object.values(item.achievement?.[q] ?? {}).forEach((m) => {
                                    achievedPrice += m.targetAchievementPrice ?? 0;
                                  });
                                });
                                const achPercent = targetPrice ? ((achievedPrice / targetPrice) * 100).toFixed(2) + "%" : "0%";
                                return (
                                  <tr key={item._id ?? i}>
                                    {selectedSheetType === "Product" && (
                                      <>
                                        <td className="p-4">{item.productType || "-"}</td>
                                        <td className="p-4">{item.name || "-"}</td>
                                        <td className="p-4 text-right">{currency(item.price)}</td>
                                        <td className="p-4 text-right">{item.enteredQuantity ?? "-"}</td>
                                        <td className="p-4 text-right">{currency(targetPrice)}</td>
                                        <td className="p-4 text-right">{currency(achievedPrice)}</td>
                                        <td className="p-4 text-right">{achPercent}</td>
                                      </>
                                    )}
                                    {selectedSheetType === "Service" && (
                                      <>
                                        <td className="p-4">{item.serviceName || "-"}</td>
                                        <td className="p-4">{item.productType || "-"}</td>
                                        <td className="p-4 text-right">{currency(item.servicePrice)}</td>
                                        <td className="p-4 text-right">{item.months ?? "-"}</td>
                                        <td className="p-4 text-right">{item.acres ?? "-"}</td>
                                        <td className="p-4 text-right">{currency(item.totalPrice)}</td>
                                        <td className="p-4 text-right">{currency(achievedPrice)}</td>
                                        <td className="p-4 text-right">{achPercent}</td>
                                      </>
                                    )}
                                    {selectedSheetType === "Project" && (
                                      <>
                                        <td className="p-4">{item.projectName || "-"}</td>
                                        <td className="p-4">{item.projectType || "-"}</td>
                                        <td className="p-4 text-right">{item.plantCapacity || "-"}</td>
                                        <td className="p-4 text-right">{currency(item.projectPrice)}</td>
                                        <td className="p-4 text-right">{currency(achievedPrice)}</td>
                                        <td className="p-4 text-right">{achPercent}</td>
                                      </>
                                    )}
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan={selectedSheetType === "Product" ? 7 : (selectedSheetType === "Service" ? 8 : 6)} className="p-4 text-center text-gray-500">
                                  No items found.
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
              <p className="text-center text-gray-500 py-8">
                No {selectedSheetType} sheets found for this employee.
              </p>
            )}
          </>
        )}

        {reviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {reviewModal.action === "approve" ? "Approve Target Sheet" : "Reject Target Sheet"}
              </h3>
              {reviewModal.action === "reject" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remarks (required for reject)
                  </label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter your remarks..."
                  />
                </div>
              )}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeReview}
                  className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all"
                  disabled={reviewSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitReview}
                  className={`px-4 py-2 text-sm font-medium rounded-md text-white transition-all ${
                    reviewModal.action === "approve"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                  disabled={reviewSubmitting}
                >
                  {reviewSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnviroUniveralTeamvisetargetSheet;
