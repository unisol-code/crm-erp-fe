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
import { X, Pencil } from "lucide-react";
import { ViewIcon } from "../../../../../assets/CommonAssets";
import Pagination from "../../../../../components/uiComponents/pagination/Pagination";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import {
  TableHeader,
} from "../../../../../components/uiComponents/DatabaseSharedComponents";
import useIndividuals from "../../../../../hooks/salesExecutiveHook/Individual/useIndividual";
import LoaderSpinner from "../../../../../components/uiComponents/loader/LoaderSpinner";
import useDropdown from "../../../../../hooks/dropdown/useDropdown";
import Button from "../../../../../components/uiComponents/button/Button";
import useDatabase from "../../../../../hooks/database/useDatabase";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import useEnviroIndividualDB from "../../../../../hooks/salesExecutiveHook/salesExecutiveDB/enviroIndividualDB/useEnviroIndividualDB";
import useCompany from "../../../../../hooks/common/useCompany";

function IndividualDatabase() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [openRequestModal, setOpenRequestModal] = useState(false);
  const [requestId, setRequestId] = useState(null);
  const { isEnviroSolution } = useCompany();

  /* ===================== DROPDOWN ===================== */
  const {
    loading: dropLoading,
    profile,
    enviroprofile,
    profileState,
    enviroindiviualdropdown,
  } = useDropdown();

  const dropdownOptions = isEnviroSolution ? enviroprofile : profile;

  /* ===================== HEALTHCARE ===================== */
  const {
    getAllindividual,
    loading,
    getAllindividualDeatils,
  } = useIndividuals();

  /* ===================== ENVIRO ===================== */
  const {
    loading: enviroIndividualLoading,
    enviroIndividualList,
    fetchEnviroIndividualList,
  } = useEnviroIndividualDB();

  const { editRequestSender } = useDatabase();

  /* ===================== FETCH DROPDOWN ===================== */
  useEffect(() => {
    if (isEnviroSolution) {
      enviroindiviualdropdown();
      setSelectedDoctor(null);
    } else {
      profileState();
    }
  }, [isEnviroSolution]);

  /* ===================== DEFAULT DROPDOWN ===================== */
  useEffect(() => {
    if (
      Array.isArray(dropdownOptions) &&
      dropdownOptions.length > 0 &&
      !selectedDoctor &&
      !isEnviroSolution
    ) {
      setSelectedDoctor(dropdownOptions[0]);
    }
  }, [dropdownOptions, isEnviroSolution]);

  /* ===================== FETCH DATA ===================== */
  useEffect(() => {
    if (isEnviroSolution) {
      fetchEnviroIndividualList(page, limit);
    } else if (selectedDoctor) {
      getAllindividual(page, limit, selectedDoctor);
    }
  }, [page, limit, selectedDoctor, isEnviroSolution]);

  /* ===================== PAGINATION (UNCHANGED) ===================== */
  const onPageChange = (data) => {
    setPage(data);
  };

  const onItemsPerPageChange = (data) => {
    setLimit(data);
    setPage(1);
  };

  /* ===================== TABLE SOURCE ===================== */
  const tableLoading = isEnviroSolution
    ? enviroIndividualLoading
    : loading;

  const tableData = isEnviroSolution
    ? enviroIndividualList?.data || []
    : getAllindividualDeatils?.data || [];

  const paginationData = isEnviroSolution
    ? enviroIndividualList
    : getAllindividualDeatils;

  /* ===================== HANDLERS ===================== */
  const handleView = (id) => {
    if (isEnviroSolution) {
      navigate(`/sales-executive/database/view-enviro-individual/${id}`);
    } else {
      navigate(`/sales-executive/database/view-individual/${id}`);
    }
  };

  const handleEdit = (id) => {
    // if (isEnviroSolution) {
    //   navigate(`/sales-executive/database/edit-enviro-individual/${id}`);
    // } else {
    navigate(`/sales-executive/database/edit-individual/${id}`);
    // }
  };

  const handleRequest = (id) => {
    editRequestSender({
      targetModel: "Individual",
      targetId: id,
    });
    if (isEnviroSolution) {
      fetchEnviroIndividualList(page, limit);
    } else {
      getAllindividual(page, limit, selectedDoctor);
    }
    setOpenRequestModal(false);
  };

  const handleChange = (option) => {
    setSelectedDoctor(option ? option.value : null);
    setPage(1);
  };

  const selectProps = !isEnviroSolution
    ? {
      options: dropdownOptions?.map((p) => ({
        label: p,
        value: p,
      })),
      value: selectedDoctor
        ? { label: selectedDoctor, value: selectedDoctor }
        : null,
      onChange: handleChange,
      placeholder: "Select Doctor Type",
      isLoading: dropLoading,
    }
    : null;

  const handleExport = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Individual Database", 14, 20);

    const columns = isEnviroSolution
      ? ["Name", "Lead Owner", "Product", "Status"]
      : [
        "Hospital / Dept",
        "Designation",
        "Person Name",
        "Speciality",
        "Profile",
        "City",
      ];

    const rows = tableData.map((item) =>
      isEnviroSolution
        ? [
          item?.name || "N/A",
          item?.leadOwner || "N/A",
          item?.productName || "N/A",
          item?.status || "N/A",
        ]
        : [
          item?.hospitalName || item?.department || "N/A",
          item?.designation || "N/A",
          item?.personName || "N/A",
          item?.speciality || "N/A",
          item?.profileOfCustomer || "N/A",
          item?.city || "N/A",
        ]
    );

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
    });

    doc.save("individual-database.pdf");
  };


  /* ===================== UI ===================== */
  return (
    <>
      <TableHeader
        theme={theme}
        title="Individual Database"
        onAddClick={() =>
          navigate("/sales-executive/database/individual")
        }
        addButtonText="Add New Individual"
        selectProps={selectProps}
        onExportClick={handleExport}
      />

      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.secondaryColor }}>
              {[
                "Sr. No",
                !isEnviroSolution && "Hospital / Department",
                !isEnviroSolution && "Designation",
                !isEnviroSolution && "Person Name",
                !isEnviroSolution && "Speciality",
                !isEnviroSolution && "Profile",
                !isEnviroSolution && "City",
                isEnviroSolution && "Name",
                isEnviroSolution && "Lead owner",
                // isEnviroSolution && "Customer type",
                isEnviroSolution && "Product name",
                // isEnviroSolution && "Lead generated through",
                isEnviroSolution && "Status",
                "Action",
              ].map(
                (head, i) =>
                  head && (
                    <TableCell
                      key={i}
                      sx={{ fontWeight: 600 }}
                      align={head === "Action" ? "center" : "left"}
                    >
                      {head}
                    </TableCell>
                  )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableLoading ? (
              <TableRow>
                <TableCell colSpan={isEnviroSolution ? 6 : 8} >
                  <div className="bg-white w-full py-4 flex justify-center items-center">
                    <LoaderSpinner />
                  </div>
                </TableCell>
              </TableRow>
            ) : tableData.length > 0 ? (
              tableData.map((data, index) => (
                <TableRow key={index} hover>
                  <TableCell>
                    {(page - 1) * limit + index + 1}
                  </TableCell>
                  {!isEnviroSolution && (
                    <>
                      <TableCell>
                        {data?.hospitalName ||
                          data?.department ||
                          "N/A"}
                      </TableCell>
                      <TableCell>{data?.designation || "N/A"}</TableCell>
                      <TableCell>{data?.personName || "N/A"}</TableCell>

                      <TableCell>{data?.speciality || "N/A"}</TableCell>

                      <TableCell>
                        {data?.profileOfCustomer || "N/A"}
                      </TableCell>
                      <TableCell>{data?.city || "N/A"}</TableCell>
                    </>)}
                  {isEnviroSolution && (
                    <>
                      <TableCell>{data?.name}</TableCell>
                      <TableCell>{data?.leadOwner || "-"}</TableCell>
                      {/* <TableCell>{data?.customerType || "N/A"}</TableCell> */}
                      <TableCell>{data?.productName || "N/A"}</TableCell>
                      <TableCell>{data?.status || "N/A"}</TableCell>
                    </>
                  )}
                  <TableCell align="center">
                    <IconButton onClick={() => handleView(data?._id)}>
                      <ViewIcon color={theme.primaryColor} />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        if (data?.edit) handleEdit(data?._id);
                        else {
                          setRequestId(data?._id);
                          setOpenRequestModal(true);
                        }
                      }}
                    >
                      <EditIcon
                        sx={{
                          color: data?.edit
                            ? "green"
                            : isEnviroSolution ? "#D1D5DB" : theme.primaryColor,
                        }}
                      />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={isEnviroSolution ? 6 : 8} align="center">
                  No Data Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* {!tableLoading && tableData.length > 0 && ( */}
        <Pagination
          currentPage={paginationData?.currentPage}
          totalItems={paginationData?.totalItems}
          totalPages={paginationData?.totalPages}
          itemsPerPage={limit}
          onPageChange={onPageChange}
          onItemsPerPageChange={onItemsPerPageChange}
        />
        {/* )} */}
      </TableContainer>

      {/* ===================== REQUEST MODAL ===================== */}
      {openRequestModal && (
        <Modal open onClose={() => setOpenRequestModal(false)}>
          <Box className="fixed inset-0 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-[420px] relative">
              <button
                className="absolute top-3 right-3"
                onClick={() => setOpenRequestModal(false)}
              >
                <X size={18} />
              </button>
              <div className="flex items-center gap-2 mb-3">
                <Pencil size={18} />
                <h2 className="font-semibold">Edit Request</h2>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Your request will be sent for approval.
              </p>
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button
                  text="Send Request"
                  onClick={() => handleRequest(requestId)}
                />
              </Box>
            </div>
          </Box>
        </Modal>
      )}
    </>
  );
}

export default IndividualDatabase;
