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
  const { getAdminIndividualDataByID, getAdminIndividualByID, loading } = useIndividuals();

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

  console.log("the data is:", getAdminIndividualByID);
  console.log("dobbbbbbbb", getAdminIndividualByID?.dob);

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
                  <Item label="Full Name" value={getAdminIndividualByID?.data?.individualDetails?.fullName || "N/A"} />
                  {getAdminIndividualByID?.data?.individualDetails?.typeOfDoctorProfile === "Non Clinical" && (
                    <Item label="Department" value={getAdminIndividualByID?.data?.individualDetails?.department || "N/A"} />
                  )}
                  <Item label="Designation" value={getAdminIndividualByID?.data?.individualDetails?.designation || "N/A"} />
                  {getAdminIndividualByID?.data?.individualDetails?.typeOfDoctorProfile !== "Non Clinical" && (
                    <Item label="Speciality" value={getAdminIndividualByID?.data?.individualDetails?.speciality || "N/A"} />
                  )}
                  <Item label="Segment" value={getAdminIndividualByID?.data?.individualDetails?.segment || "N/A"} />
                  <Item
                    label="Visit Target"
                    value={getAdminIndividualByID?.data?.individualDetails?.visitTarget || "N/A"}
                  />
                  <Item
                    label="Visit Achievement"
                    value={getAdminIndividualByID?.data?.individualDetails?.visitAchievement || "N/A"}
                  />
                  <Item
                    label="Type Of Individual Profile"
                    value={getAdminIndividualByID?.data?.individualDetails?.typeOfDoctorProfile || "N/A"}
                  />
                  <Item label="Category" value={getAdminIndividualByID?.data?.individualDetails?.category || "N/A"} />
                  {getAdminIndividualByID?.data?.individualDetails?.typeOfDoctorProfile === "Physician" && (
                    <Item label="Type of Profile" value={getAdminIndividualByID?.data?.individualDetails?.profileType || "N/A"} />
                  )}
                  {getAdminIndividualByID?.data?.individualDetails?.typeOfDoctorProfile === "Physician" && (
                    <Item
                      label="Total No of Patients Examined per Day"
                      value={getAdminIndividualByID?.data?.individualDetails?.totalNoOfPatientExaminPerDay || "N/A"}
                    />
                  )}
                  {getAdminIndividualByID?.data?.individualDetails?.typeOfDoctorProfile === "Physician" && (
                    <Item
                      label="Total No of Patients Admission per Day"
                      value={getAdminIndividualByID?.data?.individualDetails?.totalNoOfPatientAdmissionPerDay || "N/A"}
                    />
                  )}
                </div>
              </div>

              {/* Contacts */}
              <div className="p-4 mb-6 bg-white rounded shadow">
                <h2 className="mb-4 text-lg font-semibold uppercase">Contacts</h2>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                  <Item label="Contact No" value={getAdminIndividualByID?.data?.individualDetails?.contactNo || "N/A"} />
                  <Item
                    label="Alternate Contact No"
                    value={getAdminIndividualByID?.data?.individualDetails?.alternateContactNo || "N/A"}
                  />
                  <Item
                    label="Official Email"
                    value={getAdminIndividualByID?.data?.individualDetails?.officialEmail || "N/A"}
                  />
                  <Item
                    label="Personal Email"
                    value={getAdminIndividualByID?.data?.individualDetails?.personalEmail || "N/A"}
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
                    value={handleDateFormat(getAdminIndividualByID?.data?.individualDetails?.dob)}
                  />
                  <Item label="Hobbies" value={getAdminIndividualByID?.data?.individualDetails?.hobbies || "N/A"} />
                  <Item
                    label="Relationship Status"
                    value={getAdminIndividualByID?.data?.individualDetails?.relationshipStatus || "N/A"}
                  />
                  {getAdminIndividualByID?.data?.individualDetails?.relationshipStatus === "Married" && (
                    <>
                      <Item label="Spouse Name" value={getAdminIndividualByID?.data?.individualDetails?.spouseName || "N/A"} />
                      <Item
                        label="Wedding Anniversary"
                        value={handleDateFormat(getAdminIndividualByID?.data?.individualDetails?.weddingAnniversary)}
                      />

                    </>
                  )}
                  <Item
                    label="Academic Interest"
                    value={getAdminIndividualByID?.data?.individualDetails?.academicInterest || "N/A"}
                  />

                </div>
              </div>

              {/* Address */}
              <div className="p-4 mb-6 bg-white rounded shadow">
                <h2 className="mb-4 text-lg font-semibold uppercase">Address</h2>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                  <Item
                    label="Residence Address"
                    value={getAdminIndividualByID?.data?.individualDetails?.residenceAddress || "N/A"}
                  />
                  <Item
                    label="City/Town/Village"
                    value={getAdminIndividualByID?.data?.individualDetails?.cityTownVillage || "N/A"}
                  />
                  <Item label="District" value={getAdminIndividualByID?.data?.individualDetails?.district || "N/A"} />
                  <Item label="State" value={getAdminIndividualByID?.data?.individualDetails?.state || "N/A"} />
                  <Item label="Pincode" value={getAdminIndividualByID?.data?.individualDetails?.pincode || "N/A"} />
                  <Item label="Landmark" value={getAdminIndividualByID?.data?.individualDetails?.landmark || "N/A"} />
                </div>
              </div>

              {(getAdminIndividualByID?.data?.individualDetails?.typeOfDoctorProfile === "Physician" ||
                getAdminIndividualByID?.data?.individualDetails?.typeOfDoctorProfile === "Surgeon") &&
                Array.isArray(getAdminIndividualByID?.data?.individualDetails?.hospitalsAssociatedWith) && (
                  <div className="p-4 mb-6 bg-white rounded shadow">
                    <h2 className="mb-4 text-lg font-semibold uppercase">
                      Hospitals Associated With
                    </h2>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      {getAdminIndividualByID?.data?.individualDetails?.hospitalsAssociatedWith.map((hosp, idx) => (
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
              {getAdminIndividualByID?.data?.individualDetails?.typeOfDoctorProfile === "Physician" &&
                Array.isArray(getAdminIndividualByID?.data?.individualDetails?.opdDays) && (
                  <div className="p-4 mb-6 bg-white rounded shadow">
                    <h2 className="mb-4 text-lg font-semibold uppercase">OPD Days</h2>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-6">
                      {getAdminIndividualByID?.data?.individualDetails?.opdDays.length > 0 ? (
                        getAdminIndividualByID?.data?.individualDetails?.opdDays.map((day, idx) => (
                          <Item key={idx} label={`Day ${idx + 1}`} value={day} />
                        ))
                      ) : "N/A"}
                    </div>
                  </div>
                )}

              {getAdminIndividualByID?.data?.individualDetails?.typeOfDoctorProfile === "Surgeon" &&
                Array.isArray(getAdminIndividualByID?.data?.individualDetails?.surgeryDays) && (
                  <div className="p-4 mb-6 bg-white rounded shadow">
                    <h2 className="mb-4 text-lg font-semibold uppercase">
                      Surgery Days
                    </h2>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-6">
                      {getAdminIndividualByID?.data?.individualDetails?.surgeryDays.length > 0 ? (
                        getAdminIndividualByID?.data?.individualDetails?.surgeryDays.map((day, idx) => (
                          <Item key={idx} label={`Day ${idx + 1}`} value={day} />
                        ))
                      ) : (
                        "N/A"
                      )}
                    </div>
                  </div>
                )}


              {getAdminIndividualByID?.data?.individualDetails?.typeOfDoctorProfile === "Surgeon" && Array.isArray(getAdminIndividualByID?.data?.individualDetails?.typeOfSurgeryPerformed) && (
                <div className="p-4 mb-6 bg-white rounded shadow">
                  <h2 className="mb-4 text-lg font-semibold uppercase">
                    Types Of Surgery Performed
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {getAdminIndividualByID?.data?.individualDetails?.typeOfSurgeryPerformed.map((surg, idx) => (
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
                  <Item label="Sales ID" value={getAdminIndividualByID?.sales_id} />
                  <Item
                    label="Visit Achievement"
                    value={
                      typeof getAdminIndividualByID?.visitAchievement === "number"
                        ? String(getAdminIndividualByID?.visitAchievement)
                        : getAdminIndividualByID?.visitAchievement
                    }
                  />
                  <Item
                    label="Created At"
                    value={handleDateFormat(getAdminIndividualByID?.createdAt)}
                  />
                  <Item
                    label="Updated At"
                    value={handleDateFormat(getAdminIndividualByID?.updatedAt)}
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
                    value={getAdminIndividualByID?.data?.individualDetails?.graduation?.instituteName}
                  />
                  <Item
                    label="Graduation Year"
                    value={
                      typeof getAdminIndividualByID?.data?.individualDetails?.graduation?.yearOfPassing === "number"
                        ? String(getAdminIndividualByID?.data?.individualDetails?.graduation?.yearOfPassing)
                        : getAdminIndividualByID?.data?.individualDetails?.graduation?.yearOfPassing
                    }
                  />
                  <Item
                    label="Post Graduation Institute"
                    value={getAdminIndividualByID?.data?.individualDetails?.postGraduation?.instituteName || "N/A"}
                  />
                  <Item
                    label="Post Graduation Year"
                    value={
                      getAdminIndividualByID?.data?.individualDetails?.postGraduation?.yearOfPassing || "N/A"
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
                    value={getAdminIndividualByID?.data?.salesPersonName || "N/A"}
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
