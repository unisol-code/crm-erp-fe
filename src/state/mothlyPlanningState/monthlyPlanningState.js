import { atom } from "recoil";
import { createPersistedAtom } from "../recoilConfig";

export const monthlyPlanningListStateAtom = atom(createPersistedAtom("monthlyPlanningListState", []));

export const oneMonthPlanningStateAtom = atom(createPersistedAtom("oneMonthPlanningState", []));

export const monthlyPlanningDetailsStateAtom = atom(createPersistedAtom("monthlyPlanningDetailsState", []));

export const monthlyPlanningPreviewAtom = atom(createPersistedAtom("monthlyPlanningPreviewState", []));

export const monthWisePlanningStateAtom = atom(createPersistedAtom("monthWisePlanningState", []));

export const  monthlySummaryStateAtom = atom(createPersistedAtom("monthlySummaryState", []));
