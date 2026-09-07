import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";
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
import useEnviroAdminIndDB from "../../../../../hooks/superAdminHook/superAdmindatabase/enviroDB/useEnviroAdminIndDB";

function IndividualDatabase() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
   const [selectedSegment, setSelectedSegment] = useState(null);
  const [typeOfProfile, setTypeOfProfile] = useState(null);
  const [openRequestModal, setOpenRequestModal] = useState(false);
  const [requestId, setRequestId] = useState(null);
  const { isEnviroSolution } = useCompany();

  /* ===================== DROPDOWN ===================== */
  const {
    loading: dropLoading,
    profile,
    enviroprofile,
    profileState, fetchSegment,segment,
    enviroindiviualdropdown,
  } = useDropdown();

  const dropdownOptions = isEnviroSolution ? enviroprofile : profile;

  /* ===================== HEALTHCARE ===================== */
  const {
    getAllindividual,
    loading,
    getAllindividualDeatils,
  } = useIndividuals();

  /* ===================== ENVIRO (Farmer) ===================== */
  const {
    loading: enviroIndividualLoading,
    enviroIndividualList,
    fetchEnviroIndividualList,
  } = useEnviroIndividualDB();

  /* ===================== ENVIRO (Gov & FPO) ===================== */
  const {
    fetchEnviroGovtOfficerList,
    fetchEnviroFPOList,
    loading: enviroGovtOfficerLoading,
    loading: enviroFPOLoading,
    enviroGovtOfficerList,
    enviroFPOList,
  } = useEnviroAdminIndDB();

  const { editRequestSender } = useDatabase();

  /* ===================== FETCH DROPDOWN ===================== */
  useEffect(() => {
    // if (isEnviroSolution) {
    //   enviroindiviualdropdown();
    //   setSelectedDoctor(null);
    //   setTypeOfProfile("Farmer");
    // } else {
    //   profileState();
    //   setTypeOfProfile(null);
    // }
      if (isEnviroSolution) {
    enviroindiviualdropdown();
    setSelectedDoctor(null);
  } else {
    fetchSegment();
    setSelectedSegment(null);
    setSelectedDoctor(null);
    setTypeOfProfile(null);
  }
  }, [isEnviroSolution]);

  /* ===================== FETCH DATA ===================== */
  useEffect(() => {
    if (isEnviroSolution && typeOfProfile) {
      if (typeOfProfile === "Farmer") {
        fetchEnviroIndividualList(page, limit);
      } else if (typeOfProfile === "Government Officer") {
        fetchEnviroGovtOfficerList(page, limit, typeOfProfile);
      } else if (typeOfProfile === "FPO") {
        fetchEnviroFPOList(page, limit, typeOfProfile);
      }
    } else if (!isEnviroSolution) {
      getAllindividual(page, limit, selectedDoctor);
    }
  }, [page, limit, selectedDoctor, isEnviroSolution, typeOfProfile]);

  /* ===================== PAGINATION ===================== */
  const onPageChange = (data) => {
    setPage(data);
  };

  const onItemsPerPageChange = (data) => {
    setLimit(data);
    setPage(1);
  };

  /* ===================== TABLE SOURCE ===================== */
  const tableLoading = isEnviroSolution
    ? typeOfProfile === "Farmer" ? enviroIndividualLoading : typeOfProfile === "Government Officer" ? enviroGovtOfficerLoading : enviroFPOLoading
    : loading;

  const tableData = isEnviroSolution
    ? typeOfProfile === "Farmer" ? enviroIndividualList?.data || [] : typeOfProfile === "Government Officer" ? enviroGovtOfficerList?.data || [] : enviroFPOList?.data || []
    : getAllindividualDeatils?.data || [];

  const paginationData = isEnviroSolution
    ? typeOfProfile === "Farmer" ? enviroIndividualList : typeOfProfile === "Government Officer" ? enviroGovtOfficerList : enviroFPOList
    : getAllindividualDeatils;

  /* ===================== HANDLERS ===================== */
  const handleView = (id, type) => {
    if (isEnviroSolution) {
      navigate(`/sales-executive/database/view-enviro-individual/${id}`, { state: { typeOfProfile: type } });
    } else {
      navigate(`/sales-executive/database/view-individual/${id}`);
    }
  };

  const handleEdit = (id, type) => {
    navigate(`/sales-executive/database/edit-individual/${id}`, { state: { typeOfProfile: type } });
  };

  const handleRequest = (id) => {
    editRequestSender({
      targetModel: "Individual",
      targetId: id,
    });
    if (isEnviroSolution) {
      if (typeOfProfile === "Farmer") fetchEnviroIndividualList(page, limit);
      else if (typeOfProfile === "Government Officer") fetchEnviroGovtOfficerList(page, limit, typeOfProfile);
      else if (typeOfProfile === "FPO") fetchEnviroFPOList(page, limit, typeOfProfile);
    } else {
      getAllindividual(page, limit, selectedDoctor);
    }
    setOpenRequestModal(false);
  };

  const handleChange = (option) => {
    if (isEnviroSolution) {
      setTypeOfProfile(option ? option.value : null);
    } else {
      setSelectedDoctor(option ? option.value : null);
    }
    setPage(1);
  };
    const handleSegmentChange = (option) => {
  const segmentValue = option?.value || null;

  setSelectedSegment(segmentValue);

  // doctor reset
  setSelectedDoctor(null);

  // selected segment ke profiles lao
  if (segmentValue) {
    profileState(segmentValue);
  }

  setPage(1);
};
  const segmentOptions = Array.isArray(segment)
  ? segment.map((item) => ({
      label: item,
      value: item,
    }))
  : [];
  const options = Array.isArray(dropdownOptions)
    ? dropdownOptions.map((item) => ({
      label: item,
      value: item,
    }))
    : [];

  const handleExport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Individual Database", 14, 20);

    let columns = [];
    let rows = [];

    if (isEnviroSolution) {
      if (typeOfProfile === "Farmer") {
        columns = ["Name", "Lead Owner", "Product", "Status"];
        rows = tableData.map((item) => [
          item?.name || "N/A",
          item?.leadOwner || "N/A",
          item?.productName || "N/A",
          item?.status || "N/A",
        ]);
      } else if (typeOfProfile === "Government Officer") {
        columns = ["Person Name", "Office Name", "Designation", "Coverage Area"];
        rows = tableData.map((item) => [
          `${item?.firstName || ""} ${item?.lastName || ""}`,
          item?.officeName || "-",
          item?.designation || "-",
          item?.districtBlockRegion || "-",
        ]);
      } else if (typeOfProfile === "FPO") {
        columns = ["FPO Name", "Registration No", "Operational Area"];
        rows = tableData.map((item) => [
          item?.fpoName || "-",
          item?.registrationNumber || "-",
          item?.operationalArea || "-",
        ]);
      }
    } else {
      columns = ["Hospital / Dept", "Designation", "Person Name", "Speciality", "Profile", "City"];
      rows = tableData.map((item) => [
        item?.hospitalName || item?.department || "N/A",
        item?.designation || "N/A",
        item?.personName || "N/A",
        item?.speciality || "N/A",
        item?.profileOfCustomer || "N/A",
        item?.city || "N/A",
      ]);
    }

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
      {/* <TableHeader
        theme={theme}
        title="Individual Database"
        onAddClick={() =>
          navigate("/sales-executive/database/individual")
        }
        addButtonText="Add New Individual"
        selectProps={{
          options,
          value: options.find((opt) => opt.value === (isEnviroSolution ? typeOfProfile : selectedDoctor)) || null,
          onChange: handleChange,
          placeholder: isEnviroSolution ? "Select Profile" : "Select Doctor Type",
          isLoading: dropLoading,
        }}
        onExportClick={handleExport}
      /> */}
      <div className="">
        {/* ================= TOP HEADING =================
        <div className="text-center mb-5">
          <h2
            className="text-3xl font-bold"
            style={{ color: theme.primaryColor }}
          >
            Individual Database
          </h2>
      
          <div
            className="w-full h-1 mx-auto mt-2 rounded-full"
            style={{ backgroundColor: theme.primaryColor }}
          />
        </div> */}
      
        {/* ================= CONTROLS ROW ================= */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      
            {/* LEFT: Dropdowns */}
            <div className="flex flex-col sm:flex-row gap-3">
      
              {/* Segment Dropdown */}
              {!isEnviroSolution && (
                <div className="w-full sm:w-56">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Segment
                  </label>
      
                  <ReactSelect
                    options={segmentOptions}
                    value={
                      segmentOptions.find(
                        (opt) => opt.value === selectedSegment
                      ) || null
                    }
                    onChange={handleSegmentChange}
                    placeholder="Select Segment"
                    isLoading={dropLoading}
                    isClearable
                  />
                </div>
              )}
      
              {/* Doctor/Profile Dropdown */}
              <div className="w-full sm:w-56">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isEnviroSolution ? "Profile Type" : "Doctor Type"}
                </label>
      
                <ReactSelect
                  options={options}
                  value={
                    options.find(
                      (opt) =>
                        opt.value ===
                        (isEnviroSolution ? typeOfProfile : selectedDoctor)
                    ) || null
                  }
                  onChange={handleChange}
                  placeholder={
                    isEnviroSolution
                      ? "Select Profile"
                      : "Select Doctor Type"
                  }
                  isLoading={dropLoading}
                  isClearable
                />
              </div>
            </div>
      
            {/* RIGHT: Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
              <button
                onClick={handleExport}
                className="px-5 py-2.5 rounded-lg text-white font-medium shadow-sm hover:opacity-90 transition"
                style={{ backgroundColor: theme.primaryColor }}
              >
                Export
              </button>
      
              <button
                onClick={() => navigate("/sales-executive/database/individual")}
                className="px-5 py-2.5 rounded-lg text-white font-medium shadow-sm hover:opacity-90 transition whitespace-nowrap"
                style={{ backgroundColor: theme.primaryColor }}
              >
                Add New Individual
              </button>
            </div>
          </div>
        </div>
         <div
            className="w-full h-1 mx-auto mt-2 rounded-full"
            style={{ backgroundColor: theme.primaryColor }}
          />
      </div>

      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.secondaryColor }}>
              {(isEnviroSolution
                ? typeOfProfile === "Farmer"
                  ? ["Sr. No", "Name", "Lead owner", "Product name", "Status", "Action"]
                  : typeOfProfile === "Government Officer"
                    ? ["Sr. No", "Person Name", "Office Name", "Designation", "Coverage Area", "Action"]
                    : ["Sr. No", "FPO Name", "Registration No", "Operational Area", "Action"]
                : ["Sr. No", "Hospital / Department", "Designation", "Person Name", "Speciality", "Profile", "City", "Action"]
              ).map((head, i) => (
                <TableCell
                  key={i}
                  sx={{ fontWeight: 600 }}
                  align={head === "Action" ? "center" : "left"}
                >
                  {head}
                </TableCell>
              ))}
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

                  {isEnviroSolution ? (
                    <>
                      {typeOfProfile === "Farmer" && (
                        <>
                          <TableCell>{data?.name}</TableCell>
                          <TableCell>{data?.leadOwner || "-"}</TableCell>
                          <TableCell>{data?.productName || "-"}</TableCell>
                          <TableCell>{data?.status || "-"}</TableCell>
                        </>
                      )}
                      {typeOfProfile === "Government Officer" && (
                        <>
                          <TableCell>{`${data?.firstName || ""} ${data?.lastName || ""}`}</TableCell>
                          <TableCell>{data?.officeName || "-"}</TableCell>
                          <TableCell>{data?.designation || "-"}</TableCell>
                          <TableCell>{data?.districtBlockRegion || "-"}</TableCell>
                        </>
                      )}
                      {typeOfProfile === "FPO" && (
                        <>
                          <TableCell>{data?.fpoName || "-"}</TableCell>
                          <TableCell>{data?.registrationNumber || "-"}</TableCell>
                          <TableCell>{data?.operationalArea || "-"}</TableCell>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <TableCell>{data?.hospitalName || data?.department || "-"}</TableCell>
                      <TableCell>{data?.designation || "-"}</TableCell>
                      <TableCell>{data?.personName || "-"}</TableCell>
                      <TableCell>{data?.speciality || "-"}</TableCell>
                      <TableCell>{data?.profileOfCustomer || "-"}</TableCell>
                      <TableCell>{data?.city || "-"}</TableCell>
                    </>
                  )}

                  <TableCell align="center">
                    <IconButton onClick={() => handleView(data?._id, data?.typeOfProfile)}>
                      <ViewIcon color={theme.primaryColor} />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        if (data?.edit) handleEdit(data?._id, data?.typeOfProfile);
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

        <Pagination
          currentPage={paginationData?.currentPage || paginationData?.pagination?.currentPage}
          totalItems={paginationData?.totalItems || paginationData?.pagination?.totalCount}
          totalPages={paginationData?.totalPages || paginationData?.pagination?.totalPages}
          itemsPerPage={limit}
          onPageChange={onPageChange}
          onItemsPerPageChange={onItemsPerPageChange}
        />
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
