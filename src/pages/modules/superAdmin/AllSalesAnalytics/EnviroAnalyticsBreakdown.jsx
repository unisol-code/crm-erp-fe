import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../../../hooks/theme/useTheme";
import BreadCrumb from "../../../../components/uiComponents/breadcrumb/BreadCrumb";
import LoaderSpinner from "../../../../components/uiComponents/loader/LoaderSpinner";
import useAllSalesEnviroAnalytics from "../../../../hooks/superAdminHook/allSalesAnalytics/useAllSalesEnviroAnalytics";
import * as LucideIcons from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
} from "../AllSalesAnalytics/components/common";
import { ChartCard } from "../AllSalesAnalytics/components/analytics";
import Pagination from "../../../../components/uiComponents/pagination/Pagination.jsx";

// Base route of this page (see App.jsx) and the parent/child relationship
// between its views:
//   /organizationBreakdown        -> sections view (Agriculture / Waste cards)
//   /agricultureBreakdown         -> breakdown table
//   /wasteManagementBreakdown     -> breakdown table
// The two breakdown tables are ONLY reachable from the sections view, so their
// back button has to return there - never straight out to /sales-analyticsAll.
const BASE_ROUTE = "/sales-analyticsAll/enviro-analytics-breakdown";
const ORGANIZATION_BREAKDOWN_ROUTE = `${BASE_ROUTE}/organizationBreakdown`;
const CHILD_BREAKDOWNS = ["agricultureBreakdown", "wasteManagementBreakdown"];

const kpiConfig = {
  employeeCount: {
    label: "Total Employees",
    icon: LucideIcons.Users,
    color: "bg-blue-50 text-blue-600 border-blue-100",
    breakdownKey: null,
  },
  totalIndividuals: {
    label: "Total Individuals",
    icon: LucideIcons.Users,
    color: "bg-green-50 text-green-600 border-green-100",
    breakdownKey: "individualsProfileBreakdown",
  },
  totalOrganizations: {
    label: "Total Organizations",
    icon: LucideIcons.Building2,
    color: "bg-purple-50 text-purple-600 border-purple-100",
    breakdownKey: "organizationBreakdown",
  },
  totalAgriculture: {
    label: "Agriculture",
    icon: LucideIcons.Sprout,
    color: "bg-amber-50 text-amber-600 border-amber-100",
    breakdownKey: "agricultureBreakdown",
  },
  totalWasteManagement: {
    label: "Waste Management",
    icon: LucideIcons.Recycle,
    color: "bg-teal-50 text-teal-600 border-teal-100",
    breakdownKey: "wasteManagementBreakdown",
  },
};

// Icon + tint used by the Individuals Profile Breakdown cards.
// These are borderless tinted surfaces so they read as content tiles
// instead of a "box inside a box" inside the surrounding ChartCard.
const profileCardStyles = {
  Agriculture: {
    icon: LucideIcons.Sprout,
    surface: "bg-amber-50",
    iconBg: "bg-amber-100 text-amber-700",
    value: "text-amber-700",
  },
  "Waste Management": {
    icon: LucideIcons.Recycle,
    surface: "bg-teal-50",
    iconBg: "bg-teal-100 text-teal-700",
    value: "text-teal-700",
  },
};

const profileCardFallback = {
  icon: LucideIcons.Users,
  surface: "bg-blue-50",
  iconBg: "bg-blue-100 text-blue-700",
  value: "text-blue-700",
};

// Tints cycled through by the Profile Type cards on the detail view so each
// profile type gets its own colour. Flat / borderless, same as the section cards.
const profileTypeCardPalette = [
  { surface: "bg-amber-50", iconBg: "bg-amber-100 text-amber-700", value: "text-amber-700" },
  { surface: "bg-teal-50", iconBg: "bg-teal-100 text-teal-700", value: "text-teal-700" },
  { surface: "bg-sky-50", iconBg: "bg-sky-100 text-sky-700", value: "text-sky-700" },
  { surface: "bg-rose-50", iconBg: "bg-rose-100 text-rose-700", value: "text-rose-700" },
  { surface: "bg-violet-50", iconBg: "bg-violet-100 text-violet-700", value: "text-violet-700" },
  { surface: "bg-emerald-50", iconBg: "bg-emerald-100 text-emerald-700", value: "text-emerald-700" },
];

