
// components/sections/DashboardSection.jsx

import React, { useMemo, useState } from "react";
import * as LucideIcons from "lucide-react";
import { 
  Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, 
  RadialBar, RadialBarChart, ResponsiveContainer, Tooltip, 
  XAxis, YAxis
} from "recharts";
import { ChartCard, KpiCard, AchievementBadge } from '../analytics';
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
  SheetDescription 
} from '../common';
import { 
  COLORS, 
  DISTRICTS, 
  EXECUTIVES, 
  PRODUCTS, 
  SPECIALITIES, 
  TARGETS, 
  FUNNEL, 
  PRODUCT_CATEGORIES 
} from '../../data/analyticsData';

function SummaryStat({ label, value, hint, tone }) {
  return (
    <div className="rounded-xl border border-[#E8C9B8] p-4 bg-[#FFF8F5]">
      <p className="text-xs font-medium text-[#8B5A3C]">{label}</p>
      <p className={`text-xl font-bold mt-1 ${tone === "success" ? "text-green-600" : "text-[#5A2D1A]"}`}>{value}</p>
      {hint && <p className="text-xs text-[#8B5A3C] mt-0.5">{hint}</p>}
    </div>
  );
}

function MiniStat({ label, value, tone }) {
  return (
    <div className="rounded-xl border border-[#E8C9B8] p-3 bg-[#FFF8F5]">
      <p className="text-[10px] font-semibold text-[#8B5A3C] uppercase tracking-wider">{label}</p>
      <p className={`text-lg font-bold mt-0.5 ${tone === "success" ? "text-green-600" : "text-[#5A2D1A]"}`}>{value}</p>
    </div>
  );
}

