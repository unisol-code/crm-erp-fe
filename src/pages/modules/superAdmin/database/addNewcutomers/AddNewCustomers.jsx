
import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import OrganizationDetails from "./OrganizationDetails";
import AddHod from "./AddHod";
import Others from "./Others";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb";
import Button from "../../../../../components/uiComponents/button/Button";
import { useTheme } from "../../../../../hooks/theme/useTheme";

const AddNewCustomers = () => {
  const [customer, setCustomer] = useState("organization");
  const { theme } = useTheme();

  const initialValues = {
    //  Organization fields
    orgName1: "",
    orgName2: "",
    address1: "",
    address2: "",
    region1: "",
    region2: "",
    state1: "",
    state2: "",
    district1: "",
    district2: "",
    pincode1: "",
    pincode2: "",
    totalBeds1: "",
    totalBeds2: "",
    totalIcu1: "",
    totalIcu2: "",
    quotationDesignation: "",
    salesPerson: "",

    //  HOD fields
    hodName: "",
    hodDepartment: "",
    misCount: "",
    contactNo: "",
    alternateNo: "",
    birthDate: "",
    surgeryType: "",
    speciality: "",
    hobbies: "",
    comments: "",
    preferredMeetingDay: "",
    preferredMeetingTime: "",
    hodAddress: "",
    landmark: "",
    pinCode: "",
    believe: [],

    //  Others fields
    name: "",
    designation: "",
    department: "",
    email: "",
    personalEmail: "",
    anniversaryDate: "",
    surgery: "",
    meetingDay: "",
    meetingTime: "",
    address: "",
    pincode: "",
  };

  const validationSchema = Yup.object({
    orgName1: Yup.string().required("Organization Name 1 is required"),
    hodName: Yup.string().required("HOD Name is required"),
    name: Yup.string().required("Other Name is required"),
  });

  const handleSubmit = (values) => {
    console.log(" Final Submitted Values:", values);
    alert("Form Submitted! Check console for details.");
  };

  const renderComponent = () => {
    switch (customer) {
      case "organization":
        return <OrganizationDetails />;
      case "hod":
        return <AddHod />;
      case "others":
        return <Others />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen p-4">
      <BreadCrumb linkText={[{ text: "Database" }, { text: "Add New Customers" }]} />
      <div className="mb-0 p-[30px] rounded-tl-[10px] rounded-tr-[10px]" style={{ backgroundColor: theme.secondaryColor }}>
        <h2 className="mb-1 text-lg font-semibold text-center">Add New Customers</h2>
      </div>

      <div className="flex justify-between p-4 mb-0 bg-white rounded shadow">
        {["organization", "hod", "others"].map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setCustomer(key)}
            className={`px-4 py-2 font-semibold border-b-2 ${customer === key
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-blue-600 hover:border-blue-300"
              }`}
          >
            {key === "organization"
              ? "Organization Details"
              : key === "hod"
                ? "Add HOD"
                : "Others"}
          </button>
        ))}
      </div>

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        <Form className="p-6 mb-0 bg-white rounded shadow-md">
          {renderComponent()}

          <div className="flex items-center justify-center gap-4 mt-4">
            <Button variant={3} text="Discard" type="button" onClick={() => window.location.reload()} />
            <Button text="Save" type="submit" />
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default AddNewCustomers;
