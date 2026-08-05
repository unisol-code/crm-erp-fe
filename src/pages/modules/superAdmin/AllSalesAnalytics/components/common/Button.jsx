// components/common/Button.jsx

export function Button({ children, variant = "default", size = "default", className = "", onClick, ...props }) {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    default: "bg-[var(--theme-primary)] text-white hover:bg-[var(--theme-accent)] focus-visible:ring-[var(--theme-primary)]",
    outline: "border border-[var(--theme-primary)] bg-white hover:bg-[var(--theme-highlight)] focus-visible:ring-[var(--theme-primary)] text-[var(--theme-primary)]",
    ghost: "hover:bg-[var(--theme-highlight)] focus-visible:ring-[var(--theme-primary)] text-[var(--theme-primary)]",
    secondary: "bg-[var(--theme-highlight)] text-[var(--theme-accent)] hover:bg-[var(--theme-highlight)] focus-visible:ring-[var(--theme-primary)]",
    destructive: "bg-[var(--theme-accent)] text-white hover:bg-[var(--theme-accent)] focus-visible:ring-[var(--theme-accent)]"
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