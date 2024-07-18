import { View } from "../../../util/view";
import { ElementParametrs } from "../../../util/element-creator";
import { Pages } from "../../../router/router";

export interface NavButtonParams {
  page: Pages;
  cssClasses: string[];
  buttonText: string;
  callback: () => void;
  buttons: NavButtonView[];
}

export class NavButtonView extends View {
  params: NavButtonParams;

  constructor(params: NavButtonParams) {
    const NAV_BUTTON_PARARMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["button", ...params.cssClasses],
    };
    super(NAV_BUTTON_PARARMS);
    this.params = params;
    this.connfigureView();
  }

  private connfigureView(): void {
    this.addInnerElements([
      {
        tag: "span",
        cssClasses: ["button__text"],
        textContent: this.params.buttonText,
      },
    ]);
    this.getHtmlElement().addEventListener("click", () => {
      this.setSelectedCLass();
      this.params.callback();
    });
  }

  public setSelectedCLass(): void {
    this.params.buttons.forEach((button) => {
      button.removeSelectedStatus();
    });
    this.getHtmlElement().classList.add("button_selected");
  }

  public removeSelectedStatus(): void {
    this.getHtmlElement().classList.remove("button_selected");
  }
}
