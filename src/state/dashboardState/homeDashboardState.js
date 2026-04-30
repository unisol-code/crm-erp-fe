import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

export const homeFinancialYearAtom = atom({
  key: "homeFinancialYear",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const homeCalendarYearAtom = atom({
  key: "homeCalendarYear",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const homeTopProductsAtom = atom({
  key: "homeTopProducts",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const homeTopCustomerAtom = atom({
  key: "homeTopCustomer",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const homeEarningByCompanyAtom = atom({
  key: "homeEarningByCompany",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const homeTotalSalesAtom = atom({
  key: "homeTotalSales",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
