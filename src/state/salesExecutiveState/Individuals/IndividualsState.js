import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

export const getAllIndividualAtom = atom({
  key: "getAllindividualkey",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const getIndividualByIDAtom = atom({
  key: "getIndividualByID",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const getIndividualDashboardAtom = atom({
  key: "getIndividualDashboard",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const getActiveStateAtom = atom({
  key: "activeState",
  default: "Individual",
  effects_UNSTABLE: [persistAtom],
});

export const getEmployeeActiveStateAtom = atom({
  key: "employeeActiveState",
  default: "Individual",
  effects_UNSTABLE: [persistAtom],
});

export const getActiveStateForRequestAtom = atom({
  key: "activeStateRequest",
  default: "Individual",
  effects_UNSTABLE: [persistAtom],
});