const EnviroAnalyticsBreakdown = () => {
  const { breakdownType, breakdownId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const {
    enviroData,
    fetchEnviroAnalytics,
    loading,
    enviroIndividualsData,
    enviroIndividualsLoading,
    fetchEnviroIndividualsAnalytics,
    resetEnviroIndividualsData,
    enviroOrganizationsData,
    enviroOrganizationsLoading,
    fetchEnviroOrganizationsAnalytics,
    resetEnviroOrganizationsData,
  } = useAllSalesEnviroAnalytics();

  const [selectedBreakdown, setSelectedBreakdown] = useState(breakdownType || null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailPage, setDetailPage] = useState(1);
  const [detailLimit, setDetailLimit] = useState(10);
  const [selectedDetailId, setSelectedDetailId] = useState(breakdownId || null);
  const [selectedSubType, setSelectedSubType] = useState(null); // profile type opened inside the detail view
  const [selectedOrgSubType, setSelectedOrgSubType] = useState(null); // organization type opened inside the detail view
  const [viewMode, setViewMode] = useState('main'); // 'main', 'orgSections', 'detail'

  // true when the detail view is showing the organizations list
  // (agriculture / wasteManagement / organization breakdowns)
  const isOrgDetailView = useMemo(() => (
    selectedDetailId != null && (
      selectedBreakdown === 'agricultureBreakdown' ||
      selectedBreakdown === 'wasteManagementBreakdown' ||
      selectedBreakdown === 'organizationBreakdown'
    )
  ), [selectedDetailId, selectedBreakdown]);

  useEffect(() => {
    if (breakdownType) {
      setSelectedBreakdown(breakdownType);
      if (breakdownType === 'organizationBreakdown') {
        setViewMode('orgSections');
      } else {
        setViewMode('main');
      }
    }
  }, [breakdownType]);

  useEffect(() => {
    if (breakdownId) {
      setSelectedDetailId(breakdownId);
      setViewMode('detail');
    }
  }, [breakdownId]);

  // Reset the individuals / organizations drill-down whenever the route/breakdown changes
  useEffect(() => {
    setSelectedSubType(null);
    setSelectedOrgSubType(null);
    setDetailPage(1);
    resetEnviroIndividualsData();
    resetEnviroOrganizationsData();
  }, [breakdownType, breakdownId, resetEnviroIndividualsData, resetEnviroOrganizationsData]);

  // Fetch the individuals list for the profile type opened in the detail view
  // (segment = selectedDetailId, typeOfProfile = selectedSubType)
  useEffect(() => {
    if (!selectedSubType || !selectedDetailId) return;
    if (isOrgDetailView) return;
    fetchEnviroIndividualsAnalytics({
      segment: selectedDetailId,
      typeOfProfile: selectedSubType,
      page: detailPage,
      limit: detailLimit,
    });
  }, [selectedSubType, selectedDetailId, detailPage, detailLimit, isOrgDetailView, fetchEnviroIndividualsAnalytics]);

  // ------------------------------------------------------------------
  // Query params for the organizations list
  //
  // The enviro analytics response breaks the organizations down like this:
  //   "agricultureOrganizationBreakdown": { "FPO": 4, "GOVERNMENT": 1 }
  //   "wasteManagementOrganizationBreakdown": { "PRIVATE": 1 }
  // So the KEY of that map is the OrganizationType (FPO, GOVERNMENT, PRIVATE)
  // and the breakdown itself is the SECTION (Agriculture / Waste Management).
  //
  // That means for /agricultureBreakdown/FPO we must send:
  //   sectionName = "Agriculture"   (from breakdownType, NOT from the URL id)
  //   OrganizationType = "FPO"     (from breakdownId, the URL id)
  //
  // The only exception is organizationBreakdown, where the URL id IS the
  // section ("Agriculture" / "Waste Management") and the type is the card
  // the user clicked (selectedOrgSubType).
  // ------------------------------------------------------------------
  const orgDrilldownParams = useMemo(() => {
    if (selectedDetailId == null) return null;

    if (selectedBreakdown === 'agricultureBreakdown') {
      return { sectionName: 'Agriculture', OrganizationType: selectedDetailId };
    }
    if (selectedBreakdown === 'wasteManagementBreakdown') {
      return { sectionName: 'Waste Management', OrganizationType: selectedDetailId };
    }
    if (selectedBreakdown === 'organizationBreakdown') {
      // URL id is the section here; OrganizationType stays empty until a
      // type card is clicked (then the API lists every type of the section).
      return { sectionName: selectedDetailId, OrganizationType: selectedOrgSubType || '' };
    }
    return null;
  }, [selectedBreakdown, selectedDetailId, selectedOrgSubType]);

  // Fetch the organizations list for the section / organization type of the
  // current detail view (sectionName + OrganizationType, see above).
  useEffect(() => {
    if (!isOrgDetailView) return;
    if (!orgDrilldownParams) return;
    fetchEnviroOrganizationsAnalytics({
      ...orgDrilldownParams,
      page: detailPage,
      limit: detailLimit,
    });
  }, [orgDrilldownParams, detailPage, detailLimit, isOrgDetailView, fetchEnviroOrganizationsAnalytics]);

  useEffect(() => {
    fetchEnviroAnalytics();
  }, [fetchEnviroAnalytics]);

  const data = enviroData?.data || {};

  const kpiValues = useMemo(() => ({
    employeeCount: data.employeeCount || 0,
    totalIndividuals: data.totalIndividuals || 0,
    totalOrganizations: data.totalOrganizations || 0,
    totalAgriculture: data.totalAgriculture || 0,
    totalWasteManagement: data.totalWasteManagement || 0,
  }), [data]);

  const orgSectionKpis = useMemo(() => [
    {
      key: 'totalAgriculture',
      label: 'Total Agriculture',
      value: data.totalAgriculture || 0,
      icon: LucideIcons.Sprout,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
      breakdownKey: 'agricultureBreakdown',
    },
    {
      key: 'totalWasteManagement',
      label: 'Total Waste Management',
      value: data.totalWasteManagement || 0,
      icon: LucideIcons.Recycle,
      color: 'bg-teal-50 text-teal-600 border-teal-100',
      breakdownKey: 'wasteManagementBreakdown',
    },
  ], [data]);

  // ---- Individuals drill-down (segment = selectedDetailId, typeOfProfile = subType) ----
  const closeIndividualsView = () => {
    setSelectedSubType(null);
    setDetailPage(1);
    resetEnviroIndividualsData();
  };

  // Opens the individuals list for a profile type inside the detail view
  // (the actual request is made by the effect above, so page/limit stay in sync)
  const handleViewIndividuals = (subType) => {
    setDetailPage(1);
    setSelectedSubType(subType);
  };

  const handleIndividualsPageChange = (page) => {
    setDetailPage(page);
  };

  const handleIndividualsLimitChange = (limit) => {
    setDetailLimit(limit);
    setDetailPage(1);
  };

  // ---- Organizations drill-down (sectionName = selectedDetailId, OrganizationType = subType) ----
  const closeOrganizationsView = () => {
    setSelectedOrgSubType(null);
    setDetailPage(1);
    resetEnviroOrganizationsData();
  };

  // Opens the organizations list for an organization type inside the detail view
  // (the actual request is made by the effect above, so page/limit stay in sync)
  const handleViewOrganizations = (subType) => {
    setDetailPage(1);
    setSelectedOrgSubType(subType);
  };

  const handleOrganizationsPageChange = (page) => {
    setDetailPage(page);
  };

  const handleOrganizationsLimitChange = (limit) => {
    setDetailLimit(limit);
    setDetailPage(1);
  };

  const handleBreakdownClick = (type) => {
    setSelectedBreakdown(type);
    setDetailPage(1);
    setSelectedDetailId(null);
    closeIndividualsView();
    closeOrganizationsView();
    if (type === 'organizationBreakdown') {
      setViewMode('orgSections');
      navigate(`/sales-analyticsAll/enviro-analytics-breakdown/${type}`, { replace: true });
    } else {
      setViewMode('main');
      navigate(`/sales-analyticsAll/enviro-analytics-breakdown/${type}`, { replace: true });
    }
  };

  // Leaves the breakdown and goes back ONE page (usually /sales-analyticsAll,
  // where the KPI cards were clicked). When this is the first page of the
  // session there is nothing to go back to, so open the main analytics page
  // instead of the empty "/enviro-analytics-breakdown" route (not useful).
  const goBackToAnalytics = () => {
    if (location.key && location.key !== "default") {
      navigate(-1);
    } else {
      navigate("/sales-analyticsAll");
    }
  };

  const handleBackToBreakdown = () => {
    if (viewMode === 'detail') {
      // Detail view -> one level up: the breakdown table itself (keeps its param)
      setSelectedDetailId(null);
      setViewMode(selectedBreakdown === 'organizationBreakdown' ? 'orgSections' : 'main');
      navigate(`${BASE_ROUTE}/${selectedBreakdown}`, { replace: true });
      return;
    }

    // Agriculture / Waste Management -> one level up is the sections view.
    // NOTE: we entered these with navigate(..., { replace: true }), so there is
    // NO history entry to go back to; without an explicit target,
    // navigate(-1) would jump all the way out to /sales-analyticsAll.
    if (selectedBreakdown && CHILD_BREAKDOWNS.includes(selectedBreakdown)) {
      setSelectedBreakdown('organizationBreakdown');
      setSelectedDetailId(null);
      setDetailPage(1);
      closeIndividualsView();
      closeOrganizationsView();
      setViewMode('orgSections');
      navigate(ORGANIZATION_BREAKDOWN_ROUTE, { replace: true });
      return;
    }

    // Sections view (and any other top level) -> previous page (the dashboard)
    goBackToAnalytics();
  };

  const handleViewDetail = (id, name) => {
    setSelectedDetailId(id);
    setViewMode('detail');
    closeIndividualsView();
    closeOrganizationsView();
    navigate(`/sales-analyticsAll/enviro-analytics-breakdown/${selectedBreakdown}/${id}`, { replace: true });
  };

  const handleCloseDetail = () => {
    setSelectedDetailId(null);
    closeIndividualsView();
    closeOrganizationsView();
    setViewMode(selectedBreakdown === 'organizationBreakdown' ? 'orgSections' : 'main');
    if (selectedBreakdown) {
      navigate(`/sales-analyticsAll/enviro-analytics-breakdown/${selectedBreakdown}`, { replace: true });
    }
  };

  const getBreakdownData = (type) => {
    switch (type) {
      case 'individualsProfileBreakdown':
        return data.individualsProfileBreakdown || {};
      case 'agricultureBreakdown':
        return data.agricultureOrganizationBreakdown || {};
      case 'wasteManagementBreakdown':
        return data.wasteManagementOrganizationBreakdown || {};
      case 'organizationBreakdown':
        // Return structured data with sections for Agriculture and Waste Management
        return {
          "Agriculture": {
            ...data.agricultureOrganizationBreakdown,
            _sectionTotal: data.totalAgriculture,
          },
          "Waste Management": {
            ...data.wasteManagementOrganizationBreakdown,
            _sectionTotal: data.totalWasteManagement,
          },
        };
      default:
        return {};
    }
  };

  const getBreakdownTitle = (type) => {
    switch (type) {
      case 'individualsProfileBreakdown':
        return "Individuals Profile Breakdown";
      case 'agricultureBreakdown':
        return "Agriculture Breakdown";
      case 'wasteManagementBreakdown':
        return "Waste Management Breakdown";
      case 'organizationBreakdown':
        return "Organization Type Breakdown";
      default:
        return "Breakdown";
    }
  };

  const getDetailTitle = (breakdownType, detailId) => {
    if (breakdownType === 'individualsProfileBreakdown') {
      return `${detailId} - Profile Types`;
    }
    if (breakdownType === 'organizationBreakdown') {
      return `${detailId} - Organization Types`;
    }
    return `${detailId} - Details`;
  };

  const pageTitle = selectedDetailId
    ? "Detail View"
    : selectedBreakdown
      ? getBreakdownTitle(selectedBreakdown)
      : "Enviro Analytics Breakdown";

  // ✅ The back button has to name where it really goes: the Agriculture /
  //    Waste Management breakdowns return to the organization sections view.
  const backLabel =
    selectedBreakdown && CHILD_BREAKDOWNS.includes(selectedBreakdown)
      ? "Back to Organization Breakdown"
      : "Back to Enviro Analytics Breakdown";

  const breadcrumbItems = [
    { text: "Sales Analytics", href: "/sales-analyticsAll" },
    { text: pageTitle },
  ];

  return (
    <div className="min-h-screen">
      <BreadCrumb linkText={breadcrumbItems} />
      <div className="rounded-t-xl bg-gradient-to-r p-6 shadow-lg shadow-slate-900/10"
        style={{ backgroundColor: theme.secondaryColor }}>
        <h2 className="flex px-6 items-center justify-center font-semibold text-xl text-black bg-opacity-40">
          {pageTitle}
        </h2>
      </div>

      <div className="p-6 bg-white shadow-md rounded-b-[10px]">
        {/* KPI Cards */}
        {/* {!selectedBreakdown && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
            {Object.entries(kpiConfig).map(([key, config]) => (
              <div
                key={key}
                onClick={() => config.breakdownKey && handleBreakdownClick(config.breakdownKey)}
                className={`group rounded-xl border p-4 transition-all cursor-pointer ${
                  config.breakdownKey
                    ? "border-[var(--theme-border)] bg-white hover:shadow-md hover:border-[var(--theme-primary)]/30"
                    : "border-[var(--theme-border)] bg-gray-50"
                }`}
              >
                <div className={`h-10 w-10 rounded-lg border ${config.color} grid place-items-center mb-3`}>
                  <config.icon size={18} />
                </div>
                <p className="text-sm font-semibold text-[var(--theme-text-primary)] leading-tight">
                  {config.label}
                </p>
                <p className="text-2xl font-bold text-[var(--theme-text-primary)] mt-1">
                  {kpiValues[key]}
                </p>
                {config.breakdownKey && (
                  <p className="text-[10px] text-[var(--theme-text-secondary)] font-medium mt-0.5">
                    Click for breakdown
                  </p>
                )}
              </div>
            ))}
          </div>
        )} */}

        {/* Back Button */}
        {selectedBreakdown && !selectedDetailId && viewMode !== 'orgSections' && (
          <div className="mb-4">
            <button
              onClick={handleBackToBreakdown}
              className="text-sm text-[var(--theme-primary)] font-medium hover:underline"
            >
              ← {backLabel}
            </button>
          </div>
        )}

        {/* Organization Sections View - Shows Agriculture and Waste Management KPIs */}
        {viewMode === 'orgSections' && (
          <>
            <div className="mb-4">
              <button
                onClick={handleBackToBreakdown}
                className="text-sm text-[var(--theme-primary)] font-medium hover:underline"
              >
                ← Back to Enviro Analytics Breakdown
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {orgSectionKpis.map((config) => (
                <div
                  key={config.key}
                  onClick={() => config.breakdownKey && handleBreakdownClick(config.breakdownKey)}
                  className="group rounded-xl border p-4 transition-all cursor-pointer border-[var(--theme-border)] bg-white hover:shadow-md hover:border-[var(--theme-primary)]/30"
                >
                  <div className={`h-10 w-10 rounded-lg border ${config.color} grid place-items-center mb-3`}>
                    <config.icon size={18} />
                  </div>
                  <p className="text-sm font-semibold text-[var(--theme-text-primary)] leading-tight">
                    {config.label}
                  </p>
                  <p className="text-2xl font-bold text-[var(--theme-text-primary)] mt-1">
                    {config.value}
                  </p>
                  <p className="text-[10px] text-[var(--theme-text-secondary)] font-medium mt-0.5">
                    Click for breakdown
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Breakdown Table */}
        {selectedBreakdown && !selectedDetailId && viewMode !== 'orgSections' && (() => {
          const breakdownData = getBreakdownData(selectedBreakdown);
          const entries = Object.entries(breakdownData);

          if (entries.length === 0) {
            return (
              <div className="text-center py-16 bg-white rounded-xl border-2 border-gray-200">
                <LucideIcons.Info size={40} className="mx-auto text-gray-400 mb-3" />
                <p className="text-black font-semibold">No breakdown data available</p>
              </div>
            );
          }

          const isProfileBreakdown = selectedBreakdown === 'individualsProfileBreakdown';
          const isOrgBreakdown = selectedBreakdown === 'organizationBreakdown';

          return (
            <div className="mt-4">
              <ChartCard title={getBreakdownTitle(selectedBreakdown)} subtitle="Click view for details">
                {/* Individuals Profile Breakdown -> KPI cards instead of a table */}
                {isProfileBreakdown && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {entries.map(([category, categoryData]) => {
                      const isObj = typeof categoryData === "object" && categoryData !== null;
                      const subTypes = isObj ? Object.entries(categoryData) : [];
                      const total = isObj
                        ? Object.values(categoryData).reduce((sum, v) => sum + (Number(v) || 0), 0)
                        : categoryData;
                      const { icon: CardIcon, surface, iconBg, value } =
                        profileCardStyles[category] || profileCardFallback;
                      return (
                        <div
                          key={category}
                          onClick={() => handleViewDetail(category, category)}
                          className={`group relative overflow-hidden rounded-2xl p-5 shadow-sm transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl ${surface}`}
                        >
                          {/* soft decorative circle for depth */}
                          <span className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white/40" />

                          <div className="relative flex items-start justify-between gap-3">
                            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl shadow-sm ${iconBg}`}>
                              <CardIcon size={20} />
                            </span>
                            <span className="rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--theme-text-secondary)]">
                              Profile Section
                            </span>
                          </div>

                          <p className="relative mt-4 text-sm font-semibold text-[var(--theme-text-primary)]">
                            {category}
                          </p>
                          <p className={`relative mt-0.5 text-4xl font-bold tracking-tight ${value}`}>
                            {total}
                          </p>

                          {subTypes.length > 0 && (
                            <div className="relative mt-3 flex flex-wrap gap-1.5">
                              {subTypes.map(([subType, count]) => (
                                <span
                                  key={subType}
                                  className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-medium text-[var(--theme-text-secondary)]"
                                >
                                  {subType}: {count}
                                </span>
                              ))}
                            </div>
                          )}

                          <span className="relative mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[var(--theme-primary)]">
                            View details
                            <LucideIcons.ArrowRight
                              size={14}
                              className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
                {!isProfileBreakdown && (
                <div className="shadow overflow-x-auto rounded-t-2xl border border-gray-200">
                  <Table>
                    <TableHeader className="sticky top-0 bg-white z-10">
                      <TableRow className="bg-[var(--theme-bg-light)]">
                        <TableHead className="text-base font-semibold">Sr. No.</TableHead>
                        <TableHead className="text-base font-semibold">
                          {isProfileBreakdown ? 'Section' : 'Category'}
                        </TableHead>
                        <TableHead className="text-base font-semibold">Type</TableHead>
                        <TableHead className="text-base font-semibold">Count</TableHead>
                        {isProfileBreakdown && (
                          <TableHead className="text-base font-semibold">Sub-types</TableHead>
                        )}
                        <TableHead className="text-base font-semibold text-center">View</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-200">
                      {entries.map(([category, categoryData], idx) => (
                        <TableRow key={category} className="cursor-pointer hover:bg-gray-50 transition-all">
                          <td className="p-4 text-[17px] font-normal text-[#252C58]">
                            {idx + 1}
                          </td>
                          <td className="px-4 py-3 text-[15px] whitespace-nowrap font-medium text-[var(--theme-primary)]">
                            {category}
                          </td>
                          <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                            {isProfileBreakdown && typeof categoryData === 'object' ? (
                              <Badge variant="secondary" className="rounded-full bg-[var(--theme-bg-light)] text-[var(--theme-text-secondary)] border-[var(--theme-border)]">
                                Profile Section
                              </Badge>
                            ) : isOrgBreakdown ? (
                              <Badge variant="secondary" className="rounded-full bg-[var(--theme-bg-light)] text-[var(--theme-text-secondary)] border-[var(--theme-border)]">
                                Org Type
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="rounded-full bg-[var(--theme-bg-light)] text-[var(--theme-text-secondary)] border-[var(--theme-border)]">
                                Category
                              </Badge>
                            )}
                          </td>
                          <td className="px-4 py-3 text-[15px] whitespace-nowrap font-bold text-[var(--theme-text-primary)]">
                            {typeof categoryData === 'object' && categoryData !== null
                              ? Object.values(categoryData).reduce((sum, v) => sum + (Number(v) || 0), 0)
                              : categoryData}
                          </td>
                          {isProfileBreakdown && typeof categoryData === 'object' && (
                            <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                              <div className="flex flex-wrap gap-1">
                                {Object.entries(categoryData).map(([subType, count]) => (
                                  <span key={subType} className="px-2 py-0.5 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] text-[10px] font-medium">
                                    {subType}: {count}
                                  </span>
                                ))}
                              </div>
                            </td>
                          )}
                          <td className="p-4 text-center align-middle">
                            <button
                              onClick={() => handleViewDetail(category, category)}
                              className="text-[var(--theme-primary)] hover:bg-[var(--theme-primary)]/10 rounded-full w-9 h-9 flex items-center justify-center transition-colors"
                              aria-label="View details"
                            >
                              <LucideIcons.Eye size={18} />
                            </button>
                          </td>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                )}
              </ChartCard>
            </div>
          );
        })()}

        {/* Detail View */}
        {selectedDetailId && (() => {
          const breakdownData = getBreakdownData(selectedBreakdown);
          const detailData = breakdownData[selectedDetailId];

          if (!detailData) {
            return (
              <div className="text-center py-16 bg-white rounded-xl border-2 border-gray-200">
                <LucideIcons.AlertCircle size={40} className="mx-auto text-gray-400 mb-3" />
                <p className="text-black font-semibold">Detail not found</p>
              </div>
            );
          }

          const isProfileBreakdown = selectedBreakdown === 'individualsProfileBreakdown';
          const isOrgBreakdown = selectedBreakdown === 'organizationBreakdown';
          const isAgriOrWasteBreakdown = selectedBreakdown === 'agricultureBreakdown' || selectedBreakdown === 'wasteManagementBreakdown';

          // Organization type cards for this detail row.
          // `detailData` has two possible shapes:
          //   - an object  { "Small Scale": 2, "Large Scale": 1 }  -> cards
          //   - a flat count (4)                                    -> no cards
          // Internal keys such as _sectionTotal are never shown as a type.
          const orgTypeCards = (
            typeof detailData === 'object' && detailData !== null
              ? Object.entries(detailData).filter(([key, value]) => (
                  !key.startsWith('_') && (typeof value === 'object' ? value !== null : value != null)
                ))
              : []
          );

          return (
            <div className=" p-4 rounded-xl border border-[var(--theme-border)] bg-white">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={handleCloseDetail}
                  className="flex items-center gap-1.5 text-sm text-[var(--theme-primary)] font-medium hover:underline"
                >
                  <LucideIcons.ArrowLeft size={16} />
                  Back to {getBreakdownTitle(selectedBreakdown)}
                </button>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-[var(--theme-border)] bg-white p-4">
                  <p className="text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider mb-3">
                    {isProfileBreakdown ? 'Profile Type' : isOrgBreakdown ? 'Section' : 'Category'} Details
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] text-gray-500 font-medium">Name</p>
                      <p className="text-sm font-semibold text-[var(--theme-text-primary)]">
                        {selectedDetailId}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-medium">
                        {isProfileBreakdown ? 'Total Profiles' : 'Total Count'}
                      </p>
                      <p className="text-sm font-semibold text-[var(--theme-text-primary)]">
                        {typeof detailData === 'object' && detailData !== null
                          ? Object.values(detailData).reduce((sum, v) => sum + (Number(v) || 0), 0)
                          : detailData}
                      </p>
                    </div>
                    {(isOrgBreakdown || isAgriOrWasteBreakdown) && orgTypeCards.length > 0 && (
                      <>
                        <div className="col-span-2">
                          <p className="text-[10px] text-gray-500 font-medium">Organization Types Breakdown</p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                            {orgTypeCards.map(([orgType, count]) => (
                              <div
                                key={orgType}
                                onClick={() => handleViewOrganizations(orgType)}
                                className="bg-purple-50 border border-purple-100 rounded-xl p-3 cursor-pointer transition-all hover:shadow-md hover:border-purple-300"
                                title="Click to view organizations"
                              >
                                <p className="text-xs text-purple-700 font-medium">{orgType}</p>
                                <p className="text-2xl font-bold text-purple-700 mt-1">{count}</p>
                                <p className="text-[10px] text-purple-500 font-medium mt-1">
                                  Click to view organizations
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Individuals list for the selected profile type
                    (segment = selectedDetailId, typeOfProfile = selectedSubType) */}
                {isProfileBreakdown && selectedSubType && (() => {
                  const individuals = Array.isArray(enviroIndividualsData?.data)
                    ? enviroIndividualsData.data
                    : [];
                  const currentPage = enviroIndividualsData?.currentPage || detailPage || 1;
                  const totalPages = enviroIndividualsData?.totalPages || 0;
                  const totalRecords = enviroIndividualsData?.totalRecords ?? individuals.length;
                  const perPage = enviroIndividualsData?.limit || detailLimit;

                  return (
                    <div className="rounded-xl border border-[var(--theme-border)] bg-white p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div>
                          <p className="text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider">
                            Individuals
                          </p>
                          <p className="text-[11px] text-[var(--theme-text-secondary)] font-medium mt-1">
                            Segment: <span className="font-semibold text-[var(--theme-primary)]">{selectedDetailId}</span>
                            {" â€¢ "}Profile Type: <span className="font-semibold text-[var(--theme-primary)]">{selectedSubType}</span>
                            {" â€¢ "}Total: <span className="font-semibold text-[var(--theme-text-primary)]">{totalRecords}</span>
                          </p>
                        </div>
                        <button
                          onClick={closeIndividualsView}
                          className="flex items-center gap-1.5 text-sm text-[var(--theme-primary)] font-medium hover:underline"
                        >
                          <LucideIcons.ArrowLeft size={16} />
                          Back to Profile Types
                        </button>
                      </div>

                      <div className="shadow overflow-x-auto rounded-t-2xl border border-gray-200">
                        <Table>
                          <TableHeader className="sticky top-0 bg-white z-10">
                            <TableRow className="bg-[var(--theme-bg-light)]">
                              <TableHead className="text-base font-semibold">Sr. No.</TableHead>
                              <TableHead className="text-base font-semibold">Full Name</TableHead>
                              <TableHead className="text-base font-semibold">Segment</TableHead>
                              <TableHead className="text-base font-semibold">Profile Type</TableHead>
                              <TableHead className="text-base font-semibold">Contact</TableHead>
                              <TableHead className="text-base font-semibold">State</TableHead>
                              <TableHead className="text-base font-semibold">Region</TableHead>
                              <TableHead className="text-base font-semibold">Village / Town</TableHead>
                              <TableHead className="text-base font-semibold">District</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody className="divide-y divide-gray-200">
                            {enviroIndividualsLoading ? (
                              <tr>
                                <td colSpan={9} className="p-6">
                                  <div className="py-4 flex items-center justify-center">
                                    <LoaderSpinner />
                                  </div>
                                </td>
                              </tr>
                            ) : individuals.length > 0 ? (
                              individuals.map((person, idx) => (
                                <TableRow key={person?._id || idx} className="hover:bg-gray-50 transition-all">
                                  <td className="p-4 text-[17px] font-normal text-[#252C58]">
                                    {(currentPage - 1) * perPage + idx + 1}
                                  </td>
                                  <td className="px-4 py-3 text-[15px] whitespace-nowrap font-medium text-[var(--theme-primary)]">
                                    {person?.fullname || "-"}
                                  </td>
                                  <td className="px-4 py-3 text-[15px] whitespace-nowrap">{person?.segment || "-"}</td>
                                  <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                                    <Badge variant="secondary" className="rounded-full bg-[var(--theme-bg-light)] text-[var(--theme-text-secondary)] border-[var(--theme-border)]">
                                      {person?.typeOfProfile || "-"}
                                    </Badge>
                                  </td>
                                  <td className="px-4 py-3 text-[15px] whitespace-nowrap">{person?.contact || "-"}</td>
                                  <td className="px-4 py-3 text-[15px] whitespace-nowrap">{person?.state || "-"}</td>
                                  <td className="px-4 py-3 text-[15px] whitespace-nowrap">{person?.region || "-"}</td>
                                  <td className="px-4 py-3 text-[15px] whitespace-nowrap">{person?.villageName || "-"}</td>
                                  <td className="px-4 py-3 text-[15px] whitespace-nowrap">{person?.district || "-"}</td>
                                </TableRow>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={9} className="p-6 text-center text-[15px] font-semibold text-[var(--theme-text-secondary)]">
                                  No individuals found
                                </td>
                              </tr>
                            )}
                          </TableBody>
                        </Table>
                      </div>

                      {!enviroIndividualsLoading && individuals.length > 0 && totalPages > 0 && (
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          totalItems={totalRecords}
                          itemsPerPage={perPage}
                          onPageChange={handleIndividualsPageChange}
                          onItemsPerPageChange={handleIndividualsLimitChange}
                        />
                      )}
                    </div>
                  );
                })()}

                {/* Organizations list for the selected organization type
                    (sectionName = selectedDetailId, OrganizationType) */}
                {(isOrgBreakdown || isAgriOrWasteBreakdown) && (() => {
                  const organizations = Array.isArray(enviroOrganizationsData?.data)
                    ? enviroOrganizationsData.data
                    : [];
                  const currentPage = enviroOrganizationsData?.currentPage || detailPage || 1;
                  const totalPages = enviroOrganizationsData?.totalPages || 0;
                  const totalRecords = enviroOrganizationsData?.totalRecords ?? organizations.length;
                  const perPage = enviroOrganizationsData?.limit || detailLimit;

                  return (
                    <div className="rounded-xl border border-[var(--theme-border)] bg-white p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div>
                          <p className="text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider">
                            Organizations
                          </p>
                          <p className="text-[11px] text-[var(--theme-text-secondary)] font-medium mt-1">
                            Section: <span className="font-semibold text-[var(--theme-primary)]">{orgDrilldownParams?.sectionName || '-'}</span>
                            {" • "}Organization Type: <span className="font-semibold text-[var(--theme-primary)]">{orgDrilldownParams?.OrganizationType || 'All'}</span>
                            {" • "}Total: <span className="font-semibold text-[var(--theme-text-primary)]">{totalRecords}</span>
                          </p>
                        </div>
                        {selectedOrgSubType ? (
                          <button
                            onClick={closeOrganizationsView}
                            className="flex items-center gap-1.5 text-sm text-[var(--theme-primary)] font-medium hover:underline"
                          >
                            <LucideIcons.ArrowLeft size={16} />
                            Back to Organization Types
                          </button>
                        ) : (
                          <span className="text-[11px] text-[var(--theme-text-secondary)] font-medium">
                            All organization types in this section
                          </span>
                        )}
                      </div>

                      <div className="shadow overflow-x-auto rounded-t-2xl border border-gray-200">
                        <Table>
                          <TableHeader className="sticky top-0 bg-white z-10">
                            <TableRow className="bg-[var(--theme-bg-light)]">
                              <TableHead className="text-base font-semibold">Sr. No.</TableHead>
                              <TableHead className="text-base font-semibold">Organization Name</TableHead>
                              <TableHead className="text-base font-semibold">Section</TableHead>
                              <TableHead className="text-base font-semibold">Organization Type</TableHead>
                              <TableHead className="text-base font-semibold">Contact</TableHead>
                              <TableHead className="text-base font-semibold">State</TableHead>
                              <TableHead className="text-base font-semibold">Region</TableHead>
                              <TableHead className="text-base font-semibold">Village / Town</TableHead>
                              <TableHead className="text-base font-semibold">District</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody className="divide-y divide-gray-200">
                            {enviroOrganizationsLoading ? (
                              <tr>
                                <td colSpan={9} className="p-6">
                                  <div className="py-4 flex items-center justify-center">
                                    <LoaderSpinner />
                                  </div>
                                </td>
                              </tr>
                            ) : organizations.length > 0 ? (
                              organizations.map((org, idx) => (
                                <TableRow key={org?._id || idx} className="hover:bg-gray-50 transition-all">
                                  <td className="p-4 text-[17px] font-normal text-[#252C58]">
                                    {(currentPage - 1) * perPage + idx + 1}
                                  </td>
                                  <td className="px-4 py-3 text-[15px] whitespace-nowrap font-medium text-[var(--theme-primary)]">
                                    {org?.organizationName || "-"}
                                  </td>
                                  <td className="px-4 py-3 text-[15px] whitespace-nowrap">{org?.sectionName || "-"}</td>
                                  <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                                    <Badge variant="secondary" className="rounded-full bg-[var(--theme-bg-light)] text-[var(--theme-text-secondary)] border-[var(--theme-border)]">
                                      {org?.OrganizationType || "-"}
                                    </Badge>
                                  </td>
                                  <td className="px-4 py-3 text-[15px] whitespace-nowrap">{org?.officialContactNumber || org?.contact || "-"}</td>
                                  <td className="px-4 py-3 text-[15px] whitespace-nowrap">{org?.stateName || org?.state || "-"}</td>
                                  <td className="px-4 py-3 text-[15px] whitespace-nowrap">{org?.region || "-"}</td>
                                  <td className="px-4 py-3 text-[15px] whitespace-nowrap">{org?.cityTownVillage || org?.villageName || "-"}</td>
                                  <td className="px-4 py-3 text-[15px] whitespace-nowrap">{org?.districtName || org?.district || "-"}</td>
                                </TableRow>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={9} className="p-6 text-center text-[15px] font-semibold text-[var(--theme-text-secondary)]">
                                  No organizations found
                                </td>
                              </tr>
                            )}
                          </TableBody>
                        </Table>
                      </div>

                      {!enviroOrganizationsLoading && organizations.length > 0 && totalPages > 0 && (
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          totalItems={totalRecords}
                          itemsPerPage={perPage}
                          onPageChange={handleOrganizationsPageChange}
                          onItemsPerPageChange={handleOrganizationsLimitChange}
                        />
                      )}
                    </div>
                  );
                })()}

                {/* For individualsProfileBreakdown, show profile types as KPI cards */}

                {isProfileBreakdown && !selectedSubType && typeof detailData === 'object' && detailData !== null && Object.keys(detailData).length > 0 && (
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <p className="text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider">
                        Profile Types
                      </p>
                      <span className="text-[11px] text-[var(--theme-text-secondary)] font-medium">
                        Click a profile type to view its individuals
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(detailData).map(([subType, count], idx) => {
                        const { surface, iconBg, value } =
                          profileTypeCardPalette[idx % profileTypeCardPalette.length];
                        return (
                          <div
                            key={subType}
                            onClick={() => handleViewIndividuals(subType)}
                            className={`group relative overflow-hidden rounded-2xl p-5 shadow-sm transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl ${surface}`}
                          >
                            {/* soft decorative circle for depth */}
                            <span className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white/40" />

                            <div className="relative flex items-start justify-between gap-3">
                              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl shadow-sm ${iconBg}`}>
                                <LucideIcons.Users size={20} />
                              </span>
                              <span className="rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--theme-text-secondary)]">
                                Profile
                              </span>
                            </div>

                            <p className="relative mt-4 text-sm font-semibold text-[var(--theme-text-primary)]">
                              {subType}
                            </p>
                            <p className={`relative mt-0.5 text-4xl font-bold tracking-tight ${value}`}>
                              {count}
                            </p>

                            <span className="relative mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[var(--theme-primary)]">
                              View individuals
                              <LucideIcons.ArrowRight
                                size={14}
                                className="transition-transform duration-300 group-hover:translate-x-1"
                              />
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </div>
    </div>

  );
};

export default EnviroAnalyticsBreakdown;
