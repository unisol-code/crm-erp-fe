// components/analytics/ChartCard.jsx

export function ChartCard({ title, subtitle, action, children, className = "" }) {
  return (
    <section className={`rounded-2xl bg-white border border-[#E8C9B8] shadow-sm hover:shadow-md transition-shadow duration-200 p-6 ${className}`}>
      <header className="flex items-start justify-between gap-4 mb-4">
        <div className="min-w-0">
          <h3 className="text-base font-bold text-[#2D1A0E]">{title}</h3>
          {subtitle && <p className="text-sm text-[#8B5A3C] mt-0.5 font-medium">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </header>
      {children}
    </section>
  );
}