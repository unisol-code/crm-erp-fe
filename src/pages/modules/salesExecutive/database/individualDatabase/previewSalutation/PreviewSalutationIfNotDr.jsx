import React, { useEffect } from "react";
import useIndividuals from "../../../../../../hooks/salesExecutiveHook/Individual/useIndividual";
import Button from "../../../../../../components/uiComponents/button/Button";
import { useNavigate } from "react-router-dom";

const PreviewSalutationIfNotDr = ({ ID }) => {
  const { getIndividualDataByID, getindividualByID } = useIndividuals();
  const navigate = useNavigate();

  useEffect(() => {
    getIndividualDataByID(ID);
  }, []);

  console.log("getindividualByID", getindividualByID);
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
          <Item label="Profile" value={getindividualByID?.profile} />
          {/* added field */}
          <Item
            label="If Other Profile"
            value={getindividualByID?.typeOfProfile}
          />
          <Item
            label="Additional Qualification"
            value={getindividualByID?.additionalQualification}
          />
          <Item
            label="Employee Status"
            value={getindividualByID?.employmentStatus}
          />
          {/* added field */}
          <Item
            label="Office Address"
            value={getindividualByID?.officeAddress}
          />
          <Item label="LandMark" value={getindividualByID?.landmark} />
          <Item
            label="Phone Number 1"
            value={getindividualByID?.phoneNumber1}
          />
          <Item
            label="Phone Number 2"
            value={getindividualByID?.phoneNumber2}
          />
          {/* Added  field*/}
          <Item
            label="No. of Patients in a Year"
            value={getindividualByID?.numberOfPatientsPerYear}
          />
          <Item
            label="Types of Surgeries Performed"
            value={
              getindividualByID?.typeOfSurgeriesPerformed &&
                getindividualByID?.typeOfSurgeriesPerformed.length > 0
                ? getindividualByID?.typeOfSurgeriesPerformed.map(
                  (data, index) =>
                    index ===
                      getindividualByID?.typeOfSurgeriesPerformed.length - 1
                      ? data
                      : `${data}, `
                )
                : "N/A"
            }
          />
          <Item
            label="Email Address 1"
            value={getindividualByID?.emailAddress1}
          />
          <Item
            label="Email Address 2"
            value={getindividualByID?.emailAddress2}
          />
          <Item
            label="Website Url(Optional)"
            value={getindividualByID?.websiteUrl}
          />
          <Item
            label="linked in Url(Optional)"
            value={getindividualByID?.linkedInUrl}
          />
          <Item
            label="Facebook Url(Optional)"
            value={getindividualByID?.facebookUrl}
          />
          <Item
            label="Instagram Url(Optional)"
            value={getindividualByID?.instagramUrl}
          />
          <Item
            label="Preferred Day To Contact"
            value={handleDateFormat(getindividualByID?.preferredDayToContact)}
          />
          <Item
            label="Preferred Time To Contact"
            value={getindividualByID?.preferredTimeToContact}
          />
          <Item label="Hobbies" value={getindividualByID?.hobbies} />
          {/* <Item
            label="Professional Aspiration 1"
            value={getindividualByID?.professionalAspirations[0]}
          />
          <Item
            label="Professional Aspiration 2"
            value={getindividualByID?.professionalAspirations[1]}
          />
          <Item
            label="Professional Aspiration 3"
            value={getindividualByID?.professionalAspirations[2]}
          /> */}
          {/* <Item label="Category" value={getindividualByID?.category} />
            <Item
              label="Visit of Each Category"
              value={getindividualByID?.visitForEachCategory}
            /> */}
          <Item
            label="Interested In Future Webinars or Education Materials"
            value={
              getindividualByID?.interestedInWebinars === true
                ? "Interested"
                : "Not Interested"
            }
          />
          <Item
            label="Association With Organizations"
            value={getindividualByID?.associatedOrganizations}
          />
          <Item
            label="Published Any Studies"
            value={getindividualByID?.publishedClinicalStudies}
          />
          <Item
            label="Product to be Promoted"
            value={getindividualByID?.productsToBePromoted}
          />
          <Item
            label="Target Of Visits For The Year"
            value={getindividualByID?.targetVisitsForYear}
          />
          <Item
            label="Achievements Of Visits For Year"
            value={getindividualByID?.achievementsOfVisitsForYear}
          />
        </div>
      </div>
    </>
  );
};

export default PreviewSalutationIfNotDr;
