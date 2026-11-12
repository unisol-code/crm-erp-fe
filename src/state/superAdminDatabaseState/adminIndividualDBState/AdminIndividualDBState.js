import { atom } from "recoil";
import { createPersistedAtom } from "../../recoilConfig";

export const getAdminAllIndividualAtom = atom(createPersistedAtom("getAdminAllindividualKey", []));
export const getAdminIndividualByIDAtom = atom(createPersistedAtom("getAdminIndividualByID", null));
export const getAdminIndividualDashboardAtom = atom(createPersistedAtom("getAdminIndividualDashboard", []));