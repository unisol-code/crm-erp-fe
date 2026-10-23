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
  } = useEnviroTargetSheetExecutive();

  const navigate = useNavigate();

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
    setYear(year !== undefined && year !== null ? String(year) : "");
    setPage(1); // reset to first page when year changes
    fetchEnviroProductWiseTargetSheet(year, 1, limit);
  };

  const handleViewClick = (id) => {
    navigate(`/sales-executive/target-sheet/view-year-wise-product/${id}`);
  };

  const onPageChange = (data) => {
    setPage(data);
  };

  const onItemsPerPageChange = (data) => {
    setLimit(data);
  };

  useEffect(() => {
    // Initial fetch: no year filter (default). When year is selected, fetchEnviroProductWiseTargetSheet
    // is called from handleYearChange already; here we just ensure initial load.
    fetchEnviroProductWiseTargetSheet(undefined, page, limit);
  }, [page, limit]);

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
            Enviro Product Wise Target Sheet
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
        <hr
          className="h-1 border-0"
          style={{ backgroundColor: theme.secondaryColor }}
        />

        {/* Filter Panel */}
        {showFilter && (
          <FilterCheckboxDropdown
            filters={filters}
            onFilterChange={handleSelectChange}
            onClose={() => setShowFilter(false)}
          />
        )}

        {/* Table */}
        <DataTable
          // title="Enviro Product Wise Target Sheet"
          columns={[
            { key: "individualName", header: "Individual Name" },
            { key: "cityTownVillage", header: "City" },
            { key: "status", header: "Status" },
            {
              key: "totalProductCount",
              header: "Product Count",
              align: "center",
            },
            {
              key: "overallProductPrice",
              header: "Overall Price",
              align: "right",
            },
          ]}
          rows={productWiseTargetSheetDetails?.data ?? []}
          loading={loading}
          emptyMessage="No target sheet list found."
          showSrNo
          srNoStartIndex={(page - 1) * limit}
          showAction
          onRowView={handleViewClick}
          viewKey="_id"
          pagination={{
            currentPage: productWiseTargetSheetDetails?.page,
            totalItems: productWiseTargetSheetDetails?.totalRecords,
            itemsPerPage: limit,
            totalPages: productWiseTargetSheetDetails?.totalPages,
            onPageChange: onPageChange,
            onItemsPerPageChange: onItemsPerPageChange,
          }}
        />
      </div>
    </div>
  );
};

export default EnviroProductWiseTargetSheet;