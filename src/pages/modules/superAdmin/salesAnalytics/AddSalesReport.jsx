import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BreadCrumb from "../../../../components/uiComponents/breadcrumb/BreadCrumb";
import { useTheme } from "../../../../hooks/theme/useTheme";
import Button from "../../../../components/uiComponents/button/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import useSalesAnalytics from "../../../../hooks/salesAnalytics/useSalesAnalytics";
import Select from "react-select";
import useDropdown from "../../../../hooks/dropdown/useDropdown";

const AddSalesReport = () => {
  const { theme } = useTheme();
  const {
    productList,
    fetchProductsNames,
    fetchProductDetails,
    productDetails,
    resetProductDetails,
    loading: productLoading,
  } = useDropdown();

  const { addSalesReport } = useSalesAnalytics();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const navigate = useNavigate();
  const validationSchema = Yup.object().shape({
    date: Yup.date().nullable().required("Date is required"),
    productName: Yup.string().required("Product name is required"),
    noOfProductSold: Yup.number()
      .typeError("Must be a number")
      .required("Number of products sold is required"),
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid Email address")
      .required("Email address is required"),
    organizationName: Yup.string().required("Organization is required"),
    contact: Yup.string()
      .matches(/^[0-9]+$/, "Contact number must be numeric")
      .min(10, "Contact must be at least 10 digits")
      .required("Contact number is required"),
    region: Yup.string().required("Region is required"),
    state: Yup.string().required("State is required"),
    district: Yup.string().required("District is required"),
    // billAmount: Yup.number()
    //   .typeError("Bill Amount must be a number")
    //   .required("Bill Amount is required")
    //   .min(0, "Bill Amount cannot be negative"),

    // unClearedAmount: Yup.number()
    //   .typeError("Uncleared Amount must be a number")
    //   .required("Uncleared Amount is required")
    //   .min(0, "Uncleared Amount cannot be negative"),

    paidAmount: Yup.number()
      .typeError("Paid Amount must be a number")
      .when("billStatus", {
        is: (val) => val === "Paid" || val === "Pending",
        then: (schema) =>
          schema
            .required("Paid Amount is required")
            .min(0, "Paid Amount cannot be negative"),
        otherwise: (schema) => schema.notRequired(),
      }),

    billStatus: Yup.string().required("Bill Status is required"),
  });

  const initialValues = {
    date: "",
    productName: "",
    noOfProductSold: "",
    price: "",
    firstName: "",
    lastName: "",
    organizationName: "",
    email: "",
    contact: "",
    region: "",
    state: "",
    district: "",
    billAmount: "",
    unClearedAmount: "",
    paidAmount: "",
    billStatus: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      console.log("Sales Report Saved:", values);
      try {
        await addSalesReport(values);
        navigate("/sales-analytics");
      } catch (err) {
        console.error("API Error:", err.response?.data || err.message);
        toast.error("Unexpected Error Occured");
      }
    },
  });
  useEffect(() => {
    fetchProductsNames();
    resetProductDetails();
    return () => {
      resetProductDetails();
    };
  }, []);
  useEffect(() => {
    if (selectedProductId) {
      fetchProductDetails(selectedProductId);
    }
  }, [selectedProductId]);
  useEffect(() => {
    if (productDetails?.price) {
      formik.setFieldValue("price", productDetails.price);
    }
  }, [productDetails]);
  useEffect(() => {
    const { productName, price, noOfProductSold } = formik.values;
    const priceNum = Number(price);
    const qtyNum = Number(noOfProductSold);

    if (
      productName &&
      !isNaN(priceNum) &&
      !isNaN(qtyNum) &&
      priceNum > 0 &&
      qtyNum > 0
    ) {
      const billAmount = priceNum * qtyNum;
      console.log(billAmount);
      formik.setFieldValue("billAmount", parseFloat(billAmount.toFixed(2)));
    } else {
      formik.setFieldValue("billAmount", "");
    }
  }, [
    formik.values.productName,
    formik.values.price,
    formik.values.noOfProductSold,
  ]);

  useEffect(() => {
    const { billAmount, paidAmount } = formik.values;
    const billNum = Number(billAmount);
    const paidNum = Number(paidAmount);

    if (billNum >= 0 && paidNum >= 0) {
      const unClearedAmount = billNum - paidNum;
      formik.setFieldValue(
        "unClearedAmount",
        parseFloat(unClearedAmount.toFixed(2))
      );
    } else {
      formik.setFieldValue("unClearedAmount", "");
    }
  }, [formik.values.billAmount, formik.values.paidAmount]);

  useEffect(() => {
    if (
      formik.values.billStatus !== "Paid" &&
      formik.values.billStatus !== "Pending"
    ) {
      formik.setFieldValue("paidAmount", "");
      formik.setFieldValue("unClearedAmount", "");
    }
  }, [formik.values.billStatus, formik.setFieldValue]);
  console.log(formik.values, formik.errors);
  return (
    <div className="w-full min-h-screen">
      <BreadCrumb
        linkText={[
          { text: "Sales" },
          { text: "Sales Analytics", href: "/sales-analytics" },
          { text: "Add Sales Report" },
        ]}
      />

      <div
        className="w-full px-4 py-4 rounded-t-2xl"
        style={{ backgroundColor: theme.secondaryColor }}
      >
        <h2 className="text-lg font-semibold tracking-wide text-left text-gray-700">
          Add Sales Report
        </h2>
      </div>

      <div className="px-4 py-2 bg-white rounded-b-2xl">
        <form className="space-y-8" onSubmit={formik.handleSubmit}>
          {/* Date */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                name="date"
                type="date"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.date}
                className="w-full p-3 border border-gray-300 rounded-lg outline-none"
              />
              {formik.touched.date && formik.errors.date && (
                <p className="mt-1 text-sm font-semibold text-red-500">
                  {formik.errors.date}
                </p>
              )}
            </div>
          </div>
          {/* Product Name + No. of Products Sold */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Product Name
              </label>
              <Select
                name="productName"
                isLoading={productLoading}
                options={
                  Array.isArray(productList)
                    ? productList.map((product) => ({
                      label: product.name,
                      value: product.name,
                    }))
                    : []
                }
                value={selectedProduct ? selectedProduct : null}
                onChange={(selected) => {
                  if (selected) {
                    const product = productList.find(
                      (p) => p.name === selected.value
                    );
                    console.log("Selected Product:", product);
                    setSelectedProductId(product?._id);
                    setSelectedProduct(selected);
                    formik.setFieldValue("productName", selected.value);
                    formik.setFieldValue("price", product?.price || 0); // If price varies by product
                  } else {
                    setSelectedProduct(null);
                    formik.setFieldValue("productName", "");
                    formik.setFieldValue("price", "");
                    resetProductDetails();
                  }
                }}
                placeholder="Select Product Name"
                isClearable
                classNamePrefix="react-select"
                menuPortalTarget={document.body}
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    borderColor: state.isFocused
                      ? theme.secondaryColor
                      : "#d1d5db",
                    boxShadow: state.isFocused
                      ? `0 0 0 2px ${theme.secondaryColor}33`
                      : "none",
                    borderRadius: "0.5rem",
                    padding: "3px",
                    zIndex: 100,
                  }),
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                }}
              />
              {formik.touched.productName && formik.errors.productName && (
                <p className="mt-1 text-sm font-semibold text-red-500">
                  {formik.errors.productName}
                </p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                name="price"
                type="text"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g. 1000"
                className="w-full p-3 border border-gray-300 rounded-lg outline-none"
                readOnly
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                No. of Products Sold
              </label>
              <input
                name="noOfProductSold"
                type="number"
                value={formik.values.noOfProductSold}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                onWheel={(e) => e.target.blur()}
                placeholder="e.g. 10"
                disabled={!formik.values.productName || !formik.values.price}
                className="w-full p-3 border border-gray-300 rounded-lg outline-none no-spinner"
              />
              {formik.touched.noOfProductSold &&
                formik.errors.noOfProductSold && (
                  <p className="mt-1 text-sm font-semibold text-red-500">
                    {formik.errors.noOfProductSold}
                  </p>
                )}
            </div>
          </div>

          {/* First + Last Name */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Employee First Name
              </label>
              <input
                name="firstName"
                type="text"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g. Amit"
                className="w-full p-3 border border-gray-300 rounded-lg outline-none"
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <p className="mt-1 text-sm font-semibold text-red-500">
                  {formik.errors.firstName}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Employee Last Name
              </label>
              <input
                name="lastName"
                type="text"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g. Bhadana"
                className="w-full p-3 border border-gray-300 rounded-lg outline-none"
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <p className="mt-1 text-sm font-semibold text-red-500">
                  {formik.errors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Organization + Email */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Organization
              </label>
              <input
                name="organizationName"
                type="text"
                value={formik.values.organizationName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g. Suretech Hospital"
                className="w-full p-3 border border-gray-300 rounded-lg outline-none"
              />
              {formik.touched.organizationName &&
                formik.errors.organizationName && (
                  <p className="mt-1 text-sm font-semibold text-red-500">
                    {formik.errors.organizationName}
                  </p>
                )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="name@company.com"
                className="w-full p-3 border border-gray-300 rounded-lg outline-none"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-sm font-semibold text-red-500">
                  {formik.errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Contact + Region */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Contact
              </label>
              <input
                name="contact"
                type="text"
                value={formik.values.contact}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="9835248753"
                className="w-full p-3 border border-gray-300 rounded-lg outline-none"
              />
              {formik.touched.contact && formik.errors.contact && (
                <p className="mt-1 text-sm font-semibold text-red-500">
                  {formik.errors.contact}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Region
              </label>
              <input
                name="region"
                type="text"
                value={formik.values.region}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g. West"
                className="w-full p-3 border border-gray-300 rounded-lg outline-none"
              />
              {formik.touched.region && formik.errors.region && (
                <p className="mt-1 text-sm font-semibold text-red-500">
                  {formik.errors.region}
                </p>
              )}
            </div>
          </div>

          {/* State + District */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                State
              </label>
              <input
                name="state"
                type="text"
                value={formik.values.state}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g. Maharashtra"
                className="w-full p-3 border border-gray-300 rounded-lg outline-none"
              />
              {formik.touched.state && formik.errors.state && (
                <p className="mt-1 text-sm font-semibold text-red-500">
                  {formik.errors.state}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                District
              </label>
              <input
                name="district"
                type="text"
                value={formik.values.district}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g. Nagpur"
                className="w-full p-3 border border-gray-300 rounded-lg outline-none"
              />
              {formik.touched.district && formik.errors.district && (
                <p className="mt-1 text-sm font-semibold text-red-500">
                  {formik.errors.district}
                </p>
              )}
            </div>
          </div>

          {/* Bill + Paid Amount */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Bill Amount (₹)
              </label>
              <input
                name="billAmount"
                type="text"
                value={formik.values.billAmount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g. 456743.00"
                className="w-full p-3 border border-gray-300 rounded-lg outline-none"
                readOnly
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Uncleared Amount (₹)
              </label>
              <input
                name="unClearedAmount"
                type="text"
                value={formik.values.unClearedAmount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g. 0.00"
                className="w-full p-3 border border-gray-300 rounded-lg outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Bill Status
              </label>
              <select
                name="billStatus"
                value={formik.values.billStatus}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-3 bg-white border border-gray-300 rounded-lg outline-none"
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Pending">Partially Paid</option>
              </select>
              {formik.touched.billStatus && formik.errors.billStatus && (
                <p className="mt-1 text-sm font-semibold text-red-500">
                  {formik.errors.billStatus}
                </p>
              )}
            </div>
            {(formik.values.billStatus === "Paid" ||
              formik.values.billStatus === "Partially Paid") && (
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Paid Amount (₹)
                  </label>
                  <input
                    name="paidAmount"
                    type="number"
                    value={formik.values.paidAmount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="e.g. 440034.00"
                    className="w-full p-3 border border-gray-300 rounded-lg outline-none"
                  />
                  {formik.touched.paidAmount && formik.errors.paidAmount && (
                    <p className="mt-1 text-sm font-semibold text-red-500">
                      {formik.errors.paidAmount}
                    </p>
                  )}
                </div>
              )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
            <Button variant={3} type="button" text="Cancel" />
            <Button type="submit" variant={1} text="Save" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSalesReport;
