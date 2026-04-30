// import React, { useState, useEffect } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Box,
//   LinearProgress,
//   CircularProgress,
// } from "@mui/material";
// import useDashboard from "../../../../../hooks/dashboard/useDashboard";
// import { useTheme } from "../../../../../hooks/theme/useTheme";
// import { useNavigate } from "react-router-dom";
// import { useSignIn } from "../../../../../hooks/auth/useSignIn";
// import useHomeDashboard from "../../../../../hooks/dashboard/useHomeDashboard";

// const HomeDashboard = () => {
//   const navigate = useNavigate();
//     const [selectedCompanyId, setSelectedCompanyId] = useState("");
//     const [selectedCompany, setSelectedCompany] = useState("");
//   const { switchTheme, theme } = useTheme();
//   const { sAdminResponse } = useSignIn();
//   const { fetchAllCompany, loading, allCompany } = useDashboard();
//   const {
//     fetchHomeFinancialYear,
//     fetchHomeCalendarYear,
//     fetchHomeTopProducts,
//     fetchHomeTopCustomer,
//     fetchHomeEarningByCompany,
//     homeFinancialYear,
//     homeCalendarYear,
//     homeTopProducts,
//     homeTopCustomer,
//     homeEarningByCompany,
//     homeTotalSale,
//     fetchHomeTotalSale,
//   } = useHomeDashboard();

//   useEffect(() => {
//     fetchAllCompany();
//     fetchHomeFinancialYear();
//     fetchHomeCalendarYear();
//     fetchHomeTopProducts();
//     fetchHomeTopCustomer();
//     fetchHomeEarningByCompany();
//     fetchHomeTotalSale();
//   }, []);

// <<<<<<< HEAD
//   useEffect(() => {
//     if (Array.isArray(allCompany) && allCompany.length > 0) {
//       const homeCompany = allCompany.find((company) => company.name === "Home");
//       if (homeCompany) {
//         sessionStorage.setItem("theme", "Home");
//         switchTheme("Home");
//         setSelectedCompany(homeCompany);
//       }
//     }
//   }, [allCompany, switchTheme]);

//   const handleCompanySelect = (e) => {
//     const selectedOption = e.target.options[e.target.selectedIndex];
//     const newCompanyId = selectedOption.id;
//     const companyName = e.target.value;

//     const selectedCompanyData = allCompany.find(
//       (company) => company._id === newCompanyId
//     );

//     sessionStorage.setItem("selectedCompany", JSON.stringify(selectedCompanyData));
//     sessionStorage.setItem("theme", companyName);
//     sessionStorage.setItem("newCompanyId", newCompanyId);

//     setSelectedCompany(selectedCompanyData);
//     switchTheme(companyName);

//     navigate(companyName === "Home" ? "/crm-home-dashboard" : "/crm-dashboard");
//   };
// =======
//   console.log("Total Sale", homeTotalSale);

// useEffect(() => {
//   const companyIdFromStorage = sessionStorage.getItem("companyId");
//   if (Array.isArray(allCompany) && allCompany.length > 0) {
//     let companyToSelect = null;

//     if (companyIdFromStorage) {
//       companyToSelect = allCompany.find(
//         (company) => company._id === companyIdFromStorage
//       );
//     }
//     if (!companyToSelect) {
//       companyToSelect = allCompany.find((company) => company.name === "Home");
//       switchTheme("Home")
//       navigate('/crm-home-dashboard')
//     }
//     if (companyToSelect) {
//       setSelectedCompanyId(companyToSelect._id);
//       sessionStorage.setItem("companyName", companyToSelect.name);
//       sessionStorage.setItem("companyId", companyToSelect._id);
//       switchTheme(companyToSelect.name);
//       if(companyToSelect.name!=='Home'){
//         navigate('/crm-dashboard')
//       }
//     }
//   }
// }, [allCompany, switchTheme, selectedCompany, selectedCompanyId]);

// const handleCompanySelect = (e) => {
//   const selectedId = e.target.value;
//   const company = allCompany.find(c => c._id === selectedId);
//   if (!company) return;
//   setSelectedCompany(company.name);
//   switchTheme(company.name);
//   sessionStorage.setItem("companyName", company.name);
//   sessionStorage.setItem("companyId", company._id);
// };

// >>>>>>> 1ebc1f28229009fc211b9494f51c90aff63109c2

