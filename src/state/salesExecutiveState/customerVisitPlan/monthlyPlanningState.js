import { atom } from "recoil";
import { createPersistedAtom } from "../../recoilConfig";

export const monthlyPlanningListStateAtom = atom(createPersistedAtom("monthlyPlanningListState", []));
export const oneMonthPlanningStateAtom = atom(createPersistedAtom("oneMonthPlanningState", []));
export const monthlyPlanningDetailsStateAtom = atom(createPersistedAtom("monthlyPlanningDetailsState", null));
export const monthWisePlanningStateAtom = atom(createPersistedAtom("monthWisePlanningState", []));
export const monthlySummaryStateAtom = atom(createPersistedAtom("monthlySummaryState", null));
export const targetSheetYearlySummaryStateAtom = atom(createPersistedAtom("targetSheetYearlySummaryState", null));
export const teamWiseYearlyPlanningStateAtom = atom(createPersistedAtom("teamWiseYearlyPlanningState", null));