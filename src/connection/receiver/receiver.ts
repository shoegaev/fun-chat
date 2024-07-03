import { ServerMessage, ServerCallbacks } from "../types/connection-types";

export class Receiver {
  private serverCallbacks: ServerCallbacks;

  private socketArr: WebSocket[];

  constructor(socketArr: WebSocket[], serverCallbacks: ServerCallbacks) {
    this.socketArr = socketArr;
    this.serverCallbacks = serverCallbacks;
  }

  public handleResponse(data: ServerMessage): void {
    this.getCallback(data.type)();
  }

  private getSocket(): WebSocket {
    return this.socketArr[0];
  }

  private getCallback(type: string): () => void {
    const object = this.serverCallbacks.find((obj) => (obj.type = type));
    if (!object) {
      throw new Error(`cannot find callback with type "${type}"`);
    }
    return object.callback;
  }
}
