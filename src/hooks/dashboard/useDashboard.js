import { useRecoilState } from "recoil";
import { useState } from "react";
import useFetch from "../useFetch";
import conf from "../../config/index";
import { allCompanyAtom, calendarYearAtom, earningByItemAtom, financialYearAtom, topCustomerAtom, topProductsAtom, businessSnapShotAtom, todaySpecialAtom } from "../../state/dashboardState/dashboardState";

const useDashboard = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(false);
  const [allCompany, setAllCompany] = useRecoilState(allCompanyAtom);
  const [financialYear, setFinancialYear] = useRecoilState(financialYearAtom);
  const [calendarYear, setCalendarYear] = useRecoilState(calendarYearAtom);
  const [topProducts, setTopProducts] = useRecoilState(topProductsAtom);
  const [topCustomer, setTopCustomer] = useRecoilState(topCustomerAtom);
  const [earningByItem, setEarningByItem] = useRecoilState(earningByItemAtom);
  const [businessSnapShot, setBusinessSnapShot] = useRecoilState(businessSnapShotAtom);
  const [todaySpecial, setTodaySpecial] = useRecoilState(todaySpecialAtom);
  const fetchAllCompany = async () => {
    setLoading(true);
    try {

      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}company/getAllCompanies`,
      });

      if (Array.isArray(res) && res.length > 0) {
        setAllCompany(res);
      } else {
        console.warn("API returned no companies or invalid format:", res);
        setAllCompany([]); // Set as empty array to avoid null issues
      }
    } catch (error) {
      console.error("Error while fetching Company List:", error);
      setAllCompany([]); // Ensure state is set to avoid undefined issues
    } finally {
      setLoading(false);
    }
  };

  const fetchFinancialYear = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        // url: `${conf.apiBaseUrl}post/getFinancialdata`,
        url: `${conf.apiBaseUrl}dashboard/line-chart-data-financial-year`,
      });
      if (res) {
        setFinancialYear(res?.data);
      }
    } catch (error) {
      console.error("Error while fetching Financial Year:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCalendarYear = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        // url: `${ conf.apiBaseUrl }post / getCalenderdata`,
        url: `${conf.apiBaseUrl}dashboard/line-chart-data`
      })
      if (res) {
        setCalendarYear(res?.data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error while fetching Calendar Year:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopProducts = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}dashboard/top-products`,
      });
      if (res) {
        setTopProducts(res?.data);
      }
    } catch (error) {
      console.error("Error while fetching top products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopCustomer = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}dashboard/top-customer-doctors`,
      });
      if (res) {
        setTopCustomer(res?.data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error while fetching Calendar Year:", error);

    } finally {
      setLoading(false);
    }
  };

  const fetchEarningByItem = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        // url: `${ conf.apiBaseUrl }product / earningByItem`,
        url: `${conf.apiBaseUrl}dashboard/earnings-by-items`,
      });
      if (res) {
        setEarningByItem(res?.data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error while fetching Calendar Year:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBusinessSnapShot = async () => {
    setLoading(true);
    try {
      // const params = new URLSearchParams({
      //   page: page,
      //   limit: limit,
      // })
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}dashboard/sales-performance`,
      });
      if (res) {
        setBusinessSnapShot(res);
      }
    } catch (error) {
      console.error("Error while fetching Business Snapshot:", error);
    } finally {
      setLoading(false);
    }
  }

  const fetchTodaySpecial = async () => {
    setLoading(true);
    try { 
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}dashboard/today-special-days`,
      });
      if (res) {
        setTodaySpecial(res);
      }
    } catch (error) {
      console.error("Error while fetching Today's Special:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading, financialYear, fetchFinancialYear,
    fetchAllCompany, allCompany, fetchCalendarYear, calendarYear,
    fetchTopProducts, topProducts, fetchTopCustomer, topCustomer,
    fetchEarningByItem, earningByItem,
    fetchBusinessSnapShot, businessSnapShot, fetchTodaySpecial, todaySpecial
  };
};

export default useDashboard;
