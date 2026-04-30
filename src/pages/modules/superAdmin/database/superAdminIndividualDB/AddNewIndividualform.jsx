import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb";
import ReactSelect from "react-select";
import { Formik, Form, useFormik } from "formik";
import * as Yup from "yup";
import useDropdown from "../../../../../hooks/dropdown/useDropdown";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import Button from "../../../../../components/uiComponents/button/Button";
import useIndividuals from "../../../../../hooks/salesExecutiveHook/Individual/useIndividual";
import Surgon from "./tabs/Surgon";
import Physician from "./tabs/Physician";
import NonClinical from "./tabs/NonClinical";
import { useNavigate, useParams } from "react-router-dom";
import useAdminIndividualDB from "../../../../../hooks/superAdminHook/superAdmindatabase/useAdminIndividualDB";
import useCompany from "../../../../../hooks/common/useCompany";

// Initial Values
const physicianInitialValues = {
  segment: "",
  typeOfDoctorProfile: "Physician",
  fullName: "",
  designation: "",
  otherDesignation: "",
  speciality: "",
  contactNo: "",
  alternateContactNo: "",
  officialEmail: "",
  personalEmail: "",
  hobbies: "",
  specifyHobby: "",
  residenceAddress: "",
  cityTownVillage: "",
  district: "",
  state: "",
  pincode: "",
  landmark: "",
  category: "",
  profileType: "",
  totalNoOfPatientExaminPerDay: "",
  totalNoOfPatientAdmissionPerDay: "",
  academicInterest: "",
  graduation: {
    instituteName: "",
    yearOfPassing: "",
  },
  postGraduation: {
    instituteName: "",
    yearOfPassing: "",
  },
  relationshipStatus: "",
  spouseName: "",
  dob: "",
  weddingAnniversary: "",
  opdDays: [],
  hospitalsAssociatedWith: [],
  visitTarget: "",
  visitAchievement: "",
  salesPersonName: "",
};

const surgonInitialValues = {
  segment: "",
  typeOfDoctorProfile: "Surgeon",
  fullName: "",
  designation: "",
  otherDesignation: "",
  speciality: "",
  contactNo: "",
  alternateContactNo: "",
  officialEmail: "",
  personalEmail: "",
  hobbies: "",
  specifyHobby: "",
  residenceAddress: "",
  cityTownVillage: "",
  district: "",
  state: "",
  pincode: "",
  landmark: "",
  category: "",
  academicInterest: "",
  graduation: {
    instituteName: "",
    yearOfPassing: "",
  },
  postGraduation: {
    instituteName: "",
    yearOfPassing: "",
  },
  relationshipStatus: "",
  spouseName: "",
  dob: "",
  weddingAnniversary: "",
  typeOfSurgeryPerformed: [],
  opdDays: [],
  surgeryDays: [],
  hospitalsAssociatedWith: [],
  visitTarget: "",
  visitAchievement: "",
  salesPersonName: "",
};

const nonClinicalInitialValues = {
  segment: "",
  typeOfDoctorProfile: "Non Clinical",
  fullName: "",
  designation: "",
  otherDesignation: "",
  department: "",
  contactNo: "",
  alternateContactNo: "",
  officialEmail: "",
  personalEmail: "",
  hobbies: "",
  specifyHobby: "",
  residenceAddress: "",
  cityTownVillage: "",
  district: "",
  state: "",
  pincode: "",
  landmark: "",
  category: "",
  academicInterest: "",
  graduation: {
    instituteName: "",
    yearOfPassing: "",
  },
  postGraduation: {
    instituteName: "",
    yearOfPassing: "",
  },
  relationshipStatus: "",
  spouseName: "",
  dob: "",
  weddingAnniversary: "",
  visitTarget: "",
  visitAchievement: "",
  salesPersonName: "",
};

