import useFetch from "../useFetch";
import conf from "../../config/index";
import { confirmAlert } from "../../utils/alertToast";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";
import {
  customerTypeAtom,
  leadsForEnviroAtom,
  leadsForEnviroByIdAtom,
} from "../../state/leadManagementState/enviroLeadState";
import { isNull } from "lodash";

const useEnviroLeadManage = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [customerType, setCustomerType] = useRecoilState(customerTypeAtom);
  const [leadsForEnviro, setLeadsForEnviro] =
    useRecoilState(leadsForEnviroAtom);
  const [leadsForEnviroById, setLeadsForEnviroById] = useRecoilState(
    leadsForEnviroByIdAtom
  );

  const fetchCustomerType = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}lead/getCustomerTypeForEnviroSolution`,
      });
      if (res) {
        setCustomerType(res.data);
      } else {
        toast.error("Failed to fetch blogs. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("An error occurred while fetching the blogs.");
    } finally {
      setLoading(false);
    }
  };

  const fetchLeadsForEnviro = async (page, limit) => {
    setLoading(true);
    
    try {
      const params = new URLSearchParams({
        page: page,
        limit: limit,
      });
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}lead/getLeadsForEnviro?${params}`,
      });
      if (res) {
        console.log("response",res)
        setLeadsForEnviro(res);
      } else {
        toast.error("Failed to fetch blogs. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("An error occurred while fetching the blogs.");
    } finally {
      setLoading(false);
    }
  };

  const createEnviroLead = async (data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}lead/addLeadForEnviro`,
        data: data,
      });
      if (res) {
        toast.success(res?.message);
        fetchCustomerType();
      } else {
        throw new Error(res?.message || "Failed to create the blog.");
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      toast.error(
        error.response?.data?.error || "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateEnviroLead = async (id, data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "PUT",        
        url: `${conf.apiBaseUrl}lead/editLeadForEnviroById/${id}`,
        data,
      });
      if (res) {
        toast.success(res?.message);
        fetchLeadsForEnviro();
      } else {
        throw new Error(res?.message);
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error(
        error.response?.data?.error
      );
    } finally {
      setLoading(false);
    }
    }

  const fetchLeadByIdForEnviro = async (id) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}lead/getLeadForEnviroById/${id}`,
      });
      if (res) {
        console.log(res, "res");
        setLeadsForEnviroById(res);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching blog details:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const resetLeadsForEnviro = () => {
    setLeadsForEnviroById(null)
  }

  return {
    fetchCustomerType,
    customerType,
    fetchLeadsForEnviro,
    leadsForEnviro,
    fetchLeadByIdForEnviro,
    leadsForEnviroById,
    createEnviroLead,
    updateEnviroLead, resetLeadsForEnviro
  };
};

export default useEnviroLeadManage;
