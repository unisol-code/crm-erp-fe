import { useState, useEffect } from "react";

/**
 * Custom hook to get company information from sessionStorage.
 * Detects if the current company is "Enviro solution".
 */
const useCompany = () => {
  const [companyName, setCompanyName] = useState("");
  const [isEnviroSolution, setIsEnviroSolution] = useState(false);

  useEffect(() => {
    const rawName = sessionStorage.getItem("companyName");
    setCompanyName(rawName || "");
    
    const normalized = rawName?.toLowerCase().replace(/\s+/g, "") || "";
    setIsEnviroSolution(normalized === "envirosolution");
  }, []);

  return { companyName, isEnviroSolution };
};

export default useCompany;
