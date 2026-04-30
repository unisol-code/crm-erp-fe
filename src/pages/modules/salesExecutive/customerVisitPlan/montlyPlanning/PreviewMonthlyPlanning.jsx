import React from "react";
import { useState } from "react";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb";
import Button from "../../../../../components/uiComponents/button/Button";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import { monthlyPlanningPreviewAtom } from "../../../../../state/mothlyPlanningState/monthlyPlanningState";
import { useRecoilValue } from "recoil";


const Item = ({ label, value }) => (
  <div className="flex flex-col mb-3">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <p className="mt-1 text-gray-800">{value || "N/A"}</p>
  </div>
);
const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

// Format date utility
const formatDate = (dateStr) =>
  dateStr ? new Date(dateStr).toLocaleDateString("en-GB") : "N/A";
const salesStatus = [
  {
    label: "Hot - Within 30 Days",
    value: "hot",
    color: "bg-red-100 text-red-500",
  },
  {
    label: "Warm - Within 60 Days",
    value: "warm",
    color: "bg-orange-100 text-orange-500",
  },
  {
    label: "Cold - Within 90 Days",
    value: "cold",
    color: "bg-blue-100 text-blue-500",
  },
  {
    label: "Coverage List - Within 180 days",
    value: "coverage",
    color: "bg-indigo-100 text-indigo-500",
  },
];


