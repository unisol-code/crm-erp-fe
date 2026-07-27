// components/analytics/AchievementBadge.jsx

export function AchievementBadge({ value }) {
  const tone = value >= 85 ? "bg-green-500/15 text-green-500" : value >= 70 ? "bg-yellow-500/15 text-yellow-600" : "bg-red-500/15 text-red-500";
  return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${tone}`}>{value}%</span>;
}

export function AchBadge({ v }) {
  const tone = v > 85 ? "bg-green-500/15 text-green-500" : v >= 70 ? "bg-yellow-500/15 text-yellow-600" : "bg-red-500/15 text-red-500";
  return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${tone}`}>{v}%</span>;
}

export function EmptyState() {
  return <div className="py-16 text-center text-sm text-gray-500">No data matches the current filters.</div>;
}