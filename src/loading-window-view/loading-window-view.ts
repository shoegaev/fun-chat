import { View } from "../util/view";
import { ElementCreator, ElementParametrs } from "../util/element-creator";
import "./loading-window-style.scss";
import errorIcon from "../../public/assets/icons/error-icon.svg";

export class LoadingWindowView extends View {
  private defaultState: { heading: string; message: string };

  private readonly contentContainer: HTMLElement;

  private readonly heading: HTMLElement;

  private readonly message: HTMLElement;

  private readonly closeButton: HTMLElement;

  constructor() {
    const LOADING_WINDOW_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["loading-window"],
    };
    super(LOADING_WINDOW_PARAMS);
    this.defaultState = { heading: "Connecting...", message: "Please wait" };
    [this.contentContainer, this.heading, this.message, this.closeButton] =
      this.configureView();
    this.closeButtonOnClick();
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

  public hideCloseButton(): void {
    this.closeButton.remove();
  }

  public showCloseButton(): void {
    this.contentContainer.prepend(this.closeButton);
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

  private configureView(): HTMLElement[] {
    const container = new ElementCreator({
      tag: "div",
      cssClasses: ["loading-window__content"],
    });
    const closeButton = new ElementCreator({
      tag: "div",
      cssClasses: ["loading-window__close-button"],
    });
    for (let i = 0; i < 2; i++) {
      const closeButtonStick = new ElementCreator({
        tag: "div",
        cssClasses: ["close-button__stick"],
      });
      closeButton.apendInnerElements(closeButtonStick);
    }
    const heading = new ElementCreator({
      tag: "span",
      cssClasses: ["loading-window__heading"],
      textContent: this.defaultState.heading,
    });
    const text = new ElementCreator({
      tag: "span",
      cssClasses: ["loading-window__message"],
      textContent: this.defaultState.message,
    });
    const loadingBar = this.createLoadingBar();
    const errorIconEl = new ElementCreator({
      tag: "img",
      cssClasses: ["loading-window__error-icon"],
      atributes: [{ name: "src", value: errorIcon }],
    });
    container.apendInnerElements(
      closeButton,
      heading,
      text,
      loadingBar,
      errorIconEl,
    );
    this.viewCreator.apendInnerElements(container);
    return [
      container.getElement(),
      heading.getElement(),
      text.getElement(),
      closeButton.getElement(),
    ];
  }

  private createLoadingBar(): HTMLElement {
    const loadingBar = new ElementCreator({
      tag: "div",
      cssClasses: ["loading-window__loading-bar"],
    });
    for (let i = 1; i <= 12; i += 1) {
      const stick = new ElementCreator({
        tag: "div",
        cssClasses: ["loading-bar__stick"],
      });
      const stickVisible = new ElementCreator({
        tag: "div",
        cssClasses: ["loading-bar__stick-visible"],
      });
      stick.apendInnerElements(stickVisible);
      loadingBar.apendInnerElements(stick);
    }
    return loadingBar.getElement();
  }

  private closeButtonOnClick(): void {
    this.closeButton.addEventListener("click", () => {
      this.hide();
      setTimeout(() => {
        this.restoreDefaultState();
      }, 200);
    });
  }
}
