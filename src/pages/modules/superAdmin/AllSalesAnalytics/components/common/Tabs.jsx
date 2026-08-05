// components/common/Tabs.jsx

import React, { useState } from "react";

export function Tabs({ defaultValue, children }) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  return (
    <div>
      {React.Children.map(children, child => {
        if (child && child.type === TabsList) {
          return React.cloneElement(child, { activeTab, setActiveTab });
        }
        if (child && child.type === TabsContent) {
          return React.cloneElement(child, { activeTab });
        }
        return child;
      })}
    </div>
  );
}

export function TabsList({ children, activeTab, setActiveTab }) {
  return (
    <div className="inline-flex h-10 items-center justify-center rounded-lg bg-[var(--theme-card-bg)] p-1 border border-[var(--theme-border)]">
      {React.Children.map(children, child => {
        if (child && child.type === TabsTrigger) {
          return React.cloneElement(child, { activeTab, setActiveTab });
        }
        return child;
      })}
    </div>
  );
}

export function TabsTrigger({ value, children, activeTab, setActiveTab }) {
  const isActive = activeTab === value;
  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
        isActive 
          ? 'bg-[var(--theme-primary)] text-white shadow-sm' 
          : 'text-[var(--theme-text-muted)] hover:bg-[var(--theme-bg-hover)] hover:text-[var(--theme-primary)]'
      }`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, activeTab, children }) {
  if (activeTab !== value) return null;
  return <div className="mt-4">{children}</div>;
}