import { atom } from "recoil";
import { createPersistedAtom } from "../recoilConfig";

export const customerTypeAtom = atom(createPersistedAtom("customerType", []));
export const leadsForEnviroAtom = atom(createPersistedAtom("getLeadsForEnviro", []));
export const leadsForEnviroByIdAtom = atom(createPersistedAtom("getLeadsByIdForEnviro", null));