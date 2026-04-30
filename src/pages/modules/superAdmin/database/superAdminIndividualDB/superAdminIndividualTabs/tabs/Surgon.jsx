import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Input from "../Input";
import Select from "../select";
const Surgon = ({ formik }) => {

  return (
    <div className="">
      <h1 className="text-xl font-semibold mb-6">SURGON INFORMATION</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
        <Input label="Name Of Person" name="name" placeholder="Enter name of person" formik={formik} />
        <Select
          label="Designation"
          name="designation"
          formik={formik}
          options={[
            "CEO",
            "VP",
            "Purchase Manager",
            "HOD",
            "Associated Professor",
            "Professor",
            "Manager",
          ]}
        />
        <Select label="Speciality" name="speciality" formik={formik} options={["GS", "EVT", "GYN", "Biomedical"]} />
        <Input label="Contact No" name="contact" placeholder="Enter contact number" formik={formik} />

        <Input label="Alternate Contact No" name="alternateContact" placeholder="Enter alternate contact number" formik={formik} />
        <Input label="Official E-mail" name="officialEmail" type="email" placeholder="Enter official email" formik={formik} />
        <Input label="Personal E-mail" name="personalEmail" type="email" placeholder="Enter personal email" formik={formik} />
        <Input label="Hobbies" name="hobbies" placeholder="Enter hobbies" formik={formik} />

        <Input label="Residence Address" name="residence" placeholder="Enter residence address" formik={formik} />
        <Input label="City/Town/Village" name="city" placeholder="Enter city/town/village" formik={formik} />
        <Input label="District" name="district" placeholder="Enter district" formik={formik} />
        <Input label="State" name="state" placeholder="Enter state" formik={formik} />
        <Input label="Pin Code" name="pincode" placeholder="Enter pin code" formik={formik} />
        <Input label="Landmark" name="landmark" placeholder="Enter landmark" formik={formik} />
        <Select label="Category" name="category" formik={formik} options={["A", "B", "C", "D"]} />

        <Input label="Academic Interest" name="academicInterest" placeholder="Enter academic interest" formik={formik} />
        <Input label="Graduation" name="graduation" placeholder="Enter graduation details" formik={formik} />
        <Input label="Post Graduation" name="postGraduation" placeholder="Enter post graduation details" formik={formik} />
        <Select
          label="Hobbies"
          name="hobbiesSelect"
          formik={formik}
          options={["Reading", "Driving", "Playing Music Instrument", "Others"]}
        />

        <Input label="Relationship Status" name="relationshipStatus" placeholder="Enter relationship status" formik={formik} />
        <Input label="Spouse Name" name="spouseName" placeholder="Enter spouse name" formik={formik} />
        <Input label="DOB" name="dob" type="date" placeholder="Select date of birth" formik={formik} />
        <Input label="Wedding Anniversary" name="weddingAnniversary" type="date" placeholder="Select wedding anniversary" formik={formik} />
        <Select
          label="Type Of Surgery Performed"
          name="typeOfSurgery"
          formik={formik}
          options={[
            { value: "Robotic", label: "Robotic" },
            { value: "Laparoscopic", label: "Laparoscopic" },
            { value: "Open", label: "Open - Give space to add nos" },
          ]}
        />
        <Input label="Surgery Days" name="surgery" type="date" placeholder="Select surgery day" formik={formik} />
        <Select
          label="Hospital Associated With"
          name="hospital"
          formik={formik}
          options={["Hospital 1", "Hospital 2", "Hospital 3", "Others"]}
        />
      </div>
    </div>
  );
};

export default Surgon;
