import React from "react";

import { useNavigate } from "react-router-dom";
import useAdminIndividualDB from "../../../../../../hooks/superAdminHook/superAdmindatabase/useAdminIndividualDB";

const PraticeOperation = ({ID}) => {

      const { getAdminIndividualDataByID, getAdminIndividualByID } = useAdminIndividualDB();
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
          Practice Operation
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <Item
            label="No. of Patients in Year"
            value={getAdminIndividualByID?.numberOfPatientsPerYear}
          />
          <Item
            label="Types of Surgeries"
            value={
              getAdminIndividualByID?.typeOfSurgeriesPerformed &&
              getAdminIndividualByID?.typeOfSurgeriesPerformed.length > 0
                ? getAdminIndividualByID?.typeOfSurgeriesPerformed.map(
                    (data, index) =>
                      index ===
                      getAdminIndividualByID?.typeOfSurgeriesPerformed.length - 1
                        ? data
                        : `${data}, `
                  )
                : "N/A"
            }
          />
          <Item label="Open Surgery" value={getAdminIndividualByID?.openSurgery} />
          <Item label="Lab Surgery" value={getAdminIndividualByID?.lapSurgery} />
          <Item
            label="Robotic Surgery"
            value={getAdminIndividualByID?.roboticSurgery}
          />
          <Item
            label="Preferred Time to Contact"
            value={handleDateFormat(getAdminIndividualByID?.preferredDayToContact)}
          />
          <Item
            label="Preferred Day to Contact"
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
          <Item label="Category" value={getAdminIndividualByID?.category} />
          <Item
            label="Visit For Each Category"
            value={getAdminIndividualByID?.visitForEachCategory}
          />
          <Item
            label="Interested in Webinars"
            value={
              getAdminIndividualByID?.interestedInWebinars === true
                ? "Interested"
                : "Not Interested"
            }
          />
          <Item
            label="Associated with Organizations"
            value={
              getAdminIndividualByID?.associatedOrganizations
            }
          />
          <Item
            label="Published Studies"
            value={getAdminIndividualByID?.publishedClinicalStudies}
          />
          <Item
            label="Products to Promote"
            value={getAdminIndividualByID?.productsToBePromoted}
          />
          <Item
            label="Yearly Target"
            value={getAdminIndividualByID?.targetVisitsForYear}
          />
          <Item
            label="Achievement of Year"
            value={getAdminIndividualByID?.achievementsOfVisitsForYear}
          />
        </div>
      </div>
    </>
  );
};

export default PraticeOperation;
