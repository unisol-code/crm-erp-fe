// adminTargetSheetState.js
import { atom } from "recoil";
import { createPersistedAtom } from "../../state/recoilConfig.js";

export const allEmployeeListAtom = atom(
  createPersistedAtom("allEmployeeListAtomKey", [])
);

export const allEmployeeDetailsAtom = atom(
  createPersistedAtom("allEmployeeDetailsAtomKey", null)
);

// Plain (non-persisted): fetched per :id on demand, so persistence is not
// needed and avoids the recoil-persist hydration crash class.
export const teamWiseTargetSheetListAtom = atom({
  key: "teamWiseTargetSheetListAtom",
  default: null,
});

export const universalTargetSheetAtom = atom({
  key: "universalTargetSheetAtom",
  default: null,
});
