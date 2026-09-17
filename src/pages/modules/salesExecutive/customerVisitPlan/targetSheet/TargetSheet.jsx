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
  const { loading, targetSheetList, fetchTargetSheetYearList } = useTargetSheet();
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
    fetchTargetSheetYearList();
  }, []);

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
                  Year
                </th>
                <th className="p-4 text-base font-semibold text-center">
                  Product Count
                </th>
                <th className="p-4 text-base font-semibold text-center">
                  Hospital count 
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
                      {target.year || "N/A"}
                    </td>
                    <td className="px-3 py-3 text-[17px] font-normal text-center text-[#252C58]">
                      {target?.productCount || "N/A"}
                    </td>
                    <td className="p-4 text-[17px] font-normal  text-center  text-[#252C58]">
                      {target?.hospitalCount || "N/A"}
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