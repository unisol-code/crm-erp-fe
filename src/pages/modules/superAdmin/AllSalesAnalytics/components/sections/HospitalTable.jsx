// components/sections/HospitalTable.jsx

import React, { useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../common";
import Pagination from "../../../../../../components/uiComponents/pagination/Pagination.jsx";
import LoaderSpinner from "../../../../../../components/uiComponents/loader/LoaderSpinner.jsx";
import * as LucideIcons from "lucide-react";
import { Input } from "../common";

export function HospitalTable({ 
  data, 
  loading = false, 
  tableLoading = false,
  pagination = {},
  onPageChange,
  onItemsPerPageChange,
  onSearch,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);

  const hospitals = data?.data || [];
  const totalRecords = data?.totalRecords || 0;
  const totalPages = data?.totalPages || 1;
  const currentPage = data?.currentPage || pagination.currentPage || 1;
  const pageSize = data?.pageSize || pagination.pageSize || 10;

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handlePageChange = (page) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const handleItemsPerPageChange = (limit) => {
    if (onItemsPerPageChange) {
      onItemsPerPageChange(limit);
    }
  };

  const toggleExpand = (hospitalId) => {
    setExpandedRow(expandedRow === hospitalId ? null : hospitalId);
  };

  // ✅ Render specialities as tags
  const renderSpecialities = (specialities) => {
    if (!specialities || specialities.length === 0) {
      return <span className="text-gray-400 text-sm">No specialities</span>;
    }

    const validSpecialities = specialities.filter(s => s.speciality && s.speciality.trim() !== '');
    
    if (validSpecialities.length === 0) {
      return <span className="text-gray-400 text-sm">No specialities</span>;
    }

    return (
      <div className="flex flex-wrap gap-1">
        {validSpecialities.slice(0, 2).map((spec, idx) => (
          <span
            key={idx}
            className="px-2 py-1 bg-[var(--theme-bg-light)] text-[var(--theme-primary)] text-xs rounded-full border border-[var(--theme-border)]"
          >
            {spec.speciality}
          </span>
        ))}
        {validSpecialities.length > 2 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
            +{validSpecialities.length - 2}
          </span>
        )}
      </div>
    );
  };

  // ✅ Render surgery types for expanded row
  const renderSurgeryDetails = (specialities) => {
    if (!specialities) return null;

    const validSpecialities = specialities.filter(s => s.speciality && s.speciality.trim() !== '');
    
    if (validSpecialities.length === 0) {
      return <p className="text-gray-400 text-sm">No surgery details available</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {validSpecialities.map((spec, idx) => (
          <div key={idx} className="bg-white p-4 rounded-lg border border-[var(--theme-border)]">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-[var(--theme-primary)]">{spec.speciality}</h4>
              <span className="px-2 py-1 bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] text-xs rounded-full">
                Total: {spec.totalSurgeries || 0}
              </span>
            </div>
            {spec.surgeryTypes && spec.surgeryTypes.length > 0 && (
              <div className="space-y-1">
                {spec.surgeryTypes.map((surgery, sIdx) => (
                  <div key={sIdx} className="flex justify-between text-sm border-b border-gray-100 py-1 last:border-0">
                    <span className="text-gray-600">{surgery.surgeryType}</span>
                    <span className="font-medium">{surgery.numberOfSurgeries}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-[var(--theme-border)] shadow-md overflow-hidden">
      {/* Header with Search */}
      <div className="flex items-center justify-between gap-4 flex-wrap p-4 border-b border-[var(--theme-border)]">
        <div>
          <h2 className="text-lg font-bold text-[var(--theme-text-primary)]">Hospitals</h2>
          <p className="text-xs text-[var(--theme-text-secondary)]">
            Total {totalRecords} hospitals found
          </p>
        </div>
        {/* <div className="relative w-56 max-w-full">
          <LucideIcons.Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--theme-primary)]"
          />
          <Input
            placeholder="Search hospital or city"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 rounded-xl bg-white border-[var(--theme-bg-sidebar)] focus:ring-[var(--theme-primary)]"
          />
        </div> */}
      </div>

      {/* Table */}
      <div className="shadow overflow-x-auto rounded-t-2xl border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-[var(--theme-bg-light)]">
              <TableHead className="text-base font-semibold">Sr. No.</TableHead>
              <TableHead className="text-base font-semibold">Hospital</TableHead>
              <TableHead className="text-base font-semibold">Type</TableHead>
              <TableHead className="text-base font-semibold">City</TableHead>
              <TableHead className="text-base font-semibold">District</TableHead>
              <TableHead className="text-base font-semibold">State</TableHead>
              <TableHead className="text-base font-semibold text-right">Beds</TableHead>
              <TableHead className="text-base font-semibold text-right">ICU</TableHead>
              <TableHead className="text-base font-semibold text-right">OT</TableHead>
              <TableHead className="text-base font-semibold text-center">Specialities</TableHead>
              {/* <TableHead className="text-base font-semibold text-center">Action</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200">
            {loading || tableLoading ? (
              <TableRow>
                <TableCell colSpan={11} className="p-8 text-center">
                  <div className="flex justify-center items-center w-full">
                    <LoaderSpinner />
                  </div>
                </TableCell>
              </TableRow>
            ) : hospitals.length > 0 ? (
              hospitals.map((hospital, index) => (
                <React.Fragment key={hospital._id || index}>
                  <TableRow className="hover:bg-gray-50 transition-all">
                    <td className="p-4 text-[17px] font-normal text-[#252C58]">
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>
                    <td className="px-4 py-3 text-[15px] whitespace-nowrap font-medium text-[var(--theme-primary)]">
                      {hospital.hospitalName}
                    </td>
                    <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                      <span className="px-2 py-1 bg-[var(--theme-bg-light)] rounded-full text-xs">
                        {hospital.hospitalType || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                      {hospital.city}
                    </td>
                    <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                      {hospital.district}
                    </td>
                    <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                      {hospital.state}
                    </td>
                    <td className="px-4 py-3 text-[15px] whitespace-nowrap text-right">
                      {hospital.totalBeds}
                    </td>
                    <td className="px-4 py-3 text-[15px] whitespace-nowrap text-right">
                      {hospital.totalICUBeds}
                    </td>
                    <td className="px-4 py-3 text-[15px] whitespace-nowrap text-right">
                      {hospital.totalOT}
                    </td>
                    <td className="px-4 py-3 text-[15px] whitespace-nowrap text-center">
                      {renderSpecialities(hospital.specialities)}
                    </td>
                    {/* <td className="px-4 py-3 text-[15px] whitespace-nowrap text-center">
                      {hospital.specialities && hospital.specialities.length > 0 && (
                        <button
                          onClick={() => toggleExpand(hospital._id)}
                          className="px-3 py-1 bg-[var(--theme-primary)] text-white text-xs rounded-lg hover:bg-[var(--theme-accent)] transition-colors flex items-center gap-1 mx-auto"
                        >
                          {expandedRow === hospital._id ? (
                            <>
                              <LucideIcons.ChevronUp size={14} />
                              Hide Details
                            </>
                          ) : (
                            <>
                              <LucideIcons.ChevronDown size={14} />
                              View Details
                            </>
                          )}
                        </button>
                      )}
                    </td> */}
                  </TableRow>

                  {/* ✅ Expanded Row with Surgery Details */}
                  {expandedRow === hospital._id && (
                    <TableRow className="bg-[var(--theme-card-bg)]">
                      <TableCell colSpan={11} className="px-6 py-4">
                        <div>
                          <h4 className="text-sm font-semibold text-[var(--theme-text-primary)] mb-3 flex items-center gap-2">
                            <LucideIcons.Stethoscope size={18} className="text-[var(--theme-primary)]" />
                            Surgery Details - {hospital.hospitalName}
                          </h4>
                          {renderSurgeryDetails(hospital.specialities)}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="p-4 text-center text-[17px] text-gray-500"
                >
                  No hospitals found matching your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
           <div className="rounded-b-2xl bg-white shadow-lg border border-gray-200 overflow-hidden">
        {!loading && !tableLoading && hospitals.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={totalRecords}
            itemsPerPage={pageSize}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}
      </div>
    </div>
  );
}