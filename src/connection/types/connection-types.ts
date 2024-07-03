export type ServerCallbacks = { type: string; callback: () => void }[];
export interface IncomingError {
  id: string;
  type: "ERROR";
  payload: {
    error: string;
  };
}

export interface IncomingAuthentication {
  id: string;
  type: "USER_LOGIN";
  payload: {
    user: {
      login: string;
      password: string;
    };
  };
}

export interface IncomingLogout {
  id: string;
  type: "USER_LOGOUT";
  payload: {
    user: {
      login: string;
      isLogined: boolean;
    };
  };
}

export type ServerMessage =
  | IncomingError
  | IncomingAuthentication
  | IncomingLogout;
