import { useRecoilState } from "recoil";
import { useState } from "react";
//Axios
import useFetch from "../../useFetch";
//baseURL
import conf from "../../../config";
//State

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { confirmAlert } from "../../../utils/alertToast";
import {
  getAdminAllIndividualAtom,
  getAdminIndividualByIDAtom,
  getAdminIndividualDashboardAtom,
} from "../../../state/superAdminDatabaseState/adminIndividualDBState/AdminIndividualDBState";

const useAdminIndividualDB = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(false);
  const [getAdminAllIndividualList, setGetAdminAllIndividualList] =
    useRecoilState(getAdminAllIndividualAtom);
  const [getAdminIndividualByID, setGetAdminIndividualByID] = useRecoilState(
    getAdminIndividualByIDAtom
  );

  const [getAdminIndividualDashboard, setGetAdminIndividualDashboard] =
    useRecoilState(getAdminIndividualDashboardAtom);
  const navigate = useNavigate();

  const fetchAdminAllIndividual = async (page, limit) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page,
        limit: limit,
      });
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}doctor/get-allindividual?${params}`,
      });
      if (res) {
        console.log(res, "res");
        setLoading(false);
        setGetAdminAllIndividualList(res);
      }
    } catch (error) {
      console.log("Error fetching SuperAdmin Customer list:", error);
      setLoading(false);
    }
  };

  const createAdminNewIndiviual = async (data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}doctor/add-doctor`,
        data: data,
      });

      if (res) {
        // Ensure response is successful
        toast.success(res?.message);
        navigate("/database");
      } else {
        throw new Error(res?.message);
      }
    } catch (error) {
      console.error("Error creating SuperAdmin individual:", error);
      toast.error(error.response?.data?.error);
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };

  const getAdminIndividualDataByID = async (id) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}doctor/get-doctor-by-id/${id}`,
      });

      if (res) {
        console.log(res, "res");
        setGetAdminIndividualByID(res);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching SuperAdmin individual DB by ID:", error);
      toast.error(error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  // update hook
  const updateAdminIndividual = async (id, data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "PUT",
        url: `${conf.apiBaseUrl}doctor/edit-doctor/${id}`,
        data,
      });
      if (res) {
        toast.success(res?.message || "Individual updated successfully.");
      }
    } catch (err) {
      console.error("Error updating SuperAdmin Individual:", err);
      toast.error(
        err?.response?.data?.message ||
          "An error occurred while updating SuperAdmin Individual."
      );
    } finally {
      setLoading(false);
    }
  };

  // delete hook
  const deleteAdminIndividual = async (id) => {
    const confirm = await confirmAlert(
      "Are you sure you want to delete this SuperAdmin Individual?"
    );
    if (confirm.isConfirmed) {
      setLoading(true);
      try {
        const res = await fetchData({
          method: "DELETE",
          url: `${conf.apiBaseUrl}individual/deleteIndividualById/${id}`,
        });
        if (res) {
          toast.success(res?.message || "Individual deleted successfully.");
          getAdminAllIndividual(1, 10); // Refresh the Individual DB after deletion
        }
      } catch (err) {
        console.error("Error deleting SuperAdmin Individual:", err);
        toast.error(
          err?.response?.data?.message ||
            "An error occurred while deleting SuperAdmin Individual."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const resetAdminIndividualByID = () => {
    setGetAdminIndividualByID(null);
  };

  // individual Dashboard
  const fetchGetAdminIndividualDashboard = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}individual/individual-dashboard`,
      });
      if (res) {
        console.log("res", res);
        setLoading(false);
        setGetAdminIndividualDashboard(res);
      }
    } catch (error) {
      console.error(
        "Error fetching while SuperAdmin Individual Dashboard data:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchAdminAllIndividual,
    createAdminNewIndiviual,
    loading,
    getAdminAllIndividualList,
    getAdminIndividualDataByID,
    getAdminIndividualByID, 
    updateAdminIndividual,
    deleteAdminIndividual,
    resetAdminIndividualByID,
    fetchGetAdminIndividualDashboard,
    getAdminIndividualDashboard,
  };
};

export default useAdminIndividualDB;
