// state/allSalesAnalyticsState/allSalesAnalyticsState.js

import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

// Overview Data State
export const overviewDataStateAtom = atom({
  key: "overviewDataState",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

// Loading State
export const analyticsLoadingStateAtom = atom({
  key: "analyticsLoadingState",
  default: false,
  effects_UNSTABLE: [persistAtom],
});

// Filter State - To store current applied filters
export const analyticsFiltersStateAtom = atom({
  key: "analyticsFiltersState",
  default: {
    state: "",
    district: "",
    city: "",
    segment: "",
    speciality: "",
    typeOfDoctorProfile: "",
    salesPerson: "",
    month: "",
    year: "",
  },
  effects_UNSTABLE: [persistAtom],
});

// Error State
export const analyticsErrorStateAtom = atom({
  key: "analyticsErrorState",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

// Overview Data for different sections
export const overviewKPIsStateAtom = atom({
  key: "overviewKPIsState",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const overviewChartsStateAtom = atom({
  key: "overviewChartsState",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const specialityDataStateAtom = atom({
  key: "specialityDataState",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const targetDataStateAtom = atom({
  key: "targetDataState",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const overviewTablesStateAtom = atom({
  key: "overviewTablesState",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

// Overview Summary Stats
export const overviewSummaryStateAtom = atom({
  key: "overviewSummaryState",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

// Hospital Data
export const hospitalDataStateAtom = atom({
  key: "hospitalDataState",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

// Doctor Data
export const doctorDataStateAtom = atom({
  key: "doctorDataState",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

// Organization Data
export const organizationDataStateAtom = atom({
  key: "organizationDataState",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

// Executive Data
export const executiveDataStateAtom = atom({
  key: "executiveDataState",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

// Selected Tab State
export const selectedTabStateAtom = atom({
  key: "selectedTabState",
  default: "overview",
  effects_UNSTABLE: [persistAtom],
});