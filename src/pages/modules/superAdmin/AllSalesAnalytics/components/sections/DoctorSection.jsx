// components/sections/DoctorSection.jsx

import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { TiEye } from "react-icons/ti"
import { 
  Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, 
  RadialBar, RadialBarChart, ResponsiveContainer, Tooltip, 
  XAxis, YAxis, Scatter, ScatterChart, ZAxis, Line, LineChart
} from "recharts";
import { ChartCard, KpiCard, AchBadge, EmptyState } from '../analytics';
import { 
  Button, 
  Badge, 
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
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent,
} from '../common';
import { 
  COLORS, 
  D_SPECIALITIES, 
  D_SALES, 
  D_PRODUCTS, 
  MONTHLY_ACHIEVEMENT 
} from '../../data/analyticsData';
import LoaderSpinner from "../../../../../../components/uiComponents/loader/LoaderSpinner.jsx";
import Pagination from "../../../../../../components/uiComponents/pagination/Pagination.jsx";
import Select from "react-select";
import useDropdown from "../../../../../../hooks/dropdown/useDropdown";

function Mini({ label, value }) {
  return (
    <div className="rounded-xl border border-[var(--theme-bg-sidebar)] p-3 bg-[var(--theme-primary-bg)]">
      <p className="text-[11px] text-[var(--theme-accent)] uppercase tracking-wide">{label}</p>
      <p className="text-sm font-semibold mt-0.5">{value}</p>
    </div>
  );
}

