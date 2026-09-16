import { useRecoilState } from "recoil";
import { useState } from "react";
import useFetch from "../../useFetch";
import conf from "../../../config/index";
import { toast } from "react-toastify";
import {
  targetSheetListStateAtom,
  targetSheetDetailsAtom,
  yearWiseProductTargetSheetStateAtom,
} from "../../../state/salesExecutiveState/customerVisitPlan/targetSheetState";

const useTargetSheet = () => {
  const [targetSheetList, setTargetSheetList] = useRecoilState(
    targetSheetListStateAtom
  );
  const [targetSheetDetails, setTargetSheetDetails] = useRecoilState(
    targetSheetDetailsAtom
  );
  const [yearWiseProductTargetSheet, setYearWiseProductTargetSheet] =
    useRecoilState(yearWiseProductTargetSheetStateAtom);
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(false);
  const [yearWiseProductTargetLoading, setYearWiseProductTargetLoading] =
    useState(false);
  const fetchTargetSheetYearList = async () => {
    // console.log(filters);
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}targets/showYearWiseTargetSheet`,
      });
      if (res) {
        setTargetSheetList(res);
      }
    } catch (err) {
      console.error("Error while fetching target sheet list:", err);
      toast.error("Failed to fetch target sheet list");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetches the year wise product target sheet list.
   * Query params expected by the API: { year, page = 1, limit = 10 }
   */
  const fetchYearWiseProductTargetSheet = async ({
    year,
    page = 1,
    limit = 10,
  } = {}) => {
    setYearWiseProductTargetLoading(true);
    try {
      const params = new URLSearchParams();
      if (year) params.append("year", year);
      params.append("page", page);
      params.append("limit", limit);
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}targets/showYearWiseProductTargetSheet?${params.toString()}`,
      });
      if (res) {
        setYearWiseProductTargetSheet(res);
        return res;
      }
    } catch (err) {
      console.error("Error while fetching year wise product target sheet:", err);
      toast.error("Failed to fetch year wise product target sheet");
    } finally {
      setYearWiseProductTargetLoading(false);
    }
  };

  const fetchOrganizationNames = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}targets/organizationsdropdown`,
      });
      if (res) {
        setOrganizationList(res);
      }
    } catch (err) {
      console.error("Error while fetching Organization List:", err);
      toast.error("Failed to fetch Organization List");
    } finally {
      setLoading(false);
    }
  };
  const createTargetSheet = async (data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}targets/create-targetsheet`,
        data: data,
      });
      if (res) {
        toast.success(res?.message);
        return res;
      } else {
        throw new Error(res?.message);
      }
    } catch (error) {
      console.error("Error creating target sheet:", error);
      toast.error("Error while creating target sheet");
    } finally {
      setLoading(false);
    }
  };
  const fetchTargetSheetById = async (id) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}targets/get-targetsheetbyid/${id}`,
      });
      if (res) {
        setTargetSheetDetails(res);
      }
    } catch (err) {
      console.error("Error while fetching target sheet details:", err);
      toast.error("Failed to fetch taregt sheet details");
    } finally {
      setLoading(false);
    }
  };
  const updateTargetSheet = async (id, data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "PUT",
        url: `${conf.apiBaseUrl}targets/update-targetsheet/${id}`,
        data: data,
      });
      if (res) {
        toast.success(res?.message);
      } else {
        throw new Error(res?.message);
      }
    } catch (error) {
      console.error("Error updating target sheet:", error);
      toast.error("Error while updating target sheet");
    } finally {
      setLoading(false);
    }
  };
  const resetTargetSheetDetails = () => {
    setTargetSheetDetails(null);
  };
  const resetYearWiseProductTargetSheet = () => {
    setYearWiseProductTargetSheet(null);
  };
  return {
    targetSheetList,
    loading,
    fetchTargetSheetYearList,
    createTargetSheet,
    targetSheetDetails,
    fetchTargetSheetById,
    updateTargetSheet,
    resetTargetSheetDetails,
    yearWiseProductTargetSheet,
    yearWiseProductTargetLoading,
    fetchYearWiseProductTargetSheet,
    resetYearWiseProductTargetSheet,
  };
};

export default useTargetSheet;
