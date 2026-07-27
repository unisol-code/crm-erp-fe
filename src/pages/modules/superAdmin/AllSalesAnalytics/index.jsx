// index.jsx

import React, { useState, useMemo } from "react";
import * as LucideIcons from "lucide-react";
import { FilterBar } from './components/analytics/FilterBar';
import { DashboardSection } from './components/sections/DashboardSection';
import { DoctorSection } from './components/sections/DoctorSection';
import { ExecutiveSection } from './components/sections/ExecutiveSection';
import { HospitalSection } from './components/sections/HospitalSection';
import { OrganizationSection } from './components/sections/OrganizationSection';
import { 
  HOSPITALS, 
  DOCTORS, 
  ORGS, 
  EXECUTIVES,
} from './data/analyticsData';

function AllSalesAnalytics() {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Updated filters to match API parameters
  const [filters, setFilters] = useState({
    month: "",
    year: "",
    state: "",
    district: "",
    city: "",
    segment: "",
    speciality: "",
    typeOfDoctorProfile: "",
    salesPerson: ""
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplyFilters = () => {
    console.log("Applying filters:", filters);
    // This will trigger the data refetch
    // You can call your API here
  };

  const resetFilters = () => {
    setFilters({
      month: "",
      year: "",
      state: "",
      district: "",
      city: "",
      segment: "",
      speciality: "",
      typeOfDoctorProfile: "",
      salesPerson: ""
    });
  };

  const filteredData = useMemo(() => {
    const filteredHospitals = HOSPITALS.filter(h => {
      if (filters.state && h.state !== filters.state) return false;
      if (filters.district && h.district !== filters.district) return false;
      if (filters.city && h.city !== filters.city) return false;
      return true;
    });

    const filteredDoctors = DOCTORS.filter(d => {
      if (filters.state && d.state !== filters.state) return false;
      if (filters.city && d.city !== filters.city) return false;
      if (filters.speciality && d.speciality !== filters.speciality) return false;
      if (filters.segment && d.segment !== filters.segment) return false;
      if (filters.salesPerson && d.salesPerson !== filters.salesPerson) return false;
      if (filters.typeOfDoctorProfile && d.profile !== filters.typeOfDoctorProfile) return false;
      return true;
    });

    const filteredOrgs = ORGS.filter(o => {
      if (filters.state && o.state !== filters.state) return false;
      if (filters.district && o.district !== filters.district) return false;
      if (filters.city && o.city !== filters.city) return false;
      return true;
    });

    return {
      hospitals: filteredHospitals,
      doctors: filteredDoctors,
      orgs: filteredOrgs
    };
  }, [filters]);

  const tabs = [
    { 
      id: "overview", 
      label: "Overview", 
      icon: LucideIcons.LayoutDashboard,
      component: <DashboardSection hospitals={filteredData.hospitals} filters={filters} />
    },
    { 
      id: "doctors", 
      label: "Doctors", 
      icon: LucideIcons.Stethoscope,
      component: <DoctorSection doctors={filteredData.doctors} filters={filters} />
    },
    { 
      id: "executives", 
      label: "Sales Executives", 
      icon: LucideIcons.Users,
      component: <ExecutiveSection executives={EXECUTIVES} filters={filters} />
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
          <FilterBar 
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={resetFilters}
            onApplyFilters={handleApplyFilters}
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1 border-b border-[#E8C9B8] mb-6 overflow-x-auto bg-white/60 backdrop-blur-sm rounded-t-xl px-2 py-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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
          {tabs.find(tab => tab.id === activeTab)?.component}
        </div>
      </div>
    </div>
  );
}

export default AllSalesAnalytics;