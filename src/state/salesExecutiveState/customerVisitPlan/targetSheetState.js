import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const targetSheetListStateAtom = atom({
  key: "tagetSheetListState",
  default: [],
  effects_UNSTABLE: [persistAtom], 
});

export const targetSheetDetailsAtom = atom({
  key:"targetSheetDetailState",
  default:[],
  effects_UNSTABLE:[persistAtom]
})

export const yearWiseProductTargetSheetStateAtom = atom({
  key: "yearWiseProductTargetSheetState",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const hospitalWiseTargetSheetStateAtom = atom({
  key: "hospitalWiseTargetSheetState",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const hospitalIdWiseTargetSheetStateAtom = atom({
  key: "hospitalIdWiseTargetSheetState",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const productIdWiseTargetSheetStateAtom = atom({
  key: "productIdWiseTargetSheetState",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const allIndividualTargetSheetStateAtom = atom({
  key: "allIndividualTargetSheetState",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const individualIdWiseTargetSheetStateAtom = atom({
  key: "individualIdWiseTargetSheetState",
  default: null,
  effects_UNSTABLE: [persistAtom],
});


export const enviroTargetSheetDetailsAtom = atom({
  key: "enviroTargetSheetDetailsState",
  default: null,
  effects_UNSTABLE: [persistAtom],
}); 

export const productWiseTargetSheetStateAtom = atom({
  key: "productWiseTargetSheetState",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const serviceIndividualOrganizationTargetSheetStateAtom = atom({
  key: "serviceIndividualOrganizationTargetSheetState",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const projectIndividualOrganizationTargetSheetStateAtom = atom({
  key: "projectIndividualOrganizationTargetSheetState",
  default: null,
  effects_UNSTABLE: [persistAtom],
});