import { State } from "../state/state";
import { LoadingWindowView } from "./loading-window-view/loading-window-view";
const SERVER_URL = "ws://127.0.0.1:4000";

export class Connection {
  private state: State;

  private socket: WebSocket | null;

  private loadingWindow: LoadingWindowView;

  private attempt: number;

  constructor(state: State) {
    this.state = state;
    this.socket = null;
    this.loadingWindow = this.createLoadingWindow();
    this.attempt = 1;
  }

  private createLoadingWindow(): LoadingWindowView {
    const loadingWindow = new LoadingWindowView();
    document.body.append(loadingWindow.getHtmlElement());
    return loadingWindow;
  }

  public startConnection(): void {
    const socket = new WebSocket(SERVER_URL);
    if (this.attempt === 1) {
      this.loadingWindow.show();
    }
    socket.addEventListener("open", () => {
      this.attempt = 1;
      this.socket = socket;
      setTimeout(() => {
        this.loadingWindow.hide();
      }, 300);
    });
    socket.addEventListener("error", () => {
      setTimeout(() => {
        this.attempt += 1;
        if (this.attempt <= 6) {
          this.startConnection();
        } else {
          // some error handling logic
        }
      }, 500);
    });
  }
}
