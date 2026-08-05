// components/common/Badge.jsx

export function Badge({ children, variant = "default", className = "" }) {
  const variants = {
    default: "bg-[var(--theme-primary)] text-white",
    secondary: "bg-[var(--theme-secondary)] text-[var(--theme-accent)]",
    outline: "border border-[var(--theme-primary)] text-[var(--theme-primary)]",
    destructive: "bg-[var(--theme-accent)] text-white"
  };
  
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant] || variants.default} ${className}`}>{children}</span>;
}