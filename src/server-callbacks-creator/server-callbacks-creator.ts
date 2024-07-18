import { AppView } from "../app-view/app-view";
import { IndexPageView } from "../app-view/main-view/index-page-view/index-page-view";
import { Router, Pages } from "../router/router";
import {
  ServerErrCallback,
  SomeServerCallback,
} from "../connection/types/server-callbacks-types";
import { LoginErrMessages } from "../connection/types/error-response-types";
import { Connection } from "../connection/connection";
import { LoadingWindowView } from "../loading-window-view/loading-window-view";
import { ResType } from "../connection/types/global-response-types";

export class ServerCallbacksCreator {
  private serverCallbacks: SomeServerCallback[];

  private serverErrCallbacks: ServerErrCallback[];

  private appView: AppView;

  private loadingWindowView: LoadingWindowView;

  private indexPageView: IndexPageView;

  private router: Router;

  private connection: Connection;

  constructor(
    serverCallbacks: SomeServerCallback[],
    serverErrCallbacks: ServerErrCallback[],
    appView: AppView,
    loadingWindowView: LoadingWindowView,
    router: Router,
    connection: Connection,
  ) {
    this.serverCallbacks = serverCallbacks;
    this.serverErrCallbacks = serverErrCallbacks;
    this.appView = appView;
    this.loadingWindowView = loadingWindowView;
    this.indexPageView = appView.mainView.indexPageView;
    this.router = router;
    this.connection = connection;
    this.createCallbacks();
  }

  public createCallbacks(): void {
    this.createAuthenticationCallbacks();
    this.createAuthenticationErrCallbacks();
    this.createExtendedUserAutheticationCallbacks();
    this.gettingUserListCallback();
  }

  private createAuthenticationCallbacks(): void {
    this.serverCallbacks.push(
      {
        type: ResType.login,
        callback: () => {
          this.loadingWindowView.hide();
          this.connection.sender.getUserList();
          this.router.navigate({ page: Pages.index });
        },
      },
      {
        type: ResType.logout,
        callback: () => {
          // -----------------
          // clear index page
          // -----------------
        },
      },
    );
  }

  private createAuthenticationErrCallbacks(): void {
    Object.values(LoginErrMessages).forEach((message) => {
      this.serverErrCallbacks.push({
        error: message,
        callback: () => {
          this.loadingWindowView.error(message);
        },
      });
    });
  }

  private createExtendedUserAutheticationCallbacks(): void {
    this.serverCallbacks.push(
      {
        type: ResType.externalLogin,
        callback: (userLogin: string) => {
          const userView =
            this.indexPageView.userSelectorView.userListView.findUser(
              userLogin,
            );
          if (userView) {
            userView.setOnlineStatus();
          } else {
            this.indexPageView.userSelectorView.userListView
              .addUser(userLogin)
              .setOnlineStatus();
          }
        },
      },
      {
        type: ResType.externalLogout,
        callback: (userLogin: string) => {
          const userView =
            this.indexPageView.userSelectorView.userListView.findUser(
              userLogin,
            );
          userView?.removeOnlineStatus();
        },
      },
    );
  }

  private gettingUserListCallback(): void {
    const userListView = this.indexPageView.userSelectorView.userListView;
    const userListCallback = (
      list: { login: string; isLogined: boolean }[],
    ): void => {
      list.forEach((user) => {
        if (user.login === this.connection.authorizedUser[0]?.login) {
          return;
        }
        const userView = userListView.addUser(user.login);
        if (user.isLogined) {
          userView.setOnlineStatus();
        }
      });
    };
    this.serverCallbacks.push(
      {
        type: ResType.activeUserList,
        callback: userListCallback,
      },
      {
        type: ResType.inactiveUserList,
        callback: userListCallback,
      },
    );
  }
}
