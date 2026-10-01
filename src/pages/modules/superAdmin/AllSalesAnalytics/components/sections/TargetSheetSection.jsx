// components/sections/TargetSheetSection.jsx
//
// "Target Sheet" tab - reads dashboard/targetSheetAnalytics:
//   {
//     data: {
//       monthlyTarget, monthlyAchieved, monthlyPercentage,
//       quarterlyTarget, quarterlyAchieved, quarterlyPercentage,
//       yearlyTarget, yearlyAchieved, yearlyPercentage,
//       months:   [{ month, shortMonth, target, achieved, percentage }],
//       quarters: [{ quarter, key, target, achieved, percentage }],
//       currentMonth, currentQuarter,
//     },
//   }
// The OLD API returned an ARRAY - that shape shows the empty state below.

import React, { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard, AchievementBadge } from "../analytics";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../common";
import LoaderSpinner from "../../../../../../components/uiComponents/loader/LoaderSpinner.jsx";

const formatAmount = (value) => Number(value || 0).toLocaleString("en-US");

// Same achievement colours the app already uses
// (green >= 100, theme primary 80-99, red < 80)
const achievementColor = (pct) =>
  pct >= 100 ? "#16a34a" : pct >= 80 ? "var(--theme-primary)" : "#ef4444";

// "Quarter3" -> "Quarter 3"   ("Sep" stays "Sep")
const formatQuarter = (value) =>
  String(value || "").replace(/([A-Za-z])(\d)/, "$1 $2");

// 2200000 -> "2.2M", 150000 -> "150k" (Y axis labels)
const compactAmount = (value) => {
  const n = Number(value) || 0;
  if (Math.abs(n) >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (Math.abs(n) >= 1000) return `${Math.round(n / 1000)}k`;
  return String(n);
};

// Circular progress ring - pure SVG, no extra library
function ProgressRing({ percentage, size = 84, stroke = 9 }) {
  const pct = Math.max(0, Math.min(100, Number(percentage) || 0));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          stroke="var(--theme-border)"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          stroke={achievementColor(pct)}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-sm font-bold text-[var(--theme-text-primary)]">
        {`${Math.round(pct)}%`}
      </div>
    </div>
  );
}

