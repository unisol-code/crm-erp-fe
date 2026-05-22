import axios from "axios";
import { useCallback } from "react";

function useFetch() {
  const fetchData = useCallback(async ({ method, url, data, params }) => {
    try {
      // Retrieve token and companyId from sessionStorage
      const token = sessionStorage.getItem("token");
      const id = sessionStorage.getItem("companyId");
      /*const id = requireCompanyId
        ? sessionStorage.getItem("newCompanyId")
        : null;

      console.log("NewcompanyId:", id);*/

      const axiosConfig = {
        method,
        url,
        ...(data && { data }),
        ...(params && { params }),
        headers: {
          Authorization: `Bearer ${token}`,
          ...(id && { companyId: id }),
          //...(id ? { companyid: id } : {}),
        },
      };

      const result = await axios(axiosConfig);
      return result.data;
    } catch (error) {
      console.error(
        `Error fetching data from ${url}:`,
        error.message,
        error.stack
      );

      if (error.response?.data?.error === "Invalid or expired token.") {
        sessionStorage.clear();
        window.location.href = "/";
      }

      throw error;
    }
  }, []);

  return [fetchData];
}

export default useFetch;
