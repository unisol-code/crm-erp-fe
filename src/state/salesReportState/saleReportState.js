import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

export const saleReportAtom = atom({
  key: "saleReport",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const salesReportIdAtom = atom({
  key: "salesReportId",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const employeeSalesReportIdAtom = atom({
  key: "employeeSalesReportId",
  default: [],
  effects_UNSTABLE: [persistAtom],
});