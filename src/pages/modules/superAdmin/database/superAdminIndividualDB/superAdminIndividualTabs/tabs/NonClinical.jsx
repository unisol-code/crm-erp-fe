import React from "react";
import { useFormikContext } from "formik";
import Input from "../Input";
import Select from "../select";

const NonClinical = () => {
  const formik = useFormikContext();

  return (
    <div className="">
      <h1 className="text-xl font-semibold mb-6">NON-CLINICAL INFORMATION</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        <Input label="Name Of Person" name="name" formik={formik} placeholder="Enter full name" />

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
          placeholder="Select designation"
        />

        <Select
          label="Speciality"
          name="speciality"
          formik={formik}
          options={["GS", "EVT", "GYN", "Biomedical"]}
          placeholder="Select speciality"
        />

        <Input label="Contact No" name="contact" formik={formik} placeholder="Enter contact number" />

        <Input label="Alternate Contact No" name="alternateContact" formik={formik} placeholder="Enter alternate contact" />

        <Input label="Official E-mail" name="officialEmail" formik={formik} type="email" placeholder="Enter official email" />

        <Input label="Personal E-mail" name="personalEmail" formik={formik} type="email" placeholder="Enter personal email" />

        <Input label="Hobbies" name="hobbies" formik={formik} placeholder="Enter hobbies" />

        <Input label="Residence Address" name="residence" formik={formik} placeholder="Enter residence address" />

        <Input label="City/Town/Village" name="city" formik={formik} placeholder="Enter city, town or village" />

        <Input label="District" name="district" formik={formik} placeholder="Enter district" />

        <Input label="State" name="state" formik={formik} placeholder="Enter state" />

        <Input label="Pin Code" name="pincode" formik={formik} placeholder="Enter pin code" />

        <Input label="Landmark" name="landmark" formik={formik} placeholder="Enter landmark" />

        <Select
          label="Category"
          name="category"
          formik={formik}
          options={["A", "B", "C", "D"]}
          placeholder="Select category"
        />

        <Input label="Academic Interest" name="academicInterest" formik={formik} placeholder="Enter academic interest" />

        <Input label="Graduation" name="graduation" formik={formik} placeholder="Enter graduation details" />

        <Input label="Post Graduation" name="postGraduation" formik={formik} placeholder="Enter post graduation details" />

        <Select
          label="Hobbies"
          name="hobbiesSelect"
          formik={formik}
          options={[
            { label: "Reading", value: "reading" },
            { label: "Driving", value: "driving" },
            { label: "Playing Music Instrument", value: "music" },
            { label: "Others", value: "others" },
          ]}
          placeholder="Select hobby"
        />

        <Input label="Relationship Status" name="relationshipStatus" formik={formik} placeholder="Enter relationship status" />

        <Input label="Spouse Name" name="spouseName" formik={formik} placeholder="Enter spouse name" />

        <Input label="DOB" name="dob" formik={formik} type="date" placeholder="Select date of birth" />

        <Input label="Wedding Anniversary" name="weddingAnniversary" formik={formik} type="date" placeholder="Select wedding anniversary" />

        <Select
          label="Type Of Surgery Performed"
          name="typeOfSurgery"
          formik={formik}
          options={[
            { label: "Robotic", value: "robotic" },
            { label: "Laparoscopic", value: "laparoscopic" },
            { label: "Open - Give space to add nos", value: "open" },
          ]}
          placeholder="Select type of surgery"
        />

        <Input label="Surgery days" name="surgeryDays" formik={formik} type="date" placeholder="Select surgery day(s)" />

        <Select
          label="Hospital Associated With"
          name="hospital"
          formik={formik}
          options={[
            { label: "Hospital 1", value: "hospital1" },
            { label: "Hospital 2", value: "hospital2" },
            { label: "Hospital 3", value: "hospital3" },
            { label: "Others", value: "others" },
          ]}
          placeholder="Select hospital"
        />
      </div>

    </div>
  );
};

export default NonClinical;
