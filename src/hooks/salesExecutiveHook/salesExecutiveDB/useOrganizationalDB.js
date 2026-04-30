import { useRecoilState } from "recoil";
import { useState } from "react";
import useFetch from "../../useFetch";
import conf from "../../../config/index";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { confirmAlert } from "../../../utils/alertToast";
import {
  organizationalDBAtom,
  organizationalDBByIDAtom,
} from "../../../state/salesExecutiveState/salesExecutiveDB/organizationalDBState";

const useOrganizationalDB = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(false);
  const [organizationalDB, setOrganizationalDB] =
    useRecoilState(organizationalDBAtom);
  const [organizationalDBByID, setOrganizationalDBByID] = useRecoilState(
    organizationalDBByIDAtom
  );

  const fetchOrganizationalDB = async (page, limit) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page,
        limit: limit,
      });
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}organization/get-allorganizationByCompany?${params}`,
      });
      if (res) {
        setOrganizationalDB(res);
      }
    } catch (err) {
      console.error("Error fetching organizational DB:", err);
      // toast.error(err?.response?.data?.message || "An error occurred while fetching organizational DB.");
    } finally {
      setLoading(false);
    }
  };

  const createOrganization = async (data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}organization/create-organization`,
        data,
      });
      if (res) {
        toast.success(res?.message || "Organization created successfully.");
      }
    } catch (err) {
      console.error("Error creating organization:", err);
      toast.error(
        err?.response?.data?.message ||
          "An error occurred while creating organization."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizationalDBByID = async (id) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}organization/get-organizationbyid/${id}`,
      });
      if (res) {
        setOrganizationalDBByID(res.data);

        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching organizational DB by ID:", err);
      // toast.error(err?.response?.data?.message || "An error occurred while fetching organizational DB by ID.");
    } finally {
      setLoading(false);
    }
  };

  const updateOrganization = async (id, data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "PUT",
        url: `${conf.apiBaseUrl}organization/update-organizationbyid/${id}`,
        data,
      });
      if (res) {
        toast.success(res?.message || "Organization updated successfully.");
      }
    } catch (err) {
      console.error("Error updating organization:", err);
      toast.error(
        err?.response?.data?.message ||
          "An error occurred while updating organization."
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteOrganization = async (id) => {
    const confirm = await confirmAlert(
      "Are you sure you want to delete this organization?"
    );
    if (confirm.isConfirmed) {
      setLoading(true);
      try {
        const res = await fetchData({
          method: "DELETE",
          url: `${conf.apiBaseUrl}organization/deleteOrganizationById/${id}`,
        });
        if (res) {
          toast.success(res?.message || "Organization deleted successfully.");
        }
      } catch (err) {
        console.error("Error deleting organization:", err);
        toast.error(
          err?.response?.data?.message ||
            "An error occurred while deleting organization."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const resestOrganizationalDBByID = () => {
    setOrganizationalDBByID(null);
  };

  return {
    fetchOrganizationalDB,
    organizationalDB,
    loading,
    createOrganization,
    fetchOrganizationalDBByID,
    organizationalDBByID,
    resestOrganizationalDBByID,
    updateOrganization,
    deleteOrganization,
  };
};

export default useOrganizationalDB;
