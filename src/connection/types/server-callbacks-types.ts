import { SomeServerErrResponse } from "./error-response-types";
import { ResType } from "./global-response-types";

export type ServerCallback = { type: ResType };
export type ServerErrCallback = {
  error: SomeServerErrResponse["payload"]["error"];
  callback: () => void;
};

// extended user authentification
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

// user authentification
export interface UserLoginCallback extends ServerCallback {
  type: ResType.login;
  callback: () => void;
}

export interface UserLogoutCallback extends ServerCallback {
  type: ResType.logout;
  callback: () => void;
}

export type UserAuthentificationCallback =
  | UserLoginCallback
  | UserLogoutCallback;

// getting users list
export interface UsersListCallback extends ServerCallback {
  type: ResType.activeUsersList | ResType.inactiveUsersList;
  callback: (list: { login: string; isLogined: boolean }[]) => void;
}

export type SomeServerCallback =
  | ServerExternalUserCallback
  | UserAuthentificationCallback
  | UsersListCallback;
