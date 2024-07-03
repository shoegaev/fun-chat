import { View } from "../../util/view";
import { ElementParametrs } from "../../util/element-creator";
import { Pages, Router } from "../../router/router";
import { NavButtonView } from "./nav-button-view/nav-button-view";
import "./header-style.scss";

export class HeaderView extends View {
  constructor(router: Router) {
    const HEADER_PARAMS: ElementParametrs = {
      tag: "header",
      cssClasses: ["header"],
    };
    super(HEADER_PARAMS);
    this.configureView(router);
  }

  private configureView(router: Router): void {
    this.addInnerElements([{ tag: "nav", cssClasses: ["navigation"] }]);
    const buttons: HTMLElement[] = [];
    const mainButton = new NavButtonView({
      cssClasses: ["navigation__button"],
      buttonText: "Main-page",
      callback: () => {
        router.navigate({ page: Pages.index });
      },
      buttons: buttons,
    });
    const infoButton = new NavButtonView({
      cssClasses: ["navigation__button"],
      buttonText: "Information",
      callback: () => {
        router.navigate({ page: Pages.info });
      },
      buttons: buttons,
    });
    [mainButton, infoButton].forEach((button) => {
      buttons.push(button.getHtmlElement());
      this.getHtmlElement()
        .querySelector("nav")
        ?.append(button.getHtmlElement());
    });
  }
}
