import { View } from "../../../util/view";
import { ElementParametrs } from "../../../util/element-creator";

export class NotFoundPageView extends View {
  constructor() {
    const NOT_FOUND_PAGE_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["info-page"],
      textContent: "NotFound",
    };
    super(NOT_FOUND_PAGE_PARAMS);
  }
}
