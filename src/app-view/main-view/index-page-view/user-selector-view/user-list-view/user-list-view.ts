import { View } from "../../../../../util/view";
import { ElementParametrs } from "../../../../../util/element-creator";
import { Router, Pages } from "../../../../../router/router";
import { UserView, Users } from "../user-view/user-view";
import "./user-list-style.scss";

export class UserListView extends View {
  public users: Users;

  private router: Router;

  constructor(cssClasses: string[], router: Router) {
    const USER_LIST_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["user-list", ...cssClasses],
    };
    super(USER_LIST_PARAMS);
    this.router = router;
    this.users = {
      selectedUser: null,
      userArr: [],
      onlineUserArr: [],
      unreadUserArr: [],
    };
  }

  public clearList(): void {
    this.getHtmlElement().innerHTML = "";
    this.users = {
      selectedUser: null,
      userArr: [],
      onlineUserArr: [],
      unreadUserArr: [],
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
    this.users.userArr.push(user);
    this.getHtmlElement().append(user.getHtmlElement());
    return user;
  }

  public selectUser(login: string): void {
    const userView = this.findUser(login);
    userView?.setSelectedStatus();
  }

  public findUser(login: string): UserView | undefined {
    return this.users.userArr.find(
      (userView) => userView.params.login === login,
    );
  }

  public removeAllFilters(): void {
    this.stopFilterByStatus();
    this.stopFilterByName();
  }

  public filterByStatus() {
    this.getHtmlElement().classList.add("user-list_online-filter");
  }

  public stopFilterByStatus() {
    this.getHtmlElement().classList.remove("user-list_online-filter");
  }

  public filterByName(text: string): void {
    this.users.userArr.forEach((user) => {
      if (
        user.params.login.slice(0, text.length).toLowerCase() !==
        text.toLowerCase()
      ) {
        user.getHtmlElement().classList.add("user_filtered-by-name");
      } else {
        user.getHtmlElement().classList.remove("user_filtered-by-name");
      }
    });
  }

  public stopFilterByName(): void {
    this.users.userArr.forEach((user) => {
      user.getHtmlElement().classList.remove("user_filtered-by-name");
    });
  }
}
