import { View } from "../../../../../util/view";
import {
  ElementParametrs,
  ElementCreator,
} from "../../../../../util/element-creator";
import "./user-style.scss";

export type Users = {
  selectedUser: null | UserView;
  userArr: UserView[];
  onlineUserArr: UserView[];
  unreadUserArr: UserView[];
};

export interface UserViewParams {
  users: Users;
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
    this.getHtmlElement().addEventListener("click", () => {
      if (!(this.params.users.selectedUser === this)) {
        params.callback();
      }
    });
  }

  public isUserHaveThisLogin(login: string) {
    return this.params.login === login;
  }

  public setSelectedStatus(): void {
    this.getHtmlElement().classList.add("user_selected");
    this.params.users.selectedUser?.removeSelectedStatus();
    this.params.users.selectedUser = this;
  }

  public removeSelectedStatus(): void {
    this.getHtmlElement().classList.remove("user_selected");
  }

  public setOnlineStatus(): void {
    this.getHtmlElement().classList.add("user_online");
    this.params.users.onlineUserArr.push(this);
  }

  public removeOnlineStatus(): void {
    const onlineUserArr = this.params.users.onlineUserArr;
    this.getHtmlElement().classList.remove("user_online");
    onlineUserArr.splice(onlineUserArr.indexOf(this), 1);
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
    return [status.getElement(), unreadMessages.getElement()];
  }
}
