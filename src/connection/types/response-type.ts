import { ServerRes, ResType } from "./global-response-types";

export interface AuthenticationRes extends ServerRes {
  type: ResType.login;
  payload: {
    user: {
      login: string;
      password: string;
    };
  };
}

export interface LogoutRes extends ServerRes {
  type: ResType.logout;
  payload: {
    user: {
      login: string;
      isLogined: boolean;
    };
  };
}

export interface ExternalLoginRes extends ServerRes {
  type: ResType.externalLogin;
  payload: {
    user: {
      login: string;
      isLogined: true;
    };
  };
}

export interface ExternalLogoutRes extends ServerRes {
  type: ResType.externalLogout;
  payload: {
    user: {
      login: string;
      isLogined: false;
    };
  };
}

export interface InactiveUserListRes extends ServerRes {
  type: ResType.inactiveUsersList;
  payload: {
    users: {login: string, isLogined: true}[];
  };
}

export interface ActiveUserListRes extends ServerRes {
  type: ResType.activeUsersList;
  payload: {
    users: {login: string, isLogined: false}[];
  };
}

export type SomeServerResponse =
  | AuthenticationRes
  | LogoutRes
  | ExternalLoginRes
  | ExternalLogoutRes
  | InactiveUserListRes
  | ActiveUserListRes;

// -----разобратсья с неймингом------- login или authentification
