import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { X, Pencil, Send } from "lucide-react";
import {
  ViewIcon,
} from "../../../../../assets/CommonAssets";
import Pagination from "../../../../../components/uiComponents/pagination/Pagination";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import {
  TableHeader,
} from "../../../../../components/uiComponents/DatabaseSharedComponents";
import LoaderSpinner from "../../../../../components/uiComponents/loader/LoaderSpinner";
import Button from "../../../../../components/uiComponents/button/Button";
import useDatabase from "../../../../../hooks/database/useDatabase";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import useCompany from "../../../../../hooks/common/useCompany";
import useEnviroAdminOrgDB from "../../../../../hooks/superAdminHook/superAdmindatabase/enviroDB/useEnviroAdminOrgDB";
import useAdminOrganizationDB from "../../../../../hooks/superAdminHook/superAdmindatabase/useAdminOrganizationDB";

function OrganizationalDatabase() {
  const {
    fetchAdminOrganizationalDB,
    adminOrganizationalDB,
    loading,
  } = useAdminOrganizationDB();
  const { fetchEnviroAdminOrgList,
    enviroAdminOrgList,
    loading: enviroOrgListLoading, } = useEnviroAdminOrgDB();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [openRequestModal, setOpenRequestModal] = useState(false);
  const [requestId, setRequestId] = useState();
  const { isEnviroSolution } = useCompany();

  const { editRequestSender } = useDatabase();

  const onPageChange = (data) => {
    console.log("data", data);
    setPage(data);
  };

  const onItemsPerPageChange = (data) => {
    setLimit(data);
  };

  useEffect(() => {
    if (isEnviroSolution) {
      fetchEnviroAdminOrgList(page, limit);
    } else {
      fetchAdminOrganizationalDB(page, limit);
    }
  }, [page, limit, isEnviroSolution]);

  const tableData = isEnviroSolution ? enviroAdminOrgList?.data : adminOrganizationalDB?.data;
  const tableLoading = isEnviroSolution ? enviroOrgListLoading : loading;
  const paginationData = isEnviroSolution ? enviroAdminOrgList : adminOrganizationalDB;

  console.log("Organizational DB:", adminOrganizationalDB);
  console.log("Enviro Org List:", enviroAdminOrgList);

  const handleView = (id) => () => {
    if (isEnviroSolution) {
      navigate(`/sales-executive/database/view-enviro-organization/${id}`);
    } else {
      navigate(`/sales-executive/database/view-organization/${id}`);
    }
  };

  const handleEdit = (id) => {
    if (isEnviroSolution) {
      navigate(`/sales-executive/database/edit-enviro-organization/${id}`);
    } else {
      navigate(`/sales-executive/database/edit-organization/${id}`);
    }
  };

  const handleRequest = (id) => {
    const requestData = {
      targetModel: "Organization",
      targetId: id,
    };
    editRequestSender(requestData);
    setOpenRequestModal(false);
  };

  const handleExport = () => {
    if (!adminOrganizationalDB?.data || adminOrganizationalDB.data.length === 0) {
      return;
    }
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Organizational Database", 14, 20);

    // Table columns
    const columns = [
      "Organization Name",
      "Type",
      "Speciality",
      "Email",
      "Address",
    ];

    // Table rows
    const rows = adminOrganizationalDB?.data.map((org) => [
      org.organizationName || "N/A",
      org.typeOfOrgOrHospital || "N/A",
      org.speciality || "-",
      org.emailAddress || "N/A",
      org.address || "N/A",
    ]);

    // Generate table
    autoTable(doc, {
      startY: 30,
      head: [columns],
      body: rows,
      theme: "grid",
      headStyles: {
        fillColor: [
          parseInt(theme.primaryColor.slice(1, 3), 16),
          parseInt(theme.primaryColor.slice(3, 5), 16),
          parseInt(theme.primaryColor.slice(5, 7), 16),
        ],
        textColor: [255, 255, 255],
      },
      styles: {
        fontSize: 10,
      },
    });

    // Save file
    doc.save("organizational-database.pdf");
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          minHeight: "auto",
          boxSizing: "border-box",
          padding: "3px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <TableHeader
          title="Organizational Database"
          theme={theme}
          onAddClick={() =>
            navigate(
              isEnviroSolution
                ? "/sales-executive/database/add-enviro-organization"
                : "/sales-executive/database/addnew-organization"
            )
          }
          addButtonText="Add New Organization"
          onExportClick={handleExport}
        />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: theme.secondaryColor }}>
                <TableCell sx={{ padding: 2 }}>Sr.No</TableCell>
                {isEnviroSolution ? (
                  <>
                    <TableCell sx={{ padding: 2 }}>Department Name</TableCell>
                    <TableCell sx={{ padding: 2 }}>Jurisdiction Level</TableCell>
                    <TableCell sx={{ padding: 2 }}>District</TableCell>
                    <TableCell sx={{ padding: 2 }}>State</TableCell>
                    <TableCell sx={{ padding: 2 }}>Email Address</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell sx={{ padding: 2 }}>Organization Name</TableCell>
                    <TableCell sx={{ padding: 2 }}>
                      Type Of Org Or Hospital
                    </TableCell>
                    <TableCell sx={{ padding: 2 }}>Speciality</TableCell>
                    <TableCell sx={{ padding: 2 }}>Email Address</TableCell>
                    <TableCell sx={{ padding: 2 }}>Address</TableCell>
                  </>
                )}
                <TableCell sx={{ padding: 2, textAlign: "center" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableLoading ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <div className="bg-white w-full py-4 flex justify-center items-center">
                      <LoaderSpinner />
                    </div>
                  </TableCell>
                </TableRow>
              ) : tableData?.length > 0 ? (
                tableData?.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ padding: 2 }}>{(page - 1) * limit + index + 1}</TableCell>
                    {isEnviroSolution ? (
                      <>
                        <TableCell sx={{ padding: 2 }}>{data.departmentName || "N/A"}</TableCell>
                        <TableCell sx={{ padding: 2 }}>{data.jurisdictionLevel || "N/A"}</TableCell>
                        <TableCell sx={{ padding: 2 }}>{data.district || "N/A"}</TableCell>
                        <TableCell sx={{ padding: 2 }}>{data.state || "N/A"}</TableCell>
                        <TableCell sx={{ padding: 2 }}>{data.officialEmailId || "N/A"}</TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell sx={{ padding: 2 }}>
                          {data.organizationName}
                        </TableCell>

                        <TableCell sx={{ padding: 2 }}>
                          {data.typeOfOrgOrHospital}
                        </TableCell>
                        <TableCell sx={{ padding: 2 }}>
                          {data.speciality || "-"}
                        </TableCell>
                        <TableCell sx={{ padding: 2 }}>
                          {data.emailAddress}
                        </TableCell>
                        <TableCell sx={{ padding: 2 }}>{data.address}</TableCell>
                      </>
                    )}
                    <TableCell sx={{ padding: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "16px",
                        }}
                      >
                        <IconButton onClick={handleView(data._id)}>
                          <ViewIcon color={theme.primaryColor} />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            if (data?.edit === true) {
                              handleEdit(data?._id);
                            } else {
                              setOpenRequestModal(!openRequestModal);
                              setRequestId(data?._id);
                            }
                          }}
                          title={data?.edit ? "Edit" : "Request Edit"}
                        >
                          <EditIcon
                            sx={{
                              color: data?.edit === true ? "green" : "#9CA3AF",
                              opacity: data?.edit === true ? 1 : 0.6,
                            }}
                          />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7}>
                    <div className="bg-white w-full py-4 flex justify-center items-center text-lg font-semibold">
                      No Data Found.
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Pagination
            currentPage={paginationData?.currentPage}
            totalItems={paginationData?.totalItems}
            totalPages={paginationData?.totalPages}
            onPageChange={onPageChange}
            onItemsPerPageChange={onItemsPerPageChange}
          />
        </TableContainer>

        {openRequestModal && (
          <Modal
            open={openRequestModal}
            onClose={() => setOpenRequestModal(false)}
          >
            <Box className="fixed inset-0 flex items-center justify-center ">
              {/* px-4 ensures some spacing on small screens */}
              <div className="bg-white w-[480px] max-w-sm sm:max-w-md md:max-w-lg rounded-xl shadow-lg p-6 relative">
                {/* Close button */}
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  onClick={() => setOpenRequestModal(false)}
                >
                  <X size={20} />
                </button>

                {/* Header */}
                <div className="flex items-center gap-2 mb-1">
                  <div
                    style={{
                      backgroundColor: theme?.backgroundColor || "#bfdbfe", // fallback
                      color: theme?.primaryColor || "#2563eb",
                      padding: "0.5rem", // same as p-2
                      borderRadius: "0.5rem", // same as rounded-lg
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Pencil size={18} />
                  </div>

                  <h2 className="text-lg font-semibold">
                    Edit Individual Record
                  </h2>
                </div>
                <p className="text-gray-500 text-sm mb-4">
                  Send Request to Edit Individual Record
                </p>

                {/* Message Box */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-600 text-sm mb-6">
                  Your request will be sent to the administrator for approval.
                </div>

                {/* Footer buttons */}
                <Box
                  mt={3}
                  display="flex"
                  justifyContent="flex-end"
                  gap={2}
                  flexWrap="wrap"
                >
                  <button
                    onClick={() => setOpenRequestModal(false)}
                    style={{
                      borderColor: theme?.primaryColor || "#3b82f6",
                      color: theme?.primaryColor || "#3b82f6",
                      backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        theme?.primaryColor || "#60a5fa";
                      e.currentTarget.style.color = "#fff";
                      e.currentTarget.style.borderColor =
                        theme?.highlightColor || "#60a5fa";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color =
                        theme?.primaryColor || "#3b82f6";
                      e.currentTarget.style.borderColor =
                        theme?.primaryColor || "#3b82f6";
                    }}
                    className="border rounded-lg text-base px-6 py-1 hover:scale-105 transition-all duration-300 hover:shadow-lg flex items-center gap-2"
                  >
                    Cancel
                  </button>

                  <Button
                    text="Send Request"
                    onClick={() => handleRequest(requestId)}
                    className="mt-2 sm:mt-0"
                  />
                </Box>
              </div>
            </Box>
          </Modal>
        )}
      </Box>
    </>
  );
}

export default OrganizationalDatabase;
