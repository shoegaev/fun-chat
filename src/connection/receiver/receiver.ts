import { ServerCallback, ServerErrCallback } from "../connection";
import { SomeServerResponse } from "../types/response-type";
import { SomeServerErrResponse } from "../types/error-response-types";
import { ResType } from "../types/global-response-types";

export class Receiver {
  private serverCallbacks: ServerCallback[];

  private serverErrCallbacks: ServerErrCallback[];

  private socketArr: WebSocket[];

  constructor(
    socketArr: WebSocket[],
    serverCallbacks: ServerCallback[],
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
      this.getErrCallback(data.payload.error);
    } else {
      this.getCallback(data.type)();
    }
  }

  private getSocket(): WebSocket {
    return this.socketArr[0];
  }

  private getCallback(type: ResType): () => void {
    const object = this.serverCallbacks.find((obj) => obj.type === type);
    if (!object) {
      throw new Error(`cannot find callback with type "${type}"`);
    }
    return object.callback;
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
}
