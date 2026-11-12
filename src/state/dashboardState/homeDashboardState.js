import { atom } from "recoil";
import { createPersistedAtom } from "../recoilConfig";

export const homeFinancialYearAtom = atom(createPersistedAtom("homeFinancialYear", []));
export const homeCalendarYearAtom = atom(createPersistedAtom("homeCalendarYear", []));
export const homeTopProductsAtom = atom(createPersistedAtom("homeTopProducts", []));
export const homeTopCustomerAtom = atom(createPersistedAtom("homeTopCustomer", []));
export const homeEarningByCompanyAtom = atom(createPersistedAtom("homeEarningByCompany", []));
export const homeTotalSalesAtom = atom(createPersistedAtom("homeTotalSales", []));