import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

export const databaseCustomerListAtom = atom({
  key: "databaseCustomerList",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const databaseCustomerDetailsAtom = atom({
  key: "databaseCustomerDetails",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const organizationTypesAtom = atom({
  key: "organizationTypes",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const organizationStatusAtom = atom({
  key: "organizationStatus",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const totalCustomerNoAtom = atom({
  key: "totlalCustomerNo",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const totalActiveCustomerNoAtom = atom({
  key: "totlalActiveCustomerNo",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const totalInactiveCustomerNoAtom = atom({
  key: "totlalInactiveCustomerNo",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const fetchEditRequestAtom = atom({
  key: "editRequests",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const fetchEmployeeEditRequestAtom = atom({
  key: "employeeEditRequests",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const fetchIndividualEmployeeEditRequestAtom = atom({
  key: "individualEmployeeEditRequests",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const fetchOrgnizationalEmployeeEditRequestAtom = atom({
  key: "OrgnizationalEmployeeEditRequests",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const fetchEmployeeEditRequestDataAtom = atom({
  key: "employeeEditRequestData",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
