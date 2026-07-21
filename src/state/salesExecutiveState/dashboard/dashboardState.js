import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

export const priorDoctorsAtom = atom({
  key: "priorDoctorsAtom",
    default: [],
    effects_UNSTABLE: [persistAtom],
});

export const territorySnapshotAtom = atom({
  key: "territorySnapshotAtom",
    default: [],
    effects_UNSTABLE: [persistAtom],
});

export const topSpecialitiesAtom = atom({
  key: "topSpecialitiesAtom",
    default: [],
    effects_UNSTABLE: [persistAtom],
});

// Top Customers Atom

export const topCustomersAtom = atom({
  key: "topCustomersAtom",
    default: [],
    effects_UNSTABLE: [persistAtom],
});

export const priorDoctorsByIdAtom = atom({
  key: "priorDoctorsByIdAtom",
    default: null,
    effects_UNSTABLE: [persistAtom],
});

export const todaySpecialAtom = atom({
  key: "todaySpecialAtom",
    default: [],
    effects_UNSTABLE: [persistAtom],
});