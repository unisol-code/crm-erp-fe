// components/common/DropdownMenu.jsx

import React, { useState, useRef, useEffect } from "react";

export function DropdownMenu({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  let triggerElement = null;
  let contentElement = null;

  React.Children.forEach(children, (child) => {
    if (!child) return;
    
    if (child.type === DropdownMenuTrigger) {
      triggerElement = React.cloneElement(child, { 
        isOpen, 
        setIsOpen,
        onClick: () => setIsOpen(!isOpen)
      });
    }
    
    if (child.type === DropdownMenuContent) {
      contentElement = React.cloneElement(child, { 
        isOpen,
        setIsOpen 
      });
    }
  });

  return (
    <div className="relative" ref={containerRef}>
      {triggerElement}
      {contentElement}
    </div>
  );
}

export function DropdownMenuTrigger({ asChild, children, isOpen, setIsOpen, onClick }) {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) onClick(e);
    if (setIsOpen) setIsOpen(!isOpen);
  };
  
  if (asChild && children) {
    return React.cloneElement(children, { 
      onClick: (e) => {
        if (children.props.onClick) children.props.onClick(e);
        handleClick(e);
      }
    });
  }
  
  return (
    <div onClick={handleClick} className="cursor-pointer">
      {children}
    </div>
  );
}

export function DropdownMenuContent({ children, align = "start", isOpen, setIsOpen }) {
  if (!isOpen) return null;
  
  const handleClose = () => {
    if (setIsOpen) setIsOpen(false);
  };
  
  return (
    <div 
      className={`absolute z-[9999] min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white shadow-md mt-1 ${
        align === "end" ? "right-0" : "left-0"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      {React.Children.map(children, (child) => {
        if (!child) return null;
        if (child.type === DropdownMenuItem) {
          return React.cloneElement(child, { onClose: handleClose });
        }
        return child;
      })}
    </div>
  );
}

export function DropdownMenuItem({ children, onSelect, onClose }) {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSelect) onSelect(e);
    if (onClose) onClose();
  };
  
  return (
    <div
      className="flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none transition-colors hover:bg-[#FFC4A2] hover:text-[#A54A29]"
      onClick={handleClick}
    >
      {children}
    </div>
  );
}