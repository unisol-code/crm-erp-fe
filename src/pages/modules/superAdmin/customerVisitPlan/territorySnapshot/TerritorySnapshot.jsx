import React, { useState, useEffect } from "react";
import { PiHospital } from "react-icons/pi";
import { RiCalendarCheckLine, RiUserStarFill } from "react-icons/ri";
import { IoBagAddSharp } from "react-icons/io5";
import { BiLoaderAlt } from "react-icons/bi";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb";
import Button from "../../../../../components/uiComponents/button/Button";
import useTerritorySnapshot from "../../../../../hooks/territorySnapshort/useTerritorySnapshort";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-gray-200 rounded-lg mb-4"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
      ))}
    </div>
    <div className="h-48 bg-gray-200 rounded-2xl mb-8"></div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="h-64 bg-gray-200 rounded-2xl"></div>
      ))}
    </div>
  </div>
);

const InfoItem = ({ label, value, icon: Icon }) => (
  <div className="group bg-gradient-to-r from-blue-50 to-white p-4 rounded-xl border border-blue-100 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
    <div className="flex items-center gap-3">
      {Icon && (
        <Icon className="text-blue-500 text-lg group-hover:scale-110 transition-transform duration-300" />
      )}
      <div className="flex-1">
        <span className="text-[15px] text-gray-700 font-semibold xl:whiteSpace-nowrap md:whitespace-preline md:leading-none  mb-1">
          {label}
        </span>
        <span className="bg-white border-2 border-blue-200 px-4 py-2 rounded-lg text-sm font-bold text-blue-700 min-w-[120px] text-center shadow-sm block">
          {value}
        </span>
      </div>
    </div>
  </div>
);

const Card = ({ icon, label, value, gradient, delay = 0 }) => (
  <div
    className={`${gradient} rounded-2xl px-4 py-1 flex flex-col items-center shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-white/20 group cursor-pointer`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="text-white mb-1 mt-1 p-3 bg-white/20 rounded-full backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
      {icon}
    </div>
    <p className="text-white font-semibold text-center mb-1 text-lg group-hover:text-blue-100 transition-colors duration-300">
      {label}
    </p>
    <p className="text-3xl font-bold text-white drop-shadow-sm group-hover:scale-105 transition-transform duration-300">
      {value}
    </p>
    <div className="w-0 group-hover:w-full h-1 bg-white/30 rounded-full transition-all duration-500 mt-1"></div>
  </div>
);

const KeyValue = ({ label, value, color, icon: Icon, delay = 0 }) => (
  <div
    className="flex justify-between items-center p-4 mb-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:shadow-md cursor-pointer group"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-center gap-3">
      {Icon && (
        <Icon className="text-gray-500 group-hover:text-gray-700 transition-colors duration-300" />
      )}
      <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
        {label}
      </span>
    </div>
    <span
      className="px-4 py-2 rounded-full font-semibold text-sm shadow-sm group-hover:scale-105 transition-transform duration-300"
      style={{
        backgroundColor: `${color}15`,
        color: color,
        border: `2px solid ${color}30`,
      }}
    >
      {value}
    </span>
  </div>
);

const TerritorySnapshot = () => {
  const { fetchTerritorySnap, territorySnap, loading } = useTerritorySnapshot();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );

  const handleMonthChange = (newValue) => {
    setSelectedMonth(newValue);
    if (newValue instanceof Date && !Number.isNaN(newValue.getTime())) {
      setSelectedYear(newValue.getFullYear().toString());
    }
  };

  useEffect(() => {
    fetchTerritorySnap();
  }, []);

  const topSummary = territorySnap?.topSummary || {};
  const data = {
    joiningDate: topSummary.joiningDate
      ? new Date(topSummary.joiningDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      : "",
    tenure: topSummary.tenureOfOrganization || "--",
    headquarter: topSummary.headquarter || "--",
    currentMonthWorkingDays: topSummary.totalWorkingDaysCurrentMonth || "--",
    totalHospital: territorySnap?.totalHospitalCovered || "--",
    totalSpeciality: territorySnap?.totalSpecialityCovered || "--",
    totalDoctor: territorySnap?.totalDoctorCoverage || "--",
    totalCustomer: territorySnap?.totalCustomerBase || "--",
    selectedMonthWorkingDays: territorySnap?.selectedMonthWorkingDays || "--",
    profileDetails: territorySnap?.profileDetails
      ? Object.fromEntries(
        territorySnap.profileDetails.map((item) => [
          item.personNature.replace("Total ", "").toLowerCase(),
          item.total,
        ])
      )
      : {},
    categoryDetails: territorySnap?.categoryDetails
      ? Object.fromEntries(
        territorySnap.categoryDetails.map((item) => [
          item.person
            .replace("Total Number of ", "")
            .charAt(0)
            .toLowerCase() + "Person",
          item.total,
        ])
      )
      : {},
  };

  // if (loading) {
  //   return (
  //     <div className="w-full min-h-screen ">
  //       <BreadCrumb
  //         linkText={[
  //           {
  //             text: "Customer Visit Plan",
  //             href: "/sales-executive/monthly-planning",
  //           },
  //           { text: "Territory Snapshot" },
  //         ]}
  //       />
  //       <div className="space-y-8 p-8 bg-white rounded-2xl ">
  //         <div className="flex items-center justify-center h-64">
  //           <div className="text-center">
  //             <BiLoaderAlt className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
  //             <p className="text-gray-600 text-lg">Loading Territory Data...</p>
  //           </div>
  //         </div>
  //         <LoadingSkeleton />
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="w-full min-h-screen ">
      {/* Breadcrumbs */}
      <BreadCrumb
        linkText={[
          {
            text: "Customer Visit Plan",
            href: "/sales-executive/monthly-planning",
          },
          { text: "Territory Snapshot" },
        ]}
      />

      <div className=" space-y-8 p-8 bg-white rounded-2xl ">
        {/* Enhanced Info Section */}
        <div className=" p-4 rounded-2xl shadow-xl border-2 border-blue-200 relative overflow-hidden">
          <div className="absolute inset-0 "></div>
          <div className="relative z-10">
            <h2 className="text-black text-2xl font-bold mb-6 text-center">
              Territory Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <InfoItem label="Joining date" value={data.joiningDate} />
              <InfoItem
                label="Tenure of the organization"
                value={data.tenure}
              />
              <InfoItem label="Headquarter" value={data.headquarter} />
              <InfoItem
                label="Total working days of the current month"
                value={`${data.currentMonthWorkingDays} Days`}
              />
            </div>
          </div>
        </div>

        {/* Enhanced Cards with gradients and staggered animations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card
            icon={<PiHospital size={35} />}
            label="Total Hospital Covered"
            value={data.totalHospital}
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
            delay={0}
          />
          <Card
            icon={<RiCalendarCheckLine size={35} />}
            label="Total Speciality Covered"
            value={data.totalSpeciality}
            gradient="bg-gradient-to-br from-green-500 to-green-600"
            delay={100}
          />
          <Card
            icon={<IoBagAddSharp size={35} />}
            label="Total Doctor Coverage"
            value={data.totalDoctor}
            gradient="bg-gradient-to-br from-purple-500 to-purple-600"
            delay={200}
          />
          <Card
            icon={<RiUserStarFill size={35} />}
            label="Total Customer Base"
            value={data.totalCustomer}
            gradient="bg-gradient-to-br from-orange-500 to-orange-600"
            delay={300}
          />
        </div>

        {/* Enhanced Month Selection Section */}
        <div className="bg-gradient-to-r from-white to-blue-50 border-2 border-blue-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                Select Month & Year
              </h2>
              <div className="flex gap-2 mt-3 sm:mt-0">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label={"Month & Year"}
                    openTo="month"
                    views={["year", "month"]}
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    slotProps={{
                      textField: {
                        className:
                          "min-w-[180px] max-w-[180px] bg-transparent focus:bg-transparent transition-all duration-200 shadow-none outline-none",
                        fullWidth: true,
                        variant: "outlined",
                        size: "small",
                        sx: {
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "0.75rem",
                            height: "40px",
                            minWidth: "180px",
                            maxWidth: "180px",
                            backgroundColor: "transparent",
                            boxShadow: "none",
                            color: "black",
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#94a3b8",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#ffffff",
                              boxShadow: "none",
                            },
                            "& .MuiOutlinedInput-input": {
                              "&::placeholder": {
                                color: "black",
                                opacity: 1,
                              },
                            },
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#e5e7eb",
                          },
                          "& .MuiInputLabel-root": {
                            fontSize: "0.95rem",
                            color: "black",
                          },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
                <div className="mt-1 px-2">
                  <Button text="View" />
                </div>
              </div>
            </div>
            <div>
              <div className="flex flex-col items-center bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="text-white font-semibold text-lg text-center w-[280px] mb-3">
                  Total Working Days Of The Selected Month
                </div>
                <div className="text-4xl font-bold text-white drop-shadow-sm">
                  {data.selectedMonthWorkingDays}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Profile & Category Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Details */}
          <div className="bg-white border-2 border-blue-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
              <h3 className="text-blue-600 font-bold text-xl">
                Profile Details
              </h3>
            </div>
            <div className="grid grid-cols-2 font-bold text-sm text-gray-600 mb-4 p-3 bg-gray-50 rounded-lg">
              <span>Person Nature</span>
              <span className="text-right">Total</span>
            </div>
            <KeyValue
              label="Total Doer"
              value={data.profileDetails.doer || 0}
              color="#3B82F6"
              delay={0}
            />
            <KeyValue
              label="Total Supporter"
              value={data.profileDetails.supporter || 0}
              color="#34D399"
              delay={100}
            />
            <KeyValue
              label="Total Controller"
              value={data.profileDetails.controller || 0}
              color="#A78BFA"
              delay={200}
            />
            <KeyValue
              label="Total Talker"
              value={data.profileDetails.talker || 0}
              color="#FBBF24"
              delay={300}
            />
          </div>

          {/* Category Details */}
          <div className="bg-white border-2 border-blue-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
              <h3 className="text-green-600 font-bold text-xl">
                Category Details
              </h3>
            </div>
            <div className="grid grid-cols-2 font-bold text-sm text-gray-600 mb-4 p-3 bg-gray-50 rounded-lg">
              <span>Person</span>
              <span className="text-right">Total</span>
            </div>
            <KeyValue
              label="Total Number of A Person"
              value={data.categoryDetails.aPerson || 0}
              color="#3B82F6"
              delay={0}
            />
            <KeyValue
              label="Total Number of B Person"
              value={data.categoryDetails.bPerson || 0}
              color="#34D399"
              delay={100}
            />
            <KeyValue
              label="Total Number of C Person"
              value={data.categoryDetails.cPerson || 0}
              color="#A78BFA"
              delay={200}
            />
            <KeyValue
              label="Total Number of D Person"
              value={data.categoryDetails.dPerson || 0}
              color="#FBBF24"
              delay={300}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerritorySnapshot;