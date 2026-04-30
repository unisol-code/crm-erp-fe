import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

export const organizationalDBAtom = atom({
  key: "organizationalDBs",
  default: [],
  effects: [persistAtom],
});

export const organizationalDBByIDAtom = atom({
  key: "organizationalDBByID",
  default: null,
  effects: [persistAtom],
});
