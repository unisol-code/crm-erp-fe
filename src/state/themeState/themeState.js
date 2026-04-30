// themeAtom.js
import { atom } from "recoil";
import { themes } from "../../components/theme/Themes";
import { createPersistedAtom } from "../recoilConfig";

export const themeStateAtom = atom(createPersistedAtom("themeStateAtomKey", themes["Home"]));