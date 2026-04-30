import { atom } from "recoil";
import { createPersistedAtom } from "../../recoilConfig";

export const enviroEditRequestsAtom = atom(createPersistedAtom("enviroEditRequestsKey", []));

export const enviroIndEmpEditRequestsAtom = atom(createPersistedAtom("enviroIndEmpEditRequestsKey", []));

export const enviroOrgEmpEditRequestsAtom = atom(createPersistedAtom("enviroOrgEmpEditRequestsKey", []));

export const enviroAdminIndividualListAtom = atom(createPersistedAtom("enviroAdminIndividualListKey", []));

export const enviroAdminIndividualDetailsAtom = atom(createPersistedAtom("enviroAdminIndividualDetailsKey", null));

export const enviroGovtOfficerListAtom = atom(createPersistedAtom("enviroGovtOfficerListKey", []));

export const enviroGovtOfficerDetailsAtom = atom(createPersistedAtom("enviroGovtOfficerDetailsKey", null));

export const enviroFPOListAtom = atom(createPersistedAtom("enviroFPOListKey", []));

export const enviroFPODetailsAtom = atom(createPersistedAtom("enviroFPODetailsKey", null));

// dropdown
export const frequentlyRequestedServicesAtom = atom(createPersistedAtom("frequentlyRequestedServicesKey", []));
export const dataManagementToolsAtom = atom(createPersistedAtom("dataManagementToolsKey", []));
export const primaryCommunicationChannelsAtom = atom(createPersistedAtom("primaryCommunicationChannelsKey", []));
export const keyBuyerTypesAtom = atom(createPersistedAtom("keyBuyerTypesKey", []));
export const memberCategoriesAtom = atom(createPersistedAtom("memberCategoriesKey", []));
export const majorRevenueSourcesAtom = atom(createPersistedAtom("majorRevenueSourcesKey", []));