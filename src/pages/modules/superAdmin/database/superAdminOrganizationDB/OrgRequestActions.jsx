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

const OrgRequestActions = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { loading, employeeEditRequest, editRequestsDetails, requestAction } =
    useDatabase();

  console.log("Data", editRequestsDetails);

  useEffect(() => {
    employeeEditRequest(id);
  }, []);

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
            text: "View Orgnizational Requests",
            href: `/database/approvalrequest/viewrequests/${id}`,
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
          <>
            <div className="bg-white shadow rounded p-4 mb-4">
              <h2 className="text-lg font-semibold mb-4 uppercase">
                Basic Organizational Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Item
                  label="Hospital Name"
                  value={
                    editRequestsDetails?.targetDetails?.Basic?.hospitalName
                  }
                />
                <Item
                  label="Segment"
                  value={editRequestsDetails?.targetDetails?.Basic?.segment}
                />
                <Item
                  label="Type of Hospital"
                  value={
                    editRequestsDetails?.targetDetails?.Basic?.typeOfHospital
                  }
                />
                <Item
                  label="Organization Type"
                  value={
                    editRequestsDetails?.targetDetails?.Basic
                      ?.typeOfOrgOrHospital
                  }
                />
                <Item
                  label="Govt Type"
                  value={editRequestsDetails?.targetDetails?.Basic?.ifGovt}
                />
                <Item
                  label="Address"
                  value={editRequestsDetails?.targetDetails?.Basic?.address}
                />
                <Item
                  label="Email"
                  value={
                    editRequestsDetails?.targetDetails?.Basic?.emailAddress
                  }
                />
              </div>
            </div>
            {/* HOSPITAL DATA */}
            <div className="bg-white shadow rounded p-4 mb-4">
              <h2 className="text-lg font-semibold mb-4 uppercase">
                Hospital Data
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Item
                  label="Total Beds"
                  value={
                    editRequestsDetails?.targetDetails?.hospitalData?.totalBeds
                  }
                />
                <Item
                  label="Total ICU Beds"
                  value={
                    editRequestsDetails?.targetDetails?.hospitalData
                      ?.totalICUBeds
                  }
                />
                <Item
                  label="Total Operation Theaters"
                  value={
                    editRequestsDetails?.targetDetails?.hospitalData?.totalOT
                  }
                />
              </div>

              {/* Specialities */}
              {editRequestsDetails?.targetDetails?.hospitalData?.specialities
                ?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-md font-semibold mb-3">Specialities</h3>
                    {editRequestsDetails.targetDetails.hospitalData.specialities.map(
                      (spec, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-4 mb-4 bg-gray-50 shadow-sm"
                        >
                          <h4 className="font-semibold text-gray-800 mb-2">
                            {spec.name}
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
                            <Item
                              label="Total Surgeries (Calendar Year)"
                              value={spec.totalSurgeriesCalenderYear}
                            />
                          </div>

                          {spec.surgeries?.length > 0 && (
                            <div>
                              <h5 className="font-medium mb-2">Surgeries</h5>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {spec.surgeries.map((surg, sIndex) => (
                                  <Item
                                    key={sIndex}
                                    label={surg.surgeryType}
                                    value={surg.numberOfSurgeries}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                )}
            </div>
            {/* LAUNDRY TYPE */}
            <div className="bg-white shadow rounded p-4 mb-4">
              <h2 className="text-lg font-semibold mb-4 uppercase">
                Laundry Type
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Item
                  label="Laundry Type"
                  value={
                    editRequestsDetails?.targetDetails?.Laundry?.laundryType ??
                    "-"
                  }
                />

                <Item
                  label="Total Load Per Day"
                  value={
                    editRequestsDetails?.targetDetails?.Laundry?.laundryType ??
                    "-"
                  }
                />
                <Item
                  label="Total Man Power"
                  value={
                    editRequestsDetails?.targetDetails?.Laundry?.laundryType ??
                    "-"
                  }
                />
                <Item
                  label="Cost Per Bed & All Are Included (If Outsourced)"
                  value={
                    editRequestsDetails?.targetDetails?.Laundry?.laundryType ??
                    "-"
                  }
                />
              </div>
            </div>
            {/* KITCHEN */}
            <div className="bg-white shadow rounded p-4 mb-4">
              <h2 className="text-lg font-semibold mb-4 uppercase">Kitchen</h2>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Item
                  label="Kitchen Type"
                  value={
                    editRequestsDetails?.targetDetails?.kitchen?.totalCapacity
                  }
                />
                <Item
                  label="Total Capacity"
                  value={
                    editRequestsDetails?.targetDetails?.kitchen?.totalCapacity
                  }
                />
                <Item
                  label="Breakfast"
                  value={editRequestsDetails?.targetDetails?.kitchen?.breakfast}
                />
                <Item
                  label="Lunch"
                  value={editRequestsDetails?.targetDetails?.kitchen?.lunch}
                />
                <Item
                  label="Dinner"
                  value={editRequestsDetails?.targetDetails?.kitchen?.dinner}
                />
                <Item
                  label="Afternoon Tea"
                  value={
                    editRequestsDetails?.targetDetails?.kitchen?.afternoonTea
                  }
                />
                <Item
                  label="Late Night Milk"
                  value={
                    editRequestsDetails?.targetDetails?.kitchen?.lateNightMilk
                  }
                />
              </div>
            </div>

            <div className="bg-white shadow rounded p-4 mb-4">
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">STP</h2>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <Item
                    label="STP Status"
                    value={editRequestsDetails?.targetDetails?.stp?.stpStatus}
                  />
                  <Item
                    label="STP Capacity"
                    value={editRequestsDetails?.targetDetails?.stp?.stpCapacity}
                  />
                  <Item
                    label="Year of Installation"
                    value={
                      editRequestsDetails?.targetDetails?.stp
                        ?.yearOfInstallation
                    }
                  />
                </div>
              </div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">ETP</h2>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <Item
                    label="ETP Status"
                    value={editRequestsDetails?.targetDetails?.etp?.etpStatus}
                  />
                  <Item
                    label="ETP Capacity"
                    value={editRequestsDetails?.targetDetails?.etp?.etpCapacity}
                  />
                  <Item
                    label="Year of Installation"
                    value={
                      editRequestsDetails?.targetDetails?.etp
                        ?.yearOfInstallation
                    }
                  />
                </div>
              </div>
            </div>

            {/* WASTE & OTHER INFO */}
            <div className="bg-white shadow rounded p-4 mb-4">
              {/* Bio-Medical Waste */}
              <div className="mb-4">
                <h2 className="text-md font-semibold mb-2 text-lg">
                  Bio-Medical Waste
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <Item
                    label="Year of Installation"
                    value={
                      editRequestsDetails?.targetDetails?.bioMedicalWaste
                        ?.yearOfInstallationOrOutsideContact
                    }
                  />
                  <Item
                    label="Cost Per Bed"
                    value={
                      editRequestsDetails?.targetDetails?.bioMedicalWaste
                        ?.whatIsTheCostPerBed
                    }
                  />
                  <Item
                    label="Total Waste Per Day"
                    value={
                      editRequestsDetails?.targetDetails?.bioMedicalWaste
                        ?.totalWastePerDay
                    }
                  />
                </div>
              </div>{" "}
              {/* Solid Waste */}
              <div className="mb-4">
                <h2 className="text-md font-semibold mb-2 text-lg">
                  Solid Waste
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <Item
                    label="Year of Installation"
                    value={
                      editRequestsDetails?.targetDetails?.solidWaste
                        ?.yearOfInstallationOrOutsideContact
                    }
                  />
                  <Item
                    label="Cost Per Bed"
                    value={
                      editRequestsDetails?.targetDetails?.solidWaste
                        ?.whatIsTheCostPerBed
                    }
                  />
                  <Item
                    label="Total Waste Per Day"
                    value={
                      editRequestsDetails?.targetDetails?.solidWaste
                        ?.totalWastePerDay
                    }
                  />
                </div>
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

export default OrgRequestActions;
