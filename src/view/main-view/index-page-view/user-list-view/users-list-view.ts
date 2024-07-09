import { View } from "../../../../util/view";
import {
  ElementCreator,
  ElementParametrs,
} from "../../../../util/element-creator";
import { Router, Pages } from "../../../../router/router";
import { UserView } from "./user-view/user-view";
import "./users-list-style.scss";

export class UsersListView extends View {
  private router: Router;

  private list: HTMLElement;

  private users: {
    selected: null | UserView;
    arr: UserView[];
  };

  constructor(cssClasses: string[], router: Router) {
    const USERS_LIST_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["users-list", ...cssClasses],
    };
    super(USERS_LIST_PARAMS);
    this.router = router;
    this.users = {
      selected: null,
      arr: [],
    };
    this.list = this.configureView();
    ["ivan", "igor", "konstantin"].forEach((str) => {
      this.addUser(str);
    });
  }

  public addUser(login: string) {
    const user = new UserView({
      users: this.users,
      login: login,
      cssClasses: ["users-list__user"],
      callback: () => {
        this.router.navigate({ page: Pages.index, resource: login });
      },
    });
    this.users.arr.push(user);
    this.list.append(user.getHtmlElement());
  }

  public findUser(login: string): UserView | undefined {
    return this.users.arr.find((userView) => userView.params.login === login);
  }

  private configureView(): HTMLElement {
    const searchLineLabel = new ElementCreator({
      tag: "label",
      cssClasses: ["users-list__search-line", "search-line"],
    });
    const searchLineInput = new ElementCreator({
      tag: "input",
      cssClasses: ["search-line__input"],
    });
    const searchLineIcon = new ElementCreator({
      tag: "img",
      cssClasses: ["search-line__magnifier-icon"],
    });
    searchLineLabel.apendInnerElements(searchLineInput, searchLineIcon);
    const list = new ElementCreator({
      tag: "div",
      cssClasses: ["users-list__list"],
    });
    this.getHtmlElement().append(
      searchLineLabel.getElement(),
      list.getElement(),
    );
    return list.getElement();
  }
}