//   const COLORS = ["#C8A1E0", "#62B2FD", "#9BDFC4", "#FFC09B"];

//   const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
//   const calenderMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

//   const chartData = months.map((month) => {
//     const monthData = { month };
//     homeFinancialYear?.forEach((company) => {
//       const monthlyData = company.monthlyData.find((item) => item.month === month);
//       monthData[company.companyName] = monthlyData ? monthlyData.totalBillAmount : 0;
//     });
//     return monthData;
//   });

//   const calenderChartData = calenderMonths.map((month) => {
//     const monthData = { month };
//     homeFinancialYear?.forEach((company) => {
//       const monthlyData = company.monthlyData.find((item) => item.month === month);
//       monthData[company.companyName] = monthlyData ? monthlyData.totalBillAmount : 0;
//     });
//     return monthData;
//   });

//   const earningsData = Array.isArray(homeEarningByCompany)
//     ? homeEarningByCompany.map((item) => ({
//         name: `${item.earning} - ${item.companyName}`,
//         value: item.earning,
//         productName: item.productName,
//       }))
//     : [];

//   const topCustomers = Array.isArray(homeTopCustomer) ? homeTopCustomer : [];

//   return (
//     <div className="p-2 pl-0">
//       <h1 className="text-2xl font-bold mb-4">Customer Data</h1>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//         <div>
//           <p className="font-bold">Dashboard</p>
//           <p>Hi, {sAdminResponse?.user?.name}, Welcome to Home</p>
//         </div>
//         <div className="text-end">
//           <label htmlFor="companyList" className="block text-sm font-medium text-gray-700 mb-1 mr-6">
//             Company
//           </label>
//           <select
//             id="companyList"
//             name="companyList"
//             className="py-2 px-4 rounded-xl w-[200px] h-[45px]"
//             onChange={handleCompanySelect}
//             value={selectedCompany?.name || "Home"}
//           >
//             {Array.isArray(allCompany) &&
//               allCompany.map((company) => (
//                 <option key={company._id} id={company._id} value={company.name}>
//                   {company.name}
//                 </option>
//               ))}
//           </select>
//         </div>
//       </div>

