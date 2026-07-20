import React, { useState, useEffect } from "react";
import { TiEye } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb.jsx";
import { useTheme } from "../../../../../hooks/theme/useTheme.js";
import Pagination from "../../../../../components/uiComponents/pagination/Pagination.jsx";
import Button from "../../../../../components/uiComponents/button/Button.jsx";
import LoaderSpinner from "../../../../../components/uiComponents/loader/LoaderSpinner.jsx";
import useMonthlyPlanning from "../../../../../hooks/salesExecutiveHook/customerVisitPlan/useMonthlyPlanning.js";
const MonthlyPlanning = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { monthlyPlanningList, loading, fetchMonthlyPlanningList, resetOneMonthPlanningList } = useMonthlyPlanning();

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dateError, setDateError] = useState("");

  const onPageChange = (data) => {
    console.log("data", data);
    setPage(data);
  };

  const onItemsPerPageChange = (data) => {
    setLimit(data);
  };

  useEffect(() => {
    const from = new Date(fromDate);
    const to = new Date(toDate);

    if (fromDate && toDate && from > to) {
      setDateError("From Date cannot be greater than To Date.");
      return;
    }

    setDateError("");
    fetchMonthlyPlanningList(page, limit, fromDate, toDate);
  }, [fromDate, toDate, page, limit]);

  //   setDateError("");
  //   fetchMonthlyPlanningList(page, limit, fromDate, toDate);
  // }, [fromDate, toDate, page, limit]);

  const handleViewClick = (salesId, month, year) => {
    navigate(
      `/sales-executive/monthly-planning/view-month-wise/${salesId}/${month}/${year}`
    );
  };

  return (
    <div className="w-full min-h-screen">
      {/* Breadcrumb */}
      <BreadCrumb
        linkText={[
          { text: "Customer Visit Plan" },
          { text: "Monthly Planning" },
        ]}
      />

      <div className="p-4 bg-white rounded-2xl">
        {/* Header Section */}
        <div className="flex justify-between gap-4 flex-wrap items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Monthly Planning List
          </h1>
          {/* <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold">From</span>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => { setFromDate(e.target.value); setPage(1) }}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">To</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => { setToDate(e.target.value); setPage(1); }}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                />
              </div>
            </div>
            {dateError && (
              <div className="text-red-500 text-sm font-medium mt-1">
                {dateError}
              </div>
            )}
          </div> */}

          <Button
            onClick={() =>
              navigate("/sales-executive/monthly-planning/create-monthly-plan")
            }
            variant={1}
            text="Create Monthly Plan"
          />
        </div>

        <hr
          className="h-1 border-0 mb-3"
          style={{ backgroundColor: theme.secondaryColor }}
        />

        {/* Table */}
        <div className="shadow overflow-x-auto rounded-t-2xl border border-gray-200">
          <table className="min-w-full text-sm text-left text-gray-700 table-auto">
            <thead
              className="sticky top-0 z-10 uppercase bg-gray-100 border-b border-gray-300"
              style={{ backgroundColor: theme.secondaryColor }}
            >
              <tr>
                <th className="p-4 text-base font-semibold text-left">
                  Sr. No.
                </th>
                <th className="p-4 text-base font-semibold text-left">Month</th>
                <th className="p-4 text-base font-semibold text-left">Year</th>
                <th className="p-4 text-base font-semibold text-left">
                  Total Plannings
                </th>
                <th className="p-4 text-base font-semibold text-left">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center">
                    <div className="flex justify-center items-center w-full">
                      <LoaderSpinner />
                    </div>
                  </td>
                </tr>
              ) : monthlyPlanningList?.data?.length > 0 ? (
                monthlyPlanningList.data.map((plan, index) => (
                  <tr key={index} className="text-left hover:bg-gray-50 transition-all">
                    <td className="p-4 text-[17px] font-normal text-[#252C58]">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="p-4 text-[17px] font-normal text-[#252C58]">
                      {plan.month}
                    </td>
                    <td className="p-4 text-[17px] font-normal text-[#252C58]">
                      {plan.year}
                    </td>
                    <td className="p-4 pl-20  text-[17px] font-normal text-[#252C58] ">
                      {plan.totalPlannings}
                    </td>
                    <td className="p-4 text-center text-[19px] align-middle">
                      <button
                        onClick={() => { resetOneMonthPlanningList(); handleViewClick(plan.sales_id,plan.month, plan.year) }}
                        className="text-black hover:bg-blue-200 rounded-full w-8 h-8 flex items-center justify-center"
                        aria-label="View details"
                      >
                        <TiEye size={18} color={theme.primaryColor} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="p-4 text-center text-[17px] text-gray-500"
                  >
                    No monthly planning data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="rounded-b-2xl bg-white shadow-lg border border-gray-200 overflow-hidden">
          {(!loading || monthlyPlanningList?.data?.length > 0) && (
            <Pagination
              currentPage={monthlyPlanningList?.currentPage}
              totalItems={monthlyPlanningList?.totalModules}
              itemsPerPage={limit}
              totalPages={monthlyPlanningList?.totalPages}
              onPageChange={onPageChange}
              onItemsPerPageChange={onItemsPerPageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthlyPlanning;
