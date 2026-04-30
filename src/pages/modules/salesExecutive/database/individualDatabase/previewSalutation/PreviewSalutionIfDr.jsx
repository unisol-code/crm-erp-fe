import React from "react";
import useIndividuals from "../../../../../../hooks/salesExecutiveHook/Individual/useIndividual";
import Button from "../../../../../../components/uiComponents/button/Button";
import { useNavigate } from "react-router-dom";

const PreviewSalutionIfDr = ({ ID }) => {
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
          If Salutation Dr.
          <br />
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <Item label="Speciality" value={getindividualByID?.specialty} />
          <Item label="Profile" value={getindividualByID?.profile} />
          <Item
            label="Additional Qualification"
            value={getindividualByID?.additionalQualification}
          />
          <Item
            label="Qualification Speciality"
            value={getindividualByID?.qualificationSpecialty}
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
            label="Affilated Hospital/Organizations"
            value={
              getindividualByID?.affiliatedOrganizations &&
                getindividualByID?.affiliatedOrganizations.length > 0
                ? getindividualByID?.affiliatedOrganizations.map(
                  (data, index) =>
                    index ===
                      getindividualByID?.affiliatedOrganizations.length - 1
                      ? data
                      : `${data}, `
                )
                : "N/A"
            }
          />
          <Item
            label="Types Of Speciality"
            value={getindividualByID?.typeOfSpecialty}
          />
          <Item label="OPD Days" value={getindividualByID?.opdDays} />
          <Item label="OPD Time" value={getindividualByID?.opdTime} />
          <Item label="Surgery Days" value={getindividualByID?.surgeryDays} />
          <Item label="Surgery Time" value={getindividualByID?.surgeryTime} />
        </div>
      </div>
    </>
  );
};

export default PreviewSalutionIfDr;
