// components/common/Table.jsx

export function Table({ children, className = "" }) {
  return <table className={`w-full caption-bottom text-sm ${className}`}>{children}</table>;
}

export function TableHeader({ children }) {
  return <thead className="bg-[var(--theme-card-bg)] border-b border-[var(--theme-border)]">{children}</thead>;
}

export function TableBody({ children }) {
  return <tbody>{children}</tbody>;
}

export function TableRow({ children, className = "", onClick }) {
  return <tr className={`border-b border-[var(--theme-border)] transition-colors hover:bg-[var(--theme-card-bg)] ${className}`} onClick={onClick}>{children}</tr>;
}

export function TableHead({ children, className = "" }) {
  return <th className={`h-12 px-4 text-left align-middle font-semibold text-[var(--theme-text-primary)] ${className}`}>{children}</th>;
}

export function TableCell({ children, className = "" }) {
  return <td className={`p-4 align-middle text-[var(--theme-text-primary)] ${className}`}>{children}</td>;
}