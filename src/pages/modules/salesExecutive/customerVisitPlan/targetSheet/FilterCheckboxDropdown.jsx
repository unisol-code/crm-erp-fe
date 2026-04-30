import React, { useState, useEffect, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useTheme } from "../../../../../hooks/theme/useTheme";
const FilterCheckboxDropdown = ({ label }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedValue, setSelectedValue] = useState("");
    const [checked, setChecked] = useState(false);
    const dropdownRef = useRef(null);
    const { themes } = useTheme();
    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleChange = (e) => {
        const value = e.target.value;
        setSelectedValue(value);
        setShowDropdown(false);
    };

    return (
        <div className="relative inline-block" ref={dropdownRef}>

            <label className="inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-[var(--primary-color)] text-white rounded text-sm cursor-pointer hover:bg-[var(--secondary-color)] hover:text-[var(--bgSidebar-color)]">
                <input
                    type="checkbox"
                    onChange={() => setShowDropdown(!showDropdown)}
                    className="accent-white"
                    checked={showDropdown}
                />
                <span className="flex items-center gap-1">
                    {label}
                    {selectedValue && `: ${selectedValue}`}
                </span>
                <FaChevronDown className="text-xs" />
            </label>


            {
                showDropdown && (
                    <div className="absolute top-full left-0 mt-2 bg-white text-black rounded shadow p-2 z-10 w-48 ">
                        <select
                            className="w-full border p-1 rounded text-sm "
                            onChange={handleChange}
                            value={selectedValue}
                        >
                            <option value="">Select {label}</option>
                            <option value={`Option 1`}>Option 1</option>
                            <option value={`Option 2`}>Option 2</option>
                        </select>
                    </div>
                )
            }
        </div >
    );
};

export default FilterCheckboxDropdown;
