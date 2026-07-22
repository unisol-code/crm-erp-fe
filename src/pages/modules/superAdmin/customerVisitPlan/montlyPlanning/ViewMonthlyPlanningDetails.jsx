import React, { useEffect, useState, useMemo } from "react";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import { useParams } from "react-router-dom";
import useMonthlyPlanning from "../../../../../hooks/superAdminHook/customerVisitPlan/useMonthlyPlanning";
import LoaderSpinner from "../../../../../components/uiComponents/loader/LoaderSpinner";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../../../../../components/uiComponents/button/Button";

// ==================== HELPER FUNCTIONS ====================

/**
 * Format date with time (DD/MM/YYYY, HH:MM AM/PM)
 */
const formatDateTime = (dateStr) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

/**
 * Format date only (YYYY-MM-DD)
 */
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get validation flags based on planning date
 */
const getValidationFlags = (planningDateStr) => {
  if (!planningDateStr) {
    return {
      isCurrentPlanningMonth: false,
      isPlanningMonthExpired: true,
      canEditPlanningInfo: false,
      canEditMeetingDetails: false,
    };
  }

  const planningDate = new Date(planningDateStr);
  const currentDate = new Date();

  // Check if planning belongs to current month & year
  const isCurrentPlanningMonth =
    currentDate.getMonth() === planningDate.getMonth() &&
    currentDate.getFullYear() === planningDate.getFullYear();

  // Check if planning month has expired (end of month 23:59:59)
  const lastDayOfPlanningMonth = new Date(
    planningDate.getFullYear(),
    planningDate.getMonth() + 1,
    0,
    23,
    59,
    59
  );
  const isPlanningMonthExpired = currentDate > lastDayOfPlanningMonth;

  // Get current day of month
  const currentDay = currentDate.getDate();
  const lastDayOfCurrentMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  // Planning info editable only on 1st day of current planning month
  const canEditPlanningInfo = isCurrentPlanningMonth && currentDay === 1;

  // Meeting details editable from 1st to end of current planning month
  const canEditMeetingDetails =
    isCurrentPlanningMonth && !isPlanningMonthExpired && currentDay >= 1 && currentDay <= lastDayOfCurrentMonth;

  return {
    isCurrentPlanningMonth,
    isPlanningMonthExpired,
    canEditPlanningInfo,
    canEditMeetingDetails,
    planningMonth: planningDate.toLocaleString("default", { month: "long", year: "numeric" }),
  };
};

// ==================== REUSABLE COMPONENTS ====================

const Item = ({ label, value }) => (
  <div className="flex flex-col mb-3">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <p className="mt-1 text-gray-800">{value || "N/A"}</p>
  </div>
);

const RadioGroup = ({ label, name, options, value, onChange, disabled = false }) => (
  <div className="flex flex-col md:flex-row md:items-start gap-3 p-3 bg-gray-50 rounded-lg">
    <div className="md:w-56">
      <label className="text-sm font-medium text-gray-700">{label}</label>
    </div>
    <div className="flex gap-4">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-1 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={opt}
            checked={value === opt}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="w-4 h-4 text-blue-600 disabled:opacity-50"
          />
          <span className="text-sm capitalize">{opt}</span>
        </label>
      ))}
    </div>
  </div>
);

const TextInput = ({ name, value, onChange, placeholder, disabled = false, className = "" }) => (
  <input
    type="text"
    name={name}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    disabled={disabled}
    placeholder={placeholder}
    className={`w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
  />
);

const DateInput = ({ name, value, onChange, disabled = false, className = "" }) => (
  <input
    type="date"
    name={name}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    disabled={disabled}
    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
  />
);

const DateTimeInput = ({ name, value, onChange, disabled = false, className = "" }) => (
  <input
    type="datetime-local"
    name={name}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    disabled={disabled}
    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
  />
);

const SelectInput = ({ name, value, onChange, options, disabled = false }) => (
  <select
    name={name}
    value={value}
    onChange={onChange}
    disabled={disabled}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
  >
    <option value="">Select Status</option>
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);

const TextArea = ({ name, value, onChange, placeholder, rows = 2, disabled = false }) => (
  <textarea
    name={name}
    rows={rows}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    disabled={disabled}
    placeholder={placeholder}
    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
  />
);

// ==================== MAIN COMPONENT ====================

function ViewMonthlyPlanningDetails() {
  const { theme } = useTheme();
  const { month, year, id } = useParams();
  const { fetchMonthlyPlanningDetailsById, monthlyPlanningDetails, loading, updateMonthlyPlanning } = useMonthlyPlanning();

  useEffect(() => {
    if (id) {
      fetchMonthlyPlanningDetailsById(id);
    }
  }, [id]);

  const data = monthlyPlanningDetails?.data || {};
  const employeeId = monthlyPlanningDetails?.employeeId;
  console.log("Monthly Planning Details:", monthlyPlanningDetails);

  // Get validation flags using useMemo for performance
  const validation = useMemo(
    () => getValidationFlags(data.createPlanningForDate),
    [data.createPlanningForDate]
  );

  const salesStatusOptions = [
    { label: "Continued", value: "continued" },
    { label: "Completed", value: "completed" },
  ];

  const meetingStatusOptions = [
    { label: "Meeting Done", value: "done" },
    { label: "Postponed", value: "postponed" },
  ];

  // Validation Schema
  const validationSchema = Yup.object({
    visitDate: Yup.string().required("Visit date is required"),
    meetingStatus: Yup.string().required("Meeting status is required"),
    postponedDate: Yup.string().when("meetingStatus", {
      is: "postponed",
      then: (schema) => schema.required("Postponed date is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    postponedRemark: Yup.string().when("meetingStatus", {
      is: "postponed",
      then: (schema) => schema.required("Remark is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    productFeatureBenefitExplainedStatus: Yup.string(),
    productFeatureBenefitExplainedText: Yup.string(),
    isProductDryDemoDone: Yup.string(),
    isProductDryDemoDoneText: Yup.string(),
    isProductLiveDemoAttended: Yup.string(),
    isProductLiveDemoAttendedText: Yup.string(),
    doctorQuestionStatus: Yup.string(),
    doctorQuestionText: Yup.string(),
    concernStatus: Yup.string(),
    concernText: Yup.string(),
    wantToBuy: Yup.string(),
    expectedSalesClosureDate: Yup.string().when("wantToBuy", {
      is: "yes",
      then: (schema) => schema.required("Expected sales closure date is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    remark: Yup.string(),
    nextMeetingDateTime: Yup.string().when("salesProcessStatus", {
      is: "continued",
      then: (schema) => schema.required("Next meeting date & time is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    nextCallObjective: Yup.string().when("salesProcessStatus", {
      is: "continued",
      then: (schema) => schema.required("Next call objective is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    quotationSubmitted: Yup.string(),
    quotationNumber: Yup.string().when("quotationSubmitted", {
      is: "yes",
      then: (schema) => schema.required("Quotation number is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    requiredSupport: Yup.string(),
    comments: Yup.string(),
    orderDate: Yup.string().when("salesProcessStatus", {
      is: "completed",
      then: (schema) => schema.required("Order date is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    purchaseNumber: Yup.string().when("salesProcessStatus", {
      is: "completed",
      then: (schema) => schema.required("Purchase number is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const formik = useFormik({
    initialValues: {
      visitDate: "",
      meetingStatus: "",
      postponedDate: "",
      postponedRemark: "",
      productFeatureBenefitExplainedStatus: "",
      productFeatureBenefitExplainedText: "",
      isProductDryDemoDone: "",
      isProductDryDemoDoneText: "",
      isProductLiveDemoAttended: "",
      isProductLiveDemoAttendedText: "",
      doctorQuestionStatus: "",
      doctorQuestionText: "",
      concernStatus: "",
      concernText: "",
      wantToBuy: "",
      expectedSalesClosureDate: "",
      remark: "",
      nextMeetingDateTime: "",
      nextCallObjective: "",
      quotationSubmitted: "",
      quotationNumber: "",
      requiredSupport: "",
      comments: "",
      orderDate: "",
      purchaseNumber: "",
      salesProcessStatus: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Create payload without the read-only fields
      const payload = {
        visitDateTime: values.visitDate ? new Date(values.visitDate).toISOString() : null,
        meetingStatus: {
          status: values.meetingStatus,
          ...(values.meetingStatus === "postponed" && {
            postponedDate: values.postponedDate ? new Date(values.postponedDate).toISOString() : null,
            remark: values.postponedRemark,
          }),
        },
        productFeatureBenefitExplained: {
          status: values.productFeatureBenefitExplainedStatus,
          text: values.productFeatureBenefitExplainedText,
        },
        isProductDryDemoDone: {
          status: values.isProductDryDemoDone,
          text: values.isProductDryDemoDoneText,
        },
        isProductLiveDemoAttended: {
          status: values.isProductLiveDemoAttended,
          text: values.isProductLiveDemoAttendedText,
        },
        doctorQuestion: {
          status: values.doctorQuestionStatus,
          text: values.doctorQuestionText,
        },
        concern: {
          status: values.concernStatus,
          text: values.concernText,
        },
        wantToBuy: {
          status: values.wantToBuy,
          ...(values.wantToBuy === "yes" && {
            expectedSalesClosureDate: values.expectedSalesClosureDate ? new Date(values.expectedSalesClosureDate).toISOString() : null,
            remark: values.remark,
          }),
        },
        isSalesProcess: {
          status: values.salesProcessStatus,
          ...(values.salesProcessStatus === "completed" && {
            orderDate: values.orderDate,
            purchaseNumber: values.purchaseNumber,
          }),
        },
        nextMeetingDateTime: values.nextMeetingDateTime ? new Date(values.nextMeetingDateTime).toISOString() : null,
        nextMeetingObjective: values.nextCallObjective,
        quotationSubmitted: {
          status: values.quotationSubmitted,
          ...(values.quotationSubmitted === "yes" && {
            quotationNumber: values.quotationNumber,
          }),
        },
        requiredSupport: values.requiredSupport,
        comments: values.comments,
      };

      console.log("Save Payload:", payload);
      
      // Call API to save data - only update meeting details, not the planning info
      await updateMonthlyPlanning(id, payload);
    },
  });

  const isMeetingDone = formik.values.meetingStatus === "done";
  const isPostponed = formik.values.meetingStatus === "postponed";
  const { canEditMeetingDetails, isPlanningMonthExpired, planningMonth } = validation;

  // Set initial values when data loads
  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      formik.setValues({
        visitDate: formatDate(data.visitDateTime) || "",
        meetingStatus: data.meetingStatus?.status || "",
        postponedDate: data.meetingStatus?.postponedDate ? formatDate(data.meetingStatus.postponedDate) : "",
        postponedRemark: data.meetingStatus?.remark || "",
        productFeatureBenefitExplainedStatus: data.productFeatureBenefitExplained?.status || "",
        productFeatureBenefitExplainedText: data.productFeatureBenefitExplained?.text || "",
        isProductDryDemoDone: data.isProductDryDemoDone?.status || "",
        isProductDryDemoDoneText: data.isProductDryDemoDone?.text || "",
        isProductLiveDemoAttended: data.isProductLiveDemoAttended?.status || "",
        isProductLiveDemoAttendedText: data.isProductLiveDemoAttended?.text || "",
        doctorQuestionStatus: data.doctorQuestion?.status || "",
        doctorQuestionText: data.doctorQuestion?.text || "",
        concernStatus: data.concern?.status || "",
        concernText: data.concern?.text || "",
        wantToBuy: data.wantToBuy?.status || "",
        expectedSalesClosureDate: data.wantToBuy?.expectedSalesClosureDate ? formatDate(data.wantToBuy.expectedSalesClosureDate) : "",
        remark: data.wantToBuy?.remark || "",
        nextMeetingDateTime: data.nextMeetingDateTime ? data.nextMeetingDateTime.slice(0, 16) : "",
        nextCallObjective: data.nextMeetingObjective || "",
        quotationSubmitted: data.quotationSubmitted?.status || "",
        quotationNumber: data.quotationSubmitted?.quotationNumber || "",
        requiredSupport: data.requiredSupport || "",
        comments: data.comments || "",
        orderDate: data.isSalesProcess?.orderDate || "",
        purchaseNumber: data.isSalesProcess?.purchaseNumber || "",
        salesProcessStatus: data.isSalesProcess?.status || "",
      });
    }
  }, [data]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoaderSpinner />
      </div>
    );
  }
  console.log("iddd", id);


  return (
    <div className="w-full min-h-screen">
      {/* Breadcrums mai updation hai employee  id nahi mili hai milne ke bad hong wo  */}
      <BreadCrumb
        linkText={[
          { text: "Customer Visit Plan" },
          {text: "Employee List",
            href: "/admin/sales-executive/employee-list"},
          { text: "Monthly Planning",
             href: `/admin/sales-executive/monthly-planning/${employeeId}` },
          {
            text: "View Monthly Planning",
            href: `/admin/sales-executive/monthly-planning/view-month-wise/${employeeId}?month=${monthlyPlanningDetails?.month}&year=${monthlyPlanningDetails?.year}`,
          },
          { text: `View ${monthlyPlanningDetails?.month} ${monthlyPlanningDetails?.year} Planning`,
           href: `/admin/sales-executive/monthly-planning/view-month-wise/view-day-wise-planning/${employeeId}/${formatDate(data.createPlanningForDate)}` },
          { text: `View ${formatDate(data.createPlanningForDate)} Planning`,
           href: `/admin/sales-executive/monthly-planning/view-month-wise/view-day-wise-planning/${employeeId}/${formatDate(data.createPlanningForDate)}` },
          { text: "View Monthly Planning Details" },
        ]}
      />

      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center">
          <h2
            className="p-4 sm:p-5 font-semibold text-xl rounded-t-2xl shadow-sm"
            style={{ backgroundColor: theme.secondaryColor, color: theme.textColor }}
          >
            View Monthly Planning Details
          </h2>
        </div>

        <div className="bg-white rounded-b-2xl shadow-lg overflow-hidden">
          {/* Month Expired Warning */}
          {/* {isPlanningMonthExpired && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 m-6 rounded-lg">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">This planning month ({planningMonth}) has expired. Editing is no longer allowed.</span>
              </div>
            </div>
          )} */}

          {/* Basic Info Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
                <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                Planning Information
              </h3>
              {validation.canEditPlanningInfo && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  ✏️ Editable Today (1st of Month)
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <Item label="Planning Date & Time" value={formatDateTime(data.createPlanningForDate)} />
              <Item label="Doctor Name" value={data.nameOfDoctor} />
              <Item label="Organization" value={data.selectOrganization} />
              <Item label="Product to Promote" value={data.productToBePromoted} />
              <Item label="Call Objective" value={data.callObjective} />
            </div>
          </div>

          {/* Meeting Form Section */}
          {/* {!isPlanningMonthExpired ? ( */}
            <form onSubmit={formik.handleSubmit} className="p-6 space-y-8">
              {/* Visit Date & Meeting Status */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl">
                <h3 className="font-semibold text-gray-800 text-lg mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
                  Meeting Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Visit Date *</label>
                    <DateInput
                      name="visitDate"
                      value={formik.values.visitDate}
                      onChange={(val) => formik.setFieldValue("visitDate", val)}
                      // disabled={!canEditMeetingDetails}
                    />
                    {formik.touched.visitDate && formik.errors.visitDate && (
                      <p className="text-red-500 text-xs mt-1">{formik.errors.visitDate}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Status *</label>
                    <SelectInput
                      name="meetingStatus"
                      value={formik.values.meetingStatus}
                      onChange={(e) => {
                        formik.handleChange(e);
                        if (e.target.value !== "postponed") {
                          formik.setFieldValue("postponedDate", "");
                          formik.setFieldValue("postponedRemark", "");
                        }
                      }}
                      options={meetingStatusOptions}
                      // disabled={!canEditMeetingDetails}
                    />
                    {formik.touched.meetingStatus && formik.errors.meetingStatus && (
                      <p className="text-red-500 text-xs mt-1">{formik.errors.meetingStatus}</p>
                    )}
                  </div>
                </div>
                
                {/* Postponed Fields */}
                {isPostponed && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Postponed Date *</label>
                      <DateInput
                        name="postponedDate"
                        value={formik.values.postponedDate}
                        onChange={(val) => formik.setFieldValue("postponedDate", val)}
                        // disabled={!canEditMeetingDetails}
                        className="md:w-1/2"
                      />
                      {formik.touched.postponedDate && formik.errors.postponedDate && (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.postponedDate}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Remark *</label>
                      <TextArea
                        name="postponedRemark"
                        value={formik.values.postponedRemark}
                        onChange={(val) => formik.setFieldValue("postponedRemark", val)}
                        placeholder="Enter remarks..."
                        // disabled={!canEditMeetingDetails}
                        className="md:w-1/2"
                      />
                      {formik.touched.postponedRemark && formik.errors.postponedRemark && (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.postponedRemark}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Discussion Points - Only when Meeting Done */}
              {isMeetingDone && (
                <div className="space-y-6">
                  <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm">
                    <h3 className="font-semibold text-gray-800 text-lg mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                      Discussion Points
                    </h3>
                    <div className="space-y-5">
                      {/* Product Feature Benefit */}
                      <div className="flex flex-col md:flex-row md:items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="md:w-56">
                          <label className="text-sm font-medium text-gray-700">Product Feature Benefit Explained?</label>
                        </div>
                        <div className="flex gap-4">
                          {["yes", "no"].map((opt) => (
                            <label key={opt} className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="radio"
                                name="productFeatureBenefitExplainedStatus"
                                value={opt}
                                checked={formik.values.productFeatureBenefitExplainedStatus === opt}
                                onChange={formik.handleChange}
                                // disabled={!canEditMeetingDetails}
                                className="w-4 h-4 text-blue-600 disabled:opacity-50"
                              />
                              <span className="text-sm capitalize">{opt}</span>
                            </label>
                          ))}
                        </div>
                        <div className="flex-1">
                          <TextInput
                            name="productFeatureBenefitExplainedText"
                            value={formik.values.productFeatureBenefitExplainedText}
                            onChange={(val) => formik.setFieldValue("productFeatureBenefitExplainedText", val)}
                            placeholder="Additional details..."
                            // disabled={!canEditMeetingDetails}
                          />
                        </div>
                      </div>

                      {/* Product Dry Demo */}
                      <RadioGroup
                        label="Is Product Dry Demonstration Completed?"
                        name="isProductDryDemoDone"
                        options={["yes", "no"]}
                        value={formik.values.isProductDryDemoDone}
                        onChange={(val) => formik.setFieldValue("isProductDryDemoDone", val)}
                        // disabled={!canEditMeetingDetails}
                      />
                      <div className="ml-4 pl-4">
                        <TextInput
                          name="isProductDryDemoDoneText"
                          value={formik.values.isProductDryDemoDoneText}
                          onChange={(val) => formik.setFieldValue("isProductDryDemoDoneText", val)}
                          placeholder="Additional details..."
                          // disabled={!canEditMeetingDetails}
                        />
                      </div>

                      {/* Product Live Demo */}
                      <RadioGroup
                        label="Is Product Live Demonstration Completed?"
                        name="isProductLiveDemoAttended"
                        options={["yes", "no"]}
                        value={formik.values.isProductLiveDemoAttended}
                        onChange={(val) => formik.setFieldValue("isProductLiveDemoAttended", val)}
                        // disabled={!canEditMeetingDetails}
                      />
                      <div className="ml-4 pl-4">
                        <TextInput
                          name="isProductLiveDemoAttendedText"
                          value={formik.values.isProductLiveDemoAttendedText}
                          onChange={(val) => formik.setFieldValue("isProductLiveDemoAttendedText", val)}
                          placeholder="Additional details..."
                          // disabled={!canEditMeetingDetails}
                        />
                      </div>

                      {/* Doctor Question */}
                      <div className="flex flex-col md:flex-row md:items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="md:w-56">
                          <label className="text-sm font-medium text-gray-700">Doctor Asked Any Question?</label>
                        </div>
                        <div className="flex gap-4">
                          {["yes", "no"].map((opt) => (
                            <label key={opt} className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="radio"
                                name="doctorQuestionStatus"
                                value={opt}
                                checked={formik.values.doctorQuestionStatus === opt}
                                onChange={formik.handleChange}
                                // disabled={!canEditMeetingDetails}
                                className="w-4 h-4 text-blue-600 disabled:opacity-50"
                              />
                              <span className="text-sm capitalize">{opt}</span>
                            </label>
                          ))}
                        </div>
                        <div className="flex-1">
                          <TextInput
                            name="doctorQuestionText"
                            value={formik.values.doctorQuestionText}
                            onChange={(val) => formik.setFieldValue("doctorQuestionText", val)}
                            placeholder="Question details..."
                            // disabled={!canEditMeetingDetails}
                          />
                        </div>
                      </div>

                      {/* Concern */}
                      <div className="flex flex-col md:flex-row md:items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="md:w-56">
                          <label className="text-sm font-medium text-gray-700">Any Concern Raised?</label>
                        </div>
                        <div className="flex gap-4">
                          {["yes", "no"].map((opt) => (
                            <label key={opt} className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="radio"
                                name="concernStatus"
                                value={opt}
                                checked={formik.values.concernStatus === opt}
                                onChange={formik.handleChange}
                                disabled={!canEditMeetingDetails}
                                className="w-4 h-4 text-blue-600 disabled:opacity-50"
                              />
                              <span className="text-sm capitalize">{opt}</span>
                            </label>
                          ))}
                        </div>
                        <div className="flex-1">
                          <TextInput
                            name="concernText"
                            value={formik.values.concernText}
                            onChange={(val) => formik.setFieldValue("concernText", val)}
                            placeholder="Concern details..."
                            // disabled={!canEditMeetingDetails}
                          />
                        </div>
                      </div>

                      {/* Want to Buy */}
                      <RadioGroup
                        label="Want to Buy?"
                        name="wantToBuy"
                        options={["yes", "no"]}
                        value={formik.values.wantToBuy}
                        onChange={(val) => formik.setFieldValue("wantToBuy", val)}
                        // disabled={!canEditMeetingDetails}
                      />

                      {/* Conditional fields for Want to Buy = Yes */}
                      {formik.values.wantToBuy === "yes" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-4 border-green-400 ml-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expected Sales Closure Date *</label>
                            <DateInput
                              name="expectedSalesClosureDate"
                              value={formik.values.expectedSalesClosureDate}
                              onChange={(val) => formik.setFieldValue("expectedSalesClosureDate", val)}
                              // disabled={!canEditMeetingDetails}
                            />
                            {formik.touched.expectedSalesClosureDate && formik.errors.expectedSalesClosureDate && (
                              <p className="text-red-500 text-xs mt-1">{formik.errors.expectedSalesClosureDate}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Remark</label>
                            <TextArea
                              name="remark"
                              value={formik.values.remark}
                              onChange={(val) => formik.setFieldValue("remark", val)}
                              placeholder="Type the Peoples who are critical for the product"
                              rows={2}
                              // disabled={!canEditMeetingDetails}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Visits done */}
                    <div className="flex flex-col md:flex-row md:items-start gap-3 p-3 bg-gray-50 rounded-lg mt-5">
                      <div className="md:w-56">
                        <label className="text-sm font-medium text-gray-700">Total visits done till date:</label>
                      </div>
                      <div className="md:w-56">
                        <span className="text-lg font-bold text-gray-800">{data?.totalVisitsDoneTillDate}</span>
                      </div>
                    </div>

                    {/* Sales process dropdown */}
                    <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm">
                      <h3 className="font-semibold text-gray-800 text-lg mb-4 flex items-center gap-2">
                        <span className="w-1 h-6 bg-yellow-500 rounded-full"></span>
                        Is sales process
                      </h3>
                      <div className="grid grid-cols-1 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Update Sales Status</label>
                          <SelectInput
                            name="salesProcessStatus"
                            value={formik.values.salesProcessStatus}
                            onChange={(e) => {
                              formik.setFieldValue("salesProcessStatus", e.target.value);
                              if (e.target.value !== "continued") {
                                formik.setFieldValue("nextMeetingDateTime", "");
                                formik.setFieldValue("nextCallObjective", "");
                                formik.setFieldValue("quotationSubmitted", "");
                                formik.setFieldValue("quotationNumber", "");
                                formik.setFieldValue("requiredSupport", "");
                                formik.setFieldValue("comments", "");
                              }
                              if (e.target.value !== "completed") {
                                formik.setFieldValue("orderDate", "");
                                formik.setFieldValue("purchaseNumber", "");
                              }
                            }}
                            options={salesStatusOptions}
                            // disabled={!canEditMeetingDetails}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Next Meeting Fields - Show when Sales Process is "Continued" */}
                  {formik.values.salesProcessStatus === "continued" && (
                    <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm">
                      <h3 className="font-semibold text-gray-800 text-lg mb-4 flex items-center gap-2">
                        <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                        Next Meeting Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Next Meeting Date & Time *</label>
                          <DateTimeInput
                            name="nextMeetingDateTime"
                            value={formik.values.nextMeetingDateTime}
                            onChange={(val) => formik.setFieldValue("nextMeetingDateTime", val)}
                            // disabled={!canEditMeetingDetails}
                          />
                          {formik.touched.nextMeetingDateTime && formik.errors.nextMeetingDateTime && (
                            <p className="text-red-500 text-xs mt-1">{formik.errors.nextMeetingDateTime}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Next Call Objective *</label>
                          <TextInput
                            name="nextCallObjective"
                            value={formik.values.nextCallObjective}
                            onChange={(val) => formik.setFieldValue("nextCallObjective", val)}
                            placeholder="Enter next call objective"
                            // disabled={!canEditMeetingDetails}
                          />
                          {formik.touched.nextCallObjective && formik.errors.nextCallObjective && (
                            <p className="text-red-500 text-xs mt-1">{formik.errors.nextCallObjective}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Quotation Submitted?</label>
                          <div className="flex gap-4 mt-1">
                            {["yes", "no"].map((opt) => (
                              <label key={opt} className="flex items-center gap-1 cursor-pointer">
                                <input
                                  type="radio"
                                  name="quotationSubmitted"
                                  value={opt}
                                  checked={formik.values.quotationSubmitted === opt}
                                  onChange={formik.handleChange}
                                  // disabled={!canEditMeetingDetails}
                                  className="w-4 h-4 text-purple-600 disabled:opacity-50"
                                />
                                <span className="text-sm capitalize">{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        
                        {/* Quotation Number - Show when Quotation Submitted is "yes" */}
                        {formik.values.quotationSubmitted === "yes" && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quotation Number *</label>
                            <TextInput
                              name="quotationNumber"
                              value={formik.values.quotationNumber}
                              onChange={(val) => formik.setFieldValue("quotationNumber", val)}
                              placeholder="Enter quotation number"
                              // disabled={!canEditMeetingDetails}
                            />
                            {formik.touched.quotationNumber && formik.errors.quotationNumber && (
                              <p className="text-red-500 text-xs mt-1">{formik.errors.quotationNumber}</p>
                            )}
                          </div>
                        )}
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Required Support</label>
                          <TextInput
                            name="requiredSupport"
                            value={formik.values.requiredSupport}
                            onChange={(val) => formik.setFieldValue("requiredSupport", val)}
                            placeholder="Any support required?"
                            // disabled={!canEditMeetingDetails}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
                          <TextArea
                            name="comments"
                            value={formik.values.comments}
                            onChange={(val) => formik.setFieldValue("comments", val)}
                            placeholder="Additional comments..."
                            rows={3}
                            // disabled={!canEditMeetingDetails}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Order Details - Show when Sales Process is "Completed" */}
                  {formik.values.salesProcessStatus === "completed" && (
                    <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm">
                      <h3 className="font-semibold text-gray-800 text-lg mb-4 flex items-center gap-2">
                        <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                        Order Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Order Date *</label>
                          <DateInput
                            name="orderDate"
                            value={formik.values.orderDate}
                            onChange={(val) => formik.setFieldValue("orderDate", val)}
                            // disabled={!canEditMeetingDetails}
                          />
                          {formik.touched.orderDate && formik.errors.orderDate && (
                            <p className="text-red-500 text-xs mt-1">{formik.errors.orderDate}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Number *</label>
                          <TextInput
                            name="purchaseNumber"
                            value={formik.values.purchaseNumber}
                            onChange={(val) => formik.setFieldValue("purchaseNumber", val)}
                            placeholder="Enter purchase number"
                            // disabled={!canEditMeetingDetails}
                          />
                          {formik.touched.purchaseNumber && formik.errors.purchaseNumber && (
                            <p className="text-red-500 text-xs mt-1">{formik.errors.purchaseNumber}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
{/* no requrment for ADMIN */}
              {/* Save Button */}
              {/* <div className="flex justify-end pt-4 border-t border-gray-200">
                <Button
                  type="submit"
                  // disabled={!canEditMeetingDetails}
                  variant={1}
                  text="Save Details"
                />
              </div> */}
            </form>
          {/* // ) : (
          //   <div className="p-8 text-center bg-yellow-50 m-6 rounded-lg">
          //     <div className="text-yellow-700">
          //       <svg className="w-12 h-12 mx-auto mb-3 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          //       </svg>
          //       <p className="text-lg font-medium">
          //         Meeting form is only available during the planning month ({planningMonth})
          //       </p>
          //       <p className="text-sm mt-1">
          //         Please check back during the planning period to update meeting details.
          //       </p>
          //     </div>
          //   </div>
          // )} */}
        </div>
      </div>
    </div>
  );
}

export default ViewMonthlyPlanningDetails;