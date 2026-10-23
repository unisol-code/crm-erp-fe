import { useState } from "react";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";

import useFetch from "../../useFetch";
import conf from "../../../config";
import {
  enviroTargetSheetDetailsAtom,productWiseTargetSheetStateAtom
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



  const resetEnviroTargetSheetDetails = () => {
    setEnviroTargetSheetDetails(null);
  };

  

  const resetProductWiseTargetSheetDetails = () => {
    setProductWiseTargetSheetDetails(null);
  };

return {
    loading,
    error,
    createEnviroTargetSheet,
    enviroTargetSheetDetails,productWiseTargetSheetDetails,
    fetchEnviroProductWiseTargetSheet,
    fetchEnviroProductWiseTargetSheetById,
    resetEnviroTargetSheetDetails,
    resetProductWiseTargetSheetDetails,
  };
};

export default useEnviroTargetSheetExecutive;
