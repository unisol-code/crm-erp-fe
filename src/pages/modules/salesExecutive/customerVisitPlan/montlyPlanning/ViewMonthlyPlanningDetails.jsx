import React, { useEffect, useState } from "react";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import { useParams } from "react-router-dom";
import useMonthlyPlanning from "../../../../../hooks/salesExecutiveHook/customerVisitPlan/useMonthlyPlanning";
import LoaderSpinner from "../../../../../components/uiComponents/loader/LoaderSpinner";

// Reusable Item (2 per row)
const Item = ({ label, value }) => (
  <div className="flex flex-col mb-3">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <p className="mt-1 text-gray-800">{value || "N/A"}</p>
  </div>
);

const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

function ViewMonthlyPlanningDetails() {
  const { theme } = useTheme();
  const { month, year, id } = useParams();
  const { fetchMonthlyPlanningDetailsById, monthlyPlanningDetails, loading } = useMonthlyPlanning();

  // Local state for form fields
  const [visitDate, setVisitDate] = useState("");
  const [meetingStatus, setMeetingStatus] = useState("");
  const [postponedDate, setPostponedDate] = useState("");
  const [productFeatureBenefitExplained, setProductFeatureBenefitExplained] = useState({ status: "", text: "" });
  const [isProductDryDemoDone, setIsProductDryDemoDone] = useState("");
  const [isProductDryDemoDoneText, setIsProductDryDemoDoneText] = useState("");
  const [isProductLiveDemoAttended, setIsProductLiveDemoAttended] = useState("");
  const [isProductLiveDemoAttendedText, setIsProductLiveDemoAttendedText] = useState("");
  const [doctorQuestion, setDoctorQuestion] = useState({ status: "", text: "" });
  const [concern, setConcern] = useState({ status: "", text: "" });
  const [wantToBuy, setWantToBuy] = useState("");
  const [expectedSalesClosureDate, setExpectedSalesClosureDate] = useState("");
  const [remark, setRemark] = useState("");
  
  // Next meeting fields
  const [nextMeetingDateTime, setNextMeetingDateTime] = useState("");
  const [nextCallObjective, setNextCallObjective] = useState("");
  const [quotationSubmitted, setQuotationSubmitted] = useState("");
  const [requiredSupport, setRequiredSupport] = useState("");
  const [comments, setComments] = useState("");

  useEffect(() => {
    if (id) {
      fetchMonthlyPlanningDetailsById(id);
    }
  }, [id]);

  // Check if form should be visible (after 1st of planning month)
  const shouldShowForm = () => {
    if (!monthlyPlanningDetails?.data?.createPlanningForDate) return false;
    const planningDate = new Date(monthlyPlanningDetails.data.createPlanningForDate);
    const currentDate = new Date();
    const firstOfPlanningMonth = new Date(planningDate.getFullYear(), planningDate.getMonth(), 1);
    return currentDate >= firstOfPlanningMonth;
  };

  const data = monthlyPlanningDetails?.data || {};

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString("en-GB") : "N/A";

  const salesStatusList = [
    { label: "Hot - Within 30 Days", value: "hot", color: "bg-red-100 text-red-500" },
    { label: "Warm - Within 60 Days", value: "warm", color: "bg-orange-100 text-orange-500" },
    { label: "Cold - Within 90 Days", value: "cold", color: "bg-blue-100 text-blue-500" },
    { label: "Coverage List - Within 180 days", value: "coverage", color: "bg-indigo-100 text-indigo-500" },
  ];

  const handleMeetingStatusChange = (e) => {
    const status = e.target.value;
    setMeetingStatus(status);
    if (status !== "postponed") {
      setPostponedDate("");
    }
  };

  const handleSave = () => {
    const payload = {
      visitDate,
      meetingStatus,
      ...(meetingStatus === "postponed" && { postponedDate }),
      ...(meetingStatus === "meeting done" && {
        productFeatureBenefitExplained,
        isProductDryDemoDone,
        isProductDryDemoDoneText,
        isProductLiveDemoAttended,
        isProductLiveDemoAttendedText,
        doctorQuestion,
        concern,
        wantToBuy,
        ...(wantToBuy === "yes" && { expectedSalesClosureDate, remark }),
        nextMeetingDateTime,
        nextCallObjective,
        quotationSubmitted,
        requiredSupport,
        comments,
      }),
    };
    console.log("Save Payload:", payload);
    // API call to save data
  };

  const isMeetingDone = meetingStatus === "meeting done";

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoaderSpinner />
      </div>
    );
  }

  console.log("Monthly Planning Details:", monthlyPlanningDetails);

  return (
    <div className="w-full min-h-screen">
      <BreadCrumb
        linkText={[
          { text: "Customer Visit Plan" },
          { text: "Monthly Planning", href: "/sales-executive/monthly-planning" },
          { text: "View Monthly Planning", href: `/sales-executive/monthly-planning/view-monthly-planning/${month}/${year}` },
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
          {/* Basic Info Section - Always Visible */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800 text-lg mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
              Planning Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <Item label="Planning Date" value={formatDate(data.createPlanningForDate)} />
              <Item label="Doctor Name" value={data.nameOfDoctor} />
              <Item label="Organization" value={data.selectOrganization} />
              <Item label="Product to Promote" value={data.productToBePromoted} />
              <Item label="Call Objective" value={data.callObjective} />
              {/* <Item label="Sales Status" value={data.salesStatus} /> */}
            </div>
          </div>

          {/* Meeting Form - Visible after 1st of planning month */}
          {shouldShowForm() ? (
            <div className="p-6 space-y-8">
              {/* Visit Date & Meeting Status */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl">
                <h3 className="font-semibold text-gray-800 text-lg mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
                  Meeting Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Visit Date *</label>
                    <input
                      type="date"
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Status *</label>
                    <select
                      value={meetingStatus}
                      onChange={handleMeetingStatusChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                      <option value="">Select Status</option>
                      <option value="meeting done">Meeting Done</option>
                      <option value="postponed">Postponed</option>
                    </select>
                  </div>
                </div>
                {meetingStatus === "postponed" && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Postponed Date</label>
                    <input
                      type="date"
                      value={postponedDate}
                      onChange={(e) => setPostponedDate(e.target.value)}
                      className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
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
                                name="productFeature"
                                value={opt}
                                checked={productFeatureBenefitExplained.status === opt}
                                onChange={(e) => setProductFeatureBenefitExplained({ ...productFeatureBenefitExplained, status: e.target.value })}
                                className="w-4 h-4 text-blue-600"
                              />
                              <span className="text-sm capitalize">{opt}</span>
                            </label>
                          ))}
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Additional details..."
                            value={productFeatureBenefitExplained.text}
                            onChange={(e) => setProductFeatureBenefitExplained({ ...productFeatureBenefitExplained, text: e.target.value })}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      {/* Product Dry Demo */}
                      <div className="flex flex-col md:flex-row md:items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="md:w-56">
                          <label className="text-sm font-medium text-gray-700">Is Product Dry Demonstration Done?</label>
                        </div>
                        <div className="flex gap-4">
                          {["yes", "no"].map((opt) => (
                            <label key={opt} className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="radio"
                                name="dryDemo"
                                value={opt}
                                checked={isProductDryDemoDone === opt}
                                onChange={(e) => setIsProductDryDemoDone(e.target.value)}
                                className="w-4 h-4 text-blue-600"
                              />
                              <span className="text-sm capitalize">{opt}</span>
                            </label>
                          ))}
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Additional details..."
                            value={isProductDryDemoDoneText}
                            onChange={(e) => setIsProductDryDemoDoneText(e.target.value)}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      {/* Product Live Demo */}
                      <div className="flex flex-col md:flex-row md:items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="md:w-56">
                          <label className="text-sm font-medium text-gray-700">Is Product Live Demonstration Attended?</label>
                        </div>
                        <div className="flex gap-4">
                          {["yes", "no"].map((opt) => (
                            <label key={opt} className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="radio"
                                name="liveDemo"
                                value={opt}
                                checked={isProductLiveDemoAttended === opt}
                                onChange={(e) => setIsProductLiveDemoAttended(e.target.value)}
                                className="w-4 h-4 text-blue-600"
                              />
                              <span className="text-sm capitalize">{opt}</span>
                            </label>
                          ))}
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Additional details..."
                            value={isProductLiveDemoAttendedText}
                            onChange={(e) => setIsProductLiveDemoAttendedText(e.target.value)}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
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
                                name="doctorQuestion"
                                value={opt}
                                checked={doctorQuestion.status === opt}
                                onChange={(e) => setDoctorQuestion({ ...doctorQuestion, status: e.target.value })}
                                className="w-4 h-4 text-blue-600"
                              />
                              <span className="text-sm capitalize">{opt}</span>
                            </label>
                          ))}
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Question details..."
                            value={doctorQuestion.text}
                            onChange={(e) => setDoctorQuestion({ ...doctorQuestion, text: e.target.value })}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
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
                                name="concern"
                                value={opt}
                                checked={concern.status === opt}
                                onChange={(e) => setConcern({ ...concern, status: e.target.value })}
                                className="w-4 h-4 text-blue-600"
                              />
                              <span className="text-sm capitalize">{opt}</span>
                            </label>
                          ))}
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Concern details..."
                            value={concern.text}
                            onChange={(e) => setConcern({ ...concern, text: e.target.value })}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      {/* Want to Buy */}
                      <div className="flex flex-col md:flex-row md:items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="md:w-56">
                          <label className="text-sm font-medium text-gray-700">Want to Buy?</label>
                        </div>
                        <div className="flex gap-4">
                          {["yes", "no"].map((opt) => (
                            <label key={opt} className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="radio"
                                name="wantToBuy"
                                value={opt}
                                checked={wantToBuy === opt}
                                onChange={(e) => setWantToBuy(e.target.value)}
                                className="w-4 h-4 text-blue-600"
                              />
                              <span className="text-sm capitalize">{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Conditional fields for Want to Buy = Yes */}
                      {wantToBuy === "yes" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-4 border-green-400 ml-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expected Sales Closure Date</label>
                            <input
                              type="date"
                              value={expectedSalesClosureDate}
                              onChange={(e) => setExpectedSalesClosureDate(e.target.value)}
                              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Remark</label>
                            <textarea
                              rows="2"
                              value={remark}
                              onChange={(e) => setRemark(e.target.value)}
                              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                              placeholder="Add remarks..."
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Next Meeting Fields */}
                  <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm">
                    <h3 className="font-semibold text-gray-800 text-lg mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                      Next Meeting Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Next Meeting Date & Time</label>
                        <input
                          type="datetime-local"
                          value={nextMeetingDateTime}
                          onChange={(e) => setNextMeetingDateTime(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Next Call Objective</label>
                        <input
                          type="text"
                          value={nextCallObjective}
                          onChange={(e) => setNextCallObjective(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="Enter next call objective"
                        />
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
                                checked={quotationSubmitted === opt}
                                onChange={(e) => setQuotationSubmitted(e.target.value)}
                                className="w-4 h-4 text-purple-600"
                              />
                              <span className="text-sm capitalize">{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Required Support</label>
                        <input
                          type="text"
                          value={requiredSupport}
                          onChange={(e) => setRequiredSupport(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="Any support required?"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
                        <textarea
                          rows="3"
                          value={comments}
                          onChange={(e) => setComments(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="Additional comments..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Save Meeting Details
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-yellow-50 m-6 rounded-lg">
              <div className="text-yellow-700">
                <svg className="w-12 h-12 mx-auto mb-3 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg font-medium">Meeting form will be available from {formatDate(new Date(new Date(data.createPlanningForDate).getFullYear(), new Date(data.createPlanningForDate).getMonth(), 1))}</p>
                <p className="text-sm mt-1">Please check back after the planning month starts to update meeting details.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewMonthlyPlanningDetails;