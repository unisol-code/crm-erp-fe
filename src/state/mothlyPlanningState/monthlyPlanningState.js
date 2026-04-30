import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const monthlyPlanningListStateAtom = atom({
  key: "monthlyPlanningListState",
  default: [],
  effects_UNSTABLE: [persistAtom], 
});
export const oneMonthPlanningStateAtom = atom({
    key:"oneMonthPlanningState",
    default: [],
    effects_UNSTABLE: [persistAtom],
})

export const monthlyPlanningDetailsStateAtom = atom({
  key:"monthlyPlanningDetailsState",
  default:[],
  effects_UNSTABLE:[persistAtom]
})

export const monthlyPlanningPreviewAtom = atom({
  key:"monthlyPlanningPreviewState",
  default:[],
  effects_UNSTABLE:[persistAtom]
})