// Validation Schemas
const physicianSchema = Yup.object({
  fullName: Yup.string().required("Name is required"),
  designation: Yup.string().required("Designation is required"),
  otherDesignation: Yup.string().when(
    "designation",
    (designationValue, schema) => {
      return designationValue === "Other"
        ? schema.required("Please specify designation")
        : schema.notRequired();
    }
  ),

  speciality: Yup.string().required("Speciality is required"),
  contactNo: Yup.string()
    .required("Contact No is required")
    .matches(/^[0-9]{10}$/, "Contact No must be 10 digits"),
  alternateContactNo: Yup.string()
    // .required("Alternate contact No is required")
    .matches(/^[0-9]{10}$/, "Alternate contact No must be 10 digits"),
  officialEmail: Yup.string()
    // .required("Official email is required")
    .email("Invalid official email"),
  personalEmail: Yup.string()
    .required("Personal email is required")
    .email("Invalid personal email"),
  hobbies: Yup.string().required("Hobby is required"),
  specifyHobby: Yup.string().when("hobbies", (hobbiesValue, schema) => {
    return (hobbiesValue || "").toString() === "Other"
      ? schema.required("Please specify hobby")
      : schema.notRequired();
  }),
  residenceAddress: Yup.string().required("Residence is required"),
  cityTownVillage: Yup.string().required("City/Town/Village is required"),
  district: Yup.string().required("District is required"),
  state: Yup.string().required("State is required"),
  pincode: Yup.string()
    .required("Pincode is required")
    .matches(/^(?!0{6})[0-9]{6}$/, "Must be a valid 6-digit pincode"),
  landmark: Yup.string().required("Landmark is required"),
  category: Yup.string().required("Category is required"),
  profileType: Yup.string().required("Profile type is required"),
  totalNoOfPatientExaminPerDay: Yup.number()
    .required("Total number of patients examined Required")
    .min(0, "Cannot be negative"),
  totalNoOfPatientAdmissionPerDay: Yup.number()
    .required("Total number of patients admission required")
    .min(0, "Cannot be negative"),
  // academicInterest: Yup.string().required("Academic interest is required"),
  graduation: Yup.object().shape({
    instituteName: Yup.string()
      // .required("Institute Name is required")
      .min(3, "Institute Name must be at least 3 characters"),
    yearOfPassing: Yup.number()
      // .required("Year of Passing is required")
      .min(1900, "Year must be after 1900")
      .max(new Date().getFullYear(), "Year cannot be in the future"),
  }),
  postGraduation: Yup.object().shape({
    instituteName: Yup.string().min(
      3,
      "Institute Name must be at least 3 characters"
    ),
    yearOfPassing: Yup.number()
      .min(1900, "Year must be after 1900")
      .max(new Date().getFullYear(), "Year cannot be in the future"),
  }),
  dob: Yup.date()
    // .required("Date of birth is required")
    .max(new Date(), "Cannot be in the future"),
  // relationshipStatus: Yup.string().required("Realationship status is required"),
  spouseName: Yup.string().when("relationshipStatus", {
    is: "Married",
    // then: (schema) => schema.required("Spouse name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  weddingAnniversary: Yup.date().when("relationshipStatus", {
    is: "Married",
    then: (schema) =>
      schema
        // .required("Anniversary is required")
        .max(new Date(), "Cannot be in the future"),
    otherwise: (schema) => schema.notRequired(),
  }),

  hospitalsAssociatedWith: Yup.array()
    .of(
      Yup.object().shape({
        hospitalName: Yup.string().required("Hospital name is required"),
        days: Yup.array()
          .of(Yup.string().required("Please enter available days"))
          .min(1, "At least one day is required")
          .required("Days are required"),
        timings: Yup.object()
          .shape({
            startTime: Yup.string().required("Start time is required"),
            endTime: Yup.string().required("End time is required"),
          })
          .required("Timings are required"),
      })
    )
    .min(1, "Please select at least one hospital")
    .required("Required"),
  opdDays: Yup.array()
    .of(Yup.string().required("Each day is required"))
    .min(1, "At least one OPD day is required")
    .required("OPD Days are required"),
  visitTarget: Yup.number().required("Visit Target is required"),
  visitAchievement: Yup.number().required("Visit Achievement is required"),
  salesPersonName: Yup.string().required("Sales Person name is required"),
});

