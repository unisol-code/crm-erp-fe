import React from "react";
import { useFormik } from "formik";
import { FaCalendarAlt, FaPlusCircle } from "react-icons/fa";
import * as Yup from "yup";
import { useNavigate, useLocation, href, useParams } from "react-router-dom";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb";
import Button from "../../../../../components/uiComponents/button/Button";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import useDropdown from "../../../../../hooks/dropdown/useDropdown";
import Select from "react-select";
import { useEffect, useState } from "react";
import useTargetSheet from "../../../../../hooks/salesExecutiveHook/customerVisitPlan/useTaregtSheet";
import LoaderSpinner from "../../../../../components/uiComponents/loader/LoaderSpinner";

const TargetSheetForm = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const {
    loading: dropDownLoading,
    fetchDoctorList,
    doctorList,
    fetchOrganizationNames,
    fetchCityNames,
    productList,
    fetchProductsNames,
    fetchSpeciality,
    productDetails,
    fetchProductDetails,
    resetProductDetails,
    productTypes,
    fetchProductTypes,
    organizationTypes,
    fetchOrganizationTypes,
    organizationCity,
    fetchOrganizationCity,
    organizationTypeByCity,
    fetchOrganizationTypesByCity,
    orgNameByTypeCity,
    fetchOrganizationNameByCityType,
    legalEntity,
    fetchLegalEntity,
    specialityByOrgCityType,
    fetchSpecialityByOrgCityType,
  } = useDropdown();
  const {
    fetchTargetSheetById,
    updateTargetSheet,
    targetSheetDetails,
    loading,
  } = useTargetSheet();
  const [selectedProductId, setSelectedProductId] = useState(null);
  const { id } = useParams();

  const validationSchema = Yup.object({
    organization: Yup.string().required("Organization Name is required"),
    city: Yup.string().required("City is required"),
    typeOfOrganization: Yup.string().required(
      "Type of Organization is required"
    ),
    speciality: Yup.string().required("Specilaity is required"),
    SpecialityTarget: Yup.string().required("Speciality Target is required"),
    SpecialityAchievement: Yup.string().required(
      "Speciality Achievement is required"
    ),
    doctorName: Yup.string().required("Doctor name is required"),
    productType: Yup.string().required("Product type is required"),
    products: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required("Product name is required"),
        price: Yup.string().required("Product price is required"),
        enteredQuantity: Yup.string().required("Product quantity is required"),
      })
    ),
  });

  const formik = useFormik({
    initialValues: {
      organization: targetSheetDetails?.data?.organization || "",
      city: targetSheetDetails?.data?.city || "",
      typeOfOrganization: targetSheetDetails?.data?.typeOfOrganization || "",
      legalEntityType: targetSheetDetails?.data?.legalEntityType || "",
      speciality: targetSheetDetails?.data?.speciality || "",
      SpecialityTarget: targetSheetDetails?.data?.SpecialityTarget || "",
      SpecialityAchievement:
        targetSheetDetails?.data?.SpecialityAchievement || "",
      doctorName: targetSheetDetails?.data?.doctorName || "",
      productType: targetSheetDetails?.data?.productType || "",
      products: [
        {
          name: targetSheetDetails?.data?.products[0]?.name || "",
          price: targetSheetDetails?.data?.products[0]?.price || "",
          enteredQuantity:
            targetSheetDetails?.data?.products[0]?.enteredQuantity || "",
          productTargetYear:
            targetSheetDetails?.data?.products[0]?.productTargetYear || "",
          productAchievementYear:
            targetSheetDetails?.data?.products[0]?.productAchievementYear || "",
          productTargetQuarter:
            targetSheetDetails?.data?.products[0]?.productTargetQuarter || "",
          productAchievementQuarter:
            targetSheetDetails?.data?.products[0]?.productAchievementQuarter ||
            "",
          productTargetMonth:
            targetSheetDetails?.data?.products[0]?.productTargetMonth || "",
          productAchievementMonth:
            targetSheetDetails?.data?.products[0]?.productAchievementMonth ||
            "",
        },
      ],
      procurementVia: targetSheetDetails?.data?.procurementVia || "",
      estimatedBusinessPotential:
        targetSheetDetails?.data?.estimatedBusinessPotential || "",
      value: targetSheetDetails?.data?.value || "",
      targetValue: targetSheetDetails?.data?.targetValue || "",
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log(values);
      await updateTargetSheet(id, values);
      navigate(`/sales-executive/target-Sheet/view-target-sheet/${id}`);
    },
  });

  useEffect(() => {
    fetchDoctorList();
    fetchOrganizationCity();
    fetchProductsNames();
    resetProductDetails();
    fetchProductTypes();
    fetchLegalEntity();
    return () => {
      resetProductDetails();
    };
  }, []);

  useEffect(() => {
    if (formik.values.city) {
      fetchOrganizationTypesByCity(formik.values.city);
    }
  }, [formik.values.city]);
  useEffect(() => {
    if (formik.values.city && formik.values.typeOfOrganization) {
      fetchOrganizationNameByCityType(
        formik.values.city,
        formik.values.typeOfOrganization
      );
    }
  }, [formik.values.city, formik.values.typeOfOrganization]);
  useEffect(() => {
    if (
      formik.values.city &&
      formik.values.typeOfOrganization &&
      formik.values.organization
    ) {
      fetchSpecialityByOrgCityType(
        true,
        formik.values.organization,
        formik.values.typeOfOrganization,
        formik.values.city
      );
    }
  }, [
    formik.values.city,
    formik.values.typeOfOrganization,
    formik.values.organization,
  ]);

  useEffect(() => {
    if (!selectedProductId) {
      return;
    }
    fetchProductDetails(selectedProductId);
  }, [selectedProductId]);

  useEffect(() => {
    if (productDetails?.price) {
      formik.setFieldValue("products[0].price", productDetails.price);
    }
  }, [productDetails]);
  useEffect(() => {
    if (id) {
      fetchTargetSheetById(id);
    }
  }, [id]);

  console.log(formik.values, formik.errors, formik.touched);

  return (
    <div className="w-full min-h-screen">
      <BreadCrumb
        linkText={[
          { text: "Customer Visit Plan" },
          {
            text: "Target Sheet",
            href: "/sales-executive/target-sheet",
          },
          {
            text: "View Target Sheet",
            href: `/sales-executive/target-sheet/view-target-sheet/${id}`,
          },
          {
            text: "Edit Target Sheet",
          },
        ]}
      />
      <div className="border rounded-2xl shadow-md bg-white overflow-hidden">
        {/* Header */}
        <div className="text-center rounded-2xl">
          <h2
            className="flex p-6 mb-2 items-center justify-center font-semibold text-xl text-black bg-opacity-40 rounded-t-md"
            style={{ backgroundColor: theme.secondaryColor }}
          >
            Edit Target Sheet
          </h2>
        </div>
        {/* Instruction */}
        <p className="text-black font-bold text-center mb-4 px-6">
          PLEASE FILL OUT THE FOLLOWING DETAILS TO UPDATE A TARGET SHEET
        </p>
        {/* Form Start */}
        <form
          onSubmit={formik.handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-4"
        >
          {/* Organization Info */}
          <fieldset className="col-span-full border border-gray-200 rounded-lg p-4">
            <legend className="text-lg font-semibold mb-2 text-gray-700">
              Organization Details
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="block text-sm font-medium mb-1">
                  Select City
                </label>
                <Select
                  isLoading={dropDownLoading}
                  isClearable
                  placeholder="Select City"
                  classNamePrefix="react-select"
                  value={
                    organizationCity
                      ?.map((city) => ({
                        label: city,
                        value: city,
                      }))
                      .find((option) => option.value === formik.values.city) ||
                    null
                  }
                  onChange={(selectedOption) => {
                    formik.setFieldValue("city", selectedOption?.value);
                  }}
                  onBlur={() => formik.setFieldTouched("city", true)}
                  options={
                    Array.isArray(organizationCity)
                      ? organizationCity.map((city) => ({
                        label: city,
                        value: city,
                      }))
                      : []
                  }
                />
                {formik.touched.city && formik.errors.city && (
                  <p className="text-sm text-red-600 mt-1">
                    {formik.errors.city}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <label className="block text-sm font-medium mb-1">
                  Type of Organization
                </label>
                <Select
                  isLoading={dropDownLoading}
                  isClearable
                  placeholder="Select Organization"
                  classNamePrefix="react-select"
                  isDisabled={!formik.values.city}
                  value={
                    Array.isArray(organizationTypeByCity)
                      ? organizationTypeByCity
                        .map((typeOrg) => ({
                          label: typeOrg,
                          value: typeOrg,
                        }))
                        .find(
                          (option) =>
                            option.value === formik.values.typeOfOrganization
                        ) || null
                      : null
                  }
                  onChange={(selectedOption) => {
                    formik.setFieldValue(
                      "typeOfOrganization",
                      selectedOption?.value || ""
                    );
                  }}
                  onBlur={() =>
                    formik.setFieldTouched("typeOfOrganization", true)
                  }
                  options={
                    Array.isArray(organizationTypeByCity)
                      ? organizationTypeByCity.map((typeOrg) => ({
                        label: typeOrg,
                        value: typeOrg,
                      }))
                      : []
                  }
                />
                {formik.touched.typeOfOrganization &&
                  formik.errors.typeOfOrganization && (
                    <p className="text-sm text-red-600 mt-1">
                      {formik.errors.typeOfOrganization}
                    </p>
                  )}
              </div>
              <div className="flex flex-col">
                <label className="block text-sm font-medium mb-1">
                  Select Organization
                </label>
                <Select
                  isLoading={dropDownLoading}
                  isClearable
                  placeholder="Select Organization"
                  classNamePrefix="react-select"
                  isDisabled={
                    !formik.values.city || !formik.values.typeOfOrganization
                  }
                  value={
                    orgNameByTypeCity
                      ?.map((org) => ({
                        label: org.hospitalName,
                        value: org.hospitalName,
                      }))
                      .find(
                        (option) => option.value === formik.values.organization
                      ) || null
                  }
                  onChange={(selectedOption) => {
                    formik.setFieldValue(
                      "organization",
                      selectedOption?.value || ""
                    );
                  }}
                  onBlur={() => formik.setFieldTouched("organization", true)}
                  options={
                    Array.isArray(orgNameByTypeCity)
                      ? orgNameByTypeCity.map((org) => ({
                        label: org.hospitalName,
                        value: org.hospitalName,
                      }))
                      : []
                  }
                />
                {formik.touched.organization && formik.errors.organization && (
                  <p className="text-sm text-red-600 mt-1">
                    {formik.errors.organization}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <label className="block text-sm font-medium mb-1">
                  Legal Entity Type
                </label>
                <Select
                  isLoading={dropDownLoading}
                  isClearable
                  placeholder="Select Legal Entity Type"
                  classNamePrefix="react-select"
                  value={
                    Array.isArray(legalEntity)
                      ? legalEntity
                        .map((leg) => ({
                          label: leg,
                          value: leg,
                        }))
                        .find(
                          (option) =>
                            option.value === formik.values.legalEntityType
                        ) || null
                      : null
                  }
                  onChange={(selectedOption) => {
                    formik.setFieldValue(
                      "legalEntityType",
                      selectedOption?.value || ""
                    );
                  }}
                  onBlur={() => formik.setFieldTouched("legalEntityType", true)}
                  options={
                    Array.isArray(legalEntity)
                      ? legalEntity.map((leg) => ({
                        label: leg,
                        value: leg,
                      }))
                      : []
                  }
                />
                {formik.touched.legalEntityType &&
                  formik.errors.legalEntityType && (
                    <p className="text-sm text-red-600 mt-1">
                      {formik.errors.legalEntityType}
                    </p>
                  )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Select Speciality
                </label>
                <Select
                  isLoading={dropDownLoading}
                  isClearable
                  isDisabled={
                    !formik.values.city ||
                    !formik.values.typeOfOrganization ||
                    !formik.values.organization
                  }
                  placeholder="Select Speciality"
                  classNamePrefix="react-select"
                  value={
                    specialityByOrgCityType
                      ?.map((spec) => ({
                        label: spec,
                        value: spec,
                      }))
                      .find(
                        (option) => option.value === formik.values.speciality
                      ) || null
                  }
                  onChange={(selectedOption) => {
                    formik.setFieldValue("speciality", selectedOption?.value);
                  }}
                  onBlur={() => formik.setFieldTouched("speciality", true)}
                  options={
                    Array.isArray(specialityByOrgCityType)
                      ? specialityByOrgCityType.map((spec) => ({
                        label: spec,
                        value: spec,
                      }))
                      : []
                  }
                />
                {formik.touched.speciality && formik.errors.speciality && (
                  <p className="text-sm text-red-600 mt-1">
                    {formik.errors.speciality}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <label className="block text-sm font-medium mb-1">
                  Speciality Target
                </label>
                <input
                  type="number"
                  name="SpecialityTarget"
                  onWheel={(e) => e.target.blur()}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.SpecialityTarget}
                  z
                  className="w-full border p-2 rounded no-spinner"
                  placeholder="Enter Speciality Target Value"
                />
                {formik.touched.SpecialityTarget &&
                  formik.errors.SpecialityTarget && (
                    <p className="text-sm text-red-600 mt-1">
                      {formik.errors.SpecialityTarget}
                    </p>
                  )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Speciality Achievement
                </label>
                <input
                  type="number"
                  name="SpecialityAchievement"
                  onChange={formik.handleChange}
                  onWheel={(e) => e.target.blur()}
                  onBlur={() =>
                    formik.setFieldTouched("SpecialityAchievement", true)
                  }
                  value={formik.values.SpecialityAchievement}
                  className="no-spinner w-full border p-2 rounded"
                  placeholder="Enter Speciality Achievement Value"
                />
                {formik.touched.SpecialityAchievement &&
                  formik.errors.SpecialityAchievement && (
                    <p className="text-sm text-red-600 mt-1">
                      {formik.errors.SpecialityAchievement}
                    </p>
                  )}
              </div>
              <div className="flex flex-col">
                <label className="block text-sm font-medium mb-1">
                  Doctor/Surgeon Name
                </label>
                <Select
                  isLoading={dropDownLoading}
                  isClearable
                  placeholder="Select Person name"
                  classNamePrefix="react-select"
                  value={
                    Array.isArray(doctorList)
                      ? doctorList
                        .map((doc) => ({
                          label: doc.fullName,
                          value: doc.fullName,
                        }))
                        .find(
                          (option) =>
                            option.value === formik.values.doctorName
                        ) || null
                      : null
                  }
                  onChange={(selectedOption) => {
                    formik.setFieldValue(
                      "doctorName",
                      selectedOption?.value || ""
                    );
                  }}
                  onBlur={() => formik.setFieldTouched("doctorName", true)}
                  options={doctorList?.map((doc) => ({
                    label: doc.fullName,
                    value: doc.fullName,
                  }))}
                />
                {formik.touched.doctorName && formik.errors.doctorName && (
                  <p className="text-sm text-red-600 mt-1">
                    {formik.errors.doctorName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Product Type
                </label>
                <Select
                  isLoading={dropDownLoading}
                  isClearable
                  placeholder="Select Product Type"
                  classNamePrefix="react-select"
                  value={
                    Array.isArray(productTypes)
                      ? productTypes
                        .map((ptype) => ({
                          label: ptype,
                          value: ptype,
                        }))
                        .find(
                          (option) =>
                            option.value === formik.values.productType
                        ) || null
                      : null
                  }
                  onChange={(selectedOption) => {
                    formik.setFieldValue(
                      "productType",
                      selectedOption?.value || ""
                    );
                  }}
                  onBlur={() => formik.setFieldTouched("productType", true)}
                  options={
                    Array.isArray(productTypes)
                      ? productTypes.map((ptype) => ({
                        label: ptype,
                        value: ptype,
                      }))
                      : []
                  }
                />
                {formik.touched.productType && formik.errors.productType && (
                  <p className="text-sm text-red-600 mt-1">
                    {formik.errors.productType}
                  </p>
                )}
              </div>
            </div>
          </fieldset>
          {/* Product Info */}
          <fieldset className="col-span-full border border-gray-200 rounded-lg p-4">
            <legend className="text-lg font-semibold mb-2 text-gray-700">
              Product & Target Details
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label className="block text-sm font-medium mb-1">
                  Product Name
                </label>
                <Select
                  isLoading={dropDownLoading}
                  isClearable
                  placeholder="Select Product name"
                  classNamePrefix="react-select"
                  value={
                    productList
                      ?.map((pro) => ({
                        label: pro.name,
                        value: pro.name,
                      }))
                      .find(
                        (option) =>
                          option.value === formik.values.products[0].name
                      ) || null
                  }
                  onChange={(selectedOption) => {
                    const name = selectedOption?.value || "";
                    const product = productList.find((p) => p.name === name);
                    formik.setFieldValue(`products[0].name`, name);
                    resetProductDetails();
                    if (!name) {
                      formik.setFieldValue(`products[0].price`, "");
                    } else {
                      setSelectedProductId(product?._id || null);
                    }
                  }}
                  onBlur={() =>
                    formik.setFieldTouched("products[0].name", true)
                  }
                  options={productList?.map((pro) => ({
                    label: pro.name,
                    value: pro.name,
                  }))}
                />
                {formik.touched.products?.[0]?.name &&
                  formik.errors.products?.[0]?.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.products[0].name}
                    </p>
                  )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Product Price
                </label>
                <input
                  type="number"
                  onBlur={() =>
                    formik.setFieldTouched("products[0].price", true)
                  } // Correct
                  name="products[0].price"
                  onChange={formik.handleChange}
                  value={formik?.values?.products[0]?.price}
                  onWheel={(e) => e.target.blur()}
                  className="w-full border p-2 rounded no-spinner"
                  placeholder="Price of the product"
                  readOnly
                />
                {formik.touched.products?.[0]?.price &&
                  formik.errors.products?.[0]?.price && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.products[0].price}
                    </p>
                  )}
              </div>
              <div className="flex flex-col">
                <label className="block text-sm font-medium mb-1">
                  Product Quantity
                </label>
                <input
                  type="number"
                  name="products[0].enteredQuantity"
                  onWheel={(e) => e.target.blur()}
                  onChange={formik.handleChange}
                  value={formik.values.products[0].enteredQuantity}
                  className="w-full border p-2 rounded no-spinner"
                  placeholder="Enter Quantity"
                  onBlur={() =>
                    formik.setFieldTouched("products[0].enteredQuantity", true)
                  }
                />
                {formik.touched.products?.[0]?.enteredQuantity &&
                  formik.errors.products?.[0]?.enteredQuantity && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.products[0].enteredQuantity}
                    </p>
                  )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Target Qty. (Year)
                </label>
                <input
                  type="number"
                  name="products[0].productTargetYear"
                  onChange={formik.handleChange}
                  value={formik.values.products[0].productTargetYear}
                  onWheel={(e) => e.target.blur()}
                  className="w-full border p-2 rounded no-spinner"
                  placeholder="Enter Yearly Target"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Target Qty. (Quarter)
                </label>
                <input
                  type="number"
                  name="products[0].productTargetQuarter"
                  onChange={formik.handleChange}
                  value={formik.values.products[0].productTargetQuarter}
                  onWheel={(e) => e.target.blur()}
                  className="w-full border p-2 rounded no-spinner"
                  placeholder="Enter Quarterly Target"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Target Qty. (Month)
                </label>
                <input
                  type="number"
                  name="products[0].productTargetMonth"
                  onChange={formik.handleChange}
                  value={formik.values.products[0].productTargetMonth}
                  className="w-full border p-2 rounded no-spinner"
                  placeholder="Enter Monthly Target"
                  onWheel={(e) => e.target.blur()}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Product Achievement (Year)
                </label>
                <input
                  type="number"
                  name="products[0].productAchievementYear"
                  onChange={formik.handleChange}
                  onWheel={(e) => e.target.blur()}
                  value={formik.values.products[0].productAchievementYear}
                  className="w-full border p-2 rounded no-spinner"
                  placeholder="Enter Achievement"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Product Achievement (Quarter)
                </label>
                <input
                  type="number"
                  name="products[0].productAchievementQuarter"
                  onChange={formik.handleChange}
                  onWheel={(e) => e.target.blur()}
                  value={formik.values.products[0].productAchievementQuarter}
                  className="w-full border p-2 rounded no-spinner"
                  placeholder="Enter Achievement"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Product Achievement (Month)
                </label>
                <input
                  type="number"
                  name="products[0].productAchievementMonth"
                  onChange={formik.handleChange}
                  value={formik.values.products[0].productAchievementMonth}
                  onWheel={(e) => e.target.blur()}
                  className="w-full border p-2 rounded no-spinner"
                  placeholder="Enter Achievement"
                />
              </div>
            </div>
          </fieldset>
          {/* Additional Info */}
          <fieldset className="col-span-full border border-gray-200 rounded-lg p-4">
            <legend className="text-lg font-semibold mb-2 text-gray-700">
              Additional Information
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Procurement Via
                </label>
                <select
                  name="procurementVia"
                  onChange={formik.handleChange}
                  value={formik.values.procurementVia}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select</option>
                  <option value="Tender">Tender</option>
                  <option value="Direct Purchase">Direct Purchase</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Value</label>
                <input
                  type="number"
                  onWheel={(e) => e.target.blur()}
                  name="value"
                  onChange={formik.handleChange}
                  value={formik.values.value}
                  className="w-full border p-2 rounded no-spinner"
                  placeholder="Enter Value"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Business Potential (Year)
                </label>
                <input
                  type="number"
                  name="estimatedBusinessPotential"
                  onChange={formik.handleChange}
                  onWheel={(e) => e.target.blur()}
                  value={formik.values.estimatedBusinessPotential}
                  className="w-full border p-2 rounded no-spinner"
                  placeholder="Enter Business Potential Value"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Target Value
                </label>
                <input
                  type="number"
                  name="targetValue"
                  onChange={formik.handleChange}
                  value={formik.values.targetValue}
                  className="w-full border p-2 rounded no-spinner"
                  placeholder="Enter Value"
                  onWheel={(e) => e.target.blur()}
                />
              </div>
            </div>
          </fieldset>
          {/* Add Product Button */}
          {/* <div className="col-span-full flex justify-end">
              <button
                onClick={() => navigate("/sales-executive/target-sheet-form")}
                type="button"
                className="flex items-center gap-2 border border-[var(--primary-color)] text-[var(--primary-color)] px-4 py-2 rounded-md font-medium text-sm hover:bg-blue-50 transition"
              >
                Add Product <FaPlusCircle size={16} />
              </button>
            </div> */}
          {/* Submit + Clear Buttons */}
          <div className="col-span-full flex justify-center gap-4 mt-4">
            <Button
              type="button"
              text="Clear"
              onClick={() => formik.resetForm()}
            />
            <Button type="submit" text="Submit" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default TargetSheetForm;
