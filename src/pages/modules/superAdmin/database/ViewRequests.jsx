import React, { useEffect, useState } from "react";
import BreadCrumb from "../../../../components/uiComponents/breadcrumb/BreadCrumb";
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Eye } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../../../hooks/theme/useTheme";
import Pagination from "../../../../components/uiComponents/pagination/Pagination";
import { TableHeader } from "../../../../components/uiComponents/DatabaseSharedComponents";
import { useRecoilState } from "recoil";
import { getActiveStateForRequestAtom } from "../../../../state/salesExecutiveState/Individuals/IndividualsState";
import useDatabase from "../../../../hooks/database/useDatabase";
import useEnviroAdminDB from "../../../../hooks/superAdminHook/superAdmindatabase/enviroDB/useEnviroAdminDB";
import useCompany from "../../../../hooks/common/useCompany";
import LoaderSpinner from "../../../../components/uiComponents/loader/LoaderSpinner";

const ViewRequests = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();

  const [activeTab, setActiveTab] = useRecoilState(
    getActiveStateForRequestAtom
  );

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { isEnviroSolution } = useCompany();

  /* ================= DATABASE HOOK (UNCHANGED) ================= */
  const {
    loading: dbLoading,
    employeeIndividualRequest,
    employeeOrganizationRequest,
    individualEmployeeEditRequests,
    orgnizationalEmployeeEditRequests,
  } = useDatabase();

  /* ================= ENVIRO ADMIN HOOK ================= */
  const {
    loading: envLoading,
    fetchEnviroEmpAllRequest,
    enviroIndEmpEditRequests,
    enviroOrgEmpEditRequests,
    fetchEnviroOrgAllRequest,
  } = useEnviroAdminDB();

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (isEnviroSolution) {
      if (activeTab === "Individual") {
        fetchEnviroEmpAllRequest(id, page, limit);
      } else if (activeTab === "Organizational") {
        fetchEnviroOrgAllRequest(id, page, limit);
      }
    } else {
      if (activeTab === "Individual") {
        employeeIndividualRequest(id, page, limit);
      } else if (activeTab === "Organizational") {
        employeeOrganizationRequest(id, page, limit);
      }
    }
  }, [id, page, limit, isEnviroSolution, activeTab]);

  console.log("enviroIndEmpEditRequests", enviroIndEmpEditRequests);
  console.log("enviroOrgEmpEditRequests", enviroOrgEmpEditRequests);

  /* ================= PAGINATION ================= */
  const onPageChange = (data) => {
    setPage(data);
  };

  const onItemsPerPageChange = (data) => {
    setLimit(data);
    setPage(1);
  };

  /* ================= DATA SWITCH ================= */
  const individualData = isEnviroSolution
    ? enviroIndEmpEditRequests
    : individualEmployeeEditRequests;

  const organizationData = isEnviroSolution
    ? enviroOrgEmpEditRequests
    : orgnizationalEmployeeEditRequests;

  const handleIndViewRequestAction = (requestId) => {
    if (isEnviroSolution) {
      navigate(`/database/approvalrequest/viewrequests/enviro-ind-request-actions/${requestId}`);
    } else {
      navigate(`/database/approvalrequest/viewrequests/indrequestactions/${requestId}`);
    }
  };

  const handleOrgViewRequestAction = (requestId) => {
    if (isEnviroSolution) {
      navigate(`/database/approvalrequest/viewrequests/enviro-org-request-actions/${requestId}`);
    } else {
      navigate(`/database/approvalrequest/viewrequests/orgrequestactions/${requestId}`);
    }
  };

  return (
    <div className="w-full min-h-screen">
      <BreadCrumb
        linkText={[
          { text: "Database", href: "/database" },
          { text: "Approval Requests", href: "/database" },
          { text: `View ${activeTab} Requests` },
        ]}
      />

      <Box>
        {/* ================= TABS ================= */}
        <Box
          display="flex"
          justifyContent="center"
          gap={2}
          p={2}
          bgcolor="#f5f5f5"
          borderRadius={2}
        >
          {["Individual", "Organizational"].map((tab) => (
            <Box
              key={tab}
              px={3}
              py={1}
              borderRadius={1}
              sx={{
                cursor: "pointer",
                backgroundColor:
                  activeTab === tab ? theme.primaryColor : "transparent",
                color: activeTab === tab ? "#fff" : "#000",
              }}
              onClick={() => setActiveTab(tab)}
            >
              {tab} Database
            </Box>
          ))}
        </Box>

        {dbLoading || envLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="50vh"
          >
            <LoaderSpinner />
          </Box>
        ) : (
          <>
            {/* ================= INDIVIDUAL TABLE ================= */}
            {activeTab === "Individual" && (
              <Box mt={2}>
                <TableHeader
                  title={`Update Request List From ${individualData?.requestedBy?.fullName || "-"
                    }`}
                  theme={theme}
                />

                <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: theme.secondaryColor }}>
                        {(isEnviroSolution
                          ? [
                            "Sr.No",
                            "Profile Type",
                            "Full Name",
                            "FPO Name",
                            "Request Status",
                            "Action",
                          ]
                          : [
                            "Sr.No",
                            "Hospital Name",
                            "Designation",
                            "Person Name",
                            "Speciality",
                            "Profile",
                            "Request Status",
                            "Action",
                          ]
                        ).map((head) => (
                          <TableCell key={head} sx={{ fontWeight: 600 }}>
                            {head}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {individualData?.individualRequests?.length > 0 ? (
                        individualData.individualRequests.map((req, index) => (
                          <TableRow key={req._id}>
                            <TableCell>{index + 1}</TableCell>
                            {isEnviroSolution ? (
                              <>
                                <TableCell>
                                  {req?.targetDetails?.typeOfProfile || "-"}
                                </TableCell>
                                <TableCell>
                                  {req?.targetDetails?.fullName || "-"}
                                </TableCell>
                                <TableCell>
                                  {req?.targetDetails?.fpoName || "-"}
                                </TableCell>
                              </>
                            ) : (
                              <>
                                <TableCell>
                                  {req?.targetDetails?.hospitalName || "-"}
                                </TableCell>
                                <TableCell>
                                  {req?.targetDetails?.designation}
                                </TableCell>
                                <TableCell>
                                  {req?.targetDetails?.fullName}
                                </TableCell>
                                <TableCell>
                                  {req?.targetDetails?.speciality}
                                </TableCell>
                                <TableCell>
                                  {req?.targetDetails?.typeOfDoctorProfile}
                                </TableCell>
                              </>
                            )}

                            <TableCell
                              sx={{
                                color:
                                  req?.status === "Approved"
                                    ? "green"
                                    : req?.status === "Rejected"
                                      ? "red"
                                      : "orange",
                                fontWeight: 600,
                              }}
                            >
                              {req?.status}
                            </TableCell>

                            <TableCell>
                              <IconButton
                                onClick={() => {
                                  handleIndViewRequestAction(req._id);
                                }}
                              >
                                <Eye color={theme.primaryColor} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} align="center">
                            No Data Found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  <Pagination
                    currentPage={individualData?.pagination?.currentPage}
                    totalItems={individualData?.pagination?.totalRequests}
                    totalPages={individualData?.pagination?.totalPages}
                    onPageChange={onPageChange}
                    onItemsPerPageChange={onItemsPerPageChange}
                  />
                </TableContainer>
              </Box>
            )}

            {/* ================= ORGANIZATIONAL TABLE ================= */}
            {activeTab === "Organizational" && (
              <Box mt={2}>
                <TableHeader
                  title={`Update Request List From ${organizationData?.requestedBy?.fullName || "-"
                    }`}
                  theme={theme}
                />

                <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: theme.secondaryColor }}>
                        {(isEnviroSolution
                          ? [
                            "Sr.No",
                            "Department Name",
                            "District",
                            "State",
                            "Jurisdiction Level",
                            "Request Status",
                            "Action",
                          ]
                          : [
                            "Sr.No",
                            "Organization Name",
                            "Type",
                            "Speciality",
                            "Email",
                            "Address",
                            "Request Status",
                            "Action",
                          ]
                        ).map((head) => (
                          <TableCell key={head} sx={{ fontWeight: 600 }}>
                            {head}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {(isEnviroSolution
                        ? organizationData?.orgRequests
                        : organizationData?.organizationRequests
                      )?.length > 0 ? (
                        (isEnviroSolution
                          ? organizationData.orgRequests
                          : organizationData.organizationRequests
                        ).map((req, index) => (
                          <TableRow key={req._id}>
                            <TableCell>{index + 1}</TableCell>
                            {isEnviroSolution ? (
                              <>
                                <TableCell>
                                  {req?.targetDetails?.departmentName}
                                </TableCell>
                                <TableCell>
                                  {req?.targetDetails?.district}
                                </TableCell>
                                <TableCell>
                                  {req?.targetDetails?.state}
                                </TableCell>
                                <TableCell>
                                  {req?.targetDetails?.jurisdictionLevel}
                                </TableCell>
                              </>
                            ) : (
                              <>
                                <TableCell>
                                  {req?.targetDetails?.Basic?.hospitalName}
                                </TableCell>
                                <TableCell>
                                  {
                                    req?.targetDetails?.Basic
                                      ?.typeOfOrgOrHospital
                                  }
                                </TableCell>
                                <TableCell>
                                  {req?.targetDetails?.hospitalData?.specialities
                                    ?.map((s) => s.name)
                                    .join(", ")}
                                </TableCell>
                                <TableCell>
                                  {req?.targetDetails?.Basic?.emailAddress}
                                </TableCell>
                                <TableCell>
                                  {req?.targetDetails?.Basic?.address}
                                </TableCell>
                              </>
                            )}
                            <TableCell
                              sx={{
                                color:
                                  req?.status === "Approved"
                                    ? "green"
                                    : req?.status === "Rejected"
                                      ? "red"
                                      : "orange",
                                fontWeight: 600,
                              }}
                            >
                              {req?.status}
                            </TableCell>
                            <TableCell>
                              <IconButton
                                onClick={() =>
                                  handleOrgViewRequestAction(req._id)
                                }
                              >
                                <Eye color={theme.primaryColor} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} align="center">
                            No Data Found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  <Pagination
                    currentPage={organizationData?.pagination?.currentPage}
                    totalItems={organizationData?.pagination?.totalRequests}
                    totalPages={organizationData?.pagination?.totalPages}
                    itemsPerPage={limit}
                    onPageChange={onPageChange}
                    onItemsPerPageChange={onItemsPerPageChange}
                    showRowPerPage={true}
                  />
                </TableContainer>
              </Box>
            )}
          </>
        )}
      </Box>
    </div>
  );
};

export default ViewRequests;