//       <div className="flex gap-4">
//         {/* Left Column */}
//         <div className="w-[63%] space-y-4">
//           {/* Financial Year */}
//           <div className="bg-white rounded-lg shadow-md p-4 h-[260px] flex flex-col">
//             <div className="flex justify-between">
//               <h2 className="text-xl font-bold">Customer Data</h2>
//               <select className="border p-2 rounded w-30">
//                 <option>Monthly</option>
//                 <option>Quarterly</option>
//                 <option>Yearly</option>
//               </select>
//             </div>
//             <h3 className="text-lg font-semibold mb-1">Financial Year</h3>
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={chartData} margin={{ top: 8, right: 15, left: 0, bottom: 8 }}>
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 {homeFinancialYear?.map((company, index) => (
//                   <Bar key={company.companyName} dataKey={company.companyName} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Calendar Year */}
//           <div className="bg-white rounded-lg shadow-md p-4 h-[260px]">
//             <h3 className="text-lg font-semibold mb-2">Calendar Year</h3>
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={calenderChartData} margin={{ top: 8, right: 15, left: 0, bottom: 8 }}>
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 {homeFinancialYear?.map((company, index) => (
//                   <Bar key={company.companyName} dataKey={company.companyName} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Top Products */}
//           <div className="bg-white rounded-lg shadow-md p-4 h-[380px]">
//             <h3 className="text-lg font-semibold mb-4">Top Products</h3>
//             {Array.isArray(homeTopProducts) && homeTopProducts.length > 0 ? (
//               <TableContainer>
//                 <Table>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Company</TableCell>
//                       <TableCell>Name</TableCell>
//                       <TableCell>Popularity</TableCell>
//                       <TableCell>Sales</TableCell>
//                       <TableCell>Order Received</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {homeTopProducts.map((product, index) => (
//                       <TableRow key={index}>
//                         <TableCell>{product.companyName}</TableCell>
//                         <TableCell>{product.productName}</TableCell>
//                         <TableCell>
//                           <LinearProgress
//                             variant="determinate"
//                             value={(product.popularity / 500) * 100}
//                             sx={{ height: 8, borderRadius: 5 }}
//                           />
//                         </TableCell>
//                         <TableCell>
//                           <span className="bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-full">
//                             {product.salesPercentage}%
//                           </span>
//                         </TableCell>
//                         <TableCell>{product.noOfProductsSold}+</TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             ) : (
//               <Box className="flex justify-center items-center flex-grow">
//                 <CircularProgress />
//               </Box>
//             )}
//           </div>
//         </div>

//         {/* Right Column */}
//         <div className="w-[37%] space-y-4">
//           {/* Pie Chart */}
//           <div className="bg-white rounded-lg shadow-md p-4 h-[450px]">
//             <div className="flex items-center justify-between">
//               <h3 className="text-lg font-semibold">Customer by Region</h3>
//               <select className="border p-2 rounded w-25">
//                 <option>North</option>
//                 <option>South</option>
//                 <option>East</option>
//                 <option>West</option>
//               </select>
//             </div>

//             <div className="w-full h-[300px] flex justify-center">
//               <PieChart width={420} height={300}>
//                 <Pie
//                   data={earningsData}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={60}
//                   outerRadius={100}
//                   fill="#8884d8"
//                   dataKey="value"
//                   label={({ name }) => name}
//                 >
//                   {earningsData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </div>
//           </div>

//           {/* Top Customers */}
//           <div className="bg-white rounded-lg shadow-md p-4 h-[464px]">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold">Top Customer</h3>
//               <button className="bg-purple-100 text-purple-600 text-sm font-semibold px-4 py-2 rounded-full">
//                 All Time
//               </button>
//             </div>
//             <div className="flex-grow overflow-y-auto">
//               {topCustomers.length > 0 ? (
//                 <TableContainer>
//                   <Table>
//                     <TableHead>
//                       <TableRow>
//                         <TableCell> </TableCell>
//                         <TableCell>Name</TableCell>
//                         <TableCell>Customer Since</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {topCustomers.map((customer, index) => (
//                         <TableRow key={index}>
//                           <TableCell>
//                             <img
//                               src={customer.image}
//                               alt="Customer"
//                               className="w-8 h-8 rounded-full object-contain"
//                             />
//                           </TableCell>
//                           <TableCell>{customer.workplaceName}</TableCell>
//                           <TableCell>
//                             <span className="bg-green-100 text-green-600 text-sm px-3 py-1 rounded-full text-center">
//                               {customer.duration}
//                             </span>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               ) : (
//                 <Box className="flex justify-center items-center h-32">
//                   <CircularProgress />
//                 </Box>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomeDashboard;

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";
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
} from "@mui/material";
import useDashboard from "../../../../../hooks/dashboard/useDashboard";
import { useTheme } from "../../../../../hooks/theme/useTheme";
import { useNavigate } from "react-router-dom";
import { useSignIn } from "../../../../../hooks/auth/useSignIn";
import useHomeDashboard from "../../../../../hooks/dashboard/useHomeDashboard";
import { size } from "lodash";

const HomeDashboard = () => {
  const navigate = useNavigate();
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const { switchTheme, theme } = useTheme();
  const { sAdminResponse } = useSignIn();
  const { fetchAllCompany, loading, allCompany } = useDashboard();
  const {
    fetchHomeFinancialYear,
    fetchHomeCalendarYear,
    fetchHomeTopProducts,
    fetchHomeTopCustomer,
    fetchHomeEarningByCompany,
    homeFinancialYear,
    homeCalendarYear,
    homeTopProducts,
    homeTopCustomer,
    homeEarningByCompany,
    homeTotalSale,
    fetchHomeTotalSale,
  } = useHomeDashboard();

  console.log("homeTopCustomer", homeTopCustomer);

  useEffect(() => {
    fetchAllCompany();
    fetchHomeFinancialYear();
    fetchHomeCalendarYear();
    fetchHomeTopProducts();
    fetchHomeTopCustomer();
    fetchHomeEarningByCompany();
    fetchHomeTotalSale();
  }, []);

  console.log("Total Sale", homeTotalSale);

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
        if (companyToSelect.name !== "Home") {
          navigate("/crm-dashboard");
        }
      }
    }
  }, [allCompany, switchTheme, selectedCompany, selectedCompanyId]);

  const handleCompanySelect = (e) => {
    const selectedId = e.target.value;
    const company = allCompany.find((c) => c._id === selectedId);
    if (!company) return;
    setSelectedCompany(company.name);
    switchTheme(company.name);
    sessionStorage.setItem("companyName", company.name);
    sessionStorage.setItem("companyId", company._id);
  };

  // const earningsData = homeEarningByCompany?.map((item) => ({
  //   name: `${item.earning} - ${item.companyName}`,
  //   value: item.earning,
  //   productName: item.productName,
  // }));
  const earningsData = homeEarningByCompany?.map((item) => ({
    name: item.companyName,
    value: item.earning,
    productName: item.productName,
  }));

  const COLORS = ["#C8A1E0", "#62B2FD", "#9BDFC4", "#FFC09B"];
  const COMPANY_COLORS = {
    Unisol: "#4FA8E5",
    IgniteSphere: "#9683EC",
    Surgisol: "#C6693C",
    Envirosol: "#4A7E4C",
  };

  const months = [
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
  ];

  const calenderMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const chartData = months.map((month) => {
    const monthData = { month };
    homeFinancialYear?.forEach((company) => {
      const monthlyData = company.monthlyData.find(
        (item) => item.month === month
      );
      monthData[company.companyName] = monthlyData
        ? monthlyData.totalBillAmount
        : 0;
    });
    return monthData;
  });

  const calenderChartData = calenderMonths.map((month) => {
    const monthData = { month };
    homeFinancialYear?.forEach((company) => {
      const monthlyData = company.monthlyData.find(
        (item) => item.month === month
      );
      monthData[company.companyName] = monthlyData
        ? monthlyData.totalBillAmount
        : 0;
    });
    return monthData;
  });

  return (
    <div className="p-2 pl-0">
      <b>
        <h1 className="text-2xl">Customer Data</h1>
      </b>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <p className="font-bold">Dashboard</p>
          <p>Hii, {sAdminResponse?.user?.name} Welcome to Home</p>
        </div>
        <div>
          <div className="text-end mb-2">
            <label
              htmlFor="dropdownButton"
              className="block text-md font-medium text-gray-700"
              style={{ marginRight: "148px", marginBottom: "5px" }}
            >
              Company
            </label>

            <div className="relative inline-block text-right border border-gray-500 rounded-lg px-2 py-0 box-border bg-white">
              <select
                name="companyList"
                id="companyList"
                className="py-2 px-4 rounded-xl w-[200px] h-[45px] outline-none border-none"
                onChange={handleCompanySelect}
                value={selectedCompanyId || ""}
              >
                {allCompany?.map((company) => (
                  <option
                    key={company?._id}
                    id={company?._id}
                    value={company?._id}
                    className="border-none"
                  >
                    {company?.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="flex gap-4 pb-4"> */}
      <div className="flex flex-col lg:flex-row gap-4 pb-4">
        {/* Left Column - 63% */}
        
        <div className="w-full lg:w-[63%] space-y-6">
          {/* Financial Year Chart */}
          <div className="bg-white rounded-lg shadow-md p-4 h-[330px] flex flex-col justify-end">
            {/* Dropdown*/}
            <div className="flex items-center justify-between">
              <b className="text-2xl font-semibold mb-1">Customer Data</b>
              <div>
                <select className="border p-2 rounded-lg w-30">
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>Yearly</option>
                </select>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-1 ">Financial Year</h3>
            <div className="flex-grow min-h-0 overflow-x-auto">
              <div className="min-w-[600px]">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 8, right: 15, left: 0, bottom: 8 }}
                  >
                    {/* <CartesianGrid strokeDasharray="3 3" /> */}
                    <XAxis
                      dataKey="month"
                      label={{
                        value: "Dynamic",
                        position: "insideBottom",
                        offset: -15,
                      }}
                    />
                    <YAxis
                      label={{
                        value: "No of Customer",
                        angle: -90,
                        position: "outsideLeft",
                        dx: -25,
                        dy: 45,
                      }}
                    />
                    <Tooltip />

                    <Legend
                      wrapperStyle={{
                        paddingTop: "25px",
                        marginTop: "10px",
                      }}
                    />

                    {homeFinancialYear?.map((company, index) => (
                      <Bar
                        key={company.companyName}
                        dataKey={company.companyName}
                        // fill={COLORS[index % COLORS.length]}
                        fill={COMPANY_COLORS[company.companyName] || "#ccc"}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          {/* Calendar Year Chart */}
          <div className="bg-white rounded-lg shadow-md p-4 h-[300px] flex flex-col">
            <h3 className="text-lg font-semibold mb-2">Calendar Year</h3>
            <div className="flex-grow min-h-0 overflow-x-auto ">
              <div className="min-w-[600px] ">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={calenderChartData}
                    margin={{ top: 8, right: 15, left: 0, bottom: 8 }}
                  >

                    <XAxis
                      dataKey="month"
                      label={{
                        value: "Dynamic",
                        position: "insideBottom",
                        offset: -15,
                      }}
                    />
                    <YAxis
                      label={{
                        value: "No of Customer",
                        angle: -90,
                        position: "outsideLeft",
                        dx: -25,
                        dy: 25,
                      }}
                    />
                    <Tooltip />
                    <Legend
                      wrapperStyle={{
                        paddingTop: "25px",
                        marginTop: "10px",
                      }}
                    />
                    {homeFinancialYear?.map((company, index) => (
                      <Bar
                        key={company.companyName}
                        dataKey={company.companyName}
                        fill={COMPANY_COLORS[company.companyName] || "#ccc"}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          

          {/* Top Products */}
          <div className="bg-white rounded-lg shadow-md p-4 h-[372px] flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Top Products</h3>
            {homeTopProducts?.length > 0 ? (
              <div className="flex-grow overflow-auto">
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Company</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Popularity</TableCell>
                        <TableCell
                          style={{ textAlign:"center" }}
                        >
                          Sales
                        </TableCell>
                        <TableCell>Order Received</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {homeTopProducts?.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell>{product.companyName}</TableCell>
                          <TableCell>{product.productName}</TableCell>
                          <TableCell>
                            <LinearProgress
                              variant="determinate"
                              value={(product.popularity / 500) * 100}
                              sx={{ height: 8, borderRadius: 5 }}
                            />
                          </TableCell>
                          <TableCell style={{ textAlign:"center" }}>
                            <span className="bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-full">
                              {product.salesPercentage}%
                            </span>
                          </TableCell>
                          <TableCell>{product.noOfProductsSold}+</TableCell>
                        </TableRow>
                      ))}
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
       
        <div className="w-full lg:w-[37%] space-y-6">
          {/* Earnings By Item */}
          <div className="bg-white rounded-lg shadow-md p-4 h-[450px]">
            {/* Dropdown*/}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold mb-2">Earning By Company</h3>
              <select className="border p-2 rounded w-25">
                <option>North</option>
                <option>South</option>
                <option>East</option>
                <option>West</option>
              </select>
            </div>

            <div className="w-full h-[300px] flex justify-center">
              {/* <PieChart width={420} height={300}>
                <Pie
                  data={earningsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name }) => name}
                >
                  {earningsData?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart> */}
              <PieChart width={420} height={300}>
                <Pie
                  data={earningsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name }) => name}
                >
                  {earningsData?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COMPANY_COLORS[entry.name] || "#ccc"}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
            <div className="text-center">
              {earningsData?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-start space-x-2 pl-6 text-sm"
                >
                  {/* <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  /> */}
                  {/* <span>{item.productName}</span> */}
                </div>
              ))}
            </div>
          </div>

          {/* Top Customer */}
          <div className="bg-white rounded-lg shadow-md p-4 h-[464px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Top Customer</h3>
              <button
                className="text-white text-sm font-semibold px-4 py-2 rounded-full"
                style={{ backgroundColor: theme.secondaryColor }}
              >
                All Time
              </button>
            </div>
            <div className="flex-grow overflow-y-auto">
              {homeTopCustomer?.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell> </TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Customer Since</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {homeTopCustomer?.map((customer, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <span className="bg-green-100 text-green-600 text-sm px-3 py-1 rounded-full flex items-center justify-center">
                              <img
                                src={customer.image ? customer.image : customer.companyName}
                                alt="Customer"
                                className="w-12 h-8 rounded-full object-contain "
                              />
                            </span>
                          </TableCell>
                          <TableCell>{customer.workplaceName}</TableCell>
                          <TableCell>
                            <span className="bg-green-100 text-green-600 text-sm px-3 py-1 rounded-full text-center">
                              {customer.duration}
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
      </div>
    </div>
  );
};

export default HomeDashboard;
