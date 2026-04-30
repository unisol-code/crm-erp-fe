import React, { useEffect } from 'react';
import useDropdown from '../../../../../../hooks/dropdown/useDropdown';

const EdcationalBg = ({ formik }) => {
   const {fetchProfessionalAssociations,professionalAssociations}=useDropdown();

   useEffect(()=>{
    fetchProfessionalAssociations()      
   },[])

   console.log(professionalAssociations)

  return (
    <div className="w-full p-6 bg-white rounded-md shadow-md">
      <h2 className="pb-2 mb-6 text-lg font-semibold text-gray-800 border-b">
        EDUCATIONAL & PROFESSIONAL BACKGROUND
      </h2>

      {/* <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2"> */}
      {/* Medical School */}
      <div className="flex flex-col">
        <label
          htmlFor="medicalSchool"
          className="mb-1 text-sm font-medium text-gray-700 "
        >
          Medical School
        </label>
        <input
          type="text"
          id="medicalSchool"
          placeholder="Enter Medical School Name"
          className="px-2 py-3 border border-gray-500 rounded-xl"
          value={formik.values.medicalSchool}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.medicalSchool && formik.errors.medicalSchool ? (
          <div className="text-red-500">{formik.errors.medicalSchool}</div>
        ) : null}
      </div>

      {/* Graduation Year */}
      <div className="flex flex-col">
        <label
          htmlFor="graduationYear"
          className="mb-1 text-sm font-medium text-gray-700"
        >
          Graduation Year
        </label>
        <input
          type="date"
          id="graduationYear"
          className="px-2 py-3 border border-gray-500 rounded-xl"
          value={formik.values.graduationYear ? `${formik.values.graduationYear}-01-01` : ''}
          onChange={(e) => {
            const year = new Date(e.target.value).getFullYear();
            formik.setFieldValue('graduationYear', year);
          }}
          onBlur={formik.handleBlur}
        />
        {formik.touched.graduationYear && formik.errors.graduationYear ? (
          <div className="text-red-500">{formik.errors.graduationYear}</div>
        ) : null}
      </div>

      {/* Post Graduation Year */}
      <div className="flex flex-col">
        <label
          htmlFor="postGraduationYear"
          className="mb-1 text-sm font-medium text-gray-700"
        >
          Post Graduation Year
        </label>
        <input
          type="date"
          id="postGraduationYear"
          className="px-2 py-3 border border-gray-500 rounded-xl"
          value={formik.values.postGraduationYear ? `${formik.values.postGraduationYear}-01-01` : ''}
          onChange={(e) => {
            const year = new Date(e.target.value).getFullYear();
            formik.setFieldValue('postGraduationYear', year);
          }}
          onBlur={formik.handleBlur}
        />
        {formik.touched.postGraduationYear && formik.errors.postGraduationYear ? (
          <div className="text-red-500">{formik.errors.postGraduationYear}</div>
        ) : null}
      </div>


      {/* Professional Associations/Memberships */}
      <div className="flex flex-col">
        <label
          htmlFor="professionalAssociationsMemberships"
          className="mb-1 text-sm font-medium text-gray-700"
        >
          Professional Associations/Memberships
        </label>
        <select
          id="professionalAssociationsMemberships"
          className="px-2 py-3 border border-gray-500 rounded-xl"
          value={formik.values.professionalAssociationsMemberships}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <option value="">Select</option>
          { 
              professionalAssociations?.map((item,index)=>{
                return <option value={item}>{item}</option>
              })                
              } 
        </select>
        {formik.touched.professionalAssociationsMemberships && formik.errors.professionalAssociationsMemberships ? (
          <div className="text-red-500">{formik.errors.professionalAssociationsMemberships}</div>
        ) : null}
      </div>

      {/* Continuing Education & Training */}
      <div className="flex flex-col">
        <label
          htmlFor="continuingEducationAndTraining"
          className="mb-1 text-sm font-medium text-gray-700"
        >
          Continuing Education & Training
        </label>
        <input
          type="text"
          id="continuingEducationAndTraining"
          placeholder="Enter Continuing Education & Training"
          className="px-2 py-3 border border-gray-500 rounded-xl"
          value={formik.values.continuingEducationAndTraining}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.continuingEducationAndTraining && formik.errors.continuingEducationAndTraining ? (
          <div className="text-red-500">{formik.errors.continuingEducationAndTraining}</div>
        ) : null}
      </div>
      {/* </form> */}
    </div>
  );
};

export default EdcationalBg;
