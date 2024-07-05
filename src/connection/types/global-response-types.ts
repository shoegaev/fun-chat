export enum ResType {
  error = "ERROR",
  login = "USER_LOGIN",
  logout = "USER_LOGOUT",
}

export interface ServerRes {
  id: string;
  type: ResType;
}