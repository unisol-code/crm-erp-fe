import { atom } from "recoil";
import { createPersistedAtom } from "../recoilConfig";

export const companySalesAnalyticsAtom = atom(createPersistedAtom("companySalesReport", []));