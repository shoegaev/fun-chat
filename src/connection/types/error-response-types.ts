import { ResType, ServerRes } from "./global-response-types";

export interface ServerErrRes extends ServerRes {
  type: ResType.error;
  payload: {
    error: string;
  };
}

export enum LoginErrMessages {
  loginInUse = "a user with this login is already authorized",
  wrongPassword = "incorrect password",
  alreadyAuthorized = "another user is already authorized in this connection",
}

export interface LoginErrResponse extends ServerErrRes {
  id: "login";
  payload: {
    error: LoginErrMessages;
  };
}

export enum LogautErrMessages {
  wrongLogin = "there is no user with this login",
  wrongPassword = "incorrect password",
  notAuthorized = "the user was not authorized",
}

export interface LogautErrResponse extends ServerErrRes {
  id: "logaut";
  payload: {
    error: LogautErrMessages;
  };
}

export type SomeServerErrResponse =
  | LoginErrResponse
  | LogautErrResponse;
