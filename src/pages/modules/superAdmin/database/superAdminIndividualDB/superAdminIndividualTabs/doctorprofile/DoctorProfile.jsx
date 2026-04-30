// DoctorProfile.js
import React, { useState } from "react";
import Select from "react-select";
import { Formik, Form } from "formik";
import Physician from "../tabs/Physician";
import NonClinical from "../tabs/NonClinical"
import Surgon from "../tabs/Surgon"

const DoctorProfile = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const options = [
    { value: "Physician", label: "Physician" },
    { value: "Surgeon", label: "Surgeon" },
    { value: "NonClinical", label: "Non Clinical" },
  ];

  const renderDoctorProfile = () => {
    switch (selectedDoctor?.value) {
      case "Physician":
        return <Physician/>;
      case "Surgeon":
        return <Surgon/>;
      case "NonClinical":
        return <NonClinical />;
        
      default:
        return null;
    }
  };

  return (
    <Formik
      initialValues={{ name: "", designation: "" }}
      onSubmit={(values) => {
        console.log("Form Values:", values);
      }}
    >
      {() => (
        <Form>
          {/* Doctor type dropdown */}
          <div style={{ marginBottom: "20px" }}>
            <Select
              options={options}
              value={selectedDoctor}
              onChange={(selected) => setSelectedDoctor(selected)}
              placeholder="Select Doctor"
              isClearable
            />
          </div>

          {/* Render form based on doctor type */}
          <div className="mt-6">{renderDoctorProfile()}</div>

          {/* Submit Button */}
          <button type="submit" style={{ marginTop: "20px" }}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default DoctorProfile;
