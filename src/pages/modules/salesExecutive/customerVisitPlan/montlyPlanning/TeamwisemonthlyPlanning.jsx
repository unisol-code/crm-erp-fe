import React, { useState, useEffect, useMemo } from "react";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb.jsx";
import DataTable from "../../../../../components/uiComponents/dataTable/DataTable.jsx";
import { useTheme } from "../../../../../hooks/theme/useTheme.js";
import useMonthlyPlanning from "../../../../../hooks/salesExecutiveHook/customerVisitPlan/useMonthlyPlanning.js";
import { useNavigate } from "react-router-dom";

const TeamwisemonthlyPlanning = () => {
  const { theme } = useTheme();
   const navigate = useNavigate();
  const {
    loading,
    teamWiseYearlyPlanning,
    fetchTeamWiseYearlyPlanning,
    resetTeamWiseYearlyPlanning,
  } = useMonthlyPlanning();

  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [teamDrillId, setTeamDrillId] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    fetchTeamWiseYearlyPlanning(year, teamDrillId ?? undefined);
    return () => resetTeamWiseYearlyPlanning();
  }, [year, teamDrillId]);

  const { summary, viewing } = teamWiseYearlyPlanning ?? {};
  const rows = summary?.rows ?? [];
  const teamTotal = summary?.teamTotal ?? null;

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * limit;
    return rows.slice(start, start + limit);
  }, [rows, page, limit]);

  const handleTeamView = (id, row) => {
    if (!id) return;
    if (row?.hasChildren) {
      setTeamDrillId(id);
      setPage(1);
    }else {
      navigate(`/sales-executive/monthly-planning/universal-monthly-planning/${row._id }`);     
    } 
  };

  const handleTeamBack = () => {
    setTeamDrillId(null);
    setPage(1);
  };

  const columns = [
    { key: "type", header: "Type", align: "left" },
    { key: "employeeName", header: "Employee Name", align: "left" },
    { key: "designation", header: "Designation", align: "left" },
    { key: "totalAppointments", header: "Total", align: "center" },
    { key: "pending", header: "Pending", align: "center" },
    { key: "done", header: "Done", align: "center" },
    { key: "postponed", header: "Postponed", align: "center" },
    { key: "cancelled", header: "Cancelled", align: "center" },
    { key: "quotationsSubmitted", header: "Quotations", align: "center" },
    { key: "salesInitiated", header: "Sales Initiated", align: "center" },
    { key: "individualCount", header: "Individuals", align: "center" },
    { key: "organizationCount", header: "Organizations", align: "center" },
    { key: "completionRate", header: "Completion %", align: "center" },
  ];

  const yearOptions = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i);

  return (
    <div className="w-full min-h-screen">
      <BreadCrumb linkText={[{ text: "Customer Visit Plan" }, { text: "Team Wise Monthly Planning" }]} />
      <div className="p-4 bg-white rounded-2xl">
        <div className="flex justify-between gap-4 flex-wrap items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Team Wise Monthly Planning</h2>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Year</label>
            <select
              value={year}
              onChange={(e) => { setYear(e.target.value); setPage(1); }}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            >
              {yearOptions.map((y) => (
                <option key={y} value={String(y)}>{y}</option>
              ))}
            </select>
          </div>
        </div>
        <hr className="h-1 border-0 mb-6" style={{ backgroundColor: theme.secondaryColor }} />

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
              onClick={handleTeamBack}
              className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all"
            >
              ← Back to Top
            </button>
          </div>
        )}

        {teamTotal && (
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex flex-col px-4 py-2 border rounded-lg bg-white">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Total Appointments</span>
              <span className="text-[17px] font-semibold text-[#252C58]">{teamTotal.totalAppointments ?? 0}</span>
            </div>
            <div className="flex flex-col px-4 py-2 border rounded-lg bg-white">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Pending</span>
              <span className="text-[17px] font-semibold text-[#252C58]">{teamTotal.pending ?? 0}</span>
            </div>
            <div className="flex flex-col px-4 py-2 border rounded-lg bg-white">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Done</span>
              <span className="text-[17px] font-semibold text-[#252C58]">{teamTotal.done ?? 0}</span>
            </div>
            <div className="flex flex-col px-4 py-2 border rounded-lg bg-white">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Completion %</span>
              <span className="text-[17px] font-semibold text-[#252C58]">{teamTotal.completionRate ?? 0}</span>
            </div>
          </div>
        )}

        <DataTable
          columns={columns}
          rows={paginatedRows}
          loading={loading}
          emptyMessage="No team monthly planning data available."
          srNoStartIndex={(page - 1) * limit}
          onRowView={handleTeamView}
          actionLabel="View team"
          pagination={{
            currentPage: page,
            totalItems: rows.length,
            itemsPerPage: limit,
            totalPages: Math.max(Math.ceil(rows.length / limit), 1),
          }}
          onPageChange={setPage}
          onItemsPerPageChange={(value) => { setLimit(value); setPage(1); }}
        />
      </div>
    </div>
  );
};

export default TeamwisemonthlyPlanning;
