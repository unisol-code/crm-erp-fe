// components/common/Badge.jsx

export function Badge({ children, variant = "default", className = "" }) {
  const variants = {
    default: "bg-[#C6693C] text-white",
    secondary: "bg-[#FFE0B2] text-[#A54A29]",
    outline: "border border-[#C6693C] text-[#C6693C]",
    destructive: "bg-[#A54A29] text-white"
  };
  
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant] || variants.default} ${className}`}>{children}</span>;
}