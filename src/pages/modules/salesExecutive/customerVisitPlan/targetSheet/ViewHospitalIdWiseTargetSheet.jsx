import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb.jsx";
import { useTheme } from "../../../../../hooks/theme/useTheme.js";
import useTargetSheet from "../../../../../hooks/salesExecutiveHook/customerVisitPlan/useTaregtSheet.js";
import LoaderSpinner from "../../../../../components/uiComponents/loader/LoaderSpinner.jsx";

const QUARTERS = ["Quarter1", "Quarter2", "Quarter3", "Quarter4"];

const ViewHospitalIdWiseTargetSheet = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const {
    hospitalIdWiseTargetSheet,
    hospitalIdWiseTargetLoading,
    fetchHospitalIdWiseTargetSheet,
    resetHospitalIdWiseTargetSheet,
  } = useTargetSheet();

  useEffect(() => {
    if (id) {
      fetchHospitalIdWiseTargetSheet({ id });
    }
    return () => {
      resetHospitalIdWiseTargetSheet();
    };
  }, [id]);

  const data = hospitalIdWiseTargetSheet?.data;
  const products = data?.products || [];

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
           { text: "View Year Wise Target Sheet" , href: `/sales-executive/target-sheet/view-year-wise-product/${data?.year}` },
          { text: "View Hospital Wise Target Sheet" },
        ]}
      />

      <div className="p-4 bg-white rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-gray-800">
            Hospital Wise Target Sheet Detail
          </h2>
        </div>
        <hr
          className="h-1 border-0 mb-6"
          style={{ backgroundColor: theme.secondaryColor }}
        />

        {/* Loading */}
        {hospitalIdWiseTargetLoading ? (
          <div className="flex justify-center items-center py-12">
            <LoaderSpinner />
          </div>
        ) : !data ? (
          <p className="text-center text-gray-500 py-8">
            No hospital target sheet data found.
          </p>
        ) : (
          <>
            {/* Hospital Info */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 border border-gray-200 rounded-xl bg-gray-200">
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Organization
                </span>
                <p className="text-lg font-semibold text-[#252C58]">
                  {data.organization || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">City</span>
                <p className="text-lg font-semibold text-[#252C58]">
                  {data.city || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Year</span>
                <p className="text-lg font-semibold text-[#252C58]">
                  {data.year || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Created At
                </span>
               <p className="text-lg font-semibold text-[#252C58]">
  {data.createdAt
    ? new Date(data.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "N/A"}
</p>
              </div>
            </div>

            {/* Products Section */}
            {products.map((product, index) => {
              const achievement = product.achievement || {};

              return (
                <div
                  key={product._id || index}
                  className="mb-8 border border-gray-200 rounded-xl overflow-hidden"
                >
 
                  {/* Product Details Table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left text-gray-700 table-auto">
                      <thead
                        className="sticky top-0 z-10 text-xs uppercase bg-gray-100 border-b border-gray-300"
                        style={{ backgroundColor: theme.secondaryColor }}
                      >
                        <tr className="transition-all">
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
                            Over All Target Price
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50 transition-all">
                         <td className="px-3 py-3 text-[17px] font-normal text-center text-[#252C58]">
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
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Monthly Achievement Table */}
                  <div className="overflow-x-auto mt-4">
                    <table className="min-w-full text-sm text-left text-gray-700 table-auto">
                      <thead
                        className="sticky top-0 z-10 text-xs uppercase bg-gray-100 border-b border-gray-300"
                        style={{ backgroundColor: theme.secondaryColor }}
                      >
                        <tr className="transition-all">
                          <th className="p-4 text-base font-semibold text-center">
                            Quarter
                          </th>
                          <th className="p-4 text-base font-semibold text-center">
                            Month
                          </th>
                          <th className="p-4 text-base font-semibold text-center">
                            Target Quantity
                          </th>
                          <th className="p-4 text-base font-semibold text-center">
                            Target Price
                          </th>
                          <th className="p-4 text-base font-semibold text-center">
                            Achievement Quantity
                          </th>
                          <th className="p-4 text-base font-semibold text-center">
                            Achievement Price
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {QUARTERS.map((q, qIdx) => {
                          const qData = achievement[q];
                          if (!qData) return null;
                          const monthKeys = Object.keys(qData).filter(
                            (k) => !k.startsWith("Quarter")
                          );
                          const hasMonths = monthKeys.length > 0;
                          return (
                            <React.Fragment
                              key={`${product._id || index}-${q}`}
                            >
                              {hasMonths ? (
                                monthKeys.map((month, mIdx) => {
                                  const mData = qData[month];
                                  return (
                                    <tr
                                      key={mIdx}
                                      className="hover:bg-gray-50 transition-all"
                                    >
                                      {mIdx === 0 && (
                                        <td
                                          className="p-4 text-center text-[17px] font-normal text-[#252C58] align-middle"
                                          rowSpan={monthKeys.length}
                                        >
                                          {`Q${qIdx + 1}`}
                                        </td>
                                      )}
                                      <td className="px-3 py-3 text-[17px] font-normal text-center text-[#252C58]">
                                        {month}
                                      </td>
                                      <td className="p-4 text-[17px] font-normal text-center text-[#252C58]">
                                        {mData?.targetQuantity || "N/A"}
                                      </td>
                                      <td className="p-4 text-[17px] font-normal text-center text-[#252C58]">
                                        {mData?.targetPrice || "N/A"}
                                      </td>
                                      <td className="p-4 text-[17px] font-normal text-center text-[#252C58]">
                                        {mData?.targetAchievementQuantity || "N/A"}
                                      </td>
                                      <td className="p-2 text-center text-[19px] font-normal text-[#252C58] align-middle">
                                        {mData?.targetAchievementPrice || "N/A"}
                                      </td>
                                    </tr>
                                  );
                                })
                              ) : (
                                <tr className="hover:bg-gray-50 transition-all">
                                  <td
                                    className="p-4 text-center text-[17px] font-normal text-[#252C58] align-middle"
                                    colSpan="2"
                                  >
                                    {`Q${qIdx + 1}`}
                                  </td>
                                  <td className="p-4 text-[17px] font-normal text-center text-[#252C58]">
                                    {qData?.QuarterTargetQuantity || "N/A"}
                                  </td>
                                  <td className="p-4 text-[17px] font-normal text-center text-[#252C58]">
                                    {qData?.QuarterTargetPrice || "N/A"}
                                  </td>
                                  <td className="p-4 text-[17px] font-normal text-center text-[#252C58]">
                                    {qData?.QuarterAchievementQuantity || "N/A"}
                                  </td>
                                  <td className="p-2 text-center text-[19px] font-normal text-[#252C58] align-middle">
                                    {qData?.QuarterAchievementPrice || "N/A"}
                                  </td>
                                </tr>
                              )}

                              {/* Quarter Summary Row */}
                              <tr
                                className="bg-gray-300 font-semibold"
                                key={`${product._id || index}-${q}-summary`}
                              >
                                <td
                                  className="p-4 text-center text-[17px] font-semibold text-[#252C58] align-middle"
                                  colSpan="2"
                                >
                                  {`Q${qIdx + 1} Summary`}
                                </td>
                                <td className="p-4 text-[17px] font-semibold text-center text-[#252C58]">
                                  {qData?.QuarterTargetQuantity || "N/A"}
                                </td>
                                <td className="p-4 text-[17px] font-semibold text-center text-[#252C58]">
                                  {qData?.QuarterTargetPrice || "N/A"}
                                </td>
                                <td className="p-4 text-[17px] font-semibold text-center text-[#252C58]">
                                  {qData?.QuarterAchievementQuantity || "N/A"}
                                </td>
                                <td className="p-2 text-center text-[19px] font-semibold text-[#252C58] align-middle">
                                  {qData?.QuarterAchievementPrice || "N/A"}
                                </td>
                              </tr>
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}

            {products.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No products found for this hospital.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ViewHospitalIdWiseTargetSheet;
