import React, { useState } from 'react'
import useFetch from '../../../useFetch';
import { enviroEditRequestsAtom, enviroIndEmpEditRequestsAtom, enviroOrgEmpEditRequestsAtom } from '../../../../state/superAdminDatabaseState/enviroDB/enviroAdminDBState';
import { useRecoilState } from 'recoil';
import conf from '../../../../config';

const useEnviroAdminDB = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [enviroEditRequests, setEnviroEditRequests] = useRecoilState(enviroEditRequestsAtom);
    const [enviroIndEmpEditRequests, setEnviroIndEmpEditRequests] = useRecoilState(enviroIndEmpEditRequestsAtom);

    const [enviroOrgEmpEditRequests, setEnviroOrgEmpEditRequests] = useRecoilState(enviroOrgEmpEditRequestsAtom);

    const fetchEnviroEmpAllRequest = async (id, page, limit) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page,
                limit: limit
            });
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}edit/Envro-get-user-edit-requestsForIndividual/${id}?${params}`,
            })
            if (res) {
                setEnviroIndEmpEditRequests(res);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching Enviro Employee Edit Requests:", error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const fetchEnviroOrgAllRequest = async (id, page, limit) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page,
                limit: limit
            });
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}edit/get-enviro-user-edit-requestsForOrganization/${id}?${params}`,
            });
            if (res) {
                setEnviroOrgEmpEditRequests(res);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching Enviro Employee Edit Requests:", error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    return { fetchEnviroEmpAllRequest, enviroOrgEmpEditRequests, fetchEnviroOrgAllRequest, enviroIndEmpEditRequests, loading, error };
}

export default useEnviroAdminDB