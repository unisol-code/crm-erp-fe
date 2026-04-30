import React, { useEffect } from "react";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../../../components/uiComponents/button/Button";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import useIndividuals from "../../../../../hooks/superAdminHook/superAdmindatabase/useAdminIndividualDB";
import LoaderSpinner from "../../../../../components/uiComponents/loader/LoaderSpinner";

const Item = ({ label, value }) => (
  <div>
    <p className="text-gray-500">{label}</p>
    <p className="mt-1 text-gray-800">{value || "N/A"}</p>
  </div>
);

const SuperAdminPreviewNewIndividual = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { id } = useParams();
  const { getAdminIndividualDataByID, getindividualByID, loading } = useIndividuals();

  useEffect(() => {
    getAdminIndividualDataByID(id);
  }, [id]);

  const handleDateFormat = (date) => {
    return date
      ? new Date(date).toLocaleDateString("en-GB").split("T")[0]
      : "N/A";
  };

  const handleTimeRange = (timings) => {
    if (!timings || (!timings?.startTime && !timings?.endTime)) return "N/A";
    const start = timings?.startTime || "--";
    const end = timings?.endTime || "--";
    return `${start} - ${end}`;
  };

  console.log("the data is:", getindividualByID);
  console.log("dobbbbbbbb", getindividualByID?.dob);

  return (
    <div className="w-full min-h-screen">
      {/* Breadcrumb */}
      <BreadCrumb
        linkText={[
          { text: "Database" },
          { text: "Individual Database", href: "/database" },
          { text: "View Individual" },
        ]}
      />
      {
        loading ? (<div className="py-4 w-full bg-white flex items-center justify-center"><LoaderSpinner /></div>) : (
          <>
            <div className="rounded-xl text-sm font-medium text-gray-700">
              {/* Header */}
              <div className="text-center">
                <h2
                  className="flex p-6 items-center justify-center font-semibold text-xl text-black bg-opacity-40 rounded-t-md"
                  style={{ backgroundColor: theme?.secondaryColor }}
                >
                  View Individual
                </h2>
              </div>
              {/* Profile */}
              <div className="p-4 mb-6 bg-white rounded-b shadow">
                <h2 className="mb-4 text-lg font-semibold uppercase">Profile</h2>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                  <Item label="Full Name" value={getindividualByID?.fullName || "N/A"} />
                  {getindividualByID?.typeOfDoctorProfile === "Non Clinical" && (
                    <Item label="Department" value={getindividualByID?.department || "N/A"} />
                  )}
                  <Item label="Designation" value={getindividualByID?.designation || "N/A"} />
                  {getindividualByID?.typeOfDoctorProfile !== "Non Clinical" && (
                    <Item label="Speciality" value={getindividualByID?.speciality || "N/A"} />
                  )}
                  <Item label="Segment" value={getindividualByID?.segment || "N/A"} />
                  <Item
                    label="Visit Target"
                    value={getindividualByID?.visitTarget || "N/A"}
                  />
                  <Item
                    label="Visit Achievement"
                    value={getindividualByID?.visitAchievement || "N/A"}
                  />
                  <Item
                    label="Type Of Individual Profile"
                    value={getindividualByID?.typeOfDoctorProfile || "N/A"}
                  />
                  <Item label="Category" value={getindividualByID?.category || "N/A"} />
                  {getindividualByID?.typeOfDoctorProfile === "Physician" && (
                    <Item label="Type of Profile" value={getindividualByID?.profileType || "N/A"} />
                  )}
                  {getindividualByID?.typeOfDoctorProfile === "Physician" && (
                    <Item
                      label="Total No of Patients Examined per Day"
                      value={getindividualByID?.totalNoOfPatientExaminPerDay || "N/A"}
                    />
                  )}
                  {getindividualByID?.typeOfDoctorProfile === "Physician" && (
                    <Item
                      label="Total No of Patients Admission per Day"
                      value={getindividualByID?.totalNoOfPatientAdmissionPerDay || "N/A"}
                    />
                  )}
                </div>
              </div>

              {/* Contacts */}
              <div className="p-4 mb-6 bg-white rounded shadow">
                <h2 className="mb-4 text-lg font-semibold uppercase">Contacts</h2>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                  <Item label="Contact No" value={getindividualByID?.contactNo} />
                  <Item
                    label="Alternate Contact No"
                    value={getindividualByID?.alternateContactNo}
                  />
                  <Item
                    label="Official Email"
                    value={getindividualByID?.officialEmail}
                  />
                  <Item
                    label="Personal Email"
                    value={getindividualByID?.personalEmail}
                  />
                </div>
              </div>

              {/* Personal Info */}
              <div className="p-4 mb-6 bg-white rounded shadow">
                <h2 className="mb-4 text-lg font-semibold uppercase">
                  Personal Info
                </h2>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                  <Item
                    label="DOB"
                    value={handleDateFormat(getindividualByID?.dob)}
                  />
                  <Item label="Hobbies" value={getindividualByID?.hobbies || "N/A"} />
                  <Item
                    label="Relationship Status"
                    value={getindividualByID?.relationshipStatus}
                  />
                  {getindividualByID?.relationshipStatus === "Married" && (
                    <>
                      <Item label="Spouse Name" value={getindividualByID?.spouseName} />
                      <Item
                        label="Wedding Anniversary"
                        value={handleDateFormat(getindividualByID?.weddingAnniversary)}
                      />

                    </>
                  )}
                  <Item
                    label="Academic Interest"
                    value={getindividualByID?.academicInterest}
                  />

                </div>
              </div>

              {/* Address */}
              <div className="p-4 mb-6 bg-white rounded shadow">
                <h2 className="mb-4 text-lg font-semibold uppercase">Address</h2>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                  <Item
                    label="Residence Address"
                    value={getindividualByID?.residenceAddress}
                  />
                  <Item
                    label="City/Town/Village"
                    value={getindividualByID?.cityTownVillage}
                  />
                  <Item label="District" value={getindividualByID?.district} />
                  <Item label="State" value={getindividualByID?.state} />
                  <Item label="Pincode" value={getindividualByID?.pincode} />
                  <Item label="Landmark" value={getindividualByID?.landmark} />
                </div>
              </div>

              {(getindividualByID?.typeOfDoctorProfile === "Physician" ||
                getindividualByID?.typeOfDoctorProfile === "Surgeon") &&
                Array.isArray(getindividualByID?.hospitalsAssociatedWith) && (
                  <div className="p-4 mb-6 bg-white rounded shadow">
                    <h2 className="mb-4 text-lg font-semibold uppercase">
                      Hospitals Associated With
                    </h2>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      {getindividualByID.hospitalsAssociatedWith.map((hosp, idx) => (
                        <div key={hosp?._id || idx} className="p-3 rounded border">
                          <Item label="Hospital Name" value={hosp?.hospitalName} />
                          <Item
                            label="Days"
                            value={Array.isArray(hosp?.days) ? hosp.days.join(", ") : "N/A"}
                          />
                          <Item label="Timings" value={handleTimeRange(hosp?.timings)} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              {getindividualByID?.typeOfDoctorProfile === "Physician" &&
                Array.isArray(getindividualByID?.opdDays) && (
                  <div className="p-4 mb-6 bg-white rounded shadow">
                    <h2 className="mb-4 text-lg font-semibold uppercase">OPD Days</h2>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-6">
                      {getindividualByID.opdDays.length > 0 ? (
                        getindividualByID.opdDays.map((day, idx) => (
                          <Item key={idx} label={`Day ${idx + 1}`} value={day} />
                        ))
                      ) : "N/A"}
                    </div>
                  </div>
                )}

              {getindividualByID?.typeOfDoctorProfile === "Surgeon" &&
                Array.isArray(getindividualByID?.surgeryDays) && (
                  <div className="p-4 mb-6 bg-white rounded shadow">
                    <h2 className="mb-4 text-lg font-semibold uppercase">
                      Surgery Days
                    </h2>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-6">
                      {getindividualByID.surgeryDays.length > 0 ? (
                        getindividualByID.surgeryDays.map((day, idx) => (
                          <Item key={idx} label={`Day ${idx + 1}`} value={day} />
                        ))
                      ) : (
                        "N/A"
                      )}
                    </div>
                  </div>
                )}


              {getindividualByID?.typeOfDoctorProfile === "Surgeon" && Array.isArray(getindividualByID?.typeOfSurgeryPerformed) && (
                <div className="p-4 mb-6 bg-white rounded shadow">
                  <h2 className="mb-4 text-lg font-semibold uppercase">
                    Types Of Surgery Performed
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {getindividualByID.typeOfSurgeryPerformed.map((surg, idx) => (
                      <div key={surg?._id || idx} className="p-3 rounded border">
                        <Item label="Type" value={surg?.type} />
                        <Item
                          label="Count"
                          value={
                            typeof surg?.count === "number"
                              ? String(surg?.count)
                              : surg?.count
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}


              {/* <div className="p-4 mb-6 bg-white rounded shadow">
                <h2 className="mb-4 text-lg font-semibold uppercase">Meta</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                  <Item label="Sales ID" value={getindividualByID?.sales_id} />
                  <Item
                    label="Visit Achievement"
                    value={
                      typeof getindividualByID?.visitAchievement === "number"
                        ? String(getindividualByID?.visitAchievement)
                        : getindividualByID?.visitAchievement
                    }
                  />
                  <Item
                    label="Created At"
                    value={handleDateFormat(getindividualByID?.createdAt)}
                  />
                  <Item
                    label="Updated At"
                    value={handleDateFormat(getindividualByID?.updatedAt)}
                  />
                </div>
              </div> */}

              {/* Education */}
              <div className="p-4 mb-6 bg-white rounded shadow">
                <h2 className="mb-4 text-lg font-semibold uppercase">
                  Educational & Professional Background
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                  <Item
                    label="Graduation Institute"
                    value={getindividualByID?.graduation?.instituteName}
                  />
                  <Item
                    label="Graduation Year"
                    value={
                      typeof getindividualByID?.graduation?.yearOfPassing === "number"
                        ? String(getindividualByID?.graduation?.yearOfPassing)
                        : getindividualByID?.graduation?.yearOfPassing
                    }
                  />
                  <Item
                    label="Post Graduation Institute"
                    value={getindividualByID?.postGraduation?.instituteName || "N/A"}
                  />
                  <Item
                    label="Post Graduation Year"
                    value={
                      getindividualByID?.postGraduation?.yearOfPassing || "N/A"
                    }
                  />
                </div>
              </div>

              <div className="p-4 mb-6 bg-white rounded shadow">
                <h2 className="mb-4 text-lg font-semibold uppercase">
                  Sales Person Details
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                  <Item
                    label="Sales Person Name"
                    value={getindividualByID?.salesPersonName}
                  />
                </div>
              </div>

            </div>

            <div className="flex mt-4 justify-center">
              <Button
                text="Edit"
                onClick={() =>
                  navigate(`/database/edit-individual/${id}`)
                }
              />
            </div>
          </>
        )
      }
    </div>
  );
};

export default SuperAdminPreviewNewIndividual;
