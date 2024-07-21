export enum ResType {
  error = "ERROR",
  login = "USER_LOGIN",
  logout = "USER_LOGOUT",
  externalLogin = "USER_EXTERNAL_LOGIN",
  externalLogout = "USER_EXTERNAL_LOGOUT",
  activeUserList = "USER_ACTIVE",
  inactiveUserList = "USER_INACTIVE",
  message = "MSG_SEND",
  messageHistory = "MSG_FROM_USER",
}

export interface ServerRes {
  id: string;
  type: ResType;
}
