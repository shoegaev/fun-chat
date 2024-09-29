import { View } from "../../../../util/view";
import { ElementParametrs } from "../../../../util/element-creator";
import { SliderWindowView } from "./slider-window/slider-window-view";
import { SliderPaginationView } from "./slider-pagination/slider-pagination-view";
import "./slider-style.scss";

export class SliderView extends View {
  private readonly sliderWindowView: SliderWindowView;

  private readonly sliderPaginationView: SliderPaginationView;

  constructor(cssClasses: string[]) {
    const SLIDER_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["slider", ...cssClasses],
    };
    super(SLIDER_PARAMS);
    [this.sliderWindowView, this.sliderPaginationView] = this.configureView();
    this.goToSlide(0);
  }

  private configureView(): [SliderWindowView, SliderPaginationView] {
    const sliderWindow = new SliderWindowView(["slider__slider-window"]);
    const pagination = new SliderPaginationView(
      ["slider__pagination"],
      sliderWindow,
    );
    this.viewCreator.apendInnerElements(
      sliderWindow.viewCreator,
      pagination.viewCreator,
    );
    return [sliderWindow, pagination];
  }

  public addSlide(videoUrls: string[], text: string, index?: number): void {
    this.sliderWindowView.addSlide(videoUrls, text, index);
    this.sliderPaginationView.addNumberButton();
  }

  public goToSlide(index: number) {
    const isIndexValid = this.sliderWindowView.goToSlide(index);
    if (isIndexValid) {
      this.sliderWindowView.goToSlide(index);
      this.sliderPaginationView.setButtonActiveClass(index);
    }
  }
}
