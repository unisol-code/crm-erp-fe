// components/common/Select.jsx

import React, { useState, useRef, useEffect } from "react";
import * as LucideIcons from "lucide-react";

export function Select({ value, onValueChange, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(value || "");
  const containerRef = useRef(null);

  useEffect(() => {
    if (value !== undefined && value !== null) {
      setSelected(value);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val) => {
    setSelected(val);
    if (onValueChange) onValueChange(val);
    setIsOpen(false);
  };

  let triggerElement = null;
  let contentElement = null;

  React.Children.forEach(children, (child) => {
    if (!child) return;
    
    if (child.type === SelectTrigger) {
      triggerElement = React.cloneElement(child, { 
        isOpen, 
        setIsOpen,
        selected,
        onClick: () => setIsOpen(!isOpen)
      });
    }
    
    if (child.type === SelectContent) {
      const options = React.Children.map(child.props.children, (optionChild) => {
        if (optionChild && optionChild.type === SelectItem) {
          return React.cloneElement(optionChild, { 
            handleSelect, 
            selected
          });
        }
        return optionChild;
      });
      contentElement = React.cloneElement(child, { 
        isOpen,
        children: options
      });
    }
  });

  if (!triggerElement) {
    triggerElement = (
      <SelectTrigger isOpen={isOpen} setIsOpen={setIsOpen} selected={selected}>
        <SelectValue placeholder="Select..." />
      </SelectTrigger>
    );
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      {triggerElement}
      {contentElement}
    </div>
  );
}

export function SelectTrigger({ className = "", children, isOpen, setIsOpen, selected, onClick }) {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) onClick(e);
    if (setIsOpen) setIsOpen(!isOpen);
  };

  return (
    <div 
      className={`flex h-11 w-full items-center justify-between rounded-lg bg-white px-3.5 py-2.5 text-sm ring-offset-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer hover:border-[var(--theme-primary)] transition-all duration-200 ${className}`}
      onClick={handleClick}
    >
      <span className="truncate flex-1 font-medium text-[var(--theme-text-primary)]">{children}</span>
      <LucideIcons.ChevronDown 
        size={18} 
        className={`transition-transform duration-200 flex-shrink-0 ml-2 text-[var(--theme-text-secondary)] ${isOpen ? "rotate-180" : ""}`} 
      />
    </div>
  );
}

export function SelectValue({ placeholder, children }) {
  const displayText = children || placeholder || "Select...";
  return <span className="text-sm text-[var(--theme-text-primary)]">{displayText}</span>;
}

export function SelectContent({ children, isOpen }) {
  if (!isOpen) return null;
  
  return (
    <div className="absolute z-[9999] w-full mt-1.5 rounded-xl border border-[var(--theme-border)] bg-white shadow-xl max-h-60 overflow-auto py-1.5">
      {children}
    </div>
  );
}

export function SelectItem({ value, children, handleSelect, selected }) {
  const isSelected = selected === value;
  
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (handleSelect) {
      handleSelect(value);
    }
  };
  
  return (
    <div 
      className={`flex cursor-pointer select-none items-center py-2.5 px-4 text-sm outline-none transition-all duration-150 ${
        isSelected 
          ? 'bg-[var(--theme-primary)] text-white' 
          : 'text-[var(--theme-text-primary)] hover:bg-[var(--theme-bg-hover)]'
      }`}
      onClick={handleClick}
    >
      {isSelected && <LucideIcons.Check className="mr-2.5 h-4 w-4 text-white" />}
      <span>{children}</span>
    </div>
  );
}