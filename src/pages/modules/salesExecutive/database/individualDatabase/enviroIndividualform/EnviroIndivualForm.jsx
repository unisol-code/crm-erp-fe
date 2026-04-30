import React, { useEffect, useState } from "react";
import { useFormik, getIn } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
// import useEnviroLeadManage from "../../../../../../hooks/leadmanagement/useEnviroLeadManage";
import BreadCrumb from "../../../../../../components/uiComponents/breadcrumb/BreadCrumb";
import Button from "../../../../../../components/uiComponents/button/Button";
import LoaderSpinner from "../../../../../../components/uiComponents/loader/LoaderSpinner";
import { useTheme } from "../../../../../../hooks/theme/useTheme";
import ReactSelect from "react-select";
import useDropdown from "../../../../../../hooks/dropdown/useDropdown";
import useEnviroIndividualDB from "../../../../../../hooks/salesExecutiveHook/salesExecutiveDB/enviroIndividualDB/useEnviroIndividualDB";
import FpoForm from "./tabs/FPO";
import GovForm from "./tabs/Gov";
import FarmerForm from "./tabs/Farmer";

const validationSchema = Yup.object({
  segment: "",
  typeOfProfile: "",
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  leadOwner: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email format").required("Required"),
  contact: Yup.string()
    .matches(/^\d{10}$/, "Must be a valid 10-digit number")
    .required("Required"),
  pinCode: Yup.string()
    .matches(/^(?!0{6})[0-9]{6}$/, "Must be a valid 6-digit pincode")
    .required("Required"),
  address: Yup.string().required("Required"),
  state: Yup.string().required("Required"),
  district: Yup.string().required("Required"),
  villageName: Yup.string().required("Required"),
  taluka: Yup.string().required("Required"),
  productName: Yup.string().required("Required"),
  totalLandOwned: Yup.string().required("Required"),
  leadGeneratedThrough: Yup.array().min(
    1,
    "At least one option must be selected"
  ),
  panNo: Yup.string().required("Required"),
  sprayingType: Yup.string().required("Required"),
  tentativeBuyingDate: Yup.string().required("Required"),
});

const initialValues = {
  firstName: "",
  lastName: "",
  leadOwner: "",
  productName: "",
  totalLandOwned: "",
  email: "",
  contact: "",
  villageName: "",
  state: "",
  district: "",
  address: "",
  pinCode: "",
  leadGeneratedThrough: [],
  lastMeeting: "",
  nextMeeting: "",
  status: "",
  panNo: "",
  sprayingType: "",
  tentativeBuyingDate: "",
  cropType: "",
  cropName: "",
  sprayingDuration: "",
  // customerType: "",
  department: "",
  taluka: "",
  purposeForBuying: "",
  paymentMode: "",
  existingLoan: "",
  bankName: "",
  otherCustomerType: "",
  nextfollowup: "",

  // Agriculture - FPO Fields
  fpoName: "",
  registrationNumber: "",
  registrationAct: "",
  yearOfEstablishment: "",
  operationalArea: "",
  officeAddress: "",
  officialContactNumber: "",
  officialEmailID: "",
  websiteAppUrl: "",
  numBoardMembers: 0,
  numStaffMembers: 0,
  totalActiveMembers: 0,
  memberCategories: [],
  communicationChannels: [],
  majorCropsHandled: "",
  annualTurnover: "",
  majorRevenueSources: [],
  keyBuyerTypes: [],
  topChallenges: "",
  topPriorities: "",

  // Agriculture - Gov Fields
  birthday: "",
  anniversary: "",
  hobbies: "",
  officeName: "",
  designation: "",
  districtBlockRegion: "",
  yearsOfExperienceInAgri: "",
  frequentlyRequestedServices: [],
  farmersUnderstandSchemes: "",
  effectiveCommunicationLanguage: "",
  isFarmerDataMaintainedDigitally: "",
  dataManagementTools: [],
};

// Reusable Form Field Component
const FormField = ({ label, name, formik, type = "text", ...props }) => {
  const value = getIn(formik.values, name) || "";
  const error = getIn(formik.errors, name);
  const touched = getIn(formik.touched, name);

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        {...props}
        type={type}
        name={name}
        value={value}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="w-full px-3 py-2 border rounded focus:outline-none"
      />
      {error && touched && (
        <div className="text-red-500 text-xs mt-1">{error}</div>
      )}
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
      formik.setFieldValue(
        name,
        currentValues.filter((item) => item !== value)
      );
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
            <label
              htmlFor={option.value}
              className="text-gray-700 cursor-pointer"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {formik.touched[name] && formik.errors[name] && (
        <div className="mt-1 text-sm text-red-500">{formik.errors[name]}</div>
      )}
    </div>
  );
};

const SectionHeading = ({ title }) => (
  <div className="col-span-2 mt-4 mb-2">
    <h3 className="text-lg font-bold text-gray-800 border-b-2 border-blue-500 pb-2">
      {title}
    </h3>
  </div>
);

