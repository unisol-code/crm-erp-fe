import React, { useState, useEffect } from "react";
import { FaCirclePlus, FaEye } from "react-icons/fa6";
import Addsalesreport from "../../../../../components/Dialogs/Addsalesreport";
import Viewmodal from "../../../../../components/Dialogs/Viewmodal";
import { TiEdit } from "react-icons/ti";
import CompanyFinancialCharts from "./Com";
import useHomeDashboard from "../../../../../hooks/dashboard/useHomeDashboard";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb";
const CompanySalesReport = () => {
  const [date, setDate] = useState("");
  const [dated, setDated] = useState("");
  const [modal, setmodal] = useState(false);
  const [viewmodal, setviewmodal] = useState(false);
  const [update, setupdate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; // Number of rows per page

  // Mock data
  const data = [
    { employee: "Rupesh", totalSales: "09", sales: "09%", sold: "09" },
    { employee: "Raj", totalSales: "12", sales: "15%", sold: "20" },
    { employee: "Ankit", totalSales: "08", sales: "10%", sold: "13" },
    { employee: "Aman", totalSales: "11", sales: "18%", sold: "22" },
    { employee: "Nisha", totalSales: "10", sales: "12%", sold: "19" },
    { employee: "Amit", totalSales: "15", sales: "20%", sold: "30" },
    { employee: "Priya", totalSales: "13", sales: "22%", sold: "28" },
  ];

  // Pagination logic
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const currentRows = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const { homeTotalSale, fetchHomeTotalSale } = useHomeDashboard();

  useEffect(() => {
    fetchHomeTotalSale();
  }, []);

  console.log("Total Sale", homeTotalSale);

  return (
    <>
      <div className="container px-4 mx-auto ">
        {/* Breadcrumb Section */}
        {/* <div className="p-4 w-full min-h-screen"> */}
        <BreadCrumb
          linkText={[{ text: "Sales Pipeline" }, { text: "Sales Report" }]}
        />

        {/* Summary Card */}
        {/* <div className="flex flex-col items-center justify-between my-5 md:flex-row"> */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between my-5">

          {/* Left Item: Total Sales */}
          <div className="bg-white w-[160px] rounded-2xl shadow-xl h-[75px] flex justify-center items-center">
            <div className="font-semibold leading-6 text-center">
              <p className="text-[14px]">Total Sales</p>
              <p className="text-[14px]">₹ {homeTotalSale}</p>
            </div>
          </div>

          {/* Right Item: Date Inputs */}
          <div className="flex flex-col items-center gap-2 md:flex-row">
            <span className="text-[#8596FE] font-medium">From</span>
            <input
              type="date"
              className="border rounded-md p-2 text-sm w-[150px] focus:ring-2 focus:ring-blue-500"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <span className="text-[#8596FE] font-medium">To</span>
            <input
              type="date"
              className="border rounded-md p-2 text-sm w-[150px] focus:ring-2 focus:ring-blue-500"
              value={dated}
              onChange={(e) => setDated(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <CompanyFinancialCharts />
      {update && (
        <Addsalesreport
          update={update}
          setupdate={setupdate}
          setmodal={setmodal}
        />
      )}

      {viewmodal && <Viewmodal setviewmodal={setviewmodal} />}
    </>
  );
};

export default CompanySalesReport;
