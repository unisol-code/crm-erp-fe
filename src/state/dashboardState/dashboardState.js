import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

export const allCompanyAtom = atom({
  key: "allCompany",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const financialYearAtom = atom({
  key: "financialYears",
  default: [],
  effects_UNSTABLE: [persistAtom],
})

export const calendarYearAtom = atom({
  key: "calendarYears",
  default: [],
  effects_UNSTABLE: [persistAtom],
})

export const topProductsAtom = atom({
  key: "topProducts",
  default: [],
  effects_UNSTABLE: [persistAtom],
})

export const topCustomerAtom = atom({
  key: "topCustomers",
  default: [],
  effects_UNSTABLE: [persistAtom],
})

export const earningByItemAtom = atom({
  key: "earningByItem",
  default: [],
  effects_UNSTABLE: [persistAtom],
})


export const businessSnapShotAtom = atom({
  key: "businessSnapShot",
  default: [],
  effects_UNSTABLE: [persistAtom],
})

export const todaySpecialAtom = atom({
  key: "todaySpecial",
  default: [],
  effects_UNSTABLE: [persistAtom],
})