// Monthly / Quarterly / Yearly summary card (top row)
function TargetCard({ title, period, target, achieved, percentage, highlighted = false }) {
  return (
    <div
      className={`rounded-xl border p-4 bg-[var(--theme-card-bg)] ${
        highlighted
          ? "border-[var(--theme-primary)] shadow-md shadow-[var(--theme-primary)]/10"
          : "border-[var(--theme-border)]"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--theme-text-secondary)]">
        {title}
        {period ? ` (${period})` : ""}
      </p>
      <div className="mt-3 flex items-center gap-4">
        <ProgressRing percentage={percentage} />
        <div className="space-y-1.5 min-w-0">
          <p className="text-xs text-[var(--theme-text-secondary)]">
            Target:
            <span className="ml-1 text-sm font-semibold text-[var(--theme-text-primary)]">
              {formatAmount(target)}
            </span>
          </p>
          <p className="text-xs text-[var(--theme-text-secondary)]">
            Achieved:
            <span className="ml-1 text-sm font-semibold text-[var(--theme-text-primary)]">
              {formatAmount(achieved)}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export function TargetSheetSection({ targetData, loading = false }) {
  // New response: data is an OBJECT with months[] and quarters[]
  const data =
    targetData?.data && !Array.isArray(targetData.data) ? targetData.data : null;

  const months = useMemo(
    () => (Array.isArray(data?.months) ? data.months : []),
    [data],
  );
  const quarters = useMemo(
    () => (Array.isArray(data?.quarters) ? data.quarters : []),
    [data],
  );
  const chartData = useMemo(
    () =>
      months.map((m) => ({
        name: m.shortMonth || m.month,
        target: m.target || 0,
        achieved: m.achieved || 0,
      })),
    [months],
  );

  // First load - nothing to show yet
  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoaderSpinner />
      </div>
    );
  }

  // Nothing to show (no data / old array response)
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center px-4">
        <p className="text-sm font-semibold text-[var(--theme-text-primary)]">
          No target sheet data available
        </p>
        <p className="text-xs text-[var(--theme-text-secondary)] mt-1">
          Please try again later or change the filters.
        </p>
      </div>
    );
  }

  const currentQuarterKey = String(data.currentQuarter || "");

  return (
    <div>
      {/* Page header */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-[var(--theme-text-primary)]">
          Target Sheet Analytics
        </h2>
        <p className="text-sm text-[var(--theme-text-secondary)]">
          Performance Overview
        </p>
        <p className="text-sm font-semibold text-[var(--theme-primary)]">
          {formatQuarter(data.currentMonth)} | {formatQuarter(data.currentQuarter)}
        </p>
      </div>

      {/* 1. Monthly / Quarterly / Yearly target cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TargetCard
          title="Monthly Target"
          period={formatQuarter(data.currentMonth)}
          target={data.monthlyTarget}
          achieved={data.monthlyAchieved}
          percentage={data.monthlyPercentage}
          highlighted
        />
        <TargetCard
          title="Quarterly Target"
          period={formatQuarter(data.currentQuarter)}
          target={data.quarterlyTarget}
          achieved={data.quarterlyAchieved}
          percentage={data.quarterlyPercentage}
          highlighted
        />
        <TargetCard
          title="Yearly Target"
          period={String(new Date().getFullYear())}
          target={data.yearlyTarget}
          achieved={data.yearlyAchieved}
          percentage={data.yearlyPercentage}
        />
      </div>

      {/* 2. Monthly performance chart + quarterly cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <ChartCard
          title="Monthly Performance"
          subtitle="Target vs achieved, month by month"
          className="lg:col-span-2"
        >
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-[260px] text-sm text-gray-400">
              No monthly data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={chartData}
                margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--theme-border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#6b7280"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="#6b7280"
                  fontSize={11}
                  tickLine={false}
                  width={44}
                  tickFormatter={compactAmount}
                />
                <Tooltip
                  cursor={{ fill: "var(--theme-bg-light)" }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--theme-bg-sidebar)",
                    background: "#ffffff",
                    padding: "10px 14px",
                  }}
                  formatter={(value, name) => [formatAmount(value), name]}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Bar
                  dataKey="target"
                  name="Target"
                  fill="var(--theme-secondary)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={22}
                />
                <Bar
                  dataKey="achieved"
                  name="Achieved"
                  fill="var(--theme-primary)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={22}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard
          title="Quarterly Performance"
          subtitle="Target vs achieved by quarter"
        >
          <div className="grid grid-cols-2 gap-3">
            {quarters.length === 0 ? (
              <p className="col-span-2 text-sm text-gray-400">
                No quarterly data available
              </p>
            ) : (
              quarters.map((q) => {
                const isCurrent = q.key === currentQuarterKey;
                return (
                  <div
                    key={q.key || q.quarter}
                    className={`rounded-xl border p-3 text-center bg-[var(--theme-card-bg)] ${
                      isCurrent
                        ? "border-[var(--theme-primary)] shadow-md shadow-[var(--theme-primary)]/10"
                        : "border-[var(--theme-border)]"
                    }`}
                  >
                    <p className="text-xs font-semibold text-[var(--theme-text-primary)]">
                      {formatQuarter(q.key) || q.quarter}
                    </p>
                    <p className="text-[10px] text-[var(--theme-text-secondary)] mt-1">
                      Target: {formatAmount(q.target)}
                    </p>
                    <p className="text-[10px] text-[var(--theme-text-secondary)]">
                      Achieved: {formatAmount(q.achieved)}
                    </p>
                    <div className="mt-2 flex justify-center">
                      <ProgressRing percentage={q.percentage} size={62} stroke={7} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ChartCard>
      </div>

      {/* 3. Monthly breakdown table */}
      <ChartCard
        title="Monthly Breakdown"
        subtitle={`${months.length} months - target vs achieved`}
        className="mt-4"
      >
        <div className="mt-2 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead className="text-right">Target</TableHead>
                <TableHead className="text-right">Achieved</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead className="text-right">Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8">
                    <div className="flex justify-center items-center w-full">
                      <LoaderSpinner />
                    </div>
                  </td>
                </tr>
              ) : months.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-8 text-sm text-gray-500"
                  >
                    No monthly data available
                  </td>
                </tr>
              ) : (
                months.map((m) => (
                  <TableRow key={m.month}>
                    <TableCell className="font-medium">{m.month}</TableCell>
                    <TableCell className="text-right">
                      {formatAmount(m.target)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatAmount(m.achieved)}
                    </TableCell>
                    <TableCell>
                      <div className="w-40 h-1.5 bg-[var(--theme-bg-light)] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(m.percentage || 0, 100)}%`,
                            backgroundColor: achievementColor(m.percentage || 0),
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <AchievementBadge
                        value={Number((m.percentage || 0).toFixed(1))}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </ChartCard>
    </div>
  );
}
