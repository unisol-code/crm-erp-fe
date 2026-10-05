// hooks/superAdminHook/allSalesAnalytics/useAllSalesAnalytics.js
//
// "All Sales Analytics" hook - every API the analytics pages need.
//
// HOW TO READ THIS FILE
// Every API follows the SAME 3 steps, so once you read one, you read them all:
//
//   1. const res = await get({ path, keys, filters, label });
//        get() runs the GET request and handles loading / error / toast.
//   2. if (!res) return null;          // request failed -> save nothing
//   3. setSomeData(res); return res;   // request worked -> save it for the page
//
// `keys` = the query parameters that API understands, for example:
//   keys: [...LOCATION_KEYS, ...PAGE_KEYS]
//   -> dashboard/...?region=West&state=Maharashtra&district=Pune&city=Pune&page=1&limit=10

import { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import useAnalyticsApi from "./useAnalyticsApi";
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
  specificIndividualDataStateAtom,
  allOrganizationsDataStateAtom,
  specificOrganizationDataStateAtom,
  specificSalesPersonDataStateAtom,
} from "../../../state/allSalesAnalyticState/allSalesAnalyticsState";

// Query parameters that several APIs share
const LOCATION_KEYS = ["region", "state", "district", "city"];
const PROFILE_KEYS = ["segment", "speciality", "typeOfDoctorProfile"];
const PAGE_KEYS = ["page", "limit"];

