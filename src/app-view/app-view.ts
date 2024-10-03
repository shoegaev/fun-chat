import { ElementParametrs } from "../util/element-creator";
import { Connection } from "../connection/connection";
import { View } from "../util/view";
import { MainView } from "./main-view/main-view";
import { HeaderView } from "./header-view/header-view";
import { FooterView } from "./footer-view/footer-view";
import { ModalWindowView } from "./modal-window-view/modal-window-view";
import { Router } from "../router/router";
import { State } from "../state/state";

type InnerViews = [HeaderView, MainView, FooterView];

export class AppView extends View {
  public readonly mainView: MainView;

  public readonly headerView: HeaderView;

  public readonly footerView: FooterView;

  constructor(connection: Connection, router: Router, state: State) {
    const APP_CONTAINER_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["main-container"],
    };
    super(APP_CONTAINER_PARAMS);
    [this.headerView, this.mainView, this.footerView] = this.createInnerViews(
      connection,
      router,
      state
    );
  }

  private createInnerViews(connection: Connection, router: Router, state: State): InnerViews {
    const modalWindow = new ModalWindowView();
    const main = new MainView(connection, router, modalWindow);
    const header = new HeaderView(
      router,
      connection,
      main.indexPageView.userSelectorView,
      modalWindow,
      state
    );
    const footer = new FooterView();
    this.viewCreator.apendInnerElements(
      header.viewCreator,
      main.viewCreator,
      footer.viewCreator,
    );
    return [header, main, footer];
  }
}
