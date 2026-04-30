import React, { useEffect } from "react";

const Salutation = ({ formik }) => {
  return (
    <>
      <h2 className="mb-6 text-lg font-semibold">If Salutation Is Dr.</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Left Column */}
        <div>
          <div className="flex flex-col mb-4">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Speciality
            </label>
            <select
              id="speciality"
              className="px-2 py-3 border border-gray-500 rounded-xl"
              value={formik.values.speciality}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option>Select Speciality</option>
              <option>none</option>
            </select>
            {formik.touched.speciality && formik.errors.speciality ? (
              <div className="text-red-500">{formik.errors.speciality}</div>
            ) : null}
          </div>

          <div className="flex flex-col mb-4">
            <label
              htmlFor="additionalQualification"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Additional Qualification
            </label>
            <input
              id="additionalQualification"
              type="text"
              placeholder="Enter Speciality"
              className="px-2 py-3 border border-gray-500 rounded-xl"
              value={formik.values.additionalQualification}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.additionalQualification &&
            formik.errors.additionalQualification ? (
              <div className="text-red-500">
                {formik.errors.additionalQualification}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col mb-4">
            <label
              htmlFor="employeeStatus"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Employee Status
            </label>
            <input
              id="employeeStatus"
              type="text"
              placeholder="Enter Employee Status"
              className="px-2 py-3 border border-gray-500 rounded-xl"
              value={formik.values.employeeStatus}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.employeeStatus && formik.errors.employeeStatus ? (
              <div className="text-red-500">{formik.errors.employeeStatus}</div>
            ) : null}
          </div>

          <div className="flex flex-col mb-4">
            <label
              htmlFor="officeAddress"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Office Address
            </label>
            <input
              id="officeAddress"
              type="text"
              placeholder="Enter Office Address"
              className="px-2 py-3 border border-gray-500 rounded-xl"
              value={formik.values.officeAddress}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.officeAddress && formik.errors.officeAddress ? (
              <div className="text-red-500">{formik.errors.officeAddress}</div>
            ) : null}
          </div>

          <div className="flex flex-col mb-4">
            <label
              htmlFor="phoneNumber1"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Phone Number 1
            </label>
            <input
              type="text"
              id="phoneNumber1"
              placeholder="Enter Phone Number 1"
              className="px-2 py-3 border border-gray-500 rounded-xl"
              value={formik.values.phoneNumber1}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.phoneNumber1 && formik.errors.phoneNumber1 ? (
              <div className="text-red-500">{formik.errors.phoneNumber1}</div>
            ) : null}
          </div>

          <div className="flex flex-col mb-4">
            <label
              htmlFor="emailAddress1"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Email Address 1
            </label>
            <input
              type="email"
              id="emailAddress1"
              placeholder="Enter Email Address 1"
              className="px-2 py-3 border border-gray-500 rounded-xl"
              value={formik.values.emailAddress1}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.emailAddress1 && formik.errors.emailAddress1 ? (
              <div className="text-red-500">{formik.errors.emailAddress1}</div>
            ) : null}
          </div>

          <div className="flex flex-col mb-4">
            <label
              htmlFor="websiteURL"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Website URL (Optional)
            </label>
            <input
              type="text"
              id="websiteURL"
              placeholder="Enter Website URL"
              className="px-2 py-3 border border-gray-500 rounded-xl"
              value={formik.values.websiteURL}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.websiteURL && formik.errors.websiteURL ? (
              <div className="text-red-500">{formik.errors.websiteURL}</div>
            ) : null}
          </div>

          <div className="flex flex-col mb-4">
            <label
              htmlFor="facebookURL"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Facebook URL (Optional)
            </label>
            <input
              id="facebookURL"
              type="url"
              placeholder="Enter Facebook URL"
              className="px-2 py-3 border border-gray-500 rounded-xl"
              value={formik.values.facebookURL}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.facebookURL && formik.errors.facebookURL ? (
              <div className="text-red-500">{formik.errors.facebookURL}</div>
            ) : null}
          </div>

          <div className="flex flex-col mb-4">
            <label
              htmlFor="affiliatedHospitalsOrganizations"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Affiliated Hospitals/Organizations
            </label>
            <input
              type="text"
              id="affiliatedHospitalsOrganizations"
              placeholder="Enter Organization Name"
              className="px-2 py-3 border border-gray-500 rounded-xl"
              value={formik.values.affiliatedHospitalsOrganizations}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.affiliatedHospitalsOrganizations &&
            formik.errors.affiliatedHospitalsOrganizations ? (
              <div className="text-red-500">
                {formik.errors.affiliatedHospitalsOrganizations}
              </div>
            ) : null}
          </div>

          <div className="mt-6">
            <button className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
              Add Organization <span className="text-lg font-bold">+</span>
            </button>
          </div>

          <div className="flex flex-col mb-4">
            <label
              htmlFor="OPDDay"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              OPD Days
            </label>

            <input
              type="text"
              id="OPDDay"
              placeholder="Enter OPD Days"
              className="px-2 py-3 border border-gray-500 rounded-xl"
              value={formik.values.OPDDay}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.OPDDay && formik.errors.OPDDay ? (
              <div className="text-red-500">{formik.errors.OPDDay}</div>
            ) : null}
          </div>

          <div className="flex flex-col mb-4">
            <label
              htmlFor="surgeryDay"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Surgery Days
            </label>
            <input
              type="text"
              id="surgeryDay"
              placeholder="Enter Surgery Days"
              className="px-2 py-3 border border-gray-500 rounded-xl"
              value={formik.values.surgeryDay}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.surgeryDay && formik.errors.surgeryDay ? (
              <div className="text-red-500">{formik.errors.surgeryDay}</div>
            ) : null}
          </div>
        </div>

        {/* Right Column */}
        <div>
          <div className="flex flex-col mb-4">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Profile
            </label>
            <select
              id="profile"
              value={formik.values.profile}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="px-2 py-3 border border-gray-500 rounded-xl"
            >
              <option>Select</option>
              <option>New</option>
            </select>
            {formik.touched.profile && formik.errors.profile ? (
              <div className="text-red-500">{formik.errors.profile}</div>
            ) : null}
          </div>

          <div className="flex flex-col mb-4">
            <label
              htmlFor="qualificationSpeciality"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Qualification Speciality
            </label>
            <input
              type="text"
              id="qualificationSpeciality"
              placeholder="Enter Qualification Speciality"
              className="px-2 py-3 border border-gray-500 rounded-xl"
              value={formik.values.qualificationSpeciality}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.qualificationSpeciality &&
            formik.errors.qualificationSpeciality ? (
              <div className="text-red-500">
                {formik.errors.qualificationSpeciality}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col mb-[82px]"></div>

          <div className="flex flex-col mb-4">
            <label
              htmlFor="landmark"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Landmark
            </label>
            <input
              id="landmark"
              type="text"
              placeholder="Enter Landmark"
              className="px-2 py-3 border border-gray-500 rounded-xl"
              value={formik.values.landmark}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.landmark && formik.errors.landmark ? (
              <div className="text-red-500">{formik.errors.landmark}</div>
            ) : null}
          </div>

          <div className="flex flex-col mb-4">
            <label
              htmlFor="phoneNumber2"
              className="mb-1 text-sm font-medium text-gray-700 "
            >
              Phone Number 2
            </label>
            <input
              id="phoneNumber2"
              type="text"
              placeholder="Enter Phone Number 2"
              className="px-2 py-3 border border-gray-500 rounded-xl"
              value={formik.values.phoneNumber2}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.phoneNumber2 && formik.errors.phoneNumber2 ? (
              <div className="text-red-500">{formik.errors.phoneNumber2}</div>
            ) : null}
          </div>

          <div className="flex flex-col mb-4">
            <label
              htmlFor="emailAddress2"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Email Address 2
            </label>
            <input
              type="email"
              id="emailAddress2"
              placeholder="Enter Email Address 2"
              className="px-2 py-3 border border-gray-500 rounded-xl"
              value={formik.values.emailAddress2}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.emailAddress2 && formik.errors.emailAddress2 ? (
              <div className="text-red-500">{formik.errors.emailAddress2}</div>
            ) : null}
          </div>

          <div className="flex flex-col mb-4">
            <label
              htmlFor="linkedInURL"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              LinkedIn URL (Optional)
            </label>
            <input
              type="text"
              id="linkedInURL"
              placeholder="Enter LinkedIn URL"
              className="px-2 py-3 border border-gray-500 rounded-xl"
              value={formik.values.linkedInURL}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.linkedInURL && formik.errors.linkedInURL ? (
              <div className="text-red-500">{formik.errors.linkedInURL}</div>
            ) : null}
          </div>

          <div className="flex flex-col mb-4">
            <label
              htmlFor="instagramURL"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Instagram URL (Optional)
            </label>
            <input
              type="text"
              id="instagramURL"
              placeholder="Enter Instagram URL"
              className="px-2 py-3 border border-gray-500 rounded-xl"
              value={formik.values.instagramURL}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.instagramUrl && formik.errors.instagramURL ? (
              <div className="text-red-500">{formik.errors.instagramURL}</div>
            ) : null}
          </div>

          <div className="flex flex-col mb-4">
            <label
              htmlFor="surgeryTime"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Type of Speciality
            </label>
            <input
              id="typeofSpeciality"
              type="text"
              placeholder="Enter Type of Speciality"
              className="px-2 py-3 border border-gray-500 rounded-xl"
              value={formik.values.typeofSpeciality}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.typeofSpeciality &&
            formik.errors.typeofSpeciality ? (
              <div className="text-red-500">
                {formik.errors.typeofSpeciality}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col mb-[55px]"></div>

          <div className="flex flex-col mb-4">
            <label
              htmlFor="OPDTime"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              {" "}
              OPD Time
            </label>
            <input
              id="OPDTime"
              type="text"
              placeholder="Enter OPD Time"
              className="px-2 py-3 border border-gray-500 rounded-xl"
              value={formik.values.OPDTime}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.OPDTime && formik.errors.OPDTime ? (
              <div className="text-red-500">{formik.errors.OPDTime}</div>
            ) : null}
          </div>

          <div className="flex flex-col mb-4">
            <label
              htmlFor="surgeryTime"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Surgery Time
            </label>
            <input
              id="surgeryTime"
              type="text"
              placeholder="Enter Surgery Time"
              className="px-2 py-3 border border-gray-500 rounded-xl"
              value={formik.values.surgeryTime}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.surgeryTime && formik.errors.surgeryTime ? (
              <div className="text-red-500">{formik.errors.surgeryTime}</div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default Salutation;
