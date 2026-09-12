import React, { useEffect, useState } from "react";
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
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DeleteOutline } from "@mui/icons-material";
import { X, Pencil, Send } from "lucide-react";
import { AddIcon, ViewIcon } from "../../../../../assets/CommonAssets";
import Pagination from "../../../../../components/uiComponents/pagination/Pagination";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import { themes } from "../../../../../components/theme/Themes";
import {
  TableHeader,
} from "../../../../../components/uiComponents/DatabaseSharedComponents";
import useDatabase from "../../../../../hooks/database/useDatabase";
import useAdminOrganizationDB from "../../../../../hooks/superAdminHook/superAdmindatabase/useAdminOrganizationDB";
import LoaderSpinner from "../../../../../components/uiComponents/loader/LoaderSpinner";
import { Modal } from "@mui/material";
import Button from "../../../../../components/uiComponents/button/Button";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import useCompany from "../../../../../hooks/common/useCompany";
import useEnviroAdminOrgDB from "../../../../../hooks/superAdminHook/superAdmindatabase/enviroDB/useEnviroAdminOrgDB";
import ReactSelect from "react-select";

const SuperAdminOrganizationDatabase = () => {
  const {
    fetchAdminOrganizationalDB,
    adminOrganizationalDB,
    loading,
    deleteAdminOrganization
  } = useAdminOrganizationDB();

  const { 
    fetchEnviroAdminOrgList,
    enviroAdminOrgList, 
    deleteEnviroAdminOrg,
    loading: enviroOrgListLoading, 
  } = useEnviroAdminOrgDB();

  const navigate = useNavigate();
  const { theme } = useTheme();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [openRequestModal, setOpenRequestModal] = useState(false);
  const [requestId, setRequestId] = useState();
  const { isEnviroSolution } = useCompany();
  
  const [search, setSearch] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [organizationType, setOrganizationType] = useState("");
  
  const onPageChange = (data) => {
    setPage(data);
  };
  const { editRequestSender } = useDatabase();
  const onItemsPerPageChange = (data) => {
    setLimit(data);
    setPage(1);
  };
  const currentTheme = themes.light;

  const sectorOptions = [
    { label: "Agriculture", value: "Agriculture" },
    { label: "Waste Management", value: "Waste Management" },
  ];

  const orgTypeOptions = {
    Agriculture: [
      { label: "FPO", value: "FPO" },
      { label: "FPC", value: "FPC" },
      { label: "CMRC", value: "CMRC" },
      { label: "BACHAT GAT", value: "BACHAT GAT" },
      { label: "SELF HELP GROUP", value: "SELF HELP GROUP" },
      { label: "GOVERNMENT", value: "GOVERNMENT" },
    ],
    "Waste Management": [
      { label: "PRIVATE", value: "PRIVATE" },
      { label: "GOVERNMENT", value: "GOVERNMENT" },
    ],
  };

  const selectedSector = sectorOptions.find((s) => s.value === sectionName) || null;
  const availableOrgTypes = selectedSector ? orgTypeOptions[selectedSector.value] || [] : [];

  useEffect(() => {
    if (isEnviroSolution) {
      fetchEnviroAdminOrgList(page, limit, search, sectionName, organizationType);
    } else {
      fetchAdminOrganizationalDB(page, limit);
    }
  }, [page, limit, isEnviroSolution, search, sectionName, organizationType]);

  console.log("Organizational DB:", adminOrganizationalDB);
  console.log("Enviro Org List:", enviroAdminOrgList);

  const handleView = (id) => () => {
    if (isEnviroSolution) {
      navigate(`/database/edit-enviro-organization/${id}`);
    } else {
      navigate(`/database/view-organization/${id}`);
    }
  };

  const handleEdit = (id) => () => {
    navigate(`/database/edit-organization/${id}`);
  };

  const handleDelete = (id) => async () => {
    if (isEnviroSolution) {
      await deleteEnviroAdminOrg(id);
      await fetchEnviroAdminOrgList(page, limit);
    } else {
      await deleteAdminOrganization(id);
      await fetchAdminOrganizationalDB(page, limit);
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
    if (isEnviroSolution) {
      if (!enviroAdminOrgList?.data?.length) return;
    } else {
      if (!adminOrganizationalDB?.data?.length) return;
    }

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Super Admin - Organizational Database", 14, 20);

    if (isEnviroSolution) {
      const columns = [
        "Added By",
        "Organization Name",
        "Organization Type",
        "Section Name",
        "District",
        "State",
        "City/Town/Village",
      ];

      const rows = enviroAdminOrgList.data.map((org) => [
        org?.addedBy || "N/A",
        org?.organizationName || "N/A",
        org?.OrganizationType || "-",
        org?.sectionName || "-",
        org?.district || "-",
        org?.state || "-",
        org?.cityTownVillage || "-",
      ]);

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
        styles: { fontSize: 9 },
      });
    } else {
      const columns = [
        "Sales Person",
        "Organization Name",
        "Specialities",
        "District",
        "State",
        "Region",
      ];

      const rows = adminOrganizationalDB.data.map((org) => [
        org?.salesPersonName || "N/A",
        org?.organizationName || "N/A",
        org?.specialities?.map((s) => s.name).join(", ") || "-",
        org?.district || "-",
        org?.state || "-",
        org?.region || "-",
      ]);

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
        styles: { fontSize: 9 },
      });
    }

    doc.save("super-admin-organizational-database.pdf");
  };

  const tableData = isEnviroSolution ? enviroAdminOrgList?.data : adminOrganizationalDB?.data;
  const tableLoading = isEnviroSolution ? enviroOrgListLoading : loading;
  const paginationData = isEnviroSolution ? enviroAdminOrgList : adminOrganizationalDB;

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
          showExport
          onAddClick={() => navigate(isEnviroSolution ? "/database/add-enviro-organization" : "/database/addnew-organization")}
          addButtonText="Add New Organization"
          onExportClick={handleExport}
        />

        {isEnviroSolution && (
          <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
            <Box sx={{ flex: "1 1 250px", minWidth: "200px" }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search organizations..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </Box>
            <Box sx={{ flex: "1 1 200px", minWidth: "180px" }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Name</label>
              <ReactSelect
                options={sectorOptions}
                value={sectorOptions.find((s) => s.value === sectionName) || null}
                onChange={(selected) => {
                  setSectionName(selected?.value || "");
                  setOrganizationType("");
                  setPage(1);
                }}
                placeholder="Select Section"
                isClearable
                styles={{
                  control: (base, state) => ({
                    ...base,
                    minHeight: "42px",
                    borderRadius: "0.375rem",
                    borderColor: state.isFocused ? theme.primaryColor : "#D1D5DB",
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    padding: "0 8px",
                    fontSize: "0.95rem",
                  }),
                  placeholder: (base) => ({ ...base, color: "#9CA3AF" }),
                }}
              />
            </Box>
            <Box sx={{ flex: "1 1 200px", minWidth: "180px" }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization Type</label>
              <ReactSelect
                options={availableOrgTypes}
                value={availableOrgTypes.find((o) => o.value === organizationType) || null}
                onChange={(selected) => {
                  setOrganizationType(selected?.value || "");
                  setPage(1);
                }}
                placeholder="Select Organization Type"
                isClearable
                isDisabled={!selectedSector}
                styles={{
                  control: (base, state) => ({
                    ...base,
                    minHeight: "42px",
                    borderRadius: "0.375rem",
                    borderColor: state.isFocused ? theme.primaryColor : "#D1D5DB",
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    padding: "0 8px",
                    fontSize: "0.95rem",
                  }),
                  placeholder: (base) => ({ ...base, color: "#9CA3AF" }),
                }}
              />
            </Box>
          </Box>
        )}

        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: theme.secondaryColor }}>
                <TableCell
                  sx={{ padding: 2, fontSize: "1rem", fontWeight: 600 }}
                >
                  Sr.No
                </TableCell>
                {isEnviroSolution ? (
                  <>
                    <TableCell
                      sx={{ padding: 2, fontSize: "1rem", fontWeight: 600 }}
                    >
                      Added By
                    </TableCell>
                    <TableCell
                      sx={{ padding: 2, fontSize: "1rem", fontWeight: 600 }}
                    >
                      Organization Name
                    </TableCell>
                    <TableCell
                      sx={{ padding: 2, fontSize: "1rem", fontWeight: 600 }}
                    >
                      Organization Type
                    </TableCell>
                      <TableCell
                      sx={{ padding: 2, fontSize: "1rem", fontWeight: 600 }}
                    >
                      Section Name
                    </TableCell>
                    <TableCell
                      sx={{ padding: 2, fontSize: "1rem", fontWeight: 600 }}
                    >
                      District
                    </TableCell>
                    <TableCell
                      sx={{ padding: 2, fontSize: "1rem", fontWeight: 600 }}
                    >
                      State
                    </TableCell>
                    <TableCell
                      sx={{ padding: 2, fontSize: "1rem", fontWeight: 600 }}
                    >
                      City/Town/Village
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell
                      sx={{ padding: 2, fontSize: "1rem", fontWeight: 600 }}
                    >
                      Sales Person Name
                    </TableCell>
                    <TableCell
                      sx={{ padding: 2, fontSize: "1rem", fontWeight: 600 }}
                    >
                      Organization Name
                    </TableCell>
                    <TableCell
                      sx={{ padding: 2, fontSize: "1rem", fontWeight: 600 }}
                    >
                      Speciality
                    </TableCell>
                  </>
                )}
                <TableCell
                  sx={{ padding: 2, fontSize: "1rem", fontWeight: 600 }}
                  align="center"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableLoading ? (
                <TableRow>
                  <TableCell colSpan={isEnviroSolution ? 6 : 5}>
                    <div className="py-8 flex items-center justify-center">
                      <LoaderSpinner />
                    </div>
                  </TableCell>
                </TableRow>
              ) : tableData?.length > 0 ? (
                tableData.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ padding: 2 }}>{(page - 1) * limit + index + 1}</TableCell>
                    {isEnviroSolution ? (
                      <>
                        <TableCell sx={{ padding: 2 }}>
                          {data.addedBy || "-"}
                        </TableCell>
                        <TableCell sx={{ padding: 2 }}>
                          {data.organizationName || "-"}
                        </TableCell>
                        <TableCell sx={{ padding: 2 }}>
                          {data.OrganizationType || "-"}
                        </TableCell>
                         <TableCell sx={{ padding: 2 }}>
                          {data.sectionName || "-"}
                        </TableCell>
                        <TableCell sx={{ padding: 2 }}>
                          {data.district || "-"}
                        </TableCell>
                        <TableCell sx={{ padding: 2 }}>
                          {data.state || "-"}
                        </TableCell>
                        <TableCell sx={{ padding: 2 }}>
                          {data.cityTownVillage || "-"}
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell sx={{ padding: 2 }}>
                          {data.salesPersonName || "-"}
                        </TableCell>
                        <TableCell sx={{ padding: 2 }}>
                          {data.organizationName || "-"}
                        </TableCell>
                        <TableCell sx={{ padding: 2 }}>
                          {data.specialities?.map((s) => s.name).join(", ") || "-"}
                        </TableCell>
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
                        <IconButton onClick={handleDelete(data._id)}>
                          <DeleteOutline sx={{ color: "red" }} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={isEnviroSolution ? 6 : 5} align="center" sx={{ py: 3 }}>
                    <Typography
                      variant="body1"
                      fontWeight={600}
                      color="text.secondary"
                    >
                      No Data Found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {!tableLoading && tableData?.length > 0 && (
            <Pagination
              currentPage={paginationData?.currentPage}
              totalItems={paginationData?.totalItems}
              totalPages={paginationData?.totalPages}
              itemsPerPage={limit}
              onPageChange={onPageChange}
              onItemsPerPageChange={onItemsPerPageChange}
            />
          )}
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
};
export default SuperAdminOrganizationDatabase;
