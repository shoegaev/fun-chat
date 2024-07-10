import { Connection } from "../connection/connection";
import {
  ServerErrCallback,
  SomeServerCallback,
} from "../connection/types/server-callbacks-types";
import { Router, Route, Pages } from "../router/router";
import { State } from "../state/state";
import { AppView } from "../view/app-view";
import { ServerCallbacksCreator } from "../server-callbacks-creator/server-callbacks-creator";

export class App {
  private state: State;

  private connection: Connection;

  private appView: AppView;

  private router: Router;

  private serverCallbacks: SomeServerCallback[];

  private serverErrCallbacks: ServerErrCallback[];

  constructor() {
    this.serverCallbacks = [];
    this.serverErrCallbacks = [];
    [this.state, this.connection, this.appView, this.router] =
      this.createComponents();
    const callbackCreator = new ServerCallbacksCreator(
      this.serverCallbacks,
      this.serverErrCallbacks,
      this.appView,
      this.router,
      this.connection,
    );
    callbackCreator.createCallbacks();
  }

  public start() {
    this.connection.startConnection();
  }

  private createComponents(): [State, Connection, AppView, Router] {
    const state = new State();
    const connection = new Connection(
      state,
      this.serverCallbacks,
      this.serverErrCallbacks,
    );
    const router = new Router(this.getRoutes());
    const view = new AppView(connection, router);
    document.body.append(view.getHtmlElement());
    return [state, connection, view, router];
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
        hasResource: true,
        page: Pages.index,
        callback: () => {
          if (!this.connection.isUserAuthorized()) {
            this.router.navigate({ page: Pages.login });
            return;
          }
          this.setPage(Pages.index);
          this.connection.sender.getUserList();
        },
      },
      {
        hasResource: false,
        page: Pages.login,
        callback: () => {
          this.setPage(Pages.login);
          // при переходе из index отправить запрос на сервер о выходе юзера из сети
        },
      },
      {
        hasResource: false,
        page: Pages.info,
        callback: () => {
          this.setPage(Pages.info);
        },
      },
      {
        hasResource: false,
        page: Pages.notFound,
        callback: () => {
          this.setPage(Pages.notFound);
        },
      },
    ];
    return routes;
  }
}