const surgonSchema = Yup.object({
  fullName: Yup.string().required("Name is required"),
  designation: Yup.string().required("Designation is required"),
  otherDesignation: Yup.string().when(
    "designation",
    (designationValue, schema) => {
      return designationValue === "Other"
        ? schema.required("Please specify designation")
        : schema.notRequired();
    }
  ),
  speciality: Yup.string().required("Speciality is required"),
  contactNo: Yup.string()
    .required("Contact No is required")
    .matches(/^[0-9]{10}$/, "Contact No must be 10 digits"),
  alternateContactNo: Yup.string()
    // .required("Alternate Contact No is required")
    .matches(/^[0-9]{10}$/, "Alternate Contact No must be 10 digits"),
  officialEmail: Yup.string()
    .required("Official email is required")
    .email("Invalid official email"),
  personalEmail: Yup.string()
    .required("Personal email is required")
    .email("Invalid personal email"),
  hobbies: Yup.string().required("Hobby is required"),
  specifyHobby: Yup.string().when("hobbies", (hobbiesValue, schema) => {
    return (hobbiesValue || "").toString() === "Other"
      ? schema.required("Please specify hobby")
      : schema.notRequired();
  }),
  residenceAddress: Yup.string().required("Residence address is required"),
  cityTownVillage: Yup.string().required("City/Town/Village is required"),
  district: Yup.string().required("District is required"),
  state: Yup.string().required("State is required"),
  pincode: Yup.string()
    .required("Pincode is required")
    .matches(/^(?!0{6})[0-9]{6}$/, "Must be a valid 6-digit pincode"),
  landmark: Yup.string().required("Landmark is required"),
  category: Yup.string().required("Category is required"),
  // academicInterest: Yup.string().required("Academic interest is required"),
  graduation: Yup.object().shape({
    instituteName: Yup.string()
      // .required("Institute Name is required")
      .min(3, "Institute Name must be at least 3 characters"),
    yearOfPassing: Yup.number()
      // .required("Year of Passing is required")
      .min(1900, "Year must be after 1900")
      .max(new Date().getFullYear(), "Year cannot be in the future"),
  }),
  postGraduation: Yup.object().shape({
    instituteName: Yup.string().min(
      3,
      "Institute Name must be at least 3 characters"
    ),
    yearOfPassing: Yup.number()
      .min(1900, "Year must be after 1900")
      .max(new Date().getFullYear(), "Year cannot be in the future"),
  }),
  dob: Yup.date()
    // .required("Date of birth is required")
    .max(new Date(), "Cannot be in the future"),
  // relationshipStatus: Yup.string().required("Relationship status is required"),
  spouseName: Yup.string().when("relationshipStatus", {
    is: "Married",
    // then: (schema) => schema.required("Spouse name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  weddingAnniversary: Yup.date().when("relationshipStatus", {
    is: "Married",
    then: (schema) =>
      schema
        // .required("Anniversary is required")
        .max(new Date(), "Cannot be in the future"),
    otherwise: (schema) => schema.notRequired(),
  }),
  typeOfSurgeryPerformed: Yup.array()
    .of(
      Yup.object().shape({
        type: Yup.string().required(),
        count: Yup.number()
          .required("Count is required")
          .min(1, "Must be at least 1")
          .typeError("Must be a number"),
      })
    )
    .min(1, "Select at least one surgery type"),
  surgeryDays: Yup.array().of(
    Yup.string().required("Each surgery day is required")
  ),
  // .min(1, "At least one surgery day is required")
  // .required("Surgery days are required"),
  hospitalsAssociatedWith: Yup.array()
    .of(
      Yup.object().shape({
        hospitalName: Yup.string().required("Hospital name is required"),
        days: Yup.array()
          .of(Yup.string().required("Please enter available days"))
          .min(1, "At least one day is required")
          .required("Days are required"),
        timings: Yup.object()
          .shape({
            startTime: Yup.string().required("Start time is required"),
            endTime: Yup.string().required("End time is required"),
          })
          .required("Timings are required"),
      })
    )
    .min(1, "Please select at least one hospital")
    .required("Required"),
  opdDays: Yup.array() // optional if surgeons also have OPD
    .of(Yup.string().required("Each OPD day is required"))
    .min(0),
  visitTarget: Yup.number().required("Visit Target is required"),
  visitAchievement: Yup.number().required("Visit Achievement is required"),
  salesPersonName: Yup.string().required("Sales Person name is required"),
});

