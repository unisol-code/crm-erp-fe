import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaPlusCircle } from "react-icons/fa";
import { TiEye } from "react-icons/ti";
import { FiFilter } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import DataTable from "../../../../../../components/uiComponents/dataTable/DataTable.jsx";
import BreadCrumb from "../../../../../../components/uiComponents/breadcrumb/BreadCrumb.jsx";
import DateRangeFilter from "../DateRangeFilter";
import FilterCheckboxDropdown from "../FilterCheckboxDropdown.jsx";
import { toast } from "react-toastify";
import { AiOutlineClose } from "react-icons/ai";
import { useTheme } from "../../../../../../hooks/theme/useTheme.js";
import Button from "../../../../../../components/uiComponents/button/Button.jsx";
import useEnviroTargetSheetExecutive from "../../../../../../hooks/salesExecutiveHook/customerVisitPlan/useEnviroTargetSheetExecutive";
import LoaderSpinner from "../../../../../../components/uiComponents/loader/LoaderSpinner.jsx";
import Select from "react-select";
import useDropdown from "../../../../../../hooks/dropdown/useDropdown";
import Pagination from "../../../../../../components/uiComponents/pagination/Pagination.jsx";

const EnviroProductWiseTargetSheet = () => {
  const {
    loading,
    productWiseTargetSheetDetails,
    fetchEnviroProductWiseTargetSheet,
    resetProductWiseTargetSheetDetails,
    serviceIndividualOrganizationTargetSheetDetails,
    fetchServiceIndividualOrganizationTargetSheet,
    resetServiceIndividualOrganizationTargetSheetDetails,
    projectIndividualOrganizationTargetSheetDetails,
    fetchProjectIndividualOrganizationTargetSheet,
    resetProjectIndividualOrganizationTargetSheetDetails,
  } = useEnviroTargetSheetExecutive();

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("product");

  const [showFilter, setShowFilter] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { theme } = useTheme();
  const [filters, setFilters] = useState({
    individualName: "",
    cityTownVillage: "",
    status: "",
  });
  // Year filter state
  const [year, setYear] = useState("");
  const currentYear = new Date().getFullYear();

  // Generate year options: current year - 5 to current year + 5
  const yearOptions = [
    ...Array.from({ length: 11 }, (_, i) => currentYear - 5 + i),
  ];

  const handleSelectChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleYearChange = (selectedYear) => {
    // react-select may pass {value: number} or just the number, or null when cleared
    let year;
    if (selectedYear === null || selectedYear === undefined) {
      // User cleared the selection via the cross button
      year = undefined;
    } else if (selectedYear && typeof selectedYear === "object") {
      year = selectedYear.value;
    } else {
      year = selectedYear;
    }
    const yearStr = year !== undefined && year !== null ? String(year) : "";
    setYear(yearStr);
    setPage(1); // reset to first page when year changes
    if (activeTab === "product") {
      fetchEnviroProductWiseTargetSheet(year, 1, limit);
    } else if (activeTab === "service") {
      fetchServiceIndividualOrganizationTargetSheet(year, 1, limit);
    } else if (activeTab === "project") {
      fetchProjectIndividualOrganizationTargetSheet(year, 1, limit);
    }
  };

const handleViewClick = (id, row) => {
  const routeMap = {
    Product: "/sales-executive/enviro-target-sheet/product",
    Project: "/sales-executive/enviro-target-sheet/project",
    Service: "/sales-executive/enviro-target-sheet/service",
  };

  const sheetType =
    row?.sheetType ||
    (activeTab === "service" ? "Service" : activeTab === "project" ? "Project" : "Product");
  const path = routeMap[sheetType];

  if (path && id) {
    navigate(`${path}?id=${encodeURIComponent(id)}`);
  } else {
    toast.error(
      !id ? "Target sheet ID is missing" : `Unknown sheet type: ${sheetType}`
    );
  }
};

  const onPageChange = (data) => {
    setPage(data);
  };

  const onItemsPerPageChange = (data) => {
    setLimit(data);
  };

  useEffect(() => {
    if (activeTab === "product") {
      fetchEnviroProductWiseTargetSheet(undefined, page, limit);
    } else if (activeTab === "service") {
      fetchServiceIndividualOrganizationTargetSheet(undefined, page, limit);
    } else if (activeTab === "project") {
      fetchProjectIndividualOrganizationTargetSheet(undefined, page, limit);
    }
  }, [page, limit, activeTab]);

  useEffect(() => {
    return () => {
      resetProductWiseTargetSheetDetails();
      resetServiceIndividualOrganizationTargetSheetDetails();
      resetProjectIndividualOrganizationTargetSheetDetails();
    };
  }, []);

  useEffect(() => {
    // Optional: re-fetch when year changes externally, but handleYearChange already handles it.
  }, [year]);

  useEffect(() => {
    // Individual filters can trigger refetch if needed
  }, [filters]);

  return (
    <div className="w-full min-h-screen">
      {/* Breadcrumb */}
      <BreadCrumb
        linkText={[
          { text: "Customer Visit Plan" },
          { text: "Target Sheet" },
          { text: "Enviro Product Wise Target Sheet" },
        ]}
      />
      <div className="p-4 bg-white rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-gray-800 font">
            Enviro Target Sheet
          </h2>
          <div className="flex items-center gap-2">
            <Button
              onClick={() =>
                navigate("/sales-executive/enviro-target-sheet/create-target-sheet")
              }
              variant={1}
              text="Create Target Sheet"
            />
            &nbsp;
            <Select
              placeholder="Select Year"
              options={yearOptions.map((y) => ({ label: y.toString(), value: y }))}
              onChange={handleYearChange}
              isClearable
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b mb-4">
          <button
            type="button"
            onClick={() => {
              setActiveTab("product");
              setPage(1);
            }}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === "product"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Product Wise Target Sheet
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("service");
              setPage(1);
            }}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === "service"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Service Wise Target Sheet
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("project");
              setPage(1);
            }}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === "project"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Project Wise Target Sheet
          </button>
        </div>

        {/* Filter Panel */}
        {showFilter && (
          <FilterCheckboxDropdown
            filters={filters}
            onFilterChange={handleSelectChange}
            onClose={() => setShowFilter(false)}
          />
        )}

        {/* Table */}
        {(() => {
          const tabConfig = {
            product: {
              columns: [
                { key: "individualName", header: "Individual Name" },
                { key: "cityTownVillage", header: "City" },
                { key: "status", header: "Status" },
                { key: "totalProductCount", header: "Product Count", align: "center" },
                { key: "overallProductPrice", header: "Overall Price", align: "right" },
              ],
              data: productWiseTargetSheetDetails,
            },
            service: {
              columns: [
                { key: "individualName", header: "Individual Name" },
                { key: "organizationName", header: "Organization Name" },
                { key: "cityTownVillage", header: "City" },
                { key: "totalServiceCount", header: "Service Count", align: "center" },
                { key: "overallServicePrice", header: "Overall Price", align: "right" },
              ],
              data: serviceIndividualOrganizationTargetSheetDetails,
            },
            project: {
              columns: [
                { key: "individualName", header: "Individual Name" },
                { key: "organizationName", header: "Organization Name" },
                { key: "cityTownVillage", header: "City" },
                { key: "totalProjectCount", header: "Project Count", align: "center" },
                { key: "overallProjectPrice", header: "Overall Price", align: "right" },
              ],
              data: projectIndividualOrganizationTargetSheetDetails,
            },
          };

          const current = tabConfig[activeTab] || tabConfig.product;

          return (
            <DataTable
              columns={current.columns}
              rows={current.data?.data ?? []}
              loading={loading}
              emptyMessage="No target sheet list found."
              showSrNo
              srNoStartIndex={(page - 1) * limit}
              showAction
              onRowView={handleViewClick}
              viewKey="_id"
              pagination={{
                currentPage: current.data?.page,
                totalItems: current.data?.totalRecords,
                itemsPerPage: limit,
                totalPages: current.data?.totalPages,
                onPageChange: onPageChange,
                onItemsPerPageChange: onItemsPerPageChange,
              }}
            />
          );
        })()}
      </div>
    </div>
  );
};

export default EnviroProductWiseTargetSheet;