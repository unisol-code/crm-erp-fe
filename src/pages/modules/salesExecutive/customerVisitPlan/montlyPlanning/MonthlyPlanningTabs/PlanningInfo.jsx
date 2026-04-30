


import React, { useEffect } from "react";
import Select from "react-select";
import useDropdown from "../../../../../../hooks/dropdown/useDropdown";

const PlanningInfo = ({ formik }) => {
  const { fetchSpeciality, speciality, loading, organizationList,
    fetchOrganizationNames, productList, fetchProductsNames, fetchDoctorList, doctorList, fetchCallObjectiveStatuses, callobjectivestatus } = useDropdown();

  const fields = [
    { label: "Visit", name: "visit", type: "text", placeholder: "Enter visit" },
    {
      label: "Name of Doctor",
      name: "nameOfDoctor",
      type: "select",
      placeholder: "Select the Doctor",
      options: doctorList?.map((doc) => ({
        label: doc.fullName,
        value: doc.fullName,
      }))
    },
    {
      label: "Select Organization",
      name: "selectOrganization",
      type: "select",
      placeholder: "Select the Organization",
      options:
        Array.isArray(organizationList.data)
          ? organizationList.data.map((org) => ({
            label: org,
            value: org,
          }))
          : [],
    },

    {
      label: "Speciality",
      name: "speciality",
      type: "select",
      options: Array.isArray(speciality) ?
        speciality.map((spec) => ({
          label:spec,
          value: spec,
        })) : [],
    },
    {
      label: "Product To Be Promoted",
      name: "productToBePromoted",
      type: "select",
      options:
        Array.isArray(productList)
          ? productList.map((product) => ({
            label: product.name,
            value: product.name,
          }))
          : [],
    },
    { label: "Expected Call Duration", name: "expectedCallDuration", type: "text", placeholder: "Enter Eg. 15 Min" },
    { label: "Meeting Time", name: "meetingTime", type: "time", placeholder: "Select time" },
    { label: "Anniversary Date", name: "anniversaryDate", type: "date", placeholder: "Select Date" },
    { label: "Birthday Date", name: "birthdayDate", type: "date", placeholder: "Select Date" },
    { label: "Call Purpose", name: "callPurpose", type: "text", placeholder: "Enter Call purpose" },
    { label: "Duration of Meeting", name: "durationOfMeeting", type: "text", placeholder: "Enter Eg. 15 Min" },
    { label: "Visiting Time", name: "visitingTime", type: "time", placeholder: "Select Time" },
    { label: "Visiting Place", name: "visitingPlace", type: "text", placeholder: "Enter Visiting Place" },
    { label: "Call Objective", name: "callObjective", type: "select", options: ["Attending Doctor", "OPD Call", "Product Demo", "Clinical Study", "Clinical Paper", "Other"] },
    {
      label: "Call Objective Status", name: "callObjectiveStatus", type: "select", placeholder: "Enter Call Objective Status",
      options:
        Array.isArray(callobjectivestatus)
          ? callobjectivestatus.map((status) => ({
            label: status,
            value: status,
          }))
          : [],
    },
    { label: "Hospital OPD", name: "hospitalOPD", type: "text", placeholder: "Enter Hospital OPD" },
  ];

  useEffect(() => {
    fetchProductsNames();
    fetchOrganizationNames();
    fetchSpeciality();
    fetchDoctorList();
    fetchCallObjectiveStatuses();
  }, [])
  return (
    <div className="p-4 mb-5 bg-white rounded-b">
      <div className="flex flex-col mb-4">
        <label>Create Planning For This Date</label>
        <input
          type="date"
          name="createPlanningForDate"
          placeholder="Select planning date"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.createPlanningForDate}
          className="w-1/2 p-2 border rounded"
        />
        {formik.touched.createPlanningForDate && formik.errors.createPlanningForDate && (
          <p className="mt-1 text-sm text-red-500">{formik.errors.createPlanningForDate}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {fields.map(({ label, name, type, placeholder, options }) => (
          <div key={name}>
            <label>{label}</label>
            {type === "select" ? (
              <Select
                name={name}
                isLoading={loading}
                options={options.map((opt) =>
                  typeof opt === "string" ? { label: opt, value: opt } : opt
                )}
                value={
                  options
                    .map((opt) =>
                      typeof opt === "string" ? { label: opt, value: opt } : opt
                    )
                    .find((opt) => opt.value === formik.values[name]) || null
                }
                onChange={(selectedOption) =>
                  formik.setFieldValue(name, selectedOption?.value || "")
                }
                onBlur={() => formik.setFieldTouched(name, true)}

                isClearable
                placeholder={`${label}`}
                classNamePrefix="react-select"
              />
            ) : (
              <input
                type={type}
                name={name}
                placeholder={placeholder}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values[name]}
                className="w-full p-2 border rounded"
              />
            )}
            {formik.touched[name] && formik.errors[name] && (
              <p className="mt-1 text-sm text-red-500">{formik.errors[name]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanningInfo;