import { atom } from "recoil";
import { createPersistedAtom } from "../recoilConfig";

export const leadManagementListAtom = atom(createPersistedAtom("leadManagementList", []));
export const leadManagementDetailsAtom = atom(createPersistedAtom("leadManagementDetails", []));
export const orgnizationNameDropAtom = atom(createPersistedAtom("orgnizationNameDrop", []));
export const productPromotedAtom = atom(createPersistedAtom("productPromoted", []));
export const callObjectiveDropAtom = atom(createPersistedAtom("callObjectiveDrop", []));
export const leadsByIdAtom = atom(createPersistedAtom("getLeadsByIds", []));