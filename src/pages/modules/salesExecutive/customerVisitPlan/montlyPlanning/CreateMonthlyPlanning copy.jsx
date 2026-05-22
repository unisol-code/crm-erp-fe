import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

import Button from "../../../../../components/uiComponents/button/Button";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb";

import PlanningInfo from "./MonthlyPlanningTabs/PlanningInfo";
import DiscussionPoints from "./MonthlyPlanningTabs/DiscussionPoints";
import NextMeeting from "./MonthlyPlanningTabs/NextMeeting";
import { useTheme } from "../../../../../hooks/theme/useTheme";

import { toast } from "react-toastify";
import useMonthlyPlanning from "../../../../../hooks/salesExecutiveHook/customerVisitPlan/useMonthlyPlanning";
import { getIn } from "formik";

import { monthlyPlanningPreviewAtom } from "../../../../../state/mothlyPlanningState/monthlyPlanningState";
import { useSetRecoilState, useRecoilValue, useResetRecoilState } from "recoil";

const tabs = ["Planning Info", "Discussion Points", "Next Meeting"];

const tabKeysMapping = {
  0: [
    "createPlanningForDate",
    "visit",
    "nameOfDoctor",
    "speciality",
    "selectOrganization",
    "productToBePromoted",
    "expectedCallDuration",
    "meetingTime",
    "anniversaryDate",
    "birthdayDate",
    "callPurpose",
    "callObjective",
    "durationOfMeeting",
    "visitingTime",
    "visitingPlace",
    "hospitalOPD"
  ],
  1: [
    "callObjectiveStatus",
    "productFeatureBenefitExplained.status",
    "productFeatureBenefitExplained.text",
    "isProductDryDemoDone",
    "isProductLiveDemoAttended",
    "doctorQuestion.status",
    "doctorQuestion.text",
    "concern.status",
    "concern.text",
    "addressedSatisfiedWantToBuy.text",
    "addressedSatisfiedWantToBuy.status",
  ],
  2: [
    "nextMeetingDate",
    "nextMeetingTime",
    "nextCallObjective",
    "nextCallDuration",
    "requiredSupport",
    "comments",
    "salesExpectedDate",
    "salesValueExpected",
    "productName",
    "salesStatus",
    "leadGeneratedThrough"
  ]
};

