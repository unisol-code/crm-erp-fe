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

const Surgon = ({ formik,isReadOnly  }) => {
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [selectProfiles, setSelectedProfiles] = useState(null);
  const {
    fetchDesignation,
    designation,
    fetchSpecialityIndividual,
    getspeciality,
    fetchCategorys,
    categorys,
    fetchHobbies,
    hobbies,
    fetchHospitalAssociatedWith,
    hospitalsAssociatedWith,
    allStateName,
    fetchAllCities,
    cities,
    loading,
    fetchAllStateName
  } = useDropdown();

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

  const relationshipOptions = [
    { label: "Single", value: "Single" },
    { label: "Married", value: "Married" },
    { label: "Divorced", value: "Divorced" },
  ];

  useEffect(() => {
    fetchDesignation();
    fetchSpecialityIndividual();
    fetchCategorys();
    fetchHobbies();
    fetchHospitalAssociatedWith();
    fetchAllStateName();
  }, []);

  const handleHospitalChange = (selectedOptions) => {
    const currentHospitals = formik.values.hospitalsAssociatedWith || [];

    const newHospitals = selectedOptions.map(opt => {
      const existing = currentHospitals.find(h => h.hospitalName === opt.value);
      return {
        hospitalName: opt.value,
        days: existing ? existing.days : [],
        timings: existing
          ? existing.timings
          : {
            startTime: "",
            endTime: "",
          },
      };
    });

    formik.setFieldValue("hospitalsAssociatedWith", newHospitals);
  };
  const handleSelectCity = (stateCode) => {
    if (stateCode) {
      fetchAllCities(stateCode);
    }
  };
  const daysOptions = [
    { label: "Monday", value: "Monday" },
    { label: "Tuesday", value: "Tuesday" },
    { label: "Wednesday", value: "Wednesday" },
    { label: "Thursday", value: "Thursday" },
    { label: "Friday", value: "Friday" },
    { label: "Saturday", value: "Saturday" },
    { label: "Sunday", value: "Sunday" },
  ];

  return (
    <div className="">
      <h1 className="text-2xl font-bold text-gray-800 mb-8 pb-4 border-b border-gray-200">
        SURGEON INFORMATION
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
            className="w-full"
            isLoading={loading}
            styles={selectStyles}
            options={
              Array.isArray(designation)
                ? designation.map((d) => ({ label: d, value: d }))
                : []
            }
            value={
              Array.isArray(designation)
                ? designation
                  .map((d) => ({ label: d, value: d }))
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
          <label className="block mb-1 text-sm font-medium text-gray-700">Speciality</label>
          <ReactSelect
            isLoading={loading}
            options={Array.isArray(getspeciality) ? getspeciality.map(d => ({ label: d, value: d })) : []}
            value={
              getspeciality
                ?.map((spe) => ({
                  label: spe,
                  value: spe,
                }))
                .find(option => option.value === formik.values.speciality) || null
            }
            onChange={(selected) => {
              formik.setFieldValue("speciality", selected?.value || "");
            }}
            onBlur={() => formik.setFieldTouched("speciality", true)}
            placeholder="Select Speciality"
            isClearable
            styles={selectStyles}
          />
          {formik.touched.speciality && formik.errors.speciality && (
            <div className="text-red-500 text-xs mt-1">{formik.errors.speciality}</div>
          )}
        </div>

        <Input label="Contact No" placeholder="Enter Contact No." name="contactNo" formik={formik} />
        <Input label="Alternate Contact No" placeholder="Enter Alternate Contact No." name="alternateContactNo" formik={formik} />
        <Input label="Official Email" placeholder="Enter Official Email" name="officialEmail" type="email" formik={formik} />
        <Input label="Personal Email" placeholder="Enter Personal Email" name="personalEmail" type="email" formik={formik} />
        {/* Hobbies */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Hobbies
          </label>
          <ReactSelect
            className="w-full"
            isLoading={loading}
            styles={selectStyles}
            options={
              Array.isArray(hobbies)
                ? hobbies.map((d) => ({ label: d, value: d }))
                : []
            }
            value={
              formik.values.hobbies
                ? { label: formik.values.hobbies, value: formik.values.hobbies }
                : null
            }
            onChange={(selected) => {
              const value = selected?.value || "";
              formik.setFieldValue("hobbies", value);
            }}
            onBlur={() => formik.setFieldTouched("hobbies", true)}
            placeholder="Select Hobbies"
            isClearable
          />
          {formik.touched.hobbies && formik.errors.hobbies && (
            <div className="text-red-500 text-xs mt-1">
              {formik.errors.hobbies}
            </div>
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
        </div>
        <Input placeholder="Enter Residence Address" label="Residence Address" name="residenceAddress" formik={formik} />
        {/* State */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            State
          </label>
          <ReactSelect
            className="w-full"
            isLoading={loading}
            styles={selectStyles}
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
            className="w-full"
            isLoading={loading}
            styles={selectStyles}
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
          />
          {formik.touched.cityTownVillage && formik.errors.cityTownVillage && (
            <div className="text-red-500 text-xs mt-1">
              {formik.errors.cityTownVillage}
            </div>
          )}
        </div>
        {/* <Input placeholder="Enter City/Town/Village" label="City/Town/Village" name="cityTownVillage" formik={formik} /> */}
        <Input placeholder="Enter District" label="District" name="district" formik={formik} />
        {/* <Input placeholder="Enter State" label="State" name="state" formik={formik} /> */}
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

        {/* Graduation */}
        <div className="space-y-4">
          <Input
            placeholder="Enter Graduation Institute"
            label="Graduation Institute"
            name="graduation.instituteName"
            formik={formik}
          />
          <Input
            placeholder="Enter Post Graduation Institute"
            label="Post Graduation Institute"
            name="postGraduation.instituteName"
            formik={formik}
          />
        </div>

        <div className="space-y-4">
          <Input
            type="number"
            placeholder="Enter graduation Year"
            label="Graduation Year"
            name="graduation.yearOfPassing"
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
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Relationship Status</label>
          <ReactSelect
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
        <Select
          placeholder="Enter Surgery Days"
          label="Surgery Days"
          name="surgeryDays"
          isMulti
          formik={formik}
          options={daysOptions}
        />

        {/* Type Of Surgery Performed */}
        <div className="md:col-span-2">
          <label className="block mb-3 text-sm font-medium text-gray-700">
            Type Of Surgery Performed
          </label>
          <ReactSelect
            isMulti
            options={[
              { label: "Robotic", value: "Robotic" },
              { label: "Laparoscopic", value: "Laparoscopic" },
              { label: "Open", value: "Open" },
            ]}
            value={
              formik.values.typeOfSurgeryPerformed?.map(s => ({
                label: s.type,
                value: s.type,
              })) || []
            }
            onChange={(selectedOptions) => {
              const currentSurgeries = formik.values.typeOfSurgeryPerformed || [];
              const newSurgeries = selectedOptions.map(opt => {
                const existing = currentSurgeries.find(s => s.type === opt.value);
                return {
                  type: opt.value,
                  count: existing ? existing.count : "",
                };
              });
              formik.setFieldValue("typeOfSurgeryPerformed", newSurgeries);
            }}
            onBlur={() => formik.setFieldTouched("typeOfSurgeryPerformed", true)}
            placeholder="Select surgery types..."
            className="w-full"
            styles={{
              control: (base) => ({
                ...base,
                minHeight: "50px",
                borderRadius: "0.75rem",
                borderColor: "#d1d5db",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                "&:hover": { borderColor: "#9ca3af" },
              })
            }}
          />

          {
            formik.touched.typeOfSurgeryPerformed &&
            formik.errors.typeOfSurgeryPerformed &&
            Array.isArray(formik.values.typeOfSurgeryPerformed) &&
            formik.values.typeOfSurgeryPerformed.length === 0 && (
              <div className="text-red-500 text-xs mt-2">
                Please select at least one surgery type
              </div>
            )
          }
        </div>

        {formik.values.typeOfSurgeryPerformed?.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-3">
              Enter number of surgeries performed for each type:
            </h4>
            <div className="space-y-3">
              {formik.values.typeOfSurgeryPerformed.map((surgery, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-white rounded border">
                  <span className="font-medium text-gray-700 w-32">{surgery.type}</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 15"
                    value={surgery.count}
                    onChange={(e) => {
                      const newSurgeries = [...formik.values.typeOfSurgeryPerformed];
                      newSurgeries[index].count = e.target.value;
                      formik.setFieldValue("typeOfSurgeryPerformed", newSurgeries);
                    }}
                    onBlur={() => formik.setFieldTouched(`typeOfSurgeryPerformed[${index}].count`, true)}
                    onWheel={(e) => e.target.blur()}
                    className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300 w-24 no-spinner"
                  />
                  {formik.touched.typeOfSurgeryPerformed?.[index]?.count &&
                    formik.errors.typeOfSurgeryPerformed?.[index]?.count && (
                      <div className="text-red-500 text-xs">
                        {formik.errors.typeOfSurgeryPerformed[index].count}
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hospital Multi-Select */}
        <div className="md:col-span-2">
          <label className="block mb-3 text-sm font-medium text-gray-700">
            Hospital Associated With
          </label>
          <ReactSelect
            isMulti
            options={hospitalsAssociatedWith?.map((h) => ({
              label: h.hospitalName,
              value: h.hospitalName,
            }))}
            value={
              formik.values.hospitalsAssociatedWith?.map(h => ({
                label: h.hospitalName,
                value: h.hospitalName,
              })) || []
            }
            onChange={handleHospitalChange}
            onBlur={() => formik.setFieldTouched("hospitalsAssociatedWith", true)}
            placeholder="Select hospitals..."
            className="w-full"
            styles={selectStyles}
          />
          {formik.touched.hospitalsAssociatedWith &&
            formik.errors.hospitalsAssociatedWith &&
            Array.isArray(formik.values.hospitalsAssociatedWith) &&
            formik.values.hospitalsAssociatedWith.length === 0 && (
              <div className="text-red-500 text-xs mt-2">
                Please select at least one hospital
              </div>
            )}
        </div>

        {formik.values.hospitalsAssociatedWith?.map((hospital, index) => (
          <div
            key={index}
            className="md:col-span-2 border border-gray-200 rounded-xl p-5 mb-5 bg-gradient-to-r from-gray-50 to-gray-100 shadow-sm"
          >
            <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              {hospital.hospitalName}
            </h3>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">Available Days</label>
              <ReactSelect
                isMulti
                options={daysOptions}
                value={
                  hospital.days?.map(day => ({
                    label: day,
                    value: day,
                  })) || []
                }
                onBlur={() => formik.setFieldTouched(`hospitalsAssociatedWith[${index}].days`, true)}
                onChange={(selectedOptions) => {
                  const selectedDays = selectedOptions.map(opt => opt.value);
                  formik.setFieldValue(`hospitalsAssociatedWith[${index}].days`, selectedDays);
                }}
                placeholder="Select available days..."
                className="w-full"
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: "44px",
                    borderRadius: "0.75rem",
                    borderColor: "#d1d5db",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                    '&:hover': {
                      borderColor: '#9ca3af',
                    },
                    ...(formik.touched.hospitalsAssociatedWith?.[index]?.days &&
                      formik.errors.hospitalsAssociatedWith?.[index]?.days
                      ? { borderColor: "#ef4444", boxShadow: "0 0 0 1px #ef4444" }
                      : {}),
                  }),
                  menu: (base) => ({
                    ...base,
                    borderRadius: "0.5rem",
                    marginTop: "4px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }),
                }}
              />
              {formik.touched.hospitalsAssociatedWith?.[index]?.days &&
                formik.errors.hospitalsAssociatedWith?.[index]?.days && (
                  <div className="text-red-500 text-xs mt-2">
                    {formik.errors.hospitalsAssociatedWith[index].days}
                  </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputWithError
                label="Start Time"
                type="time"
                name={`hospitalsAssociatedWith[${index}].timings.startTime`}
                formik={formik}
              />
              <InputWithError
                label="End Time"
                type="time"
                name={`hospitalsAssociatedWith[${index}].timings.endTime`}
                formik={formik}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Surgon;