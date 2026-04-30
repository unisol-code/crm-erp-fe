
import React from "react";
import { Field, ErrorMessage, useField } from "formik";

const AddHod = () => {
  return (
  <div className="grid grid-cols-2 gap-x-8 md:grid-cols-2 gap-y-6">
    <div className="flex w-full col-span-2 gap-4">
      <InputField name="hodName" label="HOD Name" />
      <InputField name="hodDepartment" label="HOD Department" />
      <InputField name="misCount" label="Total No of MIS performed in a Year" />
</div>

<div className="flex w-full col-span-2 gap-4">
      <InputField name="contactNo" label="Contact No" />
      <InputField name="alternateNo" label="Alternate No" />
      <InputField name="birthDate" label="Birth Date" type="date" />
</div>
<div className="flex w-full col-span-2 gap-4">
      <InputField name="email" label="Email"  type="email"/>
      <InputField name="personalemail" label="Personal Email" type="email" />
      <InputField name="anniverdate" label="Anniversary Date" type="date" />
</div>
<div className="flex w-full col-span-2 gap-4">
      <InputField name="surgeryType" label="Type of Surgery Performed" />
      <InputField name="speciality" label="Speciality" />
      <InputField name="hobbies" label="Hobbies" />
</div>
<div className="flex w-full col-span-2 gap-4">
      <InputField name="comments" label="Comments" />
      <InputField name="preferredMeetingDay" label="Preferred Meeting Day" />
      <InputField name="preferredMeetingTime" label="Preferred Meeting Time" />
</div>
<div className="flex w-full col-span-2 gap-4">
      <InputField name="hodAddress" label="Address" />
      <InputField name="landmark" label="Landmark" />
      <InputField name="pinCode" label="Pin Code" />
</div>
      <div className="flex flex-col col-span-2 gap-2">
        <h3 className="mb-1 font-semibold">What do you believe?</h3>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2">
            <Field type="checkbox" name="believe" value="decision_maker" /> Decision Maker
          </label>
          <label className="flex items-center gap-2">
            <Field type="checkbox" name="believe" value="influencer" /> Influencer
          </label>
          <label className="flex items-center gap-2">
            <Field type="checkbox" name="believe" value="supporter" /> Supporter
          </label>
          <label className="flex items-center gap-2">
            <Field type="checkbox" name="believe" value="taker" /> Taker
          </label>
        </div>
        <ErrorMessage name="believe" component="div" className="text-sm text-red-500" />
      </div>
    </div>
  );
};



const InputField = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div className="flex flex-col flex-1">
      <label htmlFor={props.name} className="mb-1">{label}</label>
      <input {...field} {...props} placeholder={`Enter ${label}`} className="w-full px-3 py-2 border border-gray-300 rounded" />
      {meta.touched && meta.error ? <div className="text-sm text-red-500">{meta.error}</div> : null}
    </div>
  );
};

export default AddHod;
