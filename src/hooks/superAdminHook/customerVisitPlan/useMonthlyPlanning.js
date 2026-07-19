import { useRecoilState } from "recoil";
import { useState } from "react";
import useFetch from "../../useFetch";
import conf from "../../../config/index";
import { toast } from "react-toastify";
import { monthlyPlanningDetailsStateAtom, monthlyPlanningListStateAtom, monthlySummaryStateAtom, monthWisePlanningStateAtom, oneMonthPlanningStateAtom } from "../../../state/mothlyPlanningState/monthlyPlanningState";
import Swal from "sweetalert2";
import { confirmAlert } from "../../../utils/alertToast";

const useMonthlyPlanning = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useState(false);
    const [monthlyPlanningList, setMonthlyPlanningList] = useRecoilState(monthlyPlanningListStateAtom);
    const [oneMonthPlanningList, setOneMonthPlanningList] = useRecoilState(oneMonthPlanningStateAtom);
    const [monthlyPlanningDetails, setMonthlyPlanningDetails] = useRecoilState(monthlyPlanningDetailsStateAtom)
    const [monthWisePlanning, setMonthWisePlanning] = useRecoilState(monthWisePlanningStateAtom);
    const [monthlySummary, setMonthlySummary] = useRecoilState(monthlySummaryStateAtom);


    const fetchMonthlyPlanningList = async (id, page, limit, fromDate, toDate) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (page) params.append("page", page);
            if (limit) params.append("limit", limit);
            if (fromDate) params.append("fromDate", fromDate);
            if (toDate) params.append("toDate", toDate);    
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}monthlyPlanning/getWorkingDaysByMonthYear/${id}?${params.toString()}`
            });
            if (res) {
                setMonthlyPlanningList(res);
            }
        } catch (err) {
            console.error("Error while fetching monthly planning list:", err);
            toast.error("Failed to fetch monthly planning list");
        } finally {
            setLoading(false);
        }
    };

    const fetchMonthWisePlanning = async (id,page, limit, month, year) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (page) params.append("page", page);
            if (limit) params.append("limit", limit);
            if (month) params.append("month", month);
            if (year) params.append("year", year);
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}monthlyPlanning/getMonthlyPlanningByMonthYearSummary/${id}?${params.toString()}`
            });
            if (res) {
                setMonthWisePlanning(res);
            }
        } catch (err) {
            console.error("Error while fetching month-wise planning:", err);
            toast.error("Failed to fetch month-wise planning");
        } finally {
            setLoading(false);
        }
    };

     const fetchMonthlySummary = async (id, month, year, type) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (month) params.append("month", month);
            if (year) params.append("year", year);
            // if (type) params.append("type", type);
                    if (type) {
            params.append(type, "true");
        }
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}monthlyPlanning/totalCallRecordsforHospitalandDoctor/${id}?${params.toString()}`
            });
            if (res) {
                setMonthlySummary(res);
            }
        } catch (err) {
            console.error("Error while fetching monthly summary:", err);
            toast.error("Failed to fetch monthly summary");
        } finally {
            setLoading(false);
        }
    };


    const fetchOneMonthPlanningList = async (id,page, limit, month, year, doctorName, organizationName, createPlanningForDate) => {
        setOneMonthPlanningList(null);
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (page) params.append("page", page);
            if (limit) params.append("limit", limit);
            if (month) params.append("month", month);
            if (year) params.append("year", year);
            if (doctorName) params.append("doctorName", doctorName);
            if (organizationName) params.append("organizationName", organizationName);
            if (createPlanningForDate) params.append("createPlanningForDate", createPlanningForDate);

            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}monthlyPlanning/getMonthlyPlanningByMonthYear/${id}?${params.toString()}`
            });
            if (res) {
                console.log(res);
                setOneMonthPlanningList(res);
            }
        } catch (err) {
            console.error("Error while fetching one month planning list:", err);
        } finally {
            setLoading(false);
        }
    }

    const fetchMonthlyPlanningDetailsById = async (id) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}monthlyPlanning/getMonthlyPlanningById/${id}`
            });
            if (res) {
                console.log(res);
                setMonthlyPlanningDetails(res);
            }
        } catch (err) {
            console.error("Error while fetching planning details:", err);
            toast.error("Failed to fetch planning details");
        } finally {
            setLoading(false);
        }
    }

    const resetOneMonthPlanningList = () => {
        setOneMonthPlanningList(null)
    }

    const resetMonthlyPlanningDetails = () => {
        setMonthlyPlanningDetails(null);
    }

    const createMonthlyPlanning = async (data) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "POST",
                url: `${conf.apiBaseUrl}planning/create-monthlyplanning`,
                data: data,
            });
            if (res) {
                toast.success(res?.message);
                return res;
            } else {
                throw new Error(res?.message);
            }
        } catch (error) {
            console.error("Error creating monthly planning:", error);
            toast.error(error.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    const updateMonthlyPlanning = async (id, data) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "PUT",
                url: `${conf.apiBaseUrl}planning/update-monthlyplanning/${id}`,
                data: data,
            });
            if (res) {
                toast.success(res?.message);
                return res;
            } else {
                throw new Error(res?.message);
            }
        } catch (error) {
            console.error("Error updating monthly planning:", error);
            toast.error(error.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteMonthlyPlanning = async (id) => {
        const confirm = await confirmAlert("Are you sure you want to delete this monthly planning?",);
        if (!confirm) return;
        if (confirm.isConfirmed) {
            try {
                setLoading(true);
                const res = await fetchData({
                    method: "DELETE",
                    url: `${conf.apiBaseUrl}planning/delete-monthlyplanning/${id}`,
                });
                if (res) {
                    Swal.fire({
                        title: "Deleted!",
                        text: res?.message,
                        icon: "success",
                        confirmButtonText: "Okay",
                    });
                    setLoading(false);
                    return res;
                }
            } catch (error) {
                console.error("Error deleting monthly planning:", error);
                toast.error(error.response?.data?.error);
                setLoading(false);
            } finally {
                setLoading(false);
            }
        }
    };

    return {
        monthlyPlanningList,
        loading,
        fetchMonthlyPlanningList,
        fetchOneMonthPlanningList,
        oneMonthPlanningList,
        fetchMonthlyPlanningDetailsById,
        monthlyPlanningDetails,
        createMonthlyPlanning,
        resetMonthlyPlanningDetails,
        resetOneMonthPlanningList,
        deleteMonthlyPlanning,
        updateMonthlyPlanning,
        fetchMonthWisePlanning,
        monthWisePlanning,fetchMonthlySummary,
        monthlySummary
    };
};

export default useMonthlyPlanning