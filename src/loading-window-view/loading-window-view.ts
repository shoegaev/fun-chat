import { View } from "../util/view";
import { ElementParametrs } from "../util/element-creator";
import "./loading-window-style.scss";

export class LoadingWindowView extends View {
  private defaultState: { heading: string; message: string };

  private heading: HTMLElement;

  private message: HTMLElement;

  constructor() {
    const LOADING_WINDOW_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["loading-window"],
    };
    super(LOADING_WINDOW_PARAMS);
    this.defaultState = { heading: "Connecting...", message: "Please wait" };
    this.configureView();
    [this.heading, this.message] = this.assignProperties();
  }

  private configureView(): void {
    const innerElementsParams: ElementParametrs[] = [
      {
        tag: "div",
        cssClasses: ["loading-window__content"],
      },
      {
        tag: "div",
        cssClasses: ["loading-window__close-button"],
        target: ".loading-window__content",
      },
      {
        tag: "div",
        cssClasses: ["close-button__stick"],
        target: ".loading-window__close-button",
        quantity: 2,
      },
      {
        tag: "span",
        cssClasses: ["loading-window__heading"],
        textContent: this.defaultState.heading,
        target: ".loading-window__content",
      },
      {
        tag: "span",
        cssClasses: ["loading-window__message"],
        textContent: this.defaultState.message,
        target: ".loading-window__content",
      },
    ];
    innerElementsParams.push(...this.createLoadingBarParams(), {
      tag: "div",
      cssClasses: ["loading-window__fail-icon"],
      textContent: "fail-icon",
      target: ".loading-window__content",
    });
    this.addInnerElements(innerElementsParams);
    this.closeButtonOnClick();
  }

  private createLoadingBarParams(): ElementParametrs[] {
    const loadingBarParams: ElementParametrs[] = [
      {
        tag: "div",
        cssClasses: ["loading-window__loading-bar"],
        target: ".loading-window__content",
      },
    ];
    for (let i = 1; i <= 12; i += 1) {
      loadingBarParams.push(
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
    return loadingBarParams;
  }

  private closeButtonOnClick(): void {
    const button = this.getHtmlElement().querySelector(
      ".loading-window__close-button",
    );
    button?.addEventListener("click", () => {
      this.hide();
      setTimeout(() => {
        this.restoreDefaultState();
      }, 200);
    });
  }

  private assignProperties(): HTMLElement[] {
    const heading = this.getHtmlElement().querySelector(
      ".loading-window__heading",
    );
    const message = this.getHtmlElement().querySelector(
      ".loading-window__message",
    );
    if (
      !(heading instanceof HTMLElement) ||
      !(message instanceof HTMLElement)
    ) {
      throw new Error();
    }
    return [heading, message];
  }

  public show(): void {
    this.getHtmlElement().classList.add("visible");
    document.body.style.overflow = "hidden";
  }

  public hide(): void {
    this.getHtmlElement().classList.remove("visible");
    document.body.style.overflow = "auto";
  }

  public error(errMessage: string) {
    this.setMessage(errMessage);
    this.stopLoading();
    this.heading.textContent = "Error";
  }

  public restoreDefaultState(): void {
    this.heading.textContent = this.defaultState.heading;
    this.message.textContent = this.defaultState.message;
    this.restoreLoadig();
  }

  private setMessage(errMessage: string): void {
    this.message.textContent = errMessage;
  }

  private stopLoading() {
    this.getHtmlElement().classList.add("loading-stoped");
  }

  private restoreLoadig() {
    this.getHtmlElement().classList.remove("loading-stoped");
  }
}
