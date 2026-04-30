import { useRecoilState } from "recoil";
import { useState } from "react";
import useFetch from "../useFetch";
import conf from "../../config/index";
import { companySalesAnalyticsAtom } from "../../state/allCompanySalesState/companySalesAnalyticsState";

const useCompanySalesAnalytics = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(false);
  const [companySalesReports, setCompanySalesReports] = useRecoilState(
    companySalesAnalyticsAtom
  );

  const fetchCompanySalesReport = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}home/getSalesReportForHome`,
      });

      if (res) {
        setCompanySalesReports(res?.data);
      }
    } catch (error) {
      console.error("Error while fetching home sales reports:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    companySalesReports,
    fetchCompanySalesReport,
  };
};

export default useCompanySalesAnalytics;
