import { atom } from "recoil";
import { createPersistedAtom } from "../recoilConfig";

export const allEmployeeAtom = atom(createPersistedAtom("allEmployee", []));
