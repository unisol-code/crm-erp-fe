import React from "react";
import { useField } from "formik";

const OrganizationDetails = () => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <InputField  name="orgName1" label="Organization Name (Workplace Name 1)" placeholder="Orange City Hospital and Research Institute" />
      <InputField name="orgName2" label="Organization Name (Workplace Name 2)" placeholder="Enter organization name" />
      <InputField  name="address1" label="Address " placeholder="Enter Address Line " />
      <InputField  name="address2" label="Address " placeholder="Enter Address Line " />

      <div className="flex gap-4">
        <InputField  name="region1" label="Region " />
        <InputField  name="state1" label="State " />
      </div>

      <div className="flex gap-4">
        <InputField  name="region2" label="Region " />
        <InputField  name="state2" label="State " />
      </div>

      <div className="flex gap-4">
        <InputField  name="district1" label="District " />
        <InputField  name="pincode1" label="Pin Code " />
      </div>

      <div className="flex gap-4">
        <InputField  name="district2" label="District " />
        <InputField  name="pincode2" label="Pin Code " />
      </div>
 <div className="flex gap-4">
      <InputField  name="totalBeds1" label="Total Beds " />
      <InputField  name="totalIcu1" label="Total ICU " />
      </div>
       <div className="flex gap-4">
      <InputField  name="totalBeds2" label="Total Beds " />
      <InputField  name="totalIcu2" label="Total ICU " />
      </div>
      <InputField  name="quotationDesignation" label="Quotation in the Name/Designation" />
      <InputField  name="salesPerson" label="Sales person Name" />
    </div>
  );
};

const InputField = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div className="flex flex-col flex-1 w-full px-2 mb-2">
      <label htmlFor={props.name}>{label}</label>
      <input {...field} {...props} placeholder={props.placeholder || `Enter ${label}`} className="w-full px-3 py-2 border border-gray-300 rounded" />
      {meta.touched && meta.error ? <div className="text-sm text-red-500">{meta.error}</div> : null}
    </div>
  );
};

export default OrganizationDetails;
