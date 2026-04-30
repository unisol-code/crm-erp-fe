import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

export const companySalesAnalyticsAtom = atom({
  key: "companySalesReport",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
