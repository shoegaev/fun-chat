import { Connection } from "../connection/connection";
import {
  ServerErrCallback,
  SomeServerCallback,
} from "../connection/types/server-callbacks-types";
import { Router, Route, Pages } from "../router/router";
import { State } from "../state/state";
import { AppView } from "../app-view/app-view";
import { ServerCallbacksCreator } from "../server-callbacks-creator/server-callbacks-creator";
import { LoadingWindowView } from "../loading-window-view/loading-window-view";

export class App {
  private state: State;

  private connection: Connection;

  private appView: AppView;

  private loadingWindowView: LoadingWindowView;

  private router: Router;

  private serverCallbacks: SomeServerCallback[];

  private serverErrCallbacks: ServerErrCallback[];

  constructor() {
    this.serverCallbacks = [];
    this.serverErrCallbacks = [];
    [
      this.state,
      this.connection,
      this.appView,
      this.loadingWindowView,
      this.router,
    ] = this.createComponents();
    const callbackCreator = new ServerCallbacksCreator(
      this.serverCallbacks,
      this.serverErrCallbacks,
      this.appView,
      this.loadingWindowView,
      this.router,
      this.connection,
    );
    callbackCreator.createCallbacks();
  }

  public start() {
    this.connection.startConnection();
  }

  private createComponents(): [
    State,
    Connection,
    AppView,
    LoadingWindowView,
    Router,
    // eslint-disable-next-line indent
  ] {
    const state = new State();
    const loadingWindowView = new LoadingWindowView();
    const connection = new Connection(
      state,
      loadingWindowView,
      this.serverCallbacks,
      this.serverErrCallbacks,
    );
    const router = new Router(this.getRoutes());
    const view = new AppView(connection, router);
    document.body.append(
      view.getHtmlElement(),
      loadingWindowView.getHtmlElement(),
    );
    return [state, connection, view, loadingWindowView, router];
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
      this.getIndexPageRoute(),
      {
        hasResource: false,
        page: Pages.login,
        callback: () => {
          this.setPage(Pages.login);
          if (this.connection.isUserAuthorized()) {
            this.connection.sender.logaut();
          }
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

  private getIndexPageRoute(): Route {
    const route: Route = {
      hasResource: true,
      page: Pages.index,
      callback: (resource) => {
        const indexPageView = this.appView.mainView.indexPageView;
        const userListView = indexPageView.userSelectorView.userListView;
        const messengerInterfaceView = indexPageView.messengerInterfaceView;
        if (!this.connection.isUserAuthorized()) {
          this.router.navigate({ page: Pages.login });
          return;
        }
        this.setPage(Pages.index);
        if (resource) {
          const userView = userListView.findUser(resource);
          if (userView) {
            messengerInterfaceView.openMessageHistory(resource);
            userView.setSelectedStatus();
          } else {
            this.router.navigate({ page: Pages.login });
          }
        } else {
          userListView.users.selectedUser?.removeSelectedStatus();
          messengerInterfaceView.closeMessageHistory();
          return;
        }
      },
    };
    return route;
  }
}