const useAllSalesAnalytics = () => {
  // ---------- State (one saved value per API) ----------
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
  const [doctorData, setDoctorData] = useRecoilState(doctorDataStateAtom);
  const [doctorListData, setDoctorListData] = useRecoilState(doctorListStateAtom);
  const [salesPersonData, setSalesPersonData] = useRecoilState(salesPersonDataStateAtom);
  const [organizationDashboardData, setOrganizationDashboardData] = useRecoilState(organizationDashboardDataStateAtom);
  const [organizationProductData, setOrganizationProductData] = useRecoilState(organizationProductDataStateAtom);
  const [organizationListData, setOrganizationListData] = useRecoilState(organizationListDataStateAtom);
  const [salesPersonTargetData, setSalesPersonTargetData] = useRecoilState(salesPersonTargetDataStateAtom);
  const [allIndividualData, setAllIndividualData] = useRecoilState(allIndividualDataStateAtom);
  const [specificIndividualData, setSpecificIndividualData] = useRecoilState(specificIndividualDataStateAtom);
  const [allOrganizationsData, setAllOrganizationsData] = useRecoilState(allOrganizationsDataStateAtom);
  const [specificOrganizationData, setSpecificOrganizationData] = useRecoilState(specificOrganizationDataStateAtom);
  const [specificSalesPersonData, setSpecificSalesPersonData] = useRecoilState(specificSalesPersonDataStateAtom);

  // Keep a ref copy of the filters so the fetch functions below can always read
  // the newest values (without being re-created on every render).
  const filtersRef = useRef(filters);
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  // ---------- The one place that runs every request of this hook ----------
  // It handles the base url, query string, loader, error and toast.
  const get = useAnalyticsApi({ setLoading, setError });

  // ---------- Small helpers that shape a response for the UI ----------

  // Turns the overview response into the KPI cards of the dashboard
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

  // Turns the sales-performance response into the rows the executive table expects
  const buildExecutiveData = (data) => {
    if (!Array.isArray(data)) return [];
    return data.map((item) => ({
      id: item.salesPersonId,
      name: item.salesPersonName,
      planned: item.totalVisits,
      completed: item.successVisits,
      achievement: item.successPercentage,
      leads: 0,
    }));
  };

  // ---------- API 1: overview (KPI cards) ----------
  const fetchOverviewData = useCallback(async (filterParams = {}) => {
    const allFilters = { ...filtersRef.current, ...filterParams };

    const res = await get({
      path: "dashboard/OverviewDataAnalytics",
      keys: [...LOCATION_KEYS, ...PROFILE_KEYS, "salesPerson", "month", "year"],
      filters: allFilters,
      label: "overview data",
      checkSuccess: false, // this API answers without a success flag
    });
    if (!res) return null;

    setOverviewData(res);
    setKPIs(buildKPIs(res.data));
    setFilters(allFilters); // remember the filters that were used
    return res;
  }, [get, setFilters, setOverviewData, setKPIs]);

  // ---------- API 2: sales performance (executive table) ----------
  const fetchSalesPerformance = useCallback(async (filterParams = {}) => {
    const allFilters = { ...filtersRef.current, ...filterParams };

    const res = await get({
      path: "dashboard/salesPerformanceAnalytics",
      keys: [...LOCATION_KEYS, ...PROFILE_KEYS, ...PAGE_KEYS],
      filters: allFilters,
      label: "sales performance data",
    });
    if (!res) return null;

    setExecutiveData(buildExecutiveData(res.data));
    return res;
  }, [get, setExecutiveData]);

  // ---------- API 3: organization / hospital analytics ----------
  const fetchOrganizationAnalytics = useCallback(async (filterParams = {}, silent = false) => {
    const allFilters = { ...filtersRef.current, ...filterParams };

    const res = await get({
      path: "dashboard/OrganizationAnalytics",
      keys: [...LOCATION_KEYS, ...PROFILE_KEYS, ...PAGE_KEYS],
      filters: allFilters,
      label: "organization analytics",
      silent,
    });
    if (!res) return null;

    setOrganizationData(res);
    return res;
  }, [get, setOrganizationData]);

  // ---------- API 4: speciality analytics ----------
  const fetchSpecialityAnalytics = useCallback(async (filterParams = {}) => {
    const allFilters = { ...filtersRef.current, ...filterParams };

    const res = await get({
      path: "dashboard/SpecialityAnalytics",
      keys: [...LOCATION_KEYS, ...PROFILE_KEYS],
      filters: allFilters,
      label: "speciality analytics",
    });
    if (!res) return null;

    setSpecialityData(res);
    return res;
  }, [get, setSpecialityData]);

  // ---------- API 5: target sheet analytics ----------
  const fetchTargetAnalytics = useCallback(async (filterParams = {}) => {
    const allFilters = { ...filtersRef.current, ...filterParams };

    const res = await get({
      path: "dashboard/targetSheetAnalytics",
      keys: [...LOCATION_KEYS, ...PROFILE_KEYS, ...PAGE_KEYS],
      filters: allFilters,
      label: "target analytics",
    });
    if (!res) return null;

    setTargetData(res);
    return res;
  }, [get, setTargetData]);

  // ---------- API 6: doctor / individual dashboard analytics ----------
  const fetchDoctorAnalytics = useCallback(async (filterParams = {}, silent = false) => {
    const allFilters = { ...filtersRef.current, ...filterParams };

    const res = await get({
      path: "dashboard/IndivualDashboardAnalytics",
      keys: [...LOCATION_KEYS, ...PROFILE_KEYS],
      filters: allFilters,
      label: "doctor analytics",
      silent,
    });
    if (!res) return null;

    setDoctorData(res);
    return res;
  }, [get, setDoctorData]);

  // ---------- API 7: doctor list (table of the selected profile) ----------
  const fetchDoctorList = useCallback(async (filterParams = {}, silent = false) => {
    const allFilters = { ...filtersRef.current, ...filterParams };

    const res = await get({
      path: "dashboard/IndividualDataAnalyticsDetails",
      keys: [...LOCATION_KEYS, ...PROFILE_KEYS, "salesPersonName", "doctorName", ...PAGE_KEYS],
      filters: allFilters,
      label: "doctor list",
      silent,
    });
    if (!res) return null;

    setDoctorListData(res);
    return res;
  }, [get, setDoctorListData]);

  // ---------- API 8: sales person analytics ----------
  const fetchSalesPersonAnalytics = useCallback(async (filterParams = {}) => {
    const allFilters = { ...filtersRef.current, ...filterParams };

    const res = await get({
      path: "dashboard/SalesPersonAnalytics",
      keys: [...LOCATION_KEYS, "segment"],
      filters: allFilters,
      label: "sales person analytics",
    });
    if (!res) return null;

    setSalesPersonData(res);
    return res;
  }, [get, setSalesPersonData]);

  // ---------- API 9: organization dashboard analytics ----------
  const fetchOrganizationDashboardAnalytics = useCallback(async (filterParams = {}) => {
    const allFilters = { ...filtersRef.current, ...filterParams };

    const res = await get({
      path: "dashboard/OrganizationDashboardAnalytics",
      keys: [...LOCATION_KEYS, ...PROFILE_KEYS],
      filters: allFilters,
      label: "organization dashboard analytics",
    });
    if (!res) return null;

    setOrganizationDashboardData(res);
    return res;
  }, [get, setOrganizationDashboardData]);

  // ---------- API 10: organization product analytics ----------
  const fetchOrganizationProductAnalytics = useCallback(async (filterParams = {}, silent = false) => {
    const allFilters = { ...filtersRef.current, ...filterParams };

    const res = await get({
      path: "dashboard/OrganizationProductAnalytics",
      keys: [...LOCATION_KEYS, "segment", "typeOfHospital", "typeOfOrgOrHospital", "salesPerson", "page", "pageSize"],
      filters: allFilters,
      label: "organization product analytics",
      silent,
    });
    if (!res) return null;

    setOrganizationProductData(res);
    return res;
  }, [get, setOrganizationProductData]);

  // ---------- API 11: organization list (table) ----------
  const fetchOrganizationListAnalytics = useCallback(async (filterParams = {}, silent = false) => {
    const allFilters = { ...filtersRef.current, ...filterParams };

    const res = await get({
      path: "dashboard/OrganizationDashboardAnalyticsList",
      keys: [...LOCATION_KEYS, "segment", "speciality", "typeOfHospital", "typeOfOrgOrHospital", "salesPerson", "page", "pageSize"],
      filters: allFilters,
      label: "organization list",
      silent,
    });
    if (!res) return null;

    setOrganizationListData(res);
    return res;
  }, [get, setOrganizationListData]);

  // ---------- API 12: sales person target analytics ----------
  const fetchSalesPersonTargetAnalytics = useCallback(async (filterParams = {}, silent = false) => {
    const allFilters = { ...filtersRef.current, ...filterParams };

    const res = await get({
      path: "dashboard/SalesPersonTargetAnalytics",
      keys: ["region", "month", "year", "state", "district", "city", "segment", ...PAGE_KEYS],
      filters: allFilters,
      label: "sales person target analytics",
      silent,
    });
    if (!res) return null;

    setSalesPersonTargetData(res);
    return res;
  }, [get, setSalesPersonTargetData]);

  // ---------- API 13: all individuals (list) ----------
  const fetchAllIndividualData = useCallback(async (filterParams = {}, silent = false) => {
    const allFilters = { ...filtersRef.current, ...filterParams };

    const res = await get({
      path: "dashboard/getAllIndiviual",
      keys: ["typeOfDoctorProfile", "speciality", "city", "district", "state", ...PAGE_KEYS],
      filters: allFilters,
      label: "all individual data",
      silent,
    });
    if (!res) return null;

    setAllIndividualData(res);
    return res;
  }, [get, setAllIndividualData]);

  // ---------- API 14: one individual by id ----------
  const fetchSpecificIndividualData = useCallback(async (id, silent = false) => {
    const res = await get({
      path: `dashboard/InformationOfSpecficIndiviual/${id}`,
      label: "specific individual data",
      silent,
    });
    if (!res) return null;

    setSpecificIndividualData(res);
    return res;
  }, [get, setSpecificIndividualData]);

  // ---------- API 15: all organizations (list) ----------
  const fetchAllOrganizationsData = useCallback(async (filterParams = {}, silent = false) => {
    const allFilters = { ...filtersRef.current, ...filterParams };

    const res = await get({
      path: "dashboard/getAllOrganizations",
      keys: ["typeOfOrgOrHospital", "speciality", "city", "district", "state", ...PAGE_KEYS],
      filters: allFilters,
      label: "all organizations data",
      silent,
    });
    if (!res) return null;

    setAllOrganizationsData(res);
    return res;
  }, [get, setAllOrganizationsData]);

  // ---------- API 16: one organization by id ----------
  const fetchSpecificOrganizationData = useCallback(async (id, silent = false) => {
    const res = await get({
      path: `dashboard/specificOrganizationData/${id}`,
      label: "specific organization data",
      silent,
    });
    if (!res) return null;

    setSpecificOrganizationData(res);
    return res;
  }, [get, setSpecificOrganizationData]);

  // ---------- API 17: one sales person by id ----------
  const fetchSpecificSalesPersonData = useCallback(async (id, silent = false) => {
    const res = await get({
      path: `dashboard/showSalesPersonSpecificData/${id}`,
      label: "specific sales person data",
      silent,
    });
    if (!res) return null;

    setSpecificSalesPersonData(res);
    return res;
  }, [get, setSpecificSalesPersonData]);

  // ---------- Filter helpers ----------
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

  // ---------- Reset helpers (clear the saved data of one API) ----------
  const resetOverviewData = useCallback(() => { setOverviewData(null); setKPIs([]); }, [setOverviewData, setKPIs]);
  const resetExecutiveData = useCallback(() => setExecutiveData([]), [setExecutiveData]);
  const resetOrganizationData = useCallback(() => setOrganizationData(null), [setOrganizationData]);
  const resetSpecialityData = useCallback(() => setSpecialityData(null), [setSpecialityData]);
  const resetTargetData = useCallback(() => setTargetData(null), [setTargetData]);
  const resetDoctorData = useCallback(() => setDoctorData(null), [setDoctorData]);
  const resetDoctorListData = useCallback(() => setDoctorListData(null), [setDoctorListData]);
  const resetSalesPersonData = useCallback(() => setSalesPersonData(null), [setSalesPersonData]);
  const resetOrganizationDashboardData = useCallback(() => setOrganizationDashboardData(null), [setOrganizationDashboardData]);
  const resetOrganizationProductData = useCallback(() => setOrganizationProductData(null), [setOrganizationProductData]);
  const resetOrganizationListData = useCallback(() => setOrganizationListData(null), [setOrganizationListData]);
  const resetSalesPersonTargetData = useCallback(() => setSalesPersonTargetData(null), [setSalesPersonTargetData]);
  const resetAllIndividualData = useCallback(() => setAllIndividualData(null), [setAllIndividualData]);
  const resetSpecificIndividualData = useCallback(() => setSpecificIndividualData(null), [setSpecificIndividualData]);
  const resetAllOrganizationsData = useCallback(() => setAllOrganizationsData(null), [setAllOrganizationsData]);
  const resetSpecificOrganizationData = useCallback(() => setSpecificOrganizationData(null), [setSpecificOrganizationData]);
  const resetSpecificSalesPersonData = useCallback(() => setSpecificSalesPersonData(null), [setSpecificSalesPersonData]);

  // ---------- What the pages get ----------
  return {
    // loading + error + filters
    loading,
    error,
    filters,
    updateFilter,
    resetFilters,

    // tabs
    selectedTab,
    changeTab,

    // API 1: overview (KPI cards + charts)
    overviewData,
    kpis,
    fetchOverviewData,
    resetOverviewData,

    // API 2: sales performance (executive table)
    executiveData,
    fetchSalesPerformance,
    resetExecutiveData,

    // API 3: organization analytics
    organizationData,
    fetchOrganizationAnalytics,
    resetOrganizationData,

    // API 4: speciality analytics
    specialityData,
    fetchSpecialityAnalytics,
    resetSpecialityData,

    // API 5: target sheet analytics
    targetData,
    fetchTargetAnalytics,
    resetTargetData,

    // API 6: doctor analytics
    doctorData,
    fetchDoctorAnalytics,
    resetDoctorData,

    // API 7: doctor list
    doctorListData,
    fetchDoctorList,
    resetDoctorListData,

    // API 8: sales person analytics
    salesPersonData,
    fetchSalesPersonAnalytics,
    resetSalesPersonData,

    // API 9: organization dashboard analytics
    organizationDashboardData,
    fetchOrganizationDashboardAnalytics,
    resetOrganizationDashboardData,

    // API 10: organization product analytics
    organizationProductData,
    fetchOrganizationProductAnalytics,
    resetOrganizationProductData,

    // API 11: organization list
    organizationListData,
    fetchOrganizationListAnalytics,
    resetOrganizationListData,

    // API 12: sales person target analytics
    salesPersonTargetData,
    fetchSalesPersonTargetAnalytics,
    resetSalesPersonTargetData,

    // API 13: all individuals
    allIndividualData,
    fetchAllIndividualData,
    resetAllIndividualData,

    // API 14: one individual by id
    specificIndividualData,
    fetchSpecificIndividualData,
    resetSpecificIndividualData,

    // API 15: all organizations
    allOrganizationsData,
    fetchAllOrganizationsData,
    resetAllOrganizationsData,

    // API 16: one organization by id
    specificOrganizationData,
    fetchSpecificOrganizationData,
    resetSpecificOrganizationData,

    // API 17: one sales person by id
    specificSalesPersonData,
    fetchSpecificSalesPersonData,
    resetSpecificSalesPersonData,
  };
};

export default useAllSalesAnalytics;
