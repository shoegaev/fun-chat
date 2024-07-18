import { View } from "../../../util/view";
import { ElementParametrs } from "../../../util/element-creator";

export class InfoPageView extends View {
  constructor() {
    const INFO_PAGE_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["info-page"],
      textContent: "INFO",
    };
    super(INFO_PAGE_PARAMS);
  }
}
