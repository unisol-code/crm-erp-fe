import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

export const legalEntityAtom = atom({
  key: "legalEntity",
  default: [],
  effects: [persistAtom],
});

export const specialityAtom = atom({
  key: "speciality",
  default: [],
  effects: [persistAtom],
});

export const targetOrganizationNames = atom({
  key: "organizationListState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const surgeryTypeAtom = atom({
  key: "surgeryType",
  default: [],
  effects: [persistAtom],
});

export const kitchenTypeAtom = atom({
  key: "kitchenType",
  default: [],
  effects: [persistAtom],
});

export const laundryTypeAtom = atom({
  key: "laundryType",
  default: [],
  effects: [persistAtom],
});

export const productListStateAtom = atom({
  key: "allProductsListState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const productDetailsStateAtom = atom({
  key: "productDetailsState",
  default: {},
  effects_UNSTABLE: [persistAtom],
});

export const cityNamesAtom = atom({
  key: "cityNames",
  default: [],
  effects: [persistAtom],
});

export const doctorListAtom = atom({
  key: "doctorListState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
export const productTypesAtom = atom({
  key: "productTypesState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const hospitalTypeAtom = atom({
  key: "hospitalTypeState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
export const organizationTypeAtom = atom({
  key: "organizationTypeState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const callStatusObjectivesAtom = atom({
  key: "callStatusObejctiveState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
export const genderAtom = atom({
  key: "genderState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
export const salutationAtom = atom({
  key: "salutationSate",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
export const customersProfileAtom = atom({
  key: "customersProfile",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const typeofProfileAtom = atom({
  key: "typeofProfile",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const professionalAssociationsAtom = atom({
  key: "professionalAssociations",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const categoryAtom = atom({
  key: "category",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const organizationCityAtom = atom({
  key: "organizationCityState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
export const organizationTypeByCityAtom = atom({
  key: "organizationTypeByCityState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
export const organizationNameByCityTypeAtom = atom({
  key: "organizationNameByCityTypeState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const specialityByOrgCityTypeAtom = atom({
  key: "specialityByOrgCityTypeState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const getAllStateNameAtom = atom({
  key: "allStateName",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const segmentAtom = atom({
  key: "segment",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const profileAtom = atom({
  key: "profile",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
export const regionAtom = atom({
  key: "region",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
export const designationAtom = atom({
  key: "getDesignation",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const specialityIndividualAtom = atom({
  key: "getspeciality",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const categoryIndividualAtom = atom({
  key: "categorys",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const ProfileIndividualAtom = atom({
  key: "profiles",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const HobbiesIndividualAtom = atom({
  key: "hobbies",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const hospitalAssociatedWithAtom = atom({
  key: "hospitalAssociatedWith",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const employeeAtom = atom({
  key: "employee",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const productsToPromoteAtom = atom({
  key: "productsToPromote",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const orgnizationNamesAtom = atom({
  key: "orgnizationNames",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const designationForNonClinicalAtom = atom({
  key:"designationForNonClinicalState",
  default:[],
  effects_UNSTABLE:[]
})

export const departmentForNonClinicalAtom = atom({
  key:"departmentForNonClinicalState",
  default:[],
  effects_UNSTABLE:[]
})

export const allCitiesAtom = atom({
  key: "allCities",
  default: [],
  effects_UNSTABLE:[persistAtom],
});


export const enviroindiviualdropdownAtom = atom ({
  key:"",
  default:[],
  effects_UNSTABLE:[],
})

export const KWMQ1Atom = atom ({
   key:"KWMQ1",
  default:[],
  effects_UNSTABLE:[],
})

export const KWMQ2Atom = atom ({
   key:"KWMQ2",
  default:[],
  effects_UNSTABLE:[],
})
export const KWMQ5Atom = atom ({
   key:"KWMQ5",
  default:[],
  effects_UNSTABLE:[],
})
export const KWMQ9Atom = atom ({
   key:"KWMQ9",
  default:[],
  effects_UNSTABLE:[],
})
export const KWMQ11Atom = atom ({
   key:"KWMQ11",
  default:[],
  effects_UNSTABLE:[],
})
// remaining
export const IQ2Atom = atom ({
   key:"IQ2",
  default:[],
  effects_UNSTABLE:[],
})
export const IQ4Atom = atom ({
   key:"IQ4",
  default:[],
  effects_UNSTABLE:[],
})
export const BMW4Atom = atom ({
   key:"BMW4",
  default:[],
  effects_UNSTABLE:[],
})
