// components/analytics/KpiCard.jsx

import * as LucideIcons from "lucide-react";

const accentMap = {
  success: { bg: "bg-green-50", fg: "text-green-600", ring: "ring-green-200", iconBg: "bg-green-100" },
  info: { bg: "bg-blue-50", fg: "text-blue-600", ring: "ring-blue-200", iconBg: "bg-blue-100" },
  product: { bg: "bg-[#FFF5F0]", fg: "text-[#C6693C]", ring: "ring-[#E8C9B8]", iconBg: "bg-[#F5E0D6]" },
  target: { bg: "bg-yellow-50", fg: "text-yellow-600", ring: "ring-yellow-200", iconBg: "bg-yellow-100" },
};

export function KpiCard({ title, value, trend, accent, icon: Icon, onClick }) {
  const a = accentMap[accent] || accentMap.product;
  return (
    <button onClick={onClick} className="group text-left w-full rounded-2xl bg-white border border-[#E8C9B8] p-5 shadow-sm hover:shadow-lg hover:border-[#C6693C] transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className={`h-12 w-12 rounded-xl grid place-items-center ${a.iconBg} ring-1 ${a.ring}`}>
          <Icon size={20} className={a.fg} />
        </div>
        <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2.5 py-1 rounded-full ${a.bg} ${a.fg}`}>
          <LucideIcons.ArrowUpRight size={12} />+{trend}%
        </span>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-[#8B5A3C]">{title}</p>
        <p className="mt-1 text-3xl font-bold tracking-tight text-[#2D1A0E]">{value}</p>
      </div>
    </button>
  );
}