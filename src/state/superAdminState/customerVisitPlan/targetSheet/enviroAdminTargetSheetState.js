// enviroAdminTargetSheetState.js
import { atom } from "recoil";
import { createPersistedAtom } from "../../../recoilConfig";

export const enviroTeamWiseTargetSheetAtom = atom(createPersistedAtom("enviroTeamWiseTargetSheetAtom", null));
export const enviroAdminProductWiseTargetSheetListAtom = atom(createPersistedAtom("enviroAdminProductWiseTargetSheetListAtom", null));
export const enviroAdminProductWiseTargetSheetByIdAtom = atom(createPersistedAtom("enviroAdminProductWiseTargetSheetByIdAtom", null));
export const enviroAdminServiceWiseTargetSheetListAtom = atom(createPersistedAtom("enviroAdminServiceWiseTargetSheetListAtom", null));
export const enviroAdminServiceWiseTargetSheetByIdAtom = atom(createPersistedAtom("enviroAdminServiceWiseTargetSheetByIdAtom", null));
export const enviroAdminProjectWiseTargetSheetListAtom = atom(createPersistedAtom("enviroAdminProjectWiseTargetSheetListAtom", null));
export const enviroAdminProjectWiseTargetSheetByIdAtom = atom(createPersistedAtom("enviroAdminProjectWiseTargetSheetByIdAtom", null));
export const enviroAdminProductUniversalTargetSheetAtom = atom(createPersistedAtom("enviroAdminProductUniversalTargetSheetAtom", null));
export const enviroAdminServiceUniversalTargetSheetAtom = atom(createPersistedAtom("enviroAdminServiceUniversalTargetSheetAtom", null));
export const enviroAdminProjectUniversalTargetSheetAtom = atom(createPersistedAtom("enviroAdminProjectUniversalTargetSheetAtom", null));
export const enviroAdminMyApprovalQueueAtom = atom(createPersistedAtom("enviroAdminMyApprovalQueueAtom", null));
export const enviroTargetSheetsEmployeeAtom = atom(createPersistedAtom("enviroTargetSheetsEmployeeAtom", null));