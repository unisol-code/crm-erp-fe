// themeAtom.js
import { atom } from "recoil";
import { createPersistedAtom } from "../../recoilConfig";

export const enviroIndividualListAtom = atom(createPersistedAtom("enviroIndividualListAtomKey", []));

export const enviroIndividualDetailsAtom = atom(createPersistedAtom("enviroIndividualDetailsAtomKey", null));