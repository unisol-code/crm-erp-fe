import { useRecoilState } from "recoil";
import { useState } from "react";
import useFetch from "../useFetch";
import conf from "../../config/index";
import {
  homeCalendarYearAtom,
  homeEarningByCompanyAtom,
  homeFinancialYearAtom,
  homeTopCustomerAtom,
  homeTopProductsAtom,
  homeTotalSalesAtom,
} from "../../state/dashboardState/homeDashboardState";

const useHomeDashboard = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(false);
  const [homeFinancialYear, setHomeFinancialYear] = useRecoilState(
    homeFinancialYearAtom
  );
  const [homeCalendarYear, setHomeCalendarYear] =
    useRecoilState(homeCalendarYearAtom);
  const [homeTopProducts, setHomeTopProducts] =
    useRecoilState(homeTopProductsAtom);
  const [homeTopCustomer, setHomeTopCustomer] =
    useRecoilState(homeTopCustomerAtom);
  const [homeEarningByCompany, setHomeEarningByCompany] = useRecoilState(
    homeEarningByCompanyAtom
  );
  const [homeTotalSale, setHomeTotalSale] = useRecoilState(homeTotalSalesAtom);

  const fetchHomeFinancialYear = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}home/getFinancialdataForHome`,
      });
      console.log(res?.data);
      if (res) {
        setHomeFinancialYear(res?.data);
      }
    } catch (error) {
      console.error("Error while fetching Financial Year:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHomeCalendarYear = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}home/getCalendarYearDataForHome`,
      });
      if (res) {
        setHomeCalendarYear(res?.data);
      }
    } catch (error) {
      console.error("Error while fetching Calendar Year:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHomeTopProducts = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}home/getTopProductsForHome`,
      });
      if (res) {
        setHomeTopProducts(res?.data);
      }
    } catch (error) {
      console.error("Error while fetching Calendar Year:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHomeTopCustomer = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}home/getTopCustomerForHome`,
      });
      if (res) {
        setHomeTopCustomer(res);
      }
    } catch (error) {
      console.error("Error while fetching Calendar Year:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHomeEarningByCompany = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}home/earningByCompany`,
      });
      if (res) {
        setHomeEarningByCompany(res?.data);
      }
    } catch (error) {
      console.error("Error while fetching Calendar Year:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHomeTotalSale = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}home/totalSalesOfAllCompanies`,
      });
      console.log(res?.totalSales);
      if (res) {
        setHomeTotalSale(res?.totalSales);
      }
    } catch (error) {
      console.error("Error while fetching Financial Year:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchHomeFinancialYear,
    fetchHomeCalendarYear,
    fetchHomeTopProducts,
    fetchHomeTopCustomer,
    fetchHomeEarningByCompany,
    loading,
    homeFinancialYear,
    homeCalendarYear,
    homeTopProducts,
    homeTopCustomer,
    homeEarningByCompany,
    fetchHomeTotalSale,
    homeTotalSale,
  };
};

export default useHomeDashboard;
