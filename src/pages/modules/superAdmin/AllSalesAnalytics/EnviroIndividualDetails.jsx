// pages/modules/superAdmin/AllSalesAnalytics/EnviroIndividualDetails.jsx
//
// Enviro Solution only.
//
// Detail page opened from the eye icon in the "Individuals" tab
// (route: /sales-analyticsAll/enviro-individual-details/:id).
//
// Data comes from the single-individual API:
//   GET dashboard/getEnviroSpecificIndividualData/:id?year=..
//   (fetchSpecificEnviroIndividualData)
//
// Response shape (NOTE: everything sits inside `data`):
//   { success,
//     data: {
//       individual: { name, typeOfProfile, segment, designation,
//                     organizationName },
//       monthlyPlannings: [ { month, year,
//                             plannings: [ { _id, createPlanningForDate,
//                                            nameOfDoctor, selectOrganization,
//                                            productToBePromoted, callObjective,
//                                            meetingStatus, salesPersonName } ] } ],
//       filteredYear } }

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

const PLANNING_COLUMNS = 9;

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

// A Mongo ObjectId is 24 hex characters. The route parameter can be either the
// individual's id (opened from the "Individuals" tab) or the individual's NAME:
// the organization-details API does not send an _id with its individuals list,
// so that page passes the name and this page resolves it to an id.
const isMongoId = (value) => /^[a-f\d]{24}$/i.test(String(value || ""));

const EnviroIndividualDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  const {
    enviroSpecificIndividualData,
    enviroSpecificIndividualLoading,
    enviroSpecificIndividualError,
    fetchSpecificEnviroIndividualData,
    resetEnviroSpecificIndividualData,
    // used to turn a NAME (see below) into the individual's id
    fetchEnviroIndividualsAnalytics,
  } = useAllSalesEnviroAnalytics();

  const [year, setYear] = useState("");
  const [planningSearch, setPlanningSearch] = useState("");

  // The id that is actually used for the API call. It is the route parameter
  // itself when that is already an id, or the id found by name otherwise.
  const [resolvedId, setResolvedId] = useState("");
  const [resolveError, setResolveError] = useState("");

  // The route parameter is an id when it comes from the "Individuals" tab.
  // When it comes from the organization details page it is the individual's
  // name - and that page also passes the clean name through router state, which
  // is safer to search by than the (url encoded) parameter. Both are used.
  const routeParam = id || "";
  const routeParamIsId = isMongoId(routeParam);
  const lookupName = routeParamIsId
    ? ""
    : location.state?.name || routeParam;

  // Drop the previous individual as soon as another one is opened, so the page
  // can never show data that belongs to the row the user clicked before.
  useEffect(() => {
    resetEnviroSpecificIndividualData();
  }, [id, resetEnviroSpecificIndividualData]);

  // ✅ Step 1 - make sure we have an id.
  //    - route param is an id  -> use it as-is
  //    - route param is a name -> look it up in the individuals list
  //      (the name and the organization are both used, so two people with the
  //      same name in different organizations cannot be mixed up)
  useEffect(() => {
    if (!routeParam) {
      setResolvedId("");
      setResolveError("");
      return;
    }

    if (routeParamIsId) {
      setResolvedId(routeParam);
      setResolveError("");
      return;
    }

    if (!lookupName) {
      setResolvedId("");
      setResolveError("");
      return;
    }

    let cancelled = false;
    setResolvedId("");
    setResolveError("");

    (async () => {
      const res = await fetchEnviroIndividualsAnalytics({
        individualName: lookupName,
        organizationName: location.state?.organizationName || "",
        page: 1,
        limit: 50,
      });

      if (cancelled) return;

      const rows = Array.isArray(res?.data) ? res.data : [];
      const wanted = String(lookupName).trim().toLowerCase();
      const match =
        rows.find(
          (row) => String(row?.fullname || "").trim().toLowerCase() === wanted,
        ) || rows[0];

      if (match?._id) {
        setResolvedId(match._id);
      } else {
        setResolveError(
          "Could not find this individual. It may have been removed or renamed.",
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    routeParam,
    routeParamIsId,
    lookupName,
    fetchEnviroIndividualsAnalytics,
    location.state?.organizationName,
  ]);

  // ✅ Step 2 - fetch the individual once the id is known. `year` is the only
  //    thing that can change afterwards.
  useEffect(() => {
    if (!resolvedId) return;
    fetchSpecificEnviroIndividualData(resolvedId, { year });
  }, [resolvedId, year, fetchSpecificEnviroIndividualData]);

  // ✅ Where "Back" has to return to.
  //    Coming from the organization details page, `backTo` points back at that
  //    organization (with its name / unique id restored through router state);
  //    coming from the Individuals tab it points at the analytics page.
  const backTo = location.state?.backTo || null;
  const backLabel = backTo?.label || "Back to Individuals";

  // ✅ Leaving the page.
  //    With real history we simply go back ONE step, which returns exactly
  //    where the user came from. Without history (page reload / direct link /
  //    new tab) we use the explicit `backTo` target instead.
  const handleBack = () => {
    if (location.key && location.key !== "default") {
      navigate(-1);
      return;
    }
    navigate(backTo?.pathname || "/sales-analyticsAll", {
      state: backTo?.state,
    });
  };

  // True while a name is being turned into an id
  const resolving = Boolean(routeParam) && !resolvedId && !resolveError;

  const loadError = resolveError || enviroSpecificIndividualError;

  // ✅ Everything of this API lives under `data`
  const payload = enviroSpecificIndividualData?.data || null;

  const individual = payload?.individual || null;

  const monthGroups = useMemo(
    () =>
      Array.isArray(payload?.monthlyPlannings)
        ? sortMonthGroups(payload.monthlyPlannings)
        : [],
    [payload],
  );

  const totalPlannings = useMemo(
    () =>
      monthGroups.reduce(
        (sum, group) =>
          sum + (Array.isArray(group?.plannings) ? group.plannings.length : 0),
        0,
      ),
    [monthGroups],
  );

  // ✅ Year options: the years the API returned, the filtered year and the
  //    current year, so the dropdown is never empty on a fresh individual.
  const yearOptions = useMemo(() => {
    const years = new Set();
    monthGroups.forEach((group) => {
      if (group?.year) years.add(Number(group.year));
    });
    if (payload?.filteredYear) {
      years.add(Number(payload.filteredYear));
    }
    years.add(new Date().getFullYear());

    return [...years]
      .sort((a, b) => b - a)
      .map((y) => ({ label: String(y), value: String(y) }));
  }, [monthGroups, payload?.filteredYear]);

  const selectedYearOption = year ? { label: year, value: year } : null;

  const individualName =
    individual?.name ||
    location.state?.name ||
    lookupName ||
    "Individual Details";

  const typeOfProfile =
    individual?.typeOfProfile || location.state?.typeOfProfile || "";

  const profileRows = [
    { label: "Name", value: individual?.name || location.state?.name },
    { label: "Type of Profile", value: individual?.typeOfProfile || location.state?.typeOfProfile },
    { label: "Segment", value: individual?.segment },
    { label: "Designation", value: individual?.designation },
    {
      label: "Organization",
      value: individual?.organizationName || location.state?.organizationName,
    },
  ];


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
        planning?.salesPersonName?.toLowerCase().includes(q) ||
        planning?.month?.toLowerCase().includes(q) ||
        String(planning?.year || "").includes(q) ||
        (Array.isArray(planning?.productToBePromoted) &&
          planning.productToBePromoted.some((product) =>
            String(product).toLowerCase().includes(q),
          )),
    );
  }, [allPlannings, planningSearch]);

  // ✅ How many different sales persons covered this individual
  const salesPersonCount = useMemo(() => {
    const names = new Set();
    allPlannings.forEach((planning) => {
      if (planning?.salesPersonName) names.add(planning.salesPersonName);
    });
    return names.size;
  }, [allPlannings]);

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
      label: "Sales Persons Involved",
      value: salesPersonCount,
      icon: LucideIcons.UserCheck,
      className: "bg-blue-50 text-blue-700 border-blue-100",
    },
    {
      label: "Year",
      value: payload?.filteredYear || year || "All",
      icon: LucideIcons.CalendarDays,
      className: "bg-purple-50 text-purple-700 border-purple-100",
    },
  ];

  // ✅ The middle crumb follows the page the user came from, so an individual
  //    opened from an organization still shows that organization's crumb.
  const breadcrumbItems = [
    { text: "Sales Analytics", href: "/sales-analyticsAll" },
    backTo?.pathname
      ? {
          text: backLabel.replace(/^Back to /, ""),
          href: backTo.pathname,
        }
      : { text: "Individuals", href: "/sales-analyticsAll" },
    { text: individualName },
  ];

  if (!routeParam) {
    return (
      <div className="min-h-screen p-6">
        <BreadCrumb linkText={breadcrumbItems} />
        <div className="mt-4 rounded-2xl border border-[var(--theme-border)] bg-white p-8 text-center">
          <LucideIcons.AlertTriangle className="mx-auto mb-3 text-amber-500" size={36} />
          <p className="text-sm font-medium text-[var(--theme-text-secondary)]">
            No individual selected. Open an individual from the
            &quot;Individuals&quot; tab.
          </p>
          <button
            type="button"
            onClick={handleBack}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: theme.primaryColor }}
          >
            <LucideIcons.ArrowLeft size={16} />
            {backLabel}
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
            aria-label="Back to enviro individuals"
            className="p-2 rounded-lg bg-white/60 hover:bg-white transition-colors"
          >
            <LucideIcons.ArrowLeft size={20} className="text-black" />
          </button>
          <h2 className="font-semibold text-xl text-black bg-opacity-40">
            {individualName}
          </h2>
        </div>
        <p className="mt-2 text-center text-xs font-medium text-black/70">
          {typeOfProfile ? `${typeOfProfile} • ` : ""}
          {totalPlannings} planning{totalPlannings === 1 ? "" : "s"} across{" "}
          {monthGroups.length} month{monthGroups.length === 1 ? "" : "s"}
          {payload?.filteredYear ? ` • ${payload.filteredYear}` : ""}
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
            {backLabel}
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

        {loadError && (
          <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">
            <LucideIcons.AlertCircle size={18} />
            {loadError}
          </div>
        )}

        {/* ✅ Individual profile (data.individual) */}
        <div className="rounded-2xl border border-[var(--theme-border)] bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <LucideIcons.UserRound size={16} className="text-[var(--theme-primary)]" />
            <h2 className="text-base font-bold text-[var(--theme-text-primary)]">
              Individual Profile
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {profileRows.map((row) => (
              <div
                key={row.label}
                className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg-light)] px-3 py-2"
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--theme-text-secondary)]">
                  {row.label}
                </p>
                <p className="mt-0.5 text-sm font-medium text-[var(--theme-text-primary)]">
                  {row.value || "—"}
                </p>
              </div>
            ))}
          </div>
        </div>

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

        {resolving ||
        (enviroSpecificIndividualLoading && !enviroSpecificIndividualData) ? (
          <div className="flex w-full items-center justify-center rounded-2xl border border-[var(--theme-border)] bg-white p-10">
            <LoaderSpinner />
          </div>
        ) : (
          <>

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
                    {payload?.filteredYear ? ` • ${payload.filteredYear}` : ""}
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
                <Table className="min-w-[1080px]">
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
                      <TableHead className="min-w-[160px] whitespace-nowrap text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)]">
                        Sales Person
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)]">
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
                            <TableCell className="whitespace-nowrap text-sm text-[var(--theme-text-primary)]">
                              {planning?.salesPersonName || "—"}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
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
                          No plannings found for this individual
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

export default EnviroIndividualDetails;


