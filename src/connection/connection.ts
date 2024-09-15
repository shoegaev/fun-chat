import { State } from "../state/state";
import { LoadingWindowView } from "../loading-window-view/loading-window-view";
import { Sender } from "./sender/sender";
import { Receiver } from "./receiver/receiver";
import { SomeServerResponse } from "./types/response-type";
import {
  SomeServerCallback,
  ServerErrCallback,
} from "./types/server-callbacks-types";
import { SomeServerErrResponse } from "./types/error-response-types";
const SERVER_URL = "ws://127.0.0.1:4000";

export class Connection {
  private state: State;

  private socketArr: WebSocket[];

  private loadingWindow: LoadingWindowView;

  private connectionAttempt: number;

  public sender: Sender;

  private receiver: Receiver;

  public authorizedUser: [{ login: string; password: string } | null];

  constructor(
    state: State,
    loadingWindowView: LoadingWindowView,
    serverCallbacks: SomeServerCallback[],
    serverErrCallbacks: ServerErrCallback[],
  ) {
    this.state = state;
    this.socketArr = [];
    this.loadingWindow = loadingWindowView;
    this.connectionAttempt = 1;
    this.authorizedUser = [null];
    this.sender = new Sender(
      this.socketArr,
      this.loadingWindow,
      this.authorizedUser,
    );
    this.receiver = new Receiver(
      this.socketArr,
      serverCallbacks,
      serverErrCallbacks,
    );
  }

  public isUserAuthorized(): boolean {
    return Boolean(this.authorizedUser[0]);
  }

  public startConnection(): void {
    const socket = new WebSocket(SERVER_URL);
    if (this.connectionAttempt === 1) {
      this.loadingWindow.show();
      this.loadingWindow.hideCloseButton();
    }
    socket.addEventListener("open", () => {
      this.connectionAttempt = 1;
      this.socketArr[0] = socket;
      this.configureSocket(socket);
      setTimeout(() => {
        this.loadingWindow.hide();
        this.loadingWindow.showCloseButton();
      }, 300);
    });
    socket.addEventListener("error", () => {
      setTimeout(() => {
        this.connectionAttempt += 1;
        if (this.connectionAttempt <= 6) {
          this.startConnection();
        } else {
          this.loadingWindow.error(
            "Failed to connect, check your connection and reload page",
          );
        }
      }, 500);
    });
  }

  private configureSocket(socket: WebSocket): void {
    socket.addEventListener("message", (event) => {
      const data: SomeServerErrResponse | SomeServerResponse = JSON.parse(
        event.data,
      );
      this.handleUserAuthorizationStatus(data);
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
    if (data.type === "USER_LOGIN" && !this.authorizedUser[0]) {
      this.authorizedUser[0] = {
        login: data.payload.user.login,
        password: data.id.split(" ")[2],
      };
    } else if (data.type === "USER_LOGOUT" && this.authorizedUser) {
      this.authorizedUser[0] = null;
    }
  }
}
