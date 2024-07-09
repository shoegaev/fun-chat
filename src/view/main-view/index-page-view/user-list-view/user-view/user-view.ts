import { View } from "../../../../../util/view";
import {
  ElementParametrs,
  ElementCreator,
} from "../../../../../util/element-creator";
import "./user-style.scss";

export interface UserViewParams {
  users: {
    selected: null | UserView;
    arr: UserView[];
  };
  login: string;
  cssClasses: string[];
  callback: () => void;
}

export class UserView extends View {
  public params: UserViewParams;

  private status: HTMLElement;

  private unreadMessages: HTMLElement;

  constructor(params: UserViewParams) {
    const USER_VIEW_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["user", ...params.cssClasses],
    };
    super(USER_VIEW_PARAMS);
    this.params = params;
    [this.status, this.unreadMessages] = this.connfigureView(params.login);
  }

  public isUserHaveThisLogin(login: string) {
    return this.params.login === login;
  }

  public setSelectedStatus(): void {
    this.getHtmlElement().classList.add("user_selected");
  }

  public removeSelectedStatus(): void {
    this.getHtmlElement().classList.remove("user_selected");
  }

  private connfigureView(login: string): HTMLElement[] {
    const status = new ElementCreator({
      tag: "div",
      cssClasses: ["user__status", "user__status_online"],
    });
    const loginText = new ElementCreator({
      tag: "span",
      cssClasses: ["user__login"],
      textContent: login,
    });
    const unreadMessages = new ElementCreator({
      tag: "span",
      cssClasses: ["user__unread-messages"],
      textContent: "unread-messages",
    });
    this.getHtmlElement().append(
      status.getElement(),
      loginText.getElement(),
      unreadMessages.getElement(),
    );
    this.setOnClick();
    return [status.getElement(), unreadMessages.getElement()];
  }

  private setOnClick(): void {
    this.getHtmlElement().addEventListener("click", () => {
      if (this.params.users.selected === this) {
        return;
      }
      this.setSelectedStatus();
      this.params.users.selected?.removeSelectedStatus();
      this.params.users.selected = this;
    });
  }
}
