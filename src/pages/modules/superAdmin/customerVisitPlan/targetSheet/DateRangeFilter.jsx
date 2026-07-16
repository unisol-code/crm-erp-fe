import React from "react";
const DateRangeFilter = () => (
  <div className="grid grid-cols-2 gap-4 mb-6">
    <div>
      <label className="block text-sm font-medium mb-1">From Date</label>
      <input type="date" className="w-full p-2 border rounded bg-gray-100" />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">To Date</label>
      <input type="date" className="w-full p-2 border rounded bg-gray-100" />
    </div>
  </div>
);

export default DateRangeFilter;
