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
    <div className="inline-flex h-10 items-center justify-center rounded-lg bg-[#FFF8F5] p-1 border border-[#E8C9B8]">
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
          ? 'bg-[#C6693C] text-white shadow-sm' 
          : 'text-[#6B4226] hover:bg-[#F5E0D6] hover:text-[#C6693C]'
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