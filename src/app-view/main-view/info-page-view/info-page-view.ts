import { View } from "../../../util/view";
import { ElementParametrs } from "../../../util/element-creator";
import { SliderView } from "./slider/slider";
import "./info-page-style.scss";
import video1 from "../../../../public/assets/videos/1.mkv";

const SLIDES_INFO: { text: string; videoUrls: string[] }[] = [
  { text: "First slide text", videoUrls: [video1] },
  { text: "Second slide text", videoUrls: [video1] },
  { text: "Third slide text", videoUrls: [video1] },
];
export class InfoPageView extends View {
  private readonly sliderView: SliderView;

  constructor() {
    const INFO_PAGE_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["info-page"],
    };
    super(INFO_PAGE_PARAMS);
    [this.sliderView] = this.configureView();
    this.addSlides();
    this.sliderView.goToSlide(0);
  }

  private configureView(): [SliderView] {
    const slider = new SliderView(["info-page__slider"]);
    this.getHtmlElement().append(slider.getHtmlElement());
    return [slider];
  }

  private addSlides(): void {
    SLIDES_INFO.forEach((slide) => {
      this.sliderView.addSlide(slide.videoUrls, slide.text);
    });
  }
}
