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

  public getMessageHistory(login: string): void {
    const request = {
      id: "",
      type: "MSG_FROM_USER",
      payload: {
        user: {
          login: login,
        },
      },
    };
    this.getSocket().send(JSON.stringify(request));
  }

  public sendMessage(login: string, text: string): void {
    const request = {
      id: "",
      type: "MSG_SEND",
      payload: {
        message: {
          to: login,
          text: text,
        },
      },
    };
    this.getSocket().send(JSON.stringify(request));
  }

  public changeReadStatus(login: string, messageId: string): void {
    const request = {
      id: login,
      type: "MSG_READ",
      payload: {
        message: {
          id: messageId,
        },
      },
    };
    this.getSocket().send(JSON.stringify(request));
  }

  public deleteMessage(messageId: string): void {
    const request = {
      id: "",
      type: "MSG_DELETE",
      payload: {
        message: {
          id: messageId,
        },
      },
    };
    this.getSocket().send(JSON.stringify(request));
  }

  public editMessage(id: string, text: string) {
    const request = {
      id: "",
      type: "MSG_EDIT",
      payload: {
        message: {
          id: id,
          text: text,
        },
      },
    };
    this.getSocket().send(JSON.stringify(request));
  }
}
