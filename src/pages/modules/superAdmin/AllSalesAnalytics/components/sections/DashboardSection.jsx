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
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Treemap,
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
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { geoArea, geoCentroid } from "d3-geo";
// Bundled India states GeoJSON (property ST_NM = state name) for the map
import indiaStatesGeo from "../../data/indiaStates.json";
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

// ---------- Helpers for the "Agricultural Analytics & Farmer Profiles" grid ----------
// "2026-09" -> "Sep 2026" (monthlyTrend / tentativeBuyingMonth come as YYYY-MM)
const formatMonthLabel = (month) => {
  if (!month) return "";
  const [year, m] = String(month).split("-");
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const idx = Number(m) - 1;
  return names[idx] ? `${names[idx]} ${year}` : String(month);
};

// Strip trailing zeros: "15.00" -> "15", "1.65" stays "1.65"
const trimZeros = (s) => s.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "");

// Loan amounts -> "1.65 Cr" / "15 Lakh" (mock style, without the ₹ sign)
const formatLoanAmount = (value) => {
  const n = Number(value) || 0;
  if (Math.abs(n) >= 1e7) return `${trimZeros((n / 1e7).toFixed(2))} Cr`;
  if (Math.abs(n) >= 1e5) return `${trimZeros((n / 1e5).toFixed(2))} Lakh`;
  if (Math.abs(n) >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return String(n);
};

// "FARMER" -> "Farmer", "GOVERNMENT OFFICER" -> "Government Officer"
const titleCase = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

// Legend names used by the mock UI
const profileTypeLegendLabel = (label) => {
  const l = String(label || "").toUpperCase();
  if (l === "FARMER") return "Farmers";
  if (l.includes("GOVERNMENT")) return "Govt Officers";
  return label;
};

// Donut / bar colors for the individual analytics charts (match the mock)
const PROFILE_TYPE_COLORS = { FARMER: "#22c55e", "GOVERNMENT OFFICER": "#f59e0b" };
const SEGMENT_COLORS = { Agriculture: "#0d9488", "Waste Management": "#22c55e" };
const INDIV_FALLBACK_COLORS = ["#22c55e", "#f59e0b", "#3b82f6", "#8b5cf6", "#ef4444"];

// Treemap cells: darkest green for the biggest district, then greens -> ambers -> red
const TREEMAP_COLORS = ["#15803d", "#16a34a", "#22c55e", "#f59e0b", "#f97316", "#ef4444"];

// State-name matching between the GeoJSON (ST_NM) and the API labels.
// "NCT of Delhi" -> "delhi", "Jammu & Kashmir" -> "jammu and kashmir", ...
const normalizeStateName = (name) => {
  let n = String(name || "").toLowerCase().trim().replace(/\s+/g, " ");
  n = n.replace(/&/g, "and");
  n = n.replace(/^nct of /, "").replace(/^state of /, "");
  const aliases = { orissa: "odisha", uttaranchal: "uttarakhand" };
  return aliases[n] || n;
};

// Choropleth fill for a state by its share of total individuals
const stateFillFor = (percentage) => {
  const pct = Number(percentage) || 0;
  if (pct >= 50) return "#15803d";
  if (pct >= 10) return "#16a34a";
  if (pct >= 1) return "#22c55e";
  if (pct >= 0.1) return "#86efac";
  return "#bbf7d0";
};

// One colored cell of the "District Wise Distribution" treemap
function DistrictTreemapCell({ x, y, width, height, name, size, color, state }) {
  if (width <= 0 || height <= 0) return null;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={4}
        fill={color || "#22c55e"}
        stroke="#ffffff"
        strokeWidth={2}
      />
      {width > 52 && height > 30 && (
        <>
          <text x={x + 7} y={y + 16} fill="#ffffff" fontSize={11} fontWeight={700}>
            {name}
          </text>
          <text x={x + 7} y={y + 30} fill="#ffffff" fontSize={10} fontWeight={600}>
            {size}
          </text>
        </>
      )}
      {width > 52 && height > 46 && state && (
        <text x={x + 7} y={y + 43} fill="rgba(255,255,255,0.85)" fontSize={9}>
          {state}
        </text>
      )}
    </g>
  );
}

