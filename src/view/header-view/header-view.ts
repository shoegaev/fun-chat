import { View } from "../../util/view";
import { ElementParametrs } from "../../util/element-creator";
import { Pages, Router } from "../../router/router";
import { NavButtonView } from "./nav-button-view/nav-button-view";
import "./header-style.scss";

export class HeaderView extends View {
  private buttons: NavButtonView[];

  constructor(router: Router) {
    const HEADER_PARAMS: ElementParametrs = {
      tag: "header",
      cssClasses: ["header"],
    };
    super(HEADER_PARAMS);
    this.buttons = [];
    this.configureView(router);
  }

  private configureView(router: Router): void {
    this.addInnerElements([{ tag: "nav", cssClasses: ["navigation"] }]);
    const mainButton = new NavButtonView({
      page: Pages.index,
      cssClasses: ["navigation__button"],
      buttonText: "Main-page",
      callback: () => {
        router.navigate({ page: Pages.index });
      },
      buttons: this.buttons,
    });
    const infoButton = new NavButtonView({
      page: Pages.info,
      cssClasses: ["navigation__button"],
      buttonText: "Information",
      callback: () => {
        router.navigate({ page: Pages.info });
      },
      buttons: this.buttons,
    });
    [mainButton, infoButton].forEach((button) => {
      this.buttons.push(button);
      this.getHtmlElement()
        .querySelector("nav")
        ?.append(button.getHtmlElement());
    });
  }

  public setButtonSelectedStatus(page: Pages) {
    const buttonView = this.buttons.find((item) => item.params.page === page);
    buttonView?.setSelectedCLass();
  }

  public removeButtonsSelectedStatus(): void {
    this.buttons.forEach((button) => {
      button.removeSelectedStatus();
    });
  }
}