const nonClinicalSchema = Yup.object({
  fullName: Yup.string().required("Name is required"),
  designation: Yup.string().required("Designation is required"),
  department: Yup.string().required("Department is required"),
  otherDesignation: Yup.string().when(
    "designation",
    (designationValue, schema) => {
      return designationValue === "Other"
        ? schema.required("Please specify designation")
        : schema.notRequired();
    }
  ),
  contactNo: Yup.string()
    .required("Contact No is required")
    .matches(/^[0-9]{10}$/, "Contact No must be 10 digits"),
  alternateContactNo: Yup.string()
    // .required("Alternate Contact No is required")
    .matches(/^[0-9]{10}$/, "Alternate Contact No must be 10 digits"),
  officialEmail: Yup.string()
    .required("Official email is required")
    .email("Invalid official email"),
  personalEmail: Yup.string()
    .required("Personal email is required")
    .email("Invalid personal email"),
  hobbies: Yup.string().required("Hobby is required"),
  specifyHobby: Yup.string().when("hobbies", (hobbiesValue, schema) => {
    return (hobbiesValue || "").toString() === "Other"
      ? schema.required("Please specify hobby")
      : schema.notRequired();
  }),
  residenceAddress: Yup.string().required("Residence address is required"),
  cityTownVillage: Yup.string().required("City/Town/Village is required"),
  district: Yup.string().required("District is required"),
  state: Yup.string().required("State is required"),
  pincode: Yup.string()
    .required("Pincode is required")
    .matches(/^(?!0{6})[0-9]{6}$/, "Must be a valid 6-digit pincode"),
  landmark: Yup.string().required("Landmark is required"),
  category: Yup.string().required("Category is required"),
  // academicInterest: Yup.string().required("Academic interest is required"),
  graduation: Yup.object().shape({
    instituteName: Yup.string()
      // .required("Institute Name is required")
      .min(3, "Institute Name must be at least 3 characters"),
    yearOfPassing: Yup.number()
      // .required("Year of Passing is required")
      .min(1900, "Year must be after 1900")
      .max(new Date().getFullYear(), "Year cannot be in the future"),
  }),
  postGraduation: Yup.object().shape({
    instituteName: Yup.string().min(
      3,
      "Institute Name must be at least 3 characters"
    ),
    yearOfPassing: Yup.number()
      .min(1900, "Year must be after 1900")
      .max(new Date().getFullYear(), "Year cannot be in the future"),
  }),
  dob: Yup.date()
    // .required("Date of birth is required")
    .max(new Date(), "Cannot be in the future"),
  // relationshipStatus: Yup.string().required("Relationship status is required"),
  spouseName: Yup.string().when("relationshipStatus", {
    is: "Married",
    // then: (schema) => schema.required("Spouse name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  weddingAnniversary: Yup.date().when("relationshipStatus", {
    is: "Married",
    then: (schema) =>
      schema
        // .required("Anniversary is required")
        .max(new Date(), "Cannot be in the future"),
    otherwise: (schema) => schema.notRequired(),
  }),
  visitTarget: Yup.number().required("Visit Target is required"),
  visitAchievement: Yup.number().required("Visit Achievement is required"),
  salesPersonName: Yup.string().required("Sales Person name required"),
});

