import React from "react";
import useIndividuals from "../../../../../../hooks/salesExecutiveHook/Individual/useIndividual";
import { useNavigate } from "react-router-dom";

const PraticeOperation = ({ID}) => {

      const { getIndividualDataByID, getindividualByID } = useIndividuals();
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
            value={getindividualByID?.numberOfPatientsPerYear}
          />
          <Item
            label="Types of Surgeries"
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
          <Item label="Open Surgery" value={getindividualByID?.openSurgery} />
          <Item label="Lab Surgery" value={getindividualByID?.lapSurgery} />
          <Item
            label="Robotic Surgery"
            value={getindividualByID?.roboticSurgery}
          />
          <Item
            label="Preferred Time to Contact"
            value={handleDateFormat(getindividualByID?.preferredDayToContact)}
          />
          <Item
            label="Preferred Day to Contact"
            value={getindividualByID?.preferredTimeToContact}
          />
          <Item
            label="Hobbies"
            value={
              getindividualByID?.hobbies &&
              getindividualByID?.hobbies.length > 0
                ? getindividualByID?.hobbies.map((hobby, index) =>
                    index !== getindividualByID?.hobbies.length - 1
                      ? `${hobby}, `
                      : hobby
                  )
                : "N/A"
            }
          />
          <Item
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
          />
          <Item label="Category" value={getindividualByID?.category} />
          <Item
            label="Visit For Each Category"
            value={getindividualByID?.visitForEachCategory}
          />
          <Item
            label="Interested in Webinars"
            value={
              getindividualByID?.interestedInWebinars === true
                ? "Interested"
                : "Not Interested"
            }
          />
          <Item
            label="Associated with Organizations"
            value={
              getindividualByID?.associatedOrganizations
            }
          />
          <Item
            label="Published Studies"
            value={getindividualByID?.publishedClinicalStudies}
          />
          <Item
            label="Products to Promote"
            value={getindividualByID?.productsToBePromoted}
          />
          <Item
            label="Yearly Target"
            value={getindividualByID?.targetVisitsForYear}
          />
          <Item
            label="Achievement of Year"
            value={getindividualByID?.achievementsOfVisitsForYear}
          />
        </div>
      </div>
    </>
  );
};

export default PraticeOperation;
