import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb.jsx";
import { useTheme } from "../../../../../hooks/theme/useTheme.js";
import Button from "../../../../../components/uiComponents/button/Button.jsx";
import useTargetSheet from "../../../../../hooks/salesExecutiveHook/customerVisitPlan/useTaregtSheet.js";
import LoaderSpinner from "../../../../../components/uiComponents/loader/LoaderSpinner.jsx";

const Item = ({ label, value }) => (
  <div className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200">
    <p className="text-xs uppercase font-semibold text-gray-500 tracking-wide">
      {label}
    </p>
    <p className="text-base font-medium text-gray-800 mt-1">{value}</p>
  </div>
);

const PreviewTargetSheet = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { id } = useParams();
  const {
    targetSheetDetails,
    fetchTargetSheetById,
    loading,
    resetTargetSheetDetails,
  } = useTargetSheet();

  useEffect(() => {
    fetchTargetSheetById(id);
  }, [id]);

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
          { text: "View Target Sheet" },
        ]}
      />

      <div className="rounded-2xl text-sm font-medium text-gray-700">
        {/* Header */}
        <div className="text-center">
          <h2
            className="p-6 font-semibold text-xl text-black bg-opacity-40 rounded-t-lg"
            style={{ backgroundColor: theme.secondaryColor }}
          >
            View Target Sheet
          </h2>
        </div>

        {/* Details Section */}
        <div className="bg-white p-6 border border-gray-200 rounded-b-lg shadow-md">
          {loading ? (
            <div className="w-full flex items-center justify-center py-4">
              <LoaderSpinner />
            </div>
          ) : (
            targetSheetDetails?.data && (
              <div className="flex flex-col gap-8">
                {/* Organization Details */}
                <div>
                  <h3 className="font-semibold mb-4">Organization Details</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Item
                      label="Type Of Organization"
                      value={
                        targetSheetDetails.data.typeOfOrganization || "N/A"
                      }
                    />
                    <Item
                      label="Select Organization"
                      value={targetSheetDetails.data.organization || "N/A"}
                    />
                    <Item
                      label="Select City"
                      value={targetSheetDetails.data.city || "N/A"}
                    />
                    <Item
                      label="Select Speciality"
                      value={targetSheetDetails.data.speciality || "N/A"}
                    />
                    <Item
                      label="Speciality Target"
                      value={targetSheetDetails.data.SpecialityTarget || "N/A"}
                    />
                    <Item
                      label="Speciality Achievement"
                      value={
                        targetSheetDetails.data.SpecialityAchievement || "N/A"
                      }
                    />
                    <Item
                      label="Doctor/Surgeon Name"
                      value={targetSheetDetails.data.doctorName || "N/A"}
                    />
                    <Item
                      label="Product Type"
                      value={targetSheetDetails.data.productType || "N/A"}
                    />
                  </div>
                </div>

                {/* Product Details */}
                {/* {Array.isArray(targetSheetDetails.data.products) &&
                  targetSheetDetails.data.products.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-4">Product Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {targetSheetDetails.data.products.map((product, index) => (
                          <React.Fragment key={index}>
                            <Item label="Product Name" value={product.name || "N/A"} />
                            <Item label="Product Price" value={product.price || "N/A"} />
                            <Item
                              label="Product Quality"
                              value={product.enteredQuantity || "N/A"}
                            />
                            <Item
                              label="Product Target Qty. for The Year"
                              value={product.productTargetYear || "N/A"}
                            />
                            <Item
                              label="Product Target Qty. for The Quarter"
                              value={product.productTargetQuarter || "N/A"}
                            />
                            <Item
                              label="Product Target Qty. for The Month"
                              value={product.productTargetMonth || "N/A"}
                            />
                            <Item
                              label="Product Achievement (Year)"
                              value={product.productAchievementYear || "N/A"}
                            />
                            <Item
                              label="Product Achievement (Quarter)"
                              value={product.productAchievementQuarter || "N/A"}
                            />
                            <Item
                              label="Product Achievement (Monthly)"
                              value={product.productAchievementMonth || "N/A"}
                            />
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )} */}
                {Array.isArray(targetSheetDetails.data.products) &&
                  targetSheetDetails.data.products.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-4">Product Details</h3>
                      <div className="grid grid-cols-1 gap-6">
                        {targetSheetDetails.data.products.map(
                          (product, index) => (
                            <div
                              key={product._id || index}
                              className="border rounded-2xl p-4 shadow-sm bg-white"
                            >
                              <h4 className="font-bold text-lg mb-3">
                                Product {index + 1}: {product.name}
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Item
                                  label="Product Name"
                                  value={product.name || "N/A"}
                                />
                                <Item
                                  label="Product Price"
                                  value={product.price || "N/A"}
                                />
                                <Item
                                  label="Product Quantity"
                                  value={product.enteredQuantity || "N/A"}
                                />
                                <Item
                                  label="Target Qty. (Year)"
                                  value={product.productTargetYear || "N/A"}
                                />
                                <Item
                                  label="Target Qty. (Quarter)"
                                  value={product.productTargetQuarter || "N/A"}
                                />
                                <Item
                                  label="Target Qty. (Month)"
                                  value={product.productTargetMonth || "N/A"}
                                />
                                <Item
                                  label="Achievement (Year)"
                                  value={
                                    product.productAchievementYear || "N/A"
                                  }
                                />
                                <Item
                                  label="Achievement (Quarter)"
                                  value={
                                    product.productAchievementQuarter || "N/A"
                                  }
                                />
                                <Item
                                  label="Achievement (Month)"
                                  value={
                                    product.productAchievementMonth || "N/A"
                                  }
                                />
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Additional Details */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">
                    Additional Details
                  </h3>
                  <hr className="mb-4"></hr>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Item
                      label="Procurement Via"
                      value={targetSheetDetails.data.procurementVia || "N/A"}
                    />
                    <Item
                      label="Value"
                      value={targetSheetDetails.data.value || "N/A"}
                    />
                    <Item
                      label="Estimated Business Potential In A Year"
                      value={
                        targetSheetDetails.data.estimatedBusinessPotential ||
                        "N/A"
                      }
                    />
                    <Item
                      label="Target Value"
                      value={targetSheetDetails.data.targetValue || "N/A"}
                    />
                  </div>
                </div>

                {/* Button */}
                <div className="flex justify-center pt-8">
                  <Button
                    variant={1}
                    text="Edit Target Sheet"
                    onClick={() => {
                      resetTargetSheetDetails();
                      navigate(
                        `/sales-executive/target-sheet/edit-target-sheet/${id}`
                      );
                    }}
                  />
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewTargetSheet;
