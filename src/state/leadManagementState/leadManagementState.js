import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

// get all leads
export const leadManagementListAtom = atom({
  key: "leadManagementList",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const leadManagementDetailsAtom = atom({
  key: "leadManagementDetails",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const orgnizationNameDropAtom = atom({
  key: "orgnizationNameDrop",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const productPromotedAtom = atom({
  key: "productPromoted",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const callObjectiveDropAtom = atom({
  key: "callObjectiveDrop",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const leadsByIdAtom = atom({
  key: "getLeadsByIds",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
