import { SomeServerErrResponse } from "./error-response-types";
import { MessageData } from "./message-data-type";
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

export type UserAuthenticationCallback = UserLoginCallback | UserLogoutCallback;

// getting users list
export interface UserListCallback extends ServerCallback {
  type: ResType.activeUserList | ResType.inactiveUserList;
  callback: (list: { login: string; isLogined: boolean }[]) => void;
}

// message
export interface MessageCallback extends ServerCallback {
  type: ResType.message;
  callback: (data: MessageData) => void;
}

export interface MessageHistoryCallback extends ServerCallback {
  type: ResType.messageHistory;
  callback: (arr: MessageData[]) => void;
}
// message status change
export interface MessageReadCallback extends ServerCallback {
  type: ResType.messageRead;
  callback: (messageId: string, login?: string) => void;
}

export interface MessageDeliverCallback extends ServerCallback {
  type: ResType.messageDeliver;
  callback: (messageId: string) => void;
}
// deletion a message
export interface MessageDeleteCallback extends ServerCallback {
  type: ResType.messageDelete;
  callback: (messageId: string) => void;
}

export type SomeServerCallback =
  | ServerExternalUserCallback
  | UserAuthenticationCallback
  | UserListCallback
  | MessageCallback
  | MessageHistoryCallback
  | MessageReadCallback
  | MessageDeliverCallback
  | MessageDeleteCallback;
