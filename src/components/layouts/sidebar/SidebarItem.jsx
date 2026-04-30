import React from "react";
import { NavLink } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";

const SidebarItem = ({
  item,
  collapsed,
  isExpanded,
  isMainActive,
  handleToggle,
  renderSubItems,
  theme,
  pathname,
  setExpandedItems
}) => {
  const hasSubMenu = item.hasSubMenu;

  return (
    <div key={item.id}>
      {hasSubMenu ? (
        <>
          <div
            onClick={() => handleToggle(item.id, item.subItems, [])}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer
              ${collapsed ? "justify-center" : "justify-start px-4"}
              ${isMainActive ? "bg-white text-black shadow-xl" : "bg-[var(--primary-color)] text-white hover:text-black hover:bg-[var(--highlight-color)]"} hover:scale-[1.02] active:scale-95
              ${isMainActive && isExpanded ? "border-b-2 border-black" : ""}
              ${isExpanded ? "rounded-b-none" : ""}
              shadow-xl hover:shadow-xl transition-all duration-300`}
          >
            <span className="w-6 h-6 text-inherit">{item.icon}</span>
            {!collapsed && <p className="text-sm font-medium w-full">{item.name}</p>}
            {!collapsed && <FaChevronDown className={`transition-transform duration-500 ${isExpanded ? "rotate-180" : "rotate-0"}`} />}
          </div>

          {isExpanded && !collapsed && (
            <div className="bg-[var(--highlight-color)] rounded-b-lg mb-2">
              {renderSubItems(item.subItems)}
            </div>
          )}
        </>
      ) : (
        <NavLink to={item.path} onClick={() => setExpandedItems([])}>
          {({ isActive }) => (
            <div className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer
              ${collapsed ? "justify-center" : "justify-start px-4"}
              ${isActive ? "bg-white text-black shadow-xl" : "bg-[var(--primary-color)] text-white"}
              hover:bg-[var(--highlight-color)] hover:text-black
              shadow-sm hover:shadow-xl transition-all duration-300`}
            >
              <span className="w-6 h-6 text-inherit">{item.icon}</span>
              {!collapsed && <p className="text-base font-medium w-full">{item.name}</p>}
            </div>
          )}
        </NavLink>
      )}
    </div>
  );
};

export default SidebarItem;