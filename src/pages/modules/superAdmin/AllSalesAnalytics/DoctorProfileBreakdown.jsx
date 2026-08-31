import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../../../../hooks/theme/useTheme";
import BreadCrumb from "../../../../components/uiComponents/breadcrumb/BreadCrumb";
import LoaderSpinner from "../../../../components/uiComponents/loader/LoaderSpinner";
import useAllSalesAnalytics from "../../../../hooks/superAdminHook/allSalesAnalytics/useAllSalesAnalytics";
import * as LucideIcons from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
} from "../AllSalesAnalytics/components/common";
import { ChartCard, AchBadge } from "../AllSalesAnalytics/components/analytics";
import Pagination from "../../../../components/uiComponents/pagination/Pagination.jsx";
import { TiEye } from "react-icons/ti";

const colorMap = {
  Surgeon: "bg-red-50 text-red-600 border-red-100",
  Physician: "bg-blue-50 text-blue-600 border-blue-100",
  Nursing: "bg-pink-50 text-pink-600 border-pink-100",
  Pharmacist: "bg-purple-50 text-purple-600 border-purple-100",
  "Bio-Medical": "bg-teal-50 text-teal-600 border-teal-100",
  Financial: "bg-emerald-50 text-emerald-600 border-emerald-100",
  "Non Clinical": "bg-gray-50 text-gray-600 border-gray-100",
};

const iconMap = {
  Surgeon: LucideIcons.Scissors,
  Physician: LucideIcons.Stethoscope,
  Nursing: LucideIcons.Heart,
  Pharmacist: LucideIcons.Pill,
  "Bio-Medical": LucideIcons.Microscope,
  Financial: LucideIcons.DollarSign,
  "Non Clinical": LucideIcons.UserCheck,
};

