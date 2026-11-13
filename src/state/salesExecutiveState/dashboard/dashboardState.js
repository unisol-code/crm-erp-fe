import { atom } from "recoil";
import { createPersistedAtom } from "../../recoilConfig";

export const priorDoctorsAtom = atom(createPersistedAtom("priorDoctorsAtom", []));
export const territorySnapshotAtom = atom(createPersistedAtom("territorySnapshotAtom", []));
export const topSpecialitiesAtom = atom(createPersistedAtom("topSpecialitiesAtom", []));
export const topCustomersAtom = atom(createPersistedAtom("topCustomersAtom", []));
export const priorDoctorsByIdAtom = atom(createPersistedAtom("priorDoctorsByIdAtom", null));
export const todaySpecialAtom = atom(createPersistedAtom("todaySpecialAtom", []));