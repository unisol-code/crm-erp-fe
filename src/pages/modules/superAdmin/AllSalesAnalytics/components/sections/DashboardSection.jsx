// components/sections/DashboardSection.jsx

import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HospitalTable } from "./HospitalTable";
import * as LucideIcons from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard, KpiCard, AchievementBadge } from "../analytics";
import {
  Badge,
  Button,
  Input,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../common";
import {
  COLORS,
  DISTRICTS,
  PRODUCTS,
  SPECIALITIES,
  TARGETS,
  FUNNEL,
  PRODUCT_CATEGORIES,
} from "../../data/analyticsData";
import Pagination from "../../../../../../components/uiComponents/pagination/Pagination.jsx";
import LoaderSpinner from "../../../../../../components/uiComponents/loader/LoaderSpinner.jsx";
import { TiEye} from "react-icons/ti";
function SummaryStat({ label, value, hint, tone }) {
  return (
    <div className="rounded-xl border border-[var(--theme-border)] p-4 bg-[var(--theme-card-bg)]">
      <p className="text-xs font-medium text-[var(--theme-text-secondary)]">{label}</p>
      <p
        className={`text-xl font-bold mt-1 ${tone === "success" ? "text-green-600" : "text-[var(--theme-text-primary)]"}`}
      >
        {value}
      </p>
      {hint && <p className="text-xs text-[var(--theme-text-secondary)] mt-0.5">{hint}</p>}
    </div>
  );
}

function MiniStat({ label, value, tone }) {
  return (
    <div className="rounded-xl border border-[var(--theme-border)] p-3 bg-[var(--theme-card-bg)]">
      <p className="text-[10px] font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider">
        {label}
      </p>
      <p
        className={`text-lg font-bold mt-0.5 ${tone === "success" ? "text-green-600" : "text-[var(--theme-text-primary)]"}`}
      >
        {value}
      </p>
    </div>
  );
}

// ---------- Helpers for the "Organization & Turnover Analytics" grid ----------
// Formats a number as Indian-style currency: ₹16,51,537 (matches the mock UI)
const formatINR = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

// Compact currency for chart axes: ₹16.5L / ₹1.2Cr
const formatCompactINR = (value) => {
  const n = Number(value) || 0;
  if (Math.abs(n) >= 1e7) return `₹${(n / 1e7).toFixed(1)}Cr`;
  if (Math.abs(n) >= 1e5) return `₹${(n / 1e5).toFixed(1)}L`;
  if (Math.abs(n) >= 1e3) return `₹${(n / 1e3).toFixed(1)}K`;
  return `₹${n}`;
};

// Section donut palette (Agriculture = blue, Waste Management = green, ...)
const SECTION_COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#9ca3af", "#8b5cf6", "#ef4444"];

// "Kitchen Waste Management" -> "Kitchen Waste Mgmt" (shorter label, like the mock)
const shortCategoryName = (name) => (name || "").replace(/Management/g, "Mgmt");

// One horizontal bar row used by the "Waste Management Details" card
function BarRow({ label, value, max, color }) {
  const pct = max > 0 ? (Number(value) / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span
        className="w-36 sm:w-44 shrink-0 text-right text-xs font-medium text-[var(--theme-text-primary)] truncate"
        title={label}
      >
        {label}
      </span>
      <div className="flex-1 h-4 bg-[var(--theme-bg-light)] rounded overflow-hidden">
        <div
          className="h-full rounded transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-6 shrink-0 text-xs font-semibold text-[var(--theme-text-primary)]">
        {value}
      </span>
    </div>
  );
}

// Centered banner showing a total ("Total Agriculture Turnover: ₹16,51,537")
function TotalStrip({ children }) {
  return (
    <div className="rounded-lg border border-[var(--theme-border)] bg-[var(--theme-bg-light)] py-2 px-3 text-center text-sm font-bold text-[var(--theme-text-primary)]">
      {children}
    </div>
  );
}

export function DashboardSection({
   hospitals,
   filters,
   kpis,
   executives = [],
   loading = false,
   tableLoading = false,
   paginationData = {},
   onPageChange,
   onItemsPerPageChange,
   organizationData,
   onSearch,
   specialityData,
   overviewData,
   allIndividualData,
   fetchAllIndividualData,
   specificIndividualData,
   fetchSpecificIndividualData,
    allOrganizationsData,
    fetchAllOrganizationsData,
    specificOrganizationData,
    fetchSpecificOrganizationData,
    isEnviroSolution = false,
    enviroData = null,
    enviroKpis = [],
    enviroLoading = false,
    enviroError = null,
    enviroGraphicalData = null,
    enviroGraphicalLoading = false,
    enviroGraphicalError = null,
  }) {
   const [drillDistrict, setDrillDistrict] = useState(null);
   const [productCat, setProductCat] = useState("All");
   const [hospitalSearch, setHospitalSearch] = useState("");
   const [page, setPage] = useState(1);
   const [limit, setLimit] = useState(10);
   const [kpiDetailOpen, setKpiDetailOpen] = useState(false);
   const [selectedProfileType, setSelectedProfileType] = useState(null);
   const [selectedHospitalType, setSelectedHospitalType] = useState(null);
   const [individualLoading, setIndividualLoading] = useState(false);
   const [individualPage, setIndividualPage] = useState(1);
   const [individualLimit, setIndividualLimit] = useState(10);
   const [selectedDoctor, setSelectedDoctor] = useState(null);
   const [selectedOrganization, setSelectedOrganization] = useState(null);
   const [selectedOrgType, setSelectedOrgType] = useState(null);
   const [orgLoading, setOrgLoading] = useState(false);
   const [orgPage, setOrgPage] = useState(1);
  const [orgLimit, setOrgLimit] = useState(10);
  const [showAllSpecialities, setShowAllSpecialities] = useState(false);
  // Type selected in the "… Annual Turnover" organizations table
  const [selectedAgriType, setSelectedAgriType] = useState("");

  // Use props pagination or local state
  const currentPage = paginationData.currentPage || page;
  const itemsPerPage = paginationData.itemsPerPage || limit;
  const totalItems = paginationData.totalItems || hospitals.length;
  const totalPages =
    paginationData.totalPages || Math.ceil(hospitals.length / limit);

  const targetPct = Math.round(
    (TARGETS.monthlyAchieved / TARGETS.monthlyTarget) * 100,
  );
  const gaugeData = [{ name: "Achieved", value: targetPct, fill: "var(--theme-primary)" }];

  const filteredProducts = useMemo(
    () =>
      productCat === "All"
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.category === productCat),
    [productCat],
  );

  const filteredHospitals = useMemo(() => {
    const q = hospitalSearch.toLowerCase();
    return hospitals.filter(
      (h) =>
        !q ||
        h.name.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q),
    );
  }, [hospitals, hospitalSearch]);

  // Paginate the filtered hospitals
  const paginatedHospitals = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredHospitals.slice(startIndex, endIndex);
  }, [filteredHospitals, currentPage, itemsPerPage]);

  const updatedKPIS = useMemo(() => {
    const totalHospitals = filteredHospitals.length;
    const totalVisits = filteredHospitals.reduce((sum, h) => sum + h.visits, 0);
    const avgAchievement =
      filteredHospitals.length > 0
        ? Math.round(
            filteredHospitals.reduce((sum, h) => sum + h.achievement, 0) /
              filteredHospitals.length,
          )
        : 0;

    return [
      {
        key: "hospitals",
        title: "Hospitals",
        value: totalHospitals.toString(),
        trend: 14,
        accent: "info",
        icon: "Building2",
      },
      {
        key: "doctors",
        title: "Active Doctors",
        value: "486",
        trend: 9,
        accent: "product",
        icon: "Stethoscope",
      },
      {
        key: "visits",
        title: "Monthly Visits",
        value: totalVisits.toLocaleString(),
        trend: 12,
        accent: "success",
        icon: "Activity",
      },
      {
        key: "achievement",
        title: "Target Achievement",
        value: `${avgAchievement}%`,
        trend: 8,
        accent: "target",
        icon: "Target",
      },
    ];
  }, [filteredHospitals]);

  const filteredDistricts = useMemo(() => {
    return DISTRICTS.map((d) => {
      const hospitalCount = filteredHospitals.filter(
        (h) => h.district === d.district,
      ).length;
      return {
        ...d,
        value:
          hospitalCount > 0
            ? filteredHospitals
                .filter((h) => h.district === d.district)
                .reduce((sum, h) => sum + h.visits, 0)
            : d.value,
      };
    });
  }, [filteredHospitals]);

 const specialityChartData = useMemo(() => {
  const data = specialityData?.data;

  // âœ… NEW format: { specialityWise: {...}, profileWiseSpeciality: {...} }
  if (data?.specialityWise && typeof data.specialityWise === "object") {
    const { specialityWise, profileWiseSpeciality = {} } = data;

    return Object.entries(specialityWise).map(([name, value]) => {
      // Build profiles breakdown for tooltip
      const profiles = [];
      Object.entries(profileWiseSpeciality).forEach(([profileType, specialities]) => {
        if (specialities?.[name]) {
          profiles.push({
            typeOfDoctorProfile: profileType,
            count: specialities[name],
          });
        }
      });

      return {
        name,
        value,
        profiles,
        totalDoctors: value,
      };
    });
  }

  // ðŸ” Fallback: old array format (keep for backward compatibility)
  if (Array.isArray(data)) {
    return data.map((item) => ({
      name: item.speciality || "Unknown",
      value: item.totalDoctors || 0,
      profiles: item.profiles || [],
      totalDoctors: item.totalDoctors || 0,
    }));
  }

  return [];
}, [specialityData]);
  const formatSpecialityName = (name) => {
    if (!name) return "Unknown";
    // Remove speciality codes like (CARDIO), (ENDO) etc.
    const cleanName = name.replace(/\s*\([^)]*\)/g, "").trim();
    return cleanName;
  };

  // âœ… Get top speciality
  const topSpeciality = useMemo(() => {
    if (specialityChartData.length === 0) return { name: "N/A", value: 0 };
    const sorted = [...specialityChartData].sort((a, b) => b.value - a.value);
    return sorted[0];
  }, [specialityChartData]);

  // âœ… Calculate total doctors across all specialities
  const totalDoctors = useMemo(() => {
    return specialityChartData.reduce((sum, item) => sum + item.value, 0);
  }, [specialityChartData]);

  // âœ… Doctors grouped by profile type (Surgeon, Physician, Administration, ...)
  //    Feeds the "Doctors by Profile Type" donut + legend.
  const profileTotals = useMemo(() => {
    const result = [];
    const profileWise = specialityData?.data?.profileWiseSpeciality;

    if (profileWise && typeof profileWise === "object") {
      Object.entries(profileWise).forEach(([profileType, specialities]) => {
        const total = Object.values(specialities || {}).reduce(
          (sum, v) => sum + (Number(v) || 0),
          0
        );
        if (total > 0) result.push({ name: profileType, value: total });
      });
    } else if (Array.isArray(specialityData?.data)) {
      // Fallback for old array format
      const byProfile = {};
      specialityData.data.forEach((item) => {
        item.profiles?.forEach((profile) => {
          byProfile[profile.typeOfDoctorProfile] =
            (byProfile[profile.typeOfDoctorProfile] || 0) + (profile.count || 0);
        });
      });
      Object.entries(byProfile).forEach(([name, value]) => {
        if (value > 0) result.push({ name, value });
      });
    }

    return result.sort((a, b) => b.value - a.value);
  }, [specialityData]);

  // âœ… Specialities sorted by doctors - biggest first (ranked bar list)
  const sortedSpecialities = useMemo(
    () => [...specialityChartData].sort((a, b) => b.value - a.value),
    [specialityChartData],
  );

  // âœ… Only the first 10 unless the user clicks "Show all"
  const visibleSpecialities = useMemo(
    () =>
      showAllSpecialities
        ? sortedSpecialities
        : sortedSpecialities.slice(0, 10),
    [showAllSpecialities, sortedSpecialities],
  );
  const displayKpis = isEnviroSolution && Array.isArray(enviroKpis) && enviroKpis.length > 0 
    ? enviroKpis.filter(k => k.key !== "totalAgriculture" && k.key !== "totalWasteManagement")
    : (Array.isArray(kpis) && kpis.length > 0 ? kpis : updatedKPIS);
  const displayLoading = isEnviroSolution ? enviroLoading : loading;

  // =====================================================================
  // Enviro: "Organization & Turnover Analytics" grid
  // Data comes from fetchEnviroOrganizationsGrphicalAnalytics
  // (GET dashboard/getEnviroOrganizationsGrphicalAnalytics), whose response is
  // { data: [sections], wasteManagement, annualTurnoverAnalytics,
  //   wasteManagementAnnualTurnoverAnalytics }
  // =====================================================================
  const grphical = enviroGraphicalData;

  const grphicalSections = useMemo(
    () => (Array.isArray(grphical?.data) ? grphical.data : []),
    [grphical],
  );

  // Donut slices -> [{ name: "Agriculture", value: 39 }, ...]
  const sectionPieData = useMemo(() => {
    const withCount = grphicalSections.filter((s) => (s.total || 0) > 0);
    return (withCount.length ? withCount : grphicalSections).map((s) => ({
      name: s.sectionName || "Unknown",
      value: s.total || 0,
    }));
  }, [grphicalSections]);

  // The section the turnover payload belongs to (Agriculture in the mock)
  const agricultureSection = useMemo(() => {
    if (!grphicalSections.length) return null;
    const turnoverSection = grphical?.annualTurnoverAnalytics?.sectionName;
    return (
      grphicalSections.find((s) => s.sectionName === turnoverSection) ||
      grphicalSections.find((s) => (s.sectionName || "").toLowerCase() === "agriculture") ||
      grphicalSections.find((s) => !/waste/i.test(s.sectionName || "")) ||
      grphicalSections[0]
    );
  }, [grphicalSections, grphical]);

  // "Agriculture Organizations by Type" - only types that have organizations
  const agricultureTypeChart = useMemo(
    () =>
      [...(agricultureSection?.types || [])]
        .filter((t) => (t.count || 0) > 0)
        .sort((a, b) => b.count - a.count)
        .map((t) => ({ type: t.type, count: t.count })),
    [agricultureSection],
  );

  // ---- Waste Management Details card ----
  const wasteDetails = grphical?.wasteManagement || null;

  const wasteCategoryBars = useMemo(
    () => (wasteDetails?.categories || []).filter((c) => (c.count || 0) > 0),
    [wasteDetails],
  );

  // Type counts aggregated across every waste-related section
  const wasteTypeBars = useMemo(() => {
    const totals = new Map();
    grphicalSections
      .filter((s) => /waste/i.test(s.sectionName || ""))
      .forEach((s) =>
        (s.types || []).forEach((t) =>
          totals.set(t.type, (totals.get(t.type) || 0) + (t.count || 0)),
        ),
      );
    if (totals.size > 0) {
      return Array.from(totals, ([type, count]) => ({ type, count }));
    }
    // Fallback: type counts from the turnover payload
    return (grphical?.wasteManagementAnnualTurnoverAnalytics?.byType || []).map((t) => ({
      type: t.type,
      count: t.organizations || 0,
    }));
  }, [grphicalSections, grphical]);

  // ---- Agriculture annual turnover ----
  const agriTurnover = grphical?.annualTurnoverAnalytics || null;

  const agriTurnoverTotal = useMemo(
    () =>
      (agriTurnover?.byType || []).reduce(
        (sum, t) => sum + (Number(t.totalTurnover) || 0),
        0,
      ),
    [agriTurnover],
  );

  const agriTurnoverChart = useMemo(
    () =>
      (agriTurnover?.byType || []).map((t) => ({
        type: t.type,
        turnover: Number(t.totalTurnover) || 0,
        turnoverLabel: formatINR(t.totalTurnover),
      })),
    [agriTurnover],
  );

  // ---- Waste management annual turnover ----
  const wasteTurnover = grphical?.wasteManagementAnnualTurnoverAnalytics || null;

  const wasteTurnoverTotal = useMemo(
    () =>
      (wasteTurnover?.byType || []).reduce(
        (sum, t) => sum + (Number(t.totalTurnover) || 0),
        0,
      ),
    [wasteTurnover],
  );

  const wasteTurnoverChart = useMemo(
    () =>
      (wasteTurnover?.byType || []).map((t) => ({
        type: t.type,
        turnover: Number(t.totalTurnover) || 0,
        turnoverLabel: formatINR(t.totalTurnover),
      })),
    [wasteTurnover],
  );

  // ---- Organization lists for the two tables ----
  const agriOrganizations = useMemo(() => {
    const typeBlock = (agriTurnover?.byType || []).find((t) => t.type === selectedAgriType);
    return typeBlock?.organizationsList || [];
  }, [agriTurnover, selectedAgriType]);

  const wasteOrganizations = useMemo(
    () =>
      (wasteTurnover?.byType || []).flatMap((t) =>
        (t.organizationsList || []).map((o) => ({ ...o, type: t.type })),
      ),
    [wasteTurnover],
  );

  // Default the agriculture table to the first type that has organizations
  useEffect(() => {
    const byType = agriTurnover?.byType || [];
    if (byType.length === 0) return;
    if (!byType.some((t) => t.type === selectedAgriType)) {
      const firstWithOrgs = byType.find((t) => (t.organizations || 0) > 0);
      setSelectedAgriType((firstWithOrgs || byType[0]).type);
    }
  }, [agriTurnover, selectedAgriType]);

  const hasGraphicalData =
    grphicalSections.length > 0 || !!wasteDetails || !!agriTurnover || !!wasteTurnover;

  const agricultureLabel = agricultureSection?.sectionName || "Agriculture";
  const wasteTurnoverLabel = wasteTurnover?.sectionName || "Waste Management";
  const wasteCategoryMax = Math.max(0, ...wasteCategoryBars.map((c) => c.count || 0));
  const wasteTypeMax = Math.max(0, ...wasteTypeBars.map((t) => t.count || 0));

  const handlePageChange = (newPage) => {
    setPage(newPage);
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  const handleItemsPerPageChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
    if (onItemsPerPageChange) {
      onItemsPerPageChange(newLimit);
    }
  };

  const navigate = useNavigate();

  const handleKpiClick = (kpi) => {
    if (kpi.key === "individualCount") {
      navigate("/sales-analyticsAll/doctor-profile-breakdown");
    }
    if (kpi.key === "organizationCount") {
      navigate("/sales-analyticsAll/hospital-type-breakdown");
    }
    // Enviro Analytics KPIs
    if (kpi.key === "employeeCount") {
      // Enviro employees -> dedicated breakdown page
      // (dashboard/getAllemployeeEnviroAnalytics)
      navigate("/sales-analyticsAll/enviro-employee-breakdown");
      return;
    }
    if (kpi.key === "totalIndividuals") {
      navigate("/sales-analyticsAll/enviro-analytics-breakdown/individualsProfileBreakdown");
    }
    if (kpi.key === "totalOrganizations") {
      navigate("/sales-analyticsAll/enviro-analytics-breakdown/organizationBreakdown");
    }
    // if (kpi.key === "totalAgriculture") {
    //   navigate("/sales-analyticsAll/enviro-analytics-breakdown/agricultureBreakdown");
    // }
    // if (kpi.key === "totalWasteManagement") {
    //   navigate("/sales-analyticsAll/enviro-analytics-breakdown/wasteManagementBreakdown");
    // }
  };

  const handleIndividualPageChange = (newPage) => {
    setIndividualPage(newPage);
  };

  const handleIndividualLimitChange = (newLimit) => {
    setIndividualLimit(newLimit);
    setIndividualPage(1);
  };

  useEffect(() => {
    if (selectedProfileType && fetchAllIndividualData) {
      setIndividualLoading(true);
      fetchAllIndividualData({
        typeOfDoctorProfile: selectedProfileType,
        page: individualPage,
        limit: individualLimit,
      })
        .finally(() => setIndividualLoading(false));
    }
  }, [selectedProfileType, fetchAllIndividualData, individualPage, individualLimit]);

  useEffect(() => {
    if (selectedDoctor && fetchSpecificIndividualData) {
      fetchSpecificIndividualData(selectedDoctor);
    }
  }, [selectedDoctor, fetchSpecificIndividualData]);

  useEffect(() => {
    if (selectedOrgType && fetchAllOrganizationsData) {
      setOrgLoading(true);
      fetchAllOrganizationsData({
        typeOfOrgOrHospital: selectedOrgType,
        page: orgPage,
        limit: orgLimit,
      }).finally(() => setOrgLoading(false));
    }
  }, [selectedOrgType, fetchAllOrganizationsData, orgPage, orgLimit]);

  useEffect(() => {
    if (selectedOrganization && fetchSpecificOrganizationData) {
      fetchSpecificOrganizationData(selectedOrganization);
    }
  }, [selectedOrganization, fetchSpecificOrganizationData]);

  const handleViewDoctor = (id) => {
    setSelectedDoctor(id);
  };

  const handleViewOrganization = (id) => {
    setSelectedOrganization(id);
  };

  const handleOrgPageChange = (newPage) => {
    setOrgPage(newPage);
  };

  const handleOrgLimitChange = (newLimit) => {
    setOrgLimit(newLimit);
    setOrgPage(1);
  };

  // ---------- Enviro employees list ----------
  // The employee breakdown now lives on its own route
  // (/sales-analyticsAll/enviro-employee-breakdown), so nothing to keep here.

  return (
    <div>
      {/* Header Section */}
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[var(--theme-text-primary)]">
            Territory Analytics
          </h1>
          <p className="text-sm text-[var(--theme-text-secondary)] mt-1 font-medium">
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[var(--theme-primary)] animate-pulse" />
                Loading analytics...
              </span>
            ) : (
              <>
                Live view of hospitals, doctors, visits and product performance.
                {filters.state && (
                  <span className="ml-2 text-[var(--theme-primary)] font-semibold">
                    Filtered by: {filters.state}
                  </span>
                )}
                {filters.district && (
                  <span className="ml-2 text-[var(--theme-primary)] font-semibold">
                    | {filters.district}
                  </span>
                )}
                {filters.city && (
                  <span className="ml-2 text-[var(--theme-primary)] font-semibold">
                    | {filters.city}
                  </span>
                )}
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-[var(--theme-text-secondary)] bg-[var(--theme-bg-light)] px-3 py-1.5 rounded-lg border border-[var(--theme-border)]">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Data synced 2 min ago
        </div>
      </div>
      {/* KPI Cards */}
      {displayLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl border border-[var(--theme-border)] p-4 bg-[var(--theme-card-bg)] animate-pulse">
              <div className="h-3 w-24 bg-gray-200 rounded mb-3" />
              <div className="h-8 w-16 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {displayKpis.map((k) => {
            const Icon = LucideIcons[k.icon] || LucideIcons.Activity;
            return (
              <KpiCard
                key={k.key}
                title={k.title}
                value={k.value}
                trend={k.trend}
                accent={k.accent}
                icon={Icon}
                onClick={() => handleKpiClick(k)}
              />
            );
          })}
        </div>
      )}

      {/* ✅ Enviro: Organization & Turnover Analytics
          (rendered from fetchEnviroOrganizationsGrphicalAnalytics response) */}
      {isEnviroSolution && (
        <div className="mt-6">
          <div className="mb-3">
            <h2 className="text-lg md:text-xl font-bold text-[var(--theme-text-primary)]">
              Organization &amp; Turnover Analytics
            </h2>
            <p className="text-xs text-[var(--theme-text-secondary)] mt-0.5 font-medium">
              Section-wise organizations, waste management breakdown &amp; annual turnover insights
            </p>
          </div>

          {enviroGraphicalLoading && !hasGraphicalData ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] p-6 animate-pulse"
                >
                  <div className="h-4 w-56 bg-gray-200 rounded mb-4" />
                  <div className="h-40 w-full bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          ) : !hasGraphicalData ? (
            <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] p-8 text-center">
              <p className="text-sm font-medium text-[var(--theme-text-primary)]">
                {enviroGraphicalError
                  ? enviroGraphicalError
                  : "No graphical analytics data available"}
              </p>
              <p className="text-xs text-[var(--theme-text-secondary)] mt-1">
                Try changing the filters to load organization &amp; turnover analytics.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {/* 1. Section Overview (Agriculture vs. Waste Management) */}
              <ChartCard title="Section Overview (Agriculture vs. Waste Management)">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  {/* Donut: organizations per section */}
                  <div>
                    {sectionPieData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={sectionPieData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={52}
                            outerRadius={80}
                            paddingAngle={2}
                            label={({ value }) => `${value} orgs`}
                          >
                            {sectionPieData.map((_, i) => (
                              <Cell
                                key={i}
                                fill={SECTION_COLORS[i % SECTION_COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              borderRadius: 12,
                              border: "1px solid var(--theme-bg-sidebar)",
                              background: "#ffffff",
                            }}
                            formatter={(value, name) => [`${value} orgs`, name]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-[200px] text-sm text-gray-400">
                        No section data available
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col">
                    {/* Legend */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center">
                      {sectionPieData.map((s, i) => (
                        <span
                          key={`${s.name}-${i}`}
                          className="flex items-center gap-1.5 text-xs text-[var(--theme-text-primary)]"
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{
                              backgroundColor: SECTION_COLORS[i % SECTION_COLORS.length],
                            }}
                          />
                          {s.name}
                          <span className="font-semibold">{s.value} orgs</span>
                        </span>
                      ))}
                    </div>

                    {/* Agriculture Organizations by Type */}
                    <div className="mt-3 rounded-xl border border-[var(--theme-border)] p-3">
                      <p className="text-xs font-semibold text-[var(--theme-text-primary)] text-center mb-1">
                        {agricultureLabel} Organizations by Type
                      </p>
                      {agricultureTypeChart.length > 0 ? (
                        <ResponsiveContainer width="100%" height={160}>
                          <BarChart
                            data={agricultureTypeChart}
                            margin={{ top: 12, right: 8, left: -18, bottom: 0 }}
                          >
                            <CartesianGrid vertical={false} stroke="var(--theme-bg-sidebar)" />
                            <XAxis
                              dataKey="type"
                              stroke="#6b7280"
                              fontSize={10}
                              interval={0}
                              tickLine={false}
                            />
                            <YAxis stroke="#6b7280" fontSize={10} allowDecimals={false} />
                            <Tooltip
                              cursor={{ fill: "rgba(0,0,0,0.04)" }}
                              formatter={(value) => [`${value} organizations`, "Organizations"]}
                            />
                            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                              <LabelList
                                dataKey="count"
                                position="top"
                                fontSize={11}
                                fontWeight={600}
                              />
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-[160px] text-sm text-gray-400">
                          No type data available
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </ChartCard>

              {/* 2. Waste Management Details */}
              <ChartCard title="Waste Management Details">
                <TotalStrip>
                  Total Waste Organizations:{" "}
                  <span className="font-bold">{wasteDetails?.totalOrganizations ?? 0}</span>
                </TotalStrip>

                <p className="text-center text-xs font-semibold text-[var(--theme-text-primary)] uppercase tracking-wider mt-4">
                  By Category
                </p>
                <div className="mt-2 space-y-2">
                  {wasteCategoryBars.length > 0 ? (
                    wasteCategoryBars.map((c) => (
                      <BarRow
                        key={c.category}
                        label={shortCategoryName(c.category)}
                        value={c.count || 0}
                        max={wasteCategoryMax}
                        color="#22c55e"
                      />
                    ))
                  ) : (
                    <p className="text-center text-xs text-gray-400 py-2">
                      No category data available
                    </p>
                  )}
                </div>

                <p className="text-center text-xs font-semibold text-[var(--theme-text-primary)] uppercase tracking-wider mt-4">
                  By Type
                </p>
                <div className="mt-2 space-y-2">
                  {wasteTypeBars.length > 0 ? (
                    wasteTypeBars.map((t) => (
                      <BarRow
                        key={t.type}
                        label={t.type}
                        value={t.count || 0}
                        max={wasteTypeMax}
                        color="#f59e0b"
                      />
                    ))
                  ) : (
                    <p className="text-center text-xs text-gray-400 py-2">
                      No type data available
                    </p>
                  )}
                </div>
              </ChartCard>

              {/* 3. Agriculture Annual Turnover */}
              <ChartCard title={`${agricultureLabel} Annual Turnover`}>
                <TotalStrip>
                  Total {agricultureLabel} Turnover:{" "}
                  <span className="font-bold">{formatINR(agriTurnoverTotal)}</span>
                </TotalStrip>

                <div className="mt-3">
                  {agriTurnoverChart.length > 0 ? (
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart
                        data={agriTurnoverChart}
                        margin={{ top: 15, right: 8, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid vertical={false} stroke="var(--theme-bg-sidebar)" />
                        <XAxis
                          dataKey="type"
                          stroke="#6b7280"
                          fontSize={10}
                          interval={0}
                          tickLine={false}
                        />
                        <YAxis
                          stroke="#6b7280"
                          fontSize={10}
                          width={55}
                          tickFormatter={formatCompactINR}
                        />
                        <Tooltip
                          cursor={{ fill: "rgba(0,0,0,0.04)" }}
                          formatter={(value) => [formatINR(value), "Annual Turnover"]}
                        />
                        <Bar dataKey="turnover" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                          <LabelList
                            dataKey="turnoverLabel"
                            position="top"
                            fontSize={10}
                            fontWeight={600}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[180px] text-sm text-gray-400">
                      No turnover data available
                    </div>
                  )}
                </div>

                {/* Organizations of the selected type */}
                <div className="mt-4 flex items-center justify-between gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-[var(--theme-text-primary)]">
                    {selectedAgriType || "Agriculture"} Organizations
                  </p>
                  {(agriTurnover?.byType || []).length > 1 && (
                    <select
                      value={selectedAgriType}
                      onChange={(e) => setSelectedAgriType(e.target.value)}
                      className="text-xs border border-[var(--theme-border)] rounded-lg px-2 py-1 bg-[var(--theme-card-bg)] text-[var(--theme-text-primary)]"
                    >
                      {(agriTurnover?.byType || []).map((t) => (
                        <option key={t.type} value={t.type}>
                          {t.type} ({t.organizations || 0})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="mt-2 max-h-[220px] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Unique ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>District</TableHead>
                        <TableHead className="text-right">Annual Turnover</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {agriOrganizations.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="text-center py-6 text-sm text-gray-400"
                          >
                            No organizations found
                          </TableCell>
                        </TableRow>
                      ) : (
                        agriOrganizations.map((org, idx) => (
                          <TableRow key={`${org.uniqueId}-${idx}`}>
                            <TableCell className="text-xs whitespace-nowrap">
                              {org.uniqueId}
                            </TableCell>
                            <TableCell className="text-xs font-medium">{org.name}</TableCell>
                            <TableCell className="text-xs">{org.district}</TableCell>
                            <TableCell className="text-xs text-right whitespace-nowrap">
                              {Number(org.annualTurnover || 0).toLocaleString("en-IN")}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </ChartCard>

              {/* 4. Waste Management Annual Turnover */}
              <ChartCard title={`${wasteTurnoverLabel} Annual Turnover`}>
                <TotalStrip>
                  Total {wasteTurnoverLabel} Turnover:{" "}
                  <span className="font-bold">{formatINR(wasteTurnoverTotal)}</span>
                </TotalStrip>

                <div className="mt-3">
                  {wasteTurnoverChart.length > 0 ? (
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart
                        data={wasteTurnoverChart}
                        margin={{ top: 15, right: 8, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid vertical={false} stroke="var(--theme-bg-sidebar)" />
                        <XAxis
                          dataKey="type"
                          stroke="#6b7280"
                          fontSize={10}
                          interval={0}
                          tickLine={false}
                        />
                        <YAxis
                          stroke="#6b7280"
                          fontSize={10}
                          width={55}
                          tickFormatter={formatCompactINR}
                        />
                        <Tooltip
                          cursor={{ fill: "rgba(0,0,0,0.04)" }}
                          formatter={(value) => [formatINR(value), "Annual Turnover"]}
                        />
                        <Bar dataKey="turnover" fill="#f59e0b" radius={[4, 4, 0, 0]}>
                          <LabelList
                            dataKey="turnoverLabel"
                            position="top"
                            fontSize={10}
                            fontWeight={600}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[180px] text-sm text-gray-400">
                      No turnover data available
                    </div>
                  )}
                </div>

                <p className="mt-4 text-sm font-semibold text-[var(--theme-text-primary)]">
                  Waste Management Organizations
                </p>

                <div className="mt-2 max-h-[220px] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Unique ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>District</TableHead>
                        <TableHead className="text-right">Annual Turnover</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {wasteOrganizations.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-6 text-sm text-gray-400"
                          >
                            No organizations found
                          </TableCell>
                        </TableRow>
                      ) : (
                        wasteOrganizations.map((org, idx) => (
                          <TableRow key={`${org.uniqueId}-${idx}`}>
                            <TableCell className="text-xs whitespace-nowrap">
                              {org.uniqueId}
                            </TableCell>
                            <TableCell className="text-xs font-medium">{org.name}</TableCell>
                            <TableCell className="text-xs">{org.type}</TableCell>
                            <TableCell className="text-xs">{org.district}</TableCell>
                            <TableCell className="text-xs text-right whitespace-nowrap">
                              {Number(org.annualTurnover || 0).toLocaleString("en-IN")}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </ChartCard>
            </div>
          )}
        </div>
      )}

        {/* Row 2: Speciality Intelligence */}
        {!isEnviroSolution && (
          <ChartCard
            title="Speciality Intelligence"
            subtitle={`${specialityChartData.length} specialities  ${totalDoctors} total doctors`}
            className="mt-4"
          >
            {/* 1. Quick summary */}
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-[var(--theme-border)] p-4 bg-[var(--theme-card-bg)] animate-pulse"
                  >
                    <div className="h-3 w-20 bg-gray-200 rounded mb-2" />
                    <div className="h-6 w-24 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <SummaryStat
                  label="ðŸ† Top Speciality"
                  value={formatSpecialityName(topSpeciality?.name) || "N/A"}
                  hint={`${topSpeciality?.value || 0} doctors`}
                />
                <SummaryStat
                  label="ðŸ©º Top Profile"
                  value={profileTotals[0]?.name || "N/A"}
                  hint={`${profileTotals[0]?.value || 0} doctors`}
                />
                <SummaryStat
                  label="ðŸ“Š Total Specialities"
                  value={String(specialityChartData.length)}
                  hint="unique specialities"
                />
                <SummaryStat
                  label="ðŸ‘¥ Total Doctors"
                  value={String(totalDoctors)}
                  hint="across all specialities"
                />
              </div>
            )}

            {/* 2. Doctors by profile type - only a few slices, so a donut stays readable */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 rounded-xl border border-[var(--theme-border)] p-4 bg-[var(--theme-card-bg)]">
              <div className="md:col-span-1">
                <p className="text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider mb-1">
                  Doctors by Profile Type
                </p>
                {loading ? (
                  <div className="flex items-center justify-center h-[180px]">
                    <LoaderSpinner />
                  </div>
                ) : profileTotals.length > 0 ? (
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={profileTotals}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={2}
                      >
                        {profileTotals.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid var(--theme-bg-sidebar)",
                          background: "#ffffff",
                          padding: "12px",
                        }}
                        formatter={(value, name) => [`${value} doctors`, name]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[180px] text-sm text-gray-400">
                    No profile data available
                  </div>
                )}
              </div>
              <div className="md:col-span-2 space-y-2 self-center">
                {profileTotals.map((p, i) => (
                  <div
                    key={p.name}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="flex items-center gap-2 text-[var(--theme-text-primary)]">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      />
                      {p.name}
                    </span>
                    <span className="font-semibold text-[var(--theme-text-primary)] whitespace-nowrap">
                      {p.value}
                      <span className="ml-1 text-xs font-normal text-[var(--theme-text-secondary)]">
                        ({totalDoctors ? Math.round((p.value / totalDoctors) * 100) : 0}%)
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Speciality-wise doctors - ranked bars (Top 10 by default) */}
            <div className="mt-4 pt-4 border-t border-[var(--theme-border)]">
              <div className="flex items-center justify-between gap-3 mb-3">
                <p className="text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider">
                  Speciality-wise Doctors
                </p>
                {sortedSpecialities.length > 10 && (
                  <button
                    type="button"
                    onClick={() => setShowAllSpecialities((prev) => !prev)}
                    className="text-xs font-medium text-[var(--theme-primary)] hover:underline"
                  >
                    {showAllSpecialities
                      ? "Show top 10 only"
                      : `Show all ${sortedSpecialities.length}`}
                  </button>
                )}
              </div>

              {loading ? (
                <div className="space-y-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-6 w-full bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
              ) : sortedSpecialities.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-400">
                  No speciality data available
                </div>
              ) : (
                <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                  {visibleSpecialities.map((item, index) => {
                    const barPct = topSpeciality?.value
                      ? Math.round((item.value / topSpeciality.value) * 100)
                      : 0;
                    const share = totalDoctors
                      ? Math.round((item.value / totalDoctors) * 100)
                      : 0;
                    const profileSplit = item.profiles
                      ?.map((p) => `${p.typeOfDoctorProfile}: ${p.count}`)
                      .join(", ");

                    return (
                      <div
                        key={item.name}
                        className="flex items-center gap-3"
                        title={profileSplit ? `Profile split - ${profileSplit}` : undefined}
                      >
                        <span className="w-5 shrink-0 text-right text-xs text-[var(--theme-text-secondary)]">
                          {index + 1}
                        </span>
                        <span
                          className="w-36 sm:w-44 shrink-0 truncate text-sm text-[var(--theme-text-primary)]"
                          title={formatSpecialityName(item.name)}
                        >
                          {formatSpecialityName(item.name)}
                        </span>
                        <div className="flex-1 h-2.5 bg-[var(--theme-bg-light)] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${barPct}%`,
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                        </div>
                        <span className="w-16 shrink-0 text-right text-xs font-semibold text-[var(--theme-text-primary)]">
                          {item.value}
                          <span className="ml-1 font-normal text-[var(--theme-text-secondary)]">
                            ({share}%)
                          </span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>


        </ChartCard>
      )}



      {/* Sales Executive Performance - Grouped Bar Chart */}
      <ChartCard
        title="Sales Executive Performance"
        subtitle="Total Visits vs Success Visits"
        className="mt-4"
      >
        {loading ? (
          <div className="flex items-center justify-center h-[220px]">
            <LoaderSpinner />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={executives}
              layout="vertical"
              margin={{ left: 8, right: 16 }}
            >
              <CartesianGrid horizontal={false} stroke="var(--theme-bg-sidebar)" />
              <XAxis type="number" stroke="#6b7280" fontSize={11} />
              <YAxis
                dataKey="name"
                type="category"
                stroke="#6b7280"
                fontSize={12}
                width={70}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid var(--theme-bg-sidebar)",
                  background: "#ffffff",
                }}
                formatter={(value, name) => {
                  if (name === "planned")
                    return [`${value} visits`, "Total Visits"];
                  if (name === "completed")
                    return [`${value} visits`, "Success Visits"];
                  return [value, name];
                }}
              />
              <Legend />
              <Bar
                dataKey="planned"
                name="Total Visits"
                fill="var(--theme-primary)"
                radius={[0, 4, 4, 0]}
              />
              <Bar
                dataKey="completed"
                name="Success Visits"
                fill="#22c55e"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}

        <div className="mt-4 overflow-x-auto -mx-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Executive</TableHead>
                <TableHead className="text-right">Total Visits</TableHead>
                <TableHead className="text-right">Success Visits</TableHead>
                <TableHead className="text-right">Achievement %</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="p-8 text-center">
                    <div className="flex justify-center items-center w-full">
                      <LoaderSpinner />
                    </div>
                  </TableCell>
                </TableRow>
              ) : executives.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-sm text-gray-500"
                  >
                    No executive data available
                  </TableCell>
                </TableRow>
              ) : (
                executives.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">{e.name}</TableCell>
                    <TableCell className="text-right">{e.planned}</TableCell>
                    <TableCell className="text-right">{e.completed}</TableCell>
                    <TableCell className="text-right">
                      <AchievementBadge value={e.achievement} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </ChartCard>
      {/* Row 5: Hospitals Table - Employee List Style */}
      {/* Table */}
      {/* <div className="shadow overflow-x-auto">
        <div className="mt-4">
        <HospitalTable
              data={organizationData}
              loading={loading}
              tableLoading={tableLoading}
              pagination={{
                currentPage: organizationData?.currentPage || 1,
                pageSize: organizationData?.pageSize || 10,
              }}
              onPageChange={onPageChange}
              onItemsPerPageChange={onItemsPerPageChange}
              onSearch={onSearch}
            />
        </div>
      </div> */}

      {/* District Drill-down Dialog */}
      <Dialog open={!!drillDistrict} onOpenChange={(o) => !o && setDrillDistrict(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader className="pb-4">
            <DialogTitle>{drillDistrict} district</DialogTitle>
            <p className="text-xs text-[var(--theme-text-secondary)] font-medium mt-1">
              Field-force performance in {drillDistrict}
            </p>
          </DialogHeader>
          <div className="mt-2 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <MiniStat
                label="Visits"
                value={String(
                  DISTRICTS.find((d) => d.district === drillDistrict)?.value ??
                    0,
                )}
                tone="success"
              />
              <MiniStat
                label="Hospitals"
                value={String(
                  filteredHospitals.filter((h) => h.district === drillDistrict)
                    .length,
                )}
              />
              <MiniStat
                label="Leads"
                value={String(
                  filteredHospitals
                    .filter((h) => h.district === drillDistrict)
                    .reduce((sum, h) => sum + h.leads, 0),
                )}
                tone="success"
              />
              <MiniStat
                label="Achievement"
                value={`${filteredHospitals.filter((h) => h.district === drillDistrict).length > 0 ? Math.round(filteredHospitals.filter((h) => h.district === drillDistrict).reduce((sum, h) => sum + h.achievement, 0) / filteredHospitals.filter((h) => h.district === drillDistrict).length) : 0}%`}
              />
            </div>
            <div className="rounded-2xl border border-[var(--theme-bg-sidebar)] p-4 bg-white">
              <p className="text-sm font-medium mb-2 flex items-center gap-2 text-[var(--theme-accent)]">
                <LucideIcons.TrendingUp size={16} className="text-[var(--theme-primary)]" />
                Top hospitals in {drillDistrict}
              </p>
              <ul className="space-y-2 text-sm">
                {filteredHospitals
                  .filter((h) => h.district === drillDistrict)
                  .slice(0, 3)
                  .map((h) => (
                    <li
                      key={h.id}
                      className="flex items-center justify-between"
                    >
                      <span>{h.name}</span>
                      <AchievementBadge value={h.achievement} />
                    </li>
                  ))}
              </ul>
            </div>
            <Button className="w-full rounded-xl bg-[var(--theme-primary)] hover:bg-[var(--theme-accent)]">
              Open full report
            </Button>
          </div>
        </DialogContent>
      </Dialog>


    </div>
  );
}
