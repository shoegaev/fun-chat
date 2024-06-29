import { ElementParametrs } from "../util/element-creator";
import { LoginPageView } from "./login-page-view/login-page-view";
import { Connection } from "../connection/connection";
import { View } from "../util/view";

type InnerViews = [LoginPageView];

export class AppView extends View {
  private loginPageView: LoginPageView;

  constructor(connection: Connection) {
    const APP_CONTAINER_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["main-container"],
    };
    super(APP_CONTAINER_PARAMS);
    [this.loginPageView] = this.createInnerViews(connection);
  }

  private createInnerViews(connection: Connection): InnerViews {
    const loginPage = new LoginPageView(connection);
    const arr: InnerViews = [loginPage];
    arr.forEach((view) => {
      this.getHtmlElement().append(view.getHtmlElement());
    });
    return arr;
  }
}
