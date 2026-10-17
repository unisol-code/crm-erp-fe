import { useState } from "react";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";
import useFetch from "../../../../hooks/useFetch.js";
import conf from "../../../../config/index";
import {
  allEmployeeListAtom,
  allEmployeeDetailsAtom,
  teamWiseTargetSheetListAtom,
  universalTargetSheetAtom,
} from "../../../../state/targetsheetAdmin/adminTargetSheetState";

const useAdminTargetSheet = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allEmployeeList, setAllEmployeeList] =
    useRecoilState(allEmployeeListAtom);
  const [allEmployeeDetails, setAllEmployeeDetails] =
    useRecoilState(allEmployeeDetailsAtom);
  const [teamWiseTargetSheetList, setTeamWiseTargetSheetList] =
    useRecoilState(teamWiseTargetSheetListAtom);
  const [universalTargetSheet, setUniversalTargetSheet] =
    useRecoilState(universalTargetSheetAtom);

  // GET /api/adminTargetSheet/get-allemployee
  // Response shape: { success: true, data: [{ employeeId, fullName }] }
  const fetchAllEmployeeList = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}adminTargetSheet/get-allemployee`,
      });
      if (res) {
        setAllEmployeeList(res?.data ?? []);
      }
    } catch (err) {
      console.error("Error fetching all employee list:", err);
      setError(err);
      toast.error("Failed to fetch employee list");
    } finally {
      setLoading(false);
    }
  };

  const resetAllEmployeeDetails = () => {
    setAllEmployeeDetails(null);
  };

  const resetTeamWiseTargetSheet = () => {
    setTeamWiseTargetSheetList(null);
  };

  // GET /api/adminTargetSheet/get-univerSalTargetSheet/:id
  const fetchUniversalTargetSheet = async (id) => {
    if (!id) {
      toast.error("Employee id is required to fetch universal target sheet");
      return;
    }
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}adminTargetSheet/get-univerSalTargetSheet/${id}`,
      });
      if (res) {
        setUniversalTargetSheet(res);
      }
    } catch (err) {
      console.error("Error fetching universal target sheet:", err);
      setError(err);
      toast.error("Failed to fetch universal target sheet");
    } finally {
      setLoading(false);
    }
  };

  const resetUniversalTargetSheet = () => {
    setUniversalTargetSheet(null);
  };

  // GET /api/adminTargetSheet/get-adminshowTeamWiseTargetSheet
  // Optional page/limit are appended only when provided.
  const fetchTeamWiseTargetSheetList = async (page, limit,_id) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (page) params.append("page", page);
      if (limit) params.append("limit", limit);
      if (_id) params.append("_id", _id);
      const query = params.toString();
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}adminTargetSheet/get-adminshowTeamWiseTargetSheet${query ? `?${query}` : ""}`,
      });
      if (res) {
        // Response has no `data` wrapper: { success, message, year, viewing,
        // hasOwnTarget, rows, teamTotal }. Store the whole object.
        setTeamWiseTargetSheetList(res);
      }
    } catch (err) {
      console.error("Error fetching team wise target sheet list:", err);
      setError(err);
      toast.error("Failed to fetch team wise target sheet list");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    allEmployeeList,
    allEmployeeDetails,
    fetchAllEmployeeList,
    resetAllEmployeeDetails,
    teamWiseTargetSheetList,
    fetchTeamWiseTargetSheetList,
    resetTeamWiseTargetSheet,
    universalTargetSheet,
    fetchUniversalTargetSheet,
    resetUniversalTargetSheet,
  };
};

export default useAdminTargetSheet;
