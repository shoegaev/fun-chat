import { AppView } from "../view/app-view";
import { Router, Pages } from "../router/router";
import { ServerCallback, ServerErrCallback } from "../connection/connection";
import { ResType } from "../connection/types/global-response-types";

export class ServerCallbacksCreator {
  private serverCallbacks: ServerCallback[];

  private serverErrCallbacks: ServerErrCallback[];

  private appView: AppView;

  private router: Router;

  constructor(
    serverCallbacks: ServerCallback[],
    serverErrCallbacks: ServerErrCallback[],
    appView: AppView,
    router: Router,
  ) {
    this.serverCallbacks = serverCallbacks;
    this.serverErrCallbacks = serverErrCallbacks;
    this.appView = appView;
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
}
