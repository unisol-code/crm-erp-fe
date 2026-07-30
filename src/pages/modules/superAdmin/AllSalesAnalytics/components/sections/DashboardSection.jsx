// components/sections/DashboardSection.jsx

import React, { useMemo, useState, useEffect } from "react";
import { HospitalTable } from "./HospitalTable";
import * as LucideIcons from "lucide-react";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
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

function SummaryStat({ label, value, hint, tone }) {
  return (
    <div className="rounded-xl border border-[#E8C9B8] p-4 bg-[#FFF8F5]">
      <p className="text-xs font-medium text-[#8B5A3C]">{label}</p>
      <p
        className={`text-xl font-bold mt-1 ${tone === "success" ? "text-green-600" : "text-[#5A2D1A]"}`}
      >
        {value}
      </p>
      {hint && <p className="text-xs text-[#8B5A3C] mt-0.5">{hint}</p>}
    </div>
  );
}

function MiniStat({ label, value, tone }) {
  return (
    <div className="rounded-xl border border-[#E8C9B8] p-3 bg-[#FFF8F5]">
      <p className="text-[10px] font-semibold text-[#8B5A3C] uppercase tracking-wider">
        {label}
      </p>
      <p
        className={`text-lg font-bold mt-0.5 ${tone === "success" ? "text-green-600" : "text-[#5A2D1A]"}`}
      >
        {value}
      </p>
    </div>
  );
}

