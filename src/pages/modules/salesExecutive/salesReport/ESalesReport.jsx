import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, ChevronDown } from "lucide-react";
import { FaEye } from "react-icons/fa";
import BreadCrumb from "../../../../components/uiComponents/breadcrumb/BreadCrumb";
import { useTheme } from "../../../../hooks/theme/useTheme";
import Button from "../../../../components/uiComponents/button/Button";
import useGetSalesReport from "../../../../hooks/salesReport/useSalesReport";

import FilterDropdown from "./FilterDropdown";

const ESalesReport = () => {
  const { getSalesFilter, loading, salesReportsFilter } = useGetSalesReport();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [showFilter, setShowFilter] = useState(false);
  const [filterType, setFilterType] = useState("range");
  const [from, setFrom] = useState("2025-07-01");
  const [to, setTo] = useState("2025-08-30");

  const handleView = (id) => {
    navigate(`/sales-executive/sales-report/view-report/${id}`);
  };

  const handleSearch = () => {
    getSalesFilter(filterType, from, to);
    setShowFilter(false);
  };

  return (
    <div className="min-h-screen w-full">
      {/* breadcrumbs */}
      <BreadCrumb
        linkText={[{ text: "Sales Team Analysis" }, { text: "Sales Report" }]}
      />

      <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Sales Report List</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Button
                variant={1}
                text={<Filter size={18} />}
                onClick={() => setShowFilter(!showFilter)}
              />
              {showFilter && (
                <FilterDropdown
                  from={from}
                  to={to}
                  setFrom={setFrom}
                  setTo={setTo}
                  onSearch={handleSearch}
                  onClose={() => setShowFilter(false)}
                />
              )}
            </div>
            <Button variant={1} text="Export ▼" />
          </div>
        </div>
        <hr
          className="h-1 border-0"
          style={{ backgroundColor: theme.secondaryColor }}
        />

        {/* Table */}
        <div className="overflow-x-auto mt-3 rounded-2xl border border-gray-200">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead
              className="sticky top-0 z-10 text-xs uppercase bg-gray-100 border-b border-gray-300"
              style={{ backgroundColor: theme.secondaryColor }}
            >
              <tr>
                <th className="p-4 text-base font-semibold">Sr. No.</th>
                <th className="p-4 text-base font-semibold">
                  Sales Person Name
                </th>
                <th className="p-4 text-base font-semibold">Total Target</th>
                <th className="p-4 text-base font-semibold">
                  Total Achievements
                </th>
                <th className="p-4 text-base font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {salesReportsFilter?.reports?.length > 0 ? (
                salesReportsFilter.reports.map((item, idx) => (
                  <tr key={item?._id || idx} className="hover:bg-gray-50 transition-all">
                    <td className="p-4">{idx + 1}</td>
                    <td className="p-4">{item.firstName} {item.lastName}</td>
                    <td className="p-4">{item.billAmount}</td>
                    <td className="p-4">{item.noOfProductSold}</td>
                    <td className="p-4">
                      <button
                        className="p-2 rounded-full hover:bg-yellow-100 hover:scale-105 transition-all duration-200"
                        style={{ color: theme.primaryColor }}
                        onClick={() => handleView(item?._id)}
                      >
                        <FaEye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500 italic">
                    This section is temporarily unavailable. It will be available once the finance section is ready.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

        {/* Pagination */}
        {/* <div className="flex justify-end items-center px-6 py-4 border-t text-sm bg-white rounded-b-2xl gap-4">
          <div className="flex items-center gap-2">
            <button className="border px-3 py-1">&lt; Prev</button>
            <button className="border px-3 py-1 bg-blue-600 text-white">Next &gt;</button>
          </div>
          <div className="flex items-center gap-2">
            <span>Page:</span>
            <input
              type="number"
              value={1}
              readOnly
              className="border px-2 py-1 w-12 rounded"
            />
            <span>of 10</span>
            <select className="ml-2 border px-2 py-1 rounded">
              <option>15</option>
              <option>30</option>
              <option>50</option>
            </select>
          </div>
        </div> */}
      </div>
    </div>
  );
};
export default ESalesReport;
