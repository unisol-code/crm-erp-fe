import React, { useState, useEffect } from "react";
import useDropdown from "../../../../../../hooks/dropdown/useDropdown";

const PracticeOp = ({ formik }) => {
 const { fetchCategory, category: apiCategories } = useDropdown();
  const [categories, setCategories] = useState([]);
  const [selectedVisitCategory, setSelectedVisitCategory] = useState("");

  useEffect(() => {
    fetchCategory();
  }, []);

  useEffect(() => {
    if (apiCategories && Array.isArray(apiCategories)) {
      setCategories(apiCategories);
    }
  }, [apiCategories]);

  console.log()

  const handleCategoryChange = (e) => {
    const selectedLabel = e.target.value;
    formik.setFieldValue("category", selectedLabel);
    
    const selectedObj = categories.find((item) => item.label === selectedLabel);
    if (selectedObj) {
      setSelectedVisitCategory(selectedObj.visitCategory);
      formik.setFieldValue("visitForEachCategory", selectedObj.visitCategory);
    } else {
      setSelectedVisitCategory("");
      formik.setFieldValue("visitForEachCategory", "");
    }
  };

  return (
    <div className="flex flex-col items-center justify-around w-full space-y-4">
      <div className="flex w-full gap-4">
        <h1 className="mb-4 text-xl font-bold ">PRACTICE OPERATION</h1>
      </div>
      <div className="flex w-full gap-4">
        <div className="flex flex-col w-1/2">
          <label
            htmlFor="noofPatientsInAYear"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            No of Patients in a Year
          </label>
          <input
            type="text"
            id="noofPatientsInAYear"
            placeholder="Enter number of patients"
            className="px-2 py-3 border border-gray-500 rounded-xl"
            value={formik.values.noofPatientsInAYear}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.noofPatientsInAYear &&
          formik.errors.noofPatientsInAYear ? (
            <div className="text-red-500">
              {formik.errors.noofPatientsInAYear}
            </div>
          ) : null}
        </div>
        <div className="flex flex-col w-1/2">
          <label
            htmlFor="typeofSurgeriesPerformed"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Type of Surgeries Performed
          </label>
          <select
            id="typeofSurgeriesPerformed"
            className="px-2 py-3 border border-gray-500 rounded-xl"
            value={formik.values.typeofSurgeriesPerformed}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">Select Type of Surgery</option>
            <option value="Open Surgery">Open Surgery</option>
          </select>
          {formik.touched.typeofSurgeriesPerformed &&
          formik.errors.typeofSurgeriesPerformed ? (
            <div className="text-red-500">
              {formik.errors.typeofSurgeriesPerformed}
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex w-full gap-4">
        <div className="flex flex-col w-1/2">
          <label
            htmlFor="openSurgery"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Open Surgery
          </label>
          <input
            type="text"
            id="openSurgery"
            placeholder="Enter open surgery details"
            className="px-2 py-3 border border-gray-500 rounded-xl"
            value={formik.values.openSurgery}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.openSurgery && formik.errors.openSurgery ? (
            <div className="text-red-500">{formik.errors.openSurgery}</div>
          ) : null}
        </div>
        <div className="flex flex-col w-1/2">
          <label
            htmlFor="labSurgery"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Lab Surgery
          </label>
          <input
            type="text"
            id="labSurgery"
            placeholder="Enter lab surgery details"
            className="px-2 py-3 border border-gray-500 rounded-xl"
            value={formik.values.labSurgery}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.labSurgery && formik.errors.labSurgery ? (
            <div className="text-red-500">{formik.errors.labSurgery}</div>
          ) : null}
        </div>
      </div>

      <div className="flex w-full gap-4">
        <div className="flex flex-col w-1/2">
          <label className="mb-1 text-sm font-medium text-gray-700">
            Robotic Surgery
          </label>
          <input
            type="text"
            id="roboticSurgery"
            placeholder="Enter robotic surgery details"
            className="px-2 py-3 border border-gray-500 rounded-xl"
            value={formik.values.roboticSurgery}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.roboticSurgery && formik.errors.roboticSurgery ? (
            <div className="text-red-500">{formik.errors.roboticSurgery}</div>
          ) : null}
        </div>
        <div className="flex flex-col w-1/2">
          <label className="mb-1 text-sm font-medium text-gray-700">
            Hobbies
          </label>
          <input
            type="text"
            id="hobbies"
            placeholder="Enter hobbies"
            className="px-2 py-3 border border-gray-500 rounded-xl"
            value={formik.values.hobbies}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.hobbies && formik.errors.hobbies ? (
            <div className="text-red-500">{formik.errors.hobbies}</div>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col w-full gap-x-4 md:flex-row">
        <div className="flex flex-col flex-1">
          <label className="mb-1 text-sm font-medium text-gray-700">
            Prefered Day to Contact
          </label>
          <input
            type="date"
            id="day"
            placeholder="Enter date"
            className="px-2 py-3 border border-gray-500 rounded-xl"
            value={formik.values. preferredContactSlots}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.preferedDaytoContact && formik.errors.preferredContactSlots ? (
            <div className="text-red-500">{formik.errors.preferredContactSlots}</div>
          ) : null}
        </div>
        <div className="flex flex-col w-1/2">
          <label className="mb-1 text-sm font-medium text-gray-700">
           Prefered Time to Contact
          </label>
          <input
            type="time"
            id="time"
            placeholder="Enter time"
            className="px-2 py-3 border border-gray-500 rounded-xl"
            value={formik.values.preferredContactSlots}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.hobbies && formik.errors.preferredContactSlots ? (
            <div className="text-red-500">{formik.errors.preferredContactSlots}</div>
          ) : null}
        </div>
      </div>

