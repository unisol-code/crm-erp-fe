import React from "react";
import Button from "../../../../../../components/uiComponents/button/Button";
import { useNavigate } from "react-router-dom";
import useAdminIndividualDB from "../../../../../../hooks/superAdminHook/superAdmindatabase/useAdminIndividualDB";

const PreviewSalutionIfDr = ({ ID }) => {
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
          If Salutation Dr.
          <br />
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <Item label="Speciality" value={getAdminIndividualByID?.specialty} />
          <Item label="Profile" value={getAdminIndividualByID?.profile} />
          <Item
            label="Additional Qualification"
            value={getAdminIndividualByID?.additionalQualification}
          />
          <Item
            label="Qualification Speciality"
            value={getAdminIndividualByID?.qualificationSpecialty}
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
            label="Affilated Hospital/Organizations"
            value={
              getAdminIndividualByID?.affiliatedOrganizations &&
                getAdminIndividualByID?.affiliatedOrganizations.length > 0
                ? getAdminIndividualByID?.affiliatedOrganizations.map(
                  (data, index) =>
                    index ===
                      getAdminIndividualByID?.affiliatedOrganizations.length - 1
                      ? data
                      : `${data}, `
                )
                : "N/A"
            }
          />
          <Item
            label="Types Of Speciality"
            value={getAdminIndividualByID?.typeOfSpecialty}
          />
          <Item label="OPD Days" value={getAdminIndividualByID?.opdDays} />
          <Item label="OPD Time" value={getAdminIndividualByID?.opdTime} />
          <Item label="Surgery Days" value={getAdminIndividualByID?.surgeryDays} />
          <Item label="Surgery Time" value={getAdminIndividualByID?.surgeryTime} />
        </div>
      </div>
    </>
  );
};

export default PreviewSalutionIfDr;
