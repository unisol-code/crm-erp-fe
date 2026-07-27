// components/common/Dialog.jsx

export function Dialog({ open, onOpenChange, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={() => onOpenChange(false)}>
      <div className="fixed left-[50%] top-[50%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] border border-gray-200 bg-white shadow-lg rounded-lg p-6" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export function DialogContent({ className = "", children }) {
  return <div className={className}>{children}</div>;
}

export function DialogHeader({ children }) {
  return <div className="flex flex-col space-y-1.5 text-center sm:text-left">{children}</div>;
}

export function DialogTitle({ children }) {
  return <h2 className="text-lg font-semibold leading-none tracking-tight">{children}</h2>;
}