import { useState } from "react";
import useFetch from "../../../useFetch";
import conf from "../../../../config";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";
import { enviroAdminOrgDetailsAtom, enviroAdminOrgListAtom, servicesOfferedDropAtom } from "../../../../state/superAdminDatabaseState/adminOrganizationDBState/AdminOrganizationDBState";
import { confirmAlert } from "../../../../utils/alertToast";

const useEnviroAdminOrgDB = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [enviroAdminOrgList, setEnviroAdminOrgList] = useRecoilState(enviroAdminOrgListAtom);
    const [enviroAdminOrgDetails, setEnviroAdminOrgDetails] = useRecoilState(enviroAdminOrgDetailsAtom);
    const [servicesOfferedDrop, setServicesOfferedDrop] = useRecoilState(servicesOfferedDropAtom);

    const fetchEnviroAdminOrgList = async (page, limit) => {
        setLoading(true);
        setError("");
        try {
            const params = new URLSearchParams({
                page: page,
                limit: limit,
            });
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}adminOrganization/getAllEnviroOrganization?${params}`,
            });
            if (res) {
                setEnviroAdminOrgList(res);
            }
        } catch (error) {
            console.error("Error fetching Enviro Admin Org List:", error);
            setError("Failed to fetch Enviro Admin Org List.");
        } finally {
            setLoading(false);
        }
    };

    const fetchEnviroAdminOrgDetails = async (id) => {
        setLoading(true);
        setError("");
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}adminOrganization/getEnviroOrganizationById/${id}`,
            });
            if (res) {
                setEnviroAdminOrgDetails(res?.data);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching Enviro Admin Org Details:", error);
            setError("Failed to fetch Enviro Admin Org Details.");
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const createEnviroAdminOrg = async (data) => {
        setLoading(true);
        setError("");
        try {
            const res = await fetchData({
                method: "POST",
                url: `${conf.apiBaseUrl}adminOrganization/create-enviro-organization`,
                data,
            });
            if (res) {
                toast.success(res?.message);
            }
        } catch (error) {
            console.error("Error creating Enviro Admin Org:", error);
            toast.error(error?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    const resetEnviroAdminOrgDetails = () => {
        setEnviroAdminOrgDetails(null);
    };

    const updateEnviroAdminOrg = async (id, data) => {
        setLoading(true);
        setError("");
        try {
            const res = await fetchData({
                method: "PUT",
                url: `${conf.apiBaseUrl}adminOrganization/updateEnviroAdminOrg/${id}`,
                data,
            });
            if (res) {
                toast.success(res?.message);
            }
        } catch (error) {
            console.error("Error updating Enviro Admin Org:", error);
            toast.error(error?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteEnviroAdminOrg = async (id) => {
        const confirm = await confirmAlert("Are you sure you want to delete this Enviro Organization?");
        if (!confirm.isConfirmed) return;
        if (confirm.isConfirmed) {
            setLoading(true);
            setError("");
            try {
                const res = await fetchData({
                    method: "DELETE",
                    url: `${conf.apiBaseUrl}adminOrganization/deleteEnviroAdminOrg/${id}`,
                });
                if (res) {
                    toast.success(res?.message);
                }
            } catch (error) {
                console.error("Error deleting Enviro Admin Org:", error);
                toast.error(error?.response?.data?.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const fetchServicesOfferedDrop = async () => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}adminOrganization/getServicesOfferedDropdown`,
            });
            if (res) {
                setServicesOfferedDrop(res?.data);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching Services Offered Drop:", error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    return {
        fetchEnviroAdminOrgList,
        fetchEnviroAdminOrgDetails,
        enviroAdminOrgList,
        enviroAdminOrgDetails,
        loading,
        resetEnviroAdminOrgDetails,
        createEnviroAdminOrg,
        updateEnviroAdminOrg,
        deleteEnviroAdminOrg,
        fetchServicesOfferedDrop,
        servicesOfferedDrop
    }
}

export default useEnviroAdminOrgDB;