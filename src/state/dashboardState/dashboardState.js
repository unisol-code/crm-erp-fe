import { atom } from "recoil";
import { createPersistedAtom } from "../recoilConfig";

export const allCompanyAtom = atom(createPersistedAtom("allCompany", []));
export const financialYearAtom = atom(createPersistedAtom("financialYears", []));
export const calendarYearAtom = atom(createPersistedAtom("calendarYears", []));
export const topProductsAtom = atom(createPersistedAtom("topProducts", []));
export const topCustomerAtom = atom(createPersistedAtom("topCustomers", []));
export const earningByItemAtom = atom(createPersistedAtom("earningByItem", []));
export const businessSnapShotAtom = atom(createPersistedAtom("businessSnapShot", []));
export const todaySpecialAtom = atom(createPersistedAtom("todaySpecial", []));