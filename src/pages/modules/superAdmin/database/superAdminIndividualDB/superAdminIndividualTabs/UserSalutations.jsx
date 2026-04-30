import React, { useEffect } from 'react';
import useDropdown from '../../../../../../hooks/dropdown/useDropdown';

const UserSalutations = ({ formik }) => {
  const {
    fetchProductsNames,
    productList
  } = useDropdown()

  useEffect(() => {
    fetchProductsNames()
  }, [])

  console.log(productList)

  return (
    <>
      <div className="flex flex-col items-center justify-around w-full space-y-4">
        <div className="flex w-full gap-4">
          <h1 className="text-xl font-bold">If The Individual Is Not DR</h1>
        </div>

        <div className="flex w-full gap-4">
          <div className="flex flex-col w-1/2">
            <label className="mb-1 text-sm font-medium text-gray-700">Profile</label>
            <input
              id="profile"
              type="text"
              placeholder="Enter profile"
              className="px-2 py-3 border border-gray-500 rounded-xl"
              value={formik.values.profile}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {
              formik.touched.profile && formik.errors.profile ? (
                <div className="text-red-500">{formik.errors.profile}</div>
              ) : null
            }
          </div>
          <div className="flex flex-col w-1/2">
            <label className="mb-1 text-sm font-medium text-gray-700">If Profile Others</label>
            <input
              id='ifProfileOthers'
              type="text"
              placeholder="Enter other profile"
              className="px-2 py-3 border border-gray-500 rounded-xl"
              value={formik.values.ifProfileOthers}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />{
              formik.touched.ifProfileOthers && formik.errors.ifProfileOthers ? (
                <div className="text-red-500">{formik.errors.ifProfileOthers}</div>
              ) : null
            }
          </div>
        </div>

        {formik.values.additionalQualifications?.map((qualification, index) => (
          <div key={index} className="flex w-full gap-4 mb-4">
            <div className="flex flex-col w-full">
              <label className="mb-1 text-sm font-medium text-gray-700">Additional Qualification {index + 1}</label>
              <input
                type="text"
                placeholder="Enter qualification"
                className="px-2 py-3 border border-gray-500 rounded-xl"
                name={`additionalQualifications[${index}]`}
                value={formik.values.additionalQualifications[index]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {
                formik.touched.additionalQualifications &&
                  formik.touched.additionalQualifications[index] &&
                  formik.errors.additionalQualifications &&
                  formik.errors.additionalQualifications[index] ? (
                  <div className="text-red-500">{formik.errors.additionalQualifications[index]}</div>
                ) : null
              }
            </div>
          </div>
        ))}

        {/* ✅ Add Another Button */}
        <div className="flex w-full gap-4">
          <button
            type="button"
            onClick={() =>
              formik.setFieldValue("additionalQualifications", [
                ...formik.values.additionalQualifications,
                ""
              ])
            }
            className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Add Another Qualification <span className="text-lg font-bold">+</span>
          </button>
        </div>


        <div className="flex w-full gap-4">
          <div className="flex flex-col w-1/2">
            <label className="mb-1 text-sm font-medium text-gray-700">Employee Status</label>
            <input
              id='employeeStatus'
              type="text"
              placeholder="Enter status"
              className="px-2 py-3 border border-gray-500 rounded-xl"
              value={formik.values.employeeStatus}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {
              formik.touched.employeeStatus && formik.errors.employeeStatus ? (
                <div className="text-red-500">{formik.errors.employeeStatus}</div>) : null
            }
          </div>
          <div className="flex flex-col w-1/2">
            <label className="mb-1 text-sm font-medium text-gray-700">Office Address</label>
            <input
              id='officeAddress'
              type="text"
              placeholder="Enter address"
              className="px-2 py-3 border border-gray-500 rounded-xl"
              value={formik.values.officeAddress}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.officeAddress && formik.errors.officeAddress ? (
              <div className="text-red-500">{formik.errors.officeAddress}</div>
            ) : null}
          </div>
        </div>

        <div className="flex w-full gap-4">
          <div className="flex flex-col flex-1">
            <label className="mb-1 text-sm font-medium text-gray-700">Landmark</label>
            <input
              id='landmark'
              type="text"
              placeholder="Enter landmark"
              className="px-2 py-3 border border-gray-500 rounded-xl"
              value={formik.values.landmark}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.landmark && formik.errors.landmark ? (
              <div className="text-red-500">{formik.errors.landmark}</div>) : null
            }
          </div>
          <div className="flex flex-col flex-1">
            <label className="mb-1 text-sm font-medium text-gray-700">Phone Number 1</label>
            <input
              id='phoneNumber1'
              type="text"
              placeholder="Enter phone number"
              className="px-2 py-3 border border-gray-500 rounded-xl"
              value={formik.values.phoneNumber1}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {
              formik.touched.phoneNumber1 && formik.errors.phoneNumber1 ? (
                <div className="text-red-500">{formik.errors.phoneNumber1}</div>
              ) : null
            }
          </div>
          <div className="flex flex-col flex-1">
            <label className="mb-1 text-sm font-medium text-gray-700">Phone Number 2</label>
            <input
              id='phoneNumber2'
              type="text"
              placeholder="Enter phone number"
              className="px-2 py-3 border border-gray-500 rounded-xl"
              value={formik.values.phoneNumber2}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {
              formik.touched.phoneNumber2 && formik.errors.phoneNumber2 ? (
                <div className="text-red-500">{formik.errors.phoneNumber2}</div>
              ) : null
            }
          </div>
        </div>

        <div className="flex w-full gap-4">
          <div className="flex flex-col w-1/2">
            <label className="mb-1 text-sm font-medium text-gray-700">No of Patients in a Year</label>
            <input
              id='noOfPatientsInYear'
              type="text"
              placeholder="Enter number"
              className="px-2 py-3 border border-gray-500 rounded-xl"
              value={formik.values.noOfPatientsInYear}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {
              formik.touched.noOfPatientsInYear && formik.errors.noOfPatientsInYear ? (
                <div className="text-red-500">{formik.errors.noOfPatientsInYear}</div>
              ) : null
            }
          </div>
          <div className="flex flex-col w-1/2">
            <label className="mb-1 text-sm font-medium text-gray-700">Type of Surgeries Performed</label>
            <input
              id='typeofSurgeriesPerformed'
              type="text"
              placeholder="Enter surgery types"
              className="px-2 py-3 border border-gray-500 rounded-xl"
              value={formik.values.typeofSurgeriesPerformed}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {
              formik.touched.typeOfSurgeriesPerformed && formik.errors.typeofSurgeriesPerformed ? (
                <div className="text-red-500">{formik.errors.typeofSurgeriesPerformed}</div>
              ) : null
            }
          </div>
        </div>

        <div className="flex w-full gap-4">
          <div className="flex flex-col w-1/2">
            <label className="mb-1 text-sm font-medium text-gray-700">Email Address 1</label>
            <input
              id='emailAddress1'
              type="email"
              placeholder="Enter email"
              className="px-2 py-3 border border-gray-500 "
              value={formik.values.emailAddress1}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {
              formik.touched.emailAddress1 && formik.errors.emailAddress1 ? (
                <div className="text-red-500">{formik.errors.emailAddress1}</div>
              ) : null
            }
          </div>
          <div className="flex flex-col w-1/2">
            <label className="mb-1 text-sm font-medium text-gray-700">Email Address 2</label>
            <input
              id='emailAddress2'
              type="email"
              placeholder="Enter email"
              className="px-2 py-3 border border-gray-500 rounded-xl"
              value={formik.values.emailAddress2}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {
              formik.touched.emailAddress2 && formik.errors.emailAddress2 ? (
                <div className="text-red-500">{formik.errors.emailAddress2}</div>
              ) : null
            }
          </div>
        </div>

        <div className="flex w-full gap-4">
          <div className="flex flex-col w-1/2">
            <label className="mb-1 text-sm font-medium text-gray-700">Website URL (Optional)</label>
            <input
              type="url"
              id='websiteURL'
              placeholder="Enter URL"
              className="px-2 py-3 border border-gray-500 rounded-xl"
              value={formik.values.websiteURL}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.websiteURL && formik.errors.websiteURL ? (
              <div className="text-red-500">{formik.errors.websiteURL}</div>
            ) : null}
          </div>
          <div className="flex flex-col w-1/2">
            <label className="mb-1 text-sm font-medium text-gray-700">LinkedIn URL (Optional)</label>
            <input
              id='linkedInURL'
              type="url"
              placeholder="Enter URL"
              className="px-2 py-3 border border-gray-500 rounded-xl"
              value={formik.values.linkedInURL}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {
              formik.touched.linkedInUrl && formik.errors.linkedInURL ? (
                <div className="text-red-500">{formik.errors.linkedInURL}</div>
              ) : null
            }
          </div>
        </div>

        <div className="flex w-full gap-4">
          <div className="flex flex-col w-1/2">
            <label className="mb-1 text-sm font-medium text-gray-700">Facebook URL (Optional)</label>
            <input
              id='facebookURL'
              type="url"
              placeholder="Enter URL"
              className="px-2 py-3 border border-gray-500 rounded-xl"
              value={formik.values.facebookURL}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {
              formik.touched.facebookURL && formik.errors.facebookURL ? (
                <div className="text-red-500">{formik.errors.facebookURL}</div>) : null
            }
          </div>
          <div className="flex flex-col w-1/2">
            <label className="mb-1 text-sm font-medium text-gray-700">Instagram URL (Optional)</label>
            <input
              id='instagramURL'
              type="url"
              placeholder="Enter URL"
              className="px-2 py-3 border border-gray-500 rounded-xl"
              value={formik.values.instagramURL}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.instagramURL && formik.errors.instagramURL ? (
              <div className="text-red-500">{formik.errors.instagramURL}</div>) : null
            }
          </div>
        </div>

        {formik.values.preferredContactSlots?.map((slot, index) => (
          <div key={index} className="flex w-full gap-4 mb-4">
            {/* Day input */}
            <div className="flex flex-col w-1/2">
              <label className="mb-1 text-sm font-medium text-gray-700">Preferred Day to Contact</label>
              <input
                type="date"
                name={`preferredContactSlots[${index}].day`}
                value={slot.day}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="px-2 py-3 border border-gray-500 rounded-xl"
              />
              {/* Error */}
              {
                formik.touched.preferredContactSlots?.[index]?.day &&
                formik.errors.preferredContactSlots?.[index]?.day && (
                  <div className="text-red-500">
                    {formik.errors.preferredContactSlots[index].day}
                  </div>
                )
              }
            </div>

            {/* Time input */}
            <div className="flex flex-col w-1/2">
              <label className="mb-1 text-sm font-medium text-gray-700">Preferred Time to Contact</label>
              <input
                type="time"
                name={`preferredContactSlots[${index}].time`}
                value={slot.time}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="px-2 py-3 border border-gray-500 rounded-xl"
              />
              {/* Error */}
              {
                formik.touched.preferredContactSlots?.[index]?.time &&
                formik.errors.preferredContactSlots?.[index]?.time && (
                  <div className="text-red-500">
                    {formik.errors.preferredContactSlots[index].time}
                  </div>
                )
              }
            </div>
          </div>
        ))}

        <div className="flex w-full gap-4">
          <div className="mt-6">
            <button
              type="button"
              onClick={() =>
                formik.setFieldValue("preferredContactSlots", [
                  ...formik.values.preferredContactSlots,
                  { day: '', time: '' }
                ])
              }
              className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Add Another Date & Time <span className="text-lg font-bold">+</span>
            </button>
          </div>
        </div>
        <div className="flex w-full gap-4">
          <div className="flex flex-col w-1/2">
            <label className="mb-1 text-sm font-medium text-gray-700">Hobbies</label>
            <select
              className="px-2 py-3 border border-gray-500 rounded-xl"
              id='hobbies'
              value={formik.values.hobbies}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option>Select Hobbies</option>
            </select>
            {
              formik.touched.hobbies && formik.errors.hobbies ? (
                <div className="text-red-500">{formik.errors.hobbies}</div>
              ) : null
            }
          </div>

        </div>

        <div className="flex w-full gap-4">
          {[0, 1, 2].map((index) => (
            <div key={index} className="flex flex-col flex-1">
              <label className="mb-1 text-sm font-medium text-gray-700">
                Professional Aspiration {index + 1}
              </label>
              <input
                type="text"
                placeholder={`Professional Aspiration ${index + 1}`}
                className="px-2 py-3 border border-gray-500 rounded-xl"
                name={`professionalAspirations[${index}]`}
                value={formik.values.professionalAspirations[index]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {
                formik.touched.professionalAspirations &&
                  formik.touched.professionalAspirations[index] &&
                  formik.errors.professionalAspirations &&
                  formik.errors.professionalAspirations[index] ? (
                  <div className="text-red-500">
                    {formik.errors.professionalAspirations[index]}
                  </div>
                ) : null
              }
            </div>
          ))}
        </div>

        <div className="flex w-full gap-4">
          <div className="flex flex-col w-1/2">
            <label className="mb-1 text-sm font-medium text-gray-700">Interested In Future Webinars or Education Materials</label>
            <select
              className="px-2 py-3 border border-gray-500 rounded-xl"
              id='interestedInWebinars'
              value={formik.values.interestedInWebinars}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="" default hidden>Select Is Interested</option>
              <option value={"yes"}>Yes</option>
              <option value={"no"}>No</option>
            </select>
            {
              formik.touched.interestedInWebinars && formik.errors.interestedInWebinars ? (
                <div className="text-red-500">{formik.errors.interestedInWebinars}</div>
              ) : null
            }
          </div>
          <div className="flex flex-col w-1/2">
            <label className="mb-1 text-sm font-medium text-gray-700">Associated With Organizations </label>
            <input
              type="text" placeholder='A=4' className="px-2 py-3 border border-gray-500 rounded-xl"
              id='associatedOrganizations'
              value={formik.values.associatedOrganizations}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.associatedOrganizations && formik.errors.associatedOrganizations ? (
              <div className="text-red-500">{formik.errors.associatedOrganizations}</div>
            ) : null}
          </div>
        </div>

        <div className="flex w-full gap-4">

          <div className="flex flex-col w-1/2">
            <label className="mb-1 text-sm font-medium text-gray-700">Published Any Studies </label>
            <input
              type="text"
              placeholder='Enter eg:Write up 1'
              className="px-2 py-3 border border-gray-500 rounded-xl"
              id='publishedStudies'
              value={formik.values.publishedStudies}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.publishedStudies && formik.errors.publishedStudies ? (
              <div className="text-red-500">{formik.errors.publishedStudies}</div>) : null
            }
          </div>

          <div className="flex flex-col w-1/2">
            <label className="mb-1 text-sm font-medium text-gray-700">Product To Be Promoted</label>
            <select
              id='productToBePromoted'
              value={formik.values.productToBePromoted}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="px-2 py-3 border border-gray-500 rounded-xl">
              <option>choose Multiple option</option>
              {
                productList?.map((item, index) => {
                  return <option value={item.name}>{item.name}</option>
                })
              }
            </select>
            {formik.touched.productToBePromoted && formik.errors.productToBePromoted ? (
              <div className="text-red-500">{formik.errors.productToBePromoted}</div>
            ) : null}
          </div>
        </div>

        <div className="flex w-full gap-4">
          <div className="flex flex-col w-1/2">
            <label className="mb-1 text-sm font-medium text-gray-700">Target of Visit For The Year</label>
            <input
              type="text"
              placeholder="Enter Target"
              className="px-2 py-3 border border-gray-500 rounded-xl"
              id='targetOfVisitForYear'
              value={formik.values.targetOfVisitForYear}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {
              formik.touched.targetOfVisitForYear && formik.errors.targetOfVisitForYear ? (
                <div className="text-red-500">{formik.errors.targetOfVisitForYear}</div>
              ) : null
            }
          </div>
          <div className="flex flex-col w-1/2">
            <label htmlFor='achievementOfVisitsForYear' className="mb-1 text-sm font-medium text-gray-700">Achievement of Visits For The Year</label>
            <input
              type="text"
              placeholder="Enter Achievement"
              className="px-2 py-3 border border-gray-500 rounded-xl"
              id='achievementOfVisitsForYear'
              value={formik.values.achievementOfVisitsForYear}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {
              formik.touched.achievementOfVisitsForYear && formik.errors.achievementOfVisitsForYear ? (
                <div className="text-red-500">{formik.errors.achievementOfVisitsForYear}</div>
              ) : null
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default UserSalutations;
