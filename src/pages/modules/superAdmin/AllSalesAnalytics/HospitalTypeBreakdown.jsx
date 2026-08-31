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
import { ChartCard } from "../AllSalesAnalytics/components/analytics";
import Pagination from "../../../../components/uiComponents/pagination/Pagination.jsx";
import { TiEye } from "react-icons/ti";

const iconMap = {
  govtHospitalCount: LucideIcons.Hospital,
  pvtHospitalCount: LucideIcons.Building2,
};

const colorMap = {
  govtHospitalCount: "bg-blue-50 text-blue-600 border-blue-100",
  pvtHospitalCount: "bg-purple-50 text-purple-600 border-purple-100",
};

const labelMap = {
  govtHospitalCount: "Govt Hospital",
  pvtHospitalCount: "Private Hospital",
};

const orgTypeValueMap = {
  govtHospitalCount: "Govt",
  pvtHospitalCount: "Pvt",
};

const HospitalTypeBreakdown = () => {
  const { hospitalType, orgId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const {
    overviewData,
    allOrganizationsData,
    specificOrganizationData,
    fetchAllOrganizationsData,
    fetchSpecificOrganizationData,
    fetchOverviewData,
    loading,
  } = useAllSalesAnalytics();

  const [selectedHospitalType, setSelectedHospitalType] = useState(hospitalType || null);
  const [orgLoading, setOrgLoading] = useState(false);
  const [orgPage, setOrgPage] = useState(1);
  const [orgLimit, setOrgLimit] = useState(10);
  const [selectedOrganization, setSelectedOrganization] = useState(orgId || null);

  useEffect(() => {
    if (hospitalType) {
      setSelectedHospitalType(hospitalType);
    }
  }, [hospitalType]);

  useEffect(() => {
    if (orgId) {
      setSelectedOrganization(orgId);
    }
  }, [orgId]);

  useEffect(() => {
    fetchOverviewData();
  }, [fetchOverviewData]);

  const hospitalTypeCounts = useMemo(() => {
    if (overviewData?.data?.typeOfHospitalWiseCount) {
      return overviewData.data.typeOfHospitalWiseCount;
    }
    return {};
  }, [overviewData]);

  useEffect(() => {
    if (selectedHospitalType && fetchAllOrganizationsData) {
      setOrgLoading(true);
      fetchAllOrganizationsData({
        typeOfOrgOrHospital: selectedHospitalType,
        page: orgPage,
        limit: orgLimit,
      }).finally(() => setOrgLoading(false));
    }
  }, [selectedHospitalType, fetchAllOrganizationsData, orgPage, orgLimit]);

  useEffect(() => {
    if (selectedOrganization && fetchSpecificOrganizationData) {
      fetchSpecificOrganizationData(selectedOrganization);
    }
  }, [selectedOrganization, fetchSpecificOrganizationData]);

  const handleHospitalTypeClick = (type) => {
    setSelectedHospitalType(type);
    setOrgPage(1);
    setSelectedOrganization(null);
    navigate(`/sales-analyticsAll/hospital-type-breakdown/${type}`, { replace: true });
  };

  const handleBackToBreakdown = () => {
    setSelectedHospitalType(null);
    setSelectedOrganization(null);
    navigate(`/sales-analyticsAll/hospital-type-breakdown`, { replace: true });
  };

  const handleViewOrganization = (id) => {
    setSelectedOrganization(id);
    if (selectedHospitalType) {
      navigate(`/sales-analyticsAll/hospital-type-breakdown/${selectedHospitalType}/${id}`, { replace: true });
    }
  };

  const handleCloseOrganizationDetails = () => {
    setSelectedOrganization(null);
    if (selectedHospitalType) {
      navigate(`/sales-analyticsAll/hospital-type-breakdown/${selectedHospitalType}`, { replace: true });
    }
  };

  const pageTitle = selectedOrganization
    ? "Organization Details"
    : selectedHospitalType
      ? `${labelMap[selectedHospitalType] || selectedHospitalType} - Organizations List`
      : "Hospital Type Breakdown";

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
        {/* Hospital Type Cards */}
        {!selectedHospitalType && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(hospitalTypeCounts).map(([type, count]) => {
              const HospitalIcon = iconMap[type] || LucideIcons.Hospital;
              const colors = colorMap[type] || "bg-gray-50 text-gray-600 border-gray-100";
              const label = labelMap[type] || type;
              const orgTypeValue = orgTypeValueMap[type] || type;
              const isSelected = selectedHospitalType === orgTypeValue;

              return (
                <div
                  key={type}
                  onClick={() => handleHospitalTypeClick(orgTypeValue)}
                  className={`group rounded-xl border p-4 transition-all cursor-pointer ${
                    isSelected
                      ? "border-[var(--theme-primary)] bg-[var(--theme-primary)]/5 shadow-md"
                      : "border-[var(--theme-border)] bg-white hover:shadow-md hover:border-[var(--theme-primary)]/30"
                  }`}
                >
                  <div className={`h-10 w-10 rounded-lg border ${colors} grid place-items-center mb-3`}>
                    <HospitalIcon size={18} />
                  </div>
                  <p className="text-sm font-semibold text-[var(--theme-text-primary)] leading-tight">
                    {label}
                  </p>
                  <p className="text-2xl font-bold text-[var(--theme-text-primary)] mt-1">
                    {count}
                  </p>
                  <p className="text-[10px] text-[var(--theme-text-secondary)] font-medium mt-0.5">
                    hospitals
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Back Button */}
        {selectedHospitalType && !selectedOrganization && (
          <div className="mb-4">
            <button
              onClick={handleBackToBreakdown}
              className="text-sm text-[var(--theme-primary)] font-medium hover:underline"
            >
              ← Back to Hospital Type Breakdown
            </button>
          </div>
        )}

        {/* Organization List */}
        {selectedHospitalType && !selectedOrganization && (() => {
          const orgDataList = allOrganizationsData?.data || [];
          const pagination = allOrganizationsData?.pagination || {};
          const totalRecords = pagination.totalCount || orgDataList.length || 0;
          const totalPages = pagination.totalPages || Math.ceil(totalRecords / orgLimit);
          const currentPage = pagination.currentPage || orgPage;

          return (
            <div className="mt-4">
              <ChartCard title={`${labelMap[selectedHospitalType] || selectedHospitalType} - Organizations List`} subtitle="Click view for organization details">
                <div className="shadow overflow-x-auto rounded-t-2xl border border-gray-200">
                  <Table>
                    <TableHeader className="sticky top-0 bg-white z-10">
                      <TableRow className="bg-[var(--theme-bg-light)]">
                        <TableHead className="text-base font-semibold">Sr. No.</TableHead>
                        <TableHead className="text-base font-semibold">Organization</TableHead>
                        <TableHead className="text-base font-semibold">Type</TableHead>
                        <TableHead className="text-base font-semibold">Category</TableHead>
                        <TableHead className="text-base font-semibold">City</TableHead>
                        <TableHead className="text-base font-semibold">District</TableHead>
                        <TableHead className="text-base font-semibold">State</TableHead>
                        <TableHead className="text-base font-semibold">View</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-200">
                      {orgLoading ? (
                        <TableRow>
                          <TableCell colSpan={8} className="p-8 text-center">
                            <div className="flex justify-center items-center w-full">
                              <LoaderSpinner />
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : orgDataList.length > 0 ? (
                        orgDataList.map((item, idx) => (
                          <TableRow key={item._id || idx} className="cursor-pointer hover:bg-gray-50 transition-all">
                            <td className="p-4 text-[17px] font-normal text-[#252C58]">
                              {(currentPage - 1) * orgLimit + idx + 1}
                            </td>
                            <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <span className="font-medium text-[var(--theme-primary)]">
                                  {item.organizationName || item.hospitalName || "-"}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                              <Badge variant="secondary" className="rounded-full bg-[var(--theme-bg-light)] text-[var(--theme-text-secondary)] border-[var(--theme-border)]">
                                {item.typeOfOrgOrHospital || "N/A"}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                              <Badge variant="secondary" className="rounded-full bg-[var(--theme-bg-light)] text-[var(--theme-text-secondary)] border-[var(--theme-border)]">
                                {item.typeOfHospital || "N/A"}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                              <span className="flex items-center gap-1">
                                <LucideIcons.MapPin size={12} className="text-[var(--theme-primary)]" />
                                {item.city || "-"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                              {item.district || "-"}
                            </td>
                            <td className="px-4 py-3 text-[15px] whitespace-nowrap">
                              {item.state || "-"}
                            </td>
                            <td className="p-4 text-center align-middle">
                              <button
                                onClick={() => handleViewOrganization(item._id)}
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
                          <TableCell colSpan={8} className="text-center py-8 text-sm text-gray-500">
                            No organizations found for {labelMap[selectedHospitalType] || selectedHospitalType}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                {!orgLoading && orgDataList.length > 0 && (
                  <div className="rounded-b-2xl bg-white shadow-lg border border-gray-200 overflow-hidden">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={totalRecords}
                      itemsPerPage={orgLimit}
                      onPageChange={(newPage) => setOrgPage(newPage)}
                      onItemsPerPageChange={(newLimit) => {
                        setOrgLimit(newLimit);
                        setOrgPage(1);
                      }}
                    />
                  </div>
                )}
              </ChartCard>
            </div>
          );
        })()}

        {/* Organization Detail Section */}
        {selectedOrganization && specificOrganizationData?.data && (
          <div className="">
            {/* Back Button & Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handleCloseOrganizationDetails}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-[var(--theme-border)] text-[var(--theme-primary)] font-medium hover:bg-[var(--theme-primary)]/5 transition-colors"
              >
                <LucideIcons.ArrowLeft size={16} />
                Back to List
              </button>
            </div>

            {specificOrganizationData.data && (() => {
              const org = specificOrganizationData.data.organization || {};
              const monthlyPlanning = specificOrganizationData.data.monthlyPlanning || {};
              const individuals = specificOrganizationData.data.individuals || [];
              const hospitalWiseTarget = specificOrganizationData.data.hospitalWiseTarget || {};

              return (
                <div className="space-y-5">
                  {/* Organization Hero Card */}
                  <div className="rounded-xl border border-[var(--theme-border)] bg-white overflow-hidden">
                    <div className="bg-[var(--theme-primary)]/5 px-5 py-4 border-b border-[var(--theme-border)]">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-xl bg-[var(--theme-primary)] text-white grid place-items-center font-bold text-2xl flex-shrink-0">
                          {(org.hospitalName || org.organizationName || "?").charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className="text-xl font-bold text-[var(--theme-text-primary)]">
                            {org.hospitalName || org.organizationName || "-"}
                          </h2>
                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[var(--theme-primary)]/10 text-[var(--theme-primary)]">
                              {org.typeOfOrgOrHospital || "N/A"}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[var(--theme-accent)]/10 text-[var(--theme-accent)]">
                              {org.typeOfHospital || "N/A"}
                            </span>
                            {org.ifGovt && (
                              <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-gray-100 text-gray-700">
                                {org.ifGovt}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {org.specialities && org.specialities.length > 0 && org.specialities[0].name && (
                          <div className="col-span-2 sm:col-span-4">
                            <p className="text-[10px] text-[var(--theme-text-secondary)] font-semibold uppercase tracking-wider">Specialities</p>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {org.specialities.filter(s => s.name).map((s, i) => (
                                <span key={i} className="px-2 py-0.5 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] text-xs font-medium">
                                  {s.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="rounded-lg bg-[var(--theme-primary)]/5 p-3 text-center">
                          <LucideIcons.Bed size={18} className="mx-auto text-[var(--theme-primary)] mb-1" />
                          <p className="text-lg font-bold text-[var(--theme-text-primary)]">{org.totalBeds ?? 0}</p>
                          <p className="text-[10px] text-[var(--theme-text-secondary)]">Beds</p>
                        </div>
                        <div className="rounded-lg bg-red-50 p-3 text-center">
                          <LucideIcons.HeartPulse size={18} className="mx-auto text-red-500 mb-1" />
                          <p className="text-lg font-bold text-[var(--theme-text-primary)]">{org.totalICUBeds ?? 0}</p>
                          <p className="text-[10px] text-[var(--theme-text-secondary)]">ICU</p>
                        </div>
                        <div className="rounded-lg bg-blue-50 p-3 text-center">
                          <LucideIcons.Activity size={18} className="mx-auto text-blue-500 mb-1" />
                          <p className="text-lg font-bold text-[var(--theme-text-primary)]">{org.totalOT ?? 0}</p>
                          <p className="text-[10px] text-[var(--theme-text-secondary)]">OTs</p>
                        </div>
                        <div className="rounded-lg bg-green-50 p-3 text-center">
                          <LucideIcons.Stethoscope size={18} className="mx-auto text-green-500 mb-1" />
                          <p className="text-lg font-bold text-[var(--theme-text-primary)]">{individuals.length}</p>
                          <p className="text-[10px] text-[var(--theme-text-secondary)]">Doctors</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Individuals */}
                  <div className="rounded-xl border border-[var(--theme-border)] bg-white p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] grid place-items-center">
                          <LucideIcons.Users size={16} />
                        </div>
                        <p className="font-semibold text-[var(--theme-text-primary)]">Associated Doctors</p>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] text-xs font-bold">
                        {individuals.length}
                      </span>
                    </div>
                    {individuals.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {individuals.map((doctor, idx) => (
                          <div key={doctor._id || idx} className="rounded-lg border border-[var(--theme-border)] p-3 hover:border-[var(--theme-primary)]/30 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="h-11 w-11 rounded-full bg-[var(--theme-primary)] text-white grid place-items-center font-bold flex-shrink-0">
                                {doctor.fullName?.charAt(0) || "?"}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-[var(--theme-text-primary)] truncate">{doctor.fullName || "-"}</p>
                                <p className="text-xs text-[var(--theme-text-secondary)]">{doctor.typeOfDoctorProfile || "-"}</p>
                              </div>
                            </div>
                            <div className="mt-3 space-y-1.5 pl-14">
                              {doctor.speciality && (
                                <div className="flex items-center gap-2">
                                  <LucideIcons.Stethoscope size={12} className="text-[var(--theme-primary)] flex-shrink-0" />
                                  <span className="text-xs text-[var(--theme-text-secondary)] truncate">{doctor.speciality}</span>
                                </div>
                              )}
                              {doctor.designation && (
                                <div className="flex items-center gap-2">
                                  <LucideIcons.Briefcase size={12} className="text-[var(--theme-primary)] flex-shrink-0" />
                                  <span className="text-xs text-[var(--theme-text-secondary)] truncate">{doctor.designation}</span>
                                </div>
                              )}
                              {doctor.salesPersonName && (
                                <div className="flex items-center gap-2">
                                  <LucideIcons.User size={12} className="text-[var(--theme-primary)] flex-shrink-0" />
                                  <span className="text-xs text-[var(--theme-text-secondary)] truncate">{doctor.salesPersonName}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-[var(--theme-text-secondary)] text-center py-6">No individuals data available</p>
                    )}
                  </div>

                  {/* Hospital Wise Target */}
                  {Object.keys(hospitalWiseTarget).length > 0 ? (
                    <div className="rounded-xl border border-[var(--theme-border)] bg-white p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] grid place-items-center">
                            <LucideIcons.Target size={16} />
                          </div>
                          <div>
                            <p className="font-semibold text-[var(--theme-text-primary)]">Hospital Wise Target</p>
                            <p className="text-xs text-[var(--theme-text-secondary)]">Organization and product targets</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {Object.entries(hospitalWiseTarget).map(([year, orgs]) => (
                          <div key={year}>
                            <div className="flex items-center gap-2 mb-3">
                              <span className="px-3 py-1 rounded-lg bg-[var(--theme-primary)] text-white text-sm font-bold">{year}</span>
                              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                                {orgs?.length || 0} Organization{orgs?.length !== 1 ? "s" : ""}
                              </span>
                            </div>
                            <div className="space-y-3">
                              {(orgs || []).map((targetOrg, orgIdx) => (
                                <div key={orgIdx} className="rounded-xl border border-[var(--theme-border)] overflow-hidden">
                                  <div className="bg-[var(--theme-primary)]/5 px-4 py-3 border-b border-[var(--theme-border)]">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                      <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-white border border-[var(--theme-border)] grid place-items-center text-[var(--theme-primary)]">
                                          <LucideIcons.Building2 size={18} />
                                        </div>
                                        <div>
                                          <p className="font-semibold text-[var(--theme-text-primary)]">
                                            {targetOrg.organization || "-"}
                                          </p>
                                          <p className="text-xs text-[var(--theme-text-secondary)]">{targetOrg.city || "-"}</p>
                                        </div>
                                      </div>
                                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-primary)]">
                                        {targetOrg.products?.length || 0} Product{targetOrg.products?.length !== 1 ? "s" : ""}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="p-4">
                                    {Array.isArray(targetOrg.products) && targetOrg.products.length > 0 ? (
                                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                        {targetOrg.products.map((product, productIdx) => (
                                          <div key={productIdx} className="flex items-center justify-between rounded-lg border border-[var(--theme-border)] px-3 py-2.5 bg-white hover:border-[var(--theme-primary)]/30 transition-colors">
                                            <div className="flex items-center gap-2 min-w-0">
                                              <div className="h-8 w-8 rounded-lg bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] grid place-items-center flex-shrink-0">
                                                <LucideIcons.Package size={14} />
                                              </div>
                                              <span className="text-sm font-medium text-[var(--theme-text-primary)] truncate">
                                                {product?.name || "-"}
                                              </span>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                              <span className="text-xs text-[var(--theme-text-secondary)]">×{product?.enteredQuantity ?? 0}</span>
                                              <span className="text-sm font-bold text-green-600">₹{product?.price?.toLocaleString('en-IN')}</span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-sm text-[var(--theme-text-secondary)]">No target products available</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-[var(--theme-border)] bg-white p-6 text-center">
                      <LucideIcons.Target size={32} className="mx-auto text-gray-300 mb-2" />
                      <p className="text-sm text-[var(--theme-text-secondary)]">No hospital-wise target data available</p>
                    </div>
                  )}

                  {/* Monthly Planning */}
                  {Object.keys(monthlyPlanning).length > 0 ? (
                    <div className="rounded-xl border border-[var(--theme-border)] bg-white p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-8 w-8 rounded-lg bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] grid place-items-center">
                          <LucideIcons.Calendar size={16} />
                        </div>
                        <p className="font-semibold text-[var(--theme-text-primary)]">Monthly Planning</p>
                      </div>
                      <div className="space-y-3">
                        {Object.entries(monthlyPlanning).map(([month, plans]) => (
                          <div key={month} className="rounded-xl border border-[var(--theme-border)] overflow-hidden">
                            <div className="bg-[var(--theme-primary)]/5 px-4 py-2.5 border-b border-[var(--theme-border)]">
                              <div className="flex items-center gap-2">
                                <LucideIcons.CalendarCheck size={14} className="text-[var(--theme-primary)]" />
                                <p className="text-sm font-semibold text-[var(--theme-text-primary)]">{month}</p>
                                <span className="px-2 py-0.5 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] text-[10px] font-bold">
                                  {plans?.length || 0}
                                </span>
                              </div>
                            </div>
                            <div className="p-3">
                              {Array.isArray(plans) && plans.length > 0 ? (
                                <div className="space-y-2">
                                  {plans.map((plan, idx) => (
                                    <div key={idx} className="rounded-lg bg-gray-50 p-3">
                                      <div className="flex flex-wrap items-center gap-2 text-sm">
                                        <span className="font-semibold text-[var(--theme-text-primary)]">
                                          {plan.nameOfDoctor}
                                        </span>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-[var(--theme-text-secondary)]">{plan.selectOrganization}</span>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-xs text-[var(--theme-text-secondary)]">
                                          {plan.createPlanningForDate ? new Date(plan.createPlanningForDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : "-"}
                                        </span>
                                      </div>
                                      {plan.productToBePromoted && (
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                          {(Array.isArray(plan.productToBePromoted) ? plan.productToBePromoted : [plan.productToBePromoted]).filter(Boolean).map((product, pIdx) => (
                                            <span
                                              key={pIdx}
                                              className="px-2.5 py-0.5 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] text-xs font-medium"
                                            >
                                              {product}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                      {plan.wantToBuy && (
                                        <div className={`mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                                          plan.wantToBuy.status === 'yes' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                        }`}>
                                          <LucideIcons.ShoppingCart size={12} />
                                          Want to Buy: {plan.wantToBuy.status}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-[var(--theme-text-secondary)]">No plans for this month</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-[var(--theme-border)] bg-white p-6 text-center">
                      <LucideIcons.Calendar size={32} className="mx-auto text-gray-300 mb-2" />
                      <p className="text-sm text-[var(--theme-text-secondary)]">No monthly planning data available</p>
                    </div>
                  )}
                </div>
              );
            })()}

            {!specificOrganizationData?.data && selectedOrganization && (
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

export default HospitalTypeBreakdown;
