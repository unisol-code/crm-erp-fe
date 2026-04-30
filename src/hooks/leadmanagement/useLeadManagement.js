import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  callObjectiveDropAtom,
  leadManagementDetailsAtom,
  leadManagementListAtom,
  orgnizationNameDropAtom,
  productPromotedAtom,
  leadsByIdAtom,
} from "../../state/leadManagementState/leadManagementState";
import useFetch from "../useFetch";
import conf from "../../config/index";
import { confirmAlert } from "../../utils/alertToast";

const useLeadManagement = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [leadManagement, setleadManagement] = useRecoilState(
    leadManagementListAtom
  );
  const [leadManagementDetail, setLeadManagementDetail] = useRecoilState(
    leadManagementDetailsAtom
  );
  const [organizationNameDrop, setOrganizationNameDrop] = useRecoilState(
    orgnizationNameDropAtom
  );
  const [productPromoted, setProductPromoted] =
    useRecoilState(productPromotedAtom);
  const [callObjectiveDrop, setCallObjectiveDrop] = useRecoilState(
    callObjectiveDropAtom
  );
  const [leadById, setLeadById] = useRecoilState(leadsByIdAtom);

  const fetchLeadManagement = async (page, limit) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page,
        limit: limit,
      });
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}lead/getLeads?${params}`,
      });
      console.log("response", res);
      if (res) {
        // console.log(res.data,"get lead data")
        setleadManagement(res);
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

  const fetchLeadManagementDetails = async (id) => {
    if (!id) {
      toast.error("Invalid ID provided.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}lead/getLeadById/${id}`,
      });
      if (res) {
        setLeadManagementDetail(res?.data);
        // console.log(res.data,"data of user")
      } else {
        toast.error("Blog not found or does not exist.");
      }
    } catch (error) {
      console.error("Error fetching blog details:", error);
      toast.error("An error occurred while fetching the blog details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizationNameDrop = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}customer/getOrganizationNames`,
      });
      if (res) {
        setOrganizationNameDrop(res.organizations);
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

  const fetchProductPromoted = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}lead/getProductToBePromoted`,
      });
      if (res) {
        setProductPromoted(res.data);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("An error occurred while fetching the blogs.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCallObjectiveDrop = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}lead/getCallObjectives`,
      });
      if (res) {
        setCallObjectiveDrop(res.data);
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

  const createLead = async (data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}lead/addLead`,
        data,
      });

      console.log(res, "response");
      if (res) {
        toast.success(res?.message);
        // fetchLeadManagement();
      } else {
        throw new Error(res?.message || "Failed to create the blog.");
        
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      toast.error(
        error.response?.data?.message || "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateLeadManagement = async (id, data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "PUT",
        url: `${conf.apiBaseUrl}blogRoutes/updateBlog/${id}`,
        data,
      });
      if (res) {
        toast.success(res?.message || "Blog updated successfully!");
        fetchLeadManagement(); // Refresh the blog list
      } else {
        throw new Error(res?.message || "Failed to update the blog.");
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error(
        error.response?.data?.message || "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteLead = async (id) => {
    const result = await confirmAlert(
      "Do you really want to delete this lead?"
    );
    if (result.isConfirmed) {
      setLoading(true);
      try {
        const res = await fetchData({
          method: "DELETE",
          url: `${conf.apiBaseUrl}lead/deleteLeadById/${id}`,
        });

        console.log("Delete API response:", res);

        if (res?.deletedLead) {
          Swal.fire({
            title: "Deleted!",
            text: res.message || "Lead deleted successfully.",
            icon: "success",
            confirmButtonText: "Okay",
          });
          fetchLeadManagement();
        } else {
          throw new Error(res?.message || "Failed to delete the lead.");
        }
      } catch (error) {
        console.error("Error deleting lead:", error);
        toast.error(
          error.response?.data?.error || "An unexpected error occurred."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchLeadById = async (id) => {
    if (!id) {
      toast.error("Invalid ID provided.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}lead/getLeadById/${id}`,
      });
      if (res) {
        console.log(res, "res");
        setLeadById(res?.data);
      } else {
        toast.error("Lead not found or does not exist.");
      }
    } catch (error) {
      console.error("Error fetching blog details:", error);
      toast.error("An error occurred while fetching the blog details.");
    } finally {
      setLoading(false);
    }
  };

  const updateLead = async (id, data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "PUT",
        url: `${conf.apiBaseUrl}lead/editLeadById/${id}`,
        data,
      });
      if (res) {
        toast.success(res?.message);
        fetchLeadManagement();
      } else {
        throw new Error(res?.message || "Failed to update the Lead.");
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error(
        error.response?.data?.error || "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchLeadManagement,
    fetchCallObjectiveDrop,
    callObjectiveDrop,
    leadManagement,
    fetchOrganizationNameDrop,
    organizationNameDrop,
    leadManagementDetail,
    fetchProductPromoted,
    productPromoted,
    fetchLeadManagementDetails,
    createLead,
    updateLeadManagement,
    deleteLead,
    loading,
    errors,
    leadById,
    fetchLeadById,
    updateLead,
  };
};

export default useLeadManagement;
