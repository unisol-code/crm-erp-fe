import { atom } from "recoil";
import { createPersistedAtom } from "../recoilConfig";

export const salesAnalyticsAtom = atom(createPersistedAtom("salesReport", []));
export const salesByIdAtom = atom(createPersistedAtom("salesByIds", []));
export const salesAddAtom = atom(createPersistedAtom("salesByAdd", []));