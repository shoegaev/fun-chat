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

  private setPage(Page: Pages) {
    this.appView.mainView.setPage(Page);
    if (Page === Pages.login) {
      this.appView.headerView.setButtonSelectedStatus(Pages.index);
    } else if (Page === Pages.notFound) {
      this.appView.headerView.removeButtonsSelectedStatus();
    } else {
      this.appView.headerView.setButtonSelectedStatus(Page);
    }
  }

  private getRoutes(): Route[] {
    const routes: Route[] = [
      {
        page: Pages.index,
        callback: () => {
          if (this.connection.isUserAuthorized()) {
            this.setPage(Pages.index);
          } else {
            this.router.navigate({ page: Pages.login });
          }
        },
      },
      {
        page: Pages.login,
        callback: () => {
          this.setPage(Pages.login);
          // при переходе из index отправить запрос на сервер о выходе юзера из сети
        },
      },
      {
        page: Pages.info,
        callback: () => {
          this.setPage(Pages.info);
        },
      },
      {
        page: Pages.notFound,
        callback: () => {
          this.setPage(Pages.notFound);
        },
      },
    ];
    return routes;
  }
}
