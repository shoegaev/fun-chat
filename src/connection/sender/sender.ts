import { LoadingWindowView } from "../../loading-window-view/loading-window-view";

export class Sender {
  private socketArr: WebSocket[];

  private loadingWindowView: LoadingWindowView;

  private authorizedUser: [{ login: string; password: string } | null];

  constructor(
    socketArr: WebSocket[],
    loaddingWindowView: LoadingWindowView,
    authorizedUser: [{ login: string; password: string } | null],
  ) {
    this.socketArr = socketArr;
    this.loadingWindowView = loaddingWindowView;
    this.authorizedUser = authorizedUser;
  }

  private getSocket(): WebSocket {
    return this.socketArr[0];
  }

  public login(login: string, password: string): void {
    const request = {
      id: `login ${login} ${password}`,
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

  public logaut(): void {
    if (!this.authorizedUser[0]) {
      throw new Error("there is no authorized user");
    }
    const request = {
      id: "logaut",
      type: "USER_LOGOUT",
      payload: {
        user: {
          login: this.authorizedUser[0].login,
          password: this.authorizedUser[0].password,
        },
      },
    };
    this.getSocket().send(JSON.stringify(request));
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
