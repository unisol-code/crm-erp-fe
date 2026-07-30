// index.jsx

import React, { useMemo, useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";
import { FilterBar } from './components/analytics/FilterBar';
import { DashboardSection } from './components/sections/DashboardSection';
import { DoctorSection } from './components/sections/DoctorSection';
import { ExecutiveSection } from './components/sections/ExecutiveSection';
import { HospitalSection } from './components/sections/HospitalSection';
import { OrganizationSection } from './components/sections/OrganizationSection';
import useAllSalesAnalytics from "../../../../hooks/superAdminHook/allSalesAnalytics/useAllSalesAnalytics";
import { 
  HOSPITALS, 
  DOCTORS, 
  ORGS, 
  EXECUTIVES,
} from './data/analyticsData';

function AllSalesAnalytics() {
  const {
    selectedTab,
    changeTab,
    filters,
    fetchOverviewData,
    fetchSalesPerformance,
    fetchOrganizationAnalytics,
     fetchSpecialityAnalytics,specialityData, 
      fetchTargetAnalytics, targetData,
      fetchDoctorAnalytics, doctorData,
    organizationData,
    overviewData,
    resetFilters,
    kpis,
    executiveData,
    loading,
    error,
  } = useAllSalesAnalytics();

  // State for pagination
  const [hospitalPage, setHospitalPage] = useState(1);
  const [hospitalLimit, setHospitalLimit] = useState(10);
  const [hospitalSearch, setHospitalSearch] = useState("");

  // ✅ Fetch data on mount - ONLY ONCE
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('📊 Fetching Overview Data...');
        await fetchOverviewData();
        
        console.log('📈 Fetching Sales Performance...');
        await fetchSalesPerformance();
  
        console.log('🏥 Fetching Organization Analytics...');
        await fetchOrganizationAnalytics({
          page: hospitalPage,
          limit: hospitalLimit
        });
               console.log('🔬 Fetching Speciality Analytics...');
        await fetchSpecialityAnalytics(); // ✅ Add this

        console.log("TARGET ANALYTICS");
        await fetchTargetAnalytics();
        console.log('👨‍⚕️ Fetching Doctor Analytics...');
        await fetchDoctorAnalytics();
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadData();
  }, []); // ✅ Empty dependency array - runs once

  // ✅ Handle pagination changes - ONLY when user interacts
  const handleHospitalPageChange = (page) => {
    setHospitalPage(page);
    fetchOrganizationAnalytics({
      page: page,
      limit: hospitalLimit,
    });
  };

  const handleHospitalLimitChange = (limit) => {
    setHospitalLimit(limit);
    setHospitalPage(1);
    fetchOrganizationAnalytics({
      page: 1,
      limit: limit,
    });
  };

  const handleHospitalSearch = (searchTerm) => {
    setHospitalSearch(searchTerm);
    setHospitalPage(1);
    // If your API supports search parameter
    fetchOrganizationAnalytics({
      page: 1,
      limit: hospitalLimit,
      search: searchTerm,
    });
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

  // Prepare executives data - already comes from the hook
  // const executives = executiveData && executiveData.length > 0 ? executiveData : EXECUTIVES;
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
        onPageChange={handleHospitalPageChange}
        onItemsPerPageChange={handleHospitalLimitChange}
        onSearch={handleHospitalSearch}
      />
    },
    { 
      id: "doctors", 
      label: "Doctors", 
      icon: LucideIcons.Stethoscope,
      component: <DoctorSection doctors={filteredData.doctors} filters={filters}
        doctorData={doctorData} 
        loading={loading}
       />
    },
    { 
      id: "executives", 
      label: "Sales Executives", 
      icon: LucideIcons.Users,
      component: <ExecutiveSection executives={executives} filters={filters} />
    },
    { 
      id: "hospitals", 
      label: "Hospitals", 
      icon: LucideIcons.Building2,
      component: <HospitalSection hospitals={filteredData.hospitals} filters={filters} />
    },
    { 
      id: "organizations", 
      label: "Organizations", 
      icon: LucideIcons.Building,
      component: <OrganizationSection orgs={filteredData.orgs} filters={filters} />
    },
  ];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF5F0] via-[#FDF0EA] to-[#FBE9E7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C6693C] mx-auto"></div>
          <p className="mt-4 text-[#8B5A3C] font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF5F0] via-[#FDF0EA] to-[#FBE9E7] flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-[#E8C9B8] max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-[#5A2D1A] mb-2">Error Loading Data</h3>
          <p className="text-[#8B5A3C] mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#C6693C] text-white rounded-lg hover:bg-[#A54A29] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F0] via-[#FDF0EA] to-[#FBE9E7]">
      <div className="px-4 md:px-6 lg:px-8 pt-6 pb-10">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-[#5A2D1A] tracking-tight">
            Employee Analytics
          </h1>
          <p className="text-sm text-[#8B5A3C] mt-1 font-medium">
            Comprehensive workforce insights & drill-down reports
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mb-4">
          <FilterBar />
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1 border-b border-[#E8C9B8] mb-6 overflow-x-auto bg-white/60 backdrop-blur-sm rounded-t-xl px-2 py-1">
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
                    ? 'bg-[#C6693C] text-white shadow-md shadow-[#C6693C]/20' 
                    : 'text-[#6B4226] hover:bg-[#F5E0D6] hover:text-[#C6693C]'
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

        {/* Tab Content */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-[#E8C9B8] shadow-xl shadow-[#C6693C]/5 p-6 min-h-[500px]">
          {tabs.find(tab => tab.id === selectedTab)?.component}
        </div>
      </div>
    </div>
  );
}

export default AllSalesAnalytics;