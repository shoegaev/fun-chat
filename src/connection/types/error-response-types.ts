import { ResType, ServerRes } from "./global-response-types"

export interface ServerErrRes extends ServerRes {
  type: ResType.error;
  payload: {
    error: string;
  };
}

export enum AuthentificationErrMessage {
  loginInUse = "a user with this login is already authorized",
  wrongPassword = "incorrect password",
  alreadyAuthorized = "another user is already authorized in this connection",
}

export interface AuthentificationErrResponse extends ServerErrRes {
  payload: {
    error: AuthentificationErrMessage;
  };
}

export enum LogautErrMessage {
  wrongLogin = "there is no user with this login",
  wrongPassword = "incorrect password",
  notAuthorized = "the user was not authorized",
}

export interface LogautErrResponse extends ServerErrRes {
  payload: {
    error: LogautErrMessage;
  };
}

export type SomeServerErrResponse = AuthentificationErrResponse | LogautErrResponse;
