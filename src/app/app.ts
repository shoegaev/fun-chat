import { Connection } from "../connection/connection";
import { Router, Route, Pages } from "../router/router";
import { State } from "../state/state";
import { AppView } from "../view/app-view";
export class App {
  private state: State;

  private connection: Connection;

  private appView: AppView;

  private router: Router;

  private serverCallbacks: { type: string; callback: () => void }[];

  constructor() {
    this.serverCallbacks = [];
    [this.state, this.connection, this.appView, this.router] =
      this.createComponents();
    this.setServerCallbacks();
  }

  public start() {
    this.connection.startConnection();
  }

  private createComponents(): [State, Connection, AppView, Router] {
    const state = new State();
    const connection = new Connection(state, this.serverCallbacks);
    const router = new Router(this.getRoutes());
    const view = new AppView(connection, router);
    document.body.append(view.getHtmlElement());
    return [state, connection, view, router];
  }

  private setServerCallbacks(): void {
    this.serverCallbacks.push({
      type: "USER_LOGIN",
      callback: () => {
        this.router.navigate({ page: Pages.index });
      },
    });
  }

  private getRoutes(): Route[] {
    const routes: Route[] = [
      {
        page: Pages.index,
        callback: () => {
          this.appView.mainView.setPage(Pages.index);
        },
      },
      {
        page: Pages.login,
        callback: () => {
          this.appView.mainView.setPage(Pages.login);
          // при переходе из index отправить запрос на сервер о выходе юзера из сети
        },
      },
      {
        page: Pages.info,
        callback: () => {
          this.appView.mainView.setPage(Pages.info);
        },
      },
      {
        page: Pages.notFound,
        callback: () => {
          this.appView.mainView.setPage(Pages.notFound);
        },
      },
    ];
    return routes;
  }
}
