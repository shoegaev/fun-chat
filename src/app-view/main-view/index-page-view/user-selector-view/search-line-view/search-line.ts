import { View } from "../../../../../util/view";
import {
  ElementCreator,
  ElementParametrs,
} from "../../../../../util/element-creator";
import "./search-line-style.scss";
import { UserListView } from "../user-list-view/user-list-view";
import magnifierIcon from "../../../../../../public/assets/icons/magnifying-glass.svg";
import crossIcon from "../../../../../../public/assets/icons/cross-icon-dark.svg";

export class SearchLineView extends View {
  private userListView: UserListView;

  private input: HTMLInputElement;

  private clearButton: HTMLElement;

  private searchButton: HTMLElement;

  constructor(cssClasses: string[], userListView: UserListView) {
    const SEARCH_LINE_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["search-line", ...cssClasses],
    };
    super(SEARCH_LINE_PARAMS);
    this.userListView = userListView;
    [this.input, this.clearButton, this.searchButton] = this.configureView();
    this.searchButtonOnClick();
    this.clearButtonOnClick();
  }

  public clearInput(): void {
    this.input.value = "";
  }

  private configureView(): [HTMLInputElement, HTMLElement, HTMLElement] {
    const searchLineInput = new ElementCreator({
      tag: "input",
      cssClasses: ["search-line__input"],
      atributes: [
        {
          name: "placeholder",
          value: "Find a user...",
        },
      ],
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
    const searchLineSearchButton = this.createSearchButton();
    this.viewCreator.apendInnerElements(
      searchLineInput,
      searchLineClearButton,
      searchLineSearchButton,
    );
    return [
      searchLineInput.getElement() as HTMLInputElement,
      searchLineClearButton.getElement(),
      searchLineSearchButton,
    ];
  }

  private createSearchButton(): HTMLElement {
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
    return searchLineSearchButton.getElement();
  }

  private searchButtonOnClick(): void {
    this.searchButton.addEventListener("click", () => {
      const text = this.input.value;
      this.userListView.filterByName(text);
    });
  }

  private clearButtonOnClick(): void {
    this.clearButton.addEventListener("click", () => {
      this.userListView.stopFilterByName();
      this.clearInput();
    });
  }
}
