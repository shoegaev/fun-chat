import { SomeServerErrResponse } from "./error-response-types";
import { ResType } from "./global-response-types";

export type ServerCallback = { type: ResType };
export type ServerErrCallback = {
  error: SomeServerErrResponse["payload"]["error"];
  callback: () => void;
};

// extended user Authentication
export interface ExternalUserLoginCallback extends ServerCallback {
  type: ResType.externalLogin;
  callback: (userLogin: string) => void;
}

export interface ExternalUserLogoutCallback extends ServerCallback {
  type: ResType.externalLogout;
  callback: (userLogin: string) => void;
}

export type ServerExternalUserCallback =
  | ExternalUserLoginCallback
  | ExternalUserLogoutCallback;

// user Authentication
export interface UserLoginCallback extends ServerCallback {
  type: ResType.login;
  callback: () => void;
}

export interface UserLogoutCallback extends ServerCallback {
  type: ResType.logout;
  callback: () => void;
}

export type UserAuthenticationCallback =
  | UserLoginCallback
  | UserLogoutCallback;

// getting users list
export interface UserListCallback extends ServerCallback {
  type: ResType.activeUserList | ResType.inactiveUserList;
  callback: (list: { login: string; isLogined: boolean }[]) => void;
}

export type SomeServerCallback =
  | ServerExternalUserCallback
  | UserAuthenticationCallback
  | UserListCallback;
