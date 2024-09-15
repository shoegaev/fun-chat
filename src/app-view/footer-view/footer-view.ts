import { View } from "../../util/view";
import { ElementCreator, ElementParametrs } from "../../util/element-creator";
import "./footer-style.scss";
import rsIcon from "../../../public/assets/icons/rs_school.svg";
import githubIcon from "../../../public/assets/icons/github-logo.svg";

export class FooterView extends View {
  constructor() {
    const FOOTER_PARAMS: ElementParametrs = {
      tag: "footer",
      cssClasses: ["footer"],
    };
    super(FOOTER_PARAMS);
    this.configureView();
  }

  private configureView(): void {
    const rsSchoolLink = new ElementCreator({
      tag: "a",
      cssClasses: ["footer__rs-school-link"],
      atributes: [
        { name: "href", value: "https://rs.school/courses/javascript-ru" },
      ],
    });
    const rsIconEl = new ElementCreator({
      tag: "img",
      cssClasses: ["footer__rs-school-icon"],
      atributes: [{ name: "src", value: rsIcon }],
    });
    rsSchoolLink.apendInnerElements(rsIconEl);
    const year = new ElementCreator({
      tag: "span",
      cssClasses: ["footer__year"],
      textContent: "2024",
    });
    const githubLink = new ElementCreator({
      tag: "a",
      cssClasses: ["footer__github-link"],
      atributes: [{ name: "href", value: "https://github.com/shoegaev" }],
    });
    const githubIconEl = new ElementCreator({
      tag: "img",
      cssClasses: ["footer__rs-school-icon"],
      atributes: [{ name: "src", value: githubIcon }],
    });
    githubLink.apendInnerElements(githubIconEl);

    this.viewCreator.apendInnerElements(rsSchoolLink, year, githubLink);
  }
}
