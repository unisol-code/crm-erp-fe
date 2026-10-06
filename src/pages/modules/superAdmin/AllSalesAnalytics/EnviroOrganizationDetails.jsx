// pages/modules/superAdmin/AllSalesAnalytics/EnviroOrganizationDetails.jsx
//
// Enviro Solution only.
//
// Detail page opened from the eye icon in the "Enviro Organizations" tab
// (route: /sales-analyticsAll/enviro-organization-details/:id).
//
// Data comes from the single-organization API:
//   GET dashboard/getSpecificOrganizatioData/:id?year=..
//   (fetchSpecificEnviroOrganizationData)
//
// Response shape:
//   { success, totalIndividuals, filteredYear,
//     individuals: [ { name, typeOfProfile, segment, designation,
//                      organizationName } ],
//     monthlyPlannings: [ { month, year,
//                           plannings: [ { _id, createPlanningForDate,
//                                          nameOfDoctor, selectOrganization,
//                                          productToBePromoted, callObjective,
//                                          meetingStatus, sales_id } ] } ] }

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import Select from "react-select";
import { useTheme } from "../../../../hooks/theme/useTheme";
import BreadCrumb from "../../../../components/uiComponents/breadcrumb/BreadCrumb";
import LoaderSpinner from "../../../../components/uiComponents/loader/LoaderSpinner";
import useAllSalesEnviroAnalytics from "../../../../hooks/superAdminHook/allSalesAnalytics/useAllSalesEnviroAnalytics";
import {
  Badge,
  Input,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./components/common";

const INDIVIDUAL_COLUMNS = 7;
const PLANNING_COLUMNS = 7;

const MONTH_ORDER = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// "2026-09-23T11:09:00.000Z" -> "23 Sep 2026"
const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Sorts the month groups of the API (month name + year) newest first
const sortMonthGroups = (groups) =>
  [...groups].sort((a, b) => {
    const yearDiff = (b?.year || 0) - (a?.year || 0);
    if (yearDiff !== 0) return yearDiff;
    return MONTH_ORDER.indexOf(b?.month) - MONTH_ORDER.indexOf(a?.month);
  });

const EnviroOrganizationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  const {
    enviroSpecificOrganizationData,
    enviroSpecificOrganizationLoading,
    enviroSpecificOrganizationError,
    fetchSpecificEnviroOrganizationData,
    resetEnviroSpecificOrganizationData,
  } = useAllSalesEnviroAnalytics();

  const [year, setYear] = useState("");
  const [individualSearch, setIndividualSearch] = useState("");
  const [planningSearch, setPlanningSearch] = useState("");

  // Drop the previous organization as soon as another one is opened, so the
  // page can never show data that belongs to the row the user clicked before.
  useEffect(() => {
    resetEnviroSpecificOrganizationData();
  }, [id, resetEnviroSpecificOrganizationData]);

  // ✅ Single source of truth for the request: both id and year live here
  useEffect(() => {
    if (!id) return;
    fetchSpecificEnviroOrganizationData(id, { year });
  }, [id, year, fetchSpecificEnviroOrganizationData]);

  // ✅ Leaving the page goes back ONE step (the Enviro Organizations tab).
  //    On a direct page load there is no history, so fall back to the
  //    analytics page itself.
  const handleBack = () => {
    if (location.key && location.key !== "default") {
      navigate(-1);
    } else {
      navigate("/sales-analyticsAll");
    }
  };

  const individuals = useMemo(
    () =>
      Array.isArray(enviroSpecificOrganizationData?.individuals)
        ? enviroSpecificOrganizationData.individuals
        : [],
    [enviroSpecificOrganizationData],
  );

  const monthGroups = useMemo(
    () =>
      Array.isArray(enviroSpecificOrganizationData?.monthlyPlannings)
        ? sortMonthGroups(enviroSpecificOrganizationData.monthlyPlannings)
        : [],
    [enviroSpecificOrganizationData],
  );

  const totalIndividuals =
    enviroSpecificOrganizationData?.totalIndividuals ?? individuals.length;

  const totalPlannings = useMemo(
    () =>
      monthGroups.reduce(
        (sum, group) =>
          sum + (Array.isArray(group?.plannings) ? group.plannings.length : 0),
        0,
      ),
    [monthGroups],
  );

  // ✅ Year options: the years the API returned, the filtered year and a
  //    rolling last-10-years window, so the dropdown always has a useful range.
  const yearOptions = useMemo(() => {
    const years = new Set();
    monthGroups.forEach((group) => {
      if (group?.year) years.add(Number(group.year));
    });
    if (enviroSpecificOrganizationData?.filteredYear) {
      years.add(Number(enviroSpecificOrganizationData.filteredYear));
    }
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= currentYear - 9; y--) {
      years.add(y);
    }

    return [...years]
      .sort((a, b) => b - a)
      .map((y) => ({ label: String(y), value: String(y) }));
  }, [monthGroups, enviroSpecificOrganizationData?.filteredYear]);

  const selectedYearOption = year
    ? { label: year, value: year }
    : null;

  const organizationName =
    location.state?.organizationName ||
    individuals[0]?.organizationName ||
    "Organization Details";

  const uniqueId = location.state?.uniqueId || "";

  // ✅ Open the details page of one individual of this organization.
  //
  //    This list does NOT carry the individual `_id` (the API only sends name,
  //    typeOfProfile, segment, designation, organizationName), so:
  //      - when the API does send `_id` we use it straight away;
  //      - otherwise the NAME is used as the route parameter and the details
  //        page turns it into an id through the individuals list API.
  //
  //    `backTo` is passed along so the details page knows where "Back" has to
  //    return to - the organization this individual was opened from.
  const handleViewIndividual = (person) => {
    if (!person) return;
    const identifier = person._id || person.name;
    if (!identifier) return;

    navigate(
      `/sales-analyticsAll/enviro-individual-details/${encodeURIComponent(identifier)}`,
      {
        state: {
          name: person.name || "",
          typeOfProfile: person.typeOfProfile || "",
          organizationName: person.organizationName || organizationName,
          backTo: {
            pathname: `/sales-analyticsAll/enviro-organization-details/${id}`,
            label: "Back to Organization",
            state: { organizationName, uniqueId },
          },
        },
      },
    );
  };


  // ✅ Rows of the two tables after their search boxes
  const filteredIndividuals = useMemo(() => {
    const q = individualSearch.trim().toLowerCase();
    if (!q) return individuals;
    return individuals.filter(
      (person) =>
        person?.name?.toLowerCase().includes(q) ||
        person?.typeOfProfile?.toLowerCase().includes(q) ||
        person?.segment?.toLowerCase().includes(q) ||
        person?.designation?.toLowerCase().includes(q),
    );
  }, [individuals, individualSearch]);

  // One flat list of every planning (month + year kept as columns) so the
  // search box can look into all months at once.
  const allPlannings = useMemo(
    () =>
      monthGroups.flatMap((group) =>
        (Array.isArray(group?.plannings) ? group.plannings : []).map(
          (planning) => ({
            ...planning,
            month: group?.month,
            year: group?.year,
          }),
        ),
      ),
    [monthGroups],
  );

  const filteredPlannings = useMemo(() => {
    const q = planningSearch.trim().toLowerCase();
    if (!q) return allPlannings;
    return allPlannings.filter(
      (planning) =>
        planning?.nameOfDoctor?.toLowerCase().includes(q) ||
        planning?.selectOrganization?.toLowerCase().includes(q) ||
        planning?.callObjective?.toLowerCase().includes(q) ||
        planning?.month?.toLowerCase().includes(q) ||
        String(planning?.year || "").includes(q) ||
        (Array.isArray(planning?.productToBePromoted) &&
          planning.productToBePromoted.some((product) =>
            String(product).toLowerCase().includes(q),
          )),
    );
  }, [allPlannings, planningSearch]);

  // ✅ Status badge colours for meetingStatus.status
  const statusClass = (status) => {
    switch (String(status || "").toLowerCase()) {
      case "completed":
      case "success":
      case "done":
        return "border-green-100 bg-green-50 text-green-700";
      case "cancel":
      case "cancelled":
      case "rejected":
        return "border-red-100 bg-red-50 text-red-700";
      default:
        return "border-amber-100 bg-amber-50 text-amber-700";
    }
  };

  const summaryCards = [
    {
      label: "Total Individuals",
      value: totalIndividuals,
      icon: LucideIcons.UserRound,
      className: "bg-blue-50 text-blue-700 border-blue-100",
    },
    {
      label: "Total Plannings",
      value: totalPlannings,
      icon: LucideIcons.CalendarCheck,
      className: "bg-green-50 text-green-700 border-green-100",
    },
    {
      label: "Months Covered",
      value: monthGroups.length,
      icon: LucideIcons.CalendarRange,
      className: "bg-amber-50 text-amber-700 border-amber-100",
    },
    {
      label: "Year",
      value: enviroSpecificOrganizationData?.filteredYear || year || "All",
      icon: LucideIcons.CalendarDays,
      className: "bg-purple-50 text-purple-700 border-purple-100",
    },
  ];

  const breadcrumbItems = [
    { text: "Sales Analytics", href: "/sales-analyticsAll" },
    { text: "Enviro Organizations", href: "/sales-analyticsAll" },
    { text: organizationName },
  ];

  if (!id) {
    return (
      <div className="min-h-screen p-6">
        <BreadCrumb linkText={breadcrumbItems} />
        <div className="mt-4 rounded-2xl border border-[var(--theme-border)] bg-white p-8 text-center">
          <LucideIcons.AlertTriangle className="mx-auto mb-3 text-amber-500" size={36} />
          <p className="text-sm font-medium text-[var(--theme-text-secondary)]">
            No organization selected. Open an organization from the
            &quot;Enviro Organizations&quot; tab.
          </p>
          <button
            type="button"
            onClick={handleBack}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: theme.primaryColor }}
          >
            <LucideIcons.ArrowLeft size={16} />
            Back to Sales Analytics
          </button>
        </div>
      </div>
    );
  }


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
            aria-label="Back to enviro organizations"
            className="p-2 rounded-lg bg-white/60 hover:bg-white transition-colors"
          >
            <LucideIcons.ArrowLeft size={20} className="text-black" />
          </button>
          <h2 className="font-semibold text-xl text-black bg-opacity-40">
            {organizationName}
          </h2>
        </div>
        <p className="mt-2 text-center text-xs font-medium text-black/70">
          {uniqueId ? `${uniqueId} • ` : ""}
          {totalIndividuals} individual{totalIndividuals === 1 ? "" : "s"} •{" "}
          {totalPlannings} planning{totalPlannings === 1 ? "" : "s"}
          {enviroSpecificOrganizationData?.filteredYear
            ? ` • ${enviroSpecificOrganizationData.filteredYear}`
            : ""}
        </p>
      </div>

      <div className="p-6 bg-white shadow-md rounded-b-[10px] space-y-6">
        {/* ✅ Back button + year filter */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-1.5 text-sm text-[var(--theme-primary)] font-medium hover:underline"
          >
            <LucideIcons.ArrowLeft size={16} />
            Back to Enviro Organizations
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--theme-text-secondary)]">
              Year
            </span>
            <div className="w-40">
              <Select
                isClearable
                placeholder="All years"
                value={selectedYearOption}
                onChange={(option) => setYear(option?.value || "")}
                options={yearOptions}
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: "0.5rem",
                    borderColor: "#d1d5db",
                    minHeight: "38px",
                    boxShadow: "none",
                    "&:hover": { borderColor: "var(--theme-primary)" },
                  }),
                }}
              />
            </div>
          </div>
        </div>

        {enviroSpecificOrganizationError && (
          <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">
            <LucideIcons.AlertCircle size={18} />
            {enviroSpecificOrganizationError}
          </div>
        )}

        {/* ✅ Summary cards */}
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

        {enviroSpecificOrganizationLoading && !enviroSpecificOrganizationData ? (
          <div className="flex w-full items-center justify-center rounded-2xl border border-[var(--theme-border)] bg-white p-10">
            <LoaderSpinner />
          </div>
        ) : (
          <>

            {/* ✅ Individuals of this organization */}
            <div className="overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--theme-border)] bg-white p-4">
                <div>
                  <h2 className="text-base font-bold text-[var(--theme-text-primary)]">
                    Individuals
                  </h2>
                  <p className="mt-0.5 text-xs font-medium text-[var(--theme-text-secondary)]">
                    Showing {filteredIndividuals.length} of {totalIndividuals} individual
                    {totalIndividuals === 1 ? "" : "s"} of this organization
                  </p>
                </div>
                <div className="relative w-full max-w-xs">
                  <LucideIcons.Search
                    size={14}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--theme-text-secondary)]"
                  />
                  <Input
                    value={individualSearch}
                    onChange={(e) => setIndividualSearch(e.target.value)}
                    placeholder="Search individual, profile, segment…"
                    className="rounded-xl bg-white pl-9"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table className="min-w-[780px]">
                  <TableHeader>
                    <TableRow className="border-b border-[var(--theme-border)] bg-[var(--theme-bg-light)]">
                      <TableHead className="w-16 text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)]">
                        Sr. No.
                      </TableHead>
                      <TableHead className="min-w-[200px] whitespace-nowrap text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)]">
                        Name
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)]">
                        Profile Type
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)]">
                        Segment
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)]">
                        Designation
                      </TableHead>
                      <TableHead className="min-w-[200px] whitespace-nowrap text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)]">
                        Organization
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)]">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIndividuals.length > 0 ? (
                      filteredIndividuals.map((person, index) => (
                        <TableRow
                          key={`${person?.name || "individual"}-${index}`}
                          className="border-b border-[var(--theme-border)] transition-colors last:border-b-0 hover:bg-[var(--theme-bg-hover)]"
                        >
                          <TableCell className="text-xs font-medium text-[var(--theme-text-secondary)]">
                            {index + 1}
                          </TableCell>
                          <TableCell className="text-sm font-medium text-[var(--theme-text-primary)]">
                            {person?.name || "—"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <Badge
                              variant="secondary"
                              className="rounded-full border-[var(--theme-border)] bg-[var(--theme-bg-light)] text-[var(--theme-text-secondary)]"
                            >
                              {person?.typeOfProfile || "—"}
                            </Badge>
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-sm text-[var(--theme-text-primary)]">
                            {person?.segment || "—"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-sm text-[var(--theme-text-primary)]">
                            {person?.designation || "—"}
                          </TableCell>
                          <TableCell className="text-sm text-[var(--theme-text-primary)]">
                            {person?.organizationName || "—"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => handleViewIndividual(person)}
                                title="View individual details"
                                aria-label={`View details of ${person?.name || "individual"}`}
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
                          colSpan={INDIVIDUAL_COLUMNS}
                          className="py-8 text-center text-sm text-[var(--theme-text-secondary)]"
                        >
                          No individuals found for this organization.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>


            {/* ✅ Monthly plannings - month summary cards */}
            {monthGroups.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {monthGroups.map((group) => {
                  const count = Array.isArray(group?.plannings)
                    ? group.plannings.length
                    : 0;
                  return (
                    <div
                      key={`${group?.month}-${group?.year}`}
                      className="flex min-w-[160px] items-center gap-3 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg-light)] px-4 py-3"
                    >
                      <span
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white"
                        style={{ backgroundColor: theme.primaryColor }}
                      >
                        <LucideIcons.CalendarDays size={16} />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-[var(--theme-text-primary)]">
                          {group?.month || "—"} {group?.year || ""}
                        </span>
                        <span className="block text-[11px] font-medium text-[var(--theme-text-secondary)]">
                          {count} planning{count === 1 ? "" : "s"}
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ✅ Monthly plannings - full table */}
            <div className="overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--theme-border)] bg-white p-4">
                <div>
                  <h2 className="text-base font-bold text-[var(--theme-text-primary)]">
                    Monthly Plannings
                  </h2>
                  <p className="mt-0.5 text-xs font-medium text-[var(--theme-text-secondary)]">
                    Showing {filteredPlannings.length} of {totalPlannings} planning
                    {totalPlannings === 1 ? "" : "s"}
                    {enviroSpecificOrganizationData?.filteredYear
                      ? ` • ${enviroSpecificOrganizationData.filteredYear}`
                      : ""}
                  </p>
                </div>
                <div className="relative w-full max-w-xs">
                  <LucideIcons.Search
                    size={14}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--theme-text-secondary)]"
                  />
                  <Input
                    value={planningSearch}
                    onChange={(e) => setPlanningSearch(e.target.value)}
                    placeholder="Search individual, product, objective…"
                    className="rounded-xl bg-white pl-9"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table className="min-w-[980px]">
                  <TableHeader>
                    <TableRow className="border-b border-[var(--theme-border)] bg-[var(--theme-bg-light)]">
                      <TableHead className="w-16 text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)]">
                        Sr. No.
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)]">
                        Month
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)]">
                        Planning Date
                      </TableHead>
                      <TableHead className="min-w-[180px] whitespace-nowrap text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)]">
                        Individual
                      </TableHead>
                      <TableHead className="min-w-[180px] whitespace-nowrap text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)]">
                        Organization
                      </TableHead>
                      <TableHead className="min-w-[180px] whitespace-nowrap text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)]">
                        Products To Be Promoted
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)]">
                        Call Objective
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-center text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)]">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPlannings.length > 0 ? (
                      filteredPlannings.map((planning, index) => {
                        const status = planning?.meetingStatus?.status;
                        return (
                          <TableRow
                            key={planning?._id || index}
                            className="border-b border-[var(--theme-border)] transition-colors last:border-b-0 hover:bg-[var(--theme-bg-hover)]"
                          >
                            <TableCell className="text-xs font-medium text-[var(--theme-text-secondary)]">
                              {index + 1}
                            </TableCell>
                            <TableCell className="whitespace-nowrap text-sm text-[var(--theme-text-primary)]">
                              {planning?.month || "—"} {planning?.year || ""}
                            </TableCell>
                            <TableCell className="whitespace-nowrap text-sm text-[var(--theme-text-primary)]">
                              {formatDate(planning?.createPlanningForDate)}
                            </TableCell>
                            <TableCell className="text-sm font-medium text-[var(--theme-text-primary)]">
                              {planning?.nameOfDoctor || "—"}
                            </TableCell>
                            <TableCell className="text-sm text-[var(--theme-text-primary)]">
                              {planning?.selectOrganization || "—"}
                            </TableCell>
                            <TableCell>
                              <span className="flex flex-wrap gap-1">
                                {Array.isArray(planning?.productToBePromoted) &&
                                planning.productToBePromoted.length > 0 ? (
                                  planning.productToBePromoted.map((product, i) => (
                                    <Badge
                                      key={`${product}-${i}`}
                                      variant="secondary"
                                      className="rounded-full border-[var(--theme-border)] bg-[var(--theme-bg-light)] text-[var(--theme-text-secondary)]"
                                    >
                                      {product}
                                    </Badge>
                                  ))
                                ) : (
                                  <span className="text-sm text-[var(--theme-text-primary)]">
                                    —
                                  </span>
                                )}
                              </span>
                            </TableCell>
                            <TableCell className="whitespace-nowrap text-sm text-[var(--theme-text-primary)]">
                              {planning?.callObjective || "—"}
                            </TableCell>
                            <TableCell className="whitespace-nowrap text-center">
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold capitalize ${statusClass(status)}`}
                              >
                                {status || "not available"}
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={PLANNING_COLUMNS}
                          className="py-8 text-center text-sm text-[var(--theme-text-secondary)]"
                        >
                          No plannings found for this organization
                          {year ? ` in ${year}` : ""}.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>



          </>
        )}
      </div>
    </div>
  );
}

export default EnviroOrganizationDetails;