const PreviewCreateMonthlyPlanning = () => {
  const { theme } = useTheme();
  const data = useRecoilValue(monthlyPlanningPreviewAtom);
  if (!data || Object.keys(data).length === 0) {
    return <div className="p-4 text-center">No preview data available.</div>;
  }

  return (
    <div className="w-full min-h-screen">
      {/* Breadcrumbs */}
      <BreadCrumb linkText={[{ text: "Customer Visit Plan" }, { text: "Monthly Planning", href: "/sales-executive/monthly-planning" }, { text: "Create Monthly Planning", href: "/sales-executive/monthly-planning/create-monthly-plan" }, { text: "Preiew Monthly Planning Details" }]} />
      <div>
        {/* Page Header */}
        <div className="text-center">
          <h2
            className="p-4 sm:p-6 font-semibold text-lg rounded-t-2xl"
            style={{ backgroundColor: theme.secondaryColor }}
          >
            Preiew Monthly Planning Details
          </h2>
        </div>

        <div className="bg-white rounded-b-2xl"> {data && (
          <div className="grid w-full grid-cols-1 gap-6 p-4">
            <div className="bg-white p-5 border border-gray-300 rounded-2xl shadow-sm">
              <h3 className="font-semibold text-gray-800 text-lg">Planning Info</h3>
              <hr className="my-2" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Item label="Planning Date" value={formatDate(data.createPlanningForDate)} />
                <Item label="Visit" value={data.visit} />
                <Item label="Doctor Name" value={data.nameOfDoctor} />
                <Item label="Organization" value={data.selectOrganization} />
                <Item label="Speciality" value={data.specialty} />
                <Item label="Product to Promote" value={data.productToBePromoted} />
                <Item label="Expected Call Duration" value={data.expectedCallDuration} />
                <Item label="Meeting Time" value={data.meetingTime} />
                <Item label="Anniversary Date" value={formatDate(data.anniversaryDate)} />
                <Item label="Birthday Date" value={formatDate(data.birthdayDate)} />
                <Item label="Call Purpose" value={data.callPurpose} />
                <Item label="Duration of Meeting" value={data.durationOfMeeting} />
                <Item label="Visiting Time" value={data.visitingTime} />
                <Item label="Visiting Place" value={data.visitingPlace} />
                <Item label="Call Objective" value={data.callObjective} />
                <Item label="Call Objective Status" value={data.callObjectiveStatus} />
                <Item label="Hospital OPD" value={data.hospitalOPD} />
              </div>
            </div>

            {/* Discussion Points */}
            <div className="bg-white p-5 border border-gray-300 rounded-2xl shadow-sm">
              <h3 className="font-semibold text-gray-800 text-lg">Discussion Points</h3>
              <hr className="my-2" />
              <div className="space-y-2">
                {/* 1. Product Feature Benefit, Explained? */}
                <div className="flex items-start gap-3 py-2">
                  <div className="flex-shrink-0 w-48">
                    <label className="text-sm font-medium text-gray-700">
                      Product Feature Benefit, Explained?
                    </label>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={data.productFeatureBenefitExplained?.status?.toLowerCase() === "yes"}
                        readOnly
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                      />
                      <span className="text-sm">Yes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={data.productFeatureBenefitExplained?.status?.toLowerCase() === "no"}
                        readOnly
                        className="w-4 h-4 text-red-600 border-gray-300 rounded"
                      />
                      <span className="text-sm">No</span>
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="border border-gray-300 rounded px-3 py-1 bg-gray-50 min-h-[32px] text-sm text-gray-800">
                      {data.productFeatureBenefitExplained?.text || "N/A"}
                    </div>
                  </div>
                </div>

                {/* 2. Is Product Dry Demonstration Done? */}
                <div className="flex items-start gap-3 py-2">
                  <div className="flex-shrink-0 w-48">
                    <label className="text-sm font-medium text-gray-700">
                      Is Product Dry Demonstration Done?
                    </label>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={data.isProductDryDemoDone?.toLowerCase() === "yes"}
                        readOnly
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                      />
                      <span className="text-sm">Yes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={data.isProductDryDemoDone?.toLowerCase() === "no"}
                        readOnly
                        className="w-4 h-4 text-red-600 border-gray-300 rounded"
                      />
                      <span className="text-sm">No</span>
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="border border-gray-300 rounded px-3 py-1 bg-gray-50 min-h-[32px] text-sm text-gray-800">
                      {data.isProductDryDemoDoneText?.text || data.isProductDryDemoDoneText || "N/A"}
                    </div>
                  </div>
                </div>

                {/* 3. Is Product Live Demonstration Attended? */}
                <div className="flex items-start gap-3 py-2">
                  <div className="flex-shrink-0 w-48">
                    <label className="text-sm font-medium text-gray-700">
                      Is Product Live Demonstration Attended?
                    </label>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={data.isProductLiveDemoAttended?.toLowerCase() === "yes"}
                        readOnly
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                      />
                      <span className="text-sm">Yes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={data.isProductLiveDemoAttended?.toLowerCase() === "no"}
                        readOnly
                        className="w-4 h-4 text-red-600 border-gray-300 rounded"
                      />
                      <span className="text-sm">No</span>
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="border border-gray-300 rounded px-3 py-1 bg-gray-50 min-h-[32px] text-sm text-gray-800">
                      {data.isProductLiveDemoAttendedText?.text || data.isProductLiveDemoAttendedText || "N/A"}
                    </div>
                  </div>
                </div>

                {/* 4. Doctor's Question? */}
                <div className="flex items-start gap-3 py-2">
                  <div className="flex-shrink-0 w-48">
                    <label className="text-sm font-medium text-gray-700">
                      Doctor Asked Any Question?
                    </label>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={data.doctorQuestion?.status?.toLowerCase() === "yes"}
                        readOnly
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                      />
                      <span className="text-sm">Yes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={data.doctorQuestion?.status?.toLowerCase() === "no"}
                        readOnly
                        className="w-4 h-4 text-red-600 border-gray-300 rounded"
                      />
                      <span className="text-sm">No</span>
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="border border-gray-300 rounded px-3 py-1 bg-gray-50 min-h-[32px] text-sm text-gray-800">
                      {data.doctorQuestion?.text || "N/A"}
                    </div>
                  </div>
                </div>

                {/* 5. Concern? */}
                <div className="flex items-start gap-3 py-2">
                  <div className="flex-shrink-0 w-48">
                    <label className="text-sm font-medium text-gray-700">
                      Any Concern Raised?
                    </label>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={data.concern?.status?.toLowerCase() === "yes"}
                        readOnly
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                      />
                      <span className="text-sm">Yes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={data.concern?.status?.toLowerCase() === "no"}
                        readOnly
                        className="w-4 h-4 text-red-600 border-gray-300 rounded"
                      />
                      <span className="text-sm">No</span>
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="border border-gray-300 rounded px-3 py-1 bg-gray-50 min-h-[32px] text-sm text-gray-800">
                      {data.concern?.text || "N/A"}
                    </div>
                  </div>
                </div>

                {/* 6. Addressed / Satisfied / Want To Buy? */}
                <div className="flex items-start gap-3 py-2">
                  <div className="flex-shrink-0 w-48">
                    <label className="text-sm font-medium text-gray-700">
                      Addressed, Satisfied, or Want to Buy?
                    </label>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={data.addressedSatisfiedWantToBuy?.status?.toLowerCase() === "yes"}
                        readOnly
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                      />
                      <span className="text-sm">Yes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={data.addressedSatisfiedWantToBuy?.status?.toLowerCase() === "no"}
                        readOnly
                        className="w-4 h-4 text-red-600 border-gray-300 rounded"
                      />
                      <span className="text-sm">No</span>
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="border border-gray-300 rounded px-3 py-1 bg-gray-50 min-h-[32px] text-sm text-gray-800">
                      {data.addressedSatisfiedWantToBuy?.text || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Meeting & Sales Info */}
            <div className="bg-white p-5 border border-gray-300 rounded-2xl shadow-sm">
              <h3 className="font-semibold text-lg text-gray-800">Next Meeting</h3>
              <hr className="my-2" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Item label="Next Meeting Date" value={formatDate(data.nextMeetingDate)} />
                <Item label="Next Meeting Time" value={data.nextMeetingTime} />
                <Item label="Next Call Objective" value={data.nextCallObjective} />
                <Item label="Next Call Objective Status" value={data.nextCallObjectiveStatus} />
                <Item label="Next Call Duration" value={data.nextCallDuration} />
                <Item label="Sales Expected Date" value={formatDate(data.salesExpectedDate)} />
                <Item label="Sales Value Expected" value={data.salesValueExpected} />
                <Item label="Required Support" value={data.requiredSupport} />
                <Item label="Comments" value={data.comments} />
                <label className="text-sm font-medium text-gray-700">Sales Status</label>
                <div className="col-span-2">
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                    {salesStatus.map((status) => (
                      <label
                        key={status.value}
                        className={cn(
                          "px-3 py-1 border border-gray-300 rounded-md flex items-center gap-2 text-sm cursor-pointer",
                          status.color
                        )}
                      >
                        <input
                          type="radio"
                          name="salesStatus"
                          value={data.salestatus}
                          checked={data.salesStatus === status.value}
                          readOnly
                        />
                        {status.label}
                      </label>
                    ))}
                  </div>
                </div>
                <Item label="Lead Generated Through" value={data.leadGeneratedThrough} />
              </div>
            </div>
          </div>
        )}</div>
      </div>
    </div>
  );
};


export default PreviewCreateMonthlyPlanning;
