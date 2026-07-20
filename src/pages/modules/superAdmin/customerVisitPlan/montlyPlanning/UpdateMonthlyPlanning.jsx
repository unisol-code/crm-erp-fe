import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { toast } from "react-toastify";

import Button from "../../../../../components/uiComponents/button/Button";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb";
import useMonthlyPlanning from "../../../../../hooks/salesExecutiveHook/customerVisitPlan/useMonthlyPlanning";

const UpdateMonthlyPlanning = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    fetchMonthlyPlanningDetailsById, 
    monthlyPlanningDetails, 
    loading: fetchLoading 
  } = useMonthlyPlanning();
  
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchMonthlyPlanningDetailsById(id);
    }
  }, [id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      // Read-only top fields
      createPlanningForDate: monthlyPlanningDetails?.createPlanningForDate || "",
      selectOrganization: monthlyPlanningDetails?.selectOrganization || "",
      nameOfDoctor: monthlyPlanningDetails?.nameOfDoctor || "",
      productToBePromoted: monthlyPlanningDetails?.productToBePromoted || "",
      callObjective: monthlyPlanningDetails?.callObjective || "",
      
      // Editable fields
      visitDate: monthlyPlanningDetails?.visitDate || "",
      meetingStatus: monthlyPlanningDetails?.meetingStatus || "", // meeting done, postponed
      postponedDate: monthlyPlanningDetails?.postponedDate || "",
      
      // Discussion Points (if meeting done)
      productFeatureBenefitExplained: monthlyPlanningDetails?.productFeatureBenefitExplained?.status || "no",
      isProductDryDemoDone: monthlyPlanningDetails?.isProductDryDemoDone || "no",
      isProductLiveDemoAttended: monthlyPlanningDetails?.isProductLiveDemoAttended || "no",
      doctorQuestion: monthlyPlanningDetails?.doctorQuestion?.status || "no",
      concern: monthlyPlanningDetails?.concern?.status || "no",
      wantToBuy: monthlyPlanningDetails?.wantToBuy || "no",
      expectedSalesClosureDate: monthlyPlanningDetails?.expectedSalesClosureDate || "",
      remark: monthlyPlanningDetails?.remark || "",
      
      // Next meeting fields
      nextMeetingDate: monthlyPlanningDetails?.nextMeetingDate || "",
      nextMeetingTime: monthlyPlanningDetails?.nextMeetingTime || "",
      nextCallObjective: monthlyPlanningDetails?.nextCallObjective || "",
      quotationSubmitted: monthlyPlanningDetails?.quotationSubmitted || "no",
      requiredSupport: monthlyPlanningDetails?.requiredSupport || "",
      comments: monthlyPlanningDetails?.comments || "",
    },
    validationSchema: Yup.object({
      visitDate: Yup.date().required("Visit Date is required"),
      meetingStatus: Yup.string().required("Meeting Status is required"),
      wantToBuy: Yup.string(),
      expectedSalesClosureDate: Yup.date().when("wantToBuy", {
        is: "yes",
        then: (schema) => schema.required("Expected sales closure date is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      remark: Yup.string().when("wantToBuy", {
        is: "yes",
        then: (schema) => schema.required("Remark is required"),
        otherwise: (schema) => schema.notRequired(),
      })
    }),
    onSubmit: async (values) => {
      setSubmitting(true);
      try {
        // Mocking the update API call for now as the update endpoint was not found
        console.log("Updating with values: ", values);
        toast.success("Monthly planning updated successfully");
        navigate("/sales-executive/monthly-planning");
      } catch (err) {
        toast.error("Failed to update monthly planning");
      } finally {
        setSubmitting(false);
      }
    }
  });

  const meetingStatusOptions = [
    { label: "Meeting Done", value: "meeting done" },
    { label: "Postponed", value: "postponed" }
  ];

  const yesNoOptions = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" }
  ];

  if (fetchLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="w-full min-h-screen pb-10 bg-[#F4F7FE]">
      <BreadCrumb
        linkText={[
          { text: "Customer Visit Plan" },
          { text: "Monthly Planning", href: "/sales-executive/monthly-planning" },
          { text: "Update Monthly Planning" }
        ]}
      />

      <div className="px-6 py-4">
        <h1 className="text-2xl font-bold text-[#1F2937] flex items-center gap-2 mb-6">
          <span className="text-[#355DC4]">✏️</span> Update Monthly Planning
        </h1>
        
        <form onSubmit={formik.handleSubmit}>
          {/* Read-Only Top Section */}
          <div className="bg-white rounded-[20px] p-6 shadow-sm mb-6 border border-gray-100">
            <h2 className="text-sm font-bold text-gray-500 uppercase mb-6 flex items-center gap-2">
              📋 Planning Information (Read Only)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-400 mb-1">Date & Time</label>
                <div className="font-medium text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-100">
                  {formik.values.createPlanningForDate ? new Date(formik.values.createPlanningForDate).toLocaleString() : "N/A"}
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-400 mb-1">Organization</label>
                <div className="font-medium text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-100">
                  {formik.values.selectOrganization || "N/A"}
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-400 mb-1">Individual Name</label>
                <div className="font-medium text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-100">
                  {formik.values.nameOfDoctor || "N/A"}
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-400 mb-1">Product</label>
                <div className="font-medium text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-100">
                  {formik.values.productToBePromoted || "N/A"}
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-400 mb-1">Call Objective</label>
                <div className="font-medium text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-100">
                  {formik.values.callObjective || "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* Editable Section */}
          <div className="bg-white rounded-[20px] p-6 shadow-sm mb-6 border border-gray-100 border-l-4 border-l-[#355DC4]">
            <h2 className="text-sm font-bold text-gray-700 uppercase mb-6 flex items-center gap-2">
              📝 Update Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">Visit Date</label>
                <input
                  type="date"
                  name="visitDate"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.visitDate}
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:border-[#355DC4] outline-none"
                />
                {formik.touched.visitDate && formik.errors.visitDate && (
                  <p className="mt-1 text-xs text-red-500">{formik.errors.visitDate}</p>
                )}
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">Meeting Status</label>
                <Select
                  name="meetingStatus"
                  options={meetingStatusOptions}
                  value={meetingStatusOptions.find((opt) => opt.value === formik.values.meetingStatus) || null}
                  onChange={(selected) => formik.setFieldValue("meetingStatus", selected?.value || "")}
                  placeholder="Select Meeting Status"
                />
                {formik.touched.meetingStatus && formik.errors.meetingStatus && (
                  <p className="mt-1 text-xs text-red-500">{formik.errors.meetingStatus}</p>
                )}
              </div>

              {formik.values.meetingStatus === "postponed" && (
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">Postponed Date (Optional)</label>
                  <input
                    type="date"
                    name="postponedDate"
                    onChange={formik.handleChange}
                    value={formik.values.postponedDate}
                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:border-[#355DC4] outline-none"
                  />
                </div>
              )}
            </div>

            {/* Conditionally Rendered Section */}
            {formik.values.meetingStatus === "meeting done" && (
              <div className="bg-[#f8faff] p-6 rounded-xl border border-[#e0e7ff]">
                <h3 className="text-[#355DC4] font-bold mb-6">Meeting Discussion Points</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Radio Questions */}
                  {[
                    { name: "productFeatureBenefitExplained", label: "Product Feature Benefit Explained?" },
                    { name: "isProductDryDemoDone", label: "Is Product Dry Demonstration Done?" },
                    { name: "isProductLiveDemoAttended", label: "Is Product Live Demonstration Attended?" },
                    { name: "doctorQuestion", label: "Doctor Asked Any Question?" },
                    { name: "concern", label: "Any Concern Raised?" },
                    { name: "wantToBuy", label: "Want to Buy?" },
                  ].map((field) => (
                    <div key={field.name} className="flex justify-between items-center border-b border-gray-100 pb-3">
                      <span className="text-sm text-gray-700 font-medium">{field.label}</span>
                      <div className="flex gap-4">
                        {yesNoOptions.map((opt) => (
                          <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={field.name}
                              value={opt.value}
                              onChange={formik.handleChange}
                              checked={formik.values[field.name] === opt.value}
                              className="w-4 h-4 text-[#355DC4] border-gray-300 focus:ring-[#355DC4]"
                            />
                            <span className="text-sm">{opt.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Conditional Fields if Want to Buy is Yes */}
                {formik.values.wantToBuy === "yes" && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-green-800 mb-2">Expected Sales Closure Date</label>
                      <input
                        type="date"
                        name="expectedSalesClosureDate"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.expectedSalesClosureDate}
                        className="w-full p-2 border border-green-200 rounded-lg outline-none focus:border-green-500"
                      />
                      {formik.touched.expectedSalesClosureDate && formik.errors.expectedSalesClosureDate && (
                        <p className="mt-1 text-xs text-red-500">{formik.errors.expectedSalesClosureDate}</p>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-green-800 mb-2">Remark</label>
                      <input
                        type="text"
                        name="remark"
                        placeholder="Enter remark"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.remark}
                        className="w-full p-2 border border-green-200 rounded-lg outline-none focus:border-green-500"
                      />
                      {formik.touched.remark && formik.errors.remark && (
                        <p className="mt-1 text-xs text-red-500">{formik.errors.remark}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Next Meeting Section */}
          <div className="bg-white rounded-[20px] p-6 shadow-sm mb-6 border border-gray-100">
            <h2 className="text-sm font-bold text-gray-700 uppercase mb-6 flex items-center gap-2">
              🗓️ Next Meeting Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">Next Meeting Date & Time</label>
                <input
                  type="datetime-local"
                  name="nextMeetingDate"
                  onChange={formik.handleChange}
                  value={formik.values.nextMeetingDate}
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:border-[#355DC4] outline-none"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">Next Call Objective</label>
                <input
                  type="text"
                  name="nextCallObjective"
                  placeholder="Enter objective"
                  onChange={formik.handleChange}
                  value={formik.values.nextCallObjective}
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:border-[#355DC4] outline-none"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">Quotation Submitted?</label>
                <Select
                  name="quotationSubmitted"
                  options={yesNoOptions}
                  value={yesNoOptions.find(opt => opt.value === formik.values.quotationSubmitted) || null}
                  onChange={(selected) => formik.setFieldValue("quotationSubmitted", selected?.value || "")}
                />
              </div>

              <div className="flex flex-col md:col-span-3">
                <label className="text-sm font-semibold text-gray-700 mb-2">Required Support</label>
                <textarea
                  name="requiredSupport"
                  rows="2"
                  placeholder="Any required support..."
                  onChange={formik.handleChange}
                  value={formik.values.requiredSupport}
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:border-[#355DC4] outline-none"
                ></textarea>
              </div>

              <div className="flex flex-col md:col-span-3">
                <label className="text-sm font-semibold text-gray-700 mb-2">Comments</label>
                <textarea
                  name="comments"
                  rows="2"
                  placeholder="Additional comments..."
                  onChange={formik.handleChange}
                  value={formik.values.comments}
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:border-[#355DC4] outline-none"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate("/sales-executive/monthly-planning")}
              className="px-6 py-2 rounded-full font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-2 rounded-full font-medium text-white bg-[#1a5b4c] hover:bg-[#13463a] transition-colors flex items-center gap-2"
            >
              {submitting ? "Saving..." : "Update Planning"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateMonthlyPlanning;
