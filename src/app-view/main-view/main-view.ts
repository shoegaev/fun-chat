import { LoginPageView } from "./login-page-view/login-page-view";
import { View } from "../../util/view";
import { ElementParametrs } from "../../util/element-creator";
import { Connection } from "../../connection/connection";
import { IndexPageView } from "./index-page-view/index-page-view";
import { Pages, Router } from "../../router/router";
import { InfoPageView } from "./info-page-view/info-page-view";
import { NotFoundPageView } from "./not-found-page-view/not-found-page-view";
import { ModalWindowView } from "../modal-window-view/modal-window-view";
import "./main-style.scss";

type InnerViews = [
  LoginPageView,
  IndexPageView,
  InfoPageView,
  NotFoundPageView,
];

type PageParam = { page: Pages; view: View; authorizedOnly?: boolean };

export class MainView extends View {
  public readonly loginPageView: LoginPageView;

  public readonly indexPageView: IndexPageView;

  public readonly infoPageView: InfoPageView;

  public readonly notFoundPageView: NotFoundPageView;

  private pagesParams: PageParam[];

  constructor(
    connection: Connection,
    router: Router,
    modalWindow: ModalWindowView,
  ) {
    const MAIN_PARAMS: ElementParametrs = {
      tag: "main",
      cssClasses: ["content"],
    };
    super(MAIN_PARAMS);
    [
      this.loginPageView,
      this.indexPageView,
      this.infoPageView,
      this.notFoundPageView,
    ] = this.configureView(connection, router, modalWindow);
    this.pagesParams = this.getPagesArr();
  }

  private configureView(
    connection: Connection,
    router: Router,
    modalWindow: ModalWindowView,
  ): InnerViews {
    const loginPage = new LoginPageView(connection);
    const indexPage = new IndexPageView(connection, router, modalWindow);
    const infoPage = new InfoPageView();
    const notFoundPage = new NotFoundPageView();
    return [loginPage, indexPage, infoPage, notFoundPage];
  }

  private getPagesArr(): PageParam[] {
    return [
      { page: Pages.login, view: this.loginPageView },
      { page: Pages.index, view: this.indexPageView },
      { page: Pages.info, view: this.infoPageView },
      { page: Pages.notFound, view: this.notFoundPageView },
    ];
  }

  private removeContent(): void {
    Array.from(this.getHtmlElement().children).forEach((element) => {
      element.remove();
    });
  }

  public setPage(page: Pages): void {
    this.removeContent();
    const pageView = this.pagesParams.find((item) => item.page === page);
    if (pageView) {
      this.getHtmlElement().append(pageView?.view.getHtmlElement());
    }
  }
}