export function DashboardSection({
  hospitals,
  filters,
  kpis,
  executives = [],
  loading = false,
  paginationData = {},
  onPageChange,
  onItemsPerPageChange,
  organizationData,
  onSearch,
  specialityData,
  targetData,
}) {
  const [drillDistrict, setDrillDistrict] = useState(null);
  const [productCat, setProductCat] = useState("All");
  const [hospitalSearch, setHospitalSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Use props pagination or local state
  const currentPage = paginationData.currentPage || page;
  const itemsPerPage = paginationData.itemsPerPage || limit;
  const totalItems = paginationData.totalItems || hospitals.length;
  const totalPages =
    paginationData.totalPages || Math.ceil(hospitals.length / limit);

  const targetPct = Math.round(
    (TARGETS.monthlyAchieved / TARGETS.monthlyTarget) * 100,
  );
  const gaugeData = [{ name: "Achieved", value: targetPct, fill: "#C6693C" }];

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
    if (specialityData?.data && Array.isArray(specialityData.data)) {
      return specialityData.data.map((item) => ({
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

  // ✅ Get top speciality
  const topSpeciality = useMemo(() => {
    if (specialityChartData.length === 0) return { name: "N/A", value: 0 };
    const sorted = [...specialityChartData].sort((a, b) => b.value - a.value);
    return sorted[0];
  }, [specialityChartData]);

  // ✅ Calculate total doctors across all specialities
  const totalDoctors = useMemo(() => {
    return specialityChartData.reduce((sum, item) => sum + item.value, 0);
  }, [specialityChartData]);

  // ✅ Get profile distribution (Physician vs Surgeon)
  const profileDistribution = useMemo(() => {
    const profiles = {
      Physician: 0,
      Surgeon: 0,
    };

    specialityData?.data?.forEach((item) => {
      item.profiles?.forEach((profile) => {
        if (profile.typeOfDoctorProfile === "Physician") {
          profiles.Physician += profile.count || 0;
        } else if (profile.typeOfDoctorProfile === "Surgeon") {
          profiles.Surgeon += profile.count || 0;
        }
      });
    });

    return profiles;
  }, [specialityData]);

  // ✅ Process target data from API
  const targetChartData = useMemo(() => {
    if (targetData?.data && Array.isArray(targetData.data)) {
      return targetData.data;
    }
    return [];
  }, [targetData]);

  // ✅ Process target data from API - FIXED for object response
  const targetStats = useMemo(() => {
    if (!targetData?.data) {
      console.log("ℹ️ No target data available");
      return {
        totalTarget: 0,
        totalAchieved: 0,
        achievementPercentage: 0,
        monthlyTarget: 0,
        monthlyAchieved: 0,
        quarterlyTarget: 0,
        quarterlyAchieved: 0,
        yearlyTarget: 0,
        yearlyAchieved: 0,
      };
    }

    const data = targetData.data;
    console.log("📊 Target Data:", data);

    return {
      totalTarget: data.totalTarget || data.monthlyTarget || 0,
      totalAchieved: data.totalAchieved || data.monthlyAchieved || 0,
      achievementPercentage: Math.round(
        data.monthlyPercentage || data.yearlyPercentage || 0,
      ),
      monthlyTarget: data.monthlyTarget || 0,
      monthlyAchieved: data.monthlyAchieved || 0,
      quarterlyTarget: data.quarterlyTarget || 0,
      quarterlyAchieved: data.quarterlyAchieved || 0,
      yearlyTarget: data.yearlyTarget || 0,
      yearlyAchieved: data.yearlyAchieved || 0,
      monthlyPercentage: data.monthlyPercentage || 0,
      quarterlyPercentage: data.quarterlyPercentage || 0,
      yearlyPercentage: data.yearlyPercentage || 0,
    };
  }, [targetData]);
  const displayKpis = kpis && kpis.length > 0 ? kpis : updatedKPIS;

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

  return (
    <div>
      {/* Header Section */}
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#5A2D1A]">
            Territory Analytics
          </h1>
          <p className="text-sm text-[#8B5A3C] mt-1 font-medium">
            Live view of hospitals, doctors, visits and product performance
            across Maharashtra.
            {filters.state && (
              <span className="ml-2 text-[#C6693C] font-semibold">
                Filtered by: {filters.state}
              </span>
            )}
            {filters.district && (
              <span className="ml-2 text-[#C6693C] font-semibold">
                | {filters.district}
              </span>
            )}
            {filters.city && (
              <span className="ml-2 text-[#C6693C] font-semibold">
                | {filters.city}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-[#8B5A3C] bg-[#FFF5F0] px-3 py-1.5 rounded-lg border border-[#E8C9B8]">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Data synced 2 min ago
        </div>
      </div>
      {/* KPI Cards */}
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
            />
          );
        })}
      </div>
      {/* Row 1: Territory Heatmap + Summary */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <ChartCard
          title="Maharashtra Territory Heatmap"
          subtitle="Visit density by district"
          className="lg:col-span-2"
          action={
            <Badge
              variant="secondary"
              className="rounded-full bg-[#C6693C]/10 text-[#C6693C] border-[#C6693C]/20"
            >
              Live
            </Badge>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative rounded-2xl overflow-hidden border border-[#E8C9B8] bg-gradient-to-br from-[#C6693C]/5 via-white to-[#FFC4A2]/5 min-h-[280px] grid place-items-center">
              <div className="text-center px-6">
                <LucideIcons.MapPin
                  className="mx-auto text-[#C6693C]"
                  size={40}
                />
                <p className="mt-2 text-sm font-medium text-[#5A2D1A]">
                  Maharashtra heatmap
                </p>
                <p className="text-xs text-[#8B5A3C]">
                  Interactive map placeholder
                </p>
                <div className="mt-4 flex items-center gap-1 justify-center flex-wrap">
                  {filteredDistricts.map((d, i) => (
                    <div
                      key={d.district}
                      className="h-8 rounded-md"
                      style={{
                        width: 24 + d.value / 4,
                        backgroundColor: `rgba(198, 105, 60, ${0.3 + i * 0.12})`,
                      }}
                      title={`${d.district}: ${d.value}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#5A2D1A] uppercase tracking-wider mb-2">
                District Ranking
              </p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={filteredDistricts}
                  layout="vertical"
                  margin={{ left: 8, right: 16 }}
                >
                  <CartesianGrid horizontal={false} stroke="#E8C9B8" />
                  <XAxis type="number" stroke="#8B5A3C" fontSize={11} />
                  <YAxis
                    dataKey="district"
                    type="category"
                    stroke="#8B5A3C"
                    fontSize={12}
                    width={70}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #E8C9B8",
                      background: "#ffffff",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    radius={[0, 8, 8, 0]}
                    onClick={(d) => setDrillDistrict(d.district)}
                  >
                    {filteredDistricts.map((_, i) => (
                      <Cell
                        key={i}
                        fill={COLORS[i % COLORS.length]}
                        cursor="pointer"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Territory Summary" subtitle="Key metrics">
          <div className="space-y-3">
            {[
              {
                label: "Active districts",
                value: filteredDistricts
                  .filter((d) => d.value > 0)
                  .length.toString(),
                trend: "+2",
              },
              {
                label: "Hospitals covered",
                value: filteredHospitals.length.toString(),
                trend: "+14",
              },
              {
                label: "Avg. visits / district",
                value:
                  filteredDistricts.length > 0
                    ? Math.round(
                        filteredDistricts.reduce((s, d) => s + d.value, 0) /
                          filteredDistricts.filter((d) => d.value > 0).length,
                      ).toString()
                    : "0",
                trend: "+9",
              },
              {
                label: "Best performing",
                value:
                  filteredHospitals.length > 0
                    ? filteredHospitals.reduce((a, b) =>
                        a.achievement > b.achievement ? a : b,
                      ).name
                    : "N/A",
                trend: "Top performer",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="flex items-center justify-between p-3 rounded-xl bg-[#FFF8F5] border border-[#E8C9B8]"
              >
                <div>
                  <p className="text-xs font-medium text-[#8B5A3C]">
                    {s.label}
                  </p>
                  <p className="text-base font-bold text-[#5A2D1A] mt-0.5">
                    {s.value}
                  </p>
                </div>
                <span className="text-xs font-semibold text-green-600">
                  {s.trend}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div> */}

      {/* Row 2: Speciality Intelligence + Target vs Achievement */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <ChartCard
          title="Speciality Intelligence"
          subtitle={`${specialityChartData.length} specialities • ${totalDoctors} total doctors`}
          className="lg:col-span-2"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left: Pie Chart */}
            <div className="lg:col-span-2">
              {specialityChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={specialityChartData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={2}
                      label={({ name, percent }) =>
                        `${formatSpecialityName(name)} ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={{ stroke: "#E8B59F", strokeWidth: 1 }}
                    >
                      {specialityChartData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid #E8B59F",
                        background: "#ffffff",
                        padding: "12px",
                      }}
                      formatter={(value, name, props) => {
                        const item = specialityChartData.find(
                          (d) => d.name === name,
                        );
                        const profileText =
                          item?.profiles
                            ?.map((p) => `${p.typeOfDoctorProfile}: ${p.count}`)
                            .join(" | ") || "";
                        return [
                          `${value} doctors${profileText ? `\n${profileText}` : ""}`,
                          formatSpecialityName(name),
                        ];
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[260px] text-gray-400">
                  {loading ? <LoaderSpinner /> : "No speciality data available"}
                </div>
              )}
            </div>

            {/* Right: Stats Cards */}
            <div className="space-y-2">
              {/* Top Speciality Card */}
              <div className="bg-gradient-to-r from-[#C6693C]/10 to-[#C6693C]/5 rounded-xl p-3 border border-[#C6693C]/20">
                <p className="text-xs text-[#8B5A3C] font-medium">
                  🏆 Top Speciality
                </p>
                <p className="text-lg font-bold text-[#5A2D1A]">
                  {formatSpecialityName(topSpeciality?.name) || "N/A"}
                </p>
                <p className="text-sm text-[#C6693C]">
                  {topSpeciality?.value || 0} doctors
                </p>
              </div>

              {/* Doctor Distribution */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                  <p className="text-xs text-blue-600 font-medium">
                    👨‍⚕️ Physicians
                  </p>
                  <p className="text-xl font-bold text-blue-700">
                    {profileDistribution.Physician}
                  </p>
                  <p className="text-xs text-blue-500">General medicine</p>
                </div>
                <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                  <p className="text-xs text-green-600 font-medium">
                    🔬 Surgeons
                  </p>
                  <p className="text-xl font-bold text-green-700">
                    {profileDistribution.Surgeon}
                  </p>
                  <p className="text-xs text-green-500">Surgical specialists</p>
                </div>
              </div>

              {/* Total Stats */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                  <p className="text-xs text-gray-500 font-medium">
                    📊 Total Specialities
                  </p>
                  <p className="text-xl font-bold text-gray-700">
                    {specialityChartData.length}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                  <p className="text-xs text-gray-500 font-medium">
                    👤 Total Doctors
                  </p>
                  <p className="text-xl font-bold text-gray-700">
                    {totalDoctors}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom: Speciality List */}
          <div className="mt-4 pt-4 border-t border-[#E8C9B8]">
            <div className="flex flex-wrap gap-2">
              {specialityChartData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#FFF8F5] rounded-full border border-[#E8C9B8] hover:bg-[#C6693C]/10 transition-colors cursor-default"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-[#5A2D1A]">
                    {formatSpecialityName(item.name)}
                  </span>
                  <span className="text-xs text-[#C6693C] font-medium">
                    ({item.value})
                  </span>
                </div>
              ))}
              {specialityChartData.length === 0 && (
                <div className="text-sm text-gray-400">
                  No specialities available
                </div>
              )}
            </div>
          </div>
        </ChartCard>

        {/* ✅ Target vs Achievement - Multiple Radial Bars */}
        <ChartCard
          title="Target vs Achievement"
          subtitle="Monthly, Quarterly & Yearly performance"
        >
          {/* Multiple Radial Bars */}
          <div className="relative h-52">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="60%"
                outerRadius="100%"
                data={[
                  {
                    name: "Monthly",
                    value: targetStats.monthlyPercentage || 0,
                    fill: "#C6693C",
                  },
                  {
                    name: "Quarterly",
                    value: targetStats.quarterlyPercentage || 0,
                    fill: "#E8A87C",
                  },
                  {
                    name: "Yearly",
                    value: targetStats.yearlyPercentage || 0,
                    fill: "#F5CBA7",
                  },
                ]}
                startAngle={225}
                endAngle={-45}
              >
                <RadialBar
                  background={{ fill: "#E8B59F" }}
                  dataKey="value"
                  cornerRadius={20}
                  barSize={15}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: 11, paddingTop: "8px" }}
                  formatter={(value, entry) => {
                    const item = entry.payload;
                    return `${value} (${item.value.toFixed(1)}%)`;
                  }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #E8B59F",
                    background: "#ffffff",
                    padding: "10px 14px",
                  }}
                  formatter={(value) => [`${value.toFixed(1)}%`, "Achievement"]}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 grid place-items-center pointer-events-none">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#C6693C]">
                  {(
                    (targetStats.monthlyPercentage +
                      targetStats.quarterlyPercentage +
                      targetStats.yearlyPercentage) /
                    3
                  ).toFixed(1)}
                  %
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Avg. achievement
                </p>
              </div>
            </div>
          </div>

          {/* Target Stats Grid - Monthly, Quarterly, Yearly */}
          <div className="grid grid-cols-3 gap-2 mt-2">
            {/* Monthly */}
            <div className="bg-[#FFF8F5] rounded-xl p-2.5 border border-[#E8C9B8] text-center">
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: "#C6693C" }}
                />
                <p className="text-[10px] text-[#8B5A3C] font-medium">
                  Monthly
                </p>
              </div>
              <p className="text-sm font-bold text-[#5A2D1A]">
                {targetStats.monthlyAchieved}/{targetStats.monthlyTarget}
              </p>
              <p
                className={`text-xs font-semibold ${targetStats.monthlyPercentage >= 100 ? "text-green-600" : targetStats.monthlyPercentage >= 80 ? "text-[#C6693C]" : "text-red-500"}`}
              >
                {targetStats.monthlyPercentage}%
              </p>
            </div>

            {/* Quarterly */}
            <div className="bg-[#FFF8F5] rounded-xl p-2.5 border border-[#E8C9B8] text-center">
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: "#E8A87C" }}
                />
                <p className="text-[10px] text-[#8B5A3C] font-medium">
                  Quarterly
                </p>
              </div>
              <p className="text-sm font-bold text-[#5A2D1A]">
                {targetStats.quarterlyAchieved}/{targetStats.quarterlyTarget}
              </p>
              <p
                className={`text-xs font-semibold ${targetStats.quarterlyPercentage >= 100 ? "text-green-600" : targetStats.quarterlyPercentage >= 80 ? "text-[#C6693C]" : "text-red-500"}`}
              >
                {targetStats.quarterlyPercentage}%
              </p>
            </div>

            {/* Yearly */}
            <div className="bg-[#FFF8F5] rounded-xl p-2.5 border border-[#E8C9B8] text-center">
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: "#F5CBA7" }}
                />
                <p className="text-[10px] text-[#8B5A3C] font-medium">Yearly</p>
              </div>
              <p className="text-sm font-bold text-[#5A2D1A]">
                {targetStats.yearlyAchieved}/{targetStats.yearlyTarget}
              </p>
              <p
                className={`text-xs font-semibold ${targetStats.yearlyPercentage >= 100 ? "text-green-600" : targetStats.yearlyPercentage >= 80 ? "text-[#C6693C]" : "text-red-500"}`}
              >
                {targetStats.yearlyPercentage}%
              </p>
            </div>
          </div>

          {/* Progress Bars for each period */}
          <div className="mt-3 space-y-1.5">
            {/* Monthly Progress */}
            <div>
              <div className="flex justify-between text-[10px] text-gray-500 mb-0.5">
                <span>Monthly Progress</span>
                <span>{targetStats.monthlyPercentage}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#C6693C] rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(targetStats.monthlyPercentage || 0, 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Quarterly Progress */}
            <div>
              <div className="flex justify-between text-[10px] text-gray-500 mb-0.5">
                <span>Quarterly Progress</span>
                <span>{targetStats.quarterlyPercentage}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#E8A87C] rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(targetStats.quarterlyPercentage || 0, 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Yearly Progress */}
            <div>
              <div className="flex justify-between text-[10px] text-gray-500 mb-0.5">
                <span>Yearly Progress</span>
                <span>{targetStats.yearlyPercentage}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#F5CBA7] rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(targetStats.yearlyPercentage || 0, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </ChartCard>
      </div>
      {/* Sales Executive Performance - Grouped Bar Chart */}
      <ChartCard
        title="Sales Executive Performance"
        subtitle="Total Visits vs Success Visits"
        className="mt-4"
      >
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={executives}
            layout="vertical"
            margin={{ left: 8, right: 16 }}
          >
            <CartesianGrid horizontal={false} stroke="#E8B59F" />
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
                border: "1px solid #E8B59F",
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
              fill="#C6693C"
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
              {executives.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.name}</TableCell>
                  <TableCell className="text-right">{e.planned}</TableCell>
                  <TableCell className="text-right">{e.completed}</TableCell>
                  <TableCell className="text-right">
                    <AchievementBadge value={e.achievement} />
                  </TableCell>
                </TableRow>
              ))}
              {executives.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-sm text-gray-500"
                  >
                    No executive data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </ChartCard>
      {/* Row 4: Product Intelligence + Lead Conversion Funnel */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <ChartCard
          title="Product Intelligence"
          subtitle="Achieved quantity by product"
          className="lg:col-span-2"
          action={
            <div className="flex gap-1 flex-wrap">
              {PRODUCT_CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setProductCat(c)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    productCat === c
                      ? "bg-[#C6693C] text-white border-[#C6693C]"
                      : "border-[#E8B59F] text-gray-500 hover:bg-[#FFC4A2]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={filteredProducts} margin={{ left: 0, right: 8 }}>
              <CartesianGrid vertical={false} stroke="#E8B59F" />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
              <YAxis stroke="#6b7280" fontSize={11} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #E8B59F",
                  background: "#ffffff",
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {filteredProducts.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {filteredProducts.length === 0 && (
            <div className="text-center py-10 text-sm text-gray-500">
              No products in this category.
            </div>
          )}
        </ChartCard>

        <ChartCard
          title="Lead Conversion Funnel"
          subtitle="Stage-wise conversion"
        >
          <div className="space-y-2">
            {FUNNEL.map((f, i) => {
              const max = FUNNEL[0].value;
              const width = (f.value / max) * 100;
              const conv =
                i === 0
                  ? null
                  : Math.round((f.value / FUNNEL[i - 1].value) * 100);
              return (
                <div key={f.stage}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-[#A54A29]">
                      {f.stage}
                    </span>
                    <span className="text-gray-500">
                      {f.value}{" "}
                      {conv !== null && (
                        <span className="ml-2 text-[#C6693C]">{conv}%</span>
                      )}
                    </span>
                  </div>
                  <div className="h-7 rounded-lg bg-[#FBE9E7] overflow-hidden">
                    <div
                      className="h-full rounded-lg transition-all"
                      style={{
                        width: `${width}%`,
                        background: `linear-gradient(90deg, ${COLORS[i % COLORS.length]}, color-mix(in oklch, ${COLORS[i % COLORS.length]} 60%, white))`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div> */}

      {/* Row 5: Hospitals Table - Employee List Style */}
      {/* Table */}
      <div className="shadow overflow-x-auto">
        {/* Hospital Table - Using the new component */}
        <div className="mt-4">
          <HospitalTable
            data={organizationData}
            loading={loading}
            pagination={{
              currentPage: organizationData?.currentPage || 1,
              pageSize: organizationData?.pageSize || 10,
            }}
            onPageChange={onPageChange}
            onItemsPerPageChange={onItemsPerPageChange}
            onSearch={onSearch}
          />
        </div>
      </div>

      {/* District Drill-down Sheet */}
      <Sheet
        open={!!drillDistrict}
        onOpenChange={(o) => !o && setDrillDistrict(null)}
      >
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{drillDistrict} district</SheetTitle>
            <SheetDescription>
              Field-force performance in {drillDistrict}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
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
            <div className="rounded-2xl border border-[#E8B59F] p-4 bg-white">
              <p className="text-sm font-medium mb-2 flex items-center gap-2 text-[#A54A29]">
                <LucideIcons.TrendingUp size={16} className="text-[#C6693C]" />
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
            <Button className="w-full rounded-xl bg-[#C6693C] hover:bg-[#A54A29]">
              Open full report
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
