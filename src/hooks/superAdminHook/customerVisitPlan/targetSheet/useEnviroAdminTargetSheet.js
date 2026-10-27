import { useState } from "react";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";

import useFetch from "../../../../hooks/useFetch";
import conf from "../../../../config";
import {
  enviroTeamWiseTargetSheetAtom,
  enviroAdminProductWiseTargetSheetListAtom,
  enviroAdminProductWiseTargetSheetByIdAtom,
  enviroAdminServiceWiseTargetSheetListAtom,
  enviroAdminServiceWiseTargetSheetByIdAtom,
  enviroAdminProjectWiseTargetSheetListAtom,
  enviroAdminProjectWiseTargetSheetByIdAtom,
  enviroAdminProductUniversalTargetSheetAtom,
  enviroAdminServiceUniversalTargetSheetAtom,
  enviroAdminProjectUniversalTargetSheetAtom,
  enviroAdminMyApprovalQueueAtom,
  enviroTargetSheetsEmployeeAtom,
} from "../../../../state/superAdminState/customerVisitPlan/targetSheet/enviroAdminTargetSheetState";

const useEnviroAdminTargetSheet = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [enviroTeamWiseTargetSheet, setEnviroTeamWiseTargetSheet] =
    useRecoilState(enviroTeamWiseTargetSheetAtom);
  const [enviroAdminProductWiseTargetSheetList, setEnviroAdminProductWiseTargetSheetList] =
    useRecoilState(enviroAdminProductWiseTargetSheetListAtom);
  const [enviroAdminProductWiseTargetSheetById, setEnviroAdminProductWiseTargetSheetById] =
    useRecoilState(enviroAdminProductWiseTargetSheetByIdAtom);
  const [enviroAdminServiceWiseTargetSheetList, setEnviroAdminServiceWiseTargetSheetList] =
    useRecoilState(enviroAdminServiceWiseTargetSheetListAtom);
  const [enviroAdminServiceWiseTargetSheetById, setEnviroAdminServiceWiseTargetSheetById] =
    useRecoilState(enviroAdminServiceWiseTargetSheetByIdAtom);
  const [enviroAdminProjectWiseTargetSheetList, setEnviroAdminProjectWiseTargetSheetList] =
    useRecoilState(enviroAdminProjectWiseTargetSheetListAtom);
  const [enviroAdminProjectWiseTargetSheetById, setEnviroAdminProjectWiseTargetSheetById] =
    useRecoilState(enviroAdminProjectWiseTargetSheetByIdAtom);
  const [enviroAdminProductUniversalTargetSheet, setEnviroAdminProductUniversalTargetSheet] =
    useRecoilState(enviroAdminProductUniversalTargetSheetAtom);
  const [enviroAdminServiceUniversalTargetSheet, setEnviroAdminServiceUniversalTargetSheet] =
    useRecoilState(enviroAdminServiceUniversalTargetSheetAtom);
  const [enviroAdminProjectUniversalTargetSheet, setEnviroAdminProjectUniversalTargetSheet] =
    useRecoilState(enviroAdminProjectUniversalTargetSheetAtom);
  const [enviroAdminMyApprovalQueue, setEnviroAdminMyApprovalQueue] =
    useRecoilState(enviroAdminMyApprovalQueueAtom);
  const [enviroTargetSheetsEmployee, setEnviroTargetSheetsEmployee] =
    useRecoilState(enviroTargetSheetsEmployeeAtom);

  // GET /api/AdminenviroTargetSheet/enviro-show-team-wise-targetsheet
  const fetchEnviroTeamWiseTargetSheet = async (sheetType,year,page, limit, _id) => {
    setLoading(true);
    setError(null);
    try {
        const params = new URLSearchParams();
      if (sheetType) params.append("sheetType", sheetType);
      if (year) params.append("year", year);
      if (page) params.append("page", page);
      if (limit) params.append("limit", limit);
      if (_id) params.append("_id", _id);
      const query = params.toString();
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}AdminenviroTargetSheet/enviro-show-team-wise-targetsheet${query ? `?${query}` : ""}`,
        // data: payload || {},
      });
      if (res) {
        setEnviroTeamWiseTargetSheet(res);
        return res;
      }
      throw new Error(res?.message || "Failed to fetch enviro team wise target sheet");
    } catch (err) {
      console.error("Error fetching enviro team wise target sheet:", err);
      setError(err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error while fetching enviro team wise target sheet"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resetEnviroTeamWiseTargetSheet = () => {
    setEnviroTeamWiseTargetSheet(null);
  };

  // GET /api/AdminenviroTargetSheet/Admin-product-wise-targetSheet
  const fetchAdminProductWiseTargetSheet = async (year, page, limit, employeeId) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (year) params.append("year", year);
      if (page) params.append("page", page);
      if (limit) params.append("limit", limit);
      if (employeeId) params.append("employeeId", employeeId);
      const query = params.toString();
      const url = `${conf.apiBaseUrl}AdminenviroTargetSheet/Admin-product-wise-targetSheet${
        query ? `?${query}` : ""
      }`;
      const res = await fetchData({ method: "GET", url });
      if (res) {
        setEnviroAdminProductWiseTargetSheetList(res);
        return res;
      }
      throw new Error(res?.message || "Failed to fetch admin enviro product target sheet");
    } catch (err) {
      console.error("Error fetching admin enviro product target sheet:", err);
      setError(err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error while fetching admin enviro product target sheet"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  // GET /api/AdminenviroTargetSheet/Admin-product-wise-targetSheetbyId/:id
  const fetchAdminProductWiseTargetSheetById = async (id) => {
    if (!id) return null;
    setLoading(true);
    setError(null);
    try {
      const url = `${conf.apiBaseUrl}AdminenviroTargetSheet/Admin-product-wise-targetSheetbyId/${id}`;
      const res = await fetchData({ method: "GET", url });
      if (res) {
        setEnviroAdminProductWiseTargetSheetById(res?.data ?? res);
        return res;
      }
      throw new Error(res?.message || "Failed to fetch admin enviro product target sheet by ID");
    } catch (err) {
      console.error("Error fetching admin enviro product target sheet by ID:", err);
      setError(err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error while fetching admin enviro product target sheet"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resetAdminProductWiseTargetSheetList = () => {
    setEnviroAdminProductWiseTargetSheetList(null);
  };
  const resetAdminProductWiseTargetSheetById = () => {
    setEnviroAdminProductWiseTargetSheetById(null);
  };

  // GET /api/AdminenviroTargetSheet/Admin-service-individual-organization-wise-targetsheet
  const fetchAdminServiceWiseTargetSheet = async (year, page, limit, employeeId) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (year) params.append("year", year);
      if (page) params.append("page", page);
      if (limit) params.append("limit", limit);
      if (employeeId) params.append("employeeId", employeeId);
      const query = params.toString();
      const url = `${conf.apiBaseUrl}AdminenviroTargetSheet/Admin-service-individual-organization-wise-targetsheet${
        query ? `?${query}` : ""
      }`;
      const res = await fetchData({ method: "GET", url });
      if (res) {
        setEnviroAdminServiceWiseTargetSheetList(res);
        return res;
      }
      throw new Error(res?.message || "Failed to fetch admin enviro service target sheet");
    } catch (err) {
      console.error("Error fetching admin enviro service target sheet:", err);
      setError(err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error while fetching admin enviro service target sheet"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  // GET /api/AdminenviroTargetSheet/Admin-service-individual-organization-wise-targetsheetbyId/:id
  const fetchAdminServiceWiseTargetSheetById = async (id) => {
    if (!id) return null;
    setLoading(true);
    setError(null);
    try {
      const url = `${conf.apiBaseUrl}AdminenviroTargetSheet/Admin-service-individual-organization-wise-targetsheetbyId/${id}`;
      const res = await fetchData({ method: "GET", url });
      if (res) {
        setEnviroAdminServiceWiseTargetSheetById(res?.data ?? res);
        return res;
      }
      throw new Error(res?.message || "Failed to fetch admin enviro service target sheet by ID");
    } catch (err) {
      console.error("Error fetching admin enviro service target sheet by ID:", err);
      setError(err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error while fetching admin enviro service target sheet"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resetAdminServiceWiseTargetSheetList = () => {
    setEnviroAdminServiceWiseTargetSheetList(null);
  };
  const resetAdminServiceWiseTargetSheetById = () => {
    setEnviroAdminServiceWiseTargetSheetById(null);
  };

  // GET /api/AdminenviroTargetSheet/Admin-project-individual-organization-wise-targetsheet
  const fetchAdminProjectWiseTargetSheet = async (year, page, limit, employeeId) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (year) params.append("year", year);
      if (page) params.append("page", page);
      if (limit) params.append("limit", limit);
      if (employeeId) params.append("employeeId", employeeId);
      const query = params.toString();
      const url = `${conf.apiBaseUrl}AdminenviroTargetSheet/Admin-project-individual-organization-wise-targetsheet${
        query ? `?${query}` : ""
      }`;
      const res = await fetchData({ method: "GET", url });
      if (res) {
        setEnviroAdminProjectWiseTargetSheetList(res);
        return res;
      }
      throw new Error(res?.message || "Failed to fetch admin enviro project target sheet");
    } catch (err) {
      console.error("Error fetching admin enviro project target sheet:", err);
      setError(err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error while fetching admin enviro project target sheet"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  // GET /api/AdminenviroTargetSheet/Admin-project-individual-organization-wise-targetsheetbyId/:id
  const fetchAdminProjectWiseTargetSheetById = async (id) => {
    if (!id) return null;
    setLoading(true);
    setError(null);
    try {
      const url = `${conf.apiBaseUrl}AdminenviroTargetSheet/Admin-project-individual-organization-wise-targetsheetbyId/${id}`;
      const res = await fetchData({ method: "GET", url });
      if (res) {
        setEnviroAdminProjectWiseTargetSheetById(res?.data ?? res);
        return res;
      }
      throw new Error(res?.message || "Failed to fetch admin enviro project target sheet by ID");
    } catch (err) {
      console.error("Error fetching admin enviro project target sheet by ID:", err);
      setError(err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error while fetching admin enviro project target sheet"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resetAdminProjectWiseTargetSheetList = () => {
    setEnviroAdminProjectWiseTargetSheetList(null);
  };
  const resetAdminProjectWiseTargetSheetById = () => {
    setEnviroAdminProjectWiseTargetSheetById(null);
  };

  // GET /api/AdminenviroTargetSheet/product-base-universal-targetsheet/:id
  const fetchAdminProductUniversalTargetSheet = async (id) => {
    if (!id) return null;
    setLoading(true);
    setError(null);
    try {
      const url = `${conf.apiBaseUrl}AdminenviroTargetSheet/product-base-universal-targetsheet/${id}`;
      const res = await fetchData({ method: "GET", url });
      if (res) {
        setEnviroAdminProductUniversalTargetSheet(res);
        return res;
      }
      throw new Error(res?.message || "Failed to fetch admin enviro product universal target sheet");
    } catch (err) {
      console.error("Error fetching admin enviro product universal target sheet:", err);
      setError(err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error while fetching admin enviro product universal target sheet"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  // GET /api/AdminenviroTargetSheet/service-base-universal-targetsheet/:id
  const fetchAdminServiceUniversalTargetSheet = async (id) => {
    if (!id) return null;
    setLoading(true);
    setError(null);
    try {
      const url = `${conf.apiBaseUrl}AdminenviroTargetSheet/service-base-universal-targetsheet/${id}`;
      const res = await fetchData({ method: "GET", url });
      if (res) {
        setEnviroAdminServiceUniversalTargetSheet(res);
        return res;
      }
      throw new Error(res?.message || "Failed to fetch admin enviro service universal target sheet");
    } catch (err) {
      console.error("Error fetching admin enviro service universal target sheet:", err);
      setError(err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error while fetching admin enviro service universal target sheet"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  // GET /api/AdminenviroTargetSheet/project-base-universal-targetsheet/:id
  const fetchAdminProjectUniversalTargetSheet = async (id) => {
    if (!id) return null;
    setLoading(true);
    setError(null);
    try {
      const url = `${conf.apiBaseUrl}AdminenviroTargetSheet/project-base-universal-targetsheet/${id}`;
      const res = await fetchData({ method: "GET", url });
      if (res) {
        setEnviroAdminProjectUniversalTargetSheet(res);
        return res;
      }
      throw new Error(res?.message || "Failed to fetch admin enviro project universal target sheet");
    } catch (err) {
      console.error("Error fetching admin enviro project universal target sheet:", err);
      setError(err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error while fetching admin enviro project universal target sheet"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resetAdminProductUniversalTargetSheet = () => {
    setEnviroAdminProductUniversalTargetSheet(null);
  };
  const resetAdminServiceUniversalTargetSheet = () => {
    setEnviroAdminServiceUniversalTargetSheet(null);
  };
  const resetAdminProjectUniversalTargetSheet = () => {
    setEnviroAdminProjectUniversalTargetSheet(null);
  };

  // PUT /api/AdminenviroTargetSheet/Admin-review-targetsheet/:id
  const reviewEnviroTargetSheet = async (id, payload) => {
    if (!id) {
      toast.error("Target sheet id is required to review");
      return false;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetchData({
        method: "PUT",
        url: `${conf.apiBaseUrl}AdminenviroTargetSheet/Admin-review-targetsheet/${id}`,
        data: payload || {},
      });
      if (res) {
        toast.success(res?.message || "Enviro target sheet reviewed successfully");
        return res;
      }
      throw new Error(res?.message || "Failed to review enviro target sheet");
    } catch (err) {
      console.error("Error reviewing enviro target sheet:", err);
      setError(err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to review enviro target sheet"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  // GET /api/AdminenviroTargetSheet/Admin-my-approval-queue
  const fetchEnviroAdminMyApprovalQueue = async (paramsQuery = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      Object.entries(paramsQuery || {}).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value);
        }
      });
      const query = params.toString();
      const url = `${conf.apiBaseUrl}AdminenviroTargetSheet/Admin-my-approval-queue${
        query ? `?${query}` : ""
      }`;
      const res = await fetchData({ method: "GET", url });
      if (res) {
        setEnviroAdminMyApprovalQueue(res);
        return res;
      }
      throw new Error(res?.message || "Failed to fetch enviro admin approval queue");
    } catch (err) {
      console.error("Error fetching enviro admin approval queue:", err);
      setError(err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch enviro admin approval queue"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resetEnviroAdminMyApprovalQueue = () => {
    setEnviroAdminMyApprovalQueue(null);
  };

  // GET /api/AdminenviroTargetSheet/enviro-target-sheets-employee
  const fetchEnviroTargetSheetsEmployee = async (paramsQuery = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      Object.entries(paramsQuery || {}).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value);
        }
      });
      const query = params.toString();
      const url = `${conf.apiBaseUrl}AdminenviroTargetSheet/enviro-target-sheets-employee${
        query ? `?${query}` : ""
      }`;
      const res = await fetchData({ method: "GET", url });
      if (res) {
        setEnviroTargetSheetsEmployee(res);
        return res;
      }
      throw new Error(res?.message || "Failed to fetch enviro target sheets employee");
    } catch (err) {
      console.error("Error fetching enviro target sheets employee:", err);
      setError(err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch enviro target sheets employee"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resetEnviroTargetSheetsEmployee = () => {
    setEnviroTargetSheetsEmployee(null);
  };

  return {
    loading,
    error,
    enviroTeamWiseTargetSheet,
    fetchEnviroTeamWiseTargetSheet,
    resetEnviroTeamWiseTargetSheet,
    enviroAdminProductWiseTargetSheetList,
    fetchAdminProductWiseTargetSheet,
    fetchAdminProductWiseTargetSheetById,
    enviroAdminProductWiseTargetSheetById,
    resetAdminProductWiseTargetSheetList,
    resetAdminProductWiseTargetSheetById,
    enviroAdminServiceWiseTargetSheetList,
    fetchAdminServiceWiseTargetSheet,
    fetchAdminServiceWiseTargetSheetById,
    enviroAdminServiceWiseTargetSheetById,
    resetAdminServiceWiseTargetSheetList,
    resetAdminServiceWiseTargetSheetById,
    enviroAdminProjectWiseTargetSheetList,
    fetchAdminProjectWiseTargetSheet,
    fetchAdminProjectWiseTargetSheetById,
    enviroAdminProjectWiseTargetSheetById,
    resetAdminProjectWiseTargetSheetList,
    resetAdminProjectWiseTargetSheetById,
    enviroAdminProductUniversalTargetSheet,
    fetchAdminProductUniversalTargetSheet,
    resetAdminProductUniversalTargetSheet,
    enviroAdminServiceUniversalTargetSheet,
    fetchAdminServiceUniversalTargetSheet,
    resetAdminServiceUniversalTargetSheet,
    enviroAdminProjectUniversalTargetSheet,
    fetchAdminProjectUniversalTargetSheet,
    resetAdminProjectUniversalTargetSheet,
    reviewEnviroTargetSheet,
    enviroAdminMyApprovalQueue,
    fetchEnviroAdminMyApprovalQueue,
    resetEnviroAdminMyApprovalQueue,
    enviroTargetSheetsEmployee,
    fetchEnviroTargetSheetsEmployee,
    resetEnviroTargetSheetsEmployee,
  };
};

export default useEnviroAdminTargetSheet;
