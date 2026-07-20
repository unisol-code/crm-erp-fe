import React, { useState, useEffect } from "react";
import { TiEye } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb.jsx";
import { useTheme } from "../../../../../hooks/theme/useTheme.js";
import Pagination from "../../../../../components/uiComponents/pagination/Pagination.jsx";
import Button from "../../../../../components/uiComponents/button/Button.jsx";
import LoaderSpinner from "../../../../../components/uiComponents/loader/LoaderSpinner.jsx";
import useSalesReport from "../../../../../hooks/salesReport/useSalesReport.js";
const EmployeeList = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
 
  const { getEmployeeList, allEmployee, loading } = useSalesReport();

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

  const handleViewClick = (id) => {
    navigate(
      `/admin/sales-executive/monthly-planning/${id}`,
    );
  };

  useEffect(() => {
    getEmployeeList(page, limit);
  }, [page, limit]);

  // const id = allEmployee?.data?._id;

  return (
    <div className="w-full min-h-screen">
      {/* Breadcrumb */}
      <BreadCrumb
        linkText={[{ text: "Customer Visit Plan" }, { text: "Employee List" }]}
      />

      <div className="p-4 bg-white rounded-2xl">
        {/* Header Section */}
        <div className="flex justify-between gap-4 flex-wrap items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Employee List</h1>

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
                <th className="p-4 text-base font-semibold text-left">Photo</th>
                <th className="p-4 text-base font-semibold text-center">
                  Name
                </th>
                <th className="p-4 text-base font-semibold text-left">EmpID</th>
                <th className="p-4 text-base font-semibold text-left">
                  Designation
                </th>
                <th className="p-4 text-base font-semibold text-left">
                  Department
                </th>
                <th className="p-4 text-base font-semibold text-left">
                  Contact Number
                </th>
                <th className="p-4 text-base font-semibold text-left">Email</th>
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
              ) : allEmployee?.data?.length > 0 ? (
                allEmployee?.data?.map((employee, index) => (
                  <tr
                    key={index}
                    className="text-left hover:bg-gray-50 transition-all"
                  >
                    <td className="p-4 text-[17px] font-normal text-[#252C58]">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={employee.photo}
                          alt={employee.fullName || "Employee Photo"}
                          className="w-12 h-12 rounded-full object-cover border border-gray-300"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                      {employee.fullName}
                    </td>
                    <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                      {employee.employeeId}
                    </td>

                    <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                      {employee.designation}
                    </td>
                    <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                      {employee.department}
                    </td>
                    <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                      {employee.phoneNumber}
                    </td>
                    <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                      {employee.officialEmail}
                    </td>

                    <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                      <button
                        onClick={() => {
                          // resetOneMonthPlanningList();
                          handleViewClick(employee._id);
                        }}
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
          {(!loading || allEmployee?.length > 0) && (
            // <Pagination
            //   currentPage={allEmployee?.currentPage}
            //   totalItems={allEmployee?.totalItems}
            //   itemsPerPage={limit}
            //   totalPages={allEmployee?.totalPages}
            //   onPageChange={onPageChange}
            //   onItemsPerPageChange={onItemsPerPageChange}
            // />

            <Pagination
              currentPage={allEmployee?.pagination?.currentPage}
              totalItems={allEmployee?.pagination?.totalCount}
              itemsPerPage={allEmployee?.pagination?.limit}
              totalPages={allEmployee?.pagination?.totalPages}
              onPageChange={onPageChange}
              onItemsPerPageChange={onItemsPerPageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;
