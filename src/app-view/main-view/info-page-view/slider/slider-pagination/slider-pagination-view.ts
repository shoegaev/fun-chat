import { View } from "../../../../../util/view";
import {
  ElementCreator,
  ElementParametrs,
} from "../../../../../util/element-creator";
import { SliderWindowView } from "../slider-window/slider-window-view";
import "./slider-pagination-style.scss";

export class SliderPaginationView extends View {
  private readonly leftButton: HTMLElement;

  private readonly rightButton: HTMLElement;

  private readonly numbersContainer: HTMLElement;

  private readonly sliderWindowView: SliderWindowView;

  private readonly numberButtons: HTMLElement[];

  private activeNumberButton: HTMLElement | null;

  constructor(cssClasses: string[], sliderWindoView: SliderWindowView) {
    const SLIDER_PAGINATION_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["pagination", ...cssClasses],
    };
    super(SLIDER_PAGINATION_PARAMS);
    this.sliderWindowView = sliderWindoView;
    this.numberButtons = [];
    this.activeNumberButton = null;
    [this.leftButton, this.numbersContainer, this.rightButton] =
      this.configureView();
    this.sideButtonsOnClick();
  }

  public addNumberButton(): void {
    const button = new ElementCreator({
      tag: "div",
      cssClasses: ["pagination__number-button", "pagination__button"],
      textContent: `${this.numberButtons.length + 1}`,
    });
    this.numbersContainer.append(button.getElement());
    this.numberButtons.push(button.getElement());
    const index = this.numberButtons.length - 1;
    button.getElement().addEventListener("click", () => {
      if (button.getElement() === this.activeNumberButton) {
        return;
      }
      this.goToSlide(index);
    });
  }

  public setButtonActiveClass(index: number): void {
    this.activeNumberButton?.classList.remove(
      "pagination__number-button_active",
    );
    this.activeNumberButton = this.numberButtons[index];
    this.numberButtons[index].classList.add("pagination__number-button_active");
  }

  private goToSlide(index: number) {
    this.sliderWindowView.goToSlide(index);
    this.setButtonActiveClass(index);
  }

  private sideButtonsOnClick(): void {
    const eventHandler = (event: Event): void => {
      if (!this.activeNumberButton) {
        return;
      }
      const isLeftButton = event.target === this.leftButton;
      const currentIndex = this.numberButtons.indexOf(this.activeNumberButton);
      let index = isLeftButton ? currentIndex - 1 : currentIndex + 1;
      if (currentIndex === 0 && isLeftButton) {
        index = this.numberButtons.length - 1;
      } else if (
        currentIndex === this.numberButtons.length - 1 &&
        !isLeftButton
      ) {
        index = 0;
      }
      this.goToSlide(index);
    };
    [this.leftButton, this.rightButton].forEach((button) => {
      button.addEventListener("click", eventHandler);
    });
  }

  private configureView(): HTMLElement[] {
    const leftButton = new ElementCreator({
      tag: "div",
      cssClasses: ["pagination__left-button", "pagination__button"],
      textContent: "<",
    });
    const numbersContainer = new ElementCreator({
      tag: "div",
      cssClasses: ["pagination__numbers-container"],
    });
    const rightButton = new ElementCreator({
      tag: "div",
      cssClasses: ["pagination__right-button", "pagination__button"],
      textContent: ">",
    });
    this.viewCreator.apendInnerElements(
      leftButton,
      numbersContainer,
      rightButton,
    );
    return [
      leftButton.getElement(),
      numbersContainer.getElement(),
      rightButton.getElement(),
    ];
  }
}
