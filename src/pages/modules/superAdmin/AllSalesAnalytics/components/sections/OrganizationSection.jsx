// components/sections/OrganizationSection.jsx

import React, { useMemo, useState } from "react";
import * as LucideIcons from "lucide-react";
import { 
  Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, 
  RadialBar, RadialBarChart, ResponsiveContainer, Tooltip, 
  XAxis, YAxis, Scatter, ScatterChart, ZAxis, ReferenceLine
} from "recharts";
import { ChartCard, KpiCard, EmptyState } from '../analytics';
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
  SelectItem
} from '../common';
import { 
  COLORS, 
  D_SPECIALITIES, 
  D_STATES, 
  PENETRATION_FUNNEL 
} from '../../data/analyticsData';
import LoaderSpinner from "../../../../../../components/uiComponents/loader/LoaderSpinner.jsx";

function MiniStat({ label, value, icon, tone, subtitle }) {
  return (
    <div className="rounded-xl border border-[#E8C9B8] p-4 bg-[#FFF8F5]">
      <div className="flex items-center gap-2">
        {icon && <span className="text-[#C6693C]">{icon}</span>}
        <p className="text-[10px] font-semibold text-[#8B5A3C] uppercase tracking-wider">
          {label}
        </p>
      </div>
      <p className={`text-2xl font-bold mt-1 ${tone === "success" ? "text-green-600" : tone === "info" ? "text-blue-600" : "text-[#5A2D1A]"}`}>
        {value}
      </p>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  );
}

function Sel({ label, value, onChange, options }) {
  return (
    <div className="min-w-0">
      <label className="text-[11px] font-medium text-[#A54A29] uppercase tracking-wide">{label}</label>
      <Select value={value || undefined} onValueChange={onChange}>
        <SelectTrigger className="mt-1 rounded-xl bg-white"><SelectValue placeholder="All" /></SelectTrigger>
        <SelectContent>
          {options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}

function Gauge({ label, target, pct }) {
  const achieved = Math.round((target * pct) / 100);
  const remaining = Math.max(0, target - achieved);
  return (
    <div className="rounded-2xl border border-[#E8B59F] p-4 bg-[#FBE9E7]">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-[#A54A29]">{label}</p>
        <span className="text-xs text-gray-500">{pct}%</span>
      </div>
      <div className="relative h-28">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ v: pct, fill: "#C6693C" }]} startAngle={225} endAngle={-45}>
            <RadialBar background={{ fill: "#E8B59F" }} dataKey="v" cornerRadius={20} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <p className="text-2xl font-bold text-[#C6693C]">{pct}%</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1 mt-2 text-center text-[11px]">
        <div><p className="text-gray-500">Target</p><p className="font-semibold text-[#A54A29]">{target.toLocaleString()}</p></div>
        <div><p className="text-gray-500">Achieved</p><p className="font-semibold text-green-500">{achieved.toLocaleString()}</p></div>
        <div><p className="text-gray-500">Remaining</p><p className="font-semibold text-[#A54A29]">{remaining.toLocaleString()}</p></div>
      </div>
    </div>
  );
}

function M({ label, value }) {
  return (
    <div className="rounded-xl border border-[#E8B59F] p-3 bg-[#FBE9E7]">
      <p className="text-[11px] text-[#A54A29] uppercase tracking-wide">{label}</p>
      <p className="text-lg font-semibold mt-0.5">{value}</p>
    </div>
  );
}

