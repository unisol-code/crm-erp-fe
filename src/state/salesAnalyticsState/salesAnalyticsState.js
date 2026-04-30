import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

export const salesAnalyticsAtom = atom({
  key: "salesReport",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const salesByIdAtom = atom({
  key: "salesByIds",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const salesAddAtom = atom({
  key: "salesByAdd",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
