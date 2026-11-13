import { atom } from "recoil";
import { createPersistedAtom } from "../recoilConfig";

export const territorySnapStatAtom = atom(createPersistedAtom("territorySnapStat", {}));