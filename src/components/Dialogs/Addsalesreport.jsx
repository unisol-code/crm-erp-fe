import React, { useState } from "react";
import Salesreportsuccess from "./Salesreportsuccess";
import * as Yup from "yup";
import { useFormik } from "formik";
import useSalesAnalytics from "../../hooks/salesAnalytics/useSalesAnalytics";

const validationSchema = Yup.object({
  productName: Yup.string()
    .required("Product Name is required")
    .max(100, "Product Name must be less than 100 characters"),
  employeeFirstName: Yup.string()
    .required("Employee First Name is required")
    .max(50, "First Name must be less than 50 characters"),
  employeeLastName: Yup.string()
    .required("Employee Last Name is required")
    .max(50, "Last Name must be less than 50 characters"),
  organizationName: Yup.string()
    .required("Organization Name is required")
    .max(100, "Organization Name must be less than 100 characters"),
  email: Yup.string()
    .required("Email is required")
    .email("Enter a valid email"),
  contact: Yup.string()
    .required("Contact is required")
    .matches(/^[0-9]+$/, "Contact must be numeric")
    .min(10, "Contact must be at least 10 digits")
    .max(15, "Contact cannot exceed 15 digits"),
  date: Yup.date()
    .required("Date is required")
    .max(new Date(), "Date cannot be in the future"),
  region: Yup.string()
    .required("Region is required")
    .max(50, "Region must be less than 50 characters"),
  state: Yup.string()
    .required("State is required")
    .max(50, "State must be less than 50 characters"),
  district: Yup.string()
    .required("District is required")
    .max(50, "District must be less than 50 characters"),
  billAmount: Yup.number()
    .required("Bill Amount is required")
    .min(0, "Bill Amount cannot be negative"),
  paidAmount: Yup.number()
    .required("Paid Amount is required")
    .min(0, "Paid Amount cannot be negative")
    .test(
      "paidLessThanBill",
      "Paid Amount cannot exceed Bill Amount",
      function (value) {
        return value <= this.parent.billAmount;
      }
    ),
  unclearedAmount: Yup.number()
    .required("Uncleared Amount is required")
    .min(0, "Uncleared Amount cannot be negative")
    .test(
      "unclearedMatches",
      "Uncleared Amount must match the difference between Bill and Paid Amount",
      function (value) {
        return value === this.parent.billAmount - this.parent.paidAmount;
      }
    ),
  noOfProductsSold: Yup.number()
    .required("Number of Products Sold is required")
    .integer("Number of Products Sold must be an integer")
    .min(1, "At least one product must be sold"),
  billStatus: Yup.string()
    .required("Bill Status is required")
    .oneOf(["paid", "unpaid"], "Bill Status must be either Paid or Unpaid"),
});

// const Addsalesreport = ({ setmodal, isUpdate, salesData }) => {
  const Addsalesreport = ({ onClose, isUpdate, salesData }) => {
  const [reportsuccess, setreportsuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(!salesData); // false when viewing existing data, true when creating new
  const { loading, createAddSales, updateSales } = useSalesAnalytics();

  const formik = useFormik({
    initialValues: {
      productName: salesData?.productName || "",
      employeeFirstName: salesData?.employeeFirstName || "",
      employeeLastName: salesData?.employeeLastName || "",
      organizationName: salesData?.organizationName || "",
      email: salesData?.email || "",
      contact: salesData?.contact || "",
      date: salesData?.date || "",
      region: salesData?.region || "",
      state: salesData?.state || "",
      district: salesData?.district || "",
      billAmount: salesData?.billAmount || "",
      paidAmount: salesData?.paidAmount || "",
      unclearedAmount: salesData?.unclearedAmount || "",
      noOfProductsSold: salesData?.noOfProductsSold || "",
      billStatus: salesData?.billStatus || "paid",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (isUpdate) {
          await updateSales(salesData.id, values);
        } else {
          await createAddSales(values);
        }
        setreportsuccess(true);
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const renderField = (name, label, type = "text", placeholder = "") => {
    const hasError = formik.touched[name] && formik.errors[name];

    return (
      <div>
        <label htmlFor={name} className="block text-sm font-medium">
          {label}
        </label>
        {isEditing ? (
          <input
            type={type}
            id={name}
            name={name}
            value={formik.values[name]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`border ${
              hasError ? "border-red-500" : "border-gray-300"
            } rounded-md px-2 py-1 w-full`}
            placeholder={placeholder}
            disabled={!isEditing}
          />
        ) : (
          <p className="px-2 py-1 text-gray-700">{formik.values[name]}</p>
        )}
        {hasError && (
          <p className="text-red-500 text-xs mt-1">{formik.errors[name]}</p>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-[800px] p-8">
          <form onSubmit={formik.handleSubmit}>
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h2 className="text-xl font-bold">Sales Report</h2>
              {salesData && !isEditing && (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Edit
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {renderField(
                "productName",
                "Product Name",
                "text",
                "Enter Product Name"
              )}
              {renderField(
                "employeeFirstName",
                "Employee First Name",
                "text",
                "Enter First Name"
              )}
              {renderField(
                "employeeLastName",
                "Employee Last Name",
                "text",
                "Enter Last Name"
              )}
              {renderField(
                "organizationName",
                "Organization Name",
                "text",
                "Enter Organization Name"
              )}
              {renderField("email", "Email", "email", "Enter Email")}
              {renderField("contact", "Contact", "text", "Enter Contact")}
              {renderField("date", "Date", "date")}
              {renderField("region", "Region", "text", "Enter Region")}
              {renderField("state", "State", "text", "Enter State")}
              {renderField("district", "District", "text", "Enter District")}
              {renderField(
                "billAmount",
                "Bill Amount",
                "number",
                "Enter Bill Amount"
              )}
              {renderField(
                "paidAmount",
                "Paid Amount",
                "number",
                "Enter Paid Amount"
              )}
              {renderField(
                "unclearedAmount",
                "Uncleared Amount",
                "number",
                "Enter Uncleared Amount"
              )}
              {renderField(
                "noOfProductsSold",
                "No. of Products Sold",
                "number",
                "Enter Number"
              )}

              <div>
                <label
                  htmlFor="billStatus"
                  className="block text-sm font-medium"
                >
                  Bill Status
                </label>
                {isEditing ? (
                  <select
                    id="billStatus"
                    name="billStatus"
                    value={formik.values.billStatus}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="border border-gray-300 rounded-md px-2 py-1 w-full"
                    disabled={!isEditing}
                  >
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                ) : (
                  <p className="px-2 py-1 text-gray-700">
                    {formik.values.billStatus}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-6 gap-4">
              <button
                type="button"
                // onClick={() => {
                //   setmodal(false);
                // }}
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
              >
                Cancel
              </button>
              {isEditing && (
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                  disabled={loading}
                >
                  {loading ? "Saving..." : isUpdate ? "Update" : "Save"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      {reportsuccess && (
        <Salesreportsuccess
          // setmodal={setmodal}
            setmodal={onClose} // or just update the prop to onClose
            setreportsuccess={setreportsuccess}
        />
      )}
    </>
  );
};

export default Addsalesreport;
