import { atom } from "recoil";
import { createPersistedAtom } from "../recoilConfig";

export const sAdminResponseAtom = atom(createPersistedAtom("sAdminResponse", null));

export const employeeLoginDataAtom = atom(createPersistedAtom("employeeLoginDatas", null));

export const userAuthState = atom(createPersistedAtom("userAuthState", {
  isAuthenticated: false,
}));

export const userForgotPasswordAtom = atom(createPersistedAtom("userForgotPassword", null));

export const confirmPasswordAtom = atom(createPersistedAtom("confirmPassword", null));

export const otpVerifyAtom = atom(createPersistedAtom("verifyOtp", null));