export function OrganizationSection({ 
  orgs, 
  filters, 
  organizationDashboardData, 
  loading = false 
}) {
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [hSpec, setHSpec] = useState("");
  const [status, setStatus] = useState("");
  const [drill, setDrill] = useState(null);
  const [distMetric, setDistMetric] = useState("hospitals");

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

  // ✅ Calculate derived metrics
  const derivedMetrics = useMemo(() => {
    const total = dashboardStats.totalOrganizations || 1;
    return {
      avgBedsPerHospital: Math.round(dashboardStats.totalBeds / total),
      avgICUPerHospital: Math.round(dashboardStats.totalICUBeds / total),
      avgOTPerHospital: Math.round(dashboardStats.totalOperationTheatres / total),
      govtPercentage: dashboardStats.govtHospitals > 0 
        ? Math.round((dashboardStats.govtHospitals / total) * 100) 
        : 0,
      privatePercentage: dashboardStats.privateHospitals > 0 
        ? Math.round((dashboardStats.privateHospitals / total) * 100) 
        : 0,
      surgeriesPerHospital: Math.round(dashboardStats.totalSurgeries / total),
    };
  }, [dashboardStats]);

  // ✅ Hospital type distribution for chart
  const hospitalTypeData = useMemo(() => {
    return [
      { name: "Government", value: dashboardStats.govtHospitals, fill: "#3b82f6" },
      { name: "Private", value: dashboardStats.privateHospitals, fill: "#22c55e" },
    ].filter(d => d.value > 0);
  }, [dashboardStats]);

  // ✅ Infrastructure metrics for display
  const infrastructureMetrics = useMemo(() => {
    return [
      { 
        label: "Total Beds", 
        value: dashboardStats.totalBeds.toLocaleString(), 
        icon: <LucideIcons.Bed size={18} />,
        subtitle: `${derivedMetrics.avgBedsPerHospital} avg per hospital`
      },
      { 
        label: "ICU Beds", 
        value: dashboardStats.totalICUBeds.toLocaleString(), 
        icon: <LucideIcons.HeartPulse size={18} />,
        subtitle: `${derivedMetrics.avgICUPerHospital} avg per hospital`
      },
      { 
        label: "Operation Theatres", 
        value: dashboardStats.totalOperationTheatres.toLocaleString(), 
        icon: <LucideIcons.Scissors size={18} />,
        subtitle: `${derivedMetrics.avgOTPerHospital} avg per hospital`
      },
      { 
        label: "Total Surgeries", 
        value: dashboardStats.totalSurgeries.toLocaleString(), 
        icon: <LucideIcons.Activity size={18} />,
        subtitle: `${derivedMetrics.surgeriesPerHospital} per hospital`
      },
    ];
  }, [dashboardStats, derivedMetrics]);

  // ✅ Filtered orgs for district data
  const filtered = useMemo(() => orgs || [], [orgs]);

  const resetFilters = () => {
    setState("");
    setDistrict("");
    setCity("");
    setType("");
    setHSpec("");
    setStatus("");
  };

  // ✅ District data for chart
  const districtData = useMemo(() => {
    const districts = ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad", "Solapur", "Amravati"];
    return districts.map(d => {
      const arr = filtered.filter(o => o.district === d);
      return { 
        district: d, 
        hospitals: arr.length, 
        beds: arr.reduce((s, o) => s + (o.beds || 0), 0), 
        surgeries: arr.reduce((s, o) => s + (o.totalSurgeriesCalendarYear || 0), 0), 
        achievement: arr.length ? Math.round(arr.reduce((s, o) => s + (o.productAchievement || 0), 0) / arr.length) : 0 
      };
    }).filter(d => d.hospitals > 0);
  }, [filtered]);

  // ✅ Scatter data for infrastructure
  const scatterData = useMemo(() => {
    return filtered.map(o => ({ 
      name: o.organizationName, 
      beds: o.beds || 0, 
      surgeries: o.totalSurgeriesCalendarYear || 0, 
      id: o.id 
    }));
  }, [filtered]);

  // ✅ Revenue opportunity data
  const revenue = useMemo(() => {
    return [...filtered].map(o => {
      const est = (o.quantity || 0) * (o.price || 0);
      const score = Math.round((o.beds || 0) * 0.2 + (o.totalSurgeriesCalendarYear || 0) * 0.5 + (o.productAchievement || 0) * 0.3);
      return { ...o, estimatedRevenue: est, opportunityScore: score };
    }).sort((a, b) => b.opportunityScore - a.opportunityScore).slice(0, 15);
  }, [filtered]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <LoaderSpinner />
          <p className="mt-4 text-[#8B5A3C] font-medium">Loading organization data...</p>
        </div>
      </div>
    );
  }

  // ✅ No data state
  if (!organizationDashboardData && filtered.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-[#A54A29] mb-2">
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
      <h2 className="text-2xl font-semibold tracking-tight text-[#A54A29] mb-2">
        Organization Analytics
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Hospital infrastructure, capacity, and surgery analytics
        {filters.state && <span className="ml-2 font-medium text-[#C6693C]">Filtered by: {filters.state}</span>}
        {filters.district && <span className="ml-2 font-medium text-[#C6693C]">| {filters.district}</span>}
        {filters.city && <span className="ml-2 font-medium text-[#C6693C]">| {filters.city}</span>}
      </p>

      {/* Filters Section */}
      <div className="rounded-3xl bg-white border border-[#E8B59F] shadow-sm p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <LucideIcons.Filter size={16} className="text-[#C6693C]" />
          <h2 className="text-sm font-semibold text-[#A54A29]">Organization Filters</h2>
          <span className="ml-auto">
            <Button variant="ghost" size="sm" onClick={resetFilters} className="rounded-xl">
              <LucideIcons.RotateCcw size={14} /> Reset
            </Button>
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          <Sel label="State" value={state} onChange={setState} options={D_STATES} />
          <Sel label="District" value={district} onChange={setDistrict} options={["Mumbai", "Pune", "Nagpur", "Nashik", "Thane"]} />
          <Sel label="City" value={city} onChange={setCity} options={["Mumbai", "Pune", "Nagpur"]} />
          <Sel label="Type" value={type} onChange={setType} options={["Government", "Private", "Trust"]} />
          <Sel label="Speciality" value={hSpec} onChange={setHSpec} options={D_SPECIALITIES} />
          <Sel label="Product Status" value={status} onChange={setStatus} options={["Complete", "Incomplete"]} />
          <Sel label="Quarter" value="" onChange={() => {}} options={["Q1", "Q2", "Q3", "Q4"]} />
          <Sel label="Year" value="" onChange={() => {}} options={["2024", "2025", "2026"]} />
        </div>
      </div>

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
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: '#E8B59F', strokeWidth: 1 }}
                >
                  {hospitalTypeData.map((item, i) => (
                    <Cell key={i} fill={item.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: 12, border: "1px solid #E8B59F", background: "#ffffff" }}
                  formatter={(value, name) => [`${value} hospitals`, name]}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-100">
              <p className="text-xs text-blue-600 font-medium">🏛️ Government</p>
              <p className="text-xl font-bold text-blue-700">{dashboardStats.govtHospitals}</p>
              <p className="text-xs text-blue-500">{derivedMetrics.govtPercentage}%</p>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center border border-green-100">
              <p className="text-xs text-green-600 font-medium">🏥 Private</p>
              <p className="text-xl font-bold text-green-700">{dashboardStats.privateHospitals}</p>
              <p className="text-xs text-green-500">{derivedMetrics.privatePercentage}%</p>
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
        <div className="bg-gradient-to-r from-[#C6693C]/10 to-[#C6693C]/5 rounded-xl p-4 border border-[#C6693C]/20 text-center">
          <p className="text-xs text-[#8B5A3C] font-medium">🏥 Avg Beds/Hospital</p>
          <p className="text-2xl font-bold text-[#5A2D1A]">{derivedMetrics.avgBedsPerHospital}</p>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200 text-center">
          <p className="text-xs text-blue-600 font-medium">🛏️ Avg ICU/Hospital</p>
          <p className="text-2xl font-bold text-blue-700">{derivedMetrics.avgICUPerHospital}</p>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100/50 rounded-xl p-4 border border-green-200 text-center">
          <p className="text-xs text-green-600 font-medium">🔬 Avg OT/Hospital</p>
          <p className="text-2xl font-bold text-green-700">{derivedMetrics.avgOTPerHospital}</p>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-200 text-center">
          <p className="text-xs text-purple-600 font-medium">📊 Surgeries/Hospital</p>
          <p className="text-2xl font-bold text-purple-700">{derivedMetrics.surgeriesPerHospital}</p>
        </div>
      </div>

      {/* District Coverage Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <ChartCard title="District Coverage" subtitle="Click a bar to drill down" className="lg:col-span-2" action={
          <div className="flex gap-1 flex-wrap">
            {["hospitals", "beds", "surgeries", "achievement"].map(m => (
              <button key={m} onClick={() => setDistMetric(m)} className={`text-xs px-3 py-1.5 rounded-full border capitalize ${distMetric === m ? "bg-[#C6693C] text-white border-[#C6693C]" : "border-[#E8B59F] text-gray-500 hover:bg-[#FFC4A2]"}`}>{m}</button>
            ))}
          </div>
        }>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={districtData} margin={{ left: 0, right: 8 }}>
              <CartesianGrid vertical={false} stroke="#E8B59F" />
              <XAxis dataKey="district" stroke="#6b7280" fontSize={11} />
              <YAxis stroke="#6b7280" fontSize={11} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E8B59F", background: "#ffffff" }} />
              <Bar dataKey={distMetric} radius={[8, 8, 0, 0]} onClick={(d) => setDrill(d.district)}>
                {districtData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} cursor="pointer" />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Hospital Infrastructure Intelligence */}
        <ChartCard title="Hospital Infrastructure Intelligence" subtitle="Beds vs annual surgeries (quadrant view)">
          <div className="relative">
            <ResponsiveContainer width="100%" height={340}>
              <ScatterChart margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                <CartesianGrid stroke="#E8B59F" />
                <XAxis type="number" dataKey="beds" name="Beds" stroke="#6b7280" fontSize={11} />
                <YAxis type="number" dataKey="surgeries" name="Surgeries" stroke="#6b7280" fontSize={11} />
                <ZAxis range={[60, 60]} />
                <ReferenceLine x={300} stroke="#E8B59F" strokeDasharray="4 4" />
                <ReferenceLine y={600} stroke="#E8B59F" strokeDasharray="4 4" />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ borderRadius: 12, border: "1px solid #E8B59F", background: "#ffffff" }} />
                <Scatter data={scatterData} fill="#C6693C" fillOpacity={0.6} />
              </ScatterChart>
            </ResponsiveContainer>
            <div className="absolute top-2 right-3 text-[10px] text-green-500 font-semibold">Strategic Accounts</div>
            <div className="absolute top-2 left-16 text-[10px] text-blue-500 font-semibold">Efficient High-Value</div>
            <div className="absolute bottom-10 right-3 text-[10px] text-yellow-500 font-semibold">Growth Opportunity</div>
            <div className="absolute bottom-10 left-16 text-[10px] text-gray-500 font-semibold">Low Priority</div>
          </div>
        </ChartCard>
      </div>

      {/* Target vs Achievement Gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <ChartCard title="Target vs Achievement" subtitle="Monthly · Quarterly · Yearly" className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Gauge label="Monthly" target={100} pct={derivedMetrics.surgeriesPerHospital > 0 ? Math.min(100, derivedMetrics.surgeriesPerHospital) : 45} />
            <Gauge label="Quarterly" target={300} pct={derivedMetrics.surgeriesPerHospital > 0 ? Math.min(100, derivedMetrics.surgeriesPerHospital + 4) : 50} />
            <Gauge label="Yearly" target={1200} pct={derivedMetrics.surgeriesPerHospital > 0 ? Math.min(100, derivedMetrics.surgeriesPerHospital - 6) : 40} />
          </div>
        </ChartCard>

        {/* Product Penetration Funnel */}
        <ChartCard title="Product Penetration Funnel" subtitle="Stage-wise conversion">
          <div className="space-y-2">
            {PENETRATION_FUNNEL.map((f, i) => {
              const max = PENETRATION_FUNNEL[0].value;
              const width = (f.value / max) * 100;
              const conv = i === 0 ? null : Math.round((f.value / PENETRATION_FUNNEL[i - 1].value) * 100);
              return (
                <div key={f.stage}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-[#A54A29]">{f.stage}</span>
                    <span className="text-gray-500">{f.value}{conv !== null && <span className="ml-2 text-[#C6693C]">{conv}%</span>}</span>
                  </div>
                  <div className="h-6 rounded-lg bg-[#FBE9E7] overflow-hidden">
                    <div className="h-full rounded-lg transition-all" style={{ width: `${width}%`, background: `linear-gradient(90deg, ${COLORS[i % COLORS.length]}, color-mix(in oklch, ${COLORS[i % COLORS.length]} 60%, white))` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div>

      {/* Revenue Opportunity Table */}
      <ChartCard title="Revenue Opportunity" subtitle="Top 15 organizations by opportunity score" className="mt-4">
        <div className="overflow-x-auto -mx-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>District</TableHead>
                <TableHead className="text-right">Beds</TableHead>
                <TableHead className="text-right">Annual Surgeries</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Est. Revenue</TableHead>
                <TableHead className="text-right">Opportunity</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {revenue.map(o => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium text-[#A54A29]">{o.organizationName}</TableCell>
                  <TableCell>{o.district}</TableCell>
                  <TableCell className="text-right">{o.beds}</TableCell>
                  <TableCell className="text-right">{o.totalSurgeriesCalendarYear}</TableCell>
                  <TableCell className="text-right">{o.quantity}</TableCell>
                  <TableCell className="text-right">₹{o.price?.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-semibold text-[#A54A29]">₹{o.estimatedRevenue?.toLocaleString()}</TableCell>
                  <TableCell className="text-right"><Badge className="rounded-full bg-[#C6693C]/10 text-[#C6693C] hover:bg-[#C6693C]/15">{o.opportunityScore}</Badge></TableCell>
                  <TableCell className="text-right">
                    <span className="text-[#C6693C] text-sm font-medium inline-flex items-center hover:underline">
                      View <LucideIcons.ChevronRight size={14} />
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {revenue.length === 0 && <TableRow><TableCell colSpan={9} className="text-center py-8 text-sm text-gray-500">No organizations match your filters.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
      </ChartCard>

      {/* Quick Stats Table */}
      <div className="mt-6 bg-white rounded-2xl border border-[#E8C9B8] shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E8C9B8]">
          <h3 className="text-lg font-semibold text-[#5A2D1A]">Organization Overview</h3>
          <p className="text-xs text-[#8B5A3C]">Complete summary of all organizations</p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#FFF5F0]">
                <TableHead className="text-base font-semibold">Metric</TableHead>
                <TableHead className="text-base font-semibold text-right">Value</TableHead>
                <TableHead className="text-base font-semibold text-right">Per Organization</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-200">
              <TableRow>
                <td className="p-4 text-[15px] font-medium text-[#5A2D1A]">Total Organizations</td>
                <td className="p-4 text-[15px] text-right font-semibold text-[#C6693C]">{dashboardStats.totalOrganizations}</td>
                <td className="p-4 text-[15px] text-right text-gray-500">-</td>
              </TableRow>
              <TableRow>
                <td className="p-4 text-[15px] font-medium text-[#5A2D1A]">Total Individuals</td>
                <td className="p-4 text-[15px] text-right font-semibold text-[#C6693C]">{dashboardStats.totalIndividuals.toLocaleString()}</td>
                <td className="p-4 text-[15px] text-right text-gray-500">{Math.round(dashboardStats.totalIndividuals / (dashboardStats.totalOrganizations || 1))} avg</td>
              </TableRow>
              <TableRow>
                <td className="p-4 text-[15px] font-medium text-[#5A2D1A]">Total Beds</td>
                <td className="p-4 text-[15px] text-right font-semibold text-[#C6693C]">{dashboardStats.totalBeds.toLocaleString()}</td>
                <td className="p-4 text-[15px] text-right text-gray-500">{derivedMetrics.avgBedsPerHospital}</td>
              </TableRow>
              <TableRow>
                <td className="p-4 text-[15px] font-medium text-[#5A2D1A]">ICU Beds</td>
                <td className="p-4 text-[15px] text-right font-semibold text-[#C6693C]">{dashboardStats.totalICUBeds.toLocaleString()}</td>
                <td className="p-4 text-[15px] text-right text-gray-500">{derivedMetrics.avgICUPerHospital}</td>
              </TableRow>
              <TableRow>
                <td className="p-4 text-[15px] font-medium text-[#5A2D1A]">Operation Theatres</td>
                <td className="p-4 text-[15px] text-right font-semibold text-[#C6693C]">{dashboardStats.totalOperationTheatres.toLocaleString()}</td>
                <td className="p-4 text-[15px] text-right text-gray-500">{derivedMetrics.avgOTPerHospital}</td>
              </TableRow>
              <TableRow>
                <td className="p-4 text-[15px] font-medium text-[#5A2D1A]">Total Specialities</td>
                <td className="p-4 text-[15px] text-right font-semibold text-[#C6693C]">{dashboardStats.totalSpecialities}</td>
                <td className="p-4 text-[15px] text-right text-gray-500">{Math.round(dashboardStats.totalSpecialities / (dashboardStats.totalOrganizations || 1))} avg</td>
              </TableRow>
              <TableRow>
                <td className="p-4 text-[15px] font-medium text-[#5A2D1A]">Total Surgeries</td>
                <td className="p-4 text-[15px] text-right font-semibold text-[#C6693C]">{dashboardStats.totalSurgeries.toLocaleString()}</td>
                <td className="p-4 text-[15px] text-right text-gray-500">{derivedMetrics.surgeriesPerHospital}</td>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      {/* District Drill-down Sheet */}
      <Sheet open={!!drill} onOpenChange={(o) => !o && setDrill(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{drill} district</SheetTitle>
            <SheetDescription>City-level breakdown & top organizations</SheetDescription>
          </SheetHeader>
          {drill && (() => {
            const arr = filtered.filter(o => o.district === drill);
            const cities = Array.from(new Set(arr.map(o => o.city)));
            return (
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <M label="Hospitals" value={String(arr.length)} />
                  <M label="Beds" value={arr.reduce((s, o) => s + (o.beds || 0), 0).toLocaleString()} />
                  <M label="CY Surgeries" value={arr.reduce((s, o) => s + (o.totalSurgeriesCalendarYear || 0), 0).toLocaleString()} />
                  <M label="Avg Achievement" value={`${Math.round(arr.reduce((s, o) => s + (o.productAchievement || 0), 0) / (arr.length || 1))}%`} />
                </div>
                <div className="rounded-2xl border border-[#E8B59F] p-4 bg-white">
                  <p className="text-sm font-medium mb-2 text-[#A54A29]">Cities</p>
                  <div className="flex flex-wrap gap-1">
                    {cities.map(c => <Badge key={c} variant="secondary" className="rounded-full">{c} · {arr.filter(o => o.city === c).length}</Badge>)}
                  </div>
                </div>
                <div className="rounded-2xl border border-[#E8B59F] p-4 bg-white">
                  <p className="text-sm font-medium mb-2 text-[#A54A29]">Top organizations</p>
                  <ul className="space-y-2 text-sm">
                    {arr.slice(0, 5).map(o => (
                      <li key={o.id} className="flex items-center justify-between">
                        <span className="truncate text-[#A54A29]">{o.organizationName}</span>
                        <span className="text-xs text-gray-500">{(o.beds || 0)} beds · {(o.productAchievement || 0)}%</span>
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