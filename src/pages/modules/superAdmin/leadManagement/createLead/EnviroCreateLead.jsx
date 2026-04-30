import React, { useEffect } from "react";
import { useFormik, getIn } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import useEnviroLeadManage from "../../../../../hooks/leadmanagement/useEnviroLeadManage";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb";
import Button from "../../../../../components/uiComponents/button/Button";
import LoaderSpinner from "../../../../../components/uiComponents/loader/LoaderSpinner";
import { useTheme } from "../../../../../hooks/theme/useTheme";

const validationSchema = Yup.object({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  leadOwner: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email format").required("Required"),
  contact: Yup.string().matches(/^\d{10}$/, "Must be a valid 10-digit number").required("Required"),
  pinCode: Yup.string().matches(/^(?!0{6})[0-9]{6}$/, "Must be a valid 6-digit pincode").required("Required"),
  address: Yup.string().required("Required"),
  state: Yup.string().required("Required"),
  district: Yup.string().required("Required"),
  villageName: Yup.string().required("Required"),
  taluka: Yup.string().required("Required"),
  productName: Yup.string().required("Required"),
  totalLandOwned: Yup.string().required("Required"),
  leadGeneratedThrough: Yup.array().min(1, "At least one option must be selected"),
  panNo: Yup.string().required("Required"),
  sprayingType: Yup.string().required("Required"),
  tentativeBuyingDate: Yup.string().required("Required"),
})

const initialValues = {
  firstName: "", lastName: "", leadOwner: "", productName: "", totalLandOwned: "",
  email: "", contact: "", villageName: "", state: "", district: "", address: "", pinCode: "",
  leadGeneratedThrough: [], lastMeeting: "", nextMeeting: "", status: "", panNo: "",
  sprayingType: "", tentativeBuyingDate: "", cropType: "", cropName: "", sprayingDuration: "",
  customerType: "", department: "", taluka: "", purposeForBuying: "", paymentMode: "",
  existingLoan: "", bankName: "", otherCustomerType: "", nextfollowup: "",
};

// Reusable Form Field Component
const FormField = ({ label, name, formik, type = "text", ...props }) => {
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
        className="w-full px-3 py-2 border rounded focus:outline-none"
      />
      {error && touched && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </div>
  );
};

// CheckboxGroup Component
const CheckboxGroup = ({ name, label, options, formik }) => {
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    const currentValues = formik.values[name] || [];
    if (checked) {
      formik.setFieldValue(name, [...currentValues, value]);
    } else {
      formik.setFieldValue(name, currentValues.filter((item) => item !== value));
    }
  };

  return (
    <div className="mb-4 col-span-2">
      <label className="block mb-2 font-semibold text-gray-700">{label}</label>
      <div className="flex flex-wrap gap-4 p-3 border border-gray-300 rounded-md">
        {options.map((option) => (
          <div key={option.value} className="flex items-center gap-2">
            <input
              type="checkbox"
              id={option.value}
              name={name}
              value={option.value}
              checked={formik.values[name]?.includes(option.value) || false}
              onChange={handleCheckboxChange}
              onBlur={formik.handleBlur}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor={option.value} className="text-gray-700 cursor-pointer">{option.label}</label>
          </div>
        ))}
      </div>
      {formik.touched[name] && formik.errors[name] && (
        <div className="mt-1 text-sm text-red-500">{formik.errors[name]}</div>
      )}
    </div>
  );
};

// Section Heading
const SectionHeading = ({ title }) => (
  <div className="col-span-2 mt-8 mb-4">
    <h3 className="text-lg font-bold text-gray-800 border-b-2 border-blue-500 pb-2">{title}</h3>
  </div>
);

