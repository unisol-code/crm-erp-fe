// hooks/superAdminHook/allSalesAnalytics/useAllSalesAnalytics.js

import React from "react";
import { useRecoilState } from "recoil";
import { useState, useRef, useCallback } from "react";
import useFetch from "../../useFetch";
import conf from "../../../config/index";
import { toast } from "react-toastify";
import {
  analyticsFiltersStateAtom,
  analyticsErrorStateAtom,
  overviewDataStateAtom,
  overviewKPIsStateAtom,
  selectedTabStateAtom,
  executiveDataStateAtom,
  organizationDataStateAtom,
  specialityDataStateAtom,
  targetDataStateAtom,
  doctorDataStateAtom, // ✅ Add this
} from "../../../state/allSalesAnalyticState/allSalesAnalyticsState";

const useAllSalesAnalytics = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useRecoilState(analyticsFiltersStateAtom);
  const [error, setError] = useRecoilState(analyticsErrorStateAtom);
  const [overviewData, setOverviewData] = useRecoilState(overviewDataStateAtom);
  const [kpis, setKPIs] = useRecoilState(overviewKPIsStateAtom);
  const [selectedTab, setSelectedTab] = useRecoilState(selectedTabStateAtom);
  const [executiveData, setExecutiveData] = useRecoilState(executiveDataStateAtom);
  const [organizationData, setOrganizationData] = useRecoilState(organizationDataStateAtom);
  const [specialityData, setSpecialityData] = useRecoilState(specialityDataStateAtom);
  const [targetData, setTargetData] = useRecoilState(targetDataStateAtom);
  const [doctorData, setDoctorData] = useRecoilState(doctorDataStateAtom); // ✅ New state

  const filtersRef = useRef(filters);

  // Update ref when filters change
  React.useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  // ============== HELPER FUNCTIONS ==============
  const buildKPIs = (data) => {
    if (!data) return [];
    return [
      { key: "individualCount", title: "Total Doctor", value: String(data.individualCount ?? 0), trend: 0, accent: "info", icon: "Users" },
      { key: "organizationCount", title: "Total Hospital ", value: String(data.organizationCount ?? 0), trend: 0, accent: "product", icon: "Building" },
      { key: "associatedHospitalCount", title: "Associated Hospitals", value: String(data.associatedHospitalCount ?? 0), trend: 0, accent: "success", icon: "Hospital" },
      { key: "totalVisit", title: "Total Visits", value: String(data.totalVisit ?? 0), trend: 0, accent: "target", icon: "Activity" },
      { key: "totalTarget", title: "Total Target", value: String(data.totalTarget ?? 0), trend: 0, accent: "info", icon: "Target" },
      { key: "totalAchievement", title: "Total Achievement", value: String(data.totalAchievement ?? 0), trend: 0, accent: "success", icon: "Award" },
      { key: "achievementPercentage", title: "Achievement %", value: `${Math.round(data.achievementPercentage || 0)}%`, trend: 0, accent: "target", icon: "Percent" },
    ];
  };

  const buildExecutiveData = (data) => {
    if (!data || !Array.isArray(data)) return [];
    return data.map((item) => ({
      id: item.salesPersonId,
      name: item.salesPersonName,
      planned: item.totalVisits,
      completed: item.successVisits,
      achievement: item.successPercentage,
      leads: 0,
    }));
  };

  // ============== API 1: FETCH OVERVIEW DATA ==============
  const fetchOverviewData = useCallback(async (filterParams = {}) => {
    setLoading(true);
    setError(null);

    try {
      const allFilters = { ...filtersRef.current, ...filterParams };

      const params = new URLSearchParams();
      if (allFilters.state) params.append("state", allFilters.state);
      if (allFilters.district) params.append("district", allFilters.district);
      if (allFilters.city) params.append("city", allFilters.city);
      if (allFilters.segment) params.append("segment", allFilters.segment);
      if (allFilters.speciality) params.append("speciality", allFilters.speciality);
      if (allFilters.typeOfDoctorProfile) params.append("typeOfDoctorProfile", allFilters.typeOfDoctorProfile);
      if (allFilters.salesPerson) params.append("salesPerson", allFilters.salesPerson);
      if (allFilters.month) params.append("month", allFilters.month);
      if (allFilters.year) params.append("year", allFilters.year);

      const url = `${conf.apiBaseUrl}dashboard/OverviewDataAnalytics${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const res = await fetchData({
        method: "GET",
        url: url,
      });

      if (res) {
        const mappedKPIs = buildKPIs(res.data);
        setOverviewData(res);
        setKPIs(mappedKPIs);
        setFilters(allFilters);
        return res;
      } else {
        throw new Error("No data received from the server");
      }
    } catch (err) {
      console.error("Error while fetching overview data:", err);
      setError(err.message || "Failed to fetch overview data");
      toast.error(err.response?.data?.message || "Failed to fetch overview data");
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchData, setFilters, setOverviewData, setKPIs, setError]);

  // ============== API 2: FETCH SALES PERFORMANCE ==============
  const fetchSalesPerformance = useCallback(async (filterParams = {}) => {
    setLoading(true);
    setError(null);

    try {
      const allFilters = { ...filtersRef.current, ...filterParams };

      const params = new URLSearchParams();
      if (allFilters.state) params.append("state", allFilters.state);
      if (allFilters.district) params.append("district", allFilters.district);
      if (allFilters.city) params.append("city", allFilters.city);
      if (allFilters.segment) params.append("segment", allFilters.segment);
      if (allFilters.speciality) params.append("speciality", allFilters.speciality);
      if (allFilters.typeOfDoctorProfile) params.append("typeOfDoctorProfile", allFilters.typeOfDoctorProfile);
      if (allFilters.page) params.append("page", String(allFilters.page || 1));
      if (allFilters.limit) params.append("limit", String(allFilters.limit || 10));

      const url = `${conf.apiBaseUrl}dashboard/salesPerformanceAnalytics${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const res = await fetchData({
        method: "GET",
        url: url,
      });

      if (res && res.success) {
        const mappedData = buildExecutiveData(res.data);
        setExecutiveData(mappedData);
        return res;
      } else {
        throw new Error(res?.message || "Failed to fetch sales performance data");
      }
    } catch (err) {
      console.error("Error while fetching sales performance data:", err);
      setError(err.message || "Failed to fetch sales performance data");
      toast.error(err.response?.data?.message || "Failed to fetch sales performance data");
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchData, setExecutiveData, setError]);

  // ============== API 3: FETCH ORGANIZATION/HOSPITAL ANALYTICS ==============
  const fetchOrganizationAnalytics = useCallback(async (filterParams = {}) => {
    setLoading(true);
    setError(null);

    try {
      const allFilters = { ...filtersRef.current, ...filterParams };
      
      const params = new URLSearchParams();
      if (allFilters.state) params.append("state", allFilters.state);
      if (allFilters.district) params.append("district", allFilters.district);
      if (allFilters.city) params.append("city", allFilters.city);
      if (allFilters.segment) params.append("segment", allFilters.segment);
      if (allFilters.speciality) params.append("speciality", allFilters.speciality);
      if (allFilters.typeOfDoctorProfile) params.append("typeOfDoctorProfile", allFilters.typeOfDoctorProfile);
      if (allFilters.page) params.append("page", String(allFilters.page || 1));
      if (allFilters.limit) params.append("limit", String(allFilters.limit || 10));

      const url = `${conf.apiBaseUrl}dashboard/OrganizationAnalytics${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const res = await fetchData({
        method: "GET",
        url: url,
      });

      if (res && res.success) {
        setOrganizationData(res);
        return res;
      } else {
        throw new Error(res?.message || "Failed to fetch organization analytics");
      }
    } catch (err) {
      console.error("Error while fetching organization analytics:", err);
      setError(err.message || "Failed to fetch organization analytics");
      toast.error(err.response?.data?.message || "Failed to fetch organization analytics");
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchData, setOrganizationData, setError]);

  // ============== API 4: FETCH SPECIALITY ANALYTICS ==============
  const fetchSpecialityAnalytics = useCallback(async (filterParams = {}) => {
    setLoading(true);
    setError(null);

    try {
      const allFilters = { ...filtersRef.current, ...filterParams };
      
      const params = new URLSearchParams();
      if (allFilters.state) params.append("state", allFilters.state);
      if (allFilters.district) params.append("district", allFilters.district);
      if (allFilters.city) params.append("city", allFilters.city);
      if (allFilters.segment) params.append("segment", allFilters.segment);
      if (allFilters.speciality) params.append("speciality", allFilters.speciality);
      if (allFilters.typeOfDoctorProfile) params.append("typeOfDoctorProfile", allFilters.typeOfDoctorProfile);

      const url = `${conf.apiBaseUrl}dashboard/SpecialityAnalytics${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const res = await fetchData({
        method: "GET",
        url: url,
      });

      if (res && res.success) {
        setSpecialityData(res);
        return res;
      } else {
        throw new Error(res?.message || "Failed to fetch speciality analytics");
      }
    } catch (err) {
      console.error("Error while fetching speciality analytics:", err);
      setError(err.message || "Failed to fetch speciality analytics");
      toast.error(err.response?.data?.message || "Failed to fetch speciality analytics");
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchData, setSpecialityData, setError]);

  // ============== API 5: FETCH TARGET SHEET ANALYTICS ==============
  const fetchTargetAnalytics = useCallback(async (filterParams = {}) => {
    setLoading(true);
    setError(null);

    try {
      const allFilters = { ...filtersRef.current, ...filterParams };
      
      const params = new URLSearchParams();
      if (allFilters.state) params.append("state", allFilters.state);
      if (allFilters.district) params.append("district", allFilters.district);
      if (allFilters.city) params.append("city", allFilters.city);
      if (allFilters.segment) params.append("segment", allFilters.segment);
      if (allFilters.speciality) params.append("speciality", allFilters.speciality);
      if (allFilters.typeOfDoctorProfile) params.append("typeOfDoctorProfile", allFilters.typeOfDoctorProfile);
      if (allFilters.page) params.append("page", String(allFilters.page || 1));
      if (allFilters.limit) params.append("limit", String(allFilters.limit || 10));

      const url = `${conf.apiBaseUrl}dashboard/targetSheetAnalytics${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const res = await fetchData({
        method: "GET",
        url: url,
      });

      if (res && res.success) {
        setTargetData(res);
        return res;
      } else {
        throw new Error(res?.message || "Failed to fetch target analytics");
      }
    } catch (err) {
      console.error("Error while fetching target analytics:", err);
      setError(err.message || "Failed to fetch target analytics");
      toast.error(err.response?.data?.message || "Failed to fetch target analytics");
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchData, setTargetData, setError]);


// ============== API 6: FETCH DOCTOR ANALYTICS ==============
const fetchDoctorAnalytics = useCallback(async (filterParams = {}) => {
  setLoading(true);
  setError(null);

  try {
    const allFilters = { ...filtersRef.current, ...filterParams };
    
    const params = new URLSearchParams();
    if (allFilters.state) params.append("state", allFilters.state);
    if (allFilters.district) params.append("district", allFilters.district);
    if (allFilters.city) params.append("city", allFilters.city);
    if (allFilters.segment) params.append("segment", allFilters.segment);
    if (allFilters.speciality) params.append("speciality", allFilters.speciality);
    if (allFilters.typeOfDoctorProfile) params.append("typeOfDoctorProfile", allFilters.typeOfDoctorProfile);

    // ✅ CORRECT ENDPOINT
    const url = `${conf.apiBaseUrl}dashboard/IndivualDashboardAnalytics${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    const res = await fetchData({
      method: "GET",
      url: url,
    });

    if (res && res.success) {
      setDoctorData(res);
      return res;
    } else {
      throw new Error(res?.message || "Failed to fetch doctor analytics");
    }
  } catch (err) {
    console.error("Error while fetching doctor analytics:", err);
    setError(err.message || "Failed to fetch doctor analytics");
    toast.error(err.response?.data?.message || "Failed to fetch doctor analytics");
    return null;
  } finally {
    setLoading(false);
  }
}, [fetchData, setDoctorData, setError]);
  // ============== FILTER MANAGEMENT ==============
  const resetFilters = useCallback(() => {
    const clearedFilters = {
      state: "",
      district: "",
      city: "",
      segment: "",
      speciality: "",
      typeOfDoctorProfile: "",
      salesPerson: "",
      month: "",
      year: "",
    };
    setFilters(clearedFilters);
    filtersRef.current = clearedFilters;
    return fetchOverviewData(clearedFilters);
  }, [setFilters, fetchOverviewData]);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      filtersRef.current = newFilters;
      return newFilters;
    });
  }, [setFilters]);

  const changeTab = useCallback((tab) => {
    setSelectedTab(tab);
  }, [setSelectedTab]);

  // ============== RESET FUNCTIONS ==============
  const resetOverviewData = useCallback(() => {
    setOverviewData(null);
    setKPIs([]);
  }, [setOverviewData, setKPIs]);

  const resetExecutiveData = useCallback(() => {
    setExecutiveData([]);
  }, [setExecutiveData]);

  const resetOrganizationData = useCallback(() => {
    setOrganizationData(null);
  }, [setOrganizationData]);

  const resetSpecialityData = useCallback(() => {
    setSpecialityData(null);
  }, [setSpecialityData]);

  const resetTargetData = useCallback(() => {
    setTargetData(null);
  }, [setTargetData]);

  const resetDoctorData = useCallback(() => {
    setDoctorData(null);
  }, [setDoctorData]);

  // ============== RETURN ALL FUNCTIONS AND DATA ==============
  return {
    // Loading & Error
    loading,
    error,
    
    // Filters
    filters,
    updateFilter,
    resetFilters,
    
    // Tab management
    selectedTab,
    changeTab,
    
    // Overview Data
    overviewData,
    kpis,
    fetchOverviewData,
    resetOverviewData,
    
    // Executive Data
    executiveData,
    fetchSalesPerformance,
    resetExecutiveData,
    
    // Organization Data
    organizationData,
    fetchOrganizationAnalytics,
    resetOrganizationData,
    
    // Speciality Data
    specialityData,
    fetchSpecialityAnalytics,
    resetSpecialityData,

    // Target Data
    targetData,
    fetchTargetAnalytics,
    resetTargetData,

    // Doctor Data
    doctorData,
    fetchDoctorAnalytics,
    resetDoctorData,
  };
};

export default useAllSalesAnalytics;