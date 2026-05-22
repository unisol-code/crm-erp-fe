import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TiEye } from "react-icons/ti";
import { FiFilter } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import Pagination from "../../../../../components/uiComponents/pagination/Pagination.jsx";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb.jsx";
import { useTheme } from "../../../../../hooks/theme/useTheme.js";
import Button from "../../../../../components/uiComponents/button/Button.jsx";
import LoaderSpinner from "../../../../../components/uiComponents/loader/LoaderSpinner.jsx";
import useMonthlyPlanning from "../../../../../hooks/salesExecutiveHook/customerVisitPlan/useMonthlyPlanning.js";
import useDropdown from "../../../../../hooks/dropdown/useDropdown.js";
import Select from "react-select";
import * as XLSX from "xlsx-js-style";

const ViewMonthlyPlanning = () => {
  const navigate = useNavigate();
  const {
    fetchOneMonthPlanningList,
    oneMonthPlanningList,
    loading,
    resetMonthlyPlanningDetails,
  } = useMonthlyPlanning();
  const { month, year } = useParams();
  console.log("Month:", month, "Year:", year);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showFilter, setShowFilter] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const { theme } = useTheme();
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [selectedPerson, setSelectedPerson] = useState("");
  const {
    loading: dropDownLoading,
    organizationList,
    fetchDoctorList,
    doctorList,
    fetchOrganizationNames,
  } = useDropdown();

  const onPageChange = (data) => {
    console.log("data", data);
    setPage(data);
  };

  const onItemsPerPageChange = (data) => {
    setLimit(data);
  };

  useEffect(() => {
    fetchDoctorList();
    fetchOrganizationNames();
  }, []);

  useEffect(() => {
    fetchOneMonthPlanningList(
      page,
      limit,
      month,
      year,
      selectedPerson,
      selectedOrganization
    );
  }, [page, limit]);

  const handleExport = () => {
    if (!oneMonthPlanningList?.data || oneMonthPlanningList.data.length === 0) {
      return;
    }

    const dataRows = oneMonthPlanningList.data.map((entry, index) => ({
      "Sr. No.": index + 1,
      "Date": entry.date ? (() => {
        const d = new Date(entry.date);
        const datePart = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
        const timePart = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
        return `${datePart}, ${timePart}`;
      })() : "-",
      "Organization Name": entry.organizationName || "-",
      "Person Name": entry.personName || "-",
      "Product To Be Promoted": entry.productToBePromoted || "-",
      "Call Objective": entry.callObjective || "-",
    }));

    const ws = XLSX.utils.json_to_sheet(dataRows);

    // Apply bold style to headers
    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!ws[address]) continue;
      ws[address].s = {
        font: { bold: true },
      };
    }

    // Apply column widths to prevent overlapping
    ws["!cols"] = [
      { wch: 10 }, // Sr. No.
      { wch: 15 }, // Date
      { wch: 25 }, // Organization Name
      { wch: 25 }, // Person Name
      { wch: 30 }, // Product To Be Promoted
      { wch: 25 }, // Call Objective
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Monthly Planning");

    XLSX.writeFile(wb, `Monthly_Planning_${month}_${year}.xlsx`);
  };

  return (
    <div className="w-full min-h-screen">
      {/* Breadcrumbs */}
      <BreadCrumb
        linkText={[
          { text: "Customer Visit Plan" },
          {
            text: "Monthly Planning",
            href: "/sales-executive/monthly-planning",
          },
          { text: "View Monthly Planning" },
        ]}
      />

      <div className="p-4 bg-white rounded-2xl">
        <div className="flex items-center justify-between mb-4 relative">
          <h2 className="text-lg font-semibold text-gray-800">
            {month && year
              ? `${month} ${year} Planning List`
              : "Monthly Planning List"}
          </h2>

          <div className="flex items-center gap-3">
            {/* Filter Button */}
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 text-sm"
            >
              <FiFilter size={16} />
            </button>

            {/* Export Button */}
            <div className="relative">
              <button
                onClick={handleExport}
                className="flex items-center gap-1 px-4 py-1.5 border border-gray-300 text-white rounded-md bg-[var(--primary-color)] text-sm"
              >
                Export to Excel
              </button>
            </div>

            {/* Filter Popup */}
            {showFilter && (
              <div className="absolute top-12 right-0 w-[50%] bg-white border border-gray-300 rounded-xl shadow-2xl z-50 p-4">
                <div className="grid grid-cols-1 gap-4">
                  {/* Person Name Select */}
                  <div>
                    <label className="block text-sm mb-1">
                      Select Person name:
                    </label>
                    <Select
                      isLoading={dropDownLoading}
                      isClearable
                      placeholder="Select Person name"
                      classNamePrefix="react-select"
                      value={
                        doctorList
                          ?.map((doc) => ({
                            label: doc.fullName,
                            value: doc.fullName,
                          }))
                          .find((option) => option.value === selectedPerson) ||
                        null
                      }
                      onChange={(selectedOption) => {
                        setSelectedPerson(selectedOption?.value || "");
                      }}
                      options={doctorList?.map((doc) => ({
                        label: doc.fullName,
                        value: doc.fullName,
                      }))}
                    />
                  </div>

                  {/* Organization Select */}
                  <div>
                    <label className="block text-sm mb-1">
                      Select Organization:
                    </label>
                    <Select
                      isLoading={dropDownLoading}
                      isClearable
                      placeholder="Select Organization"
                      classNamePrefix="react-select"
                      value={
                        organizationList?.data
                          ?.map((org) => ({
                            label: org,
                            value: org,
                          }))
                          .find(
                            (option) => option.value === selectedOrganization
                          ) || null
                      }
                      onChange={(selectedOption) => {
                        setSelectedOrganization(selectedOption?.value || "");
                      }}
                      options={organizationList?.data?.map((org) => ({
                        label: org,
                        value: org,
                      }))}
                    />
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <Button
                    text="Search"
                    variant={1}
                    onClick={() => {
                      setShowFilter(false);
                      setPage(1);
                      fetchOneMonthPlanningList(
                        1,
                        limit,
                        month,
                        year,
                        selectedPerson,
                        selectedOrganization
                      );
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="shadow overflow-x-auto mt-3 rounded-t-2xl border border-gray-200">
          <table className="min-w-full text-sm text-left text-gray-700 table-auto">
            <thead
              className="sticky top-0 z-10 text-xs uppercase bg-gray-100 border-b border-gray-300"
              style={{ backgroundColor: theme.secondaryColor }}
            >
              <tr className="text-left">
                {[
                  "Sr. No.",
                  "Date",
                  "Organization Name",
                  "Person Name",
                  "Product To Be Promoted",
                  "Call Objective",
                  "Action",
                ].map((heading, idx) => (
                  <th
                    key={idx}
                    className="p-4 text-base font-semibold text-center"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center">
                    <div className="flex justify-center items-center w-full">
                      <LoaderSpinner />
                    </div>
                  </td>
                </tr>
              ) : oneMonthPlanningList?.data &&
                oneMonthPlanningList?.data?.length > 0 ? (
                oneMonthPlanningList.data.map((entry, index) => {
                  const formatDateTime = (dateStr) => {
                    if (!dateStr) return "-";
                    const d = new Date(dateStr);
                    const datePart = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
                    const timePart = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
                    return `${datePart}, ${timePart}`;
                  };
                  return (
                  <tr
                    key={index}
                    className="text-center hover:bg-gray-50 transition-all"
                  >
                    <td className="p-4 text-[17px] text-[#252C58]">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="p-4 text-[17px] text-[#252C58]">
                      {formatDateTime(entry.date)}
                    </td>
                    <td className="p-4 text-[17px] text-[#252C58]">
                      {entry.organizationName || "-"}
                    </td>
                    <td className="p-4 text-[17px] text-[#252C58]">
                      {entry.personName || "-"}
                    </td>
                    <td className="p-4 text-[17px] text-[#252C58]">
                      {entry.productToBePromoted || "-"}
                    </td>
                    <td className="p-4 text-[17px] text-[#252C58]">
                      {entry.callObjective || "-"}
                    </td>
                    <td className="p-2 text-[19px] text-[#252C58] align-middle">
                      <div className="flex justify-center">
                        <button
                          className="text-black hover:bg-blue-200 rounded-full w-8 h-8 flex items-center justify-center"
                          onClick={() => {
                            resetMonthlyPlanningDetails();
                            navigate(
                              `/sales-executive/monthly-planning/view-monthly-planning/${month}/${year}/view-monthly-planning-details/${entry._id}`
                            );
                          }}
                        >
                          <TiEye
                            size={18}
                            style={{ color: theme.primaryColor }}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
              ) : (
                <tr>
                  <td
                    colSpan="7"
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
        <div className="rounded-b-2xl bg-white shadow-lg overflow-hidden">
          {!loading && oneMonthPlanningList?.data?.length > 0 && (
            <Pagination
              currentPage={oneMonthPlanningList?.currentPage}
              totalItems={oneMonthPlanningList?.totalItems}
              itemsPerPage={limit}
              totalPages={oneMonthPlanningList?.totalPages}
              onPageChange={onPageChange}
              onItemsPerPageChange={onItemsPerPageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewMonthlyPlanning;
