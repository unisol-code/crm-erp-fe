// hooks/superAdminHook/allSalesAnalytics/useAllSalesEnviroAnalytics.js
//
// Enviro Solution analytics - used by the "Enviro Analytics Breakdown" page.
//
// There are 4 APIs here and they all follow the SAME 3 steps:
//   1. const res = await getEnviro({ path, keys, filters, label });
//        -> runs the request (loading / error / toast are handled inside)
//   2. if (!res) return null;          -> request failed, save nothing
//   3. setSomething(res); return res;  -> request worked, save it for the page
//
// `keys` = the query parameters the API understands:
//   ?state=..&region=..&cityTownVillage=..&district=..&salesPersonName=..
//   &segment=..&typeOfProfile=..&page=1&limit=10

import { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import useAnalyticsApi from "./useAnalyticsApi";
import {
  enviroAnalyticsFiltersStateAtom,
  enviroAnalyticsErrorStateAtom,
  enviroAnalyticsDataStateAtom,
  enviroAnalyticsKPIsStateAtom,
  enviroIndividualsFiltersStateAtom,
  enviroIndividualsErrorStateAtom,
  enviroIndividualsDataStateAtom,
  enviroIndividualsLoadingStateAtom,
  enviroOrganizationsFiltersStateAtom,
  enviroOrganizationsErrorStateAtom,
  enviroOrganizationsDataStateAtom,
  enviroOrganizationsLoadingStateAtom,
  enviroEmployeesFiltersStateAtom,
  enviroEmployeesErrorStateAtom,
  enviroEmployeesDataStateAtom,
  enviroEmployeesLoadingStateAtom,
  enviroSpecificOrganizationFiltersStateAtom,
  enviroSpecificOrganizationErrorStateAtom,
  enviroSpecificOrganizationDataStateAtom,
  enviroSpecificOrganizationLoadingStateAtom,
  enviroSpecificIndividualFiltersStateAtom,
  enviroSpecificIndividualErrorStateAtom,
  enviroSpecificIndividualDataStateAtom,
  enviroSpecificIndividualLoadingStateAtom,
  enviroSpecificSalesPersonFiltersStateAtom,
  enviroSpecificSalesPersonErrorStateAtom,
  enviroSpecificSalesPersonDataStateAtom,
  enviroSpecificSalesPersonLoadingStateAtom,
} from "../../../state/allSalesAnalyticState/allSalesAnalyticsState";

// Query parameters accepted by the enviro APIs
// (individuals use segment/typeOfProfile, organizations use
// sectionName/OrganizationType; "individualName" searches individuals by name)
const ENVIRO_KEYS = [
  "state",
  "region",
  "cityTownVillage",
  "district",
  "salesPersonName",
  "segment",
  "typeOfProfile",
  "sectionName",
  "OrganizationType",
  "individualName",
  // "organizationName" searches the enviro organizations list by name
  "organizationName",
  "page",
  "limit",
];

// Query parameters of the single-organization API (only `year`)
const ENVIRO_SPECIFIC_ORGANIZATION_KEYS = ["year"];

// Query parameters of the single-individual API (only `year`)
const ENVIRO_SPECIFIC_INDIVIDUAL_KEYS = ["year"];

// Query parameters of the single-sales-person API (only `year`)
const ENVIRO_SPECIFIC_SALESPERSON_KEYS = ["year"];

// Empty filter values, reused by both reset functions below
const EMPTY_ENVIRO_FILTERS = {
  state: "",
  region: "",
  cityTownVillage: "",
  district: "",
  salesPersonName: "",
  segment: "",
  typeOfProfile: "",
  sectionName: "",
  OrganizationType: "",
  individualName: "",
  organizationName: "",
  page: 1,
  limit: 10,
};

const useAllSalesEnviroAnalytics = () => {
  // ---------- 1. Main enviro analytics (KPI cards + breakdown numbers) ----------
  const [loading, setLoading] = useState(false);
  const [error, setError] = useRecoilState(enviroAnalyticsErrorStateAtom);
  const [filters, setFilters] = useRecoilState(enviroAnalyticsFiltersStateAtom);
  const [enviroData, setEnviroData] = useRecoilState(enviroAnalyticsDataStateAtom);
  const [kpis, setKPIs] = useRecoilState(enviroAnalyticsKPIsStateAtom);
  const filtersRef = useRef(filters);

  // ---------- 2. Enviro individuals (the list in the detail table) ----------
  const [enviroIndividualsLoading, setEnviroIndividualsLoading] = useRecoilState(enviroIndividualsLoadingStateAtom);
  const [enviroIndividualsError, setEnviroIndividualsError] = useRecoilState(enviroIndividualsErrorStateAtom);
  const [enviroIndividualsFilters, setEnviroIndividualsFilters] = useRecoilState(enviroIndividualsFiltersStateAtom);
  const [enviroIndividualsData, setEnviroIndividualsData] = useRecoilState(enviroIndividualsDataStateAtom);
  const enviroIndividualsFiltersRef = useRef(enviroIndividualsFilters);

  // ---------- 3. Enviro organizations (the list in the detail table) ----------
  const [enviroOrganizationsLoading, setEnviroOrganizationsLoading] = useRecoilState(enviroOrganizationsLoadingStateAtom);
  const [enviroOrganizationsError, setEnviroOrganizationsError] = useRecoilState(enviroOrganizationsErrorStateAtom);
  const [enviroOrganizationsFilters, setEnviroOrganizationsFilters] = useRecoilState(enviroOrganizationsFiltersStateAtom);
  const [enviroOrganizationsData, setEnviroOrganizationsData] = useRecoilState(enviroOrganizationsDataStateAtom);
  const enviroOrganizationsFiltersRef = useRef(enviroOrganizationsFilters);

  // ---------- 4. Enviro employees (the list in the detail table) ----------
  const [enviroEmployeesLoading, setEnviroEmployeesLoading] = useRecoilState(enviroEmployeesLoadingStateAtom);
  const [enviroEmployeesError, setEnviroEmployeesError] = useRecoilState(enviroEmployeesErrorStateAtom);
  const [enviroEmployeesFilters, setEnviroEmployeesFilters] = useRecoilState(enviroEmployeesFiltersStateAtom);
  const [enviroEmployeesData, setEnviroEmployeesData] = useRecoilState(enviroEmployeesDataStateAtom);
  const enviroEmployeesFiltersRef = useRef(enviroEmployeesFilters);

  // ---------- 5. Enviro specific organization (detail view of one row) ----------
  const [enviroSpecificOrganizationLoading, setEnviroSpecificOrganizationLoading] = useRecoilState(enviroSpecificOrganizationLoadingStateAtom);
  const [enviroSpecificOrganizationError, setEnviroSpecificOrganizationError] = useRecoilState(enviroSpecificOrganizationErrorStateAtom);
  const [enviroSpecificOrganizationFilters, setEnviroSpecificOrganizationFilters] = useRecoilState(enviroSpecificOrganizationFiltersStateAtom);
  const [enviroSpecificOrganizationData, setEnviroSpecificOrganizationData] = useRecoilState(enviroSpecificOrganizationDataStateAtom);
  const enviroSpecificOrganizationFiltersRef = useRef(enviroSpecificOrganizationFilters);

  // ---------- Enviro specific individual (detail view of one row) ----------
  const [enviroSpecificIndividualLoading, setEnviroSpecificIndividualLoading] = useRecoilState(enviroSpecificIndividualLoadingStateAtom);
  const [enviroSpecificIndividualError, setEnviroSpecificIndividualError] = useRecoilState(enviroSpecificIndividualErrorStateAtom);
  const [enviroSpecificIndividualFilters, setEnviroSpecificIndividualFilters] = useRecoilState(enviroSpecificIndividualFiltersStateAtom);
  const [enviroSpecificIndividualData, setEnviroSpecificIndividualData] = useRecoilState(enviroSpecificIndividualDataStateAtom);
  const enviroSpecificIndividualFiltersRef = useRef(enviroSpecificIndividualFilters);

  // ---------- Enviro specific sales person (detail view of one row) ----------
  const [enviroSpecificSalesPersonLoading, setEnviroSpecificSalesPersonLoading] = useRecoilState(enviroSpecificSalesPersonLoadingStateAtom);
  const [enviroSpecificSalesPersonError, setEnviroSpecificSalesPersonError] = useRecoilState(enviroSpecificSalesPersonErrorStateAtom);
  const [enviroSpecificSalesPersonFilters, setEnviroSpecificSalesPersonFilters] = useRecoilState(enviroSpecificSalesPersonFiltersStateAtom);
  const [enviroSpecificSalesPersonData, setEnviroSpecificSalesPersonData] = useRecoilState(enviroSpecificSalesPersonDataStateAtom);
  const enviroSpecificSalesPersonFiltersRef = useRef(enviroSpecificSalesPersonFilters);

  // Keep a ref copy of the filters so the fetch functions below can always read
  // the newest values (without being re-created on every render).
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    enviroIndividualsFiltersRef.current = enviroIndividualsFilters;
  }, [enviroIndividualsFilters]);

  useEffect(() => {
    enviroOrganizationsFiltersRef.current = enviroOrganizationsFilters;
  }, [enviroOrganizationsFilters]);

  useEffect(() => {
    enviroEmployeesFiltersRef.current = enviroEmployeesFilters;
  }, [enviroEmployeesFilters]);

  useEffect(() => {
    enviroSpecificOrganizationFiltersRef.current = enviroSpecificOrganizationFilters;
  }, [enviroSpecificOrganizationFilters]);

  useEffect(() => {
    enviroSpecificIndividualFiltersRef.current = enviroSpecificIndividualFilters;
  }, [enviroSpecificIndividualFilters]);

  useEffect(() => {
    enviroSpecificSalesPersonFiltersRef.current = enviroSpecificSalesPersonFilters;
  }, [enviroSpecificSalesPersonFilters]);

  // ---------- 5. One request helper per API group ----------
  // Each helper handles loading + error + toast for the state you give it.
  const getEnviro = useAnalyticsApi({ setLoading, setError });
  const getIndividuals = useAnalyticsApi({
    setLoading: setEnviroIndividualsLoading,
    setError: setEnviroIndividualsError,
  });
  const getOrganizations = useAnalyticsApi({
    setLoading: setEnviroOrganizationsLoading,
    setError: setEnviroOrganizationsError,
  });
  const getEmployees = useAnalyticsApi({
    setLoading: setEnviroEmployeesLoading,
    setError: setEnviroEmployeesError,
  });
  const getSpecificOrganization = useAnalyticsApi({
    setLoading: setEnviroSpecificOrganizationLoading,
    setError: setEnviroSpecificOrganizationError,
  });
  const getSpecificIndividual = useAnalyticsApi({
    setLoading: setEnviroSpecificIndividualLoading,
    setError: setEnviroSpecificIndividualError,
  });
  const getSpecificSalesPerson = useAnalyticsApi({
    setLoading: setEnviroSpecificSalesPersonLoading,
    setError: setEnviroSpecificSalesPersonError,
  });

  // ---------- 6. Builds the KPI cards from the API response ----------
  // Every field is checked first, so only counts the API really sends show up.
  const buildEnviroKPIs = (data) => {
    if (!data) return [];

    const kpis = [];

    if (data.employeeCount !== undefined) {
      kpis.push({ key: "employeeCount", title: "Total Employees", value: String(data.employeeCount ?? 0), trend: 0, accent: "info", icon: "Users" });
    }
    if (data.totalIndividuals !== undefined) {
      kpis.push({ key: "totalIndividuals", title: "Total Individuals", value: String(data.totalIndividuals ?? 0), trend: 0, accent: "success", icon: "UserGroup" });
    }
    if (data.totalOrganizations !== undefined) {
      kpis.push({ key: "totalOrganizations", title: "Total Organizations", value: String(data.totalOrganizations ?? 0), trend: 0, accent: "product", icon: "Building2" });
    }
    if (data.totalAgriculture !== undefined) {
      kpis.push({ key: "totalAgriculture", title: "Agriculture", value: String(data.totalAgriculture ?? 0), trend: 0, accent: "warning", icon: "Sprout" });
    }
    if (data.totalWasteManagement !== undefined) {
      kpis.push({ key: "totalWasteManagement", title: "Waste Management", value: String(data.totalWasteManagement ?? 0), trend: 0, accent: "secondary", icon: "Recycle" });
    }

    return kpis;
  };

  // ---------- 7. API 1: enviro analytics (KPI numbers + breakdown numbers) ----------
  // GET dashboard/enviroAnalytics
  const fetchEnviroAnalytics = useCallback(async (filterParams = {}, silent = false) => {
    const allFilters = { ...filtersRef.current, ...filterParams };

    const res = await getEnviro({
      path: "dashboard/enviroAnalytics",
      keys: ENVIRO_KEYS,
      filters: allFilters,
      label: "enviro analytics",
      silent,
    });
    if (!res) return null;

    setEnviroData(res);
    setKPIs(buildEnviroKPIs(res.data));
    setFilters(allFilters); // remember the filters that were used
    return res;
  }, [getEnviro, setEnviroData, setKPIs, setFilters]);

  // ---------- 8. API 2: enviro individuals list ----------
  // GET dashboard/getAllEnviroIndividualsAnalytics
  // The breakdown page calls it from the detail view like this:
  //   fetchEnviroIndividualsAnalytics({
  //     segment: selectedDetailId, typeOfProfile: subType, page, limit,
  //   })
  // NOTE: this API returns a LIST + pagination info, not KPI numbers.
  const fetchEnviroIndividualsAnalytics = useCallback(async (filterParams = {}, silent = false) => {
    const allFilters = { ...enviroIndividualsFiltersRef.current, ...filterParams };

    const res = await getIndividuals({
      path: "dashboard/getAllEnviroIndividualsAnalytics",
      keys: ENVIRO_KEYS,
      filters: allFilters,
      label: "enviro individuals analytics",
      silent,
    });
    if (!res) return null;

    setEnviroIndividualsData(res);
    setEnviroIndividualsFilters(allFilters);
    return res;
  }, [getIndividuals, setEnviroIndividualsData, setEnviroIndividualsFilters]);

  // ---------- 9. API 3: enviro organizations list ----------
  // GET dashboard/getAllEnviroOrganizationsAnalytics
  // Called from the detail view the same way as the individuals list:
  //   fetchEnviroOrganizationsAnalytics({
  //     sectionName: selectedDetailId, OrganizationType: subType, page, limit,
  //   })
  // NOTE: this API returns a LIST + pagination info, not KPI numbers.
  const fetchEnviroOrganizationsAnalytics = useCallback(async (filterParams = {}, silent = false) => {
    const allFilters = { ...enviroOrganizationsFiltersRef.current, ...filterParams };

    const res = await getOrganizations({
      path: "dashboard/getAllEnviroOrganizationsAnalytics",
      keys: ENVIRO_KEYS,
      filters: allFilters,
      label: "enviro organizations analytics",
      silent,
    });
    if (!res) return null;

    setEnviroOrganizationsData(res);
    setEnviroOrganizationsFilters(allFilters);
    return res;
  }, [getOrganizations, setEnviroOrganizationsData, setEnviroOrganizationsFilters]);

  // ---------- 10. API 4: enviro employees list ----------
  // GET dashboard/getAllemployeeEnviroAnalytics
  // Response = paginated list, each row:
  //   { _id, employeeName, reportingManagerName,
  //     totalIndividuals, totalOrganizations, successVisitCount }
  const fetchEnviroEmployeesAnalytics = useCallback(async (filterParams = {}, silent = false) => {
    const allFilters = { ...enviroEmployeesFiltersRef.current, ...filterParams };

    const res = await getEmployees({
      path: "dashboard/getAllemployeeEnviroAnalytics",
      keys: ENVIRO_KEYS,
      filters: allFilters,
      label: "enviro employees analytics",
      silent,
    });
    if (!res) return null;

    setEnviroEmployeesData(res);
    setEnviroEmployeesFilters(allFilters);
    return res;
  }, [getEmployees, setEnviroEmployeesData, setEnviroEmployeesFilters]);

  // ---------- 11. API 5: one enviro organization by id (detail view) ----------
  // GET dashboard/getSpecificOrganizatioData/:id?year=..
  // Called from the detail view like this:
  //   fetchSpecificEnviroOrganizationData(orgId, { year: "2025" })
  const fetchSpecificEnviroOrganizationData = useCallback(async (id, filterParams = {}, silent = false) => {
    if (!id) return null;

    const allFilters = { ...enviroSpecificOrganizationFiltersRef.current, ...filterParams };

    const res = await getSpecificOrganization({
      path: `dashboard/getSpecificOrganizatioData/${id}`,
      keys: ENVIRO_SPECIFIC_ORGANIZATION_KEYS,
      filters: allFilters,
      label: "specific enviro organization data",
      silent,
    });
    if (!res) return null;

    setEnviroSpecificOrganizationData(res);
    setEnviroSpecificOrganizationFilters(allFilters);
    return res;
  }, [getSpecificOrganization, setEnviroSpecificOrganizationData, setEnviroSpecificOrganizationFilters]);

  // ---------- API 6: one enviro individual by id (detail view) ----------
  // GET dashboard/getEnviroSpecificIndividualData/:id?year=..
  // Called from the detail view like this:
  //   fetchSpecificEnviroIndividualData(individualId, { year: "2025" })
  // NOTE: the id is a path parameter, `year` is the only query parameter.
  const fetchSpecificEnviroIndividualData = useCallback(async (id, filterParams = {}, silent = false) => {
    if (!id) return null;

    const allFilters = { ...enviroSpecificIndividualFiltersRef.current, ...filterParams };

    const res = await getSpecificIndividual({
      path: `dashboard/getEnviroSpecificIndividualData/${id}`,
      keys: ENVIRO_SPECIFIC_INDIVIDUAL_KEYS,
      filters: allFilters,
      label: "specific enviro individual data",
      silent,
    });
    if (!res) return null;

    setEnviroSpecificIndividualData(res);
    setEnviroSpecificIndividualFilters(allFilters);
    return res;
  }, [getSpecificIndividual, setEnviroSpecificIndividualData, setEnviroSpecificIndividualFilters]);

  // ---------- API 7: one enviro sales person by id (detail view) ----------
  // GET dashboard/getEnviroSpecificSalesPersonData/:id?year=..
  // Called from the detail view like this:
  //   fetchSpecificEnviroSalesPersonData(salesPersonId, { year: "2025" })
  // NOTE: the id is a path parameter, `year` is the only query parameter.
  const fetchSpecificEnviroSalesPersonData = useCallback(async (id, filterParams = {}, silent = false) => {
    if (!id) return null;

    const allFilters = { ...enviroSpecificSalesPersonFiltersRef.current, ...filterParams };

    const res = await getSpecificSalesPerson({
      path: `dashboard/getEnviroSpecificSalesPersonData/${id}`,
      keys: ENVIRO_SPECIFIC_SALESPERSON_KEYS,
      filters: allFilters,
      label: "specific enviro sales person data",
      silent,
    });
    if (!res) return null;

    setEnviroSpecificSalesPersonData(res);
    setEnviroSpecificSalesPersonFilters(allFilters);
    return res;
  }, [getSpecificSalesPerson, setEnviroSpecificSalesPersonData, setEnviroSpecificSalesPersonFilters]);

  // ---------- 12. Filter helpers ----------
  const resetFilters = useCallback(() => {
    setFilters(EMPTY_ENVIRO_FILTERS);
    filtersRef.current = EMPTY_ENVIRO_FILTERS;
  }, [setFilters]);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      filtersRef.current = newFilters;
      return newFilters;
    });
  }, [setFilters]);

  const resetEnviroIndividualsFilters = useCallback(() => {
    setEnviroIndividualsFilters(EMPTY_ENVIRO_FILTERS);
    enviroIndividualsFiltersRef.current = EMPTY_ENVIRO_FILTERS;
  }, [setEnviroIndividualsFilters]);

  const updateEnviroIndividualsFilter = useCallback((key, value) => {
    setEnviroIndividualsFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      enviroIndividualsFiltersRef.current = newFilters;
      return newFilters;
    });
  }, [setEnviroIndividualsFilters]);

  const resetEnviroOrganizationsFilters = useCallback(() => {
    setEnviroOrganizationsFilters(EMPTY_ENVIRO_FILTERS);
    enviroOrganizationsFiltersRef.current = EMPTY_ENVIRO_FILTERS;
  }, [setEnviroOrganizationsFilters]);

  const updateEnviroOrganizationsFilter = useCallback((key, value) => {
    setEnviroOrganizationsFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      enviroOrganizationsFiltersRef.current = newFilters;
      return newFilters;
    });
  }, [setEnviroOrganizationsFilters]);

  const resetEnviroEmployeesFilters = useCallback(() => {
    setEnviroEmployeesFilters(EMPTY_ENVIRO_FILTERS);
    enviroEmployeesFiltersRef.current = EMPTY_ENVIRO_FILTERS;
  }, [setEnviroEmployeesFilters]);

  const updateEnviroEmployeesFilter = useCallback((key, value) => {
    setEnviroEmployeesFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      enviroEmployeesFiltersRef.current = newFilters;
      return newFilters;
    });
  }, [setEnviroEmployeesFilters]);

  const resetEnviroSpecificOrganizationFilters = useCallback(() => {
    const clearedFilters = { year: "" };
    setEnviroSpecificOrganizationFilters(clearedFilters);
    enviroSpecificOrganizationFiltersRef.current = clearedFilters;
  }, [setEnviroSpecificOrganizationFilters]);

  const updateEnviroSpecificOrganizationFilter = useCallback((key, value) => {
    setEnviroSpecificOrganizationFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      enviroSpecificOrganizationFiltersRef.current = newFilters;
      return newFilters;
    });
  }, [setEnviroSpecificOrganizationFilters]);

  const resetEnviroSpecificIndividualFilters = useCallback(() => {
    const clearedFilters = { year: "" };
    setEnviroSpecificIndividualFilters(clearedFilters);
    enviroSpecificIndividualFiltersRef.current = clearedFilters;
  }, [setEnviroSpecificIndividualFilters]);

  const updateEnviroSpecificIndividualFilter = useCallback((key, value) => {
    setEnviroSpecificIndividualFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      enviroSpecificIndividualFiltersRef.current = newFilters;
      return newFilters;
    });
  }, [setEnviroSpecificIndividualFilters]);

  const resetEnviroSpecificSalesPersonFilters = useCallback(() => {
    const clearedFilters = { year: "" };
    setEnviroSpecificSalesPersonFilters(clearedFilters);
    enviroSpecificSalesPersonFiltersRef.current = clearedFilters;
  }, [setEnviroSpecificSalesPersonFilters]);

  const updateEnviroSpecificSalesPersonFilter = useCallback((key, value) => {
    setEnviroSpecificSalesPersonFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      enviroSpecificSalesPersonFiltersRef.current = newFilters;
      return newFilters;
    });
  }, [setEnviroSpecificSalesPersonFilters]);

  // ---------- 13. Reset helpers (clear the saved data) ----------
  const resetEnviroData = useCallback(() => {
    setEnviroData(null);
    setKPIs([]);
  }, [setEnviroData, setKPIs]);

  const resetEnviroIndividualsData = useCallback(() => {
    setEnviroIndividualsData(null);
  }, [setEnviroIndividualsData]);

  const resetEnviroOrganizationsData = useCallback(() => {
    setEnviroOrganizationsData(null);
  }, [setEnviroOrganizationsData]);

  const resetEnviroEmployeesData = useCallback(() => {
    setEnviroEmployeesData(null);
  }, [setEnviroEmployeesData]);

  const resetEnviroSpecificOrganizationData = useCallback(() => {
    setEnviroSpecificOrganizationData(null);
  }, [setEnviroSpecificOrganizationData]);

  const resetEnviroSpecificIndividualData = useCallback(() => {
    setEnviroSpecificIndividualData(null);
  }, [setEnviroSpecificIndividualData]);

  const resetEnviroSpecificSalesPersonData = useCallback(() => {
    setEnviroSpecificSalesPersonData(null);
  }, [setEnviroSpecificSalesPersonData]);

  // ---------- 14. What the page gets ----------
  return {
    // main enviro analytics
    loading,
    error,
    filters,
    updateFilter,
    resetFilters,
    enviroData,
    kpis,
    fetchEnviroAnalytics,
    resetEnviroData,

    // enviro individuals list
    enviroIndividualsLoading,
    enviroIndividualsError,
    enviroIndividualsFilters,
    updateEnviroIndividualsFilter,
    resetEnviroIndividualsFilters,
    enviroIndividualsData,
    fetchEnviroIndividualsAnalytics,
    resetEnviroIndividualsData,

    // enviro organizations list
    enviroOrganizationsLoading,
    enviroOrganizationsError,
    enviroOrganizationsFilters,
    updateEnviroOrganizationsFilter,
    resetEnviroOrganizationsFilters,
    enviroOrganizationsData,
    fetchEnviroOrganizationsAnalytics,
    resetEnviroOrganizationsData,

    // enviro employees list
    enviroEmployeesLoading,
    enviroEmployeesError,
    enviroEmployeesFilters,
    updateEnviroEmployeesFilter,
    resetEnviroEmployeesFilters,
    enviroEmployeesData,
    fetchEnviroEmployeesAnalytics,
    resetEnviroEmployeesData,

    // enviro specific organization (one row detail)
    enviroSpecificOrganizationLoading,
    enviroSpecificOrganizationError,
    enviroSpecificOrganizationFilters,
    updateEnviroSpecificOrganizationFilter,
    resetEnviroSpecificOrganizationFilters,
    enviroSpecificOrganizationData,
    fetchSpecificEnviroOrganizationData,
    resetEnviroSpecificOrganizationData,

    // enviro specific individual (one row detail)
    // GET dashboard/getEnviroSpecificIndividualData/:id?year=..
    enviroSpecificIndividualLoading,
    enviroSpecificIndividualError,
    enviroSpecificIndividualFilters,
    updateEnviroSpecificIndividualFilter,
    resetEnviroSpecificIndividualFilters,
    enviroSpecificIndividualData,
    fetchSpecificEnviroIndividualData,
    resetEnviroSpecificIndividualData,

    // enviro specific sales person (one row detail)
    // GET dashboard/getEnviroSpecificSalesPersonData/:id?year=..
    enviroSpecificSalesPersonLoading,
    enviroSpecificSalesPersonError,
    enviroSpecificSalesPersonFilters,
    updateEnviroSpecificSalesPersonFilter,
    resetEnviroSpecificSalesPersonFilters,
    enviroSpecificSalesPersonData,
    fetchSpecificEnviroSalesPersonData,
    resetEnviroSpecificSalesPersonData,
  };
};

export default useAllSalesEnviroAnalytics;
