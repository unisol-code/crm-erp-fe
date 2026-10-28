import { useState } from "react";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";

import useFetch from "../../useFetch";
import conf from "../../../config";
import {
  enviroTargetSheetDetailsAtom,productWiseTargetSheetStateAtom,serviceIndividualOrganizationTargetSheetStateAtom,projectIndividualOrganizationTargetSheetStateAtom,teamWiseTargetSheetStateAtom,enviroUniversalTargetSheetStateAtom,enviroTargetQueueStateAtom
} from "../../../state/salesExecutiveState/customerVisitPlan/targetSheetState";

/**
 * =========================================================
 *  ENVIRO SOLUTION — EXECUTIVE TARGET SHEET
 * ---------------------------------------------------------
 *  Hook used by the EnviroSolution target sheet forms
 *  (product / project / service) to submit a new target sheet.
 * =========================================================
 */
const useEnviroTargetSheetExecutive = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [enviroTargetSheetDetails, setEnviroTargetSheetDetails] =
    useRecoilState(enviroTargetSheetDetailsAtom);
    const [productWiseTargetSheetDetails, setProductWiseTargetSheetDetails] =
    useRecoilState(productWiseTargetSheetStateAtom);
  const [serviceIndividualOrganizationTargetSheetDetails, setServiceIndividualOrganizationTargetSheetDetails] =
    useRecoilState(serviceIndividualOrganizationTargetSheetStateAtom);
  const [projectIndividualOrganizationTargetSheetDetails, setProjectIndividualOrganizationTargetSheetDetails] =
    useRecoilState(projectIndividualOrganizationTargetSheetStateAtom);
  const [teamWiseTargetSheetDetails, setTeamWiseTargetSheetDetails] =
    useRecoilState(teamWiseTargetSheetStateAtom);
    const [enviroUniversalTargetSheetDetails, setEnviroUniversalTargetSheetDetails] =
    useRecoilState(enviroUniversalTargetSheetStateAtom);
  const [enviroTargetQueueDetails, setEnviroTargetQueueDetails] =
    useRecoilState(enviroTargetQueueStateAtom);

  // POST /api/enviroTargetSheet/enviro-create-targetsheet
  const createEnviroTargetSheet = async (data) => {
    if (!data) {
      toast.error("Target sheet data is required");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}enviroTargetSheet/enviro-create-targetsheet`,
        data: data,
      });

      if (res) {
        setEnviroTargetSheetDetails(res?.data ?? res);
        toast.success(res?.message || "Enviro target sheet created successfully");
        return res;
      }

      throw new Error(res?.message || "Failed to create enviro target sheet");
    } catch (err) {
      console.error("Error creating enviro target sheet:", err);
      setError(err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error while creating enviro target sheet"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

// GET /api/enviroTargetSheet/individual-organization-wise-targetsheet
  const fetchEnviroProductWiseTargetSheet = async (year, page, limit) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (year) params.append("year", year);
      if (page) params.append("page", page);
      if (limit) params.append("limit", limit);

      const query = params.toString();
      const url = `${conf.apiBaseUrl}enviroTargetSheet/product-wise-targetsheet${
        query ? `?${query}` : ""
      }`;

      const res = await fetchData({
        method: "GET",
        url,
      });

      if (res) {
        setProductWiseTargetSheetDetails(res);
        toast.success(res?.message || "Enviro target sheet fetched successfully");
        return res;
      }

      throw new Error(res?.message || "Failed to fetch enviro target sheet");
    } catch (err) {
      console.error("Error fetching individual organization target sheet:", err);
      setError(err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error while fetching enviro target sheet"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  // GET /api/enviroTargetSheet/product-wise-targetsheetbyId/:id
  const fetchEnviroProductWiseTargetSheetById = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const url = `${conf.apiBaseUrl}enviroTargetSheet/product-wise-targetsheetbyId/${id}`;

      const res = await fetchData({
        method: "GET",
        url,
      });

      if (res) {
        setProductWiseTargetSheetDetails(res?.data ?? res);
        toast.success(res?.message || "Enviro target sheet fetched successfully");
        return res;
      }

      throw new Error(res?.message || "Failed to fetch enviro target sheet");
    } catch (err) {
      console.error("Error fetching enviro target sheet by ID:", err);
      setError(err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error while fetching enviro target sheet"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };



  // PUT /api/enviroTargetSheet/update-targetsheet/:id
  const updateEnviroTargetSheet = async (id, data) => {
    if (!id) {
      toast.error("Target sheet ID is required");
      return null;
    }

    if (!data) {
      toast.error("Target sheet data is required");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetchData({
        method: "PUT",
        url: `${conf.apiBaseUrl}enviroTargetSheet/update-targetsheet/${id}`,
        data: data,
      });

      if (res) {
        toast.success(res?.message || "Enviro target sheet updated successfully");
        return res;
      }

      throw new Error(res?.message || "Failed to update enviro target sheet");
    } catch (err) {
      console.error("Error updating enviro target sheet:", err);
      setError(err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error while updating enviro target sheet"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };


  const resetEnviroTargetSheetDetails = () => {
    setEnviroTargetSheetDetails(null);
  };

  // GET /api/enviroTargetSheet/service-individual-organization-wise-targetsheet
  const fetchServiceIndividualOrganizationTargetSheet = async (year, page, limit) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (year) params.append("year", year);
      if (page) params.append("page", page);
      if (limit) params.append("limit", limit);

      const query = params.toString();
      const url = `${conf.apiBaseUrl}enviroTargetSheet/service-individual-organization-wise-targetsheet${
        query ? `?${query}` : ""
      }`;

      const res = await fetchData({
        method: "GET",
        url,
      });

      if (res) {
        setServiceIndividualOrganizationTargetSheetDetails(res);
        toast.success(res?.message || "Enviro service target sheet fetched successfully");
        return res;
      }

      throw new Error(res?.message || "Failed to fetch enviro service target sheet");
    } catch (err) {
      console.error("Error fetching service individual organization target sheet:", err);
      setError(err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error while fetching enviro service target sheet"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  // GET /api/enviroTargetSheet/service-individual-organization-wise-targetsheetbyId/:id
  const fetchServiceIndividualOrganizationTargetSheetById = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const url = `${conf.apiBaseUrl}enviroTargetSheet/service-individual-organization-wise-targetsheetbyId/${id}`;

      const res = await fetchData({
        method: "GET",
        url,
      });

      if (res) {
        setServiceIndividualOrganizationTargetSheetDetails(res?.data ?? res);
        toast.success(res?.message || "Enviro service target sheet fetched successfully");
        return res;
      }

      throw new Error(res?.message || "Failed to fetch enviro service target sheet");
    } catch (err) {
      console.error("Error fetching service individual organization target sheet by ID:", err);
      setError(err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error while fetching enviro service target sheet"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  

  const resetProductWiseTargetSheetDetails = () => {
    setProductWiseTargetSheetDetails(null);
  };

  const resetServiceIndividualOrganizationTargetSheetDetails = () => {
    setServiceIndividualOrganizationTargetSheetDetails(null);
  };

  const resetProjectIndividualOrganizationTargetSheetDetails = () => {
    setProjectIndividualOrganizationTargetSheetDetails(null);
  };

  // GET /api/enviroTargetSheet/project-individual-organization-wise-targetsheet
  const fetchProjectIndividualOrganizationTargetSheet = async (year, page, limit) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (year) params.append("year", year);
      if (page) params.append("page", page);
      if (limit) params.append("limit", limit);

      const query = params.toString();
      const url = `${conf.apiBaseUrl}enviroTargetSheet/project-individual-organization-wise-targetsheet${
        query ? `?${query}` : ""
      }`;

      const res = await fetchData({
        method: "GET",
        url,
      });

      if (res) {
        setProjectIndividualOrganizationTargetSheetDetails(res);
        toast.success(res?.message || "Enviro project target sheet fetched successfully");
        return res;
      }

      throw new Error(res?.message || "Failed to fetch enviro project target sheet");
    } catch (err) {
      console.error("Error fetching project individual organization target sheet:", err);
      setError(err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error while fetching enviro project target sheet"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  // GET /api/enviroTargetSheet/project-individual-organization-wise-targetsheetbyId/:id
  const fetchProjectIndividualOrganizationTargetSheetById = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const url = `${conf.apiBaseUrl}enviroTargetSheet/project-individual-organization-wise-targetsheetbyId/${id}`;

      const res = await fetchData({
        method: "GET",
        url,
      });

      if (res) {
        setProjectIndividualOrganizationTargetSheetDetails(res?.data ?? res);
        toast.success(res?.message || "Enviro project target sheet fetched successfully");
        return res;
      }

      throw new Error(res?.message || "Failed to fetch enviro project target sheet");
    } catch (err) {
      console.error("Error fetching project individual organization target sheet by ID:", err);
      setError(err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error while fetching enviro project target sheet"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  // GET /api/enviroTargetSheet/enviro-show-team-wise-targetsheet
  const fetchEnviroTeamWiseTargetSheet = async (sheetType, year, _id) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (sheetType) params.append("sheetType", sheetType);
      if (_id) params.append("_id", _id);
      if (year) params.append("year", year);

      const query = params.toString();
      const url = `${conf.apiBaseUrl}enviroTargetSheet/enviro-show-team-wise-targetsheet${
        query ? `?${query}` : ""
      }`;

      const res = await fetchData({
        method: "GET",
        url,
      });

      if (res) {
        setTeamWiseTargetSheetDetails(res?.data ?? res);
        toast.success(res?.message || "Enviro team wise target sheet fetched successfully");
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

  const resetTeamWiseTargetSheetDetails = () => {
    setTeamWiseTargetSheetDetails(null);
  };

  // GET /api/enviroTargetSheet/enviro-universal-targetsheet
  const fetchEnviroUniversalTargetSheet = async (targetSalesId) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (targetSalesId) params.append("targetSalesId", targetSalesId);

      const query = params.toString();
      const url = `${conf.apiBaseUrl}enviroTargetSheet/enviro-universal-targetsheet${
        query ? `?${query}` : ""
      }`;

      const res = await fetchData({
        method: "GET",
        url,
      });

      if (res) {
        setEnviroUniversalTargetSheetDetails(res?.data ?? res);
        toast.success(res?.message || "Enviro universal target sheet fetched successfully");
        return res;
      }

      throw new Error(res?.message || "Failed to fetch enviro universal target sheet");
    } catch (err) {
      console.error("Error fetching enviro universal target sheet:", err);
      setError(err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error while fetching enviro universal target sheet"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  // GET /api/enviroTargetSheet/queue
  const fetchEnviroTargetQueue = async (targetSalesId) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (targetSalesId) params.append("targetSalesId", targetSalesId);

      const query = params.toString();
      const url = `${conf.apiBaseUrl}enviroTargetSheet/queue${
        query ? `?${query}` : ""
      }`;

      const res = await fetchData({
        method: "GET",
        url,
      });

      if (res) {
        setEnviroTargetQueueDetails(res?.data ?? res);
        toast.success(res?.message || "Enviro target queue fetched successfully");
        return res;
      }

      throw new Error(res?.message || "Failed to fetch enviro target queue");
    } catch (err) {
      console.error("Error fetching enviro target queue:", err);
      setError(err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error while fetching enviro target queue"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resetEnviroUniversalTargetSheetDetails = () => {
    setEnviroUniversalTargetSheetDetails(null);
  };

  const resetEnviroTargetQueueDetails = () => {
    setEnviroTargetQueueDetails(null);
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

return {
    loading,
    error,
    createEnviroTargetSheet,
    updateEnviroTargetSheet,
    enviroTargetSheetDetails,productWiseTargetSheetDetails,
    fetchEnviroProductWiseTargetSheet,
    fetchEnviroProductWiseTargetSheetById,
    resetEnviroTargetSheetDetails,
    resetProductWiseTargetSheetDetails,
    serviceIndividualOrganizationTargetSheetDetails,
    fetchServiceIndividualOrganizationTargetSheet,
    fetchServiceIndividualOrganizationTargetSheetById,
    resetServiceIndividualOrganizationTargetSheetDetails,
    projectIndividualOrganizationTargetSheetDetails,
    fetchProjectIndividualOrganizationTargetSheet,
    fetchProjectIndividualOrganizationTargetSheetById,
    resetProjectIndividualOrganizationTargetSheetDetails,
    teamWiseTargetSheetDetails,
    fetchEnviroTeamWiseTargetSheet,
    resetTeamWiseTargetSheetDetails,
    enviroUniversalTargetSheetDetails,
    fetchEnviroUniversalTargetSheet,
    resetEnviroUniversalTargetSheetDetails,
    enviroTargetQueueDetails,
    fetchEnviroTargetQueue,
    resetEnviroTargetQueueDetails,
    reviewEnviroTargetSheet
  };
};

export default useEnviroTargetSheetExecutive;
