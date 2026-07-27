// components/sections/OrganizationSection.jsx

import React, { useMemo, useState } from "react";
import * as LucideIcons from "lucide-react";
import { 
  Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, 
  RadialBar, RadialBarChart, ResponsiveContainer, Tooltip, 
  XAxis, YAxis, Scatter, ScatterChart, ZAxis, ReferenceLine
} from "recharts";
import { ChartCard, KpiCard, AchievementBadge, EmptyState } from '../analytics';
import { 
  Button, 
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
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem
} from '../common';
import { 
  COLORS, 
  ORGS, 
  O_DISTRICTS, 
  O_TYPES, 
  D_SPECIALITIES, 
  D_STATES, 
  PENETRATION_FUNNEL 
} from '../../data/analyticsData';

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

export function OrganizationSection({ orgs, filters }) {
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [hSpec, setHSpec] = useState("");
  const [status, setStatus] = useState("");
  const [drill, setDrill] = useState(null);
  const [distMetric, setDistMetric] = useState("hospitals");

  const filtered = useMemo(() => orgs, [orgs]);

  const reset = () => {
    setState("");
    setDistrict("");
    setCity("");
    setType("");
    setHSpec("");
    setStatus("");
  };

  const totalOrg = filtered.length;
  const totalBeds = filtered.reduce((s, o) => s + o.beds, 0);
  const totalSurg = filtered.reduce((s, o) => s + o.numberOfSurgeries, 0);
  const totalCYSurg = filtered.reduce((s, o) => s + o.totalSurgeriesCalendarYear, 0);
  const monthlyTarget = filtered.reduce((s, o) => s + o.productTargetMonth, 0);
  const quarterTarget = filtered.reduce((s, o) => s + o.productTargetQuarter, 0);
  const yearlyTarget = filtered.reduce((s, o) => s + o.productTargetYear, 0);
  const avgAch = totalOrg ? Math.round(filtered.reduce((s, o) => s + o.productAchievement, 0) / totalOrg) : 0;

  const districtData = O_DISTRICTS.map(d => {
    const arr = filtered.filter(o => o.district === d);
    return { 
      district: d, 
      hospitals: arr.length, 
      beds: arr.reduce((s, o) => s + o.beds, 0), 
      surgeries: arr.reduce((s, o) => s + o.totalSurgeriesCalendarYear, 0), 
      achievement: arr.length ? Math.round(arr.reduce((s, o) => s + o.productAchievement, 0) / arr.length) : 0 
    };
  }).filter(d => d.hospitals > 0).sort((a, b) => b.hospitals - a.hospitals);

  const scatterData = filtered.map(o => ({ name: o.organizationName, beds: o.beds, surgeries: o.totalSurgeriesCalendarYear, id: o.id }));
  const bedMed = 300, surgMed = 600;

  const typeDist = O_TYPES.map((t, i) => ({ name: t, value: filtered.filter(o => o.type === t).length, fill: COLORS[i % COLORS.length] })).filter(t => t.value > 0);

  const specPen = D_SPECIALITIES.map(s => {
    const arr = filtered.filter(o => o.hospitalSpeciality === s);
    return { name: s, value: arr.reduce((sum, o) => sum + o.productAchievement, 0) };
  });

  const revenue = [...filtered].map(o => {
    const est = o.quantity * o.price;
    const score = Math.round(o.beds * 0.2 + o.totalSurgeriesCalendarYear * 0.5 + o.productAchievement * 0.3);
    return { ...o, estimatedRevenue: est, opportunityScore: score };
  }).sort((a, b) => b.opportunityScore - a.opportunityScore).slice(0, 15);

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight text-[#A54A29] mb-2">Organization Analytics</h2>
      <p className="text-sm text-gray-600 mb-6">
        Hospital infrastructure, surgery potential, and product penetration
        {filters.state && <span className="ml-2 font-medium text-[#C6693C]">Filtered by: {filters.state}</span>}
        {filters.district && <span className="ml-2 font-medium text-[#C6693C]">| {filters.district}</span>}
        {filters.city && <span className="ml-2 font-medium text-[#C6693C]">| {filters.city}</span>}
      </p>

      <div className="rounded-3xl bg-white border border-[#E8B59F] shadow-sm p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <LucideIcons.Filter size={16} className="text-[#C6693C]" />
          <h2 className="text-sm font-semibold text-[#A54A29]">Organization Filters</h2>
          <span className="ml-auto">
            <Button variant="ghost" size="sm" onClick={reset} className="rounded-xl">
              <LucideIcons.RotateCcw size={14} /> Reset
            </Button>
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          <Sel label="State" value={state} onChange={setState} options={D_STATES} />
          <Sel label="District" value={district} onChange={setDistrict} options={O_DISTRICTS} />
          <Sel label="City" value={city} onChange={setCity} options={Array.from(new Set(ORGS.map(o => o.city)))} />
          <Sel label="Type" value={type} onChange={setType} options={O_TYPES} />
          <Sel label="Speciality" value={hSpec} onChange={setHSpec} options={D_SPECIALITIES} />
          <Sel label="Product Status" value={status} onChange={setStatus} options={["Complete", "Incomplete"]} />
          <Sel label="Quarter" value="" onChange={() => {}} options={["Q1", "Q2", "Q3", "Q4"]} />
          <Sel label="Year" value="" onChange={() => {}} options={["2024", "2025", "2026"]} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Organizations" value={totalOrg.toLocaleString()} trend={8} accent="info" icon={LucideIcons.Building2} />
        <KpiCard title="Total Beds" value={totalBeds.toLocaleString()} trend={6} accent="info" icon={LucideIcons.Bed} />
        <KpiCard title="Total Surgeries" value={totalSurg.toLocaleString()} trend={12} accent="success" icon={LucideIcons.Scissors} />
        <KpiCard title="CY Surgeries" value={totalCYSurg.toLocaleString()} trend={9} accent="success" icon={LucideIcons.Activity} />
        <KpiCard title="Monthly Target" value={monthlyTarget.toLocaleString()} trend={4} accent="target" icon={LucideIcons.Target} />
        <KpiCard title="Quarterly Target" value={quarterTarget.toLocaleString()} trend={5} accent="target" icon={LucideIcons.Target} />
        <KpiCard title="Yearly Target" value={yearlyTarget.toLocaleString()} trend={7} accent="target" icon={LucideIcons.Target} />
        <KpiCard title="Achievement %" value={`${avgAch}%`} trend={3} accent="product" icon={LucideIcons.TrendingUp} />
      </div>

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
        <ChartCard title="Hospital Type Distribution" subtitle="Coverage by segment">
          {typeDist.length === 0 ? <EmptyState /> : (
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie data={typeDist} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={3}>
                  {typeDist.map((t, i) => <Cell key={i} fill={t.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E8B59F", background: "#ffffff" }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <ChartCard title="Hospital Infrastructure Intelligence" subtitle="Beds vs annual surgeries (quadrant view)" className="lg:col-span-2">
          <div className="relative">
            <ResponsiveContainer width="100%" height={340}>
              <ScatterChart margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                <CartesianGrid stroke="#E8B59F" />
                <XAxis type="number" dataKey="beds" name="Beds" stroke="#6b7280" fontSize={11} />
                <YAxis type="number" dataKey="surgeries" name="Surgeries" stroke="#6b7280" fontSize={11} />
                <ZAxis range={[60, 60]} />
                <ReferenceLine x={bedMed} stroke="#E8B59F" strokeDasharray="4 4" />
                <ReferenceLine y={surgMed} stroke="#E8B59F" strokeDasharray="4 4" />
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
        <ChartCard title="Speciality Penetration" subtitle="Product achievement by speciality">
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={specPen} margin={{ left: 0, right: 8 }}>
              <CartesianGrid vertical={false} stroke="#E8B59F" />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={10} angle={-25} textAnchor="end" height={60} />
              <YAxis stroke="#6b7280" fontSize={11} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E8B59F", background: "#ffffff" }} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {specPen.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <ChartCard title="Target vs Achievement" subtitle="Monthly · Quarterly · Yearly" className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Gauge label="Monthly" target={monthlyTarget} pct={avgAch} />
            <Gauge label="Quarterly" target={quarterTarget} pct={Math.min(100, avgAch + 4)} />
            <Gauge label="Yearly" target={yearlyTarget} pct={Math.max(30, avgAch - 6)} />
          </div>
        </ChartCard>
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
                  <TableCell className="text-right">₹{o.price.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-semibold text-[#A54A29]">₹{o.estimatedRevenue.toLocaleString()}</TableCell>
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
                  <M label="Beds" value={arr.reduce((s, o) => s + o.beds, 0).toLocaleString()} />
                  <M label="CY Surgeries" value={arr.reduce((s, o) => s + o.totalSurgeriesCalendarYear, 0).toLocaleString()} />
                  <M label="Avg Achievement" value={`${Math.round(arr.reduce((s, o) => s + o.productAchievement, 0) / (arr.length || 1))}%`} />
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
                        <span className="text-xs text-gray-500">{o.beds} beds · {o.productAchievement}%</span>
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