import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const targetSheetListStateAtom = atom({
  key: "tagetSheetListState",
  default: [],
  effects_UNSTABLE: [persistAtom], 
});

export const targetSheetDetailsAtom = atom({
  key:"targetSheetDetailState",
  default:[],
  effects_UNSTABLE:[persistAtom]
})

export const yearWiseProductTargetSheetStateAtom = atom({
  key: "yearWiseProductTargetSheetState",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const hospitalWiseTargetSheetStateAtom = atom({
  key: "hospitalWiseTargetSheetState",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const hospitalIdWiseTargetSheetStateAtom = atom({
  key: "hospitalIdWiseTargetSheetState",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const productIdWiseTargetSheetStateAtom = atom({
  key: "productIdWiseTargetSheetState",
  default: null,
  effects_UNSTABLE: [persistAtom],
});