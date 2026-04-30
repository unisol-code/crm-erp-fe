import React, { useEffect } from "react";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb";
import { Box, Typography } from "@mui/material";
import Button from "../../../../../components/uiComponents/button/Button";
import { useNavigate, useParams } from "react-router-dom";
import useDatabase from "../../../../../hooks/database/useDatabase";
import LoaderSpinner from "../../../../../components/uiComponents/loader/LoaderSpinner";

const Item = ({ label, value }) => (
  <div>
    <p className="text-gray-500">{label}</p>
    <p className="text-gray-800 mt-1">{value ?? "-"}</p>
  </div>
);

const IndRequestActions = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log("Id", id);

  const { loading, employeeEditRequest, editRequestsDetails, requestAction } =
    useDatabase();
  useEffect(() => {
    employeeEditRequest(id);
  }, []);

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

  const handleRequestAction = (action) => {
    const userId = editRequestsDetails?.requestedBy?._id;
    const data = {
      action: action,
    };
    requestAction(id, data, userId);
    console.log("Action Data:", data);
    navigate(-1);
  };

  return (
    <div className="w-full min-h-screen">
      <BreadCrumb
        linkText={[
          { text: "Database", href: "/database" },
          { text: "Approval Requests ", href: "/database" },
          {
            text: "View Individual Requests",
            href: `/database/approvalrequest/viewrequests/${editRequestsDetails?.requestedBy?._id}`,
          },
          { text: "View Requests" },
        ]}
      />

      {loading ? (
        <div className="flex justify-center items-center w-full ">
          <LoaderSpinner />
        </div>
      ) : (
        <>
          {" "}
          <>
            <div className="p-4 mb-6 bg-white rounded-b shadow">
              <h2 className="mb-4 text-lg font-semibold uppercase">Profile</h2>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                <Item
                  label="Full Name"
                  value={editRequestsDetails?.targetDetails?.fullName || "N/A"}
                />
                {editRequestsDetails?.targetDetails?.typeOfDoctorProfile ===
                  "Non Clinical" && (
                    <Item
                      label="Department"
                      value={
                        editRequestsDetails?.targetDetails?.department || "N/A"
                      }
                    />
                  )}
                <Item
                  label="Designation"
                  value={
                    editRequestsDetails?.targetDetails?.designation || "N/A"
                  }
                />
                {editRequestsDetails?.targetDetails?.typeOfDoctorProfile !==
                  "Non Clinical" && (
                    <Item
                      label="Speciality"
                      value={
                        editRequestsDetails?.targetDetails?.speciality || "N/A"
                      }
                    />
                  )}
                <Item
                  label="Segment"
                  value={editRequestsDetails?.targetDetails?.segment || "N/A"}
                />
                <Item
                  label="Visit Target"
                  value={
                    editRequestsDetails?.targetDetails?.visitTarget || "N/A"
                  }
                />
                <Item
                  label="Visit Achievement"
                  value={
                    editRequestsDetails?.targetDetails?.visitAchievement ||
                    "N/A"
                  }
                />
                <Item
                  label="Type Of Individual Profile"
                  value={
                    editRequestsDetails?.targetDetails?.typeOfDoctorProfile ||
                    "N/A"
                  }
                />
                <Item
                  label="Category"
                  value={editRequestsDetails?.targetDetails?.category || "N/A"}
                />
                {editRequestsDetails?.targetDetails?.typeOfDoctorProfile ===
                  "Physician" && (
                    <Item
                      label="Type of Profile"
                      value={
                        editRequestsDetails?.targetDetails?.profileType || "N/A"
                      }
                    />
                  )}
                {editRequestsDetails?.targetDetails?.typeOfDoctorProfile ===
                  "Physician" && (
                    <Item
                      label="Total No of Patients Examined per Day"
                      value={
                        editRequestsDetails?.targetDetails
                          ?.totalNoOfPatientExaminPerDay || "N/A"
                      }
                    />
                  )}
                {editRequestsDetails?.targetDetails?.typeOfDoctorProfile ===
                  "Physician" && (
                    <Item
                      label="Total No of Patients Admission per Day"
                      value={
                        editRequestsDetails?.targetDetails
                          ?.totalNoOfPatientAdmissionPerDay || "N/A"
                      }
                    />
                  )}
              </div>
            </div>

            <div className="p-4 mb-6 bg-white rounded shadow">
              <h2 className="mb-4 text-lg font-semibold uppercase">Contacts</h2>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                <Item
                  label="Contact No"
                  value={editRequestsDetails?.targetDetails?.contactNo}
                />
                <Item
                  label="Alternate Contact No"
                  value={editRequestsDetails?.targetDetails?.alternateContactNo}
                />
                <Item
                  label="Official Email"
                  value={editRequestsDetails?.targetDetails?.officialEmail}
                />
                <Item
                  label="Personal Email"
                  value={editRequestsDetails?.targetDetails?.personalEmail}
                />
              </div>
            </div>

            <div className="p-4 mb-6 bg-white rounded shadow">
              <h2 className="mb-4 text-lg font-semibold uppercase">
                Personal Info
              </h2>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                <Item
                  label="DOB"
                  value={handleDateFormat(
                    editRequestsDetails?.targetDetails?.dob
                  )}
                />
                <Item
                  label="Hobbies"
                  value={editRequestsDetails?.targetDetails?.hobbies || "N/A"}
                />
                <Item
                  label="Relationship Status"
                  value={editRequestsDetails?.targetDetails?.relationshipStatus}
                />
                {editRequestsDetails?.targetDetails?.relationshipStatus ===
                  "Married" && (
                    <>
                      <Item
                        label="Spouse Name"
                        value={editRequestsDetails?.targetDetails?.spouseName}
                      />
                      <Item
                        label="Wedding Anniversary"
                        value={handleDateFormat(
                          editRequestsDetails?.targetDetails?.weddingAnniversary
                        )}
                      />
                    </>
                  )}
                <Item
                  label="Academic Interest"
                  value={editRequestsDetails?.targetDetails?.academicInterest}
                />
              </div>
            </div>

            <div className="p-4 mb-6 bg-white rounded shadow">
              <h2 className="mb-4 text-lg font-semibold uppercase">Address</h2>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                <Item
                  label="Residence Address"
                  value={editRequestsDetails?.targetDetails?.residenceAddress}
                />
                <Item
                  label="City/Town/Village"
                  value={editRequestsDetails?.targetDetails?.cityTownVillage}
                />
                <Item
                  label="District"
                  value={editRequestsDetails?.targetDetails?.district}
                />
                <Item
                  label="State"
                  value={editRequestsDetails?.targetDetails?.state}
                />
                <Item
                  label="Pincode"
                  value={editRequestsDetails?.targetDetails?.pincode}
                />
                <Item
                  label="Landmark"
                  value={editRequestsDetails?.targetDetails?.landmark}
                />
              </div>
            </div>

            {(editRequestsDetails?.targetDetails?.typeOfDoctorProfile ===
              "Physician" ||
              editRequestsDetails?.targetDetails?.typeOfDoctorProfile ===
              "Surgeon") &&
              Array.isArray(
                editRequestsDetails?.targetDetails?.hospitalsAssociatedWith
              ) && (
                <div className="p-4 mb-6 bg-white rounded shadow">
                  <h2 className="mb-4 text-lg font-semibold uppercase">
                    Hospitals Associated With
                  </h2>
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {editRequestsDetails.targetDetails.hospitalsAssociatedWith.map(
                      (hosp, idx) => (
                        <div
                          key={hosp?._id || idx}
                          className="p-3 rounded border"
                        >
                          <Item
                            label="Hospital Name"
                            value={hosp?.hospitalName}
                          />
                          <Item
                            label="Days"
                            value={
                              Array.isArray(hosp?.days)
                                ? hosp.days.join(", ")
                                : "N/A"
                            }
                          />
                          <Item
                            label="Timings"
                            value={handleTimeRange(hosp?.timings)}
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {editRequestsDetails?.targetDetails?.typeOfDoctorProfile ===
              "Surgeon" &&
              Array.isArray(
                editRequestsDetails?.targetDetails?.surgeryDays
              ) && (
                <div className="p-4 mb-6 bg-white rounded shadow">
                  <h2 className="mb-4 text-lg font-semibold uppercase">
                    Surgery Days
                  </h2>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-6">
                    {editRequestsDetails?.targetDetails.surgeryDays.length > 0
                      ? editRequestsDetails.targetDetails.surgeryDays.map(
                        (day, idx) => (
                          <Item
                            key={idx}
                            label={`Day ${idx + 1}`}
                            value={day}
                          />
                        )
                      )
                      : "N/A"}
                  </div>
                </div>
              )}

            {editRequestsDetails?.targetDetails?.typeOfDoctorProfile ===
              "Surgeon" &&
              Array.isArray(
                editRequestsDetails?.targetDetails?.typeOfSurgeryPerformed
              ) && (
                <div className="p-4 mb-6 bg-white rounded shadow">
                  <h2 className="mb-4 text-lg font-semibold uppercase">
                    Types Of Surgery Performed
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {editRequestsDetails.targetDetails.typeOfSurgeryPerformed.map(
                      (surg, idx) => (
                        <div
                          key={surg?._id || idx}
                          className="p-3 rounded border"
                        >
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
                      )
                    )}
                  </div>
                </div>
              )}

            <div className="p-4 mb-6 bg-white rounded shadow">
              <h2 className="mb-4 text-lg font-semibold uppercase">
                Educational & Professional Background
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <Item
                  label="Graduation Institute"
                  value={
                    editRequestsDetails?.targetDetails?.graduation
                      ?.instituteName
                  }
                />
                <Item
                  label="Graduation Year"
                  value={
                    typeof editRequestsDetails?.targetDetails?.graduation
                      ?.yearOfPassing === "number"
                      ? String(
                        editRequestsDetails?.targetDetails?.graduation
                          ?.yearOfPassing
                      )
                      : editRequestsDetails?.targetDetails?.graduation
                        ?.yearOfPassing
                  }
                />
                <Item
                  label="Post Graduation Institute"
                  value={
                    editRequestsDetails?.targetDetails?.postGraduation
                      ?.instituteName || "N/A"
                  }
                />
                <Item
                  label="Post Graduation Year"
                  value={
                    editRequestsDetails?.targetDetails?.postGraduation
                      ?.yearOfPassing || "N/A"
                  }
                />
              </div>
            </div>
          </>
          <Box
            sx={{
              display: "flex",
              flexDirection:
                editRequestsDetails?.status === "Approved" ||
                  editRequestsDetails?.status === "Rejected"
                  ? "column"
                  : "row",
              gap:
                editRequestsDetails?.status === "Approved" || "Rejected"
                  ? 2
                  : 3,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {" "}
            {editRequestsDetails?.status === "Approved" ? (
              <Typography color="success" fontWeight={"bold"}>
                {" "}
                Request Approved Successfully{" "}
              </Typography>
            ) : editRequestsDetails?.status === "Rejected" ? (
              <Typography color="error" fontWeight={"bold"}>
                {" "}
                Request Rejected Successfully{" "}
              </Typography>
            ) : (
              <>
                {" "}
                <Button
                  variant={3}
                  text="Reject"
                  onClick={() => handleRequestAction("reject")}
                />{" "}
                <Button
                  variant={1}
                  text="Approve"
                  onClick={() => handleRequestAction("approve")}
                />{" "}
              </>
            )}{" "}
            <Button variant={2} text="Cancel" onClick={() => navigate(-1)} />{" "}
          </Box>
        </>
      )}
    </div>
  );
};

export default IndRequestActions;
