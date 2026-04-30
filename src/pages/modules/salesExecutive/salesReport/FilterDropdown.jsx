import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import Button from "../../../../components/uiComponents/button/Button";
import { useTheme } from "../../../../hooks/theme/useTheme";

const FilterDropdown = ({ from, to, setFrom, setTo, onSearch, onClose }) => {
  const { theme } = useTheme();
  return (
    <div className="absolute right-0 mt-2 z-50 w-80 bg-white border rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold  px-3 py-2 rounded-md  text-white" style={{ backgroundColor: theme.primaryColor }}>Filter Range</h3>
        <button onClick={onClose} className="text-gray-600 hover:text-red-500">
          <FaTimes />
        </button>
      </div>

      {/* Date Inputs */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            From Date
          </label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full mt-1 border rounded px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            To Date
          </label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full mt-1 border rounded px-3 py-2 text-sm"
          />
        </div>
        <div className="text-center">
          <Button text="Search" onClick={onSearch} />
        </div>
      </div>
    </div>
  );
};

export default FilterDropdown;
