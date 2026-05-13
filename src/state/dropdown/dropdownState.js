import { atom } from "recoil";
import { createPersistedAtom } from "../recoilConfig";

export const legalEntityAtom = atom(createPersistedAtom("legalEntity", []))

export const specialityAtom = atom(createPersistedAtom("speciality", []))

export const targetOrganizationNames = atom(createPersistedAtom("organizationListState", []))

export const surgeryTypeAtom = atom(createPersistedAtom("surgeryType", []))

export const kitchenTypeAtom = atom(createPersistedAtom("kitchenType", []))

export const laundryTypeAtom = atom(createPersistedAtom("laundryType", []))

export const productListStateAtom = atom(createPersistedAtom("allProductsListState", []))

export const productDetailsStateAtom = atom(createPersistedAtom("productDetailsState", {}))

export const cityNamesAtom = atom(createPersistedAtom("cityNames", []))

export const doctorListAtom = atom(createPersistedAtom("doctorListState", []))

export const productTypesAtom = atom(createPersistedAtom("productTypesState", []))

export const hospitalTypeAtom = atom(createPersistedAtom("hospitalTypeState", []))

export const organizationTypeAtom = atom(createPersistedAtom("organizationTypeState", []))

export const callStatusObjectivesAtom = atom(createPersistedAtom("callStatusObejctiveState", []))

export const genderAtom = atom(createPersistedAtom("genderState", []))

export const salutationAtom = atom(createPersistedAtom("salutationSate", []))

export const customersProfileAtom = atom(createPersistedAtom("customersProfile", []))

export const typeofProfileAtom = atom(createPersistedAtom("typeofProfile", []))

export const professionalAssociationsAtom = atom(createPersistedAtom("professionalAssociations", []))

export const categoryAtom = atom(createPersistedAtom("category", []))

export const organizationCityAtom = atom(createPersistedAtom("organizationCityState", []))

export const organizationTypeByCityAtom = atom(createPersistedAtom("organizationTypeByCityState", []))

export const organizationNameByCityTypeAtom = atom(createPersistedAtom("organizationNameByCityTypeState", []))

export const specialityByOrgCityTypeAtom = atom(createPersistedAtom("specialityByOrgCityTypeState", []))

export const getAllStateNameAtom = atom(createPersistedAtom("allStateName", []));

export const districtListAtom = atom(createPersistedAtom("districtList", []));

export const allCitiesAtom = atom(createPersistedAtom("allCities", []));

export const segmentAtom = atom(createPersistedAtom("segment", []));

export const profileAtom = atom(createPersistedAtom("profile", []));

export const regionAtom = atom(createPersistedAtom("region", []));

export const designationAtom = atom(createPersistedAtom("getDesignation", []));

export const specialityIndividualAtom = atom(createPersistedAtom("getspeciality", []));

export const categoryIndividualAtom = atom(createPersistedAtom("categorys", []));

export const ProfileIndividualAtom = atom(createPersistedAtom("profiles", []));

export const HobbiesIndividualAtom = atom(createPersistedAtom("hobbies", []));

export const hospitalAssociatedWithAtom = atom(createPersistedAtom("hospitalAssociatedWith", []));

export const employeeAtom = atom(createPersistedAtom("employee", []));

export const productsToPromoteAtom = atom(createPersistedAtom("productsToPromote", []));

export const orgnizationNamesAtom = atom(createPersistedAtom("orgnizationNames", []));

export const designationForNonClinicalAtom = atom(createPersistedAtom("designationForNonClinicalState", []));

export const departmentForNonClinicalAtom = atom(createPersistedAtom("departmentForNonClinicalState", []));

export const enviroindiviualdropdownAtom = atom(createPersistedAtom("enviroindiviualdropdown", []));

export const KWMQ1Atom = atom(createPersistedAtom("KWMQ1", []));

export const KWMQ2Atom = atom(createPersistedAtom("KWMQ2", []));

export const KWMQ5Atom = atom(createPersistedAtom("KWMQ5", []));

export const KWMQ9Atom = atom(createPersistedAtom("KWMQ9", []));

export const KWMQ11Atom = atom(createPersistedAtom("KWMQ11", []));

export const IQ2Atom = atom(createPersistedAtom("IQ2", []));

export const IQ4Atom = atom(createPersistedAtom("IQ4", []));

export const BMW4Atom = atom(createPersistedAtom("BMW4", []));
