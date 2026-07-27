// components/common/Table.jsx

export function Table({ children, className = "" }) {
  return <table className={`w-full caption-bottom text-sm ${className}`}>{children}</table>;
}

export function TableHeader({ children }) {
  return <thead className="bg-[#FFF8F5] border-b border-[#E8C9B8]">{children}</thead>;
}

export function TableBody({ children }) {
  return <tbody>{children}</tbody>;
}

export function TableRow({ children, className = "", onClick }) {
  return <tr className={`border-b border-[#F5E8E0] transition-colors hover:bg-[#FFF8F5] ${className}`} onClick={onClick}>{children}</tr>;
}

export function TableHead({ children, className = "" }) {
  return <th className={`h-12 px-4 text-left align-middle font-semibold text-[#5A2D1A] ${className}`}>{children}</th>;
}

export function TableCell({ children, className = "" }) {
  return <td className={`p-4 align-middle text-[#3D2314] ${className}`}>{children}</td>;
}