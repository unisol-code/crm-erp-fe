import React, { useEffect, useMemo } from "react";
import useDropdown from "../../../../../../hooks/dropdown/useDropdown";
import Select from "react-select";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const salesStatus = [
  { label: "Hot - Within 30 Days", value: "hot", color: "bg-red-100 text-red-500" },
  { label: "Warm - Within 60 Days", value: "warm", color: "bg-orange-100 text-orange-500" },
  { label: "Cold - Within 90 Days", value: "cold", color: "bg-blue-100 text-blue-500" },
  { label: "Coverage List - Within 180 days", value: "coverage", color: "bg-indigo-100 text-indigo-500" },
];

const NextMeeting = ({ formik }) => {
  const { loading, productList, fetchProductsNames, callobjectivestatus, fetchCallObjectiveStatuses } = useDropdown();

  useEffect(() => {
    fetchProductsNames();
    fetchCallObjectiveStatuses();
  }, []);

  // Precompute dropdown options
  const objectiveOptions = useMemo(() =>
    Array.isArray(callobjectivestatus)
      ? callobjectivestatus.map(opt => ({ label: opt, value: opt }))
      : [],
    [callobjectivestatus]
  );

  const productOptions = useMemo(() =>
    Array.isArray(productList)
      ? productList.map(product => ({ label: product.name, value: product.name }))
      : [],
    [productList]
  );

  const nextCallObjectiveOptions = [
    { label: "Attending Doctor", value: "Attending Doctor" },
    { label: "OPD Call", value: "OPD Call" },
    { label: "Product Demo", value: "Product Demo" },
    { label: "Clinical Study", value: "Clinical Study" },
    { label: "Other", value: "Other" }
  ];

  const leadGeneratedThroughOptions = [
    { label: "Email", value: "Email" },
    { label: "Calling", value: "Calling" },
    { label: "Meeting", value: "Meeting" },
    { label: "Referral", value: "Referral" },
    { label: "Other", value: "Other" }
  ];

  return (
    <div className="bg-white p-4 rounded-b mb-5">
      <div className="col-span-full bg-white p-4 rounded">
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-6 mb-4">
          {/* Next Meeting Date */}
          <div>
            <label>Next Meeting Date</label>
            <input
              type="date"
              name="nextMeetingDate"
              placeholder="Select next meeting date"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.nextMeetingDate}
              className="w-full border p-2 rounded"
            />
            {formik.touched.nextMeetingDate && formik.errors.nextMeetingDate && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.nextMeetingDate}</p>
            )}
          </div>

          {/* Next Meeting Time */}
          <div>
            <label>Next Meeting Time</label>
            <input
              type="time"
              name="nextMeetingTime"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.nextMeetingTime}
              className="w-full border p-2 rounded"
            />
            {formik.touched.nextMeetingTime && formik.errors.nextMeetingTime && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.nextMeetingTime}</p>
            )}
          </div>

          {/* Next Call Objective */}
          <div>
            <label>Next Call Objective</label>
            <Select
              name="nextCallObjective"
              isClearable
              options={nextCallObjectiveOptions}
              value={nextCallObjectiveOptions.find(opt => opt.value === formik.values.nextCallObjective) || null}
              onChange={selectedOption =>
                formik.setFieldValue("nextCallObjective", selectedOption?.value || "")
              }
              onBlur={formik.handleBlur}
              classNamePrefix="react-select"
            />
            {formik.touched.nextCallObjective && formik.errors.nextCallObjective && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.nextCallObjective}</p>
            )}
          </div>

          {/* Next Call Objective Status */}
          <div>
            <label>Next Call Objective Status</label>
            <Select
              name="nextCallObjectiveStatus"
              isLoading={loading}
              isClearable
              options={objectiveOptions}
              value={objectiveOptions.find(opt => opt.value === formik.values.nextCallObjectiveStatus) || null}
              onChange={selectedOption =>
                formik.setFieldValue("nextCallObjectiveStatus", selectedOption?.value || "")
              }
              onBlur={formik.handleBlur}
              classNamePrefix="react-select"
            />
            {formik.touched.nextCallObjectiveStatus && formik.errors.nextCallObjectiveStatus && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.nextCallObjectiveStatus}</p>
            )}
          </div>

          {/* Next Call Duration */}
          <div>
            <label>Next Call Duration</label>
            <input
              type="text"
              name="nextCallDuration"
              placeholder="Enter Eg: 15 Min"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.nextCallDuration}
              className="w-full border p-2 rounded"
            />
            {formik.touched.nextCallDuration && formik.errors.nextCallDuration && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.nextCallDuration}</p>
            )}
          </div>

          {/* Required Support */}
          <div>
            <label>Required Support</label>
            <input
              type="text"
              name="requiredSupport"
              placeholder="Enter required support"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.requiredSupport}
              className="w-full border p-2 rounded"
            />
            {formik.touched.requiredSupport && formik.errors.requiredSupport && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.requiredSupport}</p>
            )}
          </div>

          {/* Sales Expected Date */}
          <div>
            <label>Sales Expected Date</label>
            <input
              type="date"
              name="salesExpectedDate"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.salesExpectedDate}
              className="w-full border p-2 rounded"
            />
            {formik.touched.salesExpectedDate && formik.errors.salesExpectedDate && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.salesExpectedDate}</p>
            )}
          </div>

          {/* Comments */}
          <div>
            <label>Comments</label>
            <textarea
              name="comments"
              rows="1"
              placeholder="Enter Comments"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.comments}
              className="w-full min-h-30 border p-2 rounded"
            />
            {formik.touched.comments && formik.errors.comments && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.comments}</p>
            )}
          </div>

          {/* Sales Value Expected */}
          <div>
            <label>Sales Value Expected</label>
            <input
              type="number"
              name="salesValueExpected"
              placeholder="Enter value"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.salesValueExpected}
              onWheel={(e) => e.target.blur()}
              className={cn("w-full border p-2 rounded", "no-spinner")}
            />
            {formik.touched.salesValueExpected && formik.errors.salesValueExpected && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.salesValueExpected}</p>
            )}
          </div>

          {/* Product Name */}
          <div>
            <label>Product Name</label>
            <Select
              name="productName"
              isLoading={loading}
              isClearable
              options={productOptions}
              value={productOptions.find(opt => opt.value === formik.values.productName) || null}
              onChange={selectedOption =>
                formik.setFieldValue("productName", selectedOption?.value || "")
              }
              classNamePrefix="react-select"
            />
            {formik.touched.productName && formik.errors.productName && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.productName}</p>
            )}
          </div>
        </div>

        {/* Sales Status */}
        <div className="mb-6 w-full sm:w-1/2">
          <label className="block font-medium mb-2">Sales Status</label>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
            {salesStatus.map(status => (
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
                  value={status.value}
                  checked={formik.values.salesStatus === status.value}
                  onChange={formik.handleChange}
                />
                {status.label}
              </label>
            ))}
          </div>
          {formik.touched.salesStatus && formik.errors.salesStatus && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.salesStatus}</p>
          )}
        </div>

        {/* Lead Generated Through */}
        <div className="w-full sm:w-1/2">
          <label className="block font-medium mb-1">Lead Generated Through</label>
          <Select
            name="leadGeneratedThrough"
            isClearable
            options={leadGeneratedThroughOptions}
            value={leadGeneratedThroughOptions.find(opt => opt.value === formik.values.leadGeneratedThrough) || null}
            onChange={selectedOption =>
              formik.setFieldValue("leadGeneratedThrough", selectedOption?.value || "")
            }
            onBlur={formik.handleBlur}
            classNamePrefix="react-select"
          />
          {formik.touched.leadGeneratedThrough && formik.errors.leadGeneratedThrough && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.leadGeneratedThrough}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NextMeeting;
