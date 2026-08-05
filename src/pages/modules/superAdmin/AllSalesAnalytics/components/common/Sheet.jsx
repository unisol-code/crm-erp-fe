// components/common/Sheet.jsx

export function Sheet({ open, onOpenChange, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={() => onOpenChange(false)}>
      <div className="fixed inset-y-0 right-0 z-50 flex w-full sm:max-w-lg flex-col border-l border-[var(--theme-bg-sidebar)] bg-[var(--theme-primary-bg)] shadow-lg" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export function SheetContent({ className = "", children }) {
  return <div className={`flex-1 overflow-y-auto p-6 ${className}`}>{children}</div>;
}

export function SheetHeader({ children }) {
  return <div className="flex flex-col space-y-1.5 text-center sm:text-left">{children}</div>;
}

export function SheetTitle({ children }) {
  return <h2 className="text-lg font-semibold leading-none tracking-tight text-[var(--theme-accent)]">{children}</h2>;
}

export function SheetDescription({ children }) {
  return <p className="text-sm text-gray-500">{children}</p>;
}