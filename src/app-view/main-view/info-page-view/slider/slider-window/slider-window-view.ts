import { View } from "../../../../../util/view";
import {
  ElementCreator,
  ElementParametrs,
} from "../../../../../util/element-creator";
import "./slider-window-style.scss";

type Slide = {
  container: HTMLElement;
  video: HTMLVideoElement;
  text: HTMLElement;
};

export class SliderWindowView extends View {
  private slides: Slide[];

  private activeSlide: Slide | null;

  constructor(cssClasses: string[]) {
    const SLIDER_WINDOW_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["slider-window", ...cssClasses],
    };
    super(SLIDER_WINDOW_PARAMS);
    this.slides = [];
    this.activeSlide = null;
  }

  public goToSlide(index: number): boolean {
    if (index < 0 || index > this.slides.length - 1) {
      return false;
    }
    this.activeSlide?.container.classList.add("slide_faded");
    const slide = this.slides[index];

    setTimeout(() => {
      this.activeSlide?.container.classList.add("slide_inactive");
      this.activeSlide?.container.remove();

      this.activeSlide = slide;
      this.getHtmlElement().append(slide.container);
      slide.container.classList.remove("slide_inactive");
      setTimeout(() => {
        slide.container.classList.remove("slide_faded");
      }, 0);
    }, 200);
    return true;
  }

  public addSlide(videoUrls: string[], text: string, index?: number): Slide {
    const slide = this.createSlide(videoUrls, text);
    if (index !== undefined && index <= this.slides.length - 1) {
      if (index <= 0) {
        this.slides.unshift(slide);
      } else {
        this.slides = this.slides.splice(index - 1, 0, slide);
      }
    }
    if (
      (index !== undefined && index > this.slides.length - 1) ||
      index === undefined
    ) {
      this.slides.push(slide);
    }
    return slide;
  }

  private createSlide(videoUrls: string[], text: string): Slide {
    const slide = new ElementCreator({
      tag: "div",
      cssClasses: ["slider-window__slide", "slide", "slide_faded"],
    });
    const video = new ElementCreator({
      tag: "video",
      cssClasses: ["slide__video"],
    });
    videoUrls.forEach((url) => {
      const source = new ElementCreator({
        tag: "source",
        cssClasses: ["slide__video-source"],
        atributes: [
          { name: "src", value: url },
          { name: "type", value: "video/mp4" },
        ],
      });
      video.apendInnerElements(source);
    });
    const slideText = new ElementCreator({
      tag: "p",
      cssClasses: ["slide__text"],
      textContent: text,
    });
    slide.apendInnerElements(video, slideText);
    return {
      container: slide.getElement(),
      video: video.getElement() as HTMLVideoElement,
      text: slideText.getElement(),
    };
  }
}
