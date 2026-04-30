import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

export const territorySnapStatAtom = atom({
  key: "territorySnapStat",
  default: {},
  effects_UNSTABLE: [persistAtom],
});

