import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb.jsx";
import DataTable from "../../../../../components/uiComponents/dataTable/DataTable.jsx";
import { useTheme } from "../../../../../hooks/theme/useTheme.js";
import useCompany from "../../../../../hooks/common/useCompany.js";
import useTargetSheet from "../../../../../hooks/salesExecutiveHook/customerVisitPlan/useTaregtSheet.js";
import { teamWiseTargetSheetStateAtom } from "../../../../../state/salesExecutiveState/customerVisitPlan/targetSheetState";
import { useRecoilValue } from "recoil";
import Button from "../../../../../components/uiComponents/button/Button.jsx";

const formatCurrency = (v) =>
  v === null || v === undefined ? "-" : `₹ ${Number(v).toLocaleString("en-IN")}`;

const Stat = ({ label, value }) => (
  <div className="flex flex-col px-4 py-2 border rounded-lg bg-white">
    <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
    <span className="text-[17px] font-semibold text-[#252C58]">{value}</span>
  </div>
);

const TeamWiseTargetSheet = () => {
  const { theme } = useTheme();
  const { isEnviroSolution, isCompanyLoaded } = useCompany();
  const navigate = useNavigate();
  const {
    loading,
    teamWiseTargetSheet,
    fetchTeamWiseTargetSheet,
    resetTeamWiseTargetSheet,
  } = useTargetSheet();

  const sheetData = useRecoilValue(teamWiseTargetSheetStateAtom);

  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [teamDrillId, setTeamDrillId] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const yearOptions = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i);

  useEffect(() => {
    if (isCompanyLoaded && !isEnviroSolution) {
      fetchTeamWiseTargetSheet(year, teamDrillId ?? undefined);
    }
    return () => {
      resetTeamWiseTargetSheet();
    };
  }, [year, teamDrillId, isEnviroSolution, isCompanyLoaded]);

  const viewing = sheetData?.viewing;
  const hasOwnTarget = sheetData?.hasOwnTarget;
  const rows = sheetData?.rows ?? [];
  const teamTotal = sheetData?.teamTotal;

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * limit;
    return rows.slice(start, start + limit);
  }, [rows, page, limit]);

  const columns = [
    { key: "type", header: "Type", align: "left" },
    { key: "employeeName", header: "Employee Name", align: "left" },
    { key: "designation", header: "Designation", align: "left" },
    { key: "hospitalCount", header: "Hospitals", align: "center" },
    { key: "annualProductCount", header: "Products", align: "center" },
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
  const handleRowView = (id, row) => {
    if (!id) return;
    // if (hasOwnTarget && row?.hasOwnTarget) {
      if (row?.hasOwnTarget) {
      navigate(`/sales-executive/target-sheet/teamwise-universal-target-sheet/${id}`);
      return;
    }
    setTeamDrillId(id);
    setPage(1);
  };

  const handleBack = () => {
    setTeamDrillId(null);
    setPage(1);
  };

  return (
    <div className="w-full min-h-screen">
      <BreadCrumb
        linkText={[{ text: "Customer Visit Plan" }, { text: "Target Sheet" }]}
      />

      <div className="p-4 bg-white rounded-2xl">
        <div className="flex justify-between gap-4 flex-wrap items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Team Wise Target Sheet</h2>
          <Button variant={1} text="Pending Approval Target Sheet" onClick={() => navigate("/sales-executive/target-sheet/teamwise-pending-approval-target-sheet")}/>
           
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Year</label>
            <select
              value={year}
              onChange={(e) => {
                setYear(e.target.value);
                setPage(1);
              }}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            >
              {yearOptions.map((y) => (
                <option key={y} value={String(y)}>{y}</option>
              ))}
            </select>
          </div>
        </div>
        <hr
          className="h-1 border-0 mb-6"
          style={{ backgroundColor: theme.secondaryColor }}
        />

        {teamDrillId && (
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <span className="text-[15px] text-gray-600">
              Viewing team of{" "}
              <span className="font-semibold text-[#252C58]">
                {viewing?.employeeName ?? "selected member"}
              </span>
              {viewing?.designation ? ` (${viewing.designation})` : ""}
            </span>
            <button
              onClick={handleBack}
              className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all"
            >
              ← Back to Top
            </button>
          </div>
        )}

        {teamTotal && (
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <Stat label="Hospitals" value={teamTotal.hospitalCount ?? 0} />
            <Stat label="Products" value={teamTotal.annualProductCount ?? 0} />
            <Stat label="Target Qty" value={teamTotal.annualTargetQuantity ?? 0} />
            <Stat label="Achieved Qty" value={teamTotal.annualAchievedQuantity ?? 0} />
            <Stat label="Target Price" value={formatCurrency(teamTotal.annualTargetPrice)} />
            <Stat label="Achieved Price" value={formatCurrency(teamTotal.annualAchievedPrice)} />
          </div>
        )}

        <DataTable
          columns={columns}
          rows={paginatedRows}
          loading={loading}
          emptyMessage="No team target sheet data available."
          srNoStartIndex={(page - 1) * limit}
          onRowView={handleRowView}
          actionLabel="View team"
          pagination={{
            currentPage: page,
            totalItems: rows.length,
            itemsPerPage: limit,
            totalPages: Math.max(Math.ceil(rows.length / limit), 1),
          }}
          onPageChange={setPage}
          onItemsPerPageChange={(value) => {
            setLimit(value);
            setPage(1);
          }}
        />
      </div>
    </div>
  );
};

export default TeamWiseTargetSheet;