const CreateMonthlyPlanning = () => {
  const setMonthlyPlanningPreview = useSetRecoilState(monthlyPlanningPreviewAtom);
  const [currentTab, setCurrentTab] = useState(0);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { createMonthlyPlanning, loading } = useMonthlyPlanning();
  const previewData = useRecoilValue(monthlyPlanningPreviewAtom);
  const resetMonthlyPlanningPreview = useResetRecoilState(monthlyPlanningPreviewAtom);

  const validationSchema = Yup.object({
    // Tab 0: Planning Info
    createPlanningForDate: Yup.date().nullable().required("Date is required"),
    visit: Yup.string().required("Visit is required"),
    nameOfDoctor: Yup.string().required("Doctor name is required"),
    speciality: Yup.string().required("Specialty is required"),
    selectOrganization: Yup.string().required("Organization is required"),
    productToBePromoted: Yup.string().required("Product is required"),
    expectedCallDuration: Yup.string(),
    meetingTime: Yup.string(),
    anniversaryDate: Yup.date().nullable(),
    birthdayDate: Yup.date().nullable(),
    callPurpose: Yup.string(),
    callObjective: Yup.string(),
    durationOfMeeting: Yup.string(),
    visitingTime: Yup.string(),
    visitingPlace: Yup.string(),
    hospitalOPD: Yup.string(),

    // Tab 1: Discussion Points
    callObjectiveStatus: Yup.string(),
    productFeatureBenefitExplained: Yup.object({
      status: Yup.string(),
      text: Yup.string().when("status", {
        is: "yes",
        then: (schema) => schema.required("Please explain the product feature benefit"),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),
    isProductDryDemoDone: Yup.string(),
    isProductLiveDemoAttended: Yup.string(),
    doctorQuestion: Yup.object({
      status: Yup.string(),
      text: Yup.string().when("status", {
        is: "yes",
        then: (schema) => schema.required("Please explain the doctor question"),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),
    concern: Yup.object({
      status: Yup.string(),
      text: Yup.string().when("status", {
        is: "yes",
        then: (schema) => schema.required("Concern details are required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),
    addressedSatisfiedWantToBuy: Yup.object({
      status: Yup.string(),
      text: Yup.string().when("status", {
        is: "yes",
        then: (schema) => schema.required("Please explain the satisfaction or interest"),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),


    // Tab 2: Next Meeting
    nextMeetingDate: Yup.date()
      .nullable()
      .test("is-future", "Meeting date must be in the future", (value) => {
        if (!value) return true;
        return value > new Date();
      }),

    nextMeetingTime: Yup.string(),
    nextCallObjective: Yup.string(),
    nextCallObjectiveStatus: Yup.string(),
    nextCallDuration: Yup.string(),
    requiredSupport: Yup.string(),
    comments: Yup.string(),
    salesExpectedDate: Yup.date().nullable().test("is-future", "Sales expected date must be in the future", (value) => {
      if (!value) return true;
      return value > new Date();
    }),
    salesValueExpected: Yup.string(),
    productName: Yup.string(),
    salesStatus: Yup.string(),
    leadGeneratedThrough: Yup.string()
  });

  const formik = useFormik({
    initialValues: (previewData && Object.keys(previewData).length > 0)
      ? previewData
      : {
        // Your default initial values here
        createPlanningForDate: null,
        visit: "",
        nameOfDoctor: "",
        speciality: "",
        selectOrganization: "",
        productToBePromoted: "",
        expectedCallDuration: "",
        meetingTime: "",
        anniversaryDate: null,
        birthdayDate: null,
        callPurpose: "",
        callObjective: "",
        durationOfMeeting: "",
        visitingTime: "",
        visitingPlace: "",
        hospitalOPD: "",
        callObjectiveStatus: "",
        productFeatureBenefitExplained: { status: "no", text: "" },
        isProductDryDemoDone: "no",
        isProductLiveDemoAttended: "no",
        doctorQuestion: { status: "no", text: "" },
        concern: { status: "no", text: "" },
        addressedSatisfiedWantToBuy: { status: "no", text: "" },
        nextMeetingDate: null,
        nextMeetingTime: "",
        nextCallObjective: "",
        nextCallObjectiveStatus: "",
        nextCallDuration: "",
        requiredSupport: "",
        comments: "",
        salesExpectedDate: null,
        salesValueExpected: "",
        productName: "",
        salesStatus: "",
        leadGeneratedThrough: ""
      },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const res = await createMonthlyPlanning(values);
        if (res?.success) {
          formik.resetForm();
          navigate("/sales-executive/monthly-planning");
        }
      } catch (error) {
        console.error("Error while creating monthly report:", error);
      }
    },
  });

  const handleNext = async () => {
    const currentTabFields = tabKeysMapping[currentTab];
    const nestedParents = [
      "doctorQuestion",
      "concern",
      "productFeatureBenefitExplained",
      "addressedSatisfiedWantToBuy"
    ];

    const newTouched = { ...formik.touched };

    currentTabFields.forEach((field) => {
      const isNestedField = nestedParents.some((parent) => field.startsWith(`${parent}.`));

      if (isNestedField) {
        const [parent, key] = field.split(".");
        if (!newTouched[parent]) {
          newTouched[parent] = {};
        }
        newTouched[parent][key] = true;
      } else {
        newTouched[field] = true;
      }
    });

    await formik.setTouched(newTouched);

    const errors = await formik.validateForm();

    const fixedErrors = { ...errors };
    nestedParents.forEach((parent) => {
      if (errors[`${parent}.text`]) {
        fixedErrors[parent] = {
          ...fixedErrors[parent],
          text: errors[`${parent}.text`],
        };
        delete fixedErrors[`${parent}.text`];
      }
      if (errors[`${parent}.status`]) {
        fixedErrors[parent] = {
          ...fixedErrors[parent],
          status: errors[`${parent}.status`],
        };
        delete fixedErrors[`${parent}.status`];
      }
    });

    const hasErrorInTab = currentTabFields.some((field) => getIn(fixedErrors, field));

    if (hasErrorInTab) {
      formik.setErrors(fixedErrors);
      toast.error("Please fill all required fields in this tab");
      return;
    }

    if (currentTab < tabs.length - 1) {
      setCurrentTab((prev) => prev + 1);
    } else {
      const allErrors = await formik.validateForm();
      const hasAnyError = Object.keys(allErrors).length > 0;

      if (hasAnyError) {
        formik.setTouched(
          Object.keys(formik.initialValues).reduce((acc, key) => {
            if (typeof formik.initialValues[key] === "object" && formik.initialValues[key] !== null) {
              acc[key] = {};
              for (let subKey in formik.initialValues[key]) {
                acc[key][subKey] = true;
              }
            } else {
              acc[key] = true;
            }
            return acc;
          }, {})
        );
        formik.setErrors(allErrors);
        toast.error("Required fields are missing. Please check all tabs.");
        return;
      }
      resetMonthlyPlanningPreview();
      await formik.submitForm();
    }

  };

  const handleBack = () => {
    if (currentTab > 0) setCurrentTab(currentTab - 1);
  };
  console.log(formik.values, formik.errors)
  return (
    <div className="w-full min-h-screen" >
      <BreadCrumb
        linkText={[
          { text: "Customer Visit Plan" },
          { text: "Monthly Planning", href: "/sales-executive/monthly-planning" },
          { text: "Create Monthly Planning" }
        ]}
      />

      <div
        className="mb-0 text-center p-[30px] rounded-tl-[10px] rounded-tr-[10px]"
        style={{ backgroundColor: theme.secondaryColor }}
      >
        <h2 className="mb-1 text-lg font-bold">Create Monthly Planning</h2>
      </div>

      <div className="flex justify-between px-4 py-2 bg-white border-b border-gray-300">
        {tabs.map((label, index) => (
          <button
            key={label}
            type="button"
            onClick={() => setCurrentTab(index)}
            className={`px-4 py-2 font-semibold border-b-2 transition-all duration-300 capitalize ${currentTab === index
              ? "border-[#355DC4] text-[#355DC4]"
              : "border-transparent text-gray-500 hover:text-[#355DC4]"
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      <form>
        {currentTab === 0 && <PlanningInfo formik={formik} />}
        {currentTab === 1 && <DiscussionPoints formik={formik} />}
        {currentTab === 2 && <NextMeeting formik={formik} />}

        <div className="flex justify-center gap-4 mt-6 mb-6">
          {currentTab > 0 && (
            <Button
              text="Back"
              type="button"
              onClick={handleBack}
              className="text-black bg-gray-300 hover:bg-gray-400"
            />
          )}

          <Button
            text="Cancel"
            type="button"
            onClick={() => navigate("/sales-executive/monthly-planning")}
            className="text-black bg-gray-300 hover:bg-gray-400"
          />

          {currentTab === tabs.length - 1 && (
            <Button
              text="Preview"
              type="button"
              onClick={() => {
                setMonthlyPlanningPreview(formik.values);
                navigate("/sales-executive/monthly-planning/create-monthly-plan/view-createmonthlyplanning");
              }}
              className="text-white bg-yellow-500 hover:bg-yellow-600"
            />
          )}

          <Button
            variant={1}
            type="button"
            text={currentTab === tabs.length - 1 ? loading ? "Submitting..." : "Submit" : "Save & Proceed"}
            onClick={handleNext}
          />
        </div>
      </form>
    </div>
  );
};

export default CreateMonthlyPlanning;