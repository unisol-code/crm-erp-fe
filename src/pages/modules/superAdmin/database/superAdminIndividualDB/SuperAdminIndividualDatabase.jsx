import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";
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

import Pagination from "../../../../../components/uiComponents/pagination/Pagination";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import {
  TableHeader,
} from "../../../../../components/uiComponents/DatabaseSharedComponents";
import useAdminIndividualDB from "../../../../../hooks/superAdminHook/superAdmindatabase/useAdminIndividualDB";
import useDropdown from "../../../../../hooks/dropdown/useDropdown";
import LoaderSpinner from "../../../../../components/uiComponents/loader/LoaderSpinner";
import { ViewIcon } from "../../../../../assets/CommonAssets";
import useEnviroAdminIndDB from "../../../../../hooks/superAdminHook/superAdmindatabase/enviroDB/useEnviroAdminIndDB";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import useCompany from "../../../../../hooks/common/useCompany";

const SuperAdminIndividualDatabase = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedDoctor, setSelectedDoctor] = useState("Surgeon");
 const [selectedSegment, setSelectedSegment] = useState(null);
  const [typeOfProfile, setTypeOfProfile] = useState("Farmer");
  const { isEnviroSolution } = useCompany();

  /* ================= DROPDOWN ================= */
  const {
    loading: dropLoading,
    profile,
    enviroprofile,
    profileState, fetchSegment,segment,
    enviroindiviualdropdown,
  } = useDropdown();

  const dropdownOptions = isEnviroSolution ? enviroprofile : profile;

  console.log("Dropdown Options:", dropdownOptions);

  /* ================= NORMAL DB ================= */
  const {
    fetchAdminAllIndividual,
    loading,
    getAdminAllIndividualList,
    deleteAdminIndividual,
  } = useAdminIndividualDB();

  /* ================= ENVIRO DB ================= */
  const {
    enviroAdminIndividualList,
    fetchEnviroAdminIndividualList,
    loading: enviroIndividualLoading,
    fetchEnviroGovtOfficerList,
    fetchEnviroFPOList,
    loading: enviroGovtOfficerLoading,
    loading: enviroFPOLoading,
    enviroGovtOfficerList,
    enviroFPOList,
    deleteEnviroAdminIndividual,
    deleteEnviroGovtOfficer,
    deleteEnviroFPO,
  } = useEnviroAdminIndDB();

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (isEnviroSolution && typeOfProfile) {
      if (typeOfProfile == "Farmer") {
        fetchEnviroAdminIndividualList(page, limit, typeOfProfile);
      } else if (typeOfProfile == "Government Officer") {
        fetchEnviroGovtOfficerList(page, limit, typeOfProfile);
      } else if (typeOfProfile == "FPO") {
        fetchEnviroFPOList(page, limit, typeOfProfile);
      }
    }

    if (!isEnviroSolution && selectedDoctor) {
      fetchAdminAllIndividual(page, limit, selectedDoctor);
    }
  }, [page, limit, selectedDoctor, typeOfProfile, isEnviroSolution]);

  console.log("enviroAdminIndividualList", enviroAdminIndividualList)
  /* ================= DROPDOWN INIT ================= */
  // useEffect(() => {
  //   if (isEnviroSolution) {
  //     enviroindiviualdropdown();
  //     setTypeOfProfile("Farmer");
  //     setSelectedDoctor(null);
  //   } else {
  //     profileState();
  //     setSelectedDoctor("Surgeon");
  //     setTypeOfProfile(null);
  //   }
  // }, [isEnviroSolution]);

  useEffect(() => {
  if (isEnviroSolution) {
    enviroindiviualdropdown();
    setTypeOfProfile("Farmer");
    setSelectedDoctor(null);
  } else {
    // Segment list lao
    fetchSegment();

    // Default segment
    setSelectedSegment("Clinical");

    // Clinical ke profiles lao
    profileState("Clinical");

    // Default doctor
    setSelectedDoctor("Surgeon");

    setTypeOfProfile(null);
  }
}, [isEnviroSolution]);

  /* ================= PAGINATION ================= */
  const onPageChange = (data) => {
    setPage(data);
  };

  const onItemsPerPageChange = (data) => {
    setLimit(data);
    setPage(1);
  };

  /* ================= HANDLERS ================= */
  const handleView = (id, type) => {
    if (isEnviroSolution) {
      navigate(`/database/view-enviro-individual-details/${id}`, { state: { typeOfProfile: type } });
    } else {
      navigate(`/database/view-newindividual/${id}`);
    }
  };

  const handleDelete = async (data) => {
    if (isEnviroSolution) {
      if (typeOfProfile == "Farmer") {
        await deleteEnviroAdminIndividual(data?._id);
        fetchEnviroAdminIndividualList(page, limit, typeOfProfile);
      } else if (typeOfProfile == "Government Officer") {
        await deleteEnviroGovtOfficer(data?._id);
        fetchEnviroGovtOfficerList(page, limit, typeOfProfile);
      } else if (typeOfProfile == "FPO") {
        await deleteEnviroFPO(data?._id);
        fetchEnviroFPOList(page, limit, typeOfProfile);
      }
    } else {
      await deleteAdminIndividual(data?._id);
      setPage(1);
    }
  };

  const handleChange = (option) => {
    if (isEnviroSolution) {
      setTypeOfProfile(option?.value || null);
    } else {
      setSelectedDoctor(option?.value || null);
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

  console.log("enviroAdminIndividualList", enviroAdminIndividualList)
  console.log("enviroGovtOfficerList", enviroGovtOfficerList)
  console.log("enviroFPOList", enviroFPOList)

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

  /* ================= DATA SWITCH ================= */
  const tableLoading = isEnviroSolution
    ? typeOfProfile == "Farmer" ? enviroIndividualLoading : typeOfProfile == "Government Officer" ? enviroGovtOfficerLoading : enviroFPOLoading
    : loading;

  const tableData = isEnviroSolution
    ? typeOfProfile == "Farmer" ? enviroAdminIndividualList?.data || [] : typeOfProfile == "Government Officer" ? enviroGovtOfficerList?.data || [] : enviroFPOList?.data || []
    : getAdminAllIndividualList?.data || [];


  const paginationData = isEnviroSolution
    ? typeOfProfile == "Farmer" ? enviroAdminIndividualList : typeOfProfile == "Government Officer" ? enviroGovtOfficerList : enviroFPOList
    : getAdminAllIndividualList;

  const handleExport = () => {
    if (!tableData || tableData.length === 0) return;

    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Super Admin - Individual Database", 14, 20);

    let columns = [];
    let rows = [];

    if (isEnviroSolution) {
      // 🟢 ENVIRO EXPORT
      if (typeOfProfile === "Farmer") {
        columns = ["Added By", "Person Name", "Segment", "Profile Type", "Lead Owner", "Product Name", "City"];
        rows = tableData.map((item) => [
          item?.addedBy || "-",
          `${item?.firstName || ""} ${item?.lastName || ""}`,
          item?.segment || "-",
          item?.typeOfProfile || "-",
          item?.leadOwner || "-",
          item?.productName || "-",
          item?.villageName || "-",
        ]);
      } else if (typeOfProfile === "Government Officer") {
        columns = ["Added By", "Person Name", "Office Name", "Designation", "Coverage Area", "Segment", "Profile Type"];
        rows = tableData.map((item) => [
          item?.addedBy || "-",
          `${item?.firstName || ""} ${item?.lastName || ""}`,
          item?.officeName || "-",
          item?.designation || "-",
          item?.districtBlockRegion || "-",
          item?.segment || "-",
          item?.typeOfProfile || "-",
        ]);
      } else if (typeOfProfile === "FPO") {
        columns = ["Added By", "FPO Name", "Registration No", "Operational Area", "Segment", "Profile Type"];
        rows = tableData.map((item) => [
          item?.addedBy || "-",
          item?.fpoName || "-",
          item?.registrationNumber || "-",
          item?.operationalArea || "-",
          item?.segment || "-",
          item?.typeOfProfile || "-",
        ]);
      }
    } else {
      // 🟦 NORMAL EXPORT
      columns = [
        "Sales Person",
        selectedDoctor === "Non Clinical"
          ? "Department"
          : "Hospital Name",
        "Designation",
        "Person Name",
        selectedDoctor !== "Non Clinical" && "Speciality",
        "Profile",
        "City",
      ].filter(Boolean);

      rows = tableData.map((item) => [
        item?.salesName || "N/A",
        selectedDoctor === "Non Clinical"
          ? item?.department || "N/A"
          : item?.hospitalName || "N/A",
        item?.designation || "N/A",
        item?.personName || "N/A",
        selectedDoctor !== "Non Clinical"
          ? item?.speciality || "N/A"
          : undefined,
        item?.profileOfCustomer || "N/A",
        item?.city || "N/A",
      ].filter((v) => v !== undefined));
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
      styles: {
        fontSize: 9,
      },
    });

    doc.save("super-admin-individual-database.pdf");
  };

  return (
    <>
    {/* {!isEnviroSolution && (
  <div className="mb-4 max-w-xs">
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
    />
  </div>
)}
      <TableHeader
        theme={theme}
        title="Individual Database"
        showExport
        onAddClick={() => navigate("/database/add-newindividual")}
        addButtonText="Add New Individual"
        onExportClick={handleExport}
        selectProps={{
          options,
          value: options.find((opt) => opt.value === (isEnviroSolution ? typeOfProfile : selectedDoctor)) || null,
          onChange: handleChange,
          placeholder: isEnviroSolution
            ? "Select Profile"
            : "Select Doctor Type",
          isLoading: dropLoading,
        }}
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
          onClick={() => navigate("/database/add-newindividual")}
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
                  ? [
                    "Sr. No",
                    "Added By",
                    "Person Name",
                    "Segment",
                    "Profile type",
                    "Lead Owner",
                    "Product Name",
                    "City",
                    "Action",
                  ]
                  : typeOfProfile === "Government Officer"
                    ? [
                      "Sr. No",
                      "Added By",
                      "Person Name",
                      "Office Name",
                      "Designation",
                      "Segment",
                      "Profile type",
                      "Action",
                    ]
                    : [
                      "Sr. No",
                      "Added By",
                      "FPO Name",
                      "Registration No",
                      "Operational Area",
                      "Segment",
                      "Profile type",
                      "Action",
                    ]
                : [
                  "Sr. No",
                  "Sales Person Name",
                  selectedDoctor === "Non Clinical"
                    ? "Department"
                    : "Hospital Name",
                  "Designation",
                  "Person Name",
                  selectedDoctor !== "Non Clinical" && "Speciality",
                  "Profile of Customer",
                  "City",
                  "Action",
                ]
              )
                .filter(Boolean)
                .map((head, i) => (
                  <TableCell
                    key={i}
                    sx={{ padding: 2, fontSize: "1rem", fontWeight: 600 }}
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
                <TableCell colSpan={9} >
                  <div className="py-8 flex items-center justify-center">
                    <LoaderSpinner />
                  </div>
                </TableCell>
              </TableRow>
            ) : tableData.length > 0 ? (
              tableData.map((data, index) => (
                <TableRow hover key={data?.id}>
                  <TableCell>
                    {(page - 1) * limit + index + 1}
                  </TableCell>

                  {isEnviroSolution ? (
                    <>
                      {typeOfProfile === "Farmer" && (
                        <>
                          <TableCell>{data?.addedBy || "-"}</TableCell>
                          <TableCell>{`${data?.firstName || ""} ${data?.lastName || ""}`}</TableCell>
                          <TableCell>{data?.segment || "-"}</TableCell>
                          <TableCell>{data?.typeOfProfile || "-"}</TableCell>
                          <TableCell>{data?.leadOwner || "-"}</TableCell>
                          <TableCell>{data?.productName || "-"}</TableCell>
                          <TableCell>{data?.villageName || "-"}</TableCell>
                        </>
                      )}
                      {typeOfProfile === "Government Officer" && (
                        <>
                          <TableCell>{data?.addedBy || "-"}</TableCell>
                          <TableCell>{`${data?.firstName || ""} ${data?.lastName || ""}`}</TableCell>
                          <TableCell>{data?.officeName || "-"}</TableCell>
                          <TableCell>{data?.designation || "-"}</TableCell>
                          <TableCell>{data?.segment || "-"}</TableCell>
                          <TableCell>{data?.typeOfProfile || "-"}</TableCell>
                        </>
                      )}
                      {typeOfProfile === "FPO" && (
                        <>
                          <TableCell>{data?.addedBy || "-"}</TableCell>
                          <TableCell>{data?.fpoName || "-"}</TableCell>
                          <TableCell>{data?.registrationNumber || "-"}</TableCell>
                          <TableCell>{data?.operationalArea || "-"}</TableCell>
                          <TableCell>{data?.segment || "-"}</TableCell>
                          <TableCell>{data?.typeOfProfile || "-"}</TableCell>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <TableCell>{data?.salesPersonName || "N/A"}</TableCell>
                      <TableCell>
                        {selectedDoctor === "Non Clinical"
                          ? data?.department || "N/A"
                          : data?.hospitalName || "N/A"}
                      </TableCell>
                      <TableCell>{data?.designation || "N/A"}</TableCell>
                      <TableCell>{data?.personName || "N/A"}</TableCell>
                      {selectedDoctor !== "Non Clinical" && (
                        <TableCell>{data?.speciality || "N/A"}</TableCell>
                      )}
                      <TableCell>
                        {data?.profileOfCustomer || "N/A"}
                      </TableCell>
                      <TableCell>{data?.city || "N/A"}</TableCell>
                    </>
                  )}

                  <TableCell align="center">
                    <IconButton onClick={() => {
                      isEnviroSolution ? handleView(data?._id, data?.typeOfProfile) : handleView(data?.id)
                    }}>
                      <ViewIcon color={theme.primaryColor} />
                    </IconButton>
                    {/* {!isEnviroSolution && ( */}
                    <IconButton onClick={() => handleDelete(data)}>
                      <DeleteOutline sx={{ color: "red" }} />
                    </IconButton>
                    {/* )} */}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography fontWeight={600}>
                    No Data Found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* ✅ PAGINATION KEPT */}
        {!tableLoading && tableData.length > 0 && (
          <Pagination
            currentPage={paginationData?.pagination?.currentPage}
            totalItems={paginationData?.pagination?.totalCount}
            totalPages={paginationData?.pagination?.totalPages}
            itemsPerPage={limit}
            onPageChange={onPageChange}
            onItemsPerPageChange={onItemsPerPageChange}
          />
        )}


      </TableContainer>
    </>
  );
};

export default SuperAdminIndividualDatabase;
