import { State } from "../state/state";
import { LoadingWindowView } from "./loading-window-view/loading-window-view";
import { Sender } from "./sender/sender";
import { Receiver } from "./receiver/receiver";
import { ResType } from "./types/global-response-types";
import { SomeServerResponse } from "./types/response-type";
import { SomeServerErrResponse } from "./types/error-response-types";
const SERVER_URL = "ws://127.0.0.1:4000";

export type ServerCallback = { type: ResType; callback: () => void };
export type ServerErrCallback = {
  error: SomeServerErrResponse["payload"]["error"];
  callback: () => void;
};

export class Connection {
  private state: State;

  private socketArr: WebSocket[];

  private loadingWindow: LoadingWindowView;

  private connectionAttempt: number;

  public sender: Sender;

  private receiver: Receiver;

  private authorizedUser: { login: string; password: string } | null;

  constructor(
    state: State,
    serverCallbacks: ServerCallback[],
    serverErrCallbacks: ServerErrCallback[],
  ) {
    this.state = state;
    this.socketArr = [];
    this.loadingWindow = this.createLoadingWindow();
    this.connectionAttempt = 1;
    this.sender = new Sender(this.socketArr);
    this.receiver = new Receiver(
      this.socketArr,
      serverCallbacks,
      serverErrCallbacks,
    );
    this.authorizedUser = null;
  }

  public isUserAuthorized(): boolean {
    return Boolean(this.authorizedUser);
  }

  public startConnection(): void {
    const socket = new WebSocket(SERVER_URL);
    if (this.connectionAttempt === 1) {
      this.loadingWindow.show();
    }
    socket.addEventListener("open", () => {
      this.connectionAttempt = 1;
      this.socketArr[0] = socket;
      this.configureSocket(socket);
      setTimeout(() => {
        this.loadingWindow.hide();
      }, 300);
    });
    socket.addEventListener("error", () => {
      setTimeout(() => {
        this.connectionAttempt += 1;
        if (this.connectionAttempt <= 6) {
          this.startConnection();
        } else {
          // some error handling logic
        }
      }, 500);
    });
  }

  private createLoadingWindow(): LoadingWindowView {
    const loadingWindow = new LoadingWindowView();
    document.body.append(loadingWindow.getHtmlElement());
    return loadingWindow;
  }

  private configureSocket(socket: WebSocket): void {
    socket.addEventListener("message", (event) => {
      const data: SomeServerErrResponse | SomeServerResponse = JSON.parse(
        event.data,
      );
      this.handleUserAuthorizationStatus(data);
      this.receiver.handleResponse(data);
    });
  }

  private handleUserAuthorizationStatus(
    data: SomeServerErrResponse | SomeServerResponse,
  ): void {
    if (data.type === "USER_LOGIN") {
      this.authorizedUser = {
        login: data.payload.user.login,
        password: data.payload.user.password,
      };
    } else if (data.type === "USER_LOGOUT") {
      this.authorizedUser = null;
    }
  }
}