const EnviroIndivualform = () => {
  const {
    fetchSegment,
    segment,
    enviroprofile,
    enviroindiviualdropdown,
    loading: dropdownLoading,
  } = useDropdown();
  const { createEnviroIndividual, updateEnviroIndividual, resetEnviroIndividualDetails,
    fetchEnviroIndividualDetails, enviroIndividualDetails
  } = useEnviroIndividualDB();
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [editData, setEditData] = useState(null);
  const [selectedSector, setSelectedSector] = useState(null);
  const [selectedUserType, setSelectedUserType] = useState(null);

  console.log("Enviro Individual Details:", enviroIndividualDetails);

  useEffect(() => {
    fetchSegment();
    enviroindiviualdropdown();
  }, []);

  const getInitialValues = () => {
    switch (selectedUserType?.value) {
      case "Farmer":
        return { ...initialValues, ...editData };
      case "Government Officer":
        return { ...initialValues, ...editData };
      case "FPOForm":
        return { ...initialValues, ...editData };
      default:
        return {};
    }
  };

  const getValidationSchema = () => {
    switch (selectedUserType?.value) {
      case "Farmer":
        return validationSchema;
      case "Government Officer":
        return validationSchema;
      case "FPOForm":
        return validationSchema;
      default:
        return Yup.object({});
    }
  };

  const renderIndividualForm = (formik) => {
    if (selectedSector?.value === "Agriculture") {
      switch (selectedUserType?.value) {
        case "Farmer":
          return <FarmerForm formik={formik} />;
        case "Government Officer":
          return <GovForm formik={formik} />;
        case "FPO":
          return <FpoForm formik={formik} />;
        default:
          return null;
      }
    }
    return null;
  };

  useEffect(() => {
    if (enviroIndividualDetails) {
      setEditData(enviroIndividualDetails);
      setSelectedUserType({
        label: enviroIndividualDetails.typeOfProfile,
        value: enviroIndividualDetails.typeOfProfile,
      });
      setSelectedSector({
        label: enviroIndividualDetails.segment,
        value: enviroIndividualDetails.segment,
      });
    }
  }, [enviroIndividualDetails]);

  const individualTypeOptions = Array.isArray(enviroprofile)
    ? enviroprofile.map((item) => ({
      label: item,
      value: item,
    }))
    : [];

  const isEditMode = Boolean(id);

  useEffect(() => {
    if (id) fetchEnviroIndividualDetails(id);
    return () => resetEnviroIndividualDetails();
  }, [id]);

  const formInitialValues =
    isEditMode && enviroIndividualDetails
      ? { ...initialValues, ...enviroIndividualDetails }
      : initialValues;

  const formik = useFormik({
    initialValues: formInitialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      const transformedValues = {
        ...values,
        segment: selectedSector?.value,
        typeOfProfile: selectedUserType?.value,
      };
      if (id) {
        await updateEnviroIndividual(id, transformedValues);
        navigate("/sales-executive/database");
      } else {
        await createEnviroIndividual(transformedValues);
        resetEnviroIndividualDetails();
        navigate("/sales-executive/database");
      }
    },
  });

  if (isEditMode && !enviroIndividualDetails) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoaderSpinner />
      </div>
    );
  }

  return (
    <>
      <BreadCrumb
        linkText={[
          { text: "Database" },
          { text: "Individual Database", href: "/sales-executive/database" },
          ...(id
            ? [
              {
                text: "View Individual",
                href: `/sales-executive/database/view-individual/${id}`,
              },
              { text: "Edit Individual" },
            ]
            : [{ text: "Add New Individual" }]),
        ]}
      />
      <div className="relative pb-12 mb-1 text-center">
        <h2
          className="p-[36px] absolute inset-0 flex items-center justify-center font-bold text-xl text-black rounded-t-lg"
          style={{ backgroundColor: theme.secondaryColor }}
        >
          {isEditMode ? "Update Individual" : "Add New Individual"}
        </h2>
      </div>

      <div className="p-5 bg-white rounded-lg shadow-md">
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Info */}
            <SectionHeading title="Basic Information" />
            <ReactSelect
              options={
                Array.isArray(segment)
                  ? segment.map((seg) => ({ label: seg, value: seg }))
                  : []
              }
              value={selectedSector}
              onChange={(selected) => {
                setSelectedSector(selected);
                setSelectedUserType(null);
              }}
              placeholder="Select Segment"
              isClearable
              isDisabled={!!id}
            // styles={{
            //   control: (base, state) => ({
            //     ...base,
            //     minHeight: "50px",
            //     borderRadius: "0.5rem",
            //     borderColor: state.isFocused ? "#60A5FA" : "#556581",
            //     boxShadow: state.isFocused ? "0 0 0 2px #60A5FA" : "none",
            //   }),
            //   valueContainer: (base) => ({
            //     ...base,
            //     padding: "0 6px",
            //     fontSize: "1rem",
            //   }),
            //   input: (base) => ({
            //     ...base,
            //     margin: 0,
            //     padding: 0,
            //   }),
            //   placeholder: (base) => ({
            //     ...base,
            //     color: "#9CA3AF",
            //   }),
            // }}
            />

            <ReactSelect
              isLoading={dropdownLoading}
              options={individualTypeOptions}
              value={selectedUserType}
              onChange={(selected) => setSelectedUserType(selected)}
              placeholder={
                !selectedSector
                  ? "Select Segment first"
                  : dropdownLoading
                    ? "Loading individual types..."
                    : "Select Individual Type"
              }
              isClearable
              isDisabled={!selectedSector}
            />

            {selectedSector?.value === "Agriculture" && selectedUserType && renderIndividualForm(formik)}
          </div>

          {/* Action Buttons */}
          {selectedUserType && (
            <div className="flex justify-center gap-4 pt-6 mt-8 border-t">
              <Button
                variant={3}
                type="button"
                text="Cancel"
                onClick={() => navigate(-1)}
                className="px-6 py-2"
              />
              <Button
                type="submit"
                text={isEditMode ? "Update Individual" : "Add New Individual"}
                disabled={formik.isSubmitting}
                className="px-6 py-2"
              />
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default EnviroIndivualform;
