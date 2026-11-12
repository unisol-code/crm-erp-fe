import { atom } from "recoil";
import { createPersistedAtom } from "../../recoilConfig";

export const adminOrganizationalDBAtom = atom(createPersistedAtom("getAdminOrganizationalDBs", []));
export const adminOrganizationalDBByIDAtom = atom(createPersistedAtom("getAdminOrganizationalDBByID", null));
export const enviroAdminOrgListAtom = atom(createPersistedAtom("enviroAdminOrgListKey", []));
export const enviroAdminOrgDetailsAtom = atom(createPersistedAtom("enviroAdminOrgDetailsKey", null));
export const servicesOfferedDropAtom = atom(createPersistedAtom("servicesOfferedDropKey", []));