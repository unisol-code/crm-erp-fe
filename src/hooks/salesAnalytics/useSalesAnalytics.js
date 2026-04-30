import { useRecoilState } from "recoil";
import { useState } from "react";
import useFetch from "../useFetch";
import conf from "../../config/index";
import {
  salesAnalyticsAtom,
  salesByIdAtom,
} from "../../state/salesAnalyticsState/salesAnalyticsState";
import { toast } from "react-toastify";

const useSalesAnalytics = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(false);
  const [salesReports, setSalesReports] = useRecoilState(salesAnalyticsAtom);
  const [salesById, setSalesById] = useRecoilState(salesByIdAtom);

  const fetchSalesReport = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}post/salesReport`,
      });

      if (res) {
        setSalesReports(res?.data);
      }
    } catch (error) {
      console.error("Error while fetching sales reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSalesById = async (id) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}customer/getCustomerById/${id}`,
      });
      if (res) {
        setSalesById(res);
        setLoading(false);
        console.log(res);
      }
    } catch (error) {
      console.log("Error fetching Customer Details:", error);
      setLoading(false);
    }
  };

  const createAddSales = async (data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}lead/addLead`,
        data,
      });
      if (res) {
        toast.success(res?.message || "Blog created successfully!");
        fetchSalesReport();
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

  const addSalesReport = async (formData) => {
    console.log(formData);
    setLoading(true);
    try {
      const res = await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}sales/create-sales-report`,
        data: formData,
      });
      if (res) {
        toast.success(res?.message);
      }
    } catch (err) {
      toast.error(res?.error || "Unexecpted Error");
      console.error("Error while adding sales report :", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    salesReports,
    fetchSalesReport,
    salesById,
    fetchSalesById,
    createAddSales,
    addSalesReport,
  };
};

export default useSalesAnalytics;
