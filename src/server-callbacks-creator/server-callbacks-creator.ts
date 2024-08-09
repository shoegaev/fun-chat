import { AppView } from "../app-view/app-view";
import { IndexPageView } from "../app-view/main-view/index-page-view/index-page-view";
import { UserListView } from "../app-view/main-view/index-page-view/user-selector-view/user-list-view/user-list-view";
import { Router, Pages } from "../router/router";
import {
  ServerErrCallback,
  SomeServerCallback,
} from "../connection/types/server-callbacks-types";
import { LoginErrMessages } from "../connection/types/error-response-types";
import { Connection } from "../connection/connection";
import { LoadingWindowView } from "../loading-window-view/loading-window-view";
import { ResType } from "../connection/types/global-response-types";
import { MessageData } from "../connection/types/message-data-type";
import { MessageStatus } from "../app-view/main-view/index-page-view/messenger-interface-view/message-history-view/message-view/message-view";
import { MessageHistoryView } from "../app-view/main-view/index-page-view/messenger-interface-view/message-history-view/message-history-view";

export class ServerCallbacksCreator {
  private readonly serverCallbacks: SomeServerCallback[];

  private readonly serverErrCallbacks: ServerErrCallback[];

  private readonly appView: AppView;

  private readonly loadingWindowView: LoadingWindowView;

  private readonly indexPageView: IndexPageView;

  private readonly userListView: UserListView;

  private readonly router: Router;

  private readonly connection: Connection;

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
    this.userListView =
      this.appView.mainView.indexPageView.userSelectorView.userListView;
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
    this.createGettingUserListCallback();
    this.createMessageCallbacks();
    this.createMessageStatusCallback();
  }

  private getCurrentMessageHistoriView(): MessageHistoryView | null {
    return this.indexPageView.messengerInterfaceView.getCurrentMessageHistoriView();
  }

  private createAuthenticationCallbacks(): void {
    this.serverCallbacks.push(
      {
        type: ResType.login,
        callback: () => {
          this.loadingWindowView.hide();
          this.appView.mainView.loginPageView.clearInputs();
          this.connection.sender.getUserList();
          this.router.navigate({ page: Pages.index });
        },
      },
      {
        type: ResType.logout,
        callback: () => {
          const userSelectorView = this.indexPageView.userSelectorView;
          userSelectorView.userListView.clearList();
          userSelectorView.userListView.removeAllFilters();
          userSelectorView.filtersView.unselectAllFilters();
          userSelectorView.filtersView.minimizeFilters();
          this.indexPageView.userSelectorView.searchLineView.clearInput();
          this.indexPageView.messengerInterfaceView.closeMessageHistory();
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

  private createGettingUserListCallback(): void {
    const userListView = this.indexPageView.userSelectorView.userListView;
    const userListCallback = (
      list: { login: string; isLogined: boolean }[],
    ): void => {
      list.forEach((user) => {
        if (user.login === this.connection.authorizedUser[0]?.login) {
          return;
        }
        const userView = userListView.addUser(user.login);
        this.connection.sender.getMessageHistory(user.login);
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

  // eslint-disable-next-line max-lines-per-function
  private createMessageCallbacks(): void {
    const messengerInterfaceView = this.indexPageView.messengerInterfaceView;
    const addMessageToList = (data: MessageData): void => {
      messengerInterfaceView.getCurrentMessageHistoriView()?.addMessage(data);
    };
    const isMessageHistoryOpen = (data: MessageData): boolean => {
      const currentOpenedLogin = this.getCurrentMessageHistoriView()?.login;
      return data.to === currentOpenedLogin || data.from === currentOpenedLogin;
    };
    const addNewMessagesLine = (): void => {
      messengerInterfaceView
        .getCurrentMessageHistoriView()
        ?.addNewMessagesLine();
    };
    this.serverCallbacks.push(
      {
        type: ResType.message,
        callback: (messageData) => {
          if (isMessageHistoryOpen(messageData)) {
            addMessageToList(messageData);
            addNewMessagesLine();
          }
          if (messageData.to === this.connection.authorizedUser[0]?.login) {
            this.userListView.findUser(messageData.from)?.addUnreadMessage();
          }
        },
      },
      {
        type: ResType.messageHistory,
        callback: (messageDataArr): void => {
          if (messageDataArr[0] && isMessageHistoryOpen(messageDataArr[0])) {
            messageDataArr.forEach((messageData) => {
              addMessageToList(messageData);
            });
            addNewMessagesLine();
          } else {
            let unreadMessages = 0;
            let userLogin;
            for (let i = messageDataArr.length - 1; i >= 0; i -= 1) {
              if (
                messageDataArr[i].from ===
                  this.connection.authorizedUser[0]?.login ||
                messageDataArr[i].status.isReaded
              ) {
                break;
              }
              if (!userLogin) {
                userLogin = messageDataArr[i].from;
              }
              unreadMessages += 1;
            }
            if (unreadMessages && userLogin) {
              this.userListView
                .findUser(userLogin)
                ?.addUnreadMessage(unreadMessages);
            }
          }
        },
      },
    );
  }

  private setMessageStatus(messageId: string, status: MessageStatus): void {
    const messageHistory = this.getCurrentMessageHistoriView();
    const message = messageHistory?.findMessage(messageId);
    message?.view.setStatus(status);
  }

  private createMessageStatusCallback(): void {
    this.serverCallbacks.push(
      {
        type: ResType.messageRead,
        callback: (messageId: string, login?: string) => {
          this.setMessageStatus(messageId, MessageStatus.readed);
          if (login) {
            
            this.userListView.findUser(login)?.removeUnreadMessages();
            console.log(login);
          }
        },
      },
      {
        type: ResType.messageDeliver,
        callback: (messageId: string) => {
          this.setMessageStatus(messageId, MessageStatus.delivered);
        },
      },
    );
  }
}
