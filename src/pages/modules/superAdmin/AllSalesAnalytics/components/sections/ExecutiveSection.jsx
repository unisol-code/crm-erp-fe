// components/sections/ExecutiveSection.jsx

import React from "react";
import * as LucideIcons from "lucide-react";
import { 
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart, 
  ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";
import { ChartCard } from '../analytics';
import { HOSPITALS, PRODUCTS, MONTHLY_TREND } from '../../data/analyticsData';

export function ExecutiveSection({ executives, filters }) {
  const exec = executives && executives.length > 0 ? executives[0] : null;
  const DAYS = Array.from({ length: 28 }, (_, i) => ({ day: i + 1, visits: Math.round(2 + Math.random() * 8) }));

  if (!exec) {
    return (
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-[#A54A29] mb-2">Sales Executive Performance</h2>
        <p className="text-sm text-gray-500">No executive data available.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight text-[#A54A29] mb-2">Sales Executive Performance</h2>
      <p className="text-sm text-gray-600 mb-6">
        Detailed view of top performing executive
        {filters.salesExecutive && <span className="ml-2 font-medium text-[#C6693C]">Filtered by: {filters.salesExecutive}</span>}
      </p>

      <div className="flex items-center gap-4 mb-6">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#C6693C] to-[#A54A29] grid place-items-center text-white text-xl font-semibold">
          {exec.name[0]}
        </div>
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-[#A54A29]">{exec.name}</h3>
          <p className="text-sm text-gray-500 mt-1">Sales Executive · Maharashtra · {exec.achievement}% achievement</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { l: "Planned calls", v: exec.planned },
          { l: "Completed calls", v: exec.completed },
          { l: "Leads generated", v: exec.leads },
          { l: "Achievement", v: `${exec.achievement}%` }
        ].map(s => (
          <div key={s.l} className="rounded-2xl border border-[#E8B59F] bg-white p-4">
            <p className="text-xs text-gray-500">{s.l}</p>
            <p className="text-2xl font-semibold mt-1 text-[#A54A29]">{s.v}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <ChartCard title="Monthly visit trend" subtitle="Jan – Jun">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={MONTHLY_TREND}>
              <CartesianGrid stroke="#E8B59F" vertical={false} />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={11} />
              <YAxis stroke="#6b7280" fontSize={11} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E8B59F", background: "#ffffff" }} />
              <Line dataKey="visits" stroke="#C6693C" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line dataKey="leads" stroke="#A54A29" strokeWidth={2.5} dot={{ r: 4 }} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Daily visit heatmap" subtitle="Last 28 days">
          <div className="grid grid-cols-7 gap-1.5">
            {DAYS.map(d => (
              <div key={d.day} className="aspect-square rounded-md" title={`Day ${d.day}: ${d.visits} visits`} style={{ backgroundColor: `color-mix(in oklch, #C6693C ${d.visits * 10}%, #E8B59F)` }} />
            ))}
          </div>
        </ChartCard>
        <ChartCard title="Product performance">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={PRODUCTS.slice(0, 5)}>
              <CartesianGrid stroke="#E8B59F" vertical={false} />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
              <YAxis stroke="#6b7280" fontSize={11} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E8B59F", background: "#ffffff" }} />
              <Bar dataKey="value" fill="#C6693C" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Top hospitals & missed targets">
          <ul className="divide-y divide-[#E8B59F] text-sm">
            {HOSPITALS.slice(0, 5).map(h => (
              <li key={h.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium truncate text-[#A54A29]">{h.name}</p>
                  <p className="text-xs text-gray-500">{h.city} · {h.visits} visits</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${h.achievement >= 85 ? "bg-green-500/15 text-green-500" : h.achievement >= 70 ? "bg-yellow-500/15 text-yellow-600" : "bg-red-500/15 text-red-500"}`}>
                  {h.achievement}%
                </span>
              </li>
            ))}
          </ul>
        </ChartCard>
      </div>
    </div>
  );
}