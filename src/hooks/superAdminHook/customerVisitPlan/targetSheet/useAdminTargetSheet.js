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
  idWiseTargetSheetAtom,
  employeewiseTargetSheetAtom,
  myApprovalQueueAtom,
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
  const [idWiseTargetSheet, setIdWiseTargetSheet] =
    useRecoilState(idWiseTargetSheetAtom);
  const [employeewiseTargetSheet, setEmployeewiseTargetSheet] =
    useRecoilState(employeewiseTargetSheetAtom);
  const [myApprovalQueue, setMyApprovalQueue] =
    useRecoilState(myApprovalQueueAtom);

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

  // GET /api/adminTargetSheet/showEmployeewiseTargetSheet/:id
  const fetchEmployeewiseTargetSheet = async (id) => {
    if (!id) {
      toast.error("Employee id is required to fetch employee-wise target sheet");
      return;
    }
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}adminTargetSheet/showEmployeewiseTargetSheet/${id}`,
      });
      if (res) {
        setEmployeewiseTargetSheet(res);
      }
    } catch (err) {
      console.error("Error fetching employee-wise target sheet:", err);
      setError(err);
      toast.error("Failed to fetch employee-wise target sheet");
    } finally {
      setLoading(false);
    }
  };

  const resetEmployeewiseTargetSheet = () => {
    setEmployeewiseTargetSheet(null);
  };

  // GET /api/adminTargetSheet/my-approval-queue?employeeId=...
  const fetchMyApprovalQueue = async ({ employeeId } = {}) => {
    if (!employeeId) {
      toast.error("Employee id is required to fetch my approval queue");
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (employeeId) params.append("employeeId", employeeId);
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}adminTargetSheet/my-approval-queue?${params.toString()}`,
      });
      if (res) {
        setMyApprovalQueue(res);
        return res;
      }
    } catch (err) {
      console.error("Error fetching my approval queue:", err);
      setError(err);
      toast.error("Failed to fetch my approval queue");
    } finally {
      setLoading(false);
    }
  };

  const resetMyApprovalQueue = () => {
    setMyApprovalQueue(null);
  };


  // GET /api/adminTargetSheet/get-showIdwiseTargetSheet/:id
  const fetchIdWiseTargetSheet = async (id, salesId) => {
    if (!id) {
      toast.error("Id is required to fetch id-wise target sheet");
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (salesId) {
        params.append("salesId", salesId);
      }
      const query = params.toString();

      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}adminTargetSheet/get-showIdwiseTargetSheet/${id}${query ? `?${query}` : ""}`,
      });
      if (res) {
        setIdWiseTargetSheet(res);
      }
    } catch (err) {
      console.error("Error fetching id-wise target sheet:", err);
      setError(err);
      toast.error("Failed to fetch id-wise target sheet");
    } finally {
      setLoading(false);
    }
  };

  const resetIdWiseTargetSheet = () => {
    setIdWiseTargetSheet(null);
  };

  // POST /api/adminTargetSheet/review-target-sheet/:id
  // Body: { action, remarks }  — e.g. action: "approve" | "reject"
  const reviewTargetSheet = async (id, { action, remarks } = {}) => {
    if (!id) {
      toast.error("Target sheet id is required to review");
      return false;
    }
    if (!action) {
      toast.error("Review action is required");
      return false;
    }
    setLoading(true);
    try {
      const res = await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}adminTargetSheet/review-target-sheet/${id}`,
        data: { action, remarks },
      });
      if (res) {
        toast.success(res?.message || "Target sheet reviewed successfully");
        return res;
      }
      return false;
    } catch (err) {
      console.error("Error reviewing target sheet:", err);
      setError(err);
      toast.error(err?.response?.data?.message || "Failed to review target sheet");
      return false;
    } finally {
      setLoading(false);
    }
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
    idWiseTargetSheet,
    fetchIdWiseTargetSheet,
    resetIdWiseTargetSheet,
    employeewiseTargetSheet,
    fetchEmployeewiseTargetSheet,
    resetEmployeewiseTargetSheet,
    myApprovalQueue,
    fetchMyApprovalQueue,
    resetMyApprovalQueue,
    reviewTargetSheet,
  };
};

export default useAdminTargetSheet;
