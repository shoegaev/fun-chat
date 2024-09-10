import { View } from "../../util/view";
import { ElementCreator, ElementParametrs } from "../../util/element-creator";
import "./modal-window-style.scss";

type ButtonParams = {
  text: string;
  callback?: () => void;
  dontCloseOnClick?: boolean;
};

export type ModalWindowOpenParams = {
  text: string;
  leftButton: ButtonParams;
  rightButton: ButtonParams;
};

export class ModalWindowView extends View {
  private readonly content: HTMLElement;

  private readonly text: HTMLElement;

  private readonly leftButton: HTMLElement;

  private readonly rightButton: HTMLElement;

  private isWindowOpened: boolean;

  constructor() {
    const MODAL_WINDOW_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["modal-window"],
    };
    super(MODAL_WINDOW_PARAMS);
    [this.content, this.text, this.leftButton, this.rightButton] =
      this.configureView();
    this.isWindowOpened = false;
  }

  public openModalWindow(params: ModalWindowOpenParams) {
    if (this.isWindowOpened) {
      return;
    }
    this.isWindowOpened = true;
    this.text.textContent = params.text;
    this.leftButton.textContent = params.leftButton.text;
    this.rightButton.textContent = params.rightButton.text;
    const buttons = [this.leftButton, this.rightButton];

    const removeListeners = (handler: (event: Event) => void) => {
      buttons.forEach((button) => {
        button.removeEventListener("click", handler);
      });
    };

    const buttonEventHandler = (event: Event) => {
      const isLeftButton = event.target === this.leftButton;
      const callback =
        params[isLeftButton ? "leftButton" : "rightButton"].callback;
      const dontCloseOnClick =
        params[isLeftButton ? "leftButton" : "rightButton"].dontCloseOnClick;
      if (callback) {
        callback();
      }
      if (!dontCloseOnClick) {
        this.closeWindow();
      }
      removeListeners(buttonEventHandler);
    };

    const windowEventHandler = () => {
      this.closeWindow();
      removeListeners(buttonEventHandler);
      this.getHtmlElement().removeEventListener("click", windowEventHandler);
    };

    this.getHtmlElement().addEventListener("click", windowEventHandler);

    buttons.forEach((button) => {
      button.addEventListener("click", buttonEventHandler);
    });
    this.showModalWindow();
  }

  public closeWindow(): void {
    this.getHtmlElement().classList.add("modal-window_hidden");
    setTimeout(() => {
      this.getHtmlElement().remove();
      this.isWindowOpened = false;
    }, 200);
  }

  private showModalWindow(): void {
    document.body.append(this.getHtmlElement());
    setTimeout(() => {
      this.getHtmlElement().classList.remove("modal-window_hidden");
    }, 0);
  }

  private configureView(): HTMLElement[] {
    const content = new ElementCreator({
      tag: "div",
      cssClasses: ["modal-window__content"],
    });
    const text = new ElementCreator({
      tag: "div",
      cssClasses: ["modal-window__text"],
    });
    const buttonsContainer = new ElementCreator({
      tag: "div",
      cssClasses: ["modal-window__buttons"],
    });
    const leftButton = new ElementCreator({
      tag: "div",
      cssClasses: ["modal-window__button"],
    });
    const rightButton = new ElementCreator({
      tag: "div",
      cssClasses: ["modal-window__button"],
    });
    buttonsContainer.apendInnerElements(leftButton, rightButton);
    content.apendInnerElements(text, buttonsContainer);
    this.viewCreator.apendInnerElements(content);
    return [
      content.getElement(),
      text.getElement(),
      leftButton.getElement(),
      rightButton.getElement(),
    ];
  }
}
