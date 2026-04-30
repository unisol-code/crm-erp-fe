import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const customerTypeAtom = atom({
  key: "customerType",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const leadsForEnviroAtom = atom({
  key: "getLeadsForEnviro",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const leadsForEnviroByIdAtom = atom({
  key: "getLeadsByIdForEnviro",
  default: null,
  effects_UNSTABLE: [persistAtom],
});
