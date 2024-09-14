import { View } from "../../../../../util/view";
import {
  ElementParametrs,
  ElementCreator,
} from "../../../../../util/element-creator";
import "./user-style.scss";
import envelopeIcon from "../../../../../../public/assets/icons/envelope_icon.svg";

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

  private unreadMessagesNumberElement: HTMLElement;

  private unreadMessagesNumber: number;

  constructor(params: UserViewParams) {
    const USER_VIEW_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["user", ...params.cssClasses],
    };
    super(USER_VIEW_PARAMS);
    this.params = params;
    this.unreadMessagesNumber = 0;
    [this.status, this.unreadMessagesNumberElement] = this.connfigureView(
      params.login,
    );
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
    this.params.users.selectedUser = null;
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

  public addUnreadMessage(quantity?: number): void {
    if (this.unreadMessagesNumber === 0) {
      this.getHtmlElement().classList.add("user_unread-messages");
    }
    if (quantity) {
      this.unreadMessagesNumber = quantity;
    } else {
      this.unreadMessagesNumber += 1;
    }
    if (this.unreadMessagesNumber < 100) {
      this.unreadMessagesNumberElement.textContent = `(${this.unreadMessagesNumber})`;
    } else {
      this.unreadMessagesNumberElement.textContent = "(99+)";
    }
  }

  public removeUnreadMessages(): void {
    if (this.unreadMessagesNumber !== 0) {
      this.unreadMessagesNumber = this.unreadMessagesNumber - 1;
    }
    if (this.unreadMessagesNumber === 0) {
      this.getHtmlElement().classList.remove("user_unread-messages");
    }
    if (this.unreadMessagesNumber < 100) {
      this.unreadMessagesNumberElement.textContent = `(${this.unreadMessagesNumber})`;
    } else {
      this.unreadMessagesNumberElement.textContent = "(99+)";
    }
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
    const unreadMessageStatus = new ElementCreator({
      tag: "div",
      cssClasses: ["user__unread-messages-container"],
    });
    const unreadMessageText = new ElementCreator({
      tag: "span",
      cssClasses: ["user__unread-messages-text"],
      textContent: "",
    });
    const unreadMessageIcon = new ElementCreator({
      tag: "img",
      cssClasses: ["user__unread-messages-icon"],
      atributes: [{ name: "src", value: envelopeIcon }],
    });
    unreadMessageStatus.apendInnerElements(
      unreadMessageText,
      unreadMessageIcon,
    );
    this.getHtmlElement().append(
      status.getElement(),
      loginText.getElement(),
      unreadMessageStatus.getElement(),
    );
    return [status.getElement(), unreadMessageText.getElement()];
  }
}
