import { atom } from "recoil";
import { createPersistedAtom } from "../../recoilConfig";

export const getAllIndividualAtom = atom(createPersistedAtom("getAllindividualkey", []));
export const getIndividualByIDAtom = atom(createPersistedAtom("getIndividualByID", null));
export const getIndividualDashboardAtom = atom(createPersistedAtom("getIndividualDashboard", []));
export const getActiveStateAtom = atom(createPersistedAtom("activeState", "Individual"));
export const getEmployeeActiveStateAtom = atom(createPersistedAtom("employeeActiveState", "Individual"));
export const getActiveStateForRequestAtom = atom(createPersistedAtom("activeStateRequest", "Individual"));