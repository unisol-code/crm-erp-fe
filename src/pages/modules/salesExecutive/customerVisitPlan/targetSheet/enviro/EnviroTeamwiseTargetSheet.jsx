import React, { useState, useEffect, useMemo } from "react";
import BreadCrumb from "../../../../../../components/uiComponents/breadcrumb/BreadCrumb.jsx";
import DataTable from "../../../../../../components/uiComponents/dataTable/DataTable.jsx";
import { useTheme } from "../../../../../../hooks/theme/useTheme.js";
import useCompany from "../../../../../../hooks/common/useCompany.js";
import useEnviroTargetSheetExecutive from "../../../../../../hooks/salesExecutiveHook/customerVisitPlan/useEnviroTargetSheetExecutive.js";
import { teamWiseTargetSheetStateAtom } from "../../../../../../state/salesExecutiveState/customerVisitPlan/targetSheetState";
import { useRecoilValue, useSetRecoilState } from "recoil";

const formatCurrency = (v) =>
  v === null || v === undefined ? "-" : `â¹ ${Number(v).toLocaleString("en-IN")}`;

const Stat = ({ label, value }) => (
  <div className="flex flex-col px-4 py-2 border rounded-lg bg-white">
    <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
    <span className="text-[17px] font-semibold text-[#252C58]">{value}</span>
  </div>
);

const EnviroTeamwiseTargetSheet = () => {
  const { theme } = useTheme();
  const { isEnviroSolution, isCompanyLoaded } = useCompany();
  const {
    loading,
    teamWiseTargetSheetDetails,
    fetchEnviroTeamWiseTargetSheet,
    resetTeamWiseTargetSheetDetails,
  } = useEnviroTargetSheetExecutive();

  const [activeTab, setActiveTab] = useState("teamWise");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [enviroSheetType, setEnviroSheetType] = useState("Product");
  const [enviroYear, setEnviroYear] = useState(String(new Date().getFullYear()));
  const [teamDrillId, setTeamDrillId] = useState(null);
  const currentYear = new Date().getFullYear();
  const enviroYearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const year = enviroYear ?? "_";

  const teamWiseSheetFromAtom = useRecoilValue(teamWiseTargetSheetStateAtom);

  useEffect(() => {
  if (!isCompanyLoaded || !isEnviroSolution) return;

  fetchEnviroTeamWiseTargetSheet(
    enviroSheetType,
    year,
    teamDrillId ?? undefined
  );

  return () => {
    resetTeamWiseTargetSheetDetails();
  };
}, [enviroSheetType, year, teamDrillId, isEnviroSolution, isCompanyLoaded]);
  useEffect(() => {
    if (isCompanyLoaded && isEnviroSolution) {
      fetchEnviroTeamWiseTargetSheet(enviroSheetType, year);
    }
    return () => {
      resetTeamWiseTargetSheetDetails();
    };
  }, [enviroSheetType, year, isEnviroSolution, isCompanyLoaded]);

  useEffect(() => {
    if (activeTab === "teamWise") {
      setPage(1);
    }
  }, [activeTab]);

   const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "teamWise") setPage(1);
  };

  const handleViewEmployee = (id, row) => {
    if (!id) return;
    // TODO: route to employee-wise target sheet page
    console.log("View employee:", id);
    setTeamDrillId(id);
  };

  const {
    viewing,
    tables,
    sheetTypes,
  } = teamWiseSheetFromAtom ?? {};

  const enviroCurrentTable = tables?.[enviroSheetType] || {};
  const enviroRows = enviroCurrentTable.rows ?? [];
  const enviroTeamTotal = enviroCurrentTable.total || {};

  const enviroPaginatedRows = useMemo(() => {
    const start = (page - 1) * limit;
    return enviroRows.slice(start, start + limit);
  }, [enviroRows, page, limit]);

  const enviroTeamColumns = [
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

  return (
    <div className="w-full min-h-screen">
      <BreadCrumb
        linkText={[{ text: "Customer Visit Plan" }, { text: "Target Sheet" }]}
      />

      <div className="p-4 bg-white rounded-2xl">
        <div className="flex justify-between gap-4 flex-wrap items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Enviro Team Wise Target Sheet
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
          </div>
        </div>
        <hr
          className="h-1 border-0 mb-6"
          style={{ backgroundColor: theme.secondaryColor }}
        />

        {activeTab === "teamWise" && (
          <>
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
                  {[...(sheetTypes || []), "Product", "Service", "Project"].filter(Boolean).map((type) => (
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
              {viewing && (
                <span className="text-sm text-gray-600">
                  Viewing team of{" "}
                  <span className="font-semibold text-[#252C58]">
                    {viewing?.employeeName ?? "team"}
                  </span>
                  {viewing?.designation
                    ? ` (${viewing.designation})`
                    : ""}
                </span>
              )}
            </div>

            {enviroTeamTotal && Object.keys(enviroTeamTotal).length > 0 && (
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

            {teamDrillId && (
              <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                <span className="text-[15px] text-gray-600">
                  Viewing team of{" "}
                  <span className="font-semibold text-[#252C58]">
                    {viewing?.employeeName ?? "selected member"}
                  </span>
                  {viewing?.designation
                    ? ` (${viewing.designation})`
                    : ""}
                </span>
                <button
                onClick={() => {
                  setTeamDrillId(null);
                  setPage(1);
                }}
                className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all"
              >
                ← Back to Top
              </button>
              </div>
            )}

            <DataTable
              columns={enviroTeamColumns}
              rows={enviroPaginatedRows}
              loading={loading}
              emptyMessage={`No ${enviroSheetType} team target sheet data available.`}
              srNoStartIndex={(page - 1) * limit}
              showAction
              onRowView={handleViewEmployee}
              actionLabel="View team"
              pagination={{
                currentPage: page,
                totalItems: enviroRows.length,
                itemsPerPage: limit,
                totalPages: Math.max(
                  Math.ceil((enviroRows.length ?? 0) / limit),
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
      </div>
    </div>
  );
};

export default EnviroTeamwiseTargetSheet;
