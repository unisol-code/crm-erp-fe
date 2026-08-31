import React, { useMemo, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { FilterBar } from './components/analytics/FilterBar';
import { DashboardSection } from './components/sections/DashboardSection';
import { DoctorSection } from './components/sections/DoctorSection';
import { ExecutiveSection } from './components/sections/ExecutiveSection';
import { HospitalSection } from './components/sections/HospitalSection';
import { OrganizationSection } from './components/sections/OrganizationSection';
// import { OrganizationProductSection } from './components/sections/OrganizationProductSection';
import useAllSalesAnalytics from "../../../../hooks/superAdminHook/allSalesAnalytics/useAllSalesAnalytics";
import { useTheme } from "../../../../hooks/theme/useTheme";
import LoaderSpinner from "../../../../components/uiComponents/loader/LoaderSpinner.jsx";
import { 
  HOSPITALS, 
  DOCTORS, 
  ORGS, 
  EXECUTIVES,
} from './data/analyticsData';

const AllSalesAnalytics = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const {
    selectedTab,
    changeTab,
    filters,
    updateFilter,
    fetchOverviewData,
    fetchSalesPerformance,
    fetchOrganizationAnalytics,
    fetchSpecialityAnalytics,
    specialityData,
    fetchTargetAnalytics,
    targetData,
    fetchDoctorAnalytics,
    doctorData,
    organizationData,
    overviewData,
    doctorListData,
    fetchDoctorList, salesPersonData,
  fetchSalesPersonAnalytics,  organizationDashboardData,
  fetchOrganizationDashboardAnalytics,   organizationProductData,
  fetchOrganizationProductAnalytics,  organizationListData,
  fetchOrganizationListAnalytics,  salesPersonTargetData,
  fetchSalesPersonTargetAnalytics,
    resetFilters,
    kpis,
    executiveData,
    loading,
    error,allIndividualData,fetchAllIndividualData,  specificIndividualData,
  fetchSpecificIndividualData, allOrganizationsData,
  fetchAllOrganizationsData, specificOrganizationData,
  fetchSpecificOrganizationData,
  } = useAllSalesAnalytics();
  

  // State for hospital pagination
  const [hospitalPage, setHospitalPage] = useState(1);
  const [hospitalLimit, setHospitalLimit] = useState(10);
  const [hospitalSearch, setHospitalSearch] = useState("");
  const [tableLoading, setTableLoading] = useState(false);
  const [doctorTableLoading, setDoctorTableLoading] = useState(false);
  const [orgListTableLoading, setOrgListTableLoading] = useState(false);
  const [productTableLoading, setProductTableLoading] = useState(false);
  const [targetTableLoading, setTargetTableLoading] = useState(false);

  // ✅ Doctor pagination state
  const [doctorPage, setDoctorPage] = useState(1);
  const [doctorLimit, setDoctorLimit] = useState(10);
  const [doctorSearch, setDoctorSearch] = useState("");
  const [doctorSalesPerson, setDoctorSalesPerson] = useState("");

  const [productPage, setProductPage] = useState(1);
const [productPageSize, setProductPageSize] = useState(10);

const [orgListPage, setOrgListPage] = useState(1);
const [orgListPageSize, setOrgListPageSize] = useState(10);

const [targetPage, setTargetPage] = useState(1);
const [targetPageSize, setTargetPageSize] = useState(10);

  // ✅ Function to fetch doctor data with current pagination
  const loadDoctorData = useCallback(async (silent = false) => {
    try {
      await fetchDoctorAnalytics({}, silent);
      await fetchDoctorList({
        page: doctorPage,
        limit: doctorLimit,
        doctorName: doctorSearch,
        salesPersonName: doctorSalesPerson,
      }, silent);
    } catch (error) {
      console.error('Error loading doctor data:', error);
    }
  }, [fetchDoctorAnalytics, fetchDoctorList, doctorPage, doctorLimit, doctorSearch, doctorSalesPerson]);

   // ✅ Reset filters and pagination when tab changes
   useEffect(() => {
      resetFilters();
      setHospitalPage(1);
      setHospitalLimit(10);
      setHospitalSearch("");
      setDoctorPage(1);
      setDoctorLimit(10);
      setDoctorSearch("");
      setDoctorSalesPerson("");
      setProductPage(1);
      setProductPageSize(10);
      setOrgListPage(1);
      setOrgListPageSize(10);
      setTargetPage(1);
      setTargetPageSize(10);
    }, [selectedTab, resetFilters]);

   // ✅ Fetch data based on active tab only
   useEffect(() => {
     const fetchTabData = async () => {
       try {
         switch (selectedTab) {
          case 'overview':
            await fetchOverviewData();
            await fetchSalesPerformance();
            await fetchOrganizationAnalytics({
              page: hospitalPage,
              limit: hospitalLimit,
            });
            await fetchSpecialityAnalytics();
            await fetchTargetAnalytics();
            break;
          case 'doctors':
            await loadDoctorData(false);
            break;
          case 'executives':
            await fetchSalesPerformance();
            await fetchSalesPersonAnalytics();
            await fetchSalesPersonTargetAnalytics({
              page: targetPage,
              limit: targetPageSize,
            });
            break;
          case 'hospitals':
            await fetchOrganizationAnalytics({
              page: hospitalPage,
              limit: hospitalLimit,
            });
            break;
          case 'organizations':
            await fetchOrganizationAnalytics({
              page: hospitalPage,
              limit: hospitalLimit,
            });
               await fetchOrganizationDashboardAnalytics();
                await fetchOrganizationProductAnalytics({
    page: productPage,
    pageSize: productPageSize,
  });
    await fetchOrganizationListAnalytics({
    page: orgListPage,
    pageSize: orgListPageSize,
  });
            break;
          default:
            break;
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    fetchTabData();
  }, [selectedTab]); // ✅ Only trigger on tab change

  // ✅ Doctor pagination handlers
  const handleDoctorPageChange = async (page) => {
    setDoctorPage(page);
    setDoctorTableLoading(true);
    try {
      await fetchDoctorList({
        page: page,
        limit: doctorLimit,
        doctorName: doctorSearch,
        salesPersonName: doctorSalesPerson,
      }, true);
    } finally {
      setDoctorTableLoading(false);
    }
  };

  const handleDoctorLimitChange = async (limit) => {
    setDoctorLimit(limit);
    setDoctorPage(1);
    setDoctorTableLoading(true);
    try {
      await fetchDoctorList({
        page: 1,
        limit: limit,
        doctorName: doctorSearch,
        salesPersonName: doctorSalesPerson,
      }, true);
    } finally {
      setDoctorTableLoading(false);
    }
  };

  // ✅ Doctor search handler
  const handleDoctorSearch = async (searchTerm) => {
    setDoctorSearch(searchTerm);
    setDoctorPage(1);
    setDoctorTableLoading(true);
    try {
      await fetchDoctorList({
        page: 1,
        limit: doctorLimit,
        doctorName: searchTerm,
        salesPersonName: doctorSalesPerson,
      }, true);
    } finally {
      setDoctorTableLoading(false);
    }
  };

  // ✅ Doctor sales person filter handler
  const handleDoctorSalesPersonFilter = async (salesPersonName) => {
    setDoctorSalesPerson(salesPersonName);
    setDoctorPage(1);
    setDoctorTableLoading(true);
    try {
      await fetchDoctorList({
        page: 1,
        limit: doctorLimit,
        doctorName: doctorSearch,
        salesPersonName: salesPersonName,
      }, true);
    } finally {
      setDoctorTableLoading(false);
    }
  };

  // ✅ Handle hospital pagination changes
  const handleHospitalPageChange = async (page) => {
    setHospitalPage(page);
    setTableLoading(true);
    try {
      await fetchOrganizationAnalytics({
        page: page,
        limit: hospitalLimit,
      }, true);
    } finally {
      setTableLoading(false);
    }
  };

  const handleHospitalLimitChange = async (limit) => {
    setHospitalLimit(limit);
    setHospitalPage(1);
    setTableLoading(true);
    try {
      await fetchOrganizationAnalytics({
        page: 1,
        limit: limit,
      }, true);
    } finally {
      setTableLoading(false);
    }
  };

  const handleHospitalSearch = async (searchTerm) => {
    setHospitalSearch(searchTerm);
    setHospitalPage(1);
    setTableLoading(true);
    try {
      await fetchOrganizationAnalytics({
        page: 1,
        limit: hospitalLimit,
        search: searchTerm,
      }, true);
    } finally {
      setTableLoading(false);
    }
  };

const handleProductPageChange = async (page) => {
  setProductPage(page);
  setProductTableLoading(true);
  try {
    await fetchOrganizationProductAnalytics({
      page: page,
      pageSize: productPageSize,
    });
  } finally {
    setProductTableLoading(false);
  }
};

const handleProductPageSizeChange = async (pageSize) => {
  setProductPageSize(pageSize);
  setProductPage(1);
  setProductTableLoading(true);
  try {
    await fetchOrganizationProductAnalytics({
      page: 1,
      pageSize: pageSize,
    });
  } finally {
    setProductTableLoading(false);
  }
};

const handleOrgListPageChange = async (page) => {
  setOrgListPage(page);
  setOrgListTableLoading(true);
  try {
    await fetchOrganizationListAnalytics({
      page: page,
      pageSize: orgListPageSize,
    }, true);
  } finally {
    setOrgListTableLoading(false);
  }
};

const handleOrgListPageSizeChange = async (pageSize) => {
  setOrgListPageSize(pageSize);
  setOrgListPage(1);
  setOrgListTableLoading(true);
  try {
    await fetchOrganizationListAnalytics({
      page: 1,
      pageSize: pageSize,
    }, true);
  } finally {
    setOrgListTableLoading(false);
  }
};

// ✅ Navigate to organization details in HospitalTypeBreakdown
const handleViewOrganizationDetails = (orgId, type) => {
  const hospitalType = type === "Govt" ? "Govt" : "Pvt";
  navigate(`/sales-analyticsAll/hospital-type-breakdown/${hospitalType}/${orgId}`);
};


const handleTargetPageChange = async (page) => {
  setTargetPage(page);
  setTargetTableLoading(true);
  try {
    await fetchSalesPersonTargetAnalytics({
      page: page,
      limit: targetPageSize,
    });
  } finally {
    setTargetTableLoading(false);
  }
};

const handleTargetPageSizeChange = async (pageSize) => {
  setTargetPageSize(pageSize);
  setTargetPage(1);
  setTargetTableLoading(true);
  try {
    await fetchSalesPersonTargetAnalytics({
      page: 1,
      limit: pageSize,
    });
  } finally {
    setTargetTableLoading(false);
  }
};

  const safeFilters = filters || {
    month: "",
    year: "",
    state: "",
    district: "",
    city: "",
    segment: "",
    speciality: "",
    typeOfDoctorProfile: "",
    salesPerson: "",
  };

  const handleFiltersChange = async (tab) => {
    try {
      switch (tab) {
        case 'overview':
          await fetchOverviewData();
          await fetchSalesPerformance();
          await fetchOrganizationAnalytics({
            page: hospitalPage,
            limit: hospitalLimit,
          });
          await fetchSpecialityAnalytics();
          await fetchTargetAnalytics();
          break;
        case 'doctors':
          await loadDoctorData(false);
          break;
        case 'executives':
          await fetchSalesPerformance();
          await fetchSalesPersonAnalytics();
          await fetchSalesPersonTargetAnalytics({
            page: targetPage,
            limit: targetPageSize,
          });
          break;
        case 'hospitals':
          await fetchOrganizationAnalytics({
            page: hospitalPage,
            limit: hospitalLimit,
          });
          break;
        case 'organizations':
          await fetchOrganizationAnalytics({
            page: hospitalPage,
            limit: hospitalLimit,
          });
          await fetchOrganizationDashboardAnalytics();
          await fetchOrganizationProductAnalytics({
            page: productPage,
            pageSize: productPageSize,
          });
          await fetchOrganizationListAnalytics({
            page: orgListPage,
            pageSize: orgListPageSize,
          });
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const filteredData = useMemo(() => {
    const filteredHospitals = HOSPITALS.filter(h => {
      if (safeFilters.state && h.state !== safeFilters.state) return false;
      if (safeFilters.district && h.district !== safeFilters.district) return false;
      if (safeFilters.city && h.city !== safeFilters.city) return false;
      return true;
    });

    const filteredDoctors = DOCTORS.filter(d => {
      if (safeFilters.state && d.state !== safeFilters.state) return false;
      if (safeFilters.city && d.city !== safeFilters.city) return false;
      if (safeFilters.speciality && d.speciality !== safeFilters.speciality) return false;
      if (safeFilters.segment && d.segment !== safeFilters.segment) return false;
      if (safeFilters.salesPerson && d.salesPerson !== safeFilters.salesPerson) return false;
      if (safeFilters.typeOfDoctorProfile && d.profile !== safeFilters.typeOfDoctorProfile) return false;
      return true;
    });

    const filteredOrgs = ORGS.filter(o => {
      if (safeFilters.state && o.state !== safeFilters.state) return false;
      if (safeFilters.district && o.district !== safeFilters.district) return false;
      if (safeFilters.city && o.city !== safeFilters.city) return false;
      return true;
    });

    return {
      hospitals: filteredHospitals,
      doctors: filteredDoctors,
      orgs: filteredOrgs
    };
  }, [safeFilters]);

  const executives = executiveData && executiveData.length > 0 ? executiveData : [];

  const tabs = [
    { 
      id: "overview", 
      label: "Overview", 
      icon: LucideIcons.LayoutDashboard,
      component: <DashboardSection 
        hospitals={filteredData.hospitals} 
        filters={filters} 
        kpis={kpis} 
        executives={executives} 
        organizationData={organizationData}
        specialityData={specialityData} 
        targetData={targetData} 
        loading={loading}
        tableLoading={tableLoading}
        onPageChange={handleHospitalPageChange}
        onItemsPerPageChange={handleHospitalLimitChange}
        onSearch={handleHospitalSearch}
        overviewData={overviewData}
        allIndividualData={allIndividualData}
        fetchAllIndividualData={fetchAllIndividualData}
        specificIndividualData={specificIndividualData}
        fetchSpecificIndividualData={fetchSpecificIndividualData}
        allOrganizationsData={allOrganizationsData}
        fetchAllOrganizationsData={fetchAllOrganizationsData}
        specificOrganizationData={specificOrganizationData}
        fetchSpecificOrganizationData={fetchSpecificOrganizationData}
      />
    },
    { 
      id: "doctors", 
      label: "Doctors", 
      icon: LucideIcons.Stethoscope,
      component: <DoctorSection 
        doctors={filteredData.doctors} 
        filters={filters}
        doctorData={doctorData}
        doctorListData={doctorListData}
        loading={loading}
        tableLoading={doctorTableLoading}
        onPageChange={handleDoctorPageChange}
        onItemsPerPageChange={handleDoctorLimitChange}
        onSearch={handleDoctorSearch}
        onSalesPersonFilter={handleDoctorSalesPersonFilter}
      />
    },
    { 
      id: "executives", 
      label: "Sales Executives", 
      icon: LucideIcons.Users,
      component: <ExecutiveSection
  executives={executives}
  salesPersonData={salesPersonData}
  salesPersonTargetData={salesPersonTargetData}
  filters={filters}
  loading={loading}
  tableLoading={targetTableLoading}
  onTargetPageChange={handleTargetPageChange}
  onTargetItemsPerPageChange={handleTargetPageSizeChange}
/>
    },
    // { 
    //   id: "hospitals", 
    //   label: "Hospitals", 
    //   icon: LucideIcons.Building2,
    //   component: <HospitalSection hospitals={filteredData.hospitals} filters={filters} />
    // },
    { 
      id: "organizations", 
      label: "Organizations", 
      icon: LucideIcons.Building,
        component: <OrganizationSection
  orgs={filteredData.orgs}
  organizationDashboardData={organizationDashboardData}
  organizationProductData={organizationProductData}
  organizationListData={organizationListData}
  filters={filters}
  loading={loading}
  tableLoading={orgListTableLoading}
  productTableLoading={productTableLoading}
  onProductPageChange={handleProductPageChange}
  onProductItemsPerPageChange={handleProductPageSizeChange}
  onOrganizationListPageChange={handleOrgListPageChange}
  onOrganizationListItemsPerPageChange={handleOrgListPageSizeChange}
  onViewOrganization={handleViewOrganizationDetails}
/>
    },
  ];

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.backgroundColor }}>
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-[var(--theme-border)] max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-[var(--theme-text-primary)] mb-2">Error Loading Data</h3>
          <p className="text-[var(--theme-text-secondary)] mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 rounded-lg text-white transition-colors"
            style={{ backgroundColor: theme.primaryColor }}
            onMouseEnter={(e) => e.target.style.backgroundColor = theme.accentColor}
            onMouseLeave={(e) => e.target.style.backgroundColor = theme.primaryColor}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        '--theme-primary': theme.primaryColor,
        '--theme-secondary': theme.secondaryColor,
        '--theme-bg-sidebar': theme.bgSidebar,
        '--theme-background': theme.backgroundColor,
        '--theme-highlight': theme.highlightColor,
        '--theme-accent': theme.accentColor,
        '--theme-primary-light': theme.secondaryColor,
        '--theme-primary-dark': theme.accentColor,
        '--theme-primary-bg': theme.backgroundColor,
        '--theme-primary-hover': theme.highlightColor,
        '--theme-sidebar-bg': theme.bgSidebar,
        '--theme-text-primary': theme.accentColor,
        '--theme-text-secondary': theme.accentColor,
        '--theme-text-muted': theme.accentColor,
        '--theme-border': theme.highlightColor,
        '--theme-bg-light': theme.backgroundColor,
        '--theme-bg-lighter': theme.backgroundColor,
        '--theme-bg-hover': theme.secondaryColor,
        '--theme-card-bg': '#FFFFFF',
      }}
      className="min-h-screen bg-[var(--theme-bg-lighter)]"
    >
      
        <div className="mb-4">
          <h1 className="text-xl md:text-2xl font-bold text-[var(--theme-text-primary)] tracking-tight">
            Employee Analytics
          </h1>
          <p className="text-sm text-[var(--theme-text-secondary)] mt-1 font-medium">
            Comprehensive workforce insights & drill-down reports
          </p>
        </div>

        <div className="mb-4">
          <FilterBar 
            selectedTab={selectedTab}
            loading={loading}
            filters={filters}
            updateFilter={updateFilter}
            resetFilters={resetFilters}
            onFiltersChange={handleFiltersChange}
          />
        </div>

        <div className="flex flex-wrap  justify-between gap-1 border-b border-[var(--theme-border)] mb-3 overflow-x-auto bg-white/60 backdrop-blur-sm rounded-xl px-2 py-1">
          {tabs.map((tab) => {
            const isActive = selectedTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => changeTab(tab.id)}
                className={`
                  flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap
                  rounded-lg
                  ${isActive 
                    ? 'bg-[var(--theme-primary)] text-white shadow-md shadow-[var(--theme-primary)]/20' 
                    : 'text-[var(--theme-text-muted)] hover:bg-[var(--theme-bg-hover)] hover:text-[var(--theme-primary)]'
                  }
                `}
              >
                <Icon size={18} />
                {tab.label}
                {isActive && (
                  <span className="ml-1 px-2 py-0.5 text-xs bg-white/20 text-white rounded-full">
                    Active
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-[var(--theme-border)] shadow-xl shadow-[var(--theme-primary)]/5 p-6 min-h-[500px]">
          {tabs.find(tab => tab.id === selectedTab)?.component}
        </div>
      </div>
   
  );
}

export default AllSalesAnalytics;