// pages/modules/superAdmin/AllSalesAnalytics/EnviroEmployeeBreakdown.jsx

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { useTheme } from "../../../../hooks/theme/useTheme";
import BreadCrumb from "../../../../components/uiComponents/breadcrumb/BreadCrumb";
import Pagination from "../../../../components/uiComponents/pagination/Pagination.jsx";
import useAllSalesEnviroAnalytics from "../../../../hooks/superAdminHook/allSalesAnalytics/useAllSalesEnviroAnalytics";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableCell,
  Input,
} from "./components/common";

const EnviroEmployeeBreakdown = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const {
    enviroEmployeesData,
    enviroEmployeesLoading,
    fetchEnviroEmployeesAnalytics,
  } = useAllSalesEnviroAnalytics();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchEnviroEmployeesAnalytics({ page, limit });
  }, [page, limit, fetchEnviroEmployeesAnalytics]);

  // Leaving the breakdown goes back ONE page (usually /sales-analyticsAll where
  // the "Total Employees" KPI card lives). On a direct page load there is no
  // history, so fall back to the analytics page itself.
  const handleBack = () => {
    if (location.key && location.key !== "default") {
      navigate(-1);
    } else {
      navigate("/sales-analyticsAll");
    }
  };

  // ✅ Open the executive profile of one employee.
  //    `backTo` is passed along so the profile page knows where its back
  //    button has to return to (this breakdown).
  const handleViewEmployee = (emp) => {
    const identifier = emp?._id || emp?.id || emp?.employeeId;
    if (!identifier) return;

    navigate(`/sales-analyticsAll/Executive-type-breakdown/${encodeURIComponent(identifier)}`, {
      state: {
        name: emp?.employeeName || "",
        backTo: {
          pathname: "/sales-analyticsAll/enviro-employee-breakdown",
          label: "Back to Enviro Employees",
        },
      },
    });
  };

  const rows = useMemo(
    () =>
      Array.isArray(enviroEmployeesData?.data) ? enviroEmployeesData.data : [],
    [enviroEmployeesData],
  );

  const currentPage = enviroEmployeesData?.currentPage || page;
  const totalPages = enviroEmployeesData?.totalPages || 0;
  const totalRecords = enviroEmployeesData?.totalRecords ?? rows.length;
  const perPage = enviroEmployeesData?.limit || limit;

  const filteredRows = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (emp) =>
        emp.employeeName?.toLowerCase().includes(q) ||
        emp.reportingManagerName?.toLowerCase().includes(q) ||
        String(emp.employeeId || "").toLowerCase().includes(q),
    );
  }, [rows, searchTerm]);

  const getInitials = (name) =>
    String(name || "?")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();

  const totals = useMemo(
    () =>
      filteredRows.reduce(
        (acc, emp) => ({
          individuals: acc.individuals + (emp.totalIndividuals || 0),
          organizations: acc.organizations + (emp.totalOrganizations || 0),
          successVisits: acc.successVisits + (emp.successVisitCount || 0),
        }),
        { individuals: 0, organizations: 0, successVisits: 0 },
      ),
    [filteredRows],
  );

  const summaryCards = [
    {
      label: "Employees",
      value: filteredRows.length,
      icon: LucideIcons.Users,
      className: "bg-blue-50 text-blue-700 border-blue-100",
    },
    {
      label: "Individuals",
      value: totals.individuals,
      icon: LucideIcons.UserRound,
      className: "bg-green-50 text-green-700 border-green-100",
    },
    {
      label: "Organizations",
      value: totals.organizations,
      icon: LucideIcons.Building2,
      className: "bg-purple-50 text-purple-700 border-purple-100",
    },
    {
      label: "Success Visits",
      value: totals.successVisits,
      icon: LucideIcons.CheckCircle2,
      className: "bg-teal-50 text-teal-700 border-teal-100",
    },
  ];

  const breadcrumbItems = [
    { text: "Sales Analytics", href: "/sales-analyticsAll" },
    { text: "Enviro Employees" },
  ];

  return (
    <div className="min-h-screen">
      <BreadCrumb linkText={breadcrumbItems} />


      <div
        className="rounded-t-xl bg-gradient-to-r p-6 shadow-lg shadow-slate-900/10"
        style={{ backgroundColor: theme.secondaryColor }}
      >
        <div className="flex items-center gap-3 justify-center">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Back to sales analytics"
            className="p-2 rounded-lg bg-white/60 hover:bg-white transition-colors"
          >
            <LucideIcons.ArrowLeft size={20} className="text-black" />
          </button>
          <h2 className="font-semibold text-xl text-black bg-opacity-40">
            Enviro Employees
          </h2>
        </div>
        <p className="mt-2 text-center text-xs font-medium text-black/70">
          {totalRecords} employee{totalRecords === 1 ? "" : "s"} • individuals,
          organizations and successful visits per employee
        </p>
      </div>

      <div className="p-6 bg-white shadow-md rounded-b-[10px] space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className={`rounded-xl border p-4 ${card.className}`}
              >
                <div className="flex items-center gap-2">
                  <Icon size={16} />
                  <p className="text-xs font-semibold uppercase tracking-wider">
                    {card.label}
                  </p>
                </div>
                <p className="text-xl font-bold mt-1">{card.value}</p>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-1.5 text-sm text-[var(--theme-primary)] font-medium hover:underline"
          >
            <LucideIcons.ArrowLeft size={16} />
            Back to Sales Analytics
          </button>
          <p className="text-xs font-medium text-[var(--theme-text-secondary)]">
            Page {currentPage} of {totalPages || 1}
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--theme-border)] bg-white p-4">
            <div>
              <h2 className="text-base font-bold text-[var(--theme-text-primary)]">
                Employees
              </h2>
              <p className="mt-0.5 text-xs font-medium text-[var(--theme-text-secondary)]">
                Showing {filteredRows.length} of {totalRecords} employee
                {totalRecords === 1 ? "" : "s"} • Page {currentPage} of{" "}
                {totalPages || 1}
              </p>
            </div>
            <div className="relative w-full max-w-xs">
              <LucideIcons.Search
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--theme-text-secondary)]"
              />
              <Input
                value={searchTerm}
                onChange={(e) => {
                  setPage(1);
                  setSearchTerm(e.target.value);
                }}
                placeholder="Search employee or manager…"
                className="rounded-xl bg-white pl-9"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table className="min-w-[780px]">
              <TableHeader>
                <tr className="border-b border-[var(--theme-border)] bg-[var(--theme-bg-light)]">
                  <TableHead className="w-14 text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)]">
                    Sr. No.
                  </TableHead>
                  <TableHead className="min-w-[220px] whitespace-nowrap text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)]">
                    Employee
                  </TableHead>
                  <TableHead className="whitespace-nowrap text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)]">
                    Reporting Manager
                  </TableHead>
                  <TableHead className="whitespace-nowrap text-right text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)]">
                    Individuals
                  </TableHead>
                  <TableHead className="whitespace-nowrap text-right text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)]">
                    Organizations
                  </TableHead>
                  <TableHead className="whitespace-nowrap text-right text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)]">
                    Success Visits
                  </TableHead>
                  <TableHead className="whitespace-nowrap text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)]">
                    Action
                  </TableHead>
                </tr>
              </TableHeader>
              <TableBody>
                {enviroEmployeesLoading ? (
                  [0, 1, 2, 3].map((s) => (
                    <tr
                      key={`skeleton-${s}`}
                      className="border-b border-[var(--theme-border)]"
                    >
                      <TableCell>
                        <div className="h-4 w-8 animate-pulse rounded bg-gray-200" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-gray-200" />
                          <div className="space-y-1.5">
                            <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                            <div className="h-3 w-16 animate-pulse rounded bg-gray-100" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="h-6 w-28 animate-pulse rounded-full bg-gray-200" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="ml-auto h-4 w-10 animate-pulse rounded bg-gray-200" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="ml-auto h-4 w-10 animate-pulse rounded bg-gray-200" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="ml-auto h-6 w-16 animate-pulse rounded-full bg-gray-200" />
                      </TableCell>
                      <TableCell>
                        <div className="h-8 w-8 animate-pulse rounded-lg bg-gray-200" />
                      </TableCell>
                    </tr>
                  ))
                ) : filteredRows.length === 0 ? (
                  <tr className="border-b border-[var(--theme-border)]">
                    <TableCell colSpan={7} className="px-4 py-12 text-center">
                      <LucideIcons.Users
                        size={32}
                        className="mx-auto mb-2 text-gray-300"
                      />
                      <p className="text-sm font-medium text-[var(--theme-text-primary)]">
                        {searchTerm
                          ? `No employees match "${searchTerm}"`
                          : "No employee data available"}
                      </p>
                      {searchTerm && (
                        <button
                          type="button"
                          onClick={() => setSearchTerm("")}
                          className="mt-1 text-xs font-medium text-[var(--theme-primary)] hover:underline"
                        >
                          Clear search
                        </button>
                      )}
                    </TableCell>
                  </tr>
                ) : (

                  filteredRows.map((emp, idx) => (
                    <tr
                      key={emp._id || emp.employeeId || idx}
                      className="border-b border-[var(--theme-border)] transition-colors last:border-b-0 hover:bg-[var(--theme-bg-hover)]"
                    >
                      <TableCell className="text-xs font-medium text-[var(--theme-text-secondary)]">
                        {(currentPage - 1) * perPage + idx + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span
                            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold text-white"
                            style={{
                              backgroundColor: theme.primaryColor,
                            }}
                          >
                            {getInitials(emp.employeeName)}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium text-[var(--theme-text-primary)]">
                              {emp.employeeName || "—"}
                            </span>
                            {emp.employeeId && (
                              <span className="block text-[11px] font-medium text-[var(--theme-text-secondary)]">
                                ID: {emp.employeeId}
                              </span>
                            )}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-block max-w-56 truncate rounded-full border border-[var(--theme-border)] bg-[var(--theme-bg-light)] px-2.5 py-1 align-middle text-xs font-medium text-[var(--theme-primary)]">
                          {emp.reportingManagerName || "—"}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-right text-sm font-medium">
                        {emp.totalIndividuals ?? 0}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-right text-sm font-medium">
                        {emp.totalOrganizations ?? 0}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-right">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-green-100 bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700">
                          <LucideIcons.CheckCircle2 size={13} />
                          {emp.successVisitCount ?? 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => handleViewEmployee(emp)}
                            title="View executive profile"
                            aria-label={`View profile of ${emp.employeeName || "employee"}`}
                            className="inline-flex items-center justify-center rounded-lg border border-[var(--theme-border)] bg-[var(--theme-bg-light)] p-2 text-[var(--theme-primary)] transition-colors hover:bg-[var(--theme-primary)] hover:text-white"
                          >
                            <LucideIcons.Eye size={16} />
                          </button>
                        </div>
                      </TableCell>
                    </tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 0 && (
            <div className="border-t border-[var(--theme-border)] bg-[var(--theme-bg-light)]/50 px-4 py-3">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalRecords}
                itemsPerPage={perPage}
                onPageChange={setPage}
                onItemsPerPageChange={(newLimit) => {
                  setLimit(newLimit);
                  setPage(1);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnviroEmployeeBreakdown;

