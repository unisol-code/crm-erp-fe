import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

export const monthlyPlanningListStateAtom = atom({
  key: "monthlyPlanningListState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const oneMonthPlanningStateAtom = atom({
  key: "oneMonthPlanningState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const monthlyPlanningDetailsStateAtom = atom({
  key: "monthlyPlanningDetailsState",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const monthWisePlanningStateAtom = atom({
  key: "monthWisePlanningState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const monthlySummaryStateAtom = atom({
  key: "monthlySummaryState",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const targetSheetYearlySummaryStateAtom = atom({
  key: "targetSheetYearlySummaryState",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const teamWiseYearlyPlanningStateAtom = atom({
  key: "teamWiseYearlyPlanningState",
  default: null,
  effects_UNSTABLE: [persistAtom],
});