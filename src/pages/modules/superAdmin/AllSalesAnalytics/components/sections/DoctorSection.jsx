// components/sections/DoctorSection.jsx

import React, { useMemo, useState } from "react";
import * as LucideIcons from "lucide-react";
import { 
  Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, 
  RadialBar, RadialBarChart, ResponsiveContainer, Tooltip, 
  XAxis, YAxis, Scatter, ScatterChart, ZAxis, Line, LineChart
} from "recharts";
import { ChartCard, KpiCard, AchBadge, EmptyState } from '../analytics';
import { 
  Button, 
  Badge, 
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

function Mini({ label, value }) {
  return (
    <div className="rounded-xl border border-[#E8B59F] p-3 bg-[#FBE9E7]">
      <p className="text-[11px] text-[#A54A29] uppercase tracking-wide">{label}</p>
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
  onPageChange,
  onItemsPerPageChange,
}) {
  const [open, setOpen] = useState(null);

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

  // ✅ Pagination info from API
  const paginationInfo = useMemo(() => {
    if (doctorListData) {
      return {
        currentPage: doctorListData.currentPage || 1,
        pageSize: doctorListData.pageSize || 10,
        totalPages: doctorListData.totalPages || 1,
        totalRecords: doctorListData.totalRecords || 0,
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
          <p className="mt-4 text-[#8B5A3C] font-medium">Loading doctor data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight text-[#A54A29] mb-2">Doctor Analytics</h2>
      <p className="text-sm text-gray-600 mb-6">
        Doctor-wise performance and product engagement intelligence
        {filters.speciality && <span className="ml-2 font-medium text-[#C6693C]">Filtered by: {filters.speciality}</span>}
        {filters.segment && <span className="ml-2 font-medium text-[#C6693C]">| {filters.segment}</span>}
        {filters.salesPerson && <span className="ml-2 font-medium text-[#C6693C]">| {filters.salesPerson}</span>}
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

      {/* Leaderboard + Speciality Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <ChartCard title="Doctor Performance Leaderboard" subtitle="Top 10 doctors by achievement %" className="lg:col-span-2">
          {leaderboard.length === 0 ? <EmptyState /> : (
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={leaderboard} layout="vertical" margin={{ left: 8, right: 24 }}>
                <CartesianGrid horizontal={false} stroke="#E8B59F" />
                <XAxis type="number" domain={[0, 100]} stroke="#6b7280" fontSize={11} unit="%" />
                <YAxis dataKey="doctorName" type="category" stroke="#6b7280" fontSize={11} width={140} />
                <Tooltip 
                  contentStyle={{ borderRadius: 12, border: "1px solid #E8B59F", background: "#ffffff" }}
                  formatter={(value, name, props) => {
                    const item = props.payload;
                    return [`${value}%`, item.doctorName];
                  }}
                />
                <Bar dataKey="achievement" radius={[0, 8, 8, 0]} label={{ position: "right", fontSize: 11, fill: "#6b7280", formatter: (v) => `${v}%` }}>
                  {leaderboard.map((d, i) => <Cell key={i} fill={(d.achievement || 0) > 85 ? "#22c55e" : (d.achievement || 0) >= 70 ? "#eab308" : "#ef4444"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
        <ChartCard title="Speciality Contribution" subtitle="Share of total achievement">
          {specContrib.length === 0 ? <EmptyState /> : (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={specContrib} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                    {specContrib.map((s, i) => <Cell key={i} fill={s.fill} />)}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: 12, border: "1px solid #E8B59F", background: "#ffffff" }}
                    formatter={(value, name) => [`${value}% achievement`, name]}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <Mini label="Top speciality" value={topSpec} />
                <Mini label="Total doctors" value={String(total)} />
                <Mini label="Avg target" value={String(Math.round(doctorList.reduce((s, d) => s + (d.totalTarget || 0), 0) / (total || 1)))} />
                <Mini label="Avg achievement" value={`${displayAvgAch.toFixed(2)}%`} />
              </div>
            </>
          )}
        </ChartCard>
      </div>

      {/* Matrix + Product Completion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <ChartCard title="Sales Person × Speciality" subtitle="Active doctors matrix">
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-separate border-spacing-1">
              <thead>
                <tr>
                  <th className="text-left text-gray-500 font-medium p-2">Sales</th>
                  {D_SPECIALITIES.map(s => <th key={s} className="text-gray-500 font-medium p-2 text-center">{s.slice(0, 6)}</th>)}
                </tr>
              </thead>
              <tbody>
                {matrix.map(row => (
                  <tr key={row.sales}>
                    <td className="font-medium p-2">{row.sales}</td>
                    {row.cells.map((v, i) => (
                      <td key={i} className="p-2 text-center rounded-md font-semibold" style={{ background: `color-mix(in oklch, #C6693C ${(v / matrixMax) * 70}%, transparent)` }}>
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
        <ChartCard title="Product Completion Intelligence" subtitle="Complete vs Incomplete adoption">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={prodStack} margin={{ left: 0, right: 8 }}>
              <CartesianGrid vertical={false} stroke="#E8B59F" />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={10} angle={-25} textAnchor="end" height={60} />
              <YAxis stroke="#6b7280" fontSize={11} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E8B59F", background: "#ffffff" }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Complete" stackId="a" fill="#22c55e" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Incomplete" stackId="a" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Price vs Achievement + Quality Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <ChartCard title="Price vs Achievement" subtitle="Bubble = # doctors" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={320}>
            <ScatterChart margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
              <CartesianGrid stroke="#E8B59F" />
              <XAxis type="number" dataKey="price" name="Price" stroke="#6b7280" fontSize={11} unit="₹" />
              <YAxis type="number" dataKey="achievement" name="Achievement" stroke="#6b7280" fontSize={11} unit="%" domain={[0, 100]} />
              <ZAxis type="number" dataKey="doctors" range={[80, 600]} />
              <Tooltip 
                cursor={{ strokeDasharray: "3 3" }} 
                contentStyle={{ borderRadius: 12, border: "1px solid #E8B59F", background: "#ffffff" }}
                formatter={(value, name, props) => {
                  if (name === 'Price') return [`₹${value}`, name];
                  if (name === 'Achievement') return [`${value}%`, name];
                  if (name === 'doctors') return [`${value} doctors`, name];
                  return [value, name];
                }}
              />
              <Scatter data={scatter} fill="#C6693C" fillOpacity={0.7} />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Quality Analytics" subtitle="Average doctor quality">
          <div className="relative h-40">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ name: "q", value: displayAvgQuality, fill: "#C6693C" }]} startAngle={225} endAngle={-45}>
                <RadialBar background={{ fill: "#E8B59F" }} dataKey="value" cornerRadius={20} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 grid place-items-center pointer-events-none">
              <div className="text-center">
                <p className="text-3xl font-bold text-[#C6693C]">{displayAvgQuality}</p>
                <p className="text-[11px] text-gray-500">/ 100</p>
              </div>
            </div>
          </div>
          <div className="space-y-2 mt-3">
            {qBuckets.map(b => (
              <div key={b.label} className="flex items-center justify-between text-sm px-3 py-2 rounded-xl bg-[#FBE9E7] border border-[#E8B59F]">
                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: b.tone }} />{b.label}</span>
                <span className="font-semibold">{b.count}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* ✅ Doctor Directory Table */}
      <ChartCard title="Doctor Directory" subtitle="Click a row for full drill-down" className="mt-4">
        <div className="overflow-x-auto -mx-2 max-h-[520px]">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow className="bg-[#FFF5F0]">
                <TableHead className="text-base font-semibold">Sr. No.</TableHead>
                <TableHead className="text-base font-semibold">Doctor</TableHead>
                <TableHead className="text-base font-semibold">Hospital</TableHead>
                <TableHead className="text-base font-semibold">Speciality</TableHead>
                <TableHead className="text-base font-semibold">City</TableHead>
                <TableHead className="text-base font-semibold">District</TableHead>
                <TableHead className="text-base font-semibold text-right">Visits</TableHead>
                <TableHead className="text-base font-semibold text-right">Target</TableHead>
                <TableHead className="text-base font-semibold text-right">Achievement</TableHead>
                <TableHead className="text-base font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-200">
              {doctorList.length > 0 ? (
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
                      <td className="px-4 py-3 text-[15px] whitespace-nowrap font-medium text-[#C6693C] hover:underline">
                        {d.doctorName || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                        {d.associatedHospital || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                        <Badge variant="secondary" className="rounded-full bg-[#FFF5F0] text-[#8B5A3C] border-[#E8C9B8]">
                          {d.speciality || 'N/A'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                        {d.city || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                        {d.district || 'N/A'}
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
                      <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${isActive ? "bg-green-500/15 text-green-500" : "bg-red-500/15 text-red-500"}`}>
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-sm text-gray-500">
                    No doctors match your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* ✅ Pagination - Using the same Pagination component as Dashboard */}
        <div className="px-4 py-3 border-t border-[#E8C9B8] bg-gray-50 rounded-b-2xl">
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
            <DialogTitle className="flex items-center gap-2 text-[#A54A29]">
              <LucideIcons.Stethoscope size={18} className="text-[#C6693C]" />
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
                <div className="rounded-xl border border-[#E8B59F] p-4">
                  <p className="font-semibold text-[#A54A29]">Visit Summary</p>
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