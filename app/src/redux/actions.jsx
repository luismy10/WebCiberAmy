import { RESTORE_TOKEN, SIGN_IN, SIGN_OUT } from "./types";

export const restoreToken = (data) => ({
  type: RESTORE_TOKEN,
  token: data,
});

export const signIn = (data) => ({
  type: SIGN_IN,
  token: data,
});

export const signOut = () => ({
  type: SIGN_OUT,
});
