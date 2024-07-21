import { View } from "../../../../../../util/view";
import {
  ElementCreator,
  ElementParametrs,
} from "../../../../../../util/element-creator";
import { Connection } from "../../../../../../connection/connection";
import "./message-style.scss";
import editIcon from "./edit-icon.svg";

export enum MessageStatus {
  sended = "Sended",
  delivered = "Delivered",
  readed = "Readed",
}

export interface MessageParams {
  incoming: boolean;
  datetime: number;
  status: MessageStatus;
  edited: boolean;
  text: string;
}

export class MessageView extends View {
  private readonly connection: Connection;

  private readonly params: MessageParams;

  private readonly status: HTMLElement;

  private readonly editedStatus: HTMLElement;

  private readonly editButton: HTMLElement;

  private readonly text: HTMLElement;

  constructor(
    cssClasses: string[],
    connection: Connection,
    params: MessageParams,
  ) {
    const MESSAGE_VIEW_PARAMS: ElementParametrs = {
      tag: "div",
      cssClasses: ["message", ...cssClasses],
    };
    if (params.incoming) {
      MESSAGE_VIEW_PARAMS.cssClasses.push("message_incoming");
    }
    super(MESSAGE_VIEW_PARAMS);
    this.connection = connection;
    this.params = params;
    [this.status, this.editedStatus, this.editButton, this.text] =
      this.configureView();
  }

  public setStatus(status: MessageStatus) {
    this.status.textContent = status;
  }

  private configureView(): HTMLElement[] {
    const userName = new ElementCreator({
      tag: "div",
      cssClasses: ["message__user-name"],
      textContent: this.params.incoming ? "other" : "you",
    });
    const messageContainer = new ElementCreator({
      tag: "div",
      cssClasses: ["message__message-container"],
    });
    const [header, status, editedStatus, editButton] = this.createHeader();
    const text = new ElementCreator({
      tag: "div",
      cssClasses: ["message__text"],
      textContent: this.params.text,
    });
    messageContainer.apendInnerElements(header, text);
    this.viewCreator.apendInnerElements(userName, messageContainer);
    return [
      status.getElement(),
      editedStatus.getElement(),
      editButton.getElement(),
      text.getElement(),
    ];
  }

  private createHeader(): ElementCreator[] {
    const header = new ElementCreator({
      tag: "div",
      cssClasses: ["message__header"],
    });
    const date = new ElementCreator({
      tag: "span",
      cssClasses: ["message__date"],
      textContent: new Date(this.params.datetime).toUTCString().slice(4, -7),
    });
    const status = new ElementCreator({
      tag: "span",
      cssClasses: ["message__status"],
      textContent: this.params.status,
    });
    const editedStatus = new ElementCreator({
      tag: "span",
      cssClasses: ["message__edited-status"],
      textContent: "Edited",
    });
    const editButton = new ElementCreator({
      tag: "div",
      cssClasses: ["message__edit-button"],
    });
    const editButtonIcon = new ElementCreator({
      tag: "img",
      cssClasses: ["message__edit-button-icon"],
      atributes: [{ name: "src", value: editIcon }],
    });
    editButton.apendInnerElements(editButtonIcon);
    header.apendInnerElements(date, status, editedStatus, editButton);
    return [header, status, editButton, editButton];
  }
}
