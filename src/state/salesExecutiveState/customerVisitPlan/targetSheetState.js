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