// components/analytics/ChartCard.jsx

export function ChartCard({ title, subtitle, action, children, className = "" }) {
  return (
    <section className={`rounded-2xl bg-white border border-[var(--theme-border)] shadow-sm hover:shadow-md transition-shadow duration-200 p-6 ${className}`}>
      <header className="flex items-start justify-between gap-4 mb-4">
        <div className="min-w-0">
          <h3 className="text-base font-bold text-[var(--theme-text-primary)]">{title}</h3>
          {subtitle && <p className="text-sm text-[var(--theme-text-secondary)] mt-0.5 font-medium">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </header>
      {children}
    </section>
  );
}