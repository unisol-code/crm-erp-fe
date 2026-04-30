import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  useRecoilState,
  useRecoilState_TRANSITION_SUPPORT_UNSTABLE,
} from "recoil";
import conf from "../../config/index";
import useFetch from "../useFetch";
import {
  databaseCustomerListAtom,
  databaseCustomerDetailsAtom,
  organizationTypesAtom,
  organizationStatusAtom,
  totalCustomerNoAtom,
  totalActiveCustomerNoAtom,
  totalInactiveCustomerNoAtom,
  fetchEditRequestAtom,
  fetchEmployeeEditRequestAtom,
  fetchEmployeeEditRequestDataAtom,
  fetchIndividualEmployeeEditRequestAtom,
  fetchOrgnizationalEmployeeEditRequestAtom,
} from "../../state/databaseState/databaseState";
const useDatabase = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customerDataBase, setCustomerDataBase] = useRecoilState(
    databaseCustomerListAtom
  );
  const [customerDataBaseDetails, setCustomerDataBaseDetails] = useState(
    databaseCustomerDetailsAtom
  );
  const [organizationTypes, setOrganizationTypes] = useRecoilState(
    organizationTypesAtom
  );

  const [organizationStatus, setOrganizationStatus] = useRecoilState(
    organizationStatusAtom
  );
  const [customerNo, setCustomerNo] = useRecoilState(totalCustomerNoAtom);
  const [activeCustomerNo, setActiveCustomerNo] = useRecoilState(
    totalActiveCustomerNoAtom
  );
  const [inactiveCustomerNo, setInactiveCustomerNo] = useRecoilState(
    totalInactiveCustomerNoAtom
  );

  const [editRequests, setEditRequests] = useRecoilState(fetchEditRequestAtom);

  const [individualEmployeeEditRequests, setIndividualEmployeeEditRequests] =
    useRecoilState(fetchIndividualEmployeeEditRequestAtom);

  const [
    orgnizationalEmployeeEditRequests,
    setOrgnizationalEmployeeEditRequests,
  ] = useRecoilState(fetchOrgnizationalEmployeeEditRequestAtom);

  const [editRequestsDetails, setEditRequestsDetails] = useRecoilState(
    fetchEmployeeEditRequestDataAtom
  );

  const fetchCustomerList = async (page, limit) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page,
        limit: limit,
      });
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}customer/getCustomerDetails?${params}`,
      });
      if (res) {
        console.log(res, "res");
        setLoading(false);
        setCustomerDataBase(res);
      }
    } catch (error) {
      console.log("Error fetching Customer list:", error);
      setLoading(false);
    }
  };

  const fetchCustomerDetails = async (id) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}customer/getCustomerById/${id}`,
      });
      if (res) {
        setCustomerDataBaseDetails(res);
        setLoading(false);
        console.log(res);
      }
    } catch (error) {
      console.log("Error fetching Customer Details:", error);
      setLoading(false);
    }
  };

  const fetchOrganizationTypes = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}customer/getOrganizationTypes`,
      });
      if (res) {
        setOrganizationTypes(res.organizationTypes);
      }
    } catch (error) {
      console.log("Error fetching organization types:", error);
    } finally {
      setLoading(false);
    }
  };

  const createCustomer = async (data) => {
    setLoading(true);
    console.log("tygvuh");
    try {
      const res = await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}customer/addCustomer  `,
        data: data,
      });
      if (res) {
        console.log(res);
        toast.success(res?.message);
        fetchCustomerList();
      } else {
        throw new Error(res?.message || "Failed to Create Organization");
      }
    } catch (error) {
      console.log("Error creating Organization", error);
      const errorMessage =
        error.response?.data?.error || "An unexpected error occurred";
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const updateCustomerById = async (id, data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "PUT",
        url: `${conf.apiBaseUrl}customer/editCustomerById/${id}`,
        data,
      });
      if (res) {
        toast.success(res?.message);
        fetchCustomerList(); // Refresh the blog list
      } else {
        throw new Error(res?.message);
      }
    } catch (error) {
      console.error("Error updating :", error);
      toast.error(
        error.response?.data?.message || "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizationStatus = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}customer/getOrganizationStatus`,
      });
      if (res) {
        setOrganizationStatus(res.getOrganizationStatus);
      }
    } catch (error) {
      console.log("Error fetching organization status:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerNo = async () => {
    setLoading(true);
    console.log("Fetching customer data...");
    try {
      const data = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}customer/getTotalCustomerNo`,
      });
      if (data) {
        setCustomerNo(data.totalCustomers); // Assuming 'CustomerNo' is the key
      }
    } catch (error) {
      console.log("Error fetching data:", error);
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveCustomerNo = async () => {
    setLoading(true);
    console.log("Fetching customer data...");
    try {
      const data = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}customer/getTotalActiveCustomerNo`,
      });
      if (data) {
        setActiveCustomerNo(data.totalCustomers);
      }
    } catch (error) {
      console.log("Error fetching data:", error);
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const fetchInactiveCustomerNo = async () => {
    setLoading(true);
    console.log("Fetching customer data...");
    try {
      const data = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}customer/getTotalInactiveCustomerNo`,
      });
      if (data) {
        setInactiveCustomerNo(data.totalInactiveCustomers);
      }
    } catch (error) {
      console.log("Error fetching data:", error);
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const resetOrganization = () => {
    setCustomerDataBaseDetails(null);
  };

  const editRequestSender = async (requestData) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}edit/create-edit-request`,
        data: requestData,
      });
      if (res) {
        console.log(res);
        toast.success(res?.message);
        // fetchAllRequest();
      } else {
        throw new Error(res?.message || "Failed to Create Edit Request");
      }
    } catch (error) {
      console.log("Error creating Edit Request", error);
      const errorMessage =
        error.response?.data?.error || "An unexpected error occurred";
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const fetchAllRequest = async (page, limit) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page,
        limit: limit,
      });
      const data = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}edit/get-user-edit-requests?${params}`,
      });
      if (data) {
        setEditRequests(data);
      }
    } catch (error) {
      console.log("Error fetching data:", error);
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const employeeIndividualRequest = async (id, page, limit) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page,
        limit: limit,
      });

      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}edit/get-user-edit-requestsForIndividual/${id}?${params}`,
      });

      if (res) {
        setIndividualEmployeeEditRequests(res);
      } else {
        setIndividualEmployeeEditRequests([]);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setError("Error fetching individual employee requests");
    } finally {
      setLoading(false);
    }
  };

  const employeeOrganizationRequest = async (id, page, limit) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page,
        limit: limit,
      });

      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}edit/get-user-edit-requestsForOrganization/${id}?${params}`,
      });

      if (res) {
        setOrgnizationalEmployeeEditRequests(res);
      } else {
        setOrgnizationalEmployeeEditRequests([]);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setError("Error fetching organization employee requests");
    } finally {
      setLoading(false);
    }
  };

  const employeeEditRequest = async (id) => {
    setLoading(true);
    try {
      const data = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}edit/get-user-details/${id}`,
      });
      if (data) {
        setEditRequestsDetails(data?.request);
      }
    } catch (error) {
      console.log("Error fetching data:", error);
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const requestAction = async (id, data, userId) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "PUT",
        url: `${conf.apiBaseUrl}edit/update/${id}`,
        data: data,
      });
      if (res) {
        toast.success(res?.message);
        return true
      }
    } catch (error) {
      console.error("Error updating :", error);
      toast.error(
        error.response?.data?.message
      );
      return false
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    resetOrganization,
    customerDataBase,
    fetchCustomerList,
    fetchCustomerDetails,
    customerDataBaseDetails,
    organizationTypes,
    fetchOrganizationTypes,
    fetchOrganizationStatus,
    organizationStatus,
    setOrganizationStatus,
    setLoading,
    createCustomer,
    updateCustomerById,
    fetchCustomerNo,
    customerNo,
    fetchActiveCustomerNo,
    activeCustomerNo,
    fetchInactiveCustomerNo,
    inactiveCustomerNo,
    editRequestSender,
    fetchAllRequest,
    editRequests,
    employeeIndividualRequest,
    employeeOrganizationRequest,
    individualEmployeeEditRequests,
    orgnizationalEmployeeEditRequests,
    employeeEditRequest,
    editRequestsDetails,
    requestAction,
  };
};

export default useDatabase;
