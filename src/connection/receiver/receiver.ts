import {
  UserAuthentificationCallback,
  ServerExternalUserCallback,
  ServerErrCallback,
  SomeServerCallback,
  UsersListCallback
} from "../types/server-callbacks-types";
import { SomeServerResponse } from "../types/response-type";
import { SomeServerErrResponse } from "../types/error-response-types";
import { ResType } from "../types/global-response-types";

export class Receiver {
  private serverCallbacks: SomeServerCallback[];

  private serverErrCallbacks: ServerErrCallback[];

  private socketArr: WebSocket[];

  constructor(
    socketArr: WebSocket[],
    serverCallbacks: SomeServerCallback[],
    serverErrCallbacks: ServerErrCallback[],
  ) {
    this.socketArr = socketArr;
    this.serverCallbacks = serverCallbacks;
    this.serverErrCallbacks = serverErrCallbacks;
  }

  public handleResponse(
    data: SomeServerResponse | SomeServerErrResponse,
  ): void {
    if (data.type === ResType.error) {
      this.getErrCallback(data.payload.error)();
    } else {
      const callback = this.getCallback(data.type);
      this.callCallback(callback, data);
    }
  }

  private getCallback(type: ResType): SomeServerCallback {
    const callback = this.serverCallbacks.find((obj) => obj.type === type);
    if (!callback) {
      throw new Error(`cannot find callback with type "${type}"`);
    }
    return callback;
  }

  private getErrCallback(errorText: SomeServerErrResponse["payload"]["error"]) {
    const object = this.serverErrCallbacks.find(
      (obj) => obj.error === errorText,
    );
    if (!object) {
      throw new Error(`cannot find error callback with text "${errorText}"`);
    }
    return object.callback;
  }

  private callCallback(
    callback: SomeServerCallback,
    data: SomeServerResponse,
  ): void {
    if (data.type !== callback.type) {
      throw new Error();
    }
    if (
      data.type === ResType.externalLogin ||
      data.type === ResType.externalLogout
    ) {
      (callback as ServerExternalUserCallback).callback(
        data.payload.user.login,
      );
    } else if (
      data.type === ResType.activeUsersList ||
      data.type === ResType.inactiveUsersList
    ) {
      (
        callback as UsersListCallback
      ).callback(data.payload.users);
    } else {
      (callback as UserAuthentificationCallback).callback();
    }
  }
}
