import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import Select from "react-select";
import { useTheme } from "../../../../hooks/theme/useTheme";
import Pagination from "../../../../components/uiComponents/pagination/Pagination";
import { useNavigate } from "react-router-dom";
import useDashboard from "../../../../hooks/dashboard/useDashboard";
import useDropdown from "../../../../hooks/dropdown/useDropdown";
import { Formik } from "formik";

const quarterOptions = [
  { value: "Q1", label: "Q1" },
  { value: "Q2", label: "Q2" },
  { value: "Q3", label: "Q3" },
  { value: "Q4", label: "Q4" },
];

const BusinessSnapshot = () => {
  const [region, setRegion] = useState(null);
  const [quarter, setQuarter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { loading, fetchBusinessSnapShot, businessSnapShot } = useDashboard();
  const { fetchAllStateName, allStateName } = useDropdown();
  // const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default to 2 rows per page

  const { theme } = useTheme();

  const filteredData =
    businessSnapShot?.data?.filter((item) => {
      const matchesName = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // ✅ Region filter
      const matchesRegion = region
        ? item.state.toLowerCase() === region.value.toLowerCase()
        : true;

      // ✅ Quarter filter
      const month = new Date(item.date).getMonth() + 1; // 1–12
      let matchesQuarter = true;
      if (quarter) {
        if (quarter.value === "Q1") matchesQuarter = month >= 1 && month <= 3;
        if (quarter.value === "Q2") matchesQuarter = month >= 4 && month <= 6;
        if (quarter.value === "Q3") matchesQuarter = month >= 7 && month <= 9;
        if (quarter.value === "Q4") matchesQuarter = month >= 10 && month <= 12;
      }

      return matchesName && matchesRegion && matchesQuarter;
    }) || [];


  // --- pagination logic ---
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchBusinessSnapShot();
    fetchAllStateName();
  }, [])
  console.log("fetchBusinessSnapShot", businessSnapShot);
  console.log("fetchAllStateName", allStateName);
  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <span className="text-lg font-semibold">Business SnapShot</span>

        <div className="flex items-center bg-white px-3 py-2 rounded w-full sm:w-1/3 border border-gray-300">
          <Search size={16} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search sales person here"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="outline-none w-full text-sm"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">

          <Select
            options={
              Array.isArray(allStateName)
                ? allStateName.map((state) => ({
                  label: state.stateName,
                  value: state.stateName,  // use full name for filtering
                }))
                : []
            }
            value={region}
            onChange={(selected) => {
              setRegion(selected);
              setCurrentPage(1); // reset to first page when filter changes
            }}
            placeholder="Select State"
            className="w-full sm:w-48 text-sm"
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: "6px",
                padding: "2px",
                fontSize: "0.875rem",
              }),
            }}
          />
          <Select
            options={quarterOptions}
            value={quarter}
            onChange={setQuarter}
            placeholder="Select Quarter"
            className="w-full sm:w-48 text-sm"
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: "6px",
                padding: "2px",
                fontSize: "0.875rem",
              }),
            }}
          />
        </div>
      </div>

      <div className="mt-5 overflow-x-auto border border-gray-200 rounded-2xl">
        <table className="min-w-full text-sm text-left">
          <thead
            className="text-lg text-black"
            style={{ backgroundColor: theme.secondaryColor }}
          >
            <tr>
              <th className="p-4">Sr No.</th>
              <th className="p-4">Name of Sales Person</th>
              <th className="p-4">Total Target Calls</th>
              <th className="p-4">Calls Achieved</th>
              <th className="p-4">Speciality</th>
              <th className="p-4">Achieved Target Vs Calls</th>
              <th className="p-4">Tenure in Organization</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr key={index} className="bg-white">
                  <td className="p-4 font-medium text-gray-700">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="p-4 font-medium text-gray-700">{item?.name}</td>
                  <td className="p-4">{item?.totalTargetCalls}</td>
                  <td className="p-4">{item?.callsAchieved}</td>
                  <td className="p-4">{item?.Speciality}</td>
                  <td className="p-4">{item?.achievedVsTarget}</td>
                  <td className="p-4">{item?.tenure} Years</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7} // number of columns
                  className="p-4 text-center text-black"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>


        </table>


      </div>
      {/* Pagination Component */}
      {/* <div className="rounded-b-2xl bg-white shadow-lg overflow-x-auto border-t border-gray-200 w-full mx-auto "> */}
      {/* <div className="rounded-b-2xl bg-white shadow-lg overflow-x-auto border-t border-gray-200 
                w-580 max-w-5xl md:max-w-5xl mx-auto"> */}
      <div className="rounded-b-2xl bg-white shadow-lg border border-gray-200 overflow-hidden">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />

      </div>
    </div>

  );
};

export default BusinessSnapshot;
