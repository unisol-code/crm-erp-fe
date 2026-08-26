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
   targetData,
   overviewData,
   allIndividualData,
   fetchAllIndividualData,
   specificIndividualData,
   fetchSpecificIndividualData,
    allOrganizationsData,
    fetchAllOrganizationsData,
    specificOrganizationData,
    fetchSpecificOrganizationData,
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

  // ✅ Process target data from API - FIXED for array response
  const targetStats = useMemo(() => {
    if (!targetData?.data || !Array.isArray(targetData.data) || targetData.data.length === 0) {
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

    const data = targetData.data[0];
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

  const handleKpiClick = (kpi) => {
    if (kpi.key === "individualCount") {
      setKpiDetailOpen((prev) => !prev);
      setSelectedProfileType(null);
      setSelectedDoctor(null);
      setSelectedHospitalType(null);
      setSelectedOrganization(null);
      setIndividualPage(1);
      setIndividualLimit(10);
    }
    if (kpi.key === "organizationCount") {
      setKpiDetailOpen(false);
      setSelectedProfileType(null);
      setSelectedDoctor(null);
      setSelectedHospitalType((prev) => (prev === "hospital" ? null : "hospital"));
      setSelectedOrganization(null);
      setIndividualPage(1);
      setIndividualLimit(10);
    }
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
      {loading ? (
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
      {/* Doctor Profile Breakdown - Inline Below KPI Cards */}
      {kpiDetailOpen && overviewData?.data?.typeOfDoctorProfileWiseCount && Object.keys(overviewData.data.typeOfDoctorProfileWiseCount).length > 0 && (
        <div className="mt-4 p-4 rounded-xl border border-[var(--theme-border)] bg-white">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider">
              Doctor Profile Breakdown
            </p>
             <button
               onClick={() => { setKpiDetailOpen(false); setSelectedProfileType(null); setSelectedHospitalType(null); setSelectedOrganization(null); }}
               className="h-6 w-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
             >
              <LucideIcons.X size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(overviewData.data.typeOfDoctorProfileWiseCount)
              .sort(([, a], [, b]) => b - a)
              .map(([type, count]) => {
                const colorMap = {
                  Surgeon: "bg-red-50 text-red-600 border-red-100",
                  Physician: "bg-blue-50 text-blue-600 border-blue-100",
                  Nursing: "bg-pink-50 text-pink-600 border-pink-100",
                  Pharmacist: "bg-purple-50 text-purple-600 border-purple-100",
                  "Bio-Medical": "bg-teal-50 text-teal-600 border-teal-100",
                  Financial: "bg-emerald-50 text-emerald-600 border-emerald-100",
                  "Non Clinical": "bg-gray-50 text-gray-600 border-gray-100",
                };
                const iconMap = {
                  Surgeon: LucideIcons.Scissors,
                  Physician: LucideIcons.Stethoscope,
                  Nursing: LucideIcons.Heart,
                  Pharmacist: LucideIcons.Pill,
                  "Bio-Medical": LucideIcons.Microscope,
                  Financial: LucideIcons.DollarSign,
                  "Non Clinical": LucideIcons.UserCheck,
                };
                const ProfileIcon = iconMap[type] || LucideIcons.User;
                const colors = colorMap[type] || "bg-gray-50 text-gray-600 border-gray-100";
                const isSelected = selectedProfileType === type;

                return (
                  <div
                    key={type}
                    onClick={() => {
                      setSelectedProfileType(isSelected ? null : type);
                      setSelectedDoctor(null);
                      setSelectedHospitalType(null);
                      setSelectedOrganization(null);
                    }}
                    className={`group rounded-xl border p-4 transition-all cursor-pointer ${
                      isSelected
                        ? "border-[var(--theme-primary)] bg-[var(--theme-primary)]/5 shadow-md"
                        : "border-[var(--theme-border)] bg-white hover:shadow-md hover:border-[var(--theme-primary)]/30"
                    }`}
                  >
                    <div className={`h-10 w-10 rounded-lg border ${colors} grid place-items-center mb-3`}>
                      <ProfileIcon size={18} />
                    </div>
                    <p className="text-sm font-semibold text-[var(--theme-text-primary)] leading-tight">
                      {type}
                    </p>
                    <p className="text-2xl font-bold text-[var(--theme-text-primary)] mt-1">
                      {count}
                    </p>
                    <p className="text-[10px] text-[var(--theme-text-secondary)] font-medium mt-0.5">
                      doctors
                    </p>
                  </div>
                );
              })}
          </div>

          {/* Nested breakdown for selected profile type */}
          {selectedProfileType && (() => {
            const profileSpecialities = specialityChartData.filter((item) =>
              item.profiles?.some((p) => p.typeOfDoctorProfile === selectedProfileType),
            );
            const profileCount = overviewData.data.typeOfDoctorProfileWiseCount[selectedProfileType] || 0;

            return (
              <div className="mt-4 pt-4 border-t border-[var(--theme-border)]">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider">
                    {selectedProfileType} - Speciality Breakdown
                  </p>
                  <button
                    onClick={() => setSelectedProfileType(null)}
                    className="text-[10px] text-[var(--theme-primary)] font-medium hover:underline"
                  >
                    Close
                  </button>
                </div>
        
                  {/* Individual Doctor Table */}
                  {allIndividualData?.data && allIndividualData.data.length > 0 && (
                    <div className="mt-4 rounded-xl border border-[var(--theme-border)] overflow-hidden">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Doctor</TableHead>
                              <TableHead>Hospital</TableHead>
                              <TableHead>City</TableHead>
                              <TableHead>District</TableHead>
                               <TableHead>Profile</TableHead>
                              <TableHead>Department</TableHead>
                              <TableHead>Designation</TableHead>
                              <TableHead>Sales Person</TableHead>
                              <TableHead>View</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {individualLoading ? (
                              <TableRow>
                                 <TableCell colSpan={9} className="p-8 text-center">
                                  <div className="flex justify-center items-center w-full">
                                    <LoaderSpinner />
                                  </div>
                                </TableCell>
                              </TableRow>
                            ) : (
                              allIndividualData.data.map((item, idx) => (
                                <TableRow key={item._id || idx}>
                                  <TableCell className="font-medium">{item.Doctor}</TableCell>
                                  <TableCell>{item.Hospital || "-"}</TableCell>
                                  <TableCell>{item.City}</TableCell>
                                  <TableCell>{item.District}</TableCell>
                                  <TableCell>{item.typeOfDoctorProfile || "-"}</TableCell>
                                  <TableCell>{item.department || item.Speciality || "-"}</TableCell>
                                  <TableCell>{item.designation || "-"}</TableCell>
                                  <TableCell>{item.salesPersonName}</TableCell>
                                   <TableCell>  <button
                                      onClick={() => handleViewDoctor(item._id)}
                                      className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 hover:text-[var(--theme-primary)] transition-colors"
                                    >
                                      <TiEye size={18} />
                                    </button>
                                   </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                      {!individualLoading && allIndividualData.data.length === 0 && (
                        <p className="text-xs text-gray-500 text-center py-4">
                          No individual data available for {selectedProfileType}
                        </p>
                      )}

                      {/* Pagination for Individual Data */}
                      {selectedProfileType && (() => {
                        const totalRecords = allIndividualData?.totalRecords || allIndividualData?.data?.length || 0;
                        const totalPages = allIndividualData?.totalPages || Math.ceil(totalRecords / individualLimit);
                        const currentPage = allIndividualData?.currentPage || individualPage;

                        return (
                          <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={totalRecords}
                            itemsPerPage={individualLimit}
                            onPageChange={handleIndividualPageChange}
                            onItemsPerPageChange={handleIndividualLimitChange}
                            showRowPerPage
                          />
                        );
                      })()}
                    </div>
                  )}
                </div>
              );
            })()}
        </div>
      )}

      {/* Hospital Type Breakdown - Inline Below KPI Cards */}
      {selectedHospitalType && overviewData?.data?.typeOfHospitalWiseCount && Object.keys(overviewData.data.typeOfHospitalWiseCount).length > 0 && (
        <div className="mt-4 p-4 rounded-xl border border-[var(--theme-border)] bg-white">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider">
              Hospital Type Breakdown
            </p>
             <button
               onClick={() => { setSelectedHospitalType(null); setSelectedOrganization(null); }}
               className="h-6 w-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
             >
              <LucideIcons.X size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
             {Object.entries(overviewData.data.typeOfHospitalWiseCount).map(([type, count]) => {
               const iconMap = {
                 govtHospitalCount: LucideIcons.Hospital,
                 pvtHospitalCount: LucideIcons.Building2,
               };
               const colorMap = {
                 govtHospitalCount: "bg-blue-50 text-blue-600 border-blue-100",
                 pvtHospitalCount: "bg-purple-50 text-purple-600 border-purple-100",
               };
               const labelMap = {
                 govtHospitalCount: "Govt Hospital",
                 pvtHospitalCount: "Private Hospital",
               };
               const orgTypeValueMap = {
                 govtHospitalCount: "Govt",
                 pvtHospitalCount: "Private",
               };
               const HospitalIcon = iconMap[type] || LucideIcons.Hospital;
               const colors = colorMap[type] || "bg-gray-50 text-gray-600 border-gray-100";
               const orgTypeValue = orgTypeValueMap[type] || type;
               const isOrgTypeSelected = selectedOrgType === orgTypeValue;

               return (
                 <div
                   key={type}
                    onClick={() => {
                      setSelectedOrgType(isOrgTypeSelected ? null : orgTypeValue);
                      setSelectedOrganization(null);
                    }}
                   className={`group rounded-xl border p-4 transition-all cursor-pointer ${
                     isOrgTypeSelected
                       ? "border-[var(--theme-primary)] bg-[var(--theme-primary)]/5 shadow-md"
                       : "border-[var(--theme-border)] bg-white hover:shadow-md hover:border-[var(--theme-primary)]/30"
                   }`}
                 >
                   <div className={`h-10 w-10 rounded-lg border ${colors} grid place-items-center mb-3`}>
                     <HospitalIcon size={18} />
                   </div>
                   <p className="text-sm font-semibold text-[var(--theme-text-primary)] leading-tight">
                     {labelMap[type] || type}
                   </p>
                   <p className="text-2xl font-bold text-[var(--theme-text-primary)] mt-1">
                     {count}
                   </p>
                   <p className="text-[10px] text-[var(--theme-text-secondary)] font-medium mt-0.5">
                     hospitals
                   </p>
                 </div>
               );
             })}
           </div>

           {/* Organization Data Table for Selected Hospital Type */}
           {selectedOrgType && (() => {
             const orgDataList = allOrganizationsData?.data || [];
             const totalRecords = allOrganizationsData?.totalRecords || orgDataList.length || 0;
             const totalPages = allOrganizationsData?.totalPages || Math.ceil(totalRecords / orgLimit);
             const currentPage = allOrganizationsData?.currentPage || orgPage;

             return (
               <div className="mt-4 pt-4 border-t border-[var(--theme-border)]">
                 <div className="flex items-center justify-between mb-3">
                   <p className="text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider">
                     {selectedOrgType} - Organizations List
                   </p>
                    <button
                      onClick={() => { setSelectedOrgType(null); setOrgPage(1); setSelectedOrganization(null); }}
                      className="text-[10px] text-[var(--theme-primary)] font-medium hover:underline"
                    >
                     Close
                   </button>
                 </div>

                 {orgLoading ? (
                   <div className="rounded-xl border border-[var(--theme-border)] overflow-hidden">
                     <div className="p-8 text-center">
                       <LoaderSpinner />
                     </div>
                   </div>
                 ) : orgDataList.length > 0 ? (
                   <div className="mt-4 rounded-xl border border-[var(--theme-border)] overflow-hidden">
                     <div className="overflow-x-auto">
                       <Table>
                         <TableHeader>
                           <TableRow>
                             <TableHead>#</TableHead>
                             <TableHead>Organization</TableHead>
                             <TableHead>Type</TableHead>
                             <TableHead>City</TableHead>
                             <TableHead>District</TableHead>
                             <TableHead>State</TableHead>
                             <TableHead>Speciality</TableHead>
                             <TableHead>View</TableHead>
                           </TableRow>
                         </TableHeader>
                         <TableBody>
                           {orgDataList.map((item, idx) => (
                             <TableRow key={item._id || idx}>
                               <TableCell>{(currentPage - 1) * orgLimit + idx + 1}</TableCell>
                               <TableCell className="font-medium">{item.organizationName || item.hospitalName || "-"}</TableCell>
                               <TableCell>
                               
                                   {item.typeOfOrgOrHospital || "N/A"}
   
                               </TableCell>
                               <TableCell>{item.city || "-"}</TableCell>
                               <TableCell>{item.district || "-"}</TableCell>
                               <TableCell>{item.state || "-"}</TableCell>
                               <TableCell>{item.speciality || "-"}</TableCell>
                                <TableCell>
                                  <button
                                    onClick={() => handleViewOrganization(item._id)}
                                    className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 hover:text-[var(--theme-primary)] transition-colors"
                                  >
                                    <TiEye size={18} />
                                  </button>
                                </TableCell>
                             </TableRow>
                           ))}
                         </TableBody>
                       </Table>
                     </div>

                     <Pagination
                       currentPage={currentPage}
                       totalPages={totalPages}
                       totalItems={totalRecords}
                       itemsPerPage={orgLimit}
                       onPageChange={handleOrgPageChange}
                       onItemsPerPageChange={handleOrgLimitChange}
                       showRowPerPage
                     />
                   </div>
                 ) : (
                   <p className="text-xs text-gray-500 text-center py-4">
                     No organizations found for {selectedOrgType}
                   </p>
                 )}
               </div>
             );
            })()}
          </div>
        )}

        {/* Organization Detail Inline Section */}
        {selectedOrganization && specificOrganizationData?.data && (
          <div className="mt-4 p-4 rounded-xl border border-[var(--theme-border)] bg-white">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider">
                Organization Details
              </p>
              <button
                onClick={() => setSelectedOrganization(null)}
                className="h-6 w-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <LucideIcons.X size={14} />
              </button>
            </div>

            {specificOrganizationData.data && (() => {
              const org = specificOrganizationData.data.organization || {};
              const monthlyPlanning = specificOrganizationData.data.monthlyPlanning || {};

              return (
                <div className="space-y-4">
                  <div className="rounded-xl border border-[var(--theme-border)] bg-white p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider mb-1">
                          Basic Information
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-[10px] text-gray-500 font-medium">Organization Name</p>
                            <p className="text-sm font-semibold text-[var(--theme-text-primary)]">
                              {org.hospitalName || org.organizationName || "-"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 font-medium">Type</p>
                            <p className="text-sm font-semibold text-[var(--theme-text-primary)]">
                              {org.typeOfOrgOrHospital || "-"}
                            </p>
                          </div>
                          {org.ifGovt && (
                            <div>
                              <p className="text-[10px] text-gray-500 font-medium">Govt Category</p>
                              <p className="text-sm font-semibold text-[var(--theme-text-primary)]">
                                {org.ifGovt}
                              </p>
                            </div>
                          )}
                          <div>
                            <p className="text-[10px] text-gray-500 font-medium">Category</p>
                            <p className="text-sm font-semibold text-[var(--theme-text-primary)]">
                              {org.typeOfHospital || "-"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 font-medium">Speciality</p>
                            <p className="text-sm font-semibold text-[var(--theme-text-primary)]">
                              {org.specialities && org.specialities.length > 0
                                ? org.specialities.map(s => s.name).filter(Boolean).join(", ") || "-"
                                : "-"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 font-medium">Total Beds</p>
                            <p className="text-sm font-semibold text-[var(--theme-text-primary)]">
                              {org.totalBeds ?? 0}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 font-medium">ICU Beds</p>
                            <p className="text-sm font-semibold text-[var(--theme-text-primary)]">
                              {org.totalICUBeds ?? 0}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 font-medium">Operation Theatres</p>
                            <p className="text-sm font-semibold text-[var(--theme-text-primary)]">
                              {org.totalOT ?? 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Monthly Planning */}
                  {Object.keys(monthlyPlanning).length > 0 ? (
                    <div className="rounded-xl border border-[var(--theme-border)] bg-white p-4">
                      <p className="text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider mb-3">
                        Monthly Planning
                      </p>
                      <div className="space-y-3">
                        {Object.entries(monthlyPlanning).map(([month, plans]) => (
                          <div key={month} className="border border-[var(--theme-border)] rounded-lg overflow-hidden">
                            <div className="bg-gray-50 px-3 py-2 border-b border-[var(--theme-border)]">
                              <p className="text-xs font-semibold text-[var(--theme-text-primary)]">{month}</p>
                            </div>
                            <div className="p-3">
                              {Array.isArray(plans) && plans.length > 0 ? (
                                <div className="space-y-2">
                                  {plans.map((plan, idx) => (
                                    <div key={idx} className="flex flex-wrap items-center gap-2 text-xs">
                                      <span className="font-medium text-[var(--theme-text-primary)]">
                                        {plan.nameOfDoctor}
                                      </span>
                                      <span className="text-gray-400">|</span>
                                      <span className="text-gray-600">{plan.selectOrganization}</span>
                                      <span className="text-gray-400">|</span>
                                      <span className="text-gray-500">
                                        {plan.createPlanningForDate ? new Date(plan.createPlanningForDate).toLocaleDateString() : "-"}
                                      </span>
                                      {plan.productToBePromoted && Array.isArray(plan.productToBePromoted) && plan.productToBePromoted.length > 0 ? (
                                        <>
                                          <span className="text-gray-400">|</span>
                                          <div className="flex flex-wrap gap-1">
                                            {plan.productToBePromoted.map((product, pIdx) => (
                                              <span
                                                key={pIdx}
                                                className="px-2 py-0.5 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] text-[10px] font-medium"
                                              >
                                                {product}
                                              </span>
                                            ))}
                                          </div>
                                        </>
                                      ) : plan.productToBePromoted && typeof plan.productToBePromoted === 'string' ? (
                                        <>
                                          <span className="text-gray-400">|</span>
                                          <span className="px-2 py-0.5 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] text-[10px] font-medium">
                                            {plan.productToBePromoted}
                                          </span>
                                        </>
                                      ) : null}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-gray-500">No plans for this month</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-[var(--theme-border)] bg-white p-4 text-center">
                      <p className="text-xs text-gray-500">No monthly planning data available</p>
                    </div>
                  )}
                </div>
              );
            })()}

            {!specificOrganizationData?.data && selectedOrganization && (
              <div className="flex justify-center items-center py-10">
                <LoaderSpinner />
              </div>
            )}
          </div>
        )}

        {/* Doctor Detail Inline Section */}
      {selectedDoctor && specificIndividualData?.data && (
        <div className="mt-4 p-4 rounded-xl border border-[var(--theme-border)] bg-white">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider">
              Doctor Details
            </p>
            <button
              onClick={() => setSelectedDoctor(null)}
              className="h-6 w-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <LucideIcons.X size={14} />
            </button>
          </div>

          {specificIndividualData.data && (
            <div className="space-y-4">
              {/* Basic Info Card */}
              <div className="rounded-xl border border-[var(--theme-border)] bg-white p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider mb-1">
                      Basic Information
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] text-gray-500 font-medium">Full Name</p>
                        <p className="text-sm font-semibold text-[var(--theme-text-primary)]">
                          {specificIndividualData.data.individual?.fullName || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-medium">Profile Type</p>
                        <p className="text-sm font-semibold text-[var(--theme-text-primary)]">
                          {specificIndividualData.data.individual?.typeOfDoctorProfile || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-medium">Designation</p>
                        <p className="text-sm font-semibold text-[var(--theme-text-primary)]">
                          {specificIndividualData.data.individual?.designation || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-medium">Hospital</p>
                        <p className="text-sm font-semibold text-[var(--theme-text-primary)]">
                          {specificIndividualData.data.individual?.hospitalName || "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monthly Planning */}
              {specificIndividualData.data.monthlyPlanning && Object.keys(specificIndividualData.data.monthlyPlanning).length > 0 ? (
                <div className="rounded-xl border border-[var(--theme-border)] bg-white p-4">
                  <p className="text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider mb-3">
                    Monthly Planning
                  </p>
                  <div className="space-y-3">
                    {Object.entries(specificIndividualData.data.monthlyPlanning).map(([month, plans]) => (
                      <div key={month} className="border border-[var(--theme-border)] rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-3 py-2 border-b border-[var(--theme-border)]">
                          <p className="text-xs font-semibold text-[var(--theme-text-primary)]">{month}</p>
                        </div>
                        <div className="p-3">
                          {Array.isArray(plans) && plans.length > 0 ? (
                            <div className="space-y-2">
                              {plans.map((plan, idx) => (
                                <div key={idx} className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="font-medium text-[var(--theme-text-primary)]">
                                    {plan.nameOfDoctor}
                                  </span>
                                  <span className="text-gray-400">|</span>
                                  <span className="text-gray-600">{plan.selectOrganization}</span>
                                  <span className="text-gray-400">|</span>
                                  <span className="text-gray-500">
                                    {plan.createPlanningForDate ? new Date(plan.createPlanningForDate).toLocaleDateString() : "-"}
                                  </span>
                                  {plan.productToBePromoted && Array.isArray(plan.productToBePromoted) && plan.productToBePromoted.length > 0 && (
                                    <>
                                      <span className="text-gray-400">|</span>
                                      <div className="flex flex-wrap gap-1">
                                        {plan.productToBePromoted.map((product, pIdx) => (
                                          <span
                                            key={pIdx}
                                            className="px-2 py-0.5 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] text-[10px] font-medium"
                                          >
                                            {product}
                                          </span>
                                        ))}
                                      </div>
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-500">No plans for this month</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-[var(--theme-border)] bg-white p-4 text-center">
                  <p className="text-xs text-gray-500">No monthly planning data available</p>
                </div>
              )}
            </div>
          )}

          {!specificIndividualData?.data && selectedDoctor && (
            <div className="flex justify-center items-center py-10">
              <LoaderSpinner />
            </div>
          )}
        </div>
      )}
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
              {loading ? (
                <div className="flex items-center justify-center h-[260px]">
                  <LoaderSpinner />
                </div>
              ) : specialityChartData.length > 0 ? (
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
                      labelLine={{ stroke: "var(--theme-bg-sidebar)", strokeWidth: 1 }}
                    >
                      {specialityChartData.map((_, i) => (
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
                  No speciality data available
                </div>
              )}
            </div>

            {/* Right: Stats Cards */}
            {loading ? (
              <div className="space-y-2">
                <div className="bg-[var(--theme-card-bg)] rounded-xl p-3 border border-[var(--theme-border)] animate-pulse">
                  <div className="h-3 w-24 bg-gray-200 rounded mb-2" />
                  <div className="h-5 w-32 bg-gray-200 rounded" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-blue-50 rounded-xl p-3 border border-blue-100 animate-pulse">
                    <div className="h-3 w-16 bg-gray-200 rounded mb-2" />
                    <div className="h-6 w-10 bg-gray-200 rounded" />
                  </div>
                  <div className="bg-green-50 rounded-xl p-3 border border-green-100 animate-pulse">
                    <div className="h-3 w-16 bg-gray-200 rounded mb-2" />
                    <div className="h-6 w-10 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 animate-pulse">
                    <div className="h-3 w-20 bg-gray-200 rounded mb-2" />
                    <div className="h-6 w-8 bg-gray-200 rounded" />
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 animate-pulse">
                    <div className="h-3 w-20 bg-gray-200 rounded mb-2" />
                    <div className="h-6 w-8 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {/* Top Speciality Card */}
                <div className="bg-gradient-to-r from-[var(--theme-primary)]/10 to-[var(--theme-primary)]/5 rounded-xl p-3 border border-[var(--theme-primary)]/20">
                  <p className="text-xs text-[var(--theme-text-secondary)] font-medium">
                    🏆 Top Speciality
                  </p>
                  <p className="text-lg font-bold text-[var(--theme-text-primary)]">
                    {formatSpecialityName(topSpeciality?.name) || "N/A"}
                  </p>
                  <p className="text-sm text-[var(--theme-primary)]">
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
            )}
          </div>

          {/* Bottom: Speciality List */}
          {loading ? (
            <div className="mt-4 pt-4 border-t border-[var(--theme-border)]">
              <div className="flex flex-wrap gap-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-8 w-24 bg-gray-200 rounded-full animate-pulse" />
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-4 pt-4 border-t border-[var(--theme-border)]">
              <div className="flex flex-wrap gap-2">
                {specialityChartData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[var(--theme-card-bg)] rounded-full border border-[var(--theme-border)] hover:bg-[var(--theme-primary)]/10 transition-colors cursor-default"
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-[var(--theme-text-primary)]">
                      {formatSpecialityName(item.name)}
                    </span>
                    <span className="text-xs text-[var(--theme-primary)] font-medium">
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
          )}
        </ChartCard>

        {/* ✅ Target vs Achievement - Multiple Radial Bars */}
        <ChartCard
          title="Target vs Achievement"
          subtitle="Monthly, Quarterly & Yearly performance"
        >
          {loading ? (
            <div className="flex items-center justify-center h-52">
              <LoaderSpinner />
            </div>
          ) : (
            <>
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
                    fill: "var(--theme-primary)",
                  },
                  {
                    name: "Quarterly",
                    value: targetStats.quarterlyPercentage || 0,
                    fill: "var(--theme-highlight)",
                  },
                  {
                    name: "Yearly",
                    value: targetStats.yearlyPercentage || 0,
                    fill: "var(--theme-secondary)",
                  },
                ]}
                startAngle={225}
                endAngle={-45}
              >
                <RadialBar
                  background={{ fill: "var(--theme-bg-sidebar)" }}
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
                    border: "1px solid var(--theme-bg-sidebar)",
                    background: "#ffffff",
                    padding: "10px 14px",
                  }}
                  formatter={(value) => [`${value.toFixed(1)}%`, "Achievement"]}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 grid place-items-center pointer-events-none">
              <div className="text-center">
                <p className="text-2xl font-bold text-[var(--theme-primary)]">
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
            <div className="bg-[var(--theme-card-bg)] rounded-xl p-2.5 border border-[var(--theme-border)] text-center">
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: "var(--theme-primary)" }}
                />
                <p className="text-[10px] text-[var(--theme-text-secondary)] font-medium">
                  Monthly
                </p>
              </div>
              <p className="text-sm font-bold text-[var(--theme-text-primary)]">
                {targetStats.monthlyAchieved}/{targetStats.monthlyTarget}
              </p>
              <p
                className={`text-xs font-semibold ${targetStats.monthlyPercentage >= 100 ? "text-green-600" : targetStats.monthlyPercentage >= 80 ? "text-[var(--theme-primary)]" : "text-red-500"}`}
              >
                {targetStats.monthlyPercentage}%
              </p>
            </div>

            {/* Quarterly */}
            <div className="bg-[var(--theme-card-bg)] rounded-xl p-2.5 border border-[var(--theme-border)] text-center">
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: "var(--theme-highlight)" }}
                />
                <p className="text-[10px] text-[var(--theme-text-secondary)] font-medium">
                  Quarterly
                </p>
              </div>
              <p className="text-sm font-bold text-[var(--theme-text-primary)]">
                {targetStats.quarterlyAchieved}/{targetStats.quarterlyTarget}
              </p>
              <p
                className={`text-xs font-semibold ${targetStats.quarterlyPercentage >= 100 ? "text-green-600" : targetStats.quarterlyPercentage >= 80 ? "text-[var(--theme-primary)]" : "text-red-500"}`}
              >
                {targetStats.quarterlyPercentage}%
              </p>
            </div>

            {/* Yearly */}
            <div className="bg-[var(--theme-card-bg)] rounded-xl p-2.5 border border-[var(--theme-border)] text-center">
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: "var(--theme-secondary)" }}
                />
                <p className="text-[10px] text-[var(--theme-text-secondary)] font-medium">Yearly</p>
              </div>
              <p className="text-sm font-bold text-[var(--theme-text-primary)]">
                {targetStats.yearlyAchieved}/{targetStats.yearlyTarget}
              </p>
              <p
                className={`text-xs font-semibold ${targetStats.yearlyPercentage >= 100 ? "text-green-600" : targetStats.yearlyPercentage >= 80 ? "text-[var(--theme-primary)]" : "text-red-500"}`}
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
                  className="h-full bg-[var(--theme-primary)] rounded-full transition-all duration-500"
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
                  className="h-full bg-[var(--theme-highlight)] rounded-full transition-all duration-500"
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
                  className="h-full bg-[var(--theme-secondary)] rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(targetStats.yearlyPercentage || 0, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
            </>
          )}
        </ChartCard>
      </div>
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
      <div className="shadow overflow-x-auto">
        {/* Hospital Table - Using the new component */}
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
      </div>

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
