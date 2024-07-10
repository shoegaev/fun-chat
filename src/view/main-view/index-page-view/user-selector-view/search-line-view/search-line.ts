import { View } from "../../../../../util/view";
import {
  ElementCreator,
  ElementParametrs,
} from "../../../../../util/element-creator";
import "./search-line-style.scss";
import { UserListView } from "../user-list-view/user-list-view";
import magnifierIcon from "./assets/magnifying-glass.svg";
import crossIcon from "./assets/cross-icon.svg";

export class SearchLineView extends View {
  private userListView: UserListView;

  constructor(cssClasses: string[], userListView: UserListView) {
    const SEARCH_LINE_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["search-line", ...cssClasses],
    };
    super(SEARCH_LINE_PARAMS);
    this.userListView = userListView;
    this.configureView();
  }

  private configureView(): void {
    const searchLineInput = new ElementCreator({
      tag: "input",
      cssClasses: ["search-line__input"],
    });
    const searchLineClearButton = new ElementCreator({
      tag: "div",
      cssClasses: ["search-line__clear-button"],
    });
    const cross = new ElementCreator({
      tag: "img",
      cssClasses: ["search-line__cross-icon"],
      atributes: [
        {
          name: "src",
          value: crossIcon,
        },
      ],
    });
    searchLineClearButton.apendInnerElements(cross);
    const searchLineSearchButton = new ElementCreator({
      tag: "div",
      cssClasses: ["search-line__search-button"],
    });
    const searchLineMagnifierIcon = new ElementCreator({
      tag: "img",
      cssClasses: ["search-line__magnifier-icon"],
      atributes: [
        {
          name: "src",
          value: magnifierIcon,
        },
      ],
    });
    searchLineSearchButton.apendInnerElements(searchLineMagnifierIcon);
    this.getHtmlElement().append(
      searchLineInput.getElement(),
      searchLineClearButton.getElement(),
      searchLineSearchButton.getElement(),
    );
  }
}
