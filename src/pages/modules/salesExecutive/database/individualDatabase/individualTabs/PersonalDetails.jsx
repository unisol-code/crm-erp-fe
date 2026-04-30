import React, { useEffect } from "react";
import useDropdown from "../../../../../../hooks/dropdown/useDropdown";

const PersonalDetails = ({ formData, handleChange, formik }) => {
  const {
    fetchGender,
    gender,
    fetchSalutation,
    salutation,
    fetchCustomersProfile,
    customerProfile,
    fetchTypeOfProfile,
    typeOfProfile,
  } = useDropdown();

  useEffect(() => {
    fetchGender();
    fetchSalutation();
    fetchCustomersProfile();
    fetchTypeOfProfile();
  }, []);

  console.log(typeOfProfile);

  return (
    <div className="w-full space-y-6">
   
      <h1 className="pb-2 mb-6 text-lg font-semibold text-gray-800 border-b">
        PERSONAL DETAILS
      </h1>
       

      {/* Department & Designation */}
      <div className="flex flex-wrap gap-4">
      
        <div className="flex flex-col flex-1">
          <label
            htmlFor="department"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Department
          </label>
          <input
            type="text"
            id="department"
            placeholder="Enter Department"
            className="px-2 py-3 border border-gray-500 rounded-xl"
            value={formik.values.department}
            onChange={(e) => {
              formik.handleChange(e);
            }}
            onBlur={formik.handleBlur}
          />
          {formik.touched.department && formik.errors.department ? (
            <div className="text-red-500">{formik.errors.department}</div>
          ) : null}
        </div>
        <div className="flex flex-col flex-1">
          <label
            htmlFor="designation"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Designation
          </label>
          <input
            type="text"
            id="designation"
            placeholder="Enter Designation"
            className="px-2 py-3 border border-gray-500 rounded-xl"
            value={formik.values.designation}
            onChange={(e) => {
              formik.handleChange(e);
            }}
            onBlur={formik.handleBlur}
          />
          {formik.touched.designation && formik.errors.designation ? (
            <div className="text-red-500">{formik.errors.designation}</div>
          ) : null}
        </div>
      </div>

      {/* Salutation & Gender */}
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col flex-1">
          <label
            htmlFor="salutation"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Salutation
          </label>
          <select
            id="salutation"
            className="px-2 py-3 border border-gray-500 rounded-xl"
            value={formik.values.salutation}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option>Select Salutation</option>
            {salutation?.map((item, index) => {
              return <option value={item}>{item}</option>;
            })}
          </select>
          {formik.touched.salutation && formik.errors.salutation ? (
            <div className="text-red-500">{formik.errors.salutation}</div>
          ) : null}
        </div>
        <div className="flex flex-col flex-1">
          <label
            htmlFor="gender"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Gender
          </label>
          <select
            id="gender"
            className="px-2 py-3 border border-gray-500 rounded-xl"
            value={formik.values.gender}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option>Select Gender</option>
            {gender?.map((item, index) => {
              return <option value={item}>{item}</option>;
            })}
          </select>
          {formik.touched.gender && formik.errors.gender ? (
            <div className="text-red-500">{formik.errors.gender}</div>
          ) : null}
        </div>
      </div>

      {/* Name */}
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col flex-1">
          <label
            htmlFor="firstName"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            placeholder="Enter First Name"
            className="px-2 py-3 border border-gray-500 rounded-xl"
            value={formik.values.firstName}
            onChange={(e) => {
              formik.handleChange(e);
            }}
            onBlur={formik.handleBlur}
          />
          {formik.touched.firstName && formik.errors.firstName ? (
            <div className="text-red-500">{formik.errors.firstName}</div>
          ) : null}
        </div>
        <div className="flex flex-col flex-1">
          <label
            htmlFor="lastName"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            placeholder="Enter Last Name"
            className="px-2 py-3 border border-gray-500 rounded-xl"
            value={formik.values.lastName}
            onChange={(e) => {
              formik.handleChange(e);
            }}
            onBlur={formik.handleBlur}
          />
          {formik.touched.lastName && formik.errors.lastName ? (
            <div className="text-red-500">{formik.errors.lastName}</div>
          ) : null}
        </div>
      </div>

      {/* DOB & Anniversary */}
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col flex-1">
          <label
            htmlFor="dob"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            DOB
          </label>
          <input
            type="date"
            id="dob"
            className="px-2 py-3 border border-gray-500 rounded-xl"
            value={formik.values.dob}
            onChange={(e) => {
              formik.handleChange(e);
            }}
            onBlur={formik.handleBlur}
          />
          {formik.touched.dob && formik.errors.dob ? (
            <div className="text-red-500">{formik.errors.dob}</div>
          ) : null}
        </div>
        <div className="flex flex-col flex-1">
          <label
            htmlFor="anniversary"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Anniversary
          </label>
          <input
            type="date"
            id="anniversary"
            className="px-2 py-3 border border-gray-500 rounded-xl"
            value={formik.values.anniversary}
            onChange={(e) => {
              formik.handleChange(e);
            }}
            onBlur={formik.handleBlur}
          />
          {formik.touched.anniversary && formik.errors.anniversary ? (
            <div className="text-red-500">{formik.errors.anniversary}</div>
          ) : null}
        </div>
      </div>

      {/* Languages */}
      <div className="grid grid-cols-2 gap-4">
        {[
          "Language Spoken 1",
          "Language Spoken 2",
          "Language Spoken 3",
          "Language Spoken 4",
        ].map((label, idx) => (
          <div key={idx} className="flex flex-col">
            <label
              htmlFor={`languageSpoken${idx + 1}`}
              className="mb-1 text-sm font-medium text-gray-700"
            >
              {label}
            </label>
            <input
              type="text"
              id={`languageSpoken${idx + 1}`}
              placeholder="Enter Language"
              className="px-2 py-3 border border-gray-500 rounded-xl"
              value={formik.values[`languageSpoken${idx + 1}`]}
              onChange={(e) => {
                formik.handleChange(e);
              }}
              onBlur={formik.handleBlur}
            />
            {formik.touched[`languageSpoken${idx + 1}`] &&
            formik.errors[`languageSpoken${idx + 1}`] ? (
              <div className="text-red-500">
                {formik.errors[`languageSpoken${idx + 1}`]}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {/* Customer Profile & Type */}
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col flex-1">
          <label
            htmlFor="profileOfCustomer"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Profile of Customers
          </label>
          <select
            id="profileOfCustomer"
            className="px-2 py-3 border border-gray-500 rounded-xl"
            value={formik.values.profileOfCustomer}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option>Select</option>
            {customerProfile?.map((item, index) => {
              return <option value={item}>{item}</option>;
            })}
          </select>
          {formik.touched.profileOfCustomer &&
          formik.errors.profileOfCustomer ? (
            <div className="text-red-500">
              {formik.errors.profileOfCustomer}
            </div>
          ) : null}
        </div>
        <div className="flex flex-col flex-1">
          <label
            htmlFor="typeOfProfile"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Type of Profile
          </label>
          <select
            id="typeOfProfile"
            className="px-2 py-3 border border-gray-500 rounded-xl"
            value={formik.values.typeOfProfile}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option>Select</option>
            {typeOfProfile?.map((item, index) => {
              return <option value={item}>{item}</option>;
            })}
          </select>
          {formik.touched.typeProfile && formik.errors.typeOfProfile ? (
            <div className="text-red-500">{formik.errors.typeOfProfile}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;

