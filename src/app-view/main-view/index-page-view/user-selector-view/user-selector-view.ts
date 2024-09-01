import { View } from "../../../../util/view";
import {
  ElementCreator,
  ElementParametrs,
} from "../../../../util/element-creator";
import { Router } from "../../../../router/router";
import { SearchLineView } from "./search-line-view/search-line";
import { UserListView } from "./user-list-view/user-list-view";
import { FiltersView } from "./filters-view/filters-view";
import "./user-selector-style.scss";

export class UserSelectorView extends View {
  public readonly userListView: UserListView;

  public readonly searchLineView: SearchLineView;

  public readonly filtersView: FiltersView;

  public readonly modalBackdrop: HTMLElement;

  private router: Router;

  constructor(cssClasses: string[], router: Router) {
    const USERS_LIST_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["user-selector", ...cssClasses],
    };
    super(USERS_LIST_PARAMS);
    this.router = router;

    [
      this.userListView,
      this.filtersView,
      this.searchLineView,
      this.modalBackdrop,
    ] = this.configureView();
    this.modalBackdrop.addEventListener("click", this.close.bind(this));
  }

  private configureView(): [
    UserListView,
    FiltersView,
    SearchLineView,
    HTMLElement,
    // eslint-disable-next-line indent
  ] {
    const content = new ElementCreator({
      tag: "div",
      cssClasses: ["user-selector__content"],
    });
    const userList = new UserListView(
      ["user-selector__user-list"],
      this.router,
      this.close.bind(this),
    );
    const searchLine = new SearchLineView(
      ["user-selector__search-line"],
      userList,
    );
    const filters = new FiltersView(["user-selector__filters"], userList);
    content.apendInnerElements(
      searchLine.getHtmlElement(),
      filters.getHtmlElement(),
      userList.getHtmlElement(),
    );
    const modalBackdrop = new ElementCreator({
      tag: "div",
      cssClasses: ["user-selector__modal-backdrop"],
    });
    this.viewCreator.apendInnerElements(content, modalBackdrop);
    return [userList, filters, searchLine, modalBackdrop.getElement()];
  }

  public isSelectorOpened(): boolean {
    return this.getHtmlElement().classList.contains("user-selector_open");
  }

  public close(): void {
    this.getHtmlElement().classList.remove("user-selector_open");
  }

  public open(): void {
    this.getHtmlElement().classList.add("user-selector_open");
  }
}