const EnviroCreateLead = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const {
    createEnviroLead, updateEnviroLead, fetchCustomerType, customerType,
    fetchLeadByIdForEnviro, leadsForEnviroById, resetLeadsForEnviro,
  } = useEnviroLeadManage();

  const isEditMode = Boolean(id);

  useEffect(() => { fetchCustomerType(); }, []);
  useEffect(() => {
    if (id) fetchLeadByIdForEnviro(id);
    return () => resetLeadsForEnviro();
  }, [id]);

  const formInitialValues = isEditMode && leadsForEnviroById ? { ...initialValues, ...leadsForEnviroById } : initialValues;

  const formik = useFormik({
    initialValues: formInitialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      const transformedValues = {
        ...values,
        customerType: values.customerType === "other" ? values.otherCustomerType : values.customerType,
      };
      if (id) {
        await updateEnviroLead(id, transformedValues);
        navigate("/lead/lead-tracking");
      } else {
        await createEnviroLead(transformedValues);
        resetLeadsForEnviro();
        navigate("/lead/lead-tracking");
      }
    },
  });

  if (isEditMode && !leadsForEnviroById) {
    return <div className="flex items-center justify-center h-64"><LoaderSpinner /></div>;
  }

  return (
    <>
      <BreadCrumb linkText={[{ text: "Lead Management" }, { text: isEditMode ? "Edit Lead" : "Create Lead" }]} />
      <div className="relative pb-10 mb-6 text-center">
        <h2
          className="p-[44px] absolute inset-0 flex items-center justify-center font-bold text-xl text-black rounded-t-lg"
          style={{ backgroundColor: theme.secondaryColor }}
        >
          {isEditMode ? "Edit Lead" : "Create Lead"}
        </h2>
      </div>

      <div className="p-5 bg-white rounded-lg shadow-md">
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Basic Info */}
            <SectionHeading title="Basic Information" />
            <FormField name="firstName" label="First Name" formik={formik} placeholder="Enter first name" />
            <FormField name="lastName" label="Last Name" formik={formik} placeholder="Enter last name" />
            <FormField name="leadOwner" label="Lead Owner" formik={formik} placeholder="Enter lead owner" />
            <FormField name="email" type="email" label="Email" formik={formik} placeholder="Enter email" />
            <FormField name="contact" label="Contact" formik={formik} placeholder="Enter phone number" />
            <FormField name="productName" label="Product Name" formik={formik} placeholder="Enter product name" />
            <FormField name="totalLandOwned" label="Total Land Owned" formik={formik} placeholder="Enter total land" />

            {/* Address Details */}
            <SectionHeading title="Address Details" />
            <FormField name="villageName" label="Village Name" formik={formik} placeholder="Enter village name" />
            <FormField name="state" label="State" formik={formik} placeholder="Enter state" />
            <FormField name="district" label="District" formik={formik} placeholder="Enter district" />
            <FormField name="address" label="Address" formik={formik} placeholder="Enter address" />
            <FormField name="pinCode" label="Pin Code" formik={formik} type="text" placeholder="Enter 6-digit pincode" />
            <FormField name="taluka" label="Taluka" formik={formik} placeholder="Enter taluka" />

            {/* Lead Generation */}
            <SectionHeading title="Lead Generation Details" />

            <CheckboxGroup
              name="leadGeneratedThrough"
              label="Lead Generated Through"
              options={[{ value: "Email", label: "Email" }, { value: "Calling", label: "Calling" }, { value: "Meeting", label: "Meeting" }]}
              formik={formik}
            />
            <FormField name="lastMeeting" label="Last Meeting" formik={formik} type="date" max={new Date().toISOString().split("T")[0]} />
            <FormField name="nextMeeting" label="Next Meeting" formik={formik} type="date" min={new Date().toISOString().split("T")[0]} />
            <FormField name="nextfollowup" label="Next Follow Up" formik={formik} type="date" />
            <FormField name="status" label="Status" formik={formik} />

            {/* Financial Information */}
            <SectionHeading title="Financial Information" />
            <FormField name="panNo" label="PAN Number" formik={formik} placeholder="Enter PAN number" />
            <FormField name="paymentMode" label="Payment Mode" formik={formik} placeholder="Enter payment mode" />
            <FormField name="existingLoan" label="Existing Loan" formik={formik} placeholder="Enter existing loan" />
            <FormField name="bankName" label="Bank Name" formik={formik} placeholder="Enter bank name" />

            {/* Agricultural Details */}
            <SectionHeading title="Agricultural Details" />
            <FormField name="sprayingType" label="Spraying Type" formik={formik} placeholder="Enter spraying type" />
            <FormField name="tentativeBuyingDate" type="date" label="Tentative Buying Date" formik={formik} />
            <FormField name="cropType" label="Crop Type" formik={formik} placeholder="Enter crop type" />
            <FormField name="cropName" label="Crop Name" formik={formik} placeholder="Enter crop name" />
            <FormField name="sprayingDuration" label="Spraying Duration" formik={formik} placeholder="Enter duration" />
            <FormField name="purposeForBuying" label="Purpose for Buying" formik={formik} placeholder="Enter purpose" />

            {/* Customer Information */}
            <SectionHeading title="Customer Information" />
            <div className="col-span-2 mb-4">
              <label className="block mb-2 font-semibold text-gray-700">Customer Type</label>
              <select
                name="customerType"
                value={formik.values.customerType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full p-3 border rounded-md transition-colors focus:ring-2 focus:outline-none ${formik.touched.customerType && formik.errors.customerType ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"}`}
              >
                <option value="">Select type</option>
                {customerType.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
              {formik.touched.customerType && formik.errors.customerType && (
                <div className="mt-1 text-sm text-red-500">{formik.errors.customerType}</div>
              )}
            </div>
            {formik.values.customerType === "government official" && (
              <FormField name="department" label="Department Name" formik={formik} placeholder="Enter department name" />
            )}

            {formik.values.customerType === "other" && (
              <FormField name="otherCustomerType" label="Specify Customer Type" formik={formik} placeholder="Enter customer type" />
            )}

          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-6 mt-8 border-t">
            <Button variant={3} type="button" text="Cancel" onClick={() => navigate(-1)} className="px-6 py-2" />
            <Button type="submit" text={isEditMode ? "Update Lead" : "Create Lead"} disabled={formik.isSubmitting} className="px-6 py-2" />
          </div>
        </form>
      </div>
    </>
  );
};

export default EnviroCreateLead;