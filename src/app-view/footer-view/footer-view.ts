import { View } from "../../util/view";
import { ElementParametrs } from "../../util/element-creator";
import "./footer-style.scss";

export class FooterView extends View {
  constructor() {
    const FOOTER_PARAMS: ElementParametrs = {
      tag: "footer",
      cssClasses: ["footer"],
    };
    super(FOOTER_PARAMS);
  }
}
