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

function Mini({ label, value }) {
  return (
    <div className="rounded-xl border border-[#E8B59F] p-3 bg-[#FBE9E7]">
      <p className="text-[11px] text-[#A54A29] uppercase tracking-wide">{label}</p>
      <p className="text-sm font-semibold mt-0.5">{value}</p>
    </div>
  );
}

export function DoctorSection({ doctors, filters }) {
  const [open, setOpen] = useState(null);

  const total = doctors.length;
  const active = doctors.filter(d => d.qualityScore >= 60).length;
  const productive = doctors.filter(d => d.achievement >= 70).length;
  const avgAch = total ? Math.round(doctors.reduce((s, d) => s + d.achievement, 0) / total) : 0;
  const completed = doctors.filter(d => d.productStatus === "Complete").length;
  const avgQuality = total ? Math.round(doctors.reduce((s, d) => s + d.qualityScore, 0) / total) : 0;

  const leaderboard = [...doctors].sort((a, b) => b.achievement - a.achievement).slice(0, 10);
  const specContrib = D_SPECIALITIES.map((s, i) => ({ 
    name: s, 
    value: doctors.filter(d => d.speciality === s).reduce((sum, d) => sum + d.achievement, 0), 
    fill: COLORS[i % COLORS.length] 
  })).filter(s => s.value > 0);
  const topSpec = [...specContrib].sort((a, b) => b.value - a.value)[0]?.name ?? "—";

  const matrix = D_SALES.map(sp => ({ 
    sales: sp, 
    cells: D_SPECIALITIES.map(sc => doctors.filter(d => d.salesPerson === sp && d.speciality === sc && d.qualityScore >= 60).length) 
  }));
  const matrixMax = Math.max(1, ...matrix.flatMap(m => m.cells));

  const prodStack = D_PRODUCTS.map(p => {
    const arr = doctors.filter(d => d.productName === p);
    return { name: p, Complete: arr.filter(d => d.productStatus === "Complete").length, Incomplete: arr.filter(d => d.productStatus === "Incomplete").length };
  }).slice(0, 10);

  const scatter = D_PRODUCTS.map(p => {
    const arr = doctors.filter(d => d.productName === p);
    if (!arr.length) return null;
    return { 
      name: p, 
      price: Math.round(arr.reduce((s, d) => s + d.price, 0) / arr.length), 
      achievement: Math.round(arr.reduce((s, d) => s + d.achievement, 0) / arr.length), 
      doctors: arr.length 
    };
  }).filter(Boolean);

  const qBuckets = [
    { label: "Excellent (90-100)", count: doctors.filter(d => d.qualityScore >= 90).length, tone: "#22c55e" },
    { label: "Good (75-89)", count: doctors.filter(d => d.qualityScore >= 75 && d.qualityScore < 90).length, tone: "#3b82f6" },
    { label: "Average (60-74)", count: doctors.filter(d => d.qualityScore >= 60 && d.qualityScore < 75).length, tone: "#eab308" },
    { label: "Needs Attention (<60)", count: doctors.filter(d => d.qualityScore < 60).length, tone: "#ef4444" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight text-[#A54A29] mb-2">Doctor Analytics</h2>
      <p className="text-sm text-gray-600 mb-6">
        Doctor-wise performance and product engagement intelligence
        {filters.speciality && <span className="ml-2 font-medium text-[#C6693C]">Filtered by: {filters.speciality}</span>}
        {filters.segment && <span className="ml-2 font-medium text-[#C6693C]">| {filters.segment}</span>}
        {filters.salesExecutive && <span className="ml-2 font-medium text-[#C6693C]">| {filters.salesExecutive}</span>}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard title="Total Doctors" value={total.toLocaleString()} trend={12} accent="info" icon={LucideIcons.Users} />
        <KpiCard title="Active Doctors" value={active.toLocaleString()} trend={8} accent="success" icon={LucideIcons.Activity} />
        <KpiCard title="Productive Doctors" value={productive.toLocaleString()} trend={6} accent="success" icon={LucideIcons.TrendingUp} />
        <KpiCard title="Avg Achievement %" value={`${avgAch}%`} trend={4} accent="target" icon={LucideIcons.Target} />
        <KpiCard title="Completed Products" value={completed.toLocaleString()} trend={9} accent="product" icon={LucideIcons.CheckCircle2} />
        <KpiCard title="Avg Quality Score" value={`${avgQuality}/100`} trend={3} accent="product" icon={LucideIcons.Sparkles} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <ChartCard title="Doctor Performance Leaderboard" subtitle="Top 10 doctors by achievement %" className="lg:col-span-2">
          {leaderboard.length === 0 ? <EmptyState /> : (
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={leaderboard} layout="vertical" margin={{ left: 8, right: 24 }}>
                <CartesianGrid horizontal={false} stroke="#E8B59F" />
                <XAxis type="number" domain={[0, 100]} stroke="#6b7280" fontSize={11} unit="%" />
                <YAxis dataKey="doctorName" type="category" stroke="#6b7280" fontSize={11} width={140} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E8B59F", background: "#ffffff" }} />
                <Bar dataKey="achievement" radius={[0, 8, 8, 0]} label={{ position: "right", fontSize: 11, fill: "#6b7280" }}>
                  {leaderboard.map((d, i) => <Cell key={i} fill={d.achievement > 85 ? "#22c55e" : d.achievement >= 70 ? "#eab308" : "#ef4444"} />)}
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
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E8B59F", background: "#ffffff" }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <Mini label="Top speciality" value={topSpec} />
                <Mini label="Total doctors" value={String(total)} />
                <Mini label="Avg target" value={String(Math.round(doctors.reduce((s, d) => s + d.target, 0) / (total || 1)))} />
                <Mini label="Avg achievement" value={`${avgAch}%`} />
              </div>
            </>
          )}
        </ChartCard>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <ChartCard title="Price vs Achievement" subtitle="Bubble = # doctors" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={320}>
            <ScatterChart margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
              <CartesianGrid stroke="#E8B59F" />
              <XAxis type="number" dataKey="price" name="Price" stroke="#6b7280" fontSize={11} unit="₹" />
              <YAxis type="number" dataKey="achievement" name="Achievement" stroke="#6b7280" fontSize={11} unit="%" domain={[0, 100]} />
              <ZAxis type="number" dataKey="doctors" range={[80, 600]} />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ borderRadius: 12, border: "1px solid #E8B59F", background: "#ffffff" }} />
              <Scatter data={scatter} fill="#C6693C" fillOpacity={0.7} />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Quality Analytics" subtitle="Average doctor quality">
          <div className="relative h-40">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ name: "q", value: avgQuality, fill: "#C6693C" }]} startAngle={225} endAngle={-45}>
                <RadialBar background={{ fill: "#E8B59F" }} dataKey="value" cornerRadius={20} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 grid place-items-center pointer-events-none">
              <div className="text-center">
                <p className="text-3xl font-bold text-[#C6693C]">{avgQuality}</p>
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

      <ChartCard title="Doctor Directory" subtitle="Click a row for full drill-down" className="mt-4">
        <div className="overflow-x-auto -mx-2 max-h-[520px]">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow>
                <TableHead>Doctor</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Speciality</TableHead>
                <TableHead>Segment</TableHead>
                <TableHead>Sales Person</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Target</TableHead>
                <TableHead className="text-right">Achievement</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Quality</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doctors.slice(0, 60).map(d => (
                <TableRow key={d.id} className="cursor-pointer" onClick={() => setOpen(d)}>
                  <TableCell className="font-medium">{d.doctorName}</TableCell>
                  <TableCell>{d.city}</TableCell>
                  <TableCell>{d.speciality}</TableCell>
                  <TableCell><Badge variant="secondary" className="rounded-full">{d.segment}</Badge></TableCell>
                  <TableCell>{d.salesPerson}</TableCell>
                  <TableCell>{d.productName}</TableCell>
                  <TableCell className="text-right">{d.target}</TableCell>
                  <TableCell className="text-right"><AchBadge v={d.achievement} /></TableCell>
                  <TableCell><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${d.productStatus === "Complete" ? "bg-green-500/15 text-green-500" : "bg-red-500/15 text-red-500"}`}>{d.productStatus}</span></TableCell>
                  <TableCell className="text-right font-semibold">{d.qualityScore}</TableCell>
                </TableRow>
              ))}
              {doctors.length === 0 && (
                <TableRow><TableCell colSpan={10} className="text-center py-8 text-sm text-gray-500">No doctors match your filters.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {doctors.length > 60 && <p className="text-xs text-gray-500 text-center mt-3">Showing 60 of {doctors.length}. Refine filters to see more.</p>}
      </ChartCard>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#A54A29]"><LucideIcons.Stethoscope size={18} className="text-[#C6693C]" />{open?.doctorName}</DialogTitle>
          </DialogHeader>
          {open && (
            <Tabs defaultValue="profile">
              <TabsList className="rounded-xl">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="products">Product History</TabsTrigger>
                <TabsTrigger value="trend">Achievement Trend</TabsTrigger>
                <TabsTrigger value="visits">Visits</TabsTrigger>
                <TabsTrigger value="quality">Quality</TabsTrigger>
              </TabsList>
              <TabsContent value="profile" className="grid grid-cols-2 gap-3 mt-4">
                <Mini label="City" value={open.city} />
                <Mini label="State" value={open.state} />
                <Mini label="Speciality" value={open.speciality} />
                <Mini label="Segment" value={open.segment} />
                <Mini label="Profile" value={open.profile} />
                <Mini label="Designation" value={open.designation} />
                <Mini label="Sales Person" value={open.salesPerson} />
                <Mini label="Quality Score" value={`${open.qualityScore}/100`} />
              </TabsContent>
              <TabsContent value="products" className="mt-4">
                <div className="rounded-xl border border-[#E8B59F] p-4">
                  <p className="font-semibold text-[#A54A29]">{open.productName}</p>
                  <p className="text-gray-500 text-xs mt-1">Target {open.target} · Achievement {open.achievement}% · Price ₹{open.price.toLocaleString()} · Status {open.productStatus}</p>
                </div>
              </TabsContent>
              <TabsContent value="trend" className="mt-4">
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={MONTHLY_ACHIEVEMENT}>
                    <CartesianGrid stroke="#E8B59F" vertical={false} />
                    <XAxis dataKey="month" fontSize={11} stroke="#6b7280" />
                    <YAxis fontSize={11} stroke="#6b7280" />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E8B59F", background: "#ffffff" }} />
                    <Line type="monotone" dataKey="value" stroke="#C6693C" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="visits" className="mt-4 text-sm text-gray-500">
                Last 6 visits: Kingsway Hospital, Ruby Hall Clinic, Sahyadri, Wockhardt, Orange City, Apollo. All productive.
              </TabsContent>
              <TabsContent value="quality" className="mt-4 text-sm text-gray-500">
                Quality score of {open.qualityScore} reflects prescription accuracy, product adoption depth, and follow-up completion.
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}