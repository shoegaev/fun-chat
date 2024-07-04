import { State } from "../state/state";
import { LoadingWindowView } from "./loading-window-view/loading-window-view";
import { Sender } from "./sender/sender";
import { Receiver } from "./receiver/receiver";
import { ServerMessage, ServerCallbacks } from "./types/connection-types";
const SERVER_URL = "ws://127.0.0.1:4000";

export class Connection {
  private state: State;

  private socketArr: WebSocket[];

  private loadingWindow: LoadingWindowView;

  private connectionAttempt: number;

  public sender: Sender;

  private receiver: Receiver;

  private authorizedUser: { login: string; password: string } | null;

  constructor(state: State, serverCallbacks: ServerCallbacks) {
    this.state = state;
    this.socketArr = [];
    this.loadingWindow = this.createLoadingWindow();
    this.connectionAttempt = 1;
    this.sender = new Sender(this.socketArr);
    this.receiver = new Receiver(this.socketArr, serverCallbacks);
    this.authorizedUser = null;
  }

  private createLoadingWindow(): LoadingWindowView {
    const loadingWindow = new LoadingWindowView();
    document.body.append(loadingWindow.getHtmlElement());
    return loadingWindow;
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

  private configureSocket(socket: WebSocket): void {
    socket.addEventListener("message", (event) => {
      const data: ServerMessage = JSON.parse(event.data);
      if (data.type === "USER_LOGIN") {
        this.authorizedUser = {
          login: data.payload.user.login,
          password: data.payload.user.password,
        };
      } else if (data.type === "USER_LOGOUT") {
        this.authorizedUser = null;
      }
      this.receiver.handleResponse(data);
    });
  }

  public isUserAuthorized(): boolean {
    return Boolean(this.authorizedUser);
  }
}