const AddNewIndividualform = () => {
  const { id } = useParams();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSector, setSelectedSector] = useState(null);
  const { isEnviroSolution, companyName } = useCompany();

  const { theme } = useTheme();
  const {
    fetchSegment,
    segment,
    profile,
    enviroprofile,
    profileState,
    enviroindiviualdropdown,
    loading: dropLoading,
  } = useDropdown();
  const [companyResolved, setCompanyResolved] = useState(false);

  useEffect(() => {
    if (companyName !== undefined) {
      setCompanyResolved(true);
    }
  }, [companyName]);

  const { getIndividualDataByID, getindividualByID, updateIndividual } =
    useIndividuals();
  const {
    createAdminNewIndiviual,
    loading: submitLoading,
    updateAdminIndividual,
  } = useAdminIndividualDB();
  const [editData, setEditData] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!companyResolved) return;

    fetchSegment();

    if (isEnviroSolution) {
      enviroindiviualdropdown(); // ✅ enviro
    } else {
      profileState(); // ✅ healthcare
    }
  }, [companyResolved, isEnviroSolution]);


  useEffect(() => {
    setSelectedDoctor(null);
  }, [isEnviroSolution]);

  const dropdownOptions = isEnviroSolution ? enviroprofile : profile;

  useEffect(() => {
    if (id) {
      getIndividualDataByID(id);
    }
  }, [id]);

  useEffect(() => {
    if (getindividualByID) {
      setEditData(getindividualByID);
      setSelectedDoctor({
        label: getindividualByID.typeOfDoctorProfile,
        value: getindividualByID.typeOfDoctorProfile,
      });
      setSelectedSector({
        label: getindividualByID.segment,
        value: getindividualByID.segment,
      });
    }
  }, [getindividualByID]);

  const getInitialValues = () => {
    switch (selectedDoctor?.value) {
      case "Physician":
        return { ...physicianInitialValues, ...editData };
      case "Surgeon":
        return { ...surgonInitialValues, ...editData };
      case "Non Clinical":
        return { ...nonClinicalInitialValues, ...editData };
      default:
        return {};
    }
  };

  const getValidationSchema = () => {
    switch (selectedDoctor?.value) {
      case "Physician":
        return physicianSchema;
      case "Surgeon":
        return surgonSchema;
      case "Non Clinical":
        return nonClinicalSchema;
      default:
        return Yup.object({});
    }
  };
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d)) return "";
    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0"),
    ].join("-");
  };

  const renderDoctorProfile = (formik) => {
    switch (selectedDoctor?.value) {
      case "Physician":
        return <Physician formik={formik} />;
      case "Surgeon":
        return <Surgon formik={formik} />;
      case "Non Clinical":
        return <NonClinical formik={formik} />;
      default:
        return null;
    }
  };
  console.log(segment);

  return (
    <div>
      <BreadCrumb
        linkText={[
          { text: "Database" },
          { text: "Individual Database", href: "/database" },
          ...(id
            ? [
              {
                text: "View Individual",
                href: `/database/view-newindividual/${id}`,
              },
              { text: "Edit Individual" },
            ]
            : [{ text: "Add New Individual" }]),
        ]}
      />
      <div className="w-full min-h-screen bg-gray-50">
        <div
          className="mb-0 p-[30px] rounded-tl-[10px] rounded-tr-[10px]"
          style={{ backgroundColor: theme.secondaryColor }}
        >
          <h2 className="mb-1 text-lg font-semibold text-center">
            {id ? "Edit Individual" : "Add New Individual"}
          </h2>
        </div>

        <div className="p-6 bg-white shadow-md rounded-b-[10px]">
          {/* Doctor and Segment Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Segment Dropdown */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Type of Segment:
              </label>
              <ReactSelect
                isLoading={dropLoading}
                options={
                  Array.isArray(segment)
                    ? segment.map((seg) => ({ label: seg, value: seg }))
                    : []
                }
                value={selectedSector}
                onChange={(selected) => setSelectedSector(selected)}
                placeholder="Select Segment"
                isClearable
                styles={{
                  control: (base, state) => ({
                    ...base,
                    minHeight: "50px",
                    borderRadius: "0.5rem",
                    borderColor: state.isFocused ? "#60A5FA" : "#556581",
                    boxShadow: state.isFocused ? "0 0 0 2px #60A5FA" : "none",
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    padding: "0 6px",
                    fontSize: "1rem",
                  }),
                  input: (base) => ({
                    ...base,
                    margin: 0,
                    padding: 0,
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: "#9CA3AF",
                  }),
                }}
              />
            </div>

            {/* Profile Dropdown */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Type of Individual Profile:
              </label>
              <ReactSelect
                isLoading={dropLoading}
                isDisabled={!selectedSector}
                options={
                  Array.isArray(dropdownOptions)
                    ? dropdownOptions.map((pro) => ({
                      label: pro,
                      value: pro,
                    }))
                    : []
                }
                value={selectedDoctor}
                onChange={(selected) => setSelectedDoctor(selected)}
                placeholder={
                  isEnviroSolution ? "Select Profile" : "Select Doctor Type"
                }
                isClearable
              />

            </div>
          </div>

          {selectedDoctor && (
            <Formik
              initialValues={getInitialValues()}
              validationSchema={getValidationSchema()}
              enableReinitialize={true}
              validateOnMount={true}
              onSubmit={async (values, { resetForm, setSubmitting }) => {
                console.log("Form values:", values);
                try {
                  const payload = {
                    ...values,
                    segment: selectedSector?.value,
                    officialEmail: values.officialEmail,
                    personalEmail: values.personalEmail,
                    designation: values.otherDesignation
                      ? values.otherDesignation
                      : values.designation,
                    otherDesignation: undefined,
                  };
                  if (selectedDoctor?.value === "Physician") {
                    const { officialEmail, personalEmail, ...rest } = values;
                    payload.physician = {
                      ...rest,
                      dob: formatDate(values.dob),
                      weddingAnniversary: formatDate(values.weddingAnniversary),
                    };
                  } else if (selectedDoctor?.value === "Surgeon") {
                    const { officialEmail, personalEmail, ...rest } = values;
                    payload.surgeon = {
                      ...rest,
                      dob: formatDate(values.dob),
                      weddingAnniversary: formatDate(values.weddingAnniversary),
                      surgery: values.surgery,
                    };
                  } else if (selectedDoctor?.value === "Non Clinical") {
                    const { officialEmail, personalEmail, ...rest } = values;
                    payload.nonClinical = {
                      ...rest,
                      dob: formatDate(values.dob),
                      weddingAnniversary: formatDate(values.weddingAnniversary),
                      surgeryDays: values.surgeryDays,
                    };
                  }

                  console.log("Payload:", payload);
                  console.log("Payload.Physician", payload.Physician);
                  console.log("Payload.surgeon", payload.surgeon);

                  if (id) {
                    const response = await updateAdminIndividual(id, payload);
                  } else {
                    console.log("payload", payload);
                    const response = await createAdminNewIndiviual(payload);
                  }
                  setSubmitting(false);
                } catch (error) {
                  console.error("Submission error:", error);
                  setSubmitting(false);
                }
              }}
            >
              {(formik) => {
                useEffect(() => {
                  if (selectedSector) {
                    formik.setFieldValue("segment", selectedSector.value);
                  }
                }, [selectedSector]);

                console.log("Formik State:", {
                  isValid: formik.isValid,
                  isSubmitting: formik.isSubmitting,
                  errors: formik.errors,
                  touched: formik.touched,
                  values: formik.values,
                });

                return (
                  <Form>
                    <div className="mt-6">{renderDoctorProfile(formik)}</div>

                    <div className="flex justify-center mt-6 gap-4">
                      <Button
                        text={
                          submitLoading
                            ? "Submitting..."
                            : id
                              ? "Save Changes"
                              : "Submit"
                        }
                        type="submit"
                        isFormikButton={true}
                        disabled={submitLoading}
                      />
                    </div>
                  </Form>
                );
              }}
            </Formik>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddNewIndividualform;