export function DashboardSection({ hospitals, filters }) {
  const [drillDistrict, setDrillDistrict] = useState(null);
  const [productCat, setProductCat] = useState("All");
  const [hospitalSearch, setHospitalSearch] = useState("");
  
  const targetPct = Math.round((TARGETS.monthlyAchieved / TARGETS.monthlyTarget) * 100);
  const gaugeData = [{ name: "Achieved", value: targetPct, fill: "#C6693C" }];
  
  const filteredProducts = useMemo(() => 
    productCat === "All" ? PRODUCTS : PRODUCTS.filter(p => p.category === productCat),
    [productCat]
  );
  
  const filteredHospitals = useMemo(() => {
    const q = hospitalSearch.toLowerCase();
    return hospitals.filter(h => !q || h.name.toLowerCase().includes(q) || h.city.toLowerCase().includes(q));
  }, [hospitals, hospitalSearch]);

  const updatedKPIS = useMemo(() => {
    const totalHospitals = filteredHospitals.length;
    const totalVisits = filteredHospitals.reduce((sum, h) => sum + h.visits, 0);
    const avgAchievement = filteredHospitals.length > 0 
      ? Math.round(filteredHospitals.reduce((sum, h) => sum + h.achievement, 0) / filteredHospitals.length) 
      : 0;
    
    return [
      { key: "hospitals", title: "Hospitals", value: totalHospitals.toString(), trend: 14, accent: "info", icon: "Building2" },
      { key: "doctors", title: "Active Doctors", value: "486", trend: 9, accent: "product", icon: "Stethoscope" },
      { key: "visits", title: "Monthly Visits", value: totalVisits.toLocaleString(), trend: 12, accent: "success", icon: "Activity" },
      { key: "achievement", title: "Target Achievement", value: `${avgAchievement}%`, trend: 8, accent: "target", icon: "Target" }
    ];
  }, [filteredHospitals]);

  const filteredDistricts = useMemo(() => {
    return DISTRICTS.map(d => {
      const hospitalCount = filteredHospitals.filter(h => h.district === d.district).length;
      return {
        ...d,
        value: hospitalCount > 0 ? filteredHospitals.filter(h => h.district === d.district).reduce((sum, h) => sum + h.visits, 0) : d.value
      };
    });
  }, [filteredHospitals]);

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#5A2D1A]">Territory Analytics</h1>
          <p className="text-sm text-[#8B5A3C] mt-1 font-medium">
            Live view of hospitals, doctors, visits and product performance across Maharashtra.
            {filters.state && <span className="ml-2 text-[#C6693C] font-semibold">Filtered by: {filters.state}</span>}
            {filters.district && <span className="ml-2 text-[#C6693C] font-semibold">| {filters.district}</span>}
            {filters.city && <span className="ml-2 text-[#C6693C] font-semibold">| {filters.city}</span>}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-[#8B5A3C] bg-[#FFF5F0] px-3 py-1.5 rounded-lg border border-[#E8C9B8]">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Data synced 2 min ago
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {updatedKPIS.map(k => {
          const Icon = LucideIcons[k.icon] || LucideIcons.Activity;
          return <KpiCard key={k.key} title={k.title} value={k.value} trend={k.trend} accent={k.accent} icon={Icon} />;
        })}
      </div>

      {/* ... rest of the dashboard remains the same but with better card styling */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <ChartCard title="Maharashtra Territory Heatmap" subtitle="Visit density by district" className="lg:col-span-2" action={<Badge variant="secondary" className="rounded-full bg-[#C6693C]/10 text-[#C6693C] border-[#C6693C]/20">Live</Badge>}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative rounded-2xl overflow-hidden border border-[#E8C9B8] bg-gradient-to-br from-[#C6693C]/5 via-white to-[#FFC4A2]/5 min-h-[280px] grid place-items-center">
              <div className="text-center px-6">
                <LucideIcons.MapPin className="mx-auto text-[#C6693C]" size={40} />
                <p className="mt-2 text-sm font-medium text-[#5A2D1A]">Maharashtra heatmap</p>
                <p className="text-xs text-[#8B5A3C]">Interactive map placeholder</p>
                <div className="mt-4 flex items-center gap-1 justify-center flex-wrap">
                  {filteredDistricts.map((d, i) => (
                    <div key={d.district} className="h-8 rounded-md" style={{ width: 24 + d.value / 4, backgroundColor: `rgba(198, 105, 60, ${0.3 + i * 0.12})` }} title={`${d.district}: ${d.value}`} />
                  ))}
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#5A2D1A] uppercase tracking-wider mb-2">District Ranking</p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={filteredDistricts} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <CartesianGrid horizontal={false} stroke="#E8C9B8" />
                  <XAxis type="number" stroke="#8B5A3C" fontSize={11} />
                  <YAxis dataKey="district" type="category" stroke="#8B5A3C" fontSize={12} width={70} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E8C9B8", background: "#ffffff" }} />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]} onClick={(d) => setDrillDistrict(d.district)}>
                    {filteredDistricts.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} cursor="pointer" />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ChartCard>
        <ChartCard title="Territory Summary" subtitle="Key metrics">
          <div className="space-y-3">
            {[
              { label: "Active districts", value: filteredDistricts.filter(d => d.value > 0).length.toString(), trend: "+2" },
              { label: "Hospitals covered", value: filteredHospitals.length.toString(), trend: "+14" },
              { label: "Avg. visits / district", value: filteredDistricts.length > 0 ? Math.round(filteredDistricts.reduce((s, d) => s + d.value, 0) / filteredDistricts.filter(d => d.value > 0).length).toString() : "0", trend: "+9" },
              { label: "Best performing", value: filteredHospitals.length > 0 ? filteredHospitals.reduce((a, b) => a.achievement > b.achievement ? a : b).name : "N/A", trend: "Top performer" }
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between p-3 rounded-xl bg-[#FFF8F5] border border-[#E8C9B8]">
                <div><p className="text-xs font-medium text-[#8B5A3C]">{s.label}</p><p className="text-base font-bold text-[#5A2D1A] mt-0.5">{s.value}</p></div>
                <span className="text-xs font-semibold text-green-600">{s.trend}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <ChartCard title="Speciality Intelligence" subtitle="Doctor distribution" className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            <div className="md:col-span-3">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={SPECIALITIES} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={3}>
                    {SPECIALITIES.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E8B59F", background: "#ffffff" }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="md:col-span-2 space-y-3">
              <SummaryStat label="Top speciality" value="General Surgery" hint="104 doctors" />
              <SummaryStat label="Growth" value="+18%" hint="MoM increase" tone="success" />
              <SummaryStat label="Hospital coverage" value={`${filteredHospitals.length > 0 ? Math.round((filteredHospitals.length / 128) * 100) : 0}%`} hint={`${filteredHospitals.length} of 128 hospitals`} />
            </div>
          </div>
        </ChartCard>
        <ChartCard title="Target vs Achievement" subtitle="Monthly & yearly performance">
          <div className="relative h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="70%" outerRadius="100%" data={gaugeData} startAngle={225} endAngle={-45}>
                <RadialBar background={{ fill: "#E8B59F" }} dataKey="value" cornerRadius={20} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 grid place-items-center pointer-events-none">
              <div className="text-center">
                <p className="text-4xl font-bold text-[#C6693C]">{targetPct}%</p>
                <p className="text-xs text-gray-500 mt-1">Monthly achievement</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <MiniStat label="Monthly Target" value={TARGETS.monthlyTarget.toLocaleString()} />
            <MiniStat label="Monthly Achieved" value={TARGETS.monthlyAchieved.toLocaleString()} tone="success" />
            <MiniStat label="Yearly Target" value={TARGETS.yearlyTarget.toLocaleString()} />
            <MiniStat label="Yearly Achieved" value={TARGETS.yearlyAchieved.toLocaleString()} tone="success" />
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Sales Executive Performance" subtitle="Achievement % vs planned calls" className="mt-4">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={EXECUTIVES} layout="vertical" margin={{ left: 8, right: 16 }}>
            <CartesianGrid horizontal={false} stroke="#E8B59F" />
            <XAxis type="number" domain={[0, 100]} stroke="#6b7280" fontSize={11} unit="%" />
            <YAxis dataKey="name" type="category" stroke="#6b7280" fontSize={12} width={70} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E8B59F", background: "#ffffff" }} />
            <Bar dataKey="achievement" radius={[0, 8, 8, 0]}>
              {EXECUTIVES.map((e, i) => <Cell key={i} fill={e.achievement >= 85 ? "#22c55e" : e.achievement >= 70 ? "#eab308" : "#ef4444"} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 overflow-x-auto -mx-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Executive</TableHead>
                <TableHead className="text-right">Planned Calls</TableHead>
                <TableHead className="text-right">Completed Calls</TableHead>
                <TableHead className="text-right">Achievement %</TableHead>
                <TableHead className="text-right">Leads</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {EXECUTIVES.map(e => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.name}</TableCell>
                  <TableCell className="text-right">{e.planned}</TableCell>
                  <TableCell className="text-right">{e.completed}</TableCell>
                  <TableCell className="text-right"><AchievementBadge value={e.achievement} /></TableCell>
                  <TableCell className="text-right">{e.leads}</TableCell>
                  <TableCell className="text-right">
                    <span className="text-[#C6693C] text-sm font-medium inline-flex items-center hover:underline">
                      View <LucideIcons.ChevronRight size={14} />
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <ChartCard title="Product Intelligence" subtitle="Achieved quantity by product" className="lg:col-span-2" action={
          <div className="flex gap-1 flex-wrap">
            {PRODUCT_CATEGORIES.map(c => (
              <button key={c} onClick={() => setProductCat(c)} className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${productCat === c ? "bg-[#C6693C] text-white border-[#C6693C]" : "border-[#E8B59F] text-gray-500 hover:bg-[#FFC4A2]"}`}>
                {c}
              </button>
            ))}
          </div>
        }>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={filteredProducts} margin={{ left: 0, right: 8 }}>
              <CartesianGrid vertical={false} stroke="#E8B59F" />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
              <YAxis stroke="#6b7280" fontSize={11} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E8B59F", background: "#ffffff" }} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {filteredProducts.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {filteredProducts.length === 0 && <div className="text-center py-10 text-sm text-gray-500">No products in this category.</div>}
        </ChartCard>
        <ChartCard title="Lead Conversion Funnel" subtitle="Stage-wise conversion">
          <div className="space-y-2">
            {FUNNEL.map((f, i) => {
              const max = FUNNEL[0].value;
              const width = (f.value / max) * 100;
              const conv = i === 0 ? null : Math.round((f.value / FUNNEL[i - 1].value) * 100);
              return (
                <div key={f.stage}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-[#A54A29]">{f.stage}</span>
                    <span className="text-gray-500">{f.value} {conv !== null && <span className="ml-2 text-[#C6693C]">{conv}%</span>}</span>
                  </div>
                  <div className="h-7 rounded-lg bg-[#FBE9E7] overflow-hidden">
                    <div className="h-full rounded-lg transition-all" style={{ width: `${width}%`, background: `linear-gradient(90deg, ${COLORS[i % COLORS.length]}, color-mix(in oklch, ${COLORS[i % COLORS.length]} 60%, white))` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Hospitals" subtitle="Drill down into a hospital for full profile" className="mt-4" action={
        <div className="relative w-56 max-w-full">
          <LucideIcons.Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C6693C]" />
          <Input placeholder="Search hospital or city" value={hospitalSearch} onChange={(e) => setHospitalSearch(e.target.value)} className="pl-9 rounded-xl bg-white border-[#E8B59F] focus:ring-[#C6693C]" />
        </div>
      }>
        <div className="overflow-x-auto -mx-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hospital</TableHead>
                <TableHead>City</TableHead>
                <TableHead className="text-right">Beds</TableHead>
                <TableHead className="text-right">ICU</TableHead>
                <TableHead className="text-right">OT</TableHead>
                <TableHead className="text-right">Specialities</TableHead>
                <TableHead className="text-right">Visits</TableHead>
                <TableHead className="text-right">Leads</TableHead>
                <TableHead className="text-right">Achievement</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHospitals.map(h => (
                <TableRow key={h.id} className="cursor-pointer">
                  <TableCell className="font-medium text-[#C6693C] hover:underline">{h.name}</TableCell>
                  <TableCell>{h.city}</TableCell>
                  <TableCell className="text-right">{h.totalBeds}</TableCell>
                  <TableCell className="text-right">{h.totalICUBeds}</TableCell>
                  <TableCell className="text-right">{h.totalOT}</TableCell>
                  <TableCell className="text-right">{h.specialityCount}</TableCell>
                  <TableCell className="text-right">{h.visits}</TableCell>
                  <TableCell className="text-right">{h.leads}</TableCell>
                  <TableCell className="text-right"><AchievementBadge value={h.achievement} /></TableCell>
                </TableRow>
              ))}
              {filteredHospitals.length === 0 && (
                <TableRow><TableCell colSpan={9} className="text-center py-8 text-sm text-gray-500">No hospitals found matching your filters.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </ChartCard>

      <Sheet open={!!drillDistrict} onOpenChange={(o) => !o && setDrillDistrict(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{drillDistrict} district</SheetTitle>
            <SheetDescription>Field-force performance in {drillDistrict}</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="Visits" value={String(DISTRICTS.find(d => d.district === drillDistrict)?.value ?? 0)} tone="success" />
              <MiniStat label="Hospitals" value={String(filteredHospitals.filter(h => h.district === drillDistrict).length)} />
              <MiniStat label="Leads" value={String(filteredHospitals.filter(h => h.district === drillDistrict).reduce((sum, h) => sum + h.leads, 0))} tone="success" />
              <MiniStat label="Achievement" value={`${filteredHospitals.filter(h => h.district === drillDistrict).length > 0 ? Math.round(filteredHospitals.filter(h => h.district === drillDistrict).reduce((sum, h) => sum + h.achievement, 0) / filteredHospitals.filter(h => h.district === drillDistrict).length) : 0}%`} />
            </div>
            <div className="rounded-2xl border border-[#E8B59F] p-4 bg-white">
              <p className="text-sm font-medium mb-2 flex items-center gap-2 text-[#A54A29]"><LucideIcons.TrendingUp size={16} className="text-[#C6693C]" /> Top hospitals in {drillDistrict}</p>
              <ul className="space-y-2 text-sm">
                {filteredHospitals.filter(h => h.district === drillDistrict).slice(0, 3).map(h => (
                  <li key={h.id} className="flex items-center justify-between"><span>{h.name}</span><AchievementBadge value={h.achievement} /></li>
                ))}
              </ul>
            </div>
            <Button className="w-full rounded-xl">Open full report</Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}