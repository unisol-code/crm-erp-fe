import React from "react";
import Button from "../../../../../../components/uiComponents/button/Button";
import { useNavigate } from "react-router-dom";
import useAdminIndividualDB from "../../../../../../hooks/superAdminHook/superAdmindatabase/useAdminIndividualDB";

const PreviewSalutationIfNotDr = ({ ID }) => {
  const { getAdminIndividualDataByID, getAdminIndividualByID } =
    useAdminIndividualDB();
  const navigate = useNavigate();
  const Item = ({ label, value }) => (
    <div>
      <p className="text-gray-500">{label}</p>
      <p className="mt-1 text-gray-800">{value || "N/A"}</p>
    </div>
  );

  const handleDateFormat = (date) => {
    return date
      ? new Date(date).toLocaleDateString("en-GB").split("T")[0]
      : "N/A";
  };

  return (
    <>
      <div className="p-4 mb-6 bg-white rounded shadow">
        <h2 className="mb-4 text-lg font-semibold uppercase">
          If The Individual Is Not Dr For Eg.salutation is shri,Smt,Ms.
          <br />
          Professional Information
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <Item label="Profile" value={getAdminIndividualByID?.profile} />
          {/* added field */}
          <Item
            label="If Other Profile"
            value={getAdminIndividualByID?.typeOfProfile}
          />
          <Item
            label="Additional Qualification"
            value={getAdminIndividualByID?.additionalQualification}
          />
          <Item
            label="Employee Status"
            value={getAdminIndividualByID?.employmentStatus}
          />
          {/* added field */}
          <Item
            label="Office Address"
            value={getAdminIndividualByID?.officeAddress}
          />
          <Item label="LandMark" value={getAdminIndividualByID?.landmark} />
          <Item
            label="Phone Number 1"
            value={getAdminIndividualByID?.phoneNumber1}
          />
          <Item
            label="Phone Number 2"
            value={getAdminIndividualByID?.phoneNumber2}
          />
          {/* Added  field*/}
          <Item
            label="No. of Patients in a Year"
            value={getAdminIndividualByID?.numberOfPatientsPerYear}
          />
          <Item
            label="Types of Surgeries Performed"
            value={
              getAdminIndividualByID?.typeOfSurgeriesPerformed &&
                getAdminIndividualByID?.typeOfSurgeriesPerformed.length > 0
                ? getAdminIndividualByID?.typeOfSurgeriesPerformed.map(
                  (data, index) =>
                    index ===
                      getAdminIndividualByID?.typeOfSurgeriesPerformed.length -
                      1
                      ? data
                      : `${data}, `
                )
                : "N/A"
            }
          />
          <Item
            label="Email Address 1"
            value={getAdminIndividualByID?.emailAddress1}
          />
          <Item
            label="Email Address 2"
            value={getAdminIndividualByID?.emailAddress2}
          />
          <Item
            label="Website Url(Optional)"
            value={getAdminIndividualByID?.websiteUrl}
          />
          <Item
            label="linked in Url(Optional)"
            value={getAdminIndividualByID?.linkedInUrl}
          />
          <Item
            label="Facebook Url(Optional)"
            value={getAdminIndividualByID?.facebookUrl}
          />
          <Item
            label="Instagram Url(Optional)"
            value={getAdminIndividualByID?.instagramUrl}
          />
          <Item
            label="Preferred Day To Contact"
            value={handleDateFormat(
              getAdminIndividualByID?.preferredDayToContact
            )}
          />
          <Item
            label="Preferred Time To Contact"
            value={getAdminIndividualByID?.preferredTimeToContact}
          />
          <Item
            label="Hobbies"
            value={
              getAdminIndividualByID?.hobbies &&
                getAdminIndividualByID?.hobbies.length > 0
                ? getAdminIndividualByID?.hobbies.map((hobby, index) =>
                  index !== getAdminIndividualByID?.hobbies.length - 1
                    ? `${hobby}, `
                    : hobby
                )
                : "N/A"
            }
          />
          <Item
            label="Professional Aspiration 1"
            value={getAdminIndividualByID?.professionalAspirations[0]}
          />
          <Item
            label="Professional Aspiration 2"
            value={getAdminIndividualByID?.professionalAspirations[1]}
          />
          <Item
            label="Professional Aspiration 3"
            value={getAdminIndividualByID?.professionalAspirations[2]}
          />
          {/* <Item label="Category" value={getAdminIndividualByID?.category} />
            <Item
              label="Visit of Each Category"
              value={getAdminIndividualByID?.visitForEachCategory}
            /> */}
          <Item
            label="Interested In Future Webinars or Education Materials"
            value={
              getAdminIndividualByID?.interestedInWebinars === true
                ? "Interested"
                : "Not Interested"
            }
          />
          <Item
            label="Association With Organizations"
            value={getAdminIndividualByID?.associatedOrganizations}
          />
          <Item
            label="Published Any Studies"
            value={getAdminIndividualByID?.publishedClinicalStudies}
          />
          <Item
            label="Product to be Promoted"
            value={getAdminIndividualByID?.productsToBePromoted}
          />
          <Item
            label="Target Of Visits For The Year"
            value={getAdminIndividualByID?.targetVisitsForYear}
          />
          <Item
            label="Achievements Of Visits For Year"
            value={getAdminIndividualByID?.achievementsOfVisitsForYear}
          />
        </div>
      </div>
    </>
  );
};

export default PreviewSalutationIfNotDr;
