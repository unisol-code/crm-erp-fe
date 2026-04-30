import { useRecoilState } from "recoil";
import { useState } from "react";
import useFetch from "../../useFetch";
import conf from "../../../config/index";
import { toast } from "react-toastify";
import { monthlyPlanningDetailsStateAtom, monthlyPlanningListStateAtom, oneMonthPlanningStateAtom } from "../../../state/mothlyPlanningState/monthlyPlanningState";

const useMonthlyPlanning = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useState(false);
    const [monthlyPlanningList, setMonthlyPlanningList] = useRecoilState(monthlyPlanningListStateAtom);
    const [oneMonthPlanningList, setOneMonthPlanningList] = useRecoilState(oneMonthPlanningStateAtom);
    const [monthlyPlanningDetails, setMonthlyPlanningDetails] = useRecoilState(monthlyPlanningDetailsStateAtom)
    
    const fetchMonthlyPlanningList = async (page, limit, fromDate, toDate) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}planning/get-allmonthlyplannings?page=${page}&limit=${limit}&fromDate=${fromDate}&toDate=${toDate}`
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
    const fetchOneMonthPlanningList = async (page, limit, month, year, doctorName,organizationName) => {
        setOneMonthPlanningList(null);
        setLoading(true);
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}planning/get-allmonthlyplanningsbymonth?page=${page}&limit=${limit}&month=${month}&year=${year}&doctorName=${doctorName}&organizationName=${organizationName}`
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
                url: `${conf.apiBaseUrl}planning/get-monthlyplanningbyid/${id}`
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
      toast.error(error.response?.data?.error);
    } finally {
      setLoading(false); 
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
        resetOneMonthPlanningList
    };
};

export default useMonthlyPlanning