import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb.jsx";
import DataTable from "../../../../../components/uiComponents/dataTable/DataTable.jsx";
import { useTheme } from "../../../../../hooks/theme/useTheme.js";
import useAdminTargetSheet from "../../../../../hooks/superAdminHook/customerVisitPlan/targetSheet/useAdminTargetSheet.js";
import useEnviroAdminTargetSheet from "../../../../../hooks/superAdminHook/customerVisitPlan/targetSheet/useEnviroAdminTargetSheet.js";
import useCompany from "../../../../../hooks/common/useCompany.js";

const formatCurrency = (v) =>
  v === null || v === undefined ? "-" : `₹ ${Number(v).toLocaleString("en-IN")}`;

const Stat = ({ label, value }) => (
  <div className="flex flex-col px-4 py-2 border rounded-lg bg-white">
    <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
    <span className="text-[17px] font-semibold text-[#252C58]">{value}</span>
  </div>
);

const AdminTargetSheet = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { isEnviroSolution, isCompanyLoaded } = useCompany();
  const {
    loading,
    allEmployeeList,
    fetchAllEmployeeList,
    teamWiseTargetSheetList,
    fetchTeamWiseTargetSheetList,
    resetTeamWiseTargetSheet,
  } = useAdminTargetSheet();

  const {
    loading: enviroLoading,
    enviroTargetSheetsEmployee,
    enviroTeamWiseTargetSheet,
    fetchEnviroTeamWiseTargetSheet,
    resetEnviroTeamWiseTargetSheet,
    fetchEnviroTargetSheetsEmployee,
  } = useEnviroAdminTargetSheet();

  const [activeTab, setActiveTab] = useState("teamWise");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [empPage, setEmpPage] = useState(1);
  const [empLimit, setEmpLimit] = useState(10);
  // null = top-level (logged-in user's) team; otherwise drill into that member
  const [teamDrillId, setTeamDrillId] = useState(null);
  const [enviroSheetType, setEnviroSheetType] = useState("Product");
  const [enviroYear, setEnviroYear] = useState("2026");
  const currentYear = new Date().getFullYear();
const enviroYearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i); // 2021..2031
  useEffect(() => {
    fetchTeamWiseTargetSheetList(
      undefined,
      undefined,
      teamDrillId ?? undefined
    );
    return () => {
      resetTeamWiseTargetSheet();
    };
  }, [teamDrillId]);

  useEffect(() => {  if (activeTab === "employeeList") {
      if (isEnviroSolution) {
        fetchEnviroTargetSheetsEmployee();
      } else {
        fetchAllEmployeeList();
      }
    }
  }, [activeTab, isEnviroSolution]);

  useEffect(() => {
    if (isEnviroSolution && activeTab === "teamWise") {
      fetchEnviroTeamWiseTargetSheet(
        enviroSheetType,
        enviroYear,
        page,
        limit,
        teamDrillId ?? undefined
      );
      return () => {
        resetEnviroTeamWiseTargetSheet();
      };
    }
  }, [activeTab, enviroSheetType, enviroYear, page, limit, teamDrillId, isEnviroSolution]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "teamWise") setPage(1);
    if (tab === "employeeList") setEmpPage(1);
  };

  // Eye icon in Action column (teamWise tab).
  // Route to the Universal Target Sheet page ONLY when the current viewing
  // context has its own target (viewing.hasOwnTarget) AND the clicked row also
  // has its own target (row.hasOwnTarget). Otherwise drill into that row's team.
  const handleTeamView = (id, row) => {
    if (!id) return;
    if (viewing?.hasOwnTarget && row?.hasOwnTarget) {
      navigate(`/admin/sales-executive/target-sheet/universal-target-sheet/${id}`);
      return;
    }
    setTeamDrillId(id);
    setPage(1);
  };

  const handleTeamBack = () => {
    setTeamDrillId(null);
    setPage(1);
  };

  const { year, viewing, hasOwnTarget, rows, teamTotal } =
    teamWiseTargetSheetList ?? {};

  const {
    viewing: enviroViewing,
    tables,
    sheetTypes,
  } = enviroTeamWiseTargetSheet ?? {};

  const enviroCurrentTable = tables?.[enviroSheetType] || {};
  const enviroRows = enviroCurrentTable.rows ?? [];
  const enviroTeamTotal = enviroCurrentTable.total || {};

  const teamPaginatedRows = useMemo(() => {
    const start = (page - 1) * limit;
    return (rows ?? []).slice(start, start + limit);
  }, [rows, page, limit]);

  const enviroPaginatedRows = useMemo(() => {
    const start = (page - 1) * limit;
    return enviroRows.slice(start, start + limit);
  }, [enviroRows, page, limit]);

  const empPaginatedRows = useMemo(() => {
    if (isEnviroSolution) {
      const start = (empPage - 1) * empLimit;
      const list = enviroTargetSheetsEmployee?.data ?? enviroTargetSheetsEmployee ?? [];
      return Array.isArray(list) ? list.slice(start, start + empLimit) : [];
    }
    const start = (empPage - 1) * empLimit;
    return (allEmployeeList ?? []).slice(start, start + empLimit);
  }, [allEmployeeList, empPage, empLimit, enviroTargetSheetsEmployee, isEnviroSolution]);

  const teamColumns = [
    { key: "type", header: "Type", align: "left" },
    { key: "employeeName", header: "Employee Name", align: "left" },
    { key: "designation", header: "Designation", align: "left" },
    { key: "individualCount", header: "Individuals", align: "center" },
    { key: "organizationCount", header: "Organizations", align: "center" },
    { key: "annualProductCount", header: `${enviroSheetType} Count`, align: "center" },
    { key: "annualTargetQuantity", header: "Target Qty", align: "center" },
    { key: "annualAchievedQuantity", header: "Achieved Qty", align: "center" },
    {
      key: "annualTargetPrice",
      header: "Target Price",
      align: "right",
      render: (r) => formatCurrency(r.annualTargetPrice),
    },
    {
      key: "annualAchievedPrice",
      header: "Achieved Price",
      align: "right",
      render: (r) => formatCurrency(r.annualAchievedPrice),
    },
  ];

  const enviroTeamColumns = teamColumns;

  const empColumns = [
    {
      key: "photo",
      header: "Photo",
      render: (row) =>
        row.photo ? (
          <img
            src={row.photo}
            alt={row.fullName || "Employee Photo"}
            className="w-12 h-12 rounded-full object-cover border border-gray-300"
          />
        ) : (
          "-"
        ),
    },
    { key: "employeeId", header: "EmpID", align: "left" },
    { key: "fullName", header: "Name", align: "center" },
    { key: "designation", header: "Designation", align: "center" },
    { key: "reportingManagerName", header: "Reporting Manager", align: "center" },
    { key: "totalSheetCount", header: "Total Sheets", align: "center" },
    { key: "pendingSheetCount", header: "Pending Sheets", align: "center" },
  ];

  const enviroEmpColumns = [
    { key: "name", header: "Name", align: "left" },
    { key: "productSheetCount", header: "Product Sheets", align: "center" },
    { key: "pendingProductSheetCount", header: "Pending Product Sheets", align: "center" },
    { key: "serviceSheetCount", header: "Service Sheets", align: "center" },
    { key: "pendingServiceSheetCount", header: "Pending Service Sheets", align: "center" },
    { key: "projectSheetCount", header: "Project Sheets", align: "center" },
    { key: "pendingProjectSheetCount", header: "Pending Project Sheets", align: "center" },
  ];

  return (
    <div className="w-full min-h-screen">
      <BreadCrumb
        linkText={[{ text: "Customer Visit Plan" }, { text: "Target Sheet" }]}
      />

      <div className="p-4 bg-white rounded-2xl">
        {/* Header + Tabs */}
        <div className="flex justify-between gap-4 flex-wrap items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {activeTab === "teamWise"
              ? "Team Wise Target Sheet"
              : "Employee List"}
          </h2>
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => handleTabChange("teamWise")}
              className={`px-6 py-2 text-base font-medium rounded-md transition-all ${
                activeTab === "teamWise"
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-transparent text-gray-600 hover:bg-gray-200"
              }`}
            >
              Team Wise Target Sheet
            </button>
            <button
              onClick={() => handleTabChange("employeeList")}
              className={`px-6 py-2 text-base font-medium rounded-md transition-all ${
                activeTab === "employeeList"
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-transparent text-gray-600 hover:bg-gray-200"
              }`}
            >
              Employee List
            </button>
          </div>
        </div>
        <hr
          className="h-1 border-0 mb-6"
          style={{ backgroundColor: theme.secondaryColor }}
        />

        {/* Team Wise Tab */}
        {activeTab === "teamWise" && (
          <>
            {isEnviroSolution && (
              <div className="flex items-center gap-4 mb-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Sheet Type</label>
                  <select
                    value={enviroSheetType}
                    onChange={(e) => {
                      setEnviroSheetType(e.target.value);
                      setPage(1);
                    }}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    {["Product", "Service", "Project"].map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
               
                 <div className="flex items-center gap-2">
  <label className="text-sm font-medium text-gray-700">Year</label>
  <select
    value={enviroYear}
    onChange={(e) => {
      setEnviroYear(e.target.value);
      setPage(1);
    }}
    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
  >
    {enviroYearOptions.map((y) => (
      <option key={y} value={String(y)}>{y}</option>
    ))}
  </select>
</div>  
             
              </div>
            )}

            {isEnviroSolution && enviroTeamTotal && (
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <Stat label="Individuals" value={enviroTeamTotal.individualCount ?? 0} />
                <Stat label="Organizations" value={enviroTeamTotal.organizationCount ?? 0} />
                <Stat label={`${enviroSheetType} Count`} value={enviroTeamTotal.annualProductCount ?? 0} />
                <Stat label="Target Qty" value={enviroTeamTotal.annualTargetQuantity ?? 0} />
                <Stat label="Achieved Qty" value={enviroTeamTotal.annualAchievedQuantity ?? 0} />
                <Stat label="Target Price" value={formatCurrency(enviroTeamTotal.annualTargetPrice)} />
                <Stat label="Achieved Price" value={formatCurrency(enviroTeamTotal.annualAchievedPrice)} />
              </div>
            )}

            {!isEnviroSolution && teamTotal && (
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <Stat label="Hospitals" value={teamTotal.hospitalCount ?? 0} />
                <Stat label="Products" value={teamTotal.annualProductCount ?? 0} />
                <Stat label="Target Qty" value={teamTotal.annualTargetQuantity ?? 0} />
                <Stat label="Achieved Qty" value={teamTotal.annualAchievedQuantity ?? 0} />
                <Stat label="Target Price" value={formatCurrency(teamTotal.annualTargetPrice)} />
                <Stat label="Achieved Price" value={formatCurrency(teamTotal.annualAchievedPrice)} />
              </div>
            )}

            {/* Drill-down context + back button */}
            {teamDrillId && (
              <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                <span className="text-[15px] text-gray-600">
                  Viewing team of{" "}
                  <span className="font-semibold text-[#252C58]">
                    {isEnviroSolution
                      ? enviroViewing?.employeeName ?? "selected member"
                      : viewing?.employeeName ?? "selected member"}
                  </span>
                  {enviroViewing?.designation
                    ? ` (${enviroViewing.designation})`
                    : viewing?.designation
                    ? ` (${viewing.designation})`
                    : ""}
                </span>
                <button
                  onClick={handleTeamBack}
                  className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all"
                >
                  ← Back to Top
                </button>
              </div>
            )}

            <DataTable
              columns={isEnviroSolution ? enviroTeamColumns : teamColumns}
              rows={isEnviroSolution ? enviroPaginatedRows : teamPaginatedRows}
              loading={isEnviroSolution ? enviroLoading : loading}
              emptyMessage={
                isEnviroSolution
                  ? `No ${enviroSheetType} team target sheet data available.`
                  : "No team target sheet data available."
              }
              srNoStartIndex={(page - 1) * limit}
              onRowView={handleTeamView}
              actionLabel="View team"
              pagination={{
                currentPage: page,
                totalItems: isEnviroSolution
                  ? enviroRows.length
                  : rows?.length ?? 0,
                itemsPerPage: limit,
                totalPages: Math.max(
                  Math.ceil(
                    (isEnviroSolution ? enviroRows.length : rows?.length ?? 0) / limit
                  ),
                  1
                ),
              }}
              onPageChange={setPage}
              onItemsPerPageChange={(value) => {
                setLimit(value);
                setPage(1);
              }}
            />
          </>
        )}

        {/* Employee List Tab */}
        {activeTab === "employeeList" && (
          <DataTable
            columns={isEnviroSolution ? enviroEmpColumns : empColumns}
            rows={empPaginatedRows}
            showAction
            viewKey={isEnviroSolution ? "_id" : "_id"}
            onRowView={(id, row) => {
              if (isEnviroSolution) {
                navigate(`/admin/sales-executive/target-sheet/enviro-employee-wise-target-sheet/${id}`);
              } else {
                navigate(`/admin/sales-executive/target-sheet/employee-wise-target-sheet/${id}`);
              }
            }}
            actionLabel="View Target Sheet"
            loading={loading || enviroLoading}
            emptyMessage="No employee data available."
            srNoStartIndex={(empPage - 1) * empLimit}
            pagination={{
              currentPage: empPage,
              totalItems: isEnviroSolution
                ? (Array.isArray(enviroTargetSheetsEmployee?.data)
                    ? enviroTargetSheetsEmployee.data.length
                    : Array.isArray(enviroTargetSheetsEmployee)
                    ? enviroTargetSheetsEmployee.length
                    : 0)
                : (allEmployeeList?.length ?? 0),
              itemsPerPage: empLimit,
              totalPages: Math.max(
                Math.ceil(
                  (isEnviroSolution
                    ? (Array.isArray(enviroTargetSheetsEmployee?.data)
                        ? enviroTargetSheetsEmployee.data.length
                        : Array.isArray(enviroTargetSheetsEmployee)
                        ? enviroTargetSheetsEmployee.length
                        : 0)
                    : (allEmployeeList?.length ?? 0)) / empLimit
                ),
                1
              ),
            }}
            onPageChange={setEmpPage}
            onItemsPerPageChange={(value) => {
              setEmpLimit(value);
              setEmpPage(1);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AdminTargetSheet;