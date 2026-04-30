import React, { useState } from 'react'
import useFetch from '../../../useFetch';
import { enviroAdminIndividualDetailsAtom, enviroAdminIndividualListAtom, enviroFPODetailsAtom, enviroFPOListAtom, enviroGovtOfficerDetailsAtom, enviroGovtOfficerListAtom } from '../../../../state/superAdminDatabaseState/enviroDB/enviroAdminDBState';
import { useRecoilState } from 'recoil';
import conf from '../../../../config';
import { toast } from "react-toastify";
import Swal from 'sweetalert2';
import { confirmAlert } from '../../../../utils/alertToast';

const useEnviroAdminIndDB = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [enviroAdminIndividualList, setEnviroAdminIndividualList] = useRecoilState(enviroAdminIndividualListAtom);
    const [enviroAdminIndividualDetails, setEnviroAdminIndividualDetails] = useRecoilState(enviroAdminIndividualDetailsAtom);

    // enviro individuals
    const [enviroGovtOfficerList, setEnviroGovtOfficerList] = useRecoilState(enviroGovtOfficerListAtom);
    const [enviroGovtOfficerDetails, setEnviroGovtOfficerDetails] = useRecoilState(enviroGovtOfficerDetailsAtom);
    const [enviroFPOList, setEnviroFPOList] = useRecoilState(enviroFPOListAtom);
    const [enviroFPODetails, setEnviroFPODetails] = useRecoilState(enviroFPODetailsAtom);

    const fetchEnviroAdminIndividualList = async (page, limit, typeOfProfile) => {
        setLoading(true);
        setError("");
        try {
            const params = new URLSearchParams({
                page: page,
                limit: limit,
                typeOfProfile: typeOfProfile
            });
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}doctor/Envro-get-all-doctors?${params}`,
            });
            if (res) {
                setEnviroAdminIndividualList(res);
            }
        } catch (error) {
            console.error("Error fetching Enviro Admin Individual List:", error);
            setError("Failed to fetch Enviro Admin Individual List.");
        } finally {
            setLoading(false);
        }
    };

    const fetchEnviroAdminIndividualDetails = async (id) => {
        setLoading(true);
        setError("");
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}doctor/Envro-get-doctor-by-id/${id}`,
            });
            if (res) {
                setEnviroAdminIndividualDetails(res?.data);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching Enviro Admin Individual Details:", error);
            setError("Failed to fetch Enviro Admin Individual Details.");
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const createEnviroAdminIndividual = async (data) => {
        setLoading(true);
        setError("");
        try {
            const res = await fetchData({
                method: "POST",
                url: `${conf.apiBaseUrl}doctor/enviro-add-doctor`,
                data,
            });
            if (res) {
                toast.success(res?.message);
            }
        } catch (error) {
            console.error("Error creating Enviro Admin Individual:", error);
            toast.error(error?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    const resetEnviroAdminIndividualDetails = () => {
        setEnviroAdminIndividualDetails(null);
    };

    const deleteEnviroAdminIndividual = async (id) => {
        const result = await confirmAlert(
            "Do you really want to delete this Enviro Admin Individual?"
        );
        if (!result.isConfirmed) return;
        if (result?.isConfirmed) {
            setLoading(true);
            setError("");
            try {
                const res = await fetchData({
                    method: "DELETE",
                    url: `${conf.apiBaseUrl}doctor/enviro-delete-doctor/${id}`,
                });
                if (res?.success) {
                    Swal.fire({
                        title: "Deleted!",
                        text: res?.message,
                        icon: "success",
                        confirmButtonText: "Okay",
                    });
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error deleting Enviro Admin Individual:", error);
                toast.error(error?.response?.data?.message);
                setLoading(false);
            } finally {
                setLoading(false);
            }
        }
    };

    // fetch enviro govt officer list
    const fetchEnviroGovtOfficerList = async (page, limit) => {
        setLoading(true);
        setError("");
        try {
            const params = new URLSearchParams({
                page: page,
                limit: limit,
            });
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}enviro-individual/get-all-govt-officers?${params}`,
            });
            if (res) {
                setEnviroGovtOfficerList(res);
            }
        } catch (error) {
            console.error("Error fetching Enviro Govt Officer List:", error);
            setError("Failed to fetch Enviro Govt Officer List.");
        } finally {
            setLoading(false);
        }
    };

    const fetchEnviroGovtOfficerDetails = async (id) => {
        setLoading(true);
        setError("");
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}enviro-individual/get-govt-officer-by-id/${id}`,
            });
            if (res) {
                setEnviroGovtOfficerDetails(res?.data);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching Enviro Govt Officer Details:", error);
            setError("Failed to fetch Enviro Govt Officer Details.");
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const createEnviroGovtOfficer = async (data) => {
        setLoading(true);
        setError("");
        try {
            const res = await fetchData({
                method: "POST",
                url: `${conf.apiBaseUrl}enviro-individual/add-govt-officer`,
                data,
            });
            if (res) {
                toast.success(res?.message);
                setLoading(false);
                return true
            }
        } catch (error) {
            console.error("Error creating Enviro Govt Officer:", error);
            toast.error(error?.response?.data?.message);
            setLoading(false);
            return false
        } finally {
            setLoading(false);
        }
    };

    const resetEnviroGovtOfficerDetails = () => {
        setEnviroGovtOfficerDetails(null);
    };

    const updateEnviroGovtOfficer = async (id, data) => {
        setLoading(true);
        setError("");
        try {
            const res = await fetchData({
                method: "PUT",
                url: `${conf.apiBaseUrl}enviro-individual/update-govt-officer/${id}`,
                data,
            });
            if (res) {
                toast.success(res?.message);
                setLoading(false);
                return true
            }
        } catch (error) {
            console.error("Error updating Enviro Govt Officer:", error);
            toast.error(error?.response?.data?.message);
            setLoading(false);
            return false
        } finally {
            setLoading(false);
        }
    };

    const deleteEnviroGovtOfficer = async (id) => {
        const result = await confirmAlert(
            "Do you really want to delete this Enviro Govt Officer?"
        );
        if (!result.isConfirmed) return;
        if (result?.isConfirmed) {
            setLoading(true);
            setError("");
            try {
                const res = await fetchData({
                    method: "DELETE",
                    url: `${conf.apiBaseUrl}enviro-individual/delete-govt-officer/${id}`,
                });
                if (res?.success) {
                    Swal.fire({
                        title: "Deleted!",
                        text: res?.message,
                        icon: "success",
                        confirmButtonText: "Okay",
                    });
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error deleting Enviro Govt Officer:", error);
                toast.error(error?.response?.data?.message);
                setLoading(false);
            } finally {
                setLoading(false);
            }
        }
    };

    // fetch enviro FPO list
    const fetchEnviroFPOList = async (page, limit) => {
        setLoading(true);
        setError("");
        try {
            const params = new URLSearchParams({
                page: page,
                limit: limit,
            });
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}enviro-individual/get-all-fpos?${params}`,
            });
            if (res) {
                setEnviroFPOList(res);
            }
        } catch (error) {
            console.error("Error fetching Enviro FPO List:", error);
            setError("Failed to fetch Enviro FPO List.");
        } finally {
            setLoading(false);
        }
    };

    const fetchEnviroFPODetails = async (id) => {
        setLoading(true);
        setError("");
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}enviro-individual/get-fpo-by-id/${id}`,
            });
            if (res) {
                setEnviroFPODetails(res?.data);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching Enviro FPO Details:", error);
            setError("Failed to fetch Enviro FPO Details.");
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const createEnviroFPO = async (data) => {
        setLoading(true);
        setError("");
        try {
            const res = await fetchData({
                method: "POST",
                url: `${conf.apiBaseUrl}enviro-individual/add-fpo`,
                data,
            });
            if (res) {
                toast.success(res?.message);
                setLoading(false);
                return true
            }
        } catch (error) {
            console.error("Error creating Enviro FPO:", error);
            toast.error(error?.response?.data?.message);
            setLoading(false);
            return false
        } finally {
            setLoading(false);
        }
    };

    const resetEnviroFPODetails = () => {
        setEnviroFPODetails(null);
    };

    const updateEnviroFPO = async (id, data) => {
        setLoading(true);
        setError("");
        try {
            const res = await fetchData({
                method: "PUT",
                url: `${conf.apiBaseUrl}enviro-individual/update-fpo/${id}`,
                data,
            });
            if (res) {
                toast.success(res?.message);
                setLoading(false);
                return true
            }
        } catch (error) {
            console.error("Error updating Enviro FPO:", error);
            toast.error(error?.response?.data?.message);
            setLoading(false);
            return false
        } finally {
            setLoading(false);
        }
    };

    const deleteEnviroFPO = async (id) => {
        const result = await confirmAlert(
            "Do you really want to delete this Enviro FPO?"
        );
        if (!result.isConfirmed) return;
        if (result?.isConfirmed) {
            setLoading(true);
            setError("");
            try {
                const res = await fetchData({
                    method: "DELETE",
                    url: `${conf.apiBaseUrl}enviro-individual/delete-fpo/${id}`,
                });
                if (res?.success) {
                    Swal.fire({
                        title: "Deleted!",
                        text: res?.message,
                        icon: "success",
                        confirmButtonText: "Okay",
                    });
                    setLoading(false);
                    return true
                }
            } catch (error) {
                console.error("Error deleting Enviro FPO:", error);
                toast.error(error?.response?.data?.message);
                setLoading(false);
                return false
            } finally {
                setLoading(false);
            }
        }
    };

    return {
        fetchEnviroAdminIndividualList,
        fetchEnviroAdminIndividualDetails,
        enviroAdminIndividualList,
        enviroAdminIndividualDetails,
        loading,
        resetEnviroAdminIndividualDetails,
        createEnviroAdminIndividual,
        deleteEnviroAdminIndividual,
        // Enviro Govt Officer
        fetchEnviroGovtOfficerList,
        fetchEnviroGovtOfficerDetails,
        enviroGovtOfficerList,
        enviroGovtOfficerDetails,
        resetEnviroGovtOfficerDetails,
        createEnviroGovtOfficer,
        updateEnviroGovtOfficer,
        deleteEnviroGovtOfficer,
        // FPO
        fetchEnviroFPOList,
        fetchEnviroFPODetails,
        enviroFPOList,
        enviroFPODetails,
        resetEnviroFPODetails,
        createEnviroFPO,
        updateEnviroFPO,
        deleteEnviroFPO
    }
}

export default useEnviroAdminIndDB