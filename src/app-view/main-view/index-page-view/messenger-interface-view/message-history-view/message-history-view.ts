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
import downIcon from "../../../../../../public/assets/icons/down-icon.svg";
import crosIcon from "../../../../../../public/assets/icons/cross-icon.svg";

type Message = { data: MessageData; view: MessageView };

export class MessageHistoryView extends View {
  private connection: Connection;

  public readonly login: string;

  private readonly closeButton: HTMLElement;

  private readonly list: HTMLElement;

  private readonly scrollButton: HTMLElement;

  private readonly scrollButtonText: HTMLElement;

  private readonly editModeCalback: (
    id: string,
    text?: string | undefined,
  ) => void;

  private unreadMessages: number;

  private newMessagesLine: HTMLElement | null;

  private readonly messages: Message[];

  constructor(
    cssCLasses: string[],
    login: string,
    connection: Connection,
    router: Router,
    editModeCalback: (id: string, text?: string | undefined) => void,
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
    [this.scrollButtonText, this.scrollButton, this.closeButton, this.list] =
      this.configureView();
    this.unreadMessages = 0;
    this.editModeCalback = editModeCalback;
    this.closeButton.addEventListener("click", () => {
      router.navigate({ page: Pages.index });
    });
    this.list.addEventListener("scroll", this.onListScroll.bind(this));
    this.scrollButton.addEventListener(
      "click",
      this.srollToTheBottom.bind(this),
    );
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
        id: data.id,
        editButtonCallback: this.editModeCalback,
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
        this.messages[i].view.params.status === MessageStatus.readed ||
        !this.messages[i].view.params.incoming
      ) {
        this.removeNewMessagesLine();
        if (i === this.messages.length - 1) {
          return;
        }
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

  public addUnreadMessages(messagesNumber?: number) {
    if (messagesNumber) {
      this.unreadMessages = messagesNumber;
      this.scrollButtonText.textContent = `${messagesNumber}`;
    } else {
      this.unreadMessages += 1;
      this.scrollButtonText.textContent = `${this.unreadMessages}`;
    }
    this.scrollButton.classList.add(
      "message-history__scroll-button_unread-message",
    );
  }

  public removeUnreadMessages(removeAll?: boolean): void {
    if (this.unreadMessages !== 0) {
      if (removeAll) {
        this.unreadMessages = 0;
      } else {
        this.unreadMessages -= 1;
      }
      if (this.unreadMessages === 0) {
        this.scrollButton.classList.remove(
          "message-history__scroll-button_unread-message",
        );
        this.scrollButtonText.textContent = "";
      }
    }
  }

  public deleteMessage(messageId: string): Message | undefined {
    const message = this.findMessage(messageId);
    if (message) {
      const index = this.messages.indexOf(message);
      this.messages.splice(index, 1);
      message.view.removeView();
      return message;
    }
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
    const closeButtonIcon = new ElementCreator({
      tag: "img",
      cssClasses: ["message-history__close-button-icon"],
      atributes: [{ name: "src", value: crosIcon }],
    });
    closeButton.apendInnerElements(closeButtonIcon);
    header.apendInnerElements(userLogin, closeButton);
    const messageList = new ElementCreator({
      tag: "div",
      cssClasses: ["message-history__list"],
    });
    const scrollButton = new ElementCreator({
      tag: "div",
      cssClasses: ["message-history__scroll-button"],
    });
    const scrollButtonText = new ElementCreator({
      tag: "span",
      cssClasses: ["message-history__scroll-button-text"],
    });
    const scrollButtonIcon = new ElementCreator({
      tag: "img",
      cssClasses: ["message-history__scroll-button-icon"],
      atributes: [{ name: "src", value: downIcon }],
    });
    scrollButton.apendInnerElements(scrollButtonText, scrollButtonIcon);
    this.viewCreator.apendInnerElements(scrollButton, header, messageList);
    return [
      scrollButtonText.getElement(),
      scrollButton.getElement(),
      closeButton.getElement(),
      messageList.getElement(),
    ];
  }

  public onListScroll(): void {
    if (this.newMessagesLine) {
      if (
        this.list.scrollHeight -
          (this.list.scrollTop + this.list.clientHeight) >=
        this.list.scrollHeight -
          this.newMessagesLine.offsetTop +
          this.list.clientHeight
      ) {
        this.scrollButton.classList.remove("hidden");
      } else {
        this.scrollButton.classList.add("hidden");
      }
      return;
    }
    if (
      this.list.scrollHeight - (this.list.scrollTop + this.list.clientHeight) >=
      this.list.clientHeight
    ) {
      this.scrollButton.classList.remove("hidden");
    } else {
      this.scrollButton.classList.add("hidden");
    }
  }
}
