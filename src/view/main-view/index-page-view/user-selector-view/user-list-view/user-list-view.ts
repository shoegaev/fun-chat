import { View } from "../../../../../util/view";
import { ElementParametrs } from "../../../../../util/element-creator";
import { Router, Pages } from "../../../../../router/router";
import { UserView } from "../user-view/user-view";
import "./user-list-style.scss";

export class UserListView extends View {
  private users: {
    selectedUser: null | UserView;
    arr: UserView[];
  };

  router: Router;

  constructor(cssClasses: string[], router: Router) {
    const USER_LIST_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["user-list", ...cssClasses],
    };
    super(USER_LIST_PARAMS);
    this.router = router;
    this.users = {
      selectedUser: null,
      arr: [],
    };
  }

  public clearList(): void {
    this.getHtmlElement().innerHTML = "";
    this.users = {
      selectedUser: null,
      arr: [],
    };
  }

  public addUser(login: string): UserView {
    const user = new UserView({
      users: this.users,
      login: login,
      cssClasses: ["user-selector__user"],
      callback: () => {
        this.router.navigate({ page: Pages.index, resource: login });
      },
    });
    this.users.arr.push(user);
    this.getHtmlElement().append(user.getHtmlElement());
    return user;
  }

  public findUser(login: string): UserView | undefined {
    return this.users.arr.find((userView) => userView.params.login === login);
  }
}
