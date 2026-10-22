import { useState, useEffect } from "react";

/**
 * Custom hook to get company information from sessionStorage.
 * Detects if the current company is "Enviro solution".
 */
const useCompany = () => {
  const [companyName, setCompanyName] = useState("");
  const [isEnviroSolution, setIsEnviroSolution] = useState(false);
  const [isCompanyLoaded, setIsCompanyLoaded] = useState(false);

  useEffect(() => {
    const rawName = sessionStorage.getItem("companyName");
    setCompanyName(rawName || "");

    const normalized = rawName?.toLowerCase().replace(/\s+/g, "") || "";
    setIsEnviroSolution(normalized === "envirosolution");

    /* Flag the read as done so screens can wait for the real company name
       instead of briefly flashing "Access Restricted" / rendering nothing. */
    setIsCompanyLoaded(true);
  }, []);

  return { companyName, isEnviroSolution, isCompanyLoaded };
};

export default useCompany;
