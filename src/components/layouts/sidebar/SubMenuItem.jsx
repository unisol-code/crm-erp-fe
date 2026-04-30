import React from "react";
import { NavLink } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";

const SubMenuItem = ({
  sub,
  index,
  subItems,
  subExpanded,
  collapsed,
  handleToggle,
  item,
  pathname
}) => {
  const isLast = index === subItems.length - 1;
  const hasNoSubSubItems = !sub.subItems || sub.subItems.length === 0;

  return (
    <li key={sub.id} className="list-none font-medium">
      {sub.hasSubMenu ? (
        <>
          <div
            onClick={() => handleToggle(sub.id, sub.subItems, [item.id])}
            className={`flex items-center justify-between gap-2 p-2 text-sm cursor-pointer
              ${collapsed ? "justify-center" : "justify-between"}
              ${subExpanded ? "bg-white text-black" : "text-black"}
              ${hasNoSubSubItems && !isLast ? "border-b border-white" : ""}
              shadow-sm hover:shadow-md transition-all duration-200`}
          >
            {!collapsed && (
              <p className="text-sm font-medium w-full text-center">{sub.name}</p>
            )}
            {!collapsed && (
              <FaChevronDown
                className={`transition-transform duration-300 ${subExpanded ? "rotate-180" : "rotate-0"
                  } text-black`}
              />
            )}
          </div>

          {subExpanded && !collapsed && sub.subItems && (
            <ul className="mb-1 mt-2 ml-4 pb-2 pr-1">
              {sub.subItems.map((child, childIndex) => (
                <li key={child.id}>
                  <NavLink to={child.path}>
                    {({ isActive }) => (
                      <div
                        className={`text-sm p-2 cursor-pointer text-center rounded-md mb-2
                          ${isActive ? "bg-white text-black shadow" : "text-black shadow-sm"}
                          hover:shadow-md transition-all duration-200`}
                      >
                        <p className="text-sm text-center font-medium">{child.name}</p>
                      </div>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <NavLink to={sub.path}>
          {({ isActive }) => (
            <div
              className={`text-sm p-2 cursor-pointer
                ${isLast ? "rounded-b-lg" : "border-b border-white"}
                ${isActive ? "bg-white text-black shadow" : "text-black shadow-sm"}
                hover:shadow-md transition-all duration-200`}
            >
              <p className="text-sm font-medium text-center">{sub.name}</p>
            </div>
          )}
        </NavLink>
      )}
    </li>
  );
};

export default SubMenuItem;