import { LoginPageView } from "./login-page-view/login-page-view";
import { View } from "../../util/view";
import { ElementParametrs } from "../../util/element-creator";
import { Connection } from "../../connection/connection";
import { IndexPageView } from "./index-page-view/index-page-view";
import { Pages } from "../../router/router";
import { InfoPageView } from "./info-page-view/info-page-view";
import { NotFoundPageView } from "./not-found-page-view/not-found-page-view";

type InnerViews = [
  LoginPageView,
  IndexPageView,
  InfoPageView,
  NotFoundPageView,
];

type PagesArr = { page: Pages; view: View }[];

export class MainView extends View {
  private loginPageView: LoginPageView;

  private indexPageView: IndexPageView;

  private infoPageView: InfoPageView;

  private notFoundPageView: NotFoundPageView;

  private pagesArr: PagesArr;

  constructor(connection: Connection) {
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
    ] = this.configureView(connection);
    this.pagesArr = this.getPagesArr();
  }

  private configureView(connection: Connection): InnerViews {
    const loginPage = new LoginPageView(connection);
    const indexPage = new IndexPageView(connection);
    const infoPage = new InfoPageView();
    const notFoundPage = new NotFoundPageView();
    return [loginPage, indexPage, infoPage, notFoundPage];
  }

  private getPagesArr(): PagesArr {
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
    const pageView = this.pagesArr.find((item) => item.page === page);
    if (pageView) {
      this.getHtmlElement().append(pageView?.view.getHtmlElement());
    }
  }
}
