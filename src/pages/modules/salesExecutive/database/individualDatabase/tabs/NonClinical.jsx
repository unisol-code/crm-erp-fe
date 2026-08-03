import React, { useState, useEffect } from "react";
import ReactSelect from "react-select";
import Input from "../individualTabs/Input";
import Select from "../individualTabs/select";
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

const NonClinical = ({ formik,isReadOnly,selectedSector,selectedDoctor   }) => {
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [selectedStateCode, setSelectedStateCode] = useState("");
  const [showOtherDepartment, setShowOtherDepartment] = useState(false);
const [otherDepartment, setOtherDepartment] = useState('');
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
    fetchDepartmentForNonClinicalNew,
    newDepartmentForNonClinical,
    fetchAllRegion,
    region,
    allStateName,
    fetchAllCities,
    cities,
    fetchAllStateName,
    fetchDistrictList,
    districtList

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
    // fetchDepartmentForNonClinical();
    fetchDepartmentForNonClinicalNew();
    fetchAllRegion();
    fetchAllStateName();
  }, []);
  console.log("speciality", designation);

  const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return '';

  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);

  let start = sh * 60 + sm;
  let end = eh * 60 + em;

  if (end < start) {
    end += 24 * 60;
  }

  const diff = end - start;

  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours} Hour${hours > 1 ? 's' : ''} ${minutes} Minute${minutes > 1 ? 's' : ''}`;
  }

  if (hours > 0) {
    return `${hours} Hour${hours > 1 ? 's' : ''}`;
  }

  return `${minutes} Minute${minutes > 1 ? 's' : ''}`;
};

useEffect(() => {
  const start = formik.values?.VisitDetails?.startTime;
  const end = formik.values?.VisitDetails?.endTime;

  if (start && end) {
    const duration = calculateDuration(start, end);

    if (duration !== formik.values.VisitDetails.duration) {
      formik.setFieldValue('VisitDetails.duration', duration);
    }
  }
}, [
  formik.values?.VisitDetails?.startTime,
  formik.values?.VisitDetails?.endTime,
]);

console.log("non clinic",newDepartmentForNonClinical)

  return (
    <div className="">
      <h1 className="text-2xl font-bold text-gray-800 mb-8 pb-4 border-b border-gray-200">
        {/* NON CLINICAL INFORMATION  */}
         {selectedDoctor?.label ? ` ${selectedDoctor.label.toUpperCase()} INFORMATION` : ""}
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
              Array.isArray(newDepartmentForNonClinical)
                ? newDepartmentForNonClinical.map((d) => ({ label: d.name, value: d.name }))
                : []
            }
            isLoading={loading}
            styles={selectStyles}
            value={
              Array.isArray(newDepartmentForNonClinical)
                ? newDepartmentForNonClinical
                  .map((d) => ({ label: d.name, value: d.name }))
                  .find((opt) => opt.value === formik.values.department) || null
                : null
            }
            // onChange={(selected) => {
            //   formik.setFieldValue("department", selected?.value || "");
            // }}
            onChange={(selected) => {
  const value = selected?.value || '';

  // Agar Other select hua
  if (value === 'Other') {
    setShowOtherDepartment(true);
    setOtherDepartment('');
    formik.setFieldValue('department', '');
  } else {
    setShowOtherDepartment(false);
    setOtherDepartment('');
    formik.setFieldValue('department', value);
  }
}}
            onBlur={() => formik.setFieldTouched("department", true)}
            placeholder="Select Department"
            isClearable
          />

{showOtherDepartment && (
  <div className="mt-3">
    <input
      type="text"
      placeholder="Add Other Department"
      value={otherDepartment}
      onChange={(e) => {
        const value = e.target.value;
        setOtherDepartment(value);

        // Formik me custom value bhejo
        formik.setFieldValue('department', value);
      }}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
)}
          {formik.touched.department && formik.errors.department && (
            <div className="text-red-500 text-xs mt-1">{formik.errors.department}</div>
          )}
        </div>
        {selectedSector?.value === 'Healthcare Management' && (
  <Input
    label='Hospital Name'
    placeholder='Enter Hospital Name'
    name='hospitalName'
    formik={formik}
     disabled={isReadOnly}
  />
)}

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
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Region
          </label>
          <ReactSelect
            className="w-full"
            isLoading={loading}
            styles={selectStyles}
            options={
              Array.isArray(region)
                ? region.map((item) => ({
                    label: item.name || item,
                    value: item.name || item,
                  }))
                : []
            }
            value={
              Array.isArray(region)
                ? region
                    .map((item) => ({
                      label: item.name || item,
                      value: item.name || item,
                    }))
                    .find((option) => option.value === formik.values.region) || null
                : null
            }
            onChange={(selected) => {
              formik.setFieldValue("region", selected?.value || "");
              formik.setFieldValue("state", "");
              formik.setFieldValue("district", "");
              formik.setFieldValue("cityTownVillage", "");
              fetchAllStateName(selected?.value || "");
            }}
            onBlur={() => formik.setFieldTouched("region", true)}
            placeholder="Select Region"
            isClearable
          />
          {formik.touched.region && formik.errors.region && (
            <div className="text-red-500 text-xs mt-1">{formik.errors.region}</div>
          )}
        </div>
        {/* State */}
<div>
  <label className="block mb-1 text-sm font-medium text-gray-700">
    State
  </label>

  <ReactSelect
    isLoading={loading}
    styles={selectStyles}
    isDisabled={!formik.values.region}
    options={
      Array.isArray(allStateName)
        ? allStateName.map((state) => ({
            label: state.name || state.stateName,
            value: state.name || state.stateName,
            stateCode: state.code || state.stateCode,
          }))
        : []
    }
    value={
      allStateName
        ?.map((state) => ({
          label: state.name || state.stateName,
          value: state.name || state.stateName,
          stateCode: state.code || state.stateCode,
        }))
        .find((option) => option.value === formik.values.state) || null
    }
    onChange={(selected) => {
      formik.setFieldValue('state', selected?.value || '');

      // Save state code
      setSelectedStateCode(selected?.stateCode || '');

      // Reset district & city
      formik.setFieldValue('district', '');
      formik.setFieldValue('cityTownVillage', '');

      // Fetch districts
      fetchDistrictList(selected?.value);
    }}
    onBlur={() => formik.setFieldTouched('state', true)}
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
<div>
  <label className="block mb-1 text-sm font-medium text-gray-700">
    District
  </label>

  <ReactSelect
    className="w-full"
    isLoading={loading}
    styles={selectStyles}
    isDisabled={!formik.values.state}
    options={
      Array.isArray(districtList)
        ? districtList.map((district) => ({
            label: district,
            value: district,
          }))
        : []
    }
    value={
      districtList
        ?.map((district) => ({
          label: district,
          value: district,
        }))
        .find((option) => option.value === formik.values.district) || null
    }
    onChange={(selected) => {
      formik.setFieldValue('district', selected?.value || '');

      // Reset city
      formik.setFieldValue('cityTownVillage', '');

      // Fetch cities
      fetchAllCities(selectedStateCode, selected?.value);
    }}
    onBlur={() => formik.setFieldTouched('district', true)}
    placeholder="Select District"
    isClearable
  />

  {formik.touched.district && formik.errors.district && (
    <div className="text-red-500 text-xs mt-1">
      {formik.errors.district}
    </div>
  )}
</div>

        {/* City */}
<div>
  <label className="block mb-1 text-sm font-medium text-gray-700">
    City/Town/Village
  </label>

  <ReactSelect
    className="w-full"
    isLoading={loading}
    styles={selectStyles}
    isDisabled={!formik.values.district}
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
        .find((option) => option.value === formik.values.cityTownVillage) || null
    }
    onChange={(selected) => {
      formik.setFieldValue('cityTownVillage', selected?.value || '');
    }}
    onBlur={() => formik.setFieldTouched('cityTownVillage', true)}
    placeholder="Select City/Town/Village"
    isClearable
  />

  {formik.touched.cityTownVillage &&
    formik.errors.cityTownVillage && (
      <div className="text-red-500 text-xs mt-1">
        {formik.errors.cityTownVillage}
      </div>
    )}
</div>
        {/* <Input placeholder="Enter District" label="District" name="district" formik={formik} /> */}
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
        <div className="md:col-span-2">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <Input
      label="Meeting Start Time"
      name="VisitDetails.startTime"
      type="time"
      formik={formik}
    />

    <Input
      label="Meeting End Time"
      name="VisitDetails.endTime"
      type="time"
      formik={formik}
    />

    <Input
      label="Meeting Duration"
      name="VisitDetails.duration"
      placeholder="30 Minutes"
      formik={formik}
      readOnly
    />
  </div>
</div>
        <Input label="Visit Achievement" placeholder="Enter Visit Achievement" name="visitAchievement" type="number" formik={formik} />

      </div>
    </div>
  );
};

export default NonClinical;