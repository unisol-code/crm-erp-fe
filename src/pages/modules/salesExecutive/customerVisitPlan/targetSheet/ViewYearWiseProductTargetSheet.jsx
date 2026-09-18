import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TiEye } from "react-icons/ti";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb.jsx";
import { useTheme } from "../../../../../hooks/theme/useTheme.js";
import Button from "../../../../../components/uiComponents/button/Button.jsx";
import useTargetSheet from "../../../../../hooks/salesExecutiveHook/customerVisitPlan/useTaregtSheet.js";
import LoaderSpinner from "../../../../../components/uiComponents/loader/LoaderSpinner.jsx";
import Pagination from "../../../../../components/uiComponents/pagination/Pagination.jsx";

const ViewYearWiseProductTargetSheet = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { id } = useParams();
  const {
    yearWiseProductTargetSheet,
    yearWiseProductTargetLoading,
    fetchYearWiseProductTargetSheet,
    resetYearWiseProductTargetSheet,
    hospitalWiseTargetSheet,
    hospitalWiseTargetLoading,
    fetchHospitalWiseTargetSheet,
    resetHospitalWiseTargetSheet,
  } = useTargetSheet();

  const [productPage, setProductPage] = useState(1);
  const [productLimit, setProductLimit] = useState(10);
  const [hospitalPage, setHospitalPage] = useState(1);
  const [hospitalLimit, setHospitalLimit] = useState(10);
  const [activeTab, setActiveTab] = useState("productWise");

  useEffect(() => {
    if (id) {
      fetchYearWiseProductTargetSheet({ year: id, page: productPage, limit: productLimit });
    }
    return () => {
      resetYearWiseProductTargetSheet();
    };
  }, [id, productPage, productLimit]);

  useEffect(() => {
    if (activeTab === "hospitalWise" && id) {
      fetchHospitalWiseTargetSheet({ year: id, page: hospitalPage, limit: hospitalLimit });
    }
    return () => {
      resetHospitalWiseTargetSheet();
    };
  }, [activeTab, id, hospitalPage, hospitalLimit]);

  const onProductPageChange = (data) => {
    setProductPage(data);
  };

  const onProductItemsPerPageChange = (data) => {
    setProductLimit(data);
  };

  const onHospitalPageChange = (data) => {
    setHospitalPage(data);
  };

  const onHospitalItemsPerPageChange = (data) => {
    setHospitalLimit(data);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "hospitalWise") setHospitalPage(1);
    if (tab === "productWise") setProductPage(1);
  };

  const handleProductViewClick = (productId) => {
    navigate(`/sales-executive/target-sheet/view-product-id-wise/${productId}`);
  };

  const handleHospitalViewClick = (hospitalId) => {
    navigate(`/sales-executive/target-sheet/view-hospital-id-wise/${hospitalId}`);
  };

  const productData = yearWiseProductTargetSheet?.data?.[0]?.products || [];
  const hospitalData = hospitalWiseTargetSheet?.data || [];

  return (
    <div className="w-full min-h-screen pb-10">
      {/* Breadcrumb */}
      <BreadCrumb
        linkText={[
          { text: "Customer Visit Plan" },
          {
            text: "Target Sheet",
            href: "/sales-executive/target-sheet",
          },
          { text: "View Year Wise Product Target Sheet" },
        ]}
      />

      <div className="p-4 bg-white rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-gray-800">
    {activeTab === "productWise"
      ? "Product Wise Target Sheet"
      : activeTab === "hospitalWise"
      ? "Hospital Wise Target Sheet"
      : "Year Wise Target Sheet"}
  </h2>
        {/* Tabs */}
<div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
  <button
    onClick={() => handleTabChange("productWise")}
    className={`px-6 py-2 text-base font-medium rounded-md transition-all ${
      activeTab === "productWise"
        ? "bg-orange-500 text-white shadow-md"
        : "bg-transparent text-gray-600 hover:bg-gray-200"
    }`}
  >
    ProductWise Target Sheet
  </button>
  <button
    onClick={() => handleTabChange("hospitalWise")}
    className={`px-6 py-2 text-base font-medium rounded-md transition-all ${
      activeTab === "hospitalWise"
        ? "bg-orange-500 text-white shadow-md"
        : "bg-transparent text-gray-600 hover:bg-gray-200"
    }`}
  >
    Hospital Wise Target Sheet
  </button>
</div>
        </div>
        <hr
          className="h-1 border-0 mb-6"
          style={{ backgroundColor: theme.secondaryColor }}
        />

        {/* ProductWise Table */}
        {activeTab === "productWise" && (
          <>
            <div className="overflow-x-auto border border-gray-200 shadow rounded-t-2xl">
              <table className="min-w-full text-sm text-left text-gray-700 table-auto">
                <thead
                  className="sticky top-0 z-10 text-xs uppercase bg-gray-100 border-b border-gray-300"
                  style={{ backgroundColor: theme.secondaryColor }}
                >
                  <tr className="transition-all">
                    <th className="p-4 text-base font-semibold text-center">
                      Sr. No.
                    </th>
                    <th className="p-4 text-base font-semibold text-center">
                      Product Type
                    </th>
                    <th className="p-4 text-base font-semibold text-center">
                      Product Name
                    </th>
                    <th className="p-4 text-base font-semibold text-center">
                      Price
                    </th>
                    <th className="p-4 text-base font-semibold text-center">
                      Entered Quantity
                    </th>
                    <th className="p-4 text-base font-semibold text-center">
                      Overall Target Price
                    </th>
                    <th className="p-4 text-base font-semibold text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {yearWiseProductTargetLoading ? (
                    <tr>
                      <td colSpan="7" className="p-8 text-center">
                        <div className="flex justify-center items-center w-full">
                          <LoaderSpinner />
                        </div>
                      </td>
                    </tr>
                  ) : productData.length > 0 ? (
                    productData.map((product, index) => (
                      <tr
                        key={product._id || index}
                        className="hover:bg-gray-50 transition-all"
                      >
                        <td className="p-4 text-center text-[17px] font-normal text-[#252C58]">
                        {(productPage - 1) * productLimit + index + 1}
                        </td>
                        <td className="p-2 text-[17px] font-normal text-center text-[#252C58]">
                          {product.productType || "N/A"}
                        </td>
                        <td className="px-3 py-3 text-[17px] font-normal text-center text-[#252C58]">
                          {product.name || "N/A"}
                        </td>
                        <td className="p-4 text-[17px] font-normal text-center text-[#252C58]">
                          {product.price || "N/A"}
                        </td>
                        <td className="p-4 text-[17px] font-normal text-center text-[#252C58]">
                          {product.enteredQuantity || "N/A"}
                        </td>
                        <td className="p-2 text-center text-[19px] font-normal text-[#252C58] align-middle">
                          {product.overAllTargetPrice || "N/A"}
                        </td>
                        <td className="p-2 text-center text-[19px] font-normal text-[#252C58] align-middle">
                          <div className="flex justify-center">
                            <button
                                onClick={() => handleProductViewClick(product._id)}
                              className="text-black hover:bg-blue-200 rounded-full w-8 h-8 flex items-center justify-center"
                              style={{ color: theme.primaryColor }}
                            >
                              <TiEye size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="p-4 text-center text-gray-500">
                        No product target sheet found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="overflow-hidden bg-white border border-gray-200 shadow-lg rounded-b-2xl">
              <div className="bg-white">
                <Pagination
                  currentPage={yearWiseProductTargetSheet?.pagination?.currentPage}
                  totalItems={yearWiseProductTargetSheet?.pagination?.totalRecords}
                  itemsPerPage={productLimit}
                  totalPages={yearWiseProductTargetSheet?.pagination?.totalPages}
                  onPageChange={onProductPageChange}
                  onItemsPerPageChange={onProductItemsPerPageChange}
                />
              </div>
            </div>
          </>
        )}

        {/* HospitalWise Table */}
        {activeTab === "hospitalWise" && (
          <>
            <div className="overflow-x-auto border border-gray-200 shadow rounded-t-2xl">
              <table className="min-w-full text-sm text-left text-gray-700 table-auto">
                <thead
                  className="sticky top-0 z-10 text-xs uppercase bg-gray-100 border-b border-gray-300"
                  style={{ backgroundColor: theme.secondaryColor }}
                >
                  <tr className="transition-all">
                    <th className="p-4 text-base font-semibold text-center">
                      Sr. No.
                    </th>
                    <th className="p-4 text-base font-semibold text-center">
                      Organization
                    </th>
                    <th className="p-4 text-base font-semibold text-center">
                      City
                    </th>
                    <th className="p-4 text-base font-semibold text-center">
                      Year
                    </th>
                    <th className="p-4 text-base font-semibold text-center">
                      Product Count
                    </th>
                    <th className="p-4 text-base font-semibold text-center">
                      Total Quantity
                    </th>
                    <th className="p-4 text-base font-semibold text-center">
                      Total Amount
                    </th>
                    <th className="p-4 text-base font-semibold text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {hospitalWiseTargetLoading ? (
                    <tr>
                      <td colSpan="8" className="p-8 text-center">
                        <div className="flex justify-center items-center w-full">
                          <LoaderSpinner />
                        </div>
                      </td>
                    </tr>
                  ) : hospitalData.length > 0 ? (
                    hospitalData.map((item, index) => (
                      <tr
                        key={item._id || index}
                        className="hover:bg-gray-50 transition-all"
                      >
                        <td className="p-4 text-center text-[17px] font-normal text-[#252C58]">
                          {(hospitalPage - 1) * hospitalLimit + index + 1}
                        </td>
                        <td className="p-2 text-[17px] font-normal text-center text-[#252C58]">
                          {item.organization || "N/A"}
                        </td>
                        <td className="px-3 py-3 text-[17px] font-normal text-center text-[#252C58]">
                          {item.city || "N/A"}
                        </td>
                        <td className="p-4 text-[17px] font-normal text-center text-[#252C58]">
                          {item.year || "N/A"}
                        </td>
                        <td className="p-4 text-[17px] font-normal text-center text-[#252C58]">
                          {item.productCount || "N/A"}
                        </td>
                        <td className="p-4 text-[17px] font-normal text-center text-[#252C58]">
                          {item.totalQuantity || "N/A"}
                        </td>
                        <td className="p-2 text-center text-[19px] font-normal text-[#252C58] align-middle">
                          {item.totalAmount || "N/A"}
                        </td>
                        <td className="p-2 text-center text-[19px] font-normal text-[#252C58] align-middle">
                          <div className="flex justify-center">
                            <button
                                onClick={() => handleHospitalViewClick(item._id)}
                              className="text-black hover:bg-blue-200 rounded-full w-8 h-8 flex items-center justify-center"
                              style={{ color: theme.primaryColor }}
                            >
                              <TiEye size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="p-4 text-center text-gray-500">
                        No hospital target sheet found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="overflow-hidden bg-white border border-gray-200 shadow-lg rounded-b-2xl">
              <div className="bg-white">
                <Pagination
                  currentPage={hospitalWiseTargetSheet?.pagination?.currentPage}
                  totalItems={hospitalWiseTargetSheet?.pagination?.totalRecords}
                  itemsPerPage={hospitalLimit}
                  totalPages={hospitalWiseTargetSheet?.pagination?.totalPages}
                  onPageChange={onHospitalPageChange}
                  onItemsPerPageChange={onHospitalItemsPerPageChange}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewYearWiseProductTargetSheet;
