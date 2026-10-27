import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb.jsx";
import Button from "../../../../../components/uiComponents/button/Button.jsx";
import LoaderSpinner from "../../../../../components/uiComponents/loader/LoaderSpinner.jsx";
import { useTheme } from "../../../../../hooks/theme/useTheme.js";

import useEnviroAdminTargetSheet from "../../../../../hooks/superAdminHook/customerVisitPlan/targetSheet/useEnviroAdminTargetSheet.js";
import {
  DistributionTable,
  FormSection,
  ReadOnlyField,
  MONTHS,
  numberValue,
  formatCurrency,
  roundTo,
} from "../../../salesExecutive/customerVisitPlan/targetSheet/enviro/components/EnviroFormUI";

const PRODUCT_TARGET_DISTRIBUTION = {
  quarterly: [0, 0.24, 0.36, 0.4],
  monthly: [1 / 3, 1 / 3, 1 / 3],
};

const PROJECT_TARGET_DISTRIBUTION = {
  quarterly: [0.25, 0.25, 0.25, 0.25],
  monthly: [1 / 3, 1 / 3, 1 / 3],
};

const SERVICE_TARGET_DISTRIBUTION = {
  quarterly: [0, 0.5, 0.5, 0],
  monthly: [1 / 3, 1 / 3, 1 / 3],
};

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

const normalizeAchievement = (achievement) => {
  const source = achievement || {};
  const normalized = {};
  Object.keys(MONTHS).forEach((quarter) => {
    const quarterSource = source[quarter] || {};
    const quarterData = {};
    MONTHS[quarter].forEach((month) => {
      const monthSource = quarterSource[month] || {};
      quarterData[month] = {
        targetQuantity: numberValue(monthSource.targetQuantity),
        targetPrice: numberValue(monthSource.targetPrice),
        targetAchievementQuantity: numberValue(monthSource.targetAchievementQuantity),
        targetAchievementPrice: numberValue(monthSource.targetAchievementPrice),
      };
    });
    quarterData.QuarterTargetQuantity = numberValue(quarterSource.QuarterTargetQuantity);
    quarterData.QuarterTargetPrice = numberValue(quarterSource.QuarterTargetPrice);
    quarterData.QuarterAchievementQuantity = numberValue(quarterSource.QuarterAchievementQuantity);
    quarterData.QuarterAchievementPrice = numberValue(quarterSource.QuarterAchievementPrice);
    normalized[quarter] = quarterData;
  });
  normalized.overall = {
    totalQuantity: numberValue(source.overall?.totalQuantity),
    totalPrice: numberValue(source.overall?.totalPrice),
  };
  return normalized;
};

const AdminEnviroTargetSheetView = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const type = (searchParams.get("type") || searchParams.get("sheetType") || "product").toLowerCase();

  const {
    loading,
    fetchAdminProductWiseTargetSheetById,
    enviroAdminProductWiseTargetSheetById,
    fetchAdminServiceWiseTargetSheetById,
    enviroAdminServiceWiseTargetSheetById,
    fetchAdminProjectWiseTargetSheetById,
    enviroAdminProjectWiseTargetSheetById,
    fetchEnviroAdminMyApprovalQueue,
    reviewEnviroTargetSheet, // 👈 added
  } = useEnviroAdminTargetSheet();

  // ── Review modal state ──────────────────────────────────────────────
  const [reviewModal, setReviewModal] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // ── Reusable fetch so we can refresh after review ───────────────────
  const fetchSheetById = () => {
    if (!id) return;
    if (type === "project") {
      fetchAdminProjectWiseTargetSheetById(id);
    } else if (type === "service") {
      fetchAdminServiceWiseTargetSheetById(id);
    } else {
      fetchAdminProductWiseTargetSheetById(id);
    }
  };

  useEffect(() => {
    fetchSheetById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, type]);

  let data = null;
  if (type === "project") data = enviroAdminProjectWiseTargetSheetById;
  else if (type === "service") data = enviroAdminServiceWiseTargetSheetById;
  else data = enviroAdminProductWiseTargetSheetById;

  const normalizedData = data?.data ?? data;

  // ── Review helpers ──────────────────────────────────────────────────
  const sheetId = normalizedData?._id || data?._id;
  const sheetStatus = normalizedData?.status || normalizedData?.approvalStatus;
  const canReview = sheetStatus === PENDING_CEO_APPROVAL && !!sheetId;

  const openReview = (action) => {
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
    const { sheetId: sid, action } = reviewModal;

    if (action === "reject" && !remarks.trim()) {
      toast.error("Please add a remark before rejecting");
      return;
    }

    setReviewSubmitting(true);
    const res = await reviewEnviroTargetSheet(sid, {
      action,
      remarks: remarks.trim(),
    });
    setReviewSubmitting(false);

    if (res) {
      setReviewModal(null);
      setRemarks("");
      fetchSheetById(); // refetch this sheet to show the new status
    }
  };

  const products = normalizedData?.products || [];
  const services = normalizedData?.services || [];

  const summaryQty =
    normalizedData?.summary?.annualTargetQuantity ??
    normalizedData?.summary?.totalTargetQuantity ??
    0;
  const summaryPrice =
    normalizedData?.summary?.annualTargetPrice ??
    normalizedData?.summary?.totalTargetPrice ??
    0;

  const getDistribution = (item) => ({
    quarters: normalizeAchievement(item?.achievement || normalizedData?.achievement || {}),
    quarterlyRatios:
      type === "project"
        ? PROJECT_TARGET_DISTRIBUTION.quarterly
        : type === "service"
        ? SERVICE_TARGET_DISTRIBUTION.quarterly
        : PRODUCT_TARGET_DISTRIBUTION.quarterly,
    monthlyRatios:
      type === "project"
        ? PROJECT_TARGET_DISTRIBUTION.monthly
        : type === "service"
        ? SERVICE_TARGET_DISTRIBUTION.monthly
        : PRODUCT_TARGET_DISTRIBUTION.monthly,
  });

  return (
    <div className="w-full min-h-screen pb-10">
      <BreadCrumb
        linkText={[
          { text: "Customer Visit Plan" },
          { text: "Target Sheet", href: "/admin/sales-executive/target-sheet" },
          { text: "Enviro Target Sheet" },
          { text: "View" },
        ]}
      />

      <div className="p-4 bg-white rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Enviro Target Sheet -{" "}
            {type === "project" ? "Project" : type === "service" ? "Service" : "Product"}{" "}
            (View)
          </h2>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Status badge */}
            {sheetStatus && (
              <span
                className={`inline-block px-3 py-1 text-sm font-semibold rounded-md ${statusColor(
                  sheetStatus
                )}`}
              >
                {formatStatus(sheetStatus)}
              </span>
            )}

            {/* Approve / Reject — only when pending CEO approval */}
            {canReview && (
              <>
                <button
                  type="button"
                  onClick={() => openReview("approve")}
                  className="px-3 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 transition-all"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => openReview("reject")}
                  className="px-3 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 transition-all"
                >
                  Reject
                </button>
              </>
            )}

            <Button text="Back to Target Sheet" onClick={() => navigate(-1)} variant={2} />
          </div>
        </div>
        <hr className="h-1 border-0 mb-6" style={{ backgroundColor: theme.secondaryColor }} />

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoaderSpinner />
          </div>
        ) : !normalizedData ? (
          <p className="text-center text-gray-500 py-8">No data found.</p>
        ) : (
          <div className="space-y-6">
            <FormSection title="Basic Details">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <ReadOnlyField label="Section" value={normalizedData.segment || "-"} />
                <ReadOnlyField label="Profile Type" value={normalizedData.profileType || "-"} />
                <ReadOnlyField label="Organization" value={normalizedData.organizationName || "-"} />
                <ReadOnlyField
                  label="Organization Unique Code"
                  value={normalizedData.uniqueCodeOrganization || "-"}
                />
                <ReadOnlyField label="District" value={normalizedData.district || "-"} />
                <ReadOnlyField
                  label="City"
                  value={normalizedData.cityTownVillage || normalizedData.city || "-"}
                />
                <ReadOnlyField label="Individual Name" value={normalizedData.individualName || "-"} />
                <ReadOnlyField
                  label="Individual Unique Code"
                  value={normalizedData.uniqueCodeIndividual || "-"}
                />
                <ReadOnlyField label="Year" value={normalizedData.financialYear || "-"} />
                <ReadOnlyField
                  label="Status"
                  value={formatStatus(normalizedData.status || normalizedData.approvalStatus) || "-"}
                />
              </div>
            </FormSection>

            {type === "project" && (
              <FormSection title="Project Details">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  <ReadOnlyField label="Project Type" value={normalizedData.projectType || "-"} />
                  <ReadOnlyField label="Project Name" value={normalizedData.projectName || "-"} />
                  <ReadOnlyField label="Plant Capacity" value={normalizedData.plantCapacity ?? "-"} />
                  <ReadOnlyField
                    label="Projected Price"
                    value={
                      normalizedData.projectPrice != null
                        ? `₹ ${formatCurrency(normalizedData.projectPrice)}`
                        : "-"
                    }
                  />
                  <ReadOnlyField
                    label="Overall Target Price"
                    value={
                      normalizedData.overAllTargetPrice != null
                        ? `₹ ${formatCurrency(normalizedData.overAllTargetPrice)}`
                        : "-"
                    }
                  />
                </div>
                <div className="mt-4">
                  <DistributionTable
                    distribution={getDistribution(normalizedData)}
                    onAchievementChange={() => {}}
                    readOnly={true}
                  />
                </div>
              </FormSection>
            )}

            {type === "product" && (
              <FormSection title="Product Details">
                {products.map((p, idx) => (
                  <div key={idx} className="border rounded-xl p-4 mb-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                      <ReadOnlyField label="Product Type" value={p.productType || "-"} />
                      <ReadOnlyField label="Product" value={p.name || "-"} />
                      <ReadOnlyField
                        label="Price"
                        value={p.price != null ? `₹ ${formatCurrency(p.price)}` : "-"}
                      />
                      <ReadOnlyField label="Quantity" value={p.enteredQuantity ?? "-"} />
                      <ReadOnlyField
                        label="Overall Target Price"
                        value={
                          p.overAllTargetPrice != null
                            ? `₹ ${formatCurrency(p.overAllTargetPrice)}`
                            : "-"
                        }
                      />
                    </div>
                    <div className="mt-4">
                      <DistributionTable
                        distribution={getDistribution(p)}
                        onAchievementChange={() => {}}
                        readOnly={true}
                      />
                    </div>
                  </div>
                ))}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <ReadOnlyField label="Total Quantity" value={roundTo(summaryQty, 0)} />
                  <ReadOnlyField
                    label="Total Overall Target Price"
                    value={`₹ ${formatCurrency(summaryPrice)}`}
                  />
                </div>
              </FormSection>
            )}

            {type === "service" && (
              <FormSection title="Service Details">
                {services.map((s, idx) => (
                  <div key={idx} className="border rounded-xl p-4 mb-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                      <ReadOnlyField label="Service Name" value={s.serviceName || "-"} />
                      <ReadOnlyField label="Product Type" value={s.productType || "-"} />
                      <ReadOnlyField label="Product Name" value={s.productName || "-"} />
                      <ReadOnlyField
                        label="Service Price"
                        value={s.servicePrice != null ? `₹ ${formatCurrency(s.servicePrice)}` : "-"}
                      />
                      <ReadOnlyField label="Months" value={s.months ?? "-"} />
                      <ReadOnlyField label="Acres" value={s.acres ?? "-"} />
                      <ReadOnlyField
                        label="Total Price"
                        value={s.totalPrice != null ? `₹ ${formatCurrency(s.totalPrice)}` : "-"}
                      />
                    </div>
                    <div className="mt-4">
                      <DistributionTable
                        distribution={getDistribution(s)}
                        onAchievementChange={() => {}}
                        readOnly={true}
                      />
                    </div>
                  </div>
                ))}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <ReadOnlyField label="Total Price" value={`₹ ${formatCurrency(summaryPrice)}`} />
                </div>
              </FormSection>
            )}
          </div>
        )}
      </div>

      {/* ── Review Modal (Approve / Reject) ───────────────────────────── */}
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
                <span className="font-semibold text-[#252C58]">{reviewModal.sheetId}</span>
              </p>

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

export default AdminEnviroTargetSheetView;