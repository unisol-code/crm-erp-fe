import { useRecoilState } from "recoil";
import { useState } from "react";
//Axios
import useFetch from "../../useFetch";
//baseURL
import conf from "../../../config";
//State
import {
  getAllIndividualAtom,
  getIndividualByIDAtom,
  getIndividualDashboardAtom,
} from "../../../state/salesExecutiveState/Individuals/IndividualsState";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { confirmAlert } from "../../../utils/alertToast";

const useIndividuals = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(false);
  const [getAllindividualDeatils, setGetAllIndividualDeatils] =
    useRecoilState(getAllIndividualAtom);
  const [getindividualByID, setGetIndividualByID] = useRecoilState(
    getIndividualByIDAtom
  );

  const [getIndividualDashboard, setGetIndividualDashboard] = useRecoilState(
    getIndividualDashboardAtom
  );
  const navigate = useNavigate();

  const getAllindividual = async (page, limit, typeOfDoctorProfile) => {
    setGetAllIndividualDeatils(null);
    setGetIndividualByID(null);
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page,
        limit: limit,
        typeOfDoctorProfile: typeOfDoctorProfile,
      });
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}individual/get-allindividualByCompany?${params}`,
      });
      if (res) {
        console.log(res, "res");
        setGetAllIndividualDeatils(res);
      }
    } catch (error) {
      console.log("Error fetching Customer list:", error);
    } finally {
      setLoading(false);
    }
  };

  const createNewIndiviual = async (data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}individual/create-individual`,
        data: data,
      });

      if (res) {
        // Ensure response is successful
        toast.success(res?.message);
        navigate("/sales-executive/database");
      } else {
        throw new Error(res?.message);
      }
    } catch (error) {
      console.error("Error creating individual:", error);
      toast.error(error.response?.data?.error);
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };

  const getIndividualDataByID = async (id) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}individual/get-individualbyid/${id}`,
      });

      if (res) {
        console.log(res, "res");
        setGetIndividualByID(res);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching individual DB by ID:", error);
      toast.error(error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  // update hook
  const updateIndividual = async (id, data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "PUT",
        url: `${conf.apiBaseUrl}individual/update-individualbyid/${id}`,
        data,
      });
      if (res) {
        toast.success(res?.message || "Individual updated successfully.");
        navigate(`/sales-executive/database/view-individual/${id}`);
      }
    } catch (err) {
      console.error("Error updating Individual:", err);
      toast.error(
        err?.response?.data?.message ||
          "An error occurred while updating Individual."
      );
    } finally {
      setLoading(false);
    }
  };

  // delete hook
  const deleteIndividual = async (id) => {
    const confirm = await confirmAlert(
      "Are you sure you want to delete this Individual?"
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
        }
      } catch (err) {
        console.error("Error deleting Individual:", err);
        toast.error(
          err?.response?.data?.message ||
            "An error occurred while deleting Individual."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const resetIndividualByID = () => {
    setGetIndividualByID(null);
  };

  // individual Dashboard
  const fetchGetIndividualDashboard = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}individual/individual-dashboard`,
      });
      if (res) {
        console.log("res", res);
        setLoading(false);
        setGetIndividualDashboard(res);
      }
    } catch (error) {
      console.error("Error fetching while Individual Dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    getAllindividual,
    createNewIndiviual,
    loading,
    getAllindividualDeatils,
    getIndividualDataByID,
    getindividualByID,
    updateIndividual,
    deleteIndividual,
    resetIndividualByID,
    fetchGetIndividualDashboard,
    getIndividualDashboard,
  };
};

export default useIndividuals;
