import React, { useState, useEffect } from "react";
import ReactSelect from "react-select";
import Input from "../superAdminIndividualTabs/Input";
import Select from "../superAdminIndividualTabs/select";
import useDropdown from "../../../../../../hooks/dropdown/useDropdown";
import { getIn } from "formik";

const InputWithError = ({ label, name, formik, type = "text", ...props }) => {
  const value = getIn(formik.values, name) || "";
  const error = getIn(formik.errors, name);
  const touched = getIn(formik.touched, name);

  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input
        {...props}
        type={type}
        name={name}
        value={value}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={`w-full px-3 py-2 border rounded focus:outline-none"
          }`}
      />
      {error && touched && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </div>
  );
};

const Farmers = ({ formik }) => {
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const {
    fetchDesignation,
    designation,
    fetchSpecialityIndividual,
    fetchCategorys,
    categorys,
    fetchHobbies,
    hobbies,
    fetchHospitalAssociatedWith,
    loading,
    fetchDesignationForNonClinical,
    designationForNonClinical,
    fetchDepartmentForNonClinical,
    departmentForNonClinical,
    allStateName,
    fetchAllCities,
    cities,
    fetchAllStateName,
    employees,
    fetchAllEmployees
  } = useDropdown();

  const relationshipOptions = [
    { label: "Single", value: "Single" },
    { label: "Married", value: "Married" },
    { label: "Divorced", value: "Divorced" },
  ];
  const handleSelectCity = (stateCode) => {
    if (stateCode) {
      fetchAllCities(stateCode);
    }
  };

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "50px",
      borderRadius: "0.75rem",
      borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
      boxShadow: state.isFocused
        ? "0 0 0 1px #3b82f6"
        : "0 1px 2px rgba(0, 0, 0, 0.05)",
      "&:hover": {
        borderColor: "#9ca3af",
      },
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "0.5rem",
      marginTop: "4px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    }),
  };

  useEffect(() => {
    fetchDesignation();
    fetchSpecialityIndividual();
    fetchCategorys();
    fetchHobbies();
    fetchHospitalAssociatedWith();
    fetchDesignationForNonClinical();
    fetchDepartmentForNonClinical();
    fetchAllStateName();
    fetchAllEmployees();
  }, []);

  return (
    <div className="">
      <h1 className="text-2xl font-bold text-gray-800 mb-8 pb-4 border-b border-gray-200">
        NON CLINICAL INFORMATION
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Name Of Person"
          placeholder="Enter Name Of Person"
          name="fullName"
          formik={formik}
        />

        {/* Designation */}
        {/* <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Designation</label>
          <ReactSelect
            isLoading={loading}
            options={Array.isArray(designationForNonClinical) ? designationForNonClinical.map(d => ({ label: d, value: d })) : []}
            value={
              Array.isArray(designationForNonClinical)
                ? designationForNonClinical
                  .map(d => ({ label: d, value: d }))
                  .find(opt => opt.value === formik.values.designation) || null
                : null
            }
            styles={selectStyles}
            onChange={(selected) => {
              setSelectedDesignation(selected);
              formik.setFieldValue("designation", selected?.value || "");
            }}
            onBlur={() => formik.setFieldTouched("designation", true)}
            placeholder="Select Designation"
            isClearable
          />

          {formik.touched.designation && formik.errors.designation && (
            <div className="text-red-500 text-xs mt-1">{formik.errors.designation}</div>
          )}
        </div> */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Designation
          </label>
          <ReactSelect
            className="w-full"
            isLoading={loading}
            styles={selectStyles}
            options={
              Array.isArray(designation)
                ? designation.map((d) => ({ label: d.name, value: d.name }))
                : []
            }
            value={
              Array.isArray(designation)
                ? designation
                  .map((d) => ({ label: d.name, value: d.name }))
                  .find((opt) => opt.value === formik.values.designation) || null
                : null
            }
            onChange={(selected) => {
              setSelectedDesignation(selected);
              formik.setFieldValue("designation", selected?.value || "");
            }}
            onBlur={() => formik.setFieldTouched("designation", true)}
            placeholder="Select Designation"
            isClearable
          />
          {formik.touched.designation && formik.errors.designation && (
            <div className="text-red-500 text-xs mt-1">
              {formik.errors.designation}
            </div>
          )}
          <div className="mt-2">
            {formik.values.designation === "Other" && (
              <Input
                label="Please Specify Your Designation"
                name="otherDesignation"
                placeholder="Enter your designation"
                formik={formik}
              />
            )}
          </div>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Department</label>

          <ReactSelect
            options={
              Array.isArray(departmentForNonClinical)
                ? departmentForNonClinical.map((d) => ({ label: d, value: d }))
                : []
            }
            isLoading={loading}
            styles={selectStyles}
            value={
              Array.isArray(departmentForNonClinical)
                ? departmentForNonClinical
                  .map((d) => ({ label: d, value: d }))
                  .find((opt) => opt.value === formik.values.department) || null
                : null
            }
            onChange={(selected) => {
              formik.setFieldValue("department", selected?.value || "");
            }}
            onBlur={() => formik.setFieldTouched("department", true)}
            placeholder="Select Department"
            isClearable
          />


          {formik.touched.department && formik.errors.department && (
            <div className="text-red-500 text-xs mt-1">{formik.errors.department}</div>
          )}
        </div>
        <Input label="Contact No" placeholder="Enter Contact No." name="contactNo" formik={formik} />
        <Input label="Alternate Contact No" placeholder="Enter Alternate Contact No." name="alternateContactNo" formik={formik} />
        <Input label="Official Email" placeholder="Enter Official Email" name="officialEmail" type="email" formik={formik} />
        <Input label="Personal Email" placeholder="Enter Personal Email" name="personalEmail" type="email" formik={formik} />
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Hobbies</label>

          <>
            <ReactSelect
              isLoading={loading}
              options={Array.isArray(hobbies) ? hobbies.map(d => ({ label: d, value: d })) : []}
              value={
                formik.values.hobbies
                  ? { label: formik.values.hobbies, value: formik.values.hobbies }
                  : null
              }
              styles={selectStyles}
              onChange={(selected) => {
                const value = selected?.value || "";
                formik.setFieldValue("hobbies", value);
                if (value !== "Other") {
                  formik.setFieldValue("specifyHobby", "");
                }
              }}
              onBlur={() => formik.setFieldTouched("hobbies", true)}
              placeholder="Select Hobbies"
              isClearable

            />
            {formik.touched.hobbies && formik.errors.hobbies && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.hobbies}</div>
            )}
            <div className="mt-2">
              {formik.values.hobbies === "Other" && (
                <Input
                  label="Please Specify Your Hobby"
                  name="specifyHobby"
                  placeholder="Enter your hobby"
                  formik={formik}
                />
              )}
            </div>
          </>

        </div>
        <Input placeholder="Enter Residence Address" label="Residence Address" name="residenceAddress" formik={formik} />
        {/* State */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            State
          </label>
          <ReactSelect
            isLoading={loading}
            options={
              Array.isArray(allStateName)
                ? allStateName.map((state) => ({
                  label: state.stateName,
                  value: state.stateCode,
                }))
                : []
            }
            value={
              allStateName
                ?.map((state) => ({
                  label: state.stateName,
                  value: state.stateCode,
                }))
                .find((option) => option.value === formik.values.state) || null
            }
            onChange={(selected) => {
              formik.setFieldValue("state", selected?.value || "");
              handleSelectCity(selected?.value);
            }}
            onBlur={() => formik.setFieldTouched("state", true)}
            placeholder="Select State"
            isClearable
            styles={selectStyles}
          />
          {formik.touched.state && formik.errors.state && (
            <div className="text-red-500 text-xs mt-1">
              {formik.errors.state}
            </div>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            City/Town/Village
          </label>
          <ReactSelect
            isLoading={loading}
            isDisabled={!formik.values.state}
            options={
              Array.isArray(cities)
                ? cities.map((city) => ({
                  label: city,
                  value: city,
                }))
                : []
            }
            value={
              cities
                ?.map((city) => ({
                  label: city,
                  value: city,
                }))
                .find(
                  (option) => option.value === formik.values.cityTownVillage
                ) || null
            }
            onChange={(selected) => {
              formik.setFieldValue("cityTownVillage", selected?.value || "");
            }}
            onBlur={() => formik.setFieldTouched("cityTownVillage", true)}
            placeholder="Select City/Town/Village"
            isClearable
            styles={selectStyles}
          />
          {formik.touched.cityTownVillage && formik.errors.cityTownVillage && (
            <div className="text-red-500 text-xs mt-1">
              {formik.errors.cityTownVillage}
            </div>
          )}
        </div>
        <Input placeholder="Enter District" label="District" name="district" formik={formik} />
        <Input placeholder="Enter Pin Code" label="Pin Code" name="pincode" formik={formik} />
        <Input placeholder="Enter Landmark" label="Landmark" name="landmark" formik={formik} />

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Category</label>

          <ReactSelect
            isLoading={loading}
            options={
              Array.isArray(categorys)
                ? categorys.map((cat) => ({
                  label: cat.label,
                  value: cat.label,
                }))
                : []
            }
            value={
              categorys
                ?.map((cat) => ({
                  label: cat.label,
                  value: cat.label,
                }))
                .find((option) => option.value === formik.values.category) || null
            }
            onChange={(selected) => {
              formik.setFieldValue("category", selected?.value || "");
            }}
            onBlur={() => formik.setFieldTouched("category", true)}
            placeholder="Select Category"
            isClearable
            styles={selectStyles}

          />
          {formik.touched.category && formik.errors.category && (
            <div className="text-red-500 text-xs mt-1">{formik.errors.category}</div>
          )}
        </div>
        <Input placeholder="Enter Academic Interest" label="Academic Interest" name="academicInterest" formik={formik} />

        {/* Graduation & Post Graduation - one line each */}
        <div className="w-full col-span-2 space-y-6">
          {/* Graduation row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              placeholder="Enter Graduation Institute"
              label="Graduation Institute"
              name="graduation.instituteName"
              formik={formik}
            />
            <Input
              type="number"
              placeholder="Enter Graduation Year"
              label="Graduation Year"
              name="graduation.yearOfPassing"
              formik={formik}
            />
          </div>

          {/* Post Graduation row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              placeholder="Enter Post Graduation Institute"
              label="Post Graduation Institute"
              name="postGraduation.instituteName"
              formik={formik}
            />
            <Input
              type="number"
              placeholder="Enter Post Graduation Year"
              label="Post Graduation Year"
              name="postGraduation.yearOfPassing"
              formik={formik}
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Relationship Status</label>
          <ReactSelect
            isLoading={loading}
            options={relationshipOptions}
            value={
              relationshipOptions.find(
                (option) => option.value === formik.values.relationshipStatus
              ) || null
            }
            onChange={(selected) =>
              formik.setFieldValue("relationshipStatus", selected?.value || "")
            }
            onBlur={() => formik.setFieldTouched("relationshipStatus", true)}
            placeholder="Select Relationship Status"
            isClearable
            styles={selectStyles}
          />
          {formik.touched.relationshipStatus && formik.errors.relationshipStatus && (
            <div className="text-red-500 text-xs mt-1">
              {formik.errors.relationshipStatus}
            </div>
          )}
        </div>

        {formik.values.relationshipStatus === "Married" && (
          <>
            <Input
              placeholder="Enter Spouse Name"
              label="Spouse Name"
              name="spouseName"
              type="text"
              formik={formik}
            />
            <Input
              label="Wedding Anniversary"
              name="weddingAnniversary"
              type="date"
              formik={formik}
            />
          </>
        )}

        <Input label="DOB" name="dob" type="date" formik={formik} />
        <Input label="Visit Target" placeholder="Enter Visit Target" name="visitTarget" type="number" formik={formik} />
        <Input label="Visit Achievement" placeholder="Enter Visit Achievement" name="visitAchievement" type="number" formik={formik} />
        {/* Sales Person */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Sales Person
          </label>
          <ReactSelect
            className="w-full"
            isLoading={loading}
            styles={selectStyles}
            options={
              Array.isArray(employees)
                ? employees.map((d) => ({
                  label: d.salesPersonName,
                  value: d.salesPersonName
                }))
                : []
            }
            value={
              employees
                ?.map((d) => ({
                  label: d.salesPersonName,
                  value: d.salesPersonName,
                }))
                .find((option) => option.value === formik.values.salesPersonName) || null
            }
            onChange={(selected) => {
              formik.setFieldValue("salesPersonName", selected?.value || "");
            }}
            onBlur={() => formik.setFieldTouched("sales_id", true)}
            placeholder="Select Sales Person"
            isClearable
          />
          {formik.touched.salesPersonName && formik.errors.salesPersonName && (
            <div className="text-red-500 text-xs mt-1">
              {formik.errors.salesPersonName}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Farmers;