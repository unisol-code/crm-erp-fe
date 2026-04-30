import { useState } from "react";
import useFetch from "../../../useFetch";
import { useRecoilState } from "recoil";
import { dataManagementToolsAtom, frequentlyRequestedServicesAtom, keyBuyerTypesAtom, majorRevenueSourcesAtom, memberCategoriesAtom, primaryCommunicationChannelsAtom } from "../../../../state/superAdminDatabaseState/enviroDB/enviroAdminDBState";
import conf from "../../../../config";

const useEnviroIndividualDrop = () => {
    const [fetchData] = useFetch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [frequentlyRequestedServices, setFrequentlyRequestedServices] = useRecoilState(frequentlyRequestedServicesAtom);
    const [dataManagementTools, setDataManagementTools] = useRecoilState(dataManagementToolsAtom);
    const [primaryCommunicationChannels, setPrimaryCommunicationChannels] = useRecoilState(primaryCommunicationChannelsAtom);
    const [keyBuyerTypes, setKeyBuyerTypes] = useRecoilState(keyBuyerTypesAtom);
    const [memberCategories, setMemberCategories] = useRecoilState(memberCategoriesAtom);
    const [majorRevenueSources, setMajorRevenueSources] = useRecoilState(majorRevenueSourcesAtom);

    const fetchFrequentlyRequestedServices = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}enviro-individual/get-frequently-requested-services-dropdown`,
            });
            if (res) {
                setFrequentlyRequestedServices(res?.data);
                setLoading(false)
            }
        } catch (error) {
            console.error("Error fetching frequently requested services:", error);
            setError("Failed to fetch frequently requested services.");
            setLoading(false)
        } finally {
            setLoading(false);
        }
    };

    const fetchDataManagementTools = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}enviro-individual/get-data-management-tools-dropdown`,
            });
            if (res) {
                setDataManagementTools(res?.data);
                setLoading(false)
            }
        } catch (error) {
            console.error("Error fetching data management tools:", error);
            setError("Failed to fetch data management tools.");
            setLoading(false)
        } finally {
            setLoading(false);
        }
    };

    const fetchPrimaryCommunicationChannels = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}enviro-individual/get-primary-communication-channels-dropdown`,
            });
            if (res) {
                setPrimaryCommunicationChannels(res?.data);
                setLoading(false)
            }
        } catch (error) {
            console.error("Error fetching primary communication channels:", error);
            setError("Failed to fetch primary communication channels.");
            setLoading(false)
        } finally {
            setLoading(false);
        }
    };

    const fetchKeyBuyerTypes = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}enviro-individual/get-key-buyer-types-dropdown`,
            });
            if (res) {
                setKeyBuyerTypes(res?.data);
                setLoading(false)
            }
        } catch (error) {
            console.error("Error fetching key buyer types:", error);
            setError("Failed to fetch key buyer types.");
            setLoading(false)
        } finally {
            setLoading(false);
        }
    };

    const fetchMemberCategories = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}enviro-individual/get-member-categories-dropdown`,
            });
            if (res) {
                setMemberCategories(res?.data);
                setLoading(false)
            }
        } catch (error) {
            console.error("Error fetching member categories:", error);
            setError("Failed to fetch member categories.");
            setLoading(false)
        } finally {
            setLoading(false);
        }
    };

    const fetchMajorRevenueSources = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetchData({
                method: "GET",
                url: `${conf.apiBaseUrl}enviro-individual/get-major-revenue-sources-dropdown`,
            });
            if (res) {
                setMajorRevenueSources(res?.data);
                setLoading(false)
            }
        } catch (error) {
            console.error("Error fetching major revenue sources:", error);
            setError("Failed to fetch major revenue sources.");
            setLoading(false)
        } finally {
            setLoading(false);
        }
    };

    return {
        fetchFrequentlyRequestedServices,
        fetchDataManagementTools,
        fetchPrimaryCommunicationChannels,
        fetchKeyBuyerTypes,
        fetchMemberCategories,
        fetchMajorRevenueSources,
        loading,
        error,
        frequentlyRequestedServices,
        dataManagementTools,
        primaryCommunicationChannels,
        keyBuyerTypes,
        memberCategories,
        majorRevenueSources
    }
}

export default useEnviroIndividualDrop;