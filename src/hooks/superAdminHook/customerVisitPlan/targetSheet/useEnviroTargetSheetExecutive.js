import { useState } from "react";
import { useRecoilState } from "recoil";
import { toast } from "react-toastify";

import useFetch from "../../../useFetch";
import conf from "../../../../config";
import { enviroTargetSheetDetailsAtom } from "../../../../state/salesExecutiveState/customerVisitPlan/targetSheetState";

/**
 * =========================================================
 *  ENVIRO SOLUTION — EXECUTIVE TARGET SHEET
 * ---------------------------------------------------------
 *  Hook used by the EnviroSolution target sheet forms
 *  (product / project / service) to submit a new target sheet.
 * =========================================================
 */
const useEnviroTargetSheetExecutive = () => {
  const [fetchData] = useFetch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [enviroTargetSheetDetails, setEnviroTargetSheetDetails] =
    useRecoilState(enviroTargetSheetDetailsAtom);

  // POST /api/enviroTargetSheet/enviro-create-targetsheet
  const createEnviroTargetSheet = async (data) => {
    if (!data) {
      toast.error("Target sheet data is required");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetchData({
        method: "POST",
        url: `${conf.apiBaseUrl}enviroTargetSheet/enviro-create-targetsheet`,
        data: data,
      });

      if (res) {
        setEnviroTargetSheetDetails(res?.data ?? res);
        toast.success(res?.message || "Enviro target sheet created successfully");
        return res;
      }

      throw new Error(res?.message || "Failed to create enviro target sheet");
    } catch (err) {
      console.error("Error creating enviro target sheet:", err);
      setError(err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error while creating enviro target sheet"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resetEnviroTargetSheetDetails = () => {
    setEnviroTargetSheetDetails(null);
  };

  return {
    loading,
    error,
    createEnviroTargetSheet,
    enviroTargetSheetDetails,
    resetEnviroTargetSheetDetails,
  };
};

export default useEnviroTargetSheetExecutive;
