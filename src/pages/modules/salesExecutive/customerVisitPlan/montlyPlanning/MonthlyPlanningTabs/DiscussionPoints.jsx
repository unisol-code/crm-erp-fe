import React from "react";

const DiscussionPoints = ({ formik }) => {
 return(
   <div className="bg-white p-4 rounded-b mb-5">
    <div className="col-span-full bg-white p-4 mb-5 rounded">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Product Feature Benefit */}
        <div>
          <label className="block font-medium text-sm text-gray-700">
            Product Feature Benefit Explained?
          </label>
          <div className="flex gap-4 mt-1">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="productFeatureBenefitExplained.status"
                value="yes"
                checked={formik.values.productFeatureBenefitExplained.status === "yes"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              Yes
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="productFeatureBenefitExplained.status"
                value="no"
                checked={formik.values.productFeatureBenefitExplained.status  === "no"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              No
            </label>
          </div>
          {formik.values.productFeatureBenefitExplained.status  === "yes" && (
            <>
              <input
                type="text"
                name="productFeatureBenefitExplained.text"
                placeholder="Explain the product feature benefit"
                value={formik.values.productFeatureBenefitExplained.text}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-2 w-full border p-2 rounded"
              />
              {formik.touched.productFeatureBenefitExplained?.text && formik.errors.productFeatureBenefitExplained?.text && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.productFeatureBenefitExplained.text}</p>
              )}
            </>
          )}
        </div>

        {/* Dry Demonstration Done */}
        <div>
          <label className="block font-medium text-sm text-gray-700">
            Is Product Dry Demonstration Done?
          </label>
          <div className="flex gap-4 mt-1">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="isProductDryDemoDone"
                value="yes"
                checked={formik.values.isProductDryDemoDone === "yes"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              Yes
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="isProductDryDemoDone"
                value="no"
                checked={formik.values.isProductDryDemoDone === "no"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              No
            </label>
          </div>
        </div>

        {/* Live Demo Attended */}
        <div>
          <label className="block font-medium text-sm text-gray-700">
            Is Product Live Demonstration Attended?
          </label>
          <div className="flex gap-4 mt-1">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="isProductLiveDemoAttended"
                value="yes"
                checked={formik.values.isProductLiveDemoAttended === "yes"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              Yes
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="isProductLiveDemoAttended"
                value="no"
                checked={formik.values.isProductLiveDemoAttended === "no"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              No
            </label>
          </div>
        </div>

        {/* Doctor Question */}
        <div>
          <label className="block font-medium text-sm text-gray-700">
            Doctor Asked Any Question?
          </label>
          <div className="flex gap-4 mt-1">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="doctorQuestion.status"
                value="yes"
                checked={formik.values.doctorQuestion.status === "yes"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              Yes
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="doctorQuestion.status"
                value="no"
                checked={formik.values.doctorQuestion.status === "no"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              No
            </label>
          </div>
          {formik.values.doctorQuestion.status === "yes" && (
            <>
              <input
                type="text"
                name="doctorQuestion.text"
                placeholder="Enter doctor's question"
                value={formik.values.doctorQuestion.text}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-2 w-full border p-2 rounded"
              />
              {formik.touched.doctorQuestion?.text && formik.errors.doctorQuestion?.text && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.doctorQuestion.text}</p>
              )}
            </>
          )}
        </div>

        {/* Concern Raised */}
        <div>
          <label className="block font-medium text-sm text-gray-700">
            Any Concern Raised?
          </label>
          <div className="flex gap-4 mt-1">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="concern.status"
                value="yes"
                checked={formik.values.concern.status === "yes"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              Yes
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="concern.status"
                value="no"
                checked={formik.values.concern.status === "no"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              No
            </label>
          </div>
          {formik.values.concern.status === "yes" && (
            <>
              <input
                type="text"
                name="concern.text"
                placeholder="Enter concern details"
                value={formik.values.concern.text}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-2 w-full border p-2 rounded"
              />
              {formik.touched.concern?.text && formik.errors.concern?.text && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.concern.text}</p>
              )}
            </>
          )}
        </div>

        {/* Addressed/Satisfied/Want to Buy */}
        <div>
          <label className="block font-medium text-sm text-gray-700">
            Addressed, Satisfied, or Want to Buy?
          </label>
          <div className="flex gap-4 mt-1">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="addressedSatisfiedWantToBuy.status"
                value="yes"
                checked={formik.values.addressedSatisfiedWantToBuy.status}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              Yes
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="addressedSatisfiedWantToBuy.status"
                value="no"
                checked={formik.values.addressedSatisfiedWantToBuy.status === "no"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              No
            </label>
          </div>
          {formik.values.addressedSatisfiedWantToBuy.status === "yes" && (
            <>
              <input
                type="text"
                name="addressedSatisfiedWantToBuy.text"
                placeholder="Explain satisfaction or interest"
                value={formik.values.addressedSatisfiedWantToBuy?.text}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-2 w-full border p-2 rounded"
              />
              {formik.touched.addressedSatisfiedWantToBuy?.text && formik.errors.addressedSatisfiedWantToBuy?.text && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.addressedSatisfiedWantToBuy?.text}</p>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  </div>
 )
}

export default DiscussionPoints;