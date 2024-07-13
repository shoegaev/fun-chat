import { View } from "../../../../util/view";
import { ElementParametrs } from "../../../../util/element-creator";
import { Router } from "../../../../router/router";
import { SearchLineView } from "./search-line-view/search-line";
import { UserListView } from "./user-list-view/user-list-view";
import { FiltersView } from "./filters-view/filters-view";
import "./user-selector-style.scss";

export class UserSelectorView extends View {
  public readonly userListView: UserListView;

  public readonly searchLineView: SearchLineView;

  public readonly filtersView: FiltersView;

  private router: Router;

  constructor(cssClasses: string[], router: Router) {
    const USERS_LIST_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["user-selector", ...cssClasses],
    };
    super(USERS_LIST_PARAMS);
    this.router = router;

    [this.userListView, this.filtersView, this.searchLineView] =
      this.configureView();
  }

  private configureView(): [UserListView, FiltersView, SearchLineView] {
    const userList = new UserListView(
      ["user-selector__user-list"],
      this.router,
    );
    const searchLine = new SearchLineView(
      ["user-selector__search-line"],
      userList,
    );
    const filters = new FiltersView(["user-selector__filters"], userList);
    this.getHtmlElement().append(
      searchLine.getHtmlElement(),
      filters.getHtmlElement(),
      userList.getHtmlElement(),
    );
    return [userList, filters, searchLine];
  }
}
