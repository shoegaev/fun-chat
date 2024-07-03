import { View } from "../../../util/view";
import { ElementParametrs } from "../../../util/element-creator";

export interface NavButtonParams {
  cssClasses: string[];
  buttonText: string;
  callback: () => void;
  buttons: HTMLElement[];
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

  private setSelectedCLass(): void {
    this.params.buttons.forEach((button) => {
      button.classList.remove("button_selected");
    });
    this.getHtmlElement().classList.add("button_selected");
  }
}
