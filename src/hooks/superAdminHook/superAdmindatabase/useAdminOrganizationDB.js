import { useRecoilState } from "recoil";
import { useState } from "react";
import useFetch from "../../useFetch";
import conf from "../../../config/index";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { confirmAlert } from "../../../utils/alertToast";
import {
  adminOrganizationalDBAtom,
  adminOrganizationalDBByIDAtom,
} from "../../../state/superAdminDatabaseState/adminOrganizationDBState/AdminOrganizationDBState";

const useAdminOrganizationDB = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(false);
  const [adminOrganizationalDB, setAdminOrganizationalDB] = useRecoilState(
    adminOrganizationalDBAtom
  );
  const [adminOrganizationalDBByID, setAdminOrganizationalDBByID] =
    useRecoilState(adminOrganizationalDBByIDAtom);
    const token = sessionStorage.getItem("token");


  const fetchAdminOrganizationalDB = async (page, limit) => {
  setLoading(true);
  try {
    const params = new URLSearchParams({
      page: page,
      limit: limit,
    });

    const res = await fetchData({
      method: "GET",
      url: `${conf.apiBaseUrl}adminOrganization/getAllOrganization?${params}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res) {
      setAdminOrganizationalDB(res);
    }
  } catch (err) {
    console.error("Error fetching SuperAdmin organizational DB:", err);
  } finally {
    setLoading(false);
  }
};


  const createAdminOrganization = async (data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}adminOrganization/create-organization`,
        data,
      });
      if (res) {
        toast.success(res?.message || "Organization created successfully.");
      }
    } catch (err) {
      console.error("Error creating SuperAdmin organization:", err);
      toast.error(
        err?.response?.data?.message ||
          "An error occurred while creating SuperAdmin organization."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminOrganizationalDBByID = async (id) => {
  if (!id) return;

  setLoading(true);
  try {
    const res = await fetchData({
      method: "GET",
      url: `${conf.apiBaseUrl}adminOrganization/getOrganizationById/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res) {
      setAdminOrganizationalDBByID(res);
    }
  } catch (err) {
    console.error(
      "Error fetching SuperAdmin organizational DB by ID:",
      err
    );
  } finally {
    setLoading(false);
  }
};


  const updateAdminOrganization = async (id, data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "PUT",
        url: `${conf.apiBaseUrl}adminOrganization/update-organizationbyid/${id}`,
        data,
      });
      if (res) {
        toast.success(res?.message || "Organization updated successfully.");
      }
    } catch (err) {
      console.error("Error updating SuperAdmin organization:", err);
      toast.error(
        err?.response?.data?.message ||
          "An error occurred while updating SuperAdmin organization."
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteAdminOrganization = async (id) => {
    const confirm = await confirmAlert(
      "Are you sure you want to delete this SuperAdmin organization?"
    );
    if (confirm.isConfirmed) {
      setLoading(true);
      try {
        const res = await fetchData({
          method: "DELETE",
          url: `${conf.apiBaseUrl}adminOrganization/delete-organizationById/${id}`,
        });
        if (res) {
          toast.success(res?.message || "Organization deleted successfully.");
          fetchAdminOrganizationalDB(1, 10); // Refresh the organizational DB after deletion
        }
      } catch (err) {
        console.error("Error deleting SuperAdmin organization:", err);
        toast.error(
          err?.response?.data?.message ||
            "An error occurred while deleting SuperAdmin organization."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const resestAdminOrganizationalDBByID = () => {
    setAdminOrganizationalDBByID(null);
  };

  return {
    fetchAdminOrganizationalDB,
    adminOrganizationalDB,
    loading,
    createAdminOrganization,
    fetchAdminOrganizationalDBByID,
    adminOrganizationalDBByID,
    resestAdminOrganizationalDBByID,
    updateAdminOrganization,
    deleteAdminOrganization,
  };
};

export default useAdminOrganizationDB;
