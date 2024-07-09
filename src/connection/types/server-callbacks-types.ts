import { SomeServerErrResponse } from "./error-response-types";
import { ResType } from "./global-response-types";

export type ServerCallback = { type: ResType };
export type ServerErrCallback = {
  error: SomeServerErrResponse["payload"]["error"];
  callback: () => void;
};

export interface ExternalUserLoginCallback extends ServerCallback {
  type: ResType.externalLogin;
  callback: (userLogin: string) => void;
}

export interface ExternalUserLogoutCallback extends ServerCallback {
  type: ResType.externalLogout;
  callback: (userLogin: string) => void;
}

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

export type ServerExternalUserCallback =
  | ExternalUserLoginCallback
  | ExternalUserLogoutCallback;

export type SomeServerCallback =
  | ServerExternalUserCallback
  | UserAuthentificationCallback;
