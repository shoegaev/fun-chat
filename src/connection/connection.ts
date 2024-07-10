import { State } from "../state/state";
import { LoadingWindowView } from "./loading-window-view/loading-window-view";
import { Sender } from "./sender/sender";
import { Receiver } from "./receiver/receiver";
import { SomeServerResponse } from "./types/response-type";
import { SomeServerCallback, ServerErrCallback } from "./types/server-callbacks-types";
import {
  SomeServerErrResponse,
  AuthentificationErrResponse,
} from "./types/error-response-types";
const SERVER_URL = "ws://127.0.0.1:4000";

export class Connection {
  private state: State;

  private socketArr: WebSocket[];

  private loadingWindow: LoadingWindowView;

  private connectionAttempt: number;

  public sender: Sender;

  private receiver: Receiver;

  public authorizedUser: { login: string; password: string } | null;

  constructor(
    state: State,
    serverCallbacks: SomeServerCallback[],
    serverErrCallbacks: ServerErrCallback[],
  ) {
    this.state = state;
    this.socketArr = [];
    this.loadingWindow = this.createLoadingWindow();
    this.connectionAttempt = 1;
    this.sender = new Sender(this.socketArr, this.loadingWindow);
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
          // -------------------------
          // some error handling logic
          // -------------------------
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
      if (data.type === "ERROR" && data.id === "login") {
        this.showAuthentificationErrorMessage(data);
        return;
      }
      this.receiver.handleResponse(data);
    });
    socket.addEventListener("close", () => {
      // -----------------------------------------
      // try to restore connection, reauthorizaton
      // -----------------------------------------
    });
  }

  private handleUserAuthorizationStatus(
    data: SomeServerErrResponse | SomeServerResponse,
  ): void {
    if (data.type === "USER_LOGIN" && !this.authorizedUser) {
      this.authorizedUser = {
        login: data.payload.user.login,
        password: data.payload.user.password,
      };
      this.loadingWindow.hide();
    } else if (data.type === "USER_LOGOUT" && this.authorizedUser) {
      this.authorizedUser = null;
    }
  }

  private showAuthentificationErrorMessage(
    response: AuthentificationErrResponse,
  ) {
    this.loadingWindow.error(response.payload.error);
  }
}
