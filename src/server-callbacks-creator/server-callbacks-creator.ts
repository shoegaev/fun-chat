import { AppView } from "../view/app-view";
import { IndexPageView } from "../view/main-view/index-page-view/index-page-view";
import { Router, Pages } from "../router/router";
import { ServerErrCallback, SomeServerCallback} from "../connection/types/server-callbacks-types";
import { ResType } from "../connection/types/global-response-types";

export class ServerCallbacksCreator {
  private serverCallbacks: SomeServerCallback[];

  private serverErrCallbacks: ServerErrCallback[];

  private appView: AppView;

  private indexPageView: IndexPageView;

  private router: Router;

  constructor(
    serverCallbacks: SomeServerCallback[],
    serverErrCallbacks: ServerErrCallback[],
    appView: AppView,
    router: Router,
  ) {
    this.serverCallbacks = serverCallbacks;
    this.serverErrCallbacks = serverErrCallbacks;
    this.appView = appView;
    this.indexPageView = appView.mainView.indexPageView;
    this.router = router;
    this.createCallbacks();
  }

  public createCallbacks(): void {
    this.createAuthorizationCallbacks();
  }

  private createAuthorizationCallbacks(): void {
    this.serverCallbacks.push({
      type: ResType.login,
      callback: () => {
        this.router.navigate({ page: Pages.index });
      },
    });
  }

  // private createUsersListCallbacks(): void {
  //   this.serverCallbacks.push({
  //     type: ResType.externalLogin,
  //     callback: (userLogin: string) => {
  //       // const userView = this.indexPageView.userListView.findUser();
  //     },
  //   });
  // }
}