const DoctorProfileBreakdown = () => {
  const { profileType, doctorId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const {
    overviewData,
    allIndividualData,
    specificIndividualData,
    fetchAllIndividualData,
    fetchSpecificIndividualData,
    fetchOverviewData,
    loading,
  } = useAllSalesAnalytics();

  const [selectedProfileType, setSelectedProfileType] = useState(profileType || null);
  const [individualLoading, setIndividualLoading] = useState(false);
  const [individualPage, setIndividualPage] = useState(1);
  const [individualLimit, setIndividualLimit] = useState(10);
  const [selectedDoctor, setSelectedDoctor] = useState(doctorId || null);

  useEffect(() => {
    if (profileType) {
      setSelectedProfileType(profileType);
    }
  }, [profileType]);

  useEffect(() => {
    if (doctorId) {
      setSelectedDoctor(doctorId);
    }
  }, [doctorId]);

  useEffect(() => {
    fetchOverviewData();
  }, [fetchOverviewData]);

  const profileCounts = useMemo(() => {
    if (overviewData?.data?.typeOfDoctorProfileWiseCount) {
      return overviewData.data.typeOfDoctorProfileWiseCount;
    }
    return {};
  }, [overviewData]);

  useEffect(() => {
    if (selectedProfileType && fetchAllIndividualData) {
      setIndividualLoading(true);
      fetchAllIndividualData({
        typeOfDoctorProfile: selectedProfileType,
        page: individualPage,
        limit: individualLimit,
      }).finally(() => setIndividualLoading(false));
    }
  }, [selectedProfileType, fetchAllIndividualData, individualPage, individualLimit]);

  useEffect(() => {
    if (selectedDoctor && fetchSpecificIndividualData) {
      fetchSpecificIndividualData(selectedDoctor);
    }
  }, [selectedDoctor, fetchSpecificIndividualData]);

  const handleProfileTypeClick = (type) => {
    setSelectedProfileType(type);
    setIndividualPage(1);
    setSelectedDoctor(null);
    navigate(`/sales-analyticsAll/doctor-profile-breakdown/${type}`, { replace: true });
  };

  const handleBackToBreakdown = () => {
    setSelectedProfileType(null);
    setSelectedDoctor(null);
    navigate(`/sales-analyticsAll/doctor-profile-breakdown`, { replace: true });
  };

  const handleViewDoctor = (id) => {
    setSelectedDoctor(id);
    if (selectedProfileType) {
      navigate(`/sales-analyticsAll/doctor-profile-breakdown/${selectedProfileType}/${id}`, { replace: true });
    }
  };

  const handleCloseDoctorDetails = () => {
    setSelectedDoctor(null);
    if (selectedProfileType) {
      navigate(`/sales-analyticsAll/doctor-profile-breakdown/${selectedProfileType}`, { replace: true });
    }
  };

  const pageTitle = selectedDoctor
    ? "Doctor Details"
    : selectedProfileType
      ? `${selectedProfileType} - Doctor List`
      : "Doctor Profile Breakdown";

  const breadcrumbItems = [
    { text: "Sales Analytics", href: "/sales-analyticsAll" },
    { text: pageTitle },
  ];

  return (
    <div className="min-h-screen">
      <BreadCrumb linkText={breadcrumbItems} />
      <div className="rounded-t-xl bg-gradient-to-r p-6 shadow-lg shadow-slate-900/10"
        style={{ backgroundColor: theme.secondaryColor }}>
        <h2 className="flex px-6 items-center justify-center font-semibold text-xl text-black bg-opacity-40">
          {pageTitle}
        </h2>
      </div>

      <div className="p-6 bg-white shadow-md rounded-b-[10px]">
        {/* Profile Type Cards */}
        {!selectedProfileType && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(profileCounts)
              .sort(([, a], [, b]) => b - a)
              .map(([type, count]) => {
                const ProfileIcon = iconMap[type] || LucideIcons.User;
                const colors = colorMap[type] || "bg-gray-50 text-gray-600 border-gray-100";

                return (
                  <div
                    key={type}
                    onClick={() => handleProfileTypeClick(type)}
                    className="group rounded-xl border p-4 transition-all cursor-pointer border-[var(--theme-border)] bg-white hover:shadow-md hover:border-[var(--theme-primary)]/30"
                  >
                    <div className={`h-10 w-10 rounded-lg border ${colors} grid place-items-center mb-3`}>
                      <ProfileIcon size={18} />
                    </div>
                    <p className="text-sm font-semibold text-[var(--theme-text-primary)] leading-tight">
                      {type}
                    </p>
                    <p className="text-2xl font-bold text-[var(--theme-text-primary)] mt-1">
                      {count}
                    </p>
                    <p className="text-[10px] text-[var(--theme-text-secondary)] font-medium mt-0.5">
                      doctors
                    </p>
                  </div>
                );
              })}
          </div>
        )}

        {/* Back Button */}
        {selectedProfileType && !selectedDoctor && (
          <div className="mb-4">
            <button
              onClick={handleBackToBreakdown}
              className="text-sm text-[var(--theme-primary)] font-medium hover:underline"
            >
              ← Back to Doctor Profile Breakdown
            </button>
          </div>
        )}

        {/* Individual Doctor Table */}
        {selectedProfileType && !selectedDoctor && (() => {
          const dataList = allIndividualData?.data || [];
          const pagination = allIndividualData?.pagination || {};
          const totalRecords = pagination.totalCount || dataList.length || 0;
          const totalPages = pagination.totalPages || Math.ceil(totalRecords / individualLimit);
          const currentPage = pagination.currentPage || individualPage;

          return (
            <div className="mt-4">
              <ChartCard title={`${selectedProfileType} - Doctor List`} subtitle="Click view for doctor details">
                <div className="shadow overflow-x-auto rounded-t-2xl border border-gray-200">
                  <Table>
                    <TableHeader className="sticky top-0 bg-white z-10">
                      <TableRow className="bg-[var(--theme-bg-light)]">
                        <TableHead className="text-base font-semibold">Sr. No.</TableHead>
                        <TableHead className="text-base font-semibold">Sales Person</TableHead>
                        <TableHead className="text-base font-semibold">Doctor</TableHead>
                        <TableHead className="text-base font-semibold">Hospital</TableHead>
                        <TableHead className="text-base font-semibold">Profile</TableHead>
                        <TableHead className="text-base font-semibold">Department</TableHead>
                        <TableHead className="text-base font-semibold">City</TableHead>
                        <TableHead className="text-base font-semibold">District</TableHead>
                        <TableHead className="text-base font-semibold">State</TableHead>
                        <TableHead className="text-base font-semibold">Designation</TableHead>
                        <TableHead className="text-base font-semibold text-center">View</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-200">
                      {individualLoading ? (
                        <TableRow>
                          <TableCell colSpan={11} className="p-8 text-center">
                            <div className="flex justify-center items-center w-full">
                              <LoaderSpinner />
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : dataList.length > 0 ? (
                        dataList.map((item, idx) => (
                          <TableRow key={item._id || idx} className="cursor-pointer hover:bg-gray-50 transition-all">
                            <td className="p-4 text-[17px] font-normal text-[#252C58]">
                              {(currentPage - 1) * individualLimit + idx + 1}
                            </td>
                            <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                              {item.salesPersonName || "-"}
                            </td>
                            <td className="px-4 py-3 text-[15px] whitespace-nowrap font-medium text-[var(--theme-primary)] hover:underline">
                              {item.Doctor || "-"}
                            </td>
                            <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                              {item.Hospital || "-"}
                            </td>
                            <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                              <Badge variant="secondary" className="rounded-full bg-[var(--theme-bg-light)] text-[var(--theme-text-secondary)] border-[var(--theme-border)]">
                                {item.typeOfDoctorProfile || "-"}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                              {item.department || item.Speciality || "-"}
                            </td>
                            <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                              {item.City || "-"}
                            </td>
                            <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                              {item.District || "-"}
                            </td>
                            <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                              {item.State || "-"}
                            </td>
                            <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                              {item.designation || "-"}
                            </td>

                            <td className="p-4 text-center align-middle">
                              <button
                                onClick={() => handleViewDoctor(item._id)}
                                className="text-[var(--theme-primary)] hover:bg-[var(--theme-primary)]/10 rounded-full w-9 h-9 flex items-center justify-center transition-colors"
                                aria-label="View details"
                              >
                                <TiEye size={18} />
                              </button>
                            </td>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={11} className="text-center py-8 text-sm text-gray-500">
                            No individual data available for {selectedProfileType}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {!individualLoading && dataList.length > 0 && (
                  <div className="rounded-b-2xl bg-white shadow-lg border border-gray-200 overflow-hidden">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={totalRecords}
                      itemsPerPage={individualLimit}
                      onPageChange={(newPage) => setIndividualPage(newPage)}
                      onItemsPerPageChange={(newLimit) => {
                        setIndividualLimit(newLimit);
                        setIndividualPage(1);
                      }}
                    />
                  </div>
                )}
              </ChartCard>
            </div>
          );
        })()}

        {/* Doctor Detail Section */}
        {selectedDoctor && specificIndividualData?.data && (
          <div className=" p-4 rounded-xl border border-[var(--theme-border)] bg-white">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={handleCloseDoctorDetails}
                className="flex items-center gap-1.5 text-sm text-[var(--theme-primary)] font-medium hover:underline"
              >
                <LucideIcons.ArrowLeft size={16} />
                Back to Doctor List
              </button>
              <button
                onClick={handleCloseDoctorDetails}
                className="h-6 w-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <LucideIcons.X size={14} />
              </button>
            </div>

            {specificIndividualData.data && (
              <div className="space-y-4">
                <div className="rounded-xl border border-[var(--theme-border)] bg-white p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider mb-1">
                        Basic Information
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-[10px] text-gray-500 font-medium">Full Name</p>
                          <p className="text-sm font-semibold text-[var(--theme-text-primary)]">
                            {specificIndividualData.data.individual?.fullName || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 font-medium">Profile Type</p>
                          <p className="text-sm font-semibold text-[var(--theme-text-primary)]">
                            {specificIndividualData.data.individual?.typeOfDoctorProfile || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 font-medium">Designation</p>
                          <p className="text-sm font-semibold text-[var(--theme-text-primary)]">
                            {specificIndividualData.data.individual?.designation || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 font-medium">Hospital</p>
                          <p className="text-sm font-semibold text-[var(--theme-text-primary)]">
                            {specificIndividualData.data.individual?.hospitalName || "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Monthly Planning */}
                {specificIndividualData.data.monthlyPlanning && Object.keys(specificIndividualData.data.monthlyPlanning).length > 0 ? (
                  <div className="rounded-xl border border-[var(--theme-border)] bg-white p-4">
                    <p className="text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider mb-3">
                      Monthly Planning
                    </p>
                    <div className="space-y-3">
                      {Object.entries(specificIndividualData.data.monthlyPlanning).map(([month, plans]) => (
                        <div key={month} className="border border-[var(--theme-border)] rounded-lg overflow-hidden">
                          <div className="bg-gray-50 px-3 py-2 border-b border-[var(--theme-border)]">
                            <p className="text-xs font-semibold text-[var(--theme-text-primary)]">{month}</p>
                          </div>
                          <div className="p-3">
                            {Array.isArray(plans) && plans.length > 0 ? (
                              <div className="space-y-2">
                                {plans.map((plan, idx) => (
                                  <div key={idx} className="flex flex-wrap items-center gap-2 text-xs">
                                    <span className="font-medium text-[var(--theme-text-primary)]">
                                      {plan.nameOfDoctor}
                                    </span>
                                    <span className="text-gray-400">|</span>
                                    <span className="text-gray-600">{plan.selectOrganization}</span>
                                    <span className="text-gray-400">|</span>
                                    <span className="text-gray-500">
                                      {plan.createPlanningForDate ? new Date(plan.createPlanningForDate).toLocaleDateString() : "-"}
                                    </span>
                                    {plan.productToBePromoted && Array.isArray(plan.productToBePromoted) && plan.productToBePromoted.length > 0 ? (
                                      <>
                                        <span className="text-gray-400">|</span>
                                        <div className="flex flex-wrap gap-1">
                                          {plan.productToBePromoted.map((product, pIdx) => (
                                            <span
                                              key={pIdx}
                                              className="px-2 py-0.5 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] text-[10px] font-medium"
                                            >
                                              {product}
                                            </span>
                                          ))}
                                        </div>
                                      </>
                                    ) : plan.productToBePromoted && typeof plan.productToBePromoted === 'string' ? (
                                      <>
                                        <span className="text-gray-400">|</span>
                                        <span className="px-2 py-0.5 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] text-[10px] font-medium">
                                          {plan.productToBePromoted}
                                        </span>
                                      </>
                                    ) : null}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-500">No plans for this month</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-[var(--theme-border)] bg-white p-4 text-center">
                    <p className="text-xs text-gray-500">No monthly planning data available</p>
                  </div>
                )}

                {/* Hospital Wise Target */}
                {specificIndividualData.data.hospitalWiseTarget &&
                  Object.keys(specificIndividualData.data.hospitalWiseTarget).length > 0 ? (
                  <div className="rounded-xl border border-[var(--theme-border)] bg-white p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider">
                          Hospital Wise Target
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Hospital and product targets assigned to this doctor
                        </p>
                      </div>

                      <div className="h-9 w-9 rounded-lg bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] grid place-items-center">
                        <LucideIcons.Building2 size={18} />
                      </div>
                    </div>

                    <div className="space-y-4">
                      {Object.entries(
                        specificIndividualData.data.hospitalWiseTarget
                      ).map(([year, hospitals]) => (
                        <div key={year}>
                          {/* Year Header */}
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold text-[var(--theme-text-primary)]">
                              {year}
                            </span>

                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-medium">
                              {Object.keys(hospitals || {}).length} Hospital
                              {Object.keys(hospitals || {}).length !== 1 ? "s" : ""}
                            </span>
                          </div>

                          {/* Hospitals */}
                          <div className="space-y-3">
                            {Object.entries(hospitals || {}).map(
                              ([hospitalKey, hospital]) => (
                                <div
                                  key={hospitalKey}
                                  className="rounded-lg border border-[var(--theme-border)] overflow-hidden"
                                >
                                  {/* Hospital Header */}
                                  <div className="bg-gray-50 px-4 py-3 border-b border-[var(--theme-border)]">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                      <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-lg bg-white border border-[var(--theme-border)] grid place-items-center text-[var(--theme-primary)]">
                                          <LucideIcons.Building2 size={17} />
                                        </div>

                                        <div>
                                          <p className="text-sm font-semibold text-[var(--theme-text-primary)]">
                                            {hospital.organization || hospitalKey}
                                          </p>

                                          <p className="text-xs text-gray-500">
                                            {hospital.city || "-"}
                                          </p>
                                        </div>
                                      </div>

                                      <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-primary)]">
                                        {hospital.products?.length || 0} Product
                                        {hospital.products?.length !== 1 ? "s" : ""}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Products */}
                                  <div className="p-4">
                                    {Array.isArray(hospital.products) &&
                                      hospital.products.length > 0 ? (
                                      <div>
                                        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                          Target Products
                                        </p>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                          {hospital.products.map((product, productIndex) => (
                                            <div
                                              key={productIndex}
                                              className="flex items-center gap-2 rounded-lg border border-[var(--theme-border)] px-3 py-2 bg-white"
                                            >
                                              <div className="h-7 w-7 rounded-md bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] grid place-items-center flex-shrink-0">
                                                <LucideIcons.Package size={14} />
                                              </div>

                                              <span className="text-xs font-medium text-[var(--theme-text-primary)]">
                                                {product?.name || "-"}
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    ) : (
                                      <p className="text-xs text-gray-500">
                                        No target products available
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-[var(--theme-border)] bg-white p-4 text-center">
                    <p className="text-xs text-gray-500">
                      No hospital-wise target data available
                    </p>
                  </div>
                )}
              </div>
            )}
            {!specificIndividualData?.data && selectedDoctor && (
              <div className="flex justify-center items-center py-10">
                <LoaderSpinner />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorProfileBreakdown;