// Compact headline card: icon + label + big number (mock header row)
function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-[var(--theme-border)] p-4 bg-[var(--theme-card-bg)] flex items-center gap-3">
      <div className="h-11 w-11 rounded-xl grid place-items-center bg-[var(--theme-bg-light)] ring-1 ring-[var(--theme-border)] shrink-0">
        <Icon size={20} className="text-[var(--theme-primary)]" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-[var(--theme-text-secondary)]">{label}</p>
        <p className="text-2xl font-bold text-[var(--theme-text-primary)]">
          {Number(value || 0).toLocaleString("en-IN")}
        </p>
      </div>
    </div>
  );
}

// Small tile with a "count + label" list (By Product Interest, By Crop Type, ...)
function InsightTile({ title, icon: Icon, items = [] }) {
  const list = Array.isArray(items) ? items : [];
  return (
    <div className="rounded-xl border border-[var(--theme-border)] p-4 bg-[var(--theme-card-bg)]">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider">
          {title}
        </p>
        {Icon && <Icon size={14} className="text-[var(--theme-primary)] shrink-0" />}
      </div>
      <div className="mt-2 space-y-1">
        {list.length === 0 ? (
          <p className="text-sm text-gray-400">No data available</p>
        ) : (
          list.map((it, i) => (
            <div key={`${it.label}-${i}`} className="flex items-center justify-between gap-2 text-sm">
              <span className="text-[var(--theme-text-primary)] truncate">{titleCase(it.label)}</span>
              <span className="font-bold text-[var(--theme-primary)] shrink-0">{it.count}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Tile with "37.5% Partially (3)" style rows (Scheme Understanding, Tools, ...)
function PercentListTile({ title, icon: Icon, items = [] }) {
  const list = Array.isArray(items) ? items : [];
  return (
    <div className="rounded-xl border border-[var(--theme-border)] p-4 bg-[var(--theme-card-bg)]">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider">
          {title}
        </p>
        {Icon && <Icon size={14} className="text-[var(--theme-primary)] shrink-0" />}
      </div>
      <div className="mt-2 space-y-1">
        {list.length === 0 ? (
          <p className="text-sm text-gray-400">No data available</p>
        ) : (
          list.map((it, i) => (
            <p key={`${it.label}-${i}`} className="text-sm text-[var(--theme-text-primary)]">
              <span className="font-bold text-[var(--theme-primary)]">{it.percentage}%</span>{" "}
              {it.label} <span className="text-[var(--theme-text-secondary)]">({it.count})</span>
            </p>
          ))
        )}
      </div>
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
    individualGrphicalData = null,
    individualGrphicalLoading = false,
    individualGrphicalError = null,
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
  // State hovered on the India map (Geographic Distribution card)
  const [mapHover, setMapHover] = useState(null);

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

  // =====================================================================
  // Individual graphical analytics: "Agricultural Analytics & Farmer Profiles"
  // Data comes from fetchIndividualGrphicalAnalytics
  // (GET dashboard/getIndividualGrphicalAnalytics) whose response is
  // { summary, charts, farmerAnalytics, governmentOfficerAnalytics }
  // =====================================================================
  const indiv = individualGrphicalData;
  const indivSummary = indiv?.summary || null;
  const indivFarmer = indiv?.farmerAnalytics || null;
  const indivGovt = indiv?.governmentOfficerAnalytics || null;

  const hasIndividualAnalytics =
    !!indivSummary ||
    (Array.isArray(indiv?.charts?.bySegment) && indiv.charts.bySegment.length > 0);

  // Donut: individuals split by profile type (FARMER / GOVERNMENT OFFICER)
  const indivProfileTypePie = useMemo(
    () =>
      (indiv?.charts?.byProfileType || []).map((t) => ({
        name: t.label,
        value: t.count,
        percentage: t.percentage,
      })),
    [indiv],
  );

  // Donut: individuals split by segment (Agriculture / Waste Management)
  const indivSegmentPie = useMemo(
    () =>
      (indiv?.charts?.bySegment || []).map((s) => ({
        name: s.label,
        value: s.count,
        percentage: s.percentage,
      })),
    [indiv],
  );

  // Stacked bars: profile types inside every segment
  const indivProfileTypeKeys = useMemo(() => {
    const keys = [];
    (indiv?.charts?.segmentProfileTypes || []).forEach((s) =>
      (s.types || []).forEach((t) => {
        if (!keys.includes(t.type)) keys.push(t.type);
      }),
    );
    return keys;
  }, [indiv]);

  const indivSegmentTypeBars = useMemo(
    () =>
      (indiv?.charts?.segmentProfileTypes || []).map((s) => {
        const row = { segment: s.segment, total: s.total };
        (s.types || []).forEach((t) => {
          row[t.type] = t.count;
        });
        return row;
      }),
    [indiv],
  );

  const indivStates = useMemo(() => indiv?.charts?.byState || [], [indiv]);

  // Treemap cells, biggest district first (gets the darkest color)
  const indivDistrictCells = useMemo(
    () =>
      [...(indiv?.charts?.byDistrict || [])]
        .sort((a, b) => (b.count || 0) - (a.count || 0))
        .map((d, i) => ({
          name: d.label,
          size: d.count,
          state: d.state,
          color: TREEMAP_COLORS[i % TREEMAP_COLORS.length],
        })),
    [indiv],
  );

  const indivMonthlyTrend = useMemo(
    () =>
      (indiv?.charts?.monthlyTrend || []).map((m) => ({
        month: m.month,
        label: formatMonthLabel(m.month),
        count: m.count,
      })),
    [indiv],
  );

  const indivLeadSources = useMemo(() => indiv?.charts?.leadSources || [], [indiv]);

  // Max for the "Tentative Buying Month" progress bars
  const tentativeMonthMax = Math.max(
    1,
    ...(indivFarmer?.tentativeBuyingMonth || []).map((m) => Number(m.count) || 0),
  );

  // ---- India map (Geographic Distribution) ----
  // API state label -> state data, keyed by the normalized state name so it
  // matches the GeoJSON's ST_NM values
  const stateDataByName = useMemo(() => {
    const map = {};
    indivStates.forEach((s) => {
      map[normalizeStateName(s.label)] = s;
    });
    return map;
  }, [indivStates]);

  // Centroid of each state's largest polygon - used to place the count labels
  const stateCentroids = useMemo(() => {
    const largest = {};
    (indiaStatesGeo.features || []).forEach((f) => {
      const key = normalizeStateName(f?.properties?.ST_NM);
      if (!key || !f?.geometry) return;
      const area = geoArea(f);
      if (!largest[key] || area > largest[key].area) {
        largest[key] = { area, centroid: geoCentroid(f) };
      }
    });
    const out = {};
    Object.entries(largest).forEach(([key, value]) => {
      out[key] = value.centroid;
    });
    return out;
  }, []);


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

      {/* ✅ Agricultural Analytics & Farmer Profiles
          (rendered from fetchIndividualGrphicalAnalytics response - Enviro Solution only) */}
      {isEnviroSolution &&
        (individualGrphicalLoading || individualGrphicalData || individualGrphicalError) && (
        <div className="mt-6">
          <div className="mb-3">
            <h2 className="text-lg md:text-xl font-bold text-[var(--theme-text-primary)]">
              Agricultural Analytics &amp; Farmer Profiles
            </h2>
            <p className="text-xs text-[var(--theme-text-secondary)] mt-0.5 font-medium">
              Individuals summary, segment &amp; geographic breakdown, farmer &amp; government officer insights
            </p>
          </div>

          {individualGrphicalLoading && !hasIndividualAnalytics ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] p-6 animate-pulse"
                >
                  <div className="h-4 w-40 bg-gray-200 rounded mb-4" />
                  <div className="h-32 w-full bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          ) : !hasIndividualAnalytics ? (
            <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card-bg)] p-8 text-center">
              <p className="text-sm font-medium text-[var(--theme-text-primary)]">
                {individualGrphicalError
                  ? individualGrphicalError
                  : "No individual analytics data available"}
              </p>
              <p className="text-xs text-[var(--theme-text-secondary)] mt-1">
                Try changing the filters to load agricultural &amp; farmer profile analytics.
              </p>
            </div>
          ) : (
            <>
              {/* Headline numbers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                  icon={LucideIcons.Users}
                  label="Total Individuals"
                  value={indivSummary?.totalIndividuals}
                />
                <StatCard
                  icon={LucideIcons.Wheat}
                  label="Total Farmers"
                  value={indivSummary?.totalFarmers}
                />
                <StatCard
                  icon={LucideIcons.ShieldCheck}
                  label="Gov. Officers"
                  value={indivSummary?.totalGovernmentOfficers}
                />
              </div>

              {/* Donuts + segment breakdown + geographic distribution */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
                {/* 1. Total by Profile Type */}
                <ChartCard title="Total by Profile Type">
                  {indivProfileTypePie.length > 0 ? (
                    <div className="flex flex-col items-center gap-3">
                      <ResponsiveContainer width="100%" height={170}>
                        <PieChart>
                          <Pie
                            data={indivProfileTypePie}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={44}
                            outerRadius={72}
                            paddingAngle={2}
                          >
                            {indivProfileTypePie.map((p, i) => (
                              <Cell
                                key={i}
                                fill={
                                  PROFILE_TYPE_COLORS[p.name] ||
                                  INDIV_FALLBACK_COLORS[i % INDIV_FALLBACK_COLORS.length]
                                }
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              borderRadius: 12,
                              border: "1px solid var(--theme-bg-sidebar)",
                              background: "#ffffff",
                            }}
                            formatter={(v, name) => [`${v} individuals`, name]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="flex flex-col gap-1.5 w-full">
                        {indivProfileTypePie.map((p, i) => (
                          <span
                            key={p.name}
                            className="flex items-center gap-2 text-xs text-[var(--theme-text-primary)]"
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{
                                backgroundColor:
                                  PROFILE_TYPE_COLORS[p.name] ||
                                  INDIV_FALLBACK_COLORS[i % INDIV_FALLBACK_COLORS.length],
                              }}
                            />
                            <span className="font-semibold">{p.percentage}%</span>{" "}
                            {profileTypeLegendLabel(p.name)}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[180px] text-sm text-gray-400">
                      No profile type data available
                    </div>
                  )}
                </ChartCard>

                {/* 2. By Segment */}
                <ChartCard title="By Segment">
                  {indivSegmentPie.length > 0 ? (
                    <div className="flex flex-col items-center gap-3">
                      <ResponsiveContainer width="100%" height={170}>
                        <PieChart>
                          <Pie
                            data={indivSegmentPie}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={44}
                            outerRadius={72}
                            paddingAngle={2}
                          >
                            {indivSegmentPie.map((s, i) => (
                              <Cell
                                key={i}
                                fill={
                                  SEGMENT_COLORS[s.name] ||
                                  INDIV_FALLBACK_COLORS[i % INDIV_FALLBACK_COLORS.length]
                                }
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              borderRadius: 12,
                              border: "1px solid var(--theme-bg-sidebar)",
                              background: "#ffffff",
                            }}
                            formatter={(v, name) => [`${v} individuals`, name]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="flex flex-col gap-1.5 w-full">
                        {indivSegmentPie.map((s, i) => (
                          <span
                            key={s.name}
                            className="flex items-center gap-2 text-xs text-[var(--theme-text-primary)]"
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{
                                backgroundColor:
                                  SEGMENT_COLORS[s.name] ||
                                  INDIV_FALLBACK_COLORS[i % INDIV_FALLBACK_COLORS.length],
                              }}
                            />
                            <span className="font-semibold">{s.percentage}%</span> {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[180px] text-sm text-gray-400">
                      No segment data available
                    </div>
                  )}
                </ChartCard>

                {/* 3. Segment Profile Types Breakdown */}
                <ChartCard title="Segment Profile Types Breakdown">
                  {indivSegmentTypeBars.length > 0 ? (
                    <ResponsiveContainer width="100%" height={230}>
                      <BarChart
                        data={indivSegmentTypeBars}
                        margin={{ top: 15, right: 8, left: -18, bottom: 0 }}
                      >
                        <CartesianGrid vertical={false} stroke="var(--theme-bg-sidebar)" />
                        <XAxis
                          dataKey="segment"
                          stroke="#6b7280"
                          fontSize={10}
                          interval={0}
                          tickLine={false}
                        />
                        <YAxis stroke="#6b7280" fontSize={10} allowDecimals={false} />
                        <Tooltip
                          cursor={{ fill: "rgba(0,0,0,0.04)" }}
                          formatter={(v, name) => [v, titleCase(name)]}
                        />
                        <Legend wrapperStyle={{ fontSize: 10 }} />
                        {indivProfileTypeKeys.map((k, i) => (
                          <Bar
                            key={k}
                            dataKey={k}
                            stackId="segment"
                            fill={
                              PROFILE_TYPE_COLORS[k] ||
                              INDIV_FALLBACK_COLORS[i % INDIV_FALLBACK_COLORS.length]
                            }
                          />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[180px] text-sm text-gray-400">
                      No segment data available
                    </div>
                  )}
                </ChartCard>

                {/* 4. Geographic Distribution (India choropleth map) */}
                <ChartCard title="Geographic Distribution">
                  {indivStates.length > 0 ? (
                    <div>
                      <div className="relative">
                        {/* Legend overlay (like the mock: state + count) */}
                        <div className="absolute top-1 left-1 z-10 space-y-1">
                          {indivStates.slice(0, 4).map((s) => (
                            <div
                              key={s.label}
                              className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--theme-text-primary)] bg-white/90 rounded px-1.5 py-0.5 border border-[var(--theme-border)]"
                            >
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: stateFillFor(s.percentage) }}
                              />
                              <span className="truncate max-w-[120px]">{s.label}</span>
                              <span className="font-bold">{s.count}</span>
                            </div>
                          ))}
                        </div>

                        <ComposableMap
                          projection="geoMercator"
                          projectionConfig={{ center: [82, 23], scale: 900 }}
                          style={{ width: "100%", height: "auto" }}
                        >
                          <Geographies geography={indiaStatesGeo}>
                            {({ geographies }) =>
                              geographies.map((geo) => {
                                const stateName = normalizeStateName(geo.properties?.ST_NM);
                                const stateData = stateDataByName[stateName];
                                return (
                                  <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    fill={
                                      stateData
                                        ? stateFillFor(stateData.percentage)
                                        : "#e5e7eb"
                                    }
                                    stroke="#ffffff"
                                    strokeWidth={0.7}
                                    fillOpacity={
                                      mapHover && mapHover.key !== geo.rsmKey ? 0.7 : 1
                                    }
                                    onMouseEnter={() =>
                                      setMapHover({
                                        key: geo.rsmKey,
                                        name: geo.properties?.ST_NM,
                                        count: stateData?.count || 0,
                                        percentage: stateData?.percentage || 0,
                                      })
                                    }
                                    onMouseLeave={() => setMapHover(null)}
                                    style={{
                                      cursor: "pointer",
                                      transition: "fill-opacity 150ms",
                                    }}
                                  />
                                );
                              })
                            }
                          </Geographies>

                          {/* Count labels on the states that have data */}
                          {indivStates
                            .map((s) => ({
                              s,
                              coordinates: stateCentroids[normalizeStateName(s.label)],
                            }))
                            .filter((x) => x.coordinates)
                            .slice(0, 10)
                            .map(({ s, coordinates }) => (
                              <Marker key={s.label} coordinates={coordinates}>
                                <text
                                  textAnchor="middle"
                                  dominantBaseline="central"
                                  fontSize={11}
                                  fontWeight={700}
                                  fill={
                                    (Number(s.percentage) || 0) >= 1 ? "#ffffff" : "#14532d"
                                  }
                                  style={{ pointerEvents: "none" }}
                                >
                                  {s.count}
                                </text>
                              </Marker>
                            ))}
                        </ComposableMap>
                      </div>

                      {/* Hovered state details */}
                      <p className="text-xs text-[var(--theme-text-secondary)] mt-2 text-center font-medium">
                        {mapHover
                          ? `${mapHover.name}: ${Number(
                              mapHover.count || 0,
                            ).toLocaleString("en-IN")} individuals (${mapHover.percentage}%)`
                          : "Hover over a state to see its individual count"}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[180px] text-sm text-gray-400">
                      No state data available
                    </div>
                  )}
                </ChartCard>
              </div>

              {/* District treemap + monthly trend + lead sources */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
                {/* 5. District Wise Distribution */}
                <ChartCard title="District Wise Distribution">
                  {indivDistrictCells.length > 0 ? (
                    <ResponsiveContainer width="100%" height={230}>
                      <Treemap
                        data={indivDistrictCells}
                        dataKey="size"
                        stroke="#ffffff"
                        content={<DistrictTreemapCell />}
                      >
                        <Tooltip
                          formatter={(v, _n, entry) => [
                            `${v} individuals`,
                            `${entry?.payload?.name || ""}${
                              entry?.payload?.state ? ` (${entry.payload.state})` : ""
                            }`,
                          ]}
                        />
                      </Treemap>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[180px] text-sm text-gray-400">
                      No district data available
                    </div>
                  )}
                </ChartCard>

                {/* 6. Monthly Lead Trend */}
                <ChartCard title="Monthly Lead Trend">
                  {indivMonthlyTrend.length > 0 ? (
                    <ResponsiveContainer width="100%" height={230}>
                      <LineChart
                        data={indivMonthlyTrend}
                        margin={{ top: 18, right: 12, left: -18, bottom: 0 }}
                      >
                        <CartesianGrid vertical={false} stroke="var(--theme-bg-sidebar)" />
                        <XAxis dataKey="label" stroke="#6b7280" fontSize={10} tickLine={false} />
                        <YAxis stroke="#6b7280" fontSize={10} allowDecimals={false} />
                        <Tooltip
                          cursor={{ stroke: "#cbd5e1" }}
                          formatter={(v) => [v, "Individuals"]}
                        />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ r: 3, fill: "#3b82f6" }}
                          activeDot={{ r: 5 }}
                          label={{ position: "top", fontSize: 10, fontWeight: 600, fill: "#374151" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[180px] text-sm text-gray-400">
                      No monthly trend data available
                    </div>
                  )}
                </ChartCard>

                {/* 7. Lead Sources */}
                <ChartCard title="Lead Sources">
                  {indivLeadSources.length > 0 ? (
                    <ResponsiveContainer width="100%" height={230}>
                      <BarChart
                        data={indivLeadSources}
                        layout="vertical"
                        margin={{ top: 5, right: 36, left: 4, bottom: 0 }}
                      >
                        <CartesianGrid horizontal={false} stroke="var(--theme-bg-sidebar)" />
                        <XAxis type="number" stroke="#6b7280" fontSize={10} allowDecimals={false} />
                        <YAxis
                          type="category"
                          dataKey="label"
                          stroke="#6b7280"
                          fontSize={10}
                          width={82}
                        />
                        <Tooltip
                          cursor={{ fill: "rgba(0,0,0,0.04)" }}
                          formatter={(v) => [v, "Individuals"]}
                        />
                        <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={18}>
                          <LabelList
                            dataKey="count"
                            position="right"
                            fontSize={10}
                            fontWeight={600}
                            fill="#374151"
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[180px] text-sm text-gray-400">
                      No lead source data available
                    </div>
                  )}
                </ChartCard>
              </div>

              {/* Farmer Profile Analytics */}
              <ChartCard
                title="Farmer Profile Analytics"
                subtitle="Product interest, crops, payment modes & loan exposure"
                className="mt-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {/* Farmer Demographics */}
                  <div className="rounded-xl border border-[var(--theme-border)] p-4 bg-[var(--theme-card-bg)]">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider">
                        Farmer Demographics
                      </p>
                      <LucideIcons.Users
                        size={14}
                        className="text-[var(--theme-primary)] shrink-0"
                      />
                    </div>
                    <p className="text-xs text-[var(--theme-text-secondary)] mt-2">Total Farmers</p>
                    <p className="text-2xl font-bold text-[var(--theme-text-primary)]">
                      {Number(indivFarmer?.totalFarmers || 0).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <InsightTile title="By Product Interest" icon={LucideIcons.Wheat} items={indivFarmer?.byProduct} />
                  <InsightTile title="By Crop Type" icon={LucideIcons.Sprout} items={indivFarmer?.byCropType} />
                  <InsightTile title="By Payment Mode" icon={LucideIcons.CreditCard} items={indivFarmer?.byPaymentMode} />

                  {/* Tentative Buying Month */}
                  <div className="rounded-xl border border-[var(--theme-border)] p-4 bg-[var(--theme-card-bg)]">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider">
                        Tentative Buying Month
                      </p>
                      <LucideIcons.CalendarDays
                        size={14}
                        className="text-[var(--theme-primary)] shrink-0"
                      />
                    </div>
                    <div className="mt-2 space-y-2">
                      {(indivFarmer?.tentativeBuyingMonth || []).length === 0 ? (
                        <p className="text-sm text-gray-400">No data available</p>
                      ) : (
                        indivFarmer.tentativeBuyingMonth.map((m) => (
                          <div key={m.month} className="flex items-center gap-2 text-sm">
                            <span className="font-bold text-[var(--theme-primary)] w-6 shrink-0">
                              {m.count}
                            </span>
                            <span className="text-[var(--theme-text-primary)] w-24 shrink-0">
                              {formatMonthLabel(m.month)}
                            </span>
                            <div className="h-2 flex-1 rounded-full bg-[var(--theme-bg-light)] overflow-hidden">
                              <div
                                className="h-full rounded-full bg-[var(--theme-primary)]"
                                style={{
                                  width: `${((Number(m.count) || 0) / tentativeMonthMax) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Existing Loans */}
                  <div className="rounded-xl border border-[var(--theme-border)] p-4 bg-[var(--theme-card-bg)]">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider">
                        Existing Loans
                      </p>
                      <LucideIcons.Wallet
                        size={14}
                        className="text-[var(--theme-primary)] shrink-0"
                      />
                    </div>
                    <p className="text-xs text-[var(--theme-text-secondary)] mt-2">
                      Total Farmers with Loan
                    </p>
                    <p className="text-2xl font-bold text-[var(--theme-text-primary)]">
                      {Number(indivFarmer?.existingLoan?.farmersWithLoan || 0)}
                    </p>
                    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[var(--theme-border)]">
                      {[
                        { label: "Total", value: indivFarmer?.existingLoan?.totalExistingLoan },
                        { label: "Avg", value: indivFarmer?.existingLoan?.averageExistingLoan },
                        { label: "Max", value: indivFarmer?.existingLoan?.maxExistingLoan },
                      ].map((col) => (
                        <div key={col.label} className="text-center">
                          <p className="text-[10px] font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider">
                            {col.label}
                          </p>
                          <p className="text-sm font-bold text-[var(--theme-text-primary)]">
                            {formatLoanAmount(col.value)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ChartCard>

              {/* Govt. Officer Analytics */}
              <ChartCard
                title="Govt. Officer Analytics"
                subtitle="Services requested, scheme understanding & digital readiness"
                className="mt-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {/* Total Officers */}
                  <div className="rounded-xl border border-[var(--theme-border)] p-4 bg-[var(--theme-card-bg)]">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider">
                        Total Officers
                      </p>
                      <LucideIcons.Building2
                        size={14}
                        className="text-[var(--theme-primary)] shrink-0"
                      />
                    </div>
                    <p className="text-2xl font-bold text-[var(--theme-text-primary)] mt-2">
                      {Number(indivGovt?.totalOfficers || 0)}
                    </p>
                  </div>

                  {/* Frequently Requested Services */}
                  <div className="rounded-xl border border-[var(--theme-border)] p-4 bg-[var(--theme-card-bg)]">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider">
                        Frequently Requested Services
                      </p>
                      <LucideIcons.ClipboardList
                        size={14}
                        className="text-[var(--theme-primary)] shrink-0"
                      />
                    </div>
                 <ol className="mt-2 space-y-1.5">
  {(indivGovt?.frequentlyRequestedServices || []).length === 0 ? (
    <li className="text-sm text-gray-400 list-none">
      No data available
    </li>
  ) : (
    indivGovt.frequentlyRequestedServices.map((s, i) => (
      <li
        key={s.label}
        className="flex items-center justify-between gap-2 text-xs"
      >
        {/* Service Name */}
        <span className="text-[var(--theme-text-primary)] truncate flex-1">
          <span className="font-semibold text-[var(--theme-text-secondary)] mr-1">
            {i + 1}.
          </span>
          {s.label}
        </span>

        {/* Count + Percentage */}
        <span className="flex items-center gap-3 whitespace-nowrap">
          <span className="font-semibold text-[var(--theme-text-primary)]">
            Count: {s.count}
          </span>

          <span className="font-semibold text-[var(--theme-text-primary)] min-w-[45px] text-right">
            {s.percentage}%
          </span>
        </span>
      </li>
    ))
  )}
</ol>
                  </div>

                  <PercentListTile
                    title="Scheme Understanding"
                    icon={LucideIcons.Lightbulb}
                    items={indivGovt?.schemeUnderstanding}
                  />
                  <PercentListTile
                    title="Digitally Maintained"
                    icon={LucideIcons.Database}
                    items={indivGovt?.dataMaintainedDigitally}
                  />
                  <PercentListTile
                    title="Management Tools"
                    icon={LucideIcons.Table2}
                    items={indivGovt?.dataManagementTools}
                  />

                  {/* Effective Language */}
                  <div className="rounded-xl border border-[var(--theme-border)] p-4 bg-[var(--theme-card-bg)]">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider">
                        Effective Language
                      </p>
                      <LucideIcons.Languages
                        size={14}
                        className="text-[var(--theme-primary)] shrink-0"
                      />
                    </div>
                    <div className="mt-2 space-y-1">
                      {(indivGovt?.effectiveLanguage || []).length === 0 ? (
                        <p className="text-sm text-gray-400">No data available</p>
                      ) : (
                        indivGovt.effectiveLanguage.map((l, i) => (
                          <p key={`${l.label}-${i}`} className="text-sm text-[var(--theme-text-primary)]">
                            <span className="font-bold">{titleCase(l.label)}</span>{" "}
                            <span className="text-[var(--theme-text-secondary)]">({l.count})</span>
                          </p>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </ChartCard>
            </>
          )}
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
