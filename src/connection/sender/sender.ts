import { LoadingWindowView } from "../loading-window-view/loading-window-view";

export class Sender {
  private socketArr: WebSocket[];

  private loadingWindowView: LoadingWindowView;

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

  public getUserList(): void {
    const request1 = {
      id: "",
      type: "USER_ACTIVE",
      payload: null,
    };
    const request2 = {
      id: "",
      type: "USER_INACTIVE",
      payload: null,
    };
    this.getSocket().send(JSON.stringify(request1));
    this.getSocket().send(JSON.stringify(request2));
  }
}
