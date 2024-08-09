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

type Message = { data: MessageData; view: MessageView };

export class MessageHistoryView extends View {
  private connection: Connection;

  public readonly login: string;

  private readonly closeButton: HTMLElement;

  private readonly list: HTMLElement;

  private newMessagesLine: HTMLElement | null;

  private readonly messages: Message[];

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
    this.login = login;
    this.messages = [];
    this.newMessagesLine = null;
    [this.closeButton, this.list] = this.configureView();
    this.closeButton.addEventListener("click", () => {
      router.navigate({ page: Pages.index });
    });
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

  public addNewMessagesLine(): void {
    const newMessagesLine = new ElementCreator({
      tag: "div",
      cssClasses: ["message-history__new-messages-line"],
      textContent: "New messages:",
    });
    for (let i = this.messages.length - 1; i >= 0; i -= 1) {
      if (
        this.messages[i].data.status.isReaded ||
        !this.messages[i].view.params.incoming
      ) {
        if (i === this.messages.length - 1) {
          return;
        }
        this.removeNewMessagesLine();
        this.messages[i].view
          .getHtmlElement()
          .after(newMessagesLine.getElement());
        this.newMessagesLine = newMessagesLine.getElement();
        return;
      }
    }
  }

  public removeNewMessagesLine(): void {
    this.newMessagesLine?.remove();
    this.newMessagesLine = null;
  }

  public changeMessagesReadedStatus(onMessageSend?: boolean): void {
    for (
      let i = onMessageSend
        ? this.messages.length - 2
        : this.messages.length - 1;
      i >= 0;
      i -= 1
    ) {
      const message = this.messages[i];
      if (message.data.status.isReaded || !message.view.params.incoming) {
        return;
      }
      this.connection.sender.changeReadStatus(
        message.data.from,
        message.data.id,
      );
    }
  }

  public findMessage(messageId: string): Message | undefined {
    return this.messages.find((message) => message.data.id === messageId);
  }

  public srollToTheBottom(): void {
    const newMessageLineY = this.newMessagesLine?.offsetTop;
    const listScrollHeight = this.list.scrollHeight;
    const listHeigth = this.list.clientHeight;
    if (newMessageLineY && listScrollHeight - newMessageLineY >= listHeigth) {
      this.list.scroll({ top: newMessageLineY, behavior: "smooth" });
    } else {
      this.list.scroll({
        top: listScrollHeight - listHeigth,
        behavior: "smooth",
      });
    }
  }

  public onMessageSend(): void {
    this.changeMessagesReadedStatus(true);
    this.removeNewMessagesLine();
    this.srollToTheBottom();
  }

  private configureView(): HTMLElement[] {
    const header = new ElementCreator({
      tag: "div",
      cssClasses: ["message-history__header"],
    });
    const userLogin = new ElementCreator({
      tag: "span",
      cssClasses: ["message-history__user-login"],
      textContent: this.login,
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
}
