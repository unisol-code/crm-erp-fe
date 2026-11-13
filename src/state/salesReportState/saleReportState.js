import { atom } from "recoil";
import { createPersistedAtom } from "../recoilConfig";

export const saleReportAtom = atom(createPersistedAtom("saleReport", []));
export const salesReportIdAtom = atom(createPersistedAtom("salesReportId", []));
export const employeeSalesReportIdAtom = atom(createPersistedAtom("employeeSalesReportId", []));