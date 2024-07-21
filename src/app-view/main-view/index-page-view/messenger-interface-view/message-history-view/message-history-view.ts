import { View } from "../../../../../util/view";
import {
  ElementCreator,
  ElementParametrs,
} from "../../../../../util/element-creator";
import { Connection } from "../../../../../connection/connection";
import { Router, Pages } from "../../../../../router/router";
import { MessageView, MessageStatus } from "./message-view/message-view";
import { MessageData } from "../../../../../connection/types/message-data-type";
import "./message-history-style.scss";

export class MessageHistoryView extends View {
  private connection: Connection;

  private readonly closeButton: HTMLElement;

  private readonly list: HTMLElement;

  private readonly messages: { data: MessageData; view: MessageView }[];

  constructor(
    cssCLasses: string[],
    login: string,
    connection: Connection,
    router: Router,
  ) {
    const MESSAGE_HISTORY_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["message-history", ...cssCLasses],
    };
    super(MESSAGE_HISTORY_PARAMS);
    this.connection = connection;
    this.messages = [];
    [this.closeButton, this.list] = this.configureView(login);
    this.closeButton.addEventListener("click", () => {
      router.navigate({ page: Pages.index });
    });
  }

  private configureView(login: string): HTMLElement[] {
    const header = new ElementCreator({
      tag: "div",
      cssClasses: ["message-history__header"],
    });
    const userLogin = new ElementCreator({
      tag: "span",
      cssClasses: ["message-history__user-login"],
      textContent: login,
    });
    const closeButton = new ElementCreator({
      tag: "div",
      cssClasses: ["message-history__close-button"],
    });
    header.apendInnerElements(userLogin, closeButton);
    const messageList = new ElementCreator({
      tag: "div",
      cssClasses: ["message-history__list"],
    });
    this.viewCreator.apendInnerElements(header, messageList);
    return [closeButton.getElement(), messageList.getElement()];
  }

  public addMessage(data: MessageData): MessageView {
    let status: MessageStatus;
    if (!data.status.isDelivered) {
      status = MessageStatus.sended;
    } else if (data.status.isReaded) {
      status = MessageStatus.readed;
    } else {
      status = MessageStatus.delivered;
    }
    const message = new MessageView(
      ["message-history__message"],
      this.connection,
      {
        incoming: this.connection.authorizedUser[0]?.login === data.to,
        datetime: data.datetime,
        status: status,
        edited: data.status.isEdited,
        text: data.text,
      },
    );
    this.messages.push({ data: data, view: message });
    this.list.append(message.getHtmlElement());
    return message;
  }
}
