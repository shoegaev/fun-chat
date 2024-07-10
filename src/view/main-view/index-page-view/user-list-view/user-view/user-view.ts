import { View } from "../../../../../util/view";
import {
  ElementParametrs,
  ElementCreator,
} from "../../../../../util/element-creator";
import "./user-style.scss";

export interface UserViewParams {
  users: {
    selectedUser: null | UserView;
    arr: UserView[];
  };
  login: string;
  cssClasses: string[];
  callback: () => void;
}

export class UserView extends View {
  public readonly params: UserViewParams;

  private status: HTMLElement;

  private unreadMessages: HTMLElement;

  private unreadMessagesNumber: number;

  constructor(params: UserViewParams) {
    const USER_VIEW_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["user", ...params.cssClasses],
    };
    super(USER_VIEW_PARAMS);
    this.params = params;
    this.unreadMessagesNumber = 0;
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

  public setOnlineStatus(): void {
    this.status.classList.add("user__status_online");
  }

  public removeOnlineStatus(): void {
    this.status.classList.remove("user__status_online");
  }

  public addUnreadMessage(): void {
    this.unreadMessagesNumber += 1;
    this.unreadMessages.textContent = `(${this.unreadMessagesNumber})`;
  }

  public removeUnreadMessages(): void {
    this.unreadMessages.textContent = "";
    this.unreadMessagesNumber = 0;
  }
  
  private connfigureView(login: string): HTMLElement[] {
    const status = new ElementCreator({
      tag: "div",
      cssClasses: ["user__status"],
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
      if (this.params.users.selectedUser === this) {
        return;
      }
      this.setSelectedStatus();
      this.params.users.selectedUser?.removeSelectedStatus();
      this.params.users.selectedUser = this;
    });
  }
}
