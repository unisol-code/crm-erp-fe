import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb.jsx";
import { useTheme } from "../../../../../hooks/theme/useTheme.js";
import useTargetSheet from "../../../../../hooks/salesExecutiveHook/customerVisitPlan/useTaregtSheet.js";
import LoaderSpinner from "../../../../../components/uiComponents/loader/LoaderSpinner.jsx";

const QUARTERS = ["Quarter1", "Quarter2", "Quarter3", "Quarter4"];

const ViewIndividualWiseTargetSheet = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const {
    individualIdWiseTargetSheet,
    individualIdWiseTargetLoading,
    fetchIndividualIdWiseTargetSheet,
    resetIndividualIdWiseTargetSheet,
  } = useTargetSheet();

  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    if (id) {
      fetchIndividualIdWiseTargetSheet({ id });
    }
    return () => {
      resetIndividualIdWiseTargetSheet();
    };
  }, [id]);

  const toggleIndividual = (idx) => {
    setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const data = individualIdWiseTargetSheet?.data;

  const currency = (val) =>
    val != null
      ? new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }).format(val)
      : "0";

  const summary = {
    totalTargetSheets: 1,
    totalProducts: data?.products?.length ?? 0,
    totalTargetQuantity:
      (data?.products?.reduce(
        (acc, p) => acc + (p.enteredQuantity ?? 0),
        0
      ) ?? 0) +
      0,
    totalTargetPrice:
      data?.products?.reduce(
        (acc, p) => acc + (p.overAllTargetPrice ?? 0),
        0
      ) ?? 0,
  };

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
          {
            text: "View Year Wise Target Sheet",
            href: `/sales-executive/target-sheet/view-year-wise-product/${data?.year}`,
          },
          { text: "View Individual Wise Target Sheet" },
        ]}
      />

      <div className="p-4 bg-white rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-gray-800">
            Individual Wise Target Sheet Detail
          </h2>
        </div>
        <hr
          className="h-1 border-0 mb-6"
          style={{ backgroundColor: theme.secondaryColor }}
        />

        {/* Loading */}
        {individualIdWiseTargetLoading ? (
          <div className="flex justify-center items-center py-12">
            <LoaderSpinner />
          </div>
        ) : !data ? (
          <p className="text-center text-gray-500 py-8">
            No individual target sheet data found.
          </p>
        ) : (
          <>
            {/* Individual Info */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 border border-gray-200 rounded-xl bg-gray-200">
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Organization
                </span>
                <p className="text-lg font-semibold text-[#252C58]">
                  {data?.organization || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Unique Code
                </span>
                <p className="text-lg font-semibold text-[#252C58]">
                  {data?.uniqueCodeOrganization || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">City</span>
                <p className="text-lg font-semibold text-[#252C58]">
                  {data?.city || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Year</span>
                <p className="text-lg font-semibold text-[#252C58]">
                  {data?.year || "N/A"}
                </p>
              </div>
            </div>

            {/* Totals Summary */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 p-4 border border-gray-200 rounded-xl">
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Total Target Sheets
                </span>
                <p className="text-lg font-semibold text-[#252C58]">
                  {summary.totalTargetSheets}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Total Individuals
                </span>
                <p className="text-lg font-semibold text-[#252C58]">
                  1
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Total Products
                </span>
                <p className="text-lg font-semibold text-[#252C58]">
                  {summary.totalProducts}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Total Target Quantity
                </span>
                <p className="text-lg font-semibold text-[#252C58]">
                  {summary.totalTargetQuantity ?? 0}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Total Target Price
                </span>
                <p className="text-lg font-semibold text-[#252C58]">
                  {summary.totalTargetPrice ? currency(summary.totalTargetPrice) : "0"}
                </p>
              </div>
            </div>

            {/* Individual Wise Sections */}
            {[data].map((individual, indIdx) => (
              <div
                key={individual?._id || indIdx}
                className="mb-8 border border-gray-200 rounded-xl overflow-hidden"
              >
                {/* Individual Header */}
                <div
                  className="p-4"
                  style={{ backgroundColor: theme.secondaryColor }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-[#252C58]">
                      {individual?.individualName ||
                        `Individual ${indIdx + 1}`}
                    </h3>
                    <button
                      type="button"
                      onClick={() => toggleIndividual(indIdx)}
                      className="flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-md bg-white/70 text-[#252C58] hover:bg-white transition-all"
                    >
                      {expanded[indIdx] ? "Collapse" : "Expand"}
                      {expanded[indIdx] ? (
                        <FiChevronUp size={16} />
                      ) : (
                        <FiChevronDown size={16} />
                      )}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Individual Name
                      </span>
                      <p className="text-lg font-semibold text-[#252C58]">
                        {individual?.individualName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Individual Code
                      </span>
                      <p className="text-lg font-semibold text-[#252C58]">
                        {individual?.uniqueCodeIndividual || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Speciality
                      </span>
                      <p className="text-lg font-semibold text-[#252C58]">
                        {individual?.speciality || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Type of Surgery
                      </span>
                      <p className="text-lg font-semibold text-[#252C58]">
                        {individual?.typeOfSurgeryPerformed || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 pt-3 border-t border-gray-300">
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Target Sheets
                      </span>
                      <p className="text-base font-semibold text-[#252C58]">
                        {individual?.totalTargetSheets ?? 0}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Products
                      </span>
                      <p className="text-base font-semibold text-[#252C58]">
                        {individual?.totalProducts ?? 0}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Target Quantity
                      </span>
                      <p className="text-base font-semibold text-[#252C58]">
                        {individual?.totalTargetQuantity ?? 0}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Target Price
                      </span>
                      <p className="text-base font-semibold text-[#252C58]">
                        {individual?.totalTargetPrice
                          ? currency(individual.totalTargetPrice)
                          : "0"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sheets / Products */}
                {expanded[indIdx] && (individual?.data || individual?.products || []).map((product, productIdx) => {
                  const achievement = product?.achievement || {};

                  return (
                    <div
                      key={product?._id || productIdx}
                      className="border-t border-gray-200"
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
                                {product?.productType || "N/A"}
                              </td>
                              <td className="px-3 py-3 text-[17px] font-normal text-center text-[#252C58]">
                                {product?.name || "N/A"}
                              </td>
                              <td className="p-4 text-[17px] font-normal text-center text-[#252C58]">
                                {product?.price
                                  ? currency(product.price)
                                  : "0"}
                              </td>
                              <td className="p-4 text-[17px] font-normal text-center text-[#252C58]">
                                {product?.enteredQuantity ?? 0}
                              </td>
                              <td className="p-2 text-center text-[19px] font-normal text-[#252C58] align-middle">
                                {product?.overAllTargetPrice
                                  ? currency(product.overAllTargetPrice)
                                  : "0"}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Monthly Achievement Table */}
                      <div className="overflow-x-auto mt-4 mb-4">
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
                              const qData = achievement?.[q];
                              if (!qData) return null;
                              const monthKeys = Object.keys(qData).filter(
                                (k) => !k.startsWith("Quarter")
                              );
                              const hasMonths = monthKeys.length > 0;
                              return (
                                <React.Fragment key={q}>
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
                                            {mData?.targetQuantity ?? 0}
                                          </td>
                                          <td className="p-4 text-[17px] font-normal text-center text-[#252C58]">
                                            {mData?.targetPrice ?? 0}
                                          </td>
                                          <td className="p-4 text-[17px] font-normal text-center text-[#252C58]">
                                            {mData?.targetAchievementQuantity ??
                                              0}
                                          </td>
                                          <td className="p-2 text-center text-[19px] font-normal text-[#252C58] align-middle">
                                            {mData?.targetAchievementPrice ??
                                              0}
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
                                        {qData?.QuarterTargetQuantity ?? 0}
                                      </td>
                                      <td className="p-4 text-[17px] font-normal text-center text-[#252C58]">
                                        {qData?.QuarterTargetPrice ?? 0}
                                      </td>
                                      <td className="p-4 text-[17px] font-normal text-center text-[#252C58]">
                                        {qData?.QuarterAchievementQuantity ??
                                          0}
                                      </td>
                                      <td className="p-2 text-center text-[19px] font-normal text-[#252C58] align-middle">
                                        {qData?.QuarterAchievementPrice ?? 0}
                                      </td>
                                    </tr>
                                  )}

                                  {/* Quarter Summary Row */}
                                  <tr
                                    className="bg-gray-300 font-semibold"
                                    key={`${q}-summary`}
                                  >
                                    <td
                                      className="p-4 text-center text-[17px] font-semibold text-[#252C58] align-middle"
                                      colSpan="2"
                                    >
                                      {`Q${qIdx + 1} Summary`}
                                    </td>
                                    <td className="p-4 text-[17px] font-semibold text-center text-[#252C58]">
                                      {qData?.QuarterTargetQuantity ?? 0}
                                    </td>
                                    <td className="p-4 text-[17px] font-semibold text-center text-[#252C58]">
                                      {qData?.QuarterTargetPrice ?? 0}
                                    </td>
                                    <td className="p-4 text-[17px] font-semibold text-center text-[#252C58]">
                                      {qData?.QuarterAchievementQuantity ??
                                        0}
                                    </td>
                                    <td className="p-2 text-center text-[19px] font-semibold text-[#252C58] align-middle">
                                      {qData?.QuarterAchievementPrice ?? 0}
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
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ViewIndividualWiseTargetSheet;