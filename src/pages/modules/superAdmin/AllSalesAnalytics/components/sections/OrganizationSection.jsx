// components/sections/OrganizationSection.jsx

import React, { useMemo, useState } from "react";
import * as LucideIcons from "lucide-react";
import { TiEye, TiTrash } from "react-icons/ti";
import { useTheme } from "../../../../../../hooks/theme/useTheme.js";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Scatter,
  ScatterChart,
  ZAxis,
  ReferenceLine,
} from "recharts";
import { ChartCard, KpiCard, EmptyState, AchievementBadge } from "../analytics";
import {
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Input,
} from "../common";
import {
  COLORS,
  D_SPECIALITIES,
  D_STATES,
  PENETRATION_FUNNEL,
} from "../../data/analyticsData";
import LoaderSpinner from "../../../../../../components/uiComponents/loader/LoaderSpinner.jsx";
import Pagination from "../../../../../../components/uiComponents/pagination/Pagination.jsx";
import { themes } from "../../../../../../components/theme/Themes.js";

function MiniStat({ label, value, icon, tone, subtitle }) {
  return (
    <div className="rounded-xl border border-[var(--theme-border)] p-4 bg-[var(--theme-card-bg)]">
      <div className="flex items-center gap-2">
        {icon && <span className="text-[var(--theme-primary)]">{icon}</span>}
        <p className="text-[10px] font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider">
          {label}
        </p>
      </div>
      <p
        className={`text-2xl font-bold mt-1 ${tone === "success" ? "text-green-600" : tone === "info" ? "text-blue-600" : "text-[var(--theme-text-primary)]"}`}
      >
        {value}
      </p>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  );
}

function ProductCard({ product, organizationName }) {
  const achievementColor =
    product.achievementPercentage >= 100
      ? "text-green-600"
      : product.achievementPercentage >= 75
        ? "text-yellow-600"
        : "text-red-600";

  return (
    <div className="bg-white rounded-lg border border-[var(--theme-border)] p-3 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-[var(--theme-text-primary)] truncate flex-1 mr-2">
          {product.productName}
        </p>
        <Badge
          className={`rounded-full ${achievementColor} bg-opacity-10 whitespace-nowrap`}
        >
          {product.achievementPercentage}%
        </Badge>
      </div>
      <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
        <span>🎯 Target: {product.monthlyTarget}</span>
        <span>✅ Achieved: {product.monthlyAchievement}</span>
      </div>
      <div className="mt-2 w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(product.achievementPercentage, 100)}%`,
            backgroundColor:
              product.achievementPercentage >= 100
                ? "#22c55e"
                : product.achievementPercentage >= 75
                  ? "#eab308"
                  : "#ef4444",
          }}
        />
      </div>
    </div>
  );
}

function Sel({ label, value, onChange, options }) {
  return (
    <div className="min-w-0">
      <label className="text-[11px] font-medium text-[var(--theme-accent)] uppercase tracking-wide">
        {label}
      </label>
      <Select value={value || undefined} onValueChange={onChange}>
        <SelectTrigger className="mt-1 rounded-xl bg-white">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function Gauge({ label, target, pct }) {
  const achieved = Math.round((target * pct) / 100);
  const remaining = Math.max(0, target - achieved);
  return (
    <div className="rounded-2xl border border-[var(--theme-bg-sidebar)] p-4 bg-[var(--theme-primary-bg)]">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-[var(--theme-accent)]">
          {label}
        </p>
        <span className="text-xs text-gray-500">{pct}%</span>
      </div>
      <div className="relative h-28">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="70%"
            outerRadius="100%"
            data={[{ v: pct, fill: "var(--theme-primary)" }]}
            startAngle={225}
            endAngle={-45}
          >
            <RadialBar
              background={{ fill: "var(--theme-bg-sidebar)" }}
              dataKey="v"
              cornerRadius={20}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <p className="text-2xl font-bold text-[var(--theme-primary)]">
            {pct}%
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1 mt-2 text-center text-[11px]">
        <div>
          <p className="text-gray-500">Target</p>
          <p className="font-semibold text-[var(--theme-accent)]">
            {target.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Achieved</p>
          <p className="font-semibold text-green-500">
            {achieved.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Remaining</p>
          <p className="font-semibold text-[var(--theme-accent)]">
            {remaining.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

function M({ label, value }) {
  return (
    <div className="rounded-xl border border-[var(--theme-bg-sidebar)] p-3 bg-[var(--theme-primary-bg)]">
      <p className="text-[11px] text-[var(--theme-accent)] uppercase tracking-wide">
        {label}
      </p>
      <p className="text-lg font-semibold mt-0.5">{value}</p>
    </div>
  );
}

export function OrganizationSection({
  orgs,
  filters,
  organizationDashboardData,
  organizationProductData,
  loading = false,
  tableLoading = false,
  productTableLoading = false,
  onProductPageChange,
  onProductItemsPerPageChange,
  // ✅ New props for organization list
  organizationListData,
  onOrganizationListPageChange,
  onOrganizationListItemsPerPageChange,
  onViewOrganization,
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [hSpec, setHSpec] = useState("");
  const [status, setStatus] = useState("");
  const [drill, setDrill] = useState(null);
  const [distMetric, setDistMetric] = useState("hospitals");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrg, setSelectedOrg] = useState(null);

  // ✅ Process organization dashboard data from API
  const dashboardStats = useMemo(() => {
    if (organizationDashboardData?.data) {
      const data = organizationDashboardData.data;
      return {
        totalOrganizations: data.totalOrganizations || 0,
        totalIndividuals: data.totalIndividuals || 0,
        govtHospitals: data.govtHospitals || 0,
        privateHospitals: data.privateHospitals || 0,
        totalBeds: data.totalBeds || 0,
        totalICUBeds: data.totalICUBeds || 0,
        totalOperationTheatres: data.totalOperationTheatres || 0,
        totalSpecialities: data.totalSpecialities || 0,
        totalSurgeries: data.totalSurgeries || 0,
      };
    }
    return {
      totalOrganizations: 0,
      totalIndividuals: 0,
      govtHospitals: 0,
      privateHospitals: 0,
      totalBeds: 0,
      totalICUBeds: 0,
      totalOperationTheatres: 0,
      totalSpecialities: 0,
      totalSurgeries: 0,
    };
  }, [organizationDashboardData]);

  // ✅ Process organization product data
  const orgProductList = useMemo(() => {
    if (
      organizationProductData?.data &&
      Array.isArray(organizationProductData.data)
    ) {
      return organizationProductData.data;
    }
    return [];
  }, [organizationProductData]);

  // ✅ Process organization list data - NEW
  const organizationList = useMemo(() => {
    if (
      organizationListData?.data &&
      Array.isArray(organizationListData.data)
    ) {
      return organizationListData.data;
    }
    return [];
  }, [organizationListData]);

  // ✅ Organization list pagination info
  const listPagination = useMemo(() => {
    if (organizationListData) {
      return {
        currentPage: organizationListData.currentPage || 1,
        pageSize: organizationListData.pageSize || 10,
        totalPages: organizationListData.totalPages || 1,
        totalRecords: organizationListData.totalRecords || 0,
      };
    }
    return {
      currentPage: 1,
      pageSize: 10,
      totalPages: 1,
      totalRecords: 0,
    };
  }, [organizationListData]);

  // ✅ Product pagination info
  const productPagination = useMemo(() => {
    if (organizationProductData) {
      return {
        currentPage: organizationProductData.currentPage || 1,
        pageSize: organizationProductData.pageSize || 10,
        totalPages: organizationProductData.totalPages || 1,
        totalRecords: organizationProductData.totalRecords || 0,
      };
    }
    return {
      currentPage: 1,
      pageSize: 10,
      totalPages: 1,
      totalRecords: 0,
    };
  }, [organizationProductData]);

  // ✅ Filter products by search term
  const filteredProductData = useMemo(() => {
    if (!searchTerm) return orgProductList;
    const term = searchTerm.toLowerCase();
    return orgProductList.filter(
      (item) =>
        item.organizationName?.toLowerCase().includes(term) ||
        item.products?.some((p) => p.productName?.toLowerCase().includes(term)),
    );
  }, [orgProductList, searchTerm]);

  // ✅ Product summary statistics
  const productStats = useMemo(() => {
    const totalOrgs = filteredProductData.length;
    const totalProducts = filteredProductData.reduce(
      (sum, org) => sum + (org.products?.length || 0),
      0,
    );
    const totalTarget = filteredProductData.reduce(
      (sum, org) => sum + (org.totalMonthlyTarget || 0),
      0,
    );
    const totalAchieved = filteredProductData.reduce(
      (sum, org) => sum + (org.totalMonthlyAchievement || 0),
      0,
    );
    const avgAchievement =
      totalTarget > 0 ? Math.round((totalAchieved / totalTarget) * 100) : 0;
    const highPerformers = filteredProductData.filter(
      (org) => org.achievementPercentage >= 100,
    ).length;

    return {
      totalOrgs,
      totalProducts,
      totalTarget,
      totalAchieved,
      avgAchievement,
      highPerformers,
    };
  }, [filteredProductData]);

  // ✅ Achievement distribution for chart
  const achievementDistribution = useMemo(() => {
    const buckets = {
      "Excellent (≥100%)": 0,
      "Good (75-99%)": 0,
      "Average (50-74%)": 0,
      "Needs Attention (<50%)": 0,
    };

    filteredProductData.forEach((org) => {
      const pct = org.achievementPercentage || 0;
      if (pct >= 100) buckets["Excellent (≥100%)"]++;
      else if (pct >= 75) buckets["Good (75-99%)"]++;
      else if (pct >= 50) buckets["Average (50-74%)"]++;
      else buckets["Needs Attention (<50%)"]++;
    });

    const colors = ["#22c55e", "#eab308", "#f97316", "#ef4444"];
    return Object.entries(buckets).map(([name, value], index) => ({
      name,
      value,
      fill: colors[index % colors.length],
    }));
  }, [filteredProductData]);

  // ✅ Derived metrics
  const derivedMetrics = useMemo(() => {
    const total = dashboardStats.totalOrganizations || 1;
    return {
      avgBedsPerHospital: Math.round(dashboardStats.totalBeds / total),
      avgICUPerHospital: Math.round(dashboardStats.totalICUBeds / total),
      avgOTPerHospital: Math.round(
        dashboardStats.totalOperationTheatres / total,
      ),
      govtPercentage:
        dashboardStats.govtHospitals > 0
          ? Math.round((dashboardStats.govtHospitals / total) * 100)
          : 0,
      privatePercentage:
        dashboardStats.privateHospitals > 0
          ? Math.round((dashboardStats.privateHospitals / total) * 100)
          : 0,
      surgeriesPerHospital: Math.round(dashboardStats.totalSurgeries / total),
    };
  }, [dashboardStats]);

  // ✅ Hospital type data
  const hospitalTypeData = useMemo(() => {
    return [
      {
        name: "Government",
        value: dashboardStats.govtHospitals,
        fill: "#3b82f6",
      },
      {
        name: "Private",
        value: dashboardStats.privateHospitals,
        fill: "#22c55e",
      },
    ].filter((d) => d.value > 0);
  }, [dashboardStats]);

  // ✅ Infrastructure metrics
  const infrastructureMetrics = useMemo(() => {
    return [
      {
        label: "Total Beds",
        value: dashboardStats.totalBeds.toLocaleString(),
        icon: <LucideIcons.Bed size={18} />,
        subtitle: `${derivedMetrics.avgBedsPerHospital} avg per hospital`,
      },
      {
        label: "ICU Beds",
        value: dashboardStats.totalICUBeds.toLocaleString(),
        icon: <LucideIcons.HeartPulse size={18} />,
        subtitle: `${derivedMetrics.avgICUPerHospital} avg per hospital`,
      },
      {
        label: "Operation Theatres",
        value: dashboardStats.totalOperationTheatres.toLocaleString(),
        icon: <LucideIcons.Scissors size={18} />,
        subtitle: `${derivedMetrics.avgOTPerHospital} avg per hospital`,
      },
      {
        label: "Total Surgeries",
        value: dashboardStats.totalSurgeries.toLocaleString(),
        icon: <LucideIcons.Activity size={18} />,
        subtitle: `${derivedMetrics.surgeriesPerHospital} per hospital`,
      },
    ];
  }, [dashboardStats, derivedMetrics]);

  // ✅ Filtered orgs
  const filtered = useMemo(() => orgs || [], [orgs]);

  const resetFilters = () => {
    setState("");
    setDistrict("");
    setCity("");
    setType("");
    setHSpec("");
    setStatus("");
  };

  // ✅ District data
  const districtData = useMemo(() => {
    const districts = [
      "Mumbai",
      "Pune",
      "Nagpur",
      "Nashik",
      "Thane",
      "Aurangabad",
      "Solapur",
      "Amravati",
    ];
    return districts
      .map((d) => {
        const arr = filtered.filter((o) => o.district === d);
        return {
          district: d,
          hospitals: arr.length,
          beds: arr.reduce((s, o) => s + (o.beds || 0), 0),
          surgeries: arr.reduce(
            (s, o) => s + (o.totalSurgeriesCalendarYear || 0),
            0,
          ),
          achievement: arr.length
            ? Math.round(
                arr.reduce((s, o) => s + (o.productAchievement || 0), 0) /
                  arr.length,
              )
            : 0,
        };
      })
      .filter((d) => d.hospitals > 0);
  }, [filtered]);

  // ✅ Scatter data
  const scatterData = useMemo(() => {
    return filtered.map((o) => ({
      name: o.organizationName,
      beds: o.beds || 0,
      surgeries: o.totalSurgeriesCalendarYear || 0,
      id: o.id,
    }));
  }, [filtered]);

  // ✅ Revenue data
  const revenue = useMemo(() => {
    return [...filtered]
      .map((o) => {
        const est = (o.quantity || 0) * (o.price || 0);
        const score = Math.round(
          (o.beds || 0) * 0.2 +
            (o.totalSurgeriesCalendarYear || 0) * 0.5 +
            (o.productAchievement || 0) * 0.3,
        );
        return { ...o, estimatedRevenue: est, opportunityScore: score };
      })
      .sort((a, b) => b.opportunityScore - a.opportunityScore)
      .slice(0, 15);
  }, [filtered]);

  // Product pagination handlers
  const handleProductPageChange = (page) => {
    if (onProductPageChange) {
      onProductPageChange(page);
    }
  };

  const handleProductItemsPerPageChange = (pageSize) => {
    if (onProductItemsPerPageChange) {
      onProductItemsPerPageChange(pageSize);
    }
  };

  // ✅ Organization list pagination handlers
  const handleListPageChange = (page) => {
    if (onOrganizationListPageChange) {
      onOrganizationListPageChange(page);
    }
  };

  const handleListItemsPerPageChange = (pageSize) => {
    if (onOrganizationListItemsPerPageChange) {
      onOrganizationListItemsPerPageChange(pageSize);
    }
  };

  // ✅ Handler for viewing organization details
  const handleViewOrganization = (orgId, type) => {
    if (onViewOrganization) {
      onViewOrganization(orgId, type);
    }
  };

  // ✅ Helper to render specialities
  const renderSpecialities = (specialities) => {
    if (!specialities || specialities.length === 0) return "N/A";
    const valid = specialities.filter((s) => s && s.trim() !== "");
    if (valid.length === 0) return "N/A";
    return valid.join(", ");
  };

  // ✅ Helper to render surgery types
  const renderSurgeries = (surgeries) => {
    if (!surgeries || surgeries.length === 0) return "N/A";
    const valid = surgeries.filter(
      (s) => s.surgeryType && s.surgeryType.trim() !== "" && s.count > 0,
    );
    if (valid.length === 0) return "N/A";
    return valid.map((s) => `${s.surgeryType}: ${s.count}`).join(", ");
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <LoaderSpinner />
          <p className="mt-4 text-[var(--theme-text-secondary)] font-medium">
            Loading organization data...
          </p>
        </div>
      </div>
    );
  }

  // No data state
  if (
    !organizationDashboardData &&
    filtered.length === 0 &&
    orgProductList.length === 0 &&
    organizationList.length === 0
  ) {
    return (
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--theme-accent)] mb-2">
          Organization Analytics
        </h2>
        <div className="flex items-center justify-center h-64 text-gray-400">
          No organization data available
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-[var(--theme-accent)] mb-2">
        Organization Analytics
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Hospital infrastructure, capacity, surgery analytics & product
        performance
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
        {filters.city && (
          <span className="ml-2 font-medium text-[var(--theme-primary)]">
            | {filters.city}
          </span>
        )}
      </p>

      {/* Custom Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-[var(--theme-border)] mb-6 overflow-x-auto bg-white/60 backdrop-blur-sm rounded-t-xl px-2 py-1">
        <button
          onClick={() => setActiveTab("overview")}
          className={`
            flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap
            rounded-lg
            ${
              activeTab === "overview"
                ? "bg-[var(--theme-primary)] text-white shadow-md shadow-[var(--theme-primary)]/20"
                : "text-[var(--theme-text-muted)] hover:bg-[var(--theme-bg-hover)] hover:text-[var(--theme-primary)]"
            }
          `}
        >
          <LucideIcons.LayoutDashboard size={18} />
          Overview
          {activeTab === "overview" && (
            <span className="ml-1 px-2 py-0.5 text-xs bg-white/20 text-white rounded-full">
              Active
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("hospitals")}
          className={`
            flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap
            rounded-lg
            ${
              activeTab === "hospitals"
                ? "bg-[var(--theme-primary)] text-white shadow-md shadow-[var(--theme-primary)]/20"
                : "text-[var(--theme-text-muted)] hover:bg-[var(--theme-bg-hover)] hover:text-[var(--theme-primary)]"
            }
          `}
        >
          <LucideIcons.Building2 size={18} />
          Hospitals
          {activeTab === "hospitals" && (
            <span className="ml-1 px-2 py-0.5 text-xs bg-white/20 text-white rounded-full">
              Active
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`
            flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap
            rounded-lg
            ${
              activeTab === "products"
                ? "bg-[var(--theme-primary)] text-white shadow-md shadow-[var(--theme-primary)]/20"
                : "text-[var(--theme-text-muted)] hover:bg-[var(--theme-bg-hover)] hover:text-[var(--theme-primary)]"
            }
          `}
        >
          <LucideIcons.Package size={18} />
          Products
          {activeTab === "products" && (
            <span className="ml-1 px-2 py-0.5 text-xs bg-white/20 text-white rounded-full">
              Active
            </span>
          )}
        </button>
      </div>

      {/* Overview Tab Content */}
      {activeTab === "overview" && (
        <div className="mt-4">
          {/* Main KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <KpiCard
              title="Total Organizations"
              value={dashboardStats.totalOrganizations.toLocaleString()}
              trend={8}
              accent="info"
              icon={LucideIcons.Building2}
            />
            <KpiCard
              title="Total Individuals"
              value={dashboardStats.totalIndividuals.toLocaleString()}
              trend={12}
              accent="success"
              icon={LucideIcons.Users}
            />
            <KpiCard
              title="Total Specialities"
              value={dashboardStats.totalSpecialities.toLocaleString()}
              trend={6}
              accent="product"
              icon={LucideIcons.Stethoscope}
            />
            <KpiCard
              title="Total Surgeries"
              value={dashboardStats.totalSurgeries.toLocaleString()}
              trend={9}
              accent="target"
              icon={LucideIcons.Activity}
            />
          </div>

          {/* Hospital Type Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
            <ChartCard
              title="Hospital Type Distribution"
              subtitle="Government vs Private hospitals"
              className="lg:col-span-1"
            >
              {hospitalTypeData.length === 0 ? (
                <EmptyState />
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={hospitalTypeData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={95}
                      paddingAngle={3}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={{
                        stroke: "var(--theme-bg-sidebar)",
                        strokeWidth: 1,
                      }}
                    >
                      {hospitalTypeData.map((item, i) => (
                        <Cell key={i} fill={item.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid var(--theme-bg-sidebar)",
                        background: "#ffffff",
                      }}
                      formatter={(value, name) => [`${value} hospitals`, name]}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-100">
                  <p className="text-xs text-blue-600 font-medium">
                    🏛️ Government
                  </p>
                  <p className="text-xl font-bold text-blue-700">
                    {dashboardStats.govtHospitals}
                  </p>
                  <p className="text-xs text-blue-500">
                    {derivedMetrics.govtPercentage}%
                  </p>
                </div>
                <div className="bg-green-50 rounded-xl p-3 text-center border border-green-100">
                  <p className="text-xs text-green-600 font-medium">
                    🏥 Private
                  </p>
                  <p className="text-xl font-bold text-green-700">
                    {dashboardStats.privateHospitals}
                  </p>
                  <p className="text-xs text-green-500">
                    {derivedMetrics.privatePercentage}%
                  </p>
                </div>
              </div>
            </ChartCard>

            {/* Infrastructure Summary */}
            <ChartCard
              title="Infrastructure Summary"
              subtitle="Capacity overview"
              className="lg:col-span-2"
            >
              <div className="grid grid-cols-2 gap-3">
                {infrastructureMetrics.map((metric, index) => (
                  <MiniStat
                    key={index}
                    label={metric.label}
                    value={metric.value}
                    icon={metric.icon}
                    subtitle={metric.subtitle}
                    tone={index === 2 ? "info" : "success"}
                  />
                ))}
              </div>
            </ChartCard>
          </div>

          {/* Additional Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">
            <div className="bg-gradient-to-r from-[var(--theme-primary)]/10 to-[var(--theme-primary)]/5 rounded-xl p-4 border border-[var(--theme-primary)]/20 text-center">
              <p className="text-xs text-[var(--theme-text-secondary)] font-medium">
                🏥 Avg Beds/Hospital
              </p>
              <p className="text-2xl font-bold text-[var(--theme-text-primary)]">
                {derivedMetrics.avgBedsPerHospital}
              </p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200 text-center">
              <p className="text-xs text-blue-600 font-medium">
                🛏️ Avg ICU/Hospital
              </p>
              <p className="text-2xl font-bold text-blue-700">
                {derivedMetrics.avgICUPerHospital}
              </p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100/50 rounded-xl p-4 border border-green-200 text-center">
              <p className="text-xs text-green-600 font-medium">
                🔬 Avg OT/Hospital
              </p>
              <p className="text-2xl font-bold text-green-700">
                {derivedMetrics.avgOTPerHospital}
              </p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-200 text-center">
              <p className="text-xs text-purple-600 font-medium">
                📊 Surgeries/Hospital
              </p>
              <p className="text-2xl font-bold text-purple-700">
                {derivedMetrics.surgeriesPerHospital}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hospitals Tab - NEW */}
      {activeTab === "hospitals" && (
        <div className="mt-4">
          {/* Hospital List KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <KpiCard
              title="Total Hospitals"
              value={listPagination.totalRecords}
              trend={0}
              accent="info"
              icon={LucideIcons.Building2}
            />
            <KpiCard
              title="Total Beds"
              value={organizationList.reduce(
                (sum, h) => sum + (h.totalBeds || 0),
                0,
              )}
              trend={0}
              accent="success"
              icon={LucideIcons.Bed}
            />
            <KpiCard
              title="Total ICU Beds"
              value={organizationList.reduce(
                (sum, h) => sum + (h.totalICUBeds || 0),
                0,
              )}
              trend={0}
              accent="product"
              icon={LucideIcons.HeartPulse}
            />
            <KpiCard
              title="Total OT"
              value={organizationList.reduce(
                (sum, h) => sum + (h.totalOperationTheatres || 0),
                0,
              )}
              trend={0}
              accent="target"
              icon={LucideIcons.Scissors}
            />
          </div>

          {/* Hospital Directory Table */}
          <ChartCard
            title="Hospital Directory"
            subtitle="Complete hospital list with infrastructure details"
          >
            <div className="shadow overflow-x-auto rounded-t-2xl border border-gray-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[var(--theme-bg-light)]">
                    <TableHead className="text-base font-semibold">#</TableHead>
                    <TableHead className="text-base font-semibold">
                      Hospital
                    </TableHead>
                    <TableHead className="text-base font-semibold">
                      Type
                    </TableHead>
                    <TableHead className="text-base font-semibold">
                      Category
                    </TableHead>
                    <TableHead className="text-base font-semibold">
                      Specialities
                    </TableHead>
                    <TableHead className="text-base font-semibold text-right">
                      Beds
                    </TableHead>
                    <TableHead className="text-base font-semibold text-right">
                      ICU
                    </TableHead>
                    <TableHead className="text-base font-semibold text-right">
                      OT
                    </TableHead>
                    <TableHead className="text-base font-semibold">
                      Surgeries
                    </TableHead>
                     <TableHead className="text-base font-semibold">
                      View
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableLoading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="p-8 text-center">
                        <div className="flex justify-center items-center w-full">
                          <LoaderSpinner />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : organizationList.length > 0 ? (
                    organizationList.map((hospital, index) => (
                      <TableRow
                        key={index}
                        className="hover:bg-gray-50 transition-all"
                      >
                        <td className="p-4 text-[17px] font-normal text-[#252C58]">
                          {(listPagination.currentPage - 1) *
                            listPagination.pageSize +
                            index +
                            1}
                        </td>
                        <td className="px-4 py-3 text-[15px] whitespace-nowrap font-medium text-[var(--theme-primary)]">
                          {hospital.hospitalName || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                          <Badge
                            className={`rounded-full ${hospital.typeOfOrgOrHospital === "Govt" ? "bg-blue-400 text-blue-700" : "bg-green-400 text-green-700"}`}
                          >
                            {hospital.typeOfOrgOrHospital || "N/A"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                          <Badge
                            variant="secondary"
                            className="rounded-full bg-[var(--theme-bg-light)] border-[var(--theme-border)]"
                          >
                            {hospital.typeOfHospital || "N/A"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-[15px] whitespace-nowrap max-w-[150px]">
                          <div className="flex flex-wrap gap-1">
                            {hospital.specialities &&
                            hospital.specialities.length > 0 ? (
                              hospital.specialities
                                .filter((s) => s && s.trim() !== "")
                                .slice(0, 2)
                                .map((s, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 bg-[var(--theme-bg-light)] text-[var(--theme-text-secondary)] text-xs rounded-full border border-[var(--theme-border)]"
                                  >
                                    {s}
                                  </span>
                                ))
                            ) : (
                              <span className="text-gray-400 text-sm">N/A</span>
                            )}
                            {hospital.specialities &&
                              hospital.specialities.filter(
                                (s) => s && s.trim() !== "",
                              ).length > 2 && (
                                <span className="text-xs text-gray-400">
                                  +
                                  {hospital.specialities.filter(
                                    (s) => s && s.trim() !== "",
                                  ).length - 2}
                                </span>
                              )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[15px] whitespace-nowrap text-right">
                          {hospital.totalBeds || 0}
                        </td>
                        <td className="px-4 py-3 text-[15px] whitespace-nowrap text-right">
                          {hospital.totalICUBeds || 0}
                        </td>
                        <td className="px-4 py-3 text-[15px] whitespace-nowrap text-right">
                          {hospital.totalOperationTheatres || 0}
                        </td>
                        <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                          {hospital.surgeries &&
                          hospital.surgeries.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {hospital.surgeries
                                .filter(
                                  (s) =>
                                    s.surgeryType &&
                                    s.surgeryType.trim() !== "" &&
                                    s.count > 0,
                                )
                                .map((s, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 bg-[var(--theme-bg-light)] text-[var(--theme-primary)] text-xs rounded-full border border-[var(--theme-border)]"
                                  >
                                    {s.surgeryType}: {s.count}
                                  </span>
                                ))}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">N/A</span>
                          )}
                        </td>
                                        <td className="p-4 text-center text-[19px] align-middle">
                                           <button
                                             onClick={() => handleViewOrganization(hospital._id, hospital.typeOfOrgOrHospital)}
                                             className="text-black hover:bg-blue-200 rounded-full w-8 h-8 flex items-center justify-center"
                                             aria-label="View details"
                                           >
                                             <TiEye size={18} color={themes.primaryColor} />
                                           </button>
                                         </td>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="text-center py-8 text-sm text-gray-500"
                      >
                        No hospitals match your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Hospital List Pagination */}
           <div className="rounded-b-2xl bg-white shadow-lg border border-gray-200 overflow-hidden">
              {listPagination.totalRecords > 0 && (
                <Pagination
                  currentPage={listPagination.currentPage}
                  totalItems={listPagination.totalRecords}
                  itemsPerPage={listPagination.pageSize}
                  totalPages={listPagination.totalPages}
                  onPageChange={handleListPageChange}
                  onItemsPerPageChange={handleListItemsPerPageChange}
                />
              )}
            </div>
          </ChartCard>
        </div>
      )}

      {/* Products Tab Content */}
      {activeTab === "products" && (
        <div className="mt-4">
          {/* Product KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            <KpiCard
              title="Organizations"
              value={productStats.totalOrgs}
              trend={0}
              accent="info"
              icon={LucideIcons.Building2}
            />
            <KpiCard
              title="Total Products"
              value={productStats.totalProducts}
              trend={0}
              accent="product"
              icon={LucideIcons.Package}
            />
            <KpiCard
              title="Total Target"
              value={productStats.totalTarget}
              trend={0}
              accent="target"
              icon={LucideIcons.Target}
            />
            <KpiCard
              title="Total Achieved"
              value={productStats.totalAchieved}
              trend={0}
              accent="success"
              icon={LucideIcons.CheckCircle2}
            />
            <KpiCard
              title="Avg Achievement"
              value={`${productStats.avgAchievement}%`}
              trend={0}
              accent="product"
              icon={LucideIcons.TrendingUp}
            />
          </div>

          {/* Product Performance - Fixed Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <ChartCard
              title="Performance Distribution"
              subtitle="Achievement buckets"
              className="lg:col-span-1"
            >
              {achievementDistribution.filter((d) => d.value > 0).length ===
              0 ? (
                <EmptyState />
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={achievementDistribution}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={2}
                      label={({ name, percent }) =>
                        `${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={{
                        stroke: "var(--theme-bg-sidebar)",
                        strokeWidth: 1,
                      }}
                    >
                      {achievementDistribution.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid var(--theme-bg-sidebar)",
                        background: "#ffffff",
                      }}
                      formatter={(value, name) => [
                        `${value} organizations`,
                        name,
                      ]}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            <ChartCard
              title="Product Performance"
              subtitle="Quick overview"
              className="lg:col-span-2"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-gradient-to-br from-[var(--theme-primary)]/10 to-[var(--theme-primary)]/5 rounded-xl p-3 text-center border border-[var(--theme-primary)]/20">
                  <p className="text-2xl font-bold text-[var(--theme-primary)]">
                    {productStats.totalOrgs}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    Organizations
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-3 text-center border border-blue-200">
                  <p className="text-2xl font-bold text-blue-600">
                    {productStats.totalProducts}
                  </p>
                  <p className="text-xs text-gray-500 truncate">Products</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-3 text-center border border-green-200">
                  <p className="text-2xl font-bold text-green-600">
                    {productStats.totalAchieved}
                  </p>
                  <p className="text-xs text-gray-500 truncate">Achieved</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-3 text-center border border-purple-200">
                  <p className="text-2xl font-bold text-purple-600">
                    {productStats.avgAchievement}%
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    Avg Achievement
                  </p>
                </div>
              </div>
            </ChartCard>
          </div>

          {/* Search */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <div className="relative w-64">
              <LucideIcons.Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <Input
                placeholder="Search organization or product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 rounded-xl border-[var(--theme-border)] focus:ring-[var(--theme-primary)]"
              />
            </div>
            <p className="text-sm text-gray-500">
              {filteredProductData.length} organizations found
            </p>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
            {filteredProductData.map((org, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-[var(--theme-border)] p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() =>
                  setSelectedOrg(selectedOrg === index ? null : index)
                }
              >
                {/* Organization Header */}
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-[var(--theme-text-primary)] truncate max-w-[60%]">
                    {org.organizationName}
                  </h4>
                  <Badge
                    className={`rounded-full whitespace-nowrap ${
                      org.achievementPercentage >= 100
                        ? "bg-green-500/15 text-green-500"
                        : org.achievementPercentage >= 75
                          ? "bg-yellow-500/15 text-yellow-600"
                          : "bg-red-500/15 text-red-500"
                    }`}
                  >
                    {org.achievementPercentage}%
                  </Badge>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 text-center text-sm mb-3">
                  <div className="bg-[var(--theme-card-bg)] rounded-lg p-2">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                      Target
                    </p>
                    <p className="font-semibold text-[var(--theme-text-primary)]">
                      {org.totalMonthlyTarget}
                    </p>
                  </div>
                  <div className="bg-[var(--theme-card-bg)] rounded-lg p-2">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                      Achieved
                    </p>
                    <p className="font-semibold text-green-600">
                      {org.totalMonthlyAchievement}
                    </p>
                  </div>
                  <div className="bg-[var(--theme-card-bg)] rounded-lg p-2">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                      Products
                    </p>
                    <p className="font-semibold text-[var(--theme-primary)]">
                      {org.products?.length || 0}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(org.achievementPercentage || 0, 100)}%`,
                      backgroundColor:
                        org.achievementPercentage >= 100
                          ? "#22c55e"
                          : org.achievementPercentage >= 75
                            ? "#eab308"
                            : "#ef4444",
                    }}
                  />
                </div>

                {/* Expand/Collapse Indicator */}
                <div className="mt-2 text-center">
                  <span className="text-xs text-gray-400">
                    {selectedOrg === index
                      ? "▼ Hide products"
                      : "▶ Click to view products"}
                  </span>
                </div>

                {/* Expanded Products */}
                {selectedOrg === index &&
                  org.products &&
                  org.products.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[var(--theme-border)] space-y-2 max-h-60 overflow-y-auto">
                      <p className="text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider sticky top-0 bg-white py-1">
                        Products ({org.products.length})
                      </p>
                      {org.products.map((product, pIdx) => (
                        <ProductCard
                          key={pIdx}
                          product={product}
                          organizationName={org.organizationName}
                        />
                      ))}
                    </div>
                  )}
              </div>
            ))}
            {filteredProductData.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No organizations match your search.
              </div>
            )}
          </div>

          {/* Product Table */}
          <ChartCard title="Product Directory" subtitle="Detailed product view">
            <div className="overflow-x-auto -mx-2">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[var(--theme-bg-light)]">
                    <TableHead className="text-base font-semibold">#</TableHead>
                    <TableHead className="text-base font-semibold">
                      Organization
                    </TableHead>
                    <TableHead className="text-base font-semibold text-center">
                      Products
                    </TableHead>
                    <TableHead className="text-base font-semibold text-right">
                      Target
                    </TableHead>
                    <TableHead className="text-base font-semibold text-right">
                      Achieved
                    </TableHead>
                    <TableHead className="text-base font-semibold text-right">
                      Achievement %
                    </TableHead>
                    <TableHead className="text-base font-semibold">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productTableLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="p-8 text-center">
                        <div className="flex justify-center items-center w-full">
                          <LoaderSpinner />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProductData.map((org, index) => {
                      const pct = org.achievementPercentage || 0;
                      const status =
                        pct >= 100
                          ? "Excellent"
                          : pct >= 75
                            ? "Good"
                            : pct >= 50
                              ? "Average"
                              : "Needs Attention";
                      const statusColor =
                        pct >= 100
                          ? "bg-green-500/15 text-green-500"
                          : pct >= 75
                            ? "bg-yellow-500/15 text-yellow-600"
                            : pct >= 50
                              ? "bg-orange-500/15 text-orange-600"
                              : "bg-red-500/15 text-red-500";

                      return (
                        <TableRow
                          key={index}
                          className="hover:bg-gray-50 transition-all"
                        >
                          <td className="p-4 text-[17px] font-normal text-[#252C58]">
                            {(productPagination.currentPage - 1) *
                              productPagination.pageSize +
                              index +
                              1}
                          </td>
                          <td className="px-4 py-3 text-[15px] whitespace-nowrap font-medium text-[var(--theme-primary)] max-w-[150px] truncate">
                            {org.organizationName}
                          </td>
                          <td className="px-4 py-3 text-[15px] whitespace-nowrap text-center">
                            {org.products?.length || 0}
                          </td>
                          <td className="px-4 py-3 text-[15px] whitespace-nowrap text-right">
                            {org.totalMonthlyTarget}
                          </td>
                          <td className="px-4 py-3 text-[15px] whitespace-nowrap text-right text-green-600">
                            {org.totalMonthlyAchievement}
                          </td>
                          <td className="px-4 py-3 text-[15px] whitespace-nowrap text-right">
                            <AchievementBadge value={pct} />
                          </td>
                          <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColor}`}
                            >
                              {status}
                            </span>
                          </td>
                        </TableRow>
                      );
                    })
                  )}
                  {filteredProductData.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-sm text-gray-500"
                      >
                        No organizations match your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Product Pagination */}
            <div className="px-4 py-3 border-t border-[var(--theme-border)] bg-gray-50 rounded-b-2xl">
              {productPagination.totalRecords > 0 && (
                <Pagination
                  currentPage={productPagination.currentPage}
                  totalItems={productPagination.totalRecords}
                  itemsPerPage={productPagination.pageSize}
                  totalPages={productPagination.totalPages}
                  onPageChange={handleProductPageChange}
                  onItemsPerPageChange={handleProductItemsPerPageChange}
                />
              )}
            </div>
          </ChartCard>
        </div>
      )}

      {/* District Drill-down Sheet */}
      <Sheet open={!!drill} onOpenChange={(o) => !o && setDrill(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{drill} district</SheetTitle>
            <SheetDescription>
              City-level breakdown & top organizations
            </SheetDescription>
          </SheetHeader>
          {drill &&
            (() => {
              const arr = filtered.filter((o) => o.district === drill);
              const cities = Array.from(new Set(arr.map((o) => o.city)));
              return (
                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <M label="Hospitals" value={String(arr.length)} />
                    <M
                      label="Beds"
                      value={arr
                        .reduce((s, o) => s + (o.beds || 0), 0)
                        .toLocaleString()}
                    />
                    <M
                      label="CY Surgeries"
                      value={arr
                        .reduce(
                          (s, o) => s + (o.totalSurgeriesCalendarYear || 0),
                          0,
                        )
                        .toLocaleString()}
                    />
                    <M
                      label="Avg Achievement"
                      value={`${Math.round(arr.reduce((s, o) => s + (o.productAchievement || 0), 0) / (arr.length || 1))}%`}
                    />
                  </div>
                  <div className="rounded-2xl border border-[var(--theme-bg-sidebar)] p-4 bg-white">
                    <p className="text-sm font-medium mb-2 text-[var(--theme-accent)]">
                      Cities
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {cities.map((c) => (
                        <Badge
                          key={c}
                          variant="secondary"
                          className="rounded-full"
                        >
                          {c} · {arr.filter((o) => o.city === c).length}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-[var(--theme-bg-sidebar)] p-4 bg-white">
                    <p className="text-sm font-medium mb-2 text-[var(--theme-accent)]">
                      Top organizations
                    </p>
                    <ul className="space-y-2 text-sm">
                      {arr.slice(0, 5).map((o) => (
                        <li
                          key={o.id}
                          className="flex items-center justify-between"
                        >
                          <span className="truncate text-[var(--theme-accent)]">
                            {o.organizationName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {o.beds || 0} beds · {o.productAchievement || 0}%
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })()}
        </SheetContent>
      </Sheet>
    </div>
  );
}
