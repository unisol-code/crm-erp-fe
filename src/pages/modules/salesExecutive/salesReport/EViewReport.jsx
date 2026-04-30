import React from "react";
import BreadCrumb from "../../../../components/uiComponents/breadcrumb/BreadCrumb";
import { useTheme } from "../../../../hooks/theme/useTheme";
import useGetSalesReport from "../../../../hooks/salesReport/useSalesReport";
import { useParams } from "react-router-dom";

const EViewReport = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const { getSalesReportById, salesReportId } = useGetSalesReport();

  const data = [];
  React.useEffect(() => {
    getSalesReportById(id);
  }, []);

  console.log("Sale Data By Id:", salesReportId);

  React.useEffect(() => {
    getSalesReportById(id);
  }, []);
  console.log("id data is:", salesReportId);

  return (
    <div className="w-full min-h-screen">
      {/* Breadcrumb */}
      <BreadCrumb
        linkText={[
          { text: "Sales Team Analysis" },
          {
            text: "Sales Report",
            href: "/sales-executive/sales-report",
          },
          { text: "View Sales Report" },
        ]}
      />
      <div className="p-4 bg-white shadow-lg rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">View Sales Report</h2>
        </div>
        <hr
          className="h-1 border-0"
          style={{ backgroundColor: theme.secondaryColor }}
        />
        <div className="mt-3 overflow-hidden overflow-x-auto border border-gray-300 rounded-2xl">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead
              className="sticky top-0 z-10 text-xs uppercase bg-gray-100 border-b border-gray-300"
              style={{ backgroundColor: theme.secondaryColor }}
            >
              <tr>
                <th className="p-4 text-base font-semibold">Sr. No.</th>
                <th className="p-4 text-base font-semibold">Invoice No.</th>
                <th className="p-4 text-base font-semibold">Date</th>
                <th className="p-4 text-base font-semibold">Customer Name</th>
                <th className="p-4 text-base font-semibold">Product Name</th>
                <th className="p-4 text-base font-semibold">Quantity</th>
                <th className="p-4 text-base font-semibold">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {salesReportId?.sales && (
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-4 text-sm font-medium">1</td>
                  <td className="p-4 text-sm font-medium">
                    {salesReportId.sales.price}
                  </td>
                  <td className="p-4 text-sm font-medium">
                    {/* {salesReportId?.sales.createdAt} */}
                  </td>
                  <td className="p-4 text-sm font-medium">
                    {salesReportId.sales.firstName}
                    {salesReportId.sales.lastName}
                  </td>
                  <td className="p-4 text-sm font-medium">
                    {salesReportId.sales.productName}
                  </td>
                  <td className="p-4 text-sm font-medium">
                    {salesReportId.sales.billAmount}
                  </td>
                  <td className="p-4 text-sm font-medium">
                    {salesReportId.sales.paidAmount}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EViewReport;
