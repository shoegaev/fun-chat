import { ServerRes, ResType } from "./global-response-types";
import { MessageData } from "./message-data-type";

export interface LoginRes extends ServerRes {
  type: ResType.login;
  payload: {
    user: {
      login: string;
      isLogined: boolean;
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
  type: ResType.inactiveUserList;
  payload: {
    users: { login: string; isLogined: true }[];
  };
}

export interface ActiveUserListRes extends ServerRes {
  type: ResType.activeUserList;
  payload: {
    users: { login: string; isLogined: false }[];
  };
}

export interface MessageRes extends ServerRes {
  type: ResType.message;
  payload: {
    message: MessageData;
  };
}

export interface MessageHistoryRes extends ServerRes {
  type: ResType.messageHistory;
  payload: {
    messages: MessageData[];
  };
}

export interface MessageReadRes extends ServerRes {
  type: ResType.messageRead;
  payload: {
    message: {
      id: string;
    };
  };
}

export interface MessageDeliverRes extends ServerRes {
  type: ResType.messageDeliver;
  payload: {
    message: {
      id: string;
    };
  };
}

export type SomeServerResponse =
  | LoginRes
  | LogoutRes
  | ExternalLoginRes
  | ExternalLogoutRes
  | InactiveUserListRes
  | ActiveUserListRes
  | MessageRes
  | MessageHistoryRes
  | MessageReadRes
  | MessageDeliverRes;
