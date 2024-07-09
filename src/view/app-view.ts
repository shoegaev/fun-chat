import { ElementParametrs } from "../util/element-creator";
import { Connection } from "../connection/connection";
import { View } from "../util/view";
import { MainView } from "./main-view/main-view";
import { HeaderView } from "./header-view/header-view";
import { Router } from "../router/router";

type InnerViews = [HeaderView, MainView];

export class AppView extends View {
  public mainView: MainView;

  public headerView: HeaderView;

  constructor(connection: Connection, router: Router) {
    const APP_CONTAINER_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["main-container"],
    };
    super(APP_CONTAINER_PARAMS);
    [this.headerView, this.mainView] = this.createInnerViews(
      connection,
      router,
    );
  }

  private createInnerViews(connection: Connection, router: Router): InnerViews {
    const header = new HeaderView(router);
    const main = new MainView(connection, router);
    const arr: InnerViews = [header, main];
    arr.forEach((view) => {
      this.getHtmlElement().append(view.getHtmlElement());
    });
    return arr;
  }
}
