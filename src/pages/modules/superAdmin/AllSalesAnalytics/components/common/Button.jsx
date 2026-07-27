// components/common/Button.jsx

export function Button({ children, variant = "default", size = "default", className = "", onClick, ...props }) {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    default: "bg-[#C6693C] text-white hover:bg-[#A54A29] focus-visible:ring-[#C6693C]",
    outline: "border border-[#C6693C] bg-white hover:bg-[#FFC4A2] focus-visible:ring-[#C6693C] text-[#C6693C]",
    ghost: "hover:bg-[#FFC4A2] focus-visible:ring-[#C6693C] text-[#C6693C]",
    secondary: "bg-[#FFE0B2] text-[#A54A29] hover:bg-[#FFC4A2] focus-visible:ring-[#C6693C]",
    destructive: "bg-[#A54A29] text-white hover:bg-[#8B3A1E] focus-visible:ring-[#A54A29]"
  };
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3 py-1.5 text-xs",
    lg: "h-11 px-8 py-2.5 text-base",
    icon: "h-10 w-10"
  };
  
  const classes = `${baseStyles} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className}`;
  
  return <button className={classes} onClick={onClick} {...props}>{children}</button>;
}