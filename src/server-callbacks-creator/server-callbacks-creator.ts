import { AppView } from "../view/app-view";
import { IndexPageView } from "../view/main-view/index-page-view/index-page-view";
import { Router, Pages } from "../router/router";
import {
  ServerErrCallback,
  SomeServerCallback,
} from "../connection/types/server-callbacks-types";
import { Connection } from "../connection/connection";
import { ResType } from "../connection/types/global-response-types";

export class ServerCallbacksCreator {
  private serverCallbacks: SomeServerCallback[];

  private serverErrCallbacks: ServerErrCallback[];

  private appView: AppView;

  private indexPageView: IndexPageView;

  private router: Router;

  private connection: Connection;

  constructor(
    serverCallbacks: SomeServerCallback[],
    serverErrCallbacks: ServerErrCallback[],
    appView: AppView,
    router: Router,
    connection: Connection,
  ) {
    this.serverCallbacks = serverCallbacks;
    this.serverErrCallbacks = serverErrCallbacks;
    this.appView = appView;
    this.indexPageView = appView.mainView.indexPageView;
    this.router = router;
    this.connection = connection;
    this.createCallbacks();
  }

  public createCallbacks(): void {
    this.createAuthorizationCallbacks();
    this.createExtendedUserAuthetificationCallbacks();
    this.gettingUserListCallback();
  }

  private createAuthorizationCallbacks(): void {
    this.serverCallbacks.push({
      type: ResType.login,
      callback: () => {
        this.router.navigate({ page: Pages.index });
      },
    });
  }

  private createExtendedUserAuthetificationCallbacks(): void {
    this.serverCallbacks.push(
      {
        type: ResType.externalLogin,
        callback: (userLogin: string) => {
          const userView = this.indexPageView.userSelectorView.userListView.findUser(userLogin);
          if (userView) {
            userView.setOnlineStatus();
          } else {
            this.indexPageView.userSelectorView.userListView.addUser(userLogin);
          }
        },
      },
      {
        type: ResType.externalLogout,
        callback: (userLogin: string) => {
          const userView = this.indexPageView.userSelectorView.userListView.findUser(userLogin);
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
        if (user.login === this.connection.authorizedUser?.login) {
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
