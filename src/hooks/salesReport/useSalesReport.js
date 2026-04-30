import { useRecoilState } from "recoil";
import { useState } from "react";
//Axios
import useFetch from "../useFetch";
//baseURL
import conf from "../../config/index";
//State
import {
  saleReportAtom,
  salesReportIdAtom,
} from "../../state/salesReportState/saleReportState";

const useGetSalesReport = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(false);
  const [salesReportsFilter, setSalesReportsFilter] =
    useRecoilState(saleReportAtom);
  const [salesReportId, setSalesReportId] = useRecoilState(salesReportIdAtom);

  const getSalesFilter = async (filterType, from, to) => {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        filterType,
        from,
        to,
      });
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}sales/get-salesbyfilter?${params}`,
      });
      if (res) {
        setSalesReportsFilter(res);
      }
    } catch (error) {
      console.error("Error while fetching sales Filter:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSalesReportById = async (id) => {
    setLoading(true);
    try {
      const resultId = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}sales/get-salesreportbyid/${id}`,
      });
      if (resultId) {
        setSalesReportId(resultId);
      }
    } catch (error) {
      console.error("error while fetching sales by Id:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    getSalesFilter,
    salesReportsFilter,
    loading,
    getSalesReportById,
    salesReportId,
  };
};

export default useGetSalesReport;
