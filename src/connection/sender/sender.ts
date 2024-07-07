import { LoadingWindowView } from "../loading-window-view/loading-window-view";

export class Sender {
  socketArr: WebSocket[];

  loadingWindowView: LoadingWindowView;

  constructor(socketArr: WebSocket[], loaddingWindowView: LoadingWindowView) {
    this.socketArr = socketArr;
    this.loadingWindowView = loaddingWindowView;
  }

  private getSocket(): WebSocket {
    return this.socketArr[0];
  }

  public login(login: string, password: string): void {
    const request = {
      id: "login",
      type: "USER_LOGIN",
      payload: {
        user: {
          login: login,
          password: password,
        },
      },
    };
    this.getSocket().send(JSON.stringify(request));
    this.loadingWindowView.show();
  }
}
