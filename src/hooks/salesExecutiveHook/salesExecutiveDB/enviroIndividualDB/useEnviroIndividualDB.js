import React, { useState } from 'react'
import useFetch from '../../../useFetch';
import { toast } from "react-toastify";
import conf from "../../../../config/index";
import { enviroIndividualDetailsAtom, enviroIndividualListAtom } from '../../../../state/salesExecutiveState/Individuals/enviroIndividualState';
import { useRecoilState } from 'recoil';

const useEnviroIndividualDB = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [enviroIndividualList, setEnviroIndividualList] = useRecoilState(enviroIndividualListAtom);
    const [enviroIndividualDetails, setEnviroIndividualDetails] = useRecoilState(enviroIndividualDetailsAtom);

    const fetchEnviroIndividualList = async (page, limit) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page,
                limit: limit,
            });
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}individual/enviro-get-allindividuals?${params}`,
            });
            if (res) {
                setEnviroIndividualList(res);
                setLoading(false);
            }
        } catch (err) {
            console.error("Error fetching enviro individual list:", err);
            setError(err);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const fetchEnviroIndividualDetails = async (id) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}individual/enviro-get-individualbyid/${id}`,
            });
            if (res) {
                setEnviroIndividualDetails(res?.data);
                setLoading(false);
            }
        } catch (err) {
            console.error("Error fetching enviro individual details:", err);
            setError(err);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };
    
    const createEnviroIndividual = async (data) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "POST",
                url: `${conf.apiBaseUrl}individual/enviro-create-individual`,
                data,
            });
            if (res) {
                toast.success(res?.message);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error creating enviro individual:", error);
            toast.error(
                error?.response?.data?.message
            );
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }
    
    const updateEnviroIndividual = async (id, data) => {
        setLoading(true);
        try {
            const res = await fetchData({
                method: "PUT",
                url: `${conf.apiBaseUrl}individual/enviro-update-individual/${id}`,
                data,
            });
            if (res) {
                toast.success(res?.message);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error updating enviro individual:", error);
            toast.error(
                error?.response?.data?.message
            );
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    const resetEnviroIndividualDetails = () => {
        setEnviroIndividualDetails(null);
    }

    return { loading, createEnviroIndividual, fetchEnviroIndividualList, enviroIndividualList, error,
        updateEnviroIndividual, fetchEnviroIndividualDetails, enviroIndividualDetails, resetEnviroIndividualDetails };
}

export default useEnviroIndividualDB