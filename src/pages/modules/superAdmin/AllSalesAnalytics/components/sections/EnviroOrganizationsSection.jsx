// components/sections/EnviroOrganizationsSection.jsx
//
// Enviro Solution only.
//
// Used by the "Enviro Organizations" tab. It replaces the "Organizations" tab
// (the healthcare one) for enviro users and shows the organizations list
// returned by:
//   GET dashboard/getAllEnviroOrganizationsAnalytics
//   (fetchEnviroOrganizationsAnalytics)
//
// Response shape:
//   { success, currentPage, totalPages, totalRecords, limit, hasNextPage,
//     hasPreviousPage,
//     data: [ { _id, sectionName, OrganizationType, uniqueId, organizationName,
//               state, region, cityTownVillage, district, salesPersonName } ] }
//
// Pagination is server side, so page / limit live in index.jsx and are passed
// back here together with the change handlers.

import React, { useEffect, useMemo, useRef, useState } from "react";
import * as LucideIcons from "lucide-react";
import { ChartCard } from "../analytics";
import {
  Badge,
  Input,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../common";
import LoaderSpinner from "../../../../../../components/uiComponents/loader/LoaderSpinner.jsx";
import Pagination from "../../../../../../components/uiComponents/pagination/Pagination.jsx";
import Select from "react-select";
import useDropdown from "../../../../../../hooks/dropdown/useDropdown";

const COLUMNS = 11;

export function EnviroOrganizationsSection({
  organizationsData = null,
  loading = false,
  filters = {},
  currentPage = 1,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
  onSearch,
  onSalesPersonFilter,
  onViewOrganization,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSalesPerson, setSelectedSalesPerson] = useState(null);
  const searchTimeoutRef = useRef(null);
  const onSearchRef = useRef(onSearch);
  const onSalesPersonFilterRef = useRef(onSalesPersonFilter);

  // ✅ Fetch sales executive dropdown from API
  const { salesExecutive, fetchSalesExecutive } = useDropdown();

  useEffect(() => {
    fetchSalesExecutive();
  }, [fetchSalesExecutive]);

  // ✅ Keep refs updated with the latest callbacks
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    onSalesPersonFilterRef.current = onSalesPersonFilter;
  }, [onSalesPersonFilter]);

  // ✅ How we know a real user change happened.
  //    The refs start at the CURRENT value, so the first effect run (and the
  //    StrictMode double-run in dev) is treated as "nothing changed" and no
  //    request is fired. Only a genuine change of a value triggers a fetch.
  const prevSearchRef = useRef(searchTerm);
  const prevSalesPersonRef = useRef(selectedSalesPerson?.value || "");

  const salesPersonValue = selectedSalesPerson?.value || "";

  // ✅ Sales person filter - fire the API on the SAME movement as the selection.
  //    Search and sales person are handled separately on purpose: the sales
  //    person is not debounced, the search box is.
  useEffect(() => {
    if (prevSalesPersonRef.current === salesPersonValue) return;
    prevSalesPersonRef.current = salesPersonValue;

    // A search may still be pending. It is safe to drop it, because the request
    // below is built with the search term that is already in the page state -
    // this avoids firing two requests for one interaction.
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (onSalesPersonFilterRef.current) {
      onSalesPersonFilterRef.current(salesPersonValue);
    }
  }, [salesPersonValue]);

  // ✅ Debounced search - fire the API when the search term actually changes
  useEffect(() => {
    if (prevSearchRef.current === searchTerm) return;
    prevSearchRef.current = searchTerm;

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (onSearchRef.current) {
        onSearchRef.current(searchTerm);
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  // ✅ Sales person options from the API dropdown
  const salesPersonOptions = useMemo(() => {
    if (salesExecutive && Array.isArray(salesExecutive)) {
      return salesExecutive.map((sp) => ({ label: sp, value: sp }));
    }
    return [];
  }, [salesExecutive]);

  // ✅ Rows of the current page
  const organizations = useMemo(
    () => (Array.isArray(organizationsData?.data) ? organizationsData.data : []),
    [organizationsData]
  );

  // ✅ Pagination info comes from the API response (flat, not nested)
  const page = organizationsData?.currentPage || currentPage || 1;
  const perPage = organizationsData?.limit || itemsPerPage || 10;
  const totalPages = organizationsData?.totalPages || 0;
  const totalRecords = organizationsData?.totalRecords ?? organizations.length;


  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-[var(--theme-accent)] mb-2">
        Enviro Organizations
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Organization-wise directory and engagement intelligence
        {filters.state && (
          <span className="ml-2 font-medium text-[var(--theme-primary)]">
            Filtered by: {filters.state}
          </span>
        )}
        {filters.district && (
          <span className="ml-2 font-medium text-[var(--theme-primary)]">
            | {filters.district}
          </span>
        )}
      </p>

      <ChartCard
        title="Organization Directory"
        subtitle="All enviro organizations of the selected filters"
      >
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <LucideIcons.Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <Input
              type="text"
              placeholder="Search by organization"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="w-full sm:w-64">
            <Select
              isClearable
              placeholder="Filter by Sales Person"
              value={selectedSalesPerson}
              onChange={setSelectedSalesPerson}
              options={salesPersonOptions}
              classNamePrefix="react-select"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: '0.5rem',
                  borderColor: '#d1d5db',
                  minHeight: '40px',
                  boxShadow: 'none',
                  '&:hover': { borderColor: 'var(--theme-primary)' },
                }),
                placeholder: (base) => ({
                  ...base,
                  color: '#9ca3af',
                }),
              }}
            />
          </div>
        </div>
        <div className="shadow overflow-x-auto rounded-t-2xl border border-gray-200">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow className="bg-[var(--theme-bg-light)]">
                <TableHead className="text-base font-semibold">Sr. No.</TableHead>
                 <TableHead className="text-base font-semibold">Sales Person</TableHead>
                <TableHead className="text-base font-semibold">Organization Name</TableHead>
                <TableHead className="text-base font-semibold">Unique ID</TableHead>
                <TableHead className="text-base font-semibold">Section</TableHead>
                <TableHead className="text-base font-semibold">Organization Type</TableHead>
                <TableHead className="text-base font-semibold">State</TableHead>
                <TableHead className="text-base font-semibold">Region</TableHead>
                <TableHead className="text-base font-semibold">City / Town / Village</TableHead>
                <TableHead className="text-base font-semibold">District</TableHead>
                <TableHead className="text-base font-semibold">Action</TableHead>
               
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-200">
              {loading ? (
                <TableRow>
                  <TableCell colSpan={COLUMNS} className="p-8 text-center">
                    <div className="flex justify-center items-center w-full">
                      <LoaderSpinner />
                    </div>
                  </TableCell>
                </TableRow>
              ) : organizations.length > 0 ? (
                organizations.map((org, index) => (
                  <TableRow
                    key={org?._id || index}
                    className="hover:bg-gray-50 transition-all"
                  >
                    <TableCell className="p-4 text-[17px] font-normal text-[#252C58]">
                      {(page - 1) * perPage + index + 1}
                    </TableCell>
                        <TableCell className="px-4 py-3 text-[15px] whitespace-nowrap">
                      {org?.salesPersonName || "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-[15px] whitespace-nowrap font-medium text-[var(--theme-primary)]">
                      {org?.organizationName || "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-[15px] whitespace-nowrap">
                      {org?.uniqueId || "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-[15px] whitespace-nowrap">
                      {org?.sectionName || "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-[15px] whitespace-nowrap">
                      <Badge
                        variant="secondary"
                        className="rounded-full bg-[var(--theme-bg-light)] text-[var(--theme-text-secondary)] border-[var(--theme-border)]"
                      >
                        {org?.OrganizationType || "-"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-[15px] whitespace-nowrap">
                      {org?.state || "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-[15px] whitespace-nowrap">
                      {org?.region || "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-[15px] whitespace-nowrap">
                      {org?.cityTownVillage || "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-[15px] whitespace-nowrap">
                      {org?.district || "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => onViewOrganization?.(org)}
                          title="View organization details"
                          aria-label={`View details of ${org?.organizationName || "organization"}`}
                          className="inline-flex items-center justify-center rounded-lg border border-[var(--theme-border)] bg-[var(--theme-bg-light)] p-2 text-[var(--theme-primary)] transition-colors hover:bg-[var(--theme-primary)] hover:text-white"
                        >
                          <LucideIcons.Eye size={16} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={COLUMNS}
                    className="text-center py-8 text-sm text-gray-500"
                  >
                    No organizations match your search or filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="rounded-b-2xl bg-white shadow-lg border border-gray-200 overflow-hidden">
          {!loading && totalRecords > 0 && (
            <Pagination
              currentPage={page}
              totalItems={totalRecords}
              itemsPerPage={perPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              onItemsPerPageChange={onItemsPerPageChange}
            />
          )}
        </div>
      </ChartCard>
    </div>
  );
}

export default EnviroOrganizationsSection;


