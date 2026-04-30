import React, { useEffect } from "react";
import useSalesAnalytics from "../../hooks/salesAnalytics/useSalesAnalytics";

const Viewmodal = ({ setviewmodal }) => {
  const { loading, salesById, fetchSalesById } = useSalesAnalytics();
  /*useEffect(() => {
    fetchSalesById(id);
  }, [id]);
  console.log("SalesById: ", salesById);*/
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[800px] p-8">
        {/* Title and Product Name Section */}
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-xl font-bold">Sales Report</h2>
          <div className="w-1/2">
            <label
              htmlFor="productName"
              className="block text-sm font-medium mb-1"
            >
              Product Name
            </label>
            <p id="productName" className="text-gray-700">
              Products
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Employee First Name", value: "John" },
            { label: "Employee Last Name", value: "Doe" },
            { label: "Organization Name", value: "Acme Corp" },
            { label: "Email", value: "john.doe@example.com" },
            { label: "Contact", value: "+1234567890" },
            { label: "Date", value: "2024-12-21" },
            { label: "Region", value: "North" },
            { label: "State", value: "California" },
            { label: "District", value: "San Francisco" },
            { label: "Bill Amount", value: "$5000" },
            { label: "Paid Amount", value: "$4500" },
            { label: "Uncleared Amount", value: "$500" },
            { label: "No. of Products Sold", value: "150" },
            { label: "Bill Status", value: "Paid" },
          ].map((field, idx) => (
            <div key={idx}>
              <label className="block text-sm font-medium mb-1">
                {field.label}
              </label>
              <p className="text-gray-700">{field.value}</p>
            </div>
          ))}
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={() => setviewmodal(false)}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Viewmodal;
