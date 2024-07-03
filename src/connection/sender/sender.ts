export class Sender {
  socketArr: WebSocket[];

  constructor(socketArr: WebSocket[]) {
    this.socketArr = socketArr;
  }

  private getSocket(): WebSocket {
    return this.socketArr[0];
  }

  public login(login: string, password: string): void {
    const request = {
      id: `login-${login}`,
      type: "USER_LOGIN",
      payload: {
        user: {
          login: login,
          password: password,
        },
      },
    };
    this.getSocket().send(JSON.stringify(request));
  }
}
