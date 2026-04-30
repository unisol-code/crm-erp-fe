import { useRecoilState } from "recoil";
import { useState } from "react";
import useFetch from "../../useFetch";
import conf from "../../../config/index";
import { priorDoctorsAtom, priorDoctorsByIdAtom, territorySnapshotAtom, topCustomersAtom, topSpecialitiesAtom } from "../../../state/salesExecutiveState/dashboard/dashboardState";

const useDashboard = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(false);
  const [priorDoctors, setPriorDoctors] = useRecoilState(priorDoctorsAtom);
  const [territorySnapshot, setTerritorySnapshot] = useRecoilState(territorySnapshotAtom);
  const [topSpecialities, setTopSpecialities] = useRecoilState(topSpecialitiesAtom);
  const [topCustomers, setTopCustomers] = useRecoilState(topCustomersAtom);
  const [priorDoctorsById, setPriorDoctorsById] = useRecoilState(priorDoctorsByIdAtom) 

  const fetchPriorDoctors = async (page, limit) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page,
        limit: limit,
      });
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}individual/getall-high-priority-doctors?${params}`,
      });
      if (res) {
        setPriorDoctors(res);
      }
    } catch (err) {
      console.error("Error fetching prior doctors:", err);
    } finally {
      setLoading(false);
    }
  }

  const fetchPriorDoctorsById = async (id) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}individual/high-priority-doctors-by-id/${id}`,
      });
      if (res) {
        setPriorDoctorsById(res?.data);
      }
    } catch (err) {
      console.error("Error fetching prior doctors:", err);
    } finally {
      setLoading(false);
    }
  }


  const fetchTerritorySnapshot = async (city, speciality) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        city: city,
        speciality: speciality,
      });
      if (!city) {
        params.delete("city");
      }
      if (!speciality) {
        params.delete("speciality");
      }

      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}individual/territory-snapshot?${params}`,
      });
      if (res) {
        setTerritorySnapshot(res?.data);
      }
    } catch (err) {
      console.error("Error fetching territory snapshot:", err);
    } finally {
      setLoading(false);
    }
  }

  const fetchTopSpecialities = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}individual/top-speciality`,
      });
      if (res) {
        setTopSpecialities(res?.data);
      }
    } catch (err) {
      console.error("Error fetching top specialities:", err);
    } finally {
      setLoading(false);
    }
  }

  const fetchTopCustomers = async (city, speciality) => {
    console.log("inside fetchTopCustomers", city, speciality)
    setLoading(true);
    try {
      const params = new URLSearchParams({
        city: city,
        speciality: speciality,
      });
      if (!city) {
        params.delete("city");
      }
      if (!speciality) {
        params.delete("speciality");
      }
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}organization/top-customer?${params}`,
      });
      if (res) {
        setTopCustomers(res);
      }
    } catch (err) {
      console.error("Error fetching top customers:", err);
    } finally {
      setLoading(false);
    }
  }

  return {
    fetchPriorDoctors, loading, priorDoctors, fetchTerritorySnapshot, territorySnapshot,
    fetchTopSpecialities, topSpecialities, fetchTopCustomers, topCustomers, fetchPriorDoctorsById,
    priorDoctorsById
  };
}

export default useDashboard;