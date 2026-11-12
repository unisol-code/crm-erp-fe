import { atom } from "recoil";
import { createPersistedAtom } from "../recoilConfig";

export const databaseCustomerListAtom = atom(createPersistedAtom("databaseCustomerList", []));
export const databaseCustomerDetailsAtom = atom(createPersistedAtom("databaseCustomerDetails", []));
export const organizationTypesAtom = atom(createPersistedAtom("organizationTypes", []));
export const organizationStatusAtom = atom(createPersistedAtom("organizationStatus", []));
export const totalCustomerNoAtom = atom(createPersistedAtom("totlalCustomerNo", null));
export const totalActiveCustomerNoAtom = atom(createPersistedAtom("totlalActiveCustomerNo", null));
export const totalInactiveCustomerNoAtom = atom(createPersistedAtom("totlalInactiveCustomerNo", null));
export const fetchEditRequestAtom = atom(createPersistedAtom("editRequests", []));
export const fetchEmployeeEditRequestAtom = atom(createPersistedAtom("employeeEditRequests", []));
export const fetchIndividualEmployeeEditRequestAtom = atom(createPersistedAtom("individualEmployeeEditRequests", []));
export const fetchOrgnizationalEmployeeEditRequestAtom = atom(createPersistedAtom("OrgnizationalEmployeeEditRequests", []));
export const fetchEmployeeEditRequestDataAtom = atom(createPersistedAtom("employeeEditRequestData", []));