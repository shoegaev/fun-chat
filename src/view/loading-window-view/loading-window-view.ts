import { View } from "../../util/view";
import { ElementParametrs } from "../../util/element-creator";
import "./loading-window-style.scss";

export class LoadingWindowView extends View {
  constructor() {
    const LOADING_WINDOW_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["loading-window"],
    };
    super(LOADING_WINDOW_PARAMS);
    this.configureView();
  }

  private configureView(): void {
    const innerElementsParams = [
      {
        tag: "div",
        cssClasses: ["loading-window__content"],
      },
      {
        tag: "span",
        cssClasses: ["loading-window__heading"],
        textContent: "Loading...",
        target: ".loading-window__content",
      },
      {
        tag: "span",
        cssClasses: ["loading-window__message"],
        textContent: "please wait",
        target: ".loading-window__content",
      },
      {
        tag: "div",
        cssClasses: ["loading-window__loading-bar"],
        target: ".loading-window__content",
      },
    ];
    for (let i = 1; i <= 12; i += 1) {
      innerElementsParams.push(
        {
          tag: "div",
          cssClasses: ["loading-bar__stick"],
          target: ".loading-window__loading-bar",
        },
        {
          tag: "div",
          cssClasses: ["loading-bar__stick-visible"],
          target: `.loading-bar__stick:nth-child(${i})`,
        },
      );
    }
    this.addInnerElements(innerElementsParams);
  }

  public show(): void {
    this.getHtmlElement().classList.add("visible");
    document.body.style.overflow = "hidden";
  }

  public hide(): void {
    this.getHtmlElement().classList.remove("visible");
    document.body.style.overflow = "auto";
  }
}