<div className="flex w-full gap-4">
          {[0, 1, 2].map((index) => (
            <div key={index} className="flex flex-col flex-1">
              <label className="mb-1 text-sm font-medium text-gray-700">
                Professional Aspiration {index + 1}
              </label>
              <input
                type="text"
                placeholder={`Professional Aspiration ${index + 1}`}
                className="px-2 py-3 border border-gray-500 rounded-xl"
                name={`professionalAspirations[${index}]`}
                value={formik.values.professionalAspirations[index]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {
                formik.touched.professionalAspirations &&
                  formik.touched.professionalAspirations[index] &&
                  formik.errors.professionalAspirations &&
                  formik.errors.professionalAspirations[index] ? (
                  <div className="text-red-500">
                    {formik.errors.professionalAspirations[index]}
                  </div>
                ) : null
              }
            </div>
          ))}
        </div>

    <div className="flex w-full gap-4">
        {/* Category Dropdown */}
        <div className="flex flex-col w-1/2">
          <label className="mb-1 text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            className="px-2 py-3 border border-gray-500 rounded-xl"
            id="category"
            value={formik.values.category}
            onChange={handleCategoryChange}
            onBlur={formik.handleBlur}
          >
            <option value="">Select Category</option>
            {categories.map((item, index) => (
              <option key={index} value={item.label}>
                {item.label}
              </option>
            ))}
          </select>
          {formik.touched.category && formik.errors.category ? (
            <div className="text-red-500">{formik.errors.category}</div>
          ) : null}
        </div>

        {/* Visit For Each Category */}
        <div className="flex w-1/2 gap-4">
          <div className="flex flex-col w-full">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Visit For Each Category
            </label>
            <input
              type="text"
              id="visitForEachCategory"
              placeholder="Enter visit frequency"
              className="px-2 py-3 border border-gray-500 rounded-xl"
              value={formik.values.visitForEachCategory}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!formik.values.category} // disable if no category selected
            />
            {formik.touched.visitForEachCategory &&
            formik.errors.visitForEachCategory ? (
              <div className="text-red-500">
                {formik.errors.visitForEachCategory}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex w-full gap-4">
        <div className="flex flex-col w-1/2">
          <label className="mb-1 text-sm font-medium text-gray-700">
            Interested in Future Webinars or Educational Materials
          </label>
          <input
            type="text"
            id="interestedInFutureWebinarsorEducationalMaterials"
            placeholder="Enter interest level"
            className="px-2 py-3 border border-gray-500 rounded-xl"
            value={
              formik.values.interestedInFutureWebinarsorEducationalMaterials
            }
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.interestedInFutureWebinarsorEducationalMaterials &&
          formik.errors.interestedInFutureWebinarsorEducationalMaterials ? (
            <div className="text-red-500">
              {formik.errors.interestedInFutureWebinarsorEducationalMaterials}
            </div>
          ) : null}
        </div>
        <div className="flex w-1/2 gap-4">
          <div className="flex flex-col w-full">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Associated with Organizations
            </label>
            <input
              type="text"
              id="associatedOrganizations"
              placeholder="Enter organization name"
              className="px-2 py-3 border border-gray-500 rounded-xl"
              value={formik.values.associatedOrganizations}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.associatedOrganizations &&
            formik.errors.associatedOrganizations ? (
              <div className="text-red-500">
                {formik.errors.associatedOrganizations}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex w-full gap-4">
        <div className="flex flex-col w-1/2">
          <label className="mb-1 text-sm font-medium text-gray-700">
            Published Any Clinical Studies
          </label>
          <input
            id="publishedAnyClinicalStudies"
            type="text"
            placeholder="Enter publication details"
            className="px-2 py-3 border border-gray-500 rounded-xl"
            value={formik.values.publishedAnyClinicalStudies}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.publishedAnyClinicalStudies &&
          formik.errors.publishedAnyClinicalStudies ? (
            <div className="text-red-500">
              {formik.errors.publishedAnyClinicalStudies}
            </div>
          ) : null}
        </div>
        <div className="flex w-1/2 gap-4">
          <div className="flex flex-col w-full">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Product to Be Promoted
            </label>
            <input
              id="productToBePromoted"
              type="text"
              placeholder="Enter product name"
              className="px-2 py-3 border border-gray-500 rounded-xl"
              value={formik.values.productToBePromoted}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.productToBePromoted &&
            formik.errors.productToBePromoted ? (
              <div className="text-red-500">
                {formik.errors.productToBePromoted}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeOp;
