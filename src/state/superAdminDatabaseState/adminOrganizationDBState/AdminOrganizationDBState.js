import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

export const adminOrganizationalDBAtom = atom({
  key: "getAdminOrganizationalDBs",
  default: [],
  effects: [persistAtom],
});

export const adminOrganizationalDBByIDAtom = atom({
  key: "getAdminOrganizationalDBByID",
  default: null,
  effects: [persistAtom],
});

export const enviroAdminOrgListAtom = atom({
  key: "enviroAdminOrgListKey",
  default: [],
  effects: [persistAtom],
})

export const enviroAdminOrgDetailsAtom = atom({
  key: "enviroAdminOrgDetailsKey",
  default: null,
  effects: [persistAtom],
})

export const servicesOfferedDropAtom = atom({
  key: "servicesOfferedDropKey",
  default: [],
  effects: [persistAtom],
})
