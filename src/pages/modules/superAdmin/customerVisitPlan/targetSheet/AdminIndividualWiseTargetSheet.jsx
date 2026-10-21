import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb.jsx";
import { useTheme } from "../../../../../hooks/theme/useTheme.js";
import useAdminTargetSheet from "../../../../../hooks/superAdminHook/customerVisitPlan/targetSheet/useAdminTargetSheet.js";
import LoaderSpinner from "../../../../../components/uiComponents/loader/LoaderSpinner.jsx";

const QUARTERS = ["Quarter1", "Quarter2", "Quarter3", "Quarter4"];

const currency = (val) =>
  val != null
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(val)
    : "0";

const statusColor = (status = "") => {
  const s = status.toLowerCase();
  if (s.includes("reject")) return "bg-red-100 text-red-700";
  if (s.includes("approv")) return "bg-green-100 text-green-700";
  if (s.includes("pending")) return "bg-yellow-100 text-yellow-700";
  return "bg-gray-100 text-gray-600";
};

const AdminIndividualWiseTargetSheet = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  // employee._id is passed from AdminUniversalTargetSheet as ?salesId=
  const salesId = searchParams.get("salesId");
  const {
    idWiseTargetSheet,
    loading,
    fetchIdWiseTargetSheet,
    resetIdWiseTargetSheet,
  } = useAdminTargetSheet();

  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    if (id) {
      fetchIdWiseTargetSheet(id, salesId);
    }
    return () => {
      resetIdWiseTargetSheet();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const toggleProduct = (idx) =>
    setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }));

  const data = idWiseTargetSheet?.data;
  const products = data?.products ?? [];
  const approvals = data?.approvals ?? {};

  const totalTargetQuantity = products.reduce(
    (acc, p) => acc + (p?.enteredQuantity ?? 0),
    0
  );
  const totalTargetPrice = products.reduce(
    (acc, p) => acc + (p?.overAllTargetPrice ?? 0),
    0
  );

  return (
    <div className="w-full min-h-screen pb-10">
      <BreadCrumb
        linkText={[
          { text: "Customer Visit Plan" },
          { text: "Target Sheet", href: "/admin/sales-executive/target-sheet" },
          { text: "Individual Wise Target Sheet" },
        ]}
      />

      <div className="p-4 bg-white rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-gray-800">
            Individual Wise Target Sheet
          </h2>
        </div>
        <hr
          className="h-1 border-0 mb-6"
          style={{ backgroundColor: theme.secondaryColor }}
        />

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoaderSpinner />
          </div>
        ) : !data ? (
          <p className="text-center text-gray-500 py-8">
            No target sheet data found.
          </p>
        ) : (
          <>
            {/* Sheet Info */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 border border-gray-200 rounded-xl bg-gray-100">
              <div>
                <span className="text-sm font-medium text-gray-600">Organization</span>
                <p className="text-lg font-semibold text-[#252C58]">{data?.organization || "N/A"}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Individual Name</span>
                <p className="text-lg font-semibold text-[#252C58]">{data?.individualName || "N/A"}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Speciality</span>
                <p className="text-lg font-semibold text-[#252C58]">{data?.speciality || "N/A"}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">City</span>
                <p className="text-lg font-semibold text-[#252C58]">{data?.city || "N/A"}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Org Code</span>
                <p className="text-lg font-semibold text-[#252C58]">{data?.uniqueCodeOrganization || "N/A"}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Individual Code</span>
                <p className="text-lg font-semibold text-[#252C58]">{data?.uniqueCodeIndividual || "N/A"}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Type of Surgery</span>
                <p className="text-lg font-semibold text-[#252C58]">{data?.typeOfSurgeryPerformed || "N/A"}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Year</span>
                <p className="text-lg font-semibold text-[#252C58]">{data?.year || "N/A"}</p>
              </div>
            </div>

            {/* Status + Totals */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 p-4 border border-gray-200 rounded-xl">
              <div>
                <span className="text-sm font-medium text-gray-600">Status</span>
                <p className="mt-1">
                  <span className={`inline-block px-2 py-1 rounded text-sm font-semibold ${statusColor(data?.status)}`}>
                    {data?.status?.replace(/_/g, " ") || "N/A"}
                  </span>
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Total Products</span>
                <p className="text-lg font-semibold text-[#252C58]">{products.length}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Total Target Quantity</span>
                <p className="text-lg font-semibold text-[#252C58]">{totalTargetQuantity}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Total Target Price</span>
                <p className="text-lg font-semibold text-[#252C58]">{currency(totalTargetPrice)}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Frozen</span>
                <p className="text-lg font-semibold text-[#252C58]">{data?.isFrozen ? "Yes" : "No"}</p>
              </div>
            </div>
            {/* Approvals */}
            {Object.keys(approvals).length > 0 && (
              <div className="mb-8 border border-gray-200 rounded-xl overflow-hidden">
                <div className="p-4" style={{ backgroundColor: theme.secondaryColor }}>
                  <h3 className="text-lg font-semibold text-[#252C58]">Approvals</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-left text-gray-700 table-auto">
                    <thead className="uppercase bg-gray-100 border-b border-gray-300">
                      <tr>
                        <th className="p-4 text-base font-semibold text-left">Role</th>
                        <th className="p-4 text-base font-semibold text-left">Status</th>
                        <th className="p-4 text-base font-semibold text-left">Remarks</th>
                        <th className="p-4 text-base font-semibold text-left">Action Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {Object.entries(approvals).map(([role, a]) => (
                        <tr key={role} className="hover:bg-gray-50 transition-all">
                          <td className="px-4 py-3 text-[15px] text-[#252C58]">{role}</td>
                          <td className="px-4 py-3 text-[15px]">
                            <span className={`inline-block px-2 py-1 rounded text-sm font-semibold ${statusColor(a?.status)}`}>
                              {a?.status || "N/A"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[15px] text-[#252C58]">{a?.remarks || "-"}</td>
                          <td className="px-4 py-3 text-[15px] text-[#252C58]">
                            {a?.actionDate ? new Date(a.actionDate).toLocaleString("en-IN") : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {/* Products */}
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Products ({products.length})
            </h3>
            {products.length > 0 ? (
              products.map((product, idx) => {
                const achievement = product?.achievement || {};
                return (
                  <div
                    key={product?._id || idx}
                    className="mb-6 border border-gray-200 rounded-xl overflow-hidden"
                  >
                    {/* Product Header */}
                    <div className="p-4" style={{ backgroundColor: theme.secondaryColor }}>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-semibold text-[#252C58]">
                          {product?.name || "N/A"}
                          {product?.productType ? ` — ${product.productType}` : ""}
                        </h4>
                        <button
                          type="button"
                          onClick={() => toggleProduct(idx)}
                          className="flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-md bg-white/70 text-[#252C58] hover:bg-white transition-all"
                        >
                          {expanded[idx] ? "Collapse" : "Expand"}
                          {expanded[idx] ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                        </button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Price</span>
                          <p className="text-base font-semibold text-[#252C58]">{currency(product?.price)}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Entered Quantity</span>
                          <p className="text-base font-semibold text-[#252C58]">{product?.enteredQuantity ?? 0}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Over All Target Price</span>
                          <p className="text-base font-semibold text-[#252C58]">{currency(product?.overAllTargetPrice)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Expanded: Product Details + Achievement Tables */}
                    {expanded[idx] && (
                      <div className="p-4 border-t border-gray-200">
                        {/* Quarterly / Monthly Achievement Table */}
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-sm text-left text-gray-700 table-auto">
                            <thead
                              className="sticky top-0 z-10 text-xs uppercase bg-gray-100 border-b border-gray-300"
                              style={{ backgroundColor: theme.secondaryColor }}
                            >
                              <tr>
                                <th className="p-4 text-base font-semibold text-center">Quarter</th>
                                <th className="p-4 text-base font-semibold text-center">Month</th>
                                <th className="p-4 text-base font-semibold text-center">Target Quantity</th>
                                <th className="p-4 text-base font-semibold text-center">Target Price</th>
                                <th className="p-4 text-base font-semibold text-center">Achievement Quantity</th>
                                <th className="p-4 text-base font-semibold text-center">Achievement Price</th>
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
                                          <tr key={month} className="hover:bg-gray-50 transition-all">
                                            {mIdx === 0 && (
                                              <td
                                                className="p-4 text-center text-[17px] font-normal text-[#252C58] align-middle"
                                                rowSpan={monthKeys.length}
                                              >
                                                {`Q${qIdx + 1}`}
                                              </td>
                                            )}
                                            <td className="px-3 py-3 text-[17px] font-normal text-center text-[#252C58]">{month}</td>
                                            <td className="p-4 text-[17px] font-normal text-center text-[#252C58]">{mData?.targetQuantity ?? 0}</td>
                                            <td className="p-4 text-[17px] font-normal text-center text-[#252C58]">{currency(mData?.targetPrice)}</td>
                                            <td className="p-4 text-[17px] font-normal text-center text-[#252C58]">{mData?.targetAchievementQuantity ?? 0}</td>
                                            <td className="p-4 text-[17px] font-normal text-center text-[#252C58]">{currency(mData?.targetAchievementPrice)}</td>
                                          </tr>
                                        );
                                      })
                                    ) : (
                                      <tr className="hover:bg-gray-50 transition-all">
                                        <td className="p-4 text-center text-[17px] font-normal text-[#252C58] align-middle" colSpan="2">{`Q${qIdx + 1}`}</td>
                                        <td className="p-4 text-[17px] font-normal text-center text-[#252C58]">{qData?.QuarterTargetQuantity ?? 0}</td>
                                        <td className="p-4 text-[17px] font-normal text-center text-[#252C58]">{currency(qData?.QuarterTargetPrice)}</td>
                                        <td className="p-4 text-[17px] font-normal text-center text-[#252C58]">{qData?.QuarterAchievementQuantity ?? 0}</td>
                                        <td className="p-4 text-[17px] font-normal text-center text-[#252C58]">{currency(qData?.QuarterAchievementPrice)}</td>
                                      </tr>
                                    )}

                                    {/* Quarter Summary Row */}
                                    <tr className="bg-gray-300 font-semibold">
                                      <td className="p-4 text-center text-[17px] font-semibold text-[#252C58] align-middle" colSpan="2">{`Q${qIdx + 1} Summary`}</td>
                                      <td className="p-4 text-[17px] font-semibold text-center text-[#252C58]">{qData?.QuarterTargetQuantity ?? 0}</td>
                                      <td className="p-4 text-[17px] font-semibold text-center text-[#252C58]">{currency(qData?.QuarterTargetPrice)}</td>
                                      <td className="p-4 text-[17px] font-semibold text-center text-[#252C58]">{qData?.QuarterAchievementQuantity ?? 0}</td>
                                      <td className="p-4 text-[17px] font-semibold text-center text-[#252C58]">{currency(qData?.QuarterAchievementPrice)}</td>
                                    </tr>
                                  </React.Fragment>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500 py-6">No products available.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminIndividualWiseTargetSheet;
