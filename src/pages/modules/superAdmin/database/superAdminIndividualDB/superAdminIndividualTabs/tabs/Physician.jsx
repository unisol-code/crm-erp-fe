import React from "react";
import Input from "../Input";
import Select from "../select";

const Physician = ({ formik }) => {
  return (
    <div className="bg-white rounded-md">
      <h1 className="text-xl font-semibold mb-6">PHYSICIAN INFORMATION</h1>

      {/* First Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Name Of Person" placeholder="Enter Name Of Person" name="name" formik={formik} />
        <Select
          label="Designation"
          name="designation"
          formik={formik}
          options={[
            "CEO", "VP", "Purchase Manager", "HOD",
            "Associated Professor", "Professor", "Manager",
          ]}
        />
        <Select
          label="Speciality"
          name="speciality"
          formik={formik}
          options={["GS", "EVT", "GYN", "Biomedical"]}
        />
        <Input label="Contact No" placeholder="Enter Contact No." name="contact" formik={formik} />
        <Input label="Alternate Contact No" placeholder="Enter Alternate Contact No." name="alternateContact" formik={formik} />
        <Input label="Official Email" placeholder="Enter Official Email" name="officialEmail" type="email" formik={formik} />
        <Input label="Personal Email" placeholder="Enter Personal Email" name="personalEmail" type="email" formik={formik} />
        <Input label="Hobbies" placeholder="Enter Hobbies" name="hobbies" formik={formik} />
        <Input placeholder="Enter Residence Address" label="Residence Address" name="residence" formik={formik} />
        <Input placeholder="Enter City/Town/Village" label="City/Town/Village" name="city" formik={formik} />
        <Input placeholder="Enter District" label="District" name="district" formik={formik} />
        <Input placeholder="Enter State" label="State" name="state" formik={formik} />
        <Input placeholder="Enter Pin Code" label="Pin Code" name="pincode" formik={formik} />
        <Input placeholder="Enter Landmark" label="Landmark" name="landmark" formik={formik} />

        <Select label="Category" name="category" formik={formik} options={["A", "B", "C", "D"]} />
        <Select
          label="Type of Profile"
          name="profileType"
          formik={formik}
          options={["Doctor", "Supporter", "Controller"]}
        />
        <Input
          label="Total No of Patients Examined per Day"
          placeholder="Enter Total No of Patients Examined"
          name="patientsExamined"
          type="number"
          formik={formik}
        />
        <Input
          label="Total No of Patients Admission per Day"
          placeholder="Enter Total No of Patients Admission"
          name="patientsAdmission"
          type="number"
          formik={formik}
        />
        <Input placeholder="Enter Academic Interest" label="Academic Interest" name="academicInterest" formik={formik} />
        <Input placeholder="Enter Graduation" label="Graduation" name="graduation" formik={formik} />
        <Input placeholder="Enter Post Graduation" label="Post Graduation" name="postGraduation" formik={formik} />
        <Select
          label="Hobbies"
          name="hobbiesSelect"
          formik={formik}
          options={["Reading", "Driving", "Playing Music Instrument", "Others"]}
        />
        <Input placeholder="Enter Relationship Status" label="Relationship Status" name="relationshipStatus" formik={formik} />
        <Input placeholder="Enter Spouse Name" label="Spouse Name" name="spouseName" type="text" formik={formik} />
        <Input label="DOB" name="dob" type="date" formik={formik} />
        <Input label="Wedding Anniversary" name="weddingAnniversary" type="date" formik={formik} />
        <Select
          label="Hospital Associated With"
          name="hospital"
          formik={formik}
          options={["Hospital 1", "Hospital 2", "Hospital 3", "Others"]}
        />
        <Input placeholder="Enter OPD Days" label="OPD Days" name="opdDays" formik={formik} />
      </div>
    </div>
  );
};

export default Physician;
