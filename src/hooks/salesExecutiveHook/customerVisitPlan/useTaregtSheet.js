import { useRecoilState } from "recoil";
import { useState } from "react";
import useFetch from "../../useFetch";
import conf from "../../../config/index";
import { toast } from "react-toastify";
import {
  targetSheetListStateAtom,
  targetSheetDetailsAtom,
  yearWiseProductTargetSheetStateAtom,
  hospitalWiseTargetSheetStateAtom,
  hospitalIdWiseTargetSheetStateAtom,
  productIdWiseTargetSheetStateAtom,
  allIndividualTargetSheetStateAtom,
  individualIdWiseTargetSheetStateAtom,
  teamWiseTargetSheetStateAtom,
  teamWiseTargetQueueStateAtom,
  universalTargetSheetStateAtom,
} from "../../../state/salesExecutiveState/customerVisitPlan/targetSheetState";

const useTargetSheet = () => {
  const [targetSheetList, setTargetSheetList] = useRecoilState(
    targetSheetListStateAtom
  );
  const [targetSheetDetails, setTargetSheetDetails] = useRecoilState(
    targetSheetDetailsAtom
  );
  const [yearWiseProductTargetSheet, setYearWiseProductTargetSheet] =
    useRecoilState(yearWiseProductTargetSheetStateAtom);
  const [hospitalWiseTargetSheet, setHospitalWiseTargetSheet] =
    useRecoilState(hospitalWiseTargetSheetStateAtom);
  const [hospitalIdWiseTargetSheet, setHospitalIdWiseTargetSheet] =
    useRecoilState(hospitalIdWiseTargetSheetStateAtom);
  const [productIdWiseTargetSheet, setProductIdWiseTargetSheet] =
    useRecoilState(productIdWiseTargetSheetStateAtom);
  const [allIndividualTargetSheet, setAllIndividualTargetSheet] =
    useRecoilState(allIndividualTargetSheetStateAtom);
  const [individualIdWiseTargetSheet, setIndividualIdWiseTargetSheet] =
    useRecoilState(individualIdWiseTargetSheetStateAtom);
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(false);
  const [yearWiseProductTargetLoading, setYearWiseProductTargetLoading] =
    useState(false);
  const [hospitalWiseTargetLoading, setHospitalWiseTargetLoading] =
    useState(false);
  const [hospitalIdWiseTargetLoading, setHospitalIdWiseTargetLoading] =
    useState(false);
  const [productIdWiseTargetLoading, setProductIdWiseTargetLoading] =
    useState(false);
  const [allIndividualTargetLoading, setAllIndividualTargetLoading] =
    useState(false);
  const [individualIdWiseTargetLoading, setIndividualIdWiseTargetLoading] =
    useState(false);
  const [teamWiseTargetLoading, setTeamWiseTargetLoading] = useState(false);
  const [teamWiseQueueLoading, setTeamWiseQueueLoading] = useState(false);

  const [teamWiseTargetSheet, setTeamWiseTargetSheet] = useRecoilState(
    teamWiseTargetSheetStateAtom
  );
  const [teamWiseTargetQueue, setTeamWiseTargetQueue] = useRecoilState(
    teamWiseTargetQueueStateAtom
  );
  const [universalTargetSheet, setUniversalTargetSheet] = useRecoilState(
    universalTargetSheetStateAtom
  );
  const fetchTargetSheetYearList = async () => {
    // console.log(filters);
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}targets/showYearWiseTargetSheet`,
      });
      if (res) {
        setTargetSheetList(res);
      }
    } catch (err) {
      console.error("Error while fetching target sheet list:", err);
      toast.error("Failed to fetch target sheet list");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetches the year wise product target sheet list.
   * Query params expected by the API: { year, page = 1, limit = 10 }
   */
  const fetchYearWiseProductTargetSheet = async ({
    year,
    page = 1,
    limit = 10,
  } = {}) => {
    setYearWiseProductTargetLoading(true);
    try {
      const params = new URLSearchParams();
      if (year) params.append("year", year);
      params.append("page", page);
      params.append("limit", limit);
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}targets/showYearWiseProductTargetSheet?${params.toString()}`,
      });
      if (res) {
        const transformed = {
          data: [{ products: res.data || [] }],
          pagination: res.pagination,
        };
        setYearWiseProductTargetSheet(transformed);
        return transformed;
      }
    } catch (err) {
      console.error("Error while fetching year wise product target sheet:", err);
      toast.error("Failed to fetch year wise product target sheet");
    } finally {
      setYearWiseProductTargetLoading(false);
    }
  };

  /**
   * Fetches the hospital wise target sheet list.
   * Query params expected by the API: { year, page = 1, limit = 10 }
   */
  const fetchHospitalWiseTargetSheet = async ({
    year,
    page = 1,
    limit = 10,
  } = {}) => {
    setHospitalWiseTargetLoading(true);
    try {
      const params = new URLSearchParams();
      if (year) params.append("year", year);
      params.append("page", page);
      params.append("limit", limit);
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}targets/showhospitalWiseTargetSheet?${params.toString()}`,
      });
      if (res) {
        setHospitalWiseTargetSheet(res);
        return res;
      }
    } catch (err) {
      console.error("Error while fetching hospital wise target sheet:", err);
      toast.error("Failed to fetch hospital wise target sheet");
    } finally {
      setHospitalWiseTargetLoading(false);
    }
  };

  const resetHospitalWiseTargetSheet = () => {
    setHospitalWiseTargetSheet(null);
  };

  /**
   * Fetches the hospital id wise target sheet list.
   * Query params expected by the API: { id, page = 1, limit = 10 }
   */
  const fetchHospitalIdWiseTargetSheet = async ({
    id,
    page = 1,
    limit = 10,
  } = {}) => {
    setHospitalIdWiseTargetLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}targets/show-hospital-id-wise-target-sheet/${id}?${params.toString()}`,
      });
      if (res) {
        setHospitalIdWiseTargetSheet(res);
        return res;
      }
    } catch (err) {
      console.error(
        "Error while fetching hospital id wise target sheet:",
        err
      );
      toast.error("Failed to fetch hospital id wise target sheet");
    } finally {
      setHospitalIdWiseTargetLoading(false);
    }
  };

  const resetHospitalIdWiseTargetSheet = () => {
    setHospitalIdWiseTargetSheet(null);
  };

  /**
   * Fetches the product id wise target sheet list.
   * Query params expected by the API: { id, page = 1, limit = 10 }
   */
  const fetchProductIdWiseTargetSheet = async ({
    id,
    page = 1,
    limit = 10,
  } = {}) => {
    setProductIdWiseTargetLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}targets/show-product-id-wise-target-sheet/${id}?${params.toString()}`,
      });
      if (res) {
        setProductIdWiseTargetSheet(res);
        return res;
      }
    } catch (err) {
      console.error(
        "Error while fetching product id wise target sheet:",
        err
      );
      toast.error("Failed to fetch product id wise target sheet");
    } finally {
      setProductIdWiseTargetLoading(false);
    }
  };

  const resetProductIdWiseTargetSheet = () => {
    setProductIdWiseTargetSheet(null);
  };

  const fetchAllIndividualTargetSheet = async ({ year, page = 1, limit = 10 } = {}) => {
    setAllIndividualTargetLoading(true);
    try {
      const params = new URLSearchParams();
      if (year) params.append("year", year);
      params.append("page", page);
      params.append("limit", limit);
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}targets/get-all-individual-targetsheet?${params.toString()}`,
      });
      if (res) {
        setAllIndividualTargetSheet(res);
        return res;
      }
    } catch (err) {
      console.error("Error while fetching all individual target sheet:", err);
      toast.error("Failed to fetch all individual target sheet");
    } finally {
      setAllIndividualTargetLoading(false);
    }
  };

  const resetAllIndividualTargetSheet = () => {
    setAllIndividualTargetSheet(null);
  };

  const fetchIndividualIdWiseTargetSheet = async ({ id, page = 1, limit = 10 } = {}) => {
    setIndividualIdWiseTargetLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}targets/show-individual-id-wise-target-sheet/${id}?${params.toString()}`,
      });
      if (res) {
        setIndividualIdWiseTargetSheet(res);
        return res;
      }
    } catch (err) {
      console.error("Error while fetching individual target sheet:", err);
      toast.error("Failed to fetch individual target sheet");
    } finally {
      setIndividualIdWiseTargetLoading(false);
    }
  };

  const resetIndividualIdWiseTargetSheet = () => {
    setIndividualIdWiseTargetSheet(null);
  };

  const fetchTeamWiseTargetSheet = async (year, _id) => {
    setTeamWiseTargetLoading(true);
    try {
      const params = new URLSearchParams();
      if (year) params.append("year", year);
      if (_id) params.append("_id", _id);
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}targets/showTeamWiseTargetSheet?${params.toString()}`,
      });
      if (res) {
        setTeamWiseTargetSheet(res);
        return res;
      }
    } catch (err) {
      console.error("Error while fetching team-wise target sheet:", err);
      toast.error("Failed to fetch team-wise target sheet");
    } finally {
      setTeamWiseTargetLoading(false);
    }
  };

  const fetchTeamWiseTargetQueue = async () => {
    setTeamWiseQueueLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}targets/queue`,
      });
      if (res) {
        setTeamWiseTargetQueue(res);
        return res;
      }
    } catch (err) {
      console.error("Error while fetching team-wise target queue:", err);
      toast.error("Failed to fetch team-wise target queue");
    } finally {
      setTeamWiseQueueLoading(false);
    }
  };

  const reviewTargetSheet = async (id, data) => {
    setTeamWiseQueueLoading(true);
    try {
      const res = await fetchData({
        method: "PUT",
        url: `${conf.apiBaseUrl}targets/review/${id}`,
        data: data,
      });
      if (res) {
        toast.success(res?.message || "Target sheet reviewed successfully");
        return res;
      }
    } catch (err) {
      console.error("Error while reviewing target sheet:", err);
      toast.error(
        err?.response?.data?.message || "Error while reviewing target sheet"
      );
    } finally {
      setTeamWiseQueueLoading(false);
    }
  };

  const fetchUniversalTargetSheet = async (id, year) => {
    setTeamWiseTargetLoading(true);
    try {
      const params = new URLSearchParams();
      if (year) params.append("year", year);
      if (id) params.append("id", id);
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}targets/universal-target-sheet?${params.toString()}`,
      });
      if (res) {
        setUniversalTargetSheet(res);
        return res;
      }
    } catch (err) {
      console.error("Error while fetching universal target sheet:", err);
      toast.error("Failed to fetch universal target sheet");
    } finally {
      setTeamWiseTargetLoading(false);
    }
  };

  const resetTeamWiseTargetSheet = () => {
    setTeamWiseTargetSheet(null);
  };

  const resetTeamWiseTargetQueue = () => {
    setTeamWiseTargetQueue(null);
  };

  const resetUniversalTargetSheet = () => {
    setUniversalTargetSheet(null);
  };

  const fetchOrganizationNames = async () => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}targets/organizationsdropdown`,
      });
      if (res) {
        setOrganizationList(res);
      }
    } catch (err) {
      console.error("Error while fetching Organization List:", err);
      toast.error("Failed to fetch Organization List");
    } finally {
      setLoading(false);
    }
  };
  const createTargetSheet = async (data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}targets/create-targetsheet`,
        data: data,
      });
      if (res) {
        toast.success(res?.message);
        return res;
      } else {
        throw new Error(res?.message);
      }
    } catch (error) {
      console.error("Error creating target sheet:", error);
      toast.error("Error while creating target sheet");
    } finally {
      setLoading(false);
    }
  };
  const fetchTargetSheetById = async (id) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}targets/get-targetsheetbyid/${id}`,
      });
      if (res) {
        setTargetSheetDetails(res);
      }
    } catch (err) {
      console.error("Error while fetching target sheet details:", err);
      toast.error("Failed to fetch taregt sheet details");
    } finally {
      setLoading(false);
    }
  };
  const updateTargetSheet = async (id, data) => {
    setLoading(true);
    try {
      const res = await fetchData({
        method: "PUT",
        url: `${conf.apiBaseUrl}targets/update-targetsheet/${id}`,
        data: data,
      });
      if (res) {
        toast.success(res?.message);
        return res;
      } else {
        throw new Error(res?.message);
      }
    } catch (error) {
      console.error("Error updating target sheet:", error);
      toast.error("Error while updating target sheet");
    } finally {
      setLoading(false);
    }
  };
  const resetTargetSheetDetails = () => {
    setTargetSheetDetails(null);
  };
  const resetYearWiseProductTargetSheet = () => {
    setYearWiseProductTargetSheet(null);
  };
  return {
    targetSheetList,
    loading,
    fetchTargetSheetYearList,
    createTargetSheet,
    targetSheetDetails,
    fetchTargetSheetById,
    updateTargetSheet,
    resetTargetSheetDetails,
    yearWiseProductTargetSheet,
    yearWiseProductTargetLoading,
    fetchYearWiseProductTargetSheet,
    resetYearWiseProductTargetSheet,
    hospitalWiseTargetSheet,
    hospitalWiseTargetLoading,
    fetchHospitalWiseTargetSheet,
    resetHospitalWiseTargetSheet,
    hospitalIdWiseTargetSheet,
    hospitalIdWiseTargetLoading,
    fetchHospitalIdWiseTargetSheet,
    resetHospitalIdWiseTargetSheet,
    productIdWiseTargetSheet,
    productIdWiseTargetLoading,
    fetchProductIdWiseTargetSheet,
    resetProductIdWiseTargetSheet,
    allIndividualTargetSheet,
    allIndividualTargetLoading,
    fetchAllIndividualTargetSheet,
    resetAllIndividualTargetSheet,
    individualIdWiseTargetSheet,
    individualIdWiseTargetLoading,
    fetchIndividualIdWiseTargetSheet,
    resetIndividualIdWiseTargetSheet,
    teamWiseTargetSheet,
    teamWiseTargetLoading,
    fetchTeamWiseTargetSheet,
    resetTeamWiseTargetSheet,
    teamWiseTargetQueue,
    teamWiseQueueLoading,
    fetchTeamWiseTargetQueue,
    resetTeamWiseTargetQueue,
    reviewTargetSheet,
    universalTargetSheet,
    fetchUniversalTargetSheet,
    resetUniversalTargetSheet,
  };
};

export default useTargetSheet;
