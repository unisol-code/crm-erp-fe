import React, { useEffect, useState } from "react";
import { useFormik, getIn } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useEnviroLeadManage from "../../../../../../hooks/leadmanagement/useEnviroLeadManage";
import BreadCrumb from "../../../../../../components/uiComponents/breadcrumb/BreadCrumb";
import Button from "../../../../../../components/uiComponents/button/Button";
import LoaderSpinner from "../../../../../../components/uiComponents/loader/LoaderSpinner";
import { useTheme } from "../../../../../../hooks/theme/useTheme";
import ReactSelect from "react-select";
import useDropdown from "../../../../../../hooks/dropdown/useDropdown";
import useEnviroAdminIndDB from "../../../../../../hooks/superAdminHook/superAdmindatabase/enviroDB/useEnviroAdminIndDB";
import FpoForm from "./tabs/FPO";
import GovForm from "./tabs/Gov";
import FarmerForm from "./tabs/Farmer";
import useEnviroIndividualDB from "../../../../../../hooks/salesExecutiveHook/salesExecutiveDB/enviroIndividualDB/useEnviroIndividualDB";

const validationSchema = Yup.object({
  firstName: Yup.string().when("typeOfProfile", {
    is: (val) => val === "Farmer" || val === "Government Officer",
    then: () => Yup.string().required("Required"),
  }),
  lastName: Yup.string().when("typeOfProfile", {
    is: (val) => val === "Farmer" || val === "Government Officer",
    then: () => Yup.string().required("Required"),
  }),
  email: Yup.string().when("typeOfProfile", {
    is: (val) => val === "Farmer" || val === "Government Officer",
    then: () => Yup.string().email("Invalid email format").required("Required"),
  }),
  contact: Yup.string().when("typeOfProfile", {
    is: (val) => val === "Farmer" || val === "Government Officer",
    then: () => Yup.string()
      .matches(/^\d{10}$/, "Must be a valid 10-digit number")
      .required("Required"),
  }),
  fpoName: Yup.string().when("typeOfProfile", {
    is: "FPO",
    then: () => Yup.string().required("Required"),
  }),
  officialEmailId: Yup.string().when("typeOfProfile", {
    is: "FPO",
    then: () => Yup.string().email("Invalid email format").required("Required"),
  }),
  officialContactNumber: Yup.string().when("typeOfProfile", {
    is: "FPO",
    then: () => Yup.string()
      .matches(/^\d{10}$/, "Must be a valid 10-digit number")
      .required("Required"),
  }),
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
  officialEmailId: "",
  websiteAppUrl: "",
  numberOfBoardMembers: 0,
  numberOfStaffMembers: 0,
  totalActiveMembers: 0,
  memberCategories: [],
  memberCategoriesOthers: "",
  primaryCommunicationChannels: [],
  majorCropsHandled: "",
  annualTurnover: "",
  majorRevenueSources: [],
  majorRevenueSourcesOthers: [],
  keyBuyerTypes: [],
  topChallenges: "",
  topPriorities: "",

  // Agriculture - Gov Fields
  birthday: "",
  anniversary: "",
  hobbies: "",
  goals: "",
  officeName: "",
  designation: "",
  districtBlockRegion: "",
  yearsOfExperience: "",
  frequentlyRequestedServices: [],
  frequentlyRequestedServicesOthers: "",
  schemeUnderstanding: "",
  effectiveLanguage: "",
  dataMaintainedDigitally: "",
  dataManagementTools: [],
  dataManagementToolsOthers: "",
};

const SectionHeading = ({ title }) => (
  <div className="col-span-2 mt-4 mb-2">
    <h3 className="text-lg font-bold text-gray-800 border-b-2 border-blue-500 pb-2">
      {title}
    </h3>
  </div>
);

const EnviroIndivualform = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const typeFromState = location.state?.typeOfProfile;

  const {
    fetchSegment,
    segment,
    enviroprofile,
    enviroindiviualdropdown,
    loading: dropdownLoading,
  } = useDropdown();

  const { updateEnviroIndividual, createEnviroIndividual, resetEnviroIndividualDetails,
    fetchEnviroIndividualDetails, enviroIndividualDetails
  } = useEnviroIndividualDB();
  const {
    // fetchEnviroAdminIndividualDetails,
    // enviroAdminIndividualDetails,
    // resetEnviroAdminIndividualDetails,
    // createEnviroAdminIndividual,
    // updateEnviroLead,
    // Gov Officer
    fetchEnviroGovtOfficerDetails,
    enviroGovtOfficerDetails,
    resetEnviroGovtOfficerDetails,
    createEnviroGovtOfficer,
    updateEnviroGovtOfficer,
    // FPO
    fetchEnviroFPODetails,
    enviroFPODetails,
    resetEnviroFPODetails,
    createEnviroFPO,
    updateEnviroFPO,
    loading,
  } = useEnviroAdminIndDB();

  const [selectedSector, setSelectedSector] = useState(null);
  const [selectedUserType, setSelectedUserType] = useState(null);

  useEffect(() => {
    fetchSegment();
    enviroindiviualdropdown();
  }, []);

  useEffect(() => {
    if (id) {
      const type = typeFromState || selectedUserType?.value;
      if (type === "Farmer") {
        fetchEnviroIndividualDetails(id);
      } else if (type === "Government Officer") {
        fetchEnviroGovtOfficerDetails(id);
      } else if (type === "FPO") {
        fetchEnviroFPODetails(id);
      } else {
        fetchEnviroIndividualDetails(id);
      }
    }
    return () => {
      resetEnviroIndividualDetails();
      resetEnviroGovtOfficerDetails();
      resetEnviroFPODetails();
    };
  }, [id, typeFromState]);

  const currentDetails = enviroIndividualDetails || enviroGovtOfficerDetails || enviroFPODetails;

  useEffect(() => {
    if (currentDetails) {
      setSelectedUserType({
        label: currentDetails.typeOfProfile,
        value: currentDetails.typeOfProfile,
      });
      setSelectedSector({
        label: currentDetails.segment,
        value: currentDetails.segment,
      });
    }
  }, [currentDetails]);

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

  const individualTypeOptions = Array.isArray(enviroprofile)
    ? enviroprofile.map((item) => ({
      label: item,
      value: item,
    }))
    : [];

  const isEditMode = Boolean(id);

  const formInitialValues =
    isEditMode && currentDetails
      ? { ...initialValues, ...currentDetails }
      : initialValues;

  const formik = useFormik({
    initialValues: formInitialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);

      const farmerFields = [
        "firstName", "lastName", "leadOwner", "productName", "totalLandOwned",
        "email", "contact", "villageName", "state", "district", "address",
        "pinCode", "leadGeneratedThrough", "lastMeeting", "nextMeeting",
        "status", "panNo", "sprayingType", "tentativeBuyingDate", "cropType",
        "cropName", "sprayingDuration", "customerType", "department", "taluka",
        "purposeForBuying", "paymentMode", "existingLoan", "bankName", "salesId", "edit"
      ];

      const govOfficerFields = [
        "firstName", "lastName", "email", "contact", "birthday", "anniversary",
        "hobbies", "goals", "officeName", "designation", "districtBlockRegion",
        "yearsOfExperience", "frequentlyRequestedServices", "frequentlyRequestedServicesOthers",
        "schemeUnderstanding", "effectiveLanguage", "dataMaintainedDigitally",
        "dataManagementTools", "dataManagementToolsOthers",
        "salesId", "addedBy", "addedById", "hrmCompanyId", "edit"
      ];

      const fpoFields = [
        "fpoName", "registrationNumber",
        "registrationAct", "yearOfEstablishment", "operationalArea", "officeAddress",
        "officialContactNumber", "officialEmailId", "websiteAppUrl", "numberOfBoardMembers",
        "numberOfStaffMembers", "totalActiveMembers", "memberCategories", "memberCategoriesOthers",
        "primaryCommunicationChannels", "majorCropsHandled", "annualTurnover",
        "majorRevenueSources", "majorRevenueSourcesOthers", "keyBuyerTypes", "topChallenges", "topPriorities",
        "salesId", "addedBy", "addedById", "hrmCompanyId", "edit"
      ];

      let filteredValues = {};
      const profileType = selectedUserType?.value;

      let targetFields = [];
      if (profileType === "Farmer") targetFields = farmerFields;
      else if (profileType === "Government Officer") targetFields = govOfficerFields;
      else if (profileType === "FPO") targetFields = fpoFields;

      targetFields.forEach(field => {
        if (values[field] !== undefined) {
          filteredValues[field] = values[field];
        }
      });

      if (!isEditMode) {
        filteredValues.segment = selectedSector?.value;
        filteredValues.typeOfProfile = profileType;
      }

      try {
        let success = false;
        if (id) {
          if (profileType === "Farmer") {
            await updateEnviroIndividual(id, filteredValues);
            success = true;
          } else if (profileType === "Government Officer") {
            success = await updateEnviroGovtOfficer(id, filteredValues);
          } else if (profileType === "FPO") {
            success = await updateEnviroFPO(id, filteredValues);
          }
        } else {
          if (profileType === "Farmer") {
            await createEnviroIndividual(filteredValues);
            success = true;
          } else if (profileType === "Government Officer") {
            success = await createEnviroGovtOfficer(filteredValues);
          } else if (profileType === "FPO") {
            success = await createEnviroFPO(filteredValues);
          }
        }

        if (success) {
          resetEnviroIndividualDetails();
          resetEnviroGovtOfficerDetails();
          resetEnviroFPODetails();
          navigate("/sales-executive/database");
        }
      } catch (error) {
        console.error("Form submission error:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (isEditMode && !currentDetails) {
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
          { text: id ? `Edit Individual` : "Add New Individual" }
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
                formik.setFieldValue("segment", selected?.value || "");
              }}
              placeholder="Select Segment"
              isClearable
              isDisabled={!!id}
            />

            <ReactSelect
              isLoading={dropdownLoading}
              options={individualTypeOptions}
              value={selectedUserType}
              onChange={(selected) => {
                setSelectedUserType(selected);
                formik.setFieldValue("typeOfProfile", selected?.value || "");
              }}
              placeholder={
                !selectedSector
                  ? "Select Segment first"
                  : dropdownLoading
                    ? "Loading individual types..."
                    : "Select Individual Type"
              }
              isClearable
              isDisabled={!selectedSector || !!id}
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