export function DoctorSection({ 
  doctors, 
  filters, 
  doctorData, 
  doctorListData, 
  loading = false,
  tableLoading = false,
  onPageChange,
  onItemsPerPageChange,
  onSearch,
  onSalesPersonFilter,
}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);
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

  // ✅ Keep refs updated with latest callbacks
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    onSalesPersonFilterRef.current = onSalesPersonFilter;
  }, [onSalesPersonFilter]);

  // ✅ Debounced search - call API when search term changes
  useEffect(() => {
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

  // ✅ Sales person filter - call API when selection changes
  useEffect(() => {
    if (onSalesPersonFilterRef.current) {
      onSalesPersonFilterRef.current(selectedSalesPerson?.value || "");
    }
  }, [selectedSalesPerson]);

  // ✅ Process doctor summary data from API
  const doctorSummary = useMemo(() => {
    if (doctorData?.data) {
      return {
        totalIndividuals: doctorData.data.totalIndividuals || 0,
        totalSpecialities: doctorData.data.totalSpecialities || 0,
        totalVisits: doctorData.data.totalVisits || 0,
        successVisits: doctorData.data.successVisits || 0,
        successPercentage: doctorData.data.successPercentage || 0,
      };
    }
    return {
      totalIndividuals: 0,
      totalSpecialities: 0,
      totalVisits: 0,
      successVisits: 0,
      successPercentage: 0,
    };
  }, [doctorData]);

  // ✅ Use doctor list data from detailed API
  const doctorList = useMemo(() => {
    if (doctorListData?.data && Array.isArray(doctorListData.data)) {
      return doctorListData.data.map((item, index) => ({
        id: item._id || `doctor-${index}`,
        doctorName: item.doctorName || 'N/A',
        associatedHospital: item.associatedHospital || 'N/A',
        speciality: item.speciality || 'N/A',
        district: item.district || 'N/A',
        state: item.state || 'N/A',
        city: item.city || 'N/A',
        totalVisit: item.totalVisit || 0,
        totalTarget: item.totalTarget || 0,
        totalAchievement: item.totalAchievement || 0,
        salesPersonName: item.salesPersonName || 'N/A',
        achievement: item.totalTarget > 0 
          ? Math.round((item.totalAchievement / item.totalTarget) * 100) 
          : 0,
        qualityScore: item.totalTarget > 0 
          ? Math.round((item.totalAchievement / item.totalTarget) * 100) 
          : 0,
        status: item.totalAchievement > 0 ? "Active" : "Inactive",
        _raw: item,
      }));
    }
    if (doctors && Array.isArray(doctors) && doctors.length > 0) {
      return doctors;
    }
    return [];
  }, [doctorListData, doctors]);

  // ✅ Get sales persons from API dropdown
  const salesPersonOptions = useMemo(() => {
    if (salesExecutive && Array.isArray(salesExecutive)) {
      return salesExecutive.map(sp => ({ label: sp, value: sp }));
    }
    return [];
  }, [salesExecutive]);

  // ✅ Pagination info from API
  const paginationInfo = useMemo(() => {
    if (doctorListData) {
      return {
        currentPage: doctorListData?.pagination.currentPage || 1,
        pageSize: doctorListData?.pagination.limit || 10,
        totalPages: doctorListData?.pagination.totalPages ,
        totalRecords: doctorListData?.pagination.totalRecords || 0,
      };
    }
    return {
      currentPage: 1,
      pageSize: 10,
      totalPages: 1,
      totalRecords: doctorList.length,
    };
  }, [doctorListData, doctorList]);

  const currentPage = paginationInfo.currentPage;
  const itemsPerPage = paginationInfo.pageSize;
  const totalRecords = paginationInfo.totalRecords;
  const totalPages = paginationInfo.totalPages;

  // ✅ Calculate statistics from list data
  const total = doctorList.length;
  const active = doctorList.filter(d => (d.achievement || 0) >= 60).length;
  const productive = doctorList.filter(d => (d.achievement || 0) >= 70).length;
  const avgAch = total ? Math.round(doctorList.reduce((s, d) => s + (d.achievement || 0), 0) / total) : 0;
  const avgQuality = total ? Math.round(doctorList.reduce((s, d) => s + (d.qualityScore || 0), 0) / total) : 0;

  const displayTotal = doctorSummary.totalIndividuals || total;
  const displayActive = doctorSummary.successVisits > 0 ? Math.min(doctorSummary.successVisits, displayTotal) : active;
  const displayCompleted = doctorSummary.successVisits || 0;
  const displayAvgAch = doctorSummary.successPercentage || avgAch;
  const displayAvgQuality = doctorSummary.successPercentage ? Math.round(doctorSummary.successPercentage) : avgQuality;

  // ✅ Leaderboard
  const leaderboard = [...doctorList]
    .sort((a, b) => (b.achievement || 0) - (a.achievement || 0))
    .slice(0, 10);

  // ✅ Speciality contribution
  const specContrib = [...new Set(doctorList.map(d => d.speciality).filter(s => s && s !== 'N/A'))].map((s, i) => ({ 
    name: s, 
    value: doctorList.filter(d => d.speciality === s).reduce((sum, d) => sum + (d.achievement || 0), 0), 
    fill: COLORS[i % COLORS.length] 
  })).filter(s => s.value > 0);
  
  const topSpec = [...specContrib].sort((a, b) => b.value - a.value)[0]?.name ?? "—";

  // ✅ Sales × Speciality matrix
  const matrix = D_SALES.map(sp => ({ 
    sales: sp, 
    cells: D_SPECIALITIES.map(sc => doctorList.filter(d => d.salesPerson === sp && d.speciality === sc && (d.qualityScore || 0) >= 60).length) 
  }));
  const matrixMax = Math.max(1, ...matrix.flatMap(m => m.cells));

  // ✅ Product stack
  const prodStack = D_PRODUCTS.map(p => {
    const arr = doctorList.filter(d => d.productName === p);
    return { name: p, Complete: arr.filter(d => d.status === "Active").length, Incomplete: arr.filter(d => d.status === "Inactive").length };
  }).slice(0, 10);

  // ✅ Scatter data
  const scatter = D_PRODUCTS.map(p => {
    const arr = doctorList.filter(d => d.productName === p);
    if (!arr.length) return null;
    return { 
      name: p, 
      price: 100 + Math.random() * 400, 
      achievement: Math.round(arr.reduce((s, d) => s + (d.achievement || 0), 0) / arr.length), 
      doctors: arr.length 
    };
  }).filter(Boolean);

  // ✅ Quality buckets
  const qBuckets = [
    { label: "Excellent (90-100)", count: doctorList.filter(d => (d.qualityScore || 0) >= 90).length, tone: "#22c55e" },
    { label: "Good (75-89)", count: doctorList.filter(d => (d.qualityScore || 0) >= 75 && (d.qualityScore || 0) < 90).length, tone: "#3b82f6" },
    { label: "Average (60-74)", count: doctorList.filter(d => (d.qualityScore || 0) >= 60 && (d.qualityScore || 0) < 75).length, tone: "#eab308" },
    { label: "Needs Attention (<60)", count: doctorList.filter(d => (d.qualityScore || 0) < 60).length, tone: "#ef4444" },
  ];

  // ✅ Pagination handlers - call parent props
  const handlePageChange = (newPage) => {
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  const handleItemsPerPageChange = (newLimit) => {
    if (onItemsPerPageChange) {
      onItemsPerPageChange(newLimit);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <LoaderSpinner />
          <p className="mt-4 text-[var(--theme-text-secondary)] font-medium">Loading doctor data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-[var(--theme-accent)] mb-2">Doctor Analytics</h2>
      <p className="text-sm text-gray-600 mb-6">
        Doctor-wise performance and product engagement intelligence
        {filters.speciality && <span className="ml-2 font-medium text-[var(--theme-primary)]">Filtered by: {filters.speciality}</span>}
        {filters.segment && <span className="ml-2 font-medium text-[var(--theme-primary)]">| {filters.segment}</span>}
        {filters.salesPerson && <span className="ml-2 font-medium text-[var(--theme-primary)]">| {filters.salesPerson}</span>}
      </p>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard 
          title="Total Doctors" 
          value={displayTotal.toLocaleString()} 
          trend={12} 
          accent="info" 
          icon={LucideIcons.Users} 
        />
        <KpiCard 
          title="Total Specialities" 
          value={doctorSummary.totalSpecialities.toLocaleString()} 
          trend={8} 
          accent="success" 
          icon={LucideIcons.Stethoscope} 
        />
        <KpiCard 
          title="Total Visits" 
          value={doctorSummary.totalVisits.toLocaleString()} 
          trend={6} 
          accent="target" 
          icon={LucideIcons.Activity} 
        />
        <KpiCard 
          title="Success Visits" 
          value={displayCompleted.toLocaleString()} 
          trend={4} 
          accent="success" 
          icon={LucideIcons.CheckCircle2} 
        />
        <KpiCard 
          title="Avg Achievement" 
          value={`${displayAvgAch.toFixed(2)}%`} 
          trend={9} 
          accent="product" 
          icon={LucideIcons.Target} 
        />
        <KpiCard 
          title="Avg Quality Score" 
          value={`${displayAvgQuality}/100`} 
          trend={3} 
          accent="product" 
          icon={LucideIcons.Sparkles} 
        />
      </div>

      {/* ✅ Doctor Directory Table */}
      <ChartCard title="Doctor Directory" subtitle="Click a row for full drill-down" className="mt-4">
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <LucideIcons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input
              type="text"
              placeholder="Search by doctor"
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
                <TableHead className="text-base font-semibold">Doctor</TableHead>
                <TableHead className="text-base font-semibold">Hospital</TableHead>
                <TableHead className="text-base font-semibold">Speciality</TableHead>
                 <TableHead className="text-base font-semibold">State</TableHead>
               <TableHead className="text-base font-semibold">District</TableHead>
                <TableHead className="text-base font-semibold">City</TableHead>
                <TableHead className="text-base font-semibold text-right">Visits</TableHead>
                <TableHead className="text-base font-semibold text-right">Target</TableHead>
                <TableHead className="text-base font-semibold text-right">Achievement</TableHead>
                 <TableHead className="text-base font-semibold text-right">Sales Person</TableHead>
                <TableHead className="text-base font-semibold">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-200">
              {tableLoading ? (
                <TableRow>
                  <TableCell colSpan={10} className="p-8 text-center">
                    <div className="flex justify-center items-center w-full">
                      <LoaderSpinner />
                    </div>
                  </TableCell>
                </TableRow>
              ) : doctorList.length > 0 ? (
                doctorList.map((d, index) => {
                  const achievement = d.achievement || 0;
                  const isActive = d.status === "Active";
                  
                  return (
                    <TableRow 
                      key={d.id || index} 
                      className="cursor-pointer hover:bg-gray-50 transition-all"
                      onClick={() => setOpen(d)}
                    >
                      <td className="p-4 text-[17px] font-normal text-[#252C58]">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-4 py-3 text-[15px] whitespace-nowrap font-medium text-[var(--theme-primary)] hover:underline">
                        {d.doctorName || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                        {d.associatedHospital || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                        <Badge variant="secondary" className="rounded-full bg-[var(--theme-bg-light)] text-[var(--theme-text-secondary)] border-[var(--theme-border)]">
                          {d.speciality || 'N/A'}
                        </Badge>
                      </td>
                           <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                        {d.state || 'N/A'}
                      </td>
                        <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                        {d.district || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                        {d.city || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-[15px] whitespace-nowrap text-right">
                        {d.totalVisit || 0}
                      </td>
                      <td className="px-4 py-3 text-[15px] whitespace-nowrap text-right">
                        {d.totalTarget || 0}
                      </td>
                      <td className="px-4 py-3 text-[15px] whitespace-nowrap text-right">
                        <AchBadge v={achievement} />
                      </td>
                         <td className="px-4 py-3 text-[15px] whitespace-nowrap text-right">
                        {d.salesPersonName || "N/A"}
                      </td>
                              <td className="p-4 text-center align-middle">
                                                  <button
                                                    onClick={() => { navigate(`/sales-analyticsAll/doctor-profile-breakdown/${d.typeOfDoctorProfile}/${d.id}`) }}
                                                    className="text-[var(--theme-primary)] hover:bg-[var(--theme-primary)]/10 rounded-full w-9 h-9 flex items-center justify-center transition-colors"
                                                    aria-label="View details"
                                                  >
                                                    <TiEye size={18} />
                                                  </button>
                                </td>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-sm text-gray-500">
                    No doctors match your search or filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* ✅ Pagination - Using the same Pagination component as Dashboard */}
            <div className="rounded-b-2xl bg-white shadow-lg border border-gray-200 overflow-hidden">
          {!loading && totalRecords > 0 && (
            <Pagination
              currentPage={currentPage}
              totalItems={totalRecords}
              itemsPerPage={itemsPerPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}
        </div>
      </ChartCard>

      {/* Doctor Detail Dialog */}
      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[var(--theme-accent)]">
              <LucideIcons.Stethoscope size={18} className="text-[var(--theme-primary)]" />
              {open?.doctorName || 'Doctor Details'}
            </DialogTitle>
          </DialogHeader>
          {open && (
            <Tabs defaultValue="profile">
              <TabsList className="rounded-xl">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="visits">Visits</TabsTrigger>
              </TabsList>
              <TabsContent value="profile" className="grid grid-cols-2 gap-3 mt-4">
                <Mini label="Doctor" value={open.doctorName || 'N/A'} />
                <Mini label="Hospital" value={open.associatedHospital || 'N/A'} />
                <Mini label="Speciality" value={open.speciality || 'N/A'} />
                <Mini label="City" value={open.city || 'N/A'} />
                <Mini label="District" value={open.district || 'N/A'} />
                <Mini label="State" value={open.state || 'N/A'} />
              </TabsContent>
              <TabsContent value="performance" className="grid grid-cols-2 gap-3 mt-4">
                <Mini label="Total Visits" value={String(open.totalVisit || 0)} />
                <Mini label="Total Target" value={String(open.totalTarget || 0)} />
                <Mini label="Total Achievement" value={String(open.totalAchievement || 0)} />
                <Mini label="Achievement %" value={`${open.achievement || 0}%`} />
                <Mini label="Status" value={open.status || 'Inactive'} />
                <Mini label="Quality Score" value={`${open.qualityScore || 0}/100`} />
              </TabsContent>
              <TabsContent value="visits" className="mt-4">
                <div className="rounded-xl border border-[var(--theme-bg-sidebar)] p-4">
                  <p className="font-semibold text-[var(--theme-accent)]">Visit Summary</p>
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    <Mini label="Total Visits" value={String(open.totalVisit || 0)} />
                    <Mini label="Target" value={String(open.totalTarget || 0)} />
                    <Mini label="Achieved" value={String(open.totalAchievement || 0)} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}