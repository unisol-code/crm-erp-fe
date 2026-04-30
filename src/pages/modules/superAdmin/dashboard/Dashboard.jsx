import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import useDashboard from "../../../../hooks/dashboard/useDashboard";
import { useTheme } from "../../../../hooks/theme/useTheme";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  LinearProgress,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { useSignIn } from "../../../../hooks/auth/useSignIn";
import BusinessSnapshot from "./BusinessSnapshot";

const Dashboard = () => {
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const { sAdminResponse } = useSignIn();
  const navigate = useNavigate();

  const {
    fetchAllCompany,
    fetchTopProducts,
    topProducts,
    fetchTopCustomer,
    topCustomer,
    loading,
    fetchEarningByItem,
    earningByItem,
    allCompany,
    financialYear,
    fetchFinancialYear,
    fetchCalendarYear,
    calendarYear,
  } = useDashboard();

  const { switchTheme, theme } = useTheme();

  const defaultChartOptions = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: [],
    },
    noData: {
      text: "Loading...",
      align: "center",
      verticalAlign: "middle",
      style: {
        fontSize: "14px",
      },
    },
  };

  const [financialYearData, setFinancialYearData] = useState({
    options: {
      chart: {
        id: "financial-chart",
        type: "bar",
        toolbar: {
          show: false,
        },
        height: "100%",
      },
      xaxis: {
        categories: [],
        labels: {
          show: true,
          rotate: -45,
          rotateAlways: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "₹ " + val;
          },
        },
      },
    },
    series: [
      {
        name: "Total Bill Amount",
        data: [],
      },
    ],
  });

  const [calendarYearData, setCalendarYearData] = useState({
    options: {
      chart: {
        id: "calendar-chart",
        type: "bar",
        toolbar: {
          show: false,
        },
        height: "100%",
      },
      xaxis: {
        categories: [],
        labels: {
          show: true,
          rotate: -45,
          rotateAlways: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "₹ " + val;
          },
        },
      },
    },
    series: [
      {
        name: "Total Bill Amount",
        data: [],
      },
    ],
  });

  const [earningsData, setEarningsData] = useState({
    options: {
      ...defaultChartOptions,
      labels: [],
      colors: [
        "#FF5733",
        "#33FF57",
        "#3357FF",
        "#FF33A8",
        "#F3FF33",
        "#FF8C00",
        // "#8A2BE2",
        "#b265f7",
        "#00CED1",
      ],
      legend: {
        position: "bottom",
        horizontalAlign: "center",
        floating: false,
        fontSize: "14px",
        offsetY: 7,
      },
      tooltip: {
        theme: "light", // or "dark"
        style: {
          fontSize: "14px",
          color: "#000000", // text color
        },
        marker: {
          show: true,
        },
        y: {
          formatter: (val) => val, // optional formatting
          title: {
            formatter: (seriesName) => seriesName,
          },
        },
      },
    },
    series: [],
  });
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchAllCompany(),
        fetchFinancialYear(),
        fetchCalendarYear(),
        fetchTopProducts(),
        fetchEarningByItem(),
        fetchTopCustomer(),
      ]);
    };

    fetchData();
  }, [selectedCompany]);

  useEffect(() => {
    const companyIdFromStorage = sessionStorage.getItem("companyId");
    if (Array.isArray(allCompany) && allCompany.length > 0) {
      let companyToSelect = null;

      if (companyIdFromStorage) {
        companyToSelect = allCompany.find(
          (company) => company._id === companyIdFromStorage
        );
      }
      if (!companyToSelect) {
        companyToSelect = allCompany.find((company) => company.name === "Home");
        switchTheme("Home");
        navigate("/crm-home-dashboard");
      }
      if (companyToSelect) {
        setSelectedCompanyId(companyToSelect._id);
        sessionStorage.setItem("companyName", companyToSelect.name);
        sessionStorage.setItem("companyId", companyToSelect._id);
        switchTheme(companyToSelect.name);
        if (companyToSelect.name === "Home") {
          navigate("/crm-home-dashboard");
        }
      }
    }
  }, [allCompany, switchTheme, selectedCompany]);

  useEffect(() => {
    if (Array.isArray(financialYear) && financialYear.length > 0) {
      const categories = financialYear.map((entry) => entry.month || "");
      const data = financialYear.map((entry) => Number(entry.value) || 0);

      setFinancialYearData((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories,
          },
        },
        series: [
          {
            name: "Total Bill Amount",
            data,
          },
        ],
      }));
    }
  }, [financialYear]);

  useEffect(() => {
    if (Array.isArray(calendarYear) && calendarYear.length > 0) {
      const categories = calendarYear.map((entry) => entry.month || "");
      const data = calendarYear.map((entry) => Number(entry.value) || 0);

      setCalendarYearData((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories,
          },
        },
        series: [
          {
            name: "Total Bill Amount",
            data,
          },
        ],
      }));
    }
  }, [calendarYear]);

  useEffect(() => {
    if (earningByItem?.length > 0) {
      const labels = earningByItem.map((item) => item.item || "");
      const series = earningByItem.map((item) => item.earnings || 0);
      setEarningsData((prev) => ({
        options: {
          ...prev.options,
          labels,
        },
        series,
      }));
    }
  }, [earningByItem]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!Array.isArray(allCompany) || allCompany.length === 0) {
    return <div>No companies available</div>;
  }

  const handleCompanySelect = (e) => {
    const selectedId = e.target.value;
    const company = allCompany.find((c) => c._id === selectedId);
    if (!company) return;
    setSelectedCompany(company.name);
    switchTheme(company.name);
    sessionStorage.setItem("companyName", company.name);
    sessionStorage.setItem("companyId", company._id);
  };
  // year,month,day
  //   const formatDuration = (durationString) => {
  //   const [yearsStr, monthsStr, daysStr] = durationString.split(',');

  //   const years = parseInt(yearsStr.trim().split(' ')[0], 10);
  //   const months = parseInt(monthsStr.trim().split(' ')[0], 10);
  //   const days = parseInt(daysStr.trim().split(' ')[0], 10);

  //   if (years > 0) return `${years} year${years > 1 ? 's' : ''}`;
  //   if (months > 0) return `${months} month${months > 1 ? 's' : ''}`;
  //   return `${days} day${days > 1 ? 's' : ''}`;
  // };

  // year only
  const formatDuration = (durationString) => {
    const [yearsStr] = durationString.split(",");
    const years = parseInt(yearsStr.trim().split(" ")[0], 10);
    return `${years} year${years !== 1 ? "s" : ""}`;
  };
  return (
    <div className="p-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <p className="font-bold">Dashboard</p>
          <p>Hii Welcome, {sAdminResponse?.user?.name}</p>
        </div>
        <div>
          <div className="text-end mb-2">
            {/* Label - Upar */}
            <label
              htmlFor="dropdownButton"
              className="block text-md font-medium text-gray-700"
              style={{ marginRight: "148px", marginBottom: "5px" }}
            >
              Company
            </label>

            <div className="relative inline-block text-right border border-gray-500 rounded-lg px-2 py-0 box-border bg-white">
              {/* Dropdown Button */}
              <select
                name="companyList"
                id="companyList"
                className="py-2 px-4 rounded-lg w-[200px] h-[45px] outline-none"
                onChange={handleCompanySelect}
                value={selectedCompanyId || ""}
              >
                {allCompany?.map((company) => (
                  <option key={company?._id} value={company?._id}>
                    {company?.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Label - End */}
          </div>
        </div>
      </div>

      <div className="flex gap-4 pb-4">
        {/* Left Column - 63% */}
        <div className="w-[63%] space-y-4">
          {/* Financial Year Chart */}
          <div className="bg-white rounded-lg shadow-md p-4 h-[260px] flex flex-col">
            <h3 className="text-lg font-semibold mb-2">Financial Year</h3>
            {Array.isArray(financialYear) && financialYear.length > 0 ? (
              <div style={{ flexGrow: 1, minHeight: 0 }}>
                <Chart
                  options={{
                    ...financialYearData.options,
                    colors: [theme.primaryColor],
                  }}
                  series={financialYearData.series}
                  type="bar"
                  height="100%"
                />
              </div>
            ) : (
              <Box className="flex justify-center items-center flex-grow">
                <CircularProgress />
              </Box>
            )}
          </div>

          {/* Calendar Year Chart */}
          <div className="bg-white rounded-lg shadow-md p-4 h-[260px] flex flex-col">
            <h3 className="text-lg font-semibold mb-2">Calendar Year</h3>
            {Array.isArray(calendarYear) && calendarYear.length > 0 ? (
              <div style={{ flexGrow: 1, minHeight: 0 }}>
                <Chart
                  options={{
                    ...calendarYearData.options,
                    colors: [theme.primaryColor],
                  }}
                  series={calendarYearData.series}
                  type="bar"
                  height="100%"
                />
              </div>
            ) : (
              <Box className="flex justify-center items-center flex-grow">
                <CircularProgress />
              </Box>
            )}
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg shadow-md p-4 h-[380px] flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Top Products</h3>
            {topProducts?.length > 0 ? (
              <div className="flex-grow">
                {/* <TableContainer>
                  <Table> */}
                <TableContainer
                  sx={{
                    maxHeight: 300,
                    overflowY: "auto",
                    overflowX: "auto",
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": { display: "none" },
                  }}
                >
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow
                        sx={{
                          position: "sticky",
                          top: 0,
                          zIndex: 10,
                          backgroundColor: "#fff",
                        }}
                      >
                        <TableCell align="left">#</TableCell>
                        <TableCell align="left">Name</TableCell>
                        <TableCell align="left">Popularity</TableCell>
                        <TableCell align="center">Sales</TableCell>
                        <TableCell align="left">Project</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topProducts?.map((product, index) => {
                        const normalizedPopularityRounded = Math.floor(
                          product.normalizedPopularity
                        );
                        const salesPercentage = parseFloat(
                          product.salesPercentage
                        ).toFixed(2);

                        return (
                          <TableRow key={index}>
                            <TableCell align="left">{index + 1}</TableCell>
                            <TableCell align="left">{product.name}</TableCell>
                            {/* <TableCell align="left">
                              <Box sx={{ width: "100%" }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={product.popularity}
                                  sx={{
                                    height: 8,
                                    borderRadius: 5,
                                    backgroundColor: theme.secondaryColor,
                                    [`& .MuiLinearProgress-bar`]: {
                                      backgroundColor: theme.primaryColor,
                                    },
                                  }}
                                />
                              </Box>
                            </TableCell> */}
                            <TableCell align="left">
                              <Tooltip
                                title={`${product.popularity}%`}
                                arrow
                                disableInteractive
                                PopperProps={{
                                  disablePortal: true,
                                  modifiers: [
                                    {
                                      name: "preventOverflow",
                                      options: {
                                        boundary: "clippingParents",
                                      },
                                    },
                                  ],
                                  sx: { zIndex: 2 },
                                }}
                              >
                                <Box sx={{ width: "100%" }}>
                                  <LinearProgress
                                    variant="determinate"
                                    value={product.popularity}
                                    sx={{
                                      height: 8,
                                      borderRadius: 5,
                                      backgroundColor: theme.secondaryColor,
                                      [`& .MuiLinearProgress-bar`]: {
                                        backgroundColor: theme.primaryColor,
                                      },
                                    }}
                                  />
                                </Box>
                              </Tooltip>
                            </TableCell>
                            <TableCell align="center">
                              <span
                                className="text-sm px-1 py-1 rounded-full"
                                style={{
                                  backgroundColor: theme.secondaryColor,
                                  color: theme.primaryColor,
                                }}
                              >
                                {/* {salesPercentage}% */}
                                {product.sales}
                              </span>
                            </TableCell>
                            <TableCell align="left">
                              <span>{product.project}</span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            ) : (
              <Box className="flex justify-center items-center flex-grow">
                <CircularProgress />
              </Box>
            )}
          </div>
        </div>

        {/* Right Column - 37% */}
        <div className="w-[37%] space-y-4">
          {/* Earnings By Item */}
          <div className="bg-white rounded-lg shadow-md p-4 h-[535px]">
            <h3 className="text-lg font-semibold mb-12">Earning By Company</h3>

            {earningsData.series.length > 0 ? (
              <Chart
                options={earningsData.options}
                series={earningsData.series}
                type="donut"
                height={350}
              />
            ) : (
              <Box className="flex justify-center items-center h-64">
                <CircularProgress />
              </Box>
            )}
          </div>

          {/* Top Customer */}
          <div className="bg-white rounded-lg shadow-md p-4 h-[381px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Top Customer</h3>
              <button
                className=" text-white text-sm font-semibold px-4 py-2 rounded-full"
                style={{ backgroundColor: theme.primaryColor }}
              >
                All Time
              </button>
            </div>
            <div className="flex-grow overflow-y-auto">
              {topCustomer?.length > 0 ? (
                <TableContainer
                  sx={{
                    maxHeight: 300,
                    overflowY: "auto",
                    overflowX: "auto",
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": { display: "none" },
                  }}
                >
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Customer Since</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody sx={{}}>
                      {topCustomer.map((customer, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <span className="bg-green-100 text-green-600 text-sm px-3 py-1 rounded-full">
                              {index + 1}
                            </span>
                          </TableCell>
                          <TableCell>{customer.name}</TableCell>
                          <TableCell>
                            <span className="bg-green-100 text-green-600 text-sm px-3 py-1 rounded-full">
                              {formatDuration(customer.duration)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box className="flex justify-center items-center h-32">
                  <CircularProgress />
                </Box>
              )}
            </div>
          </div>
        </div>
        {/* business snapshot */}
      </div>
      <div>
        <BusinessSnapshot />
      </div>
    </div>
  );
};

export default Dashboard;
