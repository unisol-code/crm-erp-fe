/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { FaEye, FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BreadCrumb from "../../../../components/uiComponents/breadcrumb/BreadCrumb";
import { useTheme } from "../../../../hooks/theme/useTheme";
import { useNavigate } from "react-router-dom";
import totalCustomerIcon from "../../../../assets/images/totalCustomer_icon.png";
import Button from "../../../../components/uiComponents/button/Button";
import { Share } from "lucide-react";
import LoaderSpinner from "../../../../components/uiComponents/loader/LoaderSpinner";
import { UsersRound } from "lucide-react";
const SalesReport = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [modal, setModal] = useState(false);
  const [viewmodal, setViewmodal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [date, setDate] = useState("");
  const [dated, setDated] = useState("");
  const [loading, setLoading] = useState(true);
  const sampleReports = [
    {
      employee: "Anil Sharma",
      organization: "MedTech Solutions",
      region: "North",
      state: "Punjab",
      district: "Amritsar",
      contact: "9876543210",
      product: "SmartSurgn",
      date: "07/07/2024",
      productsSold: 6,
      billAmount: 46783,
      paidAmount: 46783,
      unclearedAmount: 0,
      status: "Paid",
    },
    {
      employee: "Priya Mehta",
      organization: "HealthFirst Corp",
      region: "West",
      state: "Maharashtra",
      district: "Mumbai",
      contact: "9988776655",
      product: "MediPulse",
      date: "01/07/2024",
      productsSold: 10,
      billAmount: 55000,
      paidAmount: 45000,
      unclearedAmount: 10000,
      status: "Unpaid",
    },
  ];

  const handleView = (report) => {
    localStorage.setItem("selectedReport", JSON.stringify(report));
    navigate("/sales-analytics/view-sales-report");
  };

  const handleDelete = (report) => {
    toast.error(`🗑️ Deleted report for ${report.employee}`, {
      autoClose: 3000,
    });
  };
  const onPageChange = (data) => {
    console.log("data", data);
    setPage(data);
  };

  const onItemsPerPageChange = (data) => {
    setLimit(data);
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="w-full min-h-screen">
      <BreadCrumb linkText={[{ text: "Sales" }, { text: "Sales Analytics" }]} />
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="w-full overflow-hidden rounded-2xl">
        <div className="mb-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                label: "Total Sales",
                value: "₹ 54,68,398.00",
                icon: totalCustomerIcon,
              },
              {
                label: "Cleared Bill",
                value: "₹ 45,08,738.00",
                icon: totalCustomerIcon,
              },
              {
                label: "Pending Bill",
                value: "₹ 9,59,660.00",
                icon: totalCustomerIcon,
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className="flex items-center p-4 transition-all bg-white border border-gray-200 shadow-lg rounded-2xl hover:shadow-xl"
              >
                <UsersRound
                  className="w-10 h-10"
                  style={{ color: theme.primaryColor }}
                />
                <div className="ml-4 text-left">
                  <p className="text-xs font-medium text-gray-600 sm:text-sm">
                    {card.label}
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-gray-800 mt-0.5">
                    {card.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="p-3 mt-4 bg-white border border-gray-200 shadow-lg rounded-2xl">
            <div className="flex flex-wrap justify-between gap-5">
              <h1 className=" text-2xl font-bold text-gray-800 ">
                Sales Report
              </h1>
              <Button
                variant={1}
                onClick={() => navigate("/sales-analytics/add-report")}
                text="Add Report"
              />
            </div>
            <hr
              className="h-1 border-0"
              style={{ backgroundColor: theme.secondaryColor }}
            />
            <div className="flex flex-wrap items-center justify-between gap-5 pt-2">
              {/* Date Range */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-black">From</span>
                <input
                  type="date"
                  className="border rounded-lg px-3 py-2 text-sm w-full sm:w-40 focus:outline-none focus:ring-2 focus:ring-[#8596FE]/30"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                <span className="text-sm font-medium text-black">To</span>
                <input
                  type="date"
                  className="border rounded-lg px-3 py-2 text-sm w-full sm:w-40 focus:outline-none focus:ring-2 focus:ring-[#8596FE]/30"
                  value={dated}
                  onChange={(e) => setDated(e.target.value)}
                />
              </div>

              {/* Time Period Filters */}
              <div className="flex flex-wrap gap-4">
                {["daily", "weekly", "monthly"].map((filter) => (
                  <label
                    key={filter}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="filter"
                      value={filter}
                      defaultChecked={filter === "daily"}
                    />
                    <span
                      className="text-sm font-medium text-gray"
                      style={{ color: theme.primaryColor }}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </span>
                  </label>
                ))}
              </div>

              {/* Action Buttons - Wrap Friendly */}
              <div className="flex flex-col flex-wrap items-center justify-start w-full gap-2 sm:flex-row sm:w-auto sm:justify-end">
                <Button variant={2} text="Print" />
                <Button variant={2} text="Export ▼" />
              </div>
            </div>

            {/* Sales Report Table */}
            <div className="mt-3 overflow-x-auto border border-gray-200 rounded-2xl">
              <table className="min-w-full text-sm text-left text-black">
                <thead
                  className="sticky top-0 z-10 text-xs uppercase bg-gray-100 border-b border-gray-300"
                  style={{ backgroundColor: theme.secondaryColor }}
                >
                  <tr>
                    <th className="p-4 text-base font-semibold">Sr. No.</th>
                    <th className="p-4 text-base font-semibold">Employee</th>
                    <th className="p-4 text-base font-semibold">Product</th>
                    <th className="p-4 text-base font-semibold">Date</th>
                    <th className="p-4 text-base font-semibold">
                      Products Sold
                    </th>
                    <th className="p-4 text-base font-semibold">Bill Amount</th>
                    <th className="p-4 text-base font-semibold">Paid Amount</th>
                    <th className="p-4 text-base font-semibold">
                      Uncleared Amount
                    </th>
                    <th className="p-4 text-base font-semibold">Status</th>
                    <th className="p-4 text-base font-semibold text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {
                    loading ? (
                      <tr>
                        <td colSpan="8">
                          <div className="bg-white w-full py-4 flex justify-center items-center">
                            <LoaderSpinner />
                          </div>
                        </td>
                      </tr>
                    ) : (sampleReports.length > 0 ? (
                      sampleReports.map((report, index) => (
                        <tr
                          key={index}
                          className="transition-all hover:bg-gray-50"
                        >
                          <td className="p-4 text-sm font-medium">
                            {(currentPage - 1) * rowsPerPage + index + 1}
                          </td>
                          <td className="p-4 text-sm font-medium">
                            {report.employee}
                          </td>
                          <td className="p-4 text-sm font-medium">
                            {report.product}
                          </td>
                          <td className="p-4 text-sm font-medium">
                            {report.date}
                          </td>
                          <td className="p-4 text-sm font-medium">
                            {report.productsSold}
                          </td>
                          <td className="p-4 text-sm font-medium">
                            ₹{report.billAmount.toLocaleString()}
                          </td>
                          <td className="p-4 text-sm font-medium">
                            ₹{report.paidAmount.toLocaleString()}
                          </td>
                          <td className="p-4 text-sm font-medium">
                            ₹{report.unclearedAmount.toLocaleString()}
                          </td>
                          <td className="p-4 text-sm font-medium">
                            <span
                              className={`px-3 py-2 rounded-md text-xs font-semibold ${report.status === "Paid"
                                ? "bg-green-100 text-green-600"
                                : report.status === "Unpaid"
                                  ? "bg-red-100 text-red-600"
                                  : "bg-yellow-100 text-yellow-700"
                                }`}
                            >
                              {report.status}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                className="p-2 transition-all duration-200 rounded-full hover:bg-yellow-100 hover:scale-105"
                                style={{ color: theme.primaryColor }}
                                onClick={() => handleView(report)}
                              >
                                <FaEye size={16} />
                              </button>
                              <button
                                className="p-2 transition-all duration-200 rounded-full hover:bg-yellow-100 hover:scale-105"
                                style={{ color: theme.primaryColor }}
                                onClick={() => handleDelete(report)}
                              >
                                <FaTrash size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="10"
                          className="py-6 text-center text-gray-500"
                        >
                          No sales reports found.
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Report Modal */}
      {modal && (
        <Addsalesreport
          refreshSalesReport={() => { }}
          onClose={() => setModal(false)}
        />
      )}
    </div>
  );
};

export default SalesReport;
