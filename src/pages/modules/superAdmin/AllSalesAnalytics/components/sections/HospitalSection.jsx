// components/sections/HospitalSection.jsx

import React from "react";
import * as LucideIcons from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartCard } from '../analytics';
import { MONTHLY_TREND, HOSPITALS } from '../../data/analyticsData';

function Infra({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-[var(--theme-bg-sidebar)] bg-white p-4">
      <div className="h-10 w-10 rounded-xl bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] grid place-items-center"><Icon size={18} /></div>
      <p className="text-xs text-gray-500 mt-3">{label}</p>
      <p className="text-2xl font-semibold mt-0.5 text-[var(--theme-accent)]">{value}</p>
    </div>
  );
}

export function HospitalSection({ hospitals, filters }) {
  const hospital = hospitals && hospitals.length > 0 ? hospitals[0] : HOSPITALS[0];
  const visits = MONTHLY_TREND.map(m => ({ month: m.month, visits: Math.round(m.visits / 4) }));

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight text-[var(--theme-accent)] mb-2">Hospital Profile</h2>
      <p className="text-sm text-gray-600 mb-6">
        Detailed view of top hospital
        {filters.state && <span className="ml-2 font-medium text-[var(--theme-primary)]">Filtered by: {filters.state}</span>}
        {filters.district && <span className="ml-2 font-medium text-[var(--theme-primary)]">| {filters.district}</span>}
        {filters.city && <span className="ml-2 font-medium text-[var(--theme-primary)]">| {filters.city}</span>}
      </p>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div className="min-w-0">
          <h3 className="text-xl font-semibold tracking-tight truncate text-[var(--theme-accent)]">{hospital.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{hospital.city}, {hospital.state}</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] px-3 py-1.5 text-xs font-medium">
          {hospital.achievement}% target achieved
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Infra icon={LucideIcons.Bed} label="Total Beds" value={hospital.totalBeds} />
        <Infra icon={LucideIcons.Syringe} label="ICU Beds" value={hospital.totalICUBeds} />
        <Infra icon={LucideIcons.Building2} label="OT Count" value={hospital.totalOT} />
        <Infra icon={LucideIcons.Stethoscope} label="Specialities" value={hospital.specialityCount} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <ChartCard title="Visit trend" subtitle="Last 6 months">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={visits}>
              <CartesianGrid stroke="var(--theme-bg-sidebar)" vertical={false} />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={11} />
              <YAxis stroke="#6b7280" fontSize={11} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--theme-bg-sidebar)", background: "#ffffff" }} />
              <Line dataKey="visits" stroke="var(--theme-primary)" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Achievement summary">
          <div className="space-y-3">
            {["Monthly", "Quarterly", "Yearly"].map((p, i) => {
              const v = [hospital.achievement, hospital.achievement - 6, hospital.achievement - 12][i];
              return (
                <div key={p}>
                  <div className="flex justify-between text-sm mb-1"><span>{p} target</span><span className="font-medium text-[var(--theme-accent)]">{v}%</span></div>
                  <div className="h-2 rounded-full bg-[var(--theme-bg-sidebar)] overflow-hidden">
                    <div className="h-full rounded-full bg-[var(--theme-primary)]" style={{ width: `${v}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}