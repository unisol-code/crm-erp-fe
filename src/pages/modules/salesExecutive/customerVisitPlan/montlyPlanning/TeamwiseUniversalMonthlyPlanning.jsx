import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb.jsx";
import DataTable from "../../../../../components/uiComponents/dataTable/DataTable.jsx";
import { useTheme } from "../../../../../hooks/theme/useTheme.js";
import useMonthlyPlanning from "../../../../../hooks/salesExecutiveHook/customerVisitPlan/useMonthlyPlanning.js";

const TeamwiseUniversalMonthlyPlanning = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    loading,
    teamWiseMonthMonthlyPlanning,
    fetchTeamWiseMonthMonthlyPlanning,
    resetTeamWiseMonthMonthlyPlanning,
  } = useMonthlyPlanning();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    if (id) fetchTeamWiseMonthMonthlyPlanning(id);
    return () => resetTeamWiseMonthMonthlyPlanning();
  }, [id]);

  const data = teamWiseMonthMonthlyPlanning?.data ?? [];
  const year = teamWiseMonthMonthlyPlanning?.year;

  const paginated = useMemo(() => {
    const start = (page - 1) * limit;
    return data.slice(start, start + limit);
  }, [data, page, limit]);

  const columns = [
    { key: "month", header: "Month", align: "left" },
    { key: "year", header: "Year", align: "center" },
    { key: "totalPlannings", header: "Total Plannings", align: "center" },
    { key: "pending", header: "Pending", align: "center" },
    { key: "done", header: "Done", align: "center" },
    { key: "postponed", header: "Postponed", align: "center" },
    { key: "cancelled", header: "Cancelled", align: "center" },
    { key: "quotationsSubmitted", header: "Quotations", align: "center" },
  ];

  return (
    <div className="w-full min-h-screen">
      <BreadCrumb linkText={[{ text: "Customer Visit Plan" }, { text: "Universal Monthly Planning" }]} />
      <div className="p-4 bg-white rounded-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Universal Monthly Planning {year ? `(${year})` : ""}
        </h2>
        <hr className="h-1 border-0 mb-6" style={{ backgroundColor: theme.secondaryColor }} />
        <DataTable
          columns={columns}
          rows={paginated}
          loading={loading}
          emptyMessage="No monthly planning data available."
          showAction
          viewKey="_id"
          onRowView={(rowId, row) => {
            navigate(`/sales-executive/monthly-planning/view-month-wise/${id}/${row.month}/${row.year}`);
          }}
          actionLabel="View"
          srNoStartIndex={(page - 1) * limit}
          pagination={{
            currentPage: page,
            totalItems: data.length,
            itemsPerPage: limit,
            totalPages: Math.max(Math.ceil(data.length / limit), 1),
          }}
          onPageChange={setPage}
          onItemsPerPageChange={(value) => { setLimit(value); setPage(1); }}
        />
      </div>
    </div>
  );
};

export default TeamwiseUniversalMonthlyPlanning;
