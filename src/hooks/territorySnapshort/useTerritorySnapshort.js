import { useRecoilState } from "recoil";
import { useState } from "react";
import useFetch from "../useFetch";
import conf from "../../config/index";
import { territorySnapStatAtom } from "../../state/territorySnapshort/territorySnapshortState";

const useTerritorySnapshot = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(false);
  const [territorySnap, setTerritorySnap] = useRecoilState(
    territorySnapStatAtom
  );

  const fetchTerritorySnap = async () => {
    setLoading(true);

    try {
      const res = await fetchData({
        method: "GET",
        url: `${conf.apiBaseUrl}territorysnapshot/territory-snapshot-stats`,
      });

      if (res) {
        setTerritorySnap(res?.data);
      }
    } catch (error) {
      console.error("Error while fetching data of endpoint:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchTerritorySnap,
    territorySnap,
    loading,
  };
};
export default useTerritorySnapshot;
