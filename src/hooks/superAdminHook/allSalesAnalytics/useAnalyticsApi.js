// hooks/superAdminHook/allSalesAnalytics/useAnalyticsApi.js
//
// ONE small helper that is used by BOTH analytics hooks.
//
// Why does it exist?
// Every analytics API needs the same boring work:
//   1. add the base url
//   2. turn the filters object into a query string (?state=..&region=..)
//   3. read the login token            (done inside useFetch)
//   4. show / hide the page loader
//   5. show an error toast when the request fails
// Instead of repeating those ~25 lines in every API function, each hook calls
//   get({ path, keys, filters, label })
// and only has to care about the response.

import { useCallback } from "react";
import { toast } from "react-toastify";
import useFetch from "../../useFetch";
import conf from "../../../config/index";

/**
 * Builds the query string for an API call.
 *
 * buildQueryString({ state: "Maharashtra", region: "" }, ["state", "region"])
 *   -> "?state=Maharashtra"      // empty values are skipped
 */
const buildQueryString = (filters = {}, keys = []) => {
  const params = new URLSearchParams();

  keys.forEach((key) => {
    const value = filters[key];
    if (value) params.append(key, String(value));
  });

  const query = params.toString();
  return query ? `?${query}` : "";
};

/**
 * Returns a `get()` function that runs GET requests for one hook
 * (and handles loading / error / toast for that hook).
 *
 * get({ ... }) options:
 *   path          endpoint after the base url, e.g. "dashboard/OverviewDataAnalytics"
 *   keys          query parameters this API understands, e.g. ["state", "region"]
 *   filters       the values for those keys (already merged with the saved filters)
 *   label         used in the messages: "Failed to fetch <label>"
 *   silent        true = do not toggle the page loader (background refresh)
 *   checkSuccess  true (default) = API must answer { success: true }
 *                 false          = older API that answers without the success flag
 *
 * Returns the response, or null when the request failed.
 */
const useAnalyticsApi = ({ setLoading, setError }) => {
  const [fetchData] = useFetch();

  const get = useCallback(
    async ({ path, keys = [], filters = {}, label, silent = false, checkSuccess = true }) => {
      if (!silent) setLoading(true);
      setError(null);

      try {
        const url = `${conf.apiBaseUrl}${path}${buildQueryString(filters, keys)}`;
        const res = await fetchData({ method: "GET", url });

        if (checkSuccess) {
          if (!res?.success) {
            throw new Error(res?.message || `Failed to fetch ${label}`);
          }
        } else if (!res) {
          throw new Error("No data received from the server");
        }

        return res;
      } catch (err) {
        console.error(`Error while fetching ${label}:`, err);
        setError(err.message || `Failed to fetch ${label}`);
        toast.error(err.response?.data?.message || `Failed to fetch ${label}`);
        return null;
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [fetchData, setLoading, setError]
  );

  return get;
};

export default useAnalyticsApi;
