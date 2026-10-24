import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaPlusCircle } from "react-icons/fa";
import { TiEye } from "react-icons/ti";
import DataTable from "../../../../../components/uiComponents/dataTable/DataTable.jsx";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb.jsx";
import { useTheme } from "../../../../../hooks/theme/useTheme.js";
import Button from "../../../../../components/uiComponents/button/Button.jsx";
import useEnviroAdminTargetSheet from "../../../../../hooks/superAdminHook/customerVisitPlan/targetSheet/useEnviroAdminTargetSheet.js";
import LoaderSpinner from "../../../../../components/uiComponents/loader/LoaderSpinner.jsx";
import Select from "react-select";
import Pagination from "../../../../../components/uiComponents/pagination/Pagination.jsx";

const AdminEnviroEmployeeWiseTargetSheet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  console.log("AdminEnviroEmployeeWiseTargetSheet id:", id);

  const {
    loading,
    enviroAdminProductWiseTargetSheetList,
    fetchAdminProductWiseTargetSheet,
    enviroAdminServiceWiseTargetSheetList,
    fetchAdminServiceWiseTargetSheet,
    enviroAdminProjectWiseTargetSheetList,
    fetchAdminProjectWiseTargetSheet,
  } = useEnviroAdminTargetSheet();

  const [activeTab, setActiveTab] = useState("product");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [year, setYear] = useState("");

  const currentYear = new Date().getFullYear();
  const yearOptions = [
    ...Array.from({ length: 11 }, (_, i) => currentYear - 5 + i),
  ];

  const handleYearChange = (selectedYear) => {
    let yearVal;
    if (selectedYear === null || selectedYear === undefined) {
      yearVal = undefined;
    } else if (selectedYear && typeof selectedYear === "object") {
      yearVal = selectedYear.value;
    } else {
      yearVal = selectedYear;
    }
    const yearStr = yearVal !== undefined && yearVal !== null ? String(yearVal) : "";
    setYear(yearStr);
    setPage(1);
    if (activeTab === "product") {
      fetchAdminProductWiseTargetSheet(yearStr || undefined, 1, limit);
    } else if (activeTab === "service") {
      fetchAdminServiceWiseTargetSheet(yearStr || undefined, 1, limit);
    } else if (activeTab === "project") {
      fetchAdminProjectWiseTargetSheet(yearStr || undefined, 1, limit);
    }
  };

  const handleViewClick = (sheetId, row) => {
    const routeMap = {
      Product: "/admin/sales-executive/enviro-target-sheet/product",
      Project: "/admin/sales-executive/enviro-target-sheet/project",
      Service: "/admin/sales-executive/enviro-target-sheet/service",
    };
    const sheetType =
      row?.sheetType ||
      (activeTab === "service" ? "Service" : activeTab === "project" ? "Project" : "Product");
    const path = routeMap[sheetType];
    if (path && sheetId) {
      navigate(`${path}?id=${encodeURIComponent(sheetId)}`);
    }
  };

  useEffect(() => {
    if (activeTab === "product") {
      fetchAdminProductWiseTargetSheet(year || undefined, page, limit,id);
    } else if (activeTab === "service") {
      fetchAdminServiceWiseTargetSheet(year || undefined, page, limit,id);
    } else if (activeTab === "project") {
      fetchAdminProjectWiseTargetSheet(year || undefined, page, limit,id);
    }
  }, [page, limit, activeTab]);

  return (
    <div className="w-full min-h-screen">
      <BreadCrumb
        linkText={[
          { text: "Customer Visit Plan" },
          { text: "Target Sheet", href: "/admin/sales-executive/target-sheet" },
          { text: "Enviro Employee Wise Target Sheet" },
        ]}
      />
      <div className="p-4 bg-white rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-gray-800 font">Enviro Target Sheet</h2>
          <div className="flex items-center gap-2">
            <Select
              placeholder="Select Year"
              options={yearOptions.map((y) => ({ label: y.toString(), value: y }))}
              onChange={handleYearChange}
              isClearable
            />
          </div>
        </div>

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

        {(() => {
          const tabConfig = {
            product: {
              columns: [
                { key: "individualName", header: "Individual Name" },
                { key: "organizationName", header: "Organization Name" },
                { key: "cityTownVillage", header: "City" },
                { key: "status", header: "Status" },
                { key: "totalProductCount", header: "Product Count", align: "center" },
                { key: "overallProductPrice", header: "Overall Price", align: "right" },
              ],
              data: enviroAdminProductWiseTargetSheetList,
            },
            service: {
              columns: [
                { key: "individualName", header: "Individual Name" },
                { key: "organizationName", header: "Organization Name" },
                { key: "cityTownVillage", header: "City" },
                { key: "status", header: "Status" },
                { key: "totalServiceCount", header: "Service Count", align: "center" },
                { key: "overallServicePrice", header: "Overall Price", align: "right" },
              ],
              data: enviroAdminServiceWiseTargetSheetList,
            },
            project: {
              columns: [
                { key: "individualName", header: "Individual Name" },
                { key: "organizationName", header: "Organization Name" },
                { key: "cityTownVillage", header: "City" },
                { key: "status", header: "Status" },
                { key: "totalProjectCount", header: "Project Count", align: "center" },
                { key: "overallProjectPrice", header: "Overall Price", align: "right" },
              ],
              data: enviroAdminProjectWiseTargetSheetList,
            },
          };

          const current = tabConfig[activeTab] || tabConfig.product;
          const listData = current.data?.data ?? current.data ?? [];

          return (
            <DataTable
              columns={current.columns}
              rows={Array.isArray(listData) ? listData : []}
              loading={loading}
              emptyMessage="No target sheet list found."
              showSrNo
              srNoStartIndex={(page - 1) * limit}
              showAction
              onRowView={handleViewClick}
              viewKey="_id"
              pagination={{
                currentPage: current.data?.page || page,
                totalItems: current.data?.totalRecords || current.data?.total || listData.length,
                itemsPerPage: limit,
                totalPages: current.data?.totalPages || Math.max(Math.ceil((current.data?.totalRecords || listData.length) / limit), 1),
                onPageChange: setPage,
                onItemsPerPageChange: (val) => {
                  setLimit(val);
                  setPage(1);
                },
              }}
            />
          );
        })()}
      </div>
    </div>
  );
};

export default AdminEnviroEmployeeWiseTargetSheet;
