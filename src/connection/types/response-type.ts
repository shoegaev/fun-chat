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

export type SomeServerResponse = AuthenticationRes | LogoutRes;
