import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

export const getAdminAllIndividualAtom = atom({
  key: "getAdminAllindividualKey",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const getAdminIndividualByIDAtom = atom({
  key: "getAdminIndividualByID",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const getAdminIndividualDashboardAtom = atom({
  key: "getAdminIndividualDashboard",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
