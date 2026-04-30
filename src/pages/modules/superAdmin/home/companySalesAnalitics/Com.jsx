import React, { useEffect } from "react";
import { FaEye } from "react-icons/fa";
import { TiEdit } from "react-icons/ti";
import useCompanySalesAnalytics from "../../../../../hooks/allCompanySalesAnalytics/useCompanySalesAnalytics";
import { useTheme } from "../../../../../hooks/theme/useTheme";

const CompanyFinancialTables = () => {
  const { loading, fetchCompanySalesReport, companySalesReports } =
    useCompanySalesAnalytics();
  const { theme } = useTheme();
  useEffect(() => {
    fetchCompanySalesReport();
  }, []);

  const TableComponent = ({ data, title, color, backgroundColor }) => (
    <div className="flex flex-col  bg-white rounded-lg shadow md:flex-row">
      <div className="w-full">
        {/* Title */}
        <div className="rounded-t-lg" style={{ backgroundColor: color }}>
          <h2
            className="mb-4 text-lg md:text-xl font-semibold text-black p-3 text-center ">
            {title}
          </h2>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto scrollbar-hide px-2 md:px-8">
          <table className="min-w-full border-collapse">
            {/* Table Head */}
            <thead className="text-[#252C58]  bg-white shadow">
              <tr className="border-b">
                <th className="py-3 px-2 md:px-4 font-medium text-left whitespace-nowrap">Name</th>
                <th className="py-3 px-2 md:px-4 font-medium text-left whitespace-nowrap">Total Sales</th>
                <th className="py-3 px-2 md:px-4 font-medium text-left whitespace-nowrap">Sales %</th>
                <th className="py-3 px-2 md:px-4 font-medium text-left whitespace-nowrap">No. of Products Sold</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-b last:border-b-0">
                  <td className="py-3 px-2 md:px-4 text-sm md:text-base">{item.name}</td>

                  <td className="py-3 px-2 md:px-4 text-sm md:text-base">
                    ₹ {item.totalSales.toLocaleString()}
                    {/* Progress bar */}
                    <div className="relative w-full h-2 mt-2 bg-gray-200 rounded-full" >
                      <div
                        className="h-2 bg-blue-400 rounded-full"
                        style={{ width: `${item.salesInPercentage}%`, backgroundColor: backgroundColor }}
                      />
                    </div>
                  </td>

                  <td className="py-3 px-2 md:px-4 text-sm md:text-base font-semibold text-blue-500">
                    <span className="px-3 py-1 text-xs md:text-sm text-black bg-blue-100 rounded-full" style={{ backgroundColor: color }}>
                      {item.salesInPercentage}%
                    </span>
                  </td>

                  <td className="py-3 px-2 md:px-4 text-sm md:text-base text-center">
                    {item.noOfProductsSold}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>

  );

  if (loading) {
    return <div className="py-4 text-center">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {companySalesReports && companySalesReports.length === 4 ? (
          <>
            <TableComponent
              data={companySalesReports[0].salesPeople}
              title={companySalesReports[0].companyName}
              color={"#89CFF0"}
              backgroundColor={"#4FA8E5"}
            />
            <TableComponent
              data={companySalesReports[1].salesPeople}
              title={companySalesReports[1].companyName}
              color={"#FFE0B2"}
              backgroundColor={"#C6693C"}
            />
            <TableComponent
              data={companySalesReports[2].salesPeople}
              title={companySalesReports[2].companyName}
              color={"#BBDBC0"}
              backgroundColor={"#4A7E4C"}
            />
            <TableComponent
              data={companySalesReports[3].salesPeople}
              title={companySalesReports[3].companyName}
              color={"#D6D8FB"}
              backgroundColor={"#9683EC"}
            />
          </>
        ) : (
          <div className="col-span-2 text-center">No data available</div>
        )}
      </div>
    </div>
  );
};

export default CompanyFinancialTables;
