import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaPlusCircle } from "react-icons/fa";
import { TiEye } from "react-icons/ti";
import { FiFilter } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../../../components/uiComponents/pagination/Pagination.jsx";
import BreadCrumb from "../../../../../components/uiComponents/breadcrumb/BreadCrumb.jsx";
import DateRangeFilter from "./DateRangeFilter";
import FilterCheckboxDropdown from "./FilterCheckboxDropdown";
import { toast } from "react-toastify";
import { AiOutlineClose } from "react-icons/ai";
import { useTheme } from "../../../../../hooks/theme/useTheme.js";
import Button from "../../../../../components/uiComponents/button/Button.jsx";
import useTargetSheet from "../../../../../hooks/salesExecutiveHook/customerVisitPlan/useTaregtSheet.js";
import LoaderSpinner from "../../../../../components/uiComponents/loader/LoaderSpinner.jsx";
import Select from "react-select";
import useDropdown from "../../../../../hooks/dropdown/useDropdown";

const TargetSheet = () => {
  const { loading, targetSheetList, fetchTargetSheetList } = useTargetSheet();
  const {
    loading: dropDownLoading,
    organizationList,
    fetchDoctorList,
    doctorList,
    fetchOrganizationNames,
    cityNames,
    fetchCityNames,
    productList,
    fetchProductsNames,
    speciality,
    fetchSpeciality,
    organizationTypes,
    fetchOrganizationTypes,
  } = useDropdown();

  const navigate = useNavigate();

  const [showFilter, setShowFilter] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { theme } = useTheme();
  const [filters, setFilters] = useState({
    productName: "",
    city: "",
    specialty: "",
    personName: "",
    organizationName: "",
    organizationType: "",
  });
  const handleSelectChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleViewClick = (id) => {
    navigate(`/sales-executive/target-sheet/view-target-sheet/${id}`);
  };

  const onPageChange = (data) => {
    setPage(data);
  };

  const onItemsPerPageChange = (data) => {
    setLimit(data);
  };

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--primary-color",
      theme.primaryColor
    );
    document.documentElement.style.setProperty(
      "--highlight-color",
      theme.highlightColor
    );
    document.documentElement.style.setProperty(
      "--secondary-color",
      theme.secondaryColor
    );
    document.documentElement.style.setProperty(
      "--bgSidebar-color",
      theme.bgSidebarColor
    );
  }, [theme]);

  useEffect(() => {
    fetchTargetSheetList(page, limit, filters);
  }, [page, limit]);

  useEffect(() => {
    fetchDoctorList();
    fetchOrganizationNames();
    fetchCityNames();
    fetchProductsNames();
    fetchSpeciality();
    fetchOrganizationTypes();
  }, []);

  return (
    <div className="w-full min-h-screen">
      {/* Breadcrumb */}
      <BreadCrumb
        linkText={[{ text: "Customer Visit Plan" }, { text: "Target Sheet" }]}
      />
      <div className="p-4 bg-white rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-gray-800 font ">
            Target Sheet List
          </h2>

          <div className="flex items-center gap-2">
            {/* Toggle Filter */}
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-yellow-100 text-sm "
              style={{
                background: theme.primaryColor,
                color: "#ffffff",
              }}
            >
              <FiFilter size={16} />
            </button>

            {/* Create New */}
            <Button
              onClick={() =>
                navigate("/sales-executive/target-sheet/target-sheet-form")
              }
              variant={1}
              text="Create Target Sheet"
            />
          </div>
        </div>
        <hr
          className="h-1 border-0"
          style={{ backgroundColor: theme.secondaryColor }}
        />
        {/* Filter Modal Popup */}
        {showFilter && (
          <div className="fixed inset-0 shadow-2xl bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white shadow-lg w-[60%] relative border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 p-2 text-black text-center bg-[var(--secondary-color)]">
                Filter Options
              </h2>

              <button
                onClick={() => setShowFilter(false)}
                className="absolute top-2 right-2 text-gray-900 text-xl"
              >
                <AiOutlineClose />
              </button>

              <div className="grid grid-cols-2 gap-3 mb-2 p-2">
                <Select
                  isLoading={dropDownLoading}
                  isClearable
                  placeholder="Select Product name"
                  classNamePrefix="react-select"
                  value={
                    filters.productName
                      ? {
                        label: filters.productName,
                        value: filters.productName,
                      }
                      : null
                  }
                  onChange={(option) =>
                    handleSelectChange(
                      "productName",
                      option ? option.value : ""
                    )
                  }
                  options={productList?.map((pro) => ({
                    label: pro.name,
                    value: pro.name,
                  }))}
                />
                <Select
                  isLoading={dropDownLoading}
                  isClearable
                  placeholder="Select City"
                  classNamePrefix="react-select"
                  value={
                    filters.city
                      ? { label: filters.city, value: filters.city }
                      : null
                  }
                  onChange={(option) =>
                    handleSelectChange("city", option ? option.value : "")
                  }
                  options={
                    Array.isArray(cityNames)
                      ? cityNames.map((c) => ({ label: c, value: c }))
                      : []
                  }
                />
                <Select
                  isLoading={dropDownLoading}
                  isClearable
                  placeholder="Select Speciality"
                  classNamePrefix="react-select"
                  value={
                    filters.specialty
                      ? { label: filters.specialty, value: filters.specialty }
                      : null
                  }
                  onChange={(option) =>
                    handleSelectChange("specialty", option ? option.value : "")
                  }
                  options={
                    Array.isArray(speciality)
                      ? speciality.map((s) => ({ label: s, value: s }))
                      : []
                  }
                />
                <Select
                  isLoading={dropDownLoading}
                  isClearable
                  placeholder="Select Person name"
                  classNamePrefix="react-select"
                  value={
                    filters.personName
                      ? { label: filters.personName, value: filters.personName }
                      : null
                  }
                  onChange={(option) =>
                    handleSelectChange("personName", option ? option.value : "")
                  }
                  options={doctorList?.map((doc) => ({
                    label: doc.fullName,
                    value: doc.fullName,
                  }))}
                />
                <Select
                  isLoading={dropDownLoading}
                  isClearable
                  placeholder="Select Organization"
                  classNamePrefix="react-select"
                  value={
                    filters.organizationName
                      ? {
                        label: filters.organizationName,
                        value: filters.organizationName,
                      }
                      : null
                  }
                  onChange={(option) =>
                    handleSelectChange(
                      "organizationName",
                      option ? option.value : ""
                    )
                  }
                  options={organizationList?.data?.map((org) => ({
                    label: org,
                    value: org,
                  }))}
                />

                <Select
                  isLoading={dropDownLoading}
                  isClearable
                  placeholder="Select Organization Type"
                  classNamePrefix="react-select"
                  value={
                    filters.organizationType
                      ? {
                        label: filters.organizationType,
                        value: filters.organizationType,
                      }
                      : null
                  }
                  onChange={(option) =>
                    handleSelectChange(
                      "organizationType",
                      option ? option.value : ""
                    )
                  }
                  options={
                    Array.isArray(organizationTypes)
                      ? organizationTypes.map((typeOrg) => ({
                        label: typeOrg,
                        value: typeOrg,
                      }))
                      : []
                  }
                />
              </div>
              <div className="text-center p-2 w-full">
                <Button
                  onClick={() => {
                    setPage(1);
                    fetchTargetSheetList(1, limit, filters);
                    setShowFilter(false);
                  }}
                  text="Search"
                />
              </div>
            </div>
          </div>
        )}

        {/* Table */}

        <div className="mt-6 overflow-x-auto border border-gray-200 shadow rounded-t-2xl">
          <table className="min-w-full text-sm text-left text-gray-700 table-auto">
            <thead
              className="sticky top-0 z-10 text-xs uppercase bg-gray-100 border-b border-gray-300"
              style={{ backgroundColor: theme.secondaryColor }}
            >
              <tr className="transition-all ">
                <th className="p-4 text-base font-semibold text-center">
                  Sr. No.
                </th>
                <th className="p-4 text-base font-semibold text-center">
                  Name of Hospital
                </th>
                <th className="p-4 text-base font-semibold text-center">
                  Product Target Quantity(Yearly)
                </th>
                <th className="p-4 text-base font-semibold text-center">
                  Product Achievement(Yearly)
                </th>
                <th className="p-4 text-base font-semibold text-center">
                  Product Target Quantity(Quarterly)
                </th>
                <th className="p-4 text-base font-semibold text-center">
                  Product Achievement(Quarterly)
                </th>
                <th className="p-4 text-base font-semibold text-center">
                  Product Target Quantity(Monthly)
                </th>
                <th className="p-4 text-base font-semibold text-center">
                  Product Achievement(Monthly)
                </th>
                <th className="p-4 text-base font-semibold text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center">
                    <div className="flex justify-center items-center w-full">
                      <LoaderSpinner />
                    </div>
                  </td>
                </tr>
              ) : targetSheetList?.data?.length > 0 ? (
                targetSheetList?.data?.map((target, index) => (
                  <tr
                    key={target._id}
                    className="hover:bg-gray-50 transition-all"
                  >
                    <td className="p-4 text-center text-[17px] font-normal  text-[#252C58]">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="p-2 text-[17px] font-normal text-center  text-[#252C58]">
                      {target.organization || "N/A"}
                    </td>
                    <td className="px-3 py-3 text-[17px] font-normal text-center text-[#252C58]">
                      {target?.year?.target || "N/A"}
                    </td>
                    <td className="p-4 text-[17px] font-normal  text-center  text-[#252C58]">
                      {target?.year?.achievement || "N/A"}
                    </td>
                    <td className="px-3 py-3 text-[17px] font-normal text-center text-[#252C58]">
                      {target?.quarter?.target || "N/A"}
                    </td>
                    <td className="p-4 text-[17px] font-normal  text-center  text-[#252C58]">
                      {target?.quarter?.achievement || "N/A"}
                    </td>
                    <td className="px-3 py-3 text-[17px] font-normal text-center text-[#252C58]">
                      {target?.month?.target || "N/A"}
                    </td>
                    <td className="p-4 text-[17px] font-normal  text-center  text-[#252C58]">
                      {target?.month?.achievement || "N/A"}
                    </td>
                    <td className="p-2 text-center text-[19px] font-normal text-[#252C58] align-middle">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleViewClick(target._id)}
                          className="text-black hover:bg-blue-200  rounded-full w-8 h-8 flex items-center justify-center"
                          style={{
                            color: theme.primaryColor,
                          }}
                        >
                          <TiEye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No target sheet list found.
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
              currentPage={targetSheetList?.currentPage}
              totalItems={targetSheetList?.totalItems}
              itemsPerPage={limit}
              totalPages={targetSheetList?.totalPages}
              onPageChange={onPageChange}
              onItemsPerPageChange={onItemsPerPageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TargetSheet;