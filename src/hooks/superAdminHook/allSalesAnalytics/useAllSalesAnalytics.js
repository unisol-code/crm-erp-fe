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
  doctorDataStateAtom,
  doctorListStateAtom,
  salesPersonDataStateAtom,
  organizationDashboardDataStateAtom,
  organizationProductDataStateAtom,
  organizationListDataStateAtom,
  salesPersonTargetDataStateAtom,
  allIndividualDataStateAtom,
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
  const [doctorListData, setDoctorListData] = useRecoilState(doctorListStateAtom);
  const [salesPersonData, setSalesPersonData] = useRecoilState(salesPersonDataStateAtom);
  const [organizationDashboardData, setOrganizationDashboardData] = useRecoilState(organizationDashboardDataStateAtom);
const [organizationProductData, setOrganizationProductData] = useRecoilState(organizationProductDataStateAtom);
const [organizationListData, setOrganizationListData] = useRecoilState(organizationListDataStateAtom);
  const [salesPersonTargetData, setSalesPersonTargetData] = useRecoilState(salesPersonTargetDataStateAtom);
  const [allIndividualData, setAllIndividualData] = useRecoilState(allIndividualDataStateAtom);
  const filtersRef = useRef(filters);

  // Update ref when filters change
  React.useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  // ============== HELPER FUNCTIONS ==============
  const buildKPIs = (data) => {
    if (!data) return [];
    const kpis = [];
    if (data.individualCount !== undefined) {
      kpis.push({ key: "individualCount", title: "Total Doctor", value: String(data.individualCount ?? 0), trend: 0, accent: "info", icon: "Users" });
    }
    if (data.organizationCount !== undefined) {
      kpis.push({ key: "organizationCount", title: "Total Hospital", value: String(data.organizationCount ?? 0), trend: 0, accent: "product", icon: "Building" });
    }
    if (data.associatedHospitalCount !== undefined) {
      kpis.push({ key: "associatedHospitalCount", title: "Associated Hospitals", value: String(data.associatedHospitalCount ?? 0), trend: 0, accent: "success", icon: "Hospital" });
    }
    if (data.totalVisit !== undefined) {
      kpis.push({ key: "totalVisit", title: "Total Visits", value: String(data.totalVisit ?? 0), trend: 0, accent: "target", icon: "Activity" });
    }
    if (data.totalTarget !== undefined) {
      kpis.push({ key: "totalTarget", title: "Total Target", value: String(data.totalTarget ?? 0), trend: 0, accent: "info", icon: "Target" });
    }
    if (data.totalAchievement !== undefined) {
      kpis.push({ key: "totalAchievement", title: "Total Achievement", value: String(data.totalAchievement ?? 0), trend: 0, accent: "success", icon: "Award" });
    }
    if (data.achievementPercentage !== undefined) {
      kpis.push({ key: "achievementPercentage", title: "Achievement %", value: `${Math.round(data.achievementPercentage || 0)}%`, trend: 0, accent: "target", icon: "Percent" });
    }
    return kpis;
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
      if (allFilters.region) params.append("region", allFilters.region);
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
      if (allFilters.region) params.append("region", allFilters.region);
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
  const fetchOrganizationAnalytics = useCallback(async (filterParams = {}, silent = false) => {
    if (!silent) setLoading(true);
    setError(null);

    try {
      const allFilters = { ...filtersRef.current, ...filterParams };
      
      const params = new URLSearchParams();
      if (allFilters.region) params.append("region", allFilters.region);
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
      if (!silent) setLoading(false);
    }
  }, [fetchData, setOrganizationData, setError]);

  // ============== API 4: FETCH SPECIALITY ANALYTICS ==============
  const fetchSpecialityAnalytics = useCallback(async (filterParams = {}) => {
    setLoading(true);
    setError(null);

    try {
      const allFilters = { ...filtersRef.current, ...filterParams };
      
      const params = new URLSearchParams();
      if (allFilters.region) params.append("region", allFilters.region);
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
      if (allFilters.region) params.append("region", allFilters.region);
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
const fetchDoctorAnalytics = useCallback(async (filterParams = {}, silent = false) => {
    if (!silent) setLoading(true);
    setError(null);

    try {
      const allFilters = { ...filtersRef.current, ...filterParams };
      
      const params = new URLSearchParams();
      if (allFilters.region) params.append("region", allFilters.region);
      if (allFilters.state) params.append("state", allFilters.state);
      if (allFilters.district) params.append("district", allFilters.district);
      if (allFilters.city) params.append("city", allFilters.city);
      if (allFilters.segment) params.append("segment", allFilters.segment);
      if (allFilters.speciality) params.append("speciality", allFilters.speciality);
      if (allFilters.typeOfDoctorProfile) params.append("typeOfDoctorProfile", allFilters.typeOfDoctorProfile);

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
      if (!silent) setLoading(false);
    }
  }, [fetchData, setDoctorData, setError]);

// ============== API 7: FETCH DOCTOR LIST ==============
const fetchDoctorList = useCallback(async (filterParams = {}, silent = false) => {
    if (!silent) setLoading(true);
    setError(null);

    try {
      const allFilters = { ...filtersRef.current, ...filterParams };
      
      const params = new URLSearchParams();
      if (allFilters.region) params.append("region", allFilters.region);
      if (allFilters.state) params.append("state", allFilters.state);
      if (allFilters.district) params.append("district", allFilters.district);
      if (allFilters.city) params.append("city", allFilters.city);
      if (allFilters.segment) params.append("segment", allFilters.segment);
      if (allFilters.speciality) params.append("speciality", allFilters.speciality);
      if (allFilters.typeOfDoctorProfile) params.append("typeOfDoctorProfile", allFilters.typeOfDoctorProfile);
      if (allFilters.page) params.append("page", String(allFilters.page || 1));
      if (allFilters.limit) params.append("limit", String(allFilters.limit || 10));

      const url = `${conf.apiBaseUrl}dashboard/IndividualDataAnalyticsDetails${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const res = await fetchData({
        method: "GET",
        url: url,
      });

      if (res && res.success) {
        setDoctorListData(res);
        return res;
      } else {
        throw new Error(res?.message || "Failed to fetch doctor list");
      }
    } catch (err) {
      console.error("Error while fetching doctor list:", err);
      setError(err.message || "Failed to fetch doctor list");
      toast.error(err.response?.data?.message || "Failed to fetch doctor list");
      return null;
    } finally {
      if (!silent) setLoading(false);
    }
  }, [fetchData, setDoctorListData, setError]);

// ============== API 8: FETCH SALES PERSON ANALYTICS ==============
const fetchSalesPersonAnalytics = useCallback(async (filterParams = {}) => {
  setLoading(true);
  setError(null);

  try {
    const allFilters = { ...filtersRef.current, ...filterParams };
    
      const params = new URLSearchParams();
      if (allFilters.region) params.append("region", allFilters.region);
      if (allFilters.state) params.append("state", allFilters.state);
      if (allFilters.district) params.append("district", allFilters.district);
      if (allFilters.city) params.append("city", allFilters.city);
      if (allFilters.segment) params.append("segment", allFilters.segment);

      const url = `${conf.apiBaseUrl}dashboard/SalesPersonAnalytics${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    const res = await fetchData({
      method: "GET",
      url: url,
    });

    if (res && res.success) {
      setSalesPersonData(res);
      return res;
    } else {
      throw new Error(res?.message || "Failed to fetch sales person analytics");
    }
  } catch (err) {
    console.error("Error while fetching sales person analytics:", err);
    setError(err.message || "Failed to fetch sales person analytics");
    toast.error(err.response?.data?.message || "Failed to fetch sales person analytics");
    return null;
  } finally {
    setLoading(false);
  }
}, [fetchData, setSalesPersonData, setError]);

// ============== API 9: FETCH ORGANIZATION DASHBOARD ANALYTICS ==============
const fetchOrganizationDashboardAnalytics = useCallback(async (filterParams = {}) => {
  setLoading(true);
  setError(null);

  try {
    const allFilters = { ...filtersRef.current, ...filterParams };
    
      const params = new URLSearchParams();
      if (allFilters.region) params.append("region", allFilters.region);
      if (allFilters.state) params.append("state", allFilters.state);
      if (allFilters.district) params.append("district", allFilters.district);
      if (allFilters.city) params.append("city", allFilters.city);
      if (allFilters.segment) params.append("segment", allFilters.segment);
      if (allFilters.speciality) params.append("speciality", allFilters.speciality);
      if (allFilters.typeOfDoctorProfile) params.append("typeOfDoctorProfile", allFilters.typeOfDoctorProfile);

      const url = `${conf.apiBaseUrl}dashboard/OrganizationDashboardAnalytics${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    const res = await fetchData({
      method: "GET",
      url: url,
    });

    if (res && res.success) {
      setOrganizationDashboardData(res);
      return res;
    } else {
      throw new Error(res?.message || "Failed to fetch organization dashboard analytics");
    }
  } catch (err) {
    console.error("Error while fetching organization dashboard analytics:", err);
    setError(err.message || "Failed to fetch organization dashboard analytics");
    toast.error(err.response?.data?.message || "Failed to fetch organization dashboard analytics");
    return null;
  } finally {
    setLoading(false);
  }
}, [fetchData, setOrganizationDashboardData, setError]);

// ============== API 10: FETCH ORGANIZATION PRODUCT ANALYTICS ==============
const fetchOrganizationProductAnalytics = useCallback(async (filterParams = {}, silent = false) => {
    if (!silent) setLoading(true);
    setError(null);

  try {
    const allFilters = { ...filtersRef.current, ...filterParams };
    
      const params = new URLSearchParams();
      if (allFilters.region) params.append("region", allFilters.region);
      if (allFilters.state) params.append("state", allFilters.state);
      if (allFilters.district) params.append("district", allFilters.district);
      if (allFilters.city) params.append("city", allFilters.city);
      if (allFilters.segment) params.append("segment", allFilters.segment);
      if (allFilters.typeOfHospital) params.append("typeOfHospital", allFilters.typeOfHospital);
      if (allFilters.typeOfOrgOrHospital) params.append("typeOfOrgOrHospital", allFilters.typeOfOrgOrHospital);
      if (allFilters.salesPerson) params.append("salesPerson", allFilters.salesPerson);
      if (allFilters.page) params.append("page", String(allFilters.page || 1));
      if (allFilters.pageSize) params.append("pageSize", String(allFilters.pageSize || 10));

      const url = `${conf.apiBaseUrl}dashboard/OrganizationProductAnalytics${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    const res = await fetchData({
      method: "GET",
      url: url,
    });

    if (res && res.success) {
      setOrganizationProductData(res);
      return res;
    } else {
      throw new Error(res?.message || "Failed to fetch organization product analytics");
    }
  } catch (err) {
    console.error("Error while fetching organization product analytics:", err);
    setError(err.message || "Failed to fetch organization product analytics");
    toast.error(err.response?.data?.message || "Failed to fetch organization product analytics");
    return null;
    } finally {
      if (!silent) setLoading(false);
    }
  }, [fetchData, setOrganizationProductData, setError]);

// ============== API 11: FETCH ORGANIZATION LIST ANALYTICS ==============
const fetchOrganizationListAnalytics = useCallback(async (filterParams = {}, silent = false) => {
    if (!silent) setLoading(true);
    setError(null);

    try {
      const allFilters = { ...filtersRef.current, ...filterParams };
      
      const params = new URLSearchParams();
      if (allFilters.region) params.append("region", allFilters.region);
      if (allFilters.state) params.append("state", allFilters.state);
      if (allFilters.district) params.append("district", allFilters.district);
      if (allFilters.city) params.append("city", allFilters.city);
      if (allFilters.segment) params.append("segment", allFilters.segment);
      if (allFilters.speciality) params.append("speciality", allFilters.speciality);
      if (allFilters.typeOfHospital) params.append("typeOfHospital", allFilters.typeOfHospital);
      if (allFilters.typeOfOrgOrHospital) params.append("typeOfOrgOrHospital", allFilters.typeOfOrgOrHospital);
      if (allFilters.salesPerson) params.append("salesPerson", allFilters.salesPerson);
      if (allFilters.page) params.append("page", String(allFilters.page || 1));
      if (allFilters.pageSize) params.append("pageSize", String(allFilters.pageSize || 10));

      const url = `${conf.apiBaseUrl}dashboard/OrganizationDashboardAnalyticsList${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const res = await fetchData({
        method: "GET",
        url: url,
      });

      if (res && res.success) {
        setOrganizationListData(res);
        return res;
      } else {
        throw new Error(res?.message || "Failed to fetch organization list");
      }
    } catch (err) {
      console.error("Error while fetching organization list:", err);
      setError(err.message || "Failed to fetch organization list");
      toast.error(err.response?.data?.message || "Failed to fetch organization list");
      return null;
    } finally {
      if (!silent) setLoading(false);
    }
  }, [fetchData, setOrganizationListData, setError]);


// ============== API 12: FETCH SALES PERSON TARGET ANALYTICS ==============
const fetchSalesPersonTargetAnalytics = useCallback(async (filterParams = {}, silent = false) => {
    if (!silent) setLoading(true);
    setError(null);

  try {
    const allFilters = { ...filtersRef.current, ...filterParams };
    
      const params = new URLSearchParams();
      if (allFilters.region) params.append("region", allFilters.region);
      if (allFilters.month) params.append("month", allFilters.month);
      if (allFilters.year) params.append("year", allFilters.year);
      if (allFilters.state) params.append("state", allFilters.state);
      if (allFilters.district) params.append("district", allFilters.district);
      if (allFilters.city) params.append("city", allFilters.city);
      if (allFilters.segment) params.append("segment", allFilters.segment);
      if (allFilters.page) params.append("page", String(allFilters.page || 1));
      if (allFilters.limit) params.append("limit", String(allFilters.limit || 10));

      const url = `${conf.apiBaseUrl}dashboard/SalesPersonTargetAnalytics${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    const res = await fetchData({
      method: "GET",
      url: url,
    });

    if (res && res.success) {
      setSalesPersonTargetData(res);
      return res;
    } else {
      throw new Error(res?.message || "Failed to fetch sales person target analytics");
    }
  } catch (err) {
    console.error("Error while fetching sales person target analytics:", err);
    setError(err.message || "Failed to fetch sales person target analytics");
    toast.error(err.response?.data?.message || "Failed to fetch sales person target analytics");
    return null;
    } finally {
      if (!silent) setLoading(false);
    }
  }, [fetchData, setSalesPersonTargetData, setError]);

  // ============== API 13: FETCH ALL INDIVIDUAL DATA ==============
  const fetchAllIndividualData = useCallback(async (filterParams = {}, silent = false) => {
    if (!silent) setLoading(true);
    setError(null);

    try {
      const allFilters = { ...filtersRef.current, ...filterParams };

      const params = new URLSearchParams();
      if (allFilters.typeOfDoctorProfile) params.append("typeOfDoctorProfile", allFilters.typeOfDoctorProfile);
      if (allFilters.speciality) params.append("speciality", allFilters.speciality);
      if (allFilters.city) params.append("city", allFilters.city);
      if (allFilters.district) params.append("district", allFilters.district);
      if (allFilters.state) params.append("state", allFilters.state);
      if (allFilters.page) params.append("page", String(allFilters.page || 1));
      if (allFilters.limit) params.append("limit", String(allFilters.limit || 10));

      const url = `${conf.apiBaseUrl}dashboard/getAllIndiviual${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const res = await fetchData({
        method: "GET",
        url: url,
      });

      if (res && res.success) {
        setAllIndividualData(res);
        return res;
      } else {
        throw new Error(res?.message || "Failed to fetch all individual data");
      }
    } catch (err) {
      console.error("Error while fetching all individual data:", err);
      setError(err.message || "Failed to fetch all individual data");
      toast.error(err.response?.data?.message || "Failed to fetch all individual data");
      return null;
    } finally {
      if (!silent) setLoading(false);
    }
  }, [fetchData, setAllIndividualData, setError]);


  // ============== FILTER MANAGEMENT ==============
   const resetFilters = useCallback(() => {
     const clearedFilters = {
       region: "",
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
   }, [setFilters]);

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

      doctorListData,
  fetchDoctorList,
  resetDoctorListData: () => setDoctorListData(null),

   salesPersonData,
  fetchSalesPersonAnalytics,
  resetSalesPersonData: () => setSalesPersonData(null),

    organizationDashboardData,
  fetchOrganizationDashboardAnalytics,
  resetOrganizationDashboardData: () => setOrganizationDashboardData(null),

    organizationProductData,
  fetchOrganizationProductAnalytics,
  resetOrganizationProductData: () => setOrganizationProductData(null),

   organizationListData,
  fetchOrganizationListAnalytics,
  resetOrganizationListData: () => setOrganizationListData(null),

  salesPersonTargetData,
  fetchSalesPersonTargetAnalytics,
  resetSalesPersonTargetData: () => setSalesPersonTargetData(null),

  allIndividualData,
  fetchAllIndividualData,
  resetAllIndividualData: () => setAllIndividualData(null),
  };
};

export default useAllSalesAnalytics